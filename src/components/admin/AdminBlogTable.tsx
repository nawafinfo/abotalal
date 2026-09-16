import React, { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Upload, Link as LinkIcon, FileText, Layers, Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import RichTextEditor from '@/components/RichTextEditor';
import { useBlogSections, useBlogPosts, BlogSection, BlogPost } from '@/hooks/useTechBlog';
import { ICON_NAMES, getIcon } from '@/lib/iconMap';
import { uploadToBucket } from '@/lib/uploadFile';

const emptyPost = { title: '', summary: '', image_url: '', content: '', section_id: '', is_active: true, sort_order: 0 };
const emptySection = {
  name: '', slug: '', description: '', icon: 'ShieldCheck', color: '#0ea5e9',
  gradient_from: '#0f172a', gradient_to: '#0ea5e9', parent_id: '', is_active: true, sort_order: 0,
};

const AdminBlogTable: React.FC = () => {
  const { sections, addSection, updateSection, deleteSection, refetch: refetchSections } = useBlogSections();
  const { posts, addPost, updatePost, deletePost } = useBlogPosts();

  const [postOpen, setPostOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingSection, setEditingSection] = useState<BlogSection | null>(null);
  const [postForm, setPostForm] = useState<any>(emptyPost);
  const [sectionForm, setSectionForm] = useState<any>(emptySection);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');

  const sectionLabel = (s: BlogSection) => {
    const parent = sections.find(p => p.id === s.parent_id);
    return parent ? `${parent.name} › ${s.name}` : s.name;
  };
  const orderedSections = useMemo(
    () => [...sections].sort((a, b) => sectionLabel(a).localeCompare(sectionLabel(b), 'ar')),
    [sections]
  );
  const filteredPosts = useMemo(
    () => posts.filter(p => p.title.toLowerCase().includes(query.toLowerCase())),
    [posts, query]
  );

  /* ---------- المواضيع ---------- */
  const openNewPost = () => { setEditingPost(null); setPostForm(emptyPost); setPostOpen(true); };
  const openEditPost = (p: BlogPost) => {
    setEditingPost(p);
    setPostForm({
      title: p.title, summary: p.summary || '', image_url: p.image_url || '', content: p.content || '',
      section_id: p.section_id || '', is_active: p.is_active, sort_order: p.sort_order,
    });
    setPostOpen(true);
  };

  const uploadPostImage = async (file?: File | null) => {
    if (!file) return;
    const { url, error } = await uploadToBucket('portfolio', file, 'blog');
    if (error || !url) { toast.error(error || 'فشل رفع الصورة'); return; }
    setPostForm((f: any) => ({ ...f, image_url: url }));
    toast.success('تم رفع الصورة');
  };

  const savePost = async () => {
    if (!postForm.title.trim()) { toast.error('العنوان مطلوب'); return; }
    if (!postForm.section_id) { toast.error('يرجى اختيار القسم'); return; }
    setSaving(true);
    const values = {
      title: postForm.title.trim(),
      summary: postForm.summary?.trim() || null,
      image_url: postForm.image_url?.trim() || null,
      content: postForm.content || null,
      section_id: postForm.section_id,
      is_active: postForm.is_active,
      sort_order: Number(postForm.sort_order) || 0,
    };
    const { error } = editingPost ? await updatePost(editingPost.id, values) : await addPost(values);
    setSaving(false);
    if (error) { toast.error('تعذّر الحفظ'); return; }
    toast.success(editingPost ? 'تم تحديث الموضوع' : 'تم نشر الموضوع');
    setPostOpen(false);
  };

  /* ---------- الأقسام ---------- */
  const openNewSection = () => { setEditingSection(null); setSectionForm(emptySection); setSectionOpen(true); };
  const openEditSection = (s: BlogSection) => {
    setEditingSection(s);
    setSectionForm({
      name: s.name, slug: s.slug, description: s.description || '', icon: s.icon || 'ShieldCheck',
      color: s.color || '#0ea5e9', gradient_from: s.gradient_from || '#0f172a', gradient_to: s.gradient_to || '#0ea5e9',
      parent_id: s.parent_id || '', is_active: s.is_active, sort_order: s.sort_order,
    });
    setSectionOpen(true);
  };

  const saveSection = async () => {
    if (!sectionForm.name.trim()) { toast.error('اسم القسم مطلوب'); return; }
    const slug = (sectionForm.slug || sectionForm.name).trim().replace(/\s+/g, '-').toLowerCase();
    setSaving(true);
    const values = {
      name: sectionForm.name.trim(), slug,
      description: sectionForm.description?.trim() || null,
      icon: sectionForm.icon, color: sectionForm.color,
      gradient_from: sectionForm.gradient_from, gradient_to: sectionForm.gradient_to,
      parent_id: sectionForm.parent_id || null,
      is_active: sectionForm.is_active, sort_order: Number(sectionForm.sort_order) || 0,
    };
    const { error } = editingSection ? await updateSection(editingSection.id, values) : await addSection(values);
    setSaving(false);
    if (error) { toast.error('تعذّر الحفظ (تأكد أن الرابط المختصر غير مكرر)'); return; }
    toast.success('تم الحفظ');
    setSectionOpen(false);
    refetchSections();
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="posts" dir="rtl">
        <TabsList>
          <TabsTrigger value="posts" className="gap-1"><FileText className="w-4 h-4" />المواضيع</TabsTrigger>
          <TabsTrigger value="sections" className="gap-1"><Layers className="w-4 h-4" />الأقسام</TabsTrigger>
        </TabsList>

        {/* المواضيع */}
        <TabsContent value="posts" className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={openNewPost} className="gap-1"><Plus className="w-4 h-4" />فتح موضوع</Button>
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="بحث في المواضيع" className="pr-9" />
            </div>
          </div>

          <div className="grid gap-3">
            {filteredPosts.map(p => {
              const s = sections.find(x => x.id === p.section_id);
              return (
                <Card key={p.id}>
                  <CardContent className="p-3 flex items-center gap-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{p.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{s ? sectionLabel(s) : 'بدون قسم'} · {p.views_count} مشاهدة</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" aria-label="تبديل الظهور" onClick={() => updatePost(p.id, { is_active: !p.is_active })}>
                        {p.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="تعديل" onClick={() => openEditPost(p)}><Pencil className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" aria-label="حذف"
                        onClick={() => { if (confirm('حذف هذا الموضوع؟')) deletePost(p.id); }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {filteredPosts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">لا توجد مواضيع بعد</p>
            )}
          </div>
        </TabsContent>

        {/* الأقسام */}
        <TabsContent value="sections" className="space-y-3">
          <Button onClick={openNewSection} className="gap-1"><Plus className="w-4 h-4" />إضافة قسم</Button>
          <div className="grid gap-2 sm:grid-cols-2">
            {orderedSections.map(s => {
              const Icon = getIcon(s.icon || 'ShieldCheck');
              return (
                <Card key={s.id}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${s.color}1f`, border: `1px solid ${s.color}55` }}>
                      <Icon className="w-5 h-5" style={{ color: s.color || '#0ea5e9' }} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{sectionLabel(s)}</p>
                      <p className="text-[11px] text-muted-foreground truncate">/{s.slug}</p>
                    </div>
                    <Button size="icon" variant="ghost" aria-label="تبديل الظهور" onClick={() => updateSection(s.id, { is_active: !s.is_active })}>
                      {s.is_active ? <Eye className="w-4 h-4 text-emerald-500" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="تعديل" onClick={() => openEditSection(s)}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="حذف"
                      onClick={() => { if (confirm('حذف القسم وكل ما يتبعه؟')) deleteSection(s.id); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* حوار الموضوع */}
      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent dir="rtl" className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPost ? 'تعديل الموضوع' : 'فتح موضوع جديد'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>القسم</Label>
              <Select value={postForm.section_id} onValueChange={v => setPostForm({ ...postForm, section_id: v })}>
                <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
                <SelectContent>
                  {orderedSections.map(s => <SelectItem key={s.id} value={s.id}>{sectionLabel(s)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>العنوان</Label>
              <Input value={postForm.title} maxLength={200} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
            </div>
            <div>
              <Label>الموجز</Label>
              <Textarea rows={2} maxLength={400} value={postForm.summary} onChange={e => setPostForm({ ...postForm, summary: e.target.value })} />
            </div>
            <div>
              <Label>صورة المقال</Label>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative flex-1 min-w-[200px]">
                  <LinkIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pr-9" placeholder="رابط الصورة" value={postForm.image_url} onChange={e => setPostForm({ ...postForm, image_url: e.target.value })} />
                </div>
                <label className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-border cursor-pointer text-sm">
                  <Upload className="w-4 h-4" />رفع
                  <input type="file" accept="image/*" className="hidden" onChange={e => uploadPostImage(e.target.files?.[0])} />
                </label>
                {postForm.image_url && <img src={postForm.image_url} alt="معاينة" className="w-14 h-14 rounded-lg object-cover" />}
              </div>
            </div>
            <div>
              <Label>تفاصيل الموضوع</Label>
              <RichTextEditor value={postForm.content} onChange={html => setPostForm((f: any) => ({ ...f, content: html }))} />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={postForm.is_active} onCheckedChange={v => setPostForm({ ...postForm, is_active: v })} />
                <Label>منشور</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label>الترتيب</Label>
                <Input type="number" className="w-20" value={postForm.sort_order} onChange={e => setPostForm({ ...postForm, sort_order: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPostOpen(false)}>إلغاء</Button>
            <Button onClick={savePost} disabled={saving}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* حوار القسم */}
      <Dialog open={sectionOpen} onOpenChange={setSectionOpen}>
        <DialogContent dir="rtl" className="max-w-lg max-h-[92vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingSection ? 'تعديل القسم' : 'إضافة قسم'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>الاسم</Label><Input value={sectionForm.name} onChange={e => setSectionForm({ ...sectionForm, name: e.target.value })} /></div>
            <div><Label>الرابط المختصر (إنجليزي)</Label><Input value={sectionForm.slug} onChange={e => setSectionForm({ ...sectionForm, slug: e.target.value })} placeholder="whatsapp" /></div>
            <div><Label>الوصف</Label><Textarea rows={2} value={sectionForm.description} onChange={e => setSectionForm({ ...sectionForm, description: e.target.value })} /></div>
            <div>
              <Label>القسم الأب (اختياري)</Label>
              <Select value={sectionForm.parent_id || 'none'} onValueChange={v => setSectionForm({ ...sectionForm, parent_id: v === 'none' ? '' : v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">قسم رئيسي</SelectItem>
                  {sections.filter(s => !s.parent_id && s.id !== editingSection?.id).map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>الأيقونة</Label>
              <Select value={sectionForm.icon} onValueChange={v => setSectionForm({ ...sectionForm, icon: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-64">
                  {ICON_NAMES.map(n => {
                    const I = getIcon(n);
                    return <SelectItem key={n} value={n}><span className="flex items-center gap-2"><I className="w-4 h-4" />{n}</span></SelectItem>;
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">اللون</Label><Input type="color" value={sectionForm.color} onChange={e => setSectionForm({ ...sectionForm, color: e.target.value })} /></div>
              <div><Label className="text-xs">تدرج من</Label><Input type="color" value={sectionForm.gradient_from} onChange={e => setSectionForm({ ...sectionForm, gradient_from: e.target.value })} /></div>
              <div><Label className="text-xs">تدرج إلى</Label><Input type="color" value={sectionForm.gradient_to} onChange={e => setSectionForm({ ...sectionForm, gradient_to: e.target.value })} /></div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={sectionForm.is_active} onCheckedChange={v => setSectionForm({ ...sectionForm, is_active: v })} />
                <Label>مفعّل</Label>
              </div>
              <div className="flex items-center gap-2">
                <Label>الترتيب</Label>
                <Input type="number" className="w-20" value={sectionForm.sort_order} onChange={e => setSectionForm({ ...sectionForm, sort_order: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSectionOpen(false)}>إلغاء</Button>
            <Button onClick={saveSection} disabled={saving}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogTable;
