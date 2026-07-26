import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'An error occurred',
  description = 'We encountered an error loading this resource. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-brand-rose/20 rounded-xl bg-brand-rose/5 ${className}`}>
      <div className="p-4 bg-brand-rose/10 rounded-full text-brand-rose mb-4 border border-brand-rose/25 animate-pulse">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-white font-heading mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-300 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
