import { uploadToBucket } from '@/lib/uploadFile';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AppScreenshot {
  id: string;
  app_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface AppUpdate {
  id: string;
  app_id: string;
  version: string;
  changelog: string | null;
  size: string | null;
  download_url: string | null;
  is_major: boolean;
  released_at: string;
  created_at: string;
}

export interface AppReview {
  id: string;
  app_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string | null;
  admin_reply: string | null;
  admin_reply_at: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

/* ---------------- Screenshots ---------------- */
export const useAppScreenshots = (appId?: string) => {
  const queryClient = useQueryClient();
  const key = ['app-screenshots', appId];

  const { data: screenshots = [], isLoading } = useQuery({
    queryKey: key,
    queryFn: async () => {
      if (!appId) return [];
      const { data, error } = await supabase
        .from('app_screenshots').select('*').eq('app_id', appId).order('sort_order');
      if (error) throw error;
      return data as AppScreenshot[];
    },
    enabled: !!appId,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['app-screenshots'] });

  const addScreenshot = useMutation({
    mutationFn: async (s: { app_id: string; image_url: string; caption?: string; sort_order?: number }) => {
      const { error } = await supabase.from('app_screenshots').insert(s as any);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success('تمت إضافة اللقطة'); },
    onError: () => toast.error('فشل في إضافة اللقطة'),
  });

  const deleteScreenshot = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('app_screenshots').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success('تم حذف اللقطة'); },
  });

  const uploadScreenshot = async (file: File, targetAppId: string) => {
    const { url, error } = await uploadToBucket('app-files', file, `screenshots/${targetAppId}`);
    if (error || !url) { toast.error(error || 'فشل رفع الصورة'); return null; }
    return url;
  };

  return { screenshots, isLoading, addScreenshot, deleteScreenshot, uploadScreenshot };
};

/* ---------------- Updates ---------------- */
export const useAppUpdates = (appId?: string) => {
  const queryClient = useQueryClient();

  const { data: updates = [], isLoading } = useQuery({
    queryKey: ['app-updates', appId],
    queryFn: async () => {
      let q = supabase.from('app_updates').select('*').order('released_at', { ascending: false });
      if (appId) q = q.eq('app_id', appId);
      const { data, error } = await q;
      if (error) throw error;
      return data as AppUpdate[];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['app-updates'] });
    queryClient.invalidateQueries({ queryKey: ['apps'] });
  };

  const addUpdate = useMutation({
    mutationFn: async (u: Partial<AppUpdate> & { app_id: string; version: string }) => {
      const { error } = await supabase.from('app_updates').insert(u as any);
      if (error) throw error;
      // reflect latest version on the app itself
      const patch: any = {
        version: u.version,
        whats_new: u.changelog ?? null,
        last_update_at: new Date().toISOString(),
      };
      if (u.size) patch.size = u.size;
      if (u.download_url) patch.download_url = u.download_url;
      const { error: appErr } = await supabase.from('apps').update(patch).eq('id', u.app_id);
      if (appErr) throw appErr;
    },
    onSuccess: () => { invalidate(); toast.success('تم إضافة التحديث'); },
    onError: () => toast.error('فشل في إضافة التحديث'),
  });

  const deleteUpdate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('app_updates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success('تم حذف التحديث'); },
  });

  return { updates, isLoading, addUpdate, deleteUpdate };
};

/* ---------------- Reviews ---------------- */
export const useAppReviews = (appId?: string) => {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['app-reviews', appId],
    queryFn: async () => {
      let q = supabase.from('app_reviews').select('*').order('created_at', { ascending: false });
      if (appId) q = q.eq('app_id', appId);
      const { data, error } = await q;
      if (error) throw error;
      return data as AppReview[];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['app-reviews'] });
    queryClient.invalidateQueries({ queryKey: ['apps'] });
  };

  const myReview = reviews.find(r => r.user_id === user?.id) || null;

  const submitReview = useMutation({
    mutationFn: async ({ app_id, rating, comment }: { app_id: string; rating: number; comment: string }) => {
      if (!user) throw new Error('unauth');
      const { error } = await supabase.from('app_reviews').upsert({
        app_id,
        user_id: user.id,
        user_name: profile?.name || user.email?.split('@')[0] || 'مستخدم',
        rating,
        comment,
      } as any, { onConflict: 'app_id,user_id' });
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success('تم نشر تقييمك، شكراً لك'); },
    onError: () => toast.error('يجب تسجيل الدخول لإضافة تقييم'),
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('app_reviews').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success('تم حذف التعليق'); },
  });

  const replyToReview = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const { error } = await supabase.from('app_reviews')
        .update({ admin_reply: reply, admin_reply_at: new Date().toISOString() } as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); toast.success('تم إرسال الرد'); },
    onError: () => toast.error('فشل إرسال الرد'),
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from('app_reviews').update({ is_visible } as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { reviews, myReview, isLoading, submitReview, deleteReview, replyToReview, toggleVisibility };
};

/* ---------------- Downloads ---------------- */
export const useAppDownload = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const recordDownload = async (appId: string, version?: string | null) => {
    if (user) {
      await supabase.from('app_downloads').insert({
        app_id: appId, user_id: user.id, version: version ?? null,
      } as any);
    }
    queryClient.invalidateQueries({ queryKey: ['apps'] });
  };

  return { recordDownload };
};

/* ---------------- Admin stats ---------------- */
export const useAppsStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['apps-stats'],
    queryFn: async () => {
      const [{ data: downloads }, { data: reviews }, { data: apps }] = await Promise.all([
        supabase.from('app_downloads').select('app_id, created_at'),
        supabase.from('app_reviews').select('app_id, rating, admin_reply'),
        supabase.from('apps').select('id, name, real_downloads, rating'),
      ]);
      const dl = downloads || [];
      const rv = reviews || [];
      const since = Date.now() - 7 * 24 * 3600 * 1000;
      return {
        totalDownloads: dl.length,
        weekDownloads: dl.filter((d: any) => new Date(d.created_at).getTime() > since).length,
        totalReviews: rv.length,
        pendingReplies: rv.filter((r: any) => !r.admin_reply).length,
        avgRating: rv.length ? (rv.reduce((s: number, r: any) => s + r.rating, 0) / rv.length).toFixed(1) : '0',
        perApp: (apps || []).map((a: any) => ({
          id: a.id,
          name: a.name,
          downloads: dl.filter((d: any) => d.app_id === a.id).length,
          reviews: rv.filter((r: any) => r.app_id === a.id).length,
          rating: a.rating || 0,
        })).sort((x, y) => y.downloads - x.downloads),
      };
    },
  });

  return { stats: data, isLoading };
};
