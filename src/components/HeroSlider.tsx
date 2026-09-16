import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeroSlides } from '@/hooks/useHeroSlides';
import { sliderItems } from '@/data/services';

const HeroSlider: React.FC = () => {
  const [[currentIndex, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const { activeSlides } = useHeroSlides();

  const items = activeSlides.length > 0
    ? activeSlides.map(s => ({
        id: s.id, title: s.title, description: s.description || '',
        gradient: s.gradient, image_url: (s as any).image_url || null,
      }))
    : sliderItems.map(s => ({ ...s, image_url: null }));

  const count = items.length;

  const paginate = useCallback((dir: number) => {
    setState(([i]) => [(i + dir + count) % count, dir]);
  }, [count]);

  useEffect(() => {
    if (count === 0 || paused) return;
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [count, paused, paginate]);

  useEffect(() => {
    if (count > 0 && currentIndex >= count) setState([0, 1]);
  }, [count, currentIndex]);

  if (count === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div
      className="platform-glow relative w-full h-64 md:h-96 rounded-3xl overflow-hidden border border-border shadow-elevated group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0, scale: 1.06, x: direction > 0 ? -60 : 60 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 1.02, x: direction > 0 ? 60 : -60 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${currentItem?.gradient}`}
        >
          {currentItem?.image_url && (
            <>
              {/* Blurred fill so any image ratio looks premium */}
              <img
                src={currentItem.image_url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
              />
              <motion.img
                src={currentItem.image_url}
                alt={currentItem.title}
                loading="eager"
                initial={{ scale: 1.12, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 7, ease: 'linear' }}
                className="absolute inset-0 w-full h-full object-contain md:object-cover"
              />
            </>
          )}
          {/* Luxury overlays */}
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/60 to-background/20" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute inset-0 opacity-60" style={{ background: 'var(--gradient-glow)' }} />
          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '120%' }}
            transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12"
          />

          <div className="relative h-full flex items-end md:items-center gap-5 p-6 md:p-10 pb-12">
            <div className={`flex flex-col justify-center ${currentItem?.image_url ? 'items-start text-right max-w-xl' : 'items-center text-center w-full'}`}>
              <motion.span
                initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30 glass"
              >
                ★ ابوطلال للدعاية والإعلان والتسويق الإلكتروني
              </motion.span>
              <motion.h2
                initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-2xl md:text-4xl font-black text-gradient-gold mb-2 leading-tight"
              >{currentItem?.title}</motion.h2>
              <motion.p
                initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-foreground/80 max-w-lg text-sm md:text-base"
              >{currentItem?.description}</motion.p>
            </div>
          </div>

          {/* Progress bar */}
          {!paused && (
            <motion.div
              key={`p-${currentIndex}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6, ease: 'linear' }}
              className="absolute bottom-0 right-0 h-[3px] gradient-gold"
            />
          )}
        </motion.div>
      </AnimatePresence>

      <Button variant="ghost" size="icon" onClick={() => paginate(-1)} aria-label="الشريحة السابقة"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full glass bg-background/40 hover:bg-background/70 text-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => paginate(1)} aria-label="الشريحة التالية"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full glass bg-background/40 hover:bg-background/70 text-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setPaused(p => !p)} aria-label={paused ? 'تشغيل العرض' : 'إيقاف العرض'}
        className="absolute top-3 left-3 w-8 h-8 rounded-full glass bg-background/40 hover:bg-background/70 text-foreground border border-border">
        {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {items.map((_, index) => (
          <button key={index} onClick={() => setState([index, index > currentIndex ? 1 : -1])} aria-label={`الانتقال إلى الشريحة ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-8 gradient-gold' : 'w-1.5 bg-foreground/30 hover:bg-foreground/60'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
