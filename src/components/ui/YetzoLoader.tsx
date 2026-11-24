'use client';

import React from 'react';
import Image from 'next/image';

interface YetzoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'full';
  variant?: 'loader' | 'radar' | 'success' | 'serviceProgress' | 'coin' | 'emptyZone' | 'kycScan';
  text?: string;
  subtext?: string;
  overlay?: boolean;
}

export function YetzoLoader({
  size = 'md',
  variant = 'loader',
  text = 'Loading Yetzo Services...',
  subtext = 'Fast 15-minute home dispatch',
  overlay = false,
}: YetzoLoaderProps) {
  const sizeClasses = {
    sm: { box: 'w-24 h-24', img: 96, title: 'text-xs', sub: 'text-[10px]' },
    md: { box: 'w-36 h-36', img: 144, title: 'text-sm', sub: 'text-xs' },
    lg: { box: 'w-48 h-48', img: 192, title: 'text-base', sub: 'text-xs' },
    full: { box: 'w-56 h-56', img: 224, title: 'text-lg', sub: 'text-sm' },
  }[size];

  const gifSrc = {
    loader: '/yetzo_loading.gif',
    radar: '/radar_searching.gif',
    success: '/success.gif',
    serviceProgress: '/service_progress.gif',
    coin: '/yetzo_coin.gif',
    emptyZone: '/empty_zone.gif',
    kycScan: '/kyc_scan.gif',
  }[variant];

  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      <div className={`relative ${sizeClasses.box} drop-shadow-md mb-3`}>
        <Image
          src={gifSrc}
          alt={`Yetzo ${variant}`}
          width={sizeClasses.img}
          height={sizeClasses.img}
          className="w-full h-full object-contain"
          priority
          unoptimized
        />
      </div>
      {text && (
        <h4 className={`${sizeClasses.title} font-bold font-heading text-slate-900 tracking-tight`}>
          {text}
        </h4>
      )}
      {subtext && (
        <p className={`${sizeClasses.sub} text-slate-500 font-medium mt-1`}>
          {subtext}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-md transition-opacity">
        <div className="bg-white/95 rounded-2xl shadow-2xl border border-slate-100 p-4 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
export default YetzoLoader;
