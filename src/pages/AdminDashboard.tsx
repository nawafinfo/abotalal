import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, Calendar, Settings, Users,
  TrendingUp, Clock, XCircle, ArrowRight, Newspaper, MessageSquare, Image,
  BarChart3, Crown, Smartphone, Radio, Wifi, Palette, Gift, Star, Cog, Brain, ShieldCheck, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/hooks/useAdmin';
import { useBookings } from '@/hooks/useBookings';
import { useOrders } from '@/hooks/useOrders';
import { useServices } from '@/hooks/useServices';
import AdminBookingsTable from '@/components/admin/AdminBookingsTable';
import AdminOrdersTable from '@/components/admin/AdminOrdersTable';
import AdminServicesTable from '@/components/admin/AdminServicesTable';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import AdminNewsTable from '@/components/admin/AdminNewsTable';
import AdminChatPanel from '@/components/admin/AdminChatPanel';
import AdminSlidesTable from '@/components/admin/AdminSlidesTable';
import AdminPackagesTable from '@/components/admin/AdminPackagesTable';
import AdminStatsCharts from '@/components/admin/AdminStatsCharts';
import AdminAppsTable from '@/components/admin/AdminAppsTable';
import AdminChannelsTable from '@/components/admin/AdminChannelsTable';
import AdminWifiTable from '@/components/admin/AdminWifiTable';
import AdminPortfolioTable from '@/components/admin/AdminPortfolioTable';
import AdminReferralsTable from '@/components/admin/AdminReferralsTable';
import AdminFeaturedClientsTable from '@/components/admin/AdminFeaturedClientsTable';
import AdminPlatformSettings from '@/components/admin/AdminPlatformSettings';
import AdminContentAccess from '@/components/admin/AdminContentAccess';
import AdminAIToolsTable from '@/components/admin/AdminAIToolsTable';
import AdminBlogTable from '@/components/admin/AdminBlogTable';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import DrawerMenu from '@/components/DrawerMenu';

const AdminDashboard: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { bookings } = useBookings();
  const { orders } = useOrders();
  const { services } = useServices();

  if (isAdminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">غير مصرح</h1>
          <p className="text-muted-foreground mb-6">ليس لديك صلاحية الوصول إلى لوحة التحكم</p>
          <Button onClick={() => navigate('/')}>
            <ArrowRight className="w-4 h-4 ml-2" />العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const activeServices = services.filter(s => s.is_active).length;

  const stats = [
    { title: 'إجمالي الحجوزات', value: bookings.length, icon: Calendar, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'حجوزات معلقة', value: pendingBookings, icon: Clock, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'إجمالي الطلبات', value: orders.length, icon: Package, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'طلبات معلقة', value: pendingOrders, icon: TrendingUp, color: 'text-primary', bgColor: 'bg-primary/10' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onMenuClick={() => setIsDrawerOpen(true)} />
      <DrawerMenu isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <main className="flex-1 pt-16 pb-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
              <p className="text-muted-foreground text-sm">إدارة الطلبات والحجوزات والخدمات</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="stats" className="w-full" dir="rtl">
            <div className="overflow-x-auto mb-6">
              <TabsList className="inline-flex w-auto min-w-full h-auto gap-1 p-1">
                <TabsTrigger value="stats" className="flex items-center gap-1 text-xs py-2 px-2">
                  <BarChart3 className="w-4 h-4" /><span className="hidden sm:inline">الإحصائيات</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Calendar className="w-4 h-4" /><span className="hidden sm:inline">الحجوزات</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Package className="w-4 h-4" /><span className="hidden sm:inline">الطلبات</span>
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Crown className="w-4 h-4" /><span className="hidden sm:inline">الباقات</span>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Settings className="w-4 h-4" /><span className="hidden sm:inline">الخدمات</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Users className="w-4 h-4" /><span className="hidden sm:inline">المستخدمون</span>
                </TabsTrigger>
                <TabsTrigger value="news" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Newspaper className="w-4 h-4" /><span className="hidden sm:inline">الأخبار</span>
                </TabsTrigger>
                <TabsTrigger value="slides" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Image className="w-4 h-4" /><span className="hidden sm:inline">السلايدر</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-1 text-xs py-2 px-2">
                  <MessageSquare className="w-4 h-4" /><span className="hidden sm:inline">المراسلات</span>
                </TabsTrigger>
                <TabsTrigger value="apps" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Smartphone className="w-4 h-4" /><span className="hidden sm:inline">التطبيقات</span>
                </TabsTrigger>
                <TabsTrigger value="channels" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Radio className="w-4 h-4" /><span className="hidden sm:inline">البث</span>
                </TabsTrigger>
                <TabsTrigger value="wifi" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Wifi className="w-4 h-4" /><span className="hidden sm:inline">الواي فاي</span>
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Palette className="w-4 h-4" /><span className="hidden sm:inline">الأعمال</span>
                </TabsTrigger>
                <TabsTrigger value="referrals" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Gift className="w-4 h-4" /><span className="hidden sm:inline">الإحالات</span>
                </TabsTrigger>
                <TabsTrigger value="clients" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Star className="w-4 h-4" /><span className="hidden sm:inline">العملاء</span>
                </TabsTrigger>
                <TabsTrigger value="ai_tools" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Brain className="w-4 h-4" /><span className="hidden sm:inline">أدوات AI</span>
                </TabsTrigger>
                <TabsTrigger value="tech_blog" className="flex items-center gap-1 text-xs py-2 px-2">
                  <ShieldCheck className="w-4 h-4" /><span className="hidden sm:inline">التدوينات</span>
                </TabsTrigger>
                <TabsTrigger value="content_access" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Eye className="w-4 h-4" /><span className="hidden sm:inline">محتوى الزوار</span>
                </TabsTrigger>
                <TabsTrigger value="platform" className="flex items-center gap-1 text-xs py-2 px-2">
                  <Cog className="w-4 h-4" /><span className="hidden sm:inline">إدارة المنصة</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="stats"><AdminStatsCharts bookings={bookings} orders={orders} services={services} /></TabsContent>
            <TabsContent value="bookings"><AdminBookingsTable /></TabsContent>
            <TabsContent value="orders"><AdminOrdersTable /></TabsContent>
            <TabsContent value="packages"><AdminPackagesTable /></TabsContent>
            <TabsContent value="services"><AdminServicesTable /></TabsContent>
            <TabsContent value="users"><AdminUsersTable /></TabsContent>
            <TabsContent value="news"><AdminNewsTable /></TabsContent>
            <TabsContent value="slides"><AdminSlidesTable /></TabsContent>
            <TabsContent value="chat"><AdminChatPanel /></TabsContent>
            <TabsContent value="apps"><AdminAppsTable /></TabsContent>
            <TabsContent value="channels"><AdminChannelsTable /></TabsContent>
            <TabsContent value="wifi"><AdminWifiTable /></TabsContent>
            <TabsContent value="portfolio"><AdminPortfolioTable /></TabsContent>
            <TabsContent value="referrals"><AdminReferralsTable /></TabsContent>
            <TabsContent value="clients"><AdminFeaturedClientsTable /></TabsContent>
            <TabsContent value="ai_tools"><AdminAIToolsTable /></TabsContent>
            <TabsContent value="tech_blog"><AdminBlogTable /></TabsContent>
            <TabsContent value="content_access"><AdminContentAccess /></TabsContent>
            <TabsContent value="platform"><AdminPlatformSettings /></TabsContent>
          </Tabs>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AdminDashboard;
