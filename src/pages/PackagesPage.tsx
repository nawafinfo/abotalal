import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Diamond, Award, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import SocialIcons from '@/components/SocialIcons';
import PageSeo from '@/components/PageSeo';
import { usePackages, Package } from '@/hooks/usePackages';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useGuestAction } from '@/contexts/GuestActionContext';

const typeConfig: Record<string, { icon: React.ComponentType<any>; gradient: string; badge: string; border: string }> = {
  gold: { icon: Crown, gradient: 'from-amber-400 via-yellow-500 to-amber-600', badge: 'ذهبية', border: 'border-amber-400/40' },
  diamond: { icon: Diamond, gradient: 'from-sky-400 via-blue-500 to-indigo-600', badge: 'ماسية', border: 'border-sky-400/40' },
  silver: { icon: Award, gradient: 'from-slate-300 via-gray-400 to-slate-500', badge: 'فضية', border: 'border-slate-400/40' },
};

const countryCodes = [
  { code: '+967', country: 'اليمن 🇾🇪' },
  { code: '+966', country: 'السعودية 🇸🇦' },
  { code: '+971', country: 'الإمارات 🇦🇪' },
  { code: '+974', country: 'قطر 🇶🇦' },
  { code: '+973', country: 'البحرين 🇧🇭' },
  { code: '+968', country: 'عُمان 🇴🇲' },
  { code: '+965', country: 'الكويت 🇰🇼' },
  { code: '+20', country: 'مصر 🇪🇬' },
  { code: '+962', country: 'الأردن 🇯🇴' },
  { code: '+964', country: 'العراق 🇮🇶' },
  { code: '+963', country: 'سوريا 🇸🇾' },
  { code: '+961', country: 'لبنان 🇱🇧' },
  { code: '+212', country: 'المغرب 🇲🇦' },
  { code: '+216', country: 'تونس 🇹🇳' },
  { code: '+213', country: 'الجزائر 🇩🇿' },
  { code: '+249', country: 'السودان 🇸🇩' },
  { code: '+218', country: 'ليبيا 🇱🇾' },
  { code: '+90', country: 'تركيا 🇹🇷' },
  { code: '+1', country: 'أمريكا 🇺🇸' },
  { code: '+44', country: 'بريطانيا 🇬🇧' },
];

const PackagesPage: React.FC = () => {
  const { requireAccount } = useGuestAction();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+967');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { packages, isLoading, createSubscription } = usePackages();
  const { user } = useAuth();
  const { toast } = useToast();

  const activePackages = packages.filter(p => p.is_active);

  const handleSubscribe = async () => {
    if (!requireAccount(undefined, { action: 'subscribe', title: 'الاشتراك يتطلب حساباً', description: 'سجّل حسابك المجاني للاشتراك في الباقة ومتابعة اشتراكك ومراسلة الإدارة.' })) return;
    if (!selectedPkg || !customerName.trim() || !customerPhone.trim()) {
      toast({ title: 'خطأ', description: 'يرجى ملء جميع الحقول', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await createSubscription({
      package_id: selectedPkg.id,
      package_name: selectedPkg.name,
      package_type: selectedPkg.type,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      country_code: countryCode,
      user_id: user?.id || null,
    });

    if (error) {
      toast({ title: 'خطأ', description: 'فشل في إرسال الطلب', variant: 'destructive' });
    } else {
      toast({ title: 'تم بنجاح! ✨', description: `تم إرسال طلب الاشتراك في ${selectedPkg.name}` });
      setSelectedPkg(null);
      setCustomerName('');
      setCustomerPhone('');
    }
    setIsSubmitting(false);
  };

  // Auto-detect country code from phone
  const handlePhoneChange = (value: string) => {
    setCustomerPhone(value);
    const match = countryCodes.find(c => value.startsWith(c.code.replace('+', '')));
    if (match) setCountryCode(match.code);
  };

  const getDiscountedPrice = (pkg: Package) => {
    if (pkg.discount_percent > 0) {
      return pkg.price - (pkg.price * pkg.discount_percent / 100);
    }
    return pkg.price;
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title="باقات ابوطلال | ذهبية، ماسية وفضية"
        description="اكتشف باقاتنا الاحترافية للدعاية والإعلان: الذهبية، الماسية، والفضية بأسعار تنافسية وميزات متكاملة."
        path="/packages"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'باقات ابوطلال للدعاية والإعلان والتسويق الإلكتروني',
          description: 'باقات خدمات دعاية وإعلان وتسويق إلكتروني بمستويات ذهبية وماسية وفضية.',
          brand: { '@type': 'Brand', name: 'ابوطلال للدعاية والإعلان والتسويق الإلكتروني' },
          offers: { '@type': 'AggregateOffer', priceCurrency: 'YER', offerCount: 3 },
        }}
      />
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">عروض حصرية</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">باقاتنا المميزة</h1>
            <p className="text-muted-foreground">اختر الباقة المناسبة لاحتياجاتك</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : activePackages.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">لا توجد باقات متاحة حالياً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePackages.map((pkg, index) => {
                const config = typeConfig[pkg.type] || typeConfig.gold;
                const Icon = config.icon;
                const discountedPrice = getDiscountedPrice(pkg);

                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                  >
                    <Card className={`relative overflow-hidden border-2 ${config.border} hover:shadow-2xl transition-all duration-500 group`}>
                      {/* Gradient header */}
                      <div className={`bg-gradient-to-br ${config.gradient} p-6 text-white text-center relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10">
                          <Icon className="w-12 h-12 mx-auto mb-3 drop-shadow-lg" />
                          <Badge className="bg-white/20 text-white border-white/30 mb-2">
                            {config.badge}
                          </Badge>
                          <h3 className="text-xl font-bold">{pkg.name}</h3>
                        </div>
                      </div>

                      <CardContent className="p-6 space-y-4">
                        {pkg.description && (
                          <p className="text-sm text-muted-foreground text-center">{pkg.description}</p>
                        )}

                        {/* Price */}
                        <div className="text-center">
                          {pkg.discount_percent > 0 && (
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <span className="text-sm text-muted-foreground line-through">${pkg.price}</span>
                              <Badge variant="destructive" className="text-xs">خصم {pkg.discount_percent}%</Badge>
                            </div>
                          )}
                          <div className="text-3xl font-bold text-foreground">
                            ${discountedPrice.toFixed(0)}
                          </div>
                        </div>

                        {/* Features */}
                        {pkg.features && pkg.features.length > 0 && (
                          <ul className="space-y-2">
                            {pkg.features.map((feature, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}

                        <Button
                          className={`w-full bg-gradient-to-r ${config.gradient} text-white hover:opacity-90 transition-opacity`}
                          onClick={() => setSelectedPkg(pkg)}
                        >
                          اشترك الآن
                          <ArrowRight className="w-4 h-4 mr-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <SocialIcons />
          </motion.div>
        </div>
      </main>

      {/* Subscription Dialog */}
      <Dialog open={!!selectedPkg} onOpenChange={() => setSelectedPkg(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">اشتراك في باقة</DialogTitle>
          </DialogHeader>
          {selectedPkg && (
            <div className="space-y-4">
              <div className={`bg-gradient-to-r ${(typeConfig[selectedPkg.type] || typeConfig.gold).gradient} rounded-lg p-4 text-white text-center`}>
                <p className="font-bold text-lg">{selectedPkg.name}</p>
                <Badge className="bg-white/20 text-white border-white/30 mt-1">
                  {(typeConfig[selectedPkg.type] || typeConfig.gold).badge}
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>الاسم الكامل</Label>
                  <Input
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    className="text-right"
                  />
                </div>

                <div>
                  <Label>رقم الهاتف</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map(c => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.country} {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={customerPhone}
                      onChange={e => handlePhoneChange(e.target.value)}
                      placeholder="رقم الهاتف"
                      className="flex-1 text-right"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleSubscribe}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الاشتراك'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default PackagesPage;
