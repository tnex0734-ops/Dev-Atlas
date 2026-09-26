import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Zap,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldAlert,
  Server,
  BrainCircuit,
  Layers,
  Sparkles,
  GitBranch,
  MessageSquare,
  Scale,
  Calendar,
  Users,
  Kanban,
  Globe,
  ExternalLink,
  Github,
  Share2,
  BookOpen,
  PenTool,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAI } from '../../context/AIContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { RoleMemoryWidget } from '../memory/RoleMemoryWidget';
import { MeetingCard, MeetingItem } from '../common/MeetingCard';
import { IconBadge3D } from '../common/IconBadge3D';
import { OnboardingBanner } from '../common/OnboardingBanner';

const SOURCE_META: Record<string, { icon: string; color: string; label: string }> = {
  'Google Play': { icon: '🟢', color: '#34a853', label: 'Google Play' },
  'App Store': { icon: '🍎', color: '#007aff', label: 'App Store' },
  'Reddit': { icon: '🟠', color: '#ff4500', label: 'Reddit' },
  'GitHub Issues': { icon: '⚫', color: '#161616', label: 'GitHub' },
  'Support Desk': { icon: '🎧', color: '#6366f1', label: 'Support' },
  'Discord': { icon: '💬', color: '#5865f2', label: 'Discord' },
  'Twitter / X': { icon: '𝕏', color: '#000000', label: 'Twitter / X' },
  'User Survey': { icon: '📊', color: '#f59e0b', label: 'Surveys' },
};

export const OverviewView: React.FC = () => {
  const {
    activeWorkspace,
    metrics,
    setActiveSection,
    problemClusters,
    validationSessions,
    devTasks,
    qaTestCases,
    feedback,
    sprintFeatures,
    releases,
    decisions,
    meetings,
    activeRole,
  } = useProject();

  const { openStudio } = useAI();

  const activeP0Cluster = problemClusters.find((c) => c.severity === 'critical');
  const activeValidation = validationSessions[0];
  const pendingDevTasks = devTasks.filter((t) => t.status === 'in-progress' || t.status === 'todo');
  const passingQACount = qaTestCases.filter((tc) => tc.status === 'Passed').length;

  // Feedback source breakdown
  const feedbackBySource: Record<string, { total: number; positive: number; negative: number; neutral: number }> = {};
  feedback.forEach(f => {
    if (!feedbackBySource[f.source]) feedbackBySource[f.source] = { total: 0, positive: 0, negative: 0, neutral: 0 };
    feedbackBySource[f.source].total++;
    feedbackBySource[f.source][f.sentiment]++;
  });

  // Currently shipping items
  const activePRs = sprintFeatures.filter(f => f.prStatus === 'Open' || f.prStatus === 'Draft');
  const stagingRelease = releases.find(r => r.status === 'Staging Rollout');
  const inProgressTasks = devTasks.filter(t => t.status === 'in-progress');
  const completedTasks = devTasks.filter(t => t.status === 'done');
  const blockedTasks = devTasks.filter(t => t.priority === 'P0' && t.status !== 'done');

  // Primary Meeting from Project Context
  const primaryMeeting = meetings[0];
  const meetingItem: MeetingItem | null = primaryMeeting
    ? {
        id: primaryMeeting.id,
        title: primaryMeeting.title,
        date: primaryMeeting.date,
        attendees: primaryMeeting.attendees.map((a) => `${a.name} (${a.role.split(' ')[0]})`),
        summary: primaryMeeting.summary,
        importantDecision: primaryMeeting.decisions[0]?.text,
        actionItems: primaryMeeting.actionItems.map((a) => ({
          id: a.id,
          text: a.text,
          owner: a.owner,
          done: a.done,
        })),
        status: primaryMeeting.status,
      }
    : null;

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ── Lightweight Onboarding Banner (Progressive Disclosure) ── */}
      <OnboardingBanner />
      {/* ── Featured Hero Card: Project Progress & Delivery ── */}
      <div className="rounded-2xl border border-[#EBE5DC] bg-white p-6 sm:p-8 shadow-xs hover:border-[#FF6039]/30 hover:shadow-md transition-all duration-200 relative overflow-hidden space-y-7">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-3">
              <IconBadge3D
                icon={<BrainCircuit className="h-5 w-5 text-white" />}
                color="orange"
                size="md"
              />
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-xs font-bold text-[#18181b] bg-[#FAF7F2] border border-[#EBE5DC] px-2.5 py-0.5 rounded-full">
                  {activeWorkspace.code}
                </span>
                <span className="font-sans text-xs text-[#71717a] font-medium">
                  {activeWorkspace.name} ({activeWorkspace.version}) • {activeWorkspace.activeSprint}
                </span>

                {activeWorkspace.deployedUrl && (
                  <a
                    href={activeWorkspace.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-mono font-medium transition-all shadow-2xs"
                    title={`Open deployed application: ${activeWorkspace.deployedUrl}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <Globe className="h-3 w-3 text-emerald-600" />
                    <span className="truncate max-w-[160px] sm:max-w-[220px]">
                      {activeWorkspace.deployedUrl.replace(/^https?:\/\//, '')}
                    </span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                )}

                {activeWorkspace.repoUrl && (
                  <a
                    href={activeWorkspace.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-[#FAF7F2] hover:bg-white text-[#18181b] px-2.5 py-0.5 text-xs font-mono transition-all shadow-2xs"
                    title={`Open GitHub repository: ${activeWorkspace.repoUrl}`}
                  >
                    <Github className="h-3 w-3" />
                    <span className="truncate max-w-[140px]">
                      {activeWorkspace.repoUrl.replace(/^https?:\/\/github\.com\//, '')}
                    </span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                )}

                {/* Socials & Community Channels */}
                {activeWorkspace.socialLinks?.twitter && (
                  <a
                    href={activeWorkspace.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-[#FAF7F2] hover:bg-white text-[#18181b] px-2.5 py-0.5 text-xs font-mono transition-all shadow-2xs hover:border-[#18181b]"
                    title={`Open Twitter/X Profile: ${activeWorkspace.socialLinks.twitter}`}
                  >
                    <span className="font-bold text-[11px]">𝕏</span>
                    <span className="truncate max-w-[120px]">
                      {activeWorkspace.socialLinks.twitter.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, '@')}
                    </span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                )}

                {activeWorkspace.socialLinks?.discord && (
                  <a
                    href={activeWorkspace.socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-[#5865F2] px-2.5 py-0.5 text-xs font-mono transition-all shadow-2xs"
                    title={`Join Discord Community: ${activeWorkspace.socialLinks.discord}`}
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>Discord</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                )}

                {activeWorkspace.socialLinks?.figma && (
                  <a
                    href={activeWorkspace.socialLinks.figma}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-[#F24E1E] px-2.5 py-0.5 text-xs font-mono transition-all shadow-2xs"
                    title={`Open Figma Design System: ${activeWorkspace.socialLinks.figma}`}
                  >
                    <PenTool className="h-3 w-3" />
                    <span>Figma Specs</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                )}

                {activeWorkspace.socialLinks?.docs && (
                  <a
                    href={activeWorkspace.socialLinks.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-mono transition-all shadow-2xs"
                    title={`Open Documentation Hub: ${activeWorkspace.socialLinks.docs}`}
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Docs Hub</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </a>
                )}
              </div>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#18181b]">
              Project Progress & Delivery
            </h1>

            <p className="text-sm sm:text-base text-[#52525b] leading-relaxed font-sans max-w-[65ch]">
              Live sprint tracking across tasks, design specs, customer reviews, and release readiness.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openStudio('all')}
                className="btn-primary-orange flex items-center gap-2"
              >
                <img
                  src="/dev-ai.png"
                  alt="Dev AI"
                  className="w-4 h-4 object-contain rounded-full drop-shadow-xs"
                  style={{ width: 16, height: 16, maxWidth: 16, maxHeight: 16 }}
                />
                <span>Ask Project Memory AI</span>
              </button>

              <button
                onClick={() => setActiveSection('tasks')}
                className="btn-secondary-dark flex items-center gap-2"
              >
                <Kanban className="h-4 w-4 text-[#FF6039]" />
                <span>Sprint Kanban</span>
              </button>

              <button
                onClick={() => setActiveSection('feedback')}
                className="btn-secondary-dark flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                <span>Customer Reviews</span>
              </button>
            </div>
          </div>

          {/* Health of the Project — Right Side of the Hero Card */}
          <div
            onClick={() => setActiveSection('product-health')}
            className="group relative flex flex-col justify-between rounded-2xl border border-[#FFD6CC] bg-gradient-to-br from-white via-[#FFFDFB] to-[#FFF6F2] p-5 shadow-xs hover:border-[#FF6039] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden w-full lg:w-[400px] xl:w-[440px] shrink-0"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-orange-200/25 blur-2xl pointer-events-none transition-opacity group-hover:opacity-100" />

            <div>
              {/* Header Pill & Target */}
              <div className="flex items-center justify-between gap-2 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-orange-100 text-[#C2410C] border border-orange-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF6039] animate-pulse" />
                  Sprint Health
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#71717a] bg-white/80 px-2 py-0.5 rounded-md border border-[#FFD6CC]/60">
                  Target 90%
                </span>
              </div>

              {/* Main Content with 3D Mascot on the Left and Circular Chart on the Right */}
              <div className="flex items-center gap-3.5 my-2.5 relative z-10">
                {/* 3D Health Mascot Avatar (Left) */}
                <div className="relative shrink-0 flex items-center justify-center w-26 h-26 sm:w-28 sm:h-28">
                  <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#FF6039]/20 via-amber-400/15 to-transparent blur-md pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                  <img
                    src="/health.png"
                    alt="Sprint Health Mascot"
                    className="relative z-10 object-contain drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                    style={{ width: 104, height: 104, maxWidth: 104, maxHeight: 104 }}
                  />
                </div>

                {/* Circular Health Gauge & Context (Right) */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  {/* SVG Radial Progress Ring Chart */}
                  <div className="relative shrink-0 flex items-center justify-center">
                    <svg className="w-20 h-20 sm:w-22 sm:h-22 transform -rotate-90" viewBox="0 0 88 88">
                      <defs>
                        <linearGradient id="healthRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFA07A" />
                          <stop offset="50%" stopColor="#FF6039" />
                          <stop offset="100%" stopColor="#EA580C" />
                        </linearGradient>
                        <filter id="healthGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#FF6039" floodOpacity="0.25" />
                        </filter>
                      </defs>
                      {/* Background Track */}
                      <circle
                        cx="44"
                        cy="44"
                        r="35"
                        stroke="#F5EFE8"
                        strokeWidth="6.5"
                        fill="transparent"
                      />
                      {/* 90% Target Reference Notch Arc */}
                      <circle
                        cx="44"
                        cy="44"
                        r="35"
                        stroke="#FFD6CC"
                        strokeWidth="6.5"
                        strokeDasharray="219.91"
                        strokeDashoffset={219.91 * (1 - 0.90)}
                        fill="transparent"
                        className="opacity-40"
                      />
                      {/* Active Progress Ring (94%) */}
                      <circle
                        cx="44"
                        cy="44"
                        r="35"
                        stroke="url(#healthRingGrad)"
                        strokeWidth="6.5"
                        strokeDasharray="219.91"
                        strokeDashoffset={219.91 * (1 - metrics.compositeHealth / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                        filter="url(#healthGlow)"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>

                    {/* Center Metric Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                      <div className="flex items-baseline leading-none">
                        <span className="font-sans text-xl sm:text-2xl font-black text-[#18181b] tracking-tight tabular-nums">
                          {metrics.compositeHealth}
                        </span>
                        <span className="text-xs font-bold text-[#FF6039] ml-0.5">%</span>
                      </div>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#71717a] mt-0.5">
                        HEALTH
                      </span>
                    </div>
                  </div>

                  {/* Telemetry Labels Beside Chart */}
                  <div className="space-y-1 min-w-0">
                    <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                      <TrendingUp className="h-3 w-3 text-emerald-600" />
                      <span>+4.2 pts</span>
                    </div>
                    <div className="text-sm font-sans font-bold text-[#18181b] leading-tight truncate">
                      Release Readiness
                    </div>
                    <p className="text-xs text-[#52525b] font-sans flex items-center gap-1.5 leading-snug">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                      <span className="truncate">8/8 gates passing</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro status and footer link */}
            <div className="mt-2 pt-3 border-t border-[#FFD6CC]/70 relative z-10 flex items-center justify-between text-[11px] font-sans">
              <span className="text-[#71717a] font-mono font-medium">
                Gate Target: <span className="font-bold text-[#18181b]">90%</span> <span className="text-emerald-700 font-bold">(Cleared)</span>
              </span>
              <div className="flex items-center gap-1 font-semibold text-[#FF6039] group-hover:underline">
                <span>Inspect Health Matrix</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3-Column Visual Telemetry Cards (Done, Progress, Error / Blocked) in the Same Place ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-[#EBE5DC]">
          {/* Card 1: Completed Tasks (Done) */}
          <div
            onClick={() => setActiveSection('tasks')}
            className="group relative flex flex-col justify-between rounded-2xl border border-emerald-200 bg-gradient-to-b from-white via-[#FCFDFD] to-[#F0FDF4] p-5 shadow-xs hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-emerald-200/25 blur-2xl pointer-events-none transition-opacity group-hover:opacity-100" />

            <div>
              {/* Header Pill & Target */}
              <div className="flex items-center justify-between gap-2 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Shipped & Done
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#71717a] bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  Sprint 14
                </span>
              </div>

              {/* 3D Mascot Hero Stage */}
              <div className="relative flex items-center justify-center my-3 h-36">
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-400/20 via-teal-300/10 to-transparent blur-md pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <img
                  src="/done.png"
                  alt="Tasks Done Mascot"
                  className="relative z-10 object-contain drop-shadow-md transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-1"
                  style={{ width: 120, height: 120, maxWidth: 120, maxHeight: 120 }}
                />
              </div>

              {/* Metrics & Context */}
              <div className="space-y-1 relative z-10">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-3xl font-extrabold text-[#18181b] tracking-tight tabular-nums">
                    {completedTasks.length > 0 ? completedTasks.length : 18}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                    75% Shipped
                  </span>
                </div>
                <div className="text-sm font-sans font-bold text-[#18181b]">
                  Verified Deliverables
                </div>
                <p className="text-xs text-[#52525b] font-sans line-clamp-1">
                  Passed QA & merged into main
                </p>
              </div>
            </div>

            {/* Progress bar and footer */}
            <div className="mt-4 pt-3 border-t border-emerald-200/70 relative z-10 space-y-2">
              <div className="w-full bg-[#FAF7F2] border border-[#EBE5DC] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.round(((completedTasks.length || 18) / (devTasks.length || 24)) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans font-medium text-emerald-700 group-hover:underline">
                <span>Open Sprint Kanban</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>

          {/* Card 2: In Progress Tasks (Progress) */}
          <div
            onClick={() => setActiveSection('tasks')}
            className="group relative flex flex-col justify-between rounded-2xl border border-amber-200 bg-gradient-to-b from-white via-[#FCFDFD] to-[#FFFBEB] p-5 shadow-xs hover:border-amber-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-amber-200/25 blur-2xl pointer-events-none transition-opacity group-hover:opacity-100" />

            <div>
              {/* Header Pill & Target */}
              <div className="flex items-center justify-between gap-2 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  In Progress
                </span>
                <span className="text-[11px] font-mono font-semibold text-[#71717a] bg-white/80 px-2 py-0.5 rounded-md border border-amber-200/60">
                  3 PRs Open
                </span>
              </div>

              {/* 3D Mascot Hero Stage */}
              <div className="relative flex items-center justify-center my-3 h-36">
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-amber-400/20 via-yellow-300/10 to-transparent blur-md pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <img
                  src="/progress.png"
                  alt="Tasks In Progress Mascot"
                  className="relative z-10 object-contain drop-shadow-md transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-1"
                  style={{ width: 120, height: 120, maxWidth: 120, maxHeight: 120 }}
                />
              </div>

              {/* Metrics & Context */}
              <div className="space-y-1 relative z-10">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-3xl font-extrabold text-[#18181b] tracking-tight tabular-nums">
                    {inProgressTasks.length > 0 ? inProgressTasks.length : 6}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                    Active Builds
                  </span>
                </div>
                <div className="text-sm font-sans font-bold text-[#18181b]">
                  Under Development
                </div>
                <p className="text-xs text-[#52525b] font-sans truncate">
                  Active code reviews & branch builds
                </p>
              </div>
            </div>

            {/* Progress bar and footer */}
            <div className="mt-4 pt-3 border-t border-amber-200/70 relative z-10 space-y-2">
              <div className="w-full bg-[#FAF7F2] border border-[#EBE5DC] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.round(((inProgressTasks.length || 6) / (devTasks.length || 24)) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans font-medium text-amber-800 group-hover:underline">
                <span>Inspect Active Builds</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>

          {/* Card 3: Blocked Tasks (Error) */}
          <div
            onClick={() => setActiveSection('tasks')}
            className="group relative flex flex-col justify-between rounded-2xl border border-rose-200 bg-gradient-to-b from-white via-[#FCFDFD] to-[#FEF2F2] p-5 shadow-xs hover:border-rose-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-rose-200/25 blur-2xl pointer-events-none transition-opacity group-hover:opacity-100" />

            <div>
              {/* Header Pill & Target */}
              <div className="flex items-center justify-between gap-2 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Blocked & Hotspots
                </span>
                <span className="text-[11px] font-mono font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                  P0 Triage
                </span>
              </div>

              {/* 3D Mascot Hero Stage */}
              <div className="relative flex items-center justify-center my-3 h-36">
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-rose-400/20 via-red-300/10 to-transparent blur-md pointer-events-none group-hover:scale-110 transition-transform duration-300" />
                <img
                  src="/blocked.png"
                  alt="Tasks Blocked Mascot"
                  className="relative z-10 object-contain drop-shadow-md transition-all duration-300 group-hover:scale-108 group-hover:-translate-y-1"
                  style={{ width: 120, height: 120, maxWidth: 120, maxHeight: 120 }}
                />
              </div>

              {/* Metrics & Context */}
              <div className="space-y-1 relative z-10">
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-3xl font-extrabold text-[#18181b] tracking-tight tabular-nums">
                    {blockedTasks.length > 0 ? blockedTasks.length : 3}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/80">
                    Action Needed
                  </span>
                </div>
                <div className="text-sm font-sans font-bold text-[#18181b]">
                  Critical Hotspots
                </div>
                <p className="text-xs text-[#52525b] font-sans truncate">
                  2 security reviews • 1 dependency
                </p>
              </div>
            </div>

            {/* Progress bar and footer */}
            <div className="mt-4 pt-3 border-t border-rose-200/70 relative z-10 space-y-2">
              <div className="w-full bg-[#FAF7F2] border border-[#EBE5DC] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.round(((blockedTasks.length || 3) / (devTasks.length || 24)) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-sans font-medium text-rose-700 group-hover:underline">
                <span>Resolve Blocker Queue</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cross-Disciplinary Project Memory ── */}
      <RoleMemoryWidget role="all" />

      {/* ── Team Pulse (Metric Cards) ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sans text-lg font-bold tracking-tight text-[#18181b]">
            Team Pulse & Performance
          </h2>
          <span className="text-xs font-sans font-medium text-[#71717a]">6 Core Vectors</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="User Sentiment"
            value={`${metrics.userSentimentScore}%`}
            subtitle="Customer Reviews"
            change="+14% this week"
            changeType="up"
            icon={MessageSquare}
            level={1}
            onClick={() => setActiveSection('feedback')}
          />
          <MetricCard
            title="Checkout Reliab."
            value={`${metrics.checkoutReliability}%`}
            subtitle="Target: 99.5%"
            change="1 Issue Tracked"
            changeType="down"
            icon={Activity}
            level={2}
            onClick={() => setActiveSection('user-issues')}
          />
          <MetricCard
            title="Sprint Velocity"
            value={`${metrics.featureVelocity}%`}
            subtitle="4 PRDs shipping"
            change="On Track"
            changeType="up"
            icon={Zap}
            level={1}
            onClick={() => setActiveSection('tasks')}
          />
          <MetricCard
            title="UX Health"
            value={`${metrics.uxHealthScore}%`}
            subtitle="Validation Studio"
            change={`${metrics.unresolvedVisualMismatches} Discrepancy`}
            changeType="neutral"
            icon={Layers}
            level={1}
            onClick={() => setActiveSection('validation')}
          />
          <MetricCard
            title="QA Pass Rate"
            value={`${metrics.qaPassRate}%`}
            subtitle={`${passingQACount}/${qaTestCases.length} Passed`}
            change="1 Blocked"
            changeType="neutral"
            icon={CheckCircle2}
            level={1}
            onClick={() => setActiveSection('qa-status')}
          />
          <MetricCard
            title="Prod Stability"
            value={`${metrics.productionHealth}%`}
            subtitle="99.94% Uptime"
            change="All Clear"
            changeType="up"
            icon={Server}
            level={1}
            onClick={() => setActiveSection('incidents')}
          />
        </div>
      </div>

      {/* ── 2-Column Operational Grid: Currently Shipping & Critical Hotspot ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currently Shipping */}
        <div className="card-level-1">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-[#FF6039]" />
              <h3 className="font-sans font-bold text-[#161616] text-base">Currently Shipping</h3>
            </div>
            <StatusBadge label={`${activePRs.length} Active PRs`} variant="amber" />
          </div>

          <div className="mt-4 space-y-4">
            {/* Staging release */}
            {stagingRelease && (
              <div className="rounded-[8px] bg-[#f0fdf4] border border-emerald-200 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <Server className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Staging Rollout</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    +{stagingRelease.sentimentDelta}% Sentiment
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-[#161616]">
                  {stagingRelease.version} — {stagingRelease.releaseName}
                </p>
                <p className="mt-0.5 text-xs text-[#525252]">
                  Targeting release across iOS and Android production tiers this Friday.
                </p>
              </div>
            )}

            {/* Active PRs */}
            {activePRs.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#525252] uppercase tracking-wider">
                  Open Pull Requests
                </span>
                {activePRs.slice(0, 3).map(pr => (
                  <div key={pr.id} className="flex items-center justify-between rounded-[8px] bg-[#fafafa] border border-[#e5e7eb] p-3 hover:border-[#161616] transition-colors">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-xs sm:text-sm font-semibold text-[#161616] truncate">{pr.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#525252]">
                        <span className="font-mono font-semibold text-[#FF6039]">#{pr.prNumber}</span>
                        <span>•</span>
                        <span>{pr.author}</span>
                        <span>•</span>
                        <span>{pr.commitCount} commits</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-16 h-1.5 rounded-full bg-[#e5e7eb] overflow-hidden">
                        <div className="h-full bg-[#FF6039] rounded-full transition-all" style={{ width: `${pr.progressPercent}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#161616]">{pr.progressPercent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-[#525252]">No active pull requests</div>
            )}

            {/* In-progress tasks count */}
            {inProgressTasks.length > 0 && (
              <button
                onClick={() => setActiveSection('tasks')}
                className="w-full flex items-center justify-between rounded-[8px] bg-[#fafafa] border border-[#e5e7eb] p-3 hover:border-[#FF6039] hover:bg-[#FFF0EC] transition-all"
              >
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#FF6039]" />
                  <span className="text-xs sm:text-sm font-semibold text-[#161616]">{inProgressTasks.length} dev tasks in progress</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-[#525252]" />
              </button>
            )}
          </div>
        </div>

        {/* Active P0 Problem Cluster Spotlight */}
        <div className="card-level-1 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
            <div className="flex items-center gap-2">
              <span className={`flex h-2.5 w-2.5 rounded-full ${activeP0Cluster ? 'bg-[#b91c1c]' : 'bg-[#10b981]'}`} />
              <h3 className="font-sans font-bold text-[#161616] text-base">
                {activeP0Cluster ? 'Critical Blocker (P0)' : 'System Telemetry'}
              </h3>
            </div>
            <StatusBadge label={activeP0Cluster ? 'Affecting Users' : 'All Clear'} variant={activeP0Cluster ? 'red' : 'green'} />
          </div>

          {activeP0Cluster ? (
            <div className="mt-4 space-y-3">
              <h4 className="text-base font-bold text-[#161616]">{activeP0Cluster.title}</h4>
              <p className="text-xs sm:text-sm text-[#374151] leading-relaxed bg-[#fafafa] p-3 rounded-[8px] border border-[#e5e7eb]">
                <span className="text-[#FF6039] font-mono font-bold">DIAGNOSIS & ROOT CAUSE: </span>
                {activeP0Cluster.aiSummary}
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#e5e7eb]">
                  <span className="text-[#525252] block text-[10px] font-bold uppercase">PLATFORM</span>
                  <span className="text-[#161616] font-semibold">{activeP0Cluster.platform} • {activeP0Cluster.productArea}</span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#e5e7eb]">
                  <span className="text-[#525252] block text-[10px] font-bold uppercase">VELOCITY</span>
                  <span className="text-[#b91c1c] font-bold">{activeP0Cluster.trend}</span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#525252] font-medium">Owner: {activeP0Cluster.owner}</span>
                <button
                  onClick={() => setActiveSection('user-issues')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#161616] hover:text-[#FF6039] transition-colors font-mono cursor-pointer"
                >
                  <span>Open Triage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 py-8 flex flex-col items-center justify-center text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">No Critical Blockers</p>
              <p className="text-xs text-neutral-500 max-w-sm">All streams nominal. Import a GitHub repository or capture customer feedback to triage issues.</p>
              <button
                onClick={() => setActiveSection('feedback')}
                className="mt-2 text-xs font-semibold text-neutral-900 underline hover:text-neutral-700"
              >
                Log Feedback
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── 2-Column Grid: Feedback Sources & Recent Meeting ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Sources Breakdown */}
        <div className="card-level-1">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#161616]" />
              <h3 className="font-sans font-bold text-[#161616] text-base">Feedback Sources</h3>
            </div>
            <StatusBadge label={`${feedback.length} Reviews`} variant="neutral" />
          </div>

          <div className="mt-4 space-y-2">
            {Object.entries(feedbackBySource)
              .sort(([, a], [, b]) => b.total - a.total)
              .map(([source, data]) => {
                const meta = SOURCE_META[source] || { icon: '📎', color: '#6b7280', label: source };
                const total = data.total;
                const posPercent = total > 0 ? (data.positive / total) * 100 : 0;
                const negPercent = total > 0 ? (data.negative / total) * 100 : 0;
                const neuPercent = 100 - posPercent - negPercent;

                return (
                  <button
                    key={source}
                    onClick={() => setActiveSection('feedback')}
                    className="w-full flex items-center gap-3 rounded-[8px] p-2.5 hover:bg-[#fafafa] hover:border-[#161616] border border-transparent transition-all text-left group"
                  >
                    <span className="text-base shrink-0">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-[#161616]">{meta.label}</span>
                        <span className="text-xs font-mono text-[#525252] font-bold">{total}</span>
                      </div>
                      {/* Sentiment bar */}
                      <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-[#f0f0f0]">
                        {posPercent > 0 && <div className="bg-emerald-500 transition-all" style={{ width: `${posPercent}%` }} />}
                        {neuPercent > 0 && <div className="bg-amber-400 transition-all" style={{ width: `${neuPercent}%` }} />}
                        {negPercent > 0 && <div className="bg-[#b91c1c] transition-all" style={{ width: `${negPercent}%` }} />}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-[#525252]">
                        <span className="flex items-center gap-1 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" /> {data.positive} positive</span>
                        <span className="flex items-center gap-1 font-medium"><span className="h-1.5 w-1.5 rounded-full bg-[#b91c1c] inline-block" /> {data.negative} negative</span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#a1a1aa] group-hover:text-[#FF6039] transition-colors shrink-0" />
                  </button>
                );
              })}
          </div>
        </div>

        {/* Recent Meeting Card (Connected from ProjectContext) */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#FF6039]" />
              <h3 className="font-sans font-bold text-[#161616] text-base">Recent Discussions & Syncs</h3>
            </div>
            <button
              onClick={() => setActiveSection('meetings')}
              className="text-xs font-mono font-semibold text-[#525252] hover:text-[#FF6039] flex items-center gap-1 cursor-pointer"
            >
              <span>View All Syncs ({meetings.length})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {meetingItem && (
            <MeetingCard
              meeting={meetingItem}
              level={2}
              onAskAI={(title) => {
                openStudio(primaryMeeting?.roleTag || 'all');
              }}
            />
          )}
        </div>
      </div>

      {/* ── Recent Decisions & ADRs ── */}
      <div className="card-level-1">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-[#FF6039]" />
            <h3 className="font-sans font-bold text-[#161616] text-base">Key Decisions Log</h3>
          </div>
          <button
            onClick={() => setActiveSection('decisions')}
            className="text-xs font-mono font-semibold text-[#525252] hover:text-[#161616] flex items-center gap-1"
          >
            <span>View All ({decisions.length})</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decisions.slice(0, 2).map((decision) => (
            <div
              key={decision.id}
              onClick={() => setActiveSection('decisions')}
              className="rounded-[8px] bg-[#fafafa] border border-[#e5e7eb] p-4 hover:border-[#161616] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between border-b border-[#ebebeb] pb-2">
                <span className="font-mono text-xs font-bold text-[#FF6039]">{decision.decisionCode}</span>
                <span className="text-xs font-mono text-[#525252]">{decision.date}</span>
              </div>
              <h4 className="mt-2 text-sm font-bold text-[#161616] group-hover:text-[#FF6039] transition-colors truncate">
                {decision.title}
              </h4>
              <p className="mt-1 text-xs text-[#525252] line-clamp-2 leading-relaxed">
                {decision.decisionMade}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#525252] pt-2 border-t border-[#ebebeb]">
                <span className="font-medium">Category: {decision.category}</span>
                <span className="font-medium">{decision.stakeholders.length} Stakeholders</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8-Stage Development Lifecycle ── */}
      <div className="card-level-1">
        <h3 className="font-sans font-bold text-[#161616] text-base mb-1">
          Development Lifecycle
        </h3>
        <p className="text-xs text-[#525252] mb-5">
          Every stage feeds context forward and records project rationale into persistent memory.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {[
            { stage: '1. Capture', desc: '7 Channels', icon: '📥', action: () => setActiveSection('feedback') },
            { stage: '2. Triage', desc: 'Problem Clusters', icon: '🤖', action: () => setActiveSection('user-issues') },
            { stage: '3. Specify', desc: 'PRDs & Specs', icon: '📋', action: () => setActiveSection('requirements') },
            { stage: '4. Validate', desc: 'Figma vs Code', icon: '🔍', action: () => setActiveSection('validation') },
            { stage: '5. Build', desc: 'Dev Tasks', icon: '⚡', action: () => setActiveSection('tasks') },
            { stage: '6. Gate', desc: 'QA Readiness', icon: '🛡️', action: () => setActiveSection('release-readiness') },
            { stage: '7. Ship', desc: 'Releases & Telemetry', icon: '🚀', action: () => setActiveSection('releases') },
            { stage: '8. Remember', desc: 'ADRs & Memory', icon: '🧠', action: () => setActiveSection('decisions') },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className="cursor-pointer rounded-[8px] bg-[#fafafa] p-3 border border-[#e5e7eb] hover:border-[#161616] hover:bg-white hover:shadow-[0px_2px_4px_rgba(0,0,0,0.04)] transition-all group"
            >
              <div className="text-xl mb-1 group-hover:scale-105 transition-transform">{item.icon}</div>
              <p className="text-xs font-bold text-[#161616] font-mono truncate">{item.stage}</p>
              <p className="text-[11px] text-[#525252] mt-1 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
