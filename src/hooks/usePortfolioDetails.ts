import { uploadToBucket } from '@/lib/uploadFile';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { PortfolioItem } from '@/hooks/usePortfolio';

export interface PortfolioImage {
  id: string;
  item_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export type PortfolioItemFull = PortfolioItem & {
  details: string | null;
  client_name: string | null;
  project_date: string | null;
  project_url: string | null;
};

export const uploadPortfolioImage = async (file: File, itemId: string) => {
  const { url, error } = await uploadToBucket('portfolio', file, `gallery/${itemId}`);
  if (error || !url) {
    toast({ title: 'فشل رفع الصورة', description: error || undefined, variant: 'destructive' });
    return null;
  }
  return url;
};

export const usePortfolioItem = (itemId?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['portfolio-item', itemId],
    queryFn: async () => {
      if (!itemId) return null;
      const { data, error } = await supabase.from('portfolio_items').select('*').eq('id', itemId).maybeSingle();
      if (error) throw error;
      return data as unknown as PortfolioItemFull | null;
    },
    enabled: !!itemId,
  });
  return { item: data ?? null, isLoading };
};

export const usePortfolioImages = (itemId?: string) => {
  const qc = useQueryClient();

  const { data: images = [] } = useQuery({
    queryKey: ['portfolio-images', itemId],
    queryFn: async () => {
      if (!itemId) return [];
      const { data, error } = await supabase.from('portfolio_images').select('*').eq('item_id', itemId).order('sort_order');
      if (error) throw error;
      return data as PortfolioImage[];
    },
    enabled: !!itemId,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['portfolio-images'] });

  const addImage = useMutation({
    mutationFn: async (img: { item_id: string; image_url: string; caption?: string | null; sort_order?: number }) => {
      const { error } = await supabase.from('portfolio_images').insert(img as any);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: 'تمت إضافة الصورة' }); },
    onError: () => toast({ title: 'فشل إضافة الصورة', variant: 'destructive' }),
  });

  const deleteImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('portfolio_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast({ title: 'تم حذف الصورة' }); },
  });

  return { images, addImage, deleteImage };
};