import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Channel {
  id: string;
  name: string;
  description: string | null;
  stream_url: string | null;
  thumbnail_url: string | null;
  logo_url: string | null;
  category: string;
  is_active: boolean;
  sort_order: number;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChannels = async () => {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setChannels(data as Channel[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChannels();

    const channel = supabase
      .channel('channels-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, () => fetchChannels())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const createChannel = async (ch: Partial<Channel>) => {
    const { data, error } = await supabase
      .from('channels')
      .insert(ch as any)
      .select()
      .single();
    if (!error) fetchChannels();
    return { data, error };
  };

  const updateChannel = async (id: string, updates: Partial<Channel>) => {
    const { error } = await supabase
      .from('channels')
      .update(updates as any)
      .eq('id', id);
    if (!error) fetchChannels();
    return { error };
  };

  const deleteChannel = async (id: string) => {
    const { error } = await supabase
      .from('channels')
      .delete()
      .eq('id', id);
    if (!error) fetchChannels();
    return { error };
  };

  const incrementViews = async (id: string) => {
    const ch = channels.find(c => c.id === id);
    if (ch) {
      await supabase
        .from('channels')
        .update({ views_count: ch.views_count + 1 } as any)
        .eq('id', id);
    }
  };

  const getByCategory = (cat: string) => channels.filter(c => c.category === cat && c.is_active);

  return {
    channels,
    isLoading,
    createChannel,
    updateChannel,
    deleteChannel,
    incrementViews,
    getByCategory,
    activeChannels: channels.filter(c => c.is_active),
    refetch: fetchChannels,
  };
};
