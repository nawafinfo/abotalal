import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const PORTFOLIO_CATEGORIES = [
  { value: 'social_media', label: 'تصاميم السوشيال ميديا', icon: '📱', color: 'from-pink-500 to-rose-600' },
  { value: 'wedding', label: 'دعوات وتهنئات الزفاف والمناسبات', icon: '💍', color: 'from-amber-400 to-yellow-600' },
  { value: 'signs', label: 'اللوحات التجارية', icon: '🪧', color: 'from-blue-500 to-indigo-600' },
  { value: 'branding', label: 'الهويات والشعارات التجارية', icon: '🎨', color: 'from-violet-500 to-purple-600' },
  { value: 'prints', label: 'المطبوعات الدعائية', icon: '🖨️', color: 'from-emerald-500 to-teal-600' },
  { value: 'bags', label: 'تصميم وطباعة الأكياس', icon: '👜', color: 'from-orange-500 to-red-600' },
];

export const usePortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching portfolio items:', error);
    } else {
      setItems(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const addItem = async (item: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('portfolio_items').insert(item);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في إضافة العنصر', variant: 'destructive' });
    } else {
      toast({ title: 'تم', description: 'تمت إضافة العنصر بنجاح' });
      fetchItems();
    }
  };

  const updateItem = async (id: string, updates: Partial<PortfolioItem>) => {
    const { error } = await supabase.from('portfolio_items').update(updates).eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في تحديث العنصر', variant: 'destructive' });
    } else {
      toast({ title: 'تم', description: 'تم تحديث العنصر بنجاح' });
      fetchItems();
    }
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حذف العنصر', variant: 'destructive' });
    } else {
      toast({ title: 'تم', description: 'تم حذف العنصر بنجاح' });
      fetchItems();
    }
  };

  return { items, isLoading, addItem, updateItem, deleteItem, refetch: fetchItems };
};
