import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal — content animates in when it scrolls into the viewport.
 *
 * @param {'fade'|'slide-up'|'slide-left'|'scale'|'pop'} variant
 * @param {number} delay   — seconds before animation starts (for staggering siblings)
 * @param {number} duration — animation duration in seconds
 * @param {boolean} once   — if true, animates only the first time it enters view
 * @param {number} amount  — fraction of the element that must be visible (0–1)
 */

const presets = {
  'fade': {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-up': {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  'slide-right': {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  'scale': {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  'pop': {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
};

export default function ScrollReveal({
  children,
  variant = 'slide-up',
  delay = 0,
  duration = 0.5,
  once = true,
  amount = 0.15,
  className = '',
  ...props
}) {
  const preset = presets[variant] || presets['slide-up'];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: preset.hidden,
        visible: {
          ...preset.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer — a parent container that staggers children animations on scroll.
 * Each direct child should be wrapped in a `<motion.div variants={...}>` or use
 * the provided `staggerItem` export.
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  once = true,
  amount = 0.1,
  className = '',
  ...props
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem — a child to use inside StaggerContainer.
 * Animates with a pop/slide-up effect as the parent staggers.
 */
export function StaggerItem({
  children,
  className = '',
  variant = 'slide-up',
  ...props
}) {
  const preset = presets[variant] || presets['slide-up'];

  return (
    <motion.div
      variants={{
        hidden: preset.hidden,
        visible: {
          ...preset.visible,
          transition: {
            duration: 0.45,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
