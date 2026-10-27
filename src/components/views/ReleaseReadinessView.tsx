import React from 'react';
import {
  Gauge,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Rocket,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const ReleaseReadinessView: React.FC = () => {
  const {
    readinessChecks,
    toggleReadinessCheck,
    calculateReadinessScore,
    evaluateSecurityGateResult,
    setActiveSection,
    showToast,
  } = useProject();

  const securityGate = evaluateSecurityGateResult();

  const score = calculateReadinessScore();
  const isReadyToShip = score >= 90;

  const handleShipRelease = () => {
    if (!isReadyToShip) {
      showToast('Cannot ship: Release readiness score must be >= 90% and all P0 gates met.', 'error');
    } else {
      showToast('Production Release Gate Passed! Deployed build v4.2.1.', 'success');
      setActiveSection('releases');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Release Readiness Gating Radar
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Objective Go/No-Go checklist evaluating QA pass thresholds, blocker defects, Figma spec sign-offs, and security audits.
          </p>
        </div>

        <button
          onClick={handleShipRelease}
          className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-mono font-medium transition-all ${
            isReadyToShip
              ? 'bg-[#171717] text-white shadow-sm hover:bg-[#333333]'
              : 'bg-[#ebebeb] text-[#8f8f8f] border border-[#ebebeb] cursor-not-allowed'
          }`}
        >
          <Rocket className="h-4 w-4" />
          <span>Authorize Production Release</span>
        </button>
      </div>

      {/* Readiness Radial Score Card */}
      <div className="rounded-[12px] border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-2">
          <div className="flex items-center gap-2.5">
            <StatusBadge
              label={isReadyToShip ? 'Ready to Ship' : 'Gating Blockers Present'}
              variant={isReadyToShip ? 'green' : 'amber'}
              dot
            />
            <span className="font-mono text-xs text-[#8f8f8f]">Target Release: v4.2.1</span>
          </div>
          <h2 className="font-sans text-xl sm:text-2xl font-semibold tracking-[-0.4px] text-[#171717]">
            Target Release Readiness: {score}%
          </h2>
          <p className="text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
            {isReadyToShip
              ? 'All critical path gates, test criteria, and design handshakes have been satisfied. Production rollout is authorized.'
              : 'Release is currently blocked pending resolution of open visual token discrepancies and QA acceptance test failures.'}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-[8px] bg-[#fafafa] p-6 border border-[#ebebeb] min-w-[200px]">
          <span className="font-sans text-4xl font-bold text-[#171717]">{score}%</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8f8f8f] mt-1">
            Gating Score
          </span>
          <div className="mt-3 h-2 w-32 rounded-full bg-[#ebebeb] overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isReadyToShip ? 'bg-[#047857]' : 'bg-[#f5a623]'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Matrix */}
      <div className="space-y-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8f8f8f] block">
          Release Gate Verification Matrix:
        </span>
        {readinessChecks.map((rc) => {
          const isSecurityCheck = rc.category === 'Security & Dependency Audit' || rc.id === 'rc-04';
          const isMet = isSecurityCheck ? securityGate.status === 'passed' : rc.isMet;
          const displayDetails = isSecurityCheck && securityGate.blockers.length > 0
            ? `Blocked by ${securityGate.blockers.join(' • ')}`
            : rc.details;

          return (
            <div
              key={rc.id}
              onClick={() => {
                if (isSecurityCheck) {
                  setActiveSection('security');
                } else {
                  toggleReadinessCheck(rc.id);
                }
              }}
              className={`rounded-[12px] border p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isMet
                  ? 'bg-white border-[#ebebeb] hover:border-[#171717]'
                  : 'bg-white border-[#ebebeb] hover:border-[#ee0000]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5">
                  {isMet ? (
                    <CheckCircle2 className="h-5 w-5 text-[#047857]" />
                  ) : (
                    <XCircle className="h-5 w-5 text-[#ee0000]" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#0070f3] uppercase font-semibold">
                      {rc.category}
                    </span>
                    <span className="font-mono text-[10px] text-[#8f8f8f]">
                      Weight: {rc.scoreWeight} pts
                    </span>
                  </div>
                  <h4 className="font-sans font-semibold text-base text-[#171717]">
                    {rc.criterion}
                  </h4>
                  <p className="text-xs text-[#4d4d4d] font-mono">{displayDetails}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto font-mono text-xs">
                {isSecurityCheck && !isMet && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSection('security');
                    }}
                    className="text-[#0070f3] hover:underline font-semibold mr-2"
                  >
                    View Security Audit
                  </button>
                )}
                <span
                  className={`px-3 py-0.5 rounded-full border text-[11px] ${
                    isMet
                      ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]'
                      : 'bg-[#fef2f2] text-[#ee0000] border-[#fecaca]'
                  }`}
                >
                  {isMet ? 'Gate Passed' : 'Blocked'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
