import React from 'react';
import { Calendar, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export interface MeetingItem {
  id: string;
  title: string;
  date: string;
  attendees?: string[];
  summary: string;
  importantDecision?: string;
  actionItems?: Array<{
    id: string;
    text: string;
    owner?: string;
    done?: boolean;
  }>;
  status?: string;
  roleFilter?: string;
  onClick?: () => void;
}

interface MeetingCardProps {
  meeting: MeetingItem;
  level?: 1 | 2;
  onAskAI?: (meetingTitle: string) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  level = 1,
  onAskAI,
}) => {
  return (
    <div
      className={`${
        level === 2 ? 'card-level-2' : 'card-level-1'
      } flex flex-col justify-between hover:border-[#161616] hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-all`}
    >
      <div>
        {/* Header: Title, Date & Status */}
        <div className="flex items-start justify-between gap-3 border-b border-[#f0f0f0] pb-3">
          <div className="min-w-0">
            <h3 className="font-sans text-base font-bold text-[#161616] truncate tracking-tight">
              {meeting.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs font-mono text-[#525252]">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#525252]" />
                {meeting.date}
              </span>
              {meeting.attendees && meeting.attendees.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 truncate max-w-[160px]">
                    <Users className="h-3.5 w-3.5 text-[#525252]" />
                    {meeting.attendees.slice(0, 3).join(', ')}
                    {meeting.attendees.length > 3 && ` +${meeting.attendees.length - 3}`}
                  </span>
                </>
              )}
            </div>
          </div>
          {meeting.status && (
            <StatusBadge label={meeting.status} variant="neutral" size="sm" />
          )}
        </div>

        {/* Short Summary */}
        <p className="mt-3 text-xs sm:text-sm text-[#374151] leading-relaxed">
          {meeting.summary}
        </p>

        {/* Important Decision (Orange highlight) */}
        {meeting.importantDecision && (
          <div className="mt-3.5 rounded-[8px] bg-[#FFF0EC] p-3 border border-[#FFD6CC]">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6039] block mb-1">
              Important Decision
            </span>
            <p className="text-xs font-medium text-[#161616] leading-relaxed">
              {meeting.importantDecision}
            </p>
          </div>
        )}

        {/* Action Items */}
        {meeting.actionItems && meeting.actionItems.length > 0 && (
          <div className="mt-3.5 space-y-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#525252] block">
              Action Items ({meeting.actionItems.length})
            </span>
            <div className="space-y-1">
              {meeting.actionItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 rounded-[6px] bg-[#fafafa] p-2 border border-[#e5e7eb] text-xs text-[#374151]"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FFF0EC] text-[#FF6039]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 font-medium">{item.text}</span>
                  {item.owner && (
                    <span className="font-mono text-[10px] text-[#525252] shrink-0 font-medium">
                      @{item.owner}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {onAskAI && (
        <div className="mt-4 pt-3 border-t border-[#f0f0f0] flex items-center justify-end">
          <button
            onClick={() => onAskAI(meeting.title)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#161616] hover:text-[#FF6039] transition-colors"
          >
            <span>Ask AI about this meeting</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
