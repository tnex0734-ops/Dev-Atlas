import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  PenTool,
  Sparkles,
  BrainCircuit,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Plus,
  Check,
  FolderKanban,
  X,
  Github,
  Loader2,
  CheckCircle2,
  Star,
  GitFork,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Settings,
  Zap,
  Globe,
  ExternalLink,
  Layers,
  Terminal,
  Cpu,
  FileText,
  Activity,
  MessageSquare,
  Share2,
  BookOpen,
  LogOut,
  UserCircle,
  RadioTower,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { RoleType, PlatformType, ProjectSocialLinks } from '../../types';
import { githubService, IngestedProjectAnalysis } from '../../services/githubService';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    activeRole,
    selectRole,
    setCommandPaletteOpen,
    setActiveSection,
    isSidebarOpen,
    toggleSidebar,
    workspaces,
    activeWorkspace,
    switchWorkspace,
    createWorkspace,
  } = useProject();

  const { user, profile, projectRole, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'github' | 'manual'>('github');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ingestion & Web Scraping State
  const [githubUrl, setGithubUrl] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [discordUrl, setDiscordUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [docsUrl, setDocsUrl] = useState('');
  const [isSocialsExpanded, setIsSocialsExpanded] = useState(false);
  const [isAnalyzingGithub, setIsAnalyzingGithub] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  const [analyzedResult, setAnalyzedResult] = useState<IngestedProjectAnalysis | null>(null);

  interface DemoPreset {
    label: string;
    repo: string;
    deploy?: string;
    badge: string;
    stack: string;
    socials?: ProjectSocialLinks;
  }

  // One-Click Paired Presets with Socials
  const DEMO_PRESETS: DemoPreset[] = [
    {
      label: 'shadcn/ui Design System',
      repo: 'https://github.com/shadcn-ui/ui',
      deploy: '',
      badge: 'Design Primitives',
      stack: 'Next.js 15, React, Tailwind CSS',
    },
    {
      label: 'Strix Autonomous Pentest',
      repo: 'https://github.com/usestrix/strix',
      deploy: 'https://strix.ai',
      badge: 'AI Security Agent',
      stack: 'FastAPI, Python, AST Prober',
      socials: {
        twitter: 'https://x.com/usestrix',
        discord: 'https://discord.gg/strix',
        docs: 'https://docs.strix.ai',
      },
    },
    {
      label: 'VulnClaw Verifiable Solver',
      repo: 'https://github.com/Netw0rkNoob/VulnClaw',
      deploy: 'https://vulnclaw.dev',
      badge: 'Vulnerability Prober',
      stack: 'Python, Docker, HTTP Prober',
      socials: {
        twitter: 'https://x.com/vulnclaw',
        discord: 'https://discord.gg/vulnclaw',
        docs: 'https://vulnclaw.dev/docs',
      },
    },
    {
      label: 'Tailwind CSS Engine',
      repo: 'https://github.com/tailwindlabs/tailwindcss',
      deploy: 'https://tailwindcss.com',
      badge: 'Utility CSS',
      stack: 'Rust Core, Vite, CSS',
      socials: {
        twitter: 'https://x.com/tailwindcss',
        discord: 'https://discord.gg/tailwindcss',
        docs: 'https://tailwindcss.com/docs',
      },
    },
    {
      label: 'DevAtlas / SignalsLab',
      repo: 'https://github.com/devatlas/signalslab',
      deploy: 'https://signalslab.vercel.app',
      badge: 'Engineering Command Center',
      stack: 'Vercel Edge, Next.js, TypeScript',
      socials: {
        twitter: 'https://x.com/devatlas_ai',
        discord: 'https://discord.gg/devatlas',
        docs: 'https://signalslab.vercel.app/docs',
      },
    },
  ];

  // Manual Form State
  const [newWsName, setNewWsName] = useState('');
  const [newWsCode, setNewWsCode] = useState('');
  const [newWsTagline, setNewWsTagline] = useState('');
  const [newWsDescription, setNewWsDescription] = useState('');
  const [newWsVersion, setNewWsVersion] = useState('v1.0.0');
  const [newWsPlatform, setNewWsPlatform] = useState<PlatformType>('Cross-Platform');
  const [newWsTechStack, setNewWsTechStack] = useState('React, TypeScript, Node.js, Tailwind');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWorkspaceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnalyzeProject = async (
    overrideRepo?: string,
    overrideDeploy?: string,
    overrideSocials?: ProjectSocialLinks
  ) => {
    const repo = (overrideRepo || githubUrl).trim();
    const deploy = (overrideDeploy !== undefined ? overrideDeploy : deployedUrl).trim();
    const socials: ProjectSocialLinks = overrideSocials || {
      twitter: twitterUrl.trim() || undefined,
      discord: discordUrl.trim() || undefined,
      figma: figmaUrl.trim() || undefined,
      docs: docsUrl.trim() || undefined,
    };
    if (!repo) return;

    setIsAnalyzingGithub(true);
    setAnalyzedResult(null);
    setAnalysisLogs([]);

    const cleanUrl = repo.replace(/\/+$/, '');
    const parts = cleanUrl.split('/');
    const repoName = parts.pop() || 'project';
    const repoOwner = parts.pop() || 'repo';

    const addLog = (msg: string) => {
      setAnalysisStep(msg);
      setAnalysisLogs((prev) => [...prev, msg]);
    };

    addLog(`[1/5] Connecting to GitHub API (github.com/${repoOwner}/${repoName})...`);
    await new Promise((r) => setTimeout(r, 420));

    if (deploy) {
      addLog(`[2/5] Dispatching web scraper to deployed link (${deploy})...`);
      await new Promise((r) => setTimeout(r, 480));
    } else {
      addLog(`[2/5] Inspecting repository AST, dependencies & build targets...`);
      await new Promise((r) => setTimeout(r, 380));
    }

    if (socials.discord || socials.twitter || socials.figma || socials.docs) {
      const activeChannels = [
        socials.twitter && 'Twitter/X',
        socials.discord && 'Discord',
        socials.figma && 'Figma',
        socials.docs && 'Docs',
      ].filter(Boolean);
      addLog(`[3/5] Mining public sentiment & community signals (${activeChannels.join(', ')})...`);
      await new Promise((r) => setTimeout(r, 440));
    } else {
      addLog(`[3/5] Mining public sentiment & customer signals (App Store, GitHub, Discord, Reddit)...`);
      await new Promise((r) => setTimeout(r, 420));
    }

    addLog(`[4/5] Extracting design system tokens, Figma frames & WCAG accessibility scores...`);
    await new Promise((r) => setTimeout(r, 400));

    addLog(`[5/5] Synthesizing cross-role project memory for 6 disciplines (PM, Design, Dev, QA, Ops, Security)...`);

    try {
      const hasSocials = Object.values(socials).some(Boolean);
      const result = await githubService.analyzeProject({
        repoUrl: repo,
        deployedUrl: deploy || undefined,
        socialLinks: hasSocials ? socials : undefined,
      });
      setAnalyzedResult(result);
    } catch (err) {
      console.error('Failed to parse repository, deployed link and socials:', err);
    } finally {
      setIsAnalyzingGithub(false);
    }
  };

  const handleLaunchAnalyzedWorkspace = () => {
    if (!analyzedResult) return;

    createWorkspace(
      {
        name: analyzedResult.name,
        code: analyzedResult.code,
        tagline: analyzedResult.tagline,
        description: analyzedResult.description,
        version: analyzedResult.version,
        platform: analyzedResult.platform,
        activeSprint: `Sprint 1: Ingestion & Baseline Architecture`,
        owner: `${analyzedResult.owner} (Maintainer)`,
        techStack: analyzedResult.techStack,
        themeColor: '#0070f3',
        repoUrl: analyzedResult.repoUrl,
        deployedUrl: analyzedResult.deployedUrl,
        socialLinks: analyzedResult.socialLinks,
      },
      {
        prds: analyzedResult.prds,
        devTasks: analyzedResult.devTasks,
        contextBlocks: analyzedResult.contextBlocks,
        decisions: analyzedResult.decisions,
        securityFindings: analyzedResult.securityFindings,
        securityEvidence: analyzedResult.securityEvidence,
        feedback: analyzedResult.feedback,
        problemClusters: analyzedResult.problemClusters,
        featureRequests: analyzedResult.featureRequests,
        strategicInsights: analyzedResult.strategicInsights,
        roadmap: analyzedResult.roadmap,
        features: analyzedResult.features,
        designTokens: analyzedResult.designTokens,
        figmaSpecs: analyzedResult.figmaSpecs,
        validationSessions: analyzedResult.validationSessions,
        uxFindings: analyzedResult.uxFindings,
        personas: analyzedResult.personas,
        designReviews: analyzedResult.designReviews,
        sprintFeatures: analyzedResult.sprintFeatures,
        sandboxBuilds: analyzedResult.sandboxBuilds,
        qaTestCases: analyzedResult.qaTestCases,
        bugs: analyzedResult.bugs,
        readinessChecks: analyzedResult.readinessChecks,
        releases: analyzedResult.releases,
        incidents: analyzedResult.incidents,
        maintenanceTasks: analyzedResult.maintenanceTasks,
        meetings: analyzedResult.meetings,
        secondBrainNotes: analyzedResult.secondBrainNotes,
        metrics: analyzedResult.metrics,
      }
    );

    setIsCreateModalOpen(false);
    setIsWorkspaceDropdownOpen(false);
    setGithubUrl('');
    setDeployedUrl('');
    setTwitterUrl('');
    setDiscordUrl('');
    setFigmaUrl('');
    setDocsUrl('');
    setIsSocialsExpanded(false);
    setAnalyzedResult(null);
    setAnalysisLogs([]);
  };

  const handleCreateWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWsName || !newWsCode) return;

    createWorkspace({
      name: newWsName,
      code: newWsCode.toUpperCase(),
      tagline: newWsTagline || 'Autonomous lifecycle workspace',
      description: newWsDescription || `Dedicated Dev Atlas workspace for ${newWsName}.`,
      version: newWsVersion || 'v1.0.0',
      platform: newWsPlatform,
      activeSprint: 'Sprint 1: Baseline Architecture',
      owner: 'Product Engineering Lead',
      techStack: newWsTechStack.split(',').map((s) => s.trim()).filter(Boolean),
      themeColor: '#0070f3',
    });

    setIsCreateModalOpen(false);
    setIsWorkspaceDropdownOpen(false);
    setNewWsName('');
    setNewWsCode('');
    setNewWsTagline('');
    setNewWsDescription('');
  };

  const roleTabs: Array<{ id: RoleType; label: string; icon: string }> = [
    { id: 'all', label: 'All', icon: '🌐' },
    { id: 'pm', label: 'Product', icon: '📊' },
    { id: 'designer', label: 'Design', icon: '🎨' },
    { id: 'dev', label: 'Eng', icon: '💻' },
    { id: 'qa', label: 'QA', icon: '🧪' },
    { id: 'ops', label: 'Ops', icon: '🚀' },
  ];

  return (
    <>
      {/* Floating Circular Navbar Island */}
      <header className="sticky top-0 z-40 w-full px-2.5 sm:px-4 pt-2 pb-1.5 bg-[#FAF7F2]/80 backdrop-blur-xs">
        <div className="mx-auto max-w-[1536px] w-full h-15 sm:h-16 rounded-full border border-[#E5DFD5] bg-white/95 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(24,24,27,0.06)] px-3.5 sm:px-5 flex items-center justify-between gap-2.5 transition-all">
          {/* Left: DevAtlas Logo (First & Prominent), Sidebar Toggle & Workspace Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile menu trigger */}
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="rounded-full p-2 text-[#52525b] hover:bg-[#FAF7F2] hover:text-[#18181b] lg:hidden touch-target flex items-center justify-center cursor-pointer transition-all"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            {/* DevAtlas Official Brand Logo — High Visibility (Anchored First) */}
            <div
              onClick={() => setActiveSection('overview')}
              className="flex items-center cursor-pointer group shrink-0 pl-1.5 sm:pl-3 py-1"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveSection('overview');
                }
              }}
              aria-label="DevAtlas — Project Memory for Builders"
              title="DevAtlas — Project Memory for Builders"
            >
              <img
                src="/devatlas-topnav-logo.png"
                alt="DevAtlas — Project Memory for Builders"
                className="h-11 sm:h-12 md:h-[50px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03] drop-shadow-sm"
                style={{ maxHeight: 50, minHeight: 42 }}
              />
            </div>

            {/* Desktop Sidebar Collapse/Expand Toggle (Circular Icon Button) */}
            <button
              onClick={toggleSidebar}
              className={`hidden lg:flex items-center justify-center w-8.5 h-8.5 rounded-full border transition-all cursor-pointer shadow-2xs ${
                isSidebarOpen
                  ? 'border-[#EBE5DC] bg-[#FAF7F2] text-[#52525b] hover:text-[#18181b] hover:bg-white hover:border-[#FF6039]/40'
                  : 'border-[#18181b] bg-[#18181b] text-white shadow-xs'
              }`}
              aria-label={isSidebarOpen ? 'Hide left navigation bar' : 'Show left navigation bar'}
              title={isSidebarOpen ? 'Hide left navigation bar' : 'Show left navigation bar'}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="h-4 w-4" />
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </button>

            {/* Multi-Project Workspace Switcher (Pill Style) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#EBE5DC] bg-[#FAF7F2] px-3 py-1.5 text-xs text-[#18181b] hover:border-[#FF6039]/50 hover:bg-white hover:shadow-2xs transition-all max-w-[150px] sm:max-w-[200px] cursor-pointer shadow-2xs"
                aria-label="Switch project workspace or create a new project"
                aria-expanded={isWorkspaceDropdownOpen}
                title="Switch project workspace or create a new project"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] shrink-0" />
                <div className="flex items-center gap-1 truncate font-sans font-semibold">
                  <span className="font-mono text-[9px] font-bold bg-[#E5E7EB] px-1.5 py-0.5 rounded-full text-[#161616] shrink-0">
                    {activeWorkspace.code}
                  </span>
                  <span className="font-medium text-[11px] truncate text-[#161616] hidden xs:inline">
                    {activeWorkspace.name}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-[#525252] shrink-0 ml-auto" />
              </button>

              {/* Dropdown Menu */}
              {isWorkspaceDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl border border-[#EBE5DC] bg-white p-2.5 shadow-xl z-50 animate-scale-in">
                  <div className="px-2.5 py-1.5 text-[11px] font-mono font-semibold uppercase text-[#525252] flex items-center justify-between">
                    <span>Project Workspaces ({workspaces.length})</span>
                    <span className="text-[#047857] text-[10px] font-bold">Active</span>
                  </div>

                  <div className="space-y-1 my-1 max-h-64 overflow-y-auto">
                    {workspaces.map((ws) => {
                      const isSelected = ws.id === activeWorkspace.id;
                      return (
                        <button
                          key={ws.id}
                          onClick={() => {
                            switchWorkspace(ws.id);
                            setIsWorkspaceDropdownOpen(false);
                          }}
                          className={`flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left transition-all ${
                            isSelected
                              ? 'bg-[#FAF7F2] border border-[#EBE5DC] shadow-xs'
                              : 'hover:bg-[#FAF7F2]/60'
                          }`}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#161616] text-white font-mono text-[10px] font-bold">
                            {ws.code.substring(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-[#161616] truncate">
                                {ws.name}
                              </span>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-[#047857] shrink-0 ml-1" />
                              )}
                            </div>
                            <p className="text-[10px] text-[#525252] truncate font-medium">{ws.tagline}</p>
                            <div className="mt-1 flex items-center gap-2 text-[9px] font-mono text-[#525252]">
                              <span>{ws.version}</span>
                              <span>•</span>
                              <span>{ws.platform}</span>
                              <span>•</span>
                              <span className="text-[#047857] font-semibold">{ws.healthScore}% Health</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#EBE5DC] pt-2 mt-1">
                    <button
                      onClick={() => {
                        setIsCreateModalOpen(true);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#d4d4d8] bg-[#FAF7F2] py-2 text-xs font-semibold text-[#161616] hover:border-[#161616] hover:bg-white transition-all"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Import GitHub Repository</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Top Navbar Role Navigation (Circular Capsule) */}
          <nav aria-label="Role Perspectives" className="flex items-center overflow-x-auto no-scrollbar rounded-full bg-[#FAF7F2] p-1 border border-[#EBE5DC] gap-0.5 shrink-0 max-w-[200px] xs:max-w-[260px] sm:max-w-none shadow-2xs">
            {roleTabs.map((role) => {
              const isActive = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => selectRole(role.id)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3.5 py-1 text-xs font-medium whitespace-nowrap transition-all touch-target ${
                    isActive
                      ? 'bg-[#18181b] text-white shadow-xs font-bold'
                      : 'text-[#71717a] hover:text-[#18181b] hover:bg-white font-medium'
                  }`}
                  aria-label={`Switch to ${role.label} perspective`}
                  title={`Switch to ${role.label} perspective`}
                >
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-[#FF6039]" />}
                  <span>{role.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Universal Search, Quick Notes, AI Studio & User Profile (Circular Controls) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 rounded-full border border-[#EBE5DC] bg-[#FAF7F2] px-3.5 py-1.5 text-xs text-[#71717a] hover:border-[#18181b] hover:text-[#18181b] hover:bg-white transition-all cursor-pointer shadow-2xs"
              aria-label="Search and command palette (Command + K)"
              title="Search (⌘K)"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-xs font-medium">Search</span>
              <kbd className="hidden sm:inline-flex items-center rounded-full border border-[#d4d4d8] bg-white px-1.5 py-0.2 text-[9px] font-mono text-[#71717a] font-semibold">
                ⌘K
              </kbd>
            </button>

            {/* Scratchpad Notes */}
            <button
              onClick={() => setActiveSection('notes')}
              className="hidden 2xl:flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-white hover:bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#18181b] transition-all cursor-pointer shadow-2xs"
              aria-label="Open scratchpad notes"
              title="Scratchpad"
            >
              <PenTool className="h-3 w-3 text-[#71717a]" />
              <span className="text-xs">Notes</span>
            </button>

            {/* Connectors Quick Access */}
            <button
              onClick={() => setActiveSection('connectors')}
              className="hidden xl:flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-white hover:bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#18181b] transition-all cursor-pointer shadow-2xs hover:border-[#FF6039]/40"
              aria-label="Open Data Connectors & Ingestion Hub"
              title="Data Connectors & Ingestion Hub"
            >
              <RadioTower className="h-3 w-3 text-[#FF6039]" />
              <span className="text-xs">Connectors</span>
            </button>

            {/* AI Studio Action Button */}
            <button
              onClick={() => setActiveSection('prompts')}
              className="flex items-center gap-2 rounded-full bg-[#FF6039] hover:bg-[#E54D26] active:scale-95 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
              aria-label="Open AI Prompt Studio"
              title="AI Prompt Studio"
            >
              <img
                src="/dev-ai.png"
                alt="Dev AI"
                className="h-4 w-4 object-contain rounded-full bg-white/20 p-0.5"
                style={{ width: 16, height: 16 }}
              />
              <span className="text-xs hidden sm:inline font-bold">AI Studio</span>
            </button>

            <div className="h-4 w-px bg-[#EBE5DC] mx-0.5 hidden sm:block" />

            {/* User Auth & Profile Badge */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-white p-1 pr-2.5 shadow-2xs hover:border-[#FF6039]/50 transition-all cursor-pointer"
                  title={`Signed in as ${profile?.displayName || user.email} (${projectRole.toUpperCase()})`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#18181b] text-white flex items-center justify-center text-[10px] font-bold">
                    {(profile?.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden xl:inline text-xs font-semibold text-[#18181b] max-w-[70px] truncate">
                    {profile?.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-[9px] font-mono font-bold bg-[#FAF7F2] border border-[#EBE5DC] px-1.5 py-0.2 rounded-full text-[#FF6039]">
                    {projectRole.toUpperCase()}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-full border border-[#18181b] bg-[#18181b] hover:bg-[#333333] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
                  title="Sign In with Firebase"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-[#FF6039]" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Menu Dropdown */}
              {isUserMenuOpen && user && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#EBE5DC] bg-white p-2 shadow-xl z-50 animate-scale-in">
                  <div className="px-3 py-2 border-b border-[#EBE5DC] mb-1">
                    <p className="text-xs font-bold text-[#161616] truncate">{profile?.displayName || 'DevAtlas User'}</p>
                    <p className="text-[10px] font-mono text-[#71717a] truncate">{user.email}</p>
                    <div className="mt-1 inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-[#FAF7F2] border border-[#EBE5DC] px-1.5 py-0.5 rounded text-[#FF6039]">
                      Role: {projectRole.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-[#161616] hover:bg-[#FAF7F2] transition-colors"
                  >
                    <UserCircle className="h-3.5 w-3.5 text-[#71717a]" />
                    <span>Switch Profile / Demo</span>
                  </button>
                  <button
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await signOut();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Create / Import Project Workspace Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsCreateModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-2xl z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#171717] text-white">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#171717]">New Project Workspace</h3>
                  <p className="text-xs text-[#8f8f8f]">Create an isolated workspace or import from a GitHub repository</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-[6px] text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-[8px] bg-[#f5f5f5] p-1 border border-[#ebebeb] mb-5">
              <button
                type="button"
                onClick={() => setCreationMode('github')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-[6px] py-1.5 text-xs font-medium transition-all ${
                  creationMode === 'github'
                    ? 'bg-white text-[#171717] font-semibold shadow-xs border border-[#ebebeb]'
                    : 'text-[#8f8f8f] hover:text-[#171717]'
                }`}
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub Link</span>
              </button>
              <button
                type="button"
                onClick={() => setCreationMode('manual')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-[6px] py-1.5 text-xs font-medium transition-all ${
                  creationMode === 'manual'
                    ? 'bg-white text-[#171717] font-semibold shadow-xs border border-[#ebebeb]'
                    : 'text-[#8f8f8f] hover:text-[#171717]'
                }`}
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>Manual Configuration</span>
              </button>
            </div>

            {/* GitHub & Deployed Link Ingestion Mode */}
            {creationMode === 'github' ? (
              <div className="space-y-4 font-sans">
                {/* Inputs Grid */}
                <div className="space-y-3">
                  {/* Input 1: GitHub Repo URL */}
                  <div>
                    <label className="block text-xs font-mono text-[#71717a] uppercase tracking-wider mb-1.5 font-semibold">
                      1. GitHub Repository URL *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#71717a]">
                        <Github className="h-4 w-4" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://github.com/shadcn-ui/ui or https://github.com/owner/repo"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAnalyzeProject();
                          }
                        }}
                        className="w-full rounded-xl border border-[#EBE5DC] bg-[#FAF7F2] pl-9 pr-3 py-2.5 text-xs font-mono text-[#18181b] focus:border-[#FF6039] focus:bg-white focus:outline-none transition-all shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Input 2: Live Deployed Application URL */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono text-[#71717a] uppercase tracking-wider font-semibold">
                        2. Live Deployed Link (Web Scraping & Prober)
                      </label>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                        Live DOM & Sentiment Extractor
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emerald-600">
                        <Globe className="h-4 w-4" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://ui.shadcn.com or https://my-app.vercel.app"
                        value={deployedUrl}
                        onChange={(e) => setDeployedUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAnalyzeProject();
                          }
                        }}
                        className="w-full rounded-xl border border-[#EBE5DC] bg-[#FAF7F2] pl-9 pr-3 py-2.5 text-xs font-mono text-[#18181b] focus:border-[#FF6039] focus:bg-white focus:outline-none transition-all shadow-2xs"
                      />
                    </div>
                    <p className="text-[11px] text-[#71717a] mt-1 font-sans">
                      DevAtlas will scrape the live DOM, inspect OpenGraph metadata, measure response latency, extract design system tokens, and populate cross-role project memory.
                    </p>
                  </div>

                  {/* Input 3: Socials & Community Channels (Expandable Accordion) */}
                  <div className="rounded-xl border border-[#EBE5DC] bg-[#FAF7F2] p-3 space-y-3 transition-all shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setIsSocialsExpanded(!isSocialsExpanded)}
                      className="flex items-center justify-between w-full text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white border border-[#EBE5DC] text-[#FF6039] group-hover:border-[#FF6039] transition-colors shadow-2xs">
                          <Share2 className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <span className="block text-xs font-mono font-bold text-[#18181b] uppercase tracking-wider">
                            3. Socials & Community Channels (Optional)
                          </span>
                          <span className="block text-[11px] text-[#71717a] font-sans">
                            Connect Twitter/X, Discord, Figma, and Docs to scrape community feedback & specs
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {(twitterUrl || discordUrl || figmaUrl || docsUrl) && (
                          <span className="text-[10px] font-mono font-bold text-[#FF6039] bg-[#FF6039]/10 px-2 py-0.5 rounded-full border border-[#FF6039]/20">
                            {[twitterUrl, discordUrl, figmaUrl, docsUrl].filter(Boolean).length} Connected
                          </span>
                        )}
                        <ChevronDown
                          className={`h-4 w-4 text-[#71717a] transition-transform duration-200 ${
                            isSocialsExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {isSocialsExpanded && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-[#EBE5DC]/70 animate-fade-in">
                        {/* Twitter / X */}
                        <div>
                          <label className="block text-[11px] font-mono text-[#71717a] uppercase tracking-wider mb-1 font-semibold flex items-center gap-1.5">
                            <span className="font-bold text-[#18181b]">𝕏</span>
                            <span>Twitter / X Profile</span>
                          </label>
                          <input
                            type="text"
                            placeholder="https://x.com/shadcn or @shadcn"
                            value={twitterUrl}
                            onChange={(e) => setTwitterUrl(e.target.value)}
                            className="w-full rounded-xl border border-[#EBE5DC] bg-white px-3 py-2 text-xs font-mono text-[#18181b] focus:border-[#FF6039] focus:outline-none transition-all shadow-2xs"
                          />
                        </div>

                        {/* Discord */}
                        <div>
                          <label className="block text-[11px] font-mono text-[#71717a] uppercase tracking-wider mb-1 font-semibold flex items-center gap-1.5">
                            <MessageSquare className="h-3 w-3 text-[#5865F2]" />
                            <span>Discord Server / Invite</span>
                          </label>
                          <input
                            type="text"
                            placeholder="https://discord.gg/shadcn"
                            value={discordUrl}
                            onChange={(e) => setDiscordUrl(e.target.value)}
                            className="w-full rounded-xl border border-[#EBE5DC] bg-white px-3 py-2 text-xs font-mono text-[#18181b] focus:border-[#FF6039] focus:outline-none transition-all shadow-2xs"
                          />
                        </div>

                        {/* Figma */}
                        <div>
                          <label className="block text-[11px] font-mono text-[#71717a] uppercase tracking-wider mb-1 font-semibold flex items-center gap-1.5">
                            <PenTool className="h-3 w-3 text-[#F24E1E]" />
                            <span>Figma Specs / Team</span>
                          </label>
                          <input
                            type="text"
                            placeholder="https://figma.com/@shadcn"
                            value={figmaUrl}
                            onChange={(e) => setFigmaUrl(e.target.value)}
                            className="w-full rounded-xl border border-[#EBE5DC] bg-white px-3 py-2 text-xs font-mono text-[#18181b] focus:border-[#FF6039] focus:outline-none transition-all shadow-2xs"
                          />
                        </div>

                        {/* Docs */}
                        <div>
                          <label className="block text-[11px] font-mono text-[#71717a] uppercase tracking-wider mb-1 font-semibold flex items-center gap-1.5">
                            <BookOpen className="h-3 w-3 text-emerald-600" />
                            <span>Documentation Hub</span>
                          </label>
                          <input
                            type="text"
                            placeholder="https://ui.shadcn.com/docs"
                            value={docsUrl}
                            onChange={(e) => setDocsUrl(e.target.value)}
                            className="w-full rounded-xl border border-[#EBE5DC] bg-white px-3 py-2 text-xs font-mono text-[#18181b] focus:border-[#FF6039] focus:outline-none transition-all shadow-2xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trigger Button */}
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="button"
                      disabled={!githubUrl.trim() || isAnalyzingGithub}
                      onClick={() => handleAnalyzeProject()}
                      className="flex items-center gap-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] px-5 py-2.5 text-xs font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer active:scale-98"
                    >
                      {isAnalyzingGithub ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-[#FF6039]" />
                          <span>Scraping Sources & Synthesizing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-[#FF6039]" />
                          <span>Scrape Sources & Ingest Project</span>
                          <ArrowRight className="h-3.5 w-3.5 opacity-70" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 1-Click Paired Presets */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-[#71717a] font-semibold uppercase tracking-wider">
                      One-Click Demo Presets (Repo + Live Deployed Link + Socials):
                    </span>
                    <span className="text-[10px] text-[#71717a] font-sans">Click to test instant ingestion</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DEMO_PRESETS.map((sample) => (
                      <button
                        key={sample.repo}
                        type="button"
                        onClick={() => {
                          setGithubUrl(sample.repo);
                          setDeployedUrl(sample.deploy || '');
                          setTwitterUrl(sample.socials?.twitter || '');
                          setDiscordUrl(sample.socials?.discord || '');
                          setFigmaUrl(sample.socials?.figma || '');
                          setDocsUrl(sample.socials?.docs || '');
                          setIsSocialsExpanded(Boolean(sample.socials && Object.values(sample.socials).some(Boolean)));
                          handleAnalyzeProject(sample.repo, sample.deploy || '', sample.socials);
                        }}
                        className="rounded-xl border border-[#EBE5DC] bg-white p-2.5 text-left hover:border-[#FF6039]/50 hover:bg-[#FAF7F2] transition-all group shadow-2xs cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18181b] group-hover:text-[#FF6039] transition-colors">
                            {sample.label}
                          </span>
                          <span className="text-[9px] font-mono font-semibold bg-[#FAF7F2] text-[#71717a] px-1.5 py-0.5 rounded-md border border-[#EBE5DC]">
                            {sample.badge}
                          </span>
                        </div>
                        {sample.deploy ? (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#71717a] truncate">
                            <Globe className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{sample.deploy}</span>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-[#71717a] truncate">
                            <Github className="h-3 w-3 shrink-0 text-[#18181b]" />
                            <span className="truncate">GitHub Repository (Standalone)</span>
                          </div>
                        )}
                        <div className="mt-0.5 text-[10px] text-[#a1a1aa] font-sans">
                          {sample.stack}
                        </div>
                        {sample.socials && Object.values(sample.socials).some(Boolean) && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            {sample.socials?.twitter && (
                              <span className="text-[9px] font-mono bg-[#FAF7F2] px-1.5 py-0.2 rounded border border-[#EBE5DC] text-[#18181b] font-medium">𝕏 X</span>
                            )}
                            {sample.socials?.discord && (
                              <span className="text-[9px] font-mono bg-[#FAF7F2] px-1.5 py-0.2 rounded border border-[#EBE5DC] text-[#5865F2] font-medium">Discord</span>
                            )}
                            {sample.socials?.figma && (
                              <span className="text-[9px] font-mono bg-[#FAF7F2] px-1.5 py-0.2 rounded border border-[#EBE5DC] text-[#F24E1E] font-medium">Figma</span>
                            )}
                            {sample.socials?.docs && (
                              <span className="text-[9px] font-mono bg-[#FAF7F2] px-1.5 py-0.2 rounded border border-[#EBE5DC] text-emerald-700 font-medium">Docs</span>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Animated Web Scraping Terminal Console */}
                {isAnalyzingGithub && (
                  <div className="rounded-2xl border border-[#18181b] bg-[#0D0E12] p-4 text-white shadow-xl space-y-3 animate-fade-in font-mono">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[11px] text-white/60 font-semibold pl-1">
                          devatlas-scraper-daemon :: pipeline-active
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>PROBING ENDPOINTS</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-white/80 max-h-36 overflow-y-auto">
                      {analysisLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 shrink-0 font-bold">›</span>
                          <span className="leading-relaxed">{log}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 text-emerald-300 font-semibold pt-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FF6039]" />
                        <span className="animate-pulse">{analysisStep}</span>
                      </div>
                    </div>

                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#FF6039] to-emerald-400 h-1.5 rounded-full animate-pulse w-4/5" />
                    </div>
                  </div>
                )}

                {/* Scraped & Synthesized Multi-Role Dossier */}
                {analyzedResult && (
                  <div className="rounded-2xl border border-[#EBE5DC] bg-white p-5 sm:p-6 shadow-sm space-y-5 animate-scale-in">
                    {/* Top Status & GitHub Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#FAF7F2] pb-3.5 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="font-sans text-xs font-bold text-[#18181b]">
                            Multi-Role Ingestion & Web Scraping Complete
                          </span>
                          <p className="text-[10px] font-mono text-[#71717a]">
                            Synthesized cross-role intelligence for 6 roles
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-[#71717a]">
                        <span className="flex items-center gap-1 bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EBE5DC]">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {analyzedResult.starsCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EBE5DC]">
                          <GitFork className="h-3 w-3" />
                          {analyzedResult.forksCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EBE5DC] text-[#FF6039]">
                          <AlertCircle className="h-3 w-3" />
                          {analyzedResult.openIssuesCount} issues
                        </span>
                      </div>
                    </div>

                    {/* Live Deployed Site Scraped Dossier */}
                    {analyzedResult.scrapedData && (
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/40 p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-emerald-900">
                              LIVE DEPLOYED WEB SCRAPED TELEMETRY
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[10px]">
                            <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                              HTTP {analyzedResult.scrapedData.httpStatus} OK
                            </span>
                            <span className="bg-white text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                              ⚡ {analyzedResult.scrapedData.latencyMs}ms Latency
                            </span>
                            <span className="bg-white text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                              🔒 TLS 1.3
                            </span>
                          </div>
                        </div>

                        <div>
                          <a
                            href={analyzedResult.scrapedData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-sans font-bold text-sm text-[#18181b] hover:text-[#FF6039] inline-flex items-center gap-1 transition-colors"
                          >
                            {analyzedResult.scrapedData.title}
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </a>
                          <p className="text-xs text-[#52525b] mt-0.5 leading-relaxed">
                            {analyzedResult.scrapedData.description}
                          </p>
                        </div>

                        {analyzedResult.scrapedData.detectedTech.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-mono text-emerald-900 font-semibold uppercase">
                              Detected Stack:
                            </span>
                            {analyzedResult.scrapedData.detectedTech.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md bg-white px-2 py-0.5 text-[10px] font-mono text-emerald-900 border border-emerald-200 font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Connected Socials & Community Channels */}
                    {analyzedResult.socialLinks && Object.values(analyzedResult.socialLinks).some(Boolean) && (
                      <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/40 p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Share2 className="h-3.5 w-3.5 text-indigo-600" />
                            <span className="text-xs font-mono font-bold text-indigo-950 uppercase">
                              CONNECTED SOCIALS & COMMUNITY SIGNALS
                            </span>
                          </div>
                          <span className="bg-indigo-100 text-indigo-800 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-200">
                            Sentiment Stream Active
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {analyzedResult.socialLinks.twitter && (
                            <a
                              href={analyzedResult.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-xs font-mono font-semibold text-[#18181b] hover:border-indigo-400 hover:text-[#0070F3] transition-all shadow-2xs"
                            >
                              <span className="font-bold">𝕏</span>
                              <span>Twitter / X</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                            </a>
                          )}
                          {analyzedResult.socialLinks.discord && (
                            <a
                              href={analyzedResult.socialLinks.discord}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-xs font-mono font-semibold text-[#5865F2] hover:border-indigo-400 transition-all shadow-2xs"
                            >
                              <MessageSquare className="h-3 w-3" />
                              <span>Discord Server</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                            </a>
                          )}
                          {analyzedResult.socialLinks.figma && (
                            <a
                              href={analyzedResult.socialLinks.figma}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-xs font-mono font-semibold text-[#F24E1E] hover:border-indigo-400 transition-all shadow-2xs"
                            >
                              <PenTool className="h-3 w-3" />
                              <span>Figma Specs</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                            </a>
                          )}
                          {analyzedResult.socialLinks.docs && (
                            <a
                              href={analyzedResult.socialLinks.docs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 text-xs font-mono font-semibold text-emerald-700 hover:border-indigo-400 transition-all shadow-2xs"
                            >
                              <BookOpen className="h-3 w-3" />
                              <span>Documentation Hub</span>
                              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-[#52525b] font-sans">
                          Public discussions, bug reports, and design specs from these channels are synthesized into Customer Reviews, Problem Clusters, and Design Tokens.
                        </p>
                      </div>
                    )}

                    {/* Project Overview */}
                    <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                      <div className="col-span-2">
                        <span className="text-[10px] text-[#71717a] uppercase font-semibold">Workspace Name</span>
                        <p className="font-sans font-bold text-base text-[#18181b]">{analyzedResult.name}</p>
                        <p className="text-[11px] text-[#71717a]">by {analyzedResult.owner}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#71717a] uppercase font-semibold">Code / Health</span>
                        <p className="font-mono font-bold text-lg text-[#FF6039]">
                          {analyzedResult.code}
                        </p>
                        <span className="text-[11px] text-emerald-600 font-semibold">
                          {analyzedResult.metrics.compositeHealth}% Composite Score
                        </span>
                      </div>
                    </div>

                    {/* Multi-Role Populated Intelligence Matrix */}
                    <div className="rounded-xl bg-[#FAF7F2] p-4 border border-[#EBE5DC] space-y-3">
                      <div className="flex items-center justify-between text-[#18181b] font-bold text-xs">
                        <span>✨ Synthesized Project Memory Across All Roles:</span>
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full font-semibold">
                          All 6 Roles Ready
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs font-mono">
                        <div className="bg-white p-2.5 rounded-lg border border-[#EBE5DC]">
                          <span className="text-[#FF6039] font-bold block mb-1">📊 Product (PM)</span>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.prds.length} PRDs & Criteria</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.feedback.length} Customer reviews</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.problemClusters.length} Issue clusters</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-[#EBE5DC]">
                          <span className="text-[#8b5cf6] font-bold block mb-1">🎨 Design</span>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.figmaSpecs.length} Figma specs</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.designTokens.length} Design tokens</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.uxFindings.length} UX research findings</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-[#EBE5DC]">
                          <span className="text-[#0284c7] font-bold block mb-1">💻 Engineering</span>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.devTasks.length} Kanban dev tasks</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.sandboxBuilds.length} Edge sandbox builds</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.decisions.length} ADR decisions</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-[#EBE5DC]">
                          <span className="text-[#059669] font-bold block mb-1">🧪 QA & Security</span>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.qaTestCases.length} Automated tests</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.bugs.length} Triaged bug items</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.securityFindings.length} OWASP AST findings</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-[#EBE5DC]">
                          <span className="text-[#d97706] font-bold block mb-1">🚀 Operations</span>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.releases.length} Releases mapped</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.incidents.length} Incident logs</p>
                          <p className="text-[11px] text-[#52525b]">• 99.98% SLA telemetry</p>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-[#EBE5DC]">
                          <span className="text-[#4b5563] font-bold block mb-1">🧠 Project Memory</span>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.meetings.length} Kickoff team sync</p>
                          <p className="text-[11px] text-[#52525b]">• {analyzedResult.secondBrainNotes.length} AI refined notes</p>
                          <p className="text-[11px] text-[#52525b]">• Full change ledger</p>
                        </div>
                      </div>
                    </div>

                    {/* Launch Action */}
                    <div className="border-t border-[#EBE5DC] pt-3 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setAnalyzedResult(null)}
                        className="text-xs text-[#71717a] hover:text-[#18181b] font-medium"
                      >
                        ← Re-enter inputs
                      </button>
                      <button
                        type="button"
                        onClick={handleLaunchAnalyzedWorkspace}
                        className="flex items-center gap-2 rounded-xl bg-[#18181b] hover:bg-[#27272a] px-6 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer active:scale-98"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>🚀 Launch & Populate All Roles</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Manual Workspace Configuration Form */
              <form onSubmit={handleCreateWorkspaceSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CyberShield Intelligence"
                      value={newWsName}
                      onChange={(e) => {
                        setNewWsName(e.target.value);
                        if (!newWsCode && e.target.value.length >= 3) {
                          setNewWsCode(e.target.value.substring(0, 4).toUpperCase());
                        }
                      }}
                      className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2 text-xs text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                      Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="CSOC"
                      value={newWsCode}
                      onChange={(e) => setNewWsCode(e.target.value.toUpperCase())}
                      className="w-full font-mono uppercase rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2 text-xs text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                    Tagline / Core Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Autonomous real-time threat intelligence & SOC orchestration"
                    value={newWsTagline}
                    onChange={(e) => setNewWsTagline(e.target.value)}
                    className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2 text-xs text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                      Target Platform
                    </label>
                    <select
                      value={newWsPlatform}
                      onChange={(e) => setNewWsPlatform(e.target.value as PlatformType)}
                      className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2 text-xs text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
                    >
                      <option value="Cross-Platform">Cross-Platform</option>
                      <option value="Web">Web Application</option>
                      <option value="Mobile">Mobile (iOS / Android)</option>
                      <option value="Backend / Cloud">Backend / Cloud Infrastructure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                      Initial Version
                    </label>
                    <input
                      type="text"
                      value={newWsVersion}
                      onChange={(e) => setNewWsVersion(e.target.value)}
                      placeholder="v1.0.0"
                      className="w-full font-mono rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2 text-xs text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                    Tech Stack (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, TypeScript, Rust, Kafka, PostgreSQL"
                    value={newWsTechStack}
                    onChange={(e) => setNewWsTechStack(e.target.value)}
                    className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2 text-xs text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                    Architecture Overview / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe key architectural requirements and target release outcomes..."
                    value={newWsDescription}
                    onChange={(e) => setNewWsDescription(e.target.value)}
                    className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2 text-xs text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#ebebeb] pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="rounded-[6px] border border-[#ebebeb] bg-white px-3 py-1.5 text-xs text-[#8f8f8f] hover:bg-[#fafafa]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-[6px] bg-[#171717] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-xs"
                  >
                    Create & Launch Workspace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Firebase Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
