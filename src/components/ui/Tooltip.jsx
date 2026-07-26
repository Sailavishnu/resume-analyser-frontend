import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tooltip({
  children,
  content,
  position = 'top', // 'top', 'bottom', 'left', 'right'
  className = '',
}) {
  const [show, setShow] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className={`
              absolute z-50 px-2 py-1 text-[11px] font-medium text-gray-200 bg-obsidian-800
              border border-white/[0.08] rounded shadow-md whitespace-nowrap pointer-events-none
              ${positionStyles[position]}
            `}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
