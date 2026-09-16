import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WifiProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  type: string | null;
  price: number;
  discount_percent: number;
  is_free: boolean;
  image_url: string | null;
  logo_url: string | null;
  preview_url: string | null;
  download_url: string | null;
  code_content: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WifiProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export const useWifiProducts = (category?: string) => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['wifi-products', category],
    queryFn: async () => {
      let query = supabase.from('wifi_products').select('*').order('sort_order');
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (error) throw error;
      return data as WifiProduct[];
    },
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['wifi-products-all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('wifi_products').select('*').order('sort_order');
      if (error) throw error;
      return data as WifiProduct[];
    },
  });

  const createProduct = useMutation({
    mutationFn: async (product: Partial<WifiProduct>) => {
      const { error } = await supabase.from('wifi_products').insert(product as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-products'] });
      toast({ title: 'تم إضافة المنتج بنجاح' });
    },
    onError: () => toast({ title: 'خطأ في إضافة المنتج', variant: 'destructive' }),
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WifiProduct> & { id: string }) => {
      const { error } = await supabase.from('wifi_products').update(updates as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-products'] });
      toast({ title: 'تم تحديث المنتج بنجاح' });
    },
    onError: () => toast({ title: 'خطأ في تحديث المنتج', variant: 'destructive' }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wifi_products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-products'] });
      toast({ title: 'تم حذف المنتج بنجاح' });
    },
    onError: () => toast({ title: 'خطأ في حذف المنتج', variant: 'destructive' }),
  });

  return { products, allProducts, isLoading, createProduct, updateProduct, deleteProduct };
};

export const useWifiProductImages = (productId?: string) => {
  const queryClient = useQueryClient();

  const { data: images = [] } = useQuery({
    queryKey: ['wifi-product-images', productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase.from('wifi_product_images').select('*').eq('product_id', productId).order('sort_order');
      if (error) throw error;
      return data as WifiProductImage[];
    },
    enabled: !!productId,
  });

  const addImage = useMutation({
    mutationFn: async (img: { product_id: string; image_url: string; sort_order?: number }) => {
      const { error } = await supabase.from('wifi_product_images').insert(img as any);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wifi-product-images'] }),
  });

  const deleteImage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wifi_product_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wifi-product-images'] }),
  });

  return { images, addImage, deleteImage };
};
