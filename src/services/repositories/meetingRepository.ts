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
import { ProjectMeeting } from '../../types';

export const meetingRepository = {
  async getMeetings(projectId: string): Promise<ProjectMeeting[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'meetings'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectMeeting));
    } catch (err) {
      console.warn(`[meetingRepository] getMeetings(${projectId}) error:`, err);
      return [];
    }
  },

  async saveMeeting(projectId: string, meeting: ProjectMeeting): Promise<void> {
    const ref = doc(db, 'projects', projectId, 'meetings', meeting.id);
    await setDoc(ref, {
      ...meeting,
      updatedAt: serverTimestamp()
    }, { merge: true });
  },

  async toggleActionItem(
    projectId: string,
    meetingId: string,
    actionItemId: string,
    done: boolean,
    currentMeeting: ProjectMeeting
  ): Promise<ProjectMeeting> {
    const updatedActionItems = currentMeeting.actionItems.map((item) =>
      item.id === actionItemId ? { ...item, done } : item
    );

    const ref = doc(db, 'projects', projectId, 'meetings', meetingId);
    await updateDoc(ref, {
      actionItems: updatedActionItems,
      updatedAt: serverTimestamp()
    });

    return {
      ...currentMeeting,
      actionItems: updatedActionItems
    };
  },

  async deleteMeeting(projectId: string, meetingId: string): Promise<void> {
    try {
      const ref = doc(db, 'projects', projectId, 'meetings', meetingId);
      await deleteDoc(ref);
    } catch (err) {
      console.warn(`[meetingRepository] deleteMeeting(${projectId}, ${meetingId}) error:`, err);
    }
  },

  subscribeToMeetings(projectId: string, callback: (meetings: ProjectMeeting[]) => void): Unsubscribe {
    const coll = collection(db, 'projects', projectId, 'meetings');
    return onSnapshot(
      coll,
      (snap) => {
        const meetings = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectMeeting));
        callback(meetings);
      },
      (err) => {
        console.warn(`[meetingRepository] Subscription error for ${projectId}:`, err);
      }
    );
  }
};
