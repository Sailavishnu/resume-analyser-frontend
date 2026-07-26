import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm, md, lg, xl
  footerActions,
  className = '',
}) {
  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`
              relative w-full ${sizeClasses[size]}
              bg-obsidian-850 border border-white/[0.08] rounded-xl shadow-2xl z-10
              overflow-hidden flex flex-col max-h-[85vh]
              ${className}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-base font-semibold text-white font-heading">
                {title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="!p-1 text-gray-400 hover:text-white rounded-md transition-colors"
                aria-label="Close modal"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 text-sm text-gray-300">
              {children}
            </div>

            {/* Footer */}
            {footerActions && (
              <div className="flex justify-end gap-3 px-6 py-4 bg-obsidian-900 border-t border-white/[0.06]">
                {footerActions}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
