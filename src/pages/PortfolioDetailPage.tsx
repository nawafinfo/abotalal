import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight, Calendar, User, ExternalLink, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageSeo from '@/components/PageSeo';
import { PORTFOLIO_CATEGORIES } from '@/hooks/usePortfolio';
import { usePortfolioItem, usePortfolioImages } from '@/hooks/usePortfolioDetails';
import { toast } from '@/hooks/use-toast';

const PortfolioDetailPage: React.FC = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { item, isLoading } = usePortfolioItem(itemId);
  const { images } = usePortfolioImages(itemId);

  const gallery = [
    ...(item?.image_url ? [{ id: 'cover', image_url: item.image_url, caption: null as string | null }] : []),
    ...images.map(i => ({ id: i.id, image_url: i.image_url, caption: i.caption })),
  ];

  const cat = PORTFOLIO_CATEGORIES.find(c => c.value === item?.category);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">العمل غير موجود</p>
        <Button onClick={() => navigate('/portfolio')}>العودة للمعرض</Button>
      </div>
    );
  }

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: item.title, url }); } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: 'تم نسخ رابط العمل' });
    }
  };

  return (
    <>
      <PageSeo title={`${item.title} | معرض أعمال ابوطلال للدعاية والإعلان والتسويق الإلكتروني`} description={item.description || 'تفاصيل العمل'} path={`/portfolio/${item.id}`} />
      <div className="min-h-screen bg-background">
        <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
        <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

        <main className="pt-16 pb-28">
          {/* Hero */}
          <div className="relative h-[42vh] min-h-[260px] overflow-hidden">
            {item.image_url ? (
              <motion.img
                initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }}
                src={item.image_url} alt={item.title} className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${cat?.color || 'from-primary to-accent'}`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 container mx-auto max-w-4xl">
              {cat && <Badge className="mb-2">{cat.icon} {cat.label}</Badge>}
              <motion.h1 initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="text-2xl md:text-4xl font-bold text-foreground">{item.title}</motion.h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate('/portfolio')} aria-label="رجوع"
              className="absolute top-3 right-3 bg-background/70 glass">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="container mx-auto max-w-4xl px-4 -mt-2 space-y-6">
            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {item.client_name && (
                <div className="rounded-xl border border-border gradient-card p-3">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1"><User className="w-3 h-3" /> العميل</p>
                  <p className="text-sm font-bold text-foreground truncate">{item.client_name}</p>
                </div>
              )}
              {item.project_date && (
                <div className="rounded-xl border border-border gradient-card p-3">
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> تاريخ المشروع</p>
                  <p className="text-sm font-bold text-foreground truncate">{item.project_date}</p>
                </div>
              )}
              <div className="rounded-xl border border-border gradient-card p-3">
                <p className="text-[11px] text-muted-foreground">عدد الصور</p>
                <p className="text-sm font-bold text-foreground">{gallery.length}</p>
              </div>
            </div>

            {/* Description */}
            {(item.description || item.details) && (
              <section className="rounded-2xl border border-border gradient-card p-5">
                <h2 className="font-bold text-foreground mb-2">عن المشروع</h2>
                {item.description && <p className="text-sm text-muted-foreground leading-7">{item.description}</p>}
                {item.details && <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line mt-3">{item.details}</p>}
              </section>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <section>
                <h2 className="font-bold text-foreground mb-3">معرض الصور</h2>
                <div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">
                  {gallery.map((g, idx) => (
                    <motion.button
                      key={g.id}
                      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                      onClick={() => setLightbox(idx)}
                      className="mb-3 block w-full overflow-hidden rounded-xl border border-border group"
                      aria-label={`عرض الصورة ${idx + 1}`}
                    >
                      <img src={g.image_url} alt={g.caption || item.title} loading="lazy"
                        className="w-full transition-transform duration-500 group-hover:scale-105" />
                    </motion.button>
                  ))}
                </div>
              </section>
            )}

            <div className="flex gap-2">
              {item.project_url && (
                <Button className="flex-1" asChild>
                  <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 ml-1" /> زيارة المشروع
                  </a>
                </Button>
              )}
              <Button variant="outline" className="flex-1" onClick={share}>
                <Share2 className="w-4 h-4 ml-1" /> مشاركة
              </Button>
            </div>
          </div>
        </main>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && gallery[lightbox] && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}>
              <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                src={gallery[lightbox].image_url} alt={item.title}
                className="max-h-[85vh] max-w-full object-contain rounded-xl" onClick={e => e.stopPropagation()} />
              <button className="absolute top-4 left-4 text-white p-2" aria-label="إغلاق" onClick={() => setLightbox(null)}>
                <X className="w-6 h-6" />
              </button>
              {gallery.length > 1 && (
                <>
                  <button aria-label="السابق" className="absolute right-3 text-white p-3"
                    onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % gallery.length); }}>
                    <ChevronRight className="w-8 h-8" />
                  </button>
                  <button aria-label="التالي" className="absolute left-3 text-white p-3"
                    onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + gallery.length) % gallery.length); }}>
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav />
      </div>
    </>
  );
};

export default PortfolioDetailPage;