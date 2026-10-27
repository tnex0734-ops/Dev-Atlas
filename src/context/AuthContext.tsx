import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  subscribeToAuth,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  signInDemoUser,
  syncUserProfile,
  UserProfile,
  DEMO_USERS
} from '../services/firebase/auth';
import { projectRepository } from '../services/repositories/projectRepository';
import { RoleType } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  projectRole: RoleType;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInAsDemo: (role: keyof typeof DEMO_USERS) => Promise<void>;
  setProjectRoleOverride: (role: RoleType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; currentProjectId: string }> = ({
  children,
  currentProjectId
}) => {
  const [projectRole, setProjectRole] = useState<RoleType>(() => {
    try {
      const saved = localStorage.getItem('devatlas_auth_role');
      if (saved && saved in DEMO_USERS) return DEMO_USERS[saved as keyof typeof DEMO_USERS].defaultRole;
    } catch {}
    return 'dev';
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedRole = (localStorage.getItem('devatlas_auth_role') as keyof typeof DEMO_USERS) || 'dev';
      const demo = DEMO_USERS[savedRole] || DEMO_USERS.dev;
      return {
        uid: demo.uid,
        email: demo.email,
        displayName: demo.displayName,
        photoURL: demo.avatar,
        emailVerified: true,
        isAnonymous: false,
      } as unknown as User;
    } catch {
      return null;
    }
  });

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const savedRole = (localStorage.getItem('devatlas_auth_role') as keyof typeof DEMO_USERS) || 'dev';
      const demo = DEMO_USERS[savedRole] || DEMO_USERS.dev;
      return {
        uid: demo.uid,
        email: demo.email,
        displayName: demo.displayName,
        photoURL: demo.avatar
      };
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Listen for Firebase Auth state changes
  useEffect(() => {
    const unsub = subscribeToAuth(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const p = await syncUserProfile(currentUser);
          setProfile(p);
        } catch (err) {
          console.warn('[AuthContext] syncUserProfile error:', err);
        }
      }
    });

    return () => unsub();
  }, []);

  // 2. Fetch project membership role when user or project changes
  useEffect(() => {
    let isMounted = true;
    async function loadRole() {
      if (!user || !currentProjectId) return;
      try {
        const members = await projectRepository.getMembers(currentProjectId);
        if (!isMounted) return;
        const currentMember = members.find((m) => m.userId === user.uid);
        if (currentMember) {
          setProjectRole(currentMember.role);
        } else {
          // Check if current user is demo user with defined role
          const demoEntry = Object.entries(DEMO_USERS).find(([, d]) => d.email === user.email);
          if (demoEntry) {
            setProjectRole(demoEntry[1].defaultRole);
          }
        }
      } catch (err) {
        console.warn('[AuthContext] Error loading project role:', err);
      }
    }

    loadRole();
    return () => {
      isMounted = false;
    };
  }, [user, currentProjectId]);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const u = await signInWithEmail(email, pass);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    try {
      const u = await signUpWithEmail(email, pass, name);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsDemo = async (roleKey: keyof typeof DEMO_USERS) => {
    setIsLoading(true);
    try {
      const demo = DEMO_USERS[roleKey] || DEMO_USERS.dev;
      const u = await signInDemoUser(roleKey);
      setUser(u);
      setProfile({
        uid: demo.uid,
        email: demo.email,
        displayName: demo.displayName,
        photoURL: demo.avatar
      });
      setProjectRole(demo.defaultRole);
      try {
        localStorage.setItem('devatlas_auth_role', roleKey);
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
    } catch {}
    setUser(null);
    setProfile(null);
    setProjectRole('dev');
    try {
      localStorage.removeItem('devatlas_auth_role');
    } catch {}
    setIsLoading(false);
  };

  const setProjectRoleOverride = (role: RoleType) => {
    setProjectRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        projectRole,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInAsDemo,
        setProjectRoleOverride
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
