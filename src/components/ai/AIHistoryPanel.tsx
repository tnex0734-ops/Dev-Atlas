import React from 'react';
import { Clock, Trash2, MessageSquare, Plus } from 'lucide-react';
import { AIConversation } from '../../types/aiTypes';

interface Props {
  conversations: AIConversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const AIHistoryPanel: React.FC<Props> = ({ conversations, activeId, onSelect, onDelete, onNew }) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5] mb-3">
          <MessageSquare className="h-5 w-5 text-[#a1a1aa]" />
        </div>
        <p className="text-sm font-medium text-[#525252]">No conversations yet</p>
        <p className="text-xs text-[#a1a1aa] mt-1">Start asking questions to build your history</p>
        <button
          onClick={onNew}
          className="mt-4 flex items-center gap-1.5 rounded-lg bg-[#171717] px-4 py-2 text-xs font-medium text-white hover:bg-[#333] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New conversation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-[#171717]">Chat history</h3>
        <button
          onClick={onNew}
          className="flex items-center gap-1 text-xs font-medium text-[#525252] hover:text-[#171717] transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New
        </button>
      </div>

      <div className="space-y-1">
        {conversations.map(conv => {
          const isActive = conv.id === activeId;
          const messageCount = conv.messages.filter(m => m.role !== 'system').length;

          return (
            <div
              key={conv.id}
              className={`group flex items-start justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#171717] text-white'
                  : 'hover:bg-[#f5f5f5] text-[#171717]'
              }`}
              onClick={() => onSelect(conv.id)}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-[#171717]'}`}>
                  {conv.title}
                </p>
                <div className={`flex items-center gap-2 mt-1 text-[11px] ${isActive ? 'text-white/60' : 'text-[#a1a1aa]'}`}>
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    {formatDate(conv.updatedAt)}
                  </span>
                  <span>{messageCount} messages</span>
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                className={`p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all ${
                  isActive ? 'hover:bg-white/10 text-white/60' : 'hover:bg-[#e5e7eb] text-[#a1a1aa]'
                }`}
                title="Delete conversation"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
