import React from 'react';
import { MemoryState } from '../../types';
import { CheckCircle2, AlertCircle, RefreshCw, Archive, Clock, XCircle, ShieldAlert, HelpCircle } from 'lucide-react';

interface MemoryStateBadgeProps {
  state: MemoryState;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MemoryStateBadge: React.FC<MemoryStateBadgeProps> = ({
  state,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2 py-0.5 text-[11px] gap-1.5',
    lg: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
  };

  const getBadgeConfig = () => {
    switch (state) {
      case 'active':
        return {
          label: 'Active Decision',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />,
          styles: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        };
      case 'validated':
        return {
          label: 'Validated in Prod',
          icon: <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />,
          styles: 'bg-blue-50 text-blue-800 border-blue-200/80',
        };
      case 'superseded':
        return {
          label: 'Superseded',
          icon: <RefreshCw className="w-3 h-3 text-purple-600 shrink-0" />,
          styles: 'bg-purple-50 text-purple-800 border-purple-200/80',
        };
      case 'proposed':
        return {
          label: 'Proposed / Planned',
          icon: <Clock className="w-3 h-3 text-amber-600 shrink-0" />,
          styles: 'bg-amber-50 text-amber-800 border-amber-200/80',
        };
      case 'rolled-back':
        return {
          label: 'Rolled Back',
          icon: <AlertCircle className="w-3 h-3 text-red-600 shrink-0" />,
          styles: 'bg-red-50 text-red-800 border-red-200/80',
        };
      case 'deprecated':
        return {
          label: 'Deprecated',
          icon: <Archive className="w-3 h-3 text-neutral-500 shrink-0" />,
          styles: 'bg-neutral-100 text-neutral-700 border-neutral-300',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: <XCircle className="w-3 h-3 text-red-500 shrink-0" />,
          styles: 'bg-red-50 text-red-700 border-red-200',
        };
      case 'blocked':
        return {
          label: 'Blocked',
          icon: <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />,
          styles: 'bg-rose-50 text-rose-800 border-rose-200',
        };
      default:
        return {
          label: 'Current State Unknown',
          icon: <HelpCircle className="w-3 h-3 text-neutral-400 shrink-0" />,
          styles: 'bg-neutral-50 text-neutral-600 border-neutral-200',
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-medium tracking-tight ${sizeClasses[size]} ${config.styles} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
