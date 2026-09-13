import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  glowColor = 'teal',
  delay = 0,
  ...props
}) {
  const glowStyles = {
    violet: 'glow-violet',
    emerald: 'glow-emerald',
    teal: 'glow-teal',
    sky: 'glow-sky',
    blue: 'glow-blue',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`
        rounded-xl p-5
        ${hoverEffect ? 'glassmorphic-card' : 'glassmorphic'}
        ${glow ? glowStyles[glowColor] || '' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
