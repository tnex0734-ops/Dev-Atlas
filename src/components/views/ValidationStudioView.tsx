import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  Eye,
  Columns,
  Maximize2,
  Sparkles,
  MapPin,
  X,
  Check,
  RefreshCw,
  Fingerprint,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { MemoryTrigger } from '../memory/MemoryTrigger';
import { RoleMemoryWidget } from '../memory/RoleMemoryWidget';
import { DesignAnnotation } from '../../types';

export const ValidationStudioView: React.FC = () => {
  const {
    validationSessions,
    addAnnotation,
    resolveAnnotation,
    updateValidationSessionStatus,
    showToast,
  } = useProject();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    validationSessions[0]?.id || 'val-default'
  );
  const [viewMode, setViewMode] = useState<'side-by-side' | 'figma-only' | 'live-only'>('side-by-side');
  const [isPinModeActive, setIsPinModeActive] = useState(false);

  // Pin Creation Popover state
  const [newPinCoords, setNewPinCoords] = useState<{ xPercent: number; yPercent: number } | null>(null);
  const [pinText, setPinText] = useState('');
  const [pinType, setPinType] = useState<DesignAnnotation['type']>('spacing');
  const [pinAuthorRole, setPinAuthorRole] = useState<'Designer' | 'Developer' | 'PM' | 'QA'>('Designer');

  // Interactive Live Build Sandbox State Simulator for Checkout Modal
  const [fsmState, setFsmState] = useState<'idle' | 'initiating' | 'biometric-challenge' | 'processing' | 'success' | 'retry-fallback'>('idle');
  const [isSimulatedTokenPaddingFixed, setIsSimulatedTokenPaddingFixed] = useState(false);

  const currentSession = validationSessions.find((s) => s.id === selectedSessionId) || validationSessions[0] || {
    id: 'val-default',
    featureId: 'feat-01',
    featureTitle: 'Component Architecture Validation',
    screenName: 'Design Spec vs Live Component',
    figmaFrameUrl: '',
    figmaLastUpdated: 'Today',
    status: 'In Review',
    designer: 'Design Systems Lead',
    mismatchCount: 0,
    annotations: [],
    history: [],
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPinModeActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setNewPinCoords({ xPercent: x, yPercent: y });
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinCoords || !pinText.trim()) return;

    addAnnotation(currentSession.id, {
      xPercent: newPinCoords.xPercent,
      yPercent: newPinCoords.yPercent,
      author: pinAuthorRole === 'Designer' ? 'Design Systems Lead' : 'Lead Engineer',
      authorRole: pinAuthorRole,
      text: pinText,
      type: pinType,
    });

    setNewPinCoords(null);
    setPinText('');
    setIsPinModeActive(false);
  };

  // State Machine Simulator helpers
  const handleStartPayment = () => {
    setFsmState('initiating');
    setTimeout(() => {
      setFsmState('biometric-challenge');
    }, 400);
  };

  const handleBiometricSuccess = () => {
    setFsmState('processing');
    setTimeout(() => {
      setFsmState('success');
    }, 800);
  };

  const handleBiometricFail = () => {
    setFsmState('retry-fallback');
  };

  const handleResetFSM = () => {
    setFsmState('idle');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Session Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#e5e7eb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF6039]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">
              Design-to-Dev Validation Studio
            </h1>
            <span className="rounded-[4px] bg-[#f4f4f5] px-2 py-0.5 text-xs font-mono text-[#161616] border border-[#e5e7eb] font-bold">
              Signature Handshake
            </span>
          </div>
          <p className="mt-1 text-sm text-[#525252]">
            Compare Figma design specifications side-by-side with live interactive React builds. Drop visual discrepancy pins and verify token compliance.
          </p>
        </div>

        {/* Action Controls & Session Picker */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="rounded-[6px] border border-[#ebebeb] bg-white px-3 py-1.5 text-xs font-mono text-[#171717] focus:border-[#171717] focus:outline-none"
          >
            {validationSessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.featureTitle} ({session.version})
              </option>
            ))}
          </select>

          <MemoryTrigger entityType="validation" entityId={currentSession.id} variant="button" label="Why this changed" />

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-full bg-[#f5f5f5] p-1 border border-[#ebebeb]">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-[#171717] text-white font-semibold shadow-sm'
                  : 'text-[#8f8f8f] hover:text-[#171717]'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('figma-only')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                viewMode === 'figma-only'
                  ? 'bg-[#171717] text-white font-semibold shadow-sm'
                  : 'text-[#8f8f8f] hover:text-[#171717]'
              }`}
            >
              Figma Spec
            </button>
            <button
              onClick={() => setViewMode('live-only')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                viewMode === 'live-only'
                  ? 'bg-[#171717] text-white font-semibold shadow-sm'
                  : 'text-[#8f8f8f] hover:text-[#171717]'
              }`}
            >
              Live Build
            </button>
          </div>

          {/* Toggle Pin Dropper */}
          <button
            onClick={() => setIsPinModeActive(!isPinModeActive)}
            className={`flex items-center gap-2 rounded-[6px] px-3.5 py-1.5 text-xs font-mono font-medium transition-all border ${
              isPinModeActive
                ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                : 'bg-white text-[#171717] border-[#ebebeb] hover:bg-[#fafafa]'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>{isPinModeActive ? 'Click to Place Pin' : 'Drop Pin Discrepancy'}</span>
          </button>
        </div>
      </div>

      {/* Role Memory: Design Decisions & Spec Rationale */}
      <RoleMemoryWidget role="designer" />

      {/* Session Metadata & Workflow Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[12px] border border-[#ebebeb] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge
            label={currentSession.status}
            variant={
              currentSession.status === 'Approved'
                ? 'green'
                : currentSession.status === 'Changes Requested'
                ? 'amber'
                : 'neutral'
            }
            dot
          />
          <span className="font-mono text-xs text-[#4d4d4d]">
            Screen: <strong className="text-[#171717]">{currentSession.screenName}</strong>
          </span>
          <span className="text-[#ebebeb]">•</span>
          <span className="font-mono text-xs text-[#8f8f8f]">
            Designer: <span className="text-[#171717]">{currentSession.designer}</span> • Lead Dev: <span className="text-[#171717]">{currentSession.leadDev}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateValidationSessionStatus(currentSession.id, 'Changes Requested')}
            className="rounded-[6px] border border-[#fcd34d] bg-[#ffefcf] px-3 py-1.5 text-xs font-mono font-medium text-[#ab570a] hover:bg-[#fed7aa] transition-all"
          >
            ⚠️ Request Changes ({currentSession.annotations.filter((a) => !a.resolved).length})
          </button>
          <button
            onClick={() => updateValidationSessionStatus(currentSession.id, 'Approved')}
            className="rounded-[6px] bg-[#047857] px-3.5 py-1.5 text-xs font-mono font-medium text-white shadow-sm hover:bg-[#065f46] transition-all flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Approve Implementation</span>
          </button>
        </div>
      </div>

      {/* Main Validation Handshake Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL: FIGMA APPROVED SPEC */}
        {(viewMode === 'side-by-side' || viewMode === 'figma-only') && (
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#0070f3] uppercase tracking-wider">
                  Approved Design Specification (Figma)
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#8f8f8f]">Token Compliant Spec</span>
            </div>

            {/* Simulated Figma Spec Canvas */}
            <div className="my-6 flex items-center justify-center p-4 bg-[#fafafa] rounded-[8px] border border-[#ebebeb]">
              <div className="w-full max-w-sm rounded-[12px] bg-white border border-[#ebebeb] p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#171717] text-white text-xs font-bold">
                      DA
                    </div>
                    <span className="font-sans font-semibold text-[#171717] text-sm">
                      StreamFlow VIP Pass
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                    ₹799/mo
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#4d4d4d]">
                  <p className="leading-relaxed">
                    Unlock 1080p60 Ultra-Low Latency streaming, exclusive subscriber chat badges, and monthly bit credits.
                  </p>
                </div>

                {/* Approved Spec Button */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center gap-2 rounded-full bg-[#171717] px-4 py-3.5 text-xs font-mono font-bold text-white shadow-sm min-h-[48px]">
                    <CreditCard className="h-4 w-4" />
                    <span>Pay ₹799 with UPI / Google Pay</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8f8f8f] px-1">
                    <span>Height: 48px (py-3.5)</span>
                    <span className="text-[#047857]">Token: #171717 / 48px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spec Guideline Callouts */}
            <div className="rounded-[8px] bg-[#fafafa] p-3.5 border border-[#ebebeb] text-xs font-mono text-[#4d4d4d] space-y-1.5">
              <span className="text-[10px] uppercase font-semibold text-[#171717] block">
                Design System Constraints:
              </span>
              <p>• Button min-height: <strong className="text-[#171717]">48px</strong> (Touch target accessible)</p>
              <p>• Price badge font: <strong className="text-[#171717]">Geist Mono 14px</strong></p>
              <p>• Surface container: <strong className="text-[#171717]">#FFFFFF with 1px border #EBEBEB</strong></p>
            </div>
          </div>
        )}

        {/* RIGHT PANEL: LIVE REACT BUILD WITH PIN-DROPPING & INTERACTIVE STATE SIMULATOR */}
        {(viewMode === 'side-by-side' || viewMode === 'live-only') && (
          <div
            onClick={handleCanvasClick}
            className={`rounded-[12px] border bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between relative transition-all ${
              isPinModeActive ? 'cursor-crosshair border-[#171717] shadow-md' : 'border-[#ebebeb]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#10b981]" />
                <span className="font-mono text-xs font-semibold text-[#047857] uppercase tracking-wider">
                  Live React Build Sandbox ({currentSession.version})
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#8f8f8f]">Interactive Preview</span>
            </div>

            {/* Discrepancy Pin Overlay Marker Rendering */}
            {currentSession.annotations.map((ann, idx) => (
              <div
                key={ann.id}
                style={{ top: `${ann.yPercent}%`, left: `${ann.xPercent}%` }}
                className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 group cursor-pointer`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold text-white shadow-md transition-transform hover:scale-125 border ${
                    ann.resolved
                      ? 'bg-[#047857] border-[#047857]'
                      : 'bg-[#ee0000] border-[#ee0000] animate-bounce'
                  }`}
                >
                  #{idx + 1}
                </div>

                {/* Tooltip Card */}
                <div className="pointer-events-auto absolute left-8 top-0 hidden w-64 rounded-[8px] border border-[#ebebeb] bg-white p-3 shadow-[0px_8px_30px_rgba(0,0,0,0.12)] group-hover:block z-40">
                  <div className="flex items-center justify-between border-b border-[#ebebeb] pb-1.5 mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-[#171717] uppercase">
                      Pin #{idx + 1} ({ann.type})
                    </span>
                    <span className="text-[10px] font-mono text-[#8f8f8f]">{ann.author}</span>
                  </div>
                  <p className="text-xs text-[#4d4d4d] leading-normal">{ann.text}</p>
                  <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#ebebeb] text-[10px] font-mono">
                    <span className={ann.resolved ? 'text-[#047857]' : 'text-[#ee0000]'}>
                      {ann.resolved ? '✓ Resolved' : '● Open Mismatch'}
                    </span>
                    {!ann.resolved && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resolveAnnotation(currentSession.id, ann.id);
                        }}
                        className="text-[#0070f3] hover:underline font-semibold"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Interactive Live Component Sandbox */}
            <div className="my-6 flex flex-col items-center justify-center p-4 bg-[#fafafa] rounded-[8px] border border-[#ebebeb]">
              <div className="w-full max-w-sm rounded-[12px] bg-white border border-[#ebebeb] p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#171717] text-white text-xs font-bold">
                      DA
                    </div>
                    <span className="font-sans font-semibold text-[#171717] text-sm">
                      StreamFlow VIP Pass
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#4d4d4d] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                    ₹799/mo
                  </span>
                </div>

                <div className="text-xs text-[#4d4d4d]">
                  <p className="leading-relaxed">
                    Unlock 1080p60 Ultra-Low Latency streaming, exclusive subscriber chat badges, and monthly bit credits.
                  </p>
                </div>

                {/* State-Machine Driven Live Button */}
                <div className="space-y-2">
                  {fsmState === 'idle' && (
                    <button
                      onClick={handleStartPayment}
                      className={`w-full flex items-center justify-center gap-2 rounded-full bg-[#FF6039] text-xs font-mono font-bold text-[#161616] shadow-sm hover:bg-[#E54D26] transition-all cursor-pointer ${
                        isSimulatedTokenPaddingFixed ? 'py-3.5 min-h-[48px]' : 'py-2.5 min-h-[38px]'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Pay ₹799 with UPI / Google Pay</span>
                    </button>
                  )}

                  {fsmState === 'initiating' && (
                    <div className="flex items-center justify-center gap-2 rounded-full bg-[#fafafa] py-3 text-xs font-mono text-[#171717] border border-[#ebebeb]">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Creating Idempotent Intent...</span>
                    </div>
                  )}

                  {fsmState === 'biometric-challenge' && (
                    <div className="rounded-[8px] bg-[#ffefcf] p-4 border border-[#fcd34d] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#ab570a]">
                        <Fingerprint className="h-4 w-4 text-[#ab570a]" />
                        <span className="font-semibold">Android 14 Biometric Challenge</span>
                      </div>
                      <p className="text-xs text-[#78350f]">
                        Touch fingerprint sensor or authenticate passkey to confirm purchase.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handleBiometricSuccess}
                          className="flex-1 rounded-[6px] bg-[#047857] py-2 text-xs font-mono font-medium text-white hover:bg-[#065f46]"
                        >
                          Confirm Fingerprint
                        </button>
                        <button
                          onClick={handleBiometricFail}
                          className="rounded-[6px] bg-[#fef2f2] px-3 py-2 text-xs font-mono text-[#ee0000] border border-[#fecaca]"
                        >
                          Simulate Abort
                        </button>
                      </div>
                    </div>
                  )}

                  {fsmState === 'processing' && (
                    <div className="flex items-center justify-center gap-2 rounded-full bg-[#ecfdf5] py-3.5 text-xs font-mono text-[#047857] border border-[#a7f3d0]">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Settling Stripe Intent...</span>
                    </div>
                  )}

                  {fsmState === 'success' && (
                    <div className="rounded-[8px] bg-[#ecfdf5] p-4 border border-[#a7f3d0] text-center space-y-2">
                      <CheckCircle2 className="h-6 w-6 text-[#047857] mx-auto" />
                      <p className="text-xs font-bold font-mono text-[#065f46]">VIP Pass Activated!</p>
                      <button
                        onClick={handleResetFSM}
                        className="text-[11px] font-mono text-[#047857] hover:underline"
                      >
                        Reset State Simulator
                      </button>
                    </div>
                  )}

                  {fsmState === 'retry-fallback' && (
                    <div className="rounded-[8px] bg-[#fef2f2] p-4 border border-[#fecaca] text-center space-y-2">
                      <AlertTriangle className="h-6 w-6 text-[#ee0000] mx-auto" />
                      <p className="text-xs font-bold font-mono text-[#991b1b]">Biometric Challenge Aborted</p>
                      <p className="text-[11px] text-[#7f1d1d]">Graceful fallback engaged without crashing Android 14.</p>
                      <button
                        onClick={handleStartPayment}
                        className="w-full rounded-full bg-[#171717] py-2 text-xs font-mono font-bold text-white hover:bg-[#333333]"
                      >
                        Retry Payment
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8f8f8f] px-1">
                    <span>Rendered Height: {isSimulatedTokenPaddingFixed ? '48px (py-3.5)' : '38px (py-2.5)'}</span>
                    <span className={isSimulatedTokenPaddingFixed ? 'text-[#047857]' : 'text-[#ee0000]'}>
                      {isSimulatedTokenPaddingFixed ? 'Token Compliant' : '10px Padding Mismatch'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulator Controls Toolbar */}
            <div className="rounded-[8px] bg-[#fafafa] p-3 border border-[#ebebeb] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-[#171717]" />
                <span className="text-[#4d4d4d]">Test Token Fix:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSimulatedTokenPaddingFixed(!isSimulatedTokenPaddingFixed);
                    showToast(isSimulatedTokenPaddingFixed ? 'Reverted to 38px build' : 'Applied 48px token fix!', 'info');
                  }}
                  className={`rounded-[6px] px-2.5 py-1 text-[11px] font-medium border transition-all ${
                    isSimulatedTokenPaddingFixed
                      ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]'
                      : 'bg-white text-[#4d4d4d] border-[#ebebeb]'
                  }`}
                >
                  {isSimulatedTokenPaddingFixed ? '✓ 48px Padding Active' : 'Toggle 48px Token'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetFSM();
                  }}
                  className="flex items-center gap-1 text-[#8f8f8f] hover:text-[#171717]"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset FSM</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pin Dropper Popover Modal */}
      {newPinCoords && (
        <Modal
          isOpen={true}
          onClose={() => setNewPinCoords(null)}
          title="Drop Visual Discrepancy Pin"
          subtitle={`Placed at X: ${newPinCoords.xPercent}%, Y: ${newPinCoords.yPercent}%`}
        >
          <form onSubmit={handleSavePin} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                  Discrepancy Category
                </label>
                <select
                  value={pinType}
                  onChange={(e) => setPinType(e.target.value as any)}
                  className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
                >
                  <option value="spacing">Spacing / Padding</option>
                  <option value="typography">Typography / Font Token</option>
                  <option value="color">Color Contrast / Palette</option>
                  <option value="state">Interactive Component State</option>
                  <option value="responsive">Responsive / Safe Area</option>
                  <option value="general">General Polish</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                  Author Role
                </label>
                <select
                  value={pinAuthorRole}
                  onChange={(e) => setPinAuthorRole(e.target.value as any)}
                  className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
                >
                  <option value="Designer">Designer (Design Systems Lead)</option>
                  <option value="Developer">Developer (Software Engineer)</option>
                  <option value="PM">PM (Product Lead)</option>
                  <option value="QA">QA (QA Engineer)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Pin Description & Spec Rule
              </label>
              <textarea
                rows={3}
                required
                value={pinText}
                onChange={(e) => setPinText(e.target.value)}
                placeholder="Explain the mismatch between Figma token and live React implementation..."
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-[#e5e7eb] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setNewPinCoords(null)}
                className="btn-secondary-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary-orange"
              >
                Save Discrepancy Pin
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
