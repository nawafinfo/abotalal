import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  ArrowRight, ArrowLeft, Eye, Clock, Share2, MessageCircle, Send, Copy, Facebook,
  Trash2, FileQuestion, Mail,
} from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useBlogPost, useBlogComments } from '@/hooks/useTechBlog';
import { useAuth } from '@/contexts/AuthContext';
import { getIcon } from '@/lib/iconMap';
import { useGuestAction } from '@/contexts/GuestActionContext';

const TechBlogPostPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, section, siblings, isLoading } = useBlogPost(id);
  const { visibleComments, addComment, deleteComment } = useBlogComments(id);
  const { user } = useAuth();
  const { requireAccount } = useGuestAction();

  const cleanHtml = useMemo(() => DOMPurify.sanitize(post?.content || ''), [post?.content]);
  const idx = siblings.findIndex(s => s.id === id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const Icon = getIcon(section?.icon || 'Shield');

  const share = (kind: string) => {
    const t = encodeURIComponent(post?.title || '');
    const u = encodeURIComponent(shareUrl);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      telegram: `https://t.me/share/url?url=${u}&text=${t}`,
      x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    };
    if (kind === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      toast.success('تم نسخ الرابط');
      return;
    }
    window.open(links[kind], '_blank', 'noopener');
  };

  const submitComment = async () => {
    if (!requireAccount(undefined, { action: 'comment', title: 'التعليق يتطلب حساباً', description: 'سجّل حسابك المجاني لكتابة تعليقك والمشاركة في النقاش.' })) return;
    if (!user) { toast.error('يرجى تسجيل الدخول للتعليق'); navigate('/auth'); return; }
    if (!comment.trim() || !id) return;
    setSending(true);
    const { error } = await addComment({
      post_id: id,
      user_id: user.id,
      user_name: (user.user_metadata as any)?.name || user.email?.split('@')[0] || 'مستخدم',
      content: comment.trim(),
    });
    setSending(false);
    if (error) toast.error('تعذّر إرسال التعليق');
    else { setComment(''); toast.success('تم إضافة تعليقك'); }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
        <FileQuestion className="w-14 h-14 text-muted-foreground" />
        <p className="text-muted-foreground">الموضوع غير موجود</p>
        <Button onClick={() => navigate('/tech-blog')}>العودة للتدوينات</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | تدوينات معلوماتية</title>
        <meta name="description" content={post.summary || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary || post.title} />
      </Helmet>
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <article className="container mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(section ? `/tech-blog/${section.slug}` : '/tech-blog')}>
              <ArrowRight className="w-4 h-4" />رجوع
            </Button>
            {section && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: `${section.color || '#0ea5e9'}1a`, color: section.color || '#0ea5e9' }}>
                <Icon className="w-3.5 h-3.5" />{section.name}
              </span>
            )}
          </div>

          {post.image_url && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl overflow-hidden border border-border shadow-xl">
              <img src={post.image_url} alt={post.title} className="w-full max-h-[420px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <h1 className="absolute bottom-4 right-5 left-5 text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg leading-snug">
                {post.title}
              </h1>
            </motion.div>
          )}
          {!post.image_url && <h1 className="text-3xl font-extrabold text-foreground leading-snug">{post.title}</h1>}

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(post.created_at).toLocaleDateString('ar')}</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.views_count} مشاهدة</span>
          </div>

          {post.summary && (
            <div className="rounded-2xl border-r-4 border-primary bg-primary/5 p-4">
              <p className="text-sm leading-relaxed text-foreground font-medium">{post.summary}</p>
            </div>
          )}

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: cleanHtml }} />

          {/* المشاركة */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><Share2 className="w-4 h-4" />مشاركة الموضوع</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1" onClick={() => share('whatsapp')}><MessageCircle className="w-4 h-4 text-emerald-500" />واتساب</Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => share('facebook')}><Facebook className="w-4 h-4 text-blue-500" />فيسبوك</Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => share('telegram')}><Send className="w-4 h-4 text-sky-500" />تيليجرام</Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => share('x')}><Share2 className="w-4 h-4" />X</Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => share('copy')}><Copy className="w-4 h-4" />نسخ الرابط</Button>
              <Button size="sm" className="gap-1" onClick={() => requireAccount(() => navigate('/messages'), { action: 'message', title: 'المراسلة تتطلب حساباً', description: 'سجّل حسابك المجاني لمراسلة الإدارة بخصوص هذا الموضوع.' })}><Mail className="w-4 h-4" />مراسلة بخصوص الموضوع</Button>
            </div>
          </div>

          {/* السابق والتالي */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" disabled={!prev} className="justify-start gap-2 h-auto py-3"
              onClick={() => prev && navigate(`/tech-blog/post/${prev.id}`)}>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs truncate text-right">{prev?.title || 'لا يوجد سابق'}</span>
            </Button>
            <Button variant="outline" disabled={!next} className="justify-end gap-2 h-auto py-3"
              onClick={() => next && navigate(`/tech-blog/post/${next.id}`)}>
              <span className="text-xs truncate text-right">{next?.title || 'لا يوجد تالي'}</span>
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            </Button>
          </div>

          {/* التعليقات */}
          <section className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />التعليقات ({visibleComments.length})
            </h2>
            <div className="space-y-2">
              <Textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={1000}
                placeholder={user ? 'اكتب تعليقك...' : 'سجّل الدخول لتتمكن من التعليق'} rows={3} />
              <Button onClick={submitComment} disabled={sending || !comment.trim()} className="gap-1">
                <Send className="w-4 h-4" />إرسال التعليق
              </Button>
            </div>
            <div className="space-y-3">
              {visibleComments.map(c => (
                <div key={c.id} className="rounded-xl bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{c.user_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString('ar')}</span>
                      {user?.id === c.user_id && (
                        <button onClick={() => deleteComment(c.id)} aria-label="حذف التعليق" className="text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
              {visibleComments.length === 0 && <p className="text-xs text-muted-foreground text-center py-3">كن أول من يعلّق على هذا الموضوع</p>}
            </div>
          </section>
        </article>
      </main>

      <BottomNav />
    </div>
  );
};

export default TechBlogPostPage;
