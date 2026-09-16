import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Upload, Plus, Save } from 'lucide-react';
import { usePortfolioItem, usePortfolioImages, uploadPortfolioImage } from '@/hooks/usePortfolioDetails';
import { usePortfolio } from '@/hooks/usePortfolio';

interface Props {
  itemId: string | null;
  onOpenChange: (open: boolean) => void;
}

const AdminPortfolioDetailsDialog: React.FC<Props> = ({ itemId, onOpenChange }) => {
  const { item } = usePortfolioItem(itemId || undefined);
  const { images, addImage, deleteImage } = usePortfolioImages(itemId || undefined);
  const { updateItem } = usePortfolio();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [form, setForm] = useState({ details: '', client_name: '', project_date: '', project_url: '' });

  useEffect(() => {
    if (item) {
      setForm({
        details: item.details || '',
        client_name: item.client_name || '',
        project_date: item.project_date ? String(item.project_date).slice(0, 10) : '',
        project_url: item.project_url || '',
      });
    }
  }, [item]);

  const handleSave = async () => {
    if (!itemId) return;
    await updateItem(itemId, {
      details: form.details || null,
      client_name: form.client_name || null,
      project_date: form.project_date || null,
      project_url: form.project_url || null,
    } as any);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !itemId) return;
    setUploading(true);
    const url = await uploadPortfolioImage(file, itemId);
    if (url) await addImage.mutateAsync({ item_id: itemId, image_url: url, caption: caption || null, sort_order: images.length });
    setCaption('');
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleAddUrl = async () => {
    if (!itemId || !imgUrl) return;
    await addImage.mutateAsync({ item_id: itemId, image_url: imgUrl, caption: caption || null, sort_order: images.length });
    setImgUrl('');
    setCaption('');
  };

  return (
    <Dialog open={!!itemId} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-custom">
        <DialogHeader>
          <DialogTitle>تفاصيل العمل: {item?.title || ''}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">التفاصيل</TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1">معرض الصور ({images.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-3 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>اسم العميل</Label>
                <Input value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} placeholder="اسم العميل" />
              </div>
              <div className="space-y-1">
                <Label>تاريخ المشروع</Label>
                <Input type="date" value={form.project_date} onChange={e => setForm({ ...form, project_date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>رابط المشروع</Label>
              <Input value={form.project_url} onChange={e => setForm({ ...form, project_url: e.target.value })} placeholder="https://" />
            </div>
            <div className="space-y-1">
              <Label>تفاصيل كاملة عن العمل</Label>
              <Textarea rows={6} value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="اشرح تفاصيل المشروع، الأهداف، النتائج..." />
            </div>
            <Button onClick={handleSave}><Save className="w-4 h-4 ml-1" />حفظ التفاصيل</Button>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4 pt-4">
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <Input value={caption} onChange={e => setCaption(e.target.value)} placeholder="تعليق الصورة (اختياري)" />
              <div className="flex gap-2">
                <Input value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="رابط الصورة" className="flex-1" />
                <Button size="sm" onClick={handleAddUrl} disabled={!imgUrl}><Plus className="w-4 h-4 ml-1" />إضافة</Button>
                <input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} className="hidden" />
                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  <Upload className="w-4 h-4 ml-1" />{uploading ? 'جاري...' : 'رفع'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map(img => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border">
                  <img src={img.image_url} alt={img.caption || 'صورة العمل'} className="w-full h-28 object-cover" />
                  {img.caption && <p className="text-xs p-1 truncate text-muted-foreground">{img.caption}</p>}
                  <Button size="icon" variant="destructive" className="absolute top-1 left-1 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteImage.mutate(img.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
              {images.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground py-6 text-sm">لا توجد صور إضافية</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPortfolioDetailsDialog;
