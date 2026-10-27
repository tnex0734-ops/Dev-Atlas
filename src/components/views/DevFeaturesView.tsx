import React from 'react';
import {
  GitBranch,
  GitPullRequest,
  GitCommit,
  User,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const DevFeaturesView: React.FC = () => {
  const { sprintFeatures, setActiveSection } = useProject();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Sprint Features & Pull Request Tracker
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Active Git branches, PR review statuses, commit activity, and linked engineering tasks.
          </p>
        </div>
      </div>

      {/* PR Cards Grid */}
      <div className="space-y-4">
        {sprintFeatures.map((feat) => {
          const prStatusVariants = {
            Open: 'amber',
            Draft: 'neutral',
            Merged: 'green',
          } as const;

          return (
            <div
              key={feat.id}
              className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-4 hover:border-[#a1a1a1] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f2f2f2] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                    <GitPullRequest className="h-5 w-5 text-[#0070f3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#0070f3]">
                        PR #{feat.prNumber}
                      </span>
                      <StatusBadge label={feat.prStatus} variant={prStatusVariants[feat.prStatus]} size="sm" dot />
                    </div>
                    <h3 className="mt-1 font-sans font-semibold text-lg text-[#171717]">
                      {feat.title}
                    </h3>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-[#8f8f8f]">
                  <span>Author: </span>
                  <strong className="text-[#171717]">{feat.author}</strong>
                </div>
              </div>

              {/* Branch and Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-between">
                  <span className="text-[#8f8f8f]">Git Branch:</span>
                  <span className="text-[#171717] font-semibold">{feat.branchName}</span>
                </div>
                <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-between">
                  <span className="text-[#8f8f8f]">Commit Count:</span>
                  <span className="text-[#ab570a] font-semibold flex items-center gap-1">
                    <GitCommit className="h-3.5 w-3.5" /> {feat.commitCount} commits
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-[#8f8f8f]">Branch Readiness & Tests</span>
                  <span className="font-bold text-[#171717]">{feat.progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#ebebeb] overflow-hidden">
                  <div
                    className="h-full bg-[#171717] rounded-full"
                    style={{ width: `${feat.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Linked Dev Tasks */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-[#8f8f8f]">Linked Tasks:</span>
                  {feat.linkedDevTasks.map((code) => (
                    <span
                      key={code}
                      onClick={() => setActiveSection('tasks')}
                      className="cursor-pointer font-semibold text-[#0070f3] hover:underline"
                    >
                      {code}
                    </span>
                  ))}
                </div>
                <span className="text-[#047857] font-medium">Continuous Integration Passing</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
