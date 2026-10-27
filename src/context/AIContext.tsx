import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  AIConversation,
  AIMessage,
  AIProviderConfig,
  AIProviderType,
  AISource,
  AIStudioState,
} from '../types/aiTypes';
import { RoleType } from '../types';
import { useProject } from './ProjectContext';
import { sendAIRequest, AIServiceError } from '../services/aiService';
import { getContextForRole } from '../services/contextRetriever';
import { getRoleAIConfig } from '../data/roleAIConfigs';
import { generateGroundedProjectResponse } from '../services/groundedMemoryEngine';
import { callRunRoleAI } from '../services/firebase/functionsClient';
import { aiRepository } from '../services/repositories/aiRepository';

interface AIContextType {
  state: AIStudioState;
  openStudio: (role?: RoleType) => void;
  closeStudio: () => void;
  toggleHistory: () => void;
  toggleSettings: () => void;
  sendMessage: (content: string) => Promise<void>;
  startNewConversation: () => void;
  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  getConversationsForRole: (role: RoleType) => AIConversation[];
  activeConversation: AIConversation | null;
  updateProviderConfig: (config: Partial<AIProviderConfig>) => void;
  clearError: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const STORAGE_KEY_CONVERSATIONS = 'devatlas_ai_conversations';
const STORAGE_KEY_PROVIDER = 'devatlas_ai_provider';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function loadConversations(): AIConversation[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveConversations(conversations: AIConversation[]) {
  try {
    // Keep only last 100 conversations to avoid localStorage bloat
    const trimmed = conversations.slice(-100);
    localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save AI conversations', e);
  }
}

function loadProviderConfig(): AIProviderConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROVIDER);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { provider: 'openrouter', apiKey: '', model: 'anthropic/claude-3.5-haiku' };
}

function saveProviderConfig(config: AIProviderConfig) {
  try {
    localStorage.setItem(STORAGE_KEY_PROVIDER, JSON.stringify(config));
  } catch {}
}

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const project = useProject();
  const abortRef = useRef<AbortController | null>(null);

  const [state, setState] = useState<AIStudioState>(() => ({
    isOpen: false,
    activeRole: project.activeRole === 'memory' ? 'all' : project.activeRole,
    activeConversationId: null,
    conversations: loadConversations(),
    isLoading: false,
    isHistoryOpen: false,
    isSettingsOpen: false,
    error: null,
    providerConfig: loadProviderConfig(),
  }));

  const activeConversation = state.activeConversationId
    ? state.conversations.find(c => c.id === state.activeConversationId) || null
    : null;

  const openStudio = useCallback((role?: RoleType) => {
    const r = role || (project.activeRole === 'memory' ? 'all' : project.activeRole);
    setState(prev => ({
      ...prev,
      isOpen: true,
      activeRole: r,
      isHistoryOpen: false,
      isSettingsOpen: false,
      error: null,
    }));
  }, [project.activeRole]);

  const closeStudio = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setState(prev => ({ ...prev, isOpen: false, isHistoryOpen: false, isSettingsOpen: false }));
  }, []);

  const toggleHistory = useCallback(() => {
    setState(prev => ({ ...prev, isHistoryOpen: !prev.isHistoryOpen, isSettingsOpen: false }));
  }, []);

  const toggleSettings = useCallback(() => {
    setState(prev => ({ ...prev, isSettingsOpen: !prev.isSettingsOpen, isHistoryOpen: false }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const startNewConversation = useCallback(() => {
    setState(prev => ({ ...prev, activeConversationId: null, isHistoryOpen: false, error: null }));
  }, []);

  const loadConversation = useCallback((id: string) => {
    setState(prev => ({ ...prev, activeConversationId: id, isHistoryOpen: false, error: null }));
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setState(prev => {
      const updated = prev.conversations.filter(c => c.id !== id);
      saveConversations(updated);
      return {
        ...prev,
        conversations: updated,
        activeConversationId: prev.activeConversationId === id ? null : prev.activeConversationId,
      };
    });
  }, []);

  const getConversationsForRole = useCallback((role: RoleType): AIConversation[] => {
    const wsId = project.activeWorkspace.id;
    return state.conversations
      .filter(c => c.role === role && c.workspaceId === wsId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [state.conversations, project.activeWorkspace.id]);

  const updateProviderConfig = useCallback((config: Partial<AIProviderConfig>) => {
    setState(prev => {
      const updated = { ...prev.providerConfig, ...config };
      saveProviderConfig(updated);
      return { ...prev, providerConfig: updated };
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const role = state.activeRole;
    const roleConfig = getRoleAIConfig(role);
    const wsId = project.activeWorkspace.id;
    const now = new Date().toISOString();

    // Create user message
    const userMessage: AIMessage = {
      id: generateId(),
      conversationId: '',
      role: 'user',
      content: content.trim(),
      createdAt: now,
    };

    // Get or create conversation
    let conversationId = state.activeConversationId;
    let isNewConversation = false;

    if (!conversationId) {
      conversationId = generateId();
      isNewConversation = true;
    }

    userMessage.conversationId = conversationId;

    // Update state with user message
    setState(prev => {
      let conversations = [...prev.conversations];

      if (isNewConversation) {
        const newConv: AIConversation = {
          id: conversationId!,
          workspaceId: wsId,
          role,
          title: content.trim().substring(0, 60),
          messages: [userMessage],
          createdAt: now,
          updatedAt: now,
        };
        conversations.push(newConv);
      } else {
        conversations = conversations.map(c =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, userMessage], updatedAt: now }
            : c
        );
      }

      return {
        ...prev,
        conversations,
        activeConversationId: conversationId,
        isLoading: true,
        error: null,
      };
    });

    // Build context
    const projectData = {
      devTasks: project.devTasks,
      prds: project.prds,
      features: project.features,
      roadmap: project.roadmap,
      feedback: project.feedback,
      problemClusters: project.problemClusters,
      researchSessions: project.researchSessions,
      uxFindings: project.uxFindings,
      personas: project.personas,
      decisions: project.decisions,
      meetings: project.meetings,
      contextBlocks: project.contextBlocks,
      secondBrainNotes: project.secondBrainNotes,
      bugs: project.bugs,
      qaTestCases: project.qaTestCases,
      readinessChecks: project.readinessChecks,
      securityFindings: project.securityFindings,
      releases: project.releases,
      incidents: project.incidents,
      maintenanceTasks: project.maintenanceTasks,
      memoryEvents: project.memoryEvents,
      metrics: project.metrics,
      activeWorkspace: project.activeWorkspace,
      sprintFeatures: project.sprintFeatures,
      validationSessions: project.validationSessions,
      designReviews: project.designReviews,
    };

    const { contextText, sources } = getContextForRole(role, projectData);

    // Build message history for the API call
    const conversation = isNewConversation
      ? { messages: [userMessage] }
      : state.conversations.find(c => c.id === conversationId);

    const history = (conversation?.messages || [userMessage])
      .filter(m => m.role !== 'system')
      .slice(-10) // Keep last 10 messages for context
      .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const systemMessage = `${roleConfig.systemPrompt}\n\n--- PROJECT CONTEXT ---\n${contextText}\n--- END CONTEXT ---\n\nImportant instructions:\n- Answer based on the project context above\n- When referencing project data, mention the source (e.g., "Based on task DEV-003..." or "From the latest release...")\n- If the context doesn't contain enough information, say so clearly\n- Keep answers concise and scannable with bullets\n- End with 1-2 practical suggested next questions the user might want to ask`;

    const messages = [
      { role: 'system' as const, content: systemMessage },
      ...history,
    ];

    try {
      abortRef.current = new AbortController();

      let response;
      const hasKey = Boolean(state.providerConfig.apiKey && state.providerConfig.apiKey.trim().length > 0);

      if (hasKey) {
        try {
          response = await sendAIRequest(messages, state.providerConfig, abortRef.current.signal);
        } catch (apiErr) {
          console.warn('Direct AI request failed, falling back to server Cloud Functions or Grounded Engine:', apiErr);
          const cloudRes = await callRunRoleAI(
            wsId,
            role,
            content,
            projectData,
            conversationId || undefined,
            state.providerConfig.provider,
            state.providerConfig.model
          );
          response = {
            content: cloudRes.content,
            metadata: {
              model: cloudRes.model,
              provider: state.providerConfig.provider,
              inputTokens: cloudRes.inputTokens,
              outputTokens: cloudRes.outputTokens,
              estimatedCost: cloudRes.estimatedCost,
              sources: cloudRes.sources,
              suggestedQuestions: cloudRes.suggestedQuestions
            }
          };
        }
      } else {
        // Execute server-side Cloud Function runRoleAI (which has server secrets) or deterministic grounded fallback
        const cloudRes = await callRunRoleAI(
          wsId,
          role,
          content,
          projectData,
          conversationId || undefined,
          state.providerConfig.provider,
          state.providerConfig.model
        );
        response = {
          content: cloudRes.content,
          metadata: {
            model: cloudRes.model,
            provider: state.providerConfig.provider,
            inputTokens: cloudRes.inputTokens,
            outputTokens: cloudRes.outputTokens,
            estimatedCost: cloudRes.estimatedCost,
            sources: cloudRes.sources,
            suggestedQuestions: cloudRes.suggestedQuestions
          }
        };
      }

      // Extract suggested questions from response if not already provided
      const suggestedQuestions =
        response.metadata.suggestedQuestions && response.metadata.suggestedQuestions.length > 0
          ? response.metadata.suggestedQuestions
          : extractSuggestedQuestions(response.content);

      const assistantMessage: AIMessage = {
        id: generateId(),
        conversationId: conversationId!,
        role: 'assistant',
        content: response.content,
        createdAt: new Date().toISOString(),
        metadata: {
          ...response.metadata,
          sources: response.metadata.sources && response.metadata.sources.length > 0 ? response.metadata.sources : sources,
          suggestedQuestions,
        },
      };

      // Persist to Firestore asynchronously
      const activeConv = state.conversations.find((c) => c.id === conversationId);
      if (activeConv) {
        aiRepository.saveConversation(wsId, activeConv).catch((e) => console.warn('[AIContext] Firestore save error:', e));
        aiRepository.saveMessage(wsId, conversationId!, userMessage).catch((e) => console.warn('[AIContext] Firestore save user msg:', e));
        aiRepository.saveMessage(wsId, conversationId!, assistantMessage).catch((e) => console.warn('[AIContext] Firestore save assistant msg:', e));
      }

      setState(prev => {
        const conversations = prev.conversations.map(c =>
          c.id === conversationId
            ? { ...c, messages: [...c.messages, assistantMessage], updatedAt: new Date().toISOString() }
            : c
        );
        saveConversations(conversations);
        return { ...prev, conversations, isLoading: false };
      });
    } catch (error: any) {
      const errorMessage = error instanceof AIServiceError
        ? error.message
        : 'Something went wrong. Please try again.';

      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, [state.activeRole, state.activeConversationId, state.providerConfig, state.conversations, project]);

  const value: AIContextType = {
    state,
    openStudio,
    closeStudio,
    toggleHistory,
    toggleSettings,
    sendMessage,
    startNewConversation,
    loadConversation,
    deleteConversation,
    getConversationsForRole,
    activeConversation,
    updateProviderConfig,
    clearError,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

export function useAI(): AIContextType {
  const context = useContext(AIContext);
  if (!context) throw new Error('useAI must be used within AIProvider');
  return context;
}

function extractSuggestedQuestions(content: string): string[] {
  // Try to find suggested questions at the end of the response
  const lines = content.split('\n').filter(l => l.trim());
  const questions: string[] = [];

  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 5); i--) {
    const line = lines[i].trim();
    if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
      const q = line.replace(/^[-•*]\s*/, '').replace(/\*\*/g, '').trim();
      if (q.endsWith('?') && q.length > 10 && q.length < 100) {
        questions.unshift(q);
      }
    }
  }

  return questions.slice(0, 3);
}
