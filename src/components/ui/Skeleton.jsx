import React from 'react';

export default function Skeleton({
  variant = 'text', // 'text', 'avatar', 'rect', 'card'
  className = '',
}) {
  const baseStyles = 'bg-obsidian-850 animate-pulse rounded border border-white/[0.03]';

  const variantStyles = {
    text: 'h-4 w-full my-1.5',
    avatar: 'h-10 w-10 rounded-full',
    rect: 'h-24 w-full',
    card: 'h-48 w-full rounded-xl',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    />
  );
}
