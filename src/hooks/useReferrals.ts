import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Referral {
  id: string;
  referrer_id: string;
  referred_email_masked: string | null;
  referred_user_id: string | null;
  status: string;
  points_awarded: number;
  created_at: string;
}

interface UserPoints {
  id: string;
  user_id: string;
  points: number;
  total_earned: number;
  updated_at: string;
}

interface PointsHistory {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export const useReferrals = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const referralLink = user ? `${window.location.origin}/?ref=${user.id.slice(0, 8)}` : '';

  const fetchData = async () => {
    if (!user) { setIsLoading(false); return; }

    const [refRes, ptsRes, histRes] = await Promise.all([
      supabase.from('my_referrals' as any).select('*').eq('referrer_id', user.id).order('created_at', { ascending: false }),
      supabase.from('user_points').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('points_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    if (refRes.data) setReferrals(refRes.data as unknown as Referral[]);
    if (ptsRes.data) setUserPoints(ptsRes.data as UserPoints);
    if (histRes.data) setPointsHistory(histRes.data as PointsHistory[]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const sendReferral = async (email: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('referrals').insert({
      referrer_id: user.id,
      referred_email: email,
    });

    if (!error) fetchData();
    return { error: error?.message || null };
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      return true;
    } catch {
      return false;
    }
  };

  return {
    referrals,
    userPoints,
    pointsHistory,
    referralLink,
    isLoading,
    sendReferral,
    copyReferralLink,
    refetch: fetchData,
  };
};

// Admin hook for managing all points
export const useAdminPoints = () => {
  const [allPoints, setAllPoints] = useState<(UserPoints & { profile?: { name: string; email: string | null } })[]>([]);
  const [allReferrals, setAllReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = async () => {
    const [ptsRes, refRes] = await Promise.all([
      supabase.from('user_points').select('*').order('points', { ascending: false }),
      supabase.from('referrals').select('id, referrer_id, referred_user_id, status, points_awarded, created_at').order('created_at', { ascending: false }),
    ]);

    if (ptsRes.data) {
      const userIds = ptsRes.data.map((p: any) => p.user_id);
      const { data: profiles } = await supabase.from('profiles').select('user_id, name, email').in('user_id', userIds);
      
      setAllPoints(ptsRes.data.map((p: any) => ({
        ...p,
        profile: profiles?.find((pr: any) => pr.user_id === p.user_id),
      })));
    }
    if (refRes.data) setAllReferrals(refRes.data as unknown as Referral[]);
    setIsLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const adjustPoints = async (userId: string, amount: number, reason: string) => {
    // Upsert user_points
    const existing = allPoints.find(p => p.user_id === userId);
    if (existing) {
      await supabase.from('user_points').update({
        points: existing.points + amount,
        total_earned: amount > 0 ? existing.total_earned + amount : existing.total_earned,
      }).eq('user_id', userId);
    } else {
      await supabase.from('user_points').insert({
        user_id: userId,
        points: Math.max(0, amount),
        total_earned: Math.max(0, amount),
      });
    }

    await supabase.from('points_history').insert({
      user_id: userId,
      amount,
      reason,
    });

    fetchAll();
  };

  return { allPoints, allReferrals, isLoading, adjustPoints, refetch: fetchAll };
};
