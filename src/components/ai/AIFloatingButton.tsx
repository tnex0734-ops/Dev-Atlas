import React from 'react';
import { useAI } from '../../context/AIContext';
import { useProject } from '../../context/ProjectContext';
import { getRoleAIConfig } from '../../data/roleAIConfigs';

export const AIFloatingButton: React.FC = () => {
  const { openStudio, state } = useAI();
  const { activeRole } = useProject();

  const role = activeRole === 'memory' ? 'all' : activeRole;
  const config = getRoleAIConfig(role);

  if (state.isOpen) return null;

  return (
    <button
      onClick={() => openStudio(role)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#FF6039] px-5 py-3.5 text-[#161616] shadow-[0_4px_24px_rgba(255,96,57,0.35)] hover:bg-[#E54D26] hover:shadow-[0_6px_32px_rgba(255,96,57,0.45)] active:scale-[0.98] transition-all duration-200 group touch-target cursor-pointer"
      aria-label={`Open ${config.studioName}`}
    >
      <span className="relative flex items-center justify-center">
        <img
          src="/dev-ai.png"
          alt="Dev AI"
          className="w-5 h-5 object-contain transition-transform duration-200 group-hover:scale-110 drop-shadow-xs"
          style={{ width: 22, height: 22, maxWidth: 22, maxHeight: 22 }}
        />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#161616]" />
      </span>
      <span className="text-sm font-bold tracking-tight">
        Ask {config.label} AI
      </span>
    </button>
  );
};
