import React, { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

export const useNow = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** لوحة معلومات الوقت والتاريخ — ساعة دائرية + حلقة تقدم + وقت رقمي + تاريخ */
const DateTimeCard: React.FC = () => {
  const now = useNow();

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const h12 = h % 12 || 12;
  const period = h < 12 ? 'ص' : 'م';

  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hourDeg = (h % 12) * 30 + m * 0.5;

  const R = 46;
  const C = 2 * Math.PI * R;
  const progress = ((m * 60 + s) / 3600) * C;

  const dateText = now.toLocaleDateString('ar-EG', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className="absolute -inset-2 rounded-[2rem] blur-2xl opacity-30"
        style={{ background: 'var(--gradient-duo)' }}
        aria-hidden="true"
      />
      <div className="relative glass bg-card/70 border border-border rounded-[1.75rem] p-4 sm:p-5 shadow-elevated overflow-hidden">
        {/* تموجات داخلية */}
        <div
          className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full blur-3xl opacity-25"
          style={{ background: 'var(--gradient-brand)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-16 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ background: 'var(--gradient-red)' }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-4">
          {/* الساعة الدائرية */}
          <div className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r={R} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
              <circle
                cx="60" cy="60" r={R} fill="none"
                stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${progress} ${C}`}
              />
            </svg>

            <div className="absolute inset-[14%] rounded-full gradient-navy shadow-card flex items-center justify-center">
              {/* العقارب */}
              <span
                className="absolute w-[3px] h-[26%] bg-background/90 rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${hourDeg}deg)` }}
              />
              <span
                className="absolute w-[2px] h-[34%] bg-background/80 rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${minDeg}deg)` }}
              />
              <span
                className="absolute w-[1.5px] h-[38%] rounded-full origin-bottom bottom-1/2"
                style={{ transform: `rotate(${secDeg}deg)`, background: 'hsl(var(--brand-red))' }}
              />
              <span className="absolute w-2 h-2 rounded-full bg-background" />
            </div>
          </div>

          {/* الوقت والتاريخ */}
          <div className="flex-1 min-w-0 text-center">
            <div className="flex items-center justify-center gap-2" dir="ltr">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums tracking-tight">
                {pad(h12)}:{pad(m)}:{pad(s)}
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded-lg gradient-red text-primary-foreground">
                {period}
              </span>
            </div>

            <div className="my-3 h-[2px] w-full rounded-full" style={{ background: 'var(--gradient-red)' }} />

            <div className="inline-flex items-center gap-2 bg-background/70 border border-border rounded-xl px-3 py-1.5">
              <CalendarDays className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-foreground truncate">{dateText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeCard;
