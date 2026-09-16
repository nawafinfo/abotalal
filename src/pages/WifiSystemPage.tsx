import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight, Download, ShoppingCart, Globe, Mail, Phone, LifeBuoy, Monitor,
  Smartphone, Apple, HardDrive, Sparkles, X, PlayCircle, Code2, Copy,
} from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSeo from '@/components/PageSeo';
import { useWifiProduct, useWifiVideos, useWifiUpdates, getYoutubeId } from '@/hooks/useWifiSystemDetails';
import { useWifiProductImages } from '@/hooks/useWifiProducts';
import { toast } from '@/hooks/use-toast';

const osIcon = (os?: string | null) => {
  const v = (os || '').toLowerCase();
  if (v.includes('android') || v.includes('اندرويد')) return Smartphone;
  if (v.includes('ios') || v.includes('iphone') || v.includes('ايفون')) return Apple;
  return Monitor;
};

const WifiSystemPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [shot, setShot] = useState<string | null>(null);
  const { product, isLoading } = useWifiProduct(productId);
  const { images } = useWifiProductImages(productId);
  const { videos } = useWifiVideos(productId);
  const { updates } = useWifiUpdates(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">النظام غير موجود</p>
        <Button onClick={() => navigate('/wifi-networks')}>العودة</Button>
      </div>
    );
  }

  const OsIcon = osIcon(product.os);
  const price = product.discount_percent
    ? (product.price * (1 - product.discount_percent / 100)).toFixed(0)
    : product.price;
  const isNewUpdate = product.last_update_at
    && Date.now() - new Date(product.last_update_at).getTime() < 30 * 24 * 3600 * 1000
    && updates.length > 0;

  const stats = [
    { label: 'نظام التشغيل', value: product.os || 'غير محدد', icon: OsIcon },
    { label: 'الحجم', value: product.size || '—', icon: HardDrive },
    { label: 'الإصدار', value: product.version || '1.0', icon: Sparkles },
    {
      label: 'آخر تحديث',
      value: product.last_update_at ? new Date(product.last_update_at).toLocaleDateString('ar-EG') : '—',
      icon: Download,
    },
  ];

  return (
    <>
      <PageSeo title={`${product.name} | أنظمة التحكم - ابوطلال للدعاية والإعلان والتسويق الإلكتروني`} description={product.description || 'تفاصيل النظام'} path={`/wifi-networks/${product.id}`} />
      <div className="min-h-screen bg-background">
        <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
        <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

        <main className="pt-16 pb-32">
          {/* Hero */}
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 px-4 pt-6 pb-8">
            <Button variant="ghost" size="icon" onClick={() => navigate('/wifi-networks')} aria-label="رجوع"
              className="absolute top-3 right-3 text-white hover:bg-white/10">
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="container mx-auto max-w-4xl flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/15 glass flex items-center justify-center overflow-hidden shrink-0">
                {product.logo_url || product.image_url ? (
                  <img src={product.logo_url || product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Monitor className="w-10 h-10 text-white" />
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-white truncate">{product.name}</h1>
                {product.developer_name && <p className="text-cyan-100 text-xs mt-1">{product.developer_name}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.is_free
                    ? <Badge className="bg-green-500 text-white">مجاني</Badge>
                    : <Badge className="bg-amber-500 text-white">مدفوع • ${price}</Badge>}
                  {isNewUpdate && <Badge className="bg-white text-blue-700">تحديث جديد</Badge>}
                  {product.type && <Badge variant="secondary">{product.type}</Badge>}
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-4xl px-4 space-y-6 -mt-4">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl border border-border gradient-card p-3">
              {stats.map(s => (
                <div key={s.label} className="text-center px-1">
                  <s.icon className="w-4 h-4 mx-auto text-primary mb-1" />
                  <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  <p className="text-xs font-bold text-foreground truncate">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Screenshots */}
            {images.length > 0 && (
              <section>
                <h2 className="font-bold text-foreground mb-3">لقطات الشاشة</h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {images.map(img => (
                    <button key={img.id} onClick={() => setShot(img.image_url)} aria-label="تكبير اللقطة"
                      className="shrink-0 w-52 rounded-xl overflow-hidden border border-border">
                      <img src={img.image_url} alt={product.name} loading="lazy" className="w-full h-36 object-cover" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            <Tabs defaultValue="about" dir="rtl">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="about">الوصف</TabsTrigger>
                <TabsTrigger value="guide">الشرح</TabsTrigger>
                <TabsTrigger value="updates">التحديثات</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line">{product.description || 'لا يوجد وصف.'}</p>

                {product.code_content && product.is_free && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm flex items-center gap-1"><Code2 className="w-4 h-4" /> الكود</h3>
                    <div className="relative bg-muted rounded-lg p-4 max-h-60 overflow-auto">
                      <pre className="text-xs whitespace-pre-wrap font-mono" dir="ltr">{product.code_content}</pre>
                      <Button size="sm" variant="ghost" className="absolute top-2 left-2 h-7 px-2"
                        onClick={() => { navigator.clipboard.writeText(product.code_content); toast({ title: 'تم نسخ الكود' }); }}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Support */}
                <div className="rounded-2xl border border-border gradient-card p-4 space-y-2">
                  <h3 className="font-bold text-sm flex items-center gap-1"><LifeBuoy className="w-4 h-4 text-primary" /> الدعم والمطور</h3>
                  {product.developer_name && <p className="text-xs text-muted-foreground">المطور: {product.developer_name}</p>}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.website_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={product.website_url} target="_blank" rel="noopener noreferrer"><Globe className="w-3 h-3 ml-1" />الموقع الإلكتروني</a>
                      </Button>
                    )}
                    {product.support_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={product.support_url} target="_blank" rel="noopener noreferrer"><LifeBuoy className="w-3 h-3 ml-1" />صفحة الدعم</a>
                      </Button>
                    )}
                    {product.support_email && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={`mailto:${product.support_email}`}><Mail className="w-3 h-3 ml-1" />{product.support_email}</a>
                      </Button>
                    )}
                    {product.support_phone && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={`https://wa.me/${product.support_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <Phone className="w-3 h-3 ml-1" />{product.support_phone}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="guide" className="pt-4 space-y-4">
                {product.guide_content
                  ? <p className="text-sm text-muted-foreground leading-7 whitespace-pre-line">{product.guide_content}</p>
                  : <p className="text-sm text-muted-foreground">لا يوجد شرح نصي بعد.</p>}

                {videos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm flex items-center gap-1"><PlayCircle className="w-4 h-4 text-primary" /> فيديوهات الشرح</h3>
                    {videos.map(v => {
                      const yid = getYoutubeId(v.youtube_url);
                      return (
                        <div key={v.id} className="rounded-xl overflow-hidden border border-border">
                          <div className="aspect-video bg-muted">
                            {yid ? (
                              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${yid}`} title={v.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen loading="lazy" />
                            ) : (
                              <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full text-sm text-primary">فتح الفيديو</a>
                            )}
                          </div>
                          <p className="p-3 text-sm font-bold text-foreground">{v.title}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="updates" className="pt-4 space-y-3">
                {updates.length === 0 && <p className="text-sm text-muted-foreground">لا توجد تحديثات منشورة.</p>}
                {updates.map(u => (
                  <div key={u.id} className="rounded-xl border border-border gradient-card p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold">الإصدار {u.version}</span>
                      {u.is_major && <Badge className="text-[9px]">تحديث رئيسي</Badge>}
                      <span className="text-[10px] text-muted-foreground">{new Date(u.released_at).toLocaleDateString('ar-EG')}</span>
                      {u.size && <span className="text-[10px] text-muted-foreground">• {u.size}</span>}
                    </div>
                    {u.changelog && <p className="text-xs text-muted-foreground whitespace-pre-line">{u.changelog}</p>}
                    {u.download_url && product.is_free && (
                      <Button size="sm" variant="outline" className="mt-2" asChild>
                        <a href={u.download_url} target="_blank" rel="noopener noreferrer"><Download className="w-3 h-3 ml-1" />تحميل هذا الإصدار</a>
                      </Button>
                    )}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Sticky CTA */}
        <div className="fixed bottom-16 left-0 right-0 z-30 px-4 pb-2">
          <div className="container mx-auto max-w-4xl">
            {product.is_free ? (
              <Button className="w-full h-12 text-base shadow-elevated" disabled={!product.download_url} asChild={!!product.download_url}>
                {product.download_url ? (
                  <a href={product.download_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5 ml-2" /> تحميل مجاني
                  </a>
                ) : <span>رابط التحميل غير متوفر</span>}
              </Button>
            ) : (
              <Button className="w-full h-12 text-base shadow-elevated" onClick={() => navigate(`/wifi-networks/${product.id}/purchase`)}>
                <ShoppingCart className="w-5 h-5 ml-2" /> شراء الآن • ${price}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {shot && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setShot(null)}>
              <img src={shot} alt="لقطة شاشة" className="max-h-[85vh] max-w-full object-contain rounded-xl" />
              <button className="absolute top-4 left-4 text-white p-2" aria-label="إغلاق"><X className="w-6 h-6" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <BottomNav />
      </div>
    </>
  );
};

export default WifiSystemPage;