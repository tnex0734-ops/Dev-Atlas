import { describe, it, expect } from 'vitest';
import { generateGroundedProjectResponse } from '../services/groundedMemoryEngine';

const mockContext: any = {
  activeWorkspace: { name: 'Signals Flagship', code: 'DEV', version: 'v2.0.0' },
  meetings: [
    {
      id: 'MTG-024',
      meetingCode: 'MTG-024',
      title: 'Sprint 24 Architecture Alignment',
      date: '2026-09-24',
      durationMinutes: 45,
      attendees: [
        { name: 'Alex Rivera', role: 'Staff Frontend Engineer' },
        { name: 'Elena Rostova', role: 'Security Architect' }
      ],
      summary: 'Agreed on AES-GCM 256 hardware tokens.',
      discussionPoints: [{ topic: 'Storage', summary: 'SQLite was evaluated' }],
      decisions: [{ text: 'Adopt AES-GCM encryption', linkedDecisionId: 'ADR-004' }],
      unresolvedQuestions: ['Hardware latency benchmark']
    }
  ],
  decisions: [
    {
      id: 'ADR-004',
      decisionCode: 'ADR-004',
      title: 'Adopt AES-GCM 256 for Token Storage',
      category: 'Architecture',
      status: 'active',
      decisionMade: 'Tokens encrypted with hardware-backed AES-GCM keys.',
      context: 'Security audit identified unencrypted bearer tokens.',
      consequences: 'Requires key rotation service.',
      relatedMeetingId: 'MTG-024'
    }
  ],
  devTasks: [
    {
      id: 'DEV-SIGN-001',
      taskCode: 'DEV-SIGN-001',
      title: 'Implement PKCE OAuth flow',
      status: 'in-progress',
      priority: 'P0',
      assignee: { name: 'Alex Rivera', role: 'Frontend' },
      whyItExists: 'Enforce single sign-on with token rotation per ADR-004.'
    }
  ],
  bugs: [],
  prds: [],
  features: [],
  roadmap: [],
  feedback: [],
  problemClusters: [],
  researchSessions: [],
  uxFindings: [],
  personas: [],
  contextBlocks: [],
  secondBrainNotes: [],
  qaTestCases: [],
  readinessChecks: [],
  securityFindings: [],
  releases: [],
  incidents: [],
  maintenanceTasks: [],
  memoryEvents: [
    {
      id: 'MEM-001',
      eventType: 'decision',
      state: 'active',
      title: 'Token Storage Strategy',
      summary: 'Migrated from localStorage to secure encrypted vault.',
      occurredAt: '2026-09-24'
    }
  ],
  metrics: { healthScore: 94 }
};

describe('groundedMemoryEngine — Deterministic Offline Grounding', () => {
  it('answers meeting questions grounded in real meeting records', () => {
    const res = generateGroundedProjectResponse('What was discussed in the last meeting?', 'pm', mockContext);
    expect(res.content).toContain('Sprint 24 Architecture Alignment');
    expect(res.content).toContain('MTG-024');
    expect(res.content).toContain('Alex Rivera');
    expect(res.metadata.sources?.some(s => s.id === 'MTG-024')).toBe(true);
  });

  it('answers decision/ADR queries with lineage and consequences', () => {
    const res = generateGroundedProjectResponse('What architectural decisions were made?', 'dev', mockContext);
    expect(res.content).toContain('ADR-004');
    expect(res.content).toContain('Adopt AES-GCM 256');
    expect(res.metadata.sources?.some(s => s.id === 'ADR-004')).toBe(true);
  });

  it('answers task questions with owner and why-it-exists context', () => {
    const res = generateGroundedProjectResponse('What tasks are in progress?', 'dev', mockContext);
    expect(res.content).toContain('DEV-SIGN-001');
    expect(res.content).toContain('PKCE OAuth');
    expect(res.metadata.sources?.some(s => s.id === 'DEV-SIGN-001')).toBe(true);
  });

  it('answers memory and lineage queries with immutable event history', () => {
    const res = generateGroundedProjectResponse('Show me project memory lineage and why things changed', 'memory', mockContext);
    expect(res.content).toContain('MEM-001');
    expect(res.content).toContain('Token Storage Strategy');
  });

  it('never invents fictitious data when answering unknown prompts', () => {
    const res = generateGroundedProjectResponse('Tell me about the secret NASA rocket integration', 'dev', mockContext);
    // Even in fallback mode, it grounds the answer in the actual workspace overview
    expect(res.content).toContain('Signals Flagship');
    expect(res.content).not.toContain('NASA');
  });
});
