import React, { useState } from 'react';
import {
  MessageSquareMore,
  Send,
  User,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const DesignReviewsView: React.FC = () => {
  const { designReviews, addDesignReviewComment } = useProject();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleSendComment = (threadId: string) => {
    const text = commentInputs[threadId];
    if (!text || !text.trim()) return;

    addDesignReviewComment(threadId, 'Project Maintainer', 'Reviewer', text);
    setCommentInputs((prev) => ({ ...prev, [threadId]: '' }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareMore className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Design Review Discussion Threads
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Multi-disciplinary design reviews connecting UX designers, frontend engineers, and product managers.
          </p>
        </div>
      </div>

      {/* Review Threads */}
      <div className="space-y-6">
        {designReviews.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#ebebeb] bg-white p-12 text-center">
            <MessageSquareMore className="h-10 w-10 text-[#a1a1a1] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#171717]">No Design Review Threads Active</h3>
            <p className="text-xs text-[#8f8f8f] mt-1 max-w-md mx-auto">
              Design review discussion threads will appear when components are flagged for visual inspection in Validation Studio.
            </p>
          </div>
        ) : (
          designReviews.map((thread) => (
          <div
            key={thread.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f2f2f2] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-sans font-semibold text-lg text-[#171717]">
                    {thread.title}
                  </h3>
                  <StatusBadge
                    label={thread.status}
                    variant={thread.status === 'Resolved' ? 'green' : 'amber'}
                    size="sm"
                    dot
                  />
                </div>
                <p className="text-xs text-[#8f8f8f] font-mono mt-1">
                  Target Component: <span className="text-[#171717] font-medium">{thread.component}</span> • Thread Author: <span className="text-[#171717] font-medium">{thread.author}</span>
                </p>
              </div>

              <span className="text-xs font-mono text-[#8f8f8f]">
                Last Activity: {thread.lastActivity}
              </span>
            </div>

            {/* Comments Thread */}
            <div className="space-y-3">
              {thread.comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-[8px] bg-[#fafafa] p-4 border border-[#ebebeb] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-[#171717]">
                      <span>{c.author}</span>
                      <span className="text-[10px] font-mono text-[#0070f3] bg-[#eff6ff] px-1.5 py-0.5 rounded-[4px] border border-[#bfdbfe]">
                        {c.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8f8f8f]">{c.time}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Post comment input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={commentInputs[thread.id] || ''}
                onChange={(e) =>
                  setCommentInputs((prev) => ({ ...prev, [thread.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendComment(thread.id);
                }}
                placeholder="Post review feedback..."
                className="flex-1 rounded-[6px] border border-[#ebebeb] bg-[#fafafa] px-4 py-2.5 text-xs sm:text-sm text-[#171717] placeholder-[#8f8f8f] focus:border-[#171717] focus:bg-white focus:outline-none"
              />
              <button
                onClick={() => handleSendComment(thread.id)}
                className="rounded-[6px] bg-[#171717] p-2.5 text-white hover:bg-[#333333] transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  );
};
