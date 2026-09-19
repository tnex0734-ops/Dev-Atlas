import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  PenTool,
  Sparkles,
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
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { RoleType, PlatformType } from '../../types';
import { githubService, GitHubRepoAnalysis } from '../../services/githubService';

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

  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'github' | 'manual'>('github');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // GitHub Real Ingestion State
  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzingGithub, setIsAnalyzingGithub] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [analyzedResult, setAnalyzedResult] = useState<GitHubRepoAnalysis | null>(null);

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

  const handleAnalyzeGithub = async (urlToAnalyze?: string) => {
    const url = (urlToAnalyze || githubUrl).trim();
    if (!url) return;

    setIsAnalyzingGithub(true);
    setAnalyzedResult(null);

    const cleanUrl = url.replace(/\/+$/, '');
    const parts = cleanUrl.split('/');
    const repoName = parts.pop() || 'project';
    const repoOwner = parts.pop() || 'repo';

    setAnalysisStep(`Querying live GitHub API for ${repoOwner}/${repoName}...`);
    await new Promise((r) => setTimeout(r, 400));

    setAnalysisStep(`Parsing README.md & codebase language distributions...`);
    await new Promise((r) => setTimeout(r, 450));

    setAnalysisStep(`Synthesizing real PRDs, Kanban tasks & AST security profile...`);
    
    try {
      const result = await githubService.analyzeRepository(url);
      setAnalyzedResult(result);
    } catch (err) {
      console.error('Failed to parse repository:', err);
    } finally {
      setIsAnalyzingGithub(false);
      setAnalysisStep('');
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
      },
      {
        prds: analyzedResult.prds,
        devTasks: analyzedResult.devTasks,
        contextBlocks: analyzedResult.contextBlocks,
        decisions: analyzedResult.decisions,
        securityFindings: analyzedResult.securityFindings,
        securityEvidence: analyzedResult.securityEvidence,
      }
    );

    setIsCreateModalOpen(false);
    setIsWorkspaceDropdownOpen(false);
    setGithubUrl('');
    setAnalyzedResult(null);
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
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[#e5e7eb] bg-white/95 px-3 sm:px-4 backdrop-blur-md gap-2">
        {/* Left: Brand, Sidebar Toggle & Multi-Project Workspace Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Mobile menu trigger */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-[6px] p-2 text-[#404040] hover:bg-[#f5f5f5] hover:text-[#171717] lg:hidden touch-target flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Desktop Sidebar Hide/Show Toggle */}
          <button
            onClick={toggleSidebar}
            className={`hidden lg:flex items-center gap-1 rounded-[6px] border px-2 py-1 text-xs font-mono transition-all ${
              isSidebarOpen
                ? 'border-[#e5e7eb] bg-[#fafafa] text-[#171717] hover:bg-[#f2f2f2]'
                : 'border-[#171717] bg-[#171717] text-white shadow-xs'
            }`}
            aria-label={isSidebarOpen ? 'Hide left navigation bar' : 'Show left navigation bar'}
            title={isSidebarOpen ? 'Hide left navigation bar' : 'Show left navigation bar'}
          >
            {isSidebarOpen ? (
              <>
                <PanelLeftClose className="h-3.5 w-3.5" />
                <span className="hidden 2xl:inline text-[10px]">Hide Nav</span>
              </>
            ) : (
              <>
                <PanelLeftOpen className="h-3.5 w-3.5" />
                <span className="hidden 2xl:inline text-[10px]">Show Nav</span>
              </>
            )}
          </button>

          {/* Dev Atlas Logo */}
          <div
            onClick={() => setActiveSection('overview')}
            className="flex items-center gap-1.5 cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setActiveSection('overview');
              }
            }}
            aria-label="Go to Overview dashboard"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-[5px] bg-[#171717] text-white font-bold transition-transform group-hover:scale-105">
              <span className="text-[10px]">▲</span>
            </div>
            <span className="font-sans font-bold tracking-tight text-[#171717] text-sm hidden sm:inline">
              Dev Atlas
            </span>
          </div>

          {/* Multi-Project Workspace Switcher Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="flex items-center gap-1.5 rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] px-2 py-1 text-xs text-[#171717] hover:border-[#171717] transition-all max-w-[150px] sm:max-w-[180px]"
              aria-label="Switch project workspace or create a new project"
              aria-expanded={isWorkspaceDropdownOpen}
              title="Switch project workspace or create a new project"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] shrink-0" />
              <div className="flex items-center gap-1 truncate">
                <span className="font-mono text-[9px] font-semibold bg-[#e5e7eb] px-1 py-0.2 rounded text-[#171717] shrink-0">
                  {activeWorkspace.code}
                </span>
                <span className="font-medium text-[11px] truncate text-[#171717]">
                  {activeWorkspace.name}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-[#525252] shrink-0 ml-auto" />
            </button>

            {/* Dropdown Menu */}
            {isWorkspaceDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-80 rounded-[8px] border border-[#e5e7eb] bg-white p-2 shadow-xl z-50 animate-scale-in">
                <div className="px-2 py-1.5 text-[11px] font-mono font-semibold uppercase text-[#525252] flex items-center justify-between">
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
                        className={`flex w-full items-start gap-2.5 rounded-[6px] p-2 text-left transition-all ${
                          isSelected
                            ? 'bg-[#fafafa] border border-[#e5e7eb] shadow-xs'
                            : 'hover:bg-[#f5f5f5]'
                        }`}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-[#171717] text-white font-mono text-[10px] font-bold">
                          {ws.code.substring(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#171717] truncate">
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

                <div className="border-t border-[#e5e7eb] pt-1.5 mt-1">
                  <button
                    onClick={() => {
                      setIsCreateModalOpen(true);
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-dashed border-[#d4d4d8] bg-[#fafafa] py-1.5 text-xs font-medium text-[#171717] hover:border-[#171717] hover:bg-white transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Import GitHub Repository</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Top Navbar Role Navigation Options (Pill Switcher - Responsive across desktop, tablet & mobile) */}
        <nav aria-label="Role Perspectives" className="flex items-center overflow-x-auto no-scrollbar rounded-full bg-[#f4f4f5] p-0.5 border border-[#e4e4e7] gap-0.5 shrink-0 max-w-[200px] xs:max-w-[260px] sm:max-w-none">
          {roleTabs.map((role) => {
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => selectRole(role.id)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-all touch-target ${
                  isActive
                    ? 'bg-[#171717] text-white shadow-xs font-bold'
                    : 'text-[#404040] hover:text-[#171717] hover:bg-white/80 font-semibold'
                }`}
                aria-label={`Switch to ${role.label} perspective`}
                title={`Switch to ${role.label} perspective`}
              >
                <span>{role.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Universal ⌘K Search, Quick Note, & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-1.5 rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] px-2.5 py-1 text-xs text-[#525252] hover:border-[#171717] hover:text-[#171717] transition-all"
            aria-label="Search and command palette (Command + K)"
            title="Search (⌘K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[11px] font-medium">Search</span>
            <kbd className="hidden sm:inline-flex items-center rounded-[3px] border border-[#d4d4d8] bg-white px-1 text-[9px] font-mono text-[#525252] font-semibold">
              ⌘K
            </kbd>
          </button>

          {/* Scratchpad (Desktop Extra) */}
          <button
            onClick={() => setActiveSection('notes')}
            className="hidden 2xl:flex items-center gap-1 rounded-[6px] border border-[#e5e7eb] bg-white px-2 py-1 text-xs font-medium text-[#171717] hover:bg-[#fafafa] transition-all"
            aria-label="Open scratchpad notes"
            title="Scratchpad"
          >
            <PenTool className="h-3 w-3 text-[#525252]" />
            <span className="text-[11px]">Notes</span>
          </button>

          {/* AI Prompts Action */}
          <button
            onClick={() => setActiveSection('prompts')}
            className="flex items-center gap-1 rounded-[6px] bg-[#171717] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-xs"
            aria-label="Open AI Prompt Studio"
            title="AI Prompt Studio"
          >
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span className="text-[11px] hidden sm:inline">AI Studio</span>
          </button>

          <div className="h-3.5 w-px bg-[#e5e7eb]" />

          {/* Workspace Lead Profile Badge */}
          <div
            className="flex items-center gap-1.5 rounded-[6px] border border-[#e5e7eb] bg-white px-2 py-1"
            title={`Workspace Lead: ${activeWorkspace.owner || 'Lead Architect'}`}
          >
            <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
              {(activeWorkspace.owner || 'A')[0].toUpperCase()}
            </div>
            <span className="hidden xl:inline text-[11px] font-semibold text-neutral-800 max-w-[80px] truncate">
              {activeWorkspace.owner?.split(' ')[0] || 'Lead'}
            </span>
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

            {/* GitHub Import Mode */}
            {creationMode === 'github' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1.5">
                    Enter GitHub Repository Link
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8f8f8f]">
                        <Github className="h-4 w-4" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://github.com/usestrix/strix or https://github.com/owner/repo"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAnalyzeGithub();
                          }
                        }}
                        className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] pl-9 pr-3 py-2 text-xs font-mono text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!githubUrl.trim() || isAnalyzingGithub}
                      onClick={() => handleAnalyzeGithub()}
                      className="flex items-center gap-1.5 rounded-[6px] bg-[#171717] px-4 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {isAnalyzingGithub ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Analyze Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Reference Repositories Chips */}
                <div>
                  <span className="text-[11px] font-mono text-[#8f8f8f] block mb-1.5">
                    Reference repositories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'usestrix/strix (Strix Security Core)', url: 'https://github.com/usestrix/strix' },
                      { label: 'Netw0rkNoob/VulnClaw (VulnClaw Solver)', url: 'https://github.com/Netw0rkNoob/VulnClaw' },
                      { label: 'tailwindlabs/tailwindcss', url: 'https://github.com/tailwindlabs/tailwindcss' },
                      { label: 'shadcn/ui (Design System)', url: 'https://github.com/shadcn-ui/ui' },
                    ].map((sample) => (
                      <button
                        key={sample.url}
                        type="button"
                        onClick={() => {
                          setGithubUrl(sample.url);
                          handleAnalyzeGithub(sample.url);
                        }}
                        className="rounded-[4px] border border-[#ebebeb] bg-[#fafafa] px-2.5 py-1 text-[11px] font-mono text-[#4d4d4d] hover:bg-[#f2f2f2] hover:text-[#171717] transition-all"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                {isAnalyzingGithub && (
                  <div className="rounded-[8px] border border-[#ebebeb] bg-[#fafafa] p-4 space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#171717]">
                      <Loader2 className="h-4 w-4 animate-spin text-[#0070f3]" />
                      <span className="font-semibold">{analysisStep}</span>
                    </div>
                    <div className="w-full bg-[#ebebeb] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#0070f3] h-1.5 rounded-full animate-pulse w-4/5" />
                    </div>
                  </div>
                )}

                {/* Analyzed Workspace Card Preview */}
                {analyzedResult && (
                  <div className="rounded-[10px] border border-[#ebebeb] bg-white p-5 shadow-sm space-y-4 animate-scale-in">
                    <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#047857]" />
                        <span className="font-sans text-xs font-semibold text-[#171717]">
                          Repository Analysis Complete
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono text-[#8f8f8f]">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {analyzedResult.starsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {analyzedResult.forksCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-[#0070f3]" />
                          {analyzedResult.openIssuesCount} issues
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                      <div className="col-span-2">
                        <span className="text-[10px] text-[#8f8f8f] uppercase">Project Name & Owner</span>
                        <p className="font-sans font-semibold text-sm text-[#171717]">{analyzedResult.name}</p>
                        <p className="text-[11px] text-[#8f8f8f]">by {analyzedResult.owner}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8f8f8f] uppercase">Workspace Code</span>
                        <p className="font-mono font-semibold text-base text-[#0070f3]">
                          {analyzedResult.code}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#8f8f8f] uppercase">Description</span>
                      <p className="text-xs text-[#4d4d4d] leading-relaxed mt-0.5">{analyzedResult.description}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[#8f8f8f] uppercase block mb-1">Tech Stack</span>
                      <div className="flex flex-wrap gap-1.5">
                        {analyzedResult.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-[4px] bg-[#f5f5f5] px-2 py-0.5 text-[11px] font-mono text-[#171717] border border-[#ebebeb] font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Preview of Ingested PRDs & Security Profile */}
                    <div className="rounded-[6px] bg-[#fafafa] p-3 border border-[#ebebeb] text-xs font-mono space-y-1.5">
                      <div className="flex items-center justify-between text-[#047857] font-semibold text-[10px] uppercase">
                        <span>✨ Generated Project Specifications:</span>
                        <span>Complete</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4d4d4d]">
                        <div>• {analyzedResult.prds.length} PRDs & Acceptance Criteria</div>
                        <div>• {analyzedResult.devTasks.length} Kanban Sprint Tasks</div>
                        <div>• {analyzedResult.contextBlocks.length} Architectural Context Blocks</div>
                        <div>• {analyzedResult.securityFindings.length} OWASP Security Findings</div>
                      </div>
                    </div>

                    <div className="border-t border-[#ebebeb] pt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleLaunchAnalyzedWorkspace}
                        className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-5 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-xs"
                      >
                        <ShieldCheck className="h-4 w-4 text-[#10b981]" />
                        <span>🚀 Launch Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
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
    </>
  );
};
