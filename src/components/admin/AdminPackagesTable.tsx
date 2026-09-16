import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Diamond, Award, Plus, Trash2, Edit, MoreVertical, Check, X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePackages, Package } from '@/hooks/usePackages';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

const typeIcons: Record<string, React.ComponentType<any>> = { gold: Crown, diamond: Diamond, silver: Award };
const typeLabels: Record<string, string> = { gold: 'ذهبية', diamond: 'ماسية', silver: 'فضية' };
const statusLabels: Record<string, string> = { pending: 'قيد الانتظار', confirmed: 'مؤكد', completed: 'مكتمل', cancelled: 'ملغي' };
const statusColors: Record<string, string> = { pending: 'bg-primary/20 text-primary', confirmed: 'bg-primary/20 text-primary', completed: 'bg-primary/20 text-primary', cancelled: 'bg-destructive/20 text-destructive' };

const AdminPackagesTable: React.FC = () => {
  const { packages, subscriptions, isLoading, createPackage, updatePackage, deletePackage, updateSubscriptionStatus, deleteSubscription } = usePackages();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [form, setForm] = useState({ name: '', type: 'gold', description: '', features: '', price: '', discount_percent: '', is_active: true, sort_order: 0 });

  const resetForm = () => {
    setForm({ name: '', type: 'gold', description: '', features: '', price: '', discount_percent: '', is_active: true, sort_order: 0 });
    setEditingPkg(null);
  };

  const openEdit = (pkg: Package) => {
    setEditingPkg(pkg);
    setForm({
      name: pkg.name,
      type: pkg.type,
      description: pkg.description || '',
      features: (pkg.features || []).join('\n'),
      price: String(pkg.price),
      discount_percent: String(pkg.discount_percent || 0),
      is_active: pkg.is_active,
      sort_order: pkg.sort_order,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price) {
      toast({ title: 'خطأ', description: 'يرجى ملء الحقول المطلوبة', variant: 'destructive' });
      return;
    }

    const data = {
      name: form.name.trim(),
      type: form.type,
      description: form.description.trim() || null,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      price: Number(form.price),
      discount_percent: Number(form.discount_percent) || 0,
      is_active: form.is_active,
      sort_order: form.sort_order,
    };

    const { error } = editingPkg
      ? await updatePackage(editingPkg.id, data)
      : await createPackage(data as any);

    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حفظ الباقة', variant: 'destructive' });
    } else {
      toast({ title: 'تم بنجاح', description: editingPkg ? 'تم تحديث الباقة' : 'تم إضافة الباقة' });
      setShowForm(false);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deletePackage(id);
    if (!error) toast({ title: 'تم الحذف', description: 'تم حذف الباقة بنجاح' });
  };

  const handleSubStatus = async (id: string, status: string) => {
    const { error } = await updateSubscriptionStatus(id, status);
    if (!error) toast({ title: 'تم التحديث', description: 'تم تحديث حالة الاشتراك' });
  };

  const handleSubDelete = async (id: string) => {
    const { error } = await deleteSubscription(id);
    if (!error) toast({ title: 'تم الحذف', description: 'تم حذف الاشتراك' });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="packages">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="packages">الباقات</TabsTrigger>
          <TabsTrigger value="subscriptions">طلبات الاشتراك ({subscriptions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
              <Plus className="w-4 h-4" /> إضافة باقة
            </Button>
          </div>

          {packages.length === 0 ? (
            <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">لا توجد باقات</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {packages.map((pkg, i) => {
                const Icon = typeIcons[pkg.type] || Crown;
                return (
                  <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
                            <Icon className="w-6 h-6 text-primary" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{pkg.name}</h3>
                                <Badge variant="secondary">{typeLabels[pkg.type] || pkg.type}</Badge>
                                {!pkg.is_active && <Badge variant="outline" className="text-xs">مخفية</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">${pkg.price} {pkg.discount_percent > 0 && `(خصم ${pkg.discount_percent}%)`}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEdit(pkg)}><Edit className="w-4 h-4 ml-2" />تعديل</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updatePackage(pkg.id, { is_active: !pkg.is_active })}>
                                {pkg.is_active ? <><EyeOff className="w-4 h-4 ml-2" />إخفاء</> : <><Eye className="w-4 h-4 ml-2" />إظهار</>}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(pkg.id)} className="text-destructive"><Trash2 className="w-4 h-4 ml-2" />حذف</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subscriptions">
          {subscriptions.length === 0 ? (
            <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">لا توجد طلبات اشتراك</p></CardContent></Card>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub, i) => (
                <motion.div key={sub.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{sub.customer_name}</h3>
                            <Badge className={statusColors[sub.status] || 'bg-secondary'}>{statusLabels[sub.status] || sub.status}</Badge>
                          </div>
                          <p className="text-sm text-primary font-medium">{sub.package_name} ({typeLabels[sub.package_type] || sub.package_type})</p>
                          <p className="text-sm text-muted-foreground">{sub.country_code} {sub.customer_phone}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true, locale: ar })}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSubStatus(sub.id, 'confirmed')}><Check className="w-4 h-4 ml-2" />تأكيد</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSubStatus(sub.id, 'completed')}><Check className="w-4 h-4 ml-2" />مكتمل</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSubStatus(sub.id, 'cancelled')}><X className="w-4 h-4 ml-2" />إلغاء</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSubDelete(sub.id)} className="text-destructive"><Trash2 className="w-4 h-4 ml-2" />حذف</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={() => { setShowForm(false); resetForm(); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPkg ? 'تعديل باقة' : 'إضافة باقة جديدة'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>اسم الباقة *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: الباقة الذهبية" /></div>
            <div><Label>نوع الباقة</Label>
              <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gold">ذهبية</SelectItem>
                  <SelectItem value="diamond">ماسية</SelectItem>
                  <SelectItem value="silver">فضية</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>الوصف</Label><Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="وصف الباقة" /></div>
            <div><Label>المميزات (سطر لكل ميزة)</Label><Textarea value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} placeholder="تصميم شعار&#10;إدارة صفحات&#10;تسويق إلكتروني" rows={4} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>السعر *</Label><Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} /></div>
              <div><Label>نسبة الخصم %</Label><Input type="number" value={form.discount_percent} onChange={e => setForm(p => ({ ...p, discount_percent: e.target.value }))} /></div>
            </div>
            <div><Label>الترتيب</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} /></div>
            <Button onClick={handleSave} className="w-full">{editingPkg ? 'تحديث' : 'إضافة'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPackagesTable;
