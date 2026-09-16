import React from 'react';

interface BrandTitleProps {
  title: string;
  className?: string;
  as?: 'h1' | 'h2' | 'span';
}

/** يلوّن اسم المنصة: الكلمة الثانية بالأحمر وبقية الكلمات بالأزرق */
const BrandTitle: React.FC<BrandTitleProps> = ({ title, className = '', as = 'h1' }) => {
  const Tag = as as React.ElementType;
  const words = (title || '').trim().split(/\s+/).filter(Boolean);

  return (
    <Tag className={`font-extrabold tracking-tight ${className}`}>
      {words.map((w, i) => (
        <span key={i} className={i === 1 ? 'text-accent' : 'text-primary'}>
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
};

export default BrandTitle;
