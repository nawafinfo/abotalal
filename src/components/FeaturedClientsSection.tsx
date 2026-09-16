import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users } from 'lucide-react';
import { useFeaturedClients } from '@/hooks/useFeaturedClients';

const FeaturedClientsSection: React.FC = () => {
  const { clients, isLoading } = useFeaturedClients();
  const activeClients = clients.filter(c => c.is_active);

  if (isLoading || activeClients.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-5 h-5 text-primary fill-primary" />
          <h3 className="text-lg font-bold text-foreground">عملاؤنا هم مصدر ثقتنا</h3>
          <Star className="w-5 h-5 text-primary fill-primary" />
        </div>
        <p className="text-sm text-muted-foreground">نفتخر بثقة عملائنا المميزين</p>
      </div>

      <div className="overflow-hidden relative">
        <motion.div
          className="flex gap-6 py-4"
          animate={{ x: [0, -(activeClients.length * 120)] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: activeClients.length * 4,
              ease: 'linear',
            },
          }}
        >
          {[...activeClients, ...activeClients, ...activeClients].map((client, i) => (
            <div key={`${client.id}-${i}`} className="flex-shrink-0 flex flex-col items-center gap-2 w-24">
              <div className="w-16 h-16 rounded-full border-2 border-primary/50 overflow-hidden bg-card shadow-lg">
                {client.image_url ? (
                  <img src={client.image_url} alt={client.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                )}
              </div>
              <p className="text-xs text-foreground font-medium text-center truncate w-full">{client.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedClientsSection;
