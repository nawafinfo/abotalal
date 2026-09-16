import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Loader2, PackageCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TRACK_STEPS = [
  { key: 'pending', label: 'تم الاستلام', icon: Clock },
  { key: 'confirmed', label: 'تم التأكيد', icon: Check },
  { key: 'processing', label: 'قيد التنفيذ', icon: Truck },
  { key: 'completed', label: 'مكتمل', icon: PackageCheck },
  { key: 'received', label: 'تم الاستلام النهائي', icon: PackageCheck },
];

const indexOfStatus = (status: string) => {
  const i = TRACK_STEPS.findIndex((s) => s.key === status);
  return i === -1 ? 0 : i;
};

interface OrderTrackerProps {
  status: string;
  onConfirmReceipt?: () => void;
  isConfirming?: boolean;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ status, onConfirmReceipt, isConfirming }) => {
  if (status === 'cancelled') {
    return <p className="text-xs text-destructive font-medium mt-2">تم إلغاء هذا الطلب</p>;
  }

  const active = indexOfStatus(status);

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <div className="flex items-center justify-between gap-1">
        {TRACK_STEPS.map((step, i) => {
          const done = i <= active;
          const Icon = step.icon;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1 min-w-0">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                    done ? 'gradient-gold border-transparent text-primary-foreground' : 'bg-secondary border-border text-muted-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.div>
                <span className={`text-[9px] text-center leading-tight ${done ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
              {i < TRACK_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${i < active ? 'gradient-gold' : 'bg-border'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {status === 'completed' && onConfirmReceipt && (
        <Button size="sm" onClick={onConfirmReceipt} disabled={isConfirming} className="w-full mt-3 h-9 gradient-gold text-primary-foreground font-bold">
          {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تأكيد الاستلام'}
        </Button>
      )}
      {status === 'received' && (
        <p className="text-xs text-emerald-600 font-semibold mt-2 text-center">✓ تم تأكيد استلامك لهذا الطلب</p>
      )}
    </div>
  );
};

export default OrderTracker;