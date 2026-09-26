import { httpsCallable } from 'firebase/functions';
import { functions } from './config';
import { generateGroundedProjectResponse } from '../groundedMemoryEngine';
import { RoleType } from '../../types';
import { AISource } from '../../types/aiTypes';

export interface RoleAIResponse {
  content: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  sources: AISource[];
  suggestedQuestions?: string[];
  isOfflineFallback?: boolean;
}

/**
 * Calls server-side Cloud Function runRoleAI with zero browser secrets
 */
export async function callRunRoleAI(
  projectId: string,
  role: string,
  userPrompt: string,
  localProjectData: any,
  conversationId?: string,
  preferredProvider?: 'openrouter' | 'openai' | 'groq',
  preferredModel?: string
): Promise<RoleAIResponse> {
  try {
    const fn = httpsCallable<
      {
        projectId: string;
        role: string;
        userPrompt: string;
        conversationId?: string;
        preferredProvider?: string;
        preferredModel?: string;
      },
      RoleAIResponse
    >(functions, 'runRoleAI');

    const result = await fn({
      projectId,
      role,
      userPrompt,
      conversationId,
      preferredProvider,
      preferredModel
    });

    return result.data;
  } catch (err) {
    console.warn('[FunctionsClient] Cloud runRoleAI failed or offline, engaging local grounded engine:', err);
    // Fall back to pure deterministic offline reasoning engine
    const grounded = generateGroundedProjectResponse(userPrompt, role as RoleType, localProjectData);
    return {
      content: grounded.content,
      provider: 'deterministic-offline-fallback',
      model: 'DevAtlas Grounded Engine (Offline)',
      inputTokens: Math.round(userPrompt.length / 4),
      outputTokens: Math.round(grounded.content.length / 4),
      estimatedCost: 0,
      sources: grounded.metadata?.sources || [],
      suggestedQuestions: grounded.metadata?.suggestedQuestions,
      isOfflineFallback: true
    };
  }
}

/**
 * Calls server-side Cloud Function importGithubRepo
 */
export async function callImportGithubRepo(repoUrl: string, deployedUrl?: string, projectId?: string) {
  const fn = httpsCallable<
    { repoUrl: string; deployedUrl?: string; projectId?: string },
    {
      success: boolean;
      projectId: string;
      name: string;
      description: string;
      stars: number;
      defaultBranch: string;
      techStack: string[];
      readmeSnippet: string;
    }
  >(functions, 'importGithubRepo');

  const result = await fn({ repoUrl, deployedUrl, projectId });
  return result.data;
}

/**
 * Calls server-side Cloud Function scrapeSiteMetadata with SSRF protection
 */
export async function callScrapeSiteMetadata(url: string) {
  const fn = httpsCallable<{ url: string }, { url: string; title: string; description: string; status: number; ok: boolean }>(
    functions,
    'scrapeSiteMetadata'
  );

  const result = await fn({ url });
  return result.data;
}
