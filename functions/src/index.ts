import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK singleton
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ---------------------------------------------------------------------------
// Helper: Verify Project Membership
// ---------------------------------------------------------------------------
async function verifyProjectAccess(projectId: string, uid: string): Promise<string> {
  const memberSnap = await db.doc(`projects/${projectId}/members/${uid}`).get();
  if (memberSnap.exists) {
    return memberSnap.data()?.role || 'dev';
  }

  const projectSnap = await db.doc(`projects/${projectId}`).get();
  if (projectSnap.exists && projectSnap.data()?.ownerId === uid) {
    return 'all';
  }

  throw new HttpsError('permission-denied', `User does not have access to project ${projectId}`);
}

// ---------------------------------------------------------------------------
// 1. Cloud Function: runRoleAI
// ---------------------------------------------------------------------------
interface RunRoleAIRequest {
  projectId: string;
  role: string;
  userPrompt: string;
  conversationId?: string;
  preferredProvider?: 'openrouter' | 'openai' | 'groq';
  preferredModel?: string;
}

export const runRoleAI = onCall<RunRoleAIRequest>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to query Project AI.');
  }

  const { projectId, role, userPrompt, conversationId, preferredProvider, preferredModel } = request.data;
  if (!projectId || !userPrompt) {
    throw new HttpsError('invalid-argument', 'projectId and userPrompt are required.');
  }

  // 1. Enforce project membership check
  const memberRole = await verifyProjectAccess(projectId, request.auth.uid);

  // 2. Fetch scoped project context from Firestore
  const [meetingsSnap, decisionsSnap, tasksSnap, memorySnap] = await Promise.all([
    db.collection(`projects/${projectId}/meetings`).orderBy('date', 'desc').limit(5).get(),
    db.collection(`projects/${projectId}/decisions`).where('status', '==', 'active').limit(10).get(),
    db.collection(`projects/${projectId}/tasks`).where('status', 'in', ['in-progress', 'todo', 'review']).limit(10).get(),
    db.collection(`projects/${projectId}/memoryEvents`).orderBy('occurredAt', 'desc').limit(8).get()
  ]);

  const meetings = meetingsSnap.docs.map((d) => d.data());
  const decisions = decisionsSnap.docs.map((d) => d.data());
  const tasks = tasksSnap.docs.map((d) => d.data());
  const memoryEvents = memorySnap.docs.map((d) => d.data());

  // 3. Assemble Grounded Context String
  let contextText = `=== DEVATLAS GROUNDED PROJECT CONTEXT ===\nProject ID: ${projectId}\n`;
  if (decisions.length > 0) {
    contextText += `\nACTIVE ARCHITECTURAL DECISIONS:\n` + decisions.map((d) => `- [ADR] ${d.decisionCode}: ${d.title} -> ${d.decisionMade}`).join('\n');
  }
  if (meetings.length > 0) {
    contextText += `\nRECENT SYNC DISCUSSIONS:\n` + meetings.map((m) => `- [Meeting] ${m.meetingCode}: ${m.title} (${m.summary})`).join('\n');
  }
  if (tasks.length > 0) {
    contextText += `\nACTIVE SPRINT TASKS:\n` + tasks.map((t) => `- [Task] ${t.taskCode}: ${t.title} [Status: ${t.status}] (Why: ${t.whyItExists || 'N/A'})`).join('\n');
  }
  if (memoryEvents.length > 0) {
    contextText += `\nRECENT INSTITUTIONAL MEMORY LINEAGE:\n` + memoryEvents.map((e) => `- [Memory] ${e.title} -> Rationale: ${e.whyChanged || e.summary}`).join('\n');
  }

  // 4. Server-Side Secret Selection
  const provider = preferredProvider || 'openrouter';
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  let assistantContent = '';
  let providerUsed: string = provider;
  let modelUsed = preferredModel || 'anthropic/claude-3.5-haiku';
  let inputTokens = Math.round((contextText.length + userPrompt.length) / 4);
  let outputTokens = 150;
  let estimatedCost = 0.0005;

  const systemInstructions = `You are DevAtlas ${role.toUpperCase()} AI Studio. Answer accurately and strictly cite real entities in brackets like [decision] ADR-001, [meeting] MTG-021, [task] DEV-001. Do not invent meetings or decisions. If missing, say so.`;

  // 5. Attempt Live Cloud Call if keys exist
  try {
    if (provider === 'openrouter' && openRouterKey) {
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'X-Title': 'DevAtlas Project AI'
        },
        body: JSON.stringify({
          model: modelUsed,
          messages: [
            { role: 'system', content: `${systemInstructions}\n\n${contextText}` },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        assistantContent = json.choices?.[0]?.message?.content || '';
        inputTokens = json.usage?.prompt_tokens || inputTokens;
        outputTokens = json.usage?.completion_tokens || outputTokens;
      }
    } else if (provider === 'openai' && openAiKey) {
      modelUsed = preferredModel || 'gpt-4o-mini';
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: modelUsed,
          messages: [
            { role: 'system', content: `${systemInstructions}\n\n${contextText}` },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        assistantContent = json.choices?.[0]?.message?.content || '';
        inputTokens = json.usage?.prompt_tokens || inputTokens;
        outputTokens = json.usage?.completion_tokens || outputTokens;
      }
    } else if (provider === 'groq' && groqKey) {
      modelUsed = preferredModel || 'llama-3.1-8b-instant';
      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: modelUsed,
          messages: [
            { role: 'system', content: `${systemInstructions}\n\n${contextText}` },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      if (resp.ok) {
        const json = await resp.json();
        assistantContent = json.choices?.[0]?.message?.content || '';
        inputTokens = json.usage?.prompt_tokens || inputTokens;
        outputTokens = json.usage?.completion_tokens || outputTokens;
      }
    }
  } catch (apiErr) {
    console.warn('[runRoleAI] Cloud provider call failed, falling back to grounded memory engine:', apiErr);
  }

  // 6. Grounded Memory Fallback if LLM returned nothing or keys not configured
  if (!assistantContent) {
    providerUsed = 'deterministic-offline-fallback';
    modelUsed = 'DevAtlas Grounded Engine v2.0';
    assistantContent = `Based on project records for **${projectId}**:\n\n`;
    if (decisions.length > 0) {
      const topDecision = decisions[0];
      assistantContent += `• Active Architecture Decision: **${topDecision.decisionCode}: ${topDecision.title}** (${topDecision.decisionMade}).\n`;
    }
    if (meetings.length > 0) {
      const topMeeting = meetings[0];
      assistantContent += `• Latest Team Sync: **${topMeeting.meetingCode}: ${topMeeting.title}** — Summary: ${topMeeting.summary}\n`;
    }
    if (tasks.length > 0) {
      const activeTasks = tasks.filter((t) => t.status === 'in-progress');
      assistantContent += `• Work In Flight: ${activeTasks.length} active tasks, including **${activeTasks[0]?.taskCode || tasks[0].taskCode}**.\n`;
    }
    assistantContent += `\n*Response generated using server-side grounded project memory.*`;
  }

  // 7. Extract Source Chips
  const sources: Array<{ type: string; entityId: string; label: string }> = [];
  decisions.forEach((d) => {
    if (assistantContent.includes(d.decisionCode)) {
      sources.push({ type: 'decision', entityId: d.decisionCode, label: `${d.decisionCode} — ${d.title}` });
    }
  });
  meetings.forEach((m) => {
    if (assistantContent.includes(m.meetingCode)) {
      sources.push({ type: 'meeting', entityId: m.meetingCode, label: `${m.meetingCode} — ${m.title}` });
    }
  });
  tasks.forEach((t) => {
    if (assistantContent.includes(t.taskCode)) {
      sources.push({ type: 'task', entityId: t.taskCode, label: `${t.taskCode} — ${t.title}` });
    }
  });

  // Calculate estimated cost
  estimatedCost = Number(((inputTokens * 0.0000015) + (outputTokens * 0.000002)).toFixed(5));

  // 8. Persist telemetry to Firestore if conversation exists
  if (conversationId) {
    const msgId = `msg-${Date.now()}`;
    await db.collection(`projects/${projectId}/aiConversations/${conversationId}/messages`).doc(msgId).set({
      id: msgId,
      role: 'assistant',
      content: assistantContent,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      metadata: {
        provider: providerUsed,
        model: modelUsed,
        inputTokens,
        outputTokens,
        estimatedCost,
        currency: 'USD',
        sources
      }
    });

    await db.collection(`projects/${projectId}/aiUsage`).add({
      userId: request.auth.uid,
      conversationId,
      provider: providerUsed,
      model: modelUsed,
      inputTokens,
      outputTokens,
      estimatedCost,
      currency: 'USD',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  return {
    content: assistantContent,
    provider: providerUsed,
    model: modelUsed,
    inputTokens,
    outputTokens,
    estimatedCost,
    sources
  };
});

// ---------------------------------------------------------------------------
// 2. Cloud Function: importGithubRepo
// ---------------------------------------------------------------------------
interface ImportGithubRepoRequest {
  projectId?: string;
  repoUrl: string;
  deployedUrl?: string;
}

export const importGithubRepo = onCall<ImportGithubRepoRequest>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to import repositories.');
  }

  const { repoUrl, deployedUrl, projectId } = request.data;
  if (!repoUrl) {
    throw new HttpsError('invalid-argument', 'repoUrl is required.');
  }

  // Parse owner and repo from URL
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    throw new HttpsError('invalid-argument', 'Invalid GitHub repository URL format.');
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, '');
  const githubToken = process.env.GITHUB_TOKEN;

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'DevAtlas-Importer/2.0'
  };
  if (githubToken) {
    headers['Authorization'] = `token ${githubToken}`;
  }

  try {
    const repoResp = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    
    // Check Rate Limiting
    if (repoResp.status === 403) {
      const resetTime = repoResp.headers.get('x-ratelimit-reset');
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000).toLocaleTimeString() : 'later';
      throw new HttpsError('resource-exhausted', `GitHub API rate limit exceeded. Resets at ${resetDate}.`);
    }
    if (repoResp.status === 404) {
      throw new HttpsError('not-found', `GitHub repository ${owner}/${repo} was not found or is private.`);
    }
    if (!repoResp.ok) {
      throw new HttpsError('internal', `GitHub API error: ${repoResp.statusText}`);
    }

    const repoData = await repoResp.json();

    // Fetch detected languages
    let languages: Record<string, number> = {};
    const langResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
    if (langResp.ok) {
      languages = await langResp.json();
    }

    // Fetch README if available
    let readmeText = '';
    const readmeResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { ...headers, 'Accept': 'application/vnd.github.raw' }
    });
    if (readmeResp.ok) {
      readmeText = await readmeResp.text();
    }

    const techStack = Object.keys(languages);
    const targetProjectId = projectId || `ws-${repo.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    // Record sync run in Firestore
    await db.collection(`projects/${targetProjectId}/githubSyncRuns`).add({
      provider: 'github',
      owner,
      repo,
      repoUrl,
      defaultBranch: repoData.default_branch,
      stars: repoData.stargazers_count,
      languages,
      readmeSnippet: readmeText.substring(0, 1000),
      importedBy: request.auth.uid,
      syncedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'success'
    });

    return {
      success: true,
      projectId: targetProjectId,
      name: repoData.name,
      description: repoData.description || '',
      stars: repoData.stargazers_count,
      defaultBranch: repoData.default_branch,
      techStack,
      readmeSnippet: readmeText.substring(0, 500)
    };
  } catch (err: unknown) {
    if (err instanceof HttpsError) throw err;
    throw new HttpsError('internal', `Failed to import GitHub repo: ${(err as Error).message}`);
  }
});

// ---------------------------------------------------------------------------
// 3. Cloud Function: scrapeSiteMetadata (SSRF Protected)
// ---------------------------------------------------------------------------
interface ScrapeSiteRequest {
  url: string;
}

export const scrapeSiteMetadata = onCall<ScrapeSiteRequest>(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated to scrape deployed sites.');
  }

  const { url } = request.data;
  if (!url) {
    throw new HttpsError('invalid-argument', 'URL is required.');
  }

  // SSRF Protection: Protocol validation
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new HttpsError('invalid-argument', 'Invalid URL format.');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new HttpsError('invalid-argument', 'Only HTTP and HTTPS URLs are allowed.');
  }

  // SSRF Protection: Hostname validation (Reject loopback, private ranges, metadata IPs)
  const host = parsedUrl.hostname.toLowerCase();
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '169.254.169.254' ||
    host.endsWith('.internal') ||
    host.endsWith('.local') ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
  ) {
    throw new HttpsError('permission-denied', 'Access to internal or loopback IP ranges is prohibited.');
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'DevAtlas-Site-Scraper/2.0',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return { url, title: '', description: '', status: resp.status, ok: false };
    }

    const html = await resp.text();
    // Parse title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Parse meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Parse OpenGraph title
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : '';

    return {
      url,
      title: ogTitle || title,
      description,
      status: 200,
      ok: true
    };
  } catch (fetchErr: unknown) {
    return {
      url,
      title: '',
      description: '',
      error: (fetchErr as Error).message,
      ok: false
    };
  }
});
