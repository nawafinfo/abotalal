import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Moon, Sun, LogOut, ChevronLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { menuItems } from '@/data/services';

const getUserDisplayInfo = (user: any, profile: any) => {
  if (profile) return { name: profile.name, email: profile.email, isGuest: false };
  if (user) return { name: user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم', email: user.email, isGuest: false };
  return { name: 'زائر', email: '', isGuest: true };
};

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const displayInfo = getUserDisplayInfo(user, profile);

  // Filter out admin item from regular menu - we'll show it conditionally
  const filteredMenuItems = menuItems.filter(item => item.id !== 'admin');

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/auth');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />

          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-card border-l border-border shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">القائمة</span>
                  <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {(user || displayInfo.isGuest) && (
                <button onClick={() => { if (user) handleNavigate('/profile'); }}
                  className="w-full flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors">
                  <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {displayInfo.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-semibold text-foreground">{displayInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{displayInfo.isGuest ? 'زائر' : displayInfo.email}</p>
                  </div>
                </button>
              )}
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-custom max-h-[calc(100vh-280px)]">
              {/* Admin Dashboard - Only visible to admins */}
              {isAdmin && (
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  onClick={() => handleNavigate('/admin')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors group border border-primary/20"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="flex-1 text-right font-bold text-primary">لوحة التحكم</span>
                  <ChevronLeft className="w-4 h-4 text-primary" />
                </motion.button>
              )}

              {filteredMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="flex-1 text-right font-medium text-foreground">{item.title}</span>
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-3">
              <Button variant="outline" className="w-full justify-between" onClick={toggleTheme}>
                <span>{theme === 'dark' ? 'الوضع الفاتح' : 'الوضع المظلم'}</span>
                {theme === 'dark' ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
              </Button>
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="w-5 h-5 ml-2" />تسجيل الخروج
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DrawerMenu;
