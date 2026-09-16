import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import PageSeo from '@/components/PageSeo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Smartphone, Download, Star, Shield, ArrowRight, Sparkles, Clock, HardDrive,
  Tag, LifeBuoy, Mail, Phone, Globe, X, ChevronLeft, ChevronRight, User2, MessageSquare, Package,
} from 'lucide-react';
import { useApp } from '@/hooks/useApps';
import { useAppScreenshots, useAppUpdates, useAppReviews, useAppDownload } from '@/hooks/useAppDetails';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestAction } from '@/contexts/GuestActionContext';

const formatDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

const formatNumber = (n: number) =>
  n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

const Stars: React.FC<{ value: number; size?: number; onChange?: (v: number) => void }> = ({ value, size = 14, onChange }) => (
  <div className="flex items-center gap-0.5" dir="ltr">
    {[1, 2, 3, 4, 5].map(i => (
      <button
        key={i}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(i)}
        aria-label={`تقييم ${i} من 5`}
        className={onChange ? 'transition-transform hover:scale-125' : 'cursor-default'}
      >
        <Star
          style={{ width: size, height: size }}
          className={i <= Math.round(value) ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/40'}
        />
      </button>
    ))}
  </div>
);

const AppDetailPage: React.FC = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { app, isLoading } = useApp(appId);
  const { screenshots } = useAppScreenshots(appId);
  const { updates } = useAppUpdates(appId);
  const { reviews, myReview, submitReview } = useAppReviews(appId);
  const { requireAccount } = useGuestAction();
  const { recordDownload } = useAppDownload();
  const { user } = useAuth();

  const visibleReviews = reviews.filter(r => r.is_visible);
  const avgRating = visibleReviews.length
    ? visibleReviews.reduce((s, r) => s + r.rating, 0) / visibleReviews.length
    : Number(app?.rating || 0);

  const latestUpdate = updates[0];
  const isNewUpdate = latestUpdate
    ? Date.now() - new Date(latestUpdate.released_at).getTime() < 30 * 24 * 3600 * 1000
    : false;

  const handleDownload = async () => {
    if (!requireAccount(undefined, { action: 'download', title: 'التحميل يتطلب حساباً', description: 'سجّل حسابك المجاني لتحميل التطبيقات ومتابعة تحديثاتها والحصول على الدعم.' })) return;
    if (!app?.download_url) return;
    await recordDownload(app.id, app.version);
    window.open(app.download_url, '_blank', 'noopener');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-background">
        <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
        <div className="pt-32 text-center space-y-4">
          <p className="text-muted-foreground">التطبيق غير موجود</p>
          <Button onClick={() => navigate('/apps-store')}>العودة للمتجر</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const gradient = app.color || 'from-emerald-500 to-teal-600';

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={`${app.name} — تحميل التطبيق | ابوطلال للدعاية والإعلان والتسويق الإلكتروني`}
        description={(app.description || `تحميل ${app.name} الإصدار ${app.version}`).slice(0, 155)}
        path={`/apps-store/${app.id}`}
      />
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-32 px-4">
        <div className="container mx-auto max-w-3xl space-y-5">
          <button
            onClick={() => navigate('/apps-store')}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="w-4 h-4" /> العودة إلى المتجر
          </button>

          {/* Header card */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
          >
            <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${gradient} opacity-90`} />
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="relative p-5 pt-16">
              <div className="flex items-end gap-4">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} ring-4 ring-card shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0`}>
                  {app.icon_url ? (
                    <img src={app.icon_url} alt={`أيقونة ${app.name}`} className="w-full h-full object-cover" />
                  ) : (
                    <Smartphone className="w-11 h-11 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-foreground">{app.name}</h1>
                    {isNewUpdate && (
                      <motion.span
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-bold"
                      >
                        <Sparkles className="w-3 h-3" /> تحديث جديد
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <User2 className="w-3.5 h-3.5" />
                    {app.developer_name || 'ابوطلال للدعاية والإعلان والتسويق الإلكتروني'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Stars value={avgRating} />
                    <span className="text-xs text-muted-foreground">
                      {avgRating.toFixed(1)} ({visibleReviews.length} تقييم)
                    </span>
                  </div>
                </div>
              </div>

              {/* stats strip */}
              <div className="grid grid-cols-4 gap-2 mt-5">
                {[
                  { icon: Download, label: 'التحميلات', value: formatNumber(app.real_downloads || 0) },
                  { icon: Tag, label: 'الإصدار', value: app.version || '—' },
                  { icon: HardDrive, label: 'الحجم', value: app.size || '—' },
                  { icon: Clock, label: 'آخر تحديث', value: formatDate(app.last_update_at).replace(/\s\d{4}$/, '') },
                ].map(s => (
                  <div key={s.label} className="rounded-xl bg-muted/50 p-2.5 text-center">
                    <s.icon className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <p className="text-[11px] font-bold text-foreground truncate">{s.value}</p>
                    <p className="text-[9px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleDownload}
                disabled={!app.download_url}
                className={`w-full mt-4 h-12 rounded-2xl text-sm font-bold text-white bg-gradient-to-r ${gradient} hover:opacity-90 shadow-lg`}
              >
                <Download className="w-4 h-4 ml-2" />
                {app.download_url ? (isNewUpdate ? 'تحديث الآن' : 'تحميل الآن') : 'التحميل غير متاح حالياً'}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" /> تم فحص الملف والتأكد من سلامته
              </p>
            </div>
          </motion.section>

          {/* Screenshots */}
          {screenshots.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-foreground">لقطات الشاشة</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {screenshots.map((s, i) => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setLightbox(i)}
                    className="snap-start flex-shrink-0 w-40 sm:w-48 rounded-2xl overflow-hidden border border-border bg-muted shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={s.image_url}
                      alt={s.caption || `لقطة شاشة ${i + 1} من ${app.name}`}
                      loading="lazy"
                      className="w-full h-72 object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </section>
          )}

          {/* What's new */}
          {(app.whats_new || latestUpdate?.changelog) && (
            <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" /> ما الجديد في هذا التحديث
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  v{latestUpdate?.version || app.version}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground whitespace-pre-line leading-6">
                {latestUpdate?.changelog || app.whats_new}
              </p>
              <p className="text-[10px] text-muted-foreground mt-2">
                نُشر بتاريخ {formatDate(latestUpdate?.released_at || app.last_update_at)}
              </p>
            </section>
          )}

          {/* Description */}
          {app.description && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-bold text-foreground mb-2">حول التطبيق</h2>
              <p className="text-xs text-muted-foreground leading-6 whitespace-pre-line">{app.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-4 text-[11px]">
                {app.package_name && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Package className="w-3.5 h-3.5" /> {app.package_name}
                  </div>
                )}
                {app.requirements && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Smartphone className="w-3.5 h-3.5" /> {app.requirements}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Version history */}
          {updates.length > 0 && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-bold text-foreground mb-3">سجل التحديثات</h2>
              <div className="space-y-3">
                {updates.map(u => (
                  <div key={u.id} className="relative pr-4 border-r-2 border-border">
                    <span className="absolute -right-[5px] top-1.5 w-2 h-2 rounded-full bg-primary" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">الإصدار {u.version}</span>
                      {u.is_major && <Badge className="text-[9px] px-1.5 py-0">تحديث رئيسي</Badge>}
                      <span className="text-[10px] text-muted-foreground">{formatDate(u.released_at)}</span>
                    </div>
                    {u.changelog && (
                      <p className="text-[11px] text-muted-foreground mt-1 whitespace-pre-line leading-5">{u.changelog}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Support */}
          {(app.support_url || app.support_email || app.support_phone) && (
            <section className="rounded-2xl border border-border bg-card p-4">
              <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                <LifeBuoy className="w-4 h-4 text-primary" /> دعم التطبيق
              </h2>
              <div className="grid gap-2">
                {app.support_url && (
                  <a href={app.support_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                    <Globe className="w-3.5 h-3.5" /> موقع الدعم
                  </a>
                )}
                {app.support_email && (
                  <a href={`mailto:${app.support_email}`} className="flex items-center gap-2 text-xs text-primary hover:underline">
                    <Mail className="w-3.5 h-3.5" /> {app.support_email}
                  </a>
                )}
                {app.support_phone && (
                  <a href={`https://wa.me/${app.support_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                    <Phone className="w-3.5 h-3.5" /> {app.support_phone}
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-primary" /> التقييمات والتعليقات
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">{avgRating.toFixed(1)}</span>
                <Stars value={avgRating} />
              </div>
            </div>

            {user && (
              <div className="rounded-xl bg-muted/40 p-3 space-y-2">
                <p className="text-xs font-semibold text-foreground">
                  {myReview ? 'تعديل تقييمك' : 'أضف تقييمك'}
                </p>
                <Stars value={myReview && !comment ? myReview.rating : rating} size={22} onChange={setRating} />
                <Textarea
                  rows={2}
                  placeholder="اكتب رأيك في التطبيق..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="text-xs"
                />
                <Button
                  size="sm"
                  className="w-full h-9 rounded-xl text-xs"
                  onClick={() => {
                    if (!requireAccount(undefined, { action: 'rating', title: 'التقييم يتطلب حساباً', description: 'سجّل حسابك المجاني لإضافة تقييمك وتعليقك على التطبيق.' })) return;
                    submitReview.mutate({ app_id: app.id, rating, comment: comment.trim() });
                    setComment('');
                  }}
                >
                  {myReview ? 'تحديث التقييم' : 'نشر التقييم'}
                </Button>
              </div>
            )}

            {visibleReviews.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-4">لا توجد تعليقات بعد — كن أول من يقيّم</p>
            ) : (
              <div className="space-y-3">
                {visibleReviews.map(r => (
                  <div key={r.id} className="border-b border-border last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary">
                          {r.user_name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-foreground">{r.user_name}</span>
                      </div>
                      <Stars value={r.rating} size={12} />
                    </div>
                    {r.comment && <p className="text-xs text-muted-foreground mt-1.5 leading-5">{r.comment}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDate(r.created_at)}</p>
                    {r.admin_reply && (
                      <div className="mt-2 rounded-xl bg-primary/5 border-r-2 border-primary p-2.5">
                        <p className="text-[10px] font-bold text-primary mb-0.5">رد فريق المنصة</p>
                        <p className="text-[11px] text-muted-foreground leading-5">{r.admin_reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && screenshots[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-4 left-4 text-white p-2" aria-label="إغلاق" onClick={() => setLightbox(null)}>
              <X className="w-6 h-6" />
            </button>
            <motion.img
              key={lightbox}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={screenshots[lightbox].image_url}
              alt={screenshots[lightbox].caption || 'لقطة شاشة'}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            {screenshots.length > 1 && (
              <>
                <button
                  className="absolute right-3 text-white p-3 bg-white/10 rounded-full"
                  aria-label="السابق"
                  onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + screenshots.length) % screenshots.length); }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  className="absolute left-3 text-white p-3 bg-white/10 rounded-full"
                  aria-label="التالي"
                  onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % screenshots.length); }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default AppDetailPage;
