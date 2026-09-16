import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ShoppingCart, ShieldCheck, UserPlus, CheckCircle2, MessageSquare } from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageSeo from '@/components/PageSeo';
import { useWifiProduct } from '@/hooks/useWifiSystemDetails';
import { useWifiOrders } from '@/hooks/useWifiOrders';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useGuestAction } from '@/contexts/GuestActionContext';

const countryCodes = [
  { code: '+967', country: 'اليمن 🇾🇪' },
  { code: '+966', country: 'السعودية 🇸🇦' },
  { code: '+971', country: 'الإمارات 🇦🇪' },
  { code: '+968', country: 'عُمان 🇴🇲' },
  { code: '+974', country: 'قطر 🇶🇦' },
  { code: '+973', country: 'البحرين 🇧🇭' },
  { code: '+965', country: 'الكويت 🇰🇼' },
  { code: '+20', country: 'مصر 🇪🇬' },
  { code: '+962', country: 'الأردن 🇯🇴' },
  { code: '+964', country: 'العراق 🇮🇶' },
  { code: '+90', country: 'تركيا 🇹🇷' },
];

const WifiPurchasePage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, isLoading } = useWifiProduct(productId);
  const { createOrder } = useWifiOrders();
  const { user, profile } = useAuth();
  const { requireAccount } = useGuestAction();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    customer_name: profile?.name || '',
    customer_phone: '',
    country_code: '+967',
    country: 'اليمن',
    customer_email: user?.email || '',
    details: '',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">النظام غير موجود</p>
        <Button onClick={() => navigate('/wifi-networks')}>العودة</Button>
      </div>
    );
  }

  const finalPrice = product.discount_percent
    ? Number((product.price * (1 - product.discount_percent / 100)).toFixed(0))
    : Number(product.price || 0);

  const submit = async () => {
    if (!requireAccount(undefined, { action: 'purchase', title: 'الشراء يتطلب حساباً', description: 'سجّل حسابك المجاني لإتمام الطلب ومتابعته والتواصل مع الإدارة بشأنه.' })) return;
    if (!form.customer_name.trim()) return toast({ title: 'الاسم الكامل مطلوب', variant: 'destructive' });
    if (!/^[0-9]{6,15}$/.test(form.customer_phone.replace(/\s/g, ''))) {
      return toast({ title: 'رقم الهاتف مطلوب وبصيغة صحيحة', variant: 'destructive' });
    }
    if (form.customer_email && !/^\S+@\S+\.\S+$/.test(form.customer_email)) {
      return toast({ title: 'البريد الإلكتروني غير صحيح', variant: 'destructive' });
    }
    await createOrder.mutateAsync({
      product_id: product.id,
      product_name: product.name,
      section: product.category,
      customer_name: form.customer_name.trim(),
      country: form.country,
      country_code: form.country_code,
      customer_phone: form.customer_phone.trim(),
      customer_email: form.customer_email.trim() || null,
      order_type: 'purchase',
      title: `شراء ${product.name}`,
      details: form.details.trim(),
      price: finalPrice,
    } as any);
    setDone(true);
  };

  return (
    <>
      <PageSeo title={`شراء ${product.name} | ابوطلال للدعاية والإعلان والتسويق الإلكتروني`} description={`إتمام طلب شراء ${product.name}`} path={`/wifi-networks/${product.id}/purchase`} />
      <div className="min-h-screen bg-background">
        <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
        <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

        <main className="pt-20 pb-28 px-4">
          <div className="container mx-auto max-w-2xl space-y-5">
            <Button variant="ghost" onClick={() => navigate(`/wifi-networks/${product.id}`)}>
              <ArrowRight className="w-4 h-4 ml-2" /> رجوع
            </Button>

            {done ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-border gradient-card p-6 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto" />
                <h1 className="text-xl font-bold text-foreground">تم إرسال طلب الشراء بنجاح</h1>
                <p className="text-sm text-muted-foreground">سيتواصل معك فريق الإدارة عبر رقم الهاتف أو البريد المسجّل لإتمام العملية.</p>
                {user ? (
                  <Button className="w-full" onClick={() => navigate('/messages')}>
                    <MessageSquare className="w-4 h-4 ml-2" /> متابعة الطلب والمراسلة
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => navigate('/auth?mode=register')}>
                    <UserPlus className="w-4 h-4 ml-2" /> سجّل الآن لمتابعة طلبك
                  </Button>
                )}
                <Button variant="outline" className="w-full" onClick={() => navigate('/wifi-networks')}>العودة للأنظمة</Button>
              </motion.div>
            ) : (
              <>
                {/* Auto product summary */}
                <div className="rounded-2xl border border-border gradient-card p-4 flex gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                    {(product.logo_url || product.image_url)
                      ? <img src={product.logo_url || product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      : <ShoppingCart className="w-7 h-7 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="font-bold text-foreground truncate">{product.name}</h1>
                    <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-[11px] text-muted-foreground">
                      {product.os && <Badge variant="secondary">{product.os}</Badge>}
                      {product.size && <Badge variant="secondary">{product.size}</Badge>}
                      {product.version && <Badge variant="secondary">v{product.version}</Badge>}
                      {product.developer_name && <Badge variant="secondary">{product.developer_name}</Badge>}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">${finalPrice}</span>
                      {product.discount_percent ? (
                        <span className="text-xs text-muted-foreground line-through">${product.price}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border p-4 space-y-4">
                  <h2 className="font-bold text-foreground">بيانات المشتري</h2>
                  <div>
                    <Label>الاسم الكامل *</Label>
                    <Input value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })} maxLength={100} placeholder="الاسم الثلاثي" />
                  </div>
                  <div>
                    <Label>رقم الهاتف *</Label>
                    <div className="flex gap-2">
                      <Select value={form.country_code} onValueChange={v => setForm({ ...form, country_code: v })}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {countryCodes.map(c => <SelectItem key={c.code} value={c.code}>{c.country} {c.code}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input className="flex-1" inputMode="numeric" value={form.customer_phone}
                        onChange={e => setForm({ ...form, customer_phone: e.target.value })} placeholder="7xxxxxxxx" maxLength={15} />
                    </div>
                  </div>
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" value={form.customer_email} onChange={e => setForm({ ...form, customer_email: e.target.value })} placeholder="name@example.com" maxLength={255} />
                  </div>
                  <div>
                    <Label>ملاحظات إضافية</Label>
                    <Textarea rows={3} value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} maxLength={1000} placeholder="أي تفاصيل تخص طلبك..." />
                  </div>

                  {!user && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground flex gap-2">
                      <UserPlus className="w-4 h-4 text-primary shrink-0" />
                      <span>لمتابعة حالة طلبك ومراسلة الإدارة، يرجى <button className="text-primary underline" onClick={() => navigate('/auth')}>التسجيل أو تسجيل الدخول</button>.</span>
                    </div>
                  )}

                  <Button className="w-full h-12" onClick={submit} disabled={createOrder.isPending}>
                    <ShoppingCart className="w-5 h-5 ml-2" /> تأكيد طلب الشراء
                  </Button>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 justify-center">
                    <ShieldCheck className="w-3 h-3" /> بياناتك محفوظة ولا تُستخدم إلا لإتمام الطلب
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
        <BottomNav />
      </div>
    </>
  );
};

export default WifiPurchasePage;