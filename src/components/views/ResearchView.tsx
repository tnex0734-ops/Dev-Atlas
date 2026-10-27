import React from 'react';
import {
  Eye,
  AlertCircle,
  Quote,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const ResearchView: React.FC = () => {
  const { uxFindings, setActiveSection } = useProject();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#ee0000]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              UX Usability Findings & Evidence
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Validated design friction points backed by verbatim user quotes, participant counts, and recommended token interventions.
          </p>
        </div>

        <button
          onClick={() => setActiveSection('validation')}
          className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
        >
          <span>Verify in Validation Studio</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Findings List */}
      <div className="space-y-6">
        {uxFindings.map((finding) => {
          const severityVariants = {
            'Critical Blocker': 'red',
            'High Friction': 'amber',
            'Minor Annoyance': 'neutral',
          } as const;

          return (
            <div
              key={finding.id}
              className="rounded-[12px] border border-[#ebebeb] bg-white p-6 sm:p-7 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] hover:border-[#a1a1a1] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f2f2f2] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                      {finding.findingCode}
                    </span>
                    <StatusBadge label={finding.severity} variant={severityVariants[finding.severity]} size="sm" dot />
                    <span className="text-xs font-mono text-[#8f8f8f]">
                      Flow: {finding.affectedFlow}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-sans font-semibold text-lg sm:text-xl text-[#171717]">
                    {finding.title}
                  </h3>
                </div>

                <span className="font-mono text-xs text-[#8f8f8f] bg-[#fafafa] px-3 py-1.5 rounded-[6px] border border-[#ebebeb] shrink-0 self-start sm:self-auto">
                  Observed in {finding.participantCount} participants
                </span>
              </div>

              {/* Quote */}
              <div className="mt-4 rounded-[8px] bg-[#fafafa] p-4 border border-[#ebebeb] flex items-start gap-3">
                <Quote className="h-4 w-4 text-[#ab570a] mt-0.5 shrink-0" />
                <p className="text-xs sm:text-sm italic text-[#4d4d4d] leading-relaxed">
                  "{finding.evidenceQuote}"
                </p>
              </div>

              {/* Recommended Fix */}
              <div className="mt-4 p-4 rounded-[8px] bg-[#ecfdf5] border border-[#a7f3d0]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#047857] font-semibold block mb-1">
                  Design System Intervention:
                </span>
                <p className="text-xs sm:text-sm text-[#065f46] font-medium">
                  {finding.recommendedFix}
                </p>
              </div>

              {/* Footer */}
              {finding.linkedPRD && (
                <div className="mt-5 pt-3 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8f8f8f]">Linked Specification:</span>
                  <button
                    onClick={() => setActiveSection('requirements')}
                    className="text-[#0070f3] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>{finding.linkedPRD}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
