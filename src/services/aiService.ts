// AI Provider Abstraction — supports OpenRouter, OpenAI, Groq
import { AIProviderConfig, AIProviderType, AIMessage, AIMessageMetadata } from '../types/aiTypes';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  metadata: AIMessageMetadata;
}

const PROVIDER_URLS: Record<AIProviderType, string> = {
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  openai: 'https://api.openai.com/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
};

const DEFAULT_MODELS: Record<AIProviderType, string> = {
  openrouter: 'anthropic/claude-3.5-haiku',
  openai: 'gpt-4o-mini',
  groq: 'llama-3.1-8b-instant',
};

// Rough token estimation: ~4 chars per token
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export async function sendAIRequest(
  messages: ChatMessage[],
  config: AIProviderConfig,
  signal?: AbortSignal
): Promise<AIResponse> {
  const url = config.baseUrl || PROVIDER_URLS[config.provider];
  const model = config.model || DEFAULT_MODELS[config.provider];

  // If no client API key, allow server-side Cloud Function to execute or trigger fallback
  if (!config.apiKey) {
    throw new AIServiceError(
      'SERVER_SIDE_DELEGATION',
      'config'
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
  };

  // OpenRouter requires additional headers
  if (config.provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'DevAtlas AI Studio';
  }

  const inputTokensEstimate = messages.reduce((sum, m) => sum + estimateTokens(m.content), 0);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2048,
        temperature: 0.3,
      }),
      signal: signal || controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const status = response.status;
      if (status === 401 || status === 403) {
        throw new AIServiceError('Invalid API key. Check your key in AI Settings.', 'auth');
      }
      if (status === 429) {
        throw new AIServiceError('AI is busy right now. Please try again in a moment.', 'rate-limit');
      }
      if (status === 500 || status === 502 || status === 503) {
        throw new AIServiceError('AI service is temporarily unavailable. Try again.', 'server');
      }
      throw new AIServiceError(`Request failed (${status}). Please try again.`, 'unknown');
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new AIServiceError('Received an empty response. Please try again.', 'empty');
    }

    const content = data.choices[0].message.content;
    const usage = data.usage || {};

    return {
      content,
      metadata: {
        model: data.model || model,
        provider: config.provider,
        inputTokens: usage.prompt_tokens || inputTokensEstimate,
        outputTokens: usage.completion_tokens || estimateTokens(content),
        estimatedCost: calculateCost(
          usage.prompt_tokens || inputTokensEstimate,
          usage.completion_tokens || estimateTokens(content),
          config.provider,
          model
        ),
      },
    };
  } catch (error: any) {
    clearTimeout(timeout);

    if (error instanceof AIServiceError) throw error;

    if (error.name === 'AbortError') {
      throw new AIServiceError('Request timed out. Please try again.', 'timeout');
    }

    if (!navigator.onLine) {
      throw new AIServiceError('No internet connection. Check your network.', 'network');
    }

    throw new AIServiceError('Something went wrong. Please try again.', 'unknown');
  }
}

function calculateCost(inputTokens: number, outputTokens: number, provider: AIProviderType, model: string): number {
  // Rough cost estimates per 1M tokens (USD)
  const costs: Record<string, { input: number; output: number }> = {
    'anthropic/claude-3.5-haiku': { input: 0.8, output: 4 },
    'anthropic/claude-3.5-sonnet': { input: 3, output: 15 },
    'gpt-4o-mini': { input: 0.15, output: 0.6 },
    'gpt-4o': { input: 2.5, output: 10 },
    'llama-3.1-8b-instant': { input: 0.05, output: 0.08 },
    'llama-3.1-70b-versatile': { input: 0.59, output: 0.79 },
  };

  const rate = costs[model] || { input: 1, output: 3 };
  return (inputTokens / 1_000_000) * rate.input + (outputTokens / 1_000_000) * rate.output;
}

export class AIServiceError extends Error {
  type: 'config' | 'auth' | 'rate-limit' | 'server' | 'timeout' | 'network' | 'empty' | 'unknown';

  constructor(message: string, type: AIServiceError['type']) {
    super(message);
    this.name = 'AIServiceError';
    this.type = type;
  }
}

export const AVAILABLE_MODELS: Record<AIProviderType, Array<{ id: string; name: string }>> = {
  openrouter: [
    { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
    { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' },
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
    { id: 'gpt-4o', name: 'GPT-4o' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
  ],
  groq: [
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
    { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
  ],
};
