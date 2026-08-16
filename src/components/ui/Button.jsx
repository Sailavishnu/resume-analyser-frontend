import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-obsidian-950 focus:ring-brand-indigo disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-brand-indigo to-brand-violet hover:from-brand-indigo/90 hover:to-brand-violet/90 text-white shadow-md shadow-brand-indigo/10 border border-brand-indigo/20',
    secondary: 'glassmorphic hover:border-brand-indigo/30 text-[var(--text-secondary)] border',
    outline: 'bg-transparent border text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.06)]',
    ghost: 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.06)]',
    danger: 'bg-gradient-to-r from-brand-rose to-rose-700 hover:from-brand-rose/90 hover:to-rose-700/90 text-white border border-brand-rose/20',
    teal: 'bg-gradient-to-r from-brand-teal to-brand-emerald hover:from-brand-teal/90 hover:to-brand-emerald/90 text-white border border-brand-teal/20',
  };

  return (
    <motion.button
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && Icon && <Icon className="h-4 w-4" />}
      {children}
    </motion.button>
  );
}
