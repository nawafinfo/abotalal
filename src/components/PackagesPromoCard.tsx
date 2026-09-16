import React from 'react';
import { motion } from 'framer-motion';
import { Crown, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PackagesPromoCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/packages')}
      className="relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 p-[2px] shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-shadow duration-500"
    >
      <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-blue-500/95 via-blue-600/95 to-blue-800/95 p-5">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            >
              <Crown className="w-7 h-7 text-white drop-shadow" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">اطلع على باقاتنا الجديدة</h3>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Sparkles className="w-4 h-4 text-white/80" />
                </motion.div>
              </div>
              <p className="text-white/80 text-sm mt-0.5">عروض وخصومات حصرية لفترة محدودة</p>
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

export default PackagesPromoCard;
