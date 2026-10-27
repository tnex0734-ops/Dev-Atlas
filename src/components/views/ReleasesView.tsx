import React from 'react';
import {
  Server,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const ReleasesView: React.FC = () => {
  const { releases, setActiveSection } = useProject();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Releases & Post-Deployment Sentiment Delta
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Closed-loop verification measuring whether shipping a release actually eliminated user complaints and boosted satisfaction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge label="Closed-Loop Verification Active" variant="green" dot />
        </div>
      </div>

      {/* Releases Cards */}
      <div className="space-y-6">
        {releases.map((rel) => (
          <div
            key={rel.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-6 hover:border-[#a1a1a1] transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#f2f2f2] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-base font-bold text-[#047857] bg-[#ecfdf5] px-3 py-1 rounded-[6px] border border-[#a7f3d0]">
                    {rel.version}
                  </span>
                  <StatusBadge label={rel.status} variant="green" size="sm" dot />
                  <span className="text-xs font-mono text-[#8f8f8f] flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Deployed: {rel.deployedAt}
                  </span>
                </div>

                <h3 className="mt-2.5 font-sans font-semibold text-xl text-[#171717]">
                  {rel.releaseName}
                </h3>
              </div>

              {/* Sentiment Delta Metric Tile */}
              <div className="flex items-center gap-4 rounded-[8px] bg-[#fafafa] p-4 border border-[#ebebeb] font-mono">
                <div>
                  <span className="text-[10px] text-[#8f8f8f] uppercase block">PRE-RELEASE</span>
                  <span className="text-sm font-bold text-[#4d4d4d]">{rel.preReleaseSentiment}%</span>
                </div>
                <span className="text-[#8f8f8f] text-lg">➔</span>
                <div>
                  <span className="text-[10px] text-[#8f8f8f] uppercase block">POST-RELEASE</span>
                  <span className="text-sm font-bold text-[#047857]">{rel.postReleaseSentiment}%</span>
                </div>
                <div className="border-l border-[#ebebeb] pl-3">
                  <span className="text-[10px] text-[#047857] uppercase block font-semibold">DELTA</span>
                  <span className="text-base font-bold text-[#047857] flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> +{rel.sentimentDelta}%
                  </span>
                </div>
              </div>
            </div>

            {/* Resolved Problem Clusters */}
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#ab570a] block mb-2">
                Resolved User Problem Clusters ({rel.resolvedClustersCount}):
              </span>
              <div className="space-y-2">
                {rel.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-[#171717] bg-[#fafafa] p-3 rounded-[6px] border border-[#ebebeb]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#047857] mt-0.5 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono">
              <span className="text-[#8f8f8f]">
                Continuous telemetry confirmed 84% drop in broadcast lag complaints.
              </span>
              <button
                onClick={() => setActiveSection('feedback')}
                className="text-[#0070f3] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Inspect Feedback Stream</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
