import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Package {
  id: string;
  name: string;
  type: string;
  description: string | null;
  features: string[];
  price: number;
  discount_percent: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PackageSubscription {
  id: string;
  package_id: string | null;
  package_name: string;
  package_type: string;
  customer_name: string;
  customer_phone: string;
  country_code: string;
  user_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [subscriptions, setSubscriptions] = useState<PackageSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setPackages(data as unknown as Package[]);
    }
    setIsLoading(false);
  };

  const fetchSubscriptions = async () => {
    const { data, error } = await supabase
      .from('package_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubscriptions(data as unknown as PackageSubscription[]);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchSubscriptions();

    const ch1 = supabase
      .channel('packages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, () => fetchPackages())
      .subscribe();

    const ch2 = supabase
      .channel('package-subs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'package_subscriptions' }, () => fetchSubscriptions())
      .subscribe();

    return () => {
      supabase.removeChannel(ch1);
      supabase.removeChannel(ch2);
    };
  }, []);

  const createPackage = async (pkg: Omit<Package, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('packages').insert(pkg as any);
    return { error };
  };

  const updatePackage = async (id: string, updates: Partial<Package>) => {
    const { error } = await supabase.from('packages').update(updates as any).eq('id', id);
    return { error };
  };

  const deletePackage = async (id: string) => {
    const { error } = await supabase.from('packages').delete().eq('id', id);
    return { error };
  };

  const createSubscription = async (sub: {
    package_id: string;
    package_name: string;
    package_type: string;
    customer_name: string;
    customer_phone: string;
    country_code: string;
    user_id: string | null;
  }) => {
    const { error } = await supabase.from('package_subscriptions').insert(sub as any);
    return { error };
  };

  const updateSubscriptionStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('package_subscriptions').update({ status } as any).eq('id', id);
    return { error };
  };

  const deleteSubscription = async (id: string) => {
    const { error } = await supabase.from('package_subscriptions').delete().eq('id', id);
    return { error };
  };

  return {
    packages,
    subscriptions,
    isLoading,
    createPackage,
    updatePackage,
    deletePackage,
    createSubscription,
    updateSubscriptionStatus,
    deleteSubscription,
    refetch: () => { fetchPackages(); fetchSubscriptions(); },
  };
};
