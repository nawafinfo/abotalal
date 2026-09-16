import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Heart, Eye, Clock } from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { useBlogSections, useBlogPosts } from '@/hooks/useTechBlog';
import { getIcon } from '@/lib/iconMap';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const TechBlogPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { rootSections, isLoading } = useBlogSections();
  const { activePosts } = useBlogPosts();
  const { getSetting } = useSiteSettings();

  const from = getSetting('tech_blog_gradient_from', '#0f172a');
  const to = getSetting('tech_blog_gradient_to', '#0ea5e9');
  const title = getSetting('tech_blog_title', 'تدوينات معلوماتية');
  const subtitle = getSetting('tech_blog_subtitle', 'الأمن والمعلومات · الحماية من الثغرات والاختراقات · نصائح وحلول');
  const note = getSetting('tech_blog_note', 'هذه الخدمة مقدمة لعملائنا وأصدقائنا الكرام. بكل حب.. من ابوطلال');

  const latest = activePosts.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title} | حماية وأمن معلومات</title>
        <meta name="description" content={subtitle} />
      </Helmet>
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* الهيرو */}
          <motion.section
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl p-[2px]"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            <div className="relative overflow-hidden rounded-[22px] px-6 py-10 text-center" style={{ background: `linear-gradient(135deg, ${from}f5, ${to}e0)` }}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }} />
              {[0, 1, 2, 3].map(i => (
                <motion.span key={i}
                  className="absolute rounded-full border border-white/20"
                  style={{ width: 120 + i * 90, height: 120 + i * 90, left: '50%', top: '50%', marginLeft: -(60 + i * 45), marginTop: -(60 + i * 45) }}
                  animate={{ opacity: [0.05, 0.35, 0.05], scale: [0.95, 1.05, 0.95] }}
                  transition={{ repeat: Infinity, duration: 3.4, delay: i * 0.4 }}
                />
              ))}
              <motion.div
                animate={{ boxShadow: ['0 0 0 0 rgba(255,255,255,.4)', '0 0 0 18px rgba(255,255,255,0)'] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
                className="relative z-10 w-16 h-16 mx-auto rounded-2xl bg-white/15 border border-white/30 backdrop-blur flex items-center justify-center"
              >
                <ShieldCheck className="w-9 h-9 text-white" />
              </motion.div>
              <h1 className="relative z-10 mt-4 text-3xl font-extrabold text-white drop-shadow">{title}</h1>
              <p className="relative z-10 mt-2 text-white/85 text-sm max-w-xl mx-auto leading-relaxed">{subtitle}</p>
            </div>
          </motion.section>

          {/* الأقسام */}
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">الأقسام</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {rootSections.map((s, i) => {
                  const Icon = getIcon(s.icon || 'Shield');
                  return (
                    <motion.button
                      key={s.id}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }}
                      onClick={() => navigate(`/tech-blog/${s.slug}`)}
                      className="relative overflow-hidden rounded-2xl p-[1.5px] text-right"
                      style={{ background: `linear-gradient(135deg, ${s.gradient_from || '#0ea5e9'}, ${s.gradient_to || '#22c55e'})` }}
                    >
                      <div className="rounded-[15px] bg-card h-full p-4 flex flex-col gap-2">
                        <motion.span
                          animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2.6, delay: i * 0.2 }}
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: `${s.color || '#0ea5e9'}1f`, border: `1px solid ${s.color || '#0ea5e9'}55` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: s.color || '#0ea5e9' }} />
                        </motion.span>
                        <span className="font-bold text-foreground text-sm">{s.name}</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-2">{s.description}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </section>

          {/* أحدث المواضيع */}
          {latest.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-foreground mb-4">أحدث المواضيع</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {latest.map((p, i) => (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
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
                        <span className="flex items-center gap-1 mr-auto text-primary">اقرأ<ArrowLeft className="w-3 h-3" /></span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          )}

          {/* رسالة الشكر */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-center"
          >
            <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">{note}</p>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default TechBlogPage;
