import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Users, Award, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import PageSeo from '@/components/PageSeo';

const features = [
  { icon: Target, title: 'رؤية واضحة', description: 'نسعى لتقديم أفضل الخدمات الإعلانية' },
  { icon: Users, title: 'فريق متميز', description: 'خبراء في مجالات الدعاية والتسويق' },
  { icon: Award, title: 'جودة عالية', description: 'نلتزم بأعلى معايير الجودة' },
  { icon: Clock, title: 'دعم متواصل', description: 'متاحون لخدمتكم على مدار الساعة' },
];

const AboutPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/967778215553', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="من نحن | ابوطلال للدعاية والإعلان والتسويق الإلكتروني"
        description="تعرف على ابوطلال للدعاية والإعلان والتسويق الإلكتروني، فريقنا، ورؤيتنا في تقديم خدمات الدعاية والإعلان والتسويق الإلكتروني بجودة عالية."
        path="/about"
      />
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            رجوع
          </Button>

          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-gold mb-4">
              من نحن
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ابوطلال للدعاية والإعلان والتسويق الإلكتروني هي شركة متخصصة في خدمات الدعاية والإعلان والتسويق الإلكتروني، 
              نسعى لتقديم حلول إبداعية متكاملة تساعد عملائنا على تحقيق أهدافهم التسويقية
            </p>
          </motion.section>

          {/* Features Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="p-6 bg-card border border-border rounded-2xl"
                >
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.section>

          {/* Why Choose Us */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">لماذا تختارنا؟</h2>
            <div className="space-y-4">
              {[
                'خبرة واسعة في مجال الدعاية والإعلان',
                'فريق متخصص ومحترف',
                'أسعار تنافسية ومناسبة',
                'التزام بالمواعيد والجودة',
                'دعم فني متواصل',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Button
              onClick={openWhatsApp}
              className="gradient-gold text-primary-foreground h-12 px-8 text-lg"
            >
              تواصل معنا الآن
            </Button>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AboutPage;
