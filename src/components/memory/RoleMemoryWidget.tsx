import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { MemoryStateBadge } from './MemoryStateBadge';
import { RecordRationaleModal } from './RecordRationaleModal';
import {
  BrainCircuit,
  ArrowRight,
  Plus,
  ChevronDown,
  ChevronUp,
  FileText,
  Palette,
  Terminal,
  ShieldCheck,
  Activity,
  History,
  ExternalLink,
} from 'lucide-react';
import { RoleType } from '../../types';

interface RoleMemoryWidgetProps {
  role?: RoleType;
  className?: string;
  defaultExpanded?: boolean;
}

interface RoleConfig {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  entityName: string;
}

export const RoleMemoryWidget: React.FC<RoleMemoryWidgetProps> = ({
  role,
  className = '',
  defaultExpanded = true,
}) => {
  const {
    activeRole,
    memoryEvents,
    openMemoryDrawer,
    setActiveSection,
  } = useProject();

  const currentRole = role || (activeRole === 'all' ? 'all' : activeRole);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isRecordModalOpen, setRecordModalOpen] = useState(false);

  // Role-specific copy & icons
  const roleConfigs: Record<RoleType, RoleConfig> = {
    all: {
      title: 'Project Memory & Change Ledger',
      subtitle: 'Institutional decisions, rationale, and measured outcomes across all disciplines.',
      icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" />,
      entityName: 'Cross-Role Decisions',
    },
    pm: {
      title: 'Product Memory & Scope Decisions',
      subtitle: 'Why requirements, acceptance criteria, and release scopes evolved.',
      icon: <FileText className="h-4 w-4 text-[#c2410c]" />,
      entityName: 'PRD & Scope Decisions',
    },
    designer: {
      title: 'Design Memory & Spec Rationale',
      subtitle: 'Token modifications, UI spacing trade-offs, and usability feedback rationale.',
      icon: <Palette className="h-4 w-4 text-[#c2410c]" />,
      entityName: 'Design & Token Decisions',
    },
    dev: {
      title: 'Engineering Memory & Architecture Decisions',
      subtitle: 'Technical trade-offs, API contract changes, and architecture decisions (ADRs).',
      icon: <Terminal className="h-4 w-4 text-[#c2410c]" />,
      entityName: 'Architecture & Code Decisions',
    },
    qa: {
      title: 'QA Memory & Verification Lineage',
      subtitle: 'Root causes of regressions, bug fix verifications, and accepted risks.',
      icon: <ShieldCheck className="h-4 w-4 text-[#c2410c]" />,
      entityName: 'Quality & Test Decisions',
    },
    ops: {
      title: 'Ops Memory & Production History',
      subtitle: 'Deployment decisions, config updates, and incident post-mortem learnings.',
      icon: <Activity className="h-4 w-4 text-[#c2410c]" />,
      entityName: 'Operational Decisions',
    },
    memory: {
      title: 'Project Memory Ledger',
      subtitle: 'Institutional memory across product and engineering.',
      icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" />,
      entityName: 'Decisions',
    },
  };

  const config = roleConfigs[currentRole] || roleConfigs.all;

  // Filter events relevant to this role (or all)
  const roleEvents = memoryEvents.filter((e) => {
    if (currentRole === 'all') return true;
    return e.role === currentRole || e.role === 'all';
  });

  const latestEvents = roleEvents.slice(0, 3);
  const activeCount = roleEvents.filter((e) => e.state === 'active').length;
  const supersededCount = roleEvents.filter((e) => e.state === 'superseded').length;

  return (
    <div
      className={`rounded-[12px] border border-[#e4e4e7] bg-white shadow-2xs transition-all ${className}`}
    >
      {/* Top Banner Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-[#f4f4f5]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#fafafa] border border-[#e4e4e7]">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold text-[#171717]">
                {config.title}
              </h2>
              <span className="rounded-full bg-[#f4f4f5] px-2 py-0.5 text-[10px] font-mono font-medium text-[#52525b]">
                {roleEvents.length} recorded
              </span>
              {supersededCount > 0 && (
                <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 px-1.5 py-0.2 text-[9px] font-mono">
                  {supersededCount} superseded
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#71717a] mt-0.5">
              {config.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Record Rationale CTA */}
          <button
            type="button"
            onClick={() => setRecordModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-[6px] border border-[#e4e4e7] bg-white px-2.5 py-1.5 text-xs font-medium text-[#171717] hover:border-[#171717] hover:bg-[#fafafa] transition-all shadow-2xs"
            title="Record rationale for a new change or decision"
          >
            <Plus className="h-3.5 w-3.5 text-[#71717a]" />
            <span>Log Rationale</span>
          </button>

          {/* View Full Feed */}
          <button
            type="button"
            onClick={() => setActiveSection('project-memory')}
            className="inline-flex items-center gap-1 rounded-[6px] bg-[#171717] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-2xs"
            title="Open complete memory stream for this workspace"
          >
            <span>Full History</span>
            <ExternalLink className="h-3 w-3" />
          </button>

          {/* Toggle Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-[6px] p-1.5 text-[#71717a] hover:bg-[#f4f4f5] hover:text-[#171717] transition-all"
            title={isExpanded ? 'Collapse memory widget' : 'Expand memory widget'}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Cards Grid */}
      {isExpanded && (
        <div className="p-4 bg-[#fafafa]/50">
          {roleEvents.length === 0 ? (
            <div className="py-6 text-center">
              <History className="h-6 w-6 text-[#a1a1aa] mx-auto mb-2" />
              <p className="text-xs text-[#52525b] font-medium">No memory records logged for this role yet.</p>
              <p className="text-[11px] text-[#a1a1aa] mt-0.5">
                Click &quot;Log Rationale&quot; to preserve why a decision or change was made.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {latestEvents.map((event) => (
                <div
                  key={event.id}
                  className={`rounded-[8px] border bg-white p-3.5 shadow-2xs flex flex-col justify-between transition-all hover:border-[#a1a1aa] ${
                    event.state === 'superseded' ? 'border-purple-200 bg-purple-50/20' : 'border-[#e4e4e7]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-[#71717a]">
                      <span className="font-semibold text-[#171717] uppercase truncate max-w-[130px]">
                        {event.entityLabel}
                      </span>
                      <MemoryStateBadge state={event.state} size="sm" />
                    </div>

                    <h3 className="text-xs font-semibold text-[#171717] leading-snug line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-[11px] text-[#52525b] leading-relaxed line-clamp-2">
                      <span className="font-medium text-[#171717]">Why: </span>
                      {event.whyChanged || event.summary}
                    </p>

                    {event.fieldChanges && event.fieldChanges.length > 0 && (
                      <div className="text-[10px] font-mono bg-[#f4f4f5] rounded px-2 py-1 text-[#3f3f46] truncate">
                        {event.fieldChanges[0].label}:{' '}
                        <span className="line-through text-red-600">{event.fieldChanges[0].before}</span> →{' '}
                        <span className="text-emerald-700 font-semibold">{event.fieldChanges[0].after}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#f4f4f5] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#a1a1aa]">
                      {event.occurredAt}
                    </span>

                    <button
                      type="button"
                      onClick={() => openMemoryDrawer({ eventId: event.id })}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#171717] hover:text-[#c2410c] transition-colors"
                    >
                      <span>Why this changed</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Record Rationale Modal */}
      <RecordRationaleModal
        isOpen={isRecordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        defaultEntityType={currentRole === 'pm' ? 'prd' : currentRole === 'dev' ? 'task' : 'decision'}
      />
    </div>
  );
};
