import React from 'react';
import {
  Users,
  AlertCircle,
  Zap,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

export const UserPatternsView: React.FC = () => {
  const { personas } = useProject();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              User Personas & Behavioral Archetypes
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Validated behavioral models representing our primary user cohorts, trigger scenarios, and UX design treatments.
          </p>
        </div>
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 sm:p-7 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all"
          >
            <div>
              <div className="flex items-start justify-between border-b border-[#f2f2f2] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] text-2xl">
                    {persona.avatarIcon}
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-lg sm:text-xl text-[#171717]">
                      {persona.name}
                    </h3>
                    <p className="text-xs text-[#4d4d4d]">{persona.tagline}</p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-lg font-bold text-[#171717]">
                    {persona.prevalencePercentage}%
                  </span>
                  <span className="block text-[10px] text-[#8f8f8f] uppercase">Prevalence</span>
                </div>
              </div>

              {/* Frustrations */}
              <div className="mt-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#ee0000] font-semibold block mb-2">
                  Primary Frustrations & Drop-off Triggers:
                </span>
                <div className="space-y-1.5">
                  {persona.primaryFrustrations.map((frust, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#4d4d4d] bg-[#fef2f2] p-2 rounded-[6px] border border-[#fecaca]"
                    >
                      <span className="text-[#ee0000] font-bold">•</span>
                      <span>{frust}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Treatments */}
              <div className="mt-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#047857] font-semibold block mb-2">
                  Tailored Design Treatments:
                </span>
                <div className="space-y-1.5">
                  {persona.designTreatments.map((treat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#065f46] bg-[#ecfdf5] p-2 rounded-[6px] border border-[#a7f3d0]"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-[#047857] shrink-0 mt-0.5" />
                      <span>{treat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Triggers footer */}
            <div className="mt-6 pt-4 border-t border-[#f2f2f2] flex items-center justify-between text-[11px] font-mono text-[#8f8f8f]">
              <span>Triggers: {persona.triggerScenarios.join(' • ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
