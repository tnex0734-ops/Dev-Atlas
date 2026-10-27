import { SecurityFinding, SecurityGateResult } from '../../types';
import { SecurityGatePolicy } from '../types';

export const defaultSecurityGatePolicy: SecurityGatePolicy = {
  criticalAllowed: 0,
  highAllowed: 0,
  requireAssessment: true,
  requireRetestForFixedCritical: true,
};

export function evaluateSecurityGate(
  findings: SecurityFinding[],
  policy: SecurityGatePolicy = defaultSecurityGatePolicy
): SecurityGateResult {
  const blockers: string[] = [];
  const warnings: string[] = [];

  // Active unmitigated critical findings (status !== verified-fixed && status !== accepted-risk)
  const activeCritical = findings.filter(
    (f) =>
      f.severity === 'critical' &&
      f.status !== 'verified-fixed' &&
      f.status !== 'accepted-risk'
  );

  // Active high findings
  const activeHigh = findings.filter(
    (f) =>
      f.severity === 'high' &&
      f.status !== 'verified-fixed' &&
      f.status !== 'accepted-risk'
  );

  // Findings marked fix-in-progress or ready-for-retest that need retesting
  const pendingRetests = findings.filter(
    (f) =>
      f.severity === 'critical' &&
      (f.status === 'fix-in-progress' || f.status === 'ready-for-retest')
  );

  if (activeCritical.length > policy.criticalAllowed) {
    blockers.push(
      `${activeCritical.length} unmitigated Critical vulnerability blocker(s) active (${activeCritical
        .map((f) => f.findingCode)
        .join(', ')})`
    );
  }

  if (pendingRetests.length > 0 && policy.requireRetestForFixedCritical) {
    blockers.push(
      `${pendingRetests.length} Critical vulnerability fix(es) awaiting automated security retest verification (${pendingRetests
        .map((f) => f.findingCode)
        .join(', ')})`
    );
  }

  if (activeHigh.length > policy.highAllowed) {
    warnings.push(
      `${activeHigh.length} High severity vulnerability(ies) open without formal risk acceptance (${activeHigh
        .map((f) => f.findingCode)
        .join(', ')})`
    );
  }

  const unresolvedValidated = findings.filter(
    (f) => f.confidence === 'validated' && f.status !== 'verified-fixed' && f.status !== 'accepted-risk'
  ).length;

  // Calculate score 0-100
  let score = 100;
  score -= activeCritical.length * 35;
  score -= activeHigh.length * 15;
  score -= pendingRetests.length * 10;
  score = Math.max(0, Math.min(100, score));

  const status: SecurityGateResult['status'] =
    blockers.length > 0 ? 'failed' : warnings.length > 0 ? 'warning' : 'passed';

  return {
    status,
    score,
    blockers,
    warnings,
    criticalCount: activeCritical.length,
    highCount: activeHigh.length,
    unresolvedValidatedCount: unresolvedValidated,
  };
}
