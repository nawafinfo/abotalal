import { uploadToBucket } from '@/lib/uploadFile';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WifiVideo {
  id: string;
  product_id: string;
  title: string;
  youtube_url: string;
  sort_order: number;
  created_at: string;
}

export interface WifiUpdate {
  id: string;
  product_id: string;
  version: string;
  changelog: string | null;
  size: string | null;
  download_url: string | null;
  is_major: boolean;
  released_at: string;
  created_at: string;
}

export const getYoutubeId = (url: string): string | null => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{6,})/);
  return m ? m[1] : (/^[\w-]{6,}$/.test(url.trim()) ? url.trim() : null);
};

export const uploadWifiImage = async (file: File, productId: string) => {
  const { url, error } = await uploadToBucket('app-files', file, `wifi/${productId}`);
  if (error || !url) {
    toast({ title: 'فشل رفع الصورة', description: error || undefined, variant: 'destructive' });
    return null;
  }
  return url;
};

export const useWifiProduct = (productId?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['wifi-product', productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data, error } = await supabase.from('wifi_products').select('*').eq('id', productId).maybeSingle();
      if (error) throw error;
      return data as any;
    },
    enabled: !!productId,
  });
  return { product: data ?? null, isLoading };
};

export const useWifiVideos = (productId?: string) => {
  const qc = useQueryClient();
  const { data: videos = [] } = useQuery({
    queryKey: ['wifi-videos', productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase.from('wifi_product_videos').select('*').eq('product_id', productId).order('sort_order');
      if (error) throw error;
      return data as WifiVideo[];
    },
    enabled: !!productId,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['wifi-videos'] });

  const addVideo = useMutation({
    mutationFn: async (v: { product_id: string; title: string; youtube_url: string; sort_order?: number }) => {
      const { error } = await supabase.from('wifi_product_videos').insert(v as any);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: 'تمت إضافة الفيديو' }); },
    onError: () => toast({ title: 'فشل إضافة الفيديو', variant: 'destructive' }),
  });

  const deleteVideo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wifi_product_videos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: 'تم حذف الفيديو' }); },
  });

  return { videos, addVideo, deleteVideo };
};

export const useWifiUpdates = (productId?: string) => {
  const qc = useQueryClient();
  const { data: updates = [] } = useQuery({
    queryKey: ['wifi-updates', productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase.from('wifi_product_updates').select('*').eq('product_id', productId).order('released_at', { ascending: false });
      if (error) throw error;
      return data as WifiUpdate[];
    },
    enabled: !!productId,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['wifi-updates'] });
    qc.invalidateQueries({ queryKey: ['wifi-products'] });
    qc.invalidateQueries({ queryKey: ['wifi-product'] });
  };

  const addUpdate = useMutation({
    mutationFn: async (u: { product_id: string; version: string; changelog?: string | null; size?: string | null; download_url?: string | null; is_major?: boolean }) => {
      const { error } = await supabase.from('wifi_product_updates').insert(u as any);
      if (error) throw error;
      const patch: any = { version: u.version, last_update_at: new Date().toISOString() };
      if (u.size) patch.size = u.size;
      if (u.download_url) patch.download_url = u.download_url;
      const { error: pErr } = await supabase.from('wifi_products').update(patch).eq('id', u.product_id);
      if (pErr) throw pErr;
    },
    onSuccess: () => { invalidate(); toast({ title: 'تم نشر التحديث' }); },
    onError: () => toast({ title: 'فشل نشر التحديث', variant: 'destructive' }),
  });

  const deleteUpdate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wifi_product_updates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: 'تم حذف التحديث' }); },
  });

  return { updates, addUpdate, deleteUpdate };
};