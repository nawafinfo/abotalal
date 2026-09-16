import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface WifiOrder {
  id: string;
  user_id: string | null;
  product_id: string | null;
  product_name: string;
  section: string;
  customer_name: string;
  country: string;
  country_code: string;
  customer_phone: string;
  order_type: string;
  details: string | null;
  title: string | null;
  price: number;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useWifiOrders = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['wifi-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('wifi_orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as WifiOrder[];
    },
    enabled: !!user,
  });

  const createOrder = useMutation({
    mutationFn: async (order: Partial<WifiOrder>) => {
      const { error } = await supabase.from('wifi_orders').insert({ ...order, user_id: user?.id } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-orders'] });
      toast({ title: 'تم إرسال الطلب بنجاح', description: 'سيتم مراجعة طلبك قريباً' });
    },
    onError: () => toast({ title: 'خطأ في إرسال الطلب', variant: 'destructive' }),
  });

  const updateOrder = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WifiOrder> & { id: string }) => {
      const { error } = await supabase.from('wifi_orders').update(updates as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-orders'] });
      toast({ title: 'تم تحديث الطلب بنجاح' });
    },
    onError: () => toast({ title: 'خطأ في تحديث الطلب', variant: 'destructive' }),
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wifi_orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-orders'] });
      toast({ title: 'تم حذف الطلب' });
    },
  });

  // Send notification to user
  const sendNotification = async (userId: string, title: string, message: string) => {
    await supabase.from('notifications').insert({ user_id: userId, title, message, type: 'wifi_order' } as any);
  };

  return { orders, isLoading, createOrder, updateOrder, deleteOrder, sendNotification };
};
