import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { RoleType } from '../../types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
  lastSeenAt?: unknown;
  onboardingCompleted?: boolean;
}

export interface DemoUserDef {
  uid: string;
  email: string;
  name: string;
  displayName: string;
  role: RoleType;
  defaultRole: RoleType;
  avatar: string;
}

export const DEMO_USERS: Record<string, DemoUserDef> = {
  dev: {
    uid: 'demo-dev-001',
    email: 'developer@devatlas.internal',
    name: 'Alex Rivera (Lead Engineer)',
    displayName: 'Alex Rivera',
    role: 'dev',
    defaultRole: 'dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
  },
  pm: {
    uid: 'demo-pm-001',
    email: 'pm@devatlas.internal',
    name: 'Sarah Chen (Principal PM)',
    displayName: 'Sarah Chen',
    role: 'pm',
    defaultRole: 'pm',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
  },
  designer: {
    uid: 'demo-designer-001',
    email: 'designer@devatlas.internal',
    name: 'Elena Rostova (Lead Designer)',
    displayName: 'Elena Rostova',
    role: 'designer',
    defaultRole: 'designer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop'
  },
  qa: {
    uid: 'demo-qa-001',
    email: 'qa@devatlas.internal',
    name: 'Marcus Vance (Security & QA)',
    displayName: 'Marcus Vance',
    role: 'qa',
    defaultRole: 'qa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  },
  ops: {
    uid: 'demo-ops-001',
    email: 'ops@devatlas.internal',
    name: 'David Kim (SRE & Release)',
    displayName: 'David Kim',
    role: 'ops',
    defaultRole: 'ops',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
  },
  memory: {
    uid: 'demo-memory-001',
    email: 'archivist@devatlas.internal',
    name: 'Dr. Evelyn Cross (Project Archivist)',
    displayName: 'Dr. Evelyn Cross',
    role: 'memory',
    defaultRole: 'memory',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
  },
  all: {
    uid: 'demo-exec-001',
    email: 'executive@devatlas.internal',
    name: 'Rachel Adams (VP Engineering)',
    displayName: 'Rachel Adams',
    role: 'all',
    defaultRole: 'all',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'
  }
};

/**
 * Creates or updates the user profile document in Firestore
 */
export async function syncUserProfile(user: User, customDisplayName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    const displayName = customDisplayName || user.displayName || user.email?.split('@')[0] || 'DevAtlas User';
    
    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName,
        photoURL: user.photoURL || undefined,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastSeenAt: serverTimestamp(),
        onboardingCompleted: false
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      await setDoc(userRef, { lastSeenAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.warn('[Auth] Could not write user profile to Firestore (offline or unauthenticated):', err);
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'DevAtlas User',
      photoURL: user.photoURL || undefined
    };
  }
}

export async function signUpWithEmail(email: string, pass: string, displayName: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(cred.user, { displayName });
  await syncUserProfile(cred.user, displayName);
  return cred.user;
}

export async function signInWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(cred.user);
  return cred.user;
}

export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Quick evaluation login for demo users
 */
export async function signInDemoUser(roleKey: keyof typeof DEMO_USERS = 'dev'): Promise<User> {
  const demo = DEMO_USERS[roleKey] || DEMO_USERS.dev;
  const demoPassword = 'DevAtlasDemo2026!';
  
  try {
    return await signInWithEmail(demo.email, demoPassword);
  } catch (err: unknown) {
    const error = err as { code?: string };
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        return await signUpWithEmail(demo.email, demoPassword, demo.name);
      } catch (signupErr) {
        console.warn('[Auth] Remote demo signup fallback, creating offline user:', signupErr);
      }
    }
    // Return robust offline User mock representation
    return {
      uid: demo.uid,
      email: demo.email,
      displayName: demo.displayName,
      photoURL: demo.avatar,
      emailVerified: true,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => 'mock-token',
      getIdTokenResult: async () => ({ token: 'mock-token' } as any),
      reload: async () => {},
      toJSON: () => ({})
    } as unknown as User;
  }
}
