import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageCircle, Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { useMessages } from '@/hooks/useMessages';
import { useNavigate } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getIcon } from '@/lib/iconMap';
import NotificationsDropdown from './NotificationsDropdown';
import MessagesDropdown from './MessagesDropdown';
import ThemeToggle from './ThemeToggle';
import BrandTitle from '@/components/brand/BrandTitle';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const { unreadCount: notificationCount } = useNotifications();
  const { unreadCount: messageCount } = useMessages();
  const { getSetting, getBool, getJson } = useSiteSettings();
  const navigate = useNavigate();

  const logoUrl = getSetting('site_logo_url');
  const logoSize = parseInt(getSetting('header_logo_size', '36'), 10) || 36;
  const title = getSetting('header_title') || getSetting('site_name');
  const whatsappNumber = getSetting('header_whatsapp_number', '967778215553');
  const customButtons = getJson<Array<{ id: string; label: string; icon: string; action: string; value: string }>>('header_buttons', []);

  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  const runAction = (btn: { action: string; value: string }) => {
    if (btn.action === 'url') window.open(btn.value, '_blank');
    else if (btn.action === 'whatsapp') window.open(`https://wa.me/${btn.value}`, '_blank');
    else if (btn.action === 'phone') window.open(`tel:${btn.value}`, '_self');
    else navigate(btn.value || '/');
  };

  if (!getBool('header_enabled')) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 glass bg-background/80 border-b border-border"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-foreground hover:bg-secondary"
          aria-label="فتح القائمة"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Logo & Name */}
        <div className="flex items-center gap-3 min-w-0">
          {getBool('header_show_logo') && (
            logoUrl ? (
              <img src={logoUrl} alt={title} style={{ width: logoSize, height: logoSize }} className="rounded-xl object-contain shrink-0 bg-card p-0.5 shadow-card" />
            ) : (
              <div style={{ width: logoSize, height: logoSize }} className="rounded-xl gradient-brand flex items-center justify-center shrink-0">
                <Sparkles style={{ width: logoSize / 2, height: logoSize / 2 }} className="text-primary-foreground" />
              </div>
            )
          )}
          {getBool('header_show_name') && (
            <BrandTitle as="span" title={title} className="text-base sm:text-lg leading-tight truncate" />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {customButtons.map((btn) => {
            const Icon = getIcon(btn.icon);
            return (
              <Button key={btn.id} variant="ghost" size="icon" aria-label={btn.label}
                onClick={() => runAction(btn)} className="text-foreground hover:bg-secondary">
                <Icon className="w-5 h-5" />
              </Button>
            );
          })}

          {/* Notifications */}
          {getBool('header_show_notifications') && <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground hover:bg-secondary"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
              }}
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
            <NotificationsDropdown
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>}

          {/* Messages */}
          {getBool('header_show_messages') && <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-foreground hover:bg-secondary"
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
              }}
              aria-label="الرسائل"
            >
              <MessageCircle className="w-5 h-5" />
              {messageCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {messageCount > 9 ? '9+' : messageCount}
                </Badge>
              )}
            </Button>
            <MessagesDropdown
              isOpen={showMessages}
              onClose={() => setShowMessages(false)}
            />
          </div>}

          {/* WhatsApp */}
          {getBool('header_show_whatsapp') && <Button
            variant="ghost"
            size="icon"
            onClick={openWhatsApp}
            className="text-whatsapp hover:bg-whatsapp/10"
            aria-label="تواصل عبر واتساب"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </Button>}
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;
