import React, { useState, useMemo } from 'react';
import {
  Scale,
  Plus,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Code,
  MessageSquare,
  Filter,
  Trash2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { MemoryTrigger } from '../memory/MemoryTrigger';
import { ProjectDecision } from '../../types';

export const DecisionsLogView: React.FC = () => {
  const { decisions, logDecision, deleteDecision, setActiveSection } = useProject();
  const [isNewDecisionModalOpen, setNewDecisionModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'technical' | 'verbal'>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [decisionType, setDecisionType] = useState<'technical' | 'verbal'>('technical');
  const [category, setCategory] = useState<ProjectDecision['category']>('Architecture');
  const [contextText, setContextText] = useState('');
  const [decisionMade, setDecisionMade] = useState('');
  const [consequences, setConsequences] = useState('');
  const [stakeholders, setStakeholders] = useState('Project Maintainer, Principal Architect');

  const isTechDecision = (d: ProjectDecision) =>
    d.decisionType === 'technical' ||
    d.category === 'Architecture' ||
    d.category === 'Operations' ||
    (d.decisionCode && d.decisionCode.startsWith('ADR'));

  const technicalCount = useMemo(() => decisions.filter(isTechDecision).length, [decisions]);
  const verbalCount = useMemo(() => decisions.filter((d) => !isTechDecision(d)).length, [decisions]);

  const filteredDecisions = useMemo(() => {
    return decisions.filter((d) => {
      if (filterType === 'all') return true;
      if (filterType === 'technical') return isTechDecision(d);
      return !isTechDecision(d);
    });
  }, [decisions, filterType]);

  const handleLogDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !decisionMade.trim()) return;

    logDecision({
      title,
      category,
      decisionType,
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
    setDecisionType('technical');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e7eb] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#161616] text-[#FF6039]">
              <Scale className="h-4 w-4" />
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#161616]">
              Permanent Project Decision Log (ADRs)
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#525252]">
            Immutable architectural decision records capturing context, tradeoffs considered, technical rationale, and downstream consequences.
          </p>
        </div>

        <button
          onClick={() => setNewDecisionModalOpen(true)}
          className="btn-primary-orange self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Record Decision (ADR)</span>
        </button>
      </div>

      {/* ── Decision Filter Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-3">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-[#161616] text-white shadow-2xs'
              : 'text-[#525252] hover:text-[#161616] hover:bg-[#f4f4f5]'
          }`}
        >
          All Decisions ({decisions.length})
        </button>
        <button
          onClick={() => setFilterType('technical')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterType === 'technical'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-[#525252] hover:text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Code className="h-3 w-3" />
          <span>Technical ADRs ({technicalCount})</span>
        </button>
        <button
          onClick={() => setFilterType('verbal')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterType === 'verbal'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'text-[#525252] hover:text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          <MessageSquare className="h-3 w-3" />
          <span>Verbal Agreements ({verbalCount})</span>
        </button>
      </div>

      {/* Decisions Timeline Cards */}
      <div className="space-y-6">
        {filteredDecisions.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#e5e7eb] bg-white p-12 text-center">
            <Scale className="h-10 w-10 text-[#a1a1aa] mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#161616]">No Decisions in this Category</h3>
            <p className="text-xs text-[#525252] mt-1 max-w-md mx-auto">
              Record decisions or ingest meeting transcripts to extract Technical ADRs and team agreements.
            </p>
            <button
              onClick={() => setNewDecisionModalOpen(true)}
              className="mt-4 btn-primary-orange text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Record Decision</span>
            </button>
          </div>
        ) : (
          filteredDecisions.map((dec) => {
            const isTech = isTechDecision(dec);
            return (
          <div
            key={dec.id}
            className="card-level-1 space-y-6 hover:border-[#161616] transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#e5e7eb] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#161616] bg-[#f4f4f5] px-2.5 py-0.5 rounded-[4px] border border-[#e5e7eb]">
                    {dec.decisionCode}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-[4px] border ${
                      isTech
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    }`}
                  >
                    {isTech ? <Code className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                    {isTech ? 'TECHNICAL ADR' : 'VERBAL AGREEMENT'}
                  </span>
                  <StatusBadge label={dec.category} variant="purple" size="sm" />
                  <StatusBadge
                    label={dec.status || 'active'}
                    variant={dec.status === 'superseded' ? 'neutral' : 'green'}
                    size="sm"
                  />
                  <MemoryTrigger entityType="decision" entityId={dec.id} variant="compact" />
                </div>
                <h3 className="mt-2.5 font-sans font-bold text-xl text-[#161616]">
                  {dec.title}
                </h3>
              </div>

              <span className="text-xs font-mono text-[#525252] flex items-center gap-1.5 self-start sm:self-auto">
                <Calendar className="h-3.5 w-3.5 text-[#FF6039]" /> Date: {dec.date}
              </span>
              <button
                onClick={() => {
                  if (window.confirm(`Delete decision ${dec.decisionCode}?`)) {
                    deleteDecision(dec.id);
                  }
                }}
                className="text-[#a1a1aa] hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer self-start"
                title="Delete decision"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Context & Alternatives */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#525252] block mb-1">
                  1. Context & Problem Rationale:
                </span>
                <p className="text-[#161616] leading-relaxed bg-[#f9fafb] p-4 rounded-[8px] border border-[#e5e7eb]">
                  {dec.context}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#161616] block mb-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FF6039]" />
                  2. Decision Made:
                </span>
                <p className="text-[#161616] font-medium leading-relaxed bg-[#FFF0EC] p-4 rounded-[8px] border border-[#FFD6CC]">
                  {dec.decisionMade}
                </p>
              </div>

              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#525252] block mb-1">
                  3. Consequences & Downstream Impact:
                </span>
                <p className="text-[#525252] leading-relaxed bg-[#f9fafb] p-4 rounded-[8px] border border-[#e5e7eb]">
                  {dec.consequences}
                </p>
              </div>
            </div>

            {/* Connected Sync and Tasks Chain */}
            {(dec.relatedMeetingTitle || dec.relatedTaskCode) && (
              <div className="rounded-[8px] bg-[#FAF7F2] p-3 border border-[#EBE5DC] flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
                {dec.relatedMeetingTitle && (
                  <button
                    onClick={() => setActiveSection('meetings')}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#18181b] hover:text-[#FF6039] cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#FF6039]" />
                    <span>Originating Sync: <strong>{dec.relatedMeetingTitle}</strong></span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
                {dec.relatedTaskCode && (
                  <button
                    onClick={() => setActiveSection('tasks')}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#FF6039] hover:underline cursor-pointer"
                  >
                    <span>Downstream Implementation: <strong>{dec.relatedTaskCode}</strong></span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* Stakeholders footer */}
            <div className="pt-4 border-t border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#525252]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#525252]" />
                <span>Stakeholders: <strong className="text-[#161616]">{dec.stakeholders.join(' • ')}</strong></span>
              </div>
              <span className="text-[#161616] font-bold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6039]" /> Recorded in Project Memory
              </span>
            </div>
          </div>
            );
          })
        )}
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono font-bold text-[#525252] uppercase tracking-wider">
                Decision Type
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setDecisionType('technical');
                    setCategory('Architecture');
                  }}
                  className={`px-2.5 py-1 rounded-[4px] text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    decisionType === 'technical'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-[#525252] border-[#e5e7eb]'
                  }`}
                >
                  <Code className="h-3 w-3" />
                  <span>Technical (ADR)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDecisionType('verbal');
                    setCategory('Product');
                  }}
                  className={`px-2.5 py-1 rounded-[4px] text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    decisionType === 'verbal'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-[#525252] border-[#e5e7eb]'
                  }`}
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>Verbal Agreement</span>
                </button>
              </div>
            </div>
            <label className="block text-xs font-mono font-bold text-[#525252] uppercase tracking-wider mb-1">
              Decision Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Migration of Payment Workflow to XState Finite State Machine"
              className="w-full rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#161616] focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#525252] uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] p-2.5 text-xs text-[#161616] font-mono focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:bg-white focus:outline-none"
              >
                <option value="Architecture">Architecture</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-[#525252] uppercase tracking-wider mb-1">
                Stakeholders (Comma separated)
              </label>
              <input
                type="text"
                value={stakeholders}
                onChange={(e) => setStakeholders(e.target.value)}
                className="w-full rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] p-2.5 text-xs text-[#161616] font-mono focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#525252] uppercase tracking-wider mb-1">
              1. Context & Alternatives Considered
            </label>
            <textarea
              rows={3}
              required
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              placeholder="Explain the background conditions and alternative paths considered..."
              className="w-full rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#161616] focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#525252] uppercase tracking-wider mb-1">
              2. Decision Made
            </label>
            <textarea
              rows={3}
              required
              value={decisionMade}
              onChange={(e) => setDecisionMade(e.target.value)}
              placeholder="State the exact technical or architectural policy adopted..."
              className="w-full rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#161616] focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#525252] uppercase tracking-wider mb-1">
              3. Downstream Consequences
            </label>
            <textarea
              rows={2}
              required
              value={consequences}
              onChange={(e) => setConsequences(e.target.value)}
              placeholder="Impact on performance, team velocity, tech debt, and future flexibility..."
              className="w-full rounded-[6px] border border-[#e5e7eb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#161616] focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#e5e7eb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setNewDecisionModalOpen(false)}
              className="btn-secondary-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-orange"
            >
              Record ADR
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
