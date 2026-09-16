import { uploadToBucket } from '@/lib/uploadFile';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Edit2, Save, X, Users, Upload } from 'lucide-react';
import { useFeaturedClients } from '@/hooks/useFeaturedClients';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminFeaturedClientsTable: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useFeaturedClients();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', image_url: '', sort_order: 0, is_active: true });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetForm = () => { setForm({ name: '', image_url: '', sort_order: 0, is_active: true }); setIsAdding(false); setEditingId(null); };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { url, error } = await uploadToBucket('portfolio', file, 'clients');
    if (error || !url) {
      toast({ title: 'خطأ', description: error || 'فشل رفع الصورة', variant: 'destructive' });
    } else {
      setForm(f => ({ ...f, image_url: url }));
    }
    e.target.value = '';
    setUploading(false);
  };

  const handleAdd = async () => { if (!form.name) return; await addClient(form); resetForm(); };
  const handleUpdate = async () => { if (!editingId) return; await updateClient(editingId, form); resetForm(); };
  const startEdit = (c: any) => { setEditingId(c.id); setForm({ name: c.name, image_url: c.image_url || '', sort_order: c.sort_order, is_active: c.is_active }); setIsAdding(false); };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>إدارة العملاء المميزين</CardTitle>
        <Button size="sm" onClick={() => { setIsAdding(true); setEditingId(null); }}><Plus className="w-4 h-4 ml-1" />إضافة</Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="bg-muted/50 p-4 rounded-lg mb-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="اسم العميل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <Input type="number" placeholder="الترتيب" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex gap-2 items-center">
              <Input placeholder="رابط الصورة" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className="flex-1" />
              <input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} className="hidden" />
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <Upload className="w-4 h-4 ml-1" />{uploading ? 'جاري...' : 'رفع'}
              </Button>
            </div>
            {form.image_url && <img src={form.image_url} alt="preview" className="w-16 h-16 rounded-full object-cover border border-border" />}
            <div className="flex gap-2">
              <Button size="sm" onClick={editingId ? handleUpdate : handleAdd}><Save className="w-4 h-4 ml-1" />{editingId ? 'تحديث' : 'حفظ'}</Button>
              <Button size="sm" variant="outline" onClick={resetForm}><X className="w-4 h-4 ml-1" />إلغاء</Button>
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map(c => (
              <TableRow key={c.id}>
                <TableCell>
                  {c.image_url ? <img src={c.image_url} alt={c.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"><Users className="w-4 h-4 text-muted-foreground" /></div>}
                </TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell><Switch checked={c.is_active} onCheckedChange={v => updateClient(c.id, { is_active: v })} /></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Edit2 className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteClient(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">لا يوجد عملاء مميزون بعد</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminFeaturedClientsTable;
