import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There is currently nothing to show here.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/[0.08] rounded-xl bg-obsidian-900/30 ${className}`}>
      <div className="p-4 bg-obsidian-800 rounded-full text-gray-500 mb-4 border border-white/[0.04]">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-white font-heading mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
