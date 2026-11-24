import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md transition-all">
      <div className="relative flex flex-col items-center p-8 text-center max-w-sm mx-auto">
        {/* Animated Brand Loader GIF */}
        <div className="relative w-44 h-44 mb-4 drop-shadow-xl">
          <Image
            src="/yetzo_loading.gif"
            alt="Yetzo Loading"
            width={176}
            height={176}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Pulsing Loading Message */}
        <div className="space-y-1.5 animate-pulse">
          <h3 className="text-base font-bold font-heading text-slate-900 tracking-tight">
            Connecting to Yetzo 15-Min Dispatch...
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Finding verified nearby cleaners, cooks & professionals
          </p>
        </div>

        {/* Progress Bar Accent */}
        <div className="w-36 h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
