import { describe, it, expect, beforeEach } from 'vitest';
import {
  connectorService,
  getDefaultConnectorsForWorkspace,
} from '../services/connectorService';

describe('ConnectorService & Meeting Ingestion Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getDefaultConnectorsForWorkspace', () => {
    it('sets ws-signals-flagship as connected with rich statistics', () => {
      const connectors = getDefaultConnectorsForWorkspace('ws-signals-flagship');
      expect(connectors.length).toBe(6);

      const github = connectors.find((c) => c.id === 'github');
      expect(github?.status).toBe('connected');
      expect(github?.stats?.branchesCount).toBeGreaterThan(0);
      expect(github?.stats?.mergedPRsCount).toBeGreaterThan(0);

      const meet = connectors.find((c) => c.id === 'google-meet');
      expect(meet?.status).toBe('connected');
      expect(meet?.stats?.transcriptsCount).toBeGreaterThan(0);
    });

    it('sets non-flagship workspace without repoUrl as disconnected', () => {
      const connectors = getDefaultConnectorsForWorkspace('ws-custom-new');
      const disconnected = connectors.filter((c) => c.status === 'disconnected');
      expect(disconnected.length).toBe(6);
    });

    it('automatically connects GitHub connector if repoUrl is supplied', () => {
      const connectors = getDefaultConnectorsForWorkspace(
        'ws-custom-new',
        'https://github.com/facebook/react'
      );
      const github = connectors.find((c) => c.id === 'github');
      expect(github?.status).toBe('connected');
      expect(github?.connectedAccount).toBe('facebook/react');
    });
  });

  describe('toggleConnector', () => {
    it('updates status and persists to localStorage', () => {
      const workspaceId = 'ws-test-123';
      const updated = connectorService.toggleConnector(workspaceId, 'zoom', true, {
        account: 'zoom-team@enterprise.com',
      });

      const zoom = updated.find((c) => c.id === 'zoom');
      expect(zoom?.status).toBe('connected');
      expect(zoom?.connectedAccount).toBe('zoom-team@enterprise.com');

      // Verify persistence
      const reloaded = connectorService.getConnectors(workspaceId);
      const reloadedZoom = reloaded.find((c) => c.id === 'zoom');
      expect(reloadedZoom?.status).toBe('connected');
      expect(reloadedZoom?.connectedAccount).toBe('zoom-team@enterprise.com');
    });
  });

  describe('parseMeetingTranscript & Decision Prioritization', () => {
    it('accurately separates technical ADRs vs verbal team agreements from Google Meet transcript', () => {
      const rawText = `09:30 AM
Alex Thorne (Principal Architect):
We evaluated our cache infrastructure.
Decision: Standardize on Cloudflare KV with stale-while-revalidate caching and 60-second TTL.
The latency numbers in our staging tests dropped from 142ms to 24ms.

09:35 AM
Maya Lin (Product Manager):
Verbal agreement: Team agreed to Thursday 5:00 PM UTC code freeze for all sprint deliverables.
Action: Alex will deploy the KV worker script to staging by Wednesday afternoon.
Action: Maya will verify acceptance criteria with stakeholders.`;

      const result = connectorService.parseMeetingTranscript(rawText, 'google-meet');

      expect(result.attendees.length).toBeGreaterThanOrEqual(2);
      expect(result.attendees.some((a) => a.name === 'Alex Thorne')).toBe(true);

      // Verify Technical Decision extraction
      expect(result.technicalDecisions.length).toBe(1);
      expect(result.technicalDecisions[0].decisionMade).toContain('Cloudflare KV');
      expect(result.technicalDecisions[0].stakeholders).toContain('Alex Thorne');

      // Verify Verbal Agreement extraction
      expect(result.verbalDecisions.length).toBe(1);
      expect(result.verbalDecisions[0].decisionMade).toContain('code freeze');

      // Verify Action Items
      expect(result.actionItems.length).toBe(2);
      expect(result.actionItems[0].owner).toBe('Alex Thorne');
      expect(result.actionItems[0].text).toContain('deploy the KV worker');
    });

    it('handles Zoom transcript format with timestamps and question detection', () => {
      const rawText = `00:01:15 Sarah Jenkins: Let's review the authentication protocol.
00:03:22 Alex Thorne: Technical decision: Enforce AES-GCM 256 for all stored tenant encryption keys.
00:05:10 Sarah Jenkins: Verbal agreement: Release v1.4.2 patch to Google Play Internal Testing track immediately.
00:06:00 Sarah Jenkins: Should we enable geo-distributed replicas in Q4?
Action: Alex will implement key derivation middleware in PR #48.`;

      const result = connectorService.parseMeetingTranscript(rawText, 'zoom');

      expect(result.technicalDecisions.length).toBe(1);
      expect(result.technicalDecisions[0].decisionMade).toContain('AES-GCM 256');

      expect(result.verbalDecisions.length).toBe(1);
      expect(result.verbalDecisions[0].decisionMade).toContain('v1.4.2 patch');

      expect(result.unresolvedQuestions.length).toBe(1);
      expect(result.unresolvedQuestions[0]).toContain('geo-distributed replicas');
    });

    it('gracefully handles empty or unformatted transcript with resilient defaults', () => {
      const result = connectorService.parseMeetingTranscript('', 'google-meet');
      expect(result.attendees.length).toBeGreaterThan(0);
      expect(result.technicalDecisions.length).toBeGreaterThan(0);
      expect(result.verbalDecisions.length).toBeGreaterThan(0);
      expect(result.actionItems.length).toBeGreaterThan(0);
    });
  });
});
