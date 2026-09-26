// AI Studio type definitions
import { RoleType, NavSection } from './index';

// ── Provider ──
export type AIProviderType = 'openrouter' | 'openai' | 'groq';

export interface AIProviderConfig {
  provider: AIProviderType;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface AIProviderModel {
  id: string;
  name: string;
  provider: AIProviderType;
  contextWindow: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
}

// ── Conversations & Messages ──
export interface AIConversation {
  id: string;
  workspaceId: string;
  userId?: string;
  role: RoleType;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export type AIMessageRole = 'user' | 'assistant' | 'system';

export interface AIMessage {
  id: string;
  conversationId: string;
  role: AIMessageRole;
  content: string;
  createdAt: string;
  metadata?: AIMessageMetadata;
}

export interface AIMessageMetadata {
  model?: string;
  provider?: AIProviderType;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCost?: number;
  promptType?: string;
  sources?: AISource[];
  suggestedQuestions?: string[];
}

// ── Sources / Evidence ──
export type AISourceType = 'meeting' | 'task' | 'decision' | 'research' | 'document' | 'feedback' | 'bug' | 'release' | 'memory' | 'context-block' | 'security';

export interface AISource {
  id?: string;
  type: AISourceType;
  title: string;
  entityId?: string;
  section?: NavSection;
  date?: string;
}

// ── Role AI Config ──
export interface PromptCard {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
}

export interface PromptCategory {
  id: string;
  label: string;
  icon: string;
}

export interface RoleAIConfig {
  role: RoleType;
  label: string;
  studioName: string;
  description: string;
  icon: string;
  accentColor: string;
  systemPrompt: string;
  contextSources: AISourceType[];
  promptCategories: PromptCategory[];
  promptCards: PromptCard[];
  starterQuestions: string[];
}

// ── AI Studio State ──
export interface AIStudioState {
  isOpen: boolean;
  activeRole: RoleType;
  activeConversationId: string | null;
  conversations: AIConversation[];
  isLoading: boolean;
  isHistoryOpen: boolean;
  isSettingsOpen: boolean;
  error: string | null;
  providerConfig: AIProviderConfig;
}
