import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ChevronUp, ChevronDown } from 'lucide-react';
import { useNewsItems } from '@/hooks/useNewsItems';

const NewsTicker: React.FC = () => {
  const { activeNewsItems, isLoading } = useNewsItems();
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = activeNewsItems.map(n => n.content);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0 && !isLoading) return null;

  return (
    <div className="w-full bg-secondary/50 border border-border rounded-xl overflow-hidden" dir="rtl">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 py-3 bg-primary">
          <Newspaper className="w-5 h-5 text-primary-foreground" />
        </div>

        <div className="flex-1 overflow-hidden py-3 px-4 h-10 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-x-4 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-muted-foreground text-sm truncate">{items[currentIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="flex flex-col px-2">
            <button onClick={() => setCurrentIndex(prev => (prev - 1 + items.length) % items.length)}
              className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setCurrentIndex(prev => (prev + 1) % items.length)}
              className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsTicker;
