import React, { useState } from 'react';
import {
  Palette,
  Copy,
  Check,
  Layers,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const DesignLibraryView: React.FC = () => {
  const { designTokens, showToast } = useProject();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);

  const categories = ['All', 'Color', 'Typography', 'Border Radius'];

  const filteredTokens = designTokens.filter(
    (t) => selectedCategory === 'All' || t.category === selectedCategory
  );

  const handleCopy = (token: { id: string; value: string; cssVariable: string }) => {
    navigator.clipboard.writeText(token.cssVariable || token.value);
    setCopiedTokenId(token.id);
    showToast(`Copied token to clipboard: ${token.cssVariable}`, 'success');
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Geist Design Token Library
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Canonical design tokens, color scales, typographic hierarchy, and elevation rules powering the Dev Atlas ecosystem.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center rounded-full bg-[#f5f5f5] p-1 border border-[#ebebeb]">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === c
                  ? 'bg-[#171717] text-white font-medium shadow-sm'
                  : 'text-[#8f8f8f] hover:text-[#171717]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Tokens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTokens.map((token) => (
          <div
            key={token.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                <span className="font-mono text-xs font-semibold text-[#171717]">
                  {token.tokenKey}
                </span>
                <StatusBadge label={token.category} variant="neutral" size="sm" />
              </div>

              <div className="mt-4 flex items-center gap-3">
                {token.previewColor ? (
                  <div
                    className="h-10 w-10 rounded-[6px] border border-[#ebebeb] shadow-inner shrink-0"
                    style={{ backgroundColor: token.previewColor }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-[6px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-center font-mono text-xs text-[#171717] shrink-0 font-medium">
                    Aa
                  </div>
                )}
                <div>
                  <h3 className="font-sans font-semibold text-sm text-[#171717]">
                    {token.name}
                  </h3>
                  <span className="font-mono text-xs text-[#0070f3]">
                    {token.value}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-[#4d4d4d] leading-relaxed">
                {token.usageDescription}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#f2f2f2] flex items-center justify-between">
              <span className="font-mono text-[11px] text-[#8f8f8f]">
                {token.cssVariable}
              </span>
              <button
                onClick={() => handleCopy(token)}
                className="flex items-center gap-1 text-xs font-mono text-[#171717] hover:text-[#0070f3]"
              >
                {copiedTokenId === token.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#047857]" />
                    <span className="text-[#047857] font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Token</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
