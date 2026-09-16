import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeTextProps {
  title: string;
  subtitle?: string;
}

/** رسالة ترحيب بتدرج أزرق/أحمر مع خطوط زخرفية ونقاط جانبية */
const WelcomeText: React.FC<WelcomeTextProps> = ({ title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="text-center"
  >
    <div className="flex items-center justify-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
      <span className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-accent" />
      <h2 className="text-lg sm:text-2xl font-extrabold text-gradient-duo px-1">{title}</h2>
      <span className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-primary" />
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
    </div>
    {subtitle && <p className="mt-2 text-sm sm:text-base text-muted-foreground">{subtitle}</p>}
  </motion.div>
);

export default WelcomeText;
