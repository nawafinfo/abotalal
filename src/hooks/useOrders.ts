import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  user_id: string | null;
  service_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  description: string | null;
  total_amount: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  service?: {
    name: string;
  };
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, service:services(name)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setOrders(prev =>
        prev.map(o => (o.id === id ? { ...o, status } : o))
      );
    }
    return { error };
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (!error) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
    return { error };
  };

  return {
    orders,
    isLoading,
    updateOrderStatus,
    deleteOrder,
    refetch: fetchOrders,
  };
};
