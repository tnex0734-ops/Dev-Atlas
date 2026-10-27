import { SecurityAssessment, SecurityFinding } from '../../types';

export interface DerivedSecurityMetrics {
  totalAssessments: number;
  openFindingsCount: number;
  criticalOpenCount: number;
  highOpenCount: number;
  mediumOpenCount: number;
  validatedCount: number;
  verifiedFixedCount: number;
  acceptedRiskCount: number;
  securityHealthScore: number;
  retestSuccessRate: number;
}

export function calculateSecurityMetrics(
  assessments: SecurityAssessment[],
  findings: SecurityFinding[]
): DerivedSecurityMetrics {
  const totalAssessments = assessments.length;

  const openFindings = findings.filter(
    (f) => f.status !== 'verified-fixed' && f.status !== 'accepted-risk'
  );

  const criticalOpen = openFindings.filter((f) => f.severity === 'critical').length;
  const highOpen = openFindings.filter((f) => f.severity === 'high').length;
  const mediumOpen = openFindings.filter((f) => f.severity === 'medium').length;

  const validatedCount = findings.filter((f) => f.confidence === 'validated').length;
  const verifiedFixedCount = findings.filter((f) => f.status === 'verified-fixed').length;
  const acceptedRiskCount = findings.filter((f) => f.status === 'accepted-risk').length;

  // Transparent calculation for health score 0-100
  let score = 100;
  score -= criticalOpen * 25;
  score -= highOpen * 10;
  score -= mediumOpen * 4;
  score = Math.max(0, Math.min(100, score));

  // Retest success rate
  const totalResolved = verifiedFixedCount + acceptedRiskCount;
  const retestSuccessRate =
    findings.length > 0 ? Math.round((verifiedFixedCount / (totalResolved || 1)) * 100) : 100;

  return {
    totalAssessments,
    openFindingsCount: openFindings.length,
    criticalOpenCount: criticalOpen,
    highOpenCount: highOpen,
    mediumOpenCount: mediumOpen,
    validatedCount,
    verifiedFixedCount,
    acceptedRiskCount,
    securityHealthScore: score,
    retestSuccessRate,
  };
}
