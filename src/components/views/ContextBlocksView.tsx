import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  Plus,
  Tag,
  Code2,
  Lock,
  Layers,
  Activity,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { ContextBlock } from '../../types';

export const ContextBlocksView: React.FC = () => {
  const { contextBlocks, addContextBlock, showToast, setActiveSection } = useProject();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // New Block form
  const [blockTitle, setBlockTitle] = useState('');
  const [blockCategory, setBlockCategory] = useState<ContextBlock['category']>('Architecture');
  const [blockContent, setBlockContent] = useState('');
  const [blockTags, setBlockTags] = useState('Architecture, Spec');

  const categories = [
    'All',
    'Architecture',
    'API Contract',
    'Security & Token Policy',
    'Performance Constraints',
    'State Machine',
  ];

  const filteredBlocks = contextBlocks.filter(
    (b) => selectedCategory === 'All' || b.category === selectedCategory
  );

  const handleCopyContent = (block: ContextBlock) => {
    navigator.clipboard.writeText(block.content);
    setCopiedId(block.id);
    showToast(`Context block "${block.title}" copied!`, 'amber');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockTitle.trim() || !blockContent.trim()) return;

    addContextBlock({
      title: blockTitle,
      category: blockCategory,
      content: blockContent,
      author: 'Project Maintainer',
      tags: blockTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setAddModalOpen(false);
    setBlockTitle('');
    setBlockContent('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              System Context Blocks Hub
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            First-class architectural specifications, API contracts, security rules, and state machine definitions injected into AI coding workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('prompts')}
            className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-white px-3 py-1.5 text-xs font-mono font-medium text-[#171717] hover:bg-[#fafafa]"
          >
            <Sparkles className="h-4 w-4 text-[#f5a623]" />
            <span>AI Prompt Builder</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Context Block</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#171717] text-white font-medium shadow-sm'
                : 'bg-white text-[#8f8f8f] hover:text-[#171717] border border-[#ebebeb]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blocks List */}
      <div className="space-y-6">
        {filteredBlocks.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#ebebeb] bg-white p-12 text-center">
            <BookOpen className="h-10 w-10 text-[#a1a1a1] mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#171717]">No Context Blocks Found</h3>
            <p className="text-xs text-[#8f8f8f] mt-1 max-w-md mx-auto">
              Add reusable system context blocks (Service Contracts, Security Guardrails, State Machines) to inject into AI prompt pipelines.
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs font-medium text-white shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Context Block</span>
            </button>
          </div>
        ) : (
          filteredBlocks.map((block) => (
          <div
            key={block.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 sm:p-7 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-4 hover:border-[#a1a1a1] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f2f2f2] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#0070f3] bg-[#eff6ff] px-2.5 py-0.5 rounded-[4px] border border-[#bfdbfe] uppercase">
                    {block.category}
                  </span>
                  <span className="text-xs font-mono text-[#8f8f8f]">
                    Author: <span className="text-[#171717]">{block.author}</span> • Updated: {block.lastUpdated}
                  </span>
                </div>
                <h3 className="mt-2 font-sans font-semibold text-lg sm:text-xl text-[#171717]">
                  {block.title}
                </h3>
              </div>

              <button
                onClick={() => handleCopyContent(block)}
                className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-[#fafafa] px-3.5 py-1.5 text-xs font-mono text-[#171717] hover:bg-white hover:border-[#171717] transition-all self-start sm:self-auto"
              >
                {copiedId === block.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#047857]" />
                    <span className="text-[#047857] font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Code / Spec</span>
                  </>
                )}
              </button>
            </div>

            {/* Code / Content block */}
            <pre className="overflow-x-auto rounded-[8px] bg-[#fafafa] p-5 font-mono text-xs text-[#171717] border border-[#ebebeb] leading-relaxed max-h-[300px]">
              {block.content}
            </pre>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {block.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] bg-[#fafafa] px-2 py-0.5 rounded-[4px] text-[#8f8f8f] border border-[#ebebeb]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )))}
      </div>

      {/* Add Block Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Architectural Context Block"
        subtitle="Record reusable system contracts, security policies, and performance constraints."
      >
        <form onSubmit={handleCreateBlock} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Block Title
            </label>
            <input
              type="text"
              required
              value={blockTitle}
              onChange={(e) => setBlockTitle(e.target.value)}
              placeholder="e.g. WebSocket Event Bus Serialization Contract"
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={blockCategory}
              onChange={(e) => setBlockCategory(e.target.value as any)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
            >
              <option value="Architecture">Architecture</option>
              <option value="API Contract">API Contract</option>
              <option value="Security & Token Policy">Security & Token Policy</option>
              <option value="Performance Constraints">Performance Constraints</option>
              <option value="State Machine">State Machine</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Specification / Code Snippet
            </label>
            <textarea
              rows={6}
              required
              value={blockContent}
              onChange={(e) => setBlockContent(e.target.value)}
              placeholder="Paste exact TypeScript interface, state machine transitions, or API contract..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={blockTags}
              onChange={(e) => setBlockTags(e.target.value)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#171717] px-5 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              Save Context Block
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
