import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { services } from '@/data/services';

const ServiceGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <motion.button
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(service.path)}
            className="group relative p-4 bg-card border border-border rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden"
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center gap-3">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}
              >
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm leading-tight mb-1">
                  {service.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 hidden md:block">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Decorative Wave */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="currentColor" className="text-primary" />
              </svg>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ServiceGrid;
