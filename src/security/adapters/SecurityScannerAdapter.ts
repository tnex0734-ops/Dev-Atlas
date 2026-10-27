import {
  SecurityAssessment,
  SecurityFinding,
  SecurityEvidence,
  SecurityScanEvent,
} from '../../types';
import { StartAssessmentInput, SecurityAssessmentResult } from '../types';

export interface SecurityScannerAdapter {
  providerName: 'demo' | 'strix' | 'vulnclaw';
  
  startAssessment(
    input: StartAssessmentInput,
    onProgress?: (event: SecurityScanEvent) => void
  ): Promise<SecurityAssessmentResult>;

  retestFinding(
    finding: SecurityFinding,
    existingEvidence: SecurityEvidence[],
    onProgress?: (event: SecurityScanEvent) => void
  ): Promise<{
    status: 'verified-fixed' | 'still-vulnerable';
    newEvidence: SecurityEvidence;
    retestEvent: SecurityScanEvent;
  }>;
}
