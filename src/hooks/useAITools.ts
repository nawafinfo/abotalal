import { uploadToBucket } from '@/lib/uploadFile';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AITool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  tool_url: string | null;
  icon_url: string | null;
  logo_url: string | null;
  color: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useAITools = () => {
  const [tools, setTools] = useState<AITool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTools = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('ai_tools')
      .select('*')
      .order('sort_order', { ascending: true });
    setTools((data as AITool[]) || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const addTool = async (tool: Partial<AITool>) => {
    const { error } = await supabase.from('ai_tools').insert(tool as any);
    if (!error) await fetchTools();
    return { error };
  };

  const updateTool = async (id: string, updates: Partial<AITool>) => {
    const { error } = await supabase.from('ai_tools').update(updates).eq('id', id);
    if (!error) await fetchTools();
    return { error };
  };

  const deleteTool = async (id: string) => {
    const { error } = await supabase.from('ai_tools').delete().eq('id', id);
    if (!error) await fetchTools();
    return { error };
  };

  const uploadIcon = async (file: File): Promise<string | null> => {
    const { url } = await uploadToBucket('portfolio', file, 'ai-tools');
    return url;
  };

  return { tools, isLoading, addTool, updateTool, deleteTool, uploadIcon, refetch: fetchTools };
};