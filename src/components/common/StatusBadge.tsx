import React from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  Clock,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  label: string;
  variant?: 'orange' | 'dark' | 'terracotta' | 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  icon?: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  dot = true,
  icon,
}) => {
  const variantStyles = {
    orange: 'bg-[#FFF0EC] text-[#E54D26] border-[#FFD6CC] font-semibold',
    dark: 'bg-[#18181b] text-white border-[#27272a] font-medium',
    terracotta: 'bg-[#18181b] text-white border-[#18181b] font-medium',
    amber: 'bg-amber-50 text-amber-800 border-amber-200/80 font-medium',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 font-medium',
    red: 'bg-rose-50 text-rose-700 border-rose-200/80 font-medium',
    blue: 'bg-sky-50 text-sky-700 border-sky-200/80 font-medium',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80 font-medium',
    neutral: 'bg-zinc-100 text-zinc-700 border-zinc-200 font-medium',
  };

  const dotColors = {
    orange: 'bg-[#FF6039]',
    dark: 'bg-[#FF6039]',
    terracotta: 'bg-[#FF6039]',
    amber: 'bg-amber-500',
    green: 'bg-emerald-500',
    red: 'bg-rose-500',
    blue: 'bg-sky-500',
    purple: 'bg-purple-500',
    neutral: 'bg-zinc-400',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.5 text-xs',
  };

  const iconSizeClass = size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5';

  // Contextual icon based on label to fulfill Section 21: ICON + LABEL + COLOR
  const renderStatusIcon = () => {
    if (icon) return icon;

    const lower = label.toLowerCase();
    if (lower.includes('done') || lower.includes('passed') || lower.includes('completed') || lower.includes('resolved') || lower.includes('approved')) {
      return <CheckCircle2 className={`${iconSizeClass} shrink-0 text-emerald-600`} aria-hidden="true" />;
    }
    if (lower.includes('blocked') || lower.includes('critical') || lower.includes('failed') || lower.includes('failing') || lower === 'p0') {
      return <AlertOctagon className={`${iconSizeClass} shrink-0 text-rose-600`} aria-hidden="true" />;
    }
    if (lower.includes('in-progress') || lower.includes('in progress') || lower.includes('investigating') || lower.includes('running') || lower.includes('building')) {
      return <Clock className={`${iconSizeClass} shrink-0 text-amber-600`} aria-hidden="true" />;
    }
    if (lower.includes('action required') || lower.includes('warning') || lower.includes('at risk') || lower === 'p1') {
      return <AlertTriangle className={`${iconSizeClass} shrink-0 text-amber-600`} aria-hidden="true" />;
    }

    if (dot) {
      return <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} aria-hidden="true" />;
    }

    return null;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans rounded-full border shadow-2xs transition-all ${
        variantStyles[variant]
      } ${sizeStyles[size]}`}
    >
      {renderStatusIcon()}
      <span className="capitalize">{label}</span>
    </span>
  );
};

