import { SecurityScannerAdapter } from './SecurityScannerAdapter';
import {
  SecurityAssessment,
  SecurityFinding,
  SecurityEvidence,
  SecurityScanEvent,
} from '../../types';
import { StartAssessmentInput, SecurityAssessmentResult } from '../types';

export class DemoSecurityAdapter implements SecurityScannerAdapter {
  providerName: 'demo' = 'demo';

  async startAssessment(
    input: StartAssessmentInput,
    onProgress?: (event: SecurityScanEvent) => void
  ): Promise<SecurityAssessmentResult> {
    const assessmentId = `sec-scan-${Date.now()}`;
    const assessmentCode = `SEC-SCAN-${Math.floor(100 + Math.random() * 900)}`;

    const emitEvent = (stage: SecurityScanEvent['stage'], message: string, status: SecurityScanEvent['status']) => {
      const ev: SecurityScanEvent = {
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        assessmentId,
        timestamp: new Date().toLocaleTimeString(),
        stage,
        source: 'Demo Security Engine',
        message,
        status,
      };
      if (onProgress) onProgress(ev);
      return ev;
    };

    // Staged observable events
    const events: SecurityScanEvent[] = [];
    events.push(emitEvent('discovery', `Authorized scope confirmed for target: ${input.target}`, 'success'));
    events.push(emitEvent('discovery', `Identified 28 API routes & 4 authentication handlers`, 'running'));
    events.push(emitEvent('analysis', `Initiated OWASP Top 10 automated test suites`, 'running'));
    events.push(emitEvent('analysis', `Detected potential authorization flaw on /api/v2/monetization/receipts`, 'warning'));
    events.push(emitEvent('validation', `VulnClaw evidence engine executing active token test vectors`, 'running'));
    events.push(emitEvent('validation', `Confirmed IDOR vulnerability: Non-privileged user token accessed Tier-3 VIP receipt`, 'success'));
    events.push(emitEvent('reporting', `Security assessment completed. 1 Critical, 1 High, 1 Medium validated.`, 'success'));

    // Generated Findings
    const finding1Id = `sec-find-${Date.now()}-1`;
    const ev1Id = `ev-item-${Date.now()}-1`;
    const ev2Id = `ev-item-${Date.now()}-2`;

    const findings: SecurityFinding[] = [
      {
        id: finding1Id,
        findingCode: `SEC-0${Math.floor(20 + Math.random() * 50)}`,
        assessmentId,
        title: `Broken Access Control & IDOR in /api/v2/monetization/receipts/{id}`,
        description: `Endpoint does not verify whether the requesting user's session token matches the creator ownership claims of the requested receipt entity, allowing arbitrary receipt exfiltration.`,
        severity: 'critical',
        confidence: 'validated',
        category: 'Broken Object Level Authorization (BOLA / IDOR)',
        owasp: 'API1:2023 Broken Object Level Authorization',
        cwe: 'CWE-639',
        cvss: 8.8,
        affectedTarget: input.target,
        affectedEndpoint: 'GET /api/v2/monetization/receipts/{receiptId}',
        affectedFile: 'src/server/routes/receipts.ts',
        affectedLine: 42,
        evidenceIds: [ev1Id, ev2Id],
        reproductionSummary: `Issue GET request with Bearer token for User A passing receipt ID belonging to User B. API returns 200 OK with full PII and transaction tokens.`,
        impact: `Direct exfiltration of creator monetization invoices, subscriber real names, and masked card identifiers.`,
        remediation: `Enforce tenant ownership guard: if (receipt.creatorId !== session.userId && !session.isAdmin) throw new ForbiddenError();`,
        status: 'open',
        discoveredAt: 'Just now',
      },
    ];

    const evidence: SecurityEvidence[] = [
      {
        id: ev1Id,
        assessmentId,
        findingId: finding1Id,
        type: 'http-request',
        title: 'Unauthorized IDOR HTTP Probe Request',
        capturedAt: 'Just now',
        source: 'VulnClaw HTTP Prober',
        content: `GET /api/v2/monetization/receipts/rcpt_99214819 HTTP/1.1
Host: api.streamflow.dev
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user_attacker_session
Accept: application/json`,
      },
      {
        id: ev2Id,
        assessmentId,
        findingId: finding1Id,
        type: 'http-response',
        title: 'IDOR 200 OK Leaked Receipt Response',
        capturedAt: 'Just now',
        source: 'VulnClaw HTTP Prober',
        content: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "receiptId": "rcpt_99214819",
  "creatorHandle": "NovaStreamer",
  "payerEmail": "victim_subscriber@streamflow.dev",
  "amountPaise": 79900,
  "currency": "INR",
  "transactionToken": "tx_sec_live_990142"
}`,
      },
    ];

    const assessment: SecurityAssessment = {
      id: assessmentId,
      assessmentCode,
      name: input.name,
      targetType: input.targetType,
      target: input.target,
      mode: input.mode,
      status: 'completed',
      scope: {
        assessmentId,
        authorized: true,
        allowedTargets: input.scope.allowedTargets,
        excludedTargets: input.scope.excludedTargets,
        confirmedBy: input.scope.confirmedBy,
        confirmedAt: new Date().toISOString(),
      },
      startedAt: '1 min ago',
      completedAt: 'Just now',
      initiatedBy: input.scope.confirmedBy || 'Security Lead',
      relatedBuildId: input.relatedBuildId,
      findingsCount: 1,
      criticalCount: 1,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      validatedCount: 1,
      securityScore: 74,
      provider: 'demo',
    };

    return { assessment, findings, evidence, events };
  }

  async retestFinding(
    finding: SecurityFinding,
    existingEvidence: SecurityEvidence[],
    onProgress?: (event: SecurityScanEvent) => void
  ): Promise<{
    status: 'verified-fixed' | 'still-vulnerable';
    newEvidence: SecurityEvidence;
    retestEvent: SecurityScanEvent;
  }> {
    const evId = `ev-retest-${Date.now()}`;
    const newEvidence: SecurityEvidence = {
      id: evId,
      assessmentId: finding.assessmentId,
      findingId: finding.id,
      type: 'http-response',
      title: 'Retest Verification: HTTP 403 Forbidden',
      capturedAt: 'Just now',
      source: 'VulnClaw Active Retest Engine',
      content: `HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Forbidden",
  "message": "Access Denied: Requesting principal does not own receipt resource rcpt_99214819."
}`,
    };

    const retestEvent: SecurityScanEvent = {
      id: `ev-${Date.now()}`,
      assessmentId: finding.assessmentId,
      timestamp: new Date().toLocaleTimeString(),
      stage: 'retest',
      source: 'VulnClaw Retest Engine',
      message: `Retest completed for ${finding.findingCode}: Endpoint returned 403 Forbidden as expected. Verified Fixed!`,
      status: 'success',
    };

    if (onProgress) onProgress(retestEvent);

    return {
      status: 'verified-fixed',
      newEvidence,
      retestEvent,
    };
  }
}
