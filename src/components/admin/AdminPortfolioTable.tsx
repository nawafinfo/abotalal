import { uploadToBucket } from '@/lib/uploadFile';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit2, Save, X, Image, Upload, Settings2 } from 'lucide-react';
import { usePortfolio, PORTFOLIO_CATEGORIES } from '@/hooks/usePortfolio';
import AdminPortfolioDetailsDialog from './AdminPortfolioDetailsDialog';
import ExportButton from './ExportButton';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPortfolioTable: React.FC = () => {
  const { items, addItem, updateItem, deleteItem } = usePortfolio();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', category: 'social_media', image_url: '', sort_order: 0, is_active: true });
  const [uploading, setUploading] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setForm({ title: '', description: '', category: 'social_media', image_url: '', sort_order: 0, is_active: true });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadToBucket('portfolio', file, 'items');
    if (error || !url) {
      toast({ title: 'خطأ', description: error || 'فشل رفع الصورة', variant: 'destructive' });
    } else {
      setForm(f => ({ ...f, image_url: url }));
    }
    e.target.value = '';
    setUploading(false);
  };

  const handleAdd = async () => {
    if (!form.title) return;
    await addItem(form);
    resetForm();
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    await updateItem(editingId, form);
    resetForm();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description || '', category: item.category, image_url: item.image_url || '', sort_order: item.sort_order, is_active: item.is_active });
    setIsAdding(false);
  };

  const getCategoryLabel = (val: string) => PORTFOLIO_CATEGORIES.find(c => c.value === val)?.label || val;

  const exportColumns = [
    { header: 'العنوان', key: 'title' },
    { header: 'القسم', key: 'category' },
    { header: 'الوصف', key: 'description' },
    { header: 'الحالة', key: 'is_active' },
  ];
  const exportData = items.map(i => ({ ...i, category: getCategoryLabel(i.category), is_active: i.is_active ? 'نعم' : 'لا' }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة معرض الأعمال</CardTitle>
        <div className="flex gap-2">
          <ExportButton
            onExportExcel={() => exportToExcel(exportData, exportColumns, 'portfolio')}
            onExportPDF={() => exportToPDF(exportData, exportColumns, 'portfolio', 'معرض الأعمال')}
          />
          <Button size="sm" onClick={() => { setIsAdding(true); setEditingId(null); }}>
            <Plus className="w-4 h-4 ml-1" />إضافة
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="bg-muted/50 p-4 rounded-lg mb-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="عنوان العمل" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PORTFOLIO_CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.icon} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea placeholder="وصف العمل" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex gap-2 items-center">
                <Input placeholder="رابط الصورة" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="flex-1" />
                <input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} className="hidden" />
                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 ml-1" />{uploading ? 'جاري...' : 'رفع'}
                </Button>
              </div>
              <Input type="number" placeholder="الترتيب" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            {form.image_url && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex gap-2">
              <Button size="sm" onClick={editingId ? handleUpdate : handleAdd}>
                <Save className="w-4 h-4 ml-1" />{editingId ? 'تحديث' : 'حفظ'}
              </Button>
              <Button size="sm" variant="outline" onClick={resetForm}>
                <X className="w-4 h-4 ml-1" />إلغاء
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصورة</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Image className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{getCategoryLabel(item.category)}</TableCell>
                  <TableCell>
                    <Switch checked={item.is_active} onCheckedChange={v => updateItem(item.id, { is_active: v })} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" title="التفاصيل والمعرض" onClick={() => setDetailsId(item.id)}>
                        <Settings2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => startEdit(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">لا توجد أعمال بعد</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <AdminPortfolioDetailsDialog itemId={detailsId} onOpenChange={(o) => !o && setDetailsId(null)} />
    </Card>
  );
};

export default AdminPortfolioTable;
