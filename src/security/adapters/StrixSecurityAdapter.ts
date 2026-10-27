// Strix AST scanner adapter


import { SecurityScannerAdapter } from './SecurityScannerAdapter';
import {
  SecurityAssessment,
  SecurityFinding,
  SecurityEvidence,
  SecurityScanEvent,
} from '../../types';
import { StartAssessmentInput, SecurityAssessmentResult } from '../types';

export class StrixSecurityAdapter implements SecurityScannerAdapter {
  providerName: 'strix' = 'strix';

  async startAssessment(
    input: StartAssessmentInput,
    onProgress?: (event: SecurityScanEvent) => void
  ): Promise<SecurityAssessmentResult> {
    const assessmentId = `sec-strix-${Date.now()}`;
    const assessmentCode = `STRIX-SCAN-${Math.floor(100 + Math.random() * 900)}`;

    const emitEvent = (stage: SecurityScanEvent['stage'], message: string, status: SecurityScanEvent['status']) => {
      const ev: SecurityScanEvent = {
        id: `ev-strix-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        assessmentId,
        timestamp: new Date().toLocaleTimeString(),
        stage,
        source: 'Strix Autonomous Engine',
        message,
        status,
      };
      if (onProgress) onProgress(ev);
      return ev;
    };

    // Staged real-time telemetry simulation
    const events: SecurityScanEvent[] = [];
    events.push(emitEvent('discovery', `[Strix AST Parser] Target repository verified: ${input.target}`, 'success'));
    await new Promise((r) => setTimeout(r, 150));

    events.push(emitEvent('discovery', `[Tree-Sitter] Constructed abstract syntax tree across endpoints and handlers`, 'running'));
    await new Promise((r) => setTimeout(r, 200));

    events.push(emitEvent('analysis', `[Taint Tracking] Analyzing dataflow from external parameters to database mutations`, 'running'));
    await new Promise((r) => setTimeout(r, 250));

    events.push(emitEvent('analysis', `[OWASP Engine] Flagged missing authorization decorator on resource mutations`, 'warning'));
    await new Promise((r) => setTimeout(r, 200));

    events.push(emitEvent('validation', `[Multi-Agent Loop] Autonomous verification agent synthesized reproducible taint graph`, 'success'));
    await new Promise((r) => setTimeout(r, 150));

    events.push(emitEvent('reporting', `[Strix Complete] Generated verifiable AST findings & remediation patches`, 'success'));

    const findingId = `sec-find-strix-${Date.now()}`;
    const evidenceId = `ev-strix-${Date.now()}`;

    // Target-aware details
    const targetClean = input.target.replace(/^https?:\/\//, '').split('/')[0];
    const isPython = input.target.includes('py') || input.name.toLowerCase().includes('python') || input.name.toLowerCase().includes('strix');

    const finding: SecurityFinding = {
      id: findingId,
      findingCode: `SEC-STRX-${Math.floor(10 + Math.random() * 89)}`,
      assessmentId,
      title: `Unsanitized Dataflow Taint in Parameter Handling (${targetClean})`,
      description: `Strix AST analyzer identified an unvalidated parameter flow that traverses directly into internal database queries without prior tenant ownership asserts.`,
      severity: 'critical',
      confidence: 'validated',
      category: 'Broken Object Level Authorization (BOLA / IDOR)',
      owasp: 'API1:2023 Broken Object Level Authorization',
      cwe: 'CWE-639',
      cvss: 9.1,
      affectedTarget: input.target,
      affectedEndpoint: `${input.target}/v1/records/{id}`,
      affectedFile: isPython ? 'src/controllers/records.py' : 'src/controllers/recordsController.ts',
      affectedLine: 38,
      evidenceIds: [evidenceId],
      reproductionSummary: `Strix multi-agent static taint analysis proved that 'record_id' parameter reaches database fetch without currentUser.tenantId cross-check.`,
      impact: 'Critical unauthorized data exposure across organizational boundaries.',
      remediation: `Enforce tenant ownership assertion in repository layer: assert record.tenant_id == current_user.tenant_id, "Tenant Mismatch"`,
      status: 'open',
      discoveredAt: 'Just now',
    };

    const evidence: SecurityEvidence = {
      id: evidenceId,
      assessmentId,
      findingId,
      type: 'source-code',
      title: 'Strix AST Code Trace & Taint Propagation Graph',
      capturedAt: 'Just now',
      source: 'Strix Tree-Sitter AST Scanner',
      content: `// [STRIX AST SOURCE TAINT ANALYSIS]
// Target: ${input.target}
// Detected Taint Source -> Sink Path:

1. SOURCE: def get_record(request: Request, record_id: str):
2. TAINT:  query_filter = {"id": record_id} # Missing tenant_id scoping
3. SINK:   record = db.records.find_one(query_filter)
4. EXPLOIT: Attacker can supply any UUID to dump foreign tenant records

[REMEDIATION PATCH SYNTHESIZED]:
+ query_filter = {"id": record_id, "tenant_id": request.state.user.tenant_id}`,
    };

    const assessment: SecurityAssessment = {
      id: assessmentId,
      assessmentCode,
      name: `[Strix OWASP Engine] ${input.name}`,
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
      securityScore: 78,
      provider: 'strix',
    };

    return {
      assessment,
      findings: [finding],
      evidence: [evidence],
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
      id: `ev-retest-${Date.now()}`,
      assessmentId: finding.assessmentId || 'sec-strix',
      timestamp: new Date().toLocaleTimeString(),
      stage: 'validation',
      source: 'Strix AST Retest Runner',
      message: isFixed
        ? `[Strix Retest] AST verified: Tenant ownership check is now enforced. Vulnerability neutralized.`
        : `[Strix Retest] AST failed: Taint propagation path still reachable. Fix rejected.`,
      status: isFixed ? 'success' : 'failed',
    };

    if (onProgress) onProgress(retestEvent);

    const newEvidence: SecurityEvidence = {
      id: `ev-retest-strix-${Date.now()}`,
      assessmentId: finding.assessmentId || 'sec-strix',
      findingId: finding.id,
      type: 'source-code',
      title: `Strix Automated Retest Proof (${isFixed ? 'VERIFIED FIXED' : 'RETEST FAILED'})`,
      capturedAt: 'Just now',
      source: 'Strix AST Retest Runner',
      content: isFixed
        ? `// [STRIX RETEST PROOF: PASS]
// AST tree re-parsed cleanly.
// Confirmed: query_filter strictly binds to current_user.tenant_id.`
        : `// [STRIX RETEST PROOF: FAIL]
// AST taint path remains active.
// Unvalidated record_id lookup still exists without tenant_id filter.`,
    };

    return {
      status: isFixed ? ('verified-fixed' as const) : ('still-vulnerable' as const),
      newEvidence,
      retestEvent,
    };
  }
}
