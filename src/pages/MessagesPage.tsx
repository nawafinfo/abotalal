import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, ArrowRight, Paperclip, Image as ImageIcon, FileText, X, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { uploadToBucket } from '@/lib/uploadFile';
import BottomNav from '@/components/BottomNav';

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  subject: string;
  is_read: boolean;
  created_at: string;
  media_url?: string | null;
  media_type?: string | null;
  file_name?: string | null;
}

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data } = await supabase.from('user_roles').select('user_id').eq('role', 'admin').limit(1).single();
      if (data) setAdminId(data.user_id);
    };
    fetchAdmin();
  }, []);

  const fetchMessages = async () => {
    if (!user || !adminId) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${adminId}),and(sender_id.eq.${adminId},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data as ChatMessage[]);
      const unread = data.filter((m: any) => m.sender_id === adminId && !m.is_read).map((m: any) => m.id);
      if (unread.length > 0) await supabase.from('messages').update({ is_read: true }).in('id', unread);
    }
    setIsLoading(false);
  };

  useEffect(() => { if (adminId) fetchMessages(); }, [adminId, user]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (!user || !adminId) return;
    const channel = supabase.channel('user-chat-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchMessages())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, adminId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !adminId) return;
    setIsSending(true);
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id, receiver_id: adminId, subject: 'رسالة', content: newMessage.trim(),
    });
    if (error) toast({ title: 'خطأ', description: 'فشل إرسال الرسالة', variant: 'destructive' });
    else setNewMessage('');
    setIsSending(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !adminId) return;
    setIsUploading(true);

    const { url: publicUrl, error: uploadError } = await uploadToBucket('chat-media', file, user.id);

    if (uploadError || !publicUrl) {
      toast({ title: 'خطأ', description: uploadError || 'فشل رفع الملف', variant: 'destructive' });
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    let mediaType = 'file';
    if (file.type.startsWith('image/')) mediaType = 'image';
    else if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';

    await supabase.from('messages').insert({
      sender_id: user.id, receiver_id: adminId, subject: 'ملف',
      content: file.name, media_url: publicUrl, media_type: mediaType, file_name: file.name,
    });

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderMedia = (msg: ChatMessage) => {
    if (!msg.media_url) return null;
    if (msg.media_type === 'image') {
      return (
        <img src={msg.media_url} alt={msg.file_name || ''} className="max-w-[200px] rounded-lg mt-1 cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setPreviewMedia(msg.media_url!)} />
      );
    }
    if (msg.media_type === 'video') {
      return <video src={msg.media_url} controls className="max-w-[240px] rounded-lg mt-1" />;
    }
    if (msg.media_type === 'audio') {
      return <audio src={msg.media_url} controls className="mt-1 max-w-[240px]" />;
    }
    return (
      <a href={msg.media_url} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-2 mt-1 p-2 bg-background/30 rounded-lg hover:bg-background/50 transition-colors">
        <FileText className="w-4 h-4" />
        <span className="text-xs truncate flex-1">{msg.file_name}</span>
        <Download className="w-3 h-3" />
      </a>
    );
  };

  const isMe = (msg: ChatMessage) => msg.sender_id === user?.id;

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowRight className="w-5 h-5" /></Button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">مراسلة الإدارة</h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <p className="text-xs text-emerald-500">متصل</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-36">
        {isLoading ? (
          <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">ابدأ محادثة مع الإدارة</p>
            <p className="text-sm text-muted-foreground mt-1">أرسل رسالتك وسنرد عليك في أقرب وقت</p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe(msg) ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                isMe(msg) ? 'bg-primary text-primary-foreground rounded-bl-sm' : 'bg-secondary text-foreground rounded-br-sm'
              }`}>
                {!msg.media_url && <p className="text-sm leading-relaxed">{msg.content}</p>}
                {renderMedia(msg)}
                <div className="flex items-center gap-1 mt-1">
                  <p className={`text-[10px] ${isMe(msg) ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ar })}
                  </p>
                  {isMe(msg) && msg.is_read && <span className="text-[10px] text-primary-foreground/60">✓✓</span>}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Media Preview */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPreviewMedia(null)}>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={() => setPreviewMedia(null)}>
            <X className="w-6 h-6" />
          </Button>
          <img src={previewMedia} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border p-3 z-30">
        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" onChange={handleFileUpload} />
          <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={isUploading ? 'جاري الرفع...' : 'اكتب رسالتك...'}
            className="flex-1 rounded-full bg-secondary border-0" dir="rtl" disabled={isUploading} />
          <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={!newMessage.trim() || isSending || isUploading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      <BottomNav />
    </div>
  );
};

export default MessagesPage;
