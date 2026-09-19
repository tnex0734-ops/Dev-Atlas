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
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { RoleMemoryWidget } from '../memory/RoleMemoryWidget';

export const OverviewView: React.FC = () => {
  const {
    activeWorkspace,
    metrics,
    setActiveSection,
    problemClusters,
    validationSessions,
    devTasks,
    qaTestCases,
    secondBrainNotes,
  } = useProject();

  const activeP0Cluster = problemClusters.find((c) => c.severity === 'critical');
  const activeValidation = validationSessions[0];
  const pendingDevTasks = devTasks.filter((t) => t.status === 'in-progress' || t.status === 'todo');
  const passingQACount = qaTestCases.filter((tc) => tc.status === 'Passed').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner: Executive Composite Health with Hero Mesh Gradient */}
      <div className="relative overflow-hidden rounded-[16px] border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] mesh-gradient-hero">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5">
              <StatusBadge label="Project Memory OS Active" variant="neutral" dot />
              <span className="font-mono text-xs text-[#525252] font-semibold">
                {activeWorkspace.name} ({activeWorkspace.code}) {activeWorkspace.version} • {activeWorkspace.activeSprint}
              </span>
            </div>
            <h1 className="mt-3 font-sans text-3xl sm:text-4xl font-bold tracking-[-1.28px] text-[#171717]">
              Executive Health Pulse
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#374151] leading-relaxed font-normal">
              Dev Atlas continuously synthesizes live telemetry, user sentiment, Figma validation, sprint execution, and architectural memory into a closed-loop command dashboard.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveSection('validation')}
                className="flex items-center gap-2 rounded-full bg-[#171717] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)] touch-target"
              >
                <span>Inspect Validation Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setActiveSection('user-issues')}
                className="flex items-center gap-2 rounded-[6px] border border-[#e5e7eb] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#171717] hover:bg-[#fafafa] transition-all touch-target"
              >
                <AlertTriangle className="h-4 w-4 text-[#b91c1c]" />
                <span>Triage {problemClusters.length} Problem Clusters</span>
              </button>
              <button
                onClick={() => setActiveSection('prompts')}
                className="flex items-center gap-2 rounded-[6px] border border-[#e5e7eb] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#171717] hover:bg-[#fafafa] transition-all touch-target"
              >
                <Zap className="h-4 w-4 text-[#d97706]" />
                <span>AI Prompt Payload</span>
              </button>
            </div>
          </div>

          {/* Composite Score Radial Gauge */}
          <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#e5e7eb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] min-w-[220px]">
            <div className="relative flex items-center justify-center">
              <svg className="h-28 w-28 -rotate-90 transform">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#f2f2f2"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#171717"
                  strokeWidth="8"
                  className="transition-all duration-1000 ease-out"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * metrics.compositeHealth) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="font-sans text-3xl font-bold text-[#171717] tracking-tight">
                  {metrics.compositeHealth}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#525252]">
                  out of 100
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold text-[#171717] text-center">
              Composite Health Score
            </p>
            <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#047857] font-mono font-bold">
              <TrendingUp className="h-3 w-3" /> +4.2 pts vs last sprint
            </span>
          </div>
        </div>
      </div>

      {/* Role Memory: Cross-Disciplinary Project Memory Ledger */}
      <RoleMemoryWidget role="all" />

      {/* 6 Key Cross-Team Pulse Cards */}
      <div>
        <h2 className="font-sans text-lg font-bold tracking-[-0.4px] text-[#171717] mb-4">
          Cross-Functional Lifecycle Radar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="User Sentiment"
            value={`${metrics.userSentimentScore}%`}
            subtitle="7 Ingest Platforms"
            change="+14.2% post-rel"
            changeType="up"
            accentColor="green"
            onClick={() => setActiveSection('feedback')}
          />
          <MetricCard
            title="Checkout Reliab."
            value={`${metrics.checkoutReliability}%`}
            subtitle="Target: 99.5%"
            change="Android P0 Active"
            changeType="down"
            accentColor="amber"
            onClick={() => setActiveSection('user-issues')}
          />
          <MetricCard
            title="Sprint Velocity"
            value={`${metrics.featureVelocity}%`}
            subtitle="4 PRDs in-flight"
            change="On Track"
            changeType="up"
            accentColor="terracotta"
            onClick={() => setActiveSection('tasks')}
          />
          <MetricCard
            title="UX & Tokens"
            value={`${metrics.uxHealthScore}%`}
            subtitle="Validation Studio"
            change={`${metrics.unresolvedVisualMismatches} Discrepancies`}
            changeType="neutral"
            accentColor="purple"
            onClick={() => setActiveSection('validation')}
          />
          <MetricCard
            title="QA Pass Rate"
            value={`${metrics.qaPassRate}%`}
            subtitle={`${passingQACount}/${qaTestCases.length} Passed`}
            change="1 Blocked"
            changeType="neutral"
            accentColor="blue"
            onClick={() => setActiveSection('qa-status')}
          />
          <MetricCard
            title="Prod Stability"
            value={`${metrics.productionHealth}%`}
            subtitle="99.94% Uptime"
            change="1 Mitigated"
            changeType="up"
            accentColor="green"
            onClick={() => setActiveSection('incidents')}
          />
        </div>
      </div>

      {/* 2-Column Operational Grid: Active P0 Hotspot & Signature Validation Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active P0 Problem Cluster Spotlight */}
        <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-4">
            <div className="flex items-center gap-2">
              <span className={`flex h-2 w-2 rounded-full ${activeP0Cluster ? 'bg-[#b91c1c]' : 'bg-[#10b981]'}`} />
              <h3 className="font-sans font-bold text-[#171717] text-base">
                {activeP0Cluster ? 'Critical Telemetry Spike (P0)' : 'Telemetry Health'}
              </h3>
            </div>
            <StatusBadge
              label={activeP0Cluster ? 'Affecting Users' : 'All Streams Nominal'}
              variant={activeP0Cluster ? 'red' : 'green'}
            />
          </div>

          {activeP0Cluster ? (
            <div className="mt-4 space-y-3">
              <h4 className="text-base font-bold text-[#171717]">
                {activeP0Cluster.title}
              </h4>
              <p className="text-xs text-[#262626] leading-relaxed bg-[#fafafa] p-3 rounded-[6px] border border-[#e5e7eb]">
                <span className="text-[#92400e] font-bold font-mono">AI DIAGNOSIS: </span>
                {activeP0Cluster.aiSummary}
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#e5e7eb]">
                  <span className="text-[#525252] block text-[10px] font-bold">PLATFORM / AREA</span>
                  <span className="text-[#171717] font-semibold">{activeP0Cluster.platform} • {activeP0Cluster.productArea}</span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#e5e7eb]">
                  <span className="text-[#525252] block text-[10px] font-bold">VELOCITY SPIKE</span>
                  <span className="text-[#b91c1c] font-bold">{activeP0Cluster.trend}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#525252] font-medium">Owner: {activeP0Cluster.owner}</span>
                <button
                  onClick={() => setActiveSection('user-issues')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#171717] hover:text-[#0070f3] transition-colors font-mono"
                >
                  <span>Open Pipeline Triage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 py-8 flex flex-col items-center justify-center text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">No Critical Telemetry Blockers</p>
              <p className="text-xs text-neutral-500 max-w-sm">
                All incoming streams are nominal. Import a GitHub repository or capture real user feedback to triage issues.
              </p>
              <button
                onClick={() => setActiveSection('feedback')}
                className="mt-2 text-xs font-semibold text-neutral-900 underline hover:text-neutral-700"
              >
                Log User Feedback
              </button>
            </div>
          )}
        </div>

        {/* Signature Validation Studio Spotlight */}
        <div className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#f5a623]" />
              <h3 className="font-sans font-semibold text-[#171717] text-base">
                Signature Validation Studio
              </h3>
            </div>
            <StatusBadge label="Figma vs React Build" variant="amber" />
          </div>

          {activeValidation ? (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#171717]">
                  {activeValidation.featureTitle}
                </h4>
                <span className="font-mono text-xs text-[#ab570a] bg-[#ffefcf] px-2 py-0.5 rounded-[4px] border border-[#fcd34d]">
                  {activeValidation.mismatchCount} Open Mismatches
                </span>
              </div>

              <p className="text-xs text-[#4d4d4d]">
                Screen: <span className="font-mono text-[#171717] font-medium">{activeValidation.screenName}</span>
              </p>

              {/* Pin snippet */}
              <div className="space-y-2">
                {activeValidation.annotations.map((ann) => (
                  <div
                    key={ann.id}
                    className="flex items-start gap-2.5 rounded-[6px] bg-[#fafafa] p-2.5 border border-[#ebebeb] text-xs"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#171717] mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#171717]">{ann.author} ({ann.authorRole}):</span>
                        <StatusBadge label={ann.type} variant="neutral" size="sm" />
                      </div>
                      <p className="mt-1 text-[#4d4d4d]">{ann.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-[#8f8f8f]">Designer: {activeValidation.designer}</span>
                <button
                  onClick={() => setActiveSection('validation')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#171717] hover:text-[#0070f3] transition-colors font-mono"
                >
                  <span>Launch Split Comparison</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 py-8 flex flex-col items-center justify-center text-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">Validation Studio Ready</p>
              <p className="text-xs text-neutral-500 max-w-sm">
                Inspect live React components against Figma specs with pixel-diff overlays and design pin annotations.
              </p>
              <button
                onClick={() => setActiveSection('validation')}
                className="mt-2 text-xs font-semibold text-neutral-900 underline hover:text-neutral-700"
              >
                Launch Studio
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Closed-Loop 8-Stage Development Memory Pipeline */}
      <div className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
        <h3 className="font-sans font-semibold text-[#171717] text-base mb-1">
          Dev Atlas Closed-Loop Memory Lifecycle
        </h3>
        <p className="text-xs text-[#8f8f8f] mb-6">
          Every stage automatically feeds context forward and records project rationale into persistent memory.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          {[
            { stage: '1. Capture', desc: '7 Feedback Channels', icon: '📥', action: () => setActiveSection('feedback') },
            { stage: '2. Triage', desc: 'AI Problem Clusters', icon: '🤖', action: () => setActiveSection('user-issues') },
            { stage: '3. Specify', desc: 'PRD Acceptance Criteria', icon: '📋', action: () => setActiveSection('requirements') },
            { stage: '4. Validate', desc: 'Design vs React Handshake', icon: '🔍', action: () => setActiveSection('validation') },
            { stage: '5. Build', desc: 'Context-Injected Dev Tasks', icon: '⚡', action: () => setActiveSection('tasks') },
            { stage: '6. Gate', desc: 'QA Release Readiness', icon: '🛡️', action: () => setActiveSection('release-readiness') },
            { stage: '7. Ship', desc: 'Post-Deploy Sentiment', icon: '🚀', action: () => setActiveSection('releases') },
            { stage: '8. Preserve', desc: 'Permanent ADRs & Brain', icon: '🧠', action: () => setActiveSection('decisions') },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className="cursor-pointer rounded-[8px] bg-[#fafafa] p-3 border border-[#ebebeb] hover:border-[#171717] hover:bg-white hover:shadow-[0px_2px_4px_rgba(0,0,0,0.04)] transition-all group"
            >
              <div className="text-xl mb-1 group-hover:scale-105 transition-transform">{item.icon}</div>
              <p className="text-xs font-semibold text-[#171717] font-mono truncate">{item.stage}</p>
              <p className="text-[10px] text-[#8f8f8f] mt-1 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
