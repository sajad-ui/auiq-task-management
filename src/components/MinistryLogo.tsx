import React from 'react';

interface MinistryLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'badge' | 'plain';
}

export const MinistryLogo: React.FC<MinistryLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  variant = 'badge',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const imageElement = (
    <img
      src="/assets/ministry_logo.svg"
      alt="شعار وزارة التعليم العالي والبحث العلمي - جمهورية العراق"
      className={`${sizeClasses[size]} object-contain select-none shrink-0`}
    />
  );

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {variant === 'badge' ? (
        <div className="bg-white rounded-xl p-1.5 shadow-sm border border-slate-200/20 flex items-center justify-center shrink-0">
          {imageElement}
        </div>
      ) : (
        imageElement
      )}

      {showText && (
        <div className="flex flex-col text-right">
          <span className="font-bold text-xs leading-tight text-slate-200">
            وزارة التعليم العالي والبحث العلمي
          </span>
          <span className="text-[10px] text-amber-500 font-medium">
            جمهورية العراق
          </span>
        </div>
      )}
    </div>
  );
};
