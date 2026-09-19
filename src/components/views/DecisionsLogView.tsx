import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { MemoryTrigger } from '../memory/MemoryTrigger';
import { ProjectDecision } from '../../types';

export const DecisionsLogView: React.FC = () => {
  const { decisions, logDecision } = useProject();
  const [isNewDecisionModalOpen, setNewDecisionModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectDecision['category']>('Architecture');
  const [contextText, setContextText] = useState('');
  const [decisionMade, setDecisionMade] = useState('');
  const [consequences, setConsequences] = useState('');
  const [stakeholders, setStakeholders] = useState('Project Maintainer, Principal Architect');

  const handleLogDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !decisionMade.trim()) return;

    logDecision({
      title,
      category,
      context: contextText,
      decisionMade,
      consequences,
      stakeholders: stakeholders.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setNewDecisionModalOpen(false);
    setTitle('');
    setContextText('');
    setDecisionMade('');
    setConsequences('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Permanent Project Decision Log (ADRs)
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Immutable architectural decision records capturing context, tradeoffs considered, technical rationale, and downstream consequences.
          </p>
        </div>

        <button
          onClick={() => setNewDecisionModalOpen(true)}
          className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Record Decision (ADR)</span>
        </button>
      </div>

      {/* Decisions Timeline Cards */}
      <div className="space-y-6">
        {decisions.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#ebebeb] bg-white p-12 text-center">
            <Scale className="h-10 w-10 text-[#a1a1a1] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#171717]">No Architecture Decisions Logged</h3>
            <p className="text-xs text-[#8f8f8f] mt-1 max-w-md mx-auto">
              Record architectural decision records (ADRs) to preserve technology choices, trade-offs, and invariants in Project Memory.
            </p>
            <button
              onClick={() => setNewDecisionModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs font-medium text-white shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Record First Decision (ADR)</span>
            </button>
          </div>
        ) : (
          decisions.map((dec) => (
          <div
            key={dec.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-6 hover:border-[#a1a1a1] transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f2f2f2] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2.5 py-0.5 rounded-[4px] border border-[#ebebeb]">
                    {dec.decisionCode}
                  </span>
                  <StatusBadge label={dec.category} variant="purple" size="sm" />
                  <MemoryTrigger entityType="decision" entityId={dec.id} variant="compact" />
                </div>
                <h3 className="mt-2.5 font-sans font-semibold text-xl text-[#171717]">
                  {dec.title}
                </h3>
              </div>

              <span className="text-xs font-mono text-[#8f8f8f] flex items-center gap-1.5 self-start sm:self-auto">
                <Calendar className="h-3.5 w-3.5" /> Date: {dec.date}
              </span>
            </div>

            {/* Context & Alternatives */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#8f8f8f] block mb-1">
                  1. Context & Problem Rationale:
                </span>
                <p className="text-[#4d4d4d] leading-relaxed bg-[#fafafa] p-4 rounded-[8px] border border-[#ebebeb]">
                  {dec.context}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#047857] block mb-1">
                  2. Decision Made:
                </span>
                <p className="text-[#065f46] font-medium leading-relaxed bg-[#ecfdf5] p-4 rounded-[8px] border border-[#a7f3d0]">
                  {dec.decisionMade}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#ab570a] block mb-1">
                  3. Consequences & Downstream Impact:
                </span>
                <p className="text-[#4d4d4d] leading-relaxed bg-[#fafafa] p-4 rounded-[8px] border border-[#ebebeb]">
                  {dec.consequences}
                </p>
              </div>
            </div>

            {/* Stakeholders footer */}
            <div className="pt-4 border-t border-[#f2f2f2] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#8f8f8f]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#8f8f8f]" />
                <span>Stakeholders: <strong className="text-[#171717]">{dec.stakeholders.join(' • ')}</strong></span>
              </div>
              <span className="text-[#047857] font-medium">Recorded Permanently in Project Memory OS</span>
            </div>
          </div>
        )))}
      </div>

      {/* Record Decision Modal */}
      <Modal
        isOpen={isNewDecisionModalOpen}
        onClose={() => setNewDecisionModalOpen(false)}
        title="Record Architectural Decision Record (ADR)"
        subtitle="Capture permanent rationale to eliminate future context reconstruction tax."
      >
        <form onSubmit={handleLogDecision} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Decision Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Migration of Payment Workflow to XState Finite State Machine"
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              >
                <option value="Architecture">Architecture</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Stakeholders (Comma separated)
              </label>
              <input
                type="text"
                value={stakeholders}
                onChange={(e) => setStakeholders(e.target.value)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              1. Context & Alternatives Considered
            </label>
            <textarea
              rows={3}
              required
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              placeholder="Explain the background conditions and alternative paths considered..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              2. Decision Made
            </label>
            <textarea
              rows={3}
              required
              value={decisionMade}
              onChange={(e) => setDecisionMade(e.target.value)}
              placeholder="State the exact technical or architectural policy adopted..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              3. Downstream Consequences
            </label>
            <textarea
              rows={2}
              required
              value={consequences}
              onChange={(e) => setConsequences(e.target.value)}
              placeholder="Impact on performance, team velocity, tech debt, and future flexibility..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setNewDecisionModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#171717] px-5 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              Record ADR
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
