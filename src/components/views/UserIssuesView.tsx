import React from 'react';
import {
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  Sparkles,
  Link,
  Layers,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProblemCluster } from '../../types';

export const UserIssuesView: React.FC = () => {
  const { problemClusters, promoteClusterToPRD, setActiveSection } = useProject();

  const handlePromote = (cluster: ProblemCluster) => {
    promoteClusterToPRD(cluster.id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#ee0000]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              AI Problem Clusters & Pipeline Triage
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Algorithmic clustering consolidating 1,000+ app store reviews and telemetry spikes into actionable engineering initiatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge label="AI Semantic Grouping Engine Active" variant="neutral" dot />
        </div>
      </div>

      {/* Problem Clusters List */}
      <div className="space-y-6">
        {problemClusters.map((cluster) => {
          const isCritical = cluster.severity === 'critical';
          const isPromoted = cluster.status === 'promoted' || cluster.status === 'in-dev';

          return (
            <div
              key={cluster.id}
              className={`rounded-[12px] border bg-white p-6 sm:p-7 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] transition-all ${
                isCritical
                  ? 'border-[#fca5a5]'
                  : 'border-[#ebebeb] hover:border-[#a1a1a1]'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#f2f2f2] pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <StatusBadge
                      label={`${cluster.severity.toUpperCase()} PRIORITY`}
                      variant={cluster.severity === 'critical' ? 'red' : cluster.severity === 'high' ? 'amber' : 'neutral'}
                      dot={cluster.severity === 'critical'}
                    />
                    <span className="font-mono text-xs text-[#171717] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb] font-medium">
                      {cluster.userCount.toLocaleString()} Users Affected
                    </span>
                    <span className="text-xs font-mono text-[#8f8f8f]">
                      {cluster.platform} • {cluster.productArea}
                    </span>
                  </div>

                  <h3 className="mt-2.5 font-sans font-semibold text-xl text-[#171717]">
                    {cluster.title}
                  </h3>
                </div>

                {/* Promotion Action */}
                <div className="flex items-center gap-3">
                  {isPromoted ? (
                    <div className="flex items-center gap-2 rounded-[6px] bg-[#ecfdf5] border border-[#a7f3d0] px-3 py-1.5 text-xs font-mono font-medium text-[#047857]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Promoted to PRD & Task</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePromote(cluster)}
                      className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
                    >
                      <Sparkles className="h-4 w-4 text-[#f5a623]" />
                      <span>Promote to PRD Requirement</span>
                    </button>
                  )}
                </div>
              </div>

              {/* AI Diagnostic Synthesis */}
              <div className="mt-5 space-y-4">
                <div className="rounded-[8px] border border-[#ebebeb] bg-[#fafafa] p-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#ab570a] mb-1.5">
                    <BrainCircuit className="h-4 w-4" />
                    <span>AI Cluster Synthesis</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
                    {cluster.aiSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-[8px] bg-[#fafafa] border border-[#ebebeb] space-y-1">
                    <span className="text-[#8f8f8f] text-[11px] block font-semibold">LIKELY ROOT CAUSE</span>
                    <p className="text-[#171717] font-sans text-xs leading-normal">
                      {cluster.aiInsight.likelyCause}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-[8px] bg-[#fafafa] border border-[#ebebeb] space-y-1">
                    <span className="text-[#047857] text-[11px] block font-semibold">RECOMMENDED MITIGATION</span>
                    <p className="text-[#171717] font-sans text-xs leading-normal">
                      {cluster.aiInsight.recommendedAction}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-[6px] bg-[#fef2f2] border border-[#fecaca] text-xs font-mono flex items-center justify-between text-[#ee0000]">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#ee0000]" />
                    <span>Velocity Alert: {cluster.trend}</span>
                  </div>
                  <span className="text-[#8f8f8f]">{cluster.aiInsight.velocityNote}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-mono text-[#8f8f8f]">
                <div>
                  Cluster Owner: <span className="text-[#171717] font-medium">{cluster.owner}</span> • Latest: {cluster.latestOccurrence}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveSection('feedback')}
                    className="hover:text-[#171717] text-[#8f8f8f] transition-colors"
                  >
                    Inspect Raw Reviews
                  </button>
                  <button
                    onClick={() => setActiveSection('requirements')}
                    className="flex items-center gap-1 text-[#0070f3] hover:underline font-semibold"
                  >
                    <span>View PRD Hub</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
