import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, Mail, Clock, Check, X, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBookings } from '@/hooks/useBookings';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import ExportButton from './ExportButton';
import { exportToExcel, exportToPDF, bookingColumns, prepareBookingsData } from '@/lib/exportUtils';

const statusColors: Record<string, string> = {
  pending: 'bg-primary/20 text-primary',
  confirmed: 'bg-primary/20 text-primary',
  completed: 'bg-primary/20 text-primary',
  cancelled: 'bg-destructive/20 text-destructive',
};

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

const AdminBookingsTable: React.FC = () => {
  const { bookings, isLoading, updateBookingStatus, deleteBooking } = useBookings();
  const { toast } = useToast();

  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await updateBookingStatus(id, status);
    if (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث حالة الحجز',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث حالة الحجز بنجاح',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteBooking(id);
    if (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في حذف الحجز',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الحجز بنجاح',
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

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">لا توجد حجوزات حالياً</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ExportButton
          onExportExcel={() => exportToExcel(prepareBookingsData(bookings), bookingColumns, 'bookings')}
          onExportPDF={() => exportToPDF(prepareBookingsData(bookings), bookingColumns, 'bookings', 'Bookings Report')}
        />
      </div>
      {bookings.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{booking.customer_name}</h3>
                    <Badge className={statusColors[booking.status] || 'bg-secondary'}>
                      {statusLabels[booking.status] || booking.status}
                    </Badge>
                  </div>
                  
                  {booking.service && (
                    <p className="text-sm text-primary font-medium">{booking.service.name}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {booking.customer_phone}
                    </span>
                    {booking.customer_email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {booking.customer_email}
                      </span>
                    )}
                    {booking.scheduled_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {booking.scheduled_date}
                      </span>
                    )}
                  </div>
                  
                  {booking.notes && (
                    <p className="text-sm text-muted-foreground">{booking.notes}</p>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(booking.created_at), {
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
                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                      <Check className="w-4 h-4 ml-2" />
                      تأكيد
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'completed')}>
                      <Check className="w-4 h-4 ml-2" />
                      اكتمل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'cancelled')}>
                      <X className="w-4 h-4 ml-2" />
                      إلغاء
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(booking.id)}
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

export default AdminBookingsTable;
