import React from 'react';

/** خلفية بيضاء مائلة للأزرق مع تموجات زرقاء وحمراء وجزيئات ضوئية */
const WaveBackground: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 18% 8%, hsl(var(--brand-blue) / 0.14), transparent 34%),' +
          'radial-gradient(circle at 86% 14%, hsl(var(--brand-red) / 0.12), transparent 32%),' +
          'radial-gradient(circle at 50% 100%, hsl(var(--brand-blue) / 0.12), transparent 46%),' +
          'var(--gradient-hero)',
      }}
    />

    {/* تموجات كبيرة */}
    <div
      className="absolute -top-56 -right-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-25 animate-wave"
      style={{ background: 'var(--gradient-brand)' }}
    />
    <div
      className="absolute -top-44 -left-48 w-[340px] h-[340px] rounded-full blur-3xl opacity-[0.18] animate-wave"
      style={{ background: 'var(--gradient-red)', animationDelay: '2s' }}
    />
    <div
      className="absolute -bottom-60 -left-40 w-[460px] h-[460px] rounded-full blur-3xl opacity-25 animate-wave"
      style={{ background: 'var(--gradient-duo)', animationDelay: '4s' }}
    />
    <div
      className="absolute -bottom-52 -right-44 w-[360px] h-[360px] rounded-full blur-3xl opacity-[0.18] animate-wave"
      style={{ background: 'var(--gradient-red)', animationDelay: '1s' }}
    />

    {/* طبقة تنعيم بيضاء فوق التموجات */}
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse at center, hsl(var(--background) / 0.92) 30%, hsl(var(--background) / 0.55) 70%, transparent 100%)' }}
    />

    {/* جزيئات صغيرة */}
    {[
      { t: '12%', l: '8%', s: 8, d: 0, red: false },
      { t: '22%', l: '88%', s: 6, d: 1.2, red: true },
      { t: '38%', l: '5%', s: 5, d: 2.1, red: true },
      { t: '64%', l: '92%', s: 9, d: 0.6, red: false },
      { t: '78%', l: '12%', s: 6, d: 3, red: false },
      { t: '86%', l: '80%', s: 5, d: 1.8, red: true },
    ].map((p, i) => (
      <span
        key={i}
        className="absolute rounded-[3px] animate-particle"
        style={{
          top: p.t,
          left: p.l,
          width: p.s,
          height: p.s,
          background: p.red ? 'hsl(var(--brand-red))' : 'hsl(var(--brand-blue))',
          animationDelay: `${p.d}s`,
          opacity: 0.6,
        }}
      />
    ))}
  </div>
);

export default WaveBackground;
