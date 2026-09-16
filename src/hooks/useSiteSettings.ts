import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_SETTINGS } from '@/lib/siteSettingsDefaults';
import { hexToHsl } from '@/lib/colorUtils';

export interface SiteSettings { [key: string]: string }

interface Ctx {
  settings: SiteSettings;
  isLoading: boolean;
  updateSetting: (key: string, value: string) => Promise<void>;
  updateMultipleSettings: (updates: Record<string, string>) => Promise<void>;
  getSetting: (key: string, defaultValue?: string) => string;
  getBool: (key: string) => boolean;
  getJson: <T>(key: string, fallback: T) => T;
  refetch: () => Promise<void>;
}

const SiteSettingsContext = createContext<Ctx | undefined>(undefined);

export const applyTheme = (s: SiteSettings) => {
  const root = document.documentElement;
  // الألوان المخصصة مصمّمة للوضع الداكن — لا تُطبّق في الوضع الفاتح حتى لا تُلغيه
  const isDark = root.classList.contains('dark');
  const vars: Record<string, string | undefined> = {};
  if (s.theme_enabled === 'true' && isDark) {
    const map: Record<string, string> = {
      color_background: '--background',
      color_foreground: '--foreground',
      color_card: '--card',
      color_primary: '--primary',
      color_primary_foreground: '--primary-foreground',
      color_secondary: '--secondary',
      color_muted_foreground: '--muted-foreground',
      color_accent: '--accent',
      color_border: '--border',
    };
    Object.entries(map).forEach(([key, cssVar]) => {
      const hsl = hexToHsl(s[key] || '');
      if (hsl) vars[cssVar] = hsl;
    });
    if (vars['--card']) {
      vars['--popover'] = vars['--card'];
      vars['--card-foreground'] = vars['--foreground'];
      vars['--popover-foreground'] = vars['--foreground'];
    }
    if (vars['--secondary']) {
      vars['--muted'] = vars['--secondary'];
      vars['--input'] = vars['--secondary'];
      vars['--secondary-foreground'] = vars['--foreground'];
    }
    if (vars['--primary']) vars['--ring'] = vars['--primary'];
    if (s.radius) vars['--radius'] = `${s.radius}rem`;

    const from = s.gradient_from, to = s.gradient_to, angle = s.gradient_angle || '135';
    if (from && to) {
      vars['--gradient-gold'] = `linear-gradient(${angle}deg, ${from}, ${to})`;
      vars['--gradient-glow'] = `radial-gradient(ellipse at center, ${from}26 0%, transparent 70%)`;
      vars['--shadow-gold'] = `0 4px 20px -4px ${from}4d`;
    }
  }
  // reset then apply
  ['--background','--foreground','--card','--card-foreground','--popover','--popover-foreground','--primary','--primary-foreground','--secondary','--secondary-foreground','--muted','--muted-foreground','--accent','--border','--input','--ring','--radius','--gradient-gold','--gradient-glow','--shadow-gold']
    .forEach(v => root.style.removeProperty(v));
  Object.entries(vars).forEach(([k, v]) => v && root.style.setProperty(k, v));

  root.classList.toggle('no-glass', s.effect_glass === 'false');
  root.classList.toggle('no-shadows', s.effect_shadows === 'false');
  root.classList.toggle('no-animations', s.effect_animations === 'false');
  root.classList.toggle('no-glow', s.effect_glow === 'false');
};

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase.from('site_settings').select('setting_key, setting_value');
    if (!error && data) {
      const map: SiteSettings = { ...DEFAULT_SETTINGS };
      (data as any[]).forEach(row => {
        if (row.setting_value !== null && row.setting_value !== undefined) map[row.setting_key] = row.setting_value;
      });
      setSettings(map);
      applyTheme(map);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  // إعادة تطبيق الثيم عند تبديل الوضع الفاتح/الداكن
  useEffect(() => {
    const handler = () => applyTheme(settings);
    window.addEventListener('app-theme-change', handler);
    return () => window.removeEventListener('app-theme-change', handler);
  }, [settings]);

  const persist = async (updates: Record<string, string>) => {
    const rows = Object.entries(updates).map(([setting_key, setting_value]) => ({ setting_key, setting_value }));
    const { error } = await supabase
      .from('site_settings')
      .upsert(rows as any, { onConflict: 'setting_key' });
    return error;
  };

  const updateSetting = async (key: string, value: string) => {
    const error = await persist({ [key]: value });
    if (error) {
      toast({ title: 'خطأ', description: 'فشل في حفظ الإعداد', variant: 'destructive' });
      return;
    }
    setSettings(prev => { const next = { ...prev, [key]: value }; applyTheme(next); return next; });
    toast({ title: 'تم', description: 'تم حفظ الإعداد بنجاح' });
  };

  const updateMultipleSettings = async (updates: Record<string, string>) => {
    const error = await persist(updates);
    if (error) {
      toast({ title: 'خطأ', description: 'فشل حفظ الإعدادات — تأكد من صلاحيات المدير', variant: 'destructive' });
      return;
    }
    setSettings(prev => { const next = { ...prev, ...updates }; applyTheme(next); return next; });
    toast({ title: 'تم', description: 'تم حفظ الإعدادات بنجاح' });
  };

  const value = useMemo<Ctx>(() => ({
    settings,
    isLoading,
    updateSetting,
    updateMultipleSettings,
    getSetting: (key, def = '') => settings[key] ?? def,
    getBool: (key) => (settings[key] ?? DEFAULT_SETTINGS[key]) !== 'false',
    getJson: <T,>(key: string, fallback: T): T => {
      try { const p = JSON.parse(settings[key] || ''); return (p ?? fallback) as T; } catch { return fallback; }
    },
    refetch: fetchSettings,
  }), [settings, isLoading, fetchSettings]);

  return React.createElement(SiteSettingsContext.Provider, { value }, children);
};

export const useSiteSettings = (): Ctx => {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
  return ctx;
};
