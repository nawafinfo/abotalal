import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Download, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppsPromoCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/apps-store')}
      className="relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-800 p-[2px] shadow-lg shadow-sky-600/25 hover:shadow-xl hover:shadow-sky-600/35 transition-shadow duration-500"
    >
      <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-sky-500/95 via-blue-600/95 to-indigo-800/95 p-5">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
            >
              {/* Android-style robot icon */}
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow" fill="currentColor">
                <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
              </svg>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">تطبيقاتنا</h3>
                <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                  <Download className="w-4 h-4 text-white/80" />
                </motion.div>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-white/80 text-sm">تطبيقات آمنة وسهلة التحميل</p>
                <Shield className="w-3.5 h-3.5 text-white/60" />
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

export default AppsPromoCard;
