import React from 'react';

const PageIndicators: React.FC<{ count?: number; active?: number }> = ({ count = 3, active = 0 }) => (
  <div className="flex items-center justify-center gap-2" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        className={`h-2.5 rounded-full transition-all duration-500 ${
          i === active ? 'w-7 bg-primary' : 'w-2.5 bg-primary/25'
        }`}
      />
    ))}
  </div>
);

export default PageIndicators;
