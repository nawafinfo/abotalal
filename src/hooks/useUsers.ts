import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  role?: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    // Fetch profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !profiles) {
      setIsLoading(false);
      return;
    }

    // Fetch roles
    const { data: roles } = await supabase
      .from('user_roles')
      .select('*');

    const usersWithRoles = profiles.map(p => {
      const userRole = roles?.find(r => r.user_id === p.user_id);
      return { ...p, role: userRole?.role || 'user' };
    });

    setUsers(usersWithRoles);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setUserRole = async (userId: string, role: string) => {
    // Check if role exists
    const { data: existing } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from('user_roles')
        .update({ role: role as any })
        .eq('user_id', userId));
    } else {
      ({ error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: role as any }));
    }

    if (!error) {
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role } : u));
    }
    return { error };
  };

  const removeUserRole = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (!error) {
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: 'user' } : u));
    }
    return { error };
  };

  return {
    users,
    isLoading,
    setUserRole,
    removeUserRole,
    refetch: fetchUsers,
  };
};
