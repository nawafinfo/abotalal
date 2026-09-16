import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Check, Trash2, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface MessagesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessagesDropdown: React.FC<MessagesDropdownProps> = ({ isOpen, onClose }) => {
  const { messages, unreadCount, markAsRead, deleteMessage } = useMessages();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-12 left-0 z-50 w-80 bg-card border border-border rounded-xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">الرسائل</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages List */}
            <div className="max-h-96 overflow-y-auto scrollbar-custom">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>لا توجد رسائل</p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${
                      !message.is_read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => !message.is_read && markAsRead(message.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {message.subject}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {message.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(message.created_at), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!message.is_read && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(message.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MessagesDropdown;
