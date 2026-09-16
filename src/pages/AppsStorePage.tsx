import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Shield, Download, Star, MessageCircle, Wrench, Palette, Smartphone, Wifi, Sparkles, ChevronLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApps, App } from '@/hooks/useApps';
import { useNavigate } from 'react-router-dom';

const formatNumber = (n: number) =>
  n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

const AppCard: React.FC<{ app: App; index: number }> = ({ app, index }) => {
  const navigate = useNavigate();
  const isNew = !!app.whats_new && !!app.last_update_at
    && Date.now() - new Date(app.last_update_at).getTime() < 30 * 24 * 3600 * 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => navigate(`/apps-store/${app.id}`)}
      className="cursor-pointer bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color || 'from-blue-500 to-blue-700'} flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden`}>
          {app.icon_url ? (
            <img src={app.icon_url} alt={`أيقونة ${app.name}`} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <Smartphone className="w-7 h-7 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-foreground text-sm">{app.name}</h3>
            {app.version && <Badge variant="outline" className="text-[9px] px-1 py-0">v{app.version}</Badge>}
            {isNew && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 text-[9px] font-bold">
                <Sparkles className="w-2.5 h-2.5" /> تحديث
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">{app.developer_name || 'ابوطلال للدعاية والإعلان والتسويق الإلكتروني'}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-xs text-muted-foreground">{Number(app.rating || 0).toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{app.size}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {formatNumber(app.real_downloads || 0)} تحميل
            </Badge>
          </div>
        </div>
      </div>
      <Button
        size="sm"
        className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs h-9"
        onClick={(e) => { e.stopPropagation(); navigate(`/apps-store/${app.id}`); }}
      >
        <Download className="w-3.5 h-3.5 ml-1" />
        تحميل الآن
        <ChevronLeft className="w-3.5 h-3.5 mr-1" />
      </Button>
    </motion.div>
  );
};

const AppsStorePage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { apps, isLoading } = useApps();

  const socialApps = apps.filter(a => a.category === 'social' && a.is_active);
  const toolsApps = apps.filter(a => a.category === 'tools' && a.is_active);
  const designApps = apps.filter(a => a.category === 'design' && a.is_active);
  const wifiApps = apps.filter(a => a.category === 'wifi' && a.is_active);

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 p-6 text-center"
          >
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="inline-block mb-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="currentColor">
                    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
                  </svg>
                </div>
              </motion.div>
              <h1 className="text-2xl font-bold text-white mb-1">متجر تطبيقاتنا</h1>
              <p className="text-white/80 text-sm">برمجة وتطوير ابوطلال للدعاية والإعلان والتسويق الإلكتروني</p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Shield className="w-3.5 h-3.5" />
                  <span>تطبيقات آمنة 100%</span>
                </div>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل مباشر</span>
                </div>
              </div>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : apps.filter(a => a.is_active).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>لا توجد تطبيقات متاحة حالياً</p>
            </div>
          ) : (
            <Tabs defaultValue="social" dir="rtl" className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-12 rounded-xl bg-muted/50">
                <TabsTrigger value="social" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
                  <MessageCircle className="w-3.5 h-3.5 ml-1" />
                  التواصل ({socialApps.length})
                </TabsTrigger>
                <TabsTrigger value="tools" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
                  <Wrench className="w-3.5 h-3.5 ml-1" />
                  الأدوات ({toolsApps.length})
                </TabsTrigger>
                <TabsTrigger value="design" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white">
                  <Palette className="w-3.5 h-3.5 ml-1" />
                  التصاميم ({designApps.length})
                </TabsTrigger>
                <TabsTrigger value="wifi" className="rounded-lg text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                  <Wifi className="w-3.5 h-3.5 ml-1" />
                  الواي فاي ({wifiApps.length})
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="social" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {socialApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
                    {socialApps.length === 0 && <p className="text-center text-muted-foreground col-span-2 py-8">لا توجد تطبيقات في هذا القسم</p>}
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {toolsApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
                    {toolsApps.length === 0 && <p className="text-center text-muted-foreground col-span-2 py-8">لا توجد تطبيقات في هذا القسم</p>}
                  </div>
                </TabsContent>

                <TabsContent value="design" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {designApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
                    {designApps.length === 0 && <p className="text-center text-muted-foreground col-span-2 py-8">لا توجد تطبيقات في هذا القسم</p>}
                  </div>
                </TabsContent>
                <TabsContent value="wifi" className="mt-4">
                  <div className="mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-4 text-white">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-5 h-5" />
                      <h2 className="font-bold text-sm">تطبيقات شبكات الواي فاي</h2>
                    </div>
                    <p className="text-white/80 text-xs mt-1">أدوات إدارة وتحكم وطباعة كروت الشبكات وصفحات الهوتسبوت</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wifiApps.map((app, i) => <AppCard key={app.id} app={app} index={i} />)}
                    {wifiApps.length === 0 && <p className="text-center text-muted-foreground col-span-2 py-8">لا توجد تطبيقات في هذا القسم</p>}
                  </div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          )}

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-foreground text-sm">جميع التطبيقات آمنة ومحمية</h3>
            </div>
            <p className="text-xs text-muted-foreground">تم فحص جميع التطبيقات والتأكد من خلوها من أي برمجيات ضارة</p>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AppsStorePage;
