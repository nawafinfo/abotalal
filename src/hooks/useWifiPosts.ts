import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface WifiPost {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useWifiPosts = () => {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['wifi-posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('wifi_posts').select('*').order('sort_order');
      if (error) throw error;
      return data as WifiPost[];
    },
  });

  const createPost = useMutation({
    mutationFn: async (post: Partial<WifiPost>) => {
      const { error } = await supabase.from('wifi_posts').insert(post as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-posts'] });
      toast({ title: 'تم إضافة المنشور بنجاح' });
    },
  });

  const updatePost = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WifiPost> & { id: string }) => {
      const { error } = await supabase.from('wifi_posts').update(updates as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-posts'] });
      toast({ title: 'تم تحديث المنشور بنجاح' });
    },
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('wifi_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wifi-posts'] });
      toast({ title: 'تم حذف المنشور' });
    },
  });

  return { posts, isLoading, createPost, updatePost, deletePost };
};
