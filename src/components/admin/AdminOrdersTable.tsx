import React from 'react';
import { motion } from 'framer-motion';
import { Package, Phone, Mail, DollarSign, Check, X, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import ExportButton from './ExportButton';
import { exportToExcel, exportToPDF, orderColumns, prepareOrdersData } from '@/lib/exportUtils';

const statusColors: Record<string, string> = {
  pending: 'bg-primary/20 text-primary',
  processing: 'bg-primary/20 text-primary',
  completed: 'bg-primary/20 text-primary',
  cancelled: 'bg-destructive/20 text-destructive',
};

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  processing: 'جاري التنفيذ',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const AdminOrdersTable: React.FC = () => {
  const { orders, isLoading, updateOrderStatus, deleteOrder } = useOrders();
  const { toast } = useToast();

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await updateOrderStatus(id, status);
    if (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث حالة الطلب',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث حالة الطلب بنجاح',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteOrder(id);
    if (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الطلب',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الطلب بنجاح',
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

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">لا توجد طلبات حالياً</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportButton
          onExportExcel={() => exportToExcel(prepareOrdersData(orders), orderColumns, 'orders')}
          onExportPDF={() => exportToPDF(prepareOrdersData(orders), orderColumns, 'orders', 'Orders Report')}
        />
      </div>
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{order.customer_name}</h3>
                    <Badge className={statusColors[order.status] || 'bg-secondary'}>
                      {statusLabels[order.status] || order.status}
                    </Badge>
                  </div>
                  
                  {order.service && (
                    <p className="text-sm text-primary font-medium">{order.service.name}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {order.customer_phone}
                    </span>
                    {order.customer_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {order.customer_email}
                      </span>
                    )}
                    {order.total_amount && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {order.total_amount} ريال
                      </span>
                    )}
                  </div>
                  
                  {order.description && (
                    <p className="text-sm text-muted-foreground">{order.description}</p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>
                      <Check className="w-4 h-4 ml-2" />
                      جاري التنفيذ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'completed')}>
                      <Check className="w-4 h-4 ml-2" />
                      اكتمل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'cancelled')}>
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(order.id)}
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
      ))}
    </div>
  );
};

export default AdminOrdersTable;
