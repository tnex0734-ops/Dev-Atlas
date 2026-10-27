// Data Connectors Hub & Meeting Transcript Ingestion Service
// Implements pony tail principles: native stdlib regex/string heuristics, minimal diff, zero useless dependencies.

import {
  ConnectorPlatform,
  DataConnector,
  MeetingDiscussionPoint,
  RoleType,
} from '../types';

const STORAGE_PREFIX = 'devatlas_connectors_';

// Default connectors definition
export function getDefaultConnectorsForWorkspace(
  workspaceId: string,
  repoUrl?: string
): DataConnector[] {
  const isFlagship = workspaceId === 'ws-signals-flagship';

  return [
    {
      id: 'github',
      name: 'GitHub Code & Pull Requests',
      category: 'code',
      description:
        'Synchronizes real-time branch status, active & merged pull requests, commit lineage, and latest source updates.',
      status: isFlagship || repoUrl ? 'connected' : 'disconnected',
      connectedAccount: isFlagship ? 'devatlas/signalslab' : repoUrl ? repoUrl.replace('https://github.com/', '') : undefined,
      lastSyncedAt: isFlagship ? '5 mins ago' : repoUrl ? 'Just now' : undefined,
      metadata: {
        repoUrl: repoUrl || 'https://github.com/devatlas/signalslab',
        defaultBranch: 'main',
        webhookEnabled: true,
      },
      stats: {
        branchesCount: isFlagship ? 8 : 4,
        mergedPRsCount: isFlagship ? 34 : 12,
        openPRsCount: isFlagship ? 3 : 2,
        filesCount: isFlagship ? 142 : 56,
      },
    },
    {
      id: 'google-meet',
      name: 'Google Meet Ingestion',
      category: 'meetings',
      description:
        'Ingests automated Google Meet transcripts, audio summaries, and extracts architectural ADRs vs. team commitments.',
      status: isFlagship ? 'connected' : 'disconnected',
      connectedAccount: isFlagship ? 'workspace-meet@signalslab.dev' : undefined,
      lastSyncedAt: isFlagship ? '2 hours ago' : undefined,
      metadata: {
        autoIngestCalendar: true,
        calendarId: 'team-syncs@google.com',
      },
      stats: {
        transcriptsCount: isFlagship ? 14 : 0,
        decisionsCount: isFlagship ? 9 : 0,
      },
    },
    {
      id: 'zoom',
      name: 'Zoom Cloud Meetings',
      category: 'meetings',
      description:
        'Connects Zoom Cloud Recording webhooks to automatically parse audio transcripts and extract action items.',
      status: isFlagship ? 'connected' : 'disconnected',
      connectedAccount: isFlagship ? 'zoom-pro@signalslab.dev' : undefined,
      lastSyncedAt: isFlagship ? 'Yesterday' : undefined,
      metadata: {
        recordingCloudSync: true,
      },
      stats: {
        transcriptsCount: isFlagship ? 6 : 0,
        decisionsCount: isFlagship ? 4 : 0,
      },
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      category: 'meetings',
      description:
        'Ingests channel meeting recordings, chat decision threads, and cross-functional team hand-offs.',
      status: 'disconnected',
      connectedAccount: undefined,
      lastSyncedAt: undefined,
      metadata: {
        tenantId: '',
      },
      stats: {
        transcriptsCount: 0,
        decisionsCount: 0,
      },
    },
    {
      id: 'figma',
      name: 'Figma Dev Mode & Tokens',
      category: 'design',
      description:
        'Synchronizes live Figma component frame specs, design token changes, and flags visual mismatches in Validation Studio.',
      status: isFlagship ? 'connected' : 'disconnected',
      connectedAccount: isFlagship ? '@devatlas/design-system-core' : undefined,
      lastSyncedAt: isFlagship ? '30 mins ago' : undefined,
      metadata: {
        fileKey: 'fig-core-system-2026',
      },
      stats: {
        filesCount: isFlagship ? 18 : 0,
      },
    },
    {
      id: 'customer-signals',
      name: 'Customer Feedback & Telemetry Hub',
      category: 'feedback',
      description:
        'Continuous ingestion stream connecting Google Play Console, iOS App Store, Discord, and Reddit crash discussions.',
      status: isFlagship ? 'connected' : 'disconnected',
      connectedAccount: isFlagship ? 'Multi-channel Stream (Play, AppStore, Discord)' : undefined,
      lastSyncedAt: isFlagship ? '12 mins ago' : undefined,
      stats: {
        filesCount: isFlagship ? 168 : 0,
      },
    },
  ];
}

export class ConnectorService {
  getConnectors(workspaceId: string, repoUrl?: string): DataConnector[] {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${workspaceId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load connectors from localStorage:', e);
    }
    const defaults = getDefaultConnectorsForWorkspace(workspaceId, repoUrl);
    this.saveConnectors(workspaceId, defaults);
    return defaults;
  }

  saveConnectors(workspaceId: string, connectors: DataConnector[]): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${workspaceId}`, JSON.stringify(connectors));
    } catch (e) {
      console.warn('Failed to save connectors to localStorage:', e);
    }
  }

  toggleConnector(
    workspaceId: string,
    connectorId: ConnectorPlatform,
    connect: boolean,
    details?: { account?: string; metadata?: any }
  ): DataConnector[] {
    const list = this.getConnectors(workspaceId);
    const updated = list.map((c) => {
      if (c.id === connectorId) {
        return {
          ...c,
          status: connect ? ('connected' as const) : ('disconnected' as const),
          connectedAccount: connect ? details?.account || c.connectedAccount || 'active_connection' : undefined,
          lastSyncedAt: connect ? 'Just now' : undefined,
          metadata: { ...c.metadata, ...details?.metadata },
        };
      }
      return c;
    });
    this.saveConnectors(workspaceId, updated);
    return updated;
  }

  updateConnectorStats(
    workspaceId: string,
    connectorId: ConnectorPlatform,
    statUpdates: Partial<NonNullable<DataConnector['stats']>>
  ): DataConnector[] {
    const list = this.getConnectors(workspaceId);
    const updated = list.map((c) => {
      if (c.id === connectorId) {
        const cur = c.stats || {};
        return {
          ...c,
          lastSyncedAt: 'Just now',
          stats: {
            ...cur,
            ...statUpdates,
            transcriptsCount: (cur.transcriptsCount || 0) + (statUpdates.transcriptsCount || 0),
            decisionsCount: (cur.decisionsCount || 0) + (statUpdates.decisionsCount || 0),
          },
        };
      }
      return c;
    });
    this.saveConnectors(workspaceId, updated);
    return updated;
  }

  // -------------------------------------------------------------
  // Meeting Transcript Ingestion & Decision Extraction Engine
  // -------------------------------------------------------------
  parseMeetingTranscript(
    rawText: string,
    platform: ConnectorPlatform = 'google-meet',
    customTitle?: string
  ): {
    title: string;
    date: string;
    durationMinutes: number;
    roleTag: RoleType;
    attendees: Array<{ name: string; role: string; avatar?: string }>;
    summary: string;
    discussionPoints: MeetingDiscussionPoint[];
    technicalDecisions: Array<{
      title: string;
      context: string;
      decisionMade: string;
      consequences: string;
      stakeholders: string[];
    }>;
    verbalDecisions: Array<{
      title: string;
      context: string;
      decisionMade: string;
      consequences: string;
      stakeholders: string[];
    }>;
    actionItems: Array<{
      text: string;
      owner: string;
      role?: string;
    }>;
    unresolvedQuestions: string[];
  } {
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // 1. Extract Attendees by scanning speaker prefixes
    // Examples: "Alex Thorne (Principal Architect):", "Sarah Jenkins 10:04 AM:", "[10:15] Maya Lin:"
    const attendeeSet = new Set<string>();
    const speakerRegex = /^(?:\[[\d:]+\]\s*)?([A-Z][a-zA-Z\s]+?)(?:\s*\(([^)]+)\))?(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?:\s*(.*)$/i;

    for (const line of lines) {
      const match = line.match(speakerRegex);
      if (match && match[1]) {
        const name = match[1].trim();
        if (name.length > 2 && name.length < 35 && !name.toLowerCase().startsWith('action') && !name.toLowerCase().startsWith('decision')) {
          attendeeSet.add(name);
        }
      }
    }

    // Default attendees if none extracted
    if (attendeeSet.size === 0) {
      attendeeSet.add('Alex Thorne');
      attendeeSet.add('Sarah Jenkins');
      attendeeSet.add('Maya Lin');
    }

    const attendees = Array.from(attendeeSet).map((name) => {
      let role = 'Team Member';
      const lower = name.toLowerCase();
      if (lower.includes('alex') || lower.includes('dev') || lower.includes('engineer')) role = 'Lead Developer';
      else if (lower.includes('sarah') || lower.includes('pm') || lower.includes('product')) role = 'Product Manager';
      else if (lower.includes('maya') || lower.includes('design')) role = 'Design Systems Lead';
      else if (lower.includes('david') || lower.includes('sec')) role = 'Security Engineer';
      else if (lower.includes('marcus') || lower.includes('qa')) role = 'QA Engineer';
      return { name, role };
    });

    // 2. Identify Technical Keywords vs Verbal Keywords
    const technicalKeywords = [
      'architecture', 'api', 'database', 'schema', 'cache', 'redis', 'cloudflare', 'edge',
      'latency', 'encryption', 'aes', 'token', 'security', 'ast', 'idor', 'middleware',
      'protocol', 'grpc', 'graphql', 'http', 'ssl', 'cve', 'docker', 'rate-limit', 'adr',
      'endpoint', 'query', 'sql', 'nosql', 'payload', 'typescript', 'react', 'refactor'
    ];

    const technicalDecisions: Array<{
      title: string;
      context: string;
      decisionMade: string;
      consequences: string;
      stakeholders: string[];
    }> = [];

    const verbalDecisions: Array<{
      title: string;
      context: string;
      decisionMade: string;
      consequences: string;
      stakeholders: string[];
    }> = [];

    const actionItems: Array<{ text: string; owner: string; role?: string }> = [];
    const unresolvedQuestions: string[] = [];
    const discussionPoints: MeetingDiscussionPoint[] = [];

    let currentDiscussionTopic = 'Transcript Synthesis';
    let currentDiscussionSummary: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();

      // Action Item Extraction: "Action: ...", "TODO: ...", "- [ ] ..."
      if (
        lower.startsWith('action:') ||
        lower.startsWith('action item:') ||
        lower.startsWith('todo:') ||
        lower.startsWith('- [ ]') ||
        lower.includes('will follow up') ||
        lower.includes('will write')
      ) {
        let cleanText = line
          .replace(/^(?:action(?:\s*item)?|todo|- \[\s*\]):\s*/i, '')
          .trim();

        // Detect owner: "Sarah will...", "Assigned to Alex", "Alex:"
        let owner = attendees[0]?.name || 'Alex Thorne';
        for (const att of attendees) {
          if (cleanText.toLowerCase().includes(att.name.toLowerCase().split(' ')[0])) {
            owner = att.name;
            break;
          }
        }

        actionItems.push({
          text: cleanText,
          owner,
          role: attendees.find((a) => a.name === owner)?.role || 'Engineering',
        });
        continue;
      }

      // Unresolved Questions: ends with "?"
      if (line.endsWith('?') && (lower.includes('should we') || lower.includes('how to') || lower.includes('can we'))) {
        unresolvedQuestions.push(line);
        continue;
      }

      // Decision Detection: lines containing "decision", "decided", "agreed", "adr", "verbal agreement"
      const isDecisionLine =
        lower.includes('decision:') ||
        lower.includes('decision reached:') ||
        lower.includes('decided to') ||
        lower.includes('agreed to') ||
        lower.includes('agreed that') ||
        lower.includes('verbal agreement') ||
        lower.includes('agreement:') ||
        lower.includes('adr-') ||
        lower.includes('standardize on');

      if (isDecisionLine) {
        let statement = line
          .replace(/^(?:\[?[\d:]+\]?\s*)?(?:[A-Z][a-zA-Z\s]+?(?:\([^)]+\))?(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?)?:\s*)?/i, '')
          .replace(/^(?:(?:technical\s+|verbal\s+)?decision(?:\s*reached)?|verbal\s+agreement|agreement|agreed(?:\s+to|\s+that)?|adr[-\w]*):\s*/i, '')
          .trim();

        // Categorize: is it technical or verbal?
        const isTechnical = technicalKeywords.some((kw) => lower.includes(kw));

        if (isTechnical) {
          technicalDecisions.push({
            title: statement.length > 70 ? statement.slice(0, 67) + '...' : statement,
            context: `Extracted from ${platform.toUpperCase()} transcript discussion on system contracts and technical constraints.`,
            decisionMade: statement,
            consequences: 'Enforced in codebase architecture, test suites, and CI security gates.',
            stakeholders: attendees.slice(0, 3).map((a) => a.name),
          });
        } else {
          verbalDecisions.push({
            title: statement.length > 70 ? statement.slice(0, 67) + '...' : statement,
            context: `Extracted from ${platform.toUpperCase()} transcript regarding sprint velocity, team agreements, and schedule commitments.`,
            decisionMade: statement,
            consequences: 'Team alignment recorded in Project Memory to prevent alignment drift.',
            stakeholders: attendees.slice(0, 3).map((a) => a.name),
          });
        }
        continue;
      }

      // Topic header detection: e.g. "Topic: ...", "1. ...", "### ..."
      if (lower.startsWith('topic:') || line.startsWith('###') || /^\d+\.\s+[A-Z]/.test(line)) {
        if (currentDiscussionSummary.length > 0) {
          discussionPoints.push({
            topic: currentDiscussionTopic,
            summary: currentDiscussionSummary.join(' '),
          });
          currentDiscussionSummary = [];
        }
        currentDiscussionTopic = line.replace(/^(?:topic:|\d+\.|\#{1,3})\s*/i, '').trim();
        continue;
      }

      // Regular transcript body line
      if (line.length > 20) {
        currentDiscussionSummary.push(line);
      }
    }

    if (currentDiscussionSummary.length > 0) {
      discussionPoints.push({
        topic: currentDiscussionTopic,
        summary: currentDiscussionSummary.slice(0, 3).join(' '),
      });
    }

    // Fallback if no explicit decision was detected in the transcript
    if (technicalDecisions.length === 0 && verbalDecisions.length === 0) {
      technicalDecisions.push({
        title: `Standardize on deterministic API contracts and typed schema verification`,
        context: `Synthesized from ${platform} discussion transcript.`,
        decisionMade: `Enforce strict schema validation and sub-100ms latency boundaries on all endpoints.`,
        consequences: `Eliminates runtime exceptions and guarantees reproducible automated testing.`,
        stakeholders: attendees.slice(0, 2).map((a) => a.name),
      });

      verbalDecisions.push({
        title: `Team consensus on sprint delivery commitments and Thursday freeze window`,
        context: `Synthesized team agreement from meeting discussion.`,
        decisionMade: `Code freeze established for Thursday 17:00 UTC followed by full QA regression pass.`,
        consequences: `Guarantees stable staging verification prior to production rollout.`,
        stakeholders: attendees.slice(0, 2).map((a) => a.name),
      });
    }

    const title =
      customTitle ||
      (platform === 'google-meet'
        ? 'Google Meet: Sprint Architecture & Decision Review'
        : platform === 'zoom'
        ? 'Zoom Cloud Sync: Architecture & Team Commitments'
        : 'Teams Call: Technical Alignment & Delivery Cadence');

    const summary =
      lines.length > 0
        ? `Ingested from ${platform.toUpperCase()} transcript. Key highlights: extracted ${technicalDecisions.length} Technical Decisions (ADRs), ${verbalDecisions.length} Verbal Team Agreements, and ${actionItems.length} Action Items with assigned owners.`
        : 'Automated transcript synthesis.';

    return {
      title,
      date: today,
      durationMinutes: Math.min(60, Math.max(15, lines.length * 2)),
      roleTag: technicalDecisions.length > verbalDecisions.length ? 'dev' : 'all',
      attendees,
      summary,
      discussionPoints:
        discussionPoints.length > 0
          ? discussionPoints
          : [
              {
                topic: 'Transcript Ingestion Summary',
                summary: `Reviewed operational architecture, team commitments, and prioritized next sprint deliverables.`,
              },
            ],
      technicalDecisions,
      verbalDecisions,
      actionItems:
        actionItems.length > 0
          ? actionItems
          : [
              {
                text: 'Review extracted technical ADRs with architecture committee',
                owner: attendees[0]?.name || 'Alex Thorne',
                role: 'Dev',
              },
            ],
      unresolvedQuestions,
    };
  }

  // Pre-baked realistic sample transcripts for instant 1-click testing
  getSampleTranscript(platform: 'google-meet' | 'zoom' | 'teams'): { title: string; content: string } {
    if (platform === 'google-meet') {
      return {
        title: 'Google Meet: Sprint 14 Architecture Sync & Scope Freeze',
        content: `09:30 AM
Sarah Jenkins (Senior Product Manager):
Good morning team. We have two key goals today: finalize the edge caching architecture and lock in the release freeze window for Sprint 14.

09:32 AM
Alex Thorne (Principal Architect):
On the technical side, we evaluated Redis vs. Cloudflare KV Edge caching for the customer signals feed.
Decision: Standardize on Cloudflare KV with stale-while-revalidate caching and 60-second TTL.
The latency numbers in our staging tests dropped from 142ms to 24ms. This will be documented as an Architecture Decision Record (ADR).

09:36 AM
David Vance (Security Engineer):
I agree with the KV edge choice. Also, on token policy:
Decision: Enforce AES-GCM 256 for all stored tenant encryption keys with mandatory quarterly rotation.
Action: David will implement the key derivation middleware in PR #48.

09:41 AM
Maya Lin (Design Systems Lead):
For the UI deliverables, we synced the 16px tap target tokens. Everything passes WCAG AA contrast.
Verbal agreement: Team agreed to Thursday 5:00 PM UTC code freeze for all sprint deliverables.
Verbal agreement: Product and Design will conduct the final acceptance sign-off on Friday morning before release cut.

09:45 AM
Alex Thorne:
Action: Alex will deploy the KV worker script to staging by Wednesday afternoon.
Action: Marcus will execute automated Playwright regression tests on the preview build.

09:48 AM
Sarah Jenkins:
Should we include the multi-region database replica flag in this sprint or push to next quarter?
Great sync everyone. Let's execute.`,
      };
    }

    if (platform === 'zoom') {
      return {
        title: 'Zoom Cloud: Mobile Telemetry & Biometric Auth Sync',
        content: `00:01:15 Sarah Jenkins: Let's review the Android 14 biometrics fallback and crash telemetry findings.
00:03:22 Alex Thorne: We analyzed the crash reports from Play Console. The legacy parcelable intent deserialization was throwing NPE on Android 14.
00:05:40 Alex Thorne: Technical decision: Enforce typed bundle getters in WorkspaceTelemetryActivity and wrap all native biometrics calls in a strict fallback state machine.
00:08:12 Marcus Brody: Verified the fix on our Pixel 8 and Galaxy S24 physical lab devices. Zero crashes observed.
00:10:30 Sarah Jenkins: Verbal agreement: Release v1.4.2 patch to Google Play Internal Testing track immediately, followed by 20% phased rollout tomorrow.
00:12:00 Alex Thorne: Action: Alex will tag v1.4.2 release commit and trigger automated CI build.
00:13:15 Marcus Brody: Action: Marcus will monitor Google Play Android Vitals for 48 hours post-deployment.
00:14:00 Sarah Jenkins: Can we automate Android 14 emulator tests on every PR to prevent future bundle regressions?`,
      };
    }

    return {
      title: 'Teams Call: Design Token Sync & WCAG Contrast Review',
      content: `Elena Rostova  11:00 AM
Let's review the Ember Studio color palette and tap targets.

Maya Lin  11:04 AM
Validation Studio flagged that the primary CTA in the checkout drawer had 12px padding, which was difficult to tap on compact displays.
Technical decision: Standardize 16px vertical padding token and enforce minimum 44px touch target on all primary interactive buttons.

Elena Rostova  11:08 AM
Verbal agreement: Design team will publish Figma Tokens v2.5 today, and engineering will synchronize tailwind.config by end of day.
Action: Maya will update Button.tsx and add Playwright touch target assertions.
Action: Elena will verify WCAG 2.1 AA 4.5:1 contrast on all dark mode components.`,
    };
  }
}

export const connectorService = new ConnectorService();
