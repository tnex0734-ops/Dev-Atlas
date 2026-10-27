import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  ProductRequirement,
  FeedbackItem,
  ProblemCluster,
  FeatureRequest,
  ResearchSession,
  UXFinding,
  UserPersona,
  DesignToken,
  FigmaFrameSpec,
  DesignReviewThread,
  DesignValidationSession,
  DesignAnnotation,
  SecurityFinding,
  QATestCase,
  BugItem,
  ReleaseReadinessCheck,
  ReleaseItem,
  IncidentItem,
  MaintenanceTask,
  ContextBlock
} from '../../types';

export const domainRepositories = {
  // Requirements / PRDs
  async getRequirements(projectId: string): Promise<ProductRequirement[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'requirements'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProductRequirement));
    } catch {
      return [];
    }
  },
  async saveRequirement(projectId: string, req: ProductRequirement): Promise<void> {
    await setDoc(doc(db, 'projects', projectId, 'requirements', req.id), {
      ...req,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  // Feedback & Problem Clusters
  async getFeedback(projectId: string): Promise<FeedbackItem[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'feedback'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FeedbackItem));
    } catch {
      return [];
    }
  },
  async saveFeedback(projectId: string, item: FeedbackItem): Promise<void> {
    await setDoc(doc(db, 'projects', projectId, 'feedback', item.id), item, { merge: true });
  },

  async getProblemClusters(projectId: string): Promise<ProblemCluster[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'problemClusters'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProblemCluster));
    } catch {
      return [];
    }
  },
  async saveProblemCluster(projectId: string, cluster: ProblemCluster): Promise<void> {
    await setDoc(doc(db, 'projects', projectId, 'problemClusters', cluster.id), cluster, { merge: true });
  },

  async getFeatureRequests(projectId: string): Promise<FeatureRequest[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'featureRequests'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FeatureRequest));
    } catch {
      return [];
    }
  },

  // Design & Validation
  async getValidationSessions(projectId: string): Promise<DesignValidationSession[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'validationSessions'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DesignValidationSession));
    } catch {
      return [];
    }
  },
  async saveValidationSession(projectId: string, session: DesignValidationSession): Promise<void> {
    await setDoc(doc(db, 'projects', projectId, 'validationSessions', session.id), session, { merge: true });
  },

  async saveValidationPin(projectId: string, sessionId: string, pin: DesignAnnotation): Promise<void> {
    await setDoc(doc(db, 'projects', projectId, 'validationSessions', sessionId, 'pins', pin.id), pin, { merge: true });
  },

  // QA & Security
  async getSecurityFindings(projectId: string): Promise<SecurityFinding[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'securityFindings'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SecurityFinding));
    } catch {
      return [];
    }
  },
  async saveSecurityFinding(projectId: string, finding: SecurityFinding): Promise<void> {
    await setDoc(doc(db, 'projects', projectId, 'securityFindings', finding.id), {
      ...finding,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  async getBugs(projectId: string): Promise<BugItem[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'bugs'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BugItem));
    } catch {
      return [];
    }
  },
  async saveBug(projectId: string, bug: BugItem): Promise<void> {
    await setDoc(doc(db, 'projects', projectId, 'bugs', bug.id), bug, { merge: true });
  },

  async getQATestCases(projectId: string): Promise<QATestCase[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'qaTestCases'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as QATestCase));
    } catch {
      return [];
    }
  },

  // Operations
  async getReleases(projectId: string): Promise<ReleaseItem[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'releases'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ReleaseItem));
    } catch {
      return [];
    }
  },
  async getIncidents(projectId: string): Promise<IncidentItem[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'incidents'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as IncidentItem));
    } catch {
      return [];
    }
  },
  async getMaintenanceTasks(projectId: string): Promise<MaintenanceTask[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'maintenance'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MaintenanceTask));
    } catch {
      return [];
    }
  },

  // Architecture Context Blocks
  async getContextBlocks(projectId: string): Promise<ContextBlock[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'contextBlocks'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContextBlock));
    } catch {
      return [];
    }
  }
};
