import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Radio, Tv, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LiveStreamPromoCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/live-stream')}
      className="relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-pink-700 p-[2px] shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-shadow duration-500"
    >
      <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-red-500/90 via-rose-600/90 to-pink-700/90 p-5">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full" />
        
        {/* Pulsing live indicator */}
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-3 left-3 w-3 h-3 bg-white rounded-full"
        />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            >
              <Radio className="w-7 h-7 text-white drop-shadow" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">البث المباشر</h3>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="px-2 py-0.5 bg-white/25 rounded-full"
                >
                  <span className="text-[10px] font-bold text-white">LIVE</span>
                </motion.div>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <p className="text-white/80 text-xs">أخبار وتغطيات</p>
                <span className="text-white/40 text-xs">/</span>
                <p className="text-white/80 text-xs">ترفيه</p>
                <span className="text-white/40 text-xs">/</span>
                <p className="text-white/80 text-xs">مسلسلات وأفلام</p>
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

export default LiveStreamPromoCard;
