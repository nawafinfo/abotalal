import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Edit, Trash2, MoreVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/hooks/use-toast';

const AdminServicesTable: React.FC = () => {
  const { services, isLoading, createService, updateService, deleteService, toggleServiceStatus } = useServices();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    icon: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      icon: '',
    });
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      name: formData.name,
      description: formData.description || null,
      price: formData.price ? parseFloat(formData.price) : null,
      category: formData.category,
      icon: formData.icon || null,
      is_active: true,
    };

    if (editingService) {
      const { error } = await updateService(editingService.id, serviceData);
      if (error) {
        toast({
          title: 'خطأ',
          description: 'فشل في تحديث الخدمة',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث الخدمة بنجاح',
        });
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await createService(serviceData);
      if (error) {
        toast({
          title: 'خطأ',
          description: 'فشل في إضافة الخدمة',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'تم الإضافة',
          description: 'تم إضافة الخدمة بنجاح',
        });
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price?.toString() || '',
      category: service.category,
      icon: service.icon || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteService(id);
    if (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الخدمة',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الخدمة بنجاح',
      });
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await toggleServiceStatus(id, !currentStatus);
    if (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تغيير حالة الخدمة',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم التحديث',
        description: `تم ${!currentStatus ? 'تفعيل' : 'تعطيل'} الخدمة`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Service Button */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogTrigger asChild>
          <Button className="w-full gradient-gold">
            <Plus className="w-4 h-4 ml-2" />
            إضافة خدمة جديدة
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">اسم الخدمة</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="اسم الخدمة"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">الوصف</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف الخدمة"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">السعر</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="السعر"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">التصنيف</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="التصنيف"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">الأيقونة</label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="اسم الأيقونة"
              />
            </div>
            <Button type="submit" className="w-full gradient-gold">
              {editingService ? 'تحديث' : 'إضافة'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Services List */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">لا توجد خدمات حالياً</p>
          </CardContent>
        </Card>
      ) : (
        services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={!service.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <Badge variant={service.is_active ? 'default' : 'secondary'}>
                        {service.is_active ? 'نشط' : 'معطل'}
                      </Badge>
                      <Badge variant="outline">{service.category}</Badge>
                    </div>
                    
                    {service.description && (
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    )}
                    
                    {service.price && (
                      <p className="text-sm font-medium text-primary">{service.price} ريال</p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(service)}>
                        <Edit className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(service.id, service.is_active)}>
                        {service.is_active ? (
                          <>
                            <ToggleLeft className="w-4 h-4 ml-2" />
                            تعطيل
                          </>
                        ) : (
                          <>
                            <ToggleRight className="w-4 h-4 ml-2" />
                            تفعيل
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(service.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default AdminServicesTable;
