import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedProgress({
  value = 0,
  max = 100,
  type = 'bar', // 'bar' or 'circle'
  size = 120, // Only for 'circle'
  strokeWidth = 8, // Only for 'circle'
  showText = true,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  // Dynamic colors depending on threshold
  const getColor = (pct) => {
    if (pct < 50) return 'text-brand-rose bg-brand-rose/10';
    if (pct < 75) return 'text-brand-amber bg-brand-amber/10';
    return 'text-brand-emerald bg-brand-emerald/10';
  };

  const getBorderColor = (pct) => {
    if (pct < 50) return 'stroke-brand-rose';
    if (pct < 75) return 'stroke-brand-amber';
    return 'stroke-brand-emerald';
  };

  const getBgBarColor = (pct) => {
    if (pct < 50) return 'bg-brand-rose';
    if (pct < 75) return 'bg-brand-amber';
    return 'bg-brand-emerald';
  };

  if (type === 'circle') {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            className="stroke-obsidian-800"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Animated score circle */}
          <motion.circle
            className={`transition-all duration-500 ease-out ${getBorderColor(percentage)}`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        {showText && (
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold font-heading text-white">{percentage}</span>
            <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Score</span>
          </div>
        )}
      </div>
    );
  }

  // Linear Progress Bar
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1.5 text-xs">
        {showText && (
          <>
            <span className="font-medium text-gray-400">Completeness</span>
            <span className={`font-semibold px-1.5 py-0.5 rounded ${getColor(percentage)}`}>
              {percentage}%
            </span>
          </>
        )}
      </div>
      <div className="h-2 w-full bg-obsidian-800 rounded-full overflow-hidden border border-white/[0.04]">
        <motion.div
          className={`h-full rounded-full ${getBgBarColor(percentage)}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
