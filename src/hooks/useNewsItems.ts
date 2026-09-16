import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  content: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useNewsItems = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setNewsItems(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNews();

    const channel = supabase
      .channel('news-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news_items' }, () => fetchNews())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const createNewsItem = async (content: string, sort_order: number = 0) => {
    const { data, error } = await supabase
      .from('news_items')
      .insert({ content, sort_order })
      .select()
      .single();

    if (!error && data) {
      setNewsItems(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
    }
    return { data, error };
  };

  const updateNewsItem = async (id: string, updates: Partial<NewsItem>) => {
    const { error } = await supabase
      .from('news_items')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setNewsItems(prev =>
        prev.map(n => (n.id === id ? { ...n, ...updates } : n)).sort((a, b) => a.sort_order - b.sort_order)
      );
    }
    return { error };
  };

  const deleteNewsItem = async (id: string) => {
    const { error } = await supabase
      .from('news_items')
      .delete()
      .eq('id', id);

    if (!error) {
      setNewsItems(prev => prev.filter(n => n.id !== id));
    }
    return { error };
  };

  const toggleNewsItem = async (id: string, is_active: boolean) => {
    return updateNewsItem(id, { is_active });
  };

  return {
    newsItems,
    activeNewsItems: newsItems.filter(n => n.is_active),
    isLoading,
    createNewsItem,
    updateNewsItem,
    deleteNewsItem,
    toggleNewsItem,
    refetch: fetchNews,
  };
};
