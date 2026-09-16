import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Palette, X, ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { usePortfolio, PORTFOLIO_CATEGORIES } from '@/hooks/usePortfolio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSeo from '@/components/PageSeo';

const PortfolioPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { items, isLoading } = usePortfolio();

  const getItemsByCategory = (cat: string) => items.filter(i => i.category === cat && i.is_active);

  return (
    <>
      <PageSeo
        title="معرض الأعمال | ابوطلال للدعاية والإعلان والتسويق الإلكتروني"
        description="شاهد أبرز أعمالنا في التصميم، الدعاية، المونتاج، والتسويق الإلكتروني لعملاء ابوطلال للدعاية والإعلان والتسويق الإلكتروني."
        path="/portfolio"
      />
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowRight className="w-4 h-4 ml-2" />
            رجوع
          </Button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Palette className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-gradient-gold">معرض أعمالنا</h1>
            </div>
            <p className="text-muted-foreground">نماذج من أحدث مشاريعنا وأعمالنا المميزة في مختلف المجالات</p>
          </motion.div>

          <Tabs defaultValue={PORTFOLIO_CATEGORIES[0].value} dir="rtl">
            <TabsList className="flex flex-wrap gap-1 h-auto bg-card/50 p-2 rounded-xl mb-6">
              {PORTFOLIO_CATEGORIES.map(cat => (
                <TabsTrigger key={cat.value} value={cat.value} className="text-xs px-3 py-2 rounded-lg">
                  <span className="ml-1">{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {PORTFOLIO_CATEGORIES.map(cat => (
              <TabsContent key={cat.value} value={cat.value}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                  <div className={`rounded-xl bg-gradient-to-r ${cat.color} p-4 mb-6`}>
                    <h2 className="text-white font-bold text-xl flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      {cat.label}
                    </h2>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : getItemsByCategory(cat.value).length === 0 ? (
                    <div className="text-center py-16 bg-card/50 rounded-xl border border-border">
                      <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">لا توجد أعمال في هذا القسم حالياً</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {getItemsByCategory(cat.value).map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="group relative aspect-square bg-card border border-border rounded-xl overflow-hidden cursor-pointer"
                          onClick={() => navigate(`/portfolio/${item.id}`)}
                        >
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                              <span className="text-4xl">{cat.icon}</span>
                            </div>
                          )}
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white font-semibold text-sm">{item.title}</p>
                              {item.description && (
                                <p className="text-white/70 text-xs mt-1 line-clamp-2">{item.description}</p>
                              )}
                            </div>
                            <div className="absolute top-2 left-2">
                              <button
                                aria-label="تكبير الصورة"
                                className="p-1 rounded-md bg-black/40"
                                onClick={(e) => { e.stopPropagation(); if (item.image_url) setSelectedImage(item.image_url); }}
                              >
                                <ZoomIn className="w-4 h-4 text-white/90" />
                              </button>
                            </div>
                            <div className="absolute top-2 right-2">
                              <span className="text-[10px] text-white/90 bg-primary/80 rounded-md px-2 py-1">عرض التفاصيل</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          {/* WhatsApp CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mt-8">
            <p className="text-muted-foreground mb-4">هل تريد طلب تصميم مخصص؟</p>
            <Button
              onClick={() => window.open('https://wa.me/967778215553?text=مرحباً، أريد طلب تصميم مخصص', '_blank')}
              className="gradient-gold text-primary-foreground h-12 px-8"
            >
              تواصل معنا
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
    </>
  );
};

export default PortfolioPage;
