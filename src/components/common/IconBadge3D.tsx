import React from 'react';

export interface IconBadge3DProps {
  icon: React.ReactNode;
  color?: 'orange' | 'emerald' | 'blue' | 'purple' | 'amber' | 'dark' | 'rose';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const IconBadge3D: React.FC<IconBadge3DProps> = ({
  icon,
  color = 'orange',
  size = 'md',
  className = '',
}) => {
  const colorStyles = {
    orange: 'bg-[#FF6039] shadow-[0_4px_12px_rgba(255,96,57,0.25)] text-white',
    emerald: 'bg-[#10B981] shadow-[0_4px_12px_rgba(16,185,129,0.25)] text-white',
    blue: 'bg-[#0284C7] shadow-[0_4px_12px_rgba(2,132,199,0.25)] text-white',
    purple: 'bg-[#7C3AED] shadow-[0_4px_12px_rgba(124,58,237,0.25)] text-white',
    amber: 'bg-[#F59E0B] shadow-[0_4px_12px_rgba(245,158,11,0.25)] text-white',
    dark: 'bg-[#18181B] shadow-[0_4px_12px_rgba(0,0,0,0.20)] text-white',
    rose: 'bg-[#E11D48] shadow-[0_4px_12px_rgba(225,29,72,0.25)] text-white',
  };

  const sizeStyles = {
    sm: 'h-7 w-7 rounded-[8px]',
    md: 'h-9 w-9 rounded-[10px]',
    lg: 'h-11 w-11 rounded-[12px]',
    xl: 'h-14 w-14 rounded-[16px]',
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 border border-white/20 transition-transform duration-200 group-hover:scale-105 ${sizeStyles[size]} ${colorStyles[color]} ${className}`}
    >
      <div className="relative z-10 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};
