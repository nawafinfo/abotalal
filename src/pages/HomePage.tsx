import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import HeroSlider from '@/components/HeroSlider';
import NewsTicker from '@/components/NewsTicker';
import ServiceGrid from '@/components/ServiceGrid';
import PackagesPromoCard from '@/components/PackagesPromoCard';
import AppsPromoCard from '@/components/AppsPromoCard';
import LiveStreamPromoCard from '@/components/LiveStreamPromoCard';
import WifiPromoCard from '@/components/WifiPromoCard';
import PortfolioPromoCard from '@/components/PortfolioPromoCard';
import AIToolsPromoCard from '@/components/AIToolsPromoCard';
import TechBlogPromoCard from '@/components/TechBlogPromoCard';
import SocialIcons from '@/components/SocialIcons';
import FeaturedClientsSection from '@/components/FeaturedClientsSection';
import CustomHomeCards from '@/components/CustomHomeCards';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const HomePage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { getBool, getSetting } = useSiteSettings();

  const show = (key: string) => getBool(key);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>ابوطلال للدعاية والإعلان والتسويق الإلكتروني | خدمات الدعاية والإعلان والتسويق</title>
        <meta name="description" content="ابوطلال للدعاية والإعلان والتسويق الإلكتروني للدعاية والإعلان والتسويق الإلكتروني وإدارة المواقع والمونتاج والحماية — خدمات احترافية متكاملة." />
        <link rel="canonical" href="https://abdulhamid-hub.lovable.app/" />
        <meta property="og:title" content="ابوطلال للدعاية والإعلان والتسويق الإلكتروني | خدمات الدعاية والإعلان والتسويق" />
        <meta property="og:description" content="خدمات دعاية وإعلان وتسويق إلكتروني احترافية متكاملة." />
        <meta property="og:url" content="https://abdulhamid-hub.lovable.app/" />
      </Helmet>
      <h1 className="sr-only">ابوطلال للدعاية والإعلان والتسويق الإلكتروني — خدمات التسويق والدعاية والإعلان المتكاملة</h1>
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <HeroSlider />
          </motion.section>

          {show('show_news') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <NewsTicker />
            </motion.section>
          )}

          {true && (
            <>
              {show('show_packages') && <PackagesPromoCard />}
              {show('show_apps') && <AppsPromoCard />}
              {show('show_ai_tools') && <AIToolsPromoCard />}
              {show('show_tech_blog') && <TechBlogPromoCard />}
              {show('show_livestream') && <LiveStreamPromoCard />}
              {show('show_wifi') && <WifiPromoCard />}
              {show('show_portfolio') && <PortfolioPromoCard />}

              <CustomHomeCards />

              {show('show_services') && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">{getSetting('home_services_title', 'خدماتنا')}</h2>
                    <span className="text-sm text-muted-foreground">{getSetting('home_services_subtitle', '')}</span>
                  </div>
                  <ServiceGrid />
                </motion.section>
              )}

              {show('show_featured_clients') && <FeaturedClientsSection />}
            </>
          )}

          {show('show_social') && (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-foreground mb-1">{getSetting('home_social_title', 'تابعنا على')}</h3>
              </div>
              <SocialIcons />
            </motion.section>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;
