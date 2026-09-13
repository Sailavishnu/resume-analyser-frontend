import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[40vh]">
      <div className="relative">
        {/* Outer ring */}
        <div className="h-12 w-12 rounded-full border-[2.5px] border-transparent border-t-brand-blue border-r-brand-violet animate-spin" />
        {/* Inner glow pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-gradient-to-br from-brand-blue to-brand-violet opacity-60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
