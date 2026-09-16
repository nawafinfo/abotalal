import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Radio, Shield, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WifiPromoCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      onClick={() => navigate('/wifi-networks')}
      className="cursor-pointer group"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-5 shadow-lg shadow-blue-500/25">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-300/20 rounded-full translate-y-8 -translate-x-8 blur-xl" />
          {/* Signal waves */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-6 left-6 border-2 border-white/20 rounded-full"
              style={{ width: 40 + i * 30, height: 40 + i * 30 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Wifi className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-white">شبكات واي فاي</h3>
                <div className="flex items-center gap-1 mt-1">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-cyan-100">متاح الآن</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-100 text-xs">
                <Radio className="w-3.5 h-3.5" />
                <span>أنظمة تحكم وطباعة حديثة ومتطورة</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-100 text-xs">
                <Code className="w-3.5 h-3.5" />
                <span>صفحات هوتسبوت متطورة</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-100 text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>حلول برمجية وحماية متكاملة</span>
              </div>
            </div>
          </div>

          <motion.div
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <span className="text-white text-lg">←</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WifiPromoCard;
