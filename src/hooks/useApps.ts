import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface App {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  icon_url: string | null;
  download_url: string | null;
  version: string | null;
  size: string | null;
  rating: number | null;
  downloads_count: string | null;
  color: string | null;
  is_active: boolean;
  sort_order: number;
  developer_name: string | null;
  support_url: string | null;
  support_email: string | null;
  support_phone: string | null;
  package_name: string | null;
  requirements: string | null;
  whats_new: string | null;
  real_downloads: number;
  last_update_at: string;
  created_at: string;
  updated_at: string;
}

export const useApp = (appId?: string) => {
  const { data: app, isLoading, refetch } = useQuery({
    queryKey: ['app', appId],
    queryFn: async () => {
      if (!appId) return null;
      const { data, error } = await supabase.from('apps').select('*').eq('id', appId).maybeSingle();
      if (error) throw error;
      return data as unknown as App | null;
    },
    enabled: !!appId,
  });
  return { app: app ?? null, isLoading, refetch };
};

export const useApps = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error fetching apps:', error);
    } else {
      setApps((data as unknown as App[]) || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const addApp = async (app: Partial<App>) => {
    const { error } = await supabase.from('apps').insert([app as any]);
    if (error) {
      toast.error('فشل في إضافة التطبيق');
      console.error(error);
    } else {
      toast.success('تم إضافة التطبيق بنجاح');
      fetchApps();
    }
  };

  const updateApp = async (id: string, updates: Partial<App>) => {
    const { error } = await supabase.from('apps').update(updates as any).eq('id', id);
    if (error) {
      toast.error('فشل في تحديث التطبيق');
      console.error(error);
    } else {
      toast.success('تم تحديث التطبيق بنجاح');
      fetchApps();
    }
  };

  const deleteApp = async (id: string) => {
    const { error } = await supabase.from('apps').delete().eq('id', id);
    if (error) {
      toast.error('فشل في حذف التطبيق');
      console.error(error);
    } else {
      toast.success('تم حذف التطبيق بنجاح');
      fetchApps();
    }
  };

  const uploadApk = async (file: File, appId: string) => {
    const filePath = `${appId}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('app-files')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      toast.error('فشل في رفع الملف');
      console.error(uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('app-files')
      .getPublicUrl(filePath);

    // Save file record
    await supabase.from('app_storage').insert([{
      app_id: appId,
      file_name: file.name,
      file_url: urlData.publicUrl,
      file_size: file.size,
    } as any]);

    // Update app download URL
    await updateApp(appId, { download_url: urlData.publicUrl });

    return urlData.publicUrl;
  };

  return { apps, isLoading, addApp, updateApp, deleteApp, uploadApk, refetch: fetchApps };
};
