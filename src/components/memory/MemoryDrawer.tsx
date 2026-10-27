import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { MemoryStateBadge } from './MemoryStateBadge';
import {
  X,
  BrainCircuit,
  ArrowRight,
  Calendar,
  User,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  GitCommit,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  FileText,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { NavSection } from '../../types';

export const MemoryDrawer: React.FC = () => {
  const {
    isMemoryDrawerOpen,
    closeMemoryDrawer,
    selectedMemoryId,
    memoryEvents,
    openMemoryDrawer,
    setActiveSection,
    getSupersedingEvent,
  } = useProject();

  if (!isMemoryDrawerOpen) return null;

  const currentEvent = memoryEvents.find((m) => m.id === selectedMemoryId) || memoryEvents[0];

  if (!currentEvent) return null;

  const supersedingEvent = getSupersedingEvent(currentEvent.id);
  const previousEvent = currentEvent.previousMemoryEventId
    ? memoryEvents.find((m) => m.id === currentEvent.previousMemoryEventId)
    : undefined;

  const handleNavigateToEntity = (targetSection?: NavSection) => {
    if (targetSection) {
      setActiveSection(targetSection);
      closeMemoryDrawer();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeMemoryDrawer}
      />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-[#ebebeb] flex flex-col animate-slide-left">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#ebebeb] px-6 py-4 bg-[#fafafa]">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#171717] text-white">
                <BrainCircuit className="h-4 w-4 text-[#fb923c]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">
                    Project Memory & Rationale
                  </span>
                  <span className="text-[10px] font-mono text-[#a1a1aa]">•</span>
                  <span className="text-[10px] font-mono text-[#52525b] uppercase font-semibold">
                    {currentEvent.entityType} · {currentEvent.entityId}
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-[#171717] truncate max-w-md">
                  {currentEvent.title}
                </h2>
              </div>
            </div>

            <button
              onClick={closeMemoryDrawer}
              className="rounded-[6px] p-1.5 text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#171717] transition-all"
              title="Close Memory Drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
            {/* 1. CURRENT STATE (Prominent) */}
            <div className="rounded-[10px] border border-[#e4e4e7] bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a]">
                  Current Status
                </span>
                <MemoryStateBadge state={currentEvent.state} size="lg" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#f4f4f5] text-xs">
                <div>
                  <span className="text-[10px] text-[#71717a] block">Owner</span>
                  <div className="flex items-center gap-1 font-medium text-[#171717] mt-0.5 truncate">
                    <User className="w-3 h-3 text-[#71717a]" />
                    <span>{currentEvent.author}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#71717a] block">Role</span>
                  <span className="font-mono font-medium text-[#171717] uppercase mt-0.5 block">
                    {currentEvent.role}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#71717a] block">Recorded</span>
                  <div className="flex items-center gap-1 font-mono text-[#171717] mt-0.5">
                    <Calendar className="w-3 h-3 text-[#71717a]" />
                    <span>{currentEvent.occurredAt}</span>
                  </div>
                </div>
              </div>

              {/* Supersession Warning Banner */}
              {currentEvent.state === 'superseded' && supersedingEvent && (
                <div className="rounded-[8px] border border-purple-200 bg-purple-50/70 p-3 flex items-start gap-2.5 text-xs text-purple-900">
                  <RefreshCw className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold">
                      This decision was superseded by {supersedingEvent.title}
                    </p>
                    <p className="text-[11px] text-purple-800">
                      The original rationale is preserved for audit lineage. View the newer active decision.
                    </p>
                    <button
                      onClick={() => openMemoryDrawer({ eventId: supersedingEvent.id })}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:underline pt-1"
                    >
                      <span>View Superseding Decision</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. WHAT CHANGED (Human-Readable Before/After) */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
                What Changed
              </h3>
              {currentEvent.fieldChanges && currentEvent.fieldChanges.length > 0 ? (
                <div className="space-y-2">
                  {currentEvent.fieldChanges.map((change, idx) => (
                    <div
                      key={idx}
                      className="rounded-[8px] border border-[#e4e4e7] bg-[#fafafa] p-3 text-xs"
                    >
                      <div className="font-semibold text-[#171717] mb-1.5">{change.label}</div>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="rounded bg-[#fee2e2] text-[#991b1b] px-2 py-0.5 line-through">
                          {change.before || 'Empty'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa]" />
                        <span className="rounded bg-[#dcfce7] text-[#166534] px-2 py-0.5 font-semibold">
                          {change.after || 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[8px] border border-[#e4e4e7] bg-[#fafafa] p-3 text-xs text-[#52525b]">
                  {currentEvent.summary}
                </div>
              )}
            </div>

            {/* 3. WHY (Plain Language Rationale) */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
                Why It Changed
              </h3>
              <div className="rounded-[8px] border border-amber-200/80 bg-amber-50/40 p-4 text-xs text-[#1c1917] leading-relaxed">
                {currentEvent.whyChanged ? (
                  <p className="font-sans text-sm leading-relaxed">{currentEvent.whyChanged}</p>
                ) : (
                  <p className="text-[#a1a1aa] italic font-mono text-xs">Rationale not recorded</p>
                )}
              </div>
            </div>

            {/* 4. DECISION & ALTERNATIVES */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
                Decision & Trade-offs
              </h3>
              <div className="rounded-[8px] border border-[#e4e4e7] bg-white p-4 text-xs space-y-3">
                <div>
                  <span className="font-semibold text-[#171717] block mb-1">Decision:</span>
                  <p className="text-[#52525b] leading-relaxed">
                    {currentEvent.decision || currentEvent.summary}
                  </p>
                </div>

                {currentEvent.alternativesConsidered && currentEvent.alternativesConsidered.length > 0 && (
                  <div className="pt-2 border-t border-[#f4f4f5]">
                    <span className="font-semibold text-[#171717] block mb-1.5 text-[11px]">
                      Alternatives Considered:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#71717a]">
                      {currentEvent.alternativesConsidered.map((alt, idx) => (
                        <li key={idx}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 5. EVIDENCE */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
                Evidence & References
              </h3>
              <div className="space-y-2">
                {currentEvent.evidence && currentEvent.evidence.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {currentEvent.evidence.map((ev, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full border border-[#e4e4e7] bg-[#f4f4f5] px-2.5 py-1 text-[11px] font-mono text-[#3f3f46]"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                        <span>{ev}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Clickable Linked Entities */}
                {currentEvent.links && currentEvent.links.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {currentEvent.links.map((link, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleNavigateToEntity(link.targetSection)}
                        className="flex items-center justify-between rounded-[6px] border border-[#e4e4e7] bg-white p-2.5 text-left text-xs hover:border-[#171717] hover:bg-[#fafafa] transition-all group"
                      >
                        <div className="truncate pr-2">
                          <span className="text-[10px] font-mono text-[#71717a] uppercase block">
                            {link.entityType}
                          </span>
                          <span className="font-medium text-[#171717] truncate block">
                            {link.label}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-[#a1a1aa] group-hover:text-[#171717] shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 6. IMPACT (Strict Separation: EXPECTED vs OBSERVED) */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
                Expected vs. Observed Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Expected Impact */}
                <div className="rounded-[8px] border border-[#e4e4e7] bg-[#fafafa] p-3.5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717a] font-semibold block">
                    Expected Impact
                  </span>
                  <p className="text-xs text-[#3f3f46] leading-relaxed">
                    {currentEvent.expectedImpact || 'No expected metric documented.'}
                  </p>
                </div>

                {/* Observed Impact */}
                <div className="rounded-[8px] border border-emerald-200/80 bg-emerald-50/40 p-3.5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold block">
                    Observed Impact
                  </span>
                  {currentEvent.observedImpact && currentEvent.observedImpact.length > 0 ? (
                    <div className="space-y-2">
                      {currentEvent.observedImpact.map((metric, idx) => (
                        <div key={idx} className="rounded bg-white p-2 border border-emerald-100 text-xs">
                          <div className="flex items-center justify-between text-[11px] font-medium text-emerald-950">
                            <span>{metric.metric}</span>
                            {metric.delta !== undefined && (
                              <span
                                className={`inline-flex items-center gap-0.5 font-mono font-semibold ${
                                  metric.direction === 'positive'
                                    ? 'text-emerald-700'
                                    : metric.direction === 'negative'
                                    ? 'text-red-700'
                                    : 'text-neutral-700'
                                }`}
                              >
                                {metric.delta > 0 ? '+' : ''}
                                {metric.delta}
                                {metric.unit || ''}
                              </span>
                            )}
                          </div>
                          {metric.before !== undefined && metric.after !== undefined && (
                            <div className="text-[10px] font-mono text-[#71717a] mt-0.5">
                              {metric.before}
                              {metric.unit} → {metric.after}
                              {metric.unit} ({metric.source || 'Measured'})
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-[#71717a] italic font-mono py-1">
                      <Clock className="w-3.5 h-3.5 text-[#a1a1aa]" />
                      <span>Impact not measured yet</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 7. DECISION LINEAGE & TIMELINE */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#71717a]">
                Decision Lineage & Timeline
              </h3>
              <div className="rounded-[8px] border border-[#e4e4e7] bg-white p-4 space-y-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {previousEvent && (
                    <>
                      <button
                        onClick={() => openMemoryDrawer({ eventId: previousEvent.id })}
                        className="rounded-[6px] border border-[#e4e4e7] bg-[#fafafa] px-2.5 py-1 text-left text-[11px] hover:border-[#171717] transition-all shrink-0"
                      >
                        <span className="text-[9px] text-[#71717a] block font-mono">PREVIOUS</span>
                        <span className="font-medium text-[#171717]">{previousEvent.title.slice(0, 24)}...</span>
                      </button>
                      <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] shrink-0" />
                    </>
                  )}

                  <div className="rounded-[6px] border-2 border-[#171717] bg-[#171717] text-white px-2.5 py-1 text-[11px] shrink-0 font-medium">
                    <span className="text-[9px] text-amber-300 block font-mono">CURRENT EVENT</span>
                    <span>{currentEvent.title.slice(0, 28)}...</span>
                  </div>

                  {supersedingEvent && (
                    <>
                      <ArrowRight className="w-3.5 h-3.5 text-[#a1a1aa] shrink-0" />
                      <button
                        onClick={() => openMemoryDrawer({ eventId: supersedingEvent.id })}
                        className="rounded-[6px] border border-purple-200 bg-purple-50 px-2.5 py-1 text-left text-[11px] hover:border-purple-600 transition-all shrink-0"
                      >
                        <span className="text-[9px] text-purple-700 block font-mono">SUPERSEDED BY</span>
                        <span className="font-medium text-purple-900">{supersedingEvent.title.slice(0, 24)}...</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-[#ebebeb] px-6 py-3 bg-[#fafafa] flex items-center justify-between text-xs">
            <span className="text-[#71717a] font-mono text-[11px]">
              Memory ID: {currentEvent.id}
            </span>
            <button
              onClick={closeMemoryDrawer}
              className="rounded-[6px] bg-[#171717] px-3.5 py-1.5 font-medium text-white hover:bg-[#333333] transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
