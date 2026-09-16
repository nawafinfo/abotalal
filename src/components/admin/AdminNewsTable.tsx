import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Plus, Edit, Trash2, MoreVertical, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNewsItems } from '@/hooks/useNewsItems';
import { useToast } from '@/hooks/use-toast';

const AdminNewsTable: React.FC = () => {
  const { newsItems, isLoading, createNewsItem, updateNewsItem, deleteNewsItem, toggleNewsItem } = useNewsItems();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ content: '', sort_order: '0' });

  const resetForm = () => {
    setFormData({ content: '', sort_order: '0' });
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await updateNewsItem(editingItem.id, {
        content: formData.content,
        sort_order: parseInt(formData.sort_order),
      });
      if (!error) {
        toast({ title: 'تم التحديث', description: 'تم تحديث الخبر بنجاح' });
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast({ title: 'خطأ', description: 'فشل في تحديث الخبر', variant: 'destructive' });
      }
    } else {
      const { error } = await createNewsItem(formData.content, parseInt(formData.sort_order));
      if (!error) {
        toast({ title: 'تم الإضافة', description: 'تم إضافة الخبر بنجاح' });
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast({ title: 'خطأ', description: 'فشل في إضافة الخبر', variant: 'destructive' });
      }
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ content: item.content, sort_order: item.sort_order.toString() });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteNewsItem(id);
    if (!error) {
      toast({ title: 'تم الحذف', description: 'تم حذف الخبر بنجاح' });
    } else {
      toast({ title: 'خطأ', description: 'فشل في حذف الخبر', variant: 'destructive' });
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
      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogTrigger asChild>
          <Button className="w-full gradient-gold">
            <Plus className="w-4 h-4 ml-2" />
            إضافة خبر جديد
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'تعديل الخبر' : 'إضافة خبر جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">نص الخبر</label>
              <Input
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="أدخل نص الخبر"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">الترتيب</label>
              <Input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                placeholder="0"
              />
            </div>
            <Button type="submit" className="w-full gradient-gold">
              {editingItem ? 'تحديث' : 'إضافة'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {newsItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">لا توجد أخبار حالياً</p>
          </CardContent>
        </Card>
      ) : (
        newsItems.map((item, index) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className={!item.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Newspaper className="w-4 h-4 text-primary" />
                      <p className="text-foreground">{item.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'نشط' : 'معطل'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">ترتيب: {item.sort_order}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4 ml-2" />تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleNewsItem(item.id, !item.is_active)}>
                        {item.is_active ? <><ToggleLeft className="w-4 h-4 ml-2" />تعطيل</> : <><ToggleRight className="w-4 h-4 ml-2" />تفعيل</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4 ml-2" />حذف
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

export default AdminNewsTable;
