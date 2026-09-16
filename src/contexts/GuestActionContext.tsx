import React, { createContext, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, UserPlus, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { actionKeyFor } from '@/lib/guestAccess';

interface GuestActionOptions {
  title?: string;
  description?: string;
  /** مفتاح الإجراء (booking, order, download, ...) للتحكم به من لوحة التحكم */
  action?: string;
}

interface GuestActionContextType {
  requireAccount: (action?: () => void, options?: GuestActionOptions) => boolean;
  openInvite: (options?: GuestActionOptions) => void;
  isActionAllowedForGuests: (key?: string) => boolean;
}

const GuestActionContext = createContext<GuestActionContextType | undefined>(undefined);

export const GuestActionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { getSetting, getBool, getJson } = useSiteSettings();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<GuestActionOptions>({});

  const isActionAllowedForGuests = useCallback(
    (key?: string) => {
      if (getSetting('guest_allow_all_actions') === 'true') return true;
      if (!key) return false;
      return getSetting(actionKeyFor(key)) === 'true';
    },
    [getSetting]
  );

  const openInvite = useCallback((options?: GuestActionOptions) => {
    setOpts(options || {});
    setOpen(true);
  }, []);

  const requireAccount = useCallback(
    (action?: () => void, options?: GuestActionOptions) => {
      if (!user && !isActionAllowedForGuests(options?.action)) {
        openInvite(options);
        return false;
      }
      action?.();
      return true;
    },
    [user, openInvite, isActionAllowedForGuests]
  );

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const perks = getJson<string[]>('guest_dialog_perks', []);

  return (
    <GuestActionContext.Provider value={{ requireAccount, openInvite, isActionAllowedForGuests }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden border-primary/25">
          <div className="relative">
            <div className="absolute inset-0 opacity-70" style={{ background: 'var(--gradient-glow)' }} />
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-elevated mb-4">
                <Lock className="w-7 h-7 text-primary-foreground" />
              </div>

              <span className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30">
                <Sparkles className="w-3 h-3" /> {getSetting('guest_dialog_badge', 'وضع الزائر')}
              </span>

              <h3 className="text-lg font-black text-gradient-gold mb-2">
                {opts.title || getSetting('guest_dialog_title')}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {opts.description || getSetting('guest_dialog_description')}
              </p>

              {perks.length > 0 && (
                <div className="grid gap-2 mt-4 w-full">
                  {perks.map((p) => (
                    <div key={p} className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs font-medium text-foreground text-right">{p}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2 mt-5 w-full">
                {getBool('guest_dialog_show_register') && (
                  <Button onClick={() => go('/auth?mode=register')} className="h-11 gradient-gold text-primary-foreground font-bold">
                    <UserPlus className="w-4 h-4 ml-2" /> {getSetting('guest_dialog_register_text', 'إنشاء حساب مجاني')}
                  </Button>
                )}
                {getBool('guest_dialog_show_login') && (
                  <Button variant="outline" onClick={() => go('/auth?mode=login')} className="h-11 font-bold border-primary/30">
                    <LogIn className="w-4 h-4 ml-2" /> {getSetting('guest_dialog_login_text', 'تسجيل الدخول')}
                  </Button>
                )}
                {getBool('guest_dialog_show_continue') && (
                  <button onClick={() => setOpen(false)} className="text-xs text-muted-foreground hover:text-foreground mt-1">
                    {getSetting('guest_dialog_continue_text', 'متابعة التصفح كزائر')}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>
    </GuestActionContext.Provider>
  );
};

export const useGuestAction = () => {
  const ctx = useContext(GuestActionContext);
  if (!ctx) throw new Error('useGuestAction must be used within GuestActionProvider');
  return ctx;
};
