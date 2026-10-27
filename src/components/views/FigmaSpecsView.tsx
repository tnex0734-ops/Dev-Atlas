import React from 'react';
import {
  Sparkles,
  ExternalLink,
  Code,
  Layers,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const FigmaSpecsView: React.FC = () => {
  const { figmaSpecs, setActiveSection } = useProject();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Figma Frame Specs Inspector
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Exact bounding dimensions, responsive safe-area constraints, and component variant rules synced from master Figma files.
          </p>
        </div>

        <button
          onClick={() => setActiveSection('validation')}
          className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
        >
          <span>Open Validation Studio</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {figmaSpecs.map((spec) => (
          <div
            key={spec.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-5 hover:border-[#a1a1a1] transition-all"
          >
            <div className="flex items-start justify-between border-b border-[#f2f2f2] pb-4">
              <div>
                <span className="font-mono text-xs text-[#0070f3] font-medium">
                  Node: {spec.nodeId}
                </span>
                <h3 className="mt-1 font-sans font-semibold text-lg text-[#171717]">
                  {spec.frameName}
                </h3>
                <p className="text-xs text-[#8f8f8f] font-mono">Component: {spec.componentName}</p>
              </div>
              <span className="text-[11px] font-mono text-[#8f8f8f]">
                Synced: {spec.lastSynced}
              </span>
            </div>

            {/* Spec Attributes */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[#8f8f8f] text-[10px] block font-semibold">BOUNDS / DIMENSIONS</span>
                <span className="text-[#171717]">{spec.specs.dimensions}</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[#8f8f8f] text-[10px] block font-semibold">PADDING & INSETS</span>
                <span className="text-[#171717]">{spec.specs.padding}</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[#8f8f8f] text-[10px] block font-semibold">CORNER RADII</span>
                <span className="text-[#171717]">{spec.specs.radius}</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[#8f8f8f] text-[10px] block font-semibold">TYPOGRAPHY TOKEN</span>
                <span className="text-[#171717]">{spec.specs.typographyToken}</span>
              </div>
            </div>

            {/* Dev Notes */}
            <div className="rounded-[6px] bg-[#fafafa] p-3.5 border border-[#ebebeb] text-xs">
              <span className="font-mono text-[10px] uppercase font-semibold text-[#ab570a] block mb-1">
                Implementation Notes for Frontend:
              </span>
              <p className="text-[#4d4d4d]">{spec.devNotes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
