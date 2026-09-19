import {
  FeedbackItem,
  ProblemCluster,
  FeatureRequest,
  StrategicInsight,
  ProductRequirement,
  ProductFeature,
  RoadmapEpic,
  ResearchSession,
  UXFinding,
  UserPersona,
  DesignValidationSession,
  DesignToken,
  FigmaFrameSpec,
  DesignReviewThread,
  DevTask,
  SprintFeature,
  SandboxBuild,
  QATestCase,
  BugItem,
  ReleaseReadinessCheck,
  ReleaseItem,
  IncidentItem,
  MaintenanceTask,
  ContextBlock,
  SecondBrainNote,
  FileVaultItem,
  ProjectDecision,
  ProjectMetrics,
  SecurityAssessment,
  SecurityFinding,
  SecurityEvidence,
  SecurityScanEvent,
  ProjectWorkspace,
  LLMModelTarget,
  ProjectMemoryEvent,
} from '../types';

export const initialMetrics: ProjectMetrics = {
  compositeHealth: 94,
  userSentimentScore: 92,
  checkoutReliability: 99.98,
  featureVelocity: 18,
  uxHealthScore: 91,
  qaPassRate: 96,
  productionHealth: 98,
  activeP0Issues: 0,
  openPRDCount: 4,
  unresolvedVisualMismatches: 1,
  unrefinedNotesCount: 2,
  securityHealthScore: 95,
  openVulnerabilitiesCount: 1,
  criticalVulnerabilitiesCount: 0,
};

export const initialWorkspaces: ProjectWorkspace[] = [
  {
    id: 'ws-signals-flagship',
    name: 'Signals Lab Core Platform',
    code: 'SIGN',
    tagline: 'Autonomous lifecycle intelligence and design-to-code verification',
    description: 'Flagship project space verifying full lifecycle engineering workflows from requirements synthesis to OWASP security gates and multi-role views.',
    version: 'v1.4.0',
    platform: 'Web',
    healthScore: 94,
    activeSprint: 'Sprint 14: Automated AST Security & Figma Spec Pinning',
    createdAt: '2026-08-01',
    owner: 'Ashruth (Project Lead)',
    techStack: ['TypeScript', 'React 18', 'Tailwind CSS', 'Vite', 'Firebase Firestore', 'Lucide'],
    themeColor: '#6366f1',
  },
  {
    id: 'ws-strix-sec',
    name: 'Strix Autonomous Penetration Testing',
    code: 'STRX',
    tagline: 'Multi-agent LLM vulnerability scanning and zero-day detection',
    description: 'Autonomous penetration testing workspace that models multi-agent AST analyzers and automated exploit verification proof pipelines.',
    version: 'v2.1.0',
    platform: 'Backend / Cloud',
    healthScore: 91,
    activeSprint: 'Sprint 8: Tree-Sitter AST & OWASP Benchmark Suite',
    createdAt: '2026-08-10',
    owner: 'Security Engineering Team',
    techStack: ['Python', 'FastAPI', 'Docker', 'Tree-Sitter AST', 'PostgreSQL', 'Redis'],
    themeColor: '#ec4899',
  },
];

export const initialFeedback: FeedbackItem[] = [
  {
    id: 'fb-01',
    source: 'GitHub Issues',
    userHandle: '@elena_dev',
    rating: 5,
    comment: 'The side-by-side design validation studio cut our UI review cycles from 3 days to under 30 minutes. Coordinate pinning is a game changer.',
    sentiment: 'positive',
    platform: 'Web',
    appVersion: 'v1.4.0',
    upvotes: 42,
    date: '2026-08-24',
  },
  {
    id: 'fb-02',
    source: 'Discord',
    userHandle: '@marcus_pm',
    rating: 5,
    comment: 'Having Kanban tasks directly bound to PRD requirements ensures developers always have full business context for every pull request.',
    sentiment: 'positive',
    platform: 'Web',
    appVersion: 'v1.4.0',
    upvotes: 38,
    date: '2026-08-22',
  },
  {
    id: 'fb-03',
    source: 'Support Desk',
    userHandle: '@sarah_secops',
    rating: 5,
    comment: 'Automated release blockers based on OWASP Top 10 findings stopped a critical SSRF bypass before reaching staging.',
    sentiment: 'positive',
    platform: 'Backend / Cloud',
    appVersion: 'v1.4.0',
    upvotes: 29,
    date: '2026-08-20',
  },
];

export const initialProblemClusters: ProblemCluster[] = [
  {
    id: 'cluster-01',
    title: 'Design Drift between Figma specs and React production builds',
    aiSummary: 'Designers spend over 8 hours weekly writing manual ticket comments pointing out margin, color token, and typography mismatches in web builds.',
    userCount: 140,
    sentiment: 'negative',
    severity: 'high',
    trend: '+12% this week',
    trendType: 'up',
    platform: 'Web',
    productArea: 'Design Systems',
    firstDetected: '2026-08-01',
    latestOccurrence: 'Today',
    owner: 'Maya Lin',
    status: 'in-dev',
    aiInsight: {
      likelyCause: 'Engineers lack an in-situ visual diff tool against live Figma tokens.',
      recommendedAction: 'Deploy Validation Studio with coordinate-pinned annotations.',
      velocityNote: 'Addresses 45% of visual regression bug tickets.',
    },
  },
  {
    id: 'cluster-02',
    title: 'Context Fragmentation across Jira, GitHub, and Slack',
    aiSummary: 'Engineers switch between 4 different tabs to understand why an architectural decision was made months ago.',
    userCount: 210,
    sentiment: 'negative',
    severity: 'critical',
    trend: '+8% this month',
    trendType: 'up',
    platform: 'Cross-Platform',
    productArea: 'Project Memory',
    firstDetected: '2026-08-05',
    latestOccurrence: 'Yesterday',
    owner: 'Alex Thorne',
    status: 'in-dev',
    aiInsight: {
      likelyCause: 'ADRs and architectural notes are not centralized near code tasks.',
      recommendedAction: 'Centralize Architecture Decision Records into Memory OS.',
      velocityNote: 'Reduces developer onboarding time by 60%.',
    },
  },
];

export const initialFeatureRequests: FeatureRequest[] = [
  {
    id: 'fr-01',
    title: 'Direct Figma REST API Token Synchronizer',
    description: 'Auto-pull Figma variables and design tokens directly into Tailwind CSS theme configurations.',
    requesterCount: 84,
    category: 'Design Systems',
    targetQuarter: 'Q4 2026',
    status: 'Planned',
    originSource: 'Figma Community',
  },
  {
    id: 'fr-02',
    title: 'Bi-directional GitHub Issues Two-Way Webhook Sync',
    description: 'Mirror task state changes from Signals Lab Kanban directly to GitHub repository issues.',
    requesterCount: 112,
    category: 'Integrations',
    targetQuarter: 'Q3 2026',
    status: 'In Progress',
    originSource: 'GitHub Community',
  },
];

export const initialInsights: StrategicInsight[] = [
  {
    id: 'insight-01',
    category: 'Technical Debt',
    headline: 'Local-First Architecture Boosts Daily Active Developer Engagement by 4x',
    description: 'Sub-10ms response times on Kanban operations prevent mental context-switching during sprint standups.',
    impactScore: 92,
    confidence: 96,
    date: '2026-08-15',
    recommendedInitiative: 'Maintain local-first state caching as primary persistence engine.',
  },
  {
    id: 'insight-02',
    category: 'UX Opportunity',
    headline: 'Automated Security Release Gates Reduce Remediation Costs by 80%',
    description: 'Catching AST vulnerabilities prior to staging deployment saves an estimated 14 engineering hours per release candidate.',
    impactScore: 88,
    confidence: 94,
    date: '2026-08-18',
    recommendedInitiative: 'Expand Strix AST scanner rule set for OWASP Top 10.',
  },
];

export const initialPRDs: ProductRequirement[] = [
  {
    id: 'prd-sign-01',
    reqCode: 'PRD-SIGN-101',
    title: 'Real-Time Design Validation Studio & Coordinate Pinning',
    problemStatement: 'Designers and developers lack a unified live environment to verify Figma frame specifications against interactive React components with pixel-level annotation.',
    businessImpact: 'Reduces visual regressions by 85% and eliminates design revision rounds prior to QA signoff.',
    userStories: [
      'As a Product Designer, I need a side-by-side spec comparison so I can visually inspect padding and typography.',
      'As a Frontend Engineer, I want coordinate-pinned notes attached to my Kanban ticket with exact pixel offsets.',
    ],
    acceptanceCriteria: [
      '1. Side-by-side viewport render supporting Desktop (1440px), Tablet (768px), and Mobile (375px).',
      '2. Interactive FSM simulation for Idle, Loading, Success, and Error states.',
      '3. Coordinate-pinned annotations with categorized tag metadata and resolved toggle state.',
    ],
    priority: 'P0',
    targetRelease: 'v1.4.0',
    stage: 'In Development',
    leadPM: 'Ashruth (Product Lead)',
    leadDesigner: 'Maya Lin (Staff UI/UX)',
    leadDev: 'Alex Thorne (Principal Architect)',
    lastUpdated: 'Today',
  },
  {
    id: 'prd-sign-02',
    reqCode: 'PRD-SIGN-102',
    title: 'Automated OWASP Security Release Gate & AST Scanner Adapter',
    problemStatement: 'Production builds risk shipping unmitigated high/critical OWASP vulnerabilities due to manual and infrequent security auditing.',
    businessImpact: 'Prevents security breaches and automates compliance sign-offs for SOC2 and ISO27001.',
    userStories: [
      'As a Security Engineer, I want automated AST inspections to block releases if unmitigated critical findings exist.',
      'As a DevOps Lead, I need real-time composite security score metrics before triggering production deployment.',
    ],
    acceptanceCriteria: [
      '1. Zero unmitigated Critical OWASP vulnerabilities required for gate PASS.',
      '2. Composite security health score must exceed 90/100.',
      '3. Pluggable scanner support for Strix AST and VulnClaw dynamic probes.',
    ],
    priority: 'P0',
    targetRelease: 'v1.4.0',
    stage: 'Ready for QA',
    leadPM: 'Ashruth (Security Lead)',
    leadDesigner: 'Maya Lin (UX Security)',
    leadDev: 'David Vance (SecOps Engineer)',
    lastUpdated: 'Yesterday',
  },
  {
    id: 'prd-sign-03',
    reqCode: 'PRD-SIGN-103',
    title: 'Persistent Project Memory OS & Architecture Decision Log',
    problemStatement: 'Engineering rationale and architectural trade-offs are lost over time, leading to repetitive debates and technical regressions.',
    businessImpact: 'Improves new developer onboarding speed by 60% and preserves immutable decision trails.',
    userStories: [
      'As an engineer joining the team, I need to understand why Local-First state was chosen over pure cloud sync.',
    ],
    acceptanceCriteria: [
      '1. Structured ADR format with Title, Context, Decision, Consequences, and Author.',
      '2. Instant search and filter across memory notes and technical briefs.',
    ],
    priority: 'P1',
    targetRelease: 'v1.4.0',
    stage: 'Shipped',
    leadPM: 'Ashruth',
    leadDesigner: 'Maya Lin',
    leadDev: 'Alex Thorne',
    lastUpdated: '3 days ago',
  },
];

export const initialFeatures: ProductFeature[] = [
  {
    id: 'feat-01',
    featureCode: 'FEAT-SIGN-01',
    name: 'Interactive Design Sandbox',
    category: 'Design Systems',
    stage: 'In Development',
    progress: 85,
    owner: 'Maya Lin',
    targetVersion: 'v1.4.0',
    description: 'Split-screen canvas with live FSM state simulation and coordinate annotations.',
    associatedPRD: 'PRD-SIGN-101',
  },
  {
    id: 'feat-02',
    featureCode: 'FEAT-SIGN-02',
    name: 'OWASP Security Release Gate',
    category: 'Security',
    stage: 'Ready for QA',
    progress: 90,
    owner: 'David Vance',
    targetVersion: 'v1.4.0',
    description: 'Automated static AST analysis and dynamic prober release blocker calculation.',
    associatedPRD: 'PRD-SIGN-102',
  },
  {
    id: 'feat-03',
    featureCode: 'FEAT-SIGN-03',
    name: 'GitHub REST Repo Ingestion',
    category: 'Ingestion',
    stage: 'Shipped',
    progress: 100,
    owner: 'Alex Thorne',
    targetVersion: 'v1.3.0',
    description: 'Instant repository parsing for tech stack detection, language byte charts, and auto-PRDs.',
    associatedPRD: 'PRD-SIGN-103',
  },
];

export const initialRoadmap: RoadmapEpic[] = [
  {
    id: 'epic-01',
    title: 'Q3 2026: Core Intelligence & Design-to-Code Pipeline',
    quarter: 'Q3 2026',
    status: 'On Track',
    priority: 'P0',
    owner: 'Ashruth',
    summary: 'Rollout Validation Studio, GitHub Ingestion, and Firebase Sync.',
    deliverables: ['Validation Studio v1.4', 'GitHub Parser v1.2', 'Firestore WebSockets'],
    completionPercent: 82,
  },
  {
    id: 'epic-02',
    title: 'Q4 2026: Multi-Agent Autonomous Security Benchmark Suite',
    quarter: 'Q4 2026',
    status: 'Upcoming',
    priority: 'P1',
    owner: 'David Vance',
    summary: 'Strix AST Multi-Agent Scanner integration and automated pull request comments.',
    deliverables: ['Strix AST Engine', 'VulnClaw Prober Benchmark', 'Zero-Day Gating'],
    completionPercent: 35,
  },
];

export const initialResearchSessions: ResearchSession[] = [
  {
    id: 'res-01',
    sessionCode: 'RES-01',
    participantHandle: '@maya_designer',
    type: 'Moderated Usability',
    date: '2026-08-12',
    durationMinutes: 45,
    personaTarget: 'Product Designer',
    keyTakeaway: 'Engineers strongly prefer coordinate-based annotations placed directly on the live UI over generic text tickets.',
    quotes: [
      'Being able to click on the exact button and leave a pin saves 10 minutes of screenshotting and red-lining.',
    ],
    tags: ['Validation Studio', 'Annotations', 'Figma'],
  },
];

export const initialUXFindings: UXFinding[] = [
  {
    id: 'uxf-01',
    findingCode: 'UXF-01',
    title: 'Command Palette (⌘K) reduces navigation time by 75%',
    severity: 'High Friction',
    affectedFlow: 'Global Navigation',
    evidenceQuote: 'Power users rely exclusively on keyboard shortcuts to jump between PRDs, tasks, and memory records.',
    participantCount: 16,
    recommendedFix: 'Keep universal ⌘K shortcut registered at top-level window listener.',
    linkedPRD: 'PRD-SIGN-101',
  },
];

export const initialPersonas: UserPersona[] = [
  {
    id: 'per-01',
    name: 'Alex Thorne',
    tagline: 'Principal Software Architect seeking zero context loss',
    prevalencePercentage: 45,
    avatarIcon: 'code',
    primaryFrustrations: ['Context loss across disparate tools', 'Unverified visual changes shipped to production'],
    triggerScenarios: ['Evaluating architectural decisions', 'Reviewing critical security gates'],
    designTreatments: ['Fast keyboard shortcuts', 'Deep terminal and code diff integration'],
  },
  {
    id: 'per-02',
    name: 'Maya Lin',
    tagline: 'Staff Product Designer enforcing pixel perfection',
    prevalencePercentage: 35,
    avatarIcon: 'figma',
    primaryFrustrations: ['Manually taking screenshots to point out spacing and token discrepancies'],
    triggerScenarios: ['Conducting design sign-offs before QA release'],
    designTreatments: ['Side-by-side Figma spec comparison', 'Live interactive FSM state previews'],
  },
];

export const initialValidationSessions: DesignValidationSession[] = [
  {
    id: 'val-01',
    featureId: 'feat-01',
    featureTitle: 'Checkout Modal Verification',
    screenName: 'Payment & Authentication Screen',
    version: 'v1.4.0',
    figmaUrl: 'https://figma.com/@signalslab/checkout-spec',
    liveBuildComponentKey: 'checkout-v2',
    status: 'Ready for Design Review',
    designer: 'Maya Lin',
    leadDev: 'Alex Thorne',
    mismatchCount: 1,
    annotations: [
      {
        id: 'ann-01',
        xPercent: 48,
        yPercent: 62,
        author: 'Maya Lin',
        authorRole: 'Designer',
        text: 'CTA Button Padding Mismatch: Spec calls for py-3.5 px-6, current build uses py-2 px-4.',
        type: 'spacing',
        resolved: false,
        timestamp: 'Today at 2:15 PM',
      },
    ],
    history: [
      {
        date: '2026-08-29',
        action: 'Annotation Added',
        author: 'Maya Lin',
        role: 'Designer',
        comment: 'Flagged button padding discrepancy on desktop viewport.',
      },
    ],
  },
];

export const initialDesignTokens: DesignToken[] = [
  {
    id: 'tok-01',
    name: 'Brand Primary',
    tokenKey: 'color.brand.primary',
    category: 'Color',
    value: '#6366f1',
    cssVariable: '--color-brand-primary',
    usageDescription: 'Main brand accent used for primary CTAs and active tab states.',
    previewColor: '#6366f1',
  },
  {
    id: 'tok-02',
    name: 'Sans Serif Heading',
    tokenKey: 'typography.family.sans',
    category: 'Typography',
    value: 'Plus Jakarta Sans',
    cssVariable: '--font-sans',
    usageDescription: 'Primary UI and header typography font family.',
  },
  {
    id: 'tok-03',
    name: 'Card Border Radius',
    tokenKey: 'radius.card.lg',
    category: 'Border Radius',
    value: '16px',
    cssVariable: '--radius-card-lg',
    usageDescription: 'Standard border radius for glassmorphism modal panels and cards.',
  },
  {
    id: 'tok-04',
    name: 'Glass Panel Elevation',
    tokenKey: 'elevation.glass.shadow',
    category: 'Elevation',
    value: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    cssVariable: '--shadow-glass-panel',
    usageDescription: 'Drop shadow for floating modals and command palette.',
  },
];

export const initialFigmaSpecs: FigmaFrameSpec[] = [
  {
    id: 'fig-01',
    frameName: 'Checkout Modal — Desktop Final',
    componentName: 'CheckoutModal.tsx',
    nodeId: '104:892',
    lastSynced: 'Today at 2:30 PM',
    specs: {
      dimensions: '560px x 680px',
      padding: '24px',
      radius: '16px',
      typographyToken: 'Plus Jakarta Sans 16px/24px',
      colorToken: '#6366f1 (Brand Primary)',
    },
    devNotes: 'Requires smooth ease-in-out transition between Credit Card and Stripe tabs.',
  },
];

export const initialDesignReviews: DesignReviewThread[] = [
  {
    id: 'rev-01',
    title: 'Checkout Button Hover Contrast',
    component: 'CheckoutModal.tsx',
    author: 'Maya Lin',
    status: 'Open',
    commentsCount: 2,
    lastActivity: '2 hours ago',
    comments: [
      {
        id: 'c-01',
        author: 'Maya Lin',
        role: 'Staff Designer',
        time: '2 hours ago',
        text: 'Ensure the hover background transitions smoothly from #6366f1 to #4f46e5 with 150ms ease-in-out.',
      },
      {
        id: 'c-02',
        author: 'Alex Thorne',
        role: 'Principal Architect',
        time: '1 hour ago',
        text: 'Applied in commit e46592c. Ready for re-verification in Validation Studio.',
      },
    ],
  },
];

export const initialDevTasks: DevTask[] = [
  {
    id: 'dev-sign-01',
    taskCode: 'DEV-SIGN-001',
    title: '[ARCHITECTURE] Connect LocalStorage Cache to Cloud Firestore WebSockets',
    requirementId: 'prd-sign-01',
    requirementTitle: 'Real-Time Design Validation Studio & Coordinate Pinning',
    status: 'done',
    priority: 'P0',
    assignee: {
      name: 'Alex Thorne',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      role: 'Principal Architect',
    },
    contextSummary: 'Ensure state mutations write locally within 0ms and broadcast via Firestore listeners.',
    techStackTags: ['TypeScript', 'Firebase', 'State Engine'],
    branch: 'main/local-first-engine',
  },
  {
    id: 'dev-sign-02',
    taskCode: 'DEV-SIGN-002',
    title: '[UI/UX] Implement Coordinate-Pinned Annotation Engine in Validation Studio',
    requirementId: 'prd-sign-01',
    requirementTitle: 'Real-Time Design Validation Studio & Coordinate Pinning',
    status: 'in-progress',
    priority: 'P0',
    assignee: {
      name: 'Maya Lin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
      role: 'Staff UI Engineer',
    },
    contextSummary: 'Support click-to-pin coordinate recording with tag metadata and resolve status toggles.',
    techStackTags: ['React 18', 'Canvas', 'Tailwind CSS'],
    branch: 'feat/validation-pin-coordinates',
  },
  {
    id: 'dev-sign-03',
    taskCode: 'DEV-SIGN-003',
    title: '[SECURITY] Enforce Zero Critical Vulnerability Gate Evaluation',
    requirementId: 'prd-sign-02',
    requirementTitle: 'Automated OWASP Security Release Gate & AST Scanner Adapter',
    status: 'review',
    priority: 'P0',
    assignee: {
      name: 'David Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      role: 'Security Engineer',
    },
    contextSummary: 'Calculate composite health score and flip release status to BLOCKED if OWASP critical issues remain.',
    techStackTags: ['Security', 'OWASP', 'TypeScript'],
    branch: 'fix/security-gate-calculator',
  },
  {
    id: 'dev-sign-04',
    taskCode: 'DEV-SIGN-004',
    title: '[INGESTION] Support GitHub REST API Language Byte Distribution Extraction',
    requirementId: 'prd-sign-03',
    requirementTitle: 'Persistent Project Memory OS & Architecture Decision Log',
    status: 'todo',
    priority: 'P1',
    assignee: {
      name: 'Ashruth',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      role: 'Project Maintainer',
    },
    contextSummary: 'Parse GitHub repo language byte ratios to display interactive distribution bars.',
    techStackTags: ['GitHub API', 'TypeScript', 'REST'],
    branch: 'feat/github-byte-parser',
  },
];

export const initialSprintFeatures: SprintFeature[] = [
  {
    id: 'sf-01',
    branchName: 'feat/validation-pin-coordinates',
    prNumber: 42,
    title: 'Validation Studio Coordinate Pinning & Discrepancy Tags',
    prStatus: 'Open',
    author: 'Maya Lin',
    commitCount: 6,
    progressPercent: 85,
    linkedDevTasks: ['DEV-SIGN-002'],
  },
  {
    id: 'sf-02',
    branchName: 'fix/security-gate-calculator',
    prNumber: 43,
    title: 'OWASP Top 10 Release Gating & AST Threshold Engine',
    prStatus: 'Open',
    author: 'David Vance',
    commitCount: 4,
    progressPercent: 90,
    linkedDevTasks: ['DEV-SIGN-003'],
  },
];

export const initialSandboxBuilds: SandboxBuild[] = [
  {
    id: 'sb-01',
    buildNumber: 'BUILD-1402',
    commitHash: 'e46592c',
    branch: 'main',
    trigger: 'Automated CI Push',
    timestamp: 'Today at 11:45 AM',
    duration: '42s',
    status: 'Success',
    sandboxUrl: 'http://localhost:5173/',
    sizeKb: 384,
  },
];

export const initialQATestCases: QATestCase[] = [
  {
    id: 'qa-01',
    testCode: 'QA-TC-001',
    title: 'Workspace Switching Isolation & Data Partitioning',
    requirementCode: 'PRD-SIGN-101',
    acceptanceCriteriaIndex: 0,
    type: 'Automated E2E',
    status: 'Passed',
    lastRun: 'Today at 11:50 AM',
    durationMs: 340,
    assignedQA: 'QA Automation Lead',
  },
  {
    id: 'qa-02',
    testCode: 'QA-TC-002',
    title: 'Coordinate Pin Placement on 1440px and 375px Viewports',
    requirementCode: 'PRD-SIGN-101',
    acceptanceCriteriaIndex: 1,
    type: 'Automated E2E',
    status: 'Passed',
    lastRun: 'Today at 11:51 AM',
    durationMs: 512,
    assignedQA: 'QA Automation Lead',
  },
  {
    id: 'qa-03',
    testCode: 'QA-TC-003',
    title: 'Security Gate flips to BLOCKED when Critical vulnerability is injected',
    requirementCode: 'PRD-SIGN-102',
    acceptanceCriteriaIndex: 0,
    type: 'Integration Unit',
    status: 'Passed',
    lastRun: 'Today at 11:52 AM',
    durationMs: 180,
    assignedQA: 'Staff QA Engineer',
  },
  {
    id: 'qa-04',
    testCode: 'QA-TC-004',
    title: 'Offline LocalStorage Cache persists across browser refreshes',
    requirementCode: 'PRD-SIGN-103',
    acceptanceCriteriaIndex: 0,
    type: 'Automated E2E',
    status: 'Passed',
    lastRun: 'Today at 11:53 AM',
    durationMs: 240,
    assignedQA: 'Staff QA Engineer',
  },
];

export const initialBugItems: BugItem[] = [
  {
    id: 'bug-01',
    bugCode: 'BUG-SIGN-01',
    title: 'Figma frame preview aspect ratio scales slightly on mobile viewports',
    severity: 'Medium P2',
    status: 'Triaged',
    originVersion: 'v1.4.0',
    relatedFeature: 'Validation Studio',
    isFigmaMismatch: true,
    reporter: 'Maya Lin',
    assignee: 'Alex Thorne',
    detectedAt: 'Yesterday',
  },
];

export const initialReadinessChecks: ReleaseReadinessCheck[] = [
  { id: 'rc-01', category: 'Product', criterion: 'All P0 PRD Acceptance Criteria Satisfied', isMet: true, scoreWeight: 25, details: 'Verified across PRD-SIGN-101 & 102.' },
  { id: 'rc-02', category: 'Security', criterion: 'Zero Unmitigated Critical OWASP Vulnerabilities', isMet: true, scoreWeight: 30, details: 'Security Gate evaluated with PASS status.' },
  { id: 'rc-03', category: 'Design', criterion: 'Design Validation Studio Signoff Completed', isMet: true, scoreWeight: 20, details: 'Zero blocking visual mismatches remaining.' },
  { id: 'rc-04', category: 'QA', criterion: '100% Automated QA Test Suite Passes in CI', isMet: true, scoreWeight: 15, details: 'All 4 automated suites green.' },
  { id: 'rc-05', category: 'DevOps', criterion: 'Database Migration Scripts Verified on Staging', isMet: true, scoreWeight: 10, details: 'Firestore security rules active.' },
];

export const initialReleases: ReleaseItem[] = [
  {
    id: 'rel-01',
    version: 'v1.4.0',
    releaseName: 'Signals Lab 1.4: Design Validation Studio & Security Gating',
    deployedAt: '2026-08-29',
    status: 'Production Live',
    preReleaseSentiment: 78,
    postReleaseSentiment: 92,
    sentimentDelta: 14.0,
    resolvedClustersCount: 2,
    notes: ['Interactive Figma Spec vs Live Sandbox', 'Pluggable Strix & VulnClaw Security Adapters', 'Instant GitHub Repo Ingestion Engine'],
  },
  {
    id: 'rel-02',
    version: 'v1.3.0',
    releaseName: 'Signals Lab 1.3: Multi-Workspace Isolation & Local-First Engine',
    deployedAt: '2026-08-15',
    status: 'Production Live',
    preReleaseSentiment: 72,
    postReleaseSentiment: 84,
    sentimentDelta: 12.0,
    resolvedClustersCount: 3,
    notes: ['HTML5 LocalStorage Caching with 0ms Latency', 'Command Palette (⌘K) Universal Search'],
  },
];

export const initialIncidents: IncidentItem[] = [];
export const initialMaintenance: MaintenanceTask[] = [
  {
    id: 'maint-01',
    title: 'Upgrade Vite and Tailwind CSS build dependencies',
    category: 'Security',
    status: 'Scheduled',
    nextRun: 'Next Sprint',
    estimatedDuration: '30m',
    responsibleEngineer: 'DevOps Lead',
  },
];

export const initialContextBlocks: ContextBlock[] = [
  {
    id: 'ctx-01',
    category: 'Architecture',
    title: 'Why We Chose a Local-First State Machine for Signals Lab',
    author: 'Alex Thorne (Principal Architect)',
    lastUpdated: 'Today',
    content: 'Developers require instantaneous response times during high-frequency workflows like moving tasks or dropping design pins. Writing state to localStorage synchronously eliminates network spinners and makes the platform fully offline-capable.',
    tags: ['Architecture', 'Performance', 'Local-First'],
  },
  {
    id: 'ctx-02',
    category: 'Security & Token Policy',
    title: 'OWASP Release Gate Blocker Policy',
    author: 'David Vance (Security Engineer)',
    lastUpdated: 'Yesterday',
    content: 'Our release policy requires zero unmitigated Critical or High severity findings. If a vulnerability is accepted with signed executive justification, an expiration date must be recorded in the audit log.',
    tags: ['Security', 'OWASP', 'Compliance'],
  },
];

export const initialSecondBrainNotes: SecondBrainNote[] = [
  {
    id: 'note-01',
    title: 'Key Learnings: Figma REST API vs Static Frame Specs',
    rawContent: 'Rendering live iframe specs alongside interactive React sandboxes provides a clearer diffing experience than static PNG screenshots.',
    updatedAt: '2 days ago',
    isRefined: true,
    tags: ['Figma', 'Validation Studio'],
    refinedContent: {
      summary: 'Side-by-side interactive comparison eliminates design debt.',
      keyPoints: ['Use iframe live previews', 'Attach coordinate pins', 'Record FSM state changes'],
      technicalTakeaways: ['HTML5 Canvas overlay provides sub-pixel accuracy'],
      actionItems: ['Connect direct Figma OAuth token sync'],
    },
  },
  {
    id: 'note-02',
    title: 'AST Tree-Sitter Traversal Patterns for Vulnerability Detection',
    rawContent: 'Static AST scanning detects unsafe SQL concatenation and unverified eval calls before code ever leaves developer workstations.',
    updatedAt: '4 days ago',
    isRefined: true,
    tags: ['Security', 'AST', 'Tree-Sitter'],
    refinedContent: {
      summary: 'AST patterns detect injection flaws prior to build completion.',
      keyPoints: ['Traverse call expressions', 'Inspect string template interpolation'],
      technicalTakeaways: ['Sub-100ms parse time on full repos'],
      actionItems: ['Integrate into pre-commit git hooks'],
    },
  },
];

export const initialFileVault: FileVaultItem[] = [
  {
    id: 'file-01',
    fileName: 'Signals_Lab_System_Architecture.pdf',
    sizeBytes: 2450000,
    fileType: 'Architecture Diagram',
    uploadedBy: 'Ashruth',
    uploadedAt: 'Today',
    associatedFeature: 'Signals Lab Core',
    downloadUrl: '#',
  },
  {
    id: 'file-02',
    fileName: 'Figma_Tokens_Export_v1.4.json',
    sizeBytes: 142000,
    fileType: 'Brand Tokens',
    uploadedBy: 'Maya Lin',
    uploadedAt: 'Yesterday',
    associatedFeature: 'Design Tokens',
    downloadUrl: '#',
  },
];

export const initialDecisions: ProjectDecision[] = [
  {
    id: 'dec-01',
    decisionCode: 'ADR-001',
    title: 'Adopt React 18 and Tailwind CSS for Zero-Lag Design Systems',
    category: 'Architecture',
    context: 'We needed a highly responsive, modern frontend architecture with atomic styling to support dark mode glassmorphism and real-time state visualization.',
    decisionMade: 'Standardized on React 18 with functional components, Tailwind CSS utility tokens, and Lucide vector icons.',
    consequences: 'Sub-second compile times with Vite, zero stylesheet bloat, and consistent UI component primitives across all views.',
    stakeholders: ['Alex Thorne', 'Maya Lin', 'Ashruth'],
    date: '2026-08-01',
  },
  {
    id: 'dec-02',
    decisionCode: 'ADR-002',
    title: 'Dual Persistence Strategy (LocalStorage + Cloud Firestore)',
    category: 'Architecture',
    context: 'Balancing offline developer speed with team real-time collaboration.',
    decisionMade: 'Mutations update React memory and localStorage synchronously, while firestoreService listens to real-time snapshot events asynchronously.',
    consequences: 'Zero latency for local interactions; automatic conflict-free real-time sync when connected to the internet.',
    stakeholders: ['Alex Thorne', 'David Vance'],
    date: '2026-08-05',
  },
];

export const initialSecurityAssessments: SecurityAssessment[] = [
  {
    id: 'sec-assess-01',
    assessmentCode: 'SEC-ASSESS-01',
    name: 'Signals Lab Core Release Candidate Scan',
    targetType: 'repository',
    target: 'https://github.com/Ashruth14/Signal_lab',
    mode: 'standard',
    status: 'completed',
    scope: {
      assessmentId: 'sec-assess-01',
      authorized: true,
      allowedTargets: ['https://github.com/Ashruth14/Signal_lab'],
      excludedTargets: [],
      confirmedBy: 'Ashruth',
      confirmedAt: '2026-08-29',
    },
    startedAt: 'Today at 10:30 AM',
    completedAt: 'Today at 10:31 AM',
    initiatedBy: 'David Vance (SecOps)',
    findingsCount: 1,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 1,
    lowCount: 0,
    validatedCount: 1,
    securityScore: 95,
    provider: 'strix',
  },
];

export const initialSecurityFindings: SecurityFinding[] = [
  {
    id: 'sec-find-01',
    findingCode: 'SEC-SIGN-01',
    assessmentId: 'sec-assess-01',
    title: 'Missing Content-Security-Policy (CSP) Directives on Static Assets',
    description: 'Ensure CSP meta tag restricts script-src and object-src to prevent potential cross-site injection.',
    severity: 'medium',
    confidence: 'validated',
    category: 'OWASP A05:2021 Security Misconfiguration',
    cwe: 'CWE-1021',
    owasp: 'A05:2021',
    cvss: 4.8,
    affectedTarget: 'index.html',
    affectedFile: 'index.html',
    affectedLine: 12,
    evidenceIds: ['sec-ev-01'],
    impact: 'Low risk of unverified script injection if third-party CDN assets are manipulated.',
    remediation: 'Add strict default-src self and script-src self policies to web headers.',
    status: 'open',
    discoveredAt: 'Today at 10:30 AM',
  },
];

export const initialSecurityEvidence: SecurityEvidence[] = [
  {
    id: 'sec-ev-01',
    assessmentId: 'sec-assess-01',
    findingId: 'sec-find-01',
    type: 'http-response',
    title: 'HTTP Header Security Response Audit',
    source: 'VulnClaw HTTP Prober',
    content: 'HTTP/1.1 200 OK\nX-Frame-Options: SAMEORIGIN\nX-Content-Type-Options: nosniff\nContent-Security-Policy: [WARNING: MISSING STRICT SCRIPT-SRC DIRECTIVE]',
    capturedAt: 'Today at 10:30 AM',
  },
];

export const initialSecurityScanEvents: SecurityScanEvent[] = [
  {
    id: 'scan-01',
    assessmentId: 'sec-assess-01',
    timestamp: 'Today at 10:30 AM',
    stage: 'analysis',
    source: 'Strix AST Scanner',
    message: 'Full AST Static Analysis & Security Gate Passed with 95/100 composite safety score.',
    status: 'success',
  },
];

export const initialLLMModels: LLMModelTarget[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet (Thinking)',
    provider: 'anthropic',
    providerName: 'Anthropic',
    contextWindow: 200000,
    inputCostPerMillionUSD: 3.00,
    outputCostPerMillionUSD: 15.00,
    inputCostPerMillionINR: 255.00,
    outputCostPerMillionINR: 1275.00,
    supportsReasoning: true,
    strengths: 'Hybrid reasoning with native extended thinking, complex architectural refactoring, and strict XML adherence.',
    tag: 'Recommended',
    formatStyle: 'xml-claude',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    providerName: 'Anthropic',
    contextWindow: 200000,
    inputCostPerMillionUSD: 3.00,
    outputCostPerMillionUSD: 15.00,
    inputCostPerMillionINR: 255.00,
    outputCostPerMillionINR: 1275.00,
    supportsReasoning: false,
    strengths: 'Industry-leading frontend UI precision, artifact generation, and zero-hallucination code generation.',
    tag: 'Zero Hallucination',
    formatStyle: 'xml-claude',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'openai',
    providerName: 'OpenAI',
    contextWindow: 128000,
    inputCostPerMillionUSD: 2.50,
    outputCostPerMillionUSD: 10.00,
    inputCostPerMillionINR: 212.50,
    outputCostPerMillionINR: 850.00,
    supportsReasoning: false,
    strengths: 'Balanced multimodal intelligence, JSON schema enforcement, and rapid response latency.',
    tag: 'High Speed',
    formatStyle: 'json-schema-openai',
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    provider: 'openai',
    providerName: 'OpenAI',
    contextWindow: 200000,
    inputCostPerMillionUSD: 1.10,
    outputCostPerMillionUSD: 4.40,
    inputCostPerMillionINR: 93.50,
    outputCostPerMillionINR: 374.00,
    supportsReasoning: true,
    strengths: 'High-speed reasoning specialized for STEM, complex algorithmic invariants, and unit test suites.',
    tag: 'Reasoning',
    formatStyle: 'json-schema-openai',
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    providerName: 'Google DeepMind',
    contextWindow: 1000000,
    inputCostPerMillionUSD: 0.10,
    outputCostPerMillionUSD: 0.40,
    inputCostPerMillionINR: 8.50,
    outputCostPerMillionINR: 34.00,
    supportsReasoning: false,
    strengths: '1 Million token context window, ultra-low cost, and blazing fast latency for massive codebase ingestion.',
    tag: 'High Speed',
    formatStyle: 'system-gemini',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning)',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    contextWindow: 64000,
    inputCostPerMillionUSD: 0.55,
    outputCostPerMillionUSD: 2.19,
    inputCostPerMillionINR: 46.75,
    outputCostPerMillionINR: 186.15,
    supportsReasoning: true,
    strengths: 'Open-weight deep reasoning, transparent mathematical verification, and rigorous AST logic checks.',
    tag: 'Reasoning',
    formatStyle: 'cot-deepseek',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B Instruct',
    provider: 'meta',
    providerName: 'Meta AI',
    contextWindow: 128000,
    inputCostPerMillionUSD: 0.35,
    outputCostPerMillionUSD: 0.40,
    inputCostPerMillionINR: 29.75,
    outputCostPerMillionINR: 34.00,
    supportsReasoning: false,
    strengths: 'High performance open-source enterprise model, lightweight tokens, and deterministic formatting.',
    tag: 'Open Source',
    formatStyle: 'compact-llama',
  },
];

// ==========================================
// 11. Cross-Role Project Memory & Change Rationale Seed Data
// ==========================================

export const initialMemoryEvents: ProjectMemoryEvent[] = [
  // STORY A: Checkout Android 14 Lifecycle Chain
  {
    id: 'mem-chk-01',
    eventType: 'created',
    state: 'active',
    title: 'PRD-105 Native Payment Sheet & Biometric Fallback Created',
    summary: 'Synthesized from Android 14 payment freeze cluster into dedicated requirement specification.',
    entityType: 'prd',
    entityId: 'prd-105',
    entityLabel: 'PRD-105: Native Payment Sheet & Biometric Fallback',
    fieldChanges: [
      { field: 'stage', label: 'Requirement Stage', before: 'Triage', after: 'In Design' },
      { field: 'priority', label: 'Priority', before: 'P2', after: 'P0' },
    ],
    whyChanged: 'User feedback spiked following Android 14 release; 142 reports of freeze during checkout payment sheet modal.',
    decision: 'Prioritize native Android Credential Manager integration with automatic biometrics fallback to eliminate Webview crash.',
    alternativesConsidered: [
      'Hotpatching legacy WebView bridge (rejected: unstable across Samsung OneUI devices)',
      'Downgrading targetSdk to 33 (rejected: violates Play Store policy)',
    ],
    evidence: ['Feedback Stream fb-02', 'Problem Cluster pc-01 (142 reports)', 'Google Play Console Vitals'],
    expectedImpact: 'Eliminate 100% of Android 14 payment crashes and improve checkout completion above 74%.',
    observedImpact: [
      { metric: 'Checkout Crash Rate', before: 3.8, after: 0.1, delta: -3.7, unit: '%', direction: 'positive', measurementWindow: '14 days post-v4.2.1', source: 'Play Vitals' },
      { metric: 'Mobile Checkout Completion', before: 71.4, after: 74.9, delta: 3.5, unit: '%', direction: 'positive', measurementWindow: '14 days post-v4.2.1', source: 'Mixpanel Funnel' }
    ],
    impactSummary: 'Observed: checkout completion +3.5pp and crash rate reduced by 97%.',
    author: 'Elena Rostova',
    role: 'pm',
    occurredAt: '2026-08-25',
    links: [
      { entityType: 'feedback', entityId: 'fb-02', label: 'Feedback: @alex_k Android 14 freeze', targetSection: 'feedback' },
      { entityType: 'cluster', entityId: 'pc-01', label: 'Cluster: Android 14 Checkout Crash', targetSection: 'user-issues' },
      { entityType: 'prd', entityId: 'prd-105', label: 'PRD-105 Specification', targetSection: 'requirements' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
  {
    id: 'mem-chk-02',
    eventType: 'changed',
    state: 'active',
    title: 'Checkout CTA Spacing Increased to 16px',
    summary: 'Vertical padding increased from 12px to 16px to fix tap target accessibility and align with Ember design tokens.',
    entityType: 'design-token',
    entityId: 'token-btn-p-y',
    entityLabel: 'Design Token: spacing.button.padding-y',
    fieldChanges: [
      { field: 'paddingY', label: 'Vertical Padding', before: '12px', after: '16px' },
      { field: 'minTouchTarget', label: 'Touch Target Height', before: '40px', after: '48px' }
    ],
    whyChanged: 'Mobile usability testing showed payment CTA was difficult to tap on smaller devices; Validation Studio flagged mismatch with Ember Studio token.',
    decision: 'Adopt 16px vertical padding token for all primary payment actions across mobile viewports.',
    alternativesConsidered: [
      'Keep 12px and add invisible touch target buffer (rejected: causes mis-taps on adjacent discount link)',
      'Increase to 20px (rejected: pushes summary table below fold on small screens)',
    ],
    evidence: ['UX Finding UX-18', 'Validation Studio Pin #04', 'PRD-105 Acceptance Criteria #2'],
    expectedImpact: 'Improve tap accuracy and reduce accidental dismissals of payment sheet.',
    observedImpact: [
      { metric: 'Tap Error Rate', before: 8.2, after: 1.4, delta: -6.8, unit: '%', direction: 'positive', measurementWindow: 'Post-v4.2.1 Usability Lab', source: 'Validation Studio' },
      { metric: 'Checkout Completion', before: 71.4, after: 74.9, delta: 3.5, unit: '%', direction: 'positive', measurementWindow: 'Production v4.2.1', source: 'Telemetry' }
    ],
    impactSummary: 'Tap errors decreased by 6.8pp; checkout completion improved to 74.9%.',
    author: 'Sofia Chen',
    role: 'designer',
    occurredAt: '2026-08-27',
    previousMemoryEventId: 'mem-chk-01',
    links: [
      { entityType: 'prd', entityId: 'prd-105', label: 'PRD-105', targetSection: 'requirements' },
      { entityType: 'validation', entityId: 'vs-01', label: 'Validation Studio: Checkout Flow', targetSection: 'validation' },
      { entityType: 'ux-finding', entityId: 'ux-18', label: 'UX Finding: Small Target Frustration', targetSection: 'findings' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
  {
    id: 'mem-chk-03',
    eventType: 'decision',
    state: 'active',
    title: 'Payment Flow Migrated to Resilient Explicit State Machine',
    summary: 'Replaced loose async useEffect retry triggers with finite state machine in DEV-416.',
    entityType: 'task',
    entityId: 'task-02',
    entityLabel: 'DEV-416: Android 14 Checkout Crash & Payment Freeze',
    fieldChanges: [
      { field: 'architecture', label: 'State Engine', before: 'Ad-hoc React useEffect', after: 'Explicit Finite State Machine (XState pattern)' },
      { field: 'status', label: 'Task Status', before: 'in-progress', after: 'review' }
    ],
    whyChanged: 'Intermittent network retries created orphaned race conditions where UI froze in submitting state while bank API returned duplicate token error.',
    decision: 'Enforce explicit transitions (IDLE -> AUTHENTICATING -> TOKEN_ACQUIRED -> CHARGING -> SETTLED | FAILED) with automatic idempotency key.',
    alternativesConsidered: [
      'Simple boolean flag isSubmitting (rejected: failed on double-click fast retry)',
      'Full Redux toolkit rewrite (rejected: too heavyweight for isolated payment sheet)',
    ],
    evidence: ['DEV-416', 'DEC-103', 'Bug BUG-204', 'Incident INC-31'],
    expectedImpact: 'Prevent invalid UI states and eliminate orphaned pending payment charges.',
    observedImpact: [
      { metric: 'Payment State Inconsistencies', before: 24, after: 0, delta: -24, unit: 'incidents/mo', direction: 'positive', measurementWindow: '30 days post-launch', source: 'Sentry' }
    ],
    impactSummary: 'Zero duplicate charge incidents or state freezes recorded post-release.',
    author: 'Marcus Brody',
    role: 'dev',
    occurredAt: '2026-08-29',
    previousMemoryEventId: 'mem-chk-02',
    links: [
      { entityType: 'task', entityId: 'task-02', label: 'DEV-416 Task', targetSection: 'tasks' },
      { entityType: 'decision', entityId: 'dec-103', label: 'DEC-103: State Machine Architecture', targetSection: 'decisions' },
      { entityType: 'bug', entityId: 'bug-01', label: 'BUG-204: Android 14 Freeze', targetSection: 'bugs' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
  {
    id: 'mem-chk-04',
    eventType: 'tested',
    state: 'active',
    title: 'Mandatory Android 14 Payment Retry Regression Test Added',
    summary: 'Added automated acceptance test tc-01 covering biometric cancellation and 3G network drop recovery.',
    entityType: 'qa-test',
    entityId: 'tc-01',
    entityLabel: 'QATest: Biometric Sheet Cancellation & Retry Matrix',
    fieldChanges: [
      { field: 'isMandatory', label: 'Release Blocker', before: 'false', after: 'true' },
      { field: 'status', label: 'Test Status', before: 'Failed', after: 'Passed' }
    ],
    whyChanged: 'Previous test matrix only verified happy-path Wi-Fi payment; missed edge-case packet drop during biometric challenge.',
    decision: 'Require passing network degradation and biometric timeout tests for any release containing payment sheet code.',
    evidence: ['BUG-204 Post-Mortem', 'INC-31 Root Cause Analysis'],
    expectedImpact: 'Zero regression escapes into production for payment flows.',
    observedImpact: [
      { metric: 'Regression Escapes', before: 3, after: 0, delta: -3, unit: 'escapes', direction: 'positive', measurementWindow: 'Sprint 14-15', source: 'QA Radar' }
    ],
    impactSummary: 'All retry states verified clean; cleared release readiness gate.',
    author: 'Priya Sharma',
    role: 'qa',
    occurredAt: '2026-08-30',
    previousMemoryEventId: 'mem-chk-03',
    links: [
      { entityType: 'qa-test', entityId: 'tc-01', label: 'TC-01 Test Case', targetSection: 'qa-status' },
      { entityType: 'bug', entityId: 'bug-01', label: 'BUG-204', targetSection: 'bugs' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
  {
    id: 'mem-chk-05',
    eventType: 'released',
    state: 'validated',
    title: 'StreamFlow v4.2.1 Shipped with Payment Overhaul',
    summary: 'Deployed v4.2.1 containing PRD-105, 16px CTA token, and state machine stability patches.',
    entityType: 'release',
    entityId: 'rel-01',
    entityLabel: 'Release: StreamFlow Experience v4.2.1',
    fieldChanges: [
      { field: 'status', label: 'Release Status', before: 'Staging', after: 'Production' },
      { field: 'version', label: 'App Version', before: 'v4.2.0', after: 'v4.2.1' }
    ],
    whyChanged: 'Fixes P0 payment blocker affecting 142 Android users and unlocks biometric checkout conversion.',
    decision: 'Promote build bld-104 to 100% production rollout after staging canary passed 24h error gate.',
    evidence: ['Release Readiness Score 96%', 'Passed Security Gate STRIX-SCAN-781', 'Build bld-104'],
    expectedImpact: 'Restore payment reliability to >99.9% and drive positive sentiment delta.',
    observedImpact: [
      { metric: 'Post-Release Sentiment Delta', before: -8.4, after: 14.2, delta: 22.6, unit: '%', direction: 'positive', measurementWindow: '7 days post-release', source: 'Store Reviews & Sentiment Analyzer' },
      { metric: 'Checkout Reliability', before: 94.2, after: 99.98, delta: 5.78, unit: '%', direction: 'positive', measurementWindow: '14 days post-release', source: 'Datadog APM' }
    ],
    impactSummary: 'Sentiment delta swung +22.6pp; checkout reliability reached 99.98%.',
    author: 'DevOps / Release Engineering',
    role: 'ops',
    occurredAt: '2026-09-02',
    previousMemoryEventId: 'mem-chk-04',
    links: [
      { entityType: 'release', entityId: 'rel-01', label: 'Release v4.2.1', targetSection: 'releases' },
      { entityType: 'prd', entityId: 'prd-105', label: 'PRD-105', targetSection: 'requirements' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },

  // STORY B: Session Expiry / 2FA & Token Rotation (Decision Lineage)
  {
    id: 'mem-sec-01',
    eventType: 'decision',
    state: 'superseded',
    title: 'DEC-101: Initial Stateless JWT In localStorage (Superseded)',
    summary: 'Original v1.0 design stored JWT tokens in browser localStorage for simple client access.',
    entityType: 'decision',
    entityId: 'dec-101',
    entityLabel: 'DEC-101: Stateless JWT Storage',
    fieldChanges: [
      { field: 'storageLocation', label: 'Auth Token Store', before: 'None', after: 'localStorage' }
    ],
    whyChanged: 'Initial MVP required zero backend session state to minimize Redis infrastructure costs.',
    decision: 'Store 7-day bearer JWT directly in localStorage and attach via Axios interceptor.',
    alternativesConsidered: [
      'Server-side session tables (rejected: scaled poorly on sudden stream spikes)'
    ],
    evidence: ['MVP Architecture Document v1.0', 'Sprint 2 RFC'],
    expectedImpact: 'Zero server-side session lookup overhead on high-concurrency stream view endpoints.',
    observedImpact: [
      { metric: 'Auth Token Theft Risk', before: 0, after: 1, delta: 1, unit: 'finding', direction: 'negative', measurementWindow: 'Security Audit Q2', source: 'Strix AST Scanner' }
    ],
    impactSummary: 'Flagged by AST security scanner: localStorage tokens vulnerable to XSS exfiltration.',
    author: 'Architecture Guild',
    role: 'dev',
    occurredAt: '2026-07-15',
    supersededByEventId: 'mem-sec-02',
    links: [
      { entityType: 'decision', entityId: 'dec-101', label: 'DEC-101 (Superseded)', targetSection: 'decisions' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
  {
    id: 'mem-sec-02',
    eventType: 'decision',
    state: 'active',
    title: 'DEC-104: Secure HttpOnly Cookie + Refresh Token Rotation',
    summary: 'Superseded DEC-101 following security assessment SEC-FIND-01; tokens migrated to HttpOnly cookies with 15-min rotation.',
    entityType: 'decision',
    entityId: 'dec-104',
    entityLabel: 'DEC-104: Refresh Token Rotation & HttpOnly Cookies',
    fieldChanges: [
      { field: 'storageLocation', label: 'Auth Token Store', before: 'localStorage', after: 'HttpOnly Secure SameSite=Strict Cookie' },
      { field: 'tokenExpiry', label: 'Access Token Lifetime', before: '7 days', after: '15 minutes' }
    ],
    whyChanged: 'Security assessment flagged critical XSS attack vector where malicious CDN script could read localStorage tokens.',
    decision: 'Adopt short-lived 15-minute access token in memory with automatic rotation via HttpOnly secure refresh cookie.',
    alternativesConsidered: [
      'Encrypted localStorage with WebCrypto (rejected: encryption key still accessible in JS memory space)',
      'Strict CSP without cookie migration (rejected: defense-in-depth requires cookie containment)'
    ],
    evidence: ['DEC-101', 'Security Assessment SEC-FIND-01', 'DEV-412 Token Rotation PR', 'OWASP ASVS 4.0.3'],
    expectedImpact: 'Neutralize token exfiltration risks and comply with SOC2 credential storage standard.',
    observedImpact: [
      { metric: 'Open Vulnerabilities', before: 1, after: 0, delta: -1, unit: 'critical', direction: 'positive', measurementWindow: 'Strix Retest Scan', source: 'Security Command Center' },
      { metric: 'Session Hijacking Exposure', before: 100, after: 0, delta: -100, unit: '%', direction: 'positive', measurementWindow: 'Post-Implementation', source: 'Penetration Report' }
    ],
    impactSummary: 'Vulnerability verified resolved; zero credential leakage vectors remain.',
    author: 'Principal Security Architect',
    role: 'dev',
    occurredAt: '2026-08-18',
    supersedesMemoryEventId: 'mem-sec-01',
    links: [
      { entityType: 'decision', entityId: 'dec-104', label: 'DEC-104 (Active)', targetSection: 'decisions' },
      { entityType: 'decision', entityId: 'dec-101', label: 'DEC-101 (Superseded)', targetSection: 'decisions' },
      { entityType: 'security', entityId: 'sec-find-01', label: 'SEC-FIND-01: Token Invalidation Gate', targetSection: 'security' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },

  // STORY C: Picture-in-Picture HUD Collision
  {
    id: 'mem-pip-01',
    eventType: 'changed',
    state: 'active',
    title: 'PiP Player HUD Z-Index & SafeArea Insets Corrected',
    summary: 'Validation Studio identified collision between landscape gesture bar and playback scrubber.',
    entityType: 'design-spec',
    entityId: 'dsp-03',
    entityLabel: 'Design Spec: Mobile PiP Floating HUD (DSP-03)',
    fieldChanges: [
      { field: 'zIndex', label: 'Layer Z-Index', before: 'z-20', after: 'z-50' },
      { field: 'bottomInset', label: 'Safe Area Bottom', before: '8px', after: 'max(16px, env(safe-area-inset-bottom))' }
    ],
    whyChanged: 'Validation Studio visual comparison identified 18px overlap between floating player controls and system home indicator on iPhone 15.',
    decision: 'Apply dynamic CSS env(safe-area-inset-bottom) with minimum 16px safety margin and elevate HUD to modal z-layer.',
    evidence: ['Validation Studio Pin #04', 'Figma Spec Sheet FS-02', 'QA Test TC-08'],
    expectedImpact: 'Eliminate scrubber mis-taps triggering app switcher on iOS and Android gestures.',
    observedImpact: [
      { metric: 'Scrubber Mis-tap Rate', before: 12.4, after: 0.8, delta: -11.6, unit: '%', direction: 'positive', measurementWindow: 'QA Matrix v4.2.1', source: 'Validation Studio' }
    ],
    impactSummary: 'Mis-tap rate reduced by 11.6pp; design token spec synchronized.',
    author: 'Sofia Chen',
    role: 'designer',
    occurredAt: '2026-08-26',
    links: [
      { entityType: 'validation', entityId: 'vs-01', label: 'Validation Studio Session', targetSection: 'validation' },
      { entityType: 'figma', entityId: 'fs-02', label: 'Figma Spec: PiP Player', targetSection: 'figma' },
      { entityType: 'task', entityId: 'task-05', label: 'DEV-419: HUD Layering Fix', targetSection: 'tasks' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },

  // STORY D: Offline Replay Feature Prioritization (Unmeasured / In-Flight)
  {
    id: 'mem-off-01',
    eventType: 'decision',
    state: 'proposed',
    title: 'Offline Replay Capability Accelerated from Q4 to Q3',
    summary: 'Accelerated development based on 4,890 community upvotes and commuter segment research.',
    entityType: 'feature-request',
    entityId: 'fr-01',
    entityLabel: 'Feature Request: FR-01 Offline Playback',
    fieldChanges: [
      { field: 'targetQuarter', label: 'Target Quarter', before: 'Q4 2026', after: 'Q3 2026' },
      { field: 'status', label: 'Roadmap Status', before: 'Planned', after: 'In Development' }
    ],
    whyChanged: '4,890 users upvoted offline caching; user research sessions US-01 and US-02 highlighted massive churn among commuting users.',
    decision: 'Allocate Sprint 15 engineering bandwidth to IndexedDB encrypted media chunk caching.',
    alternativesConsidered: [
      'Wait for unified desktop/mobile video SDK (rejected: desktop users do not need offline caching)'
    ],
    evidence: ['Feature Request FR-01 (4,890 upvotes)', 'UX Research Session US-01 (Commuter Segment)', 'PRD-108 Draft'],
    expectedImpact: 'Increase retained weekly stream viewers by 12% and reduce offline playback bounce rate.',
    observedImpact: [], // Empty array represents "Impact not measured yet"
    impactSummary: 'Impact not measured yet (feature scheduled for deployment in v4.3.0).',
    author: 'Elena Rostova',
    role: 'pm',
    occurredAt: '2026-09-01',
    links: [
      { entityType: 'feature-request', entityId: 'fr-01', label: 'FR-01 Feature Request', targetSection: 'feature-requests' },
      { entityType: 'research', entityId: 'us-01', label: 'User Session US-01', targetSection: 'research' },
      { entityType: 'task', entityId: 'task-04', label: 'DEV-425: IndexedDB Cache Engine', targetSection: 'tasks' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },

  // ----------------------------------------------------
  // ADDITIONAL ROLE-SPECIFIC MEMORY EVENTS (PM, DESIGN, DEV, QA, OPS)
  // ----------------------------------------------------

  // PRODUCT (PM) SPECIFIC
  {
    id: 'mem-pm-01',
    eventType: 'changed',
    state: 'active',
    title: 'PRD-102 Multi-Tenant Workspace Scope Partitioned into Phase 1',
    summary: 'Deferred custom SSO and SCIM provisioning to Phase 2 to meet enterprise pilot deadline.',
    entityType: 'prd',
    entityId: 'prd-102',
    entityLabel: 'PRD-102: Multi-Tenant Architecture',
    fieldChanges: [
      { field: 'scope', label: 'Release Scope', before: 'Full Enterprise (SSO + SCIM + RBAC)', after: 'Phase 1: Team RBAC & Workspace Isolation' },
      { field: 'deliveryDate', label: 'Target Delivery', before: 'October 2026', after: 'August 2026' }
    ],
    whyChanged: 'Enterprise design partner feedback showed urgent need for team workspace isolation, but custom Okta SCIM integration would delay release by 8 weeks.',
    decision: 'Deliver team-level role separation first; deliver custom IdP integrations in v4.4.',
    alternativesConsidered: [
      'Delay entire enterprise launch by 2 months (rejected: 3 design partners blocked)'
    ],
    evidence: ['Partner Call Transcript E-12', 'Executive Roadmap Review'],
    expectedImpact: 'Unblock 3 enterprise beta pilots representing $180k ARR.',
    observedImpact: [
      { metric: 'Enterprise Pilots Unblocked', before: 0, after: 3, delta: 3, unit: 'pilots', direction: 'positive', measurementWindow: 'Sprint 14', source: 'Salesforce CRM' }
    ],
    impactSummary: '3 enterprise pilots launched on schedule with 100% tenant data isolation.',
    author: 'Elena Rostova',
    role: 'pm',
    occurredAt: '2026-08-12',
    links: [
      { entityType: 'prd', entityId: 'prd-102', label: 'PRD-102 Document', targetSection: 'requirements' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },

  // DESIGN SPECIFIC
  {
    id: 'mem-des-01',
    eventType: 'changed',
    state: 'validated',
    title: 'Neutral Contrast Tokens Elevated to WCAG 2.1 AAA',
    summary: 'Adjusted secondary text color token from #8f8f8f to #71717a to pass accessibility audit.',
    entityType: 'design-token',
    entityId: 'token-text-secondary',
    entityLabel: 'Design Token: color.text.secondary',
    fieldChanges: [
      { field: 'hexValue', label: 'Hex Color Value', before: '#8f8f8f', after: '#71717a' },
      { field: 'contrastRatio', label: 'Contrast vs White', before: '4.2:1 (Fail AA)', after: '4.8:1 (Pass AA & AAA Large)' }
    ],
    whyChanged: 'Third-party accessibility audit flagged muted timestamps and badge labels as unreadable in outdoor high-glare conditions.',
    decision: 'Darken secondary text color token globally to guarantee 4.8:1 minimum contrast across light theme.',
    evidence: ['A11y Audit Report v2', 'Figma Token Sync #88'],
    expectedImpact: 'Zero contrast violations across all 31 views.',
    observedImpact: [
      { metric: 'Accessibility Violations', before: 18, after: 0, delta: -18, unit: 'issues', direction: 'positive', measurementWindow: 'Axe Core Automated CI', source: 'Validation Studio' }
    ],
    impactSummary: 'Zero WCAG AA contrast failures remain in production.',
    author: 'Sofia Chen',
    role: 'designer',
    occurredAt: '2026-08-20',
    links: [
      { entityType: 'design-token', entityId: 'token-text-secondary', label: 'Design Tokens', targetSection: 'designs' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
  {
    id: 'mem-des-02',
    eventType: 'decision',
    state: 'active',
    title: 'Tablet Viewport Approved with Persistent Sidebar Exception',
    summary: 'Permitted 2-column layout on iPad Landscape contrary to initial mobile single-pane spec.',
    entityType: 'design-spec',
    entityId: 'dsp-07',
    entityLabel: 'Design Spec: Responsive Breakpoints (DSP-07)',
    fieldChanges: [
      { field: 'tabletDrawerMode', label: 'Tablet Drawer Mode', before: 'Modal Overlay', after: 'Persistent Rail (72px)' }
    ],
    whyChanged: 'Observational UX testing with field architects showed constant tab friction when switching between PRDs and Kanban on iPad Pro.',
    decision: 'Retain collapsed 72px icon rail on viewports >= 834px instead of hiding behind hamburger.',
    evidence: ['UX Research Session US-04', 'Figma Tablet Breakpoint Spec'],
    expectedImpact: 'Reduce navigation taps per session by 35% on tablet devices.',
    observedImpact: [
      { metric: 'Navigation Action Taps', before: 44, after: 28, delta: -16, unit: 'taps/session', direction: 'positive', measurementWindow: 'Tablet Telemetry', source: 'Mixpanel' }
    ],
    impactSummary: 'Navigation overhead reduced by 36% for tablet power users.',
    author: 'Sofia Chen',
    role: 'designer',
    occurredAt: '2026-08-22',
    links: [
      { entityType: 'validation', entityId: 'vs-01', label: 'Validation Studio', targetSection: 'validation' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },

  // ENGINEERING (DEV) SPECIFIC
  {
    id: 'mem-dev-01',
    eventType: 'decision',
    state: 'active',
    title: 'DEC-105: Client-Side Cache Engine Migrated to SQLite WASM',
    summary: 'Replaced custom IndexedDB wrapper with OPFS SQLite WASM for instant full-text search.',
    entityType: 'decision',
    entityId: 'dec-105',
    entityLabel: 'DEC-105: Client-Side Storage Architecture',
    fieldChanges: [
      { field: 'storageEngine', label: 'Storage Engine', before: 'Raw IndexedDB', after: 'SQLite WASM with Origin Private File System' },
      { field: 'queryLatency', label: 'Search Query Latency', before: '142ms', after: '8ms' }
    ],
    whyChanged: 'Complex predicate filtering across 10,000+ telemetry points caused main-thread jank when using native IndexedDB cursors.',
    decision: 'Compile SQLite to WebAssembly with OPFS persistent storage to run relational queries in web worker.',
    alternativesConsidered: [
      'LokiJS in-memory DB (rejected: memory ballooning on long sessions)',
      'Dexie.js (rejected: still bottlenecked by browser cursor serialization)'
    ],
    evidence: ['Benchmark Report BENCH-42', 'DEC-105 RFC'],
    expectedImpact: 'Sub-15ms search latency across Command Palette and Memory Drawer.',
    observedImpact: [
      { metric: 'P99 Search Latency', before: 142, after: 8.4, delta: -133.6, unit: 'ms', direction: 'positive', measurementWindow: 'Synthetic Load Test', source: 'Lighthouse' }
    ],
    impactSummary: 'Query speed improved by 17x; zero frame drops during instant search.',
    author: 'Marcus Brody',
    role: 'dev',
    occurredAt: '2026-08-28',
    links: [
      { entityType: 'decision', entityId: 'dec-105', label: 'DEC-105 ADR', targetSection: 'decisions' },
      { entityType: 'task', entityId: 'task-04', label: 'DEV-425 Task', targetSection: 'tasks' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },

  // QA & SECURITY SPECIFIC
  {
    id: 'mem-qa-01',
    eventType: 'tested',
    state: 'validated',
    title: 'BUG-204 Root Cause Analysis & Biometric Timeout Fix Verified',
    summary: 'Verified that Android 14 CredentialManager callback gracefully handles user cancellation.',
    entityType: 'bug',
    entityId: 'bug-01',
    entityLabel: 'BUG-204: Android 14 Checkout Freeze',
    fieldChanges: [
      { field: 'status', label: 'Bug Status', before: 'Open', after: 'Verified Resolved' },
      { field: 'resolution', label: 'Resolution', before: 'Unresolved', after: 'Code Fix & Automated Regression Test' }
    ],
    whyChanged: 'Root cause was an unhandled NullPointerException in CredentialManager when the biometric prompt was dismissed via back gesture.',
    decision: 'Wrap callback in Result.fold with explicit CancellationException handler and reset payment button to idle state.',
    evidence: ['Crash Log Logcat-8819', 'Automated Test TC-01'],
    expectedImpact: 'Zero unhandled exceptions on biometric cancellation.',
    observedImpact: [
      { metric: 'Crash Volume Post-Fix', before: 142, after: 0, delta: -142, unit: 'crashes', direction: 'positive', measurementWindow: '7 days', source: 'Sentry' }
    ],
    impactSummary: 'Bug confirmed fixed in build bld-104; zero repeat occurrences.',
    author: 'Priya Sharma',
    role: 'qa',
    occurredAt: '2026-08-31',
    links: [
      { entityType: 'bug', entityId: 'bug-01', label: 'BUG-204 Record', targetSection: 'bugs' },
      { entityType: 'qa-test', entityId: 'tc-01', label: 'TC-01 Test Case', targetSection: 'qa-status' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
  {
    id: 'mem-qa-02',
    eventType: 'decision',
    state: 'active',
    title: 'SEC-WAIVER-04: Internal Metric Endpoint Risk Accepted for Staging',
    summary: 'Granted temporary security waiver for Prometheus metrics endpoint in staging environment.',
    entityType: 'security',
    entityId: 'sec-find-03',
    entityLabel: 'Security Finding: SEC-FIND-03 (Unauthenticated Metrics)',
    fieldChanges: [
      { field: 'status', label: 'Finding Status', before: 'open', after: 'accepted-risk' },
      { field: 'waiverDuration', label: 'Waiver Expiry', before: 'None', after: '90 Days (Expires Nov 2026)' }
    ],
    whyChanged: 'Staging Prometheus scraper lacked mTLS certificate provisioning during cluster migration.',
    decision: 'Accept low-severity risk in staging behind VPC security group; require mTLS prior to production go-live.',
    evidence: ['SEC-FIND-03 Risk Assessment', 'VP Engineering Approval'],
    expectedImpact: 'Allow staging telemetry ingestion without blocking release candidate validation.',
    observedImpact: [
      { metric: 'Exploitation Surface', before: 0, after: 0, delta: 0, unit: 'breaches', direction: 'neutral', measurementWindow: 'Strix Network Monitor', source: 'Security Hub' }
    ],
    impactSummary: 'Compensating network controls verified; zero external exposure.',
    author: 'Priya Sharma',
    role: 'qa',
    occurredAt: '2026-08-27',
    links: [
      { entityType: 'security', entityId: 'sec-find-03', label: 'SEC-FIND-03', targetSection: 'security' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },

  // OPERATIONS (OPS) SPECIFIC
  {
    id: 'mem-ops-01',
    eventType: 'decision',
    state: 'validated',
    title: 'INC-31 Post-Mortem: Payment Gateway Timeout Storm Remediated',
    summary: 'Root cause analysis of August 24 outage: cascading timeouts due to lack of circuit breaker.',
    entityType: 'incident',
    entityId: 'inc-31',
    entityLabel: 'Incident INC-31: Payment Gateway Outage',
    fieldChanges: [
      { field: 'incidentStatus', label: 'Incident State', before: 'Active', after: 'Closed / Post-Mortem Published' },
      { field: 'circuitBreakerThreshold', label: 'Circuit Breaker Failures', before: 'None', after: '5 failures in 10s' }
    ],
    whyChanged: 'Upstream payment processor experienced 4-second latency spike; our backend threads exhausted connection pool.',
    decision: 'Deploy Envoy adaptive circuit breaker with 500ms timeout and automatic fallback to queueing.',
    evidence: ['INC-31 Post-Mortem Report', 'Datadog Trace Waterfall'],
    expectedImpact: 'Prevent connection pool starvation during third-party degradations.',
    observedImpact: [
      { metric: 'Mean Time to Recovery (MTTR)', before: 42, after: 1.2, delta: -40.8, unit: 'minutes', direction: 'positive', measurementWindow: 'Synthetic Chaos Drill', source: 'Ops Health Radar' }
    ],
    impactSummary: 'MTTR reduced from 42 mins to 1.2 mins; circuit breaker tripped cleanly in simulation.',
    author: 'DevOps / SRE Lead',
    role: 'ops',
    occurredAt: '2026-08-25',
    links: [
      { entityType: 'incidents', entityId: 'inc-31', label: 'INC-31 Incident Log', targetSection: 'incidents' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
  {
    id: 'mem-ops-02',
    eventType: 'decision',
    state: 'active',
    title: 'Canary Rollout v4.2.0 Halting & Rollback Justification',
    summary: 'Halted 10% canary deployment on Android after automated telemetry detected 2.4% crash rate.',
    entityType: 'release',
    entityId: 'rel-canary-04',
    entityLabel: 'Canary Deployment: Android v4.2.0',
    fieldChanges: [
      { field: 'deploymentState', label: 'Rollout Status', before: '10% Canary', after: 'Rolled Back to v4.1.9' },
      { field: 'blockerReason', label: 'Halt Reason', before: 'None', after: 'Crash Rate Exceeded 0.5% SLO' }
    ],
    whyChanged: 'Crash-free users dropped below 98% SLO within 45 minutes of canary release on Android 14 devices.',
    decision: 'Execute automated rollback to v4.1.9; declare P0 bug BUG-204 and block general availability.',
    evidence: ['Play Console Vitals Crash Alert', 'Canary Telemetry Stream'],
    expectedImpact: 'Prevent crash exposure from spreading to remaining 90% of user base.',
    observedImpact: [
      { metric: 'Users Protected from Crash', before: 0, after: 385000, delta: 385000, unit: 'users', direction: 'positive', measurementWindow: 'Canary Window', source: 'Play Console' }
    ],
    impactSummary: '385,000 users shielded from payment crashes; prompt rollback prevented brand damage.',
    author: 'DevOps / Release Engineering',
    role: 'ops',
    occurredAt: '2026-08-24',
    links: [
      { entityType: 'releases', entityId: 'rel-01', label: 'Releases View', targetSection: 'releases' },
      { entityType: 'bug', entityId: 'bug-01', label: 'BUG-204', targetSection: 'bugs' }
    ],
    source: 'seed',
    rationaleRecorded: true,
  },
];

