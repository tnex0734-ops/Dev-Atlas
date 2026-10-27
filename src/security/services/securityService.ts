import { SecurityScannerAdapter } from '../adapters/SecurityScannerAdapter';
import { DemoSecurityAdapter } from '../adapters/DemoSecurityAdapter';
import { StrixSecurityAdapter } from '../adapters/StrixSecurityAdapter';
import { VulnClawSecurityAdapter } from '../adapters/VulnClawSecurityAdapter';
import { StartAssessmentInput, SecurityAssessmentResult } from '../types';
import {
  SecurityAssessment,
  SecurityFinding,
  SecurityEvidence,
  SecurityScanEvent,
} from '../../types';

export class SecurityService {
  private adapters: Record<'demo' | 'strix' | 'vulnclaw', SecurityScannerAdapter> = {
    demo: new DemoSecurityAdapter(),
    strix: new StrixSecurityAdapter(),
    vulnclaw: new VulnClawSecurityAdapter(),
  };

  getAdapter(provider: 'demo' | 'strix' | 'vulnclaw' = 'demo'): SecurityScannerAdapter {
    return this.adapters[provider] || this.adapters.demo;
  }

  async runAssessment(
    input: StartAssessmentInput,
    onProgress?: (event: SecurityScanEvent) => void
  ): Promise<SecurityAssessmentResult> {
    if (!input.scope.authorized) {
      throw new Error('Security Assessment blocked: Explicit authorization confirmation required.');
    }
    const adapter = this.getAdapter(input.provider);
    return adapter.startAssessment(input, onProgress);
  }

  async retestFinding(
    finding: SecurityFinding,
    existingEvidence: SecurityEvidence[],
    provider: 'demo' | 'strix' | 'vulnclaw' = 'demo',
    onProgress?: (event: SecurityScanEvent) => void
  ) {
    const adapter = this.getAdapter(provider);
    return adapter.retestFinding(finding, existingEvidence, onProgress);
  }
}

export const securityService = new SecurityService();
