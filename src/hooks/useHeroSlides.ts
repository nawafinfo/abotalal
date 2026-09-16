import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HeroSlide {
  id: string;
  title: string;
  description: string | null;
  gradient: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useHeroSlides = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setSlides(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSlides();

    const channel = supabase
      .channel('hero-slides-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, () => fetchSlides())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const createSlide = async (slide: { title: string; description?: string; gradient: string; sort_order: number }) => {
    const { data, error } = await supabase
      .from('hero_slides')
      .insert(slide)
      .select()
      .single();

    if (!error && data) {
      setSlides(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
    }
    return { data, error };
  };

  const updateSlide = async (id: string, updates: Partial<HeroSlide>) => {
    const { error } = await supabase
      .from('hero_slides')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }
    return { error };
  };

  const deleteSlide = async (id: string) => {
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .eq('id', id);

    if (!error) {
      setSlides(prev => prev.filter(s => s.id !== id));
    }
    return { error };
  };

  const toggleSlide = async (id: string, is_active: boolean) => {
    return updateSlide(id, { is_active });
  };

  const activeSlides = slides.filter(s => s.is_active);

  return {
    slides,
    activeSlides,
    isLoading,
    createSlide,
    updateSlide,
    deleteSlide,
    toggleSlide,
    refetch: fetchSlides,
  };
};
