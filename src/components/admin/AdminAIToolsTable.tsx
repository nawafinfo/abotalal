import React, { useState } from 'react';
import { Plus, Edit, Trash2, Brain, ExternalLink, Star, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAITools, AITool } from '@/hooks/useAITools';

const categories = [
  { value: 'chat', label: 'المحادثة' },
  { value: 'image', label: 'الصور' },
  { value: 'video', label: 'الفيديو' },
  { value: 'audio', label: 'الصوت' },
  { value: 'text', label: 'النصوص' },
  { value: 'code', label: 'البرمجة' },
  { value: 'other', label: 'أخرى' },
];

const colorPresets = [
  { value: 'from-purple-500 to-pink-500', label: 'بنفسجي وردي' },
  { value: 'from-blue-500 to-cyan-500', label: 'أزرق سماوي' },
  { value: 'from-emerald-500 to-teal-500', label: 'زمردي' },
  { value: 'from-orange-500 to-red-500', label: 'برتقالي أحمر' },
  { value: 'from-yellow-500 to-amber-600', label: 'ذهبي' },
  { value: 'from-indigo-500 to-purple-600', label: 'نيلي' },
  { value: 'from-rose-500 to-fuchsia-500', label: 'وردي فوشي' },
  { value: 'from-slate-600 to-slate-800', label: 'رمادي داكن' },
];

const defaultForm = {
  name: '',
  description: '',
  category: 'chat',
  tool_url: '',
  icon_url: '',
  logo_url: '',
  color: 'from-purple-500 to-pink-500',
  is_featured: false,
  is_active: true,
  sort_order: 0,
};

const AdminAIToolsTable: React.FC = () => {
  const { tools, addTool, updateTool, deleteTool, uploadIcon } = useAITools();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<AITool | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(defaultForm);
    setIsOpen(true);
  };

  const openEdit = (tool: AITool) => {
    setEditing(tool);
    setForm({
      name: tool.name,
      description: tool.description || '',
      category: tool.category,
      tool_url: tool.tool_url || '',
      icon_url: tool.icon_url || '',
      logo_url: tool.logo_url || '',
      color: tool.color || 'from-purple-500 to-pink-500',
      is_featured: tool.is_featured,
      is_active: tool.is_active,
      sort_order: tool.sort_order,
    });
    setIsOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'icon_url' | 'logo_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadIcon(file);
    setUploading(false);
    if (url) {
      setForm(prev => ({ ...prev, [field]: url }));
      toast.success('تم رفع الصورة');
    } else {
      toast.error('فشل رفع الصورة');
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('يرجى إدخال اسم الأداة');
      return;
    }
    if (editing) {
      const { error } = await updateTool(editing.id, form);
      if (!error) toast.success('تم التحديث');
    } else {
      const { error } = await addTool(form);
      if (!error) toast.success('تمت الإضافة');
    }
    setIsOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الأداة؟')) return;
    const { error } = await deleteTool(id);
    if (!error) toast.success('تم الحذف');
  };

  const getCategoryLabel = (cat: string) => categories.find(c => c.value === cat)?.label || cat;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Brain className="w-5 h-5" /> إدارة أدوات ونماذج الذكاء الاصطناعي
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 ml-1" /> إضافة أداة</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'تعديل الأداة' : 'إضافة أداة جديدة'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>اسم الأداة *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: ChatGPT" />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
              </div>
              <div>
                <Label>التصنيف</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>رابط الأداة</Label>
                <Input value={form.tool_url} onChange={e => setForm({ ...form, tool_url: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <Label>أيقونة/شعار الأداة</Label>
                <Input value={form.icon_url} onChange={e => setForm({ ...form, icon_url: e.target.value })} placeholder="رابط صورة" />
                <div className="flex items-center gap-2 mt-2">
                  <Input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'icon_url')} className="text-xs" />
                  {uploading && <Upload className="w-4 h-4 animate-pulse" />}
                </div>
                {form.icon_url && (
                  <img src={form.icon_url} alt="preview" className="w-12 h-12 rounded-lg object-cover mt-2" onError={e => (e.currentTarget.style.display = 'none')} />
                )}
              </div>
              <div>
                <Label>لون التدرج</Label>
                <Select value={form.color} onValueChange={v => setForm({ ...form, color: v })}>
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
                  <Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_featured} onCheckedChange={v => setForm({ ...form, is_featured: v })} />
                    <Label className="text-xs">مميزة</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                    <Label className="text-xs">نشطة</Label>
                  </div>
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">
                {editing ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الأيقونة</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">مميزة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الرابط</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">لا توجد أدوات بعد</TableCell></TableRow>
            ) : tools.map(tool => (
              <TableRow key={tool.id}>
                <TableCell>
                  {tool.icon_url ? (
                    <img src={tool.icon_url} alt={tool.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : (
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color || 'from-purple-500 to-pink-500'} flex items-center justify-center`}>
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{tool.name}</TableCell>
                <TableCell><Badge variant="secondary">{getCategoryLabel(tool.category)}</Badge></TableCell>
                <TableCell>{tool.is_featured && <Star className="w-4 h-4 text-primary fill-primary" />}</TableCell>
                <TableCell><Badge variant={tool.is_active ? 'default' : 'secondary'}>{tool.is_active ? 'نشطة' : 'معطلة'}</Badge></TableCell>
                <TableCell>
                  {tool.tool_url ? (
                    <a href={tool.tool_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  ) : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(tool)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(tool.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAIToolsTable;