import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ProjectDecision } from '../../types';

export const decisionRepository = {
  async getDecisions(projectId: string): Promise<ProjectDecision[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'decisions'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectDecision));
    } catch (err) {
      console.warn(`[decisionRepository] getDecisions(${projectId}) error:`, err);
      return [];
    }
  },

  async saveDecision(projectId: string, decision: ProjectDecision): Promise<void> {
    const ref = doc(db, 'projects', projectId, 'decisions', decision.id);
    await setDoc(ref, {
      ...decision,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  /**
   * Replaces an existing decision with a new superseded state while keeping historical record intact
   */
  async supersedeDecision(
    projectId: string,
    oldDecisionId: string,
    newDecision: ProjectDecision
  ): Promise<void> {
    // 1. Mark old decision as superseded
    const oldRef = doc(db, 'projects', projectId, 'decisions', oldDecisionId);
    await updateDoc(oldRef, {
      status: 'superseded',
      supersededBy: newDecision.id,
      updatedAt: serverTimestamp()
    });

    // 2. Save the new decision pointing to the old one
    const newRef = doc(db, 'projects', projectId, 'decisions', newDecision.id);
    await setDoc(newRef, {
      ...newDecision,
      supersedes: oldDecisionId,
      status: 'active',
      updatedAt: serverTimestamp()
    });
  },

  async deleteDecision(projectId: string, decisionId: string): Promise<void> {
    try {
      const ref = doc(db, 'projects', projectId, 'decisions', decisionId);
      await deleteDoc(ref);
    } catch (err) {
      console.warn(`[decisionRepository] deleteDecision(${projectId}, ${decisionId}) error:`, err);
    }
  },

  subscribeToDecisions(projectId: string, callback: (decisions: ProjectDecision[]) => void): Unsubscribe {
    const coll = collection(db, 'projects', projectId, 'decisions');
    return onSnapshot(
      coll,
      (snap) => {
        const decisions = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectDecision));
        callback(decisions);
      },
      (err) => {
        console.warn(`[decisionRepository] Subscription error for ${projectId}:`, err);
      }
    );
  }
};
