import {
  Megaphone,
  TrendingUp,
  FileText,
  Globe,
  Smartphone,
  Video,
  Shield,
  Printer,
  Image,
  Users,
  Calendar,
  Phone,
  Bot,
  Sparkles,
  LayoutDashboard,
  MessageCircle,
  Crown,
} from 'lucide-react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
}

export const services: Service[] = [
  {
    id: 'advertising',
    title: 'الدعاية والإعلان',
    description: 'حملات إعلانية مبتكرة وفعالة لتعزيز علامتك التجارية',
    icon: Megaphone,
    path: '/services/advertising',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'marketing',
    title: 'التسويق الإلكتروني',
    description: 'استراتيجيات تسويقية رقمية متكاملة لنمو أعمالك',
    icon: TrendingUp,
    path: '/services/marketing',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'pages',
    title: 'إدارة وتمويل الصفحات',
    description: 'إدارة احترافية لصفحات التواصل الاجتماعي',
    icon: FileText,
    path: '/services/pages',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'websites',
    title: 'إدارة المواقع الإلكترونية',
    description: 'تصميم وتطوير وإدارة المواقع بأحدث التقنيات',
    icon: Globe,
    path: '/services/websites',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'apps',
    title: 'إدارة التطبيقات',
    description: 'تطوير وإدارة تطبيقات الهواتف الذكية',
    icon: Smartphone,
    path: '/services/apps',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'montage',
    title: 'خدمات المونتاج',
    description: 'مونتاج فيديو احترافي بأعلى جودة',
    icon: Video,
    path: '/services/montage',
    color: 'from-red-500 to-orange-600',
  },
  {
    id: 'security',
    title: 'الخدمات الأمنية والحماية',
    description: 'حماية حساباتك ومواقعك من الاختراق',
    icon: Shield,
    path: '/services/security',
    color: 'from-slate-500 to-gray-600',
  },
  {
    id: 'printing',
    title: 'خدمات الطباعة',
    description: 'طباعة عالية الجودة لجميع احتياجاتك',
    icon: Printer,
    path: '/services/printing',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'portfolio',
    title: 'معرض أعمالنا',
    description: 'تصفح أحدث مشاريعنا وأعمالنا المميزة',
    icon: Image,
    path: '/portfolio',
    color: 'from-indigo-500 to-blue-600',
  },
];

export const menuItems = [
  { id: 'home', title: 'الرئيسية', icon: Sparkles, path: '/' },
  ...services,
  { id: 'packages', title: 'الباقات', icon: Crown, path: '/packages' },
  { id: 'about', title: 'من نحن', icon: Users, path: '/about' },
  { id: 'booking', title: 'حجز الخدمات', icon: Calendar, path: '/booking' },
  { id: 'contact', title: 'اتصل بنا', icon: Phone, path: '/contact' },
  { id: 'assistant', title: 'المساعد الذكي', icon: Bot, path: '/assistant' },
  { id: 'messages', title: 'مراسلة الإدارة', icon: MessageCircle, path: '/messages' },
  { id: 'admin', title: 'لوحة التحكم', icon: LayoutDashboard, path: '/admin' },
];

export const newsItems = [
  'مرحباً بكم في ابوطلال للدعاية والإعلان والتسويق الإلكتروني لخدمات الدعاية والإعلان',
  'خصم 20% على جميع خدمات التسويق الإلكتروني هذا الشهر',
  'نقدم خدمات جديدة في مجال حماية الحسابات والمواقع',
  'تابعونا للحصول على آخر العروض والخدمات المميزة',
  'فريق متخصص جاهز لخدمتكم على مدار الساعة',
];

export const sliderItems = [
  {
    id: 1,
    title: 'خدمات الدعاية والإعلان',
    description: 'حملات إعلانية مبتكرة تصل لجمهورك المستهدف',
    gradient: 'from-primary/20 to-accent/20',
  },
  {
    id: 2,
    title: 'التسويق الإلكتروني',
    description: 'استراتيجيات تسويقية متكاملة لنمو أعمالك',
    gradient: 'from-blue-600/20 to-cyan-500/20',
  },
  {
    id: 3,
    title: 'إدارة الصفحات والمواقع',
    description: 'إدارة احترافية لتواجدك الرقمي',
    gradient: 'from-violet-600/20 to-purple-500/20',
  },
  {
    id: 4,
    title: 'خدمات المونتاج',
    description: 'إنتاج فيديوهات احترافية عالية الجودة',
    gradient: 'from-rose-600/20 to-pink-500/20',
  },
];
