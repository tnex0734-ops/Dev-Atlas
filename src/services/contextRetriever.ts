// Role-aware context retrieval — filters and summarizes project data for AI prompts
import { RoleType } from '../types';
import { AISource, AISourceType } from '../types/aiTypes';

interface ProjectData {
  devTasks: any[];
  prds: any[];
  features: any[];
  roadmap: any[];
  feedback: any[];
  problemClusters: any[];
  researchSessions: any[];
  uxFindings: any[];
  personas: any[];
  decisions: any[];
  contextBlocks: any[];
  secondBrainNotes: any[];
  bugs: any[];
  qaTestCases: any[];
  readinessChecks: any[];
  securityFindings: any[];
  releases: any[];
  incidents: any[];
  maintenanceTasks: any[];
  memoryEvents: any[];
  meetings?: any[];
  metrics: any;
  activeWorkspace: any;
  sprintFeatures: any[];
  validationSessions: any[];
  designReviews: any[];
}

interface ContextResult {
  contextText: string;
  sources: AISource[];
}

const MAX_CONTEXT_CHARS = 12000; // ~3000 tokens

function truncate(text: string, max: number): string {
  return text.length > max ? text.substring(0, max) + '...' : text;
}

function summarizeTask(t: any): string {
  return `[${t.taskCode}] ${t.title} — ${t.status.toUpperCase()} (${t.priority}) assigned to ${t.assignee?.name || 'unassigned'}`;
}

function summarizeDecision(d: any): string {
  return `[${d.decisionCode}] ${d.title} (${d.category}) — ${truncate(d.decisionMade, 120)} — stakeholders: ${d.stakeholders.join(', ')} — ${d.date}`;
}

function summarizeMeeting(m: any): string {
  const decText = m.decisions?.map((d: any) => d.text).join('; ') || 'None';
  return `[${m.meetingCode}] "${m.title}" (${m.date}, ${m.durationMinutes}m) — ${truncate(m.summary, 120)} — Decisions: ${truncate(decText, 100)}`;
}

function summarizeBug(b: any): string {
  return `[${b.bugCode}] ${b.title} — ${b.severity} / ${b.status} — ${b.relatedFeature}`;
}

function summarizeFeedback(items: any[]): string {
  const bySentiment = { positive: 0, neutral: 0, negative: 0 };
  const bySource: Record<string, number> = {};
  items.forEach(f => {
    bySentiment[f.sentiment as keyof typeof bySentiment]++;
    bySource[f.source] = (bySource[f.source] || 0) + 1;
  });
  const sourceBreakdown = Object.entries(bySource).map(([s, c]) => `${s}: ${c}`).join(', ');
  const recent = items.slice(0, 5).map(f => `"${truncate(f.comment, 80)}" (${f.source}, ${f.sentiment})`).join('\n  ');
  return `Total: ${items.length} items — Positive: ${bySentiment.positive}, Neutral: ${bySentiment.neutral}, Negative: ${bySentiment.negative}\nSources: ${sourceBreakdown}\nRecent:\n  ${recent}`;
}

function summarizeMemoryEvents(events: any[], limit = 5): string {
  return events.slice(0, limit).map(e =>
    `[${e.eventType.toUpperCase()}] ${e.title} — ${e.summary} (${e.role}, ${e.occurredAt})`
  ).join('\n');
}

export function getContextForRole(role: RoleType, data: ProjectData): ContextResult {
  const sources: AISource[] = [];
  const sections: string[] = [];

  // Project overview (always included)
  const ws = data.activeWorkspace;
  sections.push(`PROJECT: ${ws.name} (${ws.code}) ${ws.version} — ${ws.platform} — Sprint: ${ws.activeSprint}`);
  sections.push(`HEALTH: Composite ${data.metrics.compositeHealth}/100, Sentiment ${data.metrics.userSentimentScore}%, QA Pass ${data.metrics.qaPassRate}%, Production ${data.metrics.productionHealth}%`);

  switch (role) {
    case 'dev': {
      // Tasks
      const tasks = data.devTasks;
      const inProgress = tasks.filter(t => t.status === 'in-progress');
      const todo = tasks.filter(t => t.status === 'todo');
      const review = tasks.filter(t => t.status === 'review');
      sections.push(`\nDEV TASKS (${tasks.length} total, ${inProgress.length} in progress, ${todo.length} todo, ${review.length} in review):`);
      tasks.slice(0, 10).forEach(t => {
        sections.push(`  ${summarizeTask(t)}`);
        sources.push({ type: 'task', title: t.title, entityId: t.id, section: 'tasks' });
      });

      // Context blocks
      if (data.contextBlocks.length > 0) {
        sections.push(`\nARCHITECTURE CONTEXT BLOCKS (${data.contextBlocks.length}):`);
        data.contextBlocks.slice(0, 4).forEach(b => {
          sections.push(`  [${b.category}] ${b.title}: ${truncate(b.content, 200)}`);
          sources.push({ type: 'context-block', title: b.title, entityId: b.id, section: 'context' });
        });
      }

      // Bugs
      const openBugs = data.bugs.filter(b => b.status !== 'Verified Resolved');
      if (openBugs.length > 0) {
        sections.push(`\nOPEN BUGS (${openBugs.length}):`);
        openBugs.slice(0, 5).forEach(b => {
          sections.push(`  ${summarizeBug(b)}`);
          sources.push({ type: 'bug', title: b.title, entityId: b.id, section: 'bugs' });
        });
      }

      // Security findings
      const critSec = data.securityFindings.filter(f => f.severity === 'critical' || f.severity === 'high');
      if (critSec.length > 0) {
        sections.push(`\nSECURITY FINDINGS (${critSec.length} critical/high):`);
        critSec.slice(0, 3).forEach(f => {
          sections.push(`  [${f.findingCode}] ${f.title} — ${f.severity} — ${f.status}`);
          sources.push({ type: 'security', title: f.title, entityId: f.id, section: 'security' });
        });
      }

      // Decisions (Architecture)
      const archDecisions = data.decisions.filter(d => d.category === 'Architecture');
      if (archDecisions.length > 0) {
        sections.push(`\nARCHITECTURE DECISIONS (${archDecisions.length}):`);
        archDecisions.slice(0, 3).forEach(d => {
          sections.push(`  ${summarizeDecision(d)}`);
          sources.push({ type: 'decision', title: d.title, entityId: d.id, section: 'decisions' });
        });
      }

      // Architecture Syncs
      if (data.meetings && data.meetings.length > 0) {
        const devMeetings = data.meetings.filter((m: any) => m.roleTag === 'dev' || m.roleTag === 'all');
        if (devMeetings.length > 0) {
          sections.push(`\nARCHITECTURE & DEV SYNCS (${devMeetings.length}):`);
          devMeetings.slice(0, 2).forEach((m: any) => {
            sections.push(`  ${summarizeMeeting(m)}`);
            sources.push({ type: 'meeting', title: m.title, entityId: m.id, section: 'meetings', date: m.date });
          });
        }
      }
      break;
    }

    case 'designer': {
      // Research sessions
      if (data.researchSessions.length > 0) {
        sections.push(`\nUX RESEARCH SESSIONS (${data.researchSessions.length}):`);
        data.researchSessions.slice(0, 5).forEach(s => {
          sections.push(`  [${s.sessionCode}] ${s.type} with ${s.participantHandle} — Key takeaway: ${truncate(s.keyTakeaway, 120)}`);
          sections.push(`    Quotes: ${s.quotes.slice(0, 2).map((q: string) => `"${truncate(q, 60)}"`).join(', ')}`);
          sources.push({ type: 'research', title: `${s.type} — ${s.participantHandle}`, entityId: s.id, section: 'research' });
        });
      }

      // UX Findings
      if (data.uxFindings.length > 0) {
        sections.push(`\nUX FINDINGS (${data.uxFindings.length}):`);
        data.uxFindings.slice(0, 5).forEach(f => {
          sections.push(`  [${f.findingCode}] ${f.title} — ${f.severity} — Flow: ${f.affectedFlow} — Fix: ${truncate(f.recommendedFix, 100)}`);
          sources.push({ type: 'research', title: f.title, entityId: f.id, section: 'findings' });
        });
      }

      // Personas
      if (data.personas.length > 0) {
        sections.push(`\nUSER PERSONAS (${data.personas.length}):`);
        data.personas.forEach(p => {
          sections.push(`  ${p.name} (${p.prevalencePercentage}%) — ${p.tagline}`);
          sections.push(`    Frustrations: ${p.primaryFrustrations.join(', ')}`);
        });
      }

      // Design reviews
      if (data.designReviews.length > 0) {
        sections.push(`\nDESIGN REVIEWS (${data.designReviews.length}):`);
        data.designReviews.slice(0, 3).forEach(r => {
          sections.push(`  ${r.title} — ${r.component} — ${r.status} — ${r.commentsCount} comments`);
        });
      }

      // Design decisions
      const designDecisions = data.decisions.filter(d => d.category === 'Design');
      if (designDecisions.length > 0) {
        sections.push(`\nDESIGN DECISIONS (${designDecisions.length}):`);
        designDecisions.slice(0, 3).forEach(d => {
          sections.push(`  ${summarizeDecision(d)}`);
          sources.push({ type: 'decision', title: d.title, entityId: d.id, section: 'decisions' });
        });
      }

      // Feedback summary
      sections.push(`\nUSER FEEDBACK SUMMARY:`);
      sections.push(`  ${summarizeFeedback(data.feedback)}`);
      sources.push({ type: 'feedback', title: 'User Feedback', section: 'feedback' });
      break;
    }

    case 'pm':
    case 'all': {
      // PRDs
      if (data.prds.length > 0) {
        sections.push(`\nREQUIREMENTS / PRDs (${data.prds.length}):`);
        data.prds.slice(0, 4).forEach(p => {
          sections.push(`  [${p.reqCode}] ${p.title} — Stage: ${p.stage} — Priority: ${p.priority} — Lead: ${p.leadPM}`);
          sources.push({ type: 'task', title: p.title, entityId: p.id, section: 'requirements' });
        });
      }

      // Roadmap
      if (data.roadmap.length > 0) {
        sections.push(`\nROADMAP EPICS (${data.roadmap.length}):`);
        data.roadmap.forEach(e => {
          sections.push(`  ${e.title} — ${e.quarter} — ${e.status} — ${e.completionPercent}% — Owner: ${e.owner}`);
        });
      }

      // Tasks summary
      const tasksByStatus = {
        todo: data.devTasks.filter(t => t.status === 'todo').length,
        inProgress: data.devTasks.filter(t => t.status === 'in-progress').length,
        review: data.devTasks.filter(t => t.status === 'review').length,
        done: data.devTasks.filter(t => t.status === 'done').length,
      };
      sections.push(`\nTASK SUMMARY: ${data.devTasks.length} total — Todo: ${tasksByStatus.todo}, In Progress: ${tasksByStatus.inProgress}, Review: ${tasksByStatus.review}, Done: ${tasksByStatus.done}`);
      sources.push({ type: 'task', title: 'All Dev Tasks', section: 'tasks' });

      // Feedback
      sections.push(`\nUSER FEEDBACK:`);
      sections.push(`  ${summarizeFeedback(data.feedback)}`);
      sources.push({ type: 'feedback', title: 'User Feedback', section: 'feedback' });

      // Problem clusters
      const critClusters = data.problemClusters.filter(c => c.severity === 'critical');
      if (critClusters.length > 0) {
        sections.push(`\nCRITICAL PROBLEM CLUSTERS (${critClusters.length}):`);
        critClusters.forEach(c => {
          sections.push(`  ${c.title} — ${c.userCount} users — ${c.platform} — ${c.status}`);
          sources.push({ type: 'feedback', title: c.title, entityId: c.id, section: 'user-issues' });
        });
      }

      // All decisions
      sections.push(`\nPROJECT DECISIONS (${data.decisions.length}):`);
      data.decisions.slice(0, 5).forEach(d => {
        sections.push(`  ${summarizeDecision(d)}`);
        sources.push({ type: 'decision', title: d.title, entityId: d.id, section: 'decisions' });
      });

      // Recent Meetings & Syncs
      if (data.meetings && data.meetings.length > 0) {
        sections.push(`\nPROJECT MEETINGS & DISCUSSIONS (${data.meetings.length}):`);
        data.meetings.slice(0, 4).forEach((m: any) => {
          sections.push(`  ${summarizeMeeting(m)}`);
          sources.push({ type: 'meeting', title: m.title, entityId: m.id, section: 'meetings', date: m.date });
        });
      }

      // Releases
      if (data.releases.length > 0) {
        sections.push(`\nRELEASES (${data.releases.length}):`);
        data.releases.slice(0, 3).forEach(r => {
          sections.push(`  ${r.version} "${r.releaseName}" — ${r.status} — Sentiment delta: ${r.sentimentDelta > 0 ? '+' : ''}${r.sentimentDelta}%`);
          sources.push({ type: 'release', title: `${r.version} ${r.releaseName}`, entityId: r.id, section: 'releases' });
        });
      }
      break;
    }

    case 'qa': {
      // Test cases
      const passingTests = data.qaTestCases.filter(t => t.status === 'Passed').length;
      const failingTests = data.qaTestCases.filter(t => t.status === 'Failed').length;
      sections.push(`\nTEST CASES (${data.qaTestCases.length} total, ${passingTests} passed, ${failingTests} failed):`);
      data.qaTestCases.filter(t => t.status !== 'Passed').slice(0, 8).forEach(t => {
        sections.push(`  [${t.testCode}] ${t.title} — ${t.status} — ${t.type}${t.errorMessage ? ` — Error: ${truncate(t.errorMessage, 80)}` : ''}`);
        sources.push({ type: 'task', title: t.title, entityId: t.id, section: 'qa-status' });
      });

      // Bugs
      sections.push(`\nBUGS (${data.bugs.length}):`);
      data.bugs.forEach(b => {
        sections.push(`  ${summarizeBug(b)}`);
        sources.push({ type: 'bug', title: b.title, entityId: b.id, section: 'bugs' });
      });

      // Release readiness
      const readyChecks = data.readinessChecks.filter(c => c.isMet).length;
      sections.push(`\nRELEASE READINESS: ${readyChecks}/${data.readinessChecks.length} checks passed`);
      data.readinessChecks.filter(c => !c.isMet).forEach(c => {
        sections.push(`  ❌ ${c.criterion} — ${c.details}`);
      });
      sources.push({ type: 'release', title: 'Release Readiness', section: 'release-readiness' });

      // Security
      const openFindings = data.securityFindings.filter(f => f.status !== 'verified-fixed' && f.status !== 'accepted-risk');
      if (openFindings.length > 0) {
        sections.push(`\nOPEN SECURITY FINDINGS (${openFindings.length}):`);
        openFindings.slice(0, 5).forEach(f => {
          sections.push(`  [${f.findingCode}] ${f.title} — ${f.severity} — ${f.status}`);
          sources.push({ type: 'security', title: f.title, entityId: f.id, section: 'security' });
        });
      }
      break;
    }

    case 'ops': {
      // Releases
      sections.push(`\nRELEASES (${data.releases.length}):`);
      data.releases.forEach(r => {
        sections.push(`  ${r.version} "${r.releaseName}" — ${r.status} — Pre-sentiment: ${r.preReleaseSentiment}%, Post: ${r.postReleaseSentiment}%, Delta: ${r.sentimentDelta > 0 ? '+' : ''}${r.sentimentDelta}%`);
        sources.push({ type: 'release', title: `${r.version} ${r.releaseName}`, entityId: r.id, section: 'releases' });
      });

      // Incidents
      sections.push(`\nINCIDENTS (${data.incidents.length}):`);
      data.incidents.forEach(i => {
        sections.push(`  [${i.incidentCode}] ${i.title} — ${i.severity} — ${i.status} — ${i.affectedUsersCount} users affected`);
        sections.push(`    Root cause: ${truncate(i.rootCause, 120)}`);
        sources.push({ type: 'bug', title: i.title, entityId: i.id, section: 'incidents' });
      });

      // Maintenance
      sections.push(`\nMAINTENANCE (${data.maintenanceTasks.length}):`);
      data.maintenanceTasks.forEach(m => {
        sections.push(`  ${m.title} — ${m.category} — ${m.status} — Next: ${m.nextRun} — Owner: ${m.responsibleEngineer}`);
      });

      // Security assessments
      const critSec = data.securityFindings.filter(f => f.severity === 'critical');
      if (critSec.length > 0) {
        sections.push(`\nCRITICAL SECURITY (${critSec.length}):`);
        critSec.forEach(f => {
          sections.push(`  [${f.findingCode}] ${f.title} — ${f.status}`);
          sources.push({ type: 'security', title: f.title, entityId: f.id, section: 'security' });
        });
      }
      break;
    }
  }

  // Memory events (always include recent ones)
  if (data.memoryEvents.length > 0) {
    sections.push(`\nRECENT PROJECT MEMORY (${data.memoryEvents.length} total):`);
    sections.push(summarizeMemoryEvents(data.memoryEvents, 5));
    sources.push({ type: 'memory', title: 'Project Memory', section: 'project-memory' });
  }

  // Truncate total context if it's too long
  let contextText = sections.join('\n');
  if (contextText.length > MAX_CONTEXT_CHARS) {
    contextText = contextText.substring(0, MAX_CONTEXT_CHARS) + '\n\n[Context truncated to fit token budget]';
  }

  // Deduplicate sources
  const uniqueSources = sources.filter((s, i, arr) =>
    arr.findIndex(x => x.title === s.title && x.type === s.type) === i
  );

  return { contextText, sources: uniqueSources };
}
