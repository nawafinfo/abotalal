import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import WaveBackground from '@/components/brand/WaveBackground';
import LogoCard from '@/components/brand/LogoCard';
import BrandTitle from '@/components/brand/BrandTitle';

type AuthMode = 'login' | 'register';

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login, register, loginAsGuest } = useAuth();
  const { toast } = useToast();
  const { getSetting, getBool } = useSiteSettings();

  const logoUrl = getSetting('site_logo_url');
  const logoSize = parseInt(getSetting('auth_logo_size', '80'), 10) || 80;
  const authTitle = getSetting('auth_title') || getSetting('site_name') || 'ابوطلال للدعاية والإعلان والتسويق الإلكتروني';
  const authSubtitle = getSetting('auth_subtitle') || getSetting('site_tagline') || 'خدمات الدعاية والإعلان';
  const showRegister = getBool('auth_show_register');
  const showGuest = getBool('auth_show_guest');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result: { error: string | null };
      if (mode === 'login') {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (result.error) {
        toast({
          title: 'خطأ',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        toast({
          title: mode === 'login' ? 'تم تسجيل الدخول' : 'تم إنشاء الحساب',
          description: mode === 'login' ? `مرحباً بك في ${authTitle}` : 'يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب',
        });
        if (mode === 'login') {
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ، يرجى المحاولة مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    toast({
      title: 'مرحباً بك',
      description: 'تم الدخول كزائر',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 bg-background overflow-hidden">
      <WaveBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* الشعار والعنوان */}
        <div className="text-center mb-7 flex flex-col items-center gap-4">
          {getBool('auth_show_logo') && (
            <LogoCard logoUrl={logoUrl} alt={authTitle} size={logoSize + 40} />
          )}
          <div className="space-y-1">
            <BrandTitle title={authTitle} className="text-2xl sm:text-3xl" />
            {authSubtitle && <p className="text-sm sm:text-base text-muted-foreground">{authSubtitle}</p>}
          </div>
        </div>

        {/* بطاقة الدخول */}
        <div className="bg-card/90 glass border border-border rounded-[1.75rem] p-5 sm:p-6 shadow-elevated">
          {/* التبويبات */}
          <div className="flex bg-secondary rounded-2xl p-1.5 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                mode === 'login'
                  ? 'gradient-brand text-primary-foreground shadow-brand'
                  : 'text-primary/70 hover:text-primary'
              }`}
            >
              تسجيل الدخول
            </button>
            {showRegister && (
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-2.5 rounded-xl font-bold transition-all ${
                  mode === 'register'
                    ? 'gradient-brand text-primary-foreground shadow-brand'
                    : 'text-primary/70 hover:text-primary'
                }`}
              >
                حساب جديد
              </button>
            )}
          </div>

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pr-11 h-14 bg-background border-border rounded-2xl"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-11 h-14 bg-background border-border rounded-2xl"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11 pl-12 h-14 bg-background border-border rounded-2xl"
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl gradient-duo text-primary-foreground flex items-center justify-center"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-14 gradient-brand text-primary-foreground font-bold text-lg rounded-2xl shadow-brand hover:opacity-95"
              disabled={isLoading}
            >
              {isLoading ? 'جاري...' : mode === 'login' ? getSetting('auth_login_button_text', 'دخول') : getSetting('auth_register_button_text', 'إنشاء حساب')}
            </Button>
          </form>

          {/* فاصل */}
          <div className="flex items-center gap-3 my-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
            <span className="text-muted-foreground text-sm">أو</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          </div>

          {showGuest && (
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-primary/40 text-primary font-bold hover:bg-primary/5 gap-2"
              onClick={handleGuest}
            >
              <UserRound className="w-5 h-5" />
              الدخول كضيف
            </Button>
          )}

          {getSetting('auth_footer_text') && (
            <p className="text-center text-xs text-muted-foreground mt-4">{getSetting('auth_footer_text')}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
