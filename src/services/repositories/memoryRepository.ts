import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ProjectMemoryEvent } from '../../types';

export const memoryRepository = {
  async getMemoryEvents(projectId: string): Promise<ProjectMemoryEvent[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'memoryEvents'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectMemoryEvent));
    } catch (err) {
      console.warn(`[memoryRepository] getMemoryEvents(${projectId}) error:`, err);
      return [];
    }
  },

  async saveMemoryEvent(projectId: string, event: ProjectMemoryEvent): Promise<void> {
    const ref = doc(db, 'projects', projectId, 'memoryEvents', event.id);
    await setDoc(ref, {
      ...event,
      createdAt: serverTimestamp()
    }, { merge: true });
  },

  async deleteMemoryEvent(projectId: string, eventId: string): Promise<void> {
    try {
      const ref = doc(db, 'projects', projectId, 'memoryEvents', eventId);
      await deleteDoc(ref);
    } catch (err) {
      console.warn(`[memoryRepository] deleteMemoryEvent(${projectId}, ${eventId}) error:`, err);
    }
  },

  subscribeToMemory(projectId: string, callback: (events: ProjectMemoryEvent[]) => void): Unsubscribe {
    const coll = collection(db, 'projects', projectId, 'memoryEvents');
    return onSnapshot(
      coll,
      (snap) => {
        const events = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectMemoryEvent));
        callback(events);
      },
      (err) => {
        console.warn(`[memoryRepository] Subscription error for ${projectId}:`, err);
      }
    );
  }
};
