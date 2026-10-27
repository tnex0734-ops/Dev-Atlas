import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Layers,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { BugItem } from '../../types';

export const BugTrackerView: React.FC = () => {
  const { bugs, addBugItem, setActiveSection } = useProject();
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [isLogBugModalOpen, setLogBugModalOpen] = useState(false);

  // New bug form
  const [bugTitle, setBugTitle] = useState('');
  const [bugSeverity, setBugSeverity] = useState<BugItem['severity']>('Critical P0');
  const [bugFeature, setBugFeature] = useState('Checkout V2');
  const [isMismatch, setIsMismatch] = useState(false);
  const [bugAssignee, setBugAssignee] = useState('Alex Chen');

  const severities = ['All', 'Critical P0', 'High P1', 'Medium P2', 'Low P3'];

  const filteredBugs = bugs.filter(
    (b) => filterSeverity === 'All' || b.severity === filterSeverity
  );

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle.trim()) return;

    addBugItem({
      title: bugTitle,
      severity: bugSeverity,
      status: 'Open',
      originVersion: 'v4.2.1-rc2',
      relatedFeature: bugFeature,
      isFigmaMismatch: isMismatch,
      reporter: 'Vikram Sethi (QA Lead)',
      assignee: bugAssignee,
    });

    setLogBugModalOpen(false);
    setBugTitle('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#ee0000]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Bug Tracker & Visual Regressions
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Triage defects by severity, origin version, related feature, and Figma visual mismatch flags.
          </p>
        </div>

        <button
          onClick={() => setLogBugModalOpen(true)}
          className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Log Bug Ticket</span>
        </button>
      </div>

      {/* Severity Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {severities.map((s) => (
          <button
            key={s}
            onClick={() => setFilterSeverity(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
              filterSeverity === s
                ? 'bg-[#171717] text-white font-medium shadow-sm'
                : 'bg-white text-[#8f8f8f] hover:text-[#171717] border border-[#ebebeb]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bugs Grid */}
      <div className="space-y-4">
        {filteredBugs.map((bug) => {
          const isCritical = bug.severity === 'Critical P0';

          return (
            <div
              key={bug.id}
              className={`rounded-[12px] border bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isCritical
                  ? 'border-[#fecaca] shadow-[0px_2px_4px_rgba(238,0,0,0.04)]'
                  : 'border-[#ebebeb] hover:border-[#a1a1a1]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#ee0000] bg-[#fef2f2] px-2 py-0.5 rounded-[4px] border border-[#fecaca]">
                    {bug.bugCode}
                  </span>
                  <StatusBadge
                    label={bug.severity}
                    variant={isCritical ? 'red' : 'amber'}
                    size="sm"
                    dot={isCritical}
                  />
                  <StatusBadge label={bug.status} variant="neutral" size="sm" />
                  {bug.isFigmaMismatch && (
                    <span
                      onClick={() => setActiveSection('validation')}
                      className="cursor-pointer font-mono text-[10px] bg-[#fffbeb] text-[#ab570a] px-2 py-0.5 rounded-[4px] border border-[#fde68a] font-medium hover:underline"
                    >
                      🎨 Figma Mismatch Pin
                    </span>
                  )}
                </div>

                <h3 className="font-sans font-semibold text-base sm:text-lg text-[#171717]">
                  {bug.title}
                </h3>

                <p className="text-xs font-mono text-[#8f8f8f]">
                  Feature: <span className="text-[#171717] font-medium">{bug.relatedFeature}</span> • Version: <span className="text-[#171717] font-medium">{bug.originVersion}</span> • Reporter: {bug.reporter}
                </p>
              </div>

              <div className="text-left md:text-right font-mono text-xs text-[#8f8f8f] shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#f2f2f2]">
                <span>Assignee: </span>
                <strong className="text-[#171717] block text-sm">{bug.assignee}</strong>
                <span className="text-[10px] text-[#8f8f8f] block mt-1">{bug.detectedAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Bug Modal */}
      <Modal
        isOpen={isLogBugModalOpen}
        onClose={() => setLogBugModalOpen(false)}
        title="Log Bug or Visual Regression"
        subtitle="Specify defect details, severity level, and related product feature."
      >
        <form onSubmit={handleCreateBug} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Bug Title / Failure Summary
            </label>
            <input
              type="text"
              required
              value={bugTitle}
              onChange={(e) => setBugTitle(e.target.value)}
              placeholder="e.g. Unhandled NullPointerException on Google Pay challenge abort"
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Severity Level
              </label>
              <select
                value={bugSeverity}
                onChange={(e) => setBugSeverity(e.target.value as any)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              >
                <option value="Critical P0">Critical P0 - Blocker</option>
                <option value="High P1">High P1 - Major</option>
                <option value="Medium P2">Medium P2 - Normal</option>
                <option value="Low P3">Low P3 - Minor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Related Feature Area
              </label>
              <input
                type="text"
                value={bugFeature}
                onChange={(e) => setBugFeature(e.target.value)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
            <input
              type="checkbox"
              id="figmaMismatch"
              checked={isMismatch}
              onChange={(e) => setIsMismatch(e.target.checked)}
              className="h-4 w-4 rounded border-[#ebebeb] text-[#171717] focus:ring-[#171717]"
            />
            <label htmlFor="figmaMismatch" className="text-xs text-[#171717] font-medium cursor-pointer">
              Tag as Figma Visual Spec Mismatch (links to Validation Studio)
            </label>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Assignee Engineer
            </label>
            <input
              type="text"
              value={bugAssignee}
              onChange={(e) => setBugAssignee(e.target.value)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setLogBugModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#171717] px-5 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              Log Bug Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
