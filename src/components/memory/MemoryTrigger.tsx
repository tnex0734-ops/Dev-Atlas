import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { BrainCircuit, History } from 'lucide-react';

interface MemoryTriggerProps {
  entityType?: string;
  entityId?: string;
  eventId?: string;
  label?: string;
  variant?: 'button' | 'compact' | 'badge' | 'ghost';
  className?: string;
}

export const MemoryTrigger: React.FC<MemoryTriggerProps> = ({
  entityType,
  entityId,
  eventId,
  label = 'Why this changed',
  variant = 'button',
  className = '',
}) => {
  const { openMemoryDrawer, getMemoryForEntity } = useProject();

  const memoryCount = entityType && entityId ? getMemoryForEntity(entityType, entityId).length : 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openMemoryDrawer({ eventId, entityType, entityId });
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        title="View Change Rationale & Memory Chain"
        className={`inline-flex items-center gap-1 rounded-[5px] border border-[#e4e4e7] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#52525b] hover:border-[#171717] hover:text-[#171717] hover:bg-[#fafafa] transition-all ${className}`}
      >
        <BrainCircuit className="w-3 h-3 text-[#c2410c]" />
        <span>Memory</span>
        {memoryCount > 0 && (
          <span className="ml-0.5 rounded-full bg-[#f4f4f5] px-1 text-[9px] font-semibold text-[#171717]">
            {memoryCount}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50/70 px-2 py-0.5 text-[10px] font-mono font-medium text-amber-900 hover:bg-amber-100 hover:border-amber-300 transition-all ${className}`}
      >
        <History className="w-3 h-3 text-amber-700" />
        <span>Why?</span>
      </button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 text-xs text-[#71717a] hover:text-[#171717] font-medium transition-colors ${className}`}
      >
        <BrainCircuit className="w-3.5 h-3.5 text-[#c2410c]" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="View Decision & Change Rationale"
      className={`inline-flex items-center gap-1.5 rounded-[6px] border border-[#e4e4e7] bg-white px-2.5 py-1 text-xs font-medium text-[#171717] hover:border-[#171717] hover:bg-[#fafafa] transition-all shadow-2xs ${className}`}
    >
      <BrainCircuit className="w-3.5 h-3.5 text-[#c2410c]" />
      <span>{label}</span>
      {memoryCount > 0 && (
        <span className="ml-0.5 rounded-full bg-[#f4f4f5] border border-[#e4e4e7] px-1.5 py-0.2 text-[10px] font-mono text-[#52525b]">
          {memoryCount}
        </span>
      )}
    </button>
  );
};
