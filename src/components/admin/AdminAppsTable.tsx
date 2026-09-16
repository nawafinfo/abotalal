import React, { useState } from 'react';
import { useApps, App } from '@/hooks/useApps';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Smartphone, ExternalLink, Images, Download } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminAppContentDialog from './AdminAppContentDialog';
import AdminAppsInsights from './AdminAppsInsights';
import { toast } from 'sonner';
import { uploadToBucket } from '@/lib/uploadFile';
import ExportButton from './ExportButton';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';

const categories = [
  { value: 'social', label: 'التواصل الاجتماعي' },
  { value: 'tools', label: 'الأدوات' },
  { value: 'design', label: 'التصاميم والمونتاج' },
  { value: 'wifi', label: 'شبكات الواي فاي' },
];

const colorPresets = [
  { value: 'from-yellow-500 to-amber-600', label: 'ذهبي' },
  { value: 'from-blue-500 to-blue-700', label: 'أزرق' },
  { value: 'from-pink-500 to-purple-600', label: 'وردي' },
  { value: 'from-sky-400 to-blue-600', label: 'سماوي' },
  { value: 'from-emerald-500 to-green-700', label: 'أخضر' },
  { value: 'from-red-500 to-orange-600', label: 'أحمر' },
  { value: 'from-violet-500 to-purple-700', label: 'بنفسجي' },
  { value: 'from-slate-600 to-slate-800', label: 'رمادي' },
  { value: 'from-orange-500 to-red-600', label: 'برتقالي' },
  { value: 'from-indigo-500 to-blue-600', label: 'نيلي' },
  { value: 'from-amber-500 to-yellow-600', label: 'عنبري' },
];

const defaultForm = {
  name: '',
  description: '',
  category: 'social',
  icon: '',
  icon_url: '',
  download_url: '',
  version: '1.0',
  size: '10 MB',
  rating: 4.5,
  downloads_count: '1K+',
  color: 'from-blue-500 to-blue-700',
  is_active: true,
  sort_order: 0,
  developer_name: '',
  package_name: '',
  requirements: '',
  support_url: '',
  support_email: '',
  support_phone: '',
  whats_new: '',
};

const AdminAppsTable: React.FC = () => {
  const { apps, addApp, updateApp, deleteApp, uploadApk, refetch } = useApps();
  const [isOpen, setIsOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIcon(true);
    const { url, error } = await uploadToBucket('app-files', file, 'icons');
    if (url) {
      setForm(f => ({ ...f, icon_url: url }));
      toast.success('تم رفع أيقونة التطبيق');
    } else {
      toast.error(error || 'فشل رفع الأيقونة');
    }
    e.target.value = '';
    setUploadingIcon(false);
  };
  const [contentApp, setContentApp] = useState<App | null>(null);

  const openAdd = () => {
    setEditingApp(null);
    setForm(defaultForm);
    setApkFile(null);
    setIsOpen(true);
  };

  const openEdit = (app: App) => {
    setEditingApp(app);
    setForm({
      name: app.name,
      description: app.description || '',
      category: app.category,
      icon: app.icon || '',
      icon_url: app.icon_url || '',
      download_url: app.download_url || '',
      version: app.version || '1.0',
      size: app.size || '10 MB',
      rating: app.rating || 4.5,
      downloads_count: app.downloads_count || '1K+',
      color: app.color || 'from-blue-500 to-blue-700',
      is_active: app.is_active,
      sort_order: app.sort_order,
      developer_name: app.developer_name || '',
      package_name: app.package_name || '',
      requirements: app.requirements || '',
      support_url: app.support_url || '',
      support_email: app.support_email || '',
      support_phone: app.support_phone || '',
      whats_new: app.whats_new || '',
    });
    setApkFile(null);
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('يرجى إدخال اسم التطبيق');
      return;
    }

    setUploading(true);

    if (editingApp) {
      await updateApp(editingApp.id, form);
      if (apkFile) await uploadApk(apkFile, editingApp.id);
    } else {
      await addApp(form);
    }

    setUploading(false);
    setIsOpen(false);
    setApkFile(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التطبيق؟')) {
      await deleteApp(id);
    }
  };

  const getCategoryLabel = (cat: string) => categories.find(c => c.value === cat)?.label || cat;

  const exportColumns = [
    { header: 'الاسم', key: 'name' },
    { header: 'التصنيف', key: 'category' },
    { header: 'الإصدار', key: 'version' },
    { header: 'الحجم', key: 'size' },
    { header: 'التقييم', key: 'rating' },
  ];

  return (
    <Tabs defaultValue="list" dir="rtl" className="space-y-4">
      <TabsList className="grid grid-cols-2 w-full max-w-sm">
        <TabsTrigger value="list">التطبيقات</TabsTrigger>
        <TabsTrigger value="insights">الإحصائيات والتعليقات</TabsTrigger>
      </TabsList>

      <TabsContent value="insights"><AdminAppsInsights /></TabsContent>

      <TabsContent value="list" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Smartphone className="w-5 h-5" /> إدارة التطبيقات
        </h2>
        <div className="flex gap-2">
          <ExportButton 
            onExportExcel={() => exportToExcel(apps, exportColumns, 'apps')} 
            onExportPDF={() => exportToPDF(apps, exportColumns, 'التطبيقات', 'apps')} 
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 ml-1" /> إضافة تطبيق</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingApp ? 'تعديل التطبيق' : 'إضافة تطبيق جديد'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>اسم التطبيق *</Label>
                  <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} />
                </div>
                <div>
                  <Label>التصنيف</Label>
                  <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>اسم الأيقونة (Lucide) - اختياري</Label>
                  <Input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="مثال: MessageCircle, Shield, Star" />
                  <p className="text-xs text-muted-foreground mt-1">اتركه فارغ إذا كنت تريد استخدام رابط صورة</p>
                </div>
                <div>
                  <Label>صورة الأيقونة (رفع من الجهاز أو رابط)</Label>
                  <Input type="file" accept="image/*" disabled={uploadingIcon} onChange={handleIconUpload} />
                  {uploadingIcon && <p className="text-xs text-muted-foreground mt-1">جاري رفع الصورة...</p>}
                  <Input className="mt-2" value={form.icon_url} onChange={e => setForm({...form, icon_url: e.target.value})} placeholder="https://example.com/icon.png" />
                  {form.icon_url && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={form.icon_url} alt="preview" className="w-10 h-10 rounded-lg object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      <span className="text-xs text-muted-foreground">معاينة الأيقونة</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label>رابط التحميل المباشر</Label>
                  <Input value={form.download_url} onChange={e => setForm({...form, download_url: e.target.value})} placeholder="https://example.com/app.apk" />
                </div>
                <div>
                  <Label>أو ارفع ملف APK</Label>
                  <Input type="file" accept=".apk,.xapk,.apks" onChange={e => setApkFile(e.target.files?.[0] || null)} />
                  {apkFile && <p className="text-xs text-muted-foreground mt-1">📦 {apkFile.name} ({(apkFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>الإصدار</Label>
                    <Input value={form.version} onChange={e => setForm({...form, version: e.target.value})} />
                  </div>
                  <div>
                    <Label>الحجم</Label>
                    <Input value={form.size} onChange={e => setForm({...form, size: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>التقييم</Label>
                    <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseFloat(e.target.value)})} />
                  </div>
                  <div>
                    <Label>عدد التحميلات</Label>
                    <Input value={form.downloads_count} onChange={e => setForm({...form, downloads_count: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>اسم المطور</Label>
                    <Input value={form.developer_name} onChange={e => setForm({...form, developer_name: e.target.value})} placeholder="ابوطلال للدعاية والإعلان والتسويق الإلكتروني" />
                  </div>
                  <div>
                    <Label>اسم الحزمة</Label>
                    <Input value={form.package_name} onChange={e => setForm({...form, package_name: e.target.value})} placeholder="com.example.app" />
                  </div>
                </div>
                <div>
                  <Label>متطلبات التشغيل</Label>
                  <Input value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} placeholder="أندرويد 8.0 فأعلى" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>رابط الدعم</Label>
                    <Input value={form.support_url} onChange={e => setForm({...form, support_url: e.target.value})} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>واتساب الدعم</Label>
                    <Input value={form.support_phone} onChange={e => setForm({...form, support_phone: e.target.value})} placeholder="967778215553" />
                  </div>
                </div>
                <div>
                  <Label>بريد الدعم</Label>
                  <Input value={form.support_email} onChange={e => setForm({...form, support_email: e.target.value})} placeholder="support@example.com" />
                </div>
                <div>
                  <Label>ما الجديد (ملخص آخر تحديث)</Label>
                  <Textarea rows={2} value={form.whats_new} onChange={e => setForm({...form, whats_new: e.target.value})} />
                </div>
                <div>
                  <Label>لون التدرج</Label>
                  <Select value={form.color} onValueChange={v => setForm({...form, color: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {colorPresets.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${c.value}`} />
                            {c.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>الترتيب</Label>
                    <Input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: parseInt(e.target.value)})} />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} />
                    <Label>نشط</Label>
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={uploading}>
                  {uploading ? 'جاري الحفظ...' : (editingApp ? 'تحديث' : 'إضافة')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الأيقونة</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الإصدار</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">التحميلات</TableHead>
              <TableHead className="text-right">الرابط</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">لا توجد تطبيقات بعد</TableCell></TableRow>
            ) : apps.map(app => (
              <TableRow key={app.id}>
                <TableCell>
                  {app.icon_url ? (
                    <img src={app.icon_url} alt={app.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{app.name}</TableCell>
                <TableCell><Badge variant="secondary">{getCategoryLabel(app.category)}</Badge></TableCell>
                <TableCell>{app.version}</TableCell>
                <TableCell>
                  <Badge variant={app.is_active ? 'default' : 'secondary'}>
                    {app.is_active ? 'نشط' : 'معطل'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-xs">
                    <Download className="w-3 h-3 text-emerald-500" /> {app.real_downloads || 0}
                  </span>
                </TableCell>
                <TableCell>
                  {app.download_url ? (
                    <a href={app.download_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  ) : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" aria-label="المحتوى واللقطات" onClick={() => setContentApp(app)}><Images className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(app)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(app.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdminAppContentDialog app={contentApp} open={!!contentApp} onOpenChange={(v) => !v && setContentApp(null)} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminAppsTable;
