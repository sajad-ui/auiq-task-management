import React from 'react';

interface AlAyenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'badge' | 'plain';
}

export const AlAyenLogo: React.FC<AlAyenLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'badge',
}) => {
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const imageElement = (
    <img
      src="/assets/alayen_logo.png"
      alt="شعار جامعة العين العراقية - Al-Ayen Iraqi University"
      className={`${sizeClasses[size]} w-auto object-contain select-none`}
    />
  );

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {variant === 'badge' ? (
        <div className="bg-white rounded-xl p-1.5 shadow-sm border border-slate-200/20 flex items-center justify-center shrink-0">
          {imageElement}
        </div>
      ) : (
        imageElement
      )}

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2">
            <span className="font-black tracking-tight text-base sm:text-lg leading-tight text-white">
              جامعة العين العراقية
            </span>
          </div>
          <span className="text-[11px] font-bold tracking-wide text-amber-400">
            مكتب رئيس الجامعة · ALAYEN IRAQI UNIVERSITY
          </span>
        </div>
      )}
    </div>
  );
};
