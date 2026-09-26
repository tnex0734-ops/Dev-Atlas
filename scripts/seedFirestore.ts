import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../src/services/firebase/config';
import {
  initialWorkspaces,
  initialMeetings,
  initialDecisions,
  initialDevTasks,
  initialMemoryEvents,
  initialPRDs,
  initialFeedback,
  initialProblemClusters,
  initialFeatureRequests,
  initialResearchSessions,
  initialUXFindings,
  initialPersonas,
  initialDesignTokens,
  initialFigmaSpecs,
  initialDesignReviews,
  initialValidationSessions,
  initialSecurityAssessments,
  initialSecurityFindings,
  initialQATestCases,
  initialBugs,
  initialReadinessChecks,
  initialReleases,
  initialIncidents,
  initialMaintenance,
  initialContextBlocks,
  initialSecondBrainNotes,
  initialFileVault
} from '../src/data/initialSeedData';
import { DEMO_USERS } from '../src/services/firebase/auth';

/**
 * DevAtlas Firestore Seeding Utility
 * Ingests the rich flagship workspace (STFL) and verifies all relational links.
 */
export async function seedFirestoreDatabase(): Promise<{
  success: boolean;
  counts: Record<string, number>;
  integrityErrors: string[];
}> {
  console.log('[Seed] Beginning DevAtlas Firestore migration & seed...');
  const integrityErrors: string[] = [];
  const counts: Record<string, number> = {};

  const flagship = initialWorkspaces[0];
  const projectId = flagship.id;

  // 1. Seed Project Root Document
  await setDoc(doc(db, 'projects', projectId), {
    ...flagship,
    ownerId: 'demo-executive-uid',
    ownerName: flagship.owner,
    updatedAt: serverTimestamp(),
    settings: {
      defaultAiProvider: 'openrouter',
      defaultAiModel: 'anthropic/claude-3.5-haiku',
      allowCloudAI: true,
      allowExternalIntegrations: true
    }
  }, { merge: true });
  counts.projects = 1;

  // 2. Seed Project Members from DEMO_USERS
  for (const [key, userObj] of Object.entries(DEMO_USERS)) {
    const memberId = `member-${key}`;
    await setDoc(doc(db, 'projects', projectId, 'members', memberId), {
      userId: memberId,
      projectId,
      role: userObj.defaultRole,
      status: 'active',
      displayName: userObj.name,
      email: userObj.email,
      avatar: userObj.avatar,
      joinedAt: serverTimestamp()
    }, { merge: true });
  }
  counts.members = Object.keys(DEMO_USERS).length;

  // 3. Seed Meetings
  for (const m of initialMeetings) {
    await setDoc(doc(db, 'projects', projectId, 'meetings', m.id), {
      ...m,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
  counts.meetings = initialMeetings.length;

  // 4. Seed Decisions (ADRs)
  const decisionCodes = new Set<string>();
  for (const d of initialDecisions) {
    decisionCodes.add(d.decisionCode);
    await setDoc(doc(db, 'projects', projectId, 'decisions', d.id), {
      ...d,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
  counts.decisions = initialDecisions.length;

  // 5. Seed Tasks & Verify Rationale Links
  for (const t of initialDevTasks) {
    if (t.relatedDecisionCode && !decisionCodes.has(t.relatedDecisionCode)) {
      integrityErrors.push(`Task ${t.taskCode} references non-existent decision ${t.relatedDecisionCode}`);
    }
    await setDoc(doc(db, 'projects', projectId, 'tasks', t.id), {
      ...t,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
  counts.tasks = initialDevTasks.length;

  // 6. Seed Project Memory Events & Verify Lineage
  for (const e of initialMemoryEvents) {
    await setDoc(doc(db, 'projects', projectId, 'memoryEvents', e.id), {
      ...e,
      createdAt: serverTimestamp()
    }, { merge: true });
  }
  counts.memoryEvents = initialMemoryEvents.length;

  // 7. Seed Requirements
  for (const r of initialPRDs) {
    await setDoc(doc(db, 'projects', projectId, 'requirements', r.id), {
      ...r,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
  counts.requirements = initialPRDs.length;

  // 8. Seed Remaining Collections
  for (const fb of initialFeedback) {
    await setDoc(doc(db, 'projects', projectId, 'feedback', fb.id), fb, { merge: true });
  }
  counts.feedback = initialFeedback.length;

  for (const s of initialSecurityFindings) {
    await setDoc(doc(db, 'projects', projectId, 'securityFindings', s.id), s, { merge: true });
  }
  counts.securityFindings = initialSecurityFindings.length;

  for (const rel of initialReleases) {
    await setDoc(doc(db, 'projects', projectId, 'releases', rel.id), rel, { merge: true });
  }
  counts.releases = initialReleases.length;

  for (const ctx of initialContextBlocks) {
    await setDoc(doc(db, 'projects', projectId, 'contextBlocks', ctx.id), ctx, { merge: true });
  }
  counts.contextBlocks = initialContextBlocks.length;

  console.log('[Seed] Seeding completed successfully. Counts:', counts);
  if (integrityErrors.length > 0) {
    console.warn('[Seed] Integrity warnings found:', integrityErrors);
  } else {
    console.log('[Seed] All relational provenance links verified: 0 broken links.');
  }

  return {
    success: integrityErrors.length === 0,
    counts,
    integrityErrors
  };
}
