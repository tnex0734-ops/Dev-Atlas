import React from 'react';
import {
  Smartphone,
  Apple,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Radio,
  Clock,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { RoleMemoryWidget } from '../memory/RoleMemoryWidget';

export const ProductHealthView: React.FC = () => {
  const { metrics, setActiveSection } = useProject();

  const platforms = [
    {
      name: 'Android App',
      icon: <Smartphone className="h-5 w-5 text-[#047857]" />,
      healthScore: 68,
      status: 'Degraded (P0 Crash)',
      statusVariant: 'red' as const,
      crashFreeUsers: '96.2%',
      p99Latency: '148ms',
      activeUsers24h: '428,000',
      regressions: [
        'Android 14 Google Pay Biometric Handshake Timeout (+32% volume spike)',
        'Legacy CredentialManager unhandled exception',
      ],
      targetFix: 'Hotfix v4.2.1',
    },
    {
      name: 'iOS App',
      icon: <Apple className="h-5 w-5 text-[#0070f3]" />,
      healthScore: 84,
      status: 'Stable (High 2FA Friction)',
      statusVariant: 'amber' as const,
      crashFreeUsers: '99.1%',
      p99Latency: '135ms',
      activeUsers24h: '612,000',
      regressions: [
        'Silent Session Expiry on background app switch (45-min interval)',
        'PiP layer clipping on iPadOS 18 beta',
      ],
      targetFix: 'Release v4.2.1',
    },
    {
      name: 'Web & Desktop',
      icon: <Globe className="h-5 w-5 text-[#7928ca]" />,
      healthScore: 94,
      status: 'Optimal Performance',
      statusVariant: 'green' as const,
      crashFreeUsers: '99.8%',
      p99Latency: '98ms',
      activeUsers24h: '940,000',
      regressions: [
        'Minor Safari WebRTC video codec negotiation fallback (0.4% traffic)',
      ],
      targetFix: 'v4.2.0 Shipped',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Product Health Radar
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Real-time platform telemetry, crash-free rates, P99 stream latency, and live regression tracking across client endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge label="Telemetry Polling: 10s Live" variant="green" dot />
        </div>
      </div>

      {/* Role Memory: Ops Decisions & Production Rationale */}
      <RoleMemoryWidget role="ops" />

      {/* Summary KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Crash-Free"
          value="98.4%"
          subtitle="Target: 99.5%"
          change="-0.8% (Android impact)"
          changeType="down"
          accentColor="amber"
        />
        <MetricCard
          title="P99 Stream Ingest"
          value="127ms"
          subtitle="Target: <180ms"
          change="Passing SLA"
          changeType="up"
          accentColor="green"
        />
        <MetricCard
          title="Active Hotfix Target"
          value="v4.2.1"
          subtitle="Branch: main-hotfix"
          change="Alex Chen leading"
          changeType="neutral"
          accentColor="terracotta"
          onClick={() => setActiveSection('tasks')}
        />
        <MetricCard
          title="Open Regressions"
          value="3 Identified"
          subtitle="1 P0 Blocker, 2 P1"
          change="Triage Active"
          changeType="down"
          accentColor="terracotta"
          onClick={() => setActiveSection('user-issues')}
        />
      </div>

      {/* Platform Deep-Dive Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {platforms.map((plat) => (
          <div
            key={plat.name}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                    {plat.icon}
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-[#171717] text-base">
                      {plat.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#8f8f8f]">
                      {plat.activeUsers24h} daily actives
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xl font-bold text-[#171717]">
                    {plat.healthScore}
                  </span>
                  <span className="text-[10px] text-[#8f8f8f] block font-mono">/ 100</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[#8f8f8f]">Platform Health State:</span>
                <StatusBadge label={plat.status} variant={plat.statusVariant} size="sm" dot />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                  <span className="text-[#8f8f8f] block text-[10px]">CRASH-FREE USERS</span>
                  <span className="text-[#171717] font-bold text-sm">{plat.crashFreeUsers}</span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                  <span className="text-[#8f8f8f] block text-[10px]">P99 GLASS LATENCY</span>
                  <span className="text-[#047857] font-bold text-sm">{plat.p99Latency}</span>
                </div>
              </div>

              <div className="mt-5">
                <span className="text-xs font-semibold text-[#171717] uppercase tracking-wider block mb-2 font-mono">
                  Identified Friction & Regressions:
                </span>
                <div className="space-y-2">
                  {plat.regressions.map((reg, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-[6px] bg-[#fafafa] p-2.5 border border-[#ebebeb] text-xs text-[#4d4d4d]"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 text-[#f5a623] mt-0.5 shrink-0" />
                      <span>{reg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-mono">
              <span className="text-[#8f8f8f]">Target Resolution:</span>
              <span className="text-[#ab570a] font-semibold">{plat.targetFix}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
