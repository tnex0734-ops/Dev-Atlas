import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import {
  RoleType,
  NavSection,
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
  DesignAnnotation,
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
  SecurityGateResult,
  ProjectWorkspace,
  LLMModelTarget,
  PromptOptimizationMode,
  ProjectMemoryEvent,
  MemoryState,
  ProjectMeeting,
} from '../types';
import {
  initialMetrics,
  initialFeedback,
  initialProblemClusters,
  initialFeatureRequests,
  initialInsights,
  initialPRDs,
  initialFeatures,
  initialRoadmap,
  initialResearchSessions,
  initialUXFindings,
  initialPersonas,
  initialValidationSessions,
  initialDesignTokens,
  initialFigmaSpecs,
  initialDesignReviews,
  initialDevTasks,
  initialSprintFeatures,
  initialSandboxBuilds,
  initialQATestCases,
  initialBugItems,
  initialReadinessChecks,
  initialReleases,
  initialIncidents,
  initialMaintenance,
  initialContextBlocks,
  initialSecondBrainNotes,
  initialFileVault,
  initialDecisions,
  initialSecurityAssessments,
  initialSecurityFindings,
  initialSecurityEvidence,
  initialSecurityScanEvents,
  initialWorkspaces,
  initialLLMModels,
  initialMemoryEvents,
  initialMeetings,
} from '../data/initialSeedData';
import { securityService } from '../security/services/securityService';
import { evaluateSecurityGate } from '../security/services/securityGate';
import { calculateSecurityMetrics } from '../security/services/securityMetrics';
import { StartAssessmentInput, SecurityAssessmentResult } from '../security/types';
import { taskRepository } from '../services/repositories/taskRepository';
import { meetingRepository } from '../services/repositories/meetingRepository';
import { decisionRepository } from '../services/repositories/decisionRepository';
import { memoryRepository } from '../services/repositories/memoryRepository';
import { projectRepository } from '../services/repositories/projectRepository';

interface ToastInfo {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error' | 'amber';
}

export interface WorkspaceInitialData {
  prds?: ProductRequirement[];
  devTasks?: DevTask[];
  contextBlocks?: ContextBlock[];
  decisions?: ProjectDecision[];
  securityFindings?: SecurityFinding[];
  securityEvidence?: SecurityEvidence[];
  feedback?: FeedbackItem[];
  problemClusters?: ProblemCluster[];
  featureRequests?: FeatureRequest[];
  strategicInsights?: StrategicInsight[];
  roadmap?: RoadmapEpic[];
  features?: ProductFeature[];
  designTokens?: DesignToken[];
  figmaSpecs?: FigmaFrameSpec[];
  validationSessions?: DesignValidationSession[];
  uxFindings?: UXFinding[];
  personas?: UserPersona[];
  designReviews?: DesignReviewThread[];
  sprintFeatures?: SprintFeature[];
  sandboxBuilds?: SandboxBuild[];
  qaTestCases?: QATestCase[];
  bugs?: BugItem[];
  readinessChecks?: ReleaseReadinessCheck[];
  releases?: ReleaseItem[];
  incidents?: IncidentItem[];
  maintenanceTasks?: MaintenanceTask[];
  meetings?: ProjectMeeting[];
  secondBrainNotes?: SecondBrainNote[];
  metrics?: Partial<ProjectMetrics>;
}

interface ProjectContextType {
  // Workspaces
  workspaces: ProjectWorkspace[];
  activeWorkspace: ProjectWorkspace;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (
    workspace: Omit<ProjectWorkspace, 'id' | 'createdAt' | 'healthScore'>,
    initialData?: WorkspaceInitialData
  ) => void;

  // LLM targets
  llmModels: LLMModelTarget[];
  activeLLMModel: LLMModelTarget;
  setActiveLLMModel: (model: LLMModelTarget) => void;
  promptOptimizationMode: PromptOptimizationMode;
  setPromptOptimizationMode: (mode: PromptOptimizationMode) => void;

  // Navigation & Role
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  selectRole: (role: RoleType) => void;
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;

  // Modals & notifications
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toasts: ToastInfo[];
  showToast: (text: string, type?: ToastInfo['type']) => void;
  removeToast: (id: string) => void;

  metrics: ProjectMetrics;

  // Feedback & requests
  feedback: FeedbackItem[];
  problemClusters: ProblemCluster[];
  featureRequests: FeatureRequest[];
  strategicInsights: StrategicInsight[];
  promoteClusterToPRD: (clusterId: string) => { prdCode: string; taskCode: string };
  upvoteFeedback: (id: string) => void;
  upvoteFeatureRequest: (id: string) => void;
  addFeedbackItem: (item: Omit<FeedbackItem, 'id' | 'date'>) => void;

  // Requirements & features
  prds: ProductRequirement[];
  features: ProductFeature[];
  roadmap: RoadmapEpic[];
  addPRD: (prd: Omit<ProductRequirement, 'id' | 'lastUpdated'>) => void;

  // Research
  researchSessions: ResearchSession[];
  uxFindings: UXFinding[];
  personas: UserPersona[];

  // Design validation
  validationSessions: DesignValidationSession[];
  designTokens: DesignToken[];
  figmaSpecs: FigmaFrameSpec[];
  designReviews: DesignReviewThread[];
  addAnnotation: (sessionId: string, annotation: Omit<DesignAnnotation, 'id' | 'timestamp' | 'resolved'>) => void;
  resolveAnnotation: (sessionId: string, annotationId: string) => void;
  updateValidationSessionStatus: (sessionId: string, status: DesignValidationSession['status']) => void;
  addDesignReviewComment: (threadId: string, author: string, role: string, text: string) => void;

  // Tasks & builds
  devTasks: DevTask[];
  sprintFeatures: SprintFeature[];
  sandboxBuilds: SandboxBuild[];
  updateTaskStatus: (taskId: string, status: DevTask['status']) => void;
  createDevTask: (task: Omit<DevTask, 'id' | 'taskCode'>) => void;
  deleteDevTask: (taskId: string) => void;

  // QA & release
  qaTestCases: QATestCase[];
  bugs: BugItem[];
  readinessChecks: ReleaseReadinessCheck[];
  toggleQATest: (testId: string) => void;
  toggleReadinessCheck: (checkId: string) => void;
  calculateReadinessScore: () => number;
  addBugItem: (bug: Omit<BugItem, 'id' | 'bugCode' | 'detectedAt'>) => void;
  deleteBugItem: (bugId: string) => void;

  // Operations
  releases: ReleaseItem[];
  incidents: IncidentItem[];
  maintenanceTasks: MaintenanceTask[];

  // Memory & notes
  contextBlocks: ContextBlock[];
  secondBrainNotes: SecondBrainNote[];
  fileVault: FileVaultItem[];
  decisions: ProjectDecision[];
  meetings: ProjectMeeting[];
  addMeeting: (meeting: Omit<ProjectMeeting, 'id' | 'meetingCode'>) => void;
  deleteMeeting: (meetingId: string) => void;
  toggleMeetingActionItem: (meetingId: string, actionId: string, done: boolean) => void;
  addSecondBrainNote: (title: string, rawContent: string, tags: string[]) => void;
  deleteSecondBrainNote: (noteId: string) => void;
  refineNoteWithAI: (noteId: string) => void;
  logDecision: (decision: Omit<ProjectDecision, 'id' | 'decisionCode' | 'date'>) => void;
  deleteDecision: (decisionId: string) => void;
  addContextBlock: (block: Omit<ContextBlock, 'id' | 'lastUpdated'>) => void;
  deleteContextBlock: (blockId: string) => void;
  deleteFeedbackItem: (feedbackId: string) => void;

  // Security
  securityAssessments: SecurityAssessment[];
  securityFindings: SecurityFinding[];
  securityEvidence: SecurityEvidence[];
  securityScanEvents: SecurityScanEvent[];
  startSecurityAssessment: (input: StartAssessmentInput) => Promise<SecurityAssessmentResult>;
  retestFinding: (findingId: string) => Promise<void>;
  acceptFindingRisk: (findingId: string, rationale: string, approver: string, expiry?: string) => void;
  createRemediationTaskFromFinding: (findingId: string) => void;
  evaluateSecurityGateResult: () => SecurityGateResult;

  // Cross-Role Project Memory & Change Rationale
  memoryEvents: ProjectMemoryEvent[];
  selectedMemoryId: string | null;
  isMemoryDrawerOpen: boolean;
  openMemoryDrawer: (params?: { eventId?: string; entityType?: string; entityId?: string }) => void;
  closeMemoryDrawer: () => void;
  recordMemoryEvent: (event: Omit<ProjectMemoryEvent, 'id' | 'occurredAt'>) => void;
  deleteMemoryEvent: (eventId: string) => void;
  updateMemoryState: (eventId: string, state: MemoryState, supersedingEventId?: string) => void;
  getMemoryForEntity: (entityType: string, entityId: string) => ProjectMemoryEvent[];
  getMemoryTimeline: (entityType: string, entityId: string) => ProjectMemoryEvent[];
  getMemoriesByRole: (role: RoleType) => ProjectMemoryEvent[];
  getSupersedingEvent: (eventId: string) => ProjectMemoryEvent | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global Modals & Notifications State
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((text: string, type: ToastInfo['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const STORAGE_KEY_WORKSPACES = 'devatlas_workspaces_v2';
  const STORAGE_KEY_ACTIVE_WS = 'devatlas_active_ws_id';

  // Multi-Project Workspaces State with LocalStorage & Firestore Caching
  const [workspaces, setWorkspaces] = useState<ProjectWorkspace[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WORKSPACES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed
            .filter((w: ProjectWorkspace) => w.id !== 'ws-strix-sec' && w.id !== 'ws-default')
            .map((w: ProjectWorkspace) => {
              if (w.code === 'SHAD' || (w.name && w.name.toLowerCase().includes('shadcn'))) {
                return { ...w, deployedUrl: undefined, socialLinks: undefined };
              }
              return w;
            });
          const hasFlagship = sanitized.some((w: ProjectWorkspace) => w.id === 'ws-signals-flagship');
          if (!hasFlagship) {
            return [...initialWorkspaces, ...sanitized];
          }
          return sanitized;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached workspaces', e);
    }
    return initialWorkspaces;
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_WS);
    if (savedId && savedId !== 'ws-strix-sec' && workspaces.some((w) => w.id === savedId)) return savedId;
    return workspaces[0]?.id || initialWorkspaces[0].id;
  });

  // Save workspaces to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(workspaces));
    } catch (e) {
      console.warn('Failed to save workspaces to localStorage', e);
    }
  }, [workspaces]);

  // Save active workspace ID to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_WS, activeWorkspaceId);
    } catch (e) {
      console.warn('Failed to save active workspace ID', e);
    }
  }, [activeWorkspaceId]);

  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0],
    [workspaces, activeWorkspaceId]
  );

  const switchWorkspace = useCallback((workspaceId: string) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (!target) return;
    setActiveWorkspaceId(workspaceId);
    setMetrics((prev) => ({
      ...prev,
      compositeHealth: target.healthScore,
    }));

    // Load cached workspace data for target workspace
    try {
      const cached = localStorage.getItem(`devatlas_ws_${workspaceId}_data`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.prds) setPRDs(parsed.prds);
        if (parsed.devTasks) setDevTasks(parsed.devTasks);
        if (parsed.contextBlocks) setContextBlocks(parsed.contextBlocks);
        if (parsed.decisions) setDecisions(parsed.decisions);
        if (parsed.securityFindings) setSecurityFindings(parsed.securityFindings);
        if (parsed.securityEvidence) setSecurityEvidence(parsed.securityEvidence);
        if (parsed.feedback) setFeedback(parsed.feedback);
        if (parsed.problemClusters) setProblemClusters(parsed.problemClusters);
        if (parsed.featureRequests) setFeatureRequests(parsed.featureRequests);
        if (parsed.strategicInsights) setStrategicInsights(parsed.strategicInsights);
        if (parsed.roadmap) setRoadmap(parsed.roadmap);
        if (parsed.features) setFeatures(parsed.features);
        if (parsed.designTokens) setDesignTokens(parsed.designTokens);
        if (parsed.figmaSpecs) setFigmaSpecs(parsed.figmaSpecs);
        if (parsed.validationSessions) setValidationSessions(parsed.validationSessions);
        if (parsed.uxFindings) setUXFindings(parsed.uxFindings);
        if (parsed.personas) setPersonas(parsed.personas);
        if (parsed.designReviews) setDesignReviews(parsed.designReviews);
        if (parsed.sprintFeatures) setSprintFeatures(parsed.sprintFeatures);
        if (parsed.sandboxBuilds) setSandboxBuilds(parsed.sandboxBuilds);
        if (parsed.qaTestCases) setQATestCases(parsed.qaTestCases);
        if (parsed.bugs) setBugs(parsed.bugs);
        if (parsed.readinessChecks) setReadinessChecks(parsed.readinessChecks);
        if (parsed.releases) setReleases(parsed.releases);
        if (parsed.incidents) setIncidents(parsed.incidents);
        if (parsed.maintenanceTasks) setMaintenanceTasks(parsed.maintenanceTasks);
        if (parsed.meetings) setMeetings(parsed.meetings);
        if (parsed.secondBrainNotes) setSecondBrainNotes(parsed.secondBrainNotes);
        if (parsed.metrics) setMetrics((prev) => ({ ...prev, ...parsed.metrics }));
      } else if (workspaceId === 'ws-signals-flagship') {
        // Load initial rich demo data
        setPRDs(initialPRDs);
        setDevTasks(initialDevTasks);
        setContextBlocks(initialContextBlocks);
        setDecisions(initialDecisions);
        setSecurityFindings(initialSecurityFindings);
        setSecurityEvidence(initialSecurityEvidence);
        setFeedback(initialFeedback);
        setProblemClusters(initialProblemClusters);
        setFeatureRequests(initialFeatureRequests);
        setStrategicInsights(initialInsights);
        setRoadmap(initialRoadmap);
        setFeatures(initialFeatures);
        setDesignTokens(initialDesignTokens);
        setFigmaSpecs(initialFigmaSpecs);
        setValidationSessions(initialValidationSessions);
        setUXFindings(initialUXFindings);
        setPersonas(initialPersonas);
        setDesignReviews(initialDesignReviews);
        setSprintFeatures(initialSprintFeatures);
        setSandboxBuilds(initialSandboxBuilds);
        setQATestCases(initialQATestCases);
        setBugs(initialBugItems);
        setReadinessChecks(initialReadinessChecks);
        setReleases(initialReleases);
        setIncidents(initialIncidents);
        setMaintenanceTasks(initialMaintenance);
        setMeetings(initialMeetings);
        setSecondBrainNotes(initialSecondBrainNotes);
        setMetrics(initialMetrics);
      }
    } catch (e) {
      console.warn('Failed to load cached workspace data', e);
    }

    showToast(`Switched workspace to ${target.name} (${target.code} ${target.version})`, 'info');
  }, [workspaces, showToast]);

  const createWorkspace = useCallback(
    (
      newWsData: Omit<ProjectWorkspace, 'id' | 'createdAt' | 'healthScore'>,
      initialData?: WorkspaceInitialData
    ) => {
      const newWs: ProjectWorkspace = {
        ...newWsData,
        id: `ws-${Date.now()}`,
        healthScore: initialData?.metrics?.compositeHealth ?? 94,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setWorkspaces((prev) => {
        const filtered = prev.filter((w) => w.id !== 'ws-default');
        const updated = [...filtered, newWs];
        try {
          localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      setActiveWorkspaceId(newWs.id);

      const prdItems = initialData?.prds || [];
      const taskItems = initialData?.devTasks || [];
      const ctxItems = initialData?.contextBlocks || [];
      const decItems = initialData?.decisions || [];
      const secItems = initialData?.securityFindings || [];
      const evItems = initialData?.securityEvidence || [];
      const fbItems = initialData?.feedback || [];
      const clusterItems = initialData?.problemClusters || [];
      const frItems = initialData?.featureRequests || [];
      const insightItems = initialData?.strategicInsights || [];
      const roadmapItems = initialData?.roadmap || [];
      const featItems = initialData?.features || [];
      const tokenItems = initialData?.designTokens || [];
      const figmaItems = initialData?.figmaSpecs || [];
      const valItems = initialData?.validationSessions || [];
      const uxfItems = initialData?.uxFindings || [];
      const persItems = initialData?.personas || [];
      const drevItems = initialData?.designReviews || [];
      const spfItems = initialData?.sprintFeatures || [];
      const bldItems = initialData?.sandboxBuilds || [];
      const qaItems = initialData?.qaTestCases || [];
      const bugItems = initialData?.bugs || [];
      const rcItems = initialData?.readinessChecks || [];
      const relItems = initialData?.releases || [];
      const incItems = initialData?.incidents || [];
      const maintItems = initialData?.maintenanceTasks || [];
      const mtgItems = initialData?.meetings || [];
      const noteItems = initialData?.secondBrainNotes || [];

      // Set active in-memory state
      setPRDs(prdItems);
      setDevTasks(taskItems);
      setContextBlocks(ctxItems);
      setDecisions(decItems);
      setSecurityFindings(secItems);
      setSecurityEvidence(evItems);
      setFeedback(fbItems);
      setProblemClusters(clusterItems);
      setFeatureRequests(frItems);
      setStrategicInsights(insightItems);
      setRoadmap(roadmapItems);
      setFeatures(featItems);
      setDesignTokens(tokenItems);
      setFigmaSpecs(figmaItems);
      setValidationSessions(valItems);
      setUXFindings(uxfItems);
      setPersonas(persItems);
      setDesignReviews(drevItems);
      setSprintFeatures(spfItems);
      setSandboxBuilds(bldItems);
      setQATestCases(qaItems);
      setBugs(bugItems);
      setReadinessChecks(rcItems);
      setReleases(relItems);
      setIncidents(incItems);
      setMaintenanceTasks(maintItems);
      setMeetings(mtgItems);
      setSecondBrainNotes(noteItems);
      if (initialData?.metrics) {
        setMetrics((prev) => ({
          ...prev,
          ...initialData.metrics,
          compositeHealth: newWs.healthScore,
        }));
      }

      // Cache locally in localStorage
      try {
        localStorage.setItem(
          `devatlas_ws_${newWs.id}_data`,
          JSON.stringify({
            prds: prdItems,
            devTasks: taskItems,
            contextBlocks: ctxItems,
            decisions: decItems,
            securityFindings: secItems,
            securityEvidence: evItems,
            feedback: fbItems,
            problemClusters: clusterItems,
            featureRequests: frItems,
            strategicInsights: insightItems,
            roadmap: roadmapItems,
            features: featItems,
            designTokens: tokenItems,
            figmaSpecs: figmaItems,
            validationSessions: valItems,
            uxFindings: uxfItems,
            personas: persItems,
            designReviews: drevItems,
            sprintFeatures: spfItems,
            sandboxBuilds: bldItems,
            qaTestCases: qaItems,
            bugs: bugItems,
            readinessChecks: rcItems,
            releases: relItems,
            incidents: incItems,
            maintenanceTasks: maintItems,
            meetings: mtgItems,
            secondBrainNotes: noteItems,
            metrics: initialData?.metrics,
          })
        );
      } catch (e) {
        console.warn('Failed to cache workspace data in localStorage', e);
      }

      showToast(`Ingested real repository & deployed intelligence for ${newWs.name} (${newWs.code})!`, 'success');
    },
    [showToast]
  );

  // Multi-LLM Model Target State
  const [llmModels] = useState<LLMModelTarget[]>(initialLLMModels);
  const [activeLLMModelId, setActiveLLMModelId] = useState<string>(initialLLMModels[0].id);
  const [promptOptimizationMode, setPromptOptimizationMode] = useState<PromptOptimizationMode>('full-context');

  const activeLLMModel = useMemo(
    () => llmModels.find((m) => m.id === activeLLMModelId) || llmModels[0],
    [llmModels, activeLLMModelId]
  );

  const setActiveLLMModel = useCallback((model: LLMModelTarget) => {
    setActiveLLMModelId(model.id);
    showToast(`Prompt target optimized for ${model.name} (${model.providerName})`, 'info');
  }, [showToast]);

  // Navigation & Role State with URL search params support
  const [activeRole, setActiveRole] = useState<RoleType>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const role = params.get('role') as RoleType;
      if (role && ['all', 'pm', 'designer', 'dev', 'qa', 'ops', 'memory'].includes(role)) {
        return role;
      }
    } catch (e) {}
    return 'pm';
  });

  const [activeSection, setActiveSection] = useState<NavSection>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get('section') as NavSection;
      if (sec) return sec;
    } catch (e) {}
    return 'feedback';
  });

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Sync role and section to URL query parameters
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('role', activeRole);
      url.searchParams.set('section', activeSection);
      window.history.replaceState({}, '', url.toString());
    } catch (e) {}
  }, [activeRole, activeSection]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const selectRole = useCallback((role: RoleType) => {
    setActiveRole(role);
    setSidebarOpen(true);

    const roleDefaultSections: Record<RoleType, NavSection> = {
      all: 'overview',
      pm: 'requirements',
      designer: 'validation',
      dev: 'tasks',
      qa: 'security',
      ops: 'product-health',
      memory: 'context',
    };

    const roleSections: Record<RoleType, NavSection[]> = {
      all: [
        'overview', 'product-health', 'roadmap', 'meetings', 'features', 'requirements',
        'feedback', 'user-issues', 'feature-requests', 'insights',
        'context', 'notes', 'files', 'decisions', 'project-memory',
      ],
      pm: [
        'overview', 'product-health', 'roadmap', 'meetings', 'features', 'requirements',
        'feedback', 'user-issues', 'feature-requests', 'insights',
        'context', 'notes', 'files', 'decisions', 'project-memory',
      ],
      designer: [
        'research', 'findings', 'user-patterns',
        'validation', 'designs', 'figma', 'reviews', 'meetings', 'project-memory',
      ],
      dev: [
        'tasks', 'dev-features', 'builds', 'prompts',
        'validation', 'context', 'meetings', 'project-memory',
      ],
      qa: [
        'security', 'qa-status', 'bugs', 'release-readiness', 'project-memory',
      ],
      ops: [
        'product-health', 'releases', 'incidents', 'maintenance', 'project-memory',
      ],
      memory: [
        'context', 'notes', 'files', 'decisions', 'project-memory',
      ],
    };

    setActiveSection((current) => {
      // If user is currently on the shared Project Memory Ledger, keep them there!
      if (current === 'project-memory') {
        return 'project-memory';
      }
      return roleDefaultSections[role] || 'overview';
    });
  }, []);

  // Domain States
  const [metrics, setMetrics] = useState<ProjectMetrics>(initialMetrics);
  const [feedback, setFeedback] = useState<FeedbackItem[]>(() => {
    try {
      const cached = localStorage.getItem(`devatlas_ws_${activeWorkspaceId}_data`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed.feedback) && parsed.feedback.length >= initialFeedback.length) {
          return parsed.feedback;
        }
      }
    } catch (e) {}
    return initialFeedback;
  });
  const [problemClusters, setProblemClusters] = useState<ProblemCluster[]>(initialProblemClusters);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(initialFeatureRequests);
  const [strategicInsights, setStrategicInsights] = useState<StrategicInsight[]>(initialInsights);
  const [prds, setPRDs] = useState<ProductRequirement[]>(initialPRDs);
  const [features, setFeatures] = useState<ProductFeature[]>(initialFeatures);
  const [roadmap, setRoadmap] = useState<RoadmapEpic[]>(initialRoadmap);
  const [researchSessions, setResearchSessions] = useState<ResearchSession[]>(initialResearchSessions);
  const [uxFindings, setUXFindings] = useState<UXFinding[]>(initialUXFindings);
  const [personas, setPersonas] = useState<UserPersona[]>(initialPersonas);
  const [validationSessions, setValidationSessions] = useState<DesignValidationSession[]>(initialValidationSessions);
  const [designTokens, setDesignTokens] = useState<DesignToken[]>(initialDesignTokens);
  const [figmaSpecs, setFigmaSpecs] = useState<FigmaFrameSpec[]>(initialFigmaSpecs);
  const [designReviews, setDesignReviews] = useState<DesignReviewThread[]>(initialDesignReviews);
  const [devTasks, setDevTasks] = useState<DevTask[]>(initialDevTasks);
  const [sprintFeatures, setSprintFeatures] = useState<SprintFeature[]>(initialSprintFeatures);
  const [sandboxBuilds, setSandboxBuilds] = useState<SandboxBuild[]>(initialSandboxBuilds);
  const [qaTestCases, setQATestCases] = useState<QATestCase[]>(initialQATestCases);
  const [bugs, setBugs] = useState<BugItem[]>(initialBugItems);
  const [readinessChecks, setReadinessChecks] = useState<ReleaseReadinessCheck[]>(initialReadinessChecks);
  const [releases, setReleases] = useState<ReleaseItem[]>(initialReleases);
  const [incidents, setIncidents] = useState<IncidentItem[]>(initialIncidents);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(initialMaintenance);
  const [contextBlocks, setContextBlocks] = useState<ContextBlock[]>(initialContextBlocks);
  const [decisions, setDecisions] = useState<ProjectDecision[]>(initialDecisions);
  const [meetings, setMeetings] = useState<ProjectMeeting[]>(initialMeetings);
  const [secondBrainNotes, setSecondBrainNotes] = useState<SecondBrainNote[]>(initialSecondBrainNotes);
  const [fileVault, setFileVault] = useState<FileVaultItem[]>(initialFileVault);

  // Security Intelligence Layer State
  const [securityAssessments, setSecurityAssessments] = useState<SecurityAssessment[]>(initialSecurityAssessments);
  const [securityFindings, setSecurityFindings] = useState<SecurityFinding[]>(initialSecurityFindings);
  const [securityEvidence, setSecurityEvidence] = useState<SecurityEvidence[]>(initialSecurityEvidence);
  const [securityScanEvents, setSecurityScanEvents] = useState<SecurityScanEvent[]>(initialSecurityScanEvents);

  // Cross-Role Project Memory & Change Rationale State
  const [memoryEvents, setMemoryEvents] = useState<ProjectMemoryEvent[]>(initialMemoryEvents);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [isMemoryDrawerOpen, setIsMemoryDrawerOpen] = useState(false);

  const openMemoryDrawer = useCallback(
    (params?: { eventId?: string; entityType?: string; entityId?: string }) => {
      if (params?.eventId) {
        setSelectedMemoryId(params.eventId);
      } else if (params?.entityType && params?.entityId) {
        const normType = params.entityType.toLowerCase();
        const normId = params.entityId.toLowerCase();
        const found = memoryEvents.find(
          (m) =>
            (m.entityType.toLowerCase() === normType && m.entityId.toLowerCase() === normId) ||
            m.links?.some(
              (l) => l.entityType.toLowerCase() === normType && l.entityId.toLowerCase() === normId
            )
        );
        setSelectedMemoryId(found ? found.id : memoryEvents[0]?.id || null);
      } else {
        setSelectedMemoryId(memoryEvents[0]?.id || null);
      }
      setIsMemoryDrawerOpen(true);
    },
    [memoryEvents]
  );

  const closeMemoryDrawer = useCallback(() => {
    setIsMemoryDrawerOpen(false);
    setSelectedMemoryId(null);
  }, []);

  // Real-time Firestore subscriptions for active project
  useEffect(() => {
    if (!activeWorkspaceId) return;

    const unsubTasks = taskRepository.subscribeToTasks(activeWorkspaceId, (remoteTasks) => {
      if (remoteTasks && remoteTasks.length > 0) {
        setDevTasks(remoteTasks);
      }
    });

    const unsubMeetings = meetingRepository.subscribeToMeetings(activeWorkspaceId, (remoteMeetings) => {
      if (remoteMeetings && remoteMeetings.length > 0) {
        setMeetings(remoteMeetings);
      }
    });

    const unsubDecisions = decisionRepository.subscribeToDecisions(activeWorkspaceId, (remoteDecisions) => {
      if (remoteDecisions && remoteDecisions.length > 0) {
        setDecisions(remoteDecisions);
      }
    });

    const unsubMemory = memoryRepository.subscribeToMemory(activeWorkspaceId, (remoteMemories) => {
      if (remoteMemories && remoteMemories.length > 0) {
        setMemoryEvents(remoteMemories);
      }
    });

    return () => {
      unsubTasks();
      unsubMeetings();
      unsubDecisions();
      unsubMemory();
    };
  }, [activeWorkspaceId]);

  const recordMemoryEvent = useCallback(
    (event: Omit<ProjectMemoryEvent, 'id' | 'occurredAt'>) => {
      const newEvent: ProjectMemoryEvent = {
        ...event,
        id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        occurredAt: new Date().toISOString().split('T')[0],
      };
      setMemoryEvents((prev) => [newEvent, ...prev]);
      memoryRepository.saveMemoryEvent(activeWorkspaceId, newEvent).catch((err) =>
        console.warn('[ProjectContext] Firestore save memoryEvent error:', err)
      );
      showToast(`Memory recorded: ${newEvent.title}`, 'info');
    },
    [activeWorkspaceId, showToast]
  );

  const updateMemoryState = useCallback(
    (eventId: string, state: MemoryState, supersedingEventId?: string) => {
      setMemoryEvents((prev) =>
        prev.map((m) =>
          m.id === eventId
            ? {
                ...m,
                state,
                supersededByEventId: supersedingEventId || m.supersededByEventId,
              }
            : m
        )
      );
      showToast(`Memory status updated to ${state.toUpperCase()}`, 'info');
    },
    [showToast]
  );

  const getMemoryForEntity = useCallback(
    (entityType: string, entityId: string) => {
      const normType = entityType.toLowerCase();
      const normId = entityId.toLowerCase();
      return memoryEvents.filter(
        (m) =>
          (m.entityType.toLowerCase() === normType && m.entityId.toLowerCase() === normId) ||
          m.links?.some(
            (l) => l.entityType.toLowerCase() === normType && l.entityId.toLowerCase() === normId
          )
      );
    },
    [memoryEvents]
  );

  const getMemoryTimeline = useCallback(
    (entityType: string, entityId: string) => {
      const matches = getMemoryForEntity(entityType, entityId);
      return [...matches].sort(
        (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
      );
    },
    [getMemoryForEntity]
  );

  const getMemoriesByRole = useCallback(
    (role: RoleType) => {
      if (role === 'all' || role === 'memory') return memoryEvents;
      return memoryEvents.filter((m) => m.role === role);
    },
    [memoryEvents]
  );

  const getSupersedingEvent = useCallback(
    (eventId: string) => {
      const current = memoryEvents.find((m) => m.id === eventId);
      if (!current) return undefined;
      if (current.supersededByEventId) {
        return memoryEvents.find((m) => m.id === current.supersededByEventId);
      }
      return memoryEvents.find((m) => m.supersedesMemoryEventId === eventId);
    },
    [memoryEvents]
  );


  // 1. Cluster to PRD & Task Promotion Pipeline
  const promoteClusterToPRD = useCallback((clusterId: string) => {
    const cluster = problemClusters.find((c) => c.id === clusterId);
    if (!cluster) return { prdCode: '', taskCode: '' };

    const newReqNumber = 108 + prds.length;
    const prdCode = `PRD-${newReqNumber}`;
    const taskCode = `DEV-${420 + devTasks.length}`;

    // Create PRD
    const newPRD: ProductRequirement = {
      id: `prd-${newReqNumber}`,
      reqCode: prdCode,
      title: `${cluster.title} (Auto-Generated from Cluster)`,
      clusterId: cluster.id,
      originFeedbackCount: cluster.userCount,
      problemStatement: cluster.aiSummary,
      businessImpact: cluster.aiInsight.velocityNote,
      userStories: [
        `As an affected user on ${cluster.platform}, I want ${cluster.title.toLowerCase()} to be resolved smoothly.`,
        `As a platform engineer, I want automated resilience so edge errors trigger graceful fallbacks.`,
      ],
      acceptanceCriteria: [
        `Likely cause resolved: ${cluster.aiInsight.likelyCause}`,
        `Recommended mitigation applied: ${cluster.aiInsight.recommendedAction}`,
        `Zero regressions on ${cluster.platform} target release.`,
      ],
      priority: cluster.severity === 'critical' ? 'P0' : cluster.severity === 'high' ? 'P1' : 'P2',
      targetRelease: 'v1.0.0',
      stage: 'In Development',
      leadPM: cluster.owner || 'Product Lead',
      leadDesigner: 'Design Systems Lead',
      leadDev: 'Principal Software Architect',
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    // Create Dev Task
    const newTask: DevTask = {
      id: `task-${Date.now()}`,
      taskCode,
      title: `Fix ${cluster.title}`,
      requirementId: newPRD.id,
      requirementTitle: `${prdCode}: ${newPRD.title}`,
      status: 'todo',
      priority: newPRD.priority,
      assignee: {
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        role: 'Lead Developer',
      },
      contextSummary: cluster.aiInsight.recommendedAction,
      techStackTags: ['TypeScript', 'Resilience', cluster.platform],
    };

    // Update States
    setPRDs((prev) => [newPRD, ...prev]);
    setDevTasks((prev) => [newTask, ...prev]);
    setProblemClusters((prev) =>
      prev.map((c) => (c.id === clusterId ? { ...c, status: 'promoted', relatedTaskId: taskCode } : c))
    );
    setMetrics((prev) => ({
      ...prev,
      openPRDCount: prev.openPRDCount + 1,
    }));

    showToast(`Cluster successfully promoted to ${prdCode} & Task ${taskCode}!`, 'success');
    return { prdCode, taskCode };
  }, [problemClusters, prds.length, devTasks.length, showToast]);

  // Feedback upvoting & additions
  const upvoteFeedback = useCallback((id: string) => {
    setFeedback((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, upvotes: (fb.upvotes || 0) + 1 } : fb))
    );
    showToast('Feedback upvoted', 'info');
  }, [showToast]);

  const upvoteFeatureRequest = useCallback((id: string) => {
    setFeatureRequests((prev) =>
      prev.map((fr) => (fr.id === id ? { ...fr, requesterCount: fr.requesterCount + 1 } : fr))
    );
    showToast('Feature request upvoted (+1 requester)', 'amber');
  }, [showToast]);

  const addFeedbackItem = useCallback((item: Omit<FeedbackItem, 'id' | 'date'>) => {
    const newItem: FeedbackItem = {
      ...item,
      id: `fb-${Date.now()}`,
      date: 'Just now',
      upvotes: 1,
    };
    setFeedback((prev) => [newItem, ...prev]);
    showToast('New user feedback logged to stream', 'success');
  }, [showToast]);

  const addPRD = useCallback((prd: Omit<ProductRequirement, 'id' | 'lastUpdated'>) => {
    const newPRD: ProductRequirement = {
      ...prd,
      id: `prd-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setPRDs((prev) => [newPRD, ...prev]);
    showToast(`Created PRD ${newPRD.reqCode}`, 'success');
  }, [showToast]);

  // 2. Validation Studio Annotations & Status
  const addAnnotation = useCallback((
    sessionId: string,
    annotation: Omit<DesignAnnotation, 'id' | 'timestamp' | 'resolved'>
  ) => {
    const newAnnotation: DesignAnnotation = {
      ...annotation,
      id: `ann-${Date.now()}`,
      timestamp: 'Just now',
      resolved: false,
    };

    setValidationSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedAnnotations = [...session.annotations, newAnnotation];
          return {
            ...session,
            mismatchCount: updatedAnnotations.filter((a) => !a.resolved).length,
            annotations: updatedAnnotations,
            history: [
              {
                date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString().slice(0, 5),
                action: 'Discrepancy Pin Added',
                author: annotation.author,
                role: annotation.authorRole,
                comment: annotation.text,
              },
              ...session.history,
            ],
          };
        }
        return session;
      })
    );

    setMetrics((prev) => ({
      ...prev,
      unresolvedVisualMismatches: prev.unresolvedVisualMismatches + 1,
    }));

    showToast(`Visual discrepancy pinned (${annotation.type})`, 'amber');
  }, [showToast]);

  const resolveAnnotation = useCallback((sessionId: string, annotationId: string) => {
    setValidationSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const updatedAnnotations = session.annotations.map((a) =>
            a.id === annotationId ? { ...a, resolved: true } : a
          );
          return {
            ...session,
            mismatchCount: updatedAnnotations.filter((a) => !a.resolved).length,
            annotations: updatedAnnotations,
          };
        }
        return session;
      })
    );

    setMetrics((prev) => ({
      ...prev,
      unresolvedVisualMismatches: Math.max(0, prev.unresolvedVisualMismatches - 1),
    }));

    showToast('Design pin marked as resolved', 'success');
  }, [showToast]);

  const updateValidationSessionStatus = useCallback((
    sessionId: string,
    status: DesignValidationSession['status']
  ) => {
    setValidationSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            status,
            history: [
              {
                date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString().slice(0, 5),
                action: `Status changed to ${status}`,
                author: 'Project Maintainer',
                role: 'Team Lead',
              },
              ...session.history,
            ],
          };
        }
        return session;
      })
    );
    showToast(`Validation session status updated: ${status}`, 'info');
  }, [showToast]);

  const addDesignReviewComment = useCallback((
    threadId: string,
    author: string,
    role: string,
    text: string
  ) => {
    setDesignReviews((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            commentsCount: thread.commentsCount + 1,
            lastActivity: 'Just now',
            comments: [
              ...thread.comments,
              {
                id: `c-${Date.now()}`,
                author,
                role,
                time: 'Just now',
                text,
              },
            ],
          };
        }
        return thread;
      })
    );
    showToast('Comment posted to design review', 'success');
  }, [showToast]);

  // 3. Engineering Execution
  const updateTaskStatus = useCallback((taskId: string, status: DevTask['status']) => {
    setDevTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    taskRepository.updateTaskStatus(activeWorkspaceId, taskId, status).catch((err) =>
      console.warn('[ProjectContext] Firestore updateTaskStatus error:', err)
    );
    showToast(`Task status updated to ${status.toUpperCase()}`, 'info');
  }, [activeWorkspaceId, showToast]);

  const createDevTask = useCallback((task: Omit<DevTask, 'id' | 'taskCode'>) => {
    const taskCode = `DEV-${425 + devTasks.length}`;
    const newTask: DevTask = {
      ...task,
      id: `task-${Date.now()}`,
      taskCode,
    };
    setDevTasks((prev) => [newTask, ...prev]);
    taskRepository.saveTask(activeWorkspaceId, newTask).catch((err) =>
      console.warn('[ProjectContext] Firestore saveTask error:', err)
    );
    showToast(`Dev Task ${taskCode} created!`, 'success');
  }, [activeWorkspaceId, devTasks.length, showToast]);

  const deleteDevTask = useCallback((taskId: string) => {
    const task = devTasks.find((t) => t.id === taskId);
    setDevTasks((prev) => prev.filter((t) => t.id !== taskId));
    taskRepository.deleteTask(activeWorkspaceId, taskId).catch((err) =>
      console.warn('[ProjectContext] Firestore deleteTask error:', err)
    );
    showToast(`Task ${task?.taskCode || taskId} deleted`, 'info');
  }, [activeWorkspaceId, devTasks, showToast]);

  // 4. QA & Release Readiness
  const toggleQATest = useCallback((testId: string) => {
    setQATestCases((prev) => {
      const updated = prev.map((tc) => {
        if (tc.id === testId) {
          const nextStatus: QATestCase['status'] = tc.status === 'Passed' ? 'Failed' : 'Passed';
          return { ...tc, status: nextStatus, lastRun: 'Just now' };
        }
        return tc;
      });

      const passed = updated.filter((t) => t.status === 'Passed').length;
      const passRate = updated.length > 0 ? Math.round((passed / updated.length) * 100) : 100;
      setMetrics((m) => ({ ...m, qaPassRate: passRate }));

      return updated;
    });
    showToast('QA Test case toggled', 'info');
  }, [showToast]);

  const toggleReadinessCheck = useCallback((checkId: string) => {
    setReadinessChecks((prev) =>
      prev.map((rc) => (rc.id === checkId ? { ...rc, isMet: !rc.isMet } : rc))
    );
    showToast('Release readiness check toggled', 'info');
  }, [showToast]);

  const calculateReadinessScore = useCallback(() => {
    const totalWeight = readinessChecks.reduce((sum, c) => sum + c.scoreWeight, 0);
    if (totalWeight === 0) return 100;
    const earned = readinessChecks
      .filter((c) => c.isMet)
      .reduce((sum, c) => sum + c.scoreWeight, 0);
    return Math.round((earned / totalWeight) * 100);
  }, [readinessChecks]);

  const addBugItem = useCallback((bug: Omit<BugItem, 'id' | 'bugCode' | 'detectedAt'>) => {
    const bugCode = `BUG-${205 + bugs.length}`;
    const newBug: BugItem = {
      ...bug,
      id: `bug-${Date.now()}`,
      bugCode,
      detectedAt: 'Just now',
    };
    setBugs((prev) => [newBug, ...prev]);
    if (bug.severity === 'Critical P0') {
      setMetrics((m) => ({ ...m, activeP0Issues: m.activeP0Issues + 1 }));
    }
    showToast(`Bug logged: ${bugCode}`, 'error');
  }, [bugs.length, showToast]);

  const deleteBugItem = useCallback((bugId: string) => {
    const bug = bugs.find((b) => b.id === bugId);
    setBugs((prev) => prev.filter((b) => b.id !== bugId));
    showToast(`Bug ${bug?.bugCode || bugId} deleted`, 'info');
  }, [bugs, showToast]);

  // 5. Persistent Project Memory OS
  const addSecondBrainNote = useCallback((title: string, rawContent: string, tags: string[]) => {
    const newNote: SecondBrainNote = {
      id: `note-${Date.now()}`,
      title,
      rawContent,
      updatedAt: 'Just now',
      isRefined: false,
      tags,
    };
    setSecondBrainNotes((prev) => [newNote, ...prev]);
    setMetrics((prev) => ({ ...prev, unrefinedNotesCount: prev.unrefinedNotesCount + 1 }));
    showToast('Quick note saved to Second Brain', 'success');
  }, [showToast]);

  const refineNoteWithAI = useCallback((noteId: string) => {
    const note = secondBrainNotes.find((n) => n.id === noteId);
    if (!note) return;

    // Simulate AI synthesis based on raw content
    const refined: SecondBrainNote['refinedContent'] = {
      summary: `AI Executive Synthesis: ${note.title}. Distilled from developer scratchpad into high-signal architectural constraints.`,
      keyPoints: [
        `Identified core logic: ${note.rawContent.slice(0, 80)}...`,
        'Extracted architectural constraints and error guard rails.',
        'Validated against active PRD specifications and Ember Studio design tokens.',
      ],
      technicalTakeaways: [
        'Enforce idempotent promise handlers with explicit timeout limits.',
        'Wrap asynchronous state changes in resilient finite state machines.',
        'Preserve Ember Studio token consistency (#C2410C terracotta primary, #F59E0B amber accent).',
      ],
      actionItems: [
        'Promote critical takeaway into Context Block repository.',
        'Link relevant acceptance criteria to active developer sprint tasks.',
      ],
    };

    setSecondBrainNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, isRefined: true, refinedContent: refined, updatedAt: 'Just now' } : n
      )
    );

    setMetrics((prev) => ({
      ...prev,
      unrefinedNotesCount: Math.max(0, prev.unrefinedNotesCount - 1),
    }));

    showToast('Note refined with AI into structured spec!', 'amber');
  }, [secondBrainNotes, showToast]);

  const logDecision = useCallback((decision: Omit<ProjectDecision, 'id' | 'decisionCode' | 'date'>) => {
    const isTechnical = decision.decisionType === 'technical' || decision.category === 'Architecture' || decision.category === 'Operations';
    const prefix = isTechnical ? 'ADR' : 'DEC';
    const decisionCode = `${prefix}-${104 + decisions.length}`;
    const newDecision: ProjectDecision = {
      ...decision,
      decisionType: decision.decisionType || (isTechnical ? 'technical' : 'verbal'),
      id: `dec-${Date.now()}`,
      decisionCode,
      date: new Date().toISOString().split('T')[0],
    };
    setDecisions((prev) => [newDecision, ...prev]);
    decisionRepository.saveDecision(activeWorkspaceId, newDecision).catch((err) =>
      console.warn('[ProjectContext] Firestore logDecision error:', err)
    );
    showToast(
      isTechnical
        ? `Architectural Decision ${decisionCode} permanently recorded (Technical ADR)`
        : `Team Agreement ${decisionCode} recorded (Verbal Decision)`,
      'success'
    );
  }, [activeWorkspaceId, decisions.length, showToast]);

  const addMeeting = useCallback((meetingData: Omit<ProjectMeeting, 'id' | 'meetingCode'>) => {
    const meetingCode = `MTG-${String(meetings.length + 25).padStart(3, '0')}`;
    const newMeeting: ProjectMeeting = {
      ...meetingData,
      id: `meet-${Date.now()}`,
      meetingCode,
    };
    setMeetings((prev) => [newMeeting, ...prev]);
    meetingRepository.saveMeeting(activeWorkspaceId, newMeeting).catch((err) =>
      console.warn('[ProjectContext] Firestore addMeeting error:', err)
    );
    showToast(`Recorded meeting ${meetingCode}: ${newMeeting.title}`, 'success');
  }, [activeWorkspaceId, meetings.length, showToast]);

  const deleteMeeting = useCallback((meetingId: string) => {
    const meeting = meetings.find((m) => m.id === meetingId);
    setMeetings((prev) => prev.filter((m) => m.id !== meetingId));
    meetingRepository.deleteMeeting(activeWorkspaceId, meetingId).catch((err) =>
      console.warn('[ProjectContext] Firestore deleteMeeting error:', err)
    );
    showToast(`Meeting ${meeting?.meetingCode || meetingId} deleted`, 'info');
  }, [activeWorkspaceId, meetings, showToast]);

  const toggleMeetingActionItem = useCallback((meetingId: string, actionId: string, done: boolean) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== meetingId) return m;
        const updated = {
          ...m,
          actionItems: m.actionItems.map((a) => (a.id === actionId ? { ...a, done } : a)),
        };
        meetingRepository.toggleActionItem(activeWorkspaceId, meetingId, actionId, done, m).catch((err) =>
          console.warn('[ProjectContext] Firestore toggleMeetingActionItem error:', err)
        );
        return updated;
      })
    );
  }, [activeWorkspaceId]);

  const addContextBlock = useCallback((block: Omit<ContextBlock, 'id' | 'lastUpdated'>) => {
    const newBlock: ContextBlock = {
      ...block,
      id: `ctx-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setContextBlocks((prev) => [newBlock, ...prev]);
    showToast('New Context Block added to Project Memory', 'success');
  }, [showToast]);

  const deleteContextBlock = useCallback((blockId: string) => {
    setContextBlocks((prev) => prev.filter((b) => b.id !== blockId));
    showToast('Context Block deleted', 'info');
  }, [showToast]);

  const deleteSecondBrainNote = useCallback((noteId: string) => {
    const note = secondBrainNotes.find((n) => n.id === noteId);
    setSecondBrainNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (note && !note.isRefined) {
      setMetrics((prev) => ({ ...prev, unrefinedNotesCount: Math.max(0, prev.unrefinedNotesCount - 1) }));
    }
    showToast('Note deleted from Second Brain', 'info');
  }, [secondBrainNotes, showToast]);

  const deleteDecision = useCallback((decisionId: string) => {
    const decision = decisions.find((d) => d.id === decisionId);
    setDecisions((prev) => prev.filter((d) => d.id !== decisionId));
    decisionRepository.deleteDecision(activeWorkspaceId, decisionId).catch((err) =>
      console.warn('[ProjectContext] Firestore deleteDecision error:', err)
    );
    showToast(`Decision ${decision?.decisionCode || decisionId} deleted`, 'info');
  }, [activeWorkspaceId, decisions, showToast]);

  const deleteFeedbackItem = useCallback((feedbackId: string) => {
    setFeedback((prev) => prev.filter((f) => f.id !== feedbackId));
    showToast('Feedback item deleted', 'info');
  }, [showToast]);

  const deleteMemoryEvent = useCallback((eventId: string) => {
    setMemoryEvents((prev) => prev.filter((m) => m.id !== eventId));
    memoryRepository.deleteMemoryEvent(activeWorkspaceId, eventId).catch((err) =>
      console.warn('[ProjectContext] Firestore deleteMemoryEvent error:', err)
    );
    showToast('Memory event deleted', 'info');
  }, [activeWorkspaceId, showToast]);

  // 9. Security Intelligence Layer Actions
  const startSecurityAssessment = useCallback(
    async (input: StartAssessmentInput) => {
      showToast(`Initiating Security Assessment with ${input.provider.toUpperCase()} engine...`, 'info');
      try {
        const result = await securityService.runAssessment(input, (event) => {
          setSecurityScanEvents((prev) => [event, ...prev]);
        });

        setSecurityAssessments((prev) => [result.assessment, ...prev]);
        setSecurityFindings((prev) => [...result.findings, ...prev]);
        setSecurityEvidence((prev) => [...result.evidence, ...prev]);

        // Recalculate metrics
        const derived = calculateSecurityMetrics(
          [result.assessment, ...securityAssessments],
          [...result.findings, ...securityFindings]
        );
        setMetrics((prev) => ({
          ...prev,
          securityHealthScore: derived.securityHealthScore,
          openVulnerabilitiesCount: derived.openFindingsCount,
          criticalVulnerabilitiesCount: derived.criticalOpenCount,
        }));

        showToast(
          `Security Assessment ${result.assessment.assessmentCode} completed! ${result.findings.length} findings logged.`,
          'success'
        );
        return result;
      } catch (err: any) {
        showToast(err.message || 'Security assessment failed', 'error');
        throw err;
      }
    },
    [securityAssessments, securityFindings, showToast]
  );

  const retestFinding = useCallback(
    async (findingId: string) => {
      const finding = securityFindings.find((f) => f.id === findingId);
      if (!finding) return;

      showToast(`Running automated security retest on ${finding.findingCode}...`, 'info');
      const assessment = securityAssessments.find((a) => a.id === finding.assessmentId);
      const provider = assessment?.provider || 'demo';

      try {
        const { status, newEvidence, retestEvent } = await securityService.retestFinding(
          finding,
          securityEvidence,
          provider,
          (event) => setSecurityScanEvents((prev) => [event, ...prev])
        );

        setSecurityEvidence((prev) => [newEvidence, ...prev]);
        setSecurityScanEvents((prev) => [retestEvent, ...prev]);

        setSecurityFindings((prev) =>
          prev.map((f) =>
            f.id === findingId
              ? {
                  ...f,
                  status: status === 'verified-fixed' ? 'verified-fixed' : 'open',
                  verifiedAt: new Date().toISOString().split('T')[0],
                  evidenceIds: [...f.evidenceIds, newEvidence.id],
                }
              : f
          )
        );

        // Recalculate metrics
        const updatedFindings = securityFindings.map((f) =>
          f.id === findingId ? { ...f, status: status === 'verified-fixed' ? ('verified-fixed' as const) : ('open' as const) } : f
        );
        const derived = calculateSecurityMetrics(securityAssessments, updatedFindings);
        setMetrics((prev) => ({
          ...prev,
          securityHealthScore: derived.securityHealthScore,
          openVulnerabilitiesCount: derived.openFindingsCount,
          criticalVulnerabilitiesCount: derived.criticalOpenCount,
        }));

        showToast(
          status === 'verified-fixed'
            ? `Vulnerability ${finding.findingCode} retested and VERIFIED FIXED!`
            : `Retest completed: ${finding.findingCode} is still vulnerable.`,
          status === 'verified-fixed' ? 'success' : 'amber'
        );
      } catch (err: any) {
        showToast(`Retest failed: ${err.message}`, 'error');
      }
    },
    [securityFindings, securityAssessments, securityEvidence, showToast]
  );

  const acceptFindingRisk = useCallback(
    (findingId: string, rationale: string, approver: string, expiry?: string) => {
      const finding = securityFindings.find((f) => f.id === findingId);
      if (!finding) return;

      const now = new Date().toISOString().split('T')[0];
      setSecurityFindings((prev) =>
        prev.map((f) =>
          f.id === findingId
            ? {
                ...f,
                status: 'accepted-risk',
                riskAcceptance: {
                  rationale,
                  acceptedBy: approver,
                  acceptedAt: now,
                  expiry,
                },
              }
            : f
        )
      );

      const updatedFindings = securityFindings.map((f) =>
        f.id === findingId ? { ...f, status: 'accepted-risk' as const } : f
      );
      const derived = calculateSecurityMetrics(securityAssessments, updatedFindings);
      setMetrics((prev) => ({
        ...prev,
        securityHealthScore: derived.securityHealthScore,
        openVulnerabilitiesCount: derived.openFindingsCount,
        criticalVulnerabilitiesCount: derived.criticalOpenCount,
      }));

      showToast(`Risk accepted for ${finding.findingCode} by ${approver}`, 'amber');
    },
    [securityFindings, securityAssessments, showToast]
  );

  const createRemediationTaskFromFinding = useCallback(
    (findingId: string) => {
      const finding = securityFindings.find((f) => f.id === findingId);
      if (!finding) return;

      const taskCode = `DEV-${finding.findingCode}`;
      const existing = devTasks.find((t) => t.taskCode === taskCode);
      if (existing) {
        setActiveSection('tasks');
        showToast(`Remediation task ${taskCode} already exists on Developer Kanban`, 'info');
        return;
      }

      const newTask: DevTask = {
        id: `task-${Date.now()}`,
        taskCode,
        title: `Remediate ${finding.findingCode}: ${finding.title}`,
        requirementId: finding.relatedRequirementId || 'prd-105',
        requirementTitle: `Security Remediation: ${finding.findingCode}`,
        status: 'todo',
        priority: finding.severity === 'critical' ? 'P0' : finding.severity === 'high' ? 'P1' : 'P2',
        assignee: {
          name: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          role: 'Lead Fullstack Dev',
        },
        branch: `fix/${finding.findingCode.toLowerCase()}-${finding.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        contextSummary: `Security Remediation for ${finding.findingCode} (${finding.category}): ${finding.remediation}. Impact: ${finding.impact}`,
        techStackTags: ['Security', 'Remediation', finding.category.split(' ')[0]],
      };

      setDevTasks((prev) => [newTask, ...prev]);

      setSecurityFindings((prev) =>
        prev.map((f) =>
          f.id === findingId
            ? {
                ...f,
                status: 'fix-in-progress',
                relatedTaskId: taskCode,
              }
            : f
        )
      );

      showToast(`Remediation task ${taskCode} created and sent to Developer Kanban!`, 'success');
      setActiveSection('tasks');
    },
    [securityFindings, devTasks, showToast]
  );

  const evaluateSecurityGateResult = useCallback(() => {
    return evaluateSecurityGate(securityFindings);
  }, [securityFindings]);

  const value = useMemo(
    () => ({
      // Workspaces
      workspaces,
      activeWorkspace,
      switchWorkspace,
      createWorkspace,

      // LLM Models & AI Intelligence
      llmModels,
      activeLLMModel,
      setActiveLLMModel,
      promptOptimizationMode,
      setPromptOptimizationMode,

      // Navigation & Role
      activeRole,
      setActiveRole,
      selectRole,
      activeSection,
      setActiveSection,
      isSidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      isCommandPaletteOpen,
      setCommandPaletteOpen,
      toasts,
      showToast,
      removeToast,
      metrics,
      feedback,
      problemClusters,
      featureRequests,
      strategicInsights,
      promoteClusterToPRD,
      upvoteFeedback,
      upvoteFeatureRequest,
      addFeedbackItem,
      deleteFeedbackItem,
      prds,
      features,
      roadmap,
      addPRD,
      researchSessions,
      uxFindings,
      personas,
      validationSessions,
      designTokens,
      figmaSpecs,
      designReviews,
      addAnnotation,
      resolveAnnotation,
      updateValidationSessionStatus,
      addDesignReviewComment,
      devTasks,
      sprintFeatures,
      sandboxBuilds,
      updateTaskStatus,
      createDevTask,
      deleteDevTask,
      qaTestCases,
      bugs,
      readinessChecks,
      toggleQATest,
      toggleReadinessCheck,
      calculateReadinessScore,
      addBugItem,
      deleteBugItem,
      releases,
      incidents,
      maintenanceTasks,
      contextBlocks,
      secondBrainNotes,
      fileVault,
      decisions,
      meetings,
      addMeeting,
      deleteMeeting,
      toggleMeetingActionItem,
      addSecondBrainNote,
      deleteSecondBrainNote,
      refineNoteWithAI,
      logDecision,
      deleteDecision,
      addContextBlock,
      deleteContextBlock,
      securityAssessments,
      securityFindings,
      securityEvidence,
      securityScanEvents,
      startSecurityAssessment,
      retestFinding,
      acceptFindingRisk,
      createRemediationTaskFromFinding,
      evaluateSecurityGateResult,
      memoryEvents,
      selectedMemoryId,
      isMemoryDrawerOpen,
      openMemoryDrawer,
      closeMemoryDrawer,
      recordMemoryEvent,
      deleteMemoryEvent,
      updateMemoryState,
      getMemoryForEntity,
      getMemoryTimeline,
      getMemoriesByRole,
      getSupersedingEvent,
    }),
    [
      workspaces,
      activeWorkspace,
      switchWorkspace,
      createWorkspace,
      llmModels,
      activeLLMModel,
      setActiveLLMModel,
      promptOptimizationMode,
      setPromptOptimizationMode,
      activeRole,
      setActiveRole,
      selectRole,
      activeSection,
      setActiveSection,
      isSidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      isCommandPaletteOpen,
      setCommandPaletteOpen,
      toasts,
      showToast,
      removeToast,
      metrics,
      feedback,
      problemClusters,
      featureRequests,
      strategicInsights,
      promoteClusterToPRD,
      upvoteFeedback,
      upvoteFeatureRequest,
      addFeedbackItem,
      deleteFeedbackItem,
      prds,
      features,
      roadmap,
      addPRD,
      researchSessions,
      uxFindings,
      personas,
      validationSessions,
      designTokens,
      figmaSpecs,
      designReviews,
      addAnnotation,
      resolveAnnotation,
      updateValidationSessionStatus,
      addDesignReviewComment,
      devTasks,
      sprintFeatures,
      sandboxBuilds,
      updateTaskStatus,
      createDevTask,
      deleteDevTask,
      qaTestCases,
      bugs,
      readinessChecks,
      toggleQATest,
      toggleReadinessCheck,
      calculateReadinessScore,
      addBugItem,
      deleteBugItem,
      releases,
      incidents,
      maintenanceTasks,
      contextBlocks,
      secondBrainNotes,
      fileVault,
      decisions,
      meetings,
      addMeeting,
      deleteMeeting,
      toggleMeetingActionItem,
      addSecondBrainNote,
      deleteSecondBrainNote,
      refineNoteWithAI,
      logDecision,
      deleteDecision,
      addContextBlock,
      deleteContextBlock,
      securityAssessments,
      securityFindings,
      securityEvidence,
      securityScanEvents,
      startSecurityAssessment,
      retestFinding,
      acceptFindingRisk,
      createRemediationTaskFromFinding,
      evaluateSecurityGateResult,
      memoryEvents,
      selectedMemoryId,
      isMemoryDrawerOpen,
      openMemoryDrawer,
      closeMemoryDrawer,
      recordMemoryEvent,
      deleteMemoryEvent,
      updateMemoryState,
      getMemoryForEntity,
      getMemoryTimeline,
      getMemoriesByRole,
      getSupersedingEvent,
    ]
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
