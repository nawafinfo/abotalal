import { uploadToBucket } from '@/lib/uploadFile';
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, ArrowRight, Paperclip, Image as ImageIcon, FileText, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAdminChat } from '@/hooks/useAdminChat';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

const AdminChatPanel: React.FC = () => {
  const { user } = useAuth();
  const { chatUsers, messages, selectedUserId, setSelectedUserId, sendMessage, isLoading } = useAdminChat();
  const [newMessage, setNewMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUserId) return;
    await sendMessage(selectedUserId, newMessage.trim());
    setNewMessage('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedUserId) return;
    setIsUploading(true);
    const { url: publicUrl, error: uploadError } = await uploadToBucket('chat-media', file, user.id);
    if (uploadError || !publicUrl) {
      toast({ title: 'خطأ', description: uploadError || 'فشل رفع الملف', variant: 'destructive' });
      setIsUploading(false);
      e.target.value = '';
      return;
    }
    let mediaType = 'file';
    if (file.type.startsWith('image/')) mediaType = 'image';
    else if (file.type.startsWith('video/')) mediaType = 'video';
    else if (file.type.startsWith('audio/')) mediaType = 'audio';

    await supabase.from('messages').insert({
      sender_id: user.id, receiver_id: selectedUserId, subject: 'ملف',
      content: file.name, media_url: publicUrl, media_type: mediaType, file_name: file.name,
    });
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderMedia = (msg: any) => {
    if (!msg.media_url) return null;
    if (msg.media_type === 'image') {
      return <img src={msg.media_url} alt="" className="max-w-[200px] rounded-lg mt-1 cursor-pointer" onClick={() => setPreviewMedia(msg.media_url)} />;
    }
    if (msg.media_type === 'video') return <video src={msg.media_url} controls className="max-w-[200px] rounded-lg mt-1" />;
    if (msg.media_type === 'audio') return <audio src={msg.media_url} controls className="mt-1 max-w-[200px]" />;
    return (
      <a href={msg.media_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-1 p-2 bg-background/30 rounded-lg">
        <FileText className="w-4 h-4" /><span className="text-xs truncate">{msg.file_name}</span><Download className="w-3 h-3" />
      </a>
    );
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!selectedUserId) {
    return (
      <div className="space-y-4">
        {chatUsers.length === 0 ? (
          <Card><CardContent className="py-12 text-center"><MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" /><p className="text-muted-foreground">لا توجد محادثات حالياً</p></CardContent></Card>
        ) : chatUsers.map(chatUser => (
          <Card key={chatUser.user_id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedUserId(chatUser.user_id)}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10"><AvatarImage src={chatUser.avatar_url || undefined} /><AvatarFallback>{chatUser.name?.charAt(0) || 'م'}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{chatUser.name}</h3>
                    {chatUser.unreadCount > 0 && <Badge variant="destructive" className="text-xs">{chatUser.unreadCount}</Badge>}
                  </div>
                  {chatUser.lastMessage && <p className="text-sm text-muted-foreground truncate">{chatUser.lastMessage}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const selectedUser = chatUsers.find(u => u.user_id === selectedUserId);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSelectedUserId(null)}><ArrowRight className="w-4 h-4" /></Button>
          <Avatar className="w-8 h-8"><AvatarImage src={selectedUser?.avatar_url || undefined} /><AvatarFallback>{selectedUser?.name?.charAt(0) || 'م'}</AvatarFallback></Avatar>
          <div><h3 className="font-semibold text-foreground text-sm">{selectedUser?.name}</h3><p className="text-xs text-muted-foreground">{selectedUser?.email}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2 ${msg.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {!msg.media_url && <p className="text-sm">{msg.content}</p>}
                    {renderMedia(msg)}
                    <p className="text-[10px] opacity-70 mt-1">{formatDistanceToNow(new Date(msg.created_at), { addSuffix: true, locale: ar })}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPreviewMedia(null)}>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={() => setPreviewMedia(null)}><X className="w-6 h-6" /></Button>
          <img src={previewMedia} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          <Paperclip className="w-4 h-4" />
        </Button>
        <input ref={fileInputRef} type="file" className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip" onChange={handleFileUpload} />
        <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={isUploading ? 'جاري الرفع...' : 'اكتب رسالتك...'}
          onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1" disabled={isUploading} />
        <Button onClick={handleSend} disabled={!newMessage.trim() || isUploading}><Send className="w-4 h-4" /></Button>
      </div>
    </div>
  );
};

export default AdminChatPanel;
