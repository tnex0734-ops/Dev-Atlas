import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  Users,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Link,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { MemoryTrigger } from '../memory/MemoryTrigger';
import { RoleMemoryWidget } from '../memory/RoleMemoryWidget';
import { ProductRequirement } from '../../types';

export const RequirementsView: React.FC = () => {
  const { prds, addPRD, setActiveSection } = useProject();
  const [selectedPRD, setSelectedPRD] = useState<ProductRequirement>(prds[0] || null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // New PRD form state
  const [newTitle, setNewTitle] = useState('');
  const [newProblem, setNewProblem] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newUserStory, setNewUserStory] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [newPriority, setNewPriority] = useState<'P0' | 'P1' | 'P2'>('P1');
  const [newTargetRelease, setNewTargetRelease] = useState('v1.0.0');

  const handleCreatePRD = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const reqCode = `PRD-${101 + prds.length}`;
    addPRD({
      reqCode,
      title: newTitle,
      problemStatement: newProblem,
      businessImpact: newImpact,
      userStories: newUserStory ? [newUserStory] : ['As a user, I want the feature to work seamlessly.'],
      acceptanceCriteria: newCriteria ? newCriteria.split('\n').filter(Boolean) : ['Zero regressions on release.'],
      priority: newPriority,
      targetRelease: newTargetRelease,
      stage: 'In Development',
      leadPM: 'Project Lead',
      leadDesigner: 'Design Systems Lead',
      leadDev: 'Software Architect',
    });

    setCreateModalOpen(false);
    setNewTitle('');
    setNewProblem('');
    setNewImpact('');
    setNewUserStory('');
    setNewCriteria('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Requirements & PRD Hub
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#8f8f8f]">
            Structured PRDs with testable acceptance criteria, business impact scoring, and linked sprint tasks.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New PRD</span>
        </button>
      </div>

      {/* Role Memory: Product Decisions & Scope Rationale */}
      <RoleMemoryWidget role="pm" />

      {/* 2-Column Split: PRD List + Active Specification Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: PRD Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono text-[#8f8f8f] uppercase tracking-wider block mb-2">
            Active PRD Specifications ({prds.length})
          </span>
          {prds.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-[#ebebeb] bg-white p-8 text-center">
              <FileText className="h-8 w-8 text-[#a1a1a1] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#171717]">No PRDs In This Workspace</p>
              <p className="text-[11px] text-[#8f8f8f] mt-1">Import a GitHub repo or click "+ New PRD" to author specifications.</p>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 rounded-[6px] bg-[#171717] px-3 py-1.5 text-xs text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New PRD</span>
              </button>
            </div>
          ) : (
            prds.map((prd) => {
              const isSelected = selectedPRD?.id === prd.id;
              return (
                <div
                  key={prd.id}
                  onClick={() => setSelectedPRD(prd)}
                  className={`cursor-pointer rounded-[12px] p-4 border transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.04)] ${
                    isSelected
                      ? 'bg-white border-[#171717] shadow-[0px_2px_4px_rgba(0,0,0,0.06)]'
                      : 'bg-white border-[#ebebeb] hover:border-[#a1a1a1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                        {prd.reqCode}
                      </span>
                      <StatusBadge label={prd.priority} variant={prd.priority === 'P0' ? 'red' : 'amber'} size="sm" />
                    </div>
                    <span className="text-[11px] font-mono text-[#8f8f8f]">{prd.targetRelease}</span>
                  </div>

                  <h4 className="mt-2 text-sm font-semibold text-[#171717]">
                    {prd.title}
                  </h4>

                  <p className="mt-1.5 text-xs text-[#4d4d4d] line-clamp-2 leading-relaxed">
                    {prd.problemStatement}
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#f2f2f2] flex items-center justify-between text-[11px] font-mono text-[#8f8f8f]">
                    <div className="flex items-center gap-2">
                      <span>{prd.stage}</span>
                      <MemoryTrigger entityType="prd" entityId={prd.id} variant="compact" />
                    </div>
                    {prd.originFeedbackCount && (
                      <span className="text-[#0070f3] flex items-center gap-1">
                        <Link className="h-3 w-3" /> {prd.originFeedbackCount} Feedback Origins
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Deep PRD View */}
        <div className="lg:col-span-7">
          {selectedPRD ? (
            <div className="rounded-[12px] border border-[#ebebeb] bg-white p-6 sm:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-6">
              {/* Header */}
              <div className="border-b border-[#ebebeb] pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-[#171717] bg-[#f5f5f5] px-2.5 py-1 rounded-[4px] border border-[#ebebeb]">
                      {selectedPRD.reqCode}
                    </span>
                    <StatusBadge label={selectedPRD.priority} variant={selectedPRD.priority === 'P0' ? 'red' : 'amber'} dot />
                    <StatusBadge label={selectedPRD.stage} variant="neutral" />
                    <MemoryTrigger entityType="prd" entityId={selectedPRD.id} variant="button" label="Why this changed" />
                  </div>
                  <span className="text-xs font-mono text-[#8f8f8f]">
                    Updated: {selectedPRD.lastUpdated}
                  </span>
                </div>

                <h2 className="mt-3 font-sans text-xl sm:text-2xl font-semibold tracking-[-0.4px] text-[#171717]">
                  {selectedPRD.title}
                </h2>
              </div>

              {/* Cross-functional Leads */}
              <div className="grid grid-cols-3 gap-3 rounded-[8px] bg-[#fafafa] p-3.5 border border-[#ebebeb] text-xs font-mono">
                <div>
                  <span className="text-[#8f8f8f] block text-[10px]">LEAD PM</span>
                  <span className="text-[#171717] font-semibold">{selectedPRD.leadPM}</span>
                </div>
                <div>
                  <span className="text-[#8f8f8f] block text-[10px]">LEAD DESIGNER</span>
                  <span className="text-[#171717] font-semibold">{selectedPRD.leadDesigner}</span>
                </div>
                <div>
                  <span className="text-[#8f8f8f] block text-[10px]">LEAD DEVELOPER</span>
                  <span className="text-[#171717] font-semibold">{selectedPRD.leadDev}</span>
                </div>
              </div>

              {/* Problem & Impact */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#ab570a]">
                    1. Problem Statement
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-[#4d4d4d] leading-relaxed bg-[#fafafa] p-3.5 rounded-[6px] border border-[#ebebeb]">
                    {selectedPRD.problemStatement}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#047857]">
                    2. Business & Revenue Impact
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm text-[#4d4d4d] leading-relaxed bg-[#fafafa] p-3.5 rounded-[6px] border border-[#ebebeb]">
                    {selectedPRD.businessImpact}
                  </p>
                </div>
              </div>

              {/* User Stories */}
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#171717] mb-2">
                  3. User Stories
                </h4>
                <div className="space-y-2">
                  {selectedPRD.userStories.map((story, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-[6px] bg-[#fafafa] p-3 border border-[#ebebeb] text-xs text-[#4d4d4d]"
                    >
                      <Users className="h-4 w-4 text-[#0070f3] mt-0.5 shrink-0" />
                      <span>{story}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acceptance Criteria */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#171717]">
                    4. Testable Acceptance Criteria
                  </h4>
                  <span className="text-[10px] font-mono text-[#047857]">
                    Mapped to QA Test Matrix
                  </span>
                </div>
                <div className="space-y-2">
                  {selectedPRD.acceptanceCriteria.map((criterion, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-[6px] bg-[#fafafa] p-3 border border-[#ebebeb] text-xs text-[#171717]"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#047857] mt-0.5 shrink-0" />
                      <span className="font-mono text-xs">{criterion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast Track Actions */}
              <div className="pt-4 border-t border-[#ebebeb] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setActiveSection('prompts')}
                  className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate AI Prompt with this PRD</span>
                </button>

                <button
                  onClick={() => setActiveSection('tasks')}
                  className="flex items-center gap-1.5 text-xs text-[#4d4d4d] hover:text-[#171717] font-mono"
                >
                  <span>View Linked Sprint Tasks</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-[12px] border border-[#ebebeb] bg-white p-12 text-center text-[#8f8f8f]">
              Select a PRD specification from the list to view full acceptance criteria and dependencies.
            </div>
          )}
        </div>
      </div>

      {/* Author New PRD Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Author New Product Requirement (PRD)"
        subtitle="Formal PRDs connect to user issues, dev sprints, and QA gating."
      >
        <form onSubmit={handleCreatePRD} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              PRD Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Biometric Fast Checkout Handshake"
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              >
                <option value="P0">P0 - Blocker</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Normal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Target Release
              </label>
              <input
                type="text"
                value={newTargetRelease}
                onChange={(e) => setNewTargetRelease(e.target.value)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Problem Statement
            </label>
            <textarea
              rows={2}
              required
              value={newProblem}
              onChange={(e) => setNewProblem(e.target.value)}
              placeholder="Detail the exact user friction or crash telemetry..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Business & Revenue Impact
            </label>
            <textarea
              rows={2}
              required
              value={newImpact}
              onChange={(e) => setNewImpact(e.target.value)}
              placeholder="e.g. Recovers ₹15,00,000/mo in abandoned checkout conversions..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Testable Acceptance Criteria (One per line)
            </label>
            <textarea
              rows={3}
              required
              value={newCriteria}
              onChange={(e) => setNewCriteria(e.target.value)}
              placeholder="1. Graceful fallback on user biometric abort.&#10;2. Idempotent payment intent deduplication.&#10;3. Zero UI unresponsiveness."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none font-mono"
            />
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#171717] px-5 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              Publish PRD Specification
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
