import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getIcon } from '@/lib/iconMap';

export interface HomeCard {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  buttonText?: string;
  link?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const CustomHomeCards: React.FC = () => {
  const { getJson } = useSiteSettings();
  const navigate = useNavigate();
  const cards = getJson<HomeCard[]>('home_cards', []);

  if (!cards.length) return null;

  const open = (link?: string) => {
    if (!link) return;
    if (link.startsWith('http')) window.open(link, '_blank');
    else navigate(link);
  };

  return (
    <div className="space-y-4">
      {cards.map((card, i) => {
        const Icon = getIcon(card.icon);
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            onClick={() => open(card.link)}
            role={card.link ? 'button' : undefined}
            className="relative overflow-hidden rounded-2xl border border-border p-5 cursor-pointer shadow-card"
            style={{
              background: `linear-gradient(135deg, ${card.gradientFrom || 'hsl(var(--card))'}, ${card.gradientTo || 'hsl(var(--secondary))'})`,
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-background/30 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-foreground">{card.title}</h3>
                {card.description && <p className="text-sm text-muted-foreground line-clamp-2">{card.description}</p>}
              </div>
              {card.link && (
                <div className="flex items-center gap-1 text-sm font-medium text-primary shrink-0">
                  {card.buttonText || 'عرض'}
                  <ChevronLeft className="w-4 h-4" />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CustomHomeCards;
