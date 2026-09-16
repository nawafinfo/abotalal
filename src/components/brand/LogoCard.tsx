import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LogoCardProps {
  logoUrl?: string;
  alt?: string;
  size?: number;
}

/** بطاقة بيضاء بحواف دائرية وظل ناعم تحتضن شعار المنصة */
const LogoCard: React.FC<LogoCardProps> = ({ logoUrl, alt = 'شعار المنصة', size = 128 }) => (
  <motion.div
    initial={{ scale: 0.6, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8, ease: 'backOut' }}
    className="relative"
  >
    <div
      className="absolute inset-0 blur-2xl opacity-40 rounded-[2rem]"
      style={{ background: 'var(--gradient-duo)' }}
      aria-hidden="true"
    />
    <div
      className="relative bg-card rounded-[1.75rem] p-4 shadow-elevated border border-border/60 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={alt} className="w-full h-full object-contain rounded-2xl" />
      ) : (
        <Sparkles className="text-primary" style={{ width: size / 2, height: size / 2 }} />
      )}
    </div>
  </motion.div>
);

export default LogoCard;
