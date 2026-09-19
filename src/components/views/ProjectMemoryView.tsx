import React, { useState, useMemo, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { MemoryStateBadge } from '../memory/MemoryStateBadge';
import { RecordRationaleModal } from '../memory/RecordRationaleModal';
import {
  BrainCircuit,
  Search,
  ArrowRight,
  Plus,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { RoleType, MemoryState, ProjectMemoryEvent } from '../../types';

interface RoleTabConfig {
  id: string;
  label: string;
  filter: (event: ProjectMemoryEvent) => boolean;
}

interface RoleMetricConfig {
  label: string;
  value: (events: ProjectMemoryEvent[]) => string | number;
  subtext: string;
  color: 'neutral' | 'emerald' | 'blue' | 'purple' | 'amber';
}

const ROLE_SPECIFIC_CONFIGS: Record<
  RoleType,
  {
    roleTitle: string;
    roleDescription: string;
    tabs: RoleTabConfig[];
    metrics: RoleMetricConfig[];
  }
> = {
  all: {
    roleTitle: 'Project Memory & Change Ledger',
    roleDescription:
      'Cross-functional institutional memory across product, design, engineering, QA, and operations.',
    tabs: [
      { id: 'all', label: 'All Records', filter: () => true },
      { id: 'decisions', label: 'Key Decisions (ADR)', filter: (e) => e.eventType === 'decision' || Boolean(e.decision) },
      { id: 'scope', label: 'PRD & Scope', filter: (e) => e.entityType === 'prd' || e.role === 'pm' },
      { id: 'tokens', label: 'Design & Tokens', filter: (e) => e.entityType === 'design-token' || e.entityType === 'design-spec' || e.role === 'designer' },
      { id: 'measured', label: 'Measured Impact', filter: (e) => Boolean(e.observedImpact && e.observedImpact.length > 0) },
      { id: 'superseded', label: 'Superseded Lineage', filter: (e) => e.state === 'superseded' || Boolean(e.supersedesMemoryEventId) },
    ],
    metrics: [
      {
        label: 'Total Memory Records',
        value: (evts) => evts.length,
        subtext: 'across all disciplines',
        color: 'neutral',
      },
      {
        label: 'Active Decisions',
        value: (evts) => evts.filter((m) => m.state === 'active').length,
        subtext: 'in current effect',
        color: 'emerald',
      },
      {
        label: 'Measured Outcomes',
        value: (evts) => evts.filter((m) => m.observedImpact && m.observedImpact.length > 0).length,
        subtext: 'verified with metrics',
        color: 'blue',
      },
      {
        label: 'Superseded Decisions',
        value: (evts) => evts.filter((m) => m.state === 'superseded').length,
        subtext: 'lineage preserved',
        color: 'purple',
      },
    ],
  },
  pm: {
    roleTitle: 'Product Memory & Scope Decisions',
    roleDescription:
      'Tracks why feature scopes, requirements, and release priorities evolved with documented business rationale.',
    tabs: [
      { id: 'all', label: 'All Product Memory', filter: (e) => e.role === 'pm' || e.role === 'all' },
      {
        id: 'scope',
        label: 'PRD & Scope Evolution',
        filter: (e) =>
          e.entityType === 'prd' ||
          Boolean(
            e.fieldChanges?.some(
              (f) =>
                f.field.toLowerCase().includes('scope') ||
                f.field.toLowerCase().includes('stage')
            )
          ),
      },
      {
        id: 'prioritization',
        label: 'Prioritization Trade-offs',
        filter: (e) =>
          Boolean(
            e.fieldChanges?.some(
              (f) =>
                f.field.toLowerCase().includes('priority') ||
                f.field.toLowerCase().includes('quarter')
            )
          ) || e.state === 'proposed',
      },
      {
        id: 'customer',
        label: 'Customer-Driven Rationale',
        filter: (e) =>
          Boolean(
            e.evidence?.some(
              (ev) =>
                ev.toLowerCase().includes('feedback') ||
                ev.toLowerCase().includes('cluster') ||
                ev.toLowerCase().includes('upvote')
            )
          ),
      },
      {
        id: 'roi',
        label: 'Measured Business Impact',
        filter: (e) => Boolean(e.observedImpact && e.observedImpact.length > 0),
      },
    ],
    metrics: [
      {
        label: 'PRD & Scope Decisions',
        value: (evts) => evts.filter((e) => e.entityType === 'prd' || e.role === 'pm').length,
        subtext: 'documented specifications',
        color: 'neutral',
      },
      {
        label: 'P0 Prioritizations',
        value: (evts) =>
          evts.filter((e) => e.fieldChanges?.some((f) => f.after === 'P0')).length,
        subtext: 'critical scope accelerations',
        color: 'emerald',
      },
      {
        label: 'Customer-Driven Changes',
        value: (evts) =>
          evts.filter((e) =>
            e.evidence?.some(
              (ev) =>
                ev.toLowerCase().includes('feedback') ||
                ev.toLowerCase().includes('upvote')
            )
          ).length,
        subtext: 'backed by user requests',
        color: 'blue',
      },
      {
        label: 'Measured Conversion Lift',
        value: () => '+3.5pp',
        subtext: 'checkout completion',
        color: 'purple',
      },
    ],
  },
  designer: {
    roleTitle: 'Design Memory & Spec Rationale',
    roleDescription:
      'Tracks design token adjustments, UI spacing trade-offs, Figma parity exceptions, and usability lab evidence.',
    tabs: [
      { id: 'all', label: 'All Design Memory', filter: (e) => e.role === 'designer' || e.role === 'all' },
      {
        id: 'tokens',
        label: 'Design Token Diffs',
        filter: (e) =>
          e.entityType === 'design-token' ||
          Boolean(
            e.fieldChanges?.some(
              (f) =>
                f.field.toLowerCase().includes('padding') ||
                f.field.toLowerCase().includes('color') ||
                f.field.toLowerCase().includes('token') ||
                f.field.toLowerCase().includes('target')
            )
          ),
      },
      {
        id: 'specs',
        label: 'Figma Spec Exceptions',
        filter: (e) =>
          e.entityType === 'design-spec' ||
          Boolean(e.links?.some((l) => l.entityType === 'figma' || l.entityType === 'validation')),
      },
      {
        id: 'usability',
        label: 'Usability Lab Evidence',
        filter: (e) =>
          Boolean(
            e.evidence?.some(
              (ev) =>
                ev.toLowerCase().includes('ux') ||
                ev.toLowerCase().includes('usability') ||
                ev.toLowerCase().includes('lab')
            )
          ),
      },
      {
        id: 'a11y',
        label: 'Accessibility & Touch Targets',
        filter: (e) =>
          Boolean(
            e.title.toLowerCase().includes('contrast') ||
              e.title.toLowerCase().includes('touch') ||
              e.title.toLowerCase().includes('safearea') ||
              e.title.toLowerCase().includes('spacing')
          ),
      },
    ],
    metrics: [
      {
        label: 'Active Design Tokens',
        value: (evts) => evts.filter((e) => e.entityType === 'design-token').length,
        subtext: 'synchronized with Figma',
        color: 'neutral',
      },
      {
        label: 'Figma Parity Exceptions',
        value: (evts) => evts.filter((e) => e.entityType === 'design-spec').length,
        subtext: 'approved code adaptations',
        color: 'emerald',
      },
      {
        label: 'Usability Findings Cited',
        value: (evts) =>
          evts.filter((e) =>
            e.evidence?.some(
              (ev) =>
                ev.toLowerCase().includes('ux') ||
                ev.toLowerCase().includes('usability')
            )
          ).length,
        subtext: 'empirical user evidence',
        color: 'blue',
      },
      {
        label: 'Tap Error Reduction',
        value: () => '-6.8pp',
        subtext: 'post-token optimization',
        color: 'purple',
      },
    ],
  },
  dev: {
    roleTitle: 'Engineering Memory & Architecture Decisions',
    roleDescription:
      'Tracks architecture decisions (ADRs), API contract shifts, refactoring rationale, and system reliability.',
    tabs: [
      { id: 'all', label: 'All Architecture Memory', filter: (e) => e.role === 'dev' || e.role === 'all' },
      {
        id: 'adr',
        label: 'Architecture Decisions (ADR)',
        filter: (e) =>
          e.entityType === 'decision' || e.entityId.toLowerCase().startsWith('dec-'),
      },
      {
        id: 'contracts',
        label: 'State & API Contracts',
        filter: (e) =>
          Boolean(
            e.fieldChanges?.some(
              (f) =>
                f.field.toLowerCase().includes('state') ||
                f.field.toLowerCase().includes('token') ||
                f.field.toLowerCase().includes('storage') ||
                f.field.toLowerCase().includes('engine')
            )
          ),
      },
      {
        id: 'perf',
        label: 'Performance & Latency (P99)',
        filter: (e) =>
          Boolean(
            e.observedImpact?.some(
              (m) =>
                m.metric.toLowerCase().includes('latency') ||
                m.metric.toLowerCase().includes('speed') ||
                m.metric.toLowerCase().includes('p99')
            )
          ),
      },
      {
        id: 'superseded',
        label: 'Superseded Tech Debt',
        filter: (e) =>
          e.state === 'superseded' || Boolean(e.supersedesMemoryEventId),
      },
    ],
    metrics: [
      {
        label: 'Active Architecture Decisions',
        value: (evts) =>
          evts.filter((e) => e.entityType === 'decision' && e.state === 'active').length,
        subtext: 'governing system design',
        color: 'neutral',
      },
      {
        label: 'Superseded Decisions',
        value: (evts) => evts.filter((e) => e.state === 'superseded').length,
        subtext: 'historical migration lineage',
        color: 'purple',
      },
      {
        label: 'State & Cache Refactors',
        value: (evts) =>
          evts.filter((e) =>
            e.fieldChanges?.some(
              (f) =>
                f.field.toLowerCase().includes('engine') ||
                f.field.toLowerCase().includes('state')
            )
          ).length,
        subtext: 'resilience upgrades',
        color: 'emerald',
      },
      {
        label: 'P99 Latency Delta',
        value: () => '-133ms',
        subtext: 'SQLite WASM search acceleration',
        color: 'blue',
      },
    ],
  },
  qa: {
    roleTitle: 'QA Memory & Verification Lineage',
    roleDescription:
      'Tracks regression root causes, bug fix verifications, accepted security risks, and mandatory test gates.',
    tabs: [
      { id: 'all', label: 'All QA Lineage', filter: (e) => e.role === 'qa' || e.role === 'all' },
      {
        id: 'regressions',
        label: 'Regression Root Causes',
        filter: (e) =>
          e.entityType === 'bug' ||
          e.title.toLowerCase().includes('root cause') ||
          e.title.toLowerCase().includes('freeze') ||
          e.title.toLowerCase().includes('bug'),
      },
      {
        id: 'bugfixes',
        label: 'Verified Bug Fixes',
        filter: (e) =>
          e.state === 'validated' ||
          Boolean(
            e.fieldChanges?.some(
              (f) =>
                f.after?.toLowerCase().includes('verified') ||
                f.after?.toLowerCase().includes('resolved')
            )
          ),
      },
      {
        id: 'security',
        label: 'Security Waivers & Risks',
        filter: (e) =>
          e.entityType === 'security' ||
          e.title.toLowerCase().includes('waiver') ||
          e.title.toLowerCase().includes('risk'),
      },
      {
        id: 'testgates',
        label: 'Mandatory Test Gates',
        filter: (e) =>
          e.entityType === 'qa-test' || e.title.toLowerCase().includes('test'),
      },
    ],
    metrics: [
      {
        label: 'Verified Bug Fixes',
        value: (evts) =>
          evts.filter((e) => e.entityType === 'bug' || e.state === 'validated').length,
        subtext: 'root causes documented',
        color: 'emerald',
      },
      {
        label: 'Regression Root Causes',
        value: (evts) =>
          evts.filter(
            (e) =>
              e.title.toLowerCase().includes('root cause') ||
              e.entityType === 'bug'
          ).length,
        subtext: 'analyzed & remediated',
        color: 'neutral',
      },
      {
        label: 'Active Security Waivers',
        value: (evts) =>
          evts.filter(
            (e) =>
              e.entityType === 'security' ||
              e.fieldChanges?.some((f) => f.after === 'accepted-risk')
          ).length,
        subtext: 'with compensating controls',
        color: 'amber',
      },
      {
        label: 'Mandatory Test Gates',
        value: (evts) => evts.filter((e) => e.entityType === 'qa-test').length,
        subtext: 'blocking CI/CD regressions',
        color: 'blue',
      },
    ],
  },
  ops: {
    roleTitle: 'Ops Memory & Production History',
    roleDescription:
      'Tracks deployment decisions, canary rollbacks, incident post-mortems, and telemetry SLO deviations.',
    tabs: [
      { id: 'all', label: 'All Ops History', filter: (e) => e.role === 'ops' || e.role === 'all' },
      {
        id: 'incidents',
        label: 'Incident Post-Mortems (RCA)',
        filter: (e) =>
          e.entityType === 'incident' ||
          e.title.toLowerCase().includes('post-mortem') ||
          e.title.toLowerCase().includes('outage'),
      },
      {
        id: 'rollbacks',
        label: 'Rollback Justifications',
        filter: (e) =>
          e.title.toLowerCase().includes('rollback') ||
          e.title.toLowerCase().includes('halting') ||
          e.state === 'rolled-back',
      },
      {
        id: 'infra',
        label: 'Config & Circuit Breakers',
        filter: (e) =>
          Boolean(
            e.fieldChanges?.some(
              (f) =>
                f.field.toLowerCase().includes('threshold') ||
                f.field.toLowerCase().includes('circuit') ||
                f.field.toLowerCase().includes('config')
            )
          ),
      },
      {
        id: 'slo',
        label: 'SLO & Sentiment Deltas',
        filter: (e) =>
          Boolean(
            e.observedImpact?.some(
              (m) =>
                m.metric.toLowerCase().includes('sentiment') ||
                m.metric.toLowerCase().includes('mttr') ||
                m.metric.toLowerCase().includes('reliability')
            )
          ),
      },
    ],
    metrics: [
      {
        label: 'Incident Post-Mortems',
        value: (evts) =>
          evts.filter(
            (e) =>
              e.entityType === 'incident' ||
              e.title.toLowerCase().includes('post-mortem')
          ).length,
        subtext: 'RCAs published & closed',
        color: 'neutral',
      },
      {
        label: 'Canary Rollbacks Justified',
        value: (evts) =>
          evts.filter(
            (e) =>
              e.title.toLowerCase().includes('rollback') ||
              e.title.toLowerCase().includes('canary')
          ).length,
        subtext: 'prevented mass outages',
        color: 'amber',
      },
      {
        label: 'MTTR Reduction',
        value: () => '-40.8m',
        subtext: 'faster recovery via Envoy',
        color: 'emerald',
      },
      {
        label: 'Peak Reliability',
        value: () => '99.98%',
        subtext: 'post-v4.2.1 deployment',
        color: 'blue',
      },
    ],
  },
  memory: {
    roleTitle: 'Project Memory Ledger',
    roleDescription: 'Institutional memory across product and engineering.',
    tabs: [
      { id: 'all', label: 'All Records', filter: () => true },
      { id: 'decisions', label: 'Decisions', filter: (e) => e.eventType === 'decision' || Boolean(e.decision) },
      { id: 'impact', label: 'Measured Impact', filter: (e) => Boolean(e.observedImpact && e.observedImpact.length > 0) },
      { id: 'superseded', label: 'Superseded', filter: (e) => e.state === 'superseded' },
    ],
    metrics: [
      { label: 'Total Records', value: (evts) => evts.length, subtext: 'all events', color: 'neutral' },
      { label: 'Active', value: (evts) => evts.filter((m) => m.state === 'active').length, subtext: 'in effect', color: 'emerald' },
      { label: 'Measured', value: (evts) => evts.filter((m) => m.observedImpact && m.observedImpact.length > 0).length, subtext: 'with metrics', color: 'blue' },
      { label: 'Superseded', value: (evts) => evts.filter((m) => m.state === 'superseded').length, subtext: 'lineage', color: 'purple' },
    ],
  },
};

export const ProjectMemoryView: React.FC = () => {
  const {
    memoryEvents,
    openMemoryDrawer,
    activeRole,
    selectRole,
    setActiveSection,
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType | 'all'>(
    activeRole === 'all' ? 'all' : activeRole
  );
  const [selectedState, setSelectedState] = useState<MemoryState | 'all'>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isRecordModalOpen, setRecordModalOpen] = useState(false);

  // Sync selectedRole when top navbar activeRole changes
  useEffect(() => {
    setSelectedRole(activeRole === 'all' ? 'all' : activeRole);
    setActiveTab('all');
  }, [activeRole]);

  // When selectedRole changes manually, reset tab to 'all'
  const handleRoleChange = (newRole: RoleType | 'all') => {
    setSelectedRole(newRole);
    setActiveTab('all');
    if (newRole !== 'all') {
      selectRole(newRole);
    }
  };

  const roleConfig =
    ROLE_SPECIFIC_CONFIGS[selectedRole === 'all' ? 'all' : selectedRole] ||
    ROLE_SPECIFIC_CONFIGS.all;

  // Filter logic
  const filteredEvents = useMemo(() => {
    return memoryEvents.filter((event) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesWhy = event.whyChanged?.toLowerCase().includes(q);
        const matchesEntity =
          event.entityId.toLowerCase().includes(q) ||
          event.entityLabel.toLowerCase().includes(q);
        const matchesAuthor = event.author.toLowerCase().includes(q);
        if (!matchesTitle && !matchesWhy && !matchesEntity && !matchesAuthor)
          return false;
      }

      // Role filter
      if (selectedRole !== 'all' && event.role !== selectedRole && event.role !== 'all') {
        return false;
      }

      // State filter
      if (selectedState !== 'all' && event.state !== selectedState) {
        return false;
      }

      // Role-specific Tab filter
      const currentTabDef = roleConfig.tabs.find((t) => t.id === activeTab);
      if (currentTabDef && activeTab !== 'all') {
        return currentTabDef.filter(event);
      }

      return true;
    });
  }, [memoryEvents, searchQuery, selectedRole, selectedState, activeTab, roleConfig]);

  // Role events for metrics calculation
  const roleScopedEvents = useMemo(() => {
    if (selectedRole === 'all') return memoryEvents;
    return memoryEvents.filter((e) => e.role === selectedRole || e.role === 'all');
  }, [memoryEvents, selectedRole]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e7eb] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#171717] text-white">
              <BrainCircuit className="h-4 w-4 text-[#fb923c]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-[-1.28px] text-[#171717]">
                  {roleConfig.roleTitle}
                </h1>
                <span className="font-mono text-[10px] text-[#171717] bg-[#f4f4f5] px-2 py-0.5 rounded-[4px] font-bold uppercase border border-[#e5e7eb]">
                  {selectedRole.toUpperCase()} LENS
                </span>
              </div>
            </div>
          </div>
          <p className="mt-1.5 text-sm text-[#374151] max-w-3xl font-normal leading-relaxed">
            {roleConfig.roleDescription}
          </p>
        </div>

        <button
          onClick={() => setRecordModalOpen(true)}
          className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#333333] transition-all shadow-xs self-start sm:self-auto shrink-0 touch-target"
        >
          <Plus className="h-4 w-4" />
          <span>Log Decision Rationale</span>
        </button>
      </div>

      {/* Role-Specific Health Summary Pulse Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {roleConfig.metrics.map((metric, idx) => {
          const colorClasses = {
            neutral: 'border-[#e5e7eb] bg-white text-[#171717]',
            emerald: 'border-emerald-200 bg-emerald-50/70 text-emerald-950',
            blue: 'border-blue-200 bg-blue-50/70 text-blue-950',
            purple: 'border-purple-200 bg-purple-50/70 text-purple-950',
            amber: 'border-amber-200 bg-amber-50/70 text-amber-950',
          }[metric.color];

          return (
            <div
              key={idx}
              className={`rounded-[10px] border p-3.5 shadow-2xs ${colorClasses}`}
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-90">
                {metric.label}
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono">
                  {metric.value(roleScopedEvents)}
                </span>
                <span className="text-[10px] opacity-80 font-medium">{metric.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3 pt-2">
        {/* Role-Specific Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-[#e5e7eb] text-xs">
          {roleConfig.tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            // Count matching items for this specific tab
            const count = (tab.id === 'all'
              ? roleScopedEvents
              : roleScopedEvents.filter(tab.filter)
            ).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-t-[6px] whitespace-nowrap transition-all border-b-2 -mb-px touch-target ${
                  isActive
                    ? 'border-[#171717] text-[#171717] bg-white font-bold'
                    : 'border-transparent text-[#525252] hover:text-[#171717] font-semibold'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                    isActive
                      ? 'bg-[#171717] text-white'
                      : 'bg-[#f4f4f5] text-[#525252] border border-[#e5e7eb]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#525252]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memory by rationale, entity (e.g. PRD-105, DEV-416), decision, or owner..."
              className="w-full rounded-[6px] border border-[#e5e7eb] bg-white pl-9 pr-3 py-2 text-xs text-[#171717] placeholder:text-[#6b7280] focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Role Filter Switcher */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#525252] font-bold uppercase">Lens:</span>
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value as any)}
                className="rounded-[6px] border border-[#e5e7eb] bg-white px-2.5 py-1.5 text-xs text-[#171717] font-semibold focus:border-[#171717] focus:outline-none"
              >
                <option value="all">🌐 All Disciplines</option>
                <option value="pm">📊 Product (PM)</option>
                <option value="designer">🎨 Design & UX</option>
                <option value="dev">💻 Engineering</option>
                <option value="qa">🧪 QA & Security</option>
                <option value="ops">🚀 Operations</option>
              </select>
            </div>

            {/* State Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as any)}
              className="rounded-[6px] border border-[#e5e7eb] bg-white px-2.5 py-1.5 text-xs text-[#171717] font-semibold focus:border-[#171717] focus:outline-none"
            >
              <option value="all">All States</option>
              <option value="active">Active</option>
              <option value="validated">Validated</option>
              <option value="superseded">Superseded</option>
              <option value="proposed">Proposed</option>
              <option value="rolled-back">Rolled Back</option>
            </select>
          </div>
        </div>
      </div>

      {/* Memory Cards Timeline Feed */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#e5e7eb] bg-white p-12 text-center space-y-3">
            <BrainCircuit className="h-10 w-10 text-[#525252] mx-auto" />
            <h3 className="text-sm font-semibold text-[#171717]">
              No Memory Records Match &quot;{roleConfig.tabs.find((t) => t.id === activeTab)?.label}&quot;
            </h3>
            <p className="text-xs text-[#525252] max-w-md mx-auto font-medium">
              No events found for this specific lens and role perspective. You can reset filters or log a new rationale record.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setSelectedState('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#e5e7eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#171717] hover:bg-[#fafafa]"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#525252]" />
                <span>Reset Lens Filters</span>
              </button>
              <button
                type="button"
                onClick={() => setRecordModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#171717] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#333333]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Rationale for {selectedRole.toUpperCase()}</span>
              </button>
            </div>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-[12px] border bg-white p-5 sm:p-6 shadow-2xs space-y-4 transition-all hover:border-[#171717] ${
                event.state === 'superseded'
                  ? 'border-purple-300 bg-purple-50/20'
                  : 'border-[#e5e7eb]'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2.5 border-b border-[#f4f4f5] pb-3.5">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#525252] mb-1">
                    <span className="uppercase font-bold text-[#171717] bg-[#f4f4f5] px-1.5 py-0.5 rounded border border-[#e5e7eb]">
                      {event.role}
                    </span>
                    <span>•</span>
                    <span className="font-medium">{event.occurredAt}</span>
                    <span>•</span>
                    <span className="text-[#171717] font-bold uppercase">
                      {event.entityLabel}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#171717]">
                    {event.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <MemoryStateBadge state={event.state} size="md" />
                  <button
                    onClick={() => openMemoryDrawer({ eventId: event.id })}
                    className="inline-flex items-center gap-1 rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] px-2.5 py-1 text-xs font-semibold text-[#171717] hover:border-[#171717] hover:bg-white transition-all shadow-2xs"
                  >
                    <span>Why this changed</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card Body: WHY IT CHANGED */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-2 text-xs">
                  <span className="font-mono text-[10px] uppercase text-[#525252] font-bold w-24 shrink-0 pt-0.5">
                    RATIONALE:
                  </span>
                  <p className="text-[#171717] leading-relaxed font-normal">
                    {event.whyChanged || event.summary}
                  </p>
                </div>

                {/* Field Changes if present */}
                {event.fieldChanges && event.fieldChanges.length > 0 && (
                  <div className="flex items-start gap-2 text-xs">
                    <span className="font-mono text-[10px] uppercase text-[#525252] font-bold w-24 shrink-0 pt-0.5">
                      CHANGES:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {event.fieldChanges.map((c, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[11px] text-[#171717] bg-[#f4f4f5] px-2 py-0.5 rounded border border-[#e5e7eb] font-medium"
                        >
                          {c.label}:{' '}
                          <span className="line-through text-red-700 font-medium">{c.before}</span>{' '}
                          →{' '}
                          <span className="font-bold text-emerald-800">
                            {c.after}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Impact */}
                <div className="flex items-start gap-2 text-xs">
                  <span className="font-mono text-[10px] uppercase text-[#525252] font-bold w-24 shrink-0 pt-0.5">
                    IMPACT:
                  </span>
                  <div>
                    {event.observedImpact && event.observedImpact.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {event.observedImpact.map((metric, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 font-mono text-[11px] rounded bg-emerald-50 text-emerald-950 border border-emerald-300 px-2 py-0.5 font-semibold"
                          >
                            <span>{metric.metric}:</span>
                            <span className="font-bold text-emerald-700">
                              {metric.delta && metric.delta > 0 ? '+' : ''}
                              {metric.delta}
                              {metric.unit}
                            </span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-mono text-[11px] text-[#525252] italic font-medium">
                        {event.expectedImpact
                          ? `Expected: ${event.expectedImpact} (Observed: In validation)`
                          : 'Impact not measured yet'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Evidence Links & Decision Lineage Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f4f4f5] text-[11px]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#525252] font-bold">EVIDENCE:</span>
                  {event.links && event.links.length > 0 ? (
                    event.links.map((link, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          link.targetSection && setActiveSection(link.targetSection)
                        }
                        className="inline-flex items-center gap-1 rounded bg-[#f4f4f5] px-2 py-0.5 text-[10px] font-mono text-[#171717] hover:bg-[#e5e7eb] transition-colors font-medium border border-[#e5e7eb]"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-[#525252]" />
                      </button>
                    ))
                  ) : (
                    <span className="font-mono text-[10px] text-[#525252]">None linked</span>
                  )}
                </div>

                <span className="font-mono text-[10px] text-[#525252] font-medium">
                  Owner: {event.author}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Rationale Modal */}
      <RecordRationaleModal
        isOpen={isRecordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        defaultEntityType={
          selectedRole === 'pm'
            ? 'prd'
            : selectedRole === 'designer'
            ? 'design-token'
            : selectedRole === 'dev'
            ? 'decision'
            : selectedRole === 'qa'
            ? 'bug'
            : 'release'
        }
      />
    </div>
  );
};
