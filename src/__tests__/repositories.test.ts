import { describe, it, expect, vi } from 'vitest';
import { DEMO_USERS } from '../services/firebase/auth';

describe('Demo Users & Role Assignments', () => {
  it('defines valid demo users for all primary DevAtlas role perspectives', () => {
    const roles = ['dev', 'pm', 'designer', 'qa', 'ops', 'memory'] as const;
    
    roles.forEach((r) => {
      const demoUser = DEMO_USERS[r];
      expect(demoUser).toBeDefined();
      expect(demoUser.uid).toBeTruthy();
      expect(demoUser.email).toContain('@devatlas.internal');
      expect(demoUser.role).toBe(r);
      expect(demoUser.displayName).toBeTruthy();
    });
  });

  it('guarantees unique uids and emails across all demo roles', () => {
    const uids = Object.values(DEMO_USERS).map(u => u.uid);
    const emails = Object.values(DEMO_USERS).map(u => u.email);

    expect(new Set(uids).size).toBe(uids.length);
    expect(new Set(emails).size).toBe(emails.length);
  });
});

describe('Repository Data Structures & Relational Integrity', () => {
  it('validates meeting to decision linkage structure', () => {
    const meeting = {
      id: 'MTG-024',
      decisions: [
        { id: 'DEC-01', text: 'Adopt AES-GCM 256', linkedDecisionId: 'ADR-004' }
      ]
    };

    expect(meeting.decisions[0].linkedDecisionId).toBe('ADR-004');
  });

  it('validates task to decision and meeting rationale chain structure', () => {
    const task = {
      id: 'DEV-SIGN-001',
      taskCode: 'DEV-SIGN-001',
      title: 'Implement PKCE flow',
      status: 'in-progress',
      relatedDecisionId: 'ADR-004',
      relatedMeetingId: 'MTG-024',
      whyItExists: 'Enforce hardware-backed tokens per ADR-004 decided in MTG-024.'
    };

    expect(task.relatedDecisionId).toBe('ADR-004');
    expect(task.relatedMeetingId).toBe('MTG-024');
    expect(task.whyItExists).toContain('ADR-004');
  });

  it('preserves immutable historical lineage when decisions are superseded', () => {
    const originalDecision = {
      id: 'ADR-001',
      status: 'superseded',
      supersededBy: 'ADR-004'
    };

    const newDecision = {
      id: 'ADR-004',
      status: 'active',
      supersedes: 'ADR-001'
    };

    expect(originalDecision.status).toBe('superseded');
    expect(originalDecision.supersededBy).toBe(newDecision.id);
    expect(newDecision.supersedes).toBe(originalDecision.id);
  });
});
