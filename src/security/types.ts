// Security scanner adapter types


import {
  SecurityAssessment,
  SecurityFinding,
  SecurityEvidence,
  SecurityScanEvent,
  SecurityScope,
  SecurityTargetType,
  SecurityScanMode,
} from '../types';

export interface StartAssessmentInput {
  name: string;
  targetType: SecurityTargetType;
  target: string;
  mode: SecurityScanMode;
  provider: 'demo' | 'strix' | 'vulnclaw';
  scope: {
    authorized: boolean;
    allowedTargets: string[];
    excludedTargets: string[];
    notes?: string;
    confirmedBy: string;
  };
  focusAreas?: string[];
  relatedBuildId?: string;
}

export interface RetestFindingInput {
  findingId: string;
  verifiedInBuild?: string;
  notes?: string;
}

export interface SecurityAssessmentResult {
  assessment: SecurityAssessment;
  findings: SecurityFinding[];
  evidence: SecurityEvidence[];
  events: SecurityScanEvent[];
}

export interface SecurityGatePolicy {
  criticalAllowed: number; // default 0
  highAllowed: number; // default 0 without accepted risk
  requireAssessment: boolean;
  requireRetestForFixedCritical: boolean;
}
