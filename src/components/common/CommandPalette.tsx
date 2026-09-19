import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  LayoutDashboard,
  Activity,
  Milestone,
  Layers,
  FileText,
  MessageSquare,
  AlertTriangle,
  Flame,
  BrainCircuit,
  Eye,
  Microscope,
  Users,
  CheckCircle,
  Palette,
  Sparkles,
  GitBranch,
  Terminal,
  ShieldAlert,
  Server,
  Zap,
  BookOpen,
  Database,
  PenTool,
  FolderOpen,
  Scale,
  ArrowRight,
  UserCheck,
  FolderKanban,
  Cpu,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { NavSection, RoleType } from '../../types';

interface CommandItem {
  id: string;
  title: string;
  category: 'Views' | 'Actions' | 'Roles' | 'Workspaces' | 'AI Models' | 'Memory';
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  keywords?: string;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setActiveSection,
    setActiveRole,
    showToast,
    workspaces,
    switchWorkspace,
    llmModels,
    setActiveLLMModel,
    openMemoryDrawer,
  } = useProject();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const commandItems: CommandItem[] = useMemo(() => [
    // Views - Group A: Workspace & Executive
    {
      id: 'view-overview',
      title: 'Executive Health Pulse',
      category: 'Views',
      icon: <LayoutDashboard className="h-4 w-4 text-ember-400" />,
      action: () => { setActiveSection('overview'); setCommandPaletteOpen(false); },
      keywords: 'dashboard pulse composite health telemetry executive',
    },
    {
      id: 'view-product-health',
      title: 'Product Health Radar',
      category: 'Views',
      icon: <Activity className="h-4 w-4 text-emerald-400" />,
      action: () => { setActiveSection('product-health'); setCommandPaletteOpen(false); },
      keywords: 'radar stability metrics platforms',
    },
    {
      id: 'view-roadmap',
      title: 'Strategic Roadmap',
      category: 'Views',
      icon: <Milestone className="h-4 w-4 text-sky-400" />,
      action: () => { setActiveSection('roadmap'); setCommandPaletteOpen(false); },
      keywords: 'epics quarters milestones releases',
    },

    // Views - Group B: Product Management
    {
      id: 'view-features',
      title: 'Features Master Directory',
      category: 'Views',
      icon: <Layers className="h-4 w-4 text-amberGold-400" />,
      action: () => { setActiveSection('features'); setCommandPaletteOpen(false); },
      keywords: 'inventory capabilities discovery development',
    },
    {
      id: 'view-requirements',
      title: 'Requirements & PRD Hub',
      category: 'Views',
      icon: <FileText className="h-4 w-4 text-purple-400" />,
      action: () => { setActiveSection('requirements'); setCommandPaletteOpen(false); },
      keywords: 'prd acceptance criteria user stories specs',
    },

    // Views - Group C: User Intelligence
    {
      id: 'view-feedback',
      title: 'User Feedback Stream',
      category: 'Views',
      icon: <MessageSquare className="h-4 w-4 text-emerald-400" />,
      action: () => { setActiveSection('feedback'); setCommandPaletteOpen(false); },
      keywords: 'reviews google play app store reddit discord sentiment',
    },
    {
      id: 'view-user-issues',
      title: 'AI Problem Clusters & Triage',
      category: 'Views',
      icon: <AlertTriangle className="h-4 w-4 text-rose-400" />,
      action: () => { setActiveSection('user-issues'); setCommandPaletteOpen(false); },
      keywords: 'crash issues complaints cluster promote prd triage',
    },
    {
      id: 'view-feature-requests',
      title: 'Feature Requests Leaderboard',
      category: 'Views',
      icon: <Flame className="h-4 w-4 text-amberGold-400" />,
      action: () => { setActiveSection('feature-requests'); setCommandPaletteOpen(false); },
      keywords: 'upvotes community roadmap requests',
    },
    {
      id: 'view-insights',
      title: 'Strategic AI Insights',
      category: 'Views',
      icon: <BrainCircuit className="h-4 w-4 text-ember-400" />,
      action: () => { setActiveSection('insights'); setCommandPaletteOpen(false); },
      keywords: 'behavior shift opportunity competitive threat',
    },

    // Views - Group D: UX Research
    {
      id: 'view-research',
      title: 'UX Research Sessions',
      category: 'Views',
      icon: <Microscope className="h-4 w-4 text-sky-400" />,
      action: () => { setActiveSection('research'); setCommandPaletteOpen(false); },
      keywords: 'interviews usability recordings feedback',
    },
    {
      id: 'view-findings',
      title: 'UX Friction Findings',
      category: 'Views',
      icon: <Eye className="h-4 w-4 text-rose-400" />,
      action: () => { setActiveSection('findings'); setCommandPaletteOpen(false); },
      keywords: 'evidence quotes usability friction fixes',
    },
    {
      id: 'view-user-patterns',
      title: 'User Personas & Archetypes',
      category: 'Views',
      icon: <Users className="h-4 w-4 text-amberGold-400" />,
      action: () => { setActiveSection('user-patterns'); setCommandPaletteOpen(false); },
      keywords: 'personas streamer gamer commuter archetypes',
    },

    // Views - Group E: Design & Validation
    {
      id: 'view-validation',
      title: 'Design-to-Dev Validation Studio (Signature)',
      category: 'Views',
      icon: <CheckCircle className="h-4 w-4 text-ember-400" />,
      action: () => { setActiveSection('validation'); setCommandPaletteOpen(false); },
      keywords: 'validation handshake figma live build pin drop inspect mismatch',
    },
    {
      id: 'view-designs',
      title: 'Ember Studio Design Token Library',
      category: 'Views',
      icon: <Palette className="h-4 w-4 text-purple-400" />,
      action: () => { setActiveSection('designs'); setCommandPaletteOpen(false); },
      keywords: 'tokens colors terracotta amber typography radii',
    },
    {
      id: 'view-figma',
      title: 'Figma Frame Specs Inspector',
      category: 'Views',
      icon: <Sparkles className="h-4 w-4 text-sky-400" />,
      action: () => { setActiveSection('figma'); setCommandPaletteOpen(false); },
      keywords: 'frames node dimensions padding layout rules',
    },
    {
      id: 'view-reviews',
      title: 'Design Review Discussion Threads',
      category: 'Views',
      icon: <MessageSquare className="h-4 w-4 text-emerald-400" />,
      action: () => { setActiveSection('reviews'); setCommandPaletteOpen(false); },
      keywords: 'comments designer dev feedback approval',
    },

    // Views - Group F: Developer Execution
    {
      id: 'view-tasks',
      title: 'Developer Kanban Board',
      category: 'Views',
      icon: <Layers className="h-4 w-4 text-ember-400" />,
      action: () => { setActiveSection('tasks'); setCommandPaletteOpen(false); },
      keywords: 'kanban sprint tasks todo progress review done',
    },
    {
      id: 'view-dev-features',
      title: 'Sprint Features & PR Tracker',
      category: 'Views',
      icon: <GitBranch className="h-4 w-4 text-sky-400" />,
      action: () => { setActiveSection('dev-features'); setCommandPaletteOpen(false); },
      keywords: 'git branch pr pull request commits',
    },
    {
      id: 'view-builds',
      title: 'CI/CD Builds & Sandbox Artifacts',
      category: 'Views',
      icon: <Terminal className="h-4 w-4 text-emerald-400" />,
      action: () => { setActiveSection('builds'); setCommandPaletteOpen(false); },
      keywords: 'sandbox previews ci cd commits builds',
    },
    {
      id: 'view-prompts',
      title: 'AI Prompt & Context Payload Builder',
      category: 'Views',
      icon: <Zap className="h-4 w-4 text-amberGold-400" />,
      action: () => { setActiveSection('prompts'); setCommandPaletteOpen(false); },
      keywords: 'prompt generator ai context injection zero hallucination cursor chatgpt',
    },

    // Views - Group G: QA & Release Readiness & Security
    {
      id: 'view-security',
      title: 'Security Intelligence Command Center',
      category: 'Views',
      icon: <ShieldAlert className="h-4 w-4 text-ember-400" />,
      action: () => { setActiveSection('security'); setCommandPaletteOpen(false); },
      keywords: 'security vulnerabilities strix vulnclaw idor owasp cwe audit retest findings evidence',
    },
    {
      id: 'view-qa-status',
      title: 'Acceptance Test Matrix',
      category: 'Views',
      icon: <CheckCircle className="h-4 w-4 text-emerald-400" />,
      action: () => { setActiveSection('qa-status'); setCommandPaletteOpen(false); },
      keywords: 'qa test cases criteria e2e unit manual',
    },
    {
      id: 'view-bugs',
      title: 'Bug Tracker & Visual Regressions',
      category: 'Views',
      icon: <ShieldAlert className="h-4 w-4 text-rose-400" />,
      action: () => { setActiveSection('bugs'); setCommandPaletteOpen(false); },
      keywords: 'bugs p0 critical defects figma mismatches',
    },
    {
      id: 'view-release-readiness',
      title: 'Release Readiness Gating Radar',
      category: 'Views',
      icon: <Activity className="h-4 w-4 text-amberGold-400" />,
      action: () => { setActiveSection('release-readiness'); setCommandPaletteOpen(false); },
      keywords: 'gating score release go nogo checklist',
    },

    // Views - Group H: Operations & Sentiment
    {
      id: 'view-releases',
      title: 'Releases & Post-Deploy Sentiment Delta',
      category: 'Views',
      icon: <Server className="h-4 w-4 text-emerald-400" />,
      action: () => { setActiveSection('releases'); setCommandPaletteOpen(false); },
      keywords: 'deployments sentiment shift delta v4.2.0 v4.2.1',
    },
    {
      id: 'view-incidents',
      title: 'Production Incidents Log',
      category: 'Views',
      icon: <AlertTriangle className="h-4 w-4 text-rose-400" />,
      action: () => { setActiveSection('incidents'); setCommandPaletteOpen(false); },
      keywords: 'outage p0 p1 incidents telemetry spike',
    },
    {
      id: 'view-maintenance',
      title: 'System Maintenance & SLA Ops',
      category: 'Views',
      icon: <Database className="h-4 w-4 text-purple-400" />,
      action: () => { setActiveSection('maintenance'); setCommandPaletteOpen(false); },
      keywords: 'redis vacuum postgres cdn edge ssl scheduled',
    },

    // Views - Group I: Project Memory & Second Brain
    {
      id: 'view-context',
      title: 'Structured Context Blocks',
      category: 'Memory',
      icon: <BookOpen className="h-4 w-4 text-amberGold-400" />,
      action: () => { setActiveSection('context'); setCommandPaletteOpen(false); },
      keywords: 'context blocks architecture api security tokens fsm state machine',
    },
    {
      id: 'view-notes',
      title: 'Second Brain & AI Note Refiner',
      category: 'Memory',
      icon: <BrainCircuit className="h-4 w-4 text-ember-400" />,
      action: () => { setActiveSection('notes'); setCommandPaletteOpen(false); },
      keywords: 'scratchpad quick notes ai refine executive summary takeaways',
    },
    {
      id: 'view-files',
      title: 'Project Asset Vault',
      category: 'Memory',
      icon: <FolderOpen className="h-4 w-4 text-sky-400" />,
      action: () => { setActiveSection('files'); setCommandPaletteOpen(false); },
      keywords: 'files openapi contracts pdf figma exports assets',
    },
    {
      id: 'view-decisions',
      title: 'Permanent Project Decisions Log (ADRs)',
      category: 'Memory',
      icon: <Scale className="h-4 w-4 text-purple-400" />,
      action: () => { setActiveSection('decisions'); setCommandPaletteOpen(false); },
      keywords: 'adr decisions architecture rationale consequences dec-101',
    },
    {
      id: 'view-project-memory',
      title: 'Project Memory & Change Rationale Stream',
      category: 'Memory',
      icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" />,
      action: () => { setActiveSection('project-memory'); setCommandPaletteOpen(false); },
      keywords: 'project memory change rationale why this changed lineage supersession decisions timeline',
    },
    {
      id: 'memory-open-checkout',
      title: 'Why It Changed: Checkout CTA 16px Spacing',
      category: 'Memory',
      icon: <BrainCircuit className="h-4 w-4 text-[#c2410c]" />,
      action: () => { openMemoryDrawer({ eventId: 'mem-chk-02' }); setCommandPaletteOpen(false); },
      keywords: 'checkout cta 16px padding why changed usability finding android 14',
    },
    {
      id: 'memory-open-sec-tokens',
      title: 'Why It Changed: Session Expiry & Refresh Token Rotation',
      category: 'Memory',
      icon: <BrainCircuit className="h-4 w-4 text-purple-400" />,
      action: () => { openMemoryDrawer({ eventId: 'mem-sec-02' }); setCommandPaletteOpen(false); },
      keywords: 'session expiry 2fa refresh token rotation dec-101 dec-104 security xss',
    },
    {
      id: 'memory-open-pip',
      title: 'Why It Changed: Picture-in-Picture HUD Collision',
      category: 'Memory',
      icon: <BrainCircuit className="h-4 w-4 text-amber-400" />,
      action: () => { openMemoryDrawer({ eventId: 'mem-pip-01' }); setCommandPaletteOpen(false); },
      keywords: 'pip picture in picture hud safe area inset z-index figma spec validation pin 04',
    },
    {
      id: 'memory-open-offline',
      title: 'Why It Changed: Offline Replay Prioritization (Q3)',
      category: 'Memory',
      icon: <BrainCircuit className="h-4 w-4 text-blue-400" />,
      action: () => { openMemoryDrawer({ eventId: 'mem-off-01' }); setCommandPaletteOpen(false); },
      keywords: 'offline replay fr-01 feature request 4890 upvotes prd-108',
    },

    // Roles Switcher Actions
    {
      id: 'role-all',
      title: 'Switch Role: All Lifecycle (Lead Perspective)',
      category: 'Roles',
      icon: <UserCheck className="h-4 w-4 text-stone-300" />,
      action: () => { setActiveRole('all'); setCommandPaletteOpen(false); showToast('Switched to All Lifecycle View', 'info'); },
      keywords: 'role switch all lead executive',
    },
    {
      id: 'role-pm',
      title: 'Switch Role: Product Manager',
      category: 'Roles',
      icon: <UserCheck className="h-4 w-4 text-ember-400" />,
      action: () => { setActiveRole('pm'); setCommandPaletteOpen(false); showToast('Switched to Product Manager View', 'info'); },
      keywords: 'role switch pm product strategy prd',
    },
    {
      id: 'role-designer',
      title: 'Switch Role: Design & UX',
      category: 'Roles',
      icon: <UserCheck className="h-4 w-4 text-purple-400" />,
      action: () => { setActiveRole('designer'); setCommandPaletteOpen(false); showToast('Switched to Design & UX View', 'info'); },
      keywords: 'role switch design ux validation figma',
    },
    {
      id: 'role-dev',
      title: 'Switch Role: Developer Workspace',
      category: 'Roles',
      icon: <UserCheck className="h-4 w-4 text-sky-400" />,
      action: () => { setActiveRole('dev'); setCommandPaletteOpen(false); showToast('Switched to Developer View', 'info'); },
      keywords: 'role switch dev engineer code kanban prompts',
    },
    {
      id: 'role-qa',
      title: 'Switch Role: QA Engineer & Gating',
      category: 'Roles',
      icon: <UserCheck className="h-4 w-4 text-emerald-400" />,
      action: () => { setActiveRole('qa'); setCommandPaletteOpen(false); showToast('Switched to QA Engineer View', 'info'); },
      keywords: 'role switch qa tests bugs release readiness',
    },
    {
      id: 'role-ops',
      title: 'Switch Role: Production Operations',
      category: 'Roles',
      icon: <UserCheck className="h-4 w-4 text-rose-400" />,
      action: () => { setActiveRole('ops'); setCommandPaletteOpen(false); showToast('Switched to Operations View', 'info'); },
      keywords: 'role switch ops incidents releases maintenance',
    },
    {
      id: 'role-memory',
      title: 'Switch Role: Second Brain & Memory OS',
      category: 'Roles',
      icon: <UserCheck className="h-4 w-4 text-amberGold-400" />,
      action: () => { setActiveRole('memory'); setCommandPaletteOpen(false); showToast('Switched to Project Memory OS', 'info'); },
      keywords: 'role switch second brain memory context adr notes',
    },

    // Quick Actions
    {
      id: 'action-quick-note',
      title: 'Capture Quick Note to Second Brain',
      category: 'Actions',
      icon: <PenTool className="h-4 w-4 text-amberGold-400" />,
      action: () => { setActiveSection('notes'); setCommandPaletteOpen(false); showToast('Opened Second Brain Scratchpad', 'amber'); },
      keywords: 'create new quick capture note scratchpad',
    },
    {
      id: 'action-generate-prompt',
      title: 'Build AI Coding Context Prompt',
      category: 'Actions',
      icon: <Zap className="h-4 w-4 text-ember-400" />,
      action: () => { setActiveSection('prompts'); setCommandPaletteOpen(false); showToast('Opened AI Prompt Builder', 'info'); },
      keywords: 'generate prompt context ai payload code',
    },
    {
      id: 'action-inspect-validation',
      title: 'Inspect Live Component in Validation Studio',
      category: 'Actions',
      icon: <CheckCircle className="h-4 w-4 text-emerald-400" />,
      action: () => { setActiveSection('validation'); setCommandPaletteOpen(false); showToast('Opened Validation Studio', 'info'); },
      keywords: 'validation studio inspect figma live build pins',
    },

    // Workspaces Switcher
    ...workspaces.map((ws) => ({
      id: `ws-${ws.id}`,
      title: `Switch Workspace: ${ws.name} (${ws.code})`,
      category: 'Workspaces' as const,
      icon: <FolderKanban className="h-4 w-4 text-[#0070f3]" />,
      action: () => {
        switchWorkspace(ws.id);
        setCommandPaletteOpen(false);
      },
      keywords: `workspace project switch ${ws.code} ${ws.name} ${ws.platform} tenant`,
    })),

    // AI LLM Models Target Selection
    ...llmModels.map((model) => ({
      id: `model-${model.id}`,
      title: `Set AI Target: ${model.name} (${model.providerName})`,
      category: 'AI Models' as const,
      icon: <Cpu className="h-4 w-4 text-[#7928ca]" />,
      action: () => {
        setActiveLLMModel(model);
        setActiveSection('prompts');
        setCommandPaletteOpen(false);
      },
      keywords: `llm model ai target prompt token ${model.name} ${model.provider} ${model.tag}`,
    })),
  ], [
    setActiveSection,
    setActiveRole,
    setCommandPaletteOpen,
    showToast,
    workspaces,
    switchWorkspace,
    llmModels,
    setActiveLLMModel,
  ]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return commandItems;
    const lower = query.toLowerCase();
    return commandItems.filter((item) =>
      item.title.toLowerCase().includes(lower) ||
      item.category.toLowerCase().includes(lower) ||
      (item.keywords && item.keywords.toLowerCase().includes(lower))
    );
  }, [commandItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isCommandPaletteOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, filteredItems, selectedIndex, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28">
      <div
        onClick={() => setCommandPaletteOpen(false)}
        className="fixed inset-0 bg-black/25 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[16px] bg-white border border-[#ebebeb] shadow-[0px_8px_30px_rgba(0,0,0,0.12)] z-10 animate-scale-in">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#ebebeb] px-4 py-3.5 bg-white">
          <Search className="h-4 w-4 text-[#8f8f8f] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 31 views, actions, roles, or context... (⌘K)"
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-[#171717] placeholder-[#8f8f8f] focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center rounded-[4px] border border-[#ebebeb] px-2 py-0.5 text-[10px] font-mono text-[#8f8f8f] bg-[#fafafa]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-[#f2f2f2]">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#8f8f8f]">
              No matching commands or views found for <span className="text-[#171717] font-semibold">"{query}"</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between rounded-[8px] px-3 py-2.5 cursor-pointer transition-all duration-100 ${
                    isSelected
                      ? 'bg-[#f5f5f5] text-[#171717]'
                      : 'text-[#4d4d4d] hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-[#171717]">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate text-[#171717]">{item.title}</p>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8f8f8f]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <ArrowRight className="h-4 w-4 text-[#171717]" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-[#ebebeb] px-4 py-2.5 bg-[#fafafa] text-[11px] text-[#8f8f8f] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#171717] font-medium">Dev Atlas</span>
        </div>
      </div>
    </div>
  );
};
