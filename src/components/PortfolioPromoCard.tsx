import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioPromoCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/portfolio')}
        className="relative overflow-hidden rounded-2xl cursor-pointer group"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900" />
        
        {/* Animated decorations */}
        <motion.div
          className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/10 blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-pink-400/20 blur-lg"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        
        {/* Floating sparkles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: `${20 + i * 15}%`, left: `${10 + i * 18}%` }}
            animate={{ y: [-5, 5, -5], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          >
            <Sparkles className="w-3 h-3 text-yellow-300/60" />
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative p-5 flex items-center gap-4">
          <motion.div
            className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Palette className="w-7 h-7 text-white" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg mb-1">معرض أعمالنا</h3>
            <p className="text-white/80 text-xs leading-relaxed">
              تصاميم احترافية · هويات تجارية · مطبوعات دعائية
            </p>
          </div>

          <motion.div
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default PortfolioPromoCard;
