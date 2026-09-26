<![CDATA[<div align="center">

# 🌐 Dev Atlas — Cross-Role Project Intelligence OS

**A role-based, real-time project management operating system with AI-powered memory, security intelligence, and multi-workspace architecture.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.x-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Role-Based Access System](#-role-based-access-system)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Firebase Integration](#-firebase-integration)
- [Security Intelligence Layer](#-security-intelligence-layer)
- [AI & LLM Integration](#-ai--llm-integration)
- [Project Memory System](#-project-memory-system)
- [CRUD Operations](#-crud-operations)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔭 Overview

**Dev Atlas** is a comprehensive project intelligence platform designed for cross-functional teams. It unifies product management, design validation, engineering execution, QA testing, operations monitoring, and institutional memory into a single, role-adaptive workspace.

Unlike traditional project management tools, Dev Atlas treats **project memory** as a first-class citizen — every decision, meeting, task, and rationale is connected, searchable, and traceable across roles.

### What Makes Dev Atlas Unique

- **7 Role Perspectives**: Each team member sees exactly the data relevant to their function
- **Institutional Memory**: AI-powered memory engine preserves rationale chains and decision history
- **Real-Time Sync**: Firebase Firestore provides live data synchronization across all connected clients
- **Multi-Workspace**: Manage multiple projects simultaneously with independent data isolation
- **Security Intelligence**: Built-in vulnerability assessment framework with security gate scoring
- **AI Studio**: Contextual AI assistant with multi-LLM target support (GPT-4, Claude, Gemini, etc.)

---

## ✨ Key Features

### Product Management
- **Feedback Hub** — Multi-channel feedback aggregation (Google Play, Reddit, App Store, Discord, GitHub, Support Desk, Surveys) with sentiment analysis, bar charts, radar charts, and donut visualizations
- **Problem Clusters** — AI-powered grouping of user issues with severity scoring and automatic PRD promotion pipeline
- **Requirements (PRDs)** — Full lifecycle PRD management with cluster-to-PRD-to-task promotion, acceptance criteria, and stakeholder linking
- **Feature Requests** — Community-driven feature voting with requester tracking
- **Strategic Insights** — AI-extracted business intelligence from feedback patterns
- **Roadmap** — Epic-level roadmap visualization with timeline and progress tracking

### Design & UX
- **Research Sessions** — Structured UX research with methodology and participant tracking
- **UX Findings** — Research-backed findings with impact scoring
- **User Personas** — AI-refined personas with behavioral attributes
- **Validation Studio** — Visual diff comparisons between design specs and live implementations with annotation pins, mismatch counts, and collaborative review
- **Design Token Library** — Centralized design system tokens (colors, typography, spacing)
- **Figma Specs** — Frame-level specification management with responsive breakpoint tracking
- **Design Reviews** — Threaded review discussions with multi-role commenting

### Engineering
- **Kanban Board** — 4-column drag-and-drop task board (To Do → In Progress → Review → Done) with real-time Firestore sync
- **Sprint Features** — Feature-level sprint tracking with velocity metrics
- **Sandbox Builds** — Build environment management with status monitoring
- **Prompt Generator** — Multi-LLM prompt engineering studio with optimization modes (full-context, concise, chain-of-thought)

### Quality Assurance
- **Security Command Center** — OWASP-based vulnerability assessments with finding lifecycle management
- **QA Test Suite** — Test case management with pass/fail toggling and coverage tracking
- **Bug Tracker** — Severity-rated bug logging with auto-generated bug codes
- **Release Readiness** — Weighted readiness scoring with gate checks

### Operations
- **Product Health Dashboard** — Composite health scoring with metric gauges
- **Release Management** — Versioned release tracking with changelog and rollback documentation
- **Incident Management** — Incident response tracking with severity and timeline
- **Maintenance Tasks** — Scheduled maintenance and infrastructure task management

### Institutional Memory
- **Context Blocks** — Structured knowledge cards for architectural decisions, constraints, and team agreements
- **Second Brain** — AI-refinable scratchpad notes with automatic structuring into key points, technical takeaways, and action items
- **File Vault** — Centralized project artifact storage with tagging and categorization
- **Decisions Log** — Dual-mode decision recording: Technical ADRs (Architecture Decision Records) and Verbal Agreements, with full rationale chains
- **Meeting Summaries** — Structured meeting records with action item tracking, attendee lists, and automated decision extraction
- **Project Memory Ledger** — Cross-role event timeline with state management (active/superseded/archived), entity linking, and change rationale tracking

---

## 🎭 Role-Based Access System

Dev Atlas implements a 7-role navigation system. Each role surfaces a curated set of views relevant to that function:

| Role | Code | Default View | Available Sections |
|------|------|-------------|-------------------|
| **All** | `all` | Overview | Overview, Product Health, Roadmap, Meetings, Features, Requirements, Feedback, User Issues, Feature Requests, Insights, Context, Notes, Files, Decisions, Project Memory |
| **Product Manager** | `pm` | Requirements | Same as All (full visibility) |
| **Designer** | `designer` | Validation | Research, Findings, User Patterns, Validation, Designs, Figma, Reviews, Meetings, Project Memory |
| **Developer** | `dev` | Tasks | Tasks, Dev Features, Builds, Prompts, Validation, Context, Meetings, Project Memory |
| **QA Engineer** | `qa` | Security | Security, QA Status, Bugs, Release Readiness, Project Memory |
| **Operations** | `ops` | Product Health | Product Health, Releases, Incidents, Maintenance, Project Memory |
| **Memory Keeper** | `memory` | Context | Context, Notes, Files, Decisions, Project Memory |

**Project Memory is always accessible from every role** — ensuring cross-functional transparency.

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Dev Atlas Frontend                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    React 18 + TypeScript                 │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │    │
│  │  │ ProjectCtx│  │  AICtx   │  │ AuthCtx  │  │ Router │  │    │
│  │  │ (Global   │  │ (Studio  │  │ (Future  │  │ (URL   │  │    │
│  │  │  State)   │  │  Chat)   │  │  Auth)   │  │  Params│  │    │
│  │  └─────┬─────┘  └─────┬────┘  └────┬─────┘  └───┬────┘  │    │
│  │        │              │            │             │       │    │
│  │  ┌─────▼──────────────▼────────────▼─────────────▼───┐   │    │
│  │  │               34 View Components                   │   │    │
│  │  │  (Feedback, Tasks, Meetings, Security, Memory...) │   │    │
│  │  └──────────────────────┬────────────────────────────┘   │    │
│  │                         │                                │    │
│  │  ┌──────────────────────▼────────────────────────────┐   │    │
│  │  │             Repository Layer (Firestore)           │   │    │
│  │  │  taskRepo | meetingRepo | decisionRepo | memoryRepo│   │    │
│  │  └──────────────────────┬────────────────────────────┘   │    │
│  └─────────────────────────┼────────────────────────────────┘    │
│                            │                                     │
│  ┌─────────────────────────▼────────────────────────────────┐    │
│  │              Firebase / Firestore Backend                 │    │
│  │  • Real-time subscriptions (onSnapshot)                   │    │
│  │  • Document CRUD (setDoc, updateDoc, deleteDoc)           │    │
│  │  • Security Rules (firestore.rules)                       │    │
│  │  • Cloud Functions (functions/)                           │    │
│  └───────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### State Management Pattern

- **`ProjectContext`** — Single React Context provider managing all domain state (~1750 lines)
- **localStorage caching** — Workspace data is cached per-workspace for offline resilience
- **Firestore real-time sync** — `onSnapshot` subscriptions for tasks, meetings, decisions, and memory events
- **Optimistic updates** — Local state updates immediately, Firestore writes are fire-and-forget with error logging

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | React | 18.3 |
| **Language** | TypeScript | 5.7 |
| **Build** | Vite | 6.1 |
| **Styling** | TailwindCSS | 3.4 |
| **Backend** | Firebase (Firestore, Auth, Functions, Storage) | 12.x |
| **Charts** | Recharts | 3.10 |
| **Icons** | Lucide React | 0.475 |
| **Testing** | Vitest + Testing Library | 5.0 |
| **CSS Utils** | clsx + tailwind-merge | Latest |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Firebase CLI** (optional, for emulators/deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/tnex0734-ops/Dev-Atlas.git
cd Dev-Atlas

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run Vitest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run emulators` | Start Firebase local emulators |

---

## 🔐 Environment Variables

Create a `.env` file in the root directory. See `.env.example` for the template:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI Service (Optional)
VITE_OPENAI_API_KEY=your_openai_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key
```

> **Note**: The app works fully without AI keys — AI features will use demo/simulated responses.

---

## 📁 Project Structure

```
src/
├── App.tsx                          # Root component with role-based view routing
├── main.tsx                         # React DOM entry point
├── index.css                        # Global styles, design tokens, utility classes
├── vite-env.d.ts                    # Vite type declarations
│
├── components/
│   ├── ai/                          # AI Studio chat panel & message components
│   ├── auth/                        # Authentication components (login, guards)
│   ├── common/                      # Shared UI components
│   │   ├── BrandLogos.tsx           # Platform brand logos (Google Play, Reddit, etc.)
│   │   ├── CommandPalette.tsx       # Cmd+K global command palette
│   │   ├── IconBadge3D.tsx          # 3D-styled icon badge component
│   │   ├── MeetingCard.tsx          # Reusable meeting card
│   │   ├── MetricCard.tsx           # Dashboard metric card
│   │   ├── Modal.tsx                # Shared modal dialog
│   │   ├── OnboardingBanner.tsx     # First-time user onboarding
│   │   └── StatusBadge.tsx          # Color-coded status badges
│   ├── layout/
│   │   ├── Header.tsx               # Global header with workspace switcher
│   │   └── Sidebar.tsx              # Role-based navigation sidebar
│   ├── memory/                      # Project Memory components
│   │   ├── MemoryTrigger.tsx        # Inline memory link buttons
│   │   ├── RecordRationaleModal.tsx # Change rationale capture modal
│   │   └── RoleMemoryWidget.tsx     # Role-scoped memory widget
│   └── views/                       # 34 view components (see Role System above)
│       ├── OverviewView.tsx         # Dashboard with 3D mascot & health gauges
│       ├── FeedbackHubView.tsx      # Multi-channel feedback analytics
│       ├── DevTasksView.tsx         # Drag-and-drop Kanban board
│       ├── MeetingsView.tsx         # Meeting summaries with action items
│       ├── DecisionsLogView.tsx     # ADR & verbal agreement log
│       ├── SecurityCommandCenterView.tsx  # Vulnerability management
│       ├── ProjectMemoryView.tsx    # Cross-role memory ledger
│       ├── PromptGeneratorView.tsx  # Multi-LLM prompt engineering
│       ├── ValidationStudioView.tsx # Design-to-code visual diff
│       ├── ConnectorsView.tsx       # Third-party integration hub
│       └── ... (24 more view files)
│
├── context/
│   ├── ProjectContext.tsx           # Global state provider (~1750 lines)
│   ├── AIContext.tsx                # AI Studio chat state
│   └── AuthContext.tsx              # Authentication state
│
├── data/
│   ├── initialSeedData.ts           # Demo data for all domain entities
│   └── roleAIConfigs.ts             # Per-role AI personality configurations
│
├── security/
│   ├── types.ts                     # Security domain types
│   └── services/
│       ├── securityService.ts       # Vulnerability assessment engine
│       ├── securityGate.ts          # Release security gate evaluator
│       └── securityMetrics.ts       # Security health score calculator
│
├── services/
│   ├── aiService.ts                 # AI/LLM API abstraction layer
│   ├── connectorService.ts          # Third-party connector service
│   ├── contextRetriever.ts          # Contextual data retrieval for AI
│   ├── githubService.ts             # GitHub integration service
│   ├── groundedMemoryEngine.ts      # Memory grounding & linking engine
│   ├── linkResolver.ts              # Cross-entity link resolution
│   ├── firebase/
│   │   └── config.ts                # Firebase app initialization
│   └── repositories/
│       ├── taskRepository.ts        # Firestore CRUD for tasks
│       ├── meetingRepository.ts     # Firestore CRUD for meetings
│       ├── decisionRepository.ts    # Firestore CRUD for decisions
│       ├── memoryRepository.ts      # Firestore CRUD for memory events
│       ├── projectRepository.ts     # Firestore CRUD for projects
│       └── domainRepositories.ts    # Aggregated domain repository
│
├── types/
│   ├── index.ts                     # Core domain type definitions (~50+ interfaces)
│   └── aiTypes.ts                   # AI-specific type definitions
│
└── __tests__/                       # Vitest test suite (28+ tests)
```

### Root Configuration Files

```
├── .env.example              # Environment variable template
├── .firebaserc               # Firebase project alias
├── firebase.json             # Firebase hosting & functions config
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore composite indexes
├── storage.rules             # Firebase Storage security rules
├── tailwind.config.js        # TailwindCSS configuration
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── postcss.config.js         # PostCSS plugins
└── package.json              # Dependencies & scripts
```

---

## 🔥 Firebase Integration

### Firestore Collections

Dev Atlas uses a hierarchical Firestore structure:

```
projects/
  └── {projectId}/
      ├── tasks/          # DevTask documents
      ├── meetings/       # ProjectMeeting documents
      ├── decisions/      # ProjectDecision documents
      └── memoryEvents/   # ProjectMemoryEvent documents
```

### Real-Time Subscriptions

The app subscribes to 4 Firestore collections on workspace load:
- **Tasks** — Live Kanban board updates across all connected clients
- **Meetings** — Action item completion syncs in real time
- **Decisions** — New ADRs and verbal agreements appear instantly
- **Memory Events** — Cross-role memory ledger updates propagate live

### Security Rules

Firestore security rules are defined in `firestore.rules` with per-collection access control. The current setup supports both authenticated and development modes.

---

## 🛡 Security Intelligence Layer

Dev Atlas includes a built-in security assessment framework:

### Features
- **Automated Vulnerability Scanning** — OWASP-based assessment engine with configurable providers
- **Finding Lifecycle** — Open → Fix In Progress → Verified Fixed / Accepted Risk
- **Evidence Chain** — Every finding is backed by reproducible evidence artifacts
- **Security Gate** — Binary pass/fail release gate with configurable thresholds
- **Remediation Pipeline** — One-click promotion of security findings to developer tasks on the Kanban board
- **Risk Acceptance** — Formal risk acceptance workflow with approver, rationale, and optional expiry

### Security Metrics
- Security Health Score (0-100)
- Open Vulnerabilities Count
- Critical Vulnerability Count
- Assessment completion tracking

---

## 🤖 AI & LLM Integration

### AI Studio
- **Multi-LLM Target Support** — Configure prompts for GPT-4, Claude 3.5, Gemini Pro, Mistral Large, Llama 3, and more
- **Optimization Modes** — Full-context, concise, and chain-of-thought prompt strategies
- **Context-Aware** — AI receives relevant project context (active workspace, role, current view data)
- **Role-Specific Personas** — Each role has a dedicated AI personality configuration

### Prompt Generator
- **Engineering-Focused** — Generate implementation prompts, architecture prompts, and debugging prompts
- **Template Library** — Pre-built prompt templates for common engineering tasks
- **Token Estimation** — Approximate token counts for prompt budgeting

---

## 🧠 Project Memory System

The Project Memory System is Dev Atlas's flagship differentiator:

### Memory Events
Every significant project change is captured as a `ProjectMemoryEvent`:
```typescript
interface ProjectMemoryEvent {
  id: string;
  title: string;
  summary: string;
  rationale: string;        // WHY was this change made?
  role: RoleType;           // Which role initiated it?
  entityType: string;       // What type of entity changed?
  entityId: string;         // Which specific entity?
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  state: MemoryState;       // active | superseded | archived
  occurredAt: string;
  links?: MemoryLink[];     // Cross-entity references
}
```

### Memory Capabilities
- **Change Rationale Capture** — Modal to record why a change was made
- **Entity Linking** — Connect memory events across tasks, decisions, PRDs, and meetings
- **Timeline View** — Chronological history per entity
- **Role Filtering** — View memory events relevant to a specific role
- **Supersession Tracking** — Track when decisions or approaches are replaced
- **Cross-Role Visibility** — Project Memory Ledger is accessible from every role

---

## 🗑 CRUD Operations

Dev Atlas supports full **Create, Read, Update, and Delete** operations for all major entities:

| Entity | Create | Read | Update | Delete | Firestore Sync |
|--------|--------|------|--------|--------|----------------|
| Dev Tasks | ✅ | ✅ | ✅ (status drag-drop) | ✅ | ✅ Real-time |
| Meetings | ✅ | ✅ | ✅ (action items) | ✅ | ✅ Real-time |
| Decisions | ✅ | ✅ | ✅ (supersede) | ✅ | ✅ Real-time |
| Memory Events | ✅ | ✅ | ✅ (state) | ✅ | ✅ Real-time |
| Feedback | ✅ | ✅ | ✅ (upvote) | ✅ | Local only |
| Bugs | ✅ | ✅ | — | ✅ | Local only |
| Second Brain Notes | ✅ | ✅ | ✅ (AI refine) | ✅ | Local only |
| Context Blocks | ✅ | ✅ | — | ✅ | Local only |
| PRDs | ✅ | ✅ | — | — | Local only |
| Workspaces | ✅ | ✅ | ✅ (switch) | — | localStorage |

Delete operations include:
- **Confirmation dialogs** for destructive actions
- **Firestore cascading** deletes for synced entities
- **Local state cleanup** with toast notifications
- **Metric recalculation** where applicable (e.g., unrefined notes count)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

The test suite uses **Vitest** with **Testing Library** and covers:
- Type validation tests
- Security service unit tests
- Repository layer tests
- Component integration tests

Current status: **28/28 tests passing** ✅

---

## 🚀 Deployment

### Firebase Hosting

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy everything (hosting + functions + rules)
firebase deploy
```

### Manual Deployment

The `npm run build` command outputs to `dist/`. This can be deployed to any static hosting provider:

- **Vercel**: Connect the GitHub repo for automatic deployments
- **Netlify**: Set build command to `npm run build` and publish directory to `dist`
- **AWS S3 + CloudFront**: Upload `dist/` contents to S3

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New features
- `fix:` — Bug fixes
- `docs:` — Documentation
- `refactor:` — Code restructuring
- `test:` — Test additions/modifications
- `chore:` — Tooling and maintenance

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with precision by the Dev Atlas team.**

*Cross-role intelligence. Institutional memory. Zero context loss.*

</div>
]]>
