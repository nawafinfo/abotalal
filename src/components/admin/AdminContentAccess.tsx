import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye, MousePointerClick, MessageSquareWarning, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { DEFAULT_SETTINGS } from '@/lib/siteSettingsDefaults';
import { GUEST_PAGES, GUEST_ACTIONS, pageKeyFor, actionKeyFor } from '@/lib/guestAccess';

const Row: React.FC<{ label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, hint, checked, onChange }) => (
  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border">
    <div className="text-right">
      <Label className="text-sm font-semibold">{label}</Label>
      {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const AdminContentAccess: React.FC = () => {
  const { settings, updateMultipleSettings } = useSiteSettings();
  const [local, setLocal] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { setLocal({ ...DEFAULT_SETTINGS, ...settings }); }, [settings]);

  const get = (k: string) => local[k] ?? DEFAULT_SETTINGS[k] ?? '';
  const set = (k: string, v: string) => setLocal(prev => ({ ...prev, [k]: v }));
  const isOn = (k: string) => get(k) === 'true';

  const perks: string[] = (() => { try { return JSON.parse(get('guest_dialog_perks')) as string[]; } catch { return []; } })();
  const setPerks = (v: string[]) => set('guest_dialog_perks', JSON.stringify(v));

  const save = async () => {
    setSaving(true);
    await updateMultipleSettings(local);
    setSaving(false);
  };

  const fullAccess = isOn('guest_full_access');

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl gradient-gold flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">التحكم بمحتوى المنصة</h2>
            <p className="text-xs text-muted-foreground">تحكم كامل بما يراه الزائر (غير المسجل) وبنافذة الدعوة للتسجيل</p>
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="gradient-gold text-primary-foreground font-bold">
          <Save className="w-4 h-4 ml-2" /> {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>

      <Tabs defaultValue="access" dir="rtl">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="access" className="text-xs gap-1"><Eye className="w-4 h-4" /> المحتوى</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs gap-1"><MousePointerClick className="w-4 h-4" /> الأزرار</TabsTrigger>
          <TabsTrigger value="dialog" className="text-xs gap-1"><MessageSquareWarning className="w-4 h-4" /> نافذة الزائر</TabsTrigger>
        </TabsList>

        <TabsContent value="access" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">الإعدادات العامة</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Row label="تفعيل وضع الزائر" hint="السماح بالدخول للمنصة بدون تسجيل" checked={isOn('guest_mode_enabled')} onChange={v => set('guest_mode_enabled', String(v))} />
              <Row label="عرض المحتوى كامل للزوار" hint="عند التفعيل يشاهد الزائر جميع الصفحات والأقسام" checked={fullAccess} onChange={v => set('guest_full_access', String(v))} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">الصفحات المتاحة للزائر</CardTitle>
              {fullAccess && <p className="text-[11px] text-muted-foreground">الوصول الكامل مفعّل — هذه الخيارات تعمل عند إيقافه.</p>}
            </CardHeader>
            <CardContent className="grid gap-2 md:grid-cols-2">
              {GUEST_PAGES.map(p => (
                <Row key={p.key} label={p.label} checked={isOn(pageKeyFor(p.key))} onChange={v => set(pageKeyFor(p.key), String(v))} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">الأزرار والإجراءات</CardTitle>
              <p className="text-[11px] text-muted-foreground">عند الإيقاف تظهر للزائر نافذة الدعوة للتسجيل بدلاً من تنفيذ الإجراء.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <Row label="السماح بجميع الإجراءات للزوار" hint="غير مستحسن — يتيح الطلب والتحميل بدون حساب" checked={isOn('guest_allow_all_actions')} onChange={v => set('guest_allow_all_actions', String(v))} />
              <div className="grid gap-2 md:grid-cols-2">
                {GUEST_ACTIONS.map(a => (
                  <Row key={a.key} label={a.label} checked={isOn(actionKeyFor(a.key))} onChange={v => set(actionKeyFor(a.key), String(v))} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dialog" className="space-y-4 mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">محتوى نافذة الدعوة للتسجيل</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label className="text-xs">الشارة العلوية</Label><Input value={get('guest_dialog_badge')} onChange={e => set('guest_dialog_badge', e.target.value)} /></div>
              <div><Label className="text-xs">العنوان</Label><Input value={get('guest_dialog_title')} onChange={e => set('guest_dialog_title', e.target.value)} /></div>
              <div><Label className="text-xs">الوصف</Label><Textarea rows={3} value={get('guest_dialog_description')} onChange={e => set('guest_dialog_description', e.target.value)} /></div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">مزايا العضوية</Label>
                  <Button size="sm" variant="outline" onClick={() => setPerks([...perks, 'ميزة جديدة'])}><Plus className="w-3 h-3 ml-1" /> إضافة</Button>
                </div>
                {perks.map((p, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={p} onChange={e => setPerks(perks.map((x, j) => j === i ? e.target.value : x))} />
                    <Button size="icon" variant="ghost" onClick={() => setPerks(perks.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>

              <Row label="إظهار زر إنشاء حساب" checked={isOn('guest_dialog_show_register')} onChange={v => set('guest_dialog_show_register', String(v))} />
              <div><Label className="text-xs">نص زر إنشاء حساب</Label><Input value={get('guest_dialog_register_text')} onChange={e => set('guest_dialog_register_text', e.target.value)} /></div>
              <Row label="إظهار زر تسجيل الدخول" checked={isOn('guest_dialog_show_login')} onChange={v => set('guest_dialog_show_login', String(v))} />
              <div><Label className="text-xs">نص زر تسجيل الدخول</Label><Input value={get('guest_dialog_login_text')} onChange={e => set('guest_dialog_login_text', e.target.value)} /></div>
              <Row label="إظهار زر متابعة التصفح" checked={isOn('guest_dialog_show_continue')} onChange={v => set('guest_dialog_show_continue', String(v))} />
              <div><Label className="text-xs">نص زر متابعة التصفح</Label><Input value={get('guest_dialog_continue_text')} onChange={e => set('guest_dialog_continue_text', e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">صفحة المحتوى المقفل</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><Label className="text-xs">العنوان</Label><Input value={get('guest_blocked_title')} onChange={e => set('guest_blocked_title', e.target.value)} /></div>
              <div><Label className="text-xs">الوصف</Label><Textarea rows={3} value={get('guest_blocked_description')} onChange={e => set('guest_blocked_description', e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContentAccess;
