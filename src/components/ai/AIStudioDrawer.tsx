import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, Settings, Send, Plus, Loader2, AlertCircle, BrainCircuit } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { getRoleAIConfig } from '../../data/roleAIConfigs';
import { AIMessageBubble } from './AIMessageBubble';
import { AIPromptLibrary } from './AIPromptLibrary';
import { AIHistoryPanel } from './AIHistoryPanel';
import { AISettingsModal } from './AISettingsModal';
import { VoiceInput } from './VoiceInput';

export const AIStudioDrawer: React.FC = () => {
  const {
    state,
    closeStudio,
    toggleHistory,
    toggleSettings,
    sendMessage,
    startNewConversation,
    loadConversation,
    deleteConversation,
    getConversationsForRole,
    activeConversation,
    clearError,
  } = useAI();

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const roleConfig = getRoleAIConfig(state.activeRole);
  const conversations = getConversationsForRole(state.activeRole);
  const messages = activeConversation?.messages.filter(m => m.role !== 'system') || [];

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, state.isLoading]);

  // Focus input when studio opens
  useEffect(() => {
    if (state.isOpen && inputRef.current && !state.isHistoryOpen && !state.isSettingsOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [state.isOpen, state.isHistoryOpen, state.isSettingsOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || state.isLoading) return;
    setInputValue('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptSelect = async (prompt: string) => {
    startNewConversation();
    // Small delay to ensure state updates
    setTimeout(async () => {
      await sendMessage(prompt);
    }, 50);
  };

  const handleSuggestedClick = async (question: string) => {
    setInputValue('');
    await sendMessage(question);
  };

  const handleVoiceTranscript = (text: string) => {
    setInputValue(prev => prev ? `${prev} ${text}` : text);
    inputRef.current?.focus();
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] ai-fade-in"
        onClick={closeStudio}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)] ai-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EC] border border-[#FFD6CC] p-1 shadow-2xs">
              <img
                src="/dev-ai.png"
                alt="Dev AI"
                className="w-7 h-7 object-contain drop-shadow-xs"
                style={{ width: 28, height: 28, maxWidth: 28, maxHeight: 28 }}
              />
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-white rounded-full p-0.5 border border-[#FFD6CC] shadow-2xs leading-none">
                {roleConfig.icon}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#161616] tracking-tight">
                {roleConfig.studioName}
              </h2>
              <p className="text-xs text-[#525252]">{roleConfig.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {activeConversation && (
              <button
                onClick={startNewConversation}
                className="p-2 rounded-lg text-[#525252] hover:text-[#161616] hover:bg-[#f5f5f5] transition-colors"
                title="New conversation"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={toggleHistory}
              className={`p-2 rounded-lg transition-colors ${
                state.isHistoryOpen
                  ? 'bg-[#161616] text-white'
                  : 'text-[#525252] hover:text-[#161616] hover:bg-[#f5f5f5]'
              }`}
              title="Chat history"
            >
              <Clock className="h-4 w-4" />
            </button>
            <button
              onClick={toggleSettings}
              className={`p-2 rounded-lg transition-colors ${
                state.isSettingsOpen
                  ? 'bg-[#161616] text-white'
                  : 'text-[#525252] hover:text-[#161616] hover:bg-[#f5f5f5]'
              }`}
              title="AI Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={closeStudio}
              className="p-2 rounded-lg text-[#525252] hover:text-[#161616] hover:bg-[#f5f5f5] transition-colors"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Settings panel */}
          {state.isSettingsOpen ? (
            <div className="p-5">
              <AISettingsModal />
            </div>
          ) : state.isHistoryOpen ? (
            /* History panel */
            <div className="p-5">
              <AIHistoryPanel
                conversations={conversations}
                activeId={state.activeConversationId}
                onSelect={loadConversation}
                onDelete={deleteConversation}
                onNew={startNewConversation}
              />
            </div>
          ) : activeConversation && messages.length > 0 ? (
            /* Chat messages */
            <div className="space-y-4 p-5">
              {messages.map((msg, i) => (
                <AIMessageBubble
                  key={msg.id}
                  message={msg}
                  onSuggestedClick={handleSuggestedClick}
                  isLatest={i === messages.length - 1 && msg.role === 'assistant'}
                />
              ))}

              {/* Loading indicator */}
              {state.isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-[#f5f5f5] border border-[#e5e7eb] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[#525252]">
                      <Loader2 className="h-4 w-4 animate-spin text-[#FF6039]" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Empty state: Prompt library */
            <div className="p-5">
              {/* Starter questions */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src="/dev-ai.png"
                    alt="Dev AI"
                    className="w-4 h-4 object-contain"
                    style={{ width: 16, height: 16, maxWidth: 16, maxHeight: 16 }}
                  />
                  <span className="text-xs font-semibold text-[#161616]">What you can ask</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {roleConfig.starterQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handlePromptSelect(q)}
                      className="rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-xs text-[#374151] text-left hover:border-[#FF6039] hover:text-[#161616] hover:shadow-xs transition-all leading-relaxed"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full prompt library */}
              <AIPromptLibrary
                categories={roleConfig.promptCategories}
                cards={roleConfig.promptCards}
                onSelect={handlePromptSelect}
              />
            </div>
          )}
        </div>

        {/* Error banner */}
        {state.error && (
          <div className="mx-5 mb-2 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{state.error}</span>
            <button onClick={clearError} className="text-red-400 hover:text-red-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Input area */}
        {!state.isSettingsOpen && !state.isHistoryOpen && (
          <div className="border-t border-[#e5e7eb] p-4">
            {/* Engine status indicator */}
            {!state.providerConfig.apiKey && (
              <div className="mb-3 flex items-center justify-between rounded-lg bg-[#FFF0EC] border border-[#FFD6CC] px-3 py-2 text-xs text-[#161616]">
                <span className="flex items-center gap-1.5 font-medium">
                  <BrainCircuit className="h-3.5 w-3.5 text-[#FF6039]" />
                  <span>Project Memory Active (Zero key setup required)</span>
                </span>
                <button
                  onClick={toggleSettings}
                  className="text-[11px] font-bold text-[#FF6039] hover:underline"
                >
                  Cloud LLM Settings
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your project..."
                  rows={1}
                  className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 pr-10 text-sm text-[#161616] placeholder-[#737373] focus:border-[#FF6039] focus:ring-1 focus:ring-[#FF6039] focus:bg-white focus:outline-none transition-all leading-relaxed"
                  style={{ minHeight: 44, maxHeight: 120 }}
                  disabled={state.isLoading}
                />
                <div className="absolute right-2 bottom-2">
                  <VoiceInput
                    onTranscript={handleVoiceTranscript}
                    disabled={state.isLoading}
                  />
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || state.isLoading}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                  inputValue.trim() && !state.isLoading
                    ? 'bg-[#FF6039] text-[#161616] hover:bg-[#E54D26] active:scale-[0.95] shadow-sm font-bold'
                    : 'bg-[#f5f5f5] text-[#a1a1aa] cursor-not-allowed'
                }`}
                title="Send message"
              >
                {state.isLoading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" style={{ width: 18, height: 18 }} />
                ) : (
                  <Send className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
