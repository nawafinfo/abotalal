import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Camera, Save, User, Package, Calendar, Clock, 
  CheckCircle, XCircle, AlertCircle, Hash, Mail, Shield, Gift
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import ReferralSection from '@/components/ReferralSection';
import OrderTracker from '@/components/OrderTracker';
import { uploadToBucket } from '@/lib/uploadFile';

interface Order {
  id: string;
  customer_name: string;
  description: string | null;
  status: string;
  total_amount: number | null;
  created_at: string;
  service?: { name: string } | null;
}

interface Booking {
  id: string;
  customer_name: string;
  notes: string | null;
  status: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  created_at: string;
  service?: { name: string } | null;
}

interface WifiOrder {
  id: string;
  product_name: string;
  section: string;
  status: string;
  price: number | null;
  order_type: string;
  created_at: string;
}

interface PackageSub {
  id: string;
  package_name: string;
  package_type: string;
  status: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-500/20 text-yellow-600', icon: Clock },
  confirmed: { label: 'مؤكد', color: 'bg-blue-500/20 text-blue-600', icon: AlertCircle },
  completed: { label: 'مكتمل', color: 'bg-emerald-500/20 text-emerald-600', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'bg-destructive/20 text-destructive', icon: XCircle },
  processing: { label: 'قيد التنفيذ', color: 'bg-primary/20 text-primary', icon: Clock },
  received: { label: 'تم الاستلام', color: 'bg-emerald-500/20 text-emerald-600', icon: CheckCircle },
};

const getStatus = (s: string) => statusConfig[s] || statusConfig.pending;

const ProfilePage: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wifiOrders, setWifiOrders] = useState<WifiOrder[]>([]);
  const [packageSubs, setPackageSubs] = useState<PackageSub[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const userIdShort = user?.id?.slice(0, 8).toUpperCase() || '---';

  useEffect(() => {
    if (profile?.name) setName(profile.name);
    if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      const [ordersRes, bookingsRes, wifiRes, pkgRes] = await Promise.all([
        supabase.from('orders').select('*, service:services(name)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, service:services(name)').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('wifi_orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('package_subscriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (bookingsRes.data) setBookings(bookingsRes.data as Booking[]);
      if (wifiRes.data) setWifiOrders(wifiRes.data as WifiOrder[]);
      if (pkgRes.data) setPackageSubs(pkgRes.data as PackageSub[]);
      setIsLoadingData(false);
    };
    fetchAll();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploading(true);
    const { url: publicUrl, error: uploadError } = await uploadToBucket('avatars', file, user.id);
    if (uploadError || !publicUrl) {
      toast({ title: 'خطأ', description: uploadError || 'فشل في رفع الصورة', variant: 'destructive' });
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setAvatarUrl(publicUrl);
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', user.id);
    toast({ title: 'تم الرفع', description: 'تم تحديث الصورة الشخصية' });
    setIsUploading(false);
  };

  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const confirmReceipt = async (table: 'orders' | 'wifi_orders' | 'package_subscriptions', id: string) => {
    setConfirmingId(id);
    const { error } = await supabase.from(table).update({ status: 'received' }).eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'تعذّر تأكيد الاستلام', variant: 'destructive' });
    } else {
      if (table === 'orders') setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'received' } : o)));
      if (table === 'wifi_orders') setWifiOrders(prev => prev.map(o => (o.id === id ? { ...o, status: 'received' } : o)));
      if (table === 'package_subscriptions') setPackageSubs(prev => prev.map(o => (o.id === id ? { ...o, status: 'received' } : o)));
      toast({ title: 'شكراً لك', description: 'تم تأكيد استلام الطلب بنجاح' });
    }
    setConfirmingId(null);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update({ name, avatar_url: avatarUrl }).eq('user_id', user.id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حفظ البيانات', variant: 'destructive' });
    } else {
      toast({ title: 'تم الحفظ', description: 'تم تحديث الملف الشخصي بنجاح' });
    }
    setIsSaving(false);
  };

  const totalOrders = orders.length + wifiOrders.length + packageSubs.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length + wifiOrders.filter(o => o.status === 'completed').length;
  const pendingAll = orders.filter(o => o.status === 'pending').length + bookings.filter(b => b.status === 'pending').length + wifiOrders.filter(o => o.status === 'pending').length;

  const renderStatusBadge = (status: string) => {
    const s = getStatus(status);
    const Icon = s.icon;
    return (
      <Badge className={`${s.color} gap-1`}>
        <Icon className="w-3 h-3" />{s.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="pt-20 pb-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowRight className="w-4 h-4 ml-2" />رجوع
          </Button>

          {/* Profile Header Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden mb-6">
              <div className="h-24 bg-gradient-to-l from-primary/30 via-accent/20 to-primary/10 relative">
                <div className="absolute -bottom-12 right-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{name?.charAt(0) || 'م'}</AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>
                </div>
              </div>
              <CardContent className="pt-14 pb-4 px-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{profile?.name || 'مستخدم'}</h1>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Hash className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-mono text-primary font-bold">ID: {userIdShort}</span>
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary gap-1">
                    <Shield className="w-3 h-3" />عضو
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-3 bg-secondary rounded-xl">
                    <p className="text-lg font-bold text-foreground">{totalOrders}</p>
                    <p className="text-xs text-muted-foreground">الطلبات</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-xl">
                    <p className="text-lg font-bold text-foreground">{bookings.length}</p>
                    <p className="text-xs text-muted-foreground">الحجوزات</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-xl">
                    <p className="text-lg font-bold text-emerald-500">{completedOrders}</p>
                    <p className="text-xs text-muted-foreground">المكتملة</p>
                  </div>
                </div>

                {pendingAll > 0 && (
                  <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">لديك {pendingAll} طلب/حجز بانتظار المعالجة</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Tabs defaultValue="info" dir="rtl">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="info" className="text-xs"><User className="w-3.5 h-3.5 ml-1" />البيانات</TabsTrigger>
                <TabsTrigger value="orders" className="text-xs"><Package className="w-3.5 h-3.5 ml-1" />الطلبات</TabsTrigger>
                <TabsTrigger value="bookings" className="text-xs"><Calendar className="w-3.5 h-3.5 ml-1" />الحجوزات</TabsTrigger>
                <TabsTrigger value="subscriptions" className="text-xs"><Shield className="w-3.5 h-3.5 ml-1" />الباقات</TabsTrigger>
                <TabsTrigger value="referrals" className="text-xs"><Gift className="w-3.5 h-3.5 ml-1" />الإحالات</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="info">
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">الاسم</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك الكامل" className="h-11 bg-secondary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">البريد الإلكتروني</label>
                      <Input value={user?.email || ''} className="h-11 bg-secondary text-muted-foreground" disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">رقم التعريف</label>
                      <Input value={userIdShort} className="h-11 bg-secondary text-muted-foreground font-mono" disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">تاريخ الانضمام</label>
                      <Input value={user?.created_at ? new Date(user.created_at).toLocaleDateString('ar-YE') : ''} className="h-11 bg-secondary text-muted-foreground" disabled />
                    </div>
                    <Button onClick={handleSave} disabled={isSaving} className="w-full h-11 bg-primary text-primary-foreground font-bold">
                      <Save className="w-4 h-4 ml-2" />
                      {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <div className="space-y-3">
                  {isLoadingData ? (
                    <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
                  ) : orders.length === 0 && wifiOrders.length === 0 ? (
                    <Card><CardContent className="py-8 text-center"><Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" /><p className="text-muted-foreground">لا توجد طلبات حالياً</p></CardContent></Card>
                  ) : (
                    <>
                      {orders.map(order => (
                        <Card key={order.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground text-sm">{(order.service as any)?.name || 'طلب خدمة'}</h3>
                                {order.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{order.description}</p>}
                              </div>
                              {renderStatusBadge(order.status)}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: ar })}</span>
                              {order.total_amount && <span className="font-bold text-primary">${order.total_amount}</span>}
                            </div>
                            <OrderTracker
                              status={order.status}
                              isConfirming={confirmingId === order.id}
                              onConfirmReceipt={() => confirmReceipt('orders', order.id)}
                            />
                          </CardContent>
                        </Card>
                      ))}
                      {wifiOrders.map(wo => (
                        <Card key={wo.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-foreground text-sm">{wo.product_name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{wo.section} • {wo.order_type === 'purchase' ? 'شراء' : wo.order_type === 'custom' ? 'طلب مخصص' : 'استفسار'}</p>
                              </div>
                              {renderStatusBadge(wo.status)}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{formatDistanceToNow(new Date(wo.created_at), { addSuffix: true, locale: ar })}</span>
                              {wo.price ? <span className="font-bold text-primary">${wo.price}</span> : null}
                            </div>
                            <OrderTracker
                              status={wo.status}
                              isConfirming={confirmingId === wo.id}
                              onConfirmReceipt={() => confirmReceipt('wifi_orders', wo.id)}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings">
                <div className="space-y-3">
                  {isLoadingData ? (
                    <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
                  ) : bookings.length === 0 ? (
                    <Card><CardContent className="py-8 text-center"><Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" /><p className="text-muted-foreground">لا توجد حجوزات حالياً</p></CardContent></Card>
                  ) : bookings.map(booking => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">{(booking.service as any)?.name || 'حجز خدمة'}</h3>
                            {booking.notes && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{booking.notes}</p>}
                          </div>
                          {renderStatusBadge(booking.status)}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatDistanceToNow(new Date(booking.created_at), { addSuffix: true, locale: ar })}</span>
                          {booking.scheduled_date && <span>{booking.scheduled_date} {booking.scheduled_time || ''}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Package Subscriptions Tab */}
              <TabsContent value="subscriptions">
                <div className="space-y-3">
                  {isLoadingData ? (
                    <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
                  ) : packageSubs.length === 0 ? (
                    <Card><CardContent className="py-8 text-center"><Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" /><p className="text-muted-foreground">لا توجد اشتراكات حالياً</p></CardContent></Card>
                  ) : packageSubs.map(sub => (
                    <Card key={sub.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">{sub.package_name}</h3>
                            <Badge className="mt-1 bg-primary/10 text-primary text-xs">{sub.package_type}</Badge>
                          </div>
                          {renderStatusBadge(sub.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(sub.created_at), { addSuffix: true, locale: ar })}</p>
                        <OrderTracker
                          status={sub.status}
                          isConfirming={confirmingId === sub.id}
                          onConfirmReceipt={() => confirmReceipt('package_subscriptions', sub.id)}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Referrals Tab */}
              <TabsContent value="referrals">
                <ReferralSection />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
