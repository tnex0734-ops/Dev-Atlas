import React from 'react';
import {
  Microscope,
  Clock,
  User,
  Quote,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const ResearchSessionsView: React.FC = () => {
  const { researchSessions, setActiveSection } = useProject();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Microscope className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              UX Research Interview Sessions
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Qualitative user usability testing, moderated interviews, and observational telemetry sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('findings')}
            className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-white px-3 py-1.5 text-xs font-medium text-[#171717] hover:bg-[#fafafa]"
          >
            <span>View Usability Findings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {researchSessions.map((session) => (
          <div
            key={session.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#0070f3] bg-[#eff6ff] px-2 py-0.5 rounded-[4px] border border-[#bfdbfe]">
                    {session.sessionCode}
                  </span>
                  <StatusBadge label={session.type} variant="neutral" size="sm" />
                </div>
                <span className="text-xs font-mono text-[#8f8f8f]">{session.date}</span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-mono text-[#4d4d4d]">
                <span className="flex items-center gap-1.5 font-medium text-[#171717]">
                  <User className="h-3.5 w-3.5 text-[#171717]" />
                  {session.participantHandle}
                </span>
                <span className="flex items-center gap-1 text-[#8f8f8f]">
                  <Clock className="h-3.5 w-3.5" /> {session.durationMinutes} mins
                </span>
              </div>

              {/* Key Takeaway */}
              <div className="mt-4 rounded-[8px] bg-[#fafafa] p-4 border border-[#ebebeb]">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#ab570a] font-semibold block mb-1">
                  Primary Usability Finding:
                </span>
                <p className="text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
                  {session.keyTakeaway}
                </p>
              </div>

              {/* Verbatim Quotes */}
              <div className="mt-4 space-y-2">
                {session.quotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs italic text-[#4d4d4d] bg-[#fafafa] p-2.5 rounded-[6px] border border-[#ebebeb]"
                  >
                    <Quote className="h-3.5 w-3.5 text-[#171717] shrink-0 mt-0.5" />
                    <span>"{q}"</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f2f2f2] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {session.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] bg-[#fafafa] px-2 py-0.5 rounded-[4px] text-[#8f8f8f] border border-[#ebebeb]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
              <span className="text-xs font-mono text-[#8f8f8f]">
                Target: {session.personaTarget}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
