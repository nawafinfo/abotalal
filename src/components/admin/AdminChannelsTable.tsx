import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChannels, Channel } from '@/hooks/useChannels';
import { toast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Eye, ThumbsUp, Radio } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { Switch } from '@/components/ui/switch';
import ExportButton from './ExportButton';

const channelColumns = [
  { header: 'الاسم', key: 'name' },
  { header: 'القسم', key: 'cat_label' },
  { header: 'المشاهدات', key: 'views_count' },
  { header: 'الإعجابات', key: 'likes_count' },
  { header: 'الحالة', key: 'status_label' },
];

const categories = [
  { value: 'news', label: 'الأخبار' },
  { value: 'entertainment', label: 'الترفيه' },
  { value: 'movies', label: 'أفلام ومسلسلات' },
  { value: 'sports', label: 'الرياضة' },
];

const emptyForm = {
  name: '', description: '', stream_url: '', thumbnail_url: '', logo_url: '',
  category: 'news', is_active: true, sort_order: 0, views_count: 0, likes_count: 0,
};

const AdminChannelsTable: React.FC = () => {
  const { channels, createChannel, updateChannel, deleteChannel } = useChannels();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleSave = async () => {
    if (!form.name) { toast({ title: 'الاسم مطلوب', variant: 'destructive' }); return; }
    if (editingId) {
      const { error } = await updateChannel(editingId, form);
      if (!error) toast({ title: 'تم التحديث بنجاح' });
    } else {
      const { error } = await createChannel(form);
      if (!error) toast({ title: 'تمت الإضافة بنجاح' });
    }
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (ch: Channel) => {
    setForm({
      name: ch.name, description: ch.description || '', stream_url: ch.stream_url || '',
      thumbnail_url: ch.thumbnail_url || '', logo_url: ch.logo_url || '',
      category: ch.category, is_active: ch.is_active, sort_order: ch.sort_order,
      views_count: ch.views_count, likes_count: ch.likes_count,
    });
    setEditingId(ch.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteChannel(id);
    if (!error) toast({ title: 'تم الحذف بنجاح' });
  };

  const totalViews = channels.reduce((s, c) => s + c.views_count, 0);
  const totalLikes = channels.reduce((s, c) => s + c.likes_count, 0);

  const exportData = channels.map(c => ({
    ...c,
    cat_label: categories.find(x => x.value === c.category)?.label || c.category,
    status_label: c.is_active ? 'نشط' : 'متوقف',
  }));

  const handleExportExcel = () => exportToExcel(exportData, channelColumns, 'channels');
  const handleExportPDF = () => exportToPDF(exportData, channelColumns, 'channels', 'البث المباشر');

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{channels.length}</p>
          <p className="text-xs text-muted-foreground">إجمالي القنوات</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{channels.filter(c => c.is_active).length}</p>
          <p className="text-xs text-muted-foreground">قنوات نشطة</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{totalViews}</p>
          <p className="text-xs text-muted-foreground">إجمالي المشاهدات</p>
        </CardContent></Card>
        <Card><CardContent className="p-3 text-center">
          <p className="text-2xl font-bold text-foreground">{totalLikes}</p>
          <p className="text-xs text-muted-foreground">إجمالي الإعجابات</p>
        </CardContent></Card>
      </div>

      <div className="flex items-center justify-between">
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 ml-2" />إضافة قناة</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? 'تعديل القناة' : 'إضافة قناة جديدة'}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="اسم القناة" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="الوصف" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="رابط البث (m3u8, mp4, ...)" value={form.stream_url} onChange={e => setForm({ ...form, stream_url: e.target.value })} />
              <Input placeholder="رابط الصورة المصغرة" value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} />
              <Input placeholder="رابط اللوجو" value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} />
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-3 gap-2">
                <Input type="number" placeholder="الترتيب" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
                <Input type="number" placeholder="المشاهدات" value={form.views_count} onChange={e => setForm({ ...form, views_count: Number(e.target.value) })} />
                <Input type="number" placeholder="الإعجابات" value={form.likes_count} onChange={e => setForm({ ...form, likes_count: Number(e.target.value) })} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                <span className="text-sm">نشط</span>
              </div>
              <Button onClick={handleSave} className="w-full">{editingId ? 'تحديث' : 'إضافة'}</Button>
            </div>
          </DialogContent>
        </Dialog>
        <ExportButton onExportExcel={handleExportExcel} onExportPDF={handleExportPDF} />
      </div>

      {/* Channels list */}
      <div className="space-y-2">
        {channels.map(ch => (
          <Card key={ch.id}>
            <CardContent className="p-3 flex items-center gap-3">
              {ch.thumbnail_url ? (
                <img src={ch.thumbnail_url} alt={ch.name} className="w-16 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Radio className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{ch.name}</p>
                <p className="text-xs text-muted-foreground">{categories.find(c => c.value === ch.category)?.label}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{ch.views_count}</span>
                <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />{ch.likes_count}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(ch)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(ch.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {channels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">لا توجد قنوات بعد</div>
        )}
      </div>
    </div>
  );
};

export default AdminChannelsTable;
