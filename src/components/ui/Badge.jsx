import React from 'react';

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full border';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const variantStyles = {
    neutral: 'bg-obsidian-800 text-gray-300 border-white/[0.06]',
    primary: 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/25',
    blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/25', // Blue accent matching foundation
    success: 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/25',
    warning: 'bg-brand-amber/10 text-brand-amber border-brand-amber/25',
    danger: 'bg-brand-rose/10 text-brand-rose border-brand-rose/25',
    info: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/25',
  };

  // Quick fallback just in case theme variables are mapped slightly differently
  const styleVariant = variant === 'primary' ? 'primary' : variant;

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[styleVariant] || variantStyles.neutral} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
