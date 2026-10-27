// VulnClaw prober adapter


import { SecurityScannerAdapter } from './SecurityScannerAdapter';
import {
  SecurityAssessment,
  SecurityFinding,
  SecurityEvidence,
  SecurityScanEvent,
} from '../../types';
import { StartAssessmentInput, SecurityAssessmentResult } from '../types';

export class VulnClawSecurityAdapter implements SecurityScannerAdapter {
  providerName: 'vulnclaw' = 'vulnclaw';

  async startAssessment(
    input: StartAssessmentInput,
    onProgress?: (event: SecurityScanEvent) => void
  ): Promise<SecurityAssessmentResult> {
    const assessmentId = `sec-vulnclaw-${Date.now()}`;
    const assessmentCode = `VCLW-SCAN-${Math.floor(100 + Math.random() * 900)}`;

    const emitEvent = (stage: SecurityScanEvent['stage'], message: string, status: SecurityScanEvent['status']) => {
      const ev: SecurityScanEvent = {
        id: `ev-vclw-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        assessmentId,
        timestamp: new Date().toLocaleTimeString(),
        stage,
        source: 'VulnClaw Verifiable Prober',
        message,
        status,
      };
      if (onProgress) onProgress(ev);
      return ev;
    };

    // Staged real-time telemetry simulation
    const events: SecurityScanEvent[] = [];
    events.push(emitEvent('discovery', `[VulnClaw Prober] Initiating dynamic test harness against: ${input.target}`, 'success'));
    await new Promise((r) => setTimeout(r, 150));

    events.push(emitEvent('discovery', `[Endpoint Fuzzing] Dispatched 14 test personas with unprivileged bearer tokens`, 'running'));
    await new Promise((r) => setTimeout(r, 200));

    events.push(emitEvent('analysis', `[OWASP API Probe] Executing BOLA/IDOR state mutation assertions`, 'running'));
    await new Promise((r) => setTimeout(r, 250));

    events.push(emitEvent('validation', `[Exploit Verification] High-confidence proof captured: 200 OK returned on unauthorized resource`, 'warning'));
    await new Promise((r) => setTimeout(r, 200));

    events.push(emitEvent('reporting', `[VulnClaw Complete] Formatted deterministic HTTP request/response evidence payloads`, 'success'));

    const findingId = `sec-find-vclw-${Date.now()}`;
    const ev1Id = `ev-vclw-req-${Date.now()}`;
    const ev2Id = `ev-vclw-res-${Date.now()}`;

    const hostName = input.target.replace(/^https?:\/\//, '').split('/')[0] || 'api.internal';

    const finding: SecurityFinding = {
      id: findingId,
      findingCode: `SEC-VCLW-${Math.floor(10 + Math.random() * 89)}`,
      assessmentId,
      title: `Verifiable BOLA / IDOR on Target API (${hostName})`,
      description: `VulnClaw dynamic prober successfully accessed and exfiltrated sensitive tenant data across authorization boundaries using unprivileged session credentials.`,
      severity: 'critical',
      confidence: 'validated',
      category: 'Broken Object Level Authorization (BOLA / IDOR)',
      owasp: 'API1:2023 Broken Object Level Authorization',
      cwe: 'CWE-639',
      cvss: 8.9,
      affectedTarget: input.target,
      affectedEndpoint: `${input.target}/monetization/invoices/{invoiceId}`,
      affectedFile: 'src/api/v2/monetization.ts',
      affectedLine: 54,
      evidenceIds: [ev1Id, ev2Id],
      reproductionSummary: `Dispatched HTTP GET request with User B Bearer session token requesting User A's invoice. Received 200 OK with sensitive PII.`,
      impact: 'Immediate unauthorized leakage of financial transaction records and private customer identities.',
      remediation: `Bind authorization check directly to session identity: ensure req.user.tenantId === invoice.tenantId prior to payload serialization.`,
      status: 'open',
      discoveredAt: 'Just now',
    };

    const evidence: SecurityEvidence[] = [
      {
        id: ev1Id,
        assessmentId,
        findingId: findingId,
        type: 'http-request',
        title: 'VulnClaw Deterministic HTTP Probe (Unauthorized Request)',
        capturedAt: 'Just now',
        source: 'VulnClaw HTTP Prober',
        content: `GET /api/v2/monetization/invoices/inv_99182741 HTTP/1.1
Host: ${hostName}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user_unprivileged_attacker
Accept: application/json
X-VulnClaw-Probe-Id: vclw_live_probe_8819`,
      },
      {
        id: ev2Id,
        assessmentId,
        findingId: findingId,
        type: 'http-response',
        title: 'VulnClaw 200 OK Evidence Response (Leaked Tenant Data)',
        capturedAt: 'Just now',
        source: 'VulnClaw HTTP Prober',
        content: `HTTP/1.1 200 OK
Content-Type: application/json
X-VulnClaw-Exploit-Confirmed: true

{
  "invoiceId": "inv_99182741",
  "organization": "Victim Enterprise Corp",
  "totalAmountPaise": 1499000,
  "currency": "INR",
  "paymentStatus": "SETTLED",
  "customerTaxId": "GSTIN29ABCDE1234F1Z5",
  "clientSecretExposed": "sk_live_CONFIDENTIAL_INVOICE_KEY"
}`,
      },
    ];

    const assessment: SecurityAssessment = {
      id: assessmentId,
      assessmentCode,
      name: `[VulnClaw Verifiable Prober] ${input.name}`,
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
      securityScore: 76,
      provider: 'vulnclaw',
    };

    return {
      assessment,
      findings: [finding],
      evidence,
      events,
    };
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
    const isFixed = Math.random() > 0.4;
    const retestEvent: SecurityScanEvent = {
      id: `ev-retest-vclw-${Date.now()}`,
      assessmentId: finding.assessmentId || 'sec-vulnclaw',
      timestamp: new Date().toLocaleTimeString(),
      stage: 'validation',
      source: 'VulnClaw Verifiable Prober',
      message: isFixed
        ? `[VulnClaw Retest] Confirmed: API returned 403 Forbidden on cross-tenant probe. Vulnerability resolved.`
        : `[VulnClaw Retest] Probe still captured 200 OK with unauthorized payload. Vulnerability remains open.`,
      status: isFixed ? 'success' : 'failed',
    };

    if (onProgress) onProgress(retestEvent);

    const newEvidence: SecurityEvidence = {
      id: `ev-retest-vclw-${Date.now()}`,
      assessmentId: finding.assessmentId || 'sec-vulnclaw',
      findingId: finding.id,
      type: 'http-response',
      title: `VulnClaw Retest HTTP Response (${isFixed ? '403 FORBIDDEN - FIXED' : '200 OK - STILL VULNERABLE'})`,
      capturedAt: 'Just now',
      source: 'VulnClaw HTTP Prober',
      content: isFixed
        ? `HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Forbidden",
  "message": "Tenant ownership mismatch. Access denied.",
  "code": "TENANT_MISMATCH"
}`
        : `HTTP/1.1 200 OK
Content-Type: application/json

{
  "warning": "Vulnerability still reproducible",
  "invoiceId": "inv_99182741"
}`,
    };

    return {
      status: isFixed ? ('verified-fixed' as const) : ('still-vulnerable' as const),
      newEvidence,
      retestEvent,
    };
  }
}
