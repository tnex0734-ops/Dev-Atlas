import React, { useState } from 'react';
import {
  Milestone,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Target,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { RoadmapEpic } from '../../types';

export const RoadmapView: React.FC = () => {
  const { roadmap, setActiveSection } = useProject();
  const [selectedQuarter, setSelectedQuarter] = useState<'All' | 'Q3 2026' | 'Q4 2026' | 'Q1 2027'>('All');

  const quarters = ['All', 'Q3 2026', 'Q4 2026', 'Q1 2027'] as const;

  const filteredRoadmap = roadmap.filter(
    (epic) => selectedQuarter === 'All' || epic.quarter === selectedQuarter
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Milestone className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Strategic Product Roadmap
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Multi-quarter release epics, deliverables, priority tiers, and cross-functional commitments.
          </p>
        </div>

        {/* Quarter Filter Pills */}
        <div className="flex items-center rounded-full bg-[#f5f5f5] p-1 border border-[#ebebeb]">
          {quarters.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuarter(q)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedQuarter === q
                  ? 'bg-[#171717] text-white font-medium shadow-sm'
                  : 'text-[#8f8f8f] hover:text-[#171717]'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Epics Timeline Cards */}
      <div className="space-y-6">
        {filteredRoadmap.map((epic) => {
          const statusVariants = {
            'On Track': 'green',
            'At Risk': 'red',
            'Completed': 'blue',
            'Upcoming': 'neutral',
          } as const;

          return (
            <div
              key={epic.id}
              className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-[#a1a1a1]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#f2f2f2] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2.5 py-0.5 rounded-[4px] border border-[#ebebeb]">
                      {epic.quarter}
                    </span>
                    <StatusBadge label={epic.priority} variant={epic.priority === 'P0' ? 'red' : 'amber'} size="sm" />
                    <StatusBadge label={epic.status} variant={statusVariants[epic.status]} size="sm" dot />
                  </div>
                  <h3 className="mt-2 font-sans font-semibold text-xl text-[#171717]">
                    {epic.title}
                  </h3>
                </div>

                {/* Progress bar */}
                <div className="min-w-[200px] text-right">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#8f8f8f]">Epic Completion</span>
                    <span className="font-bold text-[#171717]">{epic.completionPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#ebebeb] overflow-hidden">
                    <div
                      className="h-full bg-[#171717] rounded-full transition-all duration-500"
                      style={{ width: `${epic.completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
                  {epic.summary}
                </p>
              </div>

              {/* Key Deliverables */}
              <div className="mt-5">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#8f8f8f] block mb-2">
                  Key Milestones & Deliverables:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {epic.deliverables.map((del, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-[6px] bg-[#fafafa] p-3 border border-[#ebebeb] text-xs text-[#171717]"
                    >
                      <Target className="h-4 w-4 text-[#0070f3] shrink-0" />
                      <span className="truncate">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-4 border-t border-[#f2f2f2] flex items-center justify-between text-xs">
                <span className="text-[#8f8f8f] font-mono">
                  Epic Owner: <span className="text-[#171717] font-semibold">{epic.owner}</span>
                </span>
                <button
                  onClick={() => setActiveSection('requirements')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0070f3] hover:underline font-mono"
                >
                  <span>View Linked PRDs</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
