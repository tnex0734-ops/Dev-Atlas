import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { BrainCircuit, X, CheckCircle2 } from 'lucide-react';
import { RoleType } from '../../types';

interface RecordRationaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEntityType?: string;
  defaultEntityId?: string;
  defaultEntityLabel?: string;
}

export const RecordRationaleModal: React.FC<RecordRationaleModalProps> = ({
  isOpen,
  onClose,
  defaultEntityType = 'decision',
  defaultEntityId = '',
  defaultEntityLabel = '',
}) => {
  const { recordMemoryEvent, activeRole, activeWorkspace } = useProject();

  const [title, setTitle] = useState('');
  const [entityType, setEntityType] = useState(defaultEntityType);
  const [entityId, setEntityId] = useState(defaultEntityId);
  const [entityLabel, setEntityLabel] = useState(defaultEntityLabel);
  const [whyChanged, setWhyChanged] = useState('');
  const [decision, setDecision] = useState('');
  const [expectedImpact, setExpectedImpact] = useState('');
  const [fieldLabel, setFieldLabel] = useState('');
  const [beforeVal, setBeforeVal] = useState('');
  const [afterVal, setAfterVal] = useState('');
  const [author, setAuthor] = useState('Alex M. (Lead Architect)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !whyChanged.trim()) return;

    recordMemoryEvent({
      eventType: 'decision',
      state: 'active',
      title: title.trim(),
      summary: decision.trim() || title.trim(),
      entityType: entityType.trim(),
      entityId: entityId.trim() || `ent-${Date.now()}`,
      entityLabel: entityLabel.trim() || title.trim(),
      fieldChanges: fieldLabel
        ? [{ field: fieldLabel.toLowerCase().replace(/\s+/g, '-'), label: fieldLabel, before: beforeVal, after: afterVal }]
        : undefined,
      whyChanged: whyChanged.trim(),
      decision: decision.trim(),
      expectedImpact: expectedImpact.trim() || undefined,
      author: author.trim(),
      role: activeRole === 'all' ? 'dev' : activeRole,
      source: 'manual',
      rationaleRecorded: true,
    });

    onClose();
    setTitle('');
    setWhyChanged('');
    setDecision('');
    setExpectedImpact('');
    setFieldLabel('');
    setBeforeVal('');
    setAfterVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-2xl z-10 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ebebeb] pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#171717] text-white">
              <BrainCircuit className="h-4 w-4 text-[#fb923c]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#171717]">Log Change Rationale</h3>
              <p className="text-xs text-[#71717a]">
                Document why a decision was made and preserve institutional memory across roles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-[#71717a] hover:text-[#171717] hover:bg-[#f4f4f5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-[#171717] mb-1">
              Change or Decision Summary *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Checkout CTA vertical padding increased to 16px"
              className="w-full rounded-[6px] border border-[#e4e4e7] px-3 py-2 text-xs focus:border-[#171717] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#171717] mb-1">Entity Type</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full rounded-[6px] border border-[#e4e4e7] px-3 py-2 text-xs focus:border-[#171717] focus:outline-none bg-white"
              >
                <option value="prd">PRD / Requirement</option>
                <option value="task">Dev Task / PR</option>
                <option value="design-token">Design Token</option>
                <option value="design-spec">Design Spec / Pin</option>
                <option value="qa-test">QA Test Case</option>
                <option value="bug">Bug / Defect</option>
                <option value="release">Release / Deployment</option>
                <option value="decision">Architecture Decision (ADR)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-[#171717] mb-1">Entity ID / Code</label>
              <input
                type="text"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="e.g. PRD-105, DEV-416"
                className="w-full rounded-[6px] border border-[#e4e4e7] px-3 py-2 text-xs focus:border-[#171717] focus:outline-none"
              />
            </div>
          </div>

          {/* Before vs After */}
          <div className="rounded-[8px] border border-[#e4e4e7] bg-[#fafafa] p-3 space-y-2">
            <span className="font-semibold text-[#171717] block">Field Value Change (Optional)</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="text"
                  value={fieldLabel}
                  onChange={(e) => setFieldLabel(e.target.value)}
                  placeholder="Field (e.g. Padding)"
                  className="w-full rounded-[6px] border border-[#e4e4e7] bg-white px-2 py-1 text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={beforeVal}
                  onChange={(e) => setBeforeVal(e.target.value)}
                  placeholder="Before (e.g. 12px)"
                  className="w-full rounded-[6px] border border-[#e4e4e7] bg-white px-2 py-1 text-xs"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={afterVal}
                  onChange={(e) => setAfterVal(e.target.value)}
                  placeholder="After (e.g. 16px)"
                  className="w-full rounded-[6px] border border-[#e4e4e7] bg-white px-2 py-1 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#171717] mb-1">
              Why did this change? (Plain Language Rationale) *
            </label>
            <textarea
              required
              rows={3}
              value={whyChanged}
              onChange={(e) => setWhyChanged(e.target.value)}
              placeholder="Explain the underlying user friction, technical constraint, usability finding, or business priority..."
              className="w-full rounded-[6px] border border-[#e5e7eb] px-3 py-2 text-xs text-[#161616] focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#161616] mb-1">Decision / Intent Taken</label>
            <input
              type="text"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="What was explicitly decided?"
              className="w-full rounded-[6px] border border-[#e5e7eb] px-3 py-2 text-xs text-[#161616] focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#161616] mb-1">Expected Impact</label>
            <input
              type="text"
              value={expectedImpact}
              onChange={(e) => setExpectedImpact(e.target.value)}
              placeholder="e.g. Improve tap usability and reduce checkout drop-off"
              className="w-full rounded-[6px] border border-[#e5e7eb] px-3 py-2 text-xs text-[#161616] focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-orange"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save to Project Memory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
