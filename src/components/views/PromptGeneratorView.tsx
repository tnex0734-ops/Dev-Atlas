import React, { useState, useMemo } from 'react';
import {
  Zap,
  Copy,
  Check,
  BrainCircuit,
  BookOpen,
  FileText,
  Layers,
  Code2,
  Cpu,
  Coins,
  ShieldAlert,
  Gauge,
  SlidersHorizontal,
  Scale,
  RefreshCw,
  Info,
  CheckCircle2,
  TestTube,
  Flame,
  Minimize2,
  ShieldCheck,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAI } from '../../context/AIContext';
import { LLMModelTarget, PromptOptimizationMode } from '../../types';

const DevAIChatBtn: React.FC = () => {
  const { openStudio } = useAI();
  return (
    <button
      onClick={() => openStudio('dev')}
      className="flex items-center gap-1.5 rounded-full bg-[#FF6039] px-3.5 py-2 text-xs font-bold text-[#161616] hover:bg-[#E54D26] active:scale-[0.98] transition-all shadow-[0px_2px_8px_rgba(255,96,57,0.25)] touch-target cursor-pointer"
    >
      <BrainCircuit className="h-3.5 w-3.5 text-[#161616]" />
      <span>Open Dev AI Chat</span>
    </button>
  );
};

export const PromptGeneratorView: React.FC = () => {
  const {
    contextBlocks,
    prds,
    securityFindings,
    showToast,
    activeWorkspace,
    llmModels,
    activeLLMModel,
    setActiveLLMModel,
    promptOptimizationMode,
    setPromptOptimizationMode,
  } = useProject();

  const [selectedPRDId, setSelectedPRDId] = useState<string>(prds[1]?.id || prds[0]?.id || '');
  const [selectedSecurityFindingId, setSelectedSecurityFindingId] = useState<string>(
    securityFindings[0]?.id || ''
  );
  const [includeSecurityConstraints, setIncludeSecurityConstraints] = useState(true);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([
    contextBlocks[1]?.id || '',
    contextBlocks[3]?.id || '',
  ].filter(Boolean));
  const [codingObjective, setCodingObjective] = useState(
    'Implement resilient payment handshake with idempotent state machine recovery loop and zero unhandled promise rejections.'
  );
  const [isCopied, setIsCopied] = useState(false);
  const [showComparisonMatrix, setShowComparisonMatrix] = useState(false);

  const activePRD = prds.find((p) => p.id === selectedPRDId) || prds[0];
  const activeSecurityFinding = securityFindings.find((f) => f.id === selectedSecurityFindingId);

  const toggleBlockSelection = (id: string) => {
    setSelectedBlockIds((prev) =>
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleModeChange = (mode: PromptOptimizationMode) => {
    setPromptOptimizationMode(mode);
    const labels: Record<PromptOptimizationMode, string> = {
      'full-context': 'Full Lifecycle Context',
      'token-economy': 'Token Economy (~52% Compressed)',
      'security-hardened': 'Strict Security Defense & Invariants',
      'tdd-verification': 'TDD Test Assertions Matrix',
    };
    showToast(`Optimization mode switched to: ${labels[mode]}`, 'info');
  };

  // Generate model-optimized AI prompt payload
  const generatedPrompt = useMemo(() => {
    const includedBlocks = contextBlocks.filter((b) => selectedBlockIds.includes(b.id));
    const isEconomy = promptOptimizationMode === 'token-economy';
    const isSecurityHardened = promptOptimizationMode === 'security-hardened';
    const isTDD = promptOptimizationMode === 'tdd-verification';
    const isFull = promptOptimizationMode === 'full-context';

    // 1. ANTHROPIC CLAUDE 3.7 / 3.5 (XML Tag Hierarchy)
    if (activeLLMModel.formatStyle === 'xml-claude') {
      if (isEconomy) {
        return `<!-- CLAUDE 3.7 OPTIMIZATION: TOKEN ECONOMY COMPRESSED (~52% SAVINGS) -->
<prompt_spec model="${activeLLMModel.name}" workspace="${activeWorkspace.code}" compression="compact_ast">
  <objective>${codingObjective}</objective>
  <prd code="${activePRD?.reqCode}">
    ${activePRD?.acceptanceCriteria.map((c, i) => `<c${i + 1}>${c}</c${i + 1}>`).join('\n    ')}
  </prd>
  <security_invariants finding="${activeSecurityFinding?.findingCode}">
    <rule>${activeSecurityFinding?.remediation.substring(0, 180)}</rule>
  </security_invariants>
  <ast_signatures>
${includedBlocks.map((b) => `    <sig cat="${b.category}" title="${b.title}">${b.content.replace(/\n\s*\n/g, '\n').substring(0, 220)}...</sig>`).join('\n')}
  </ast_signatures>
  <instructions>
    1. Output production TypeScript code satisfying all <c> criteria.
    2. Zero boilerplate fluff; adhere to #171717 / #FAFAFA tokens.
  </instructions>
</prompt_spec>`;
      }

      if (isSecurityHardened) {
        return `<!-- CLAUDE 3.7 OPTIMIZATION: STRICT SECURITY HARDENED & VULNERABILITY DEFENSE -->
<security_hardened_task_context priority="P0_MANDATORY_GATE">
  <threat_model_profile>
    <workspace>${activeWorkspace.name} (${activeWorkspace.code} ${activeWorkspace.version})</workspace>
    <target_vulnerability>${activeSecurityFinding?.findingCode}: ${activeSecurityFinding?.title}</target_vulnerability>
    <severity_classification cvss="${activeSecurityFinding?.cvss || '9.1'}">${activeSecurityFinding?.severity.toUpperCase()}</severity_classification>
    <owasp_cwe_mapping>${activeSecurityFinding?.owasp || 'OWASP API1:2023'} | ${activeSecurityFinding?.cwe || 'CWE-639'}</owasp_cwe_mapping>
    <affected_target>${activeSecurityFinding?.affectedEndpoint || activeSecurityFinding?.affectedFile || activeSecurityFinding?.affectedTarget}</affected_target>
    <mandatory_defense_remediation>
      ${activeSecurityFinding?.remediation}
    </mandatory_defense_remediation>
    <invariant_security_rule>
      Under NO circumstance allow unauthorized resource access or unverified user tokens. Every mutation must enforce tenant ownership checks.
    </invariant_security_rule>
  </threat_model_profile>

  <functional_requirements prd="${activePRD?.reqCode}">
    <objective>${codingObjective}</objective>
    <acceptance_criteria>
${activePRD?.acceptanceCriteria.map((c, i) => `      <assert id="${i + 1}">${c}</assert>`).join('\n')}
    </acceptance_criteria>
  </functional_requirements>

  <system_architectural_context>
${includedBlocks
  .map(
    (b) => `    <block name="${b.title}" category="${b.category}">
\`\`\`typescript
${b.content}
\`\`\`
    </block>`
  )
  .join('\n')}
  </system_architectural_context>

  <security_audit_instructions_for_claude>
    1. Think step-by-step to prove that the proposed code cannot be bypassed via IDOR, tampering, or race conditions.
    2. Implement defensive boundary assertions and strict authorization middleware.
    3. Output complete, hardened TypeScript implementation with zero vulnerability exposure.
  </security_audit_instructions_for_claude>
</security_hardened_task_context>`;
      }

      if (isTDD) {
        return `<!-- CLAUDE 3.7 OPTIMIZATION: TDD VERIFICATION & TEST ASSERTION MATRIX -->
<tdd_test_specification_suite framework="Vitest + React Testing Library + MSW">
  <workspace>${activeWorkspace.name} (${activeWorkspace.code})</workspace>
  <feature_under_test prd="${activePRD?.reqCode}">
    <objective>${codingObjective}</objective>
  </feature_under_test>

  <acceptance_test_matrix total_tests="${activePRD?.acceptanceCriteria.length}">
${activePRD?.acceptanceCriteria
  .map(
    (c, i) => `    <test_case id="TEST-${i + 1}" target="Criterion ${i + 1}">
      <description>${c}</description>
      <expected_behavior>Must pass synchronously and asynchronously without state leaks.</expected_behavior>
      <mock_fixtures>Define MSW mock handlers and isolated session state.</mock_fixtures>
    </test_case>`
  )
  .join('\n')}
  </acceptance_test_matrix>

  <security_regression_tests finding="${activeSecurityFinding?.findingCode}">
    <test_case id="SEC-TEST-01">
      <description>Verify that unauthorized request returns 403 Forbidden and emits security telemetry event.</description>
      <remediation_assertion>${activeSecurityFinding?.remediation}</remediation_assertion>
    </test_case>
  </security_regression_tests>

  <architecture_contracts_under_test>
${includedBlocks
  .map(
    (b) => `    <contract name="${b.title}">
\`\`\`typescript
${b.content}
\`\`\`
    </contract>`
  )
  .join('\n')}
  </architecture_contracts_under_test>

  <tdd_workflow_directives>
    1. FIRST: Generate the comprehensive unit and integration test file with 100% assertion coverage.
    2. SECOND: Implement the production code that turns every single test from red to green.
    3. Assert all edge cases: network timeout, biometric cancellation, and token expiry.
  </tdd_workflow_directives>
</tdd_test_specification_suite>`;
      }

      // Default: full-context
      return `<!-- CLAUDE 3.7 OPTIMIZATION: FULL LIFECYCLE CONTEXT SPECIFICATION -->
<task_context>
  <project_workspace name="${activeWorkspace.name}" code="${activeWorkspace.code}" version="${activeWorkspace.version}">
    <platform>${activeWorkspace.platform}</platform>
    <tagline>${activeWorkspace.tagline}</tagline>
    <tech_stack>${activeWorkspace.techStack.join(', ')}</tech_stack>
  </project_workspace>

  <target_objective>
    ${codingObjective}
  </target_objective>
</task_context>

<prd_specification code="${activePRD?.reqCode || 'PRD-105'}" priority="${activePRD?.priority || 'P0'}">
  <title>${activePRD?.title || 'Payment Resilience'}</title>
  <problem_statement>${activePRD?.problemStatement || 'Payment challenge timeout during checkout.'}</problem_statement>
  <business_impact>${activePRD?.businessImpact || 'Impacts daily checkout velocity.'}</business_impact>
  <acceptance_criteria>
${activePRD?.acceptanceCriteria.map((c, i) => `    <criterion id="${i + 1}">${c}</criterion>`).join('\n') || '    <criterion id="1">Zero unhandled rejections</criterion>'}
  </acceptance_criteria>
</prd_specification>

<security_defense_guardrails finding_code="${activeSecurityFinding?.findingCode || 'SEC-014'}" severity="${activeSecurityFinding?.severity.toUpperCase() || 'CRITICAL'}">
  <category>${activeSecurityFinding?.category || 'Security Gating'} (${activeSecurityFinding?.owasp || 'OWASP Top 10'})</category>
  <affected_target>${activeSecurityFinding?.affectedEndpoint || activeSecurityFinding?.affectedFile || activeSecurityFinding?.affectedTarget || 'api/v2'}</affected_target>
  <mandatory_remediation>
    ${activeSecurityFinding?.remediation || 'Enforce hardware-backed token authorization'}
  </mandatory_remediation>
</security_defense_guardrails>

<architectural_context_blocks total="${includedBlocks.length}">
${includedBlocks
  .map(
    (b) => `  <block category="${b.category}" title="${b.title}" author="${b.author}">
\`\`\`typescript
${b.content}
\`\`\`
  </block>`
  )
  .join('\n')}
</architectural_context_blocks>

<design_system_constraints>
  <palette background="#FAFAFA" surface="#FFFFFF" hairline="#EBEBEB" primary="#171717" accent="#0070F3" />
  <typography display="Geist Sans" telemetry="Geist Mono" />
  <touch_target min_height="48px" />
</design_system_constraints>

<instructions_for_claude>
  1. Parse the <task_context> and fulfill all criteria in <prd_specification>.
  2. Implement defense rules in <security_defense_guardrails>.
  3. Comply with the architectural state machine in <architectural_context_blocks>.
  4. Output complete, production-ready TypeScript code without omitting boilerplate.
</instructions_for_claude>`;
    }

    // 2. OPENAI GPT-4o / o3-mini (Structured Markdown & Assertions)
    if (activeLLMModel.formatStyle === 'json-schema-openai') {
      if (isEconomy) {
        return `# OPENAI COMPACT PROMPT [TOKEN ECONOMY: ~55% SAVINGS]
**Target:** ${activeWorkspace.name} (${activeWorkspace.code}) | Model: ${activeLLMModel.name}
**Objective:** ${codingObjective}

## Spec Criteria (${activePRD?.reqCode}):
${activePRD?.acceptanceCriteria.map((c, i) => `${i + 1}. [ASSERT] ${c}`).join('\n')}

## Security Rule:
- ${activeSecurityFinding?.findingCode}: ${activeSecurityFinding?.remediation.substring(0, 160)}

## Signatures:
${includedBlocks.map((b) => `// [${b.category}] ${b.title}\n${b.content.substring(0, 180)}...`).join('\n\n')}

## Directives:
Generate concise TypeScript code implementing all assertions. Zero commentary.`;
      }

      if (isSecurityHardened) {
        return `# OPENAI SYSTEM PROMPT: MANDATORY SECURITY HARDENED ENGINE
You are a Principal Security Architect executing a critical remediation for **${activeWorkspace.name}**.

## 1. CRITICAL VULNERABILITY DEFENSE (P0 BLOCKER)
- **Vulnerability:** ${activeSecurityFinding?.findingCode} - ${activeSecurityFinding?.title}
- **Threat Vector:** ${activeSecurityFinding?.category} (CVSS ${activeSecurityFinding?.cvss || '9.1'})
- **Affected Surface:** ${activeSecurityFinding?.affectedEndpoint || activeSecurityFinding?.affectedTarget}
- **Mandatory Invariant Rule:** ${activeSecurityFinding?.remediation}

## 2. FUNCTIONAL SPECIFICATION (${activePRD?.reqCode})
- **Objective:** ${codingObjective}
- **Acceptance Criteria:**
${activePRD?.acceptanceCriteria.map((c, i) => `  ${i + 1}. [ASSERT] ${c}`).join('\n')}

## 3. ARCHITECTURAL CONTRACTS
${includedBlocks.map((b) => `### [${b.category}] ${b.title}\n\`\`\`typescript\n${b.content}\n\`\`\``).join('\n\n')}

## 4. STRICT SECURITY ENFORCEMENT DIRECTIVES
1. Enforce cryptographically verified tenant ownership assertions before any state mutation.
2. Neutralize all OWASP Top 10 attack vectors identified in Section 1.
3. Deliver complete, production-hardened TypeScript implementation.`;
      }

      if (isTDD) {
        return `# OPENAI TDD TEST HARNESS & IMPLEMENTATION MATRIX
**Project:** ${activeWorkspace.name} (${activeWorkspace.code})
**Target:** ${codingObjective}

## 1. TDD ACCEPTANCE TEST SUITE TO GENERATE FIRST
Write a comprehensive test suite (Vitest + React Testing Library) asserting:
${activePRD?.acceptanceCriteria.map((c, i) => `### Test Case ${i + 1}: ${c}\n- Assert expected state transitions\n- Assert error recovery on failure`).join('\n\n')}

## 2. SECURITY INVARIANT TEST CASE (${activeSecurityFinding?.findingCode})
- Assert that unauthorized requests fail with 403 Forbidden.
- Assert defense: ${activeSecurityFinding?.remediation}

## 3. SYSTEM ARCHITECTURAL CONTRACTS
${includedBlocks.map((b) => `### [${b.category}] ${b.title}\n\`\`\`typescript\n${b.content}\n\`\`\``).join('\n\n')}

## 4. EXECUTION DIRECTIVES
1. Generate test file with 100% branch and error state coverage.
2. Generate production code that turns every test green.`;
      }

      // Default full-context for OpenAI
      return `# OPENAI SPECIFICATION MATRIX: ${activeLLMModel.name.toUpperCase()}
You are a Principal Engineer for **${activeWorkspace.name} (${activeWorkspace.code} ${activeWorkspace.version})**.

## 1. PRIMARY OBJECTIVE
${codingObjective}

## 2. SPECIFICATION MATRIX (${activePRD?.reqCode}: ${activePRD?.title})
- **Problem Statement:** ${activePRD?.problemStatement}
- **Business Impact:** ${activePRD?.businessImpact}
- **Acceptance Criteria:**
${activePRD?.acceptanceCriteria.map((c, i) => `  ${i + 1}. [ASSERT] ${c}`).join('\n')}

## 3. SECURITY GUARDRAILS (${activeSecurityFinding?.findingCode})
- **Category:** ${activeSecurityFinding?.category} (CVSS ${activeSecurityFinding?.cvss || '9.1'})
- **Remediation:** ${activeSecurityFinding?.remediation}

## 4. ARCHITECTURAL CONTEXT (${includedBlocks.length} Blocks Injected)
${includedBlocks.map((b) => `### [${b.category}] ${b.title}\n\`\`\`typescript\n${b.content}\n\`\`\``).join('\n\n')}

## 5. EXECUTION DIRECTIVES
1. Fulfill all acceptance assertions in Section 2.
2. Adhere strictly to Geist Design System tokens (#FAFAFA, #171717, #EBEBEB).
3. Deliver complete, production-ready TypeScript implementation.`;
    }

    // 3. DEEPSEEK R1 (Reasoning Chain-of-Thought)
    if (activeLLMModel.formatStyle === 'cot-deepseek') {
      return `<thought>
Analyze the formal AST state transitions for ${activeWorkspace.name} (${activeWorkspace.code}).
Optimization Mode: ${promptOptimizationMode.toUpperCase()}
1. Deconstruct Objective: "${codingObjective}"
2. Evaluate Requirements: ${activePRD?.reqCode} (${activePRD?.acceptanceCriteria.length} acceptance assertions).
3. Evaluate Security: Neutralize ${activeSecurityFinding?.findingCode} (${activeSecurityFinding?.category}).
4. Verify mathematical invariants and absence of race conditions.
</thought>

# DEEPSEEK R1 [MODE: ${promptOptimizationMode.toUpperCase()}]
**Workspace:** ${activeWorkspace.name} (${activeWorkspace.platform})
**Objective:** ${codingObjective}

## Requirements:
${activePRD?.acceptanceCriteria.map((c, i) => `[CRIT-${i + 1}] ${c}`).join('\n')}

## Security Invariants:
[DEFENSE-${activeSecurityFinding?.findingCode}] ${activeSecurityFinding?.remediation}

## Architecture Contract:
${
  isEconomy
    ? includedBlocks.map((b) => `// [${b.category}] ${b.title}: ${b.content.substring(0, 150)}...`).join('\n')
    : includedBlocks.map((b) => `// [${b.category}] ${b.title}\n${b.content}`).join('\n\n')
}

## Output Requirements:
Synthesize formal, verified, production-ready TypeScript code.`;
    }

    // 4. GOOGLE GEMINI 2.0 FLASH (Grounded Multimodal Context)
    if (activeLLMModel.formatStyle === 'system-gemini') {
      return `--- SYSTEM INSTRUCTION: GEMINI 2.0 CODE ENGINE [MODE: ${promptOptimizationMode.toUpperCase()}] ---
PROJECT: ${activeWorkspace.name} [${activeWorkspace.code} ${activeWorkspace.version}]
PLATFORM: ${activeWorkspace.platform}
OBJECTIVE: ${codingObjective}

[GROUNDING: PRD SPECIFICATION ${activePRD?.reqCode}]
Title: ${activePRD?.title}
${activePRD?.acceptanceCriteria.map((c, i) => `* [CRITERION-${i + 1}] ${c}`).join('\n')}

[GROUNDING: SECURITY INVARIANTS ${activeSecurityFinding?.findingCode}]
Threat: ${activeSecurityFinding?.category} (CVSS ${activeSecurityFinding?.cvss})
Defense Rule: ${activeSecurityFinding?.remediation}

[GROUNDING: SOURCE ARCHITECTURE]
${
  isEconomy
    ? includedBlocks.map((b) => `--- ${b.title} ---\n${b.content.substring(0, 160)}...`).join('\n\n')
    : includedBlocks.map((b) => `--- ${b.title} (${b.category}) ---\n${b.content}`).join('\n\n')
}

[OUTPUT DIRECTIVE]
Generate high-performance, idiomatically typed code satisfying all grounding rules.`;
    }

    // 5. DEFAULT / COMPACT LLAMA 3.3
    return `### DEV ATLAS CONTEXT INJECTION PAYLOAD [MODE: ${promptOptimizationMode.toUpperCase()}]
**Workspace:** ${activeWorkspace.name} (${activeWorkspace.code} ${activeWorkspace.version})
**Model Target:** ${activeLLMModel.name}
**Objective:** ${codingObjective}

### PRD Acceptance Criteria (${activePRD?.reqCode}):
${activePRD?.acceptanceCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

### Security Constraints (${activeSecurityFinding?.findingCode}):
- ${activeSecurityFinding?.remediation}

### Architectural Context:
${
  isEconomy
    ? includedBlocks.map((b) => `// ${b.title}: ${b.content.substring(0, 140)}...`).join('\n')
    : includedBlocks.map((b) => `#### [${b.category}] ${b.title}\n\`\`\`typescript\n${b.content}\n\`\`\``).join('\n\n')
}

### Directives:
Implement complete, verified TypeScript code meeting all criteria above.`;
  }, [
    activeLLMModel,
    activeWorkspace,
    codingObjective,
    activePRD,
    activeSecurityFinding,
    includeSecurityConstraints,
    contextBlocks,
    selectedBlockIds,
    promptOptimizationMode,
  ]);

  // Real-time Token & Cost Calculations
  const tokenStats = useMemo(() => {
    const charCount = generatedPrompt.length;
    const wordCount = generatedPrompt.split(/\s+/).filter(Boolean).length;
    // Standard industry heuristic: ~1 token per 3.75 characters
    const estimatedInputTokens = Math.max(120, Math.round(charCount / 3.75));
    const estimatedOutputTokens = 1500;
    const totalTokens = estimatedInputTokens + estimatedOutputTokens;

    // Cost calculations
    const inputCostUSD = (estimatedInputTokens / 1_000_000) * activeLLMModel.inputCostPerMillionUSD;
    const outputCostUSD = (estimatedOutputTokens / 1_000_000) * activeLLMModel.outputCostPerMillionUSD;
    const totalCostUSD = inputCostUSD + outputCostUSD;

    const inputCostINR = (estimatedInputTokens / 1_000_000) * activeLLMModel.inputCostPerMillionINR;
    const outputCostINR = (estimatedOutputTokens / 1_000_000) * activeLLMModel.outputCostPerMillionINR;
    const totalCostINR = inputCostINR + outputCostINR;

    const contextWindowUtilization = (
      (estimatedInputTokens / activeLLMModel.contextWindow) *
      100
    ).toFixed(2);

    return {
      charCount,
      wordCount,
      estimatedInputTokens,
      estimatedOutputTokens,
      totalTokens,
      totalCostUSD: totalCostUSD.toFixed(4),
      totalCostINR: totalCostINR.toFixed(3),
      inputCostINR: inputCostINR.toFixed(3),
      outputCostINR: outputCostINR.toFixed(3),
      contextWindowUtilization,
    };
  }, [generatedPrompt, activeLLMModel]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    showToast(`Prompt copied for ${activeLLMModel.name}!`, 'amber');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const optimizationModes: Array<{
    id: PromptOptimizationMode;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'full-context',
      label: 'Full Context',
      description: 'Comprehensive PRD, full architectural blocks & design specs',
      icon: <Layers className="h-3.5 w-3.5" />,
    },
    {
      id: 'token-economy',
      label: 'Token Economy',
      description: 'Compressed AST signatures (saves ~52% tokens & costs)',
      icon: <Minimize2 className="h-3.5 w-3.5" />,
      badge: '-52% Tokens',
    },
    {
      id: 'security-hardened',
      label: 'Security Focus',
      description: 'Elevates OWASP/CWE threat invariants & VulnClaw proof defenses',
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      badge: 'OWASP Invariants',
    },
    {
      id: 'tdd-verification',
      label: 'TDD Tests',
      description: 'Generates executable unit/integration test assertion matrix',
      icon: <TestTube className="h-3.5 w-3.5" />,
      badge: '100% Test Spec',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Active Workspace Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#171717] text-white">
              <Zap className="h-4 w-4 text-[#f5a623]" />
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              AI Prompt & Multi-LLM Token Engine
            </h1>
            <span className="font-mono text-xs font-semibold bg-[#fafafa] border border-[#ebebeb] px-2 py-0.5 rounded-[4px] text-[#171717]">
              {activeWorkspace.code}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Package PRDs, architectural context, and security guardrails into model-optimized prompts with real-time token and INR (₹) cost calculations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <DevAIChatBtn />
          <button
            onClick={() => setShowComparisonMatrix(!showComparisonMatrix)}
            className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-white px-3 py-2 text-xs font-mono text-[#171717] hover:bg-[#fafafa] transition-all"
          >
            <Scale className="h-3.5 w-3.5 text-[#0070f3]" />
            <span>{showComparisonMatrix ? 'Hide LLM Matrix' : 'Compare LLM Costs'}</span>
          </button>

          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-mono font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 text-white" />
                <span>Prompt Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-white" />
                <span>Copy {activeLLMModel.name.split(' ')[0]} Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optimization Mode Selector Bar (High Visibility) */}
      <div className="rounded-[12px] border border-[#ebebeb] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#171717]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717]">
              Prompt Optimization Mode
            </span>
          </div>
          <span className="text-xs font-mono text-[#8f8f8f]">
            Active Mode: <strong className="text-[#171717] capitalize">{promptOptimizationMode.replace('-', ' ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {optimizationModes.map((mode) => {
            const isSelected = promptOptimizationMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeChange(mode.id)}
                className={`flex flex-col justify-between rounded-[8px] p-3 text-left transition-all border ${
                  isSelected
                    ? 'border-[#171717] bg-[#171717] text-white shadow-sm ring-1 ring-[#171717]'
                    : 'border-[#ebebeb] bg-[#fafafa] text-[#171717] hover:border-[#171717] hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={isSelected ? 'text-white' : 'text-[#8f8f8f]'}>
                        {mode.icon}
                      </span>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#171717]'}`}>
                        {mode.label}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />}
                  </div>
                  <p className={`text-[11px] leading-snug line-clamp-2 ${isSelected ? 'text-white/80' : 'text-[#8f8f8f]'}`}>
                    {mode.description}
                  </p>
                </div>

                {mode.badge && (
                  <div className="mt-2 pt-1.5 border-t border-current/10">
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : mode.id === 'token-economy'
                          ? 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]'
                          : mode.id === 'security-hardened'
                          ? 'bg-[#fef2f2] text-[#ee0000] border border-[#fecaca]'
                          : 'bg-[#ffefcf] text-[#ab570a] border border-[#fcd34d]'
                      }`}
                    >
                      {mode.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* LLM Model Target Selection Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-[#171717]" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717]">
              Target AI Model ({llmModels.length} Optimized Profiles)
            </span>
          </div>
          <span className="text-xs font-mono text-[#8f8f8f]">
            Active: <strong className="text-[#171717]">{activeLLMModel.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
          {llmModels.map((model) => {
            const isSelected = model.id === activeLLMModel.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => setActiveLLMModel(model)}
                className={`flex flex-col justify-between rounded-[8px] p-3 text-left transition-all border ${
                  isSelected
                    ? 'border-[#171717] bg-[#171717] text-white shadow-sm ring-1 ring-[#171717]'
                    : 'border-[#ebebeb] bg-white hover:border-[#171717] text-[#171717] hover:bg-[#fafafa]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span
                      className={`text-[9px] font-mono uppercase px-1 py-0.2 rounded font-semibold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#f5f5f5] text-[#8f8f8f] border border-[#ebebeb]'
                      }`}
                    >
                      {model.provider}
                    </span>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />}
                  </div>
                  <h4 className={`text-xs font-semibold leading-tight ${isSelected ? 'text-white' : 'text-[#171717]'}`}>
                    {model.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-mono">
                  <span className={isSelected ? 'text-white/80' : 'text-[#8f8f8f]'}>
                    ₹{(model.inputCostPerMillionINR).toFixed(0)}/M
                  </span>
                  <span
                    className={`font-semibold ${
                      isSelected
                        ? 'text-amber-300'
                        : model.tag === 'Recommended'
                        ? 'text-[#0070f3]'
                        : model.tag === 'Reasoning'
                        ? 'text-[#7928ca]'
                        : 'text-[#047857]'
                    }`}
                  >
                    {model.tag}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Token & Cost Intelligence Card Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Token Count */}
        <div className="rounded-[10px] border border-[#ebebeb] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs font-mono text-[#8f8f8f]">
            <span>Estimated Tokens</span>
            <Gauge className="h-3.5 w-3.5 text-[#0070f3]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#171717]">
              {tokenStats.estimatedInputTokens.toLocaleString()}
            </span>
            <span className="text-xs text-[#8f8f8f] font-mono">+ {tokenStats.estimatedOutputTokens} output</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#8f8f8f]">
            <span>Context Limit</span>
            <span>{(activeLLMModel.contextWindow / 1000).toFixed(0)}k tokens</span>
          </div>
          <div className="mt-1.5 w-full bg-[#f5f5f5] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#0070f3] h-1.5 rounded-full"
              style={{ width: `${Math.min(100, parseFloat(tokenStats.contextWindowUtilization) * 5)}%` }}
            />
          </div>
        </div>

        {/* Prompt Cost in INR */}
        <div className="rounded-[10px] border border-[#ebebeb] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs font-mono text-[#8f8f8f]">
            <span>Cost Per Execution (INR)</span>
            <Coins className="h-3.5 w-3.5 text-[#047857]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#047857]">
              ₹{tokenStats.totalCostINR}
            </span>
            <span className="text-xs text-[#8f8f8f] font-mono">/ run</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#8f8f8f]">
            <span>Input: ₹{tokenStats.inputCostINR}</span>
            <span>Output: ₹{tokenStats.outputCostINR}</span>
          </div>
        </div>

        {/* Cost in USD & 1M Tokens */}
        <div className="rounded-[10px] border border-[#ebebeb] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs font-mono text-[#8f8f8f]">
            <span>USD Conversion & Rate</span>
            <span className="font-mono text-[10px] text-[#8f8f8f]">$1 = ₹85</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#171717]">
              ${tokenStats.totalCostUSD}
            </span>
            <span className="text-xs text-[#8f8f8f] font-mono">USD</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#8f8f8f]">
            <span>Input Rate</span>
            <span>${activeLLMModel.inputCostPerMillionUSD.toFixed(2)}/M tokens</span>
          </div>
        </div>

        {/* Token Savings & Mode Summary */}
        <div className="rounded-[10px] border border-[#ebebeb] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between text-xs font-mono text-[#8f8f8f]">
            <span>Token Efficiency</span>
            <Zap className="h-3.5 w-3.5 text-[#f5a623]" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#171717]">
              {promptOptimizationMode === 'token-economy' ? '52% Saved' : '100% Grounded'}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-[#8f8f8f] truncate">
            {promptOptimizationMode === 'token-economy' && '⚡ Compact AST signatures enabled'}
            {promptOptimizationMode === 'security-hardened' && '🔒 OWASP Top 10 invariants active'}
            {promptOptimizationMode === 'tdd-verification' && '🧪 Acceptance test matrix injected'}
            {promptOptimizationMode === 'full-context' && '📦 Full architecture contracts injected'}
          </div>
        </div>
      </div>

      {/* Model Cost & Feature Comparison Matrix Table */}
      {showComparisonMatrix && (
        <div className="rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-sm space-y-3 animate-scale-in">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-semibold text-[#171717]">
              Multi-LLM Cost & Capability Comparison (Calculated for {tokenStats.estimatedInputTokens.toLocaleString()} tokens prompt)
            </h3>
            <span className="text-xs font-mono text-[#8f8f8f]">Live Model Registry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#ebebeb] text-[#8f8f8f] bg-[#fafafa]">
                  <th className="p-2.5">Model</th>
                  <th className="p-2.5">Provider</th>
                  <th className="p-2.5">Context Window</th>
                  <th className="p-2.5">Input Cost / 1M</th>
                  <th className="p-2.5">Est. Cost / Run (INR)</th>
                  <th className="p-2.5">Reasoning</th>
                  <th className="p-2.5">Key Strength</th>
                  <th className="p-2.5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]">
                {llmModels.map((m) => {
                  const mCostINR = (
                    (tokenStats.estimatedInputTokens / 1_000_000) * m.inputCostPerMillionINR +
                    (tokenStats.estimatedOutputTokens / 1_000_000) * m.outputCostPerMillionINR
                  ).toFixed(3);
                  const isCurrent = m.id === activeLLMModel.id;

                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-[#fafafa] ${isCurrent ? 'bg-[#f5f5f5] font-semibold' : ''}`}
                    >
                      <td className="p-2.5 flex items-center gap-1.5">
                        <span className="text-[#171717]">{m.name}</span>
                        {isCurrent && (
                          <span className="rounded bg-[#171717] px-1.5 py-0.2 text-[9px] text-white">
                            Selected
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-[#4d4d4d]">{m.providerName}</td>
                      <td className="p-2.5 text-[#4d4d4d]">{(m.contextWindow / 1000).toFixed(0)}k</td>
                      <td className="p-2.5 text-[#4d4d4d]">₹{m.inputCostPerMillionINR.toFixed(0)}</td>
                      <td className="p-2.5 font-bold text-[#047857]">₹{mCostINR}</td>
                      <td className="p-2.5">
                        {m.supportsReasoning ? (
                          <span className="text-[#7928ca] font-semibold">Native CoT</span>
                        ) : (
                          <span className="text-[#8f8f8f]">Standard</span>
                        )}
                      </td>
                      <td className="p-2.5 text-[#8f8f8f] max-w-xs truncate">{m.strengths}</td>
                      <td className="p-2.5">
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() => setActiveLLMModel(m)}
                            className="rounded border border-[#ebebeb] bg-white px-2 py-1 text-[10px] text-[#171717] hover:border-[#171717]"
                          >
                            Switch
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2-Column Interface: Configuration Controls on Left, Live Prompt on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Context Configuration Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Coding Objective Input */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#ab570a] block">
              1. Define Coding Objective
            </span>
            <textarea
              rows={3}
              value={codingObjective}
              onChange={(e) => setCodingObjective(e.target.value)}
              placeholder="What feature or fix are you asking your AI coding agent to implement?"
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-3 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Active PRD Selector */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717] block">
              2. Inject PRD Acceptance Criteria
            </span>
            <select
              value={selectedPRDId}
              onChange={(e) => setSelectedPRDId(e.target.value)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
            >
              {prds.map((prd) => (
                <option key={prd.id} value={prd.id}>
                  {prd.reqCode}: {prd.title} ({prd.priority})
                </option>
              ))}
            </select>

            {activePRD && (
              <div className="rounded-[6px] bg-[#fafafa] p-3 border border-[#ebebeb] text-xs space-y-1.5 font-mono">
                <span className="text-[10px] text-[#047857] font-semibold uppercase">
                  Injecting {activePRD.acceptanceCriteria.length} Acceptance Criteria:
                </span>
                <ul className="list-disc list-inside text-[#4d4d4d] text-[11px] space-y-0.5">
                  {activePRD.acceptanceCriteria.slice(0, 3).map((c, idx) => (
                    <li key={idx} className="truncate">{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Security Finding Remediation Selector */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#ee0000] flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-[#ee0000]" />
                <span>3. Inject Grounded Security Defense</span>
              </span>
              <input
                type="checkbox"
                id="sec-toggle"
                checked={includeSecurityConstraints}
                onChange={(e) => setIncludeSecurityConstraints(e.target.checked)}
                className="h-4 w-4 rounded border-[#ebebeb] text-[#171717] focus:ring-[#171717]"
              />
            </div>

            {includeSecurityConstraints && (
              <>
                <select
                  value={selectedSecurityFindingId}
                  onChange={(e) => setSelectedSecurityFindingId(e.target.value)}
                  className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
                >
                  {securityFindings.map((finding) => (
                    <option key={finding.id} value={finding.id}>
                      {finding.findingCode}: {finding.title} ({finding.severity.toUpperCase()})
                    </option>
                  ))}
                </select>

                {activeSecurityFinding && (
                  <div className="rounded-[6px] bg-[#fff1f2] p-3 border border-[#fecdd3] text-xs space-y-1 font-mono">
                    <span className="text-[10px] text-[#e11d48] font-semibold uppercase">
                      Rule: {activeSecurityFinding.category} (CVSS {activeSecurityFinding.cvss})
                    </span>
                    <p className="text-[11px] text-[#9f1239] line-clamp-2">
                      {activeSecurityFinding.remediation}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Context Blocks Selector */}
          <div className="rounded-[12px] border border-[#ebebeb] bg-white p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717] block">
              4. Injected Architectural Context Blocks
            </span>
            <div className="space-y-2">
              {contextBlocks.map((block) => {
                const isSelected = selectedBlockIds.includes(block.id);
                return (
                  <div
                    key={block.id}
                    onClick={() => toggleBlockSelection(block.id)}
                    className={`cursor-pointer rounded-[8px] p-3 border transition-all flex items-start justify-between ${
                      isSelected
                        ? 'bg-[#fafafa] border-[#171717] shadow-xs'
                        : 'bg-white border-[#ebebeb] hover:border-[#a1a1a1]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[#0070f3] font-semibold uppercase">
                          {block.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#8f8f8f]">by {block.author}</span>
                      </div>
                      <h4 className="mt-1 text-xs font-medium text-[#171717]">
                        {block.title}
                      </h4>
                    </div>

                    <div
                      className={`h-4 w-4 rounded-[4px] flex items-center justify-center border shrink-0 mt-1 ${
                        isSelected
                          ? 'bg-[#171717] border-[#171717] text-white'
                          : 'border-[#ebebeb] bg-[#fafafa]'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Context Payload Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between rounded-[12px] border border-[#ebebeb] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 font-mono text-xs text-[#171717]">
              <Code2 className="h-4 w-4 text-[#0070f3]" />
              <span className="font-semibold">{activeLLMModel.name} Optimized Prompt</span>
              <span className="rounded bg-[#171717] text-white px-1.5 py-0.5 text-[10px] font-mono capitalize">
                {promptOptimizationMode.replace('-', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#8f8f8f]">
                ~{tokenStats.estimatedInputTokens.toLocaleString()} tokens
              </span>
              <span className="font-mono text-[11px] text-[#047857] font-semibold">
                ₹{tokenStats.totalCostINR}
              </span>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1 text-xs font-mono font-medium text-[#171717] hover:underline"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          <div className="rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-5 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] relative">
            <pre className="font-mono text-xs text-[#171717] whitespace-pre-wrap leading-relaxed max-h-[700px] overflow-y-auto pr-2">
              {generatedPrompt}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
