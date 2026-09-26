import React from 'react';
import { AIMessage, AISource } from '../../types/aiTypes';
import { useProject } from '../../context/ProjectContext';
import { useAI } from '../../context/AIContext';
import { NavSection } from '../../types';
import { resolveInternalEntityLink } from '../../services/linkResolver';

interface Props {
  message: AIMessage;
  onSuggestedClick?: (q: string) => void;
  isLatest?: boolean;
}

const SOURCE_ICONS: Record<string, string> = {
  meeting: '🗓️',
  task: '📋',
  decision: '⚖️',
  research: '🔬',
  document: '📄',
  feedback: '💬',
  bug: '🐛',
  release: '🚀',
  memory: '🧠',
  'context-block': '📖',
  security: '🛡️',
};

export const AIMessageBubble: React.FC<Props> = ({ message, onSuggestedClick, isLatest }) => {
  const { setActiveSection } = useProject();
  const { closeStudio } = useAI();

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[#161616] px-4 py-3 text-white shadow-xs">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Format assistant markdown-like content
  const formatContent = (text: string) => {
    // Remove suggested questions section from display (we show them as chips)
    let cleaned = text;
    const suggestedIdx = cleaned.lastIndexOf('\n\n**Suggested');
    if (suggestedIdx > 0) cleaned = cleaned.substring(0, suggestedIdx);
    const suggestedIdx2 = cleaned.lastIndexOf('\n\nYou might also');
    if (suggestedIdx2 > 0) cleaned = cleaned.substring(0, suggestedIdx2);

    return cleaned.split('\n').map((line, i) => {
      const trimmed = line.trim();

      // Bold headers
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return (
          <p key={i} className="font-bold text-[#161616] mt-3 mb-1 text-sm">
            {trimmed.replace(/\*\*/g, '')}
          </p>
        );
      }

      // Inline bold
      if (trimmed.includes('**')) {
        const parts = trimmed.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="text-sm leading-relaxed text-[#374151]">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-[#161616] font-bold">{part}</strong> : part)}
          </p>
        );
      }

      // Bullet items
      if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
        return (
          <div key={i} className="flex gap-2 ml-1 text-sm leading-relaxed text-[#374151]">
            <span className="text-[#FF6039] font-bold mt-0.5">•</span>
            <span>{trimmed.replace(/^[-•*]\s*/, '')}</span>
          </div>
        );
      }

      // Empty lines
      if (!trimmed) return <div key={i} className="h-2" />;

      // Regular text
      return <p key={i} className="text-sm leading-relaxed text-[#374151]">{trimmed}</p>;
    });
  };

  const sources = message.metadata?.sources || [];
  const suggested = message.metadata?.suggestedQuestions || [];
  const uniqueSources = sources.filter((s, i, arr) =>
    arr.findIndex(x => x.type === s.type && x.title === s.title) === i
  ).slice(0, 6);

  return (
    <div className="flex justify-start gap-2.5 items-start">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFF0EC] border border-[#FFD6CC] p-0.5 mt-0.5 shadow-2xs">
        <img
          src="/dev-ai.png"
          alt="Dev AI"
          className="w-5 h-5 object-contain drop-shadow-xs"
          style={{ width: 20, height: 20, maxWidth: 20, maxHeight: 20 }}
        />
      </div>
      <div className="max-w-[88%] space-y-3">
        {/* Message content */}
        <div className="rounded-2xl rounded-bl-md bg-[#f5f5f5] border border-[#e5e7eb] px-4 py-3 space-y-0.5 text-[#161616]">
          {formatContent(message.content)}
        </div>

        {/* Source chips */}
        {uniqueSources.length > 0 && (
          <div className="space-y-1.5 px-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#525252]">
              Based on:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {uniqueSources.map((source, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const resolved = resolveInternalEntityLink({
                      type: source.type,
                      id: source.id || source.entityId || '',
                      label: source.title,
                    });
                    if (resolved.isValid) {
                      setActiveSection(resolved.section as NavSection);
                      closeStudio();
                    } else if (source.section) {
                      setActiveSection(source.section as NavSection);
                      closeStudio();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#e5e7eb] px-2.5 py-1 text-xs font-medium text-[#161616] hover:border-[#FF6039] hover:bg-[#FFF0EC] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
                  title={`Go to ${source.title}`}
                >
                  <span className="text-xs">{SOURCE_ICONS[source.type] || '📎'}</span>
                  <span className="font-mono text-[11px] font-bold text-[#FF6039]">[{source.type}]</span>
                  <span className="truncate max-w-[130px]">{source.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested next questions */}
        {isLatest && suggested.length > 0 && (
          <div className="space-y-1.5 px-1">
            <span className="text-[11px] font-mono font-bold text-[#525252] uppercase tracking-wider">What you can ask next</span>
            <div className="flex flex-col gap-1.5">
              {suggested.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestedClick?.(q)}
                  className="text-left rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-xs font-medium text-[#161616] hover:border-[#FF6039] hover:bg-[#FFF0EC] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.02)]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Token info (compact) */}
        {message.metadata?.model && (
          <div className="flex items-center gap-2 px-1 text-[10px] text-[#a1a1aa] font-mono">
            <span>{message.metadata.model}</span>
            {message.metadata.inputTokens && (
              <span>↑{message.metadata.inputTokens}</span>
            )}
            {message.metadata.outputTokens && (
              <span>↓{message.metadata.outputTokens}</span>
            )}
            {message.metadata.estimatedCost !== undefined && message.metadata.estimatedCost > 0 && (
              <span>${message.metadata.estimatedCost.toFixed(4)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
