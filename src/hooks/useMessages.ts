import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_profile?: {
    name: string;
    avatar_url: string | null;
  };
}

export const useMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    if (!user) {
      setMessages([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
      setUnreadCount(data.filter(m => !m.is_read).length);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime messages
    if (user) {
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (!error) {
      setMessages(prev =>
        prev.map(m => (m.id === messageId ? { ...m, is_read: true } : m))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const deleteMessage = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (!error) {
      const message = messages.find(m => m.id === messageId);
      if (message && !message.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
  };

  return {
    messages,
    unreadCount,
    isLoading,
    markAsRead,
    deleteMessage,
    refetch: fetchMessages,
  };
};
