import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Images, Youtube, Sparkles, Upload } from 'lucide-react';
import { WifiProduct, useWifiProductImages } from '@/hooks/useWifiProducts';
import { useWifiVideos, useWifiUpdates, uploadWifiImage } from '@/hooks/useWifiSystemDetails';

interface Props {
  product: WifiProduct | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const AdminWifiContentDialog: React.FC<Props> = ({ product, open, onOpenChange }) => {
  const { images, addImage, deleteImage } = useWifiProductImages(product?.id);
  const { videos, addVideo, deleteVideo } = useWifiVideos(product?.id);
  const { updates, addUpdate, deleteUpdate } = useWifiUpdates(product?.id);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [vid, setVid] = useState({ title: '', youtube_url: '' });
  const [upd, setUpd] = useState({ version: '', changelog: '', size: '', download_url: '', is_major: false });

  if (!product) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const publicUrl = await uploadWifiImage(files[i], product.id);
      if (publicUrl) await addImage.mutateAsync({ product_id: product.id, image_url: publicUrl, sort_order: images.length + i });
    }
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>محتوى النظام: {product.name}</DialogTitle></DialogHeader>

        <Tabs defaultValue="shots" dir="rtl">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="shots"><Images className="w-4 h-4 ml-1" />اللقطات</TabsTrigger>
            <TabsTrigger value="videos"><Youtube className="w-4 h-4 ml-1" />الفيديوهات</TabsTrigger>
            <TabsTrigger value="updates"><Sparkles className="w-4 h-4 ml-1" />التحديثات</TabsTrigger>
          </TabsList>

          <TabsContent value="shots" className="space-y-3 pt-3">
            <div>
              <Label>رفع صور من الملفات</Label>
              <Input type="file" accept="image/*" multiple disabled={uploading} onChange={e => handleFiles(e.target.files)} />
              {uploading && <p className="text-xs text-muted-foreground mt-1">جاري الرفع...</p>}
            </div>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>أو أضف عبر رابط</Label>
                <Input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
              </div>
              <Button size="sm" disabled={!url.trim()} onClick={() => {
                addImage.mutate({ product_id: product.id, image_url: url.trim(), sort_order: images.length });
                setUrl('');
              }}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {images.map(s => (
                <div key={s.id} className="relative rounded-lg overflow-hidden border border-border">
                  <img src={s.image_url} alt="لقطة" className="w-full h-24 object-cover" />
                  <button className="absolute top-1 left-1 bg-destructive text-destructive-foreground rounded-md p-1"
                    aria-label="حذف اللقطة" onClick={() => deleteImage.mutate(s.id)}>
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length === 0 && <p className="col-span-3 text-center text-xs text-muted-foreground py-4">لا توجد لقطات بعد</p>}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-3 pt-3">
            <div className="rounded-xl border border-border p-3 space-y-2">
              <div>
                <Label>عنوان الفيديو *</Label>
                <Input value={vid.title} onChange={e => setVid({ ...vid, title: e.target.value })} placeholder="شرح تثبيت النظام" />
              </div>
              <div>
                <Label>رابط يوتيوب *</Label>
                <Input value={vid.youtube_url} onChange={e => setVid({ ...vid, youtube_url: e.target.value })} placeholder="https://youtu.be/..." dir="ltr" />
              </div>
              <Button className="w-full" disabled={!vid.title.trim() || !vid.youtube_url.trim()}
                onClick={async () => {
                  await addVideo.mutateAsync({ product_id: product.id, title: vid.title.trim(), youtube_url: vid.youtube_url.trim(), sort_order: videos.length });
                  setVid({ title: '', youtube_url: '' });
                }}>
                <Plus className="w-4 h-4 ml-1" />إضافة فيديو
              </Button>
            </div>
            <div className="space-y-2">
              {videos.map(v => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-border p-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{v.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate" dir="ltr">{v.youtube_url}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteVideo.mutate(v.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {videos.length === 0 && <p className="text-center text-xs text-muted-foreground py-3">لا توجد فيديوهات بعد</p>}
            </div>
          </TabsContent>

          <TabsContent value="updates" className="space-y-3 pt-3">
            <div className="rounded-xl border border-border p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>رقم الإصدار *</Label>
                  <Input value={upd.version} onChange={e => setUpd({ ...upd, version: e.target.value })} placeholder="2.0.1" />
                </div>
                <div>
                  <Label>الحجم</Label>
                  <Input value={upd.size} onChange={e => setUpd({ ...upd, size: e.target.value })} placeholder="24 MB" />
                </div>
              </div>
              <div>
                <Label>ما الجديد في هذا التحديث</Label>
                <Textarea rows={3} value={upd.changelog} onChange={e => setUpd({ ...upd, changelog: e.target.value })} />
              </div>
              <div>
                <Label>رابط تحميل الإصدار</Label>
                <Input value={upd.download_url} onChange={e => setUpd({ ...upd, download_url: e.target.value })} placeholder="https://..." dir="ltr" />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={upd.is_major} onCheckedChange={v => setUpd({ ...upd, is_major: v })} />
                <Label>تحديث رئيسي</Label>
              </div>
              <Button className="w-full" disabled={!upd.version.trim()} onClick={async () => {
                await addUpdate.mutateAsync({
                  product_id: product.id, version: upd.version.trim(),
                  changelog: upd.changelog || null, size: upd.size || null,
                  download_url: upd.download_url || null, is_major: upd.is_major,
                });
                setUpd({ version: '', changelog: '', size: '', download_url: '', is_major: false });
              }}>
                <Upload className="w-4 h-4 ml-1" />نشر التحديث
              </Button>
            </div>
            <div className="space-y-2">
              {updates.map(u => (
                <div key={u.id} className="flex items-start justify-between rounded-lg border border-border p-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">v{u.version}</span>
                      {u.is_major && <Badge className="text-[9px]">رئيسي</Badge>}
                      <span className="text-[10px] text-muted-foreground">{new Date(u.released_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                    {u.changelog && <p className="text-[11px] text-muted-foreground whitespace-pre-line mt-1">{u.changelog}</p>}
                  </div>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteUpdate.mutate(u.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {updates.length === 0 && <p className="text-center text-xs text-muted-foreground py-3">لا توجد تحديثات بعد</p>}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminWifiContentDialog;