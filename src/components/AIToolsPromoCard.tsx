import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Brain, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIToolsPromoCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/ai-tools')}
      className="relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 transition-shadow duration-500"
    >
      <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-purple-600/90 via-fuchsia-600/90 to-pink-600/90 p-5">
        {/* Animated background */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"
        />

        {/* Sparkle decorations */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top: `${20 + i * 15}%`, left: `${10 + i * 22}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
          >
            <Sparkles className="w-3 h-3 text-white/70" />
          </motion.div>
        ))}

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30"
            >
              <Brain className="w-7 h-7 text-white drop-shadow" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">أدوات ونماذج الذكاء الاصطناعي</h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-white/90 text-sm">أقوى أدوات AI في مكان واحد</p>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ x: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIToolsPromoCard;