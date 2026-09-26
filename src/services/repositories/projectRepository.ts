import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { ProjectWorkspace, RoleType } from '../../types';

export interface ProjectMember {
  userId: string;
  projectId: string;
  role: RoleType;
  displayName: string;
  email: string;
  avatar?: string;
  joinedAt?: unknown;
}

/**
 * Maps a Firestore document snapshot to a ProjectWorkspace object
 */
export function fromFirestoreProject(id: string, data: Record<string, unknown>): ProjectWorkspace {
  return {
    id,
    code: (data.code as string) || 'PRJ',
    name: (data.name as string) || 'Untitled Project',
    tagline: (data.tagline as string) || '',
    description: (data.description as string) || '',
    version: (data.version as string) || 'v1.0.0',
    platform: (data.platform as ProjectWorkspace['platform']) || 'Web',
    healthScore: typeof data.healthScore === 'number' ? data.healthScore : 90,
    activeSprint: (data.activeSprint as string) || 'Active Sprint',
    createdAt: data.createdAt ? (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString()) : new Date().toISOString(),
    owner: (data.owner as string) || (data.ownerName as string) || 'Team',
    techStack: Array.isArray(data.techStack) ? data.techStack : [],
    themeColor: (data.themeColor as string) || '#FF6039',
    repoUrl: data.repoUrl as string | undefined,
    deployedUrl: data.deployedUrl as string | undefined,
    socialLinks: data.socialLinks as ProjectWorkspace['socialLinks']
  };
}

export const projectRepository = {
  async getProject(projectId: string): Promise<ProjectWorkspace | null> {
    try {
      const snap = await getDoc(doc(db, 'projects', projectId));
      if (!snap.exists()) return null;
      return fromFirestoreProject(snap.id, snap.data());
    } catch (err) {
      console.warn(`[projectRepository] getProject(${projectId}) error:`, err);
      return null;
    }
  },

  async saveProject(project: ProjectWorkspace, ownerId: string): Promise<void> {
    const ref = doc(db, 'projects', project.id);
    await setDoc(
      ref,
      {
        ...project,
        ownerId,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  },

  async getMembers(projectId: string): Promise<ProjectMember[]> {
    try {
      const snap = await getDocs(collection(db, 'projects', projectId, 'members'));
      return snap.docs.map((d) => d.data() as ProjectMember);
    } catch (err) {
      console.warn(`[projectRepository] getMembers(${projectId}) error:`, err);
      return [];
    }
  },

  async addMember(projectId: string, member: ProjectMember): Promise<void> {
    const ref = doc(db, 'projects', projectId, 'members', member.userId);
    await setDoc(ref, {
      ...member,
      joinedAt: serverTimestamp()
    }, { merge: true });
  },

  subscribeToProject(projectId: string, callback: (project: ProjectWorkspace | null) => void): Unsubscribe {
    const ref = doc(db, 'projects', projectId);
    return onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          callback(fromFirestoreProject(snap.id, snap.data()));
        } else {
          callback(null);
        }
      },
      (err) => {
        console.warn(`[projectRepository] Subscription error for ${projectId}:`, err);
      }
    );
  }
};
