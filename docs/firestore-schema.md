# DevAtlas — Cloud Firestore Schema & Data Model

> **Document:** `docs/firestore-schema.md`  
> **Source of Truth:** Domain models from [`src/types/index.ts`](file:///c:/Users/TNEX/OneDrive/Desktop/devatlas/Signalslab/Signalslab/src/types/index.ts)  
> **Design Strategy:** Project-scoped subcollections for multi-tenant isolation, granular security rules, and horizontal scaling.

---

## 1. Top-Level Collections

### 1.1 `users/{userId}`
Stores user identity, profile, and global metadata created upon Firebase Auth signup.

```typescript
interface UserProfile {
  uid: string;                      // Firebase Auth UID (Document ID)
  email: string;                    // User email address
  displayName: string;              // Human readable name
  photoURL?: string;                // Profile avatar URL
  createdAt: Timestamp;             // Account creation timestamp
  updatedAt: Timestamp;             // Last profile update
  lastSeenAt?: Timestamp;           // Heartbeat timestamp
  onboardingCompleted?: boolean;    // Flag for introductory banner
}
```

---

## 2. Project-Scoped Collections: `projects/{projectId}`

### 2.1 `projects/{projectId}`
The root document for a workspace or project.

```typescript
interface ProjectDocument {
  id: string;                       // Unique project ID (e.g. 'ws-signals-flagship')
  code: string;                     // Short identifier code (e.g. 'STFL')
  name: string;                     // e.g. 'StreamFlow Live Media'
  tagline: string;                  // Short purpose summary
  description: string;              // Detailed project overview
  version: string;                  // Semantic version (e.g. 'v4.2.0')
  platform: string;                 // 'Android' | 'iOS' | 'Web' | etc.
  healthScore: number;              // Composite health score (0-100)
  activeSprint: string;             // Current sprint name
  createdAt: Timestamp;
  updatedAt: Timestamp;
  ownerId: string;                  // User UID of project owner
  ownerName?: string;
  techStack: string[];              // ['TypeScript', 'SQLite WASM', ...]
  themeColor: string;               // Brand color hex
  repoUrl?: string;                 // Linked GitHub repository URL
  deployedUrl?: string;             // Live deployed application URL
  socialLinks?: {
    website?: string;
    github?: string;
    figma?: string;
    discord?: string;
    other?: string[];
  };
  createdBy: string;                // Creator UID
  settings: {
    defaultAiProvider?: string;     // 'openrouter' | 'openai' | 'groq'
    defaultAiModel?: string;        // Default LLM model identifier
    allowCloudAI: boolean;          // Organization AI policy flag
    allowExternalIntegrations: boolean;
  };
}
```

### 2.2 `projects/{projectId}/members/{userId}`
Represents role-based membership for a specific user in this project.

```typescript
interface ProjectMemberDocument {
  userId: string;                   // Member UID (Document ID)
  projectId: string;
  role: 'all' | 'pm' | 'designer' | 'dev' | 'qa' | 'ops' | 'memory';
  status: 'active' | 'invited' | 'suspended';
  displayName: string;
  email: string;
  avatar?: string;
  invitedBy?: string;
  invitedAt?: Timestamp;
  joinedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.3 `projects/{projectId}/invites/{inviteId}`
Manages invitations sent to prospective members.

```typescript
interface ProjectInviteDocument {
  id: string;
  email: string;
  role: 'all' | 'pm' | 'designer' | 'dev' | 'qa' | 'ops' | 'memory';
  projectId: string;
  invitedBy: string;
  tokenHash?: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  createdAt: Timestamp;
  expiresAt: Timestamp;
}
```

---

## 3. Relational Domain Subcollections

### 3.1 `projects/{projectId}/meetings/{meetingId}`
Structured sync notes, discussions, decisions reached, and action items.

```typescript
interface MeetingDocument {
  id: string;                       // Document ID (e.g. 'mtg-024')
  meetingCode: string;              // e.g. 'MTG-024'
  title: string;
  date: Timestamp;
  durationMinutes: number;
  attendees: Array<{
    userId?: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  summary: string;                  // Executive summary
  discussionPoints: Array<{
    id: string;
    topic: string;
    summary: string;
    speaker?: string;
  }>;
  decisions: Array<{
    id: string;
    text: string;
    linkedDecisionId?: string;
    linkedDecisionCode?: string;
  }>;
  actionItems: Array<{
    id: string;
    title: string;
    ownerId?: string;
    ownerName: string;
    ownerRole: string;
    done: boolean;
    linkedTaskId?: string;
    linkedTaskCode?: string;
  }>;
  unresolvedQuestions: string[];
  status: 'Completed' | 'Action Required' | 'Follow-up Scheduled';
  roleTag: 'all' | 'pm' | 'designer' | 'dev' | 'qa' | 'ops' | 'memory';
  relatedFeature?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.2 `projects/{projectId}/decisions/{decisionId}`
Architecture Decision Records (ADRs) with immutable historical lineage.

```typescript
interface DecisionDocument {
  id: string;                       // Document ID (e.g. 'adr-001')
  decisionCode: string;             // e.g. 'ADR-001', 'DEC-101'
  title: string;
  category: 'Product' | 'Architecture' | 'Design' | 'Operations';
  context: string;                  // Background problem & constraints
  decisionMade: string;             // Chosen technical path
  consequences: string;             // Architectural trade-offs
  stakeholders: string[];           // Participant names
  date: Timestamp;
  status: 'active' | 'superseded' | 'deprecated' | 'proposed';
  linkedFeatureId?: string;
  relatedMeetingId?: string;        // Originating meeting ID
  relatedMeetingTitle?: string;
  relatedTaskId?: string;           // Downstream task ID
  relatedTaskCode?: string;
  supersededBy?: string;            // ID of replacing decision
  supersedes?: string;              // ID of prior superseded decision
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.3 `projects/{projectId}/tasks/{taskId}`
Developer Kanban work items with the "Why am I doing this?" Rationale Chain.

```typescript
interface TaskDocument {
  id: string;                       // Document ID (e.g. 'task-001')
  taskCode: string;                 // e.g. 'DEV-SIGN-001'
  title: string;
  requirementId?: string;           // Linked PRD ID
  requirementTitle?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'P0' | 'P1' | 'P2';
  assignee: {
    userId?: string;
    name: string;
    avatar?: string;
    role: string;
  };
  figmaFrameRef?: string;
  prLink?: string;
  branch?: string;
  contextSummary: string;
  techStackTags: string[];
  relatedDecisionId?: string;       // Originating ADR ID
  relatedDecisionCode?: string;     // e.g. 'ADR-001'
  relatedMeetingId?: string;        // Originating Sync ID
  relatedMeetingTitle?: string;
  whyItExists?: string;             // Plain-language rationale
  dependencies?: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
}
```

### 3.4 `projects/{projectId}/memoryEvents/{memoryEventId}`
Cross-disciplinary project memory events capturing institutional decisions, rationale diffs, and metric shifts.

```typescript
interface MemoryEventDocument {
  id: string;                       // Document ID (e.g. 'mem-001')
  eventType: 'created' | 'changed' | 'decision' | 'approved' | 'tested' | 'released' | 'incident' | 'rolled-back' | 'superseded' | 'validated';
  state: 'proposed' | 'active' | 'validated' | 'superseded' | 'rolled-back';
  title: string;
  summary: string;
  entityType: string;               // 'decision' | 'task' | 'prd' | 'design-token' | 'bug'
  entityId: string;                 // Target entity ID
  entityLabel: string;
  fieldChanges?: Array<{
    field: string;
    label: string;
    before: unknown;
    after: unknown;
  }>;
  whyChanged?: string;              // Plain-language justification
  decision?: string;
  alternativesConsidered?: string[];
  evidence?: string[];
  expectedImpact?: string;
  observedImpact?: Array<{
    metric: string;
    before: number;
    after: number;
    delta: number;
    unit?: string;
    direction?: string;
  }>;
  impactSummary?: string;
  authorId?: string;
  author: string;
  role: string;
  occurredAt: Timestamp;
  links?: Array<{
    type: string;
    targetId: string;
    label: string;
  }>;
  previousMemoryEventId?: string;
  supersedesMemoryEventId?: string;
  supersededByEventId?: string;
  source: 'manual' | 'system' | 'seed';
  rationaleRecorded: boolean;
  createdAt: Timestamp;
}
```

### 3.5 `projects/{projectId}/aiConversations/{conversationId}` & `messages/{messageId}`
Persisted role-aware AI chat history with source citations and token/cost telemetry.

```typescript
interface AIConversationDocument {
  id: string;
  projectId: string;
  userId: string;
  role: 'all' | 'pm' | 'designer' | 'dev' | 'qa' | 'ops' | 'memory';
  title: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface AIMessageDocument {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Timestamp;
  metadata?: {
    provider?: string;
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    estimatedCost?: number;
    currency?: 'USD' | 'INR';
    promptType?: string;
    sources?: Array<{
      type: string;
      entityId: string;
      label: string;
    }>;
    suggestedQuestions?: string[];
  };
}
```

### 3.6 `projects/{projectId}/files/{fileId}`
Metadata for binary documents stored in Cloud Storage.

```typescript
interface FileDocument {
  id: string;
  name: string;
  contentType: string;
  sizeBytes: number;
  storagePath: string;              // e.g. 'projects/{projectId}/files/{fileId}/{filename}'
  uploadedBy: string;
  uploadedAt: Timestamp;
  relatedEntityType?: string;
  relatedEntityId?: string;
  downloadUrl?: string;
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
}
```

---

## 4. Compound Firestore Indexes

The following composite indexes are defined in `firestore.indexes.json`:
1. `projects/{projectId}/meetings`: `(date DESC, status ASC)`
2. `projects/{projectId}/tasks`: `(status ASC, priority DESC)`
3. `projects/{projectId}/tasks`: `(assignee.userId ASC, status ASC)`
4. `projects/{projectId}/decisions`: `(status ASC, date DESC)`
5. `projects/{projectId}/memoryEvents`: `(occurredAt DESC, eventType ASC)`
6. `projects/{projectId}/aiConversations`: `(userId ASC, updatedAt DESC)`
