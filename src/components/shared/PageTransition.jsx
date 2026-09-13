import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * Wraps page content with a smooth fade+slide animation.
 * Uses `location.pathname` as the animation key so the
 * transition fires on every route change.
 */
export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1], // custom easeOutQuart
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
