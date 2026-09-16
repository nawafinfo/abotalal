export interface GuestPageDef { key: string; label: string; paths: string[] }
export interface GuestActionDef { key: string; label: string }

export const GUEST_PAGES: GuestPageDef[] = [
  { key: 'home', label: 'الصفحة الرئيسية', paths: ['/'] },
  { key: 'about', label: 'من نحن', paths: ['/about'] },
  { key: 'booking', label: 'صفحة الحجز', paths: ['/booking'] },
  { key: 'contact', label: 'اتصل بنا', paths: ['/contact'] },
  { key: 'assistant', label: 'المساعد الذكي', paths: ['/assistant'] },
  { key: 'services', label: 'صفحات الخدمات', paths: ['/services'] },
  { key: 'portfolio', label: 'معرض الأعمال', paths: ['/portfolio'] },
  { key: 'packages', label: 'الباقات', paths: ['/packages'] },
  { key: 'apps', label: 'متجر التطبيقات', paths: ['/apps-store'] },
  { key: 'livestream', label: 'البث المباشر', paths: ['/live-stream'] },
  { key: 'wifi', label: 'شبكات الواي فاي', paths: ['/wifi-networks'] },
  { key: 'ai_tools', label: 'أدوات الذكاء الاصطناعي', paths: ['/ai-tools'] },
  { key: 'tech_blog', label: 'تدوينات معلوماتية', paths: ['/tech-blog'] },
];

export const GUEST_ACTIONS: GuestActionDef[] = [
  { key: 'booking', label: 'الحجز' },
  { key: 'order', label: 'الطلبات' },
  { key: 'download', label: 'تحميل التطبيقات' },
  { key: 'purchase', label: 'الشراء' },
  { key: 'subscribe', label: 'الاشتراك في الباقات' },
  { key: 'comment', label: 'التعليقات' },
  { key: 'rating', label: 'التقييمات' },
  { key: 'message', label: 'المراسلة' },
];

export const pageKeyFor = (key: string) => `guest_page_${key}`;
export const actionKeyFor = (key: string) => `guest_action_${key}`;
