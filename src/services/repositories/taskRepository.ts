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
import { DevTask } from '../../types';

export const taskRepository = {
  async getTasks(projectId: string): Promise<DevTask[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'tasks'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DevTask));
    } catch (err) {
      console.warn(`[taskRepository] getTasks(${projectId}) error:`, err);
      return [];
    }
  },

  async saveTask(projectId: string, task: DevTask): Promise<void> {
    const ref = doc(db, 'projects', projectId, 'tasks', task.id);
    await setDoc(ref, {
      ...task,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  async updateTaskStatus(
    projectId: string,
    taskId: string,
    status: DevTask['status']
  ): Promise<void> {
    const ref = doc(db, 'projects', projectId, 'tasks', taskId);
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: serverTimestamp()
    };
    if (status === 'done') {
      updateData.completedAt = serverTimestamp();
    }
    await updateDoc(ref, updateData);
  },

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    try {
      const ref = doc(db, 'projects', projectId, 'tasks', taskId);
      await deleteDoc(ref);
    } catch (err) {
      console.warn(`[taskRepository] deleteTask(${projectId}, ${taskId}) error:`, err);
    }
  },

  subscribeToTasks(projectId: string, callback: (tasks: DevTask[]) => void): Unsubscribe {
    const coll = collection(db, 'projects', projectId, 'tasks');
    return onSnapshot(
      coll,
      (snap) => {
        const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() } as DevTask));
        callback(tasks);
      },
      (err) => {
        console.warn(`[taskRepository] Subscription error for ${projectId}:`, err);
      }
    );
  }
};
