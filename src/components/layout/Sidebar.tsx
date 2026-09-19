import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Milestone,
  Layers,
  FileText,
  MessageSquare,
  AlertTriangle,
  Flame,
  BrainCircuit,
  Microscope,
  Eye,
  Users,
  CheckCircle,
  Palette,
  Sparkles,
  MessageSquareMore,
  Kanban,
  GitBranch,
  Terminal,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Gauge,
  Server,
  RadioTower,
  Database,
  BookOpen,
  FolderOpen,
  Scale,
  X,
  PanelLeftClose,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { NavSection, RoleType } from '../../types';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  roles: RoleType[];
  items: Array<{
    id: NavSection;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeVariant?: 'terracotta' | 'amber' | 'green' | 'red' | 'blue' | 'purple' | 'neutral';
    isSignature?: boolean;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    activeSection,
    setActiveSection,
    activeRole,
    selectRole,
    isSidebarOpen,
    setSidebarOpen,
    problemClusters,
    validationSessions,
    secondBrainNotes,
    bugs,
    qaTestCases,
    securityFindings,
    activeWorkspace,
  } = useProject();

  // Dynamic Badges Calculations
  const criticalClusterCount = problemClusters.filter((c) => c.severity === 'critical' && c.status !== 'resolved').length;
  const totalPins = validationSessions.reduce((sum, s) => sum + s.annotations.filter((a) => !a.resolved).length, 0);
  const unrefinedNotes = secondBrainNotes.filter((n) => !n.isRefined).length;
  const openBugsCount = bugs.filter((b) => b.status !== 'Verified Resolved').length;
  const failedQACount = qaTestCases.filter((tc) => tc.status === 'Failed').length;
  const criticalSecCount = securityFindings.filter(
    (f) => f.severity === 'critical' && f.status !== 'verified-fixed' && f.status !== 'accepted-risk'
  ).length;

  const navGroups: NavGroup[] = [
    // 1. Executive & Overview (Shown for 'all' and 'pm')
    {
      id: 'group-executive',
      label: 'Executive & Overview',
      roles: ['all', 'pm'],
      items: [
        { id: 'overview', label: 'Executive Health Pulse', icon: <LayoutDashboard className="h-4 w-4" /> },
        { id: 'product-health', label: 'Product Health Radar', icon: <Activity className="h-4 w-4" /> },
        { id: 'roadmap', label: 'Strategic Roadmap', icon: <Milestone className="h-4 w-4" /> },
        { id: 'project-memory', label: 'Project Memory Ledger', icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" /> },
      ],
    },

    // 2. Product Management (Shown for 'all' and 'pm')
    {
      id: 'group-pm',
      label: 'Product Management',
      roles: ['all', 'pm'],
      items: [
        { id: 'features', label: 'Features Directory', icon: <Layers className="h-4 w-4" /> },
        { id: 'requirements', label: 'Requirements & PRD Hub', icon: <FileText className="h-4 w-4" />, badge: '4 PRDs', badgeVariant: 'terracotta' },
        { id: 'project-memory', label: 'Product Memory & Rationale', icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" /> },
      ],
    },

    // 3. User Intelligence & Feedback (Shown for 'all' and 'pm')
    {
      id: 'group-feedback',
      label: 'User Intelligence Hub',
      roles: ['all', 'pm'],
      items: [
        { id: 'feedback', label: 'Feedback Stream', icon: <MessageSquare className="h-4 w-4" /> },
        {
          id: 'user-issues',
          label: 'Problem Clusters',
          icon: <AlertTriangle className="h-4 w-4" />,
          badge: criticalClusterCount > 0 ? `${criticalClusterCount} Critical` : undefined,
          badgeVariant: 'red',
        },
        { id: 'feature-requests', label: 'Feature Requests', icon: <Flame className="h-4 w-4" /> },
        { id: 'insights', label: 'Product Insights', icon: <BrainCircuit className="h-4 w-4" />, badge: 'AI', badgeVariant: 'amber' },
      ],
    },

    // 4. UX Research & Patterns (Shown for 'designer')
    {
      id: 'group-ux',
      label: 'UX Research & Patterns',
      roles: ['designer'],
      items: [
        { id: 'research', label: 'Interview Sessions', icon: <Microscope className="h-4 w-4" /> },
        { id: 'findings', label: 'UX Findings & Friction', icon: <Eye className="h-4 w-4" /> },
        { id: 'user-patterns', label: 'Personas & Patterns', icon: <Users className="h-4 w-4" /> },
      ],
    },

    // 5. Design & Validation Studio (Shown for 'designer')
    {
      id: 'group-design',
      label: 'Design & Validation',
      roles: ['designer'],
      items: [
        {
          id: 'validation',
          label: 'Validation Studio',
          icon: <CheckCircle className="h-4 w-4" />,
          isSignature: true,
          badge: totalPins > 0 ? `${totalPins} Pins` : 'Spec Sync',
          badgeVariant: 'amber',
        },
        { id: 'designs', label: 'Design Token Library', icon: <Palette className="h-4 w-4" /> },
        { id: 'figma', label: 'Figma Specs Inspector', icon: <Sparkles className="h-4 w-4" /> },
        { id: 'reviews', label: 'Design Review Threads', icon: <MessageSquareMore className="h-4 w-4" /> },
        { id: 'project-memory', label: 'Design Memory & Specs', icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" /> },
      ],
    },

    // 6. Developer Workspace (Shown for 'dev')
    {
      id: 'group-dev',
      label: 'Developer Workspace',
      roles: ['dev'],
      items: [
        { id: 'tasks', label: 'Developer Kanban', icon: <Kanban className="h-4 w-4" /> },
        { id: 'dev-features', label: 'Sprint & PR Tracker', icon: <GitBranch className="h-4 w-4" /> },
        { id: 'builds', label: 'Sandbox Builds & CI', icon: <Terminal className="h-4 w-4" /> },
        { id: 'prompts', label: 'AI Prompt Builder', icon: <Zap className="h-4 w-4" /> },
        { id: 'project-memory', label: 'Engineering Memory & ADRs', icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" /> },
      ],
    },

    // 7. Engineering Architecture & Context (Shown for 'dev')
    {
      id: 'group-dev-context',
      label: 'Engineering Architecture',
      roles: ['dev'],
      items: [
        {
          id: 'validation',
          label: 'Code vs Figma Specs',
          icon: <CheckCircle className="h-4 w-4" />,
          isSignature: true,
          badge: 'Spec Sync',
          badgeVariant: 'amber',
        },
        { id: 'context', label: 'System Context Blocks', icon: <BookOpen className="h-4 w-4" /> },
      ],
    },

    // 8. QA & Security Gating (Shown for 'qa')
    {
      id: 'group-qa',
      label: 'QA & Security Gating',
      roles: ['qa'],
      items: [
        {
          id: 'security',
          label: 'Security Command Center',
          icon: <ShieldAlert className="h-4 w-4 text-[#ee0000]" />,
          badge: criticalSecCount > 0 ? `${criticalSecCount} Critical` : 'Passed',
          badgeVariant: criticalSecCount > 0 ? 'red' : 'green',
        },
        {
          id: 'qa-status',
          label: 'Acceptance Test Matrix',
          icon: <ShieldCheck className="h-4 w-4" />,
          badge: failedQACount > 0 ? `${failedQACount} Failing` : 'Passed',
          badgeVariant: failedQACount > 0 ? 'red' : 'green',
        },
        {
          id: 'bugs',
          label: 'Bug Tracker',
          icon: <ShieldAlert className="h-4 w-4" />,
          badge: openBugsCount > 0 ? `${openBugsCount} Open` : undefined,
          badgeVariant: 'red',
        },
        { id: 'release-readiness', label: 'Release Readiness Gate', icon: <Gauge className="h-4 w-4" />, badge: '88% Score', badgeVariant: 'amber' },
        { id: 'project-memory', label: 'QA Memory & Lineage', icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" /> },
      ],
    },

    // 9. Production & Ops (Shown for 'ops')
    {
      id: 'group-ops',
      label: 'Production & Ops',
      roles: ['ops'],
      items: [
        { id: 'product-health', label: 'Product Health Radar', icon: <Activity className="h-4 w-4" /> },
        { id: 'releases', label: 'Releases & Sentiment Delta', icon: <Server className="h-4 w-4" />, badge: '+14.2% Delta', badgeVariant: 'green' },
        { id: 'incidents', label: 'Production Incidents', icon: <RadioTower className="h-4 w-4" /> },
        { id: 'maintenance', label: 'System Maintenance', icon: <Database className="h-4 w-4" /> },
        { id: 'project-memory', label: 'Ops Memory & Rollbacks', icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" /> },
      ],
    },

    // 10. Persistent Project Memory (Shown for 'all' and 'pm')
    {
      id: 'group-memory',
      label: 'Persistent Knowledge Base',
      roles: ['all', 'pm'],
      items: [
        { id: 'context', label: 'Context Blocks', icon: <BookOpen className="h-4 w-4" /> },
        {
          id: 'notes',
          label: 'Second Brain & Notes',
          icon: <BrainCircuit className="h-4 w-4" />,
          badge: unrefinedNotes > 0 ? `${unrefinedNotes} Unrefined` : undefined,
          badgeVariant: 'amber',
        },
        { id: 'files', label: 'Project File Vault', icon: <FolderOpen className="h-4 w-4" /> },
        { id: 'decisions', label: 'Decisions Log (ADR)', icon: <Scale className="h-4 w-4" /> },
        {
          id: 'project-memory',
          label: 'Project Memory Stream',
          icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" />,
          badge: 'History',
          badgeVariant: 'amber',
        },
      ],
    },
  ];

  // Strictly filter groups based on active role selected in top navbar
  const visibleGroups = navGroups.filter((g) => g.roles.includes(activeRole));

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto p-3">
      <div className="space-y-5">
        {/* Role perspective indicator banner with Hide Nav Action */}
        <div className="rounded-[10px] border border-[#e5e7eb] bg-white p-3 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#525252] font-mono text-[10px] font-bold uppercase tracking-wider">
              Perspective
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#171717] bg-[#f5f5f5] px-1.5 py-0.5 rounded-[4px] font-bold uppercase border border-[#e5e7eb]">
                {activeRole.toUpperCase()}
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Hide left navigation bar"
                title="Hide left navigation bar (keep top navbar only)"
                className="hidden lg:flex p-1.5 rounded-[4px] text-[#525252] hover:text-[#171717] hover:bg-[#f5f5f5] transition-all"
              >
                <PanelLeftClose className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-1 font-semibold text-xs text-[#171717]">
            {activeRole === 'all' && '🌐 Product Strategy & Overview'}
            {activeRole === 'pm' && '📊 Product Strategy & Delivery'}
            {activeRole === 'designer' && '🎨 Design System & UX Validation'}
            {activeRole === 'dev' && '💻 Engineering & Architecture'}
            {activeRole === 'qa' && '🧪 QA Gating & Security'}
            {activeRole === 'ops' && '🚀 Production Telemetry & Ops'}
          </p>
          <div className="mt-2 text-[10px] text-[#525252] flex items-center justify-between border-t border-[#e5e7eb] pt-1.5">
            <span className="font-medium">{visibleGroups.reduce((sum, g) => sum + g.items.length, 0)} visible options</span>
            <span className="text-[#0070f3] font-mono font-semibold capitalize">{activeRole} Focus</span>
          </div>
        </div>

        {/* Navigation Sections */}
        {visibleGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            <div className="px-2.5 py-1 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#525252]">
                {group.label}
              </span>
            </div>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={`${group.id}-${item.id}`}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (isOpenMobile) onCloseMobile();
                    }}
                    className={`group flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-xs transition-all min-h-[36px] ${
                      isActive
                        ? 'bg-white text-[#171717] font-bold border border-[#d4d4d8] shadow-[0px_1px_2px_rgba(0,0,0,0.04)]'
                        : 'text-[#262626] hover:bg-[#f2f2f2] hover:text-[#171717] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`${
                          isActive
                            ? 'text-[#171717]'
                            : 'text-[#525252] group-hover:text-[#171717]'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`font-mono text-[10px] font-semibold px-1.5 py-0.2 rounded-full border shrink-0 ${
                          item.badgeVariant === 'terracotta'
                            ? 'bg-[#171717] text-white border-[#171717]'
                            : item.badgeVariant === 'amber'
                            ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
                            : item.badgeVariant === 'red'
                            ? 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]'
                            : item.badgeVariant === 'green'
                            ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]'
                            : 'bg-[#f5f5f5] text-[#404040] border-[#d4d4d8]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 rounded-[8px] border border-[#e5e7eb] bg-white p-3 text-[11px] text-[#525252]">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span className="font-bold text-[#171717]">{activeWorkspace.code}</span>
          <span className="text-[#047857] font-bold">{activeWorkspace.healthScore}% HEALTH</span>
        </div>
        <p className="mt-1 text-[#525252] text-[10px] font-medium truncate">
          {activeWorkspace.name} ({activeWorkspace.version})
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Controlled by isSidebarOpen) */}
      {isSidebarOpen && (
        <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 flex-col border-r border-[#e5e7eb] bg-[#fafafa] sticky top-14 h-[calc(100vh-3.5rem)] overflow-hidden transition-all animate-fade-in">
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation drawer">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/35 backdrop-blur-sm animate-fade-in"
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#fafafa] border-r border-[#e5e7eb] shadow-2xl z-10 animate-scale-in flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#e5e7eb] bg-white">
              <span className="font-sans font-bold text-[#171717] text-sm">Dev Atlas Navigation</span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-[6px] text-[#525252] hover:text-[#171717] hover:bg-[#f5f5f5]"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Drawer Quick Role Switcher */}
            <div className="p-3 bg-white border-b border-[#e5e7eb]">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252] mb-1.5">
                Switch Role Perspective
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'all', label: 'All', icon: '🌐' },
                  { id: 'pm', label: 'Product', icon: '📊' },
                  { id: 'designer', label: 'Design', icon: '🎨' },
                  { id: 'dev', label: 'Eng', icon: '💻' },
                  { id: 'qa', label: 'QA', icon: '🧪' },
                  { id: 'ops', label: 'Ops', icon: '🚀' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      selectRole(r.id as RoleType);
                      onCloseMobile();
                    }}
                    className={`flex items-center justify-center gap-1 rounded-[6px] py-1.5 px-2 text-xs font-semibold transition-all touch-target ${
                      activeRole === r.id
                        ? 'bg-[#171717] text-white shadow-xs font-bold'
                        : 'bg-[#f5f5f5] text-[#262626] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
