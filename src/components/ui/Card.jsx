import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  glowColor = 'violet',
  ...props
}) {
  const glowStyles = {
    violet: 'glow-violet',
    emerald: 'glow-emerald',
  };

  return (
    <div
      className={`
        rounded-xl p-5
        ${hoverEffect ? 'glassmorphic-card' : 'glassmorphic'}
        ${glow ? glowStyles[glowColor] : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
