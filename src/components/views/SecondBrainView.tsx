import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Plus,
  PenTool,
  CheckCircle2,
  ListTodo,
  Code,
  Tag,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';

import { ProjectMemoryView } from './ProjectMemoryView';

export const SecondBrainView: React.FC = () => {
  const { secondBrainNotes, addSecondBrainNote, refineNoteWithAI, setActiveSection } = useProject();

  const [activeTab, setActiveTab] = useState<'notes' | 'memory'>('notes');
  const [isQuickCaptureModalOpen, setQuickCaptureModalOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [quickTags, setQuickTags] = useState('Scratchpad, Architecture');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickContent.trim()) return;

    addSecondBrainNote(
      quickTitle,
      quickContent,
      quickTags.split(',').map((t) => t.trim()).filter(Boolean)
    );

    setQuickCaptureModalOpen(false);
    setQuickTitle('');
    setQuickContent('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Switcher: Second Brain Scratchpad vs Central Project Memory */}
      <div className="flex items-center gap-2 border-b border-[#ebebeb] pb-2">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
            activeTab === 'notes'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-[#71717a] hover:text-[#171717] hover:bg-[#f4f4f5]'
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          <span>Scratchpad & AI Refiner</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
            {secondBrainNotes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
            activeTab === 'memory'
              ? 'bg-[#171717] text-white shadow-xs'
              : 'text-[#71717a] hover:text-[#171717] hover:bg-[#f4f4f5]'
          }`}
        >
          <BrainCircuit className="h-3.5 w-3.5 text-amber-400" />
          <span>Project Memory & Change Rationale</span>
          <span className="rounded-full bg-amber-400/20 text-amber-700 px-1.5 py-0.2 text-[10px] font-mono font-semibold">
            Lineage
          </span>
        </button>
      </div>

      {activeTab === 'memory' ? (
        <ProjectMemoryView />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-[#171717]" />
                <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
                  Second Brain & AI Note Refiner
                </h1>
              </div>
              <p className="mt-1 text-sm text-[#4d4d4d]">
                Jot down messy, unstructured developer scratchpad thoughts during coding. Trigger AI refinement into structured specs, takeaways, and action items with one click.
              </p>
            </div>

            <button
              onClick={() => setQuickCaptureModalOpen(true)}
              className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)] self-start sm:self-auto"
            >
              <PenTool className="h-4 w-4" />
              <span>Quick Capture Scratchpad</span>
            </button>
          </div>
        </>
      )}

      {/* Notes Grid */}
      <div className="space-y-6">
        {secondBrainNotes.map((note) => (
          <div
            key={note.id}
            className={`rounded-[12px] border bg-white p-6 sm:p-7 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-5 transition-all ${
              note.isRefined
                ? 'border-[#ebebeb] shadow-[0px_2px_4px_rgba(0,0,0,0.06)]'
                : 'border-[#ebebeb] hover:border-[#a1a1a1]'
            }`}
          >
            {/* Note Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f2f2f2] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-sans font-semibold text-lg sm:text-xl text-[#171717]">
                    {note.title}
                  </h3>
                  <StatusBadge
                    label={note.isRefined ? 'AI Refined Spec' : 'Raw Scratchpad'}
                    variant={note.isRefined ? 'amber' : 'neutral'}
                    size="sm"
                    dot={note.isRefined}
                  />
                </div>
                <span className="text-xs font-mono text-[#8f8f8f] mt-1 block">
                  Updated: {note.updatedAt}
                </span>
              </div>

              {!note.isRefined && (
                <button
                  onClick={() => refineNoteWithAI(note.id)}
                  className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs font-mono font-medium text-white hover:bg-[#333333] transition-all self-start sm:self-auto"
                >
                  <Sparkles className="h-4 w-4 text-[#f5a623]" />
                  <span>Refine with AI</span>
                </button>
              )}
            </div>

            {/* Raw Thought / Scratchpad Section */}
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#8f8f8f] font-semibold block mb-1.5">
                Developer Raw Scratchpad Note:
              </span>
              <p className="text-xs sm:text-sm text-[#4d4d4d] leading-relaxed bg-[#fafafa] p-4 rounded-[8px] border border-[#ebebeb] italic">
                "{note.rawContent}"
              </p>
            </div>

            {/* AI Refined Output (if refined) */}
            {note.isRefined && note.refinedContent && (
              <div className="rounded-[8px] bg-[#fafafa] p-5 border border-[#ebebeb] space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-[#ab570a] font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  <span>Structured AI Executive Synthesis</span>
                </div>

                <p className="text-xs sm:text-sm text-[#171717] font-medium leading-relaxed">
                  {note.refinedContent.summary}
                </p>

                {/* Key Points & Technical Takeaways */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="font-mono text-[11px] font-semibold text-[#8f8f8f] uppercase">
                      Core Architectural Findings:
                    </span>
                    <ul className="space-y-1 text-[#4d4d4d]">
                      {note.refinedContent.keyPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-[6px] border border-[#ebebeb]">
                          <span className="text-[#0070f3] font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[11px] font-semibold text-[#047857] uppercase">
                      Technical Token Takeaways:
                    </span>
                    <ul className="space-y-1 text-[#4d4d4d]">
                      {note.refinedContent.technicalTakeaways.map((tt, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-[6px] border border-[#ebebeb]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#047857] shrink-0 mt-0.5" />
                          <span>{tt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action items */}
                <div className="pt-2 border-t border-[#ebebeb]">
                  <span className="font-mono text-[11px] font-semibold text-[#171717] uppercase block mb-2">
                    Action Items Linked to Project Loop:
                  </span>
                  <div className="space-y-1.5">
                    {note.refinedContent.actionItems.map((act, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-[#171717] bg-white p-2.5 rounded-[6px] border border-[#ebebeb]"
                      >
                        <ListTodo className="h-4 w-4 text-[#0070f3] shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tags and Footer */}
            <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-[#fafafa] px-2 py-0.5 rounded-[4px] text-[#8f8f8f] border border-[#ebebeb]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setActiveSection('context')}
                className="text-[#0070f3] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Promote to Context Blocks</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Capture Modal */}
      <Modal
        isOpen={isQuickCaptureModalOpen}
        onClose={() => setQuickCaptureModalOpen(false)}
        title="Quick Capture Scratchpad Note"
        subtitle="Capture raw architectural notes for instant AI synthesis."
      >
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Note Topic / Title
            </label>
            <input
              type="text"
              required
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="e.g. Biometric timeout workaround on Samsung Knox"
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Raw Scratchpad Thoughts
            </label>
            <textarea
              rows={4}
              required
              value={quickContent}
              onChange={(e) => setQuickContent(e.target.value)}
              placeholder="Dump rough bullet points, stack traces, code snippets, or rationale..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={quickTags}
              onChange={(e) => setQuickTags(e.target.value)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setQuickCaptureModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#171717] px-5 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              Save Scratchpad Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
