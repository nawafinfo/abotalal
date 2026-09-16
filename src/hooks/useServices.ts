import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setServices(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (!error && data) {
      setServices(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const { error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setServices(prev =>
        prev.map(s => (s.id === id ? { ...s, ...updates } : s))
      );
    }
    return { error };
  };

  const deleteService = async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (!error) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
    return { error };
  };

  const toggleServiceStatus = async (id: string, isActive: boolean) => {
    return updateService(id, { is_active: isActive });
  };

  return {
    services,
    isLoading,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    refetch: fetchServices,
  };
};
