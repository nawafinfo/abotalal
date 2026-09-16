export const DEFAULT_SETTINGS: Record<string, string> = {
  // الهوية
  site_name: 'ابوطلال للدعاية والإعلان والتسويق الإلكتروني',
  site_tagline: 'خدمات الدعاية والإعلان والتسويق الإلكتروني',
  site_logo_url: '',

  // رأس الموقع
  header_enabled: 'true',
  header_show_logo: 'true',
  header_show_name: 'true',
  header_logo_size: '36',
  header_title: '',
  header_show_notifications: 'true',
  header_show_messages: 'true',
  header_show_whatsapp: 'true',
  header_whatsapp_number: '967778215553',
  header_buttons: '[]',

  // شاشة البداية
  splash_enabled: 'true',
  splash_duration: '5000',
  splash_show_logo: 'true',
  splash_logo_size: '112',
  splash_title: '',
  splash_subtitle: '',
  splash_welcome: 'مرحباً بك',
  splash_welcome_sub: 'نسعد بخدمتك دائماً',
  splash_show_time: 'true',

  // صفحة الدخول والتسجيل
  auth_show_logo: 'true',
  auth_logo_size: '80',
  auth_title: '',
  auth_subtitle: 'خدمات الدعاية والإعلان',
  auth_show_register: 'true',
  auth_show_guest: 'true',
  auth_login_button_text: 'دخول',
  auth_register_button_text: 'إنشاء حساب',
  auth_footer_text: '',

  // القائمة السفلية
  bottom_nav_enabled: 'true',
  bottom_nav_items: JSON.stringify([
    { id: 'home', label: 'الرئيسية', icon: 'Home', path: '/' },
    { id: 'about', label: 'من نحن', icon: 'Users', path: '/about' },
    { id: 'booking', label: 'حجز', icon: 'Calendar', path: '/booking' },
    { id: 'contact', label: 'اتصل بنا', icon: 'Phone', path: '/contact' },
    { id: 'assistant', label: 'المساعد', icon: 'Bot', path: '/assistant' },
  ]),

  // الصفحة الرئيسية
  home_services_title: 'خدماتنا',
  home_services_subtitle: 'اختر الخدمة المطلوبة',
  home_social_title: 'تابعنا على',
  home_cards: '[]',

  // الأقسام
  show_news: 'true',
  show_packages: 'true',
  show_apps: 'true',
  show_livestream: 'true',
  show_wifi: 'true',
  show_portfolio: 'true',
  show_services: 'true',
  show_social: 'true',
  show_featured_clients: 'true',
  show_tech_blog: 'true',
  tech_blog_title: 'تدوينات معلوماتية',
  tech_blog_subtitle: 'الأمن والمعلومات · الحماية من الثغرات والاختراقات · نصائح وحلول',
  tech_blog_note: 'هذه الخدمة مقدمة لعملائنا وأصدقائنا الكرام. بكل حب.. من ابوطلال',
  tech_blog_gradient_from: '#0f172a',
  tech_blog_gradient_to: '#0ea5e9',
  show_ai_tools: 'true',

  // الألوان (HEX)
  theme_enabled: 'false',
  color_background: '#0a0f1c',
  color_foreground: '#f5f1e8',
  color_card: '#0f1626',
  color_primary: '#e0b13c',
  color_primary_foreground: '#0a0f1c',
  color_secondary: '#20293d',
  color_muted_foreground: '#8a93a6',
  color_accent: '#19a7e0',
  color_border: '#293349',
  radius: '0.75',

  // التدرجات والتأثيرات
  gradient_from: '#e0b13c',
  gradient_to: '#e09a19',
  gradient_angle: '135',
  effect_glass: 'true',
  effect_shadows: 'true',
  effect_animations: 'true',
  effect_glow: 'true',
};

// التحكم بمحتوى الزوار (وضع الضيف)
Object.assign(DEFAULT_SETTINGS, {
  guest_mode_enabled: 'true',
  guest_full_access: 'true',
  guest_allow_all_actions: 'false',
  // الصفحات (تُستخدم عند إيقاف الوصول الكامل)
  guest_page_home: 'true',
  guest_page_about: 'true',
  guest_page_booking: 'false',
  guest_page_contact: 'true',
  guest_page_assistant: 'true',
  guest_page_services: 'false',
  guest_page_portfolio: 'true',
  guest_page_packages: 'true',
  guest_page_apps: 'true',
  guest_page_livestream: 'false',
  guest_page_wifi: 'true',
  guest_page_ai_tools: 'true',
  guest_page_tech_blog: 'true',
  // الأزرار والإجراءات (true = مسموح للزائر بدون تسجيل)
  guest_action_booking: 'false',
  guest_action_order: 'false',
  guest_action_download: 'false',
  guest_action_purchase: 'false',
  guest_action_subscribe: 'false',
  guest_action_comment: 'false',
  guest_action_rating: 'false',
  guest_action_message: 'false',
  // محتوى نافذة الدعوة للتسجيل
  guest_dialog_badge: 'وضع الزائر',
  guest_dialog_title: 'هذه الخدمة تتطلب حساباً',
  guest_dialog_description:
    'أنت تتصفح كزائر. سجّل حسابك المجاني في ابوطلال للدعاية والإعلان والتسويق الإلكتروني للحصول على الخدمة كاملة ومتابعة طلباتك ومراسلة الإدارة.',
  guest_dialog_perks: JSON.stringify([
    'الوصول الكامل لكل الخدمات والطلبات',
    'متابعة طلباتك ومراسلة الإدارة',
    'نقاط ومكافآت نظام الإحالة',
  ]),
  guest_dialog_show_register: 'true',
  guest_dialog_register_text: 'إنشاء حساب مجاني',
  guest_dialog_show_login: 'true',
  guest_dialog_login_text: 'تسجيل الدخول',
  guest_dialog_show_continue: 'true',
  guest_dialog_continue_text: 'متابعة التصفح كزائر',
  // صفحة المحتوى المقفل
  guest_blocked_title: 'هذا المحتوى للأعضاء المسجّلين',
  guest_blocked_description:
    'أنت تتصفح كزائر. سجّل حسابك المجاني الآن لمشاهدة هذا القسم والاستفادة من جميع خدمات ابوطلال للدعاية والإعلان والتسويق الإلكتروني.',
});
