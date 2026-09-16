import { uploadToBucket } from '@/lib/uploadFile';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Save, Upload, Settings2, LayoutGrid, Palette, Monitor, LogIn, PanelTop, PanelBottom, Plus, Trash2, Home } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_SETTINGS } from '@/lib/siteSettingsDefaults';
import { ICON_NAMES, getIcon } from '@/lib/iconMap';

const SECTIONS = [
  { key: 'show_news', label: 'شريط الأخبار' },
  { key: 'show_packages', label: 'بطاقة الباقات' },
  { key: 'show_apps', label: 'بطاقة التطبيقات' },
  { key: 'show_livestream', label: 'بطاقة البث المباشر' },
  { key: 'show_wifi', label: 'بطاقة شبكات واي فاي' },
  { key: 'show_portfolio', label: 'بطاقة معرض الأعمال' },
  { key: 'show_services', label: 'قسم الخدمات' },
  { key: 'show_social', label: 'أيقونات التواصل' },
  { key: 'show_featured_clients', label: 'عملاؤنا المميزون' },
  { key: 'show_ai_tools', label: 'بطاقة أدوات الذكاء الاصطناعي' },
];

const COLOR_FIELDS = [
  { key: 'color_primary', label: 'اللون الأساسي' },
  { key: 'color_primary_foreground', label: 'لون النص على الأساسي' },
  { key: 'color_accent', label: 'لون التمييز' },
  { key: 'color_background', label: 'لون الخلفية' },
  { key: 'color_foreground', label: 'لون النص' },
  { key: 'color_card', label: 'لون البطاقات' },
  { key: 'color_secondary', label: 'اللون الثانوي' },
  { key: 'color_muted_foreground', label: 'لون النص الخافت' },
  { key: 'color_border', label: 'لون الحدود' },
];

const PRESETS: { name: string; values: Record<string, string> }[] = [
  { name: 'ذهبي كحلي (افتراضي)', values: { color_background: '#0a0f1c', color_foreground: '#f5f1e8', color_card: '#0f1626', color_primary: '#e0b13c', color_primary_foreground: '#0a0f1c', color_secondary: '#20293d', color_muted_foreground: '#8a93a6', color_accent: '#19a7e0', color_border: '#293349', gradient_from: '#e0b13c', gradient_to: '#e09a19' } },
  { name: 'أزرق ملكي', values: { color_background: '#070d1f', color_foreground: '#eaf1ff', color_card: '#0d1730', color_primary: '#3b82f6', color_primary_foreground: '#ffffff', color_secondary: '#1a2745', color_muted_foreground: '#8fa3c4', color_accent: '#22d3ee', color_border: '#233152', gradient_from: '#3b82f6', gradient_to: '#22d3ee' } },
  { name: 'زمردي فاخر', values: { color_background: '#04140f', color_foreground: '#eafaf3', color_card: '#0a2119', color_primary: '#10b981', color_primary_foreground: '#04140f', color_secondary: '#123328', color_muted_foreground: '#87a99c', color_accent: '#c9a84c', color_border: '#1b4436', gradient_from: '#10b981', gradient_to: '#c9a84c' } },
  { name: 'أرجواني عصري', values: { color_background: '#0b0918', color_foreground: '#f2ecff', color_card: '#151129', color_primary: '#8b5cf6', color_primary_foreground: '#ffffff', color_secondary: '#241d40', color_muted_foreground: '#9c93b8', color_accent: '#ec4899', color_border: '#332a55', gradient_from: '#8b5cf6', gradient_to: '#ec4899' } },
];

interface NavItem { id: string; label: string; icon: string; path: string }
interface HeaderBtn { id: string; label: string; icon: string; action: string; value: string }
interface HomeCard { id: string; title: string; description?: string; icon?: string; buttonText?: string; link?: string; gradientFrom?: string; gradientTo?: string }

const ColorInput: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-muted/40">
    <Label className="text-sm">{label}</Label>
    <div className="flex items-center gap-2">
      <Input value={value} onChange={e => onChange(e.target.value)} className="w-28 h-8 text-xs font-mono" dir="ltr" />
      <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'} onChange={e => onChange(e.target.value)}
        className="w-9 h-9 rounded-md border border-border bg-transparent cursor-pointer" />
    </div>
  </div>
);

const AdminPlatformSettings: React.FC = () => {
  const { settings, isLoading, updateMultipleSettings } = useSiteSettings();
  const [local, setLocal] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => { setLocal({ ...DEFAULT_SETTINGS, ...settings }); }, [settings]);

  const set = (key: string, value: string) => setLocal(prev => ({ ...prev, [key]: value }));
  const get = (key: string) => local[key] ?? DEFAULT_SETTINGS[key] ?? '';
  const bool = (key: string) => get(key) !== 'false';
  const json = <T,>(key: string, fb: T): T => { try { return JSON.parse(get(key)) as T; } catch { return fb; } };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadToBucket('portfolio', file, 'site');
    if (error || !url) {
      toast({ title: 'خطأ', description: error || 'فشل رفع الشعار', variant: 'destructive' });
    } else {
      set('site_logo_url', url);
      toast({ title: 'تم', description: 'تم رفع الشعار — اضغط حفظ للتطبيق' });
    }
    e.target.value = '';
    setUploading(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    await updateMultipleSettings(local);
    setSaving(false);
  };

  const navItems = json<NavItem[]>('bottom_nav_items', []);
  const headerBtns = json<HeaderBtn[]>('header_buttons', []);
  const homeCards = json<HomeCard[]>('home_cards', []);
  const setNav = (v: NavItem[]) => set('bottom_nav_items', JSON.stringify(v));
  const setBtns = (v: HeaderBtn[]) => set('header_buttons', JSON.stringify(v));
  const setCards = (v: HomeCard[]) => set('home_cards', JSON.stringify(v));

  const IconSelect: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
    <Select value={value || 'Sparkles'} onValueChange={onChange}>
      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
      <SelectContent className="max-h-64 bg-popover z-50">
        {ICON_NAMES.map(n => {
          const I = getIcon(n);
          return <SelectItem key={n} value={n}><span className="flex items-center gap-2"><I className="w-4 h-4" />{n}</span></SelectItem>;
        })}
      </SelectContent>
    </Select>
  );

  const SwitchRow: React.FC<{ k: string; label: string }> = ({ k, label }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <Label className="cursor-pointer">{label}</Label>
      <Switch checked={bool(k)} onCheckedChange={v => set(k, v ? 'true' : 'false')} />
    </div>
  );

  const TextRow: React.FC<{ k: string; label: string; placeholder?: string }> = ({ k, label, placeholder }) => (
    <div>
      <Label>{label}</Label>
      <Input value={get(k)} placeholder={placeholder} onChange={e => set(k, e.target.value)} className="mt-1" />
    </div>
  );

  const SizeRow: React.FC<{ k: string; label: string; min: number; max: number; step?: number; unit?: string }> = ({ k, label, min, max, step = 1, unit = 'px' }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">{get(k)}{unit}</span>
      </div>
      <Slider value={[parseFloat(get(k)) || min]} min={min} max={max} step={step} onValueChange={([v]) => set(k, String(v))} />
    </div>
  );

  if (isLoading) return <div className="text-center p-8 text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="identity" dir="rtl">
        <TabsList className="flex flex-wrap h-auto gap-1 justify-start">
          <TabsTrigger value="identity"><Settings2 className="w-4 h-4 ml-1" />الهوية</TabsTrigger>
          <TabsTrigger value="splash"><Monitor className="w-4 h-4 ml-1" />شاشة البداية</TabsTrigger>
          <TabsTrigger value="header"><PanelTop className="w-4 h-4 ml-1" />رأس الموقع</TabsTrigger>
          <TabsTrigger value="nav"><PanelBottom className="w-4 h-4 ml-1" />القائمة السفلية</TabsTrigger>
          <TabsTrigger value="auth"><LogIn className="w-4 h-4 ml-1" />الدخول والتسجيل</TabsTrigger>
          <TabsTrigger value="home"><Home className="w-4 h-4 ml-1" />الصفحة الرئيسية</TabsTrigger>
          <TabsTrigger value="theme"><Palette className="w-4 h-4 ml-1" />الألوان والتأثيرات</TabsTrigger>
          <TabsTrigger value="sections"><LayoutGrid className="w-4 h-4 ml-1" />الأقسام</TabsTrigger>
        </TabsList>

        {/* الهوية */}
        <TabsContent value="identity" className="mt-4">
          <Card><CardHeader><CardTitle>هوية المنصة</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <TextRow k="site_name" label="اسم المنصة" />
              <TextRow k="site_tagline" label="الوصف المختصر" />
              <div>
                <Label>شعار المنصة</Label>
                <div className="flex gap-2 items-center mt-1">
                  <Input placeholder="رابط الشعار" value={get('site_logo_url')} onChange={e => set('site_logo_url', e.target.value)} className="flex-1" dir="ltr" />
                  <input type="file" accept="image/*" ref={fileRef} onChange={handleLogoUpload} className="hidden" />
                  <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    <Upload className="w-4 h-4 ml-1" />{uploading ? 'جاري...' : 'رفع'}
                  </Button>
                </div>
                {get('site_logo_url') && (
                  <div className="mt-3 flex items-center gap-3">
                    <img src={get('site_logo_url')} alt="logo" className="w-16 h-16 rounded-lg object-contain border border-border" />
                    <Button size="sm" variant="ghost" onClick={() => set('site_logo_url', '')}>
                      <Trash2 className="w-4 h-4 ml-1" />إزالة الشعار
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* شاشة البداية */}
        <TabsContent value="splash" className="mt-4">
          <Card><CardHeader><CardTitle>شاشة البداية</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SwitchRow k="splash_enabled" label="تفعيل شاشة البداية" />
              <SwitchRow k="splash_show_logo" label="إظهار الشعار" />
              <SwitchRow k="splash_show_time" label="إظهار الوقت والتاريخ" />
              <SizeRow k="splash_logo_size" label="حجم الشعار" min={60} max={220} />
              <SizeRow k="splash_duration" label="مدة العرض" min={1000} max={10000} step={500} unit="ms" />
              <TextRow k="splash_title" label="العنوان (فارغ = اسم المنصة)" />
              <TextRow k="splash_subtitle" label="الوصف (فارغ = وصف المنصة)" />
              <TextRow k="splash_welcome" label="نص الترحيب" />
              <TextRow k="splash_welcome_sub" label="نص الترحيب الفرعي" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* رأس الموقع */}
        <TabsContent value="header" className="mt-4 space-y-4">
          <Card><CardHeader><CardTitle>إعدادات رأس الموقع</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SwitchRow k="header_enabled" label="إظهار رأس الموقع" />
              <SwitchRow k="header_show_logo" label="إظهار الشعار" />
              <SwitchRow k="header_show_name" label="إظهار اسم المنصة" />
              <SizeRow k="header_logo_size" label="حجم الشعار" min={24} max={64} />
              <TextRow k="header_title" label="عنوان مخصص (فارغ = اسم المنصة)" />
              <SwitchRow k="header_show_notifications" label="زر الإشعارات" />
              <SwitchRow k="header_show_messages" label="زر الرسائل" />
              <SwitchRow k="header_show_whatsapp" label="زر واتساب" />
              <TextRow k="header_whatsapp_number" label="رقم واتساب" placeholder="967778215553" />
            </CardContent>
          </Card>

          <Card><CardHeader><CardTitle className="flex items-center justify-between">
            أزرار مخصصة في الرأس
            <Button size="sm" onClick={() => setBtns([...headerBtns, { id: crypto.randomUUID(), label: 'زر جديد', icon: 'Star', action: 'page', value: '/' }])}>
              <Plus className="w-4 h-4 ml-1" />إضافة
            </Button></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {headerBtns.length === 0 && <p className="text-sm text-muted-foreground">لا توجد أزرار مخصصة.</p>}
              {headerBtns.map((b, i) => (
                <div key={b.id} className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-muted/40 items-end">
                  <div><Label className="text-xs">الاسم</Label>
                    <Input value={b.label} onChange={e => { const c = [...headerBtns]; c[i] = { ...b, label: e.target.value }; setBtns(c); }} className="h-9" /></div>
                  <div><Label className="text-xs">الأيقونة</Label>
                    <IconSelect value={b.icon} onChange={v => { const c = [...headerBtns]; c[i] = { ...b, icon: v }; setBtns(c); }} /></div>
                  <div><Label className="text-xs">الوظيفة</Label>
                    <Select value={b.action} onValueChange={v => { const c = [...headerBtns]; c[i] = { ...b, action: v }; setBtns(c); }}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        <SelectItem value="page">صفحة داخلية</SelectItem>
                        <SelectItem value="url">رابط خارجي</SelectItem>
                        <SelectItem value="whatsapp">واتساب</SelectItem>
                        <SelectItem value="phone">اتصال</SelectItem>
                      </SelectContent>
                    </Select></div>
                  <div className="flex gap-2">
                    <div className="flex-1"><Label className="text-xs">القيمة</Label>
                      <Input value={b.value} dir="ltr" onChange={e => { const c = [...headerBtns]; c[i] = { ...b, value: e.target.value }; setBtns(c); }} className="h-9" /></div>
                    <Button variant="ghost" size="icon" className="text-destructive self-end" onClick={() => setBtns(headerBtns.filter(x => x.id !== b.id))}>
                      <Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* القائمة السفلية */}
        <TabsContent value="nav" className="mt-4 space-y-4">
          <Card><CardHeader><CardTitle className="flex items-center justify-between">
            القائمة السفلية
            <Button size="sm" onClick={() => setNav([...navItems, { id: crypto.randomUUID(), label: 'عنصر', icon: 'Star', path: '/' }])}>
              <Plus className="w-4 h-4 ml-1" />إضافة
            </Button></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <SwitchRow k="bottom_nav_enabled" label="إظهار القائمة السفلية" />
              {navItems.map((it, i) => (
                <div key={it.id} className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-muted/40 items-end">
                  <div><Label className="text-xs">الاسم</Label>
                    <Input value={it.label} onChange={e => { const c = [...navItems]; c[i] = { ...it, label: e.target.value }; setNav(c); }} className="h-9" /></div>
                  <div><Label className="text-xs">الأيقونة</Label>
                    <IconSelect value={it.icon} onChange={v => { const c = [...navItems]; c[i] = { ...it, icon: v }; setNav(c); }} /></div>
                  <div className="flex gap-2">
                    <div className="flex-1"><Label className="text-xs">المسار</Label>
                      <Input value={it.path} dir="ltr" onChange={e => { const c = [...navItems]; c[i] = { ...it, path: e.target.value }; setNav(c); }} className="h-9" /></div>
                    <Button variant="ghost" size="icon" className="text-destructive self-end" onClick={() => setNav(navItems.filter(x => x.id !== it.id))}>
                      <Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setNav(JSON.parse(DEFAULT_SETTINGS.bottom_nav_items))}>استعادة الافتراضي</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الدخول والتسجيل */}
        <TabsContent value="auth" className="mt-4">
          <Card><CardHeader><CardTitle>صفحة الدخول والتسجيل</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SwitchRow k="auth_show_logo" label="إظهار الشعار" />
              <SizeRow k="auth_logo_size" label="حجم الشعار" min={48} max={160} />
              <TextRow k="auth_title" label="العنوان (فارغ = اسم المنصة)" />
              <TextRow k="auth_subtitle" label="الوصف" />
              <SwitchRow k="auth_show_register" label="السماح بإنشاء حساب جديد" />
              <SwitchRow k="auth_show_guest" label="إظهار زر الدخول كضيف" />
              <TextRow k="auth_login_button_text" label="نص زر الدخول" />
              <TextRow k="auth_register_button_text" label="نص زر التسجيل" />
              <div><Label>نص أسفل النموذج</Label>
                <Textarea value={get('auth_footer_text')} onChange={e => set('auth_footer_text', e.target.value)} className="mt-1" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* الصفحة الرئيسية */}
        <TabsContent value="home" className="mt-4 space-y-4">
          <Card><CardHeader><CardTitle>نصوص الصفحة الرئيسية</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <TextRow k="home_services_title" label="عنوان قسم الخدمات" />
              <TextRow k="home_services_subtitle" label="وصف قسم الخدمات" />
              <TextRow k="home_social_title" label="عنوان قسم التواصل" />
            </CardContent>
          </Card>

          <Card><CardHeader><CardTitle className="flex items-center justify-between">
            بطاقات مخصصة
            <Button size="sm" onClick={() => setCards([...homeCards, { id: crypto.randomUUID(), title: 'بطاقة جديدة', description: '', icon: 'Star', buttonText: 'عرض', link: '/', gradientFrom: '#1b2740', gradientTo: '#0f1626' }])}>
              <Plus className="w-4 h-4 ml-1" />إضافة بطاقة
            </Button></CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {homeCards.length === 0 && <p className="text-sm text-muted-foreground">لا توجد بطاقات مخصصة.</p>}
              {homeCards.map((c, i) => {
                const upd = (patch: Partial<HomeCard>) => { const n = [...homeCards]; n[i] = { ...c, ...patch }; setCards(n); };
                return (
                  <div key={c.id} className="space-y-3 p-3 rounded-lg bg-muted/40">
                    <div className="flex gap-2">
                      <Input value={c.title} onChange={e => upd({ title: e.target.value })} placeholder="العنوان" />
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setCards(homeCards.filter(x => x.id !== c.id))}>
                        <Trash2 className="w-4 h-4" /></Button>
                    </div>
                    <Textarea value={c.description || ''} onChange={e => upd({ description: e.target.value })} placeholder="الوصف" />
                    <div className="grid grid-cols-2 gap-2">
                      <IconSelect value={c.icon || 'Star'} onChange={v => upd({ icon: v })} />
                      <Input value={c.buttonText || ''} onChange={e => upd({ buttonText: e.target.value })} placeholder="نص الزر" />
                      <Input value={c.link || ''} dir="ltr" onChange={e => upd({ link: e.target.value })} placeholder="/packages أو رابط" />
                      <div className="flex items-center gap-2">
                        <input type="color" value={c.gradientFrom || '#1b2740'} onChange={e => upd({ gradientFrom: e.target.value })} className="w-9 h-9 rounded-md border border-border bg-transparent" />
                        <input type="color" value={c.gradientTo || '#0f1626'} onChange={e => upd({ gradientTo: e.target.value })} className="w-9 h-9 rounded-md border border-border bg-transparent" />
                        <span className="text-xs text-muted-foreground">التدرج</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* الألوان والتأثيرات */}
        <TabsContent value="theme" className="mt-4 space-y-4">
          <Card><CardHeader><CardTitle>ألوان المنصة</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SwitchRow k="theme_enabled" label="تفعيل الألوان المخصصة (بدلاً من الافتراضية)" />
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => (
                  <Button key={p.name} variant="outline" size="sm" onClick={() => setLocal(prev => ({ ...prev, ...p.values, theme_enabled: 'true' }))}>
                    {p.name}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COLOR_FIELDS.map(f => (
                  <ColorInput key={f.key} label={f.label} value={get(f.key)} onChange={v => set(f.key, v)} />
                ))}
              </div>
              <SizeRow k="radius" label="استدارة الحواف" min={0} max={2} step={0.05} unit="rem" />
            </CardContent>
          </Card>

          <Card><CardHeader><CardTitle>التدرجات والتأثيرات</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <ColorInput label="بداية التدرج" value={get('gradient_from')} onChange={v => set('gradient_from', v)} />
                <ColorInput label="نهاية التدرج" value={get('gradient_to')} onChange={v => set('gradient_to', v)} />
              </div>
              <SizeRow k="gradient_angle" label="زاوية التدرج" min={0} max={360} unit="°" />
              <div className="h-16 rounded-xl border border-border" style={{ background: `linear-gradient(${get('gradient_angle')}deg, ${get('gradient_from')}, ${get('gradient_to')})` }} />
              <SwitchRow k="effect_glass" label="تأثير الزجاج (Glass)" />
              <SwitchRow k="effect_shadows" label="الظلال" />
              <SwitchRow k="effect_animations" label="الحركات والانتقالات" />
              <SwitchRow k="effect_glow" label="التوهج الخلفي" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* الأقسام */}
        <TabsContent value="sections" className="mt-4">
          <Card><CardHeader><CardTitle>إظهار/إخفاء الأقسام</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SECTIONS.map(s => <SwitchRow key={s.key} k={s.key} label={s.label} />)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSaveAll} className="w-full sticky bottom-20 z-10" disabled={saving}>
        <Save className="w-4 h-4 ml-2" />{saving ? 'جاري الحفظ...' : 'حفظ جميع الإعدادات'}
      </Button>
    </div>
  );
};

export default AdminPlatformSettings;
