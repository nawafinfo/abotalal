import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { services } from '@/data/services';
import PageSeo from '@/components/PageSeo';
import { useGuestAction } from '@/contexts/GuestActionContext';

const serviceDetails: Record<string, { features: string[]; benefits: string[] }> = {
  advertising: {
    features: [
      'تصميم حملات إعلانية مبتكرة',
      'إعلانات على جميع المنصات',
      'تحليل وتقارير الأداء',
      'استهداف الجمهور المناسب',
    ],
    benefits: [
      'زيادة الوعي بالعلامة التجارية',
      'جذب عملاء جدد',
      'تحسين المبيعات',
      'بناء سمعة قوية',
    ],
  },
  marketing: {
    features: [
      'استراتيجيات تسويق رقمي',
      'إدارة حملات السوشيال ميديا',
      'تحسين محركات البحث SEO',
      'التسويق بالمحتوى',
    ],
    benefits: [
      'زيادة التواجد الرقمي',
      'تحسين معدل التحويل',
      'بناء علاقات مع العملاء',
      'نمو مستدام للأعمال',
    ],
  },
  pages: {
    features: [
      'إدارة صفحات السوشيال ميديا',
      'جدولة المحتوى',
      'تمويل وترويج الصفحات',
      'الرد على التعليقات والرسائل',
    ],
    benefits: [
      'توفير الوقت والجهد',
      'محتوى احترافي مستمر',
      'تفاعل أعلى مع الجمهور',
      'نمو المتابعين',
    ],
  },
  websites: {
    features: [
      'تصميم مواقع احترافية',
      'تطوير متاجر إلكترونية',
      'صيانة وتحديث المواقع',
      'استضافة آمنة',
    ],
    benefits: [
      'تواجد رقمي قوي',
      'مبيعات على مدار الساعة',
      'مصداقية أعلى',
      'وصول عالمي',
    ],
  },
  apps: {
    features: [
      'تطوير تطبيقات iOS و Android',
      'تصميم واجهات مستخدم',
      'صيانة وتحديث التطبيقات',
      'نشر على المتاجر',
    ],
    benefits: [
      'تواصل مباشر مع العملاء',
      'تجربة مستخدم مميزة',
      'ولاء أعلى للعملاء',
      'ميزة تنافسية',
    ],
  },
  montage: {
    features: [
      'مونتاج فيديو احترافي',
      'موشن جرافيك',
      'تصحيح ألوان',
      'إضافة مؤثرات بصرية',
    ],
    benefits: [
      'محتوى جذاب ومميز',
      'رسالة واضحة ومؤثرة',
      'جودة عالية',
      'تفاعل أكبر',
    ],
  },
  security: {
    features: [
      'حماية الحسابات',
      'تأمين المواقع والتطبيقات',
      'فحص الثغرات الأمنية',
      'استعادة الحسابات',
    ],
    benefits: [
      'أمان البيانات',
      'حماية السمعة',
      'راحة البال',
      'منع الاختراقات',
    ],
  },
  printing: {
    features: [
      'طباعة بجودة عالية',
      'كروت أعمال',
      'بروشورات ومطويات',
      'لوحات إعلانية',
    ],
    benefits: [
      'مظهر احترافي',
      'دعاية ملموسة',
      'تأثير دائم',
      'تكلفة مناسبة',
    ],
  },
};

const ServicePage: React.FC = () => {
  const { requireAccount } = useGuestAction();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const service = services.find((s) => s.id === serviceId);
  const details = serviceId ? serviceDetails[serviceId] : null;

  const openWhatsApp = () => {
    const text = `مرحباً، أريد الاستفسار عن خدمة ${service?.title}`;
    window.open(`https://wa.me/967778215553?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">الخدمة غير موجودة</p>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={`${service.title} | ابوطلال للدعاية والإعلان والتسويق الإلكتروني`}
        description={service.description || `تعرف على خدمة ${service.title} من ابوطلال للدعاية والإعلان والتسويق الإلكتروني للدعاية والإعلان والتسويق الإلكتروني.`}
        path={`/services/${serviceId}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.description || `خدمة ${service.title} من ابوطلال للدعاية والإعلان والتسويق الإلكتروني.`,
          provider: { '@type': 'Organization', name: 'ابوطلال للدعاية والإعلان والتسويق الإلكتروني' },
        }}
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
            <div
              className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{service.title}</h1>
            <p className="text-muted-foreground">{service.description}</p>
          </motion.div>

          {/* Features */}
          {details && (
            <>
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 mb-6"
              >
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  المميزات
                </h2>
                <div className="space-y-3">
                  {details.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-6 mb-8"
              >
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  الفوائد
                </h2>
                <div className="space-y-3">
                  {details.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            </>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <Button
              onClick={() => requireAccount(openWhatsApp, { action: 'order', title: 'طلب الخدمة يتطلب حساباً', description: 'سجّل حسابك المجاني لطلب الخدمة ومتابعة طلبك والحصول على الدعم الكامل.' })}
              className="w-full h-14 gradient-gold text-primary-foreground font-bold text-lg"
            >
              طلب الخدمة عبر واتساب
            </Button>
            <Button
              variant="outline"
              onClick={() => requireAccount(() => navigate('/booking'), { action: 'booking', title: 'الحجز يتطلب حساباً', description: 'سجّل حسابك المجاني لحجز موعد ومتابعة حالته.' })}
              className="w-full h-12"
            >
              حجز موعد
            </Button>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ServicePage;
