import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'TOKEN_REFRESHED' && !session) {
          // refresh failed – clear any stale tokens
          try {
            Object.keys(localStorage)
              .filter((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
              .forEach((k) => localStorage.removeItem(k));
          } catch {}
        }
        setSession(session);
        setUser(session?.user ?? null);
        setIsGuest(false);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      
      // Check for guest session
      const guestData = localStorage.getItem('guest-session');
      if (!session && guestData) {
        setIsGuest(true);
      }
      
      setIsLoading(false);
    }).catch(() => {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
          .forEach((k) => localStorage.removeItem(k));
      } catch {}
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      // Clear any stale session tokens that could be triggering refresh loops
      Object.keys(localStorage)
        .filter((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}

    let error: { message: string } | null = null;
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      error = res.error;
    } catch (e: any) {
      return { error: 'تعذر الاتصال بالخادم. تحقق من الإنترنت أو أوقف مانع الإعلانات ثم أعد المحاولة.' };
    }

    if (error) {
      if (error.message?.toLowerCase().includes('invalid login')) {
        return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        return { error: 'يرجى تأكيد بريدك الإلكتروني أولاً' };
      }
      return { error: error.message };
    }
    
    localStorage.removeItem('guest-session');
    setIsGuest(false);
    return { error: null };
  };

  const register = async (name: string, email: string, password: string): Promise<{ error: string | null }> => {
    const redirectUrl = `${window.location.origin}/`;

    let error: { message: string } | null = null;
    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { name },
        },
      });
      error = res.error;
    } catch (e: any) {
      return { error: 'تعذر الاتصال بالخادم. تحقق من الإنترنت أو أوقف مانع الإعلانات ثم أعد المحاولة.' };
    }

    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'هذا البريد الإلكتروني مسجل بالفعل' };
      }
      return { error: error.message };
    }
    
    localStorage.removeItem('guest-session');
    setIsGuest(false);
    return { error: null };
  };

  const loginAsGuest = () => {
    const guestData = {
      id: 'guest-' + Date.now(),
      name: 'زائر',
      isGuest: true,
    };
    localStorage.setItem('guest-session', JSON.stringify(guestData));
    setIsGuest(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('guest-session');
    setIsGuest(false);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isAuthenticated = !!user || isGuest;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isAuthenticated,
      isLoading,
      isGuest: isGuest && !user,
      login,
      register,
      loginAsGuest,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
