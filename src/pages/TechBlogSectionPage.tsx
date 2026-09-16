import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Eye, Clock, FileQuestion } from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { useBlogSections, useBlogPosts } from '@/hooks/useTechBlog';
import { getIcon } from '@/lib/iconMap';

const TechBlogSectionPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { sections, isLoading } = useBlogSections();

  const section = useMemo(() => sections.find(s => s.slug === slug), [sections, slug]);
  const children = useMemo(
    () => sections.filter(s => s.parent_id === section?.id && s.is_active).sort((a, b) => a.sort_order - b.sort_order),
    [sections, section]
  );
  const { activePosts, isLoading: postsLoading } = useBlogPosts(section?.id);

  const from = section?.gradient_from || '#0f172a';
  const to = section?.gradient_to || '#0ea5e9';
  const Icon = getIcon(section?.icon || 'Shield');

  if (!isLoading && !section) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6">
        <FileQuestion className="w-14 h-14 text-muted-foreground" />
        <p className="text-muted-foreground">القسم غير موجود</p>
        <Button onClick={() => navigate('/tech-blog')}>العودة للتدوينات</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{section?.name || 'قسم'} | تدوينات معلوماتية</title>
        <meta name="description" content={section?.description || 'مواضيع ومقالات تقنية'} />
      </Helmet>
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(section?.parent_id ? '/tech-blog/phone' : '/tech-blog')} className="gap-1">
            <ArrowRight className="w-4 h-4" />رجوع
          </Button>

          <motion.section
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl p-[2px]"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            <div className="relative overflow-hidden rounded-[22px] px-6 py-8" style={{ background: `linear-gradient(135deg, ${from}f5, ${to}e0)` }}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }} />
              <div className="relative z-10 flex items-center gap-4">
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2.6 }}
                  className="w-14 h-14 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center"
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.span>
                <div>
                  <h1 className="text-2xl font-extrabold text-white">{section?.name}</h1>
                  <p className="text-white/85 text-sm mt-1">{section?.description}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {children.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">اختر الشركة / النوع</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {children.map((c, i) => {
                  const CIcon = getIcon(c.icon || 'Smartphone');
                  return (
                    <motion.button
                      key={c.id}
                      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/tech-blog/${c.slug}`)}
                      className="rounded-2xl p-[1.5px] text-right"
                      style={{ background: `linear-gradient(135deg, ${c.gradient_from || '#0ea5e9'}, ${c.gradient_to || '#6366f1'})` }}
                    >
                      <div className="rounded-[15px] bg-card h-full p-4 flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ background: `${c.color || '#0ea5e9'}1f`, border: `1px solid ${c.color || '#0ea5e9'}55` }}>
                          <CIcon className="w-4 h-4" style={{ color: c.color || '#0ea5e9' }} />
                        </span>
                        <span className="font-bold text-foreground text-sm">{c.name}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">المواضيع</h2>
            {postsLoading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />)}</div>
            ) : activePosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
                لا توجد مواضيع في هذا القسم بعد
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {activePosts.map((p, i) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => navigate(`/tech-blog/post/${p.id}`)}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all"
                  >
                    {p.image_url && (
                      <div className="h-36 overflow-hidden bg-muted">
                        <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-foreground line-clamp-2">{p.title}</h3>
                      {p.summary && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.summary}</p>}
                      <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{p.views_count}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(p.created_at).toLocaleDateString('ar')}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default TechBlogSectionPage;
