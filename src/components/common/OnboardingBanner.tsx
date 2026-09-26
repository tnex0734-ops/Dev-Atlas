import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Scale,
  Kanban,
  BrainCircuit,
  X,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAI } from '../../context/AIContext';

const ONBOARDING_STORAGE_KEY = 'devatlas_onboarding_dismissed_v1';

export const OnboardingBanner: React.FC = () => {
  const { setActiveSection, activeWorkspace } = useProject();
  const { openStudio } = useAI();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!saved) {
        setIsDismissed(false);
      }
    } catch {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {}
  };

  if (isDismissed) return null;

  return (
    <div className="rounded-2xl border border-[#EBE5DC] bg-white p-5 sm:p-6 shadow-sm relative overflow-hidden animate-fade-in font-sans">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF6039] text-[#161616] text-[11px] font-bold">
              <BrainCircuit className="h-3 w-3" />
              <span>DevAtlas Project Memory OS</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#18181b]">
              Understand what’s happening, what was decided, and why
            </h2>
            <p className="text-xs sm:text-sm text-[#52525b] max-w-2xl leading-relaxed">
              DevAtlas connects your team’s lifecycle into persistent institutional memory so you never have to reconstruct past decisions from scratch.
            </p>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg text-[#71717a] hover:text-[#18181b] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Dismiss welcome banner"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 4 Connected Memory Steps */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Step 1: Meetings & Syncs */}
          <div
            onClick={() => setActiveSection('meetings')}
            className="group rounded-xl border border-[#EBE5DC] bg-white p-3.5 hover:border-[#FF6039] hover:shadow-xs transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF7F2] border border-[#EBE5DC] text-[#FF6039]">
                <Calendar className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] font-bold text-[#71717a]">01 • Syncs</span>
            </div>
            <h3 className="text-xs font-bold text-[#18181b] group-hover:text-[#FF6039] transition-colors">
              Discussions & Syncs
            </h3>
            <p className="text-[11px] text-[#71717a] leading-relaxed">
              Structured meeting notes linking discussion points to resulting ADRs and task owners.
            </p>
          </div>

          {/* Step 2: Decisions & ADRs */}
          <div
            onClick={() => setActiveSection('decisions')}
            className="group rounded-xl border border-[#EBE5DC] bg-white p-3.5 hover:border-[#FF6039] hover:shadow-xs transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF7F2] border border-[#EBE5DC] text-[#FF6039]">
                <Scale className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] font-bold text-[#71717a]">02 • Decisions</span>
            </div>
            <h3 className="text-xs font-bold text-[#18181b] group-hover:text-[#FF6039] transition-colors">
              Permanent Decision Log
            </h3>
            <p className="text-[11px] text-[#71717a] leading-relaxed">
              Immutable ADRs explaining *why* technical and product decisions were made.
            </p>
          </div>

          {/* Step 3: Tasks with Context */}
          <div
            onClick={() => setActiveSection('tasks')}
            className="group rounded-xl border border-[#EBE5DC] bg-white p-3.5 hover:border-[#FF6039] hover:shadow-xs transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF7F2] border border-[#EBE5DC] text-[#FF6039]">
                <Kanban className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] font-bold text-[#71717a]">03 • Work</span>
            </div>
            <h3 className="text-xs font-bold text-[#18181b] group-hover:text-[#FF6039] transition-colors">
              Connected Sprint Tasks
            </h3>
            <p className="text-[11px] text-[#71717a] leading-relaxed">
              Kanban tasks showing "Why am I doing this?" with direct links back to decisions.
            </p>
          </div>

          {/* Step 4: Role AI Studio */}
          <div
            onClick={() => openStudio('all')}
            className="group rounded-xl border border-[#FFD6CC] bg-[#FFF8F5] p-3.5 hover:border-[#FF6039] hover:shadow-xs transition-all cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF6039] text-[#161616]">
                <BrainCircuit className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] font-bold text-[#FF6039]">04 • AI Studio</span>
            </div>
            <h3 className="text-xs font-bold text-[#18181b] group-hover:text-[#FF6039] transition-colors">
              Role-Aware AI Studio
            </h3>
            <p className="text-[11px] text-[#71717a] leading-relaxed">
              Ask role-specific questions grounded in real project memory with source links.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-[#f0ebe3] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#71717a]">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Active Project: <strong>{activeWorkspace.name}</strong> ({activeWorkspace.code})</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection('meetings')}
              className="font-bold text-[#18181b] hover:text-[#FF6039] inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Recent Syncs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1 rounded-full bg-[#18181b] text-white hover:bg-[#27272a] font-semibold cursor-pointer"
            >
              Got it, start exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
