import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FeaturedClient {
  id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useFeaturedClients = () => {
  const [clients, setClients] = useState<FeaturedClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('featured_clients')
      .select('*')
      .order('sort_order', { ascending: true });
    if (!error) setClients((data as any[]) || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const addClient = async (client: { name: string; image_url: string; sort_order: number; is_active: boolean }) => {
    const { error } = await supabase.from('featured_clients').insert(client as any);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في إضافة العميل', variant: 'destructive' });
    } else {
      toast({ title: 'تم', description: 'تمت إضافة العميل بنجاح' });
      fetchClients();
    }
  };

  const updateClient = async (id: string, updates: Partial<FeaturedClient>) => {
    const { error } = await supabase.from('featured_clients').update(updates as any).eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في تحديث العميل', variant: 'destructive' });
    } else {
      toast({ title: 'تم', description: 'تم تحديث العميل بنجاح' });
      fetchClients();
    }
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from('featured_clients').delete().eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حذف العميل', variant: 'destructive' });
    } else {
      toast({ title: 'تم', description: 'تم حذف العميل بنجاح' });
      fetchClients();
    }
  };

  return { clients, isLoading, addClient, updateClient, deleteClient, refetch: fetchClients };
};
