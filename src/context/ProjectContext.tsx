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
} from '../data/initialSeedData';
import { securityService } from '../security/services/securityService';
import { evaluateSecurityGate } from '../security/services/securityGate';
import { calculateSecurityMetrics } from '../security/services/securityMetrics';
import { StartAssessmentInput, SecurityAssessmentResult } from '../security/types';

interface ToastInfo {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error' | 'amber';
}

interface ProjectContextType {
  // Workspaces
  workspaces: ProjectWorkspace[];
  activeWorkspace: ProjectWorkspace;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (
    workspace: Omit<ProjectWorkspace, 'id' | 'createdAt' | 'healthScore'>,
    initialData?: {
      prds?: ProductRequirement[];
      devTasks?: DevTask[];
      contextBlocks?: ContextBlock[];
      decisions?: ProjectDecision[];
      securityFindings?: SecurityFinding[];
      securityEvidence?: SecurityEvidence[];
    }
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

  // QA & release
  qaTestCases: QATestCase[];
  bugs: BugItem[];
  readinessChecks: ReleaseReadinessCheck[];
  toggleQATest: (testId: string) => void;
  toggleReadinessCheck: (checkId: string) => void;
  calculateReadinessScore: () => number;
  addBugItem: (bug: Omit<BugItem, 'id' | 'bugCode' | 'detectedAt'>) => void;

  // Operations
  releases: ReleaseItem[];
  incidents: IncidentItem[];
  maintenanceTasks: MaintenanceTask[];

  // Memory & notes
  contextBlocks: ContextBlock[];
  secondBrainNotes: SecondBrainNote[];
  fileVault: FileVaultItem[];
  decisions: ProjectDecision[];
  addSecondBrainNote: (title: string, rawContent: string, tags: string[]) => void;
  refineNoteWithAI: (noteId: string) => void;
  logDecision: (decision: Omit<ProjectDecision, 'id' | 'decisionCode' | 'date'>) => void;
  addContextBlock: (block: Omit<ContextBlock, 'id' | 'lastUpdated'>) => void;

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
          const hasFlagship = parsed.some((w: ProjectWorkspace) => w.id === 'ws-signals-flagship');
          if (!hasFlagship) {
            return [...initialWorkspaces, ...parsed.filter((w: ProjectWorkspace) => w.id !== 'ws-default')];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached workspaces', e);
    }
    return initialWorkspaces;
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_WS);
    if (savedId && workspaces.some((w) => w.id === savedId)) return savedId;
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
        if (parsed.secondBrainNotes) setSecondBrainNotes(parsed.secondBrainNotes);
        if (parsed.bugs) setBugs(parsed.bugs);
        if (parsed.qaTestCases) setQATestCases(parsed.qaTestCases);
      } else if (workspaceId === 'ws-signals-flagship') {
        // Load initial rich demo data
        setPRDs(initialPRDs);
        setDevTasks(initialDevTasks);
        setContextBlocks(initialContextBlocks);
        setDecisions(initialDecisions);
        setSecurityFindings(initialSecurityFindings);
        setSecurityEvidence(initialSecurityEvidence);
        setFeedback(initialFeedback);
        setSecondBrainNotes(initialSecondBrainNotes);
        setBugs(initialBugItems);
        setQATestCases(initialQATestCases);
      } else {
        // Start clean for this new workspace
        setPRDs([]);
        setDevTasks([]);
        setContextBlocks([]);
        setDecisions([]);
        setSecurityFindings([]);
        setSecurityEvidence([]);
        setFeedback([]);
        setSecondBrainNotes([]);
        setBugs([]);
        setQATestCases([]);
      }
    } catch (e) {
      console.warn('Failed to load cached workspace data', e);
    }

    showToast(`Switched workspace to ${target.name} (${target.code} ${target.version})`, 'info');
  }, [workspaces, showToast]);

  const createWorkspace = useCallback(
    (
      newWsData: Omit<ProjectWorkspace, 'id' | 'createdAt' | 'healthScore'>,
      initialData?: {
        prds?: ProductRequirement[];
        devTasks?: DevTask[];
        contextBlocks?: ContextBlock[];
        decisions?: ProjectDecision[];
        securityFindings?: SecurityFinding[];
        securityEvidence?: SecurityEvidence[];
      }
    ) => {
      const newWs: ProjectWorkspace = {
        ...newWsData,
        id: `ws-${Date.now()}`,
        healthScore: 100,
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

      // Set active in-memory state
      setPRDs(prdItems);
      setDevTasks(taskItems);
      setContextBlocks(ctxItems);
      setDecisions(decItems);
      setSecurityFindings(secItems);
      setSecurityEvidence(evItems);
      setFeedback([]);
      setSecondBrainNotes([]);
      setBugs([]);
      setQATestCases([]);

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
            feedback: [],
            secondBrainNotes: [],
            bugs: [],
            qaTestCases: [],
          })
        );
      } catch (e) {
        console.warn('Failed to cache workspace data in localStorage', e);
      }


      showToast(`Ingested real repository memory for ${newWs.name} (${newWs.code})!`, 'success');
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

  // Navigation & Role State
  const [activeRole, setActiveRole] = useState<RoleType>('all');
  const [activeSection, setActiveSection] = useState<NavSection>('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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
        'overview', 'product-health', 'roadmap', 'features', 'requirements',
        'feedback', 'user-issues', 'feature-requests', 'insights',
        'context', 'notes', 'files', 'decisions', 'project-memory',
      ],
      pm: [
        'overview', 'product-health', 'roadmap', 'features', 'requirements',
        'feedback', 'user-issues', 'feature-requests', 'insights',
        'context', 'notes', 'files', 'decisions', 'project-memory',
      ],
      designer: [
        'research', 'findings', 'user-patterns',
        'validation', 'designs', 'figma', 'reviews', 'project-memory',
      ],
      dev: [
        'tasks', 'dev-features', 'builds', 'prompts',
        'validation', 'context', 'project-memory',
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
  const [feedback, setFeedback] = useState<FeedbackItem[]>(initialFeedback);
  const [problemClusters, setProblemClusters] = useState<ProblemCluster[]>(initialProblemClusters);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(initialFeatureRequests);
  const [strategicInsights] = useState<StrategicInsight[]>(initialInsights);
  const [prds, setPRDs] = useState<ProductRequirement[]>(initialPRDs);
  const [features] = useState<ProductFeature[]>(initialFeatures);
  const [roadmap] = useState<RoadmapEpic[]>(initialRoadmap);
  const [researchSessions] = useState<ResearchSession[]>(initialResearchSessions);
  const [uxFindings] = useState<UXFinding[]>(initialUXFindings);
  const [personas] = useState<UserPersona[]>(initialPersonas);
  const [validationSessions, setValidationSessions] = useState<DesignValidationSession[]>(initialValidationSessions);
  const [designTokens] = useState<DesignToken[]>(initialDesignTokens);
  const [figmaSpecs] = useState<FigmaFrameSpec[]>(initialFigmaSpecs);
  const [designReviews, setDesignReviews] = useState<DesignReviewThread[]>(initialDesignReviews);
  const [devTasks, setDevTasks] = useState<DevTask[]>(initialDevTasks);
  const [sprintFeatures] = useState<SprintFeature[]>(initialSprintFeatures);
  const [sandboxBuilds] = useState<SandboxBuild[]>(initialSandboxBuilds);
  const [qaTestCases, setQATestCases] = useState<QATestCase[]>(initialQATestCases);
  const [bugs, setBugs] = useState<BugItem[]>(initialBugItems);
  const [readinessChecks, setReadinessChecks] = useState<ReleaseReadinessCheck[]>(initialReadinessChecks);
  const [releases] = useState<ReleaseItem[]>(initialReleases);
  const [incidents] = useState<IncidentItem[]>(initialIncidents);
  const [maintenanceTasks] = useState<MaintenanceTask[]>(initialMaintenance);
  const [contextBlocks, setContextBlocks] = useState<ContextBlock[]>(initialContextBlocks);
  const [secondBrainNotes, setSecondBrainNotes] = useState<SecondBrainNote[]>(initialSecondBrainNotes);
  const [fileVault] = useState<FileVaultItem[]>(initialFileVault);
  const [decisions, setDecisions] = useState<ProjectDecision[]>(initialDecisions);

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

  const recordMemoryEvent = useCallback(
    (event: Omit<ProjectMemoryEvent, 'id' | 'occurredAt'>) => {
      const newEvent: ProjectMemoryEvent = {
        ...event,
        id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        occurredAt: new Date().toISOString().split('T')[0],
      };
      setMemoryEvents((prev) => [newEvent, ...prev]);
      showToast(`Memory recorded: ${newEvent.title}`, 'info');
    },
    [showToast]
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
    showToast(`Task status updated to ${status.toUpperCase()}`, 'info');
  }, [showToast]);

  const createDevTask = useCallback((task: Omit<DevTask, 'id' | 'taskCode'>) => {
    const taskCode = `DEV-${425 + devTasks.length}`;
    const newTask: DevTask = {
      ...task,
      id: `task-${Date.now()}`,
      taskCode,
    };
    setDevTasks((prev) => [newTask, ...prev]);
    showToast(`Dev Task ${taskCode} created!`, 'success');
  }, [devTasks.length, showToast]);

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
    const decisionCode = `DEC-${104 + decisions.length}`;
    const newDecision: ProjectDecision = {
      ...decision,
      id: `dec-${Date.now()}`,
      decisionCode,
      date: new Date().toISOString().split('T')[0],
    };
    setDecisions((prev) => [newDecision, ...prev]);
    showToast(`Architectural Decision ${decisionCode} permanently recorded`, 'success');
  }, [decisions.length, showToast]);

  const addContextBlock = useCallback((block: Omit<ContextBlock, 'id' | 'lastUpdated'>) => {
    const newBlock: ContextBlock = {
      ...block,
      id: `ctx-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setContextBlocks((prev) => [newBlock, ...prev]);
    showToast('New Context Block added to Project Memory', 'success');
  }, [showToast]);

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
      qaTestCases,
      bugs,
      readinessChecks,
      toggleQATest,
      toggleReadinessCheck,
      calculateReadinessScore,
      addBugItem,
      releases,
      incidents,
      maintenanceTasks,
      contextBlocks,
      secondBrainNotes,
      fileVault,
      decisions,
      addSecondBrainNote,
      refineNoteWithAI,
      logDecision,
      addContextBlock,
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
      qaTestCases,
      bugs,
      readinessChecks,
      toggleQATest,
      toggleReadinessCheck,
      calculateReadinessScore,
      addBugItem,
      releases,
      incidents,
      maintenanceTasks,
      contextBlocks,
      secondBrainNotes,
      fileVault,
      decisions,
      addSecondBrainNote,
      refineNoteWithAI,
      logDecision,
      addContextBlock,
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
