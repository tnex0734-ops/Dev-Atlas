// domain types


export type RoleType = 'all' | 'pm' | 'designer' | 'dev' | 'qa' | 'ops' | 'memory';

export type NavSection =
  // 1. Workspace & Executive Intelligence
  | 'overview'
  | 'product-health'
  | 'roadmap'
  | 'meetings'
  // 2. Product Management & Strategy
  | 'features'
  | 'requirements'
  // 3. User Intelligence & Feedback Hub
  | 'feedback'
  | 'user-issues'
  | 'feature-requests'
  | 'insights'
  // 4. UX Research & User Patterns
  | 'research'
  | 'findings'
  | 'user-patterns'
  // 5. Design System & Validation Studio
  | 'validation'
  | 'designs'
  | 'figma'
  | 'reviews'
  // 6. Engineering Execution & Developer Workspace
  | 'tasks'
  | 'dev-features'
  | 'builds'
  | 'prompts'
  // 7. Quality Assurance & Release Readiness Gating
  | 'qa-status'
  | 'bugs'
  | 'release-readiness'
  | 'security'
  // 8. Production Operations & Post-Deployment Sentiment Delta
  | 'releases'
  | 'incidents'
  | 'maintenance'
  // 9. Persistent Project Memory & Second Brain
  | 'context'
  | 'notes'
  | 'files'
  | 'decisions'
  | 'project-memory'
  // 10. Team Connectors & Data Ingestion
  | 'connectors';

export type SentimentType = 'positive' | 'neutral' | 'negative';
export type PlatformType = 'Android' | 'iOS' | 'Mobile' | 'Web' | 'Cross-Platform' | 'Backend / Cloud';
export type PriorityType = 'P0' | 'P1' | 'P2';
export type RequirementStage = 'Discovery' | 'In Design' | 'In Development' | 'Ready for QA' | 'Shipped';


export interface FeedbackItem {
  id: string;
  source: 'Google Play' | 'App Store' | 'Reddit' | 'GitHub Issues' | 'Support Desk' | 'Discord' | 'Twitter / X' | 'User Survey';
  userHandle: string;
  rating?: number;
  comment: string;
  date: string;
  sentiment: SentimentType;
  platform: PlatformType;
  appVersion: string;
  clusterId?: string;
  upvotes?: number;

  // AI Summarized Intelligence & Strategic Metrics
  aiSummary?: string;
  aiKeyTakeaway?: string;
  aiRecommendedAction?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  impactScore?: number;
  affectedUsersEstimate?: number;
  productArea?: string;
  tags?: string[];
}

export interface ProblemCluster {
  id: string;
  title: string;
  aiSummary: string;
  userCount: number;
  sentiment: SentimentType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  trend: string;
  trendType: 'up' | 'down' | 'stable';
  platform: PlatformType;
  productArea: string;
  firstDetected: string;
  latestOccurrence: string;
  relatedFeatureId?: string;
  relatedTaskId?: string;
  owner: string;
  status: 'investigating' | 'promoted' | 'in-dev' | 'in-qa' | 'resolved';
  aiInsight: {
    likelyCause: string;
    recommendedAction: string;
    velocityNote: string;
  };
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  requesterCount: number;
  category: string;
  targetQuarter: string;
  status: 'Under Consideration' | 'Planned' | 'In Progress' | 'Shipped';
  originSource: string;
  linkedReqCode?: string;
}

export interface StrategicInsight {
  id: string;
  category: 'Behavior Shift' | 'UX Opportunity' | 'Competitive Threat' | 'Technical Debt';
  headline: string;
  description: string;
  impactScore: number; // 0 - 100
  confidence: number; // 0 - 100
  date: string;
  recommendedInitiative: string;
}


export interface ProductRequirement {
  id: string;
  reqCode: string;
  title: string;
  clusterId?: string;
  originFeedbackCount?: number;
  problemStatement: string;
  businessImpact: string;
  userStories: string[];
  acceptanceCriteria: string[];
  priority: PriorityType;
  targetRelease: string;
  stage: RequirementStage;
  leadPM: string;
  leadDesigner: string;
  leadDev: string;
  lastUpdated: string;
}

export interface ProductFeature {
  id: string;
  featureCode: string;
  name: string;
  category: string;
  stage: RequirementStage;
  progress: number; // 0 - 100
  owner: string;
  targetVersion: string;
  description: string;
  associatedPRD: string;
}

export interface RoadmapEpic {
  id: string;
  title: string;
  quarter: 'Q3 2026' | 'Q4 2026' | 'Q1 2027';
  status: 'On Track' | 'At Risk' | 'Completed' | 'Upcoming';
  priority: PriorityType;
  owner: string;
  summary: string;
  deliverables: string[];
  completionPercent: number;
}

// UX & research
export interface ResearchSession {
  id: string;
  sessionCode: string;
  participantHandle: string;
  type: 'Moderated Usability' | '1-on-1 Interview' | 'Telemetry Observation';
  date: string;
  durationMinutes: number;
  personaTarget: string;
  keyTakeaway: string;
  quotes: string[];
  tags: string[];
}

export interface UXFinding {
  id: string;
  findingCode: string;
  title: string;
  severity: 'Critical Blocker' | 'High Friction' | 'Minor Annoyance';
  affectedFlow: string;
  evidenceQuote: string;
  participantCount: number;
  recommendedFix: string;
  linkedPRD?: string;
}

export interface UserPersona {
  id: string;
  name: string;
  tagline: string;
  prevalencePercentage: number;
  avatarIcon: string;
  primaryFrustrations: string[];
  triggerScenarios: string[];
  designTreatments: string[];
}

// Design validation & tokens
export interface DesignAnnotation {
  id: string;
  xPercent: number;
  yPercent: number;
  author: string;
  authorRole: 'Designer' | 'Developer' | 'PM' | 'QA';
  text: string;
  type: 'spacing' | 'typography' | 'color' | 'state' | 'responsive' | 'general';
  resolved: boolean;
  timestamp: string;
}

export interface DesignValidationSession {
  id: string;
  featureId: string;
  featureTitle: string;
  screenName: string;
  version: string;
  figmaUrl: string;
  liveBuildComponentKey: 'checkout-v2' | 'auth-modal' | 'video-player-hud' | 'settings-panel';
  status: 'Ready for Design Review' | 'Changes Requested' | 'In Development' | 'Approved';
  designer: string;
  leadDev: string;
  mismatchCount: number;
  annotations: DesignAnnotation[];
  history: Array<{
    date: string;
    action: string;
    author: string;
    role: string;
    comment?: string;
  }>;
}

export interface DesignToken {
  id: string;
  name: string;
  tokenKey: string;
  category: 'Color' | 'Typography' | 'Elevation' | 'Border Radius' | 'Animation';
  value: string;
  cssVariable: string;
  usageDescription: string;
  previewColor?: string;
}

export interface FigmaFrameSpec {
  id: string;
  frameName: string;
  componentName: string;
  nodeId: string;
  lastSynced: string;
  specs: {
    dimensions: string;
    padding: string;
    radius: string;
    typographyToken: string;
    colorToken: string;
  };
  devNotes: string;
}

export interface DesignReviewThread {
  id: string;
  title: string;
  component: string;
  author: string;
  status: 'Open' | 'Resolved';
  commentsCount: number;
  lastActivity: string;
  comments: Array<{
    id: string;
    author: string;
    role: string;
    time: string;
    text: string;
  }>;
}

// Dev tasks & builds
export interface DevTask {
  id: string;
  taskCode: string;
  title: string;
  requirementId: string;
  requirementTitle: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: PriorityType;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  figmaFrameRef?: string;
  prLink?: string;
  branch?: string;
  contextSummary: string;
  techStackTags: string[];
  // Relational Memory Links
  relatedDecisionId?: string;
  relatedDecisionCode?: string;
  relatedMeetingId?: string;
  relatedMeetingTitle?: string;
  whyItExists?: string;
  dependencies?: string[];
}

export interface SprintFeature {
  id: string;
  branchName: string;
  prNumber: number;
  title: string;
  prStatus: 'Open' | 'Draft' | 'Merged';
  author: string;
  commitCount: number;
  progressPercent: number;
  linkedDevTasks: string[];
}

export interface SandboxBuild {
  id: string;
  buildNumber: string;
  commitHash: string;
  branch: string;
  trigger: string;
  timestamp: string;
  duration: string;
  status: 'Success' | 'Building' | 'Failed';
  sandboxUrl: string;
  sizeKb: number;
}

// QA & testing
export interface QATestCase {
  id: string;
  testCode: string;
  title: string;
  requirementCode: string;
  acceptanceCriteriaIndex: number;
  type: 'Automated E2E' | 'Integration Unit' | 'Manual Exploratory' | 'Performance Load';
  status: 'Passed' | 'Failed' | 'In Progress' | 'Blocked';
  lastRun: string;
  durationMs: number;
  assignedQA: string;
  errorMessage?: string;
}

export interface BugItem {
  id: string;
  bugCode: string;
  title: string;
  severity: 'Critical P0' | 'High P1' | 'Medium P2' | 'Low P3';
  status: 'Open' | 'Triaged' | 'Fix in PR' | 'Verified Resolved';
  originVersion: string;
  relatedFeature: string;
  isFigmaMismatch: boolean;
  reporter: string;
  assignee: string;
  detectedAt: string;
}

export interface ReleaseReadinessCheck {
  id: string;
  category: string;
  criterion: string;
  isMet: boolean;
  scoreWeight: number;
  details: string;
}

// Releases & ops
export interface ReleaseItem {
  id: string;
  version: string;
  releaseName: string;
  deployedAt: string;
  status: 'Production Live' | 'Staging Rollout' | 'Hotfix Pending';
  preReleaseSentiment: number;
  postReleaseSentiment: number;
  sentimentDelta: number; // e.g. +14.2%
  resolvedClustersCount: number;
  notes: string[];
}

export interface IncidentItem {
  id: string;
  incidentCode: string;
  title: string;
  severity: 'P0 - Outage' | 'P1 - High Degradation' | 'P2 - Performance Spikes';
  status: 'Investigating' | 'Mitigated' | 'Resolved';
  startedAt: string;
  resolvedAt?: string;
  affectedUsersCount: number;
  rootCause: string;
  linkedClusterId?: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  category: 'Database' | 'Cache' | 'Edge CDN' | 'Security';
  status: 'Scheduled' | 'Running' | 'Completed';
  nextRun: string;
  estimatedDuration: string;
  responsibleEngineer: string;
}

// Memory & context blocks
export interface ContextBlock {
  id: string;
  title: string;
  category: 'Architecture' | 'API Contract' | 'Security & Token Policy' | 'Performance Constraints' | 'State Machine';
  content: string;
  lastUpdated: string;
  author: string;
  tags: string[];
}

export interface SecondBrainNote {
  id: string;
  title: string;
  rawContent: string;
  updatedAt: string;
  isRefined: boolean;
  tags: string[];
  refinedContent?: {
    summary: string;
    keyPoints: string[];
    technicalTakeaways: string[];
    actionItems: string[];
  };
}

export interface FileVaultItem {
  id: string;
  fileName: string;
  fileType: 'OpenAPI JSON' | 'Architecture Diagram' | 'PRD PDF' | 'Brand Tokens' | 'Security Schema';
  sizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
  associatedFeature: string;
  downloadUrl: string;
}

export interface ProjectDecision {
  id: string;
  decisionCode: string;
  title: string;
  category: 'Product' | 'Architecture' | 'Design' | 'Operations';
  context: string;
  decisionMade: string;
  consequences: string;
  stakeholders: string[];
  date: string;
  linkedFeatureId?: string;
  // Relational Memory & Lineage
  status?: 'active' | 'superseded' | 'deprecated' | 'proposed';
  decisionType?: 'technical' | 'verbal';
  relatedMeetingId?: string;
  relatedMeetingTitle?: string;
  relatedTaskId?: string;
  relatedTaskCode?: string;
  supersededBy?: string;
  supersedes?: string;
}

// ==========================================
// Meetings & Discussions Memory
// ==========================================
export interface MeetingActionItem {
  id: string;
  text: string;
  owner: string;
  role?: string;
  done: boolean;
  linkedTaskId?: string;
  linkedTaskCode?: string;
}

export interface MeetingDiscussionPoint {
  topic: string;
  summary: string;
  speaker?: string;
}

export interface ProjectMeeting {
  id: string;
  meetingCode: string; // e.g. 'MTG-024'
  title: string;
  date: string;
  durationMinutes: number;
  attendees: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  summary: string;
  discussionPoints: MeetingDiscussionPoint[];
  decisions: Array<{
    id: string;
    text: string;
    type?: 'technical' | 'verbal';
    linkedDecisionId?: string;
    linkedDecisionCode?: string;
  }>;
  actionItems: MeetingActionItem[];
  unresolvedQuestions: string[];
  status: 'Completed' | 'Action Required' | 'Follow-up Scheduled';
  roleTag: RoleType;
  relatedFeature?: string;
}

// Security findings & scans
export type SecurityTargetType = 'repository' | 'local-source' | 'web-app' | 'api' | 'openapi' | 'build';
export type SecurityScanMode = 'quick' | 'standard' | 'deep' | 'diff';
export type SecurityAssessmentStatus = 'queued' | 'running' | 'validating' | 'completed' | 'failed' | 'cancelled';
export type SecuritySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type SecurityConfidence = 'suspected' | 'evidence-collected' | 'validated' | 'false-positive';
export type SecurityFindingStatus =
  | 'open'
  | 'triaged'
  | 'fix-in-progress'
  | 'ready-for-retest'
  | 'verified-fixed'
  | 'accepted-risk';

export interface SecurityScope {
  assessmentId: string;
  authorized: boolean;
  allowedTargets: string[];
  excludedTargets: string[];
  notes?: string;
  confirmedBy: string;
  confirmedAt: string;
}

export interface SecurityEvidence {
  id: string;
  assessmentId: string;
  findingId?: string;
  type:
    | 'http-request'
    | 'http-response'
    | 'source-code'
    | 'scanner-output'
    | 'browser-observation'
    | 'runtime-output'
    | 'dependency-record'
    | 'configuration'
    | 'manual-validation'
    | 'other';
  title: string;
  capturedAt: string;
  source: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SecurityScanEvent {
  id: string;
  assessmentId: string;
  timestamp: string;
  stage: 'discovery' | 'analysis' | 'validation' | 'reporting' | 'retest';
  source: string;
  message: string;
  status: 'running' | 'success' | 'warning' | 'failed';
}

export interface SecurityFinding {
  id: string;
  findingCode: string; // e.g. SEC-014
  assessmentId: string;
  title: string;
  description: string;
  severity: SecuritySeverity;
  confidence: SecurityConfidence;
  category: string;
  cwe?: string;
  owasp?: string;
  cvss?: number;
  affectedTarget: string;
  affectedFile?: string;
  affectedLine?: number;
  affectedEndpoint?: string;
  evidenceIds: string[];
  reproductionSummary?: string;
  impact: string;
  remediation: string;
  status: SecurityFindingStatus;
  relatedTaskId?: string;
  relatedRequirementId?: string;
  relatedBuildId?: string;
  relatedFeatureId?: string;
  assignedTo?: string;
  discoveredAt: string;
  fixedAt?: string;
  verifiedAt?: string;
  riskAcceptance?: {
    rationale: string;
    acceptedBy: string;
    acceptedAt: string;
    expiry?: string;
    linkedDecisionId?: string;
  };
}

export interface SecurityAssessment {
  id: string;
  assessmentCode: string;
  name: string;
  targetType: SecurityTargetType;
  target: string;
  mode: SecurityScanMode;
  status: SecurityAssessmentStatus;
  scope: SecurityScope;
  startedAt?: string;
  completedAt?: string;
  initiatedBy: string;
  relatedBuildId?: string;
  relatedReleaseId?: string;
  findingsCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  validatedCount: number;
  securityScore?: number;
  provider: 'demo' | 'strix' | 'vulnclaw';
}

export interface SecurityGateResult {
  status: 'passed' | 'warning' | 'failed';
  score: number;
  blockers: string[];
  warnings: string[];
  criticalCount: number;
  highCount: number;
  unresolvedValidatedCount: number;
}

// High level metrics
export interface ProjectMetrics {
  compositeHealth: number; // e.g. 78/100
  userSentimentScore: number; // 74%
  checkoutReliability: number; // 86%
  featureVelocity: number; // 79%
  uxHealthScore: number; // 72%
  qaPassRate: number; // 88%
  productionHealth: number; // 91%
  activeP0Issues: number;
  openPRDCount: number;
  unresolvedVisualMismatches: number;
  unrefinedNotesCount: number;
  // Security Intelligence Additions
  securityHealthScore: number; // 82/100
  openVulnerabilitiesCount: number;
  criticalVulnerabilitiesCount: number;
}

export interface ProjectSocialLinks {
  twitter?: string;
  discord?: string;
  figma?: string;
  docs?: string;
  reddit?: string;
  linkedin?: string;
}

// Workspaces & models
export interface ProjectWorkspace {
  id: string;
  code: string; // e.g. 'STFL', 'NVAP', 'AETH'
  name: string; // e.g. 'StreamFlow Live Media'
  tagline: string;
  description: string;
  version: string;
  platform: PlatformType;
  healthScore: number;
  activeSprint: string;
  createdAt: string;
  owner: string;
  techStack: string[];
  themeColor: string;
  repoUrl?: string;
  deployedUrl?: string;
  socialLinks?: ProjectSocialLinks;
}

export type LLMProviderId = 'anthropic' | 'openai' | 'google' | 'deepseek' | 'meta';

export interface LLMModelTarget {
  id: string;
  name: string;
  provider: LLMProviderId;
  providerName: string;
  contextWindow: number; // e.g. 200000
  inputCostPerMillionUSD: number; // e.g. 3.00
  outputCostPerMillionUSD: number; // e.g. 15.00
  inputCostPerMillionINR: number; // e.g. 255.00
  outputCostPerMillionINR: number; // e.g. 1275.00
  supportsReasoning: boolean;
  strengths: string;
  tag: 'Recommended' | 'Reasoning' | 'High Speed' | 'Zero Hallucination' | 'Open Source';
  formatStyle: 'xml-claude' | 'json-schema-openai' | 'system-gemini' | 'cot-deepseek' | 'compact-llama';
}

export type PromptOptimizationMode = 'full-context' | 'token-economy' | 'security-hardened' | 'tdd-verification';

// ==========================================
// 10. Cross-Role Project Memory & Change Rationale System
// ==========================================

export type MemoryEventType =
  | 'created'
  | 'changed'
  | 'decision'
  | 'approved'
  | 'rejected'
  | 'tested'
  | 'released'
  | 'incident'
  | 'rolled-back'
  | 'deprecated'
  | 'superseded'
  | 'validated'
  | 'reopened';

export type MemoryState =
  | 'proposed'
  | 'active'
  | 'validated'
  | 'superseded'
  | 'rolled-back'
  | 'deprecated'
  | 'rejected'
  | 'blocked'
  | 'unknown';

export interface MemoryFieldChange {
  field: string;
  label: string;
  before?: string;
  after?: string;
}

export interface MemoryMetricImpact {
  metric: string;
  before?: number;
  after?: number;
  delta?: number;
  unit?: string;
  direction?: 'positive' | 'negative' | 'neutral' | 'unknown';
  measurementWindow?: string;
  source?: string;
}

export interface MemoryLink {
  entityType: string;
  entityId: string;
  label: string;
  targetSection?: NavSection;
}

export interface ProjectMemoryEvent {
  id: string;
  eventType: MemoryEventType;
  state: MemoryState;
  title: string;
  summary: string;

  // What changed
  entityType: string;
  entityId: string;
  entityLabel: string;
  fieldChanges?: MemoryFieldChange[];

  // Why / decision context
  whyChanged?: string;
  decision?: string;
  alternativesConsidered?: string[];
  evidence?: string[];

  // Impact
  expectedImpact?: string;
  observedImpact?: MemoryMetricImpact[];
  impactSummary?: string;

  // Ownership / chronology
  author: string;
  role: RoleType | string;
  occurredAt: string;

  // Relationships & Lineage
  links?: MemoryLink[];
  previousMemoryEventId?: string;
  supersedesMemoryEventId?: string;
  supersededByEventId?: string;

  // Truthfulness / data provenance
  source: 'manual' | 'system' | 'seed';
  rationaleRecorded: boolean;
}

// ==========================================
// Platform Connectors & Ingestion Types
// ==========================================
export type ConnectorPlatform = 'github' | 'google-meet' | 'zoom' | 'teams' | 'figma' | 'customer-signals';

export interface DataConnector {
  id: ConnectorPlatform;
  name: string;
  category: 'code' | 'meetings' | 'design' | 'feedback';
  description: string;
  status: 'connected' | 'disconnected' | 'syncing';
  connectedAccount?: string;
  lastSyncedAt?: string;
  metadata?: Record<string, any>;
  stats?: {
    filesCount?: number;
    branchesCount?: number;
    mergedPRsCount?: number;
    openPRsCount?: number;
    transcriptsCount?: number;
    decisionsCount?: number;
  };
}


