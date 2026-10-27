import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  RotateCw,
  Plus,
  Play,
  FileCode,
  Check,
  Terminal,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Search,
  Loader2,
  Code2,
  CheckCheck,
  AlertOctagon,
  Copy,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { RoleMemoryWidget } from '../memory/RoleMemoryWidget';
import { SecurityFinding, SecurityEvidence, SecurityScanEvent } from '../../types';

export const SecurityCommandCenterView: React.FC = () => {
  const {
    securityFindings,
    securityEvidence,
    securityScanEvents,
    securityAssessments,
    startSecurityAssessment,
    retestFinding,
    acceptFindingRisk,
    createRemediationTaskFromFinding,
    evaluateSecurityGateResult,
    setActiveSection,
    showToast,
    activeWorkspace,
  } = useProject();

  const [selectedFindingId, setSelectedFindingId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'high' | 'validated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStartModalOpen, setStartModalOpen] = useState(false);
  const [isRiskModalOpen, setRiskModalOpen] = useState(false);
  const [isRetesting, setIsRetesting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [copiedEvidenceId, setCopiedEvidenceId] = useState<string | null>(null);

  // Form states for Start Assessment Modal (contextualized to active workspace)
  const [scanName, setScanName] = useState(`[${activeWorkspace.code}] Core Vulnerability & AST Assessment`);
  const [targetType, setTargetType] = useState<'web-app' | 'api' | 'repository' | 'openapi' | 'build'>('api');
  const [targetUrl, setTargetUrl] = useState(`https://api.${activeWorkspace.code.toLowerCase()}.internal/v1`);
  const [allowedTargets, setAllowedTargets] = useState(`api.${activeWorkspace.code.toLowerCase()}.internal, *.${activeWorkspace.code.toLowerCase()}.internal`);
  const [excludedTargets, setExcludedTargets] = useState('*.billing-vault.internal, auth-core.internal');
  const [provider, setProvider] = useState<'strix' | 'vulnclaw' | 'demo'>('vulnclaw');
  const [isAuthorized, setIsAuthorized] = useState(true);

  // Form states for Risk Acceptance
  const [riskApprover, setRiskApprover] = useState('Alex Chen (VP Engineering)');
  const [riskRationale, setRiskRationale] = useState(
    'Compensating hardware token protection and WAF rate-limiting rules deployed at edge mitigate direct exploit risk.'
  );

  // Update target when activeWorkspace changes
  useEffect(() => {
    setScanName(`[${activeWorkspace.code}] Core Vulnerability & AST Assessment`);
    setTargetUrl(`https://api.${activeWorkspace.code.toLowerCase()}.internal/v1`);
    setAllowedTargets(`api.${activeWorkspace.code.toLowerCase()}.internal, *.${activeWorkspace.code.toLowerCase()}.internal`);
  }, [activeWorkspace]);

  const filteredFindings = securityFindings.filter((f) => {
    if (activeTab === 'critical' && f.severity !== 'critical') return false;
    if (activeTab === 'high' && f.severity !== 'high') return false;
    if (activeTab === 'validated' && f.confidence !== 'validated') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.findingCode.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        (f.owasp && f.owasp.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const selectedFinding =
    securityFindings.find((f) => f.id === selectedFindingId) ||
    filteredFindings[0] ||
    securityFindings[0];

  const selectedFindingEvidence = securityEvidence.filter((e) => e.findingId === selectedFinding?.id);

  const gateResult = evaluateSecurityGateResult();

  const criticalCount = securityFindings.filter(
    (f) => f.severity === 'critical' && f.status !== 'verified-fixed' && f.status !== 'accepted-risk'
  ).length;
  const highCount = securityFindings.filter(
    (f) => f.severity === 'high' && f.status !== 'verified-fixed' && f.status !== 'accepted-risk'
  ).length;
  const validatedCount = securityFindings.filter((f) => f.confidence === 'validated').length;
  const openFindings = securityFindings.filter(
    (f) => f.status === 'open' || f.status === 'fix-in-progress'
  );

  const handleRetest = async (findingId: string) => {
    setIsRetesting(true);
    showToast(`Retest initiated for ${selectedFinding?.findingCode}...`, 'info');
    await retestFinding(findingId);
    setIsRetesting(false);
  };

  const handleAcceptRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFinding) return;
    acceptFindingRisk(selectedFinding.id, riskApprover, riskRationale);
    setRiskModalOpen(false);
  };

  const handleStartAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      showToast('You must confirm explicit testing authorization.', 'error');
      return;
    }

    setStartModalOpen(false);
    setIsScanning(true);
    showToast(`Autonomous security assessment started: ${scanName}`, 'amber');

    try {
      const res = await startSecurityAssessment({
        name: scanName,
        targetType,
        target: targetUrl,
        scope: {
          allowedTargets: allowedTargets.split(',').map((s) => s.trim()),
          excludedTargets: excludedTargets.split(',').map((s) => s.trim()),
          authorized: isAuthorized,
          confirmedBy: `${activeWorkspace.owner}`,
        },
        provider,
        mode: 'deep',
      });

      if (res.findings.length > 0) {
        setSelectedFindingId(res.findings[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopyEvidence = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedEvidenceId(id);
    showToast('Evidence snippet copied to clipboard', 'info');
    setTimeout(() => setCopiedEvidenceId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Banner with Hero Mesh Gradient */}
      <div className="relative overflow-hidden rounded-[16px] border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-[8px] bg-[#171717] text-white shrink-0 shadow-sm">
            <Shield className="h-6 w-6 text-[#10b981]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8f8f8f]">
                Autonomous Security Intelligence
              </span>
              <StatusBadge label={`${activeWorkspace.code} Workspace`} variant="neutral" dot />
            </div>
            <h1 className="mt-1 font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Security Command Center
            </h1>
            <p className="mt-1 text-sm text-[#4d4d4d]">
              Continuous vulnerability discovery with verifiable VulnClaw HTTP proof & Strix AST code inspection for <strong>{activeWorkspace.name}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStartModalOpen(true)}
          disabled={isScanning}
          className="flex items-center gap-2 rounded-full bg-[#171717] px-5 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)] self-start sm:self-auto shrink-0 disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#10b981]" />
              <span>Assessment Running...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Start Security Assessment</span>
            </>
          )}
        </button>
      </div>

      {/* Role Memory: QA Decisions & Verification Lineage */}
      <RoleMemoryWidget role="qa" />

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard
          title="Security Health"
          value={`${gateResult.score}/100`}
          change={gateResult.status === 'passed' ? 'Passing' : 'Blockers Active'}
          changeType={gateResult.score >= 80 ? 'up' : 'down'}
          icon={Shield}
          accentColor="terracotta"
        />
        <MetricCard
          title="Open Findings"
          value={openFindings.length}
          change={`${validatedCount} Validated`}
          changeType="neutral"
          icon={AlertTriangle}
          accentColor="amber"
        />
        <MetricCard
          title="Critical Blockers"
          value={criticalCount}
          change={criticalCount > 0 ? 'Release Blocked' : '0 P0 Blockers'}
          changeType={criticalCount > 0 ? 'down' : 'up'}
          icon={ShieldAlert}
          accentColor="terracotta"
        />
        <MetricCard
          title="High Severity"
          value={highCount}
          change="Requires Attention"
          changeType="neutral"
          icon={Lock}
          accentColor="amber"
        />
        <MetricCard
          title="Release Gate"
          value={gateResult.status === 'passed' ? 'PASSED' : gateResult.status === 'warning' ? 'WARN' : 'BLOCKED'}
          change={`${gateResult.blockers.length} Blocker(s)`}
          changeType={gateResult.status === 'passed' ? 'up' : 'down'}
          icon={CheckCircle2}
          accentColor="green"
        />
        <MetricCard
          title="Active Scanner"
          value="VulnClaw + Strix"
          change="AST & Prober OK"
          changeType="up"
          icon={Clock}
          accentColor="blue"
        />
      </div>

      {/* Active Release Gate Alert Banner if Blocked */}
      {gateResult.blockers.length > 0 && (
        <div className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-[#ee0000] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#ee0000] text-sm sm:text-base">
                Security Gate Blocking Release Candidate ({activeWorkspace.version})
              </h3>
              <ul className="mt-1 space-y-1 text-xs text-[#991b1b] font-mono">
                {gateResult.blockers.map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => setActiveSection('release-readiness')}
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#ee0000] bg-white hover:bg-[#fee2e2] px-3.5 py-2 rounded-[6px] border border-[#fca5a5] transition-all self-start md:self-auto shrink-0"
          >
            <span>View in Release Readiness</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Findings Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-[12px] border border-[#ebebeb] shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-[6px] transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#171717] text-white font-medium shadow-sm'
                    : 'text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                All ({securityFindings.length})
              </button>
              <button
                onClick={() => setActiveTab('critical')}
                className={`px-3 py-1 rounded-[6px] transition-all ${
                  activeTab === 'critical'
                    ? 'bg-[#ee0000] text-white font-medium'
                    : 'text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                onClick={() => setActiveTab('high')}
                className={`px-3 py-1 rounded-[6px] transition-all ${
                  activeTab === 'high'
                    ? 'bg-[#f5a623] text-[#171717] font-medium'
                    : 'text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                High ({highCount})
              </button>
              <button
                onClick={() => setActiveTab('validated')}
                className={`px-3 py-1 rounded-[6px] transition-all ${
                  activeTab === 'validated'
                    ? 'bg-[#10b981] text-white font-medium'
                    : 'text-[#8f8f8f] hover:text-[#171717] hover:bg-[#f5f5f5]'
                }`}
              >
                Validated ({validatedCount})
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#8f8f8f]" />
              <input
                type="text"
                placeholder="Filter findings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 pl-8 pr-3 py-1.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-xs text-[#171717] placeholder-[#8f8f8f] focus:outline-none focus:border-[#171717]"
              />
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-3">
            {filteredFindings.length === 0 ? (
              <div className="rounded-[12px] border border-[#ebebeb] bg-white p-8 text-center text-xs font-mono text-[#8f8f8f]">
                No security findings matching current filter.
              </div>
            ) : (
              filteredFindings.map((finding) => {
                const isSelected = selectedFinding?.id === finding.id;
                return (
                  <div
                    key={finding.id}
                    onClick={() => setSelectedFindingId(finding.id)}
                    className={`cursor-pointer rounded-[12px] border p-5 transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.04)] ${
                      isSelected
                        ? 'border-[#171717] bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.08)] ring-1 ring-[#171717]'
                        : 'border-[#ebebeb] bg-white hover:border-[#a1a1a1]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                            {finding.findingCode}
                          </span>
                          <StatusBadge
                            label={finding.severity.toUpperCase()}
                            variant={
                              finding.severity === 'critical'
                                ? 'red'
                                : finding.severity === 'high'
                                ? 'terracotta'
                                : finding.severity === 'medium'
                                ? 'amber'
                                : 'neutral'
                            }
                            size="sm"
                          />
                          <StatusBadge
                            label={finding.confidence}
                            variant={finding.confidence === 'validated' ? 'green' : 'neutral'}
                            size="sm"
                            dot={finding.confidence === 'validated'}
                          />
                          <StatusBadge
                            label={finding.status.replace('-', ' ').toUpperCase()}
                            variant={
                              finding.status === 'verified-fixed'
                                ? 'green'
                                : finding.status === 'fix-in-progress'
                                ? 'blue'
                                : finding.status === 'accepted-risk'
                                ? 'purple'
                                : 'neutral'
                            }
                            size="sm"
                          />
                        </div>

                        <h3 className="font-sans font-semibold text-base text-[#171717] truncate">
                          {finding.title}
                        </h3>

                        <p className="text-xs text-[#4d4d4d] line-clamp-2">
                          {finding.description}
                        </p>
                      </div>

                      <ArrowRight
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isSelected ? 'text-[#171717] translate-x-1' : 'text-[#8f8f8f]'
                        }`}
                      />
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-4 pt-3 border-t border-[#f2f2f2] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#8f8f8f]">
                      <div>
                        Target: <span className="text-[#171717] font-medium">{finding.affectedEndpoint || finding.affectedTarget}</span>
                      </div>
                      {finding.relatedTaskId && (
                        <span className="text-[#0070f3] font-medium">
                          Linked Task: {finding.relatedTaskId}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Observable Execution Events Log (Geist White / Neutral Card, Zero Black Boxes) */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-5 space-y-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#047857]" />
                <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-[#171717]">
                  Observable Security Execution Activity
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#047857] flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
                Live Telemetry
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs pr-1">
              {securityScanEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] text-[#4d4d4d]"
                >
                  <span className="text-[10px] text-[#8f8f8f] shrink-0 mt-0.5">{ev.timestamp}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#171717] border border-[#ebebeb] uppercase font-semibold shrink-0">
                    {ev.stage}
                  </span>
                  <span className="text-[#171717] leading-relaxed flex-1">{ev.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Finding Detail Inspector & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedFinding ? (
            <div className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-6">
              {/* Finding Header */}
              <div className="border-b border-[#ebebeb] pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2.5 py-0.5 rounded-[4px] border border-[#ebebeb]">
                    {selectedFinding.findingCode}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge
                      label={selectedFinding.severity.toUpperCase()}
                      variant={selectedFinding.severity === 'critical' ? 'red' : selectedFinding.severity === 'high' ? 'terracotta' : 'amber'}
                      size="sm"
                    />
                    <StatusBadge
                      label={selectedFinding.status.replace('-', ' ').toUpperCase()}
                      variant={
                        selectedFinding.status === 'verified-fixed'
                          ? 'green'
                          : selectedFinding.status === 'fix-in-progress'
                          ? 'blue'
                          : selectedFinding.status === 'accepted-risk'
                          ? 'purple'
                          : 'neutral'
                      }
                      size="sm"
                    />
                  </div>
                </div>

                <h2 className="font-sans text-lg sm:text-xl font-semibold tracking-[-0.4px] text-[#171717] leading-snug">
                  {selectedFinding.title}
                </h2>

                {/* Classification Chips */}
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#8f8f8f] pt-1">
                  {selectedFinding.owasp && (
                    <span className="bg-[#fafafa] text-[#171717] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                      {selectedFinding.owasp}
                    </span>
                  )}
                  {selectedFinding.cwe && (
                    <span className="bg-[#fafafa] text-[#171717] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                      {selectedFinding.cwe}
                    </span>
                  )}
                  {selectedFinding.cvss && (
                    <span className="bg-[#fef2f2] text-[#ee0000] px-2 py-0.5 rounded-[4px] border border-[#fecaca] font-semibold">
                      CVSS {selectedFinding.cvss}
                    </span>
                  )}
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-mono text-[11px] font-semibold text-[#8f8f8f] uppercase block mb-1">
                    Affected Component / Endpoint:
                  </span>
                  <div className="bg-[#fafafa] p-2.5 rounded-[6px] border border-[#ebebeb] font-mono text-[#171717]">
                    {selectedFinding.affectedEndpoint || selectedFinding.affectedFile || selectedFinding.affectedTarget}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[11px] font-semibold text-[#8f8f8f] uppercase block mb-1">
                    Reproduction Summary:
                  </span>
                  <p className="bg-[#fafafa] p-3 rounded-[6px] border border-[#ebebeb] text-[#4d4d4d] leading-relaxed">
                    {selectedFinding.reproductionSummary || 'Automated verification probe executed via VulnClaw agentic solver.'}
                  </p>
                </div>

                {/* VulnClaw / Strix Evidence Records */}
                <div>
                  <span className="font-mono text-[11px] font-semibold text-[#ab570a] uppercase block mb-2 flex items-center gap-1.5">
                    <FileCode className="h-3.5 w-3.5" />
                    <span>Verifiable Evidence Trail ({selectedFindingEvidence.length})</span>
                  </span>

                  <div className="space-y-2">
                    {selectedFindingEvidence.length === 0 ? (
                      <div className="p-3 bg-[#fafafa] border border-[#ebebeb] rounded-[6px] text-xs font-mono text-[#8f8f8f]">
                        No recorded evidence payload for this finding.
                      </div>
                    ) : (
                      selectedFindingEvidence.map((ev) => (
                        <div
                          key={ev.id}
                          className="bg-[#fafafa] p-3 rounded-[6px] border border-[#ebebeb] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#8f8f8f]">
                            <span className="font-medium text-[#171717]">{ev.title}</span>
                            <div className="flex items-center gap-2">
                              <span>{ev.capturedAt}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyEvidence(ev.content, ev.id)}
                                className="text-[#171717] hover:underline flex items-center gap-0.5"
                              >
                                {copiedEvidenceId === ev.id ? (
                                  <Check className="h-3 w-3 text-[#047857]" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          </div>
                          <pre className="p-2.5 rounded-[4px] bg-white border border-[#ebebeb] text-[11px] font-mono text-[#171717] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48">
                            {ev.content}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Remediation Guidance */}
                <div>
                  <span className="font-mono text-[11px] font-semibold text-[#047857] uppercase block mb-1">
                    Remediation Recommendation:
                  </span>
                  <p className="bg-[#ecfdf5] p-3 rounded-[6px] border border-[#a7f3d0] text-[#065f46] leading-relaxed">
                    {selectedFinding.remediation}
                  </p>
                </div>

                {/* Risk Acceptance Note if applicable */}
                {selectedFinding.status === 'accepted-risk' && selectedFinding.riskAcceptance && (
                  <div className="bg-[#f5f3ff] p-3.5 rounded-[6px] border border-[#ddd6fe] space-y-1 text-xs">
                    <div className="font-mono text-[11px] text-[#7928ca] font-bold">
                      Risk Accepted by {selectedFinding.riskAcceptance.acceptedBy} ({selectedFinding.riskAcceptance.acceptedAt})
                    </div>
                    <p className="text-[#5b21b6] italic">
                      "{selectedFinding.riskAcceptance.rationale}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Kanban Task, Retest, Accept Risk */}
              <div className="pt-4 border-t border-[#ebebeb] space-y-3">
                {selectedFinding.status !== 'verified-fixed' && (
                  <button
                    onClick={() => createRemediationTaskFromFinding(selectedFinding.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Remediation Task on Developer Kanban</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled={isRetesting}
                    onClick={() => handleRetest(selectedFinding.id)}
                    className="flex items-center justify-center gap-2 rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-xs font-mono text-[#171717] hover:bg-[#fafafa] transition-all"
                  >
                    <RotateCw className={`h-3.5 w-3.5 ${isRetesting ? 'animate-spin' : ''}`} />
                    <span>{isRetesting ? 'Retesting...' : 'Automated Retest'}</span>
                  </button>

                  {selectedFinding.status !== 'accepted-risk' && selectedFinding.status !== 'verified-fixed' && (
                    <button
                      onClick={() => setRiskModalOpen(true)}
                      className="flex items-center justify-center gap-2 rounded-[6px] border border-[#ddd6fe] bg-[#f5f3ff] px-3 py-2 text-xs font-mono text-[#7928ca] hover:bg-[#ede9fe] transition-all"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Accept Risk</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[12px] border border-[#ebebeb] bg-white p-12 text-center text-xs font-mono text-[#8f8f8f]">
              Select a vulnerability finding to inspect evidence and trigger remediation.
            </div>
          )}

          {/* Strix Multi-Agent Architecture Graph */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-5 space-y-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#0070f3]" />
                <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-[#171717]">
                  Autonomous Testing Worker Hierarchy
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#047857]">Idle / Ready</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                <span className="text-[#171717] font-medium">Coordinator Agent ({activeWorkspace.code})</span>
                <span className="text-[#047857] font-semibold">Active</span>
              </div>
              <div className="pl-4 space-y-1.5 border-l-2 border-[#ebebeb] ml-3">
                <div className="flex items-center justify-between p-1.5 rounded-[4px] bg-[#fafafa] border border-[#ebebeb] text-[11px]">
                  <span className="text-[#8f8f8f]">├── Strix Tree-Sitter AST Scanner</span>
                  <span className="text-[#171717]">Ready</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-[4px] bg-[#fafafa] border border-[#ebebeb] text-[11px]">
                  <span className="text-[#8f8f8f]">├── VulnClaw HTTP Prober</span>
                  <span className="text-[#171717]">Ready</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded-[4px] bg-[#fafafa] border border-[#ebebeb] text-[11px]">
                  <span className="text-[#8f8f8f]">└── Evidence & Gate Evaluator</span>
                  <span className="text-[#047857]">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Security Assessment Modal */}
      <Modal
        isOpen={isStartModalOpen}
        onClose={() => setStartModalOpen(false)}
        title={`Start Autonomous Security Assessment (${activeWorkspace.code})`}
        subtitle="Execute authorized security testing against repositories, APIs, or staging builds."
      >
        <form onSubmit={handleStartAssessment} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Assessment Name
            </label>
            <input
              type="text"
              required
              value={scanName}
              onChange={(e) => setScanName(e.target.value)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Target Type
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value as any)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              >
                <option value="api">API Endpoint</option>
                <option value="repository">Source Repository</option>
                <option value="web-app">Web Application</option>
                <option value="openapi">OpenAPI Schema</option>
                <option value="build">Build Artifact</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Analysis Engine
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as any)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              >
                <option value="vulnclaw">VulnClaw Verifiable Prober</option>
                <option value="strix">Strix OWASP AST Engine</option>
                <option value="demo">Demo Security Adapter</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Target URL / Host Scope
            </label>
            <input
              type="text"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Allowed Targets (Comma separated)
              </label>
              <input
                type="text"
                value={allowedTargets}
                onChange={(e) => setAllowedTargets(e.target.value)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Excluded Targets
              </label>
              <input
                type="text"
                value={excludedTargets}
                onChange={(e) => setExcludedTargets(e.target.value)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* MANDATORY AUTHORIZATION SCOPE CHECKBOX */}
          <div className="rounded-[8px] border border-[#fcd34d] bg-[#ffefcf] p-4 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="auth-check"
                checked={isAuthorized}
                onChange={(e) => setIsAuthorized(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#ab570a] text-[#171717] focus:ring-[#171717]"
              />
              <label htmlFor="auth-check" className="text-xs text-[#78350f] leading-relaxed cursor-pointer">
                <strong>Explicit Testing Authorization:</strong> I confirm that I own this target or have explicit written authorization from system owners to perform automated security assessments.
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setStartModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isAuthorized}
              className={`rounded-[6px] px-5 py-2 text-xs font-medium text-white transition-all ${
                isAuthorized
                  ? 'bg-[#171717] hover:bg-[#333333]'
                  : 'bg-[#ebebeb] text-[#8f8f8f] cursor-not-allowed'
              }`}
            >
              Initiate Authorized Assessment
            </button>
          </div>
        </form>
      </Modal>

      {/* Risk Acceptance Modal */}
      <Modal
        isOpen={isRiskModalOpen}
        onClose={() => setRiskModalOpen(false)}
        title="Accept Security Risk"
        subtitle="Formal risk acceptance requires documented rationale and approver signoff."
      >
        <form onSubmit={handleAcceptRisk} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Approver Name / Role
            </label>
            <input
              type="text"
              required
              value={riskApprover}
              onChange={(e) => setRiskApprover(e.target.value)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Business & Technical Justification / Rationale
            </label>
            <textarea
              rows={4}
              required
              value={riskRationale}
              onChange={(e) => setRiskRationale(e.target.value)}
              placeholder="Detail why this vulnerability risk is acceptable for current release cycle and mitigating compensating controls..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setRiskModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#7928ca] px-5 py-2 text-xs font-medium text-white hover:bg-[#6920b3] transition-all"
            >
              Confirm Risk Acceptance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
