import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Wifi, Smartphone, MessageCircle, Facebook, Lock, Radar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const TechBlogPromoCard: React.FC = () => {
  const navigate = useNavigate();
  const { getSetting } = useSiteSettings();

  const from = getSetting('tech_blog_gradient_from', '#0f172a');
  const to = getSetting('tech_blog_gradient_to', '#0ea5e9');
  const title = getSetting('tech_blog_title', 'تدوينات معلوماتية');
  const subtitle = getSetting('tech_blog_subtitle', 'الأمن والمعلومات · الحماية من الثغرات والاختراقات · نصائح وحلول');

  const floatIcons = [
    { Icon: MessageCircle, color: '#25d366', top: '14%', left: '8%', d: 0 },
    { Icon: Facebook, color: '#4c9aff', top: '58%', left: '18%', d: 0.6 },
    { Icon: Smartphone, color: '#a3e635', top: '22%', left: '32%', d: 1.2 },
    { Icon: Lock, color: '#fbbf24', top: '68%', left: '40%', d: 1.8 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/tech-blog')}
      className="relative cursor-pointer overflow-hidden rounded-2xl p-[2px] shadow-lg transition-shadow duration-500 hover:shadow-2xl"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div className="relative overflow-hidden rounded-[14px] p-5" style={{ background: `linear-gradient(135deg, ${from}f2, ${to}e6)` }}>
        {/* شبكة تقنية */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        {/* مسح راداري */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="absolute -top-16 -left-16 w-56 h-56 rounded-full"
          style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,.22) 40deg, transparent 90deg)' }}
        />
        {/* موجات الواي فاي */}
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="absolute rounded-full border border-white/25"
            style={{ width: 70 + i * 55, height: 70 + i * 55, bottom: -30, right: -20 }}
            animate={{ opacity: [0.05, 0.45, 0.05], scale: [0.9, 1.08, 0.9] }}
            transition={{ repeat: Infinity, duration: 2.6, delay: i * 0.45 }}
          />
        ))}
        {/* أيقونات متحركة */}
        {floatIcons.map(({ Icon, color, top, left, d }, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ top, left }}
            animate={{ y: [0, -10, 0], opacity: [0.35, 1, 0.35] }}
            transition={{ repeat: Infinity, duration: 3.2, delay: d }}
          >
            <Icon className="w-4 h-4 drop-shadow" style={{ color }} />
          </motion.div>
        ))}

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.div
              animate={{ boxShadow: ['0 0 0 0 rgba(255,255,255,.35)', '0 0 0 12px rgba(255,255,255,0)'] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/30"
            >
              <ShieldCheck className="w-7 h-7 text-white drop-shadow" />
            </motion.div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-white truncate">{title}</h3>
              <p className="text-white/85 text-xs mt-0.5 line-clamp-2">{subtitle}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {[Wifi, Radar, Lock].map((I, i) => (
                  <motion.span
                    key={i}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.3 }}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-white/15 border border-white/20"
                  >
                    <I className="w-3.5 h-3.5 text-white" />
                  </motion.span>
                ))}
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

export default TechBlogPromoCard;
