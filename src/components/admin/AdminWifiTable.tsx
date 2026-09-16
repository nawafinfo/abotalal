import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Wifi, Shield, Globe, Wrench, AlertTriangle, Send, FileText, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useWifiProducts, WifiProduct } from '@/hooks/useWifiProducts';
import { useWifiOrders, WifiOrder } from '@/hooks/useWifiOrders';
import { useWifiPosts, WifiPost } from '@/hooks/useWifiPosts';
import AdminWifiContentDialog from '@/components/admin/AdminWifiContentDialog';
import ExportButton from '@/components/admin/ExportButton';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { toast } from '@/hooks/use-toast';

const productCategories = [
  { id: 'systems', label: 'أنظمة التحكم' },
  { id: 'security', label: 'الحماية' },
  { id: 'hotspot', label: 'الهوتسبوت' },
  { id: 'tools', label: 'الأدوات' },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'معلق', color: 'bg-yellow-500' },
  confirmed: { label: 'مؤكد', color: 'bg-blue-500' },
  processing: { label: 'قيد التنفيذ', color: 'bg-purple-500' },
  completed: { label: 'مكتمل', color: 'bg-green-500' },
  cancelled: { label: 'ملغي', color: 'bg-red-500' },
};

const AdminWifiTable: React.FC = () => {
  const [adminTab, setAdminTab] = useState('products');
  const [productDialog, setProductDialog] = useState(false);
  const [postDialog, setPostDialog] = useState(false);
  const [orderDetailDialog, setOrderDetailDialog] = useState(false);
  const [notifyDialog, setNotifyDialog] = useState(false);
  const [contentDialog, setContentDialog] = useState(false);
  const [contentProduct, setContentProduct] = useState<WifiProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<WifiProduct | null>(null);
  const [editingPost, setEditingPost] = useState<WifiPost | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<WifiOrder | null>(null);
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');

  const [productForm, setProductForm] = useState({
    name: '', description: '', category: 'systems', type: '', price: 0, discount_percent: 0,
    is_free: false, image_url: '', logo_url: '', preview_url: '', download_url: '', code_content: '', is_active: true, sort_order: 0,
    os: '', size: '', version: '', developer_name: '', support_url: '', support_email: '', support_phone: '', website_url: '', guide_content: '',
  });

  const [postForm, setPostForm] = useState({ title: '', summary: '', content: '', image_url: '', is_active: true, sort_order: 0 });

  const { allProducts, createProduct, updateProduct, deleteProduct } = useWifiProducts();
  const { orders, updateOrder, deleteOrder, sendNotification } = useWifiOrders();
  const { posts, createPost, updatePost, deletePost } = useWifiPosts();

  const openProductDialog = (product?: WifiProduct) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name, description: product.description || '', category: product.category,
        type: product.type || '', price: product.price, discount_percent: product.discount_percent || 0,
        is_free: product.is_free, image_url: product.image_url || '', logo_url: product.logo_url || '',
        preview_url: product.preview_url || '', download_url: product.download_url || '',
        code_content: product.code_content || '', is_active: product.is_active, sort_order: product.sort_order,
        os: (product as any).os || '', size: (product as any).size || '', version: (product as any).version || '',
        developer_name: (product as any).developer_name || '', support_url: (product as any).support_url || '',
        support_email: (product as any).support_email || '', support_phone: (product as any).support_phone || '',
        website_url: (product as any).website_url || '', guide_content: (product as any).guide_content || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '', description: '', category: 'systems', type: '', price: 0, discount_percent: 0, is_free: false,
        image_url: '', logo_url: '', preview_url: '', download_url: '', code_content: '', is_active: true, sort_order: 0,
        os: '', size: '', version: '', developer_name: '', support_url: '', support_email: '', support_phone: '', website_url: '', guide_content: '',
      });
    }
    setProductDialog(true);
  };

  const saveProduct = async () => {
    if (!productForm.name) { toast({ title: 'اسم المنتج مطلوب', variant: 'destructive' }); return; }
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, ...productForm });
    } else {
      await createProduct.mutateAsync(productForm);
    }
    setProductDialog(false);
  };

  const openPostDialog = (post?: WifiPost) => {
    if (post) {
      setEditingPost(post);
      setPostForm({ title: post.title, summary: post.summary || '', content: post.content || '', image_url: post.image_url || '', is_active: post.is_active, sort_order: post.sort_order });
    } else {
      setEditingPost(null);
      setPostForm({ title: '', summary: '', content: '', image_url: '', is_active: true, sort_order: 0 });
    }
    setPostDialog(true);
  };

  const savePost = async () => {
    if (!postForm.title) { toast({ title: 'عنوان المنشور مطلوب', variant: 'destructive' }); return; }
    if (editingPost) {
      await updatePost.mutateAsync({ id: editingPost.id, ...postForm });
    } else {
      await createPost.mutateAsync(postForm);
    }
    setPostDialog(false);
  };

  const handleStatusChange = async (order: WifiOrder, newStatus: string) => {
    await updateOrder.mutateAsync({ id: order.id, status: newStatus });
  };

  const handleSendNotification = async () => {
    if (!selectedOrder?.user_id || !notifyTitle) return;
    await sendNotification(selectedOrder.user_id, notifyTitle, notifyMessage);
    toast({ title: 'تم إرسال الإشعار بنجاح' });
    setNotifyDialog(false);
    setNotifyTitle('');
    setNotifyMessage('');
  };

  const orderTypeLabel = (t: string) => t === 'purchase' ? 'شراء' : t === 'custom_request' ? 'طلب مخصص' : 'استفسار';

  const productColumns = [
    { header: 'الاسم', key: 'name' }, { header: 'القسم', key: 'category' },
    { header: 'النوع', key: 'type' }, { header: 'السعر', key: 'price' },
    { header: 'مجاني', key: 'is_free' }, { header: 'نشط', key: 'is_active' },
  ];
  const productExportData = allProducts.map(p => ({
    name: p.name, category: p.category, type: p.type || '-', price: p.price,
    is_free: p.is_free ? 'نعم' : 'لا', is_active: p.is_active ? 'نعم' : 'لا',
  }));

  const orderColumns = [
    { header: 'المنتج', key: 'product_name' }, { header: 'النوع', key: 'order_type' },
    { header: 'العميل', key: 'customer_name' }, { header: 'الهاتف', key: 'phone' },
    { header: 'البلد', key: 'country' }, { header: 'الحالة', key: 'status' },
  ];
  const orderExportData = orders.map(o => ({
    product_name: o.product_name, order_type: orderTypeLabel(o.order_type),
    customer_name: o.customer_name, phone: `${o.country_code}${o.customer_phone}`,
    country: o.country, status: statusMap[o.status]?.label || o.status,
  }));

  return (
    <div className="space-y-4" dir="rtl">
      <Tabs value={adminTab} onValueChange={setAdminTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="products">المنتجات</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="posts">المنشورات</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">إدارة المنتجات</CardTitle>
              <div className="flex gap-2">
                <ExportButton
                  onExportExcel={() => exportToExcel(productExportData, productColumns, 'wifi-products')}
                  onExportPDF={() => exportToPDF(productExportData, productColumns, 'wifi-products', 'منتجات الواي فاي')}
                />
                <Button size="sm" onClick={() => openProductDialog()}>
                  <Plus className="w-4 h-4 ml-1" />إضافة منتج
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>القسم</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>السعر</TableHead>
                      <TableHead>مجاني</TableHead>
                      <TableHead>نشط</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allProducts.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{productCategories.find(c => c.id === p.category)?.label}</TableCell>
                        <TableCell>{p.type || '-'}</TableCell>
                        <TableCell>${p.price}</TableCell>
                        <TableCell>{p.is_free ? <Badge className="bg-green-500 text-white">مجاني</Badge> : <Badge variant="secondary">مدفوع</Badge>}</TableCell>
                        <TableCell>{p.is_active ? '✅' : '❌'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openProductDialog(p)}><Edit className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" title="اللقطات والفيديوهات والتحديثات"
                              onClick={() => { setContentProduct(p); setContentDialog(true); }}>
                              <Images className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteProduct.mutate(p.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">طلبات الواي فاي</CardTitle>
              <ExportButton
                onExportExcel={() => exportToExcel(orderExportData, orderColumns, 'wifi-orders')}
                onExportPDF={() => exportToPDF(orderExportData, orderColumns, 'wifi-orders', 'طلبات الواي فاي')}
              />
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المنتج</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>العميل</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(o => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.product_name}</TableCell>
                        <TableCell><Badge variant="outline">{orderTypeLabel(o.order_type)}</Badge></TableCell>
                        <TableCell>{o.customer_name}</TableCell>
                        <TableCell dir="ltr">{o.country_code}{o.customer_phone}</TableCell>
                        <TableCell>
                          <Select value={o.status} onValueChange={v => handleStatusChange(o, v)}>
                            <SelectTrigger className="w-28 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedOrder(o); setOrderDetailDialog(true); }}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedOrder(o); setNotifyTitle(`تحديث طلبك: ${o.product_name}`); setNotifyMessage(''); setNotifyDialog(true); }}>
                              <Send className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteOrder.mutate(o.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">مشاكل وحلول</CardTitle>
              <Button size="sm" onClick={() => openPostDialog()}>
                <Plus className="w-4 h-4 ml-1" />إضافة منشور
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العنوان</TableHead>
                      <TableHead>الملخص</TableHead>
                      <TableHead>نشط</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{p.summary}</TableCell>
                        <TableCell>{p.is_active ? '✅' : '❌'}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openPostDialog(p)}><Edit className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deletePost.mutate(p.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={productDialog} onOpenChange={setProductDialog}>
        <DialogContent dir="rtl" className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="اسم المنتج *" value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} />
            <Textarea placeholder="وصف المنتج" value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>القسم</Label>
                <Select value={productForm.category} onValueChange={v => setProductForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {productCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Input placeholder="النوع (مثل: حماية، سرعات)" value={productForm.type} onChange={e => setProductForm(p => ({ ...p, type: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input type="number" placeholder="السعر" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: Number(e.target.value) }))} />
              <Input type="number" placeholder="نسبة الخصم %" value={productForm.discount_percent} onChange={e => setProductForm(p => ({ ...p, discount_percent: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={productForm.is_free} onCheckedChange={v => setProductForm(p => ({ ...p, is_free: v }))} />
                <Label>مجاني</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={productForm.is_active} onCheckedChange={v => setProductForm(p => ({ ...p, is_active: v }))} />
                <Label>نشط</Label>
              </div>
            </div>
            <Input placeholder="رابط الصورة" value={productForm.image_url} onChange={e => setProductForm(p => ({ ...p, image_url: e.target.value }))} />
            <Input placeholder="رابط الشعار" value={productForm.logo_url} onChange={e => setProductForm(p => ({ ...p, logo_url: e.target.value }))} />
            <Input placeholder="رابط المعاينة" value={productForm.preview_url} onChange={e => setProductForm(p => ({ ...p, preview_url: e.target.value }))} />
            <Input placeholder="رابط التحميل" value={productForm.download_url} onChange={e => setProductForm(p => ({ ...p, download_url: e.target.value }))} />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>نظام التشغيل</Label>
                <Select value={productForm.os || 'none'} onValueChange={v => setProductForm(p => ({ ...p, os: v === 'none' ? '' : v }))}>
                  <SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">غير محدد</SelectItem>
                    <SelectItem value="Android">Android</SelectItem>
                    <SelectItem value="Windows">Windows</SelectItem>
                    <SelectItem value="iOS">iOS</SelectItem>
                    <SelectItem value="Web">Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الحجم</Label>
                <Input placeholder="24 MB" value={productForm.size} onChange={e => setProductForm(p => ({ ...p, size: e.target.value }))} />
              </div>
              <div>
                <Label>الإصدار</Label>
                <Input placeholder="1.0.0" value={productForm.version} onChange={e => setProductForm(p => ({ ...p, version: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="اسم المطور" value={productForm.developer_name} onChange={e => setProductForm(p => ({ ...p, developer_name: e.target.value }))} />
              <Input placeholder="الموقع الإلكتروني" dir="ltr" value={productForm.website_url} onChange={e => setProductForm(p => ({ ...p, website_url: e.target.value }))} />
              <Input placeholder="رابط الدعم" dir="ltr" value={productForm.support_url} onChange={e => setProductForm(p => ({ ...p, support_url: e.target.value }))} />
              <Input placeholder="بريد الدعم" dir="ltr" value={productForm.support_email} onChange={e => setProductForm(p => ({ ...p, support_email: e.target.value }))} />
              <Input placeholder="هاتف/واتساب الدعم" dir="ltr" value={productForm.support_phone} onChange={e => setProductForm(p => ({ ...p, support_phone: e.target.value }))} />
            </div>
            <div>
              <Label>شرح النظام (نصي)</Label>
              <Textarea rows={5} placeholder="اشرح خطوات استخدام النظام..." value={productForm.guide_content} onChange={e => setProductForm(p => ({ ...p, guide_content: e.target.value }))} />
            </div>
            <div>
              <Label>محتوى الكود (للمنتجات المجانية)</Label>
              <Textarea className="font-mono text-xs" dir="ltr" rows={6} placeholder="الصق الكود هنا..." value={productForm.code_content} onChange={e => setProductForm(p => ({ ...p, code_content: e.target.value }))} />
            </div>
            <Input type="number" placeholder="ترتيب العرض" value={productForm.sort_order} onChange={e => setProductForm(p => ({ ...p, sort_order: Number(e.target.value) }))} />
            <Button className="w-full" onClick={saveProduct}>{editingProduct ? 'تحديث' : 'إضافة'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AdminWifiContentDialog product={contentProduct} open={contentDialog} onOpenChange={setContentDialog} />

      {/* Post Dialog */}
      <Dialog open={postDialog} onOpenChange={setPostDialog}>
        <DialogContent dir="rtl" className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPost ? 'تعديل المنشور' : 'إضافة منشور جديد'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="العنوان *" value={postForm.title} onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))} />
            <Input placeholder="الملخص" value={postForm.summary} onChange={e => setPostForm(p => ({ ...p, summary: e.target.value }))} />
            <Textarea rows={6} placeholder="المحتوى الكامل..." value={postForm.content} onChange={e => setPostForm(p => ({ ...p, content: e.target.value }))} />
            <Input placeholder="رابط الصورة" value={postForm.image_url} onChange={e => setPostForm(p => ({ ...p, image_url: e.target.value }))} />
            <div className="flex items-center gap-2">
              <Switch checked={postForm.is_active} onCheckedChange={v => setPostForm(p => ({ ...p, is_active: v }))} />
              <Label>نشط</Label>
            </div>
            <Button className="w-full" onClick={savePost}>{editingPost ? 'تحديث' : 'إضافة'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={orderDetailDialog} onOpenChange={setOrderDetailDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>تفاصيل الطلب</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">المنتج:</span> <strong>{selectedOrder.product_name}</strong></div>
                <div><span className="text-muted-foreground">النوع:</span> <strong>{orderTypeLabel(selectedOrder.order_type)}</strong></div>
                <div><span className="text-muted-foreground">القسم:</span> <strong>{selectedOrder.section}</strong></div>
                <div><span className="text-muted-foreground">السعر:</span> <strong>${selectedOrder.price}</strong></div>
                <div><span className="text-muted-foreground">العميل:</span> <strong>{selectedOrder.customer_name}</strong></div>
                <div><span className="text-muted-foreground">البلد:</span> <strong>{selectedOrder.country}</strong></div>
                <div><span className="text-muted-foreground">الهاتف:</span> <strong dir="ltr">{selectedOrder.country_code}{selectedOrder.customer_phone}</strong></div>
                <div><span className="text-muted-foreground">الحالة:</span> <Badge>{statusMap[selectedOrder.status]?.label}</Badge></div>
              </div>
              {selectedOrder.details && <div><span className="text-muted-foreground">التفاصيل:</span><p className="mt-1 p-2 bg-muted rounded">{selectedOrder.details}</p></div>}
              {selectedOrder.title && <div><span className="text-muted-foreground">العنوان:</span> {selectedOrder.title}</div>}
              <p className="text-xs text-muted-foreground">التاريخ: {new Date(selectedOrder.created_at).toLocaleString('ar')}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notify Dialog */}
      <Dialog open={notifyDialog} onOpenChange={setNotifyDialog}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle>إرسال إشعار للعميل</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="عنوان الإشعار" value={notifyTitle} onChange={e => setNotifyTitle(e.target.value)} />
            <Textarea placeholder="نص الإشعار..." value={notifyMessage} onChange={e => setNotifyMessage(e.target.value)} />
            <Button className="w-full" onClick={handleSendNotification}>
              <Send className="w-4 h-4 ml-2" />إرسال الإشعار
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminWifiTable;
