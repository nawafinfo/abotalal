import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BlogSection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  gradient_from: string | null;
  gradient_to: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  section_id: string | null;
  title: string;
  summary: string | null;
  image_url: string | null;
  content: string | null;
  views_count: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  content: string;
  is_visible: boolean;
  created_at: string;
}

export const useBlogSections = () => {
  const [sections, setSections] = useState<BlogSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSections = useCallback(async () => {
    const { data } = await supabase
      .from('blog_sections')
      .select('*')
      .order('sort_order', { ascending: true });
    setSections((data as BlogSection[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const addSection = async (values: Partial<BlogSection>) => {
    const { error } = await supabase.from('blog_sections').insert(values as any);
    if (!error) await fetchSections();
    return { error };
  };
  const updateSection = async (id: string, values: Partial<BlogSection>) => {
    const { error } = await supabase.from('blog_sections').update(values as any).eq('id', id);
    if (!error) await fetchSections();
    return { error };
  };
  const deleteSection = async (id: string) => {
    const { error } = await supabase.from('blog_sections').delete().eq('id', id);
    if (!error) await fetchSections();
    return { error };
  };

  return {
    sections,
    activeSections: sections.filter(s => s.is_active),
    rootSections: sections.filter(s => s.is_active && !s.parent_id),
    isLoading,
    addSection,
    updateSection,
    deleteSection,
    refetch: fetchSections,
  };
};

export const useBlogPosts = (sectionId?: string | null) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    let q = supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (sectionId) q = q.eq('section_id', sectionId);
    const { data } = await q;
    setPosts((data as BlogPost[]) || []);
    setIsLoading(false);
  }, [sectionId]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const addPost = async (values: Partial<BlogPost>) => {
    const { error } = await supabase.from('blog_posts').insert(values as any);
    if (!error) await fetchPosts();
    return { error };
  };
  const updatePost = async (id: string, values: Partial<BlogPost>) => {
    const { error } = await supabase.from('blog_posts').update(values as any).eq('id', id);
    if (!error) await fetchPosts();
    return { error };
  };
  const deletePost = async (id: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (!error) await fetchPosts();
    return { error };
  };

  return {
    posts,
    activePosts: posts.filter(p => p.is_active),
    isLoading,
    addPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
};

export const useBlogPost = (postId?: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [section, setSection] = useState<BlogSection | null>(null);
  const [siblings, setSiblings] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const { data } = await supabase.from('blog_posts').select('*').eq('id', postId).maybeSingle();
      if (cancelled) return;
      const p = data as BlogPost | null;
      setPost(p);
      if (p?.section_id) {
        const [{ data: s }, { data: sib }] = await Promise.all([
          supabase.from('blog_sections').select('*').eq('id', p.section_id).maybeSingle(),
          supabase.from('blog_posts').select('*').eq('section_id', p.section_id).eq('is_active', true)
            .order('created_at', { ascending: false }),
        ]);
        if (cancelled) return;
        setSection((s as BlogSection) || null);
        setSiblings((sib as BlogPost[]) || []);
      }
      setIsLoading(false);
      if (p) {
        await supabase.from('blog_posts').update({ views_count: (p.views_count || 0) + 1 }).eq('id', p.id);
      }
    })();
    return () => { cancelled = true; };
  }, [postId]);

  return { post, section, siblings, isLoading };
};

export const useBlogComments = (postId?: string) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!postId) { setIsLoading(false); return; }
    const { data } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    setComments((data as BlogComment[]) || []);
    setIsLoading(false);
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const addComment = async (values: { post_id: string; user_id: string; user_name: string; content: string }) => {
    const { error } = await supabase.from('blog_comments').insert(values as any);
    if (!error) await fetchComments();
    return { error };
  };
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from('blog_comments').delete().eq('id', id);
    if (!error) await fetchComments();
    return { error };
  };

  return { comments, visibleComments: comments.filter(c => c.is_visible), isLoading, addComment, deleteComment, refetch: fetchComments };
};
