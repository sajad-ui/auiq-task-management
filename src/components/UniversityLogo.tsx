import React from 'react';
import { AlAyenLogo } from './AlAyenLogo';
import { MinistryLogo } from './MinistryLogo';

interface UniversityLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'badge' | 'plain';
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'badge',
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* 1. Official Iraqi Ministry Emblem */}
      <MinistryLogo
        size={size === 'lg' ? 'md' : size === 'sm' ? 'sm' : 'md'}
        variant={variant}
      />

      {/* Elegant Divider */}
      <div className={`h-8 w-px ${variant === 'badge' ? 'bg-slate-700/80' : 'bg-slate-300'}`} />

      {/* 2. Official Al-Ayen Iraqi University Logo (new_logo.png) */}
      <AlAyenLogo
        size={size}
        showText={showText}
        variant={variant}
      />
    </div>
  );
};
