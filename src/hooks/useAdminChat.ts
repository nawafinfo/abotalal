import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  media_url?: string | null;
  media_type?: string | null;
  file_name?: string | null;
}

interface ChatUser {
  user_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  lastMessage?: string;
  unreadCount: number;
}

export const useAdminChat = () => {
  const { user } = useAuth();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChatUsers = async () => {
    if (!user) return;

    // Get all messages involving admin
    const { data: allMessages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !allMessages) {
      setIsLoading(false);
      return;
    }

    // Get unique user IDs from messages
    const userIds = new Set<string>();
    allMessages.forEach(m => {
      if (m.sender_id !== user.id) userIds.add(m.sender_id);
      if (m.receiver_id !== user.id) userIds.add(m.receiver_id);
    });

    // Fetch profiles for these users
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('user_id', Array.from(userIds));

    const chatUserList: ChatUser[] = Array.from(userIds).map(uid => {
      const profile = profiles?.find(p => p.user_id === uid);
      const userMessages = allMessages.filter(m => m.sender_id === uid || m.receiver_id === uid);
      const unread = allMessages.filter(m => m.sender_id === uid && m.receiver_id === user.id && !m.is_read).length;

      return {
        user_id: uid,
        name: profile?.name || 'مستخدم',
        email: profile?.email || null,
        avatar_url: profile?.avatar_url || null,
        lastMessage: userMessages[0]?.content,
        unreadCount: unread,
      };
    });

    setChatUsers(chatUserList);
    setIsLoading(false);
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
      // Mark unread messages as read
      const unreadIds = data.filter(m => m.receiver_id === user.id && !m.is_read).map(m => m.id);
      if (unreadIds.length > 0) {
        await supabase.from('messages').update({ is_read: true }).in('id', unreadIds);
      }
    }
  };

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        subject: 'رسالة',
        content,
      })
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, data]);
    }
    return { data, error };
  };

  useEffect(() => {
    fetchChatUsers();

    if (user) {
      const channel = supabase
        .channel('admin-chat')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
          fetchChatUsers();
          if (selectedUserId) fetchMessages(selectedUserId);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  return {
    chatUsers,
    messages,
    selectedUserId,
    setSelectedUserId,
    sendMessage,
    isLoading,
    refetch: fetchChatUsers,
  };
};
