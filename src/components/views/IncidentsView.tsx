import React from 'react';
import {
  RadioTower,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const IncidentsView: React.FC = () => {
  const { incidents, setActiveSection } = useProject();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <RadioTower className="h-5 w-5 text-[#ee0000]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Production Incidents & SRE Log
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Real-time telemetry spikes, active incident triages, affected user counts, and root cause post-mortems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge label="SRE Incident Response: Normal" variant="green" dot />
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-6">
        {incidents.map((inc) => {
          const isOngoing = inc.status === 'Investigating';
          const isMitigated = inc.status === 'Mitigated';

          return (
            <div
              key={inc.id}
              className={`rounded-[12px] border bg-white p-6 sm:p-7 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-4 transition-all ${
                isOngoing
                  ? 'border-[#fecaca] shadow-[0px_2px_4px_rgba(238,0,0,0.04)]'
                  : 'border-[#ebebeb] hover:border-[#a1a1a1]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-[#f2f2f2] pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-[#ee0000] bg-[#fef2f2] px-2 py-0.5 rounded-[4px] border border-[#fecaca]">
                      {inc.incidentCode}
                    </span>
                    <StatusBadge label={inc.severity} variant="red" size="sm" dot={isOngoing} />
                    <StatusBadge
                      label={inc.status}
                      variant={isOngoing ? 'red' : isMitigated ? 'amber' : 'green'}
                      size="sm"
                    />
                  </div>

                  <h3 className="mt-2 font-sans font-semibold text-lg sm:text-xl text-[#171717]">
                    {inc.title}
                  </h3>
                </div>

                <div className="text-left lg:text-right font-mono text-xs text-[#8f8f8f]">
                  <span>Started: <strong className="text-[#171717]">{inc.startedAt}</strong></span>
                  {inc.resolvedAt && (
                    <span className="block text-[#047857]">Resolved: {inc.resolvedAt}</span>
                  )}
                </div>
              </div>

              {/* Root Cause & Affected Users */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                  <span className="text-[#8f8f8f] text-[10px] block font-semibold uppercase">
                    AFFECTED AUDIENCE
                  </span>
                  <span className="text-[#171717] font-bold text-sm">
                    {inc.affectedUsersCount.toLocaleString()} Users Impacted
                  </span>
                </div>
                <div className="p-3.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                  <span className="text-[#8f8f8f] text-[10px] block font-semibold uppercase">
                    ROOT CAUSE POST-MORTEM
                  </span>
                  <span className="text-[#4d4d4d]">{inc.rootCause}</span>
                </div>
              </div>

              {/* Linked Problem Cluster */}
              {inc.linkedClusterId && (
                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8f8f8f]">Linked to Problem Cluster:</span>
                  <button
                    onClick={() => setActiveSection('user-issues')}
                    className="text-[#0070f3] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Inspect Cluster Pipeline</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
