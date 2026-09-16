import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Send, Sparkles, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const SUGGESTIONS = [
  'ما هي خدمات المنصة؟',
  'أريد حملة تسويق إلكتروني',
  'كم تكلفة تصميم هوية بصرية؟',
  'من هو مطوّر المنصة؟',
  'كيف أتواصل مع الإدارة؟',
];

const AssistantPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { profile, user, isGuest } = useAuth();
  const navigate = useNavigate();

  const displayName = profile?.name || (user?.email ? user.email.split('@')[0] : '');

  const welcome = displayName
    ? `أهلاً بك يا ${displayName} 👋\nأنا مساعد ابوطلال الذكي، سعيد بعودتك! اسألني عن أي شيء داخل المنصة: الخدمات، الباقات، الأسعار، متجر التطبيقات، شبكات الواي فاي، أو طريقة التواصل مع الإدارة.`
    : 'أهلاً وسهلاً بك في ابوطلال للدعاية والإعلان والتسويق الإلكتروني 👋\nأنا المساعد الذكي، جاهز للإجابة عن كل أسئلتك.\nوأنصحك بإنشاء حساب مجاني للاستفادة من جميع الخدمات ومتابعة طلباتك ومراسلة الإدارة.';

  const [messages, setMessages] = useState<Message[]>([{ id: 1, text: welcome, isBot: true }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) => (prev.length === 1 ? [{ id: 1, text: welcome, isBot: true }] : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || isTyping) return;

    const history = [...messages, { id: Date.now(), text: question, isBot: false }];
    setMessages(history);
    setInput('');
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('assistant-chat', {
        body: {
          messages: history.slice(1).map((m) => ({ role: m.isBot ? 'assistant' : 'user', content: m.text })),
          userName: displayName,
          isGuest,
        },
      });

      const reply =
        (!error && (data as any)?.reply) ||
        'عذراً، تعذّر الوصول للمساعد الآن. يمكنك مراسلة الإدارة مباشرة من صفحة الرسائل أو عبر واتساب: 778215553';

      setMessages((prev) => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: 'حدث خطأ في الاتصال. حاول مرة أخرى بعد قليل.', isBot: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => send(input);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="flex-1 pt-16 pb-20 flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border bg-card">
          <div className="container mx-auto max-w-lg flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              aria-label="رجوع"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center glow-gold">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold text-foreground">مساعد ابوطلال الذكي</h1>
              <p className="text-xs text-emerald-500">متصل الآن • مدعوم بالذكاء الاصطناعي</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-custom">
          <div className="container mx-auto max-w-lg space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl ${
                    message.isBot
                      ? 'bg-card border border-border rounded-tr-none'
                      : 'gradient-gold text-primary-foreground rounded-tl-none'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.isBot && (
                      <Bot className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    )}
                    <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-card border border-border rounded-2xl rounded-tr-none p-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-2">
          <div className="container mx-auto max-w-lg flex gap-2 overflow-x-auto scrollbar-custom pb-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={isTyping}
                className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 inline ml-1" />{s}
              </button>
            ))}
          </div>
          {!user && (
            <div className="container mx-auto max-w-lg mt-2">
              <Button onClick={() => navigate('/auth?mode=register')} variant="outline" className="w-full h-10 border-primary/30 font-bold text-sm">
                <UserPlus className="w-4 h-4 ml-2" /> سجّل الآن واستفد من جميع الخدمات
              </Button>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-border bg-card">
          <div className="container mx-auto max-w-lg flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب رسالتك..."
              className="flex-1 h-12 bg-secondary"
            />
            <Button
              onClick={handleSend}
              className="h-12 w-12 gradient-gold p-0"
              disabled={!input.trim()}
            >
              <Send className="w-5 h-5 text-primary-foreground" />
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AssistantPage;
