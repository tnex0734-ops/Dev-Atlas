# DevAtlas — Firebase Backend Architecture

> **Document:** `docs/firebase-architecture.md`  
> **Status:** Production Migration Blueprint  
> **Architecture:** Firebase Authentication + Cloud Firestore + Cloud Storage + Cloud Functions 2nd Gen + Security Rules

---

## 1. Backend Migration Audit Table

| Major Area | Current Implementation | Firebase Target Architecture | Migration Status |
| :--- | :--- | :--- | :---: |
| **Authentication** | Missing (Client-side role toggle only) | **Firebase Authentication** (`users/{uid}`, Email/Pass, Session tokens, Project Memberships) | **Implemented** |
| **Projects (Workspaces)** | Serialized in `localStorage` (`devatlas_workspaces_v2`) | **Cloud Firestore** (`projects/{projectId}`, subcollections for isolation) | **Implemented** |
| **Project Members & RBAC** | Missing (Any user can select any of 7 roles) | **Cloud Firestore** (`projects/{projectId}/members/{userId}`, strict Security Rules) | **Implemented** |
| **Meetings & Syncs** | Client React state / `initialSeedData.ts` | **Cloud Firestore** (`projects/{projectId}/meetings/{meetingId}`) + interactive action items | **Implemented** |
| **Decisions (ADRs)** | Client React state / `initialSeedData.ts` | **Cloud Firestore** (`projects/{projectId}/decisions/{decisionId}`) + immutable lineage | **Implemented** |
| **Tasks (Kanban)** | HTML5 drag-and-drop in React state | **Cloud Firestore** (`projects/{projectId}/tasks/{taskId}`) + real-time status sync | **Implemented** |
| **Project Memory** | `ProjectMemoryEvent[]` in React state | **Cloud Firestore** (`projects/{projectId}/memoryEvents/{memoryEventId}`) + lineage | **Implemented** |
| **AI System** | Browser-to-API REST calls (`aiService.ts`) with client keys | **Cloud Functions 2nd Gen** (`runRoleAI`) with server secrets & server-side context retrieval | **Implemented** |
| **AI Chat History** | Browser `localStorage` (capped at 100) | **Cloud Firestore** (`projects/{projectId}/aiConversations/{convId}/messages/{msgId}`) | **Implemented** |
| **GitHub Ingestion** | Client-side `fetch('api.github.com')` | **Cloud Functions 2nd Gen** (`importGithubRepo`) with rate-limit headers & token auth | **Implemented** |
| **Site Scraper** | Client-side direct fetch (CORS fragile) | **Cloud Functions 2nd Gen** (`scrapeSiteMetadata`) with SSRF protection & timeouts | **Implemented** |
| **File Vault** | Mock UI toasts | **Firebase Storage** (`projects/{projectId}/files/{fileId}`) + Firestore metadata | **Implemented** |
| **Link Checking** | Non-existent | **Central Link Resolver** (`linkResolver.ts`) + Automated health verification | **Implemented** |
| **Testing** | Zero automated tests | **Vitest** + **React Testing Library** + **Firebase Emulators** | **Implemented** |

---

## 2. Firebase Services Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                                 │
│                                                                             │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐  │
│  │     Firebase Auth     │ │     React Views      │ │   Link Resolver    │  │
│  │ (Session persistence) │ │ (33 Domain Views)    │ │ (Source Citations) │  │
│  └───────────┬───────────┘ └──────────┬───────────┘ └────────────────────┘  │
│              │                        │                                     │
│              ▼                        ▼                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                  Domain Repositories (Data Layer)                     │  │
│  │  • projectRepository   • meetingRepository   • decisionRepository     │  │
│  │  • taskRepository      • memoryRepository    • fileRepository         │  │
│  └───────────────────┬───────────────────────────┬───────────────────────┘  │
└──────────────────────┼───────────────────────────┼──────────────────────────┘
                       │ (Authenticated Writes)    │ (Privileged Operations)
                       ▼                           ▼
        ┌─────────────────────────────┐    ┌──────────────────────────────┐
        │       Cloud Firestore       │    │   Cloud Functions 2nd Gen    │
        │  • Strict Security Rules    │    │  • runRoleAI                 │
        │  • Project-scoped isolation │    │  • importGithubRepo          │
        │  • Real-time listeners      │    │  • scrapeSiteMetadata        │
        │  • projects/{id}/members    │    │  • validateLinks             │
        └──────────────┬──────────────┘    └──────────────┬───────────────┘
                       │                                  │
                       │ (Metadata)                       │ (Server Secrets)
                       ▼                                  ▼
        ┌─────────────────────────────┐    ┌──────────────────────────────┐
        │     Firebase Storage        │    │    External LLM Providers    │
        │  • projects/{id}/files/...  │    │  • OpenRouter                │
        │  • Authenticated access     │    │  • OpenAI                    │
        │  • Storage Security Rules   │    │  • Groq                      │
        └─────────────────────────────┘    └──────────────────────────────┘
```

---

## 3. Server-Side Secret Management

All LLM provider API keys and external integration tokens are held strictly server-side in Google Cloud Secret Manager / Cloud Functions environment variables:
- `OPENROUTER_API_KEY`
- `OPENAI_API_KEY`
- `GROQ_API_KEY`
- `GITHUB_TOKEN`

The frontend bundle contains **zero API secrets**. It only holds public Firebase project configuration (`apiKey`, `authDomain`, `projectId`, etc.), which is standard and safe for client distribution.
