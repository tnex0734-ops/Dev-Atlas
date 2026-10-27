import React from 'react';
import {
  Terminal,
  ExternalLink,
  CheckCircle2,
  Clock,
  HardDrive,
  GitCommit,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const BuildsSandboxView: React.FC = () => {
  const { sandboxBuilds, showToast, setActiveSection } = useProject();

  const handleOpenSandbox = (url: string) => {
    showToast(`Opening Sandbox preview environment: ${url}`, 'info');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              CI/CD Builds & Sandbox Artifacts
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Automated build logs, commit hash artifacts, bundle size telemetry, and ephemeral preview deployments.
          </p>
        </div>
      </div>

      {/* Builds Table / Cards */}
      <div className="space-y-4">
        {sandboxBuilds.map((build) => (
          <div
            key={build.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-4 hover:border-[#a1a1a1] transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#f2f2f2] pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-semibold text-[#171717] bg-[#f5f5f5] px-3 py-1 rounded-[6px] border border-[#ebebeb]">
                  Build {build.buildNumber}
                </span>
                <StatusBadge label={build.status} variant={build.status === 'Success' ? 'green' : 'amber'} size="sm" dot />
                
                {/* Additive Security Badge */}
                {build.id === 'bld-1048' ? (
                  <button
                    onClick={() => setActiveSection('security')}
                    className="flex items-center gap-1 text-[11px] font-mono font-medium bg-[#fef2f2] text-[#ee0000] border border-[#fecaca] px-2 py-0.5 rounded-[4px] hover:bg-[#fee2e2] transition-all"
                  >
                    <span>1 Critical Vulnerability (SEC-014)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveSection('security')}
                    className="flex items-center gap-1 text-[11px] font-mono text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-[4px] hover:bg-[#d1fae5] transition-all"
                  >
                    <span>Security Audit Passed</span>
                  </button>
                )}

                <span className="font-mono text-xs text-[#0070f3] flex items-center gap-1">
                  <GitCommit className="h-3.5 w-3.5" />
                  {build.commitHash}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#8f8f8f]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {build.duration}
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3.5 w-3.5" /> {build.sizeKb} KB
                </span>
                <span>{build.timestamp}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[#8f8f8f] text-[10px] block">BRANCH / TARGET</span>
                <span className="text-[#171717] font-medium">{build.branch}</span>
              </div>
              <div className="p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[#8f8f8f] text-[10px] block">TRIGGER EVENT</span>
                <span className="text-[#171717] font-medium">{build.trigger}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-mono text-[#8f8f8f] truncate max-w-md">
                Sandbox: {build.sandboxUrl}
              </span>
              <button
                onClick={() => handleOpenSandbox(build.sandboxUrl)}
                className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-white px-3 py-1.5 text-xs font-mono text-[#171717] hover:bg-[#fafafa] hover:border-[#171717] transition-all"
              >
                <span>Launch Sandbox URL</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
