import React from 'react';
import {
  Flame,
  ThumbsUp,
  Plus,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const FeatureRequestsView: React.FC = () => {
  const { featureRequests, upvoteFeatureRequest, setActiveSection } = useProject();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Feature Requests Leaderboard
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Community-upvoted capabilities and creator wishlist items ranked by user demand and target release quarters.
          </p>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="space-y-4">
        {featureRequests.map((req, idx) => {
          const statusVariants = {
            'Under Consideration': 'neutral',
            Planned: 'amber',
            'In Progress': 'neutral',
            Shipped: 'green',
          } as const;

          return (
            <div
              key={req.id}
              className="rounded-[12px] border border-[#ebebeb] bg-white p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#a1a1a1] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#ebebeb] p-3 min-w-[70px]">
                  <span className="font-mono text-xs text-[#8f8f8f]">RANK</span>
                  <span className="font-sans text-xl font-bold text-[#171717]">#{idx + 1}</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#8f8f8f]">{req.category}</span>
                    <span className="text-[#ebebeb]">•</span>
                    <span className="font-mono text-xs text-[#0070f3]">{req.targetQuarter}</span>
                    <StatusBadge label={req.status} variant={statusVariants[req.status]} size="sm" />
                  </div>

                  <h3 className="font-sans font-semibold text-base sm:text-lg text-[#171717]">
                    {req.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#4d4d4d] max-w-2xl leading-relaxed">
                    {req.description}
                  </p>

                  <span className="text-[11px] font-mono text-[#8f8f8f] block pt-1">
                    Origin: {req.originSource}
                  </span>
                </div>
              </div>

              {/* Upvote Button */}
              <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3 shrink-0">
                <button
                  onClick={() => upvoteFeatureRequest(req.id)}
                  className="flex items-center gap-2 rounded-[6px] border border-[#ebebeb] bg-[#fafafa] px-4 py-2 text-xs font-mono font-medium text-[#171717] hover:bg-white hover:border-[#171717] transition-all"
                >
                  <ThumbsUp className="h-4 w-4 text-[#171717]" />
                  <span>{req.requesterCount.toLocaleString()} Upvotes</span>
                </button>

                {req.linkedReqCode && (
                  <button
                    onClick={() => setActiveSection('requirements')}
                    className="text-[11px] font-mono text-[#0070f3] hover:underline flex items-center gap-1"
                  >
                    <span>Linked {req.linkedReqCode}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
