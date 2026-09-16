import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import PageSeo from '@/components/PageSeo';

const contactMethods = [
  {
    icon: Phone,
    title: 'الهاتف',
    value: '778215553',
    action: () => window.open('tel:+967778215553'),
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
    title: 'واتساب',
    value: '778215553',
    action: () => window.open('https://wa.me/967778215553', '_blank'),
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    value: 'info@abotalal.com',
    action: () => window.open('mailto:info@abotalal.com'),
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Clock,
    title: 'أوقات العمل',
    value: 'على مدار الساعة',
    action: null,
    color: 'from-amber-500 to-orange-600',
  },
];

const ContactPage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const openWhatsApp = () => {
    window.open('https://wa.me/967778215553', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="تواصل معنا | ابوطلال للدعاية والإعلان والتسويق الإلكتروني"
        description="تواصل مع فريق ابوطلال للدعاية والإعلان والتسويق الإلكتروني عبر الهاتف أو واتساب أو البريد للاستفسار عن خدمات الدعاية والإعلان والتسويق."
        path="/contact"
      />
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-lg">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            رجوع
          </Button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-gold flex items-center justify-center">
              <Phone className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">اتصل بنا</h1>
            <p className="text-muted-foreground">نحن هنا لخدمتك، تواصل معنا الآن</p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  onClick={method.action || undefined}
                  disabled={!method.action}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors disabled:cursor-default"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="font-semibold text-foreground">{method.title}</h3>
                    <p className="text-muted-foreground text-sm">{method.value}</p>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={openWhatsApp}
              className="w-full h-14 gradient-gold text-primary-foreground font-bold text-lg"
            >
              <Send className="w-5 h-5 ml-2" />
              تواصل عبر واتساب الآن
            </Button>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ContactPage;
