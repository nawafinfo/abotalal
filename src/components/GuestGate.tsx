import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, UserPlus, LogIn, ShieldCheck, Gift, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface GuestGateProps {
  title?: string;
  description?: string;
  compact?: boolean;
  children?: React.ReactNode;
}

const perks = [
  { icon: Rocket, text: 'الوصول لكل الخدمات والأقسام' },
  { icon: ShieldCheck, text: 'متابعة طلباتك ومراسلة الإدارة' },
  { icon: Gift, text: 'نقاط ومكافآت نظام الإحالة' },
];

/**
 * Shown instead of protected content when the visitor is browsing as a guest.
 */
export const GuestGate: React.FC<GuestGateProps> = ({
  title = 'هذا المحتوى للأعضاء المسجّلين',
  description = 'أنت تتصفح كزائر. سجّل حسابك المجاني الآن لمشاهدة المحتوى والاستفادة من جميع خدمات ابوطلال للدعاية والإعلان والتسويق الإلكتروني.',
  compact = false,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-elevated"
    >
      <div className="absolute inset-0 opacity-70" style={{ background: 'var(--gradient-glow)' }} />
      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />

      <div className={`relative flex flex-col items-center text-center ${compact ? 'p-6' : 'p-8 md:p-10'}`}>
        <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center shadow-elevated mb-4">
          <Lock className="w-7 h-7 text-primary-foreground" />
        </div>

        <span className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30">
          <Sparkles className="w-3 h-3" /> وضع الزائر
        </span>

        <h3 className="text-xl md:text-2xl font-black text-gradient-gold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">{description}</p>

        {!compact && (
          <div className="grid gap-2 mt-5 w-full max-w-sm">
            {perks.map((p) => (
              <div key={p.text} className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
                <p.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-medium text-foreground">{p.text}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-6 w-full max-w-sm">
          <Button onClick={() => navigate('/auth?mode=register')} className="flex-1 h-11 gradient-gold text-primary-foreground font-bold">
            <UserPlus className="w-4 h-4 ml-2" /> إنشاء حساب مجاني
          </Button>
          <Button variant="outline" onClick={() => navigate('/auth')} className="flex-1 h-11 font-bold border-primary/30">
            <LogIn className="w-4 h-4 ml-2" /> تسجيل الدخول
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

/** Renders children for members, or the invite card for guests. */
export const MembersOnly: React.FC<GuestGateProps> = ({ children, ...props }) => {
  const { isGuest } = useAuth();
  if (isGuest) return <GuestGate {...props} />;
  return <>{children}</>;
};

export default GuestGate;