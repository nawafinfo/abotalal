import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import WaveBackground from '@/components/brand/WaveBackground';
import LogoCard from '@/components/brand/LogoCard';
import BrandTitle from '@/components/brand/BrandTitle';
import WelcomeText from '@/components/brand/WelcomeText';
import DateTimeCard from '@/components/brand/DateTimeCard';
import PageIndicators from '@/components/brand/PageIndicators';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { getSetting, getBool } = useSiteSettings();

  const duration = parseInt(getSetting('splash_duration', '5000'), 10) || 5000;
  const logoUrl = getSetting('site_logo_url');
  const logoSize = parseInt(getSetting('splash_logo_size', '140'), 10) || 140;
  const title = getSetting('splash_title') || getSetting('site_name') || 'ابوطلال للدعاية والإعلان والتسويق الإلكتروني';
  const subtitle =
    getSetting('splash_subtitle') ||
    getSetting('site_tagline') ||
    'خدمات الدعاية والإعلان والتسويق الإلكتروني والبرمجة والتطوير والإنتاج الفني';

  useEffect(() => {
    const splashTimer = setTimeout(() => onComplete(), duration);
    return () => clearTimeout(splashTimer);
  }, [onComplete, duration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-hidden bg-background"
    >
      <WaveBackground className="platform-glow" />

      <div className="relative z-10 h-full w-full overflow-y-auto flex flex-col items-center justify-center gap-6 sm:gap-8 px-5 py-10 text-center">
        {getBool('splash_show_logo') && (
          <LogoCard logoUrl={logoUrl} alt={title} size={logoSize} />
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-3 max-w-xl"
        >
          <BrandTitle title={title} className="text-3xl sm:text-5xl" />
          {subtitle && (
            <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed px-2">{subtitle}</p>
          )}
        </motion.div>

        <WelcomeText
          title={getSetting('splash_welcome', 'مرحباً بك عزيزنا العميل')}
          subtitle={getSetting('splash_welcome_sub', 'نسعد بخدمتكم دائماً')}
        />

        {getBool('splash_show_time') && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full"
          >
            <DateTimeCard />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="pt-2"
        >
          <PageIndicators count={3} active={0} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
