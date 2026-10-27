import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { AIConversation, AIMessage } from '../../types/aiTypes';
import { RoleType } from '../../types';

export const aiRepository = {
  async getConversations(
    projectId: string,
    userId: string,
    role?: RoleType
  ): Promise<AIConversation[]> {
    try {
      const coll = collection(db, 'projects', projectId, 'aiConversations');
      let q = query(coll, where('userId', '==', userId), orderBy('updatedAt', 'desc'), limit(50));
      
      const snap = await getDocs(q);
      let convs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AIConversation));

      if (role && role !== 'all') {
        convs = convs.filter((c) => c.role === role);
      }
      return convs;
    } catch (err) {
      console.warn(`[aiRepository] getConversations error:`, err);
      return [];
    }
  },

  async saveConversation(projectId: string, conv: AIConversation): Promise<void> {
    const ref = doc(db, 'projects', projectId, 'aiConversations', conv.id);
    await setDoc(
      ref,
      {
        id: conv.id,
        projectId,
        userId: conv.userId || 'anonymous',
        role: conv.role,
        title: conv.title,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      },
      { merge: true }
    );
  },

  async getMessages(projectId: string, convId: string): Promise<AIMessage[]> {
    try {
      const coll = collection(db, 'projects', projectId, 'aiConversations', convId, 'messages');
      const q = query(coll, orderBy('createdAt', 'asc'), limit(100));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AIMessage));
    } catch (err) {
      console.warn(`[aiRepository] getMessages error:`, err);
      return [];
    }
  },

  async saveMessage(projectId: string, convId: string, message: AIMessage): Promise<void> {
    const ref = doc(db, 'projects', projectId, 'aiConversations', convId, 'messages', message.id);
    await setDoc(ref, {
      ...message,
      createdAt: serverTimestamp()
    });

    // Touch conversation updatedAt
    const convRef = doc(db, 'projects', projectId, 'aiConversations', convId);
    await setDoc(convRef, { updatedAt: serverTimestamp() }, { merge: true });
  },

  async recordUsage(
    projectId: string,
    usage: {
      userId: string;
      conversationId: string;
      provider: string;
      model: string;
      inputTokens: number;
      outputTokens: number;
      estimatedCost: number;
      currency: 'USD';
    }
  ): Promise<void> {
    try {
      const usageId = `usage-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const ref = doc(db, 'projects', projectId, 'aiUsage', usageId);
      await setDoc(ref, {
        ...usage,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[aiRepository] recordUsage error:`, err);
    }
  }
};
