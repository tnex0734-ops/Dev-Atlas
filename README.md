# 🧭 DevAtlas — Cross-Role Project Intelligence & Institutional Memory Operating System

> **A unified, real-time developer command center and institutional decision operating system.**  
> Connecting team discussions, architectural decisions (ADRs), engineering tasks, design specifications, security intelligence, and role-grounded AI into one continuous, verifiable source of truth.

<div align="center">

[![Deployed on Vercel](https://img.shields.io/badge/Deployment-Live%20on%20Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://devatlas-lake.vercel.app/?role=all&section=overview)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tests](https://img.shields.io/badge/Tests-28%2F28%20Passing-success?style=for-the-badge&logo=vitest&logoColor=white)](#-testing--quality-assurance)
[![WCAG AA](https://img.shields.io/badge/WCAG-AA%20Compliant-success?style=for-the-badge)](#-design-system--accessibility-wcag-aa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[**Live Application**](https://devatlas-lake.vercel.app/?role=all&section=overview) • [**System Architecture**](#-system-architecture) • [**Role System**](#-the-7-role-operating-system) • [**Views Catalog**](#-catalog-of-all-34-specialized-domain-views) • [**Data Schema**](#-core-domain-data-schema) • [**Getting Started**](#-getting-started--local-development)

</div>

> **Live Instance:** [https://devatlas-lake.vercel.app/?role=all&section=overview](https://devatlas-lake.vercel.app/?role=all&section=overview)

---

## 📋 Table of Contents

1. [📌 Problem Statement: Eradicating Institutional Amnesia](#-problem-statement-eradicating-institutional-amnesia)
2. [💡 The Core Solution: The Verifiable Rationale Chain](#-the-solution-the-verifiable-rationale-chain)
3. [📊 How DevAtlas Compares to Traditional Tooling](#-how-devatlas-compares-to-traditional-tooling)
4. [🎭 The 7-Role Operating System](#-the-7-role-operating-system)
5. [🏗️ System Architecture](#-system-architecture)
6. [🗂️ Catalog of All 34 Specialized Domain Views](#-catalog-of-all-34-specialized-domain-views)
7. [🧠 Institutional Project Memory System](#-institutional-project-memory-system)
8. [🤖 Dual-Engine AI Studio Architecture](#-dual-engine-ai-studio-architecture)
9. [🛠️ Developer Prompt Studio Compiler](#-developer-prompt-studio-compiler)
10. [🎨 Design Validation Studio (Figma vs Live Code)](#-design-validation-studio-figma-vs-live-code)
11. [🛡️ Security Command Center & Release Gate](#-security-command-center--release-gate)
12. [📡 Data Connectors Hub & Transcript Ingestion](#-data-connectors-hub--transcript-ingestion)
13. [🔥 Firebase Real-Time Cloud Sync & Offline Architecture](#-firebase-real-time-cloud-sync--offline-architecture)
14. [🗑️ Full CRUD & Delete Operations](#-full-crud--delete-operations)
15. [🔗 Central Cross-Entity Link Resolver](#-central-cross-entity-link-resolver)
16. [🎨 Design System & Accessibility (WCAG AA)](#-design-system--accessibility-wcag-aa)
17. [🛠️ Tech Stack & Dependencies](#-tech-stack--dependencies)
18. [📁 Repository Directory Structure](#-repository-directory-structure)
19. [🚀 Getting Started & Local Development](#-getting-started--local-development)
20. [🧪 Testing & Quality Assurance](#-testing--quality-assurance)
21. [🚢 Deployment Guide (Vercel, Firebase, Static Hosts)](#-deployment-guide)
22. [📐 Core Domain Data Schema (TypeScript)](#-core-domain-data-schema)
23. [🔄 Core System Workflows](#-core-system-workflows)
24. [❓ Technical FAQ](#-technical-faq)
25. [🤝 Contributing](#-contributing)
26. [📄 License](#-license)

---

## 📌 Problem Statement: Eradicating Institutional Amnesia

Modern software engineering organizations suffer from severe **Institutional Amnesia**:

```
                       THE CYCLE OF INSTITUTIONAL AMNESIA
                       
     Zoom / Meet Sync               Slack / Discord Thread
   "Let's migrate to JWT"          "Why is Redis failing here?"
           │                                    │
           ▼                                    ▼
┌───────────────────────┐            ┌───────────────────────┐
│  Decisions Evaporate  │            │ Context Lost in Chat  │
│  Unwritten trade-offs │            │ Unsearchable archives │
└──────────┬────────────┘            └──────────┬────────────┘
           │                                    │
           └──────────────────┬─────────────────┘
                              ▼
                 ┌───────────────────────────┐
                 │    Disconnected Tickets   │
                 │   Engineers know "WHAT"   │
                 │    Nobody knows "WHY"     │
                 └────────────┬──────────────┘
                              ▼
                 ┌───────────────────────────┐
                 │   Generic AI Hallucinates │
                 │ Violates unrecorded ADRs  │
                 │   Invents false consensus │
                 └────────────┬──────────────┘
                              ▼
                 ┌───────────────────────────┐
                 │ Massive Architectural     │
                 │ Regression & Team Friction│
                 └───────────────────────────┘
```

1. **Disconnected Silos & Evaporated Decisions:** Critical architectural trade-offs, scope revisions, and business constraints are hashed out in Zoom/Meet syncs or buried in Slack threads. Within weeks, the reasoning evaporates, leaving behind unexplained legacy code that no engineer dares refactor.
2. **The Lost "Why" of Engineering Tasks:** Engineers see a Jira or Linear ticket (e.g., *"Migrate session store to HttpOnly cookies"*), but have no record of *why* it was prioritized, *which* incident or security finding mandated it, or *what* Architectural Decision Record (ADR) governs its constraints.
3. **Generic AI Hallucinations:** Off-the-shelf AI assistants (ChatGPT, generic coding extensions) have zero institutional memory. They hallucinate architectural constraints, invent non-existent team consensus, and recommend libraries that violate established ADRs.
4. **Cross-Discipline Fragmentation:** Product Managers, UX Designers, Developers, QA Engineers, and DevOps/SREs operate in isolated software silos with divergent vocabularies, causing costly rework, missed edge cases, and regressed requirements.

---

## 💡 The Solution: The Verifiable Rationale Chain

DevAtlas transforms fragmented work into a continuous, verifiable **Project Memory Stream**:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Customer Signal │ ───► │ Meeting / Sync  │ ───► │  Decision (ADR) │ ───► │  Kanban Task    │
│  Feedback Hub   │      │   Discussion    │      │ Living Lineage  │      │ "Why am I doing │
│ Problem Cluster │      │  Action Items   │      │ Active/Supersede│      │     this?"      │
└─────────────────┘      └─────────────────┘      └─────────────────┘      └────────┬────────┘
                                                                                    │
                                                                                    ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ Project Memory  │ ◄─── │ Clickable Source│ ◄─── │  Role AI Studio │ ◄────┤ Cross-Entity    │
│ Ledger & Audit  │      │  Deep Citation  │      │ Grounded Answer │      │ Link Resolver   │
└─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘
```

Every work item maintains a bidirectional provenance chain:
- **Explicit "Why am I doing this?" Box:** When an engineer inspects a task like `DEV-SIGN-001`, the interface provides an explicit box titled:
  > **"Why am I doing this? (Rationale Chain)"**  
  > Directly linking to **`ADR-001: SQLite Embedded Storage Architecture`** and originating sync **`MTG-021: Architecture Sync`**.
- **Clickable AI Citations:** When an AI answers a team member's question, it cites exact in-memory project entities (`[decision] ADR-001`, `[meeting] MTG-021`, `[task] DEV-SIGN-001`). Clicking any citation switches the active view and navigates directly to that record.
- **Living Decision Lineage:** When an architectural decision is revised (e.g. `DEC-101` replaced by `DEC-102`), the historical decision is archived as `superseded` with a pointer to its successor, preserving institutional history forever.

---

## 📊 How DevAtlas Compares to Traditional Tooling

| Capability | Traditional Tooling (Jira, Linear, Notion, Slack) | DevAtlas Approach |
| :--- | :--- | :--- |
| **Task Management** | Isolated tickets with flat titles, status, and deadlines. | Contextual tickets with explicit **Rationale Chains** linked to originating meetings, ADRs, and PRDs. |
| **Meeting Minutes** | Static text pages in Notion/Docs that are never referenced again. | Relational syncs with live action items, auto-extracted ADRs, and direct "Ask AI about this meeting" analysis. |
| **Architectural Decisions** | Disconnected ADR files in Git repos or Confluence pages. | Living **Decision Ledger** with active vs. superseded states, lineage chains, and direct links to sprint tasks. |
| **Meeting Ingestion** | Manual copy-pasting of transcripts. | Automated **Connectors Hub** that parses Google Meet/Zoom transcripts into speakers, decisions, and tasks. |
| **AI Assistance** | Generic LLMs with no project context that hallucinate answers. | **Dual-Engine AI Studio** with role personas, 100% deterministic offline grounding, and cited deep-links. |
| **Prompt Engineering** | Ad-hoc text prompts written into web UIs. | **Developer Prompt Studio Compiler** targeting Claude XML, GPT JSON, DeepSeek CoT with token economy modes. |
| **Design Handoff** | Static Figma links pasted into ticket descriptions. | **Validation Studio** featuring side-by-side Figma vs Live Code inspection with interactive canvas discrepancy pins. |
| **Security Governance** | External scanning reports separated from sprint backlogs. | **Security Command Center** with OWASP probers, finding lifecycles, and 1-click promotion to Kanban tasks. |
| **Institutional Memory** | Non-existent; lives in employees' heads. | **Project Memory Ledger** tracking field changes, plain-language why-changed justifications, and metric deltas. |

---

## 🎭 The 7-Role Operating System

DevAtlas adapts its entire interface, navigation hierarchy, information density, and AI persona depending on the selected role perspective:

```
                  ┌──────────────────────────────────────────────┐
                  │           DevAtlas Role Switcher             │
                  └──────────────────────┬───────────────────────┘
          ┌─────────────┬────────────────┼────────────────┬─────────────┐
          ▼             ▼                ▼                ▼             ▼
    ┌───────────┐ ┌───────────┐    ┌───────────┐    ┌───────────┐ ┌───────────┐
    │ Developer │ │  Product  │    │  Designer │    │    QA     │ │Operations │
    │  (`dev`)  │ │  (`pm`)   │    │(`designer`)│   │  (`qa`)   │ │  (`ops`)  │
    └───────────┘ └───────────┘    └───────────┘    └───────────┘ └───────────┘
          │             │                │                │             │
          └─────────────┴────────────────┼────────────────┴─────────────┘
                                         ▼
                     ┌───────────────────────────────────────┐
                     │  Memory (`memory`) & All (`all`)      │
                     │  Full Transparency Across All Domains │
                     └───────────────────────────────────────┘
```

| Role | Code | Primary Domain & Focus | Default Landing View | Dedicated AI Studio Persona |
| :--- | :---: | :--- | :--- | :--- |
| **Software Engineering** | `dev` | Implementation velocity, Rationale Chains, Git branch telemetry, build sandboxes, prompt compilation. | `tasks` (Dev Tasks Kanban) | **Dev AI**: Explains architectural constraints, debugs code, cites ADRs, estimates token costs. |
| **Product Management** | `pm` | Customer feedback mining, problem clusters, PRD lifecycle, epic roadmaps, meeting action item tracking. | `requirements` (PRDs) | **Product AI**: Tracks sprint delivery, audits uncompleted meeting actions, analyzes user sentiment. |
| **UX & Design** | `designer` | Design-to-code parity, Figma spec compliance, design tokens, visual discrepancy pins, design reviews. | `validation` (Validation Studio)| **Design AI**: Audits UX patterns, checks design token adherence, summarizes usability findings. |
| **Quality & Security** | `qa` | Vulnerability assessment, OWASP findings, test suite coverage, defect triage, Go/No-Go release gates. | `security` (Security Center) | **QA AI**: Recommends edge-case test matrices, prioritizes P0 defects, audits security posture. |
| **DevOps & SRE** | `ops` | Service health telemetry, release sentiment tracking, production incident RCAs, maintenance runbooks. | `product-health` (Health Radar)| **Ops AI**: Analyzes incident root causes, evaluates release readiness, tracks system metrics. |
| **Memory Keeper** | `memory` | Architectural Context Blocks, AI Second Brain notes, File Vault, Living Decision Ledger, Project Memory. | `context` (Context Blocks) | **Memory AI**: Discovers institutional knowledge, cross-references historical decisions. |
| **Executive Leadership** | `all` | Bird's-eye progress telemetry, team velocity, 3D metric cards, company-wide health, governance audit. | `overview` (Executive Overview)| **Overview AI**: High-level cross-functional intelligence synthesis for executives. |

### Role Feature Access Matrix

| Feature / Domain | Developer (`dev`) | Designer (`designer`) | Product Manager (`pm`) | QA / Security (`qa`) | Operations (`ops`) | Leadership (`all`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Project Progress & Health** | Read-Only | Read-Only | Read-Only | Read-Only | Full Access | Full Access |
| **Discussions & Syncs** | Read / Create | Read / Create | Read / Create | Read-Only | Read-Only | Full Access |
| **Permanent ADRs** | Full Access | Read / Create | Full Access | Read-Only | Read / Create | Full Access |
| **Kanban Tasks** | Drag / Edit / Create | Read-Only | Read / Create | Read-Only | Read-Only | Full Access |
| **Customer Feedback Hub** | Read-Only | Read-Only | Full Access | Read-Only | Read-Only | Full Access |
| **Problem Cluster Promotion** | Read-Only | Read-Only | Full Access | Read-Only | Read-Only | Read-Only |
| **PRDs & Requirements** | Read-Only | Read-Only | Full Access | Read-Only | Read-Only | Full Access |
| **UX Research & Personas** | Read-Only | Full Access | Read-Only | Read-Only | Read-Only | Read-Only |
| **Validation Studio & Pins** | Resolve Pins | Drop Pins / Approve | Read-Only | Read-Only | Read-Only | Read-Only |
| **Prompt Studio Compiler** | Full Access | Hidden | Hidden | Hidden | Hidden | Hidden |
| **Security Scanner & Gates** | Remediate Tasks | Hidden | Hidden | Run Scan / Waive | Hidden | Read-Only |
| **QA Test Cases & Bugs** | Fix PR | Report Mismatch | Prioritize | Run / Log Bugs | Read-Only | Read-Only |
| **Releases & Incidents** | View Sandbox | Hidden | View Sentiment | Gate Check | Trigger / Resolve | Full Access |
| **Project Memory Ledger** | Filter (Dev/ADR) | Filter (Tokens) | Filter (Scope) | Filter (Root Cause)| Filter (Incidents)| All Disciplines |
| **Role AI Studio** | Dev AI | Design AI | Product AI | QA AI | Ops AI | Overview AI |

---

## 🏗️ System Architecture

DevAtlas employs a hybrid reactive architecture combining **React 18 Context**, a **Domain Repository Layer**, **Cloud Firestore real-time sync**, and **Local Storage offline caching**:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       CLIENT BROWSER RUNTIME                                    │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                  App.tsx (View Router)                                    │  │
│  │  ┌─────────────────────────┐  ┌───────────────────────────┐  ┌─────────────────────────┐  │  │
│  │  │   Top Navigation Bar    │  │   Role Perspective Bar    │  │  Global Command Palette │  │  │
│  │  │ (Header.tsx, Workspace) │  │ (Sidebar.tsx, 7 Roles)    │  │      (Ctrl+K / ⌘K)      │  │  │
│  │  └─────────────────────────┘  └───────────────────────────┘  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │                        Active View Container (34 Screen Views)                      │  │  │
│  │  │   Overview • Feedback • Tasks • Meetings • Decisions • Security • Validation • ...  │  │  │
│  │  └─────────────────────────────────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  ┌───────────────────────────┐  ┌─────────────────────────┐  │  │
│  │  │   MemoryDrawer.tsx      │  │    AIStudioDrawer.tsx     │  │   VoiceInput.tsx        │  │  │
│  │  │ (Audit Diffs & Lineage) │  │ (Grounded Chat + Tokens)  │  │  (Web Speech Recognition│  │  │
│  │  └─────────────────────────┘  └───────────────────────────┘  └─────────────────────────┘  │  │
│  └─────────────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                                │                                                │
│  ┌─────────────────────────────────────────────┴─────────────────────────────────────────────┐  │
│  │                                 CENTRAL STATE MANAGEMENT                                  │  │
│  │  ┌──────────────────────────────────┐ ┌────────────────────────────────────────────────┐  │  │
│  │  │       ProjectContext.tsx         │ │                 AIContext.tsx                  │  │  │
│  │  │ (Workspaces, Tasks, Meetings,    │ │ (Conversations, Messages, Active Persona,      │  │  │
│  │  │  Decisions, Memory Events, CRUD) │ │  Model Config, Token Metrics, Voice State)     │  │  │
│  │  └─────────────────┬────────────────┘ └───────────────────────┬────────────────────────┘  │  │
│  └────────────────────┼──────────────────────────────────────────┼───────────────────────────┘  │
│                       │                                          │                              │
│  ┌────────────────────┴──────────────────────────────────────────┴───────────────────────────┐  │
│  │                                     SERVICES & LOGIC LAYER                               │  │
│  │  ┌──────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────┐  │  │
│  │  │ groundedMemoryEngine.ts  │ │       aiService.ts        │ │    connectorService.ts   │  │  │
│  │  │ (100% Deterministic RAG) │ │ (OpenRouter/OpenAI/Groq)  │ │ (Transcript Regex Parser)│  │  │
│  │  └──────────────────────────┘ └───────────────────────────┘ └──────────────────────────┘  │  │
│  │  ┌──────────────────────────┐ ┌───────────────────────────┐ ┌──────────────────────────┐  │  │
│  │  │     linkResolver.ts      │ │     githubService.ts      │ │  securityService.ts      │  │  │
│  │  │ (Deep Link Resolution)   │ │ (Repo & Site Scraper)     │ │ (OWASP Scanner Adapters) │  │  │
│  │  └──────────────────────────┘ └───────────────────────────┘ └──────────────────────────┘  │  │
│  └────────────────────┬──────────────────────────────────────────────────────────────────────┘  │
│                       │                                                                         │
│  ┌────────────────────┴──────────────────────────────────────────────────────────────────────┐  │
│  │                                 FIRESTORE REPOSITORY LAYER                                │  │
│  │  ┌────────────────────────┐ ┌────────────────────────┐ ┌───────────────────────────────┐  │  │
│  │  │   taskRepository.ts    │ │  meetingRepository.ts  │ │    decisionRepository.ts      │  │  │
│  │  └────────────────────────┘ └────────────────────────┘ └───────────────────────────────┘  │  │
│  │  ┌────────────────────────┐ ┌────────────────────────┐ ┌───────────────────────────────┐  │  │
│  │  │   memoryRepository.ts  │ │   projectRepository.ts │ │    fileRepository.ts          │  │  │
│  │  └────────────────────────┘ └────────────────────────┘ └───────────────────────────────┘  │  │
│  └────────────────────┬──────────────────────────────────────────────────────────────────────┘  │
│                       │                                                                         │
│  ┌────────────────────┴────────────────────────┐       ┌─────────────────────────────────────┐  │
│  │           OFFLINE LOCAL STORAGE             │       │         REMOTE CLOUD FIRESTORE      │  │
│  │  • devatlas_ws_<id>_data (Full JSON cache)  │       │  • projects/{id}/tasks (Real-time)  │  │
│  │  • devatlas_active_ws_id                    │ ◄───► │  • projects/{id}/meetings           │  │
│  │  • devatlas_ai_conversations (Last 100)     │       │  • projects/{id}/decisions          │  │
│  │  • devatlas_connectors_<id>                 │       │  • projects/{id}/memoryEvents       │  │
│  └─────────────────────────────────────────────┘       └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Catalog of All 34 Specialized Domain Views

DevAtlas features **34 purpose-built domain views** categorized across the software engineering lifecycle:

```
                                  DEVATLAS VIEW SUITE (34 Views)
 ┌─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
 │   Executive     │    Product      │     Design      │   Engineering   │    Quality &    │
 │   & Health      │  & Feedback     │   Engineering   │   & Delivery    │    Security     │
 ├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
 │ OverviewView    │ FeedbackHubView │ ValidationStudio│ DevTasksView    │ SecurityCommand │
 │ ProductHealth   │ UserIssuesView  │ DesignLibrary   │ DevFeaturesView │ QAStatusView    │
 │ RoadmapView     │ RequirementsView│ FigmaSpecsView  │ BuildsSandbox   │ BugTrackerView  │
 │                 │ FeaturesView    │ DesignReviews   │ PromptGenerator │ ReleaseReadiness│
 │                 │ FeatureRequests │ ResearchSessions│                 │                 │
 │                 │ InsightsView    │ ResearchView    │                 │                 │
 │                 │                 │ UserPatternsView│                 │                 │
 └─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘
 ┌───────────────────────────────────┬───────────────────────────────────┬─────────────────┐
 │      Operations & SRE             │     Institutional Memory          │  Integrations   │
 ├───────────────────────────────────┼───────────────────────────────────┼─────────────────┤
 │ ReleasesView                      │ ContextBlocksView                 │ ConnectorsView  │
 │ IncidentsView                     │ SecondBrainView                   │                 │
 │ MaintenanceView                   │ FileVaultView                     │                 │
 │                                   │ DecisionsLogView                  │                 │
 │                                   │ ProjectMemoryView                 │                 │
 │                                   │ MeetingsView                      │                 │
 └───────────────────────────────────┴───────────────────────────────────┴─────────────────┘
```

### 1. Executive & Project Health
- [`OverviewView.tsx`](src/components/views/OverviewView.tsx): Executive telemetry command center featuring 3D rendered status mascots (Done: 18, In Progress: 6, Blocked: 3), composite sprint health ring (94%), recent pull requests, and the latest meeting card with live action items.
- [`ProductHealthView.tsx`](src/components/views/ProductHealthView.tsx): Cross-platform health radar tracking performance, crash rates, and regression metrics across Android, iOS, Web, and Backend services.
- [`RoadmapView.tsx`](src/components/views/RoadmapView.tsx): Strategic quarterly epic tracker displaying feature milestone progress bars, target release quarters, and deliverable owners.

### 2. Product Management & User Insights
- [`FeedbackHubView.tsx`](src/components/views/FeedbackHubView.tsx): Multi-channel customer review mining engine aggregating user feedback from Google Play, Apple App Store, Reddit, Discord, and Support Desk with interactive Recharts sentiment breakdowns (radar charts, donut charts, and sentiment bars).
- [`UserIssuesView.tsx`](src/components/views/UserIssuesView.tsx): AI-grouped problem clusters with velocity metrics, customer pain severity, root-cause diagnosis, and a 1-click **PRD Promotion Pipeline**.
- [`RequirementsView.tsx`](src/components/views/RequirementsView.tsx): Living PRD documents with linked problem clusters, business impact statements, user stories, acceptance criteria checklists, and assigned leads.
- [`FeaturesView.tsx`](src/components/views/FeaturesView.tsx): Product feature catalog with percentage progress tracking, feature owner chips, and connected requirement references.
- [`FeatureRequestsView.tsx`](src/components/views/FeatureRequestsView.tsx): Community-driven feature request board with upvoting, target quarters, and status categorization.
- [`InsightsView.tsx`](src/components/views/InsightsView.tsx): Strategic intelligence board detailing competitive threats, market opportunities, and high-leverage recommendations.

### 3. Design & UX Engineering
- [`ValidationStudioView.tsx`](src/components/views/ValidationStudioView.tsx): Side-by-side design audit canvas comparing Figma frame specifications directly against live sandbox builds. Supports **interactive canvas pin-dropping** (`spacing`, `color`, `typography`, `layout`, `behavior`), mismatch counters, and discrepancy resolution.
- [`DesignLibraryView.tsx`](src/components/views/DesignLibraryView.tsx): Centralized design token repository organizing brand colors, font scales, spacing tokens, border radii, and CSS variables.
- [`FigmaSpecsView.tsx`](src/components/views/FigmaSpecsView.tsx): Detailed frame-by-frame specification viewer showing layout grids, padding, typography tokens, and last Figma sync timestamps.
- [`DesignReviewsView.tsx`](src/components/views/DesignReviewsView.tsx): Threaded design review discussion board with component critiques, multi-role commenting, and review approval flags.
- [`ResearchSessionsView.tsx`](src/components/views/ResearchSessionsView.tsx): User interview session logs recording session duration, methodology, target personas, and key customer quotes.
- [`ResearchView.tsx`](src/components/views/ResearchView.tsx): UX usability findings database tracking observed user friction points, severity ratings, and recommended design interventions.
- [`UserPatternsView.tsx`](src/components/views/UserPatternsView.tsx): Behavioral persona profiles outlining user frustration triggers, usage patterns, and tailored design treatments.

### 4. Software Engineering & Delivery
- [`DevTasksView.tsx`](src/components/views/DevTasksView.tsx): 4-column drag-and-drop Kanban board (**To Do**, **In Progress**, **In Review**, **Done**) with HTML5 drag events, keyboard step controls, task deletion with confirmation, and the prominent **"Why am I doing this? (Rationale Chain)"** linking tasks directly to ADRs and meetings.
- [`DevFeaturesView.tsx`](src/components/views/DevFeaturesView.tsx): Active developer branch tracker with Git commit counts, PR review status, and linked task codes.
- [`BuildsSandboxView.tsx`](src/components/views/BuildsSandboxView.tsx): CI/CD build artifact dashboard monitoring commit hashes, bundle sizes, build durations, and interactive sandbox preview environments.
- [`PromptGeneratorView.tsx`](src/components/views/PromptGeneratorView.tsx): Developer Prompt Studio Compiler targeting 5 LLM model families with 4 optimization modes, token budgeting, and dual-currency execution cost estimation ($ & ₹).

### 5. Quality Assurance & Security
- [`SecurityCommandCenterView.tsx`](src/components/views/SecurityCommandCenterView.tsx): Vulnerability management dashboard supporting OWASP-based scanners (`VulnClaw` DAST prober, `Strix` SAST scanner), finding lifecycle tracking (`open` → `fix-in-progress` → `verified-fixed` / `accepted-risk`), and 1-click **Promotion to Dev Task**.
- [`QAStatusView.tsx`](src/components/views/QAStatusView.tsx): Automated E2E and manual test suite manager with pass/fail toggling, suite runtimes, and coverage statistics.
- [`BugTrackerView.tsx`](src/components/views/BugTrackerView.tsx): Defect management board categorized by severity (`P0` Blocker to `P3` Minor), reporter, assignee, affected feature, and delete actions.
- [`ReleaseReadinessView.tsx`](src/components/views/ReleaseReadinessView.tsx): Release Go/No-Go readiness gate evaluator computing composite release scores against weighted criteria checklists.

### 6. Operations & Site Reliability
- [`ReleasesView.tsx`](src/components/views/ReleasesView.tsx): Deployment log tracking production versions, rollouts, changelogs, rollback procedures, and pre vs. post-deployment customer sentiment delta.
- [`IncidentsView.tsx`](src/components/views/IncidentsView.tsx): Production outage incident manager tracking severity (`P0`-`P2`), affected user counts, incident timelines, and Root Cause Analysis (RCA) documentation.
- [`MaintenanceView.tsx`](src/components/views/MaintenanceView.tsx): Infrastructure maintenance runbook tracking database migrations, TLS renewals, cluster upgrades, and responsible engineers.

### 7. Institutional Memory & Knowledge
- [`ContextBlocksView.tsx`](src/components/views/ContextBlocksView.tsx): Reusable architecture knowledge cards documenting API contracts, security invariants, performance budgets, and database indexing rules.
- [`SecondBrainView.tsx`](src/components/views/SecondBrainView.tsx): Quick scratchpad note capture with an **AI Executive Synthesis Refiner** that transforms raw notes into structured specs with key takeaways and action items.
- [`FileVaultView.tsx`](src/components/views/FileVaultView.tsx): Project artifact storage manager cataloging OpenAPI specifications, system architecture diagrams, and requirements PDFs.
- [`DecisionsLogView.tsx`](src/components/views/DecisionsLogView.tsx): Living Architecture Decision Record (ADR) ledger tracking problem context, technical choices, consequences, and immutable lineage pointers (`active` vs. `superseded`).
- [`ProjectMemoryView.tsx`](src/components/views/ProjectMemoryView.tsx): The central cross-role Project Memory Ledger displaying chronological event timelines, before/after diffs, plain-language justifications, and metric deltas.
- [`MeetingsView.tsx`](src/components/views/MeetingsView.tsx): Master-detail discussion viewer with meeting minutes, interactive action items with real-time Firestore sync, attendees, and "Ask AI about this meeting" integration.

### 8. Integrations & Connectors
- [`ConnectorsView.tsx`](src/components/views/ConnectorsView.tsx): Central integration hub for GitHub, Google Meet, Zoom, Slack, and Notion with automated transcript parsing and entity extraction.

---

## 🧠 Institutional Project Memory System

The Project Memory System is the architectural backbone of DevAtlas. Every significant modification across tasks, decisions, PRDs, or security findings generates an immutable `ProjectMemoryEvent`:

```typescript
export interface ProjectMemoryEvent {
  id: string;                       // e.g. 'mem-001'
  eventType: MemoryEventType;       // 'created' | 'changed' | 'decision' | 'superseded' | 'rolled-back'
  state: MemoryState;               // 'proposed' | 'active' | 'validated' | 'superseded' | 'rolled-back'
  title: string;
  summary: string;
  entityType: string;               // 'decision' | 'task' | 'prd' | 'design-token' | 'bug'
  entityId: string;                 // e.g. 'DEC-101', 'DEV-SIGN-001'
  entityLabel: string;
  fieldChanges?: MemoryFieldChange[]; // [{ field, label, before, after }]
  whyChanged?: string;              // Plain-language human rationale
  decision?: string;                // Concrete decision statement
  alternativesConsidered?: string[];
  evidence?: string[];              // Telemetry, customer tickets, test logs
  expectedImpact?: string;          // Anticipated metric shift
  observedImpact?: MemoryMetricImpact[]; // [{ metric, before, after, delta, unit }]
  author: string;
  role: RoleType | string;
  occurredAt: string;
  links?: MemoryLink[];             // Clickable deep-links to other views
  previousMemoryEventId?: string;   // Historical lineage pointer
  supersededByEventId?: string;     // Pointer to superseding ADR
  source: 'manual' | 'system' | 'seed';
  rationaleRecorded: boolean;
}
```

### Memory Lifecycle & Audit Inspection

```
1. TRIGGER
   Engineer modifies a decision, task, token, or architecture constraint.
        │
        ▼
2. CAPTURE RATIONALE (RecordRationaleModal.tsx)
   User records:
   • Human rationale: "Why was this changed?"
   • Field Diffs: Before ("JWT in localStorage") vs. After ("HttpOnly Cookie with CSRF")
   • Alternatives Considered: ["Custom header with refresh token", "Session tokens in Redis"]
   • Expected Impact: "Eliminates XSS token exfiltration risk"
        │
        ▼
3. IMMUTABLE LINEAGE LINKING
   If replacing a previous record, the old entity's state changes to 'superseded'.
   supersededByEventId points to the replacement; the historical record remains intact.
        │
        ▼
4. SLIDE-OVER INSPECTION (MemoryDrawer.tsx)
   Clicking any <MemoryTrigger /> opens the global slide-over drawer showing:
   • State badge (Active, Superseded, Rolled-Back)
   • Visual Before/After diff cards
   • Plain-language rationale and evidence tags
   • Observed telemetry impact with positive/negative delta indicators
   • Historical lineage breadcrumb chain
        │
        ▼
5. AI REASONING & CITATIONS
   contextRetriever.ts injects memory events into the AI Studio context window.
   AI responses include clickable [memory], [decision], and [meeting] citation pills.
```

---

## 🤖 Dual-Engine AI Studio Architecture

DevAtlas features an advanced **Dual-Engine AI Architecture** designed for both zero-dependency local execution and production-grade cloud LLM execution:

```
                                  ┌────────────────────────┐
                                  │      User Prompt       │
                                  └───────────┬────────────┘
                                              │
                                              ▼
                             ┌─────────────────────────────────┐
                             │    contextRetriever.ts          │
                             │  • Role-Aware Context Assembly  │
                             │  • 12,000 Char / ~3,000 Tokens  │
                             │  • Injects ADRs, Tasks, Memory  │
                             └────────────────┬────────────────┘
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │ Check API Key & Network Connectivity          │
                      ▼                                               ▼
         [ No Key / Offline / Fallback ]                      [ Key Configured ]
         ┌─────────────────────────────┐               ┌─────────────────────────────┐
         │  groundedMemoryEngine.ts    │               │        aiService.ts         │
         │  • 100% Deterministic RAG   │               │  • OpenRouter / OpenAI/Groq │
         │  • Zero Network Dependencies│               │  • Claude, GPT-4o, DeepSeek │
         │  • In-Memory Regex Matching │               │  • Token & Cost Computation │
         │  • Verified Source Citations│               │  • Follow-Up Question Gen   │
         └──────────────┬──────────────┘               └──────────────┬──────────────┘
                        │                                             │
                        └──────────────────────┬──────────────────────┘
                                               │
                                               ▼
                             ┌─────────────────────────────────┐
                             │       AIMessageBubble.tsx       │
                             │  • Formatted Markdown Stream    │
                             │  • Clickable AISource[] Pills   │
                             │  • Token Count & Cost Display   │
                             │  • Quick Follow-Up Chips        │
                             └─────────────────────────────────┘
```

### 1. Grounded Offline Memory Engine (`groundedMemoryEngine.ts`)
- **100% Deterministic & Zero-Dependency:** Runs entirely in browser JavaScript memory without making any external HTTP requests.
- **Zero API Key Required:** Evaluators can clone the repo and immediately test AI capabilities out-of-the-box.
- **Intent Classifier:** Accurately routes queries into 5 domain buckets:
  1. *Meetings & Syncs:* Extracts latest meetings, decisions reached, action items, and assignees.
  2. *Decisions & ADRs:* Queries ADR records by title, context, trade-offs, and consequences.
  3. *Tasks & Pending Work:* Summarizes active tasks, blocked work, assignees, and rationale.
  4. *QA, Bugs & Edge Cases:* Summarizes open defects, test pass rates, and generates contextual edge-case test matrices.
  5. *Project Health & Overview:* General project velocity, sprint status, and recent changes.
- **Zero Hallucinations:** Answers are constructed strictly from in-memory records with attached verifiable `AISource` references.

### 2. Live Cloud LLM Client (`aiService.ts`)
- **Supported Providers:**
  - **OpenRouter** (`https://openrouter.ai/api/v1/chat/completions`): Claude 3.5 Haiku, Claude 3.5 Sonnet, Gemini 2.0 Flash, Llama 3.1 70B, DeepSeek Chat.
  - **OpenAI** (`https://api.openai.com/v1/chat/completions`): GPT-4o-mini, GPT-4o, GPT-4.1-mini.
  - **Groq** (`https://api.groq.com/openai/v1/chat/completions`): Llama 3.1 8B Instant, Llama 3.1 70B Versatile, Mixtral 8x7B.
- **Token Counting & Dual-Currency Cost Calculator:** Assistant message bubbles display input tokens (`↑`), output tokens (`↓`), and estimated execution cost in both USD ($) and INR (₹).
- **Native Voice Input:** Integrated microphone button in [`VoiceInput.tsx`](src/components/ai/VoiceInput.tsx) utilizing the browser's Web Speech API for real-time speech-to-text dictation.

---

## 🛠️ Developer Prompt Studio Compiler

Implemented in [`PromptGeneratorView.tsx`](src/components/views/PromptGeneratorView.tsx), this specialized compiler transforms project specifications into model-optimized prompt payloads tailored for specific LLM architectures:

```
┌─────────────────────────────────┐
│       Task / Feature Context    │
│  (PRD, Invariants, ADRs, Code)  │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Prompt Compiler Pipeline                     │
│  ┌───────────────────────┐  ┌────────────────────────────────┐  │
│  │ Target Model Syntaxes │  │       Optimization Modes       │  │
│  │ • Anthropic Claude XML│  │ • full-context (Complete spec) │  │
│  │ • OpenAI GPT JSON     │  │ • token-economy (~52% AST cut) │  │
│  │ • Google Gemini Delim │  │ • security-hardened (Invariants│  │
│  │ • DeepSeek CoT Reason │  │ • tdd-verification (Test matrix│  │
│  │ • Meta Llama Compact  │  │                                │  │
│  └───────────────────────┘  └────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Output Payload + Token Budget + Execution Cost Estimator ($ / ₹)│
└─────────────────────────────────────────────────────────────────┘
```

- **Claude Optimization:** Generates hierarchical XML structures (`<prompt_spec>`, `<objective>`, `<prd>`, `<security_invariants>`, `<ast_signatures>`).
- **GPT-4o Optimization:** Enforces strict JSON Schema response formats and structured markdown fences.
- **DeepSeek Optimization:** Embeds Chain-of-Thought (CoT) reasoning triggers.
- **Token Economy Mode:** Achieves ~52% token reduction by compressing AST signatures and stripping redundant descriptions.
- **Security-Hardened Mode:** Injects P0 mandatory security defenses and CVSS remediation invariants directly into the prompt.

---

## 🎨 Design Validation Studio (Figma vs Live Code)

Implemented in [`ValidationStudioView.tsx`](src/components/views/ValidationStudioView.tsx), the Validation Studio bridges the divide between UX Designers and Frontend Engineers:

- **Side-by-Side Canvas:** Renders the design specification frame alongside an interactive live sandbox implementation.
- **Interactive Discrepancy Pinning:** Users click anywhere on the canvas to place a discrepancy pin, specifying:
  - Discrepancy Type: `spacing`, `color`, `typography`, `layout`, or `behavior`.
  - Severity: `low`, `medium`, `high`, `critical`.
  - Annotation Note: e.g. *"Button vertical padding is 12px instead of 16px design token"*.
- **Discrepancy Tally & History:** Pin locations are tracked in state, updating the mismatch counter and validation history ledger.
- **Resolution Workflow:** Developers resolve pins directly, providing verified visual regression tracking.

---

## 🛡️ Security Command Center & Release Gate

DevAtlas features an integrated security assessment framework in [`src/security/`](src/security/):

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Security Command Center Subsystem                    │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │    Scanner Adapters     │  │          Finding Lifecycle          │  │
│  │ • VulnClaw DAST Prober  │  │   Open ──► Triaged ──► In Progress  │  │
│  │ • Strix SAST AST Engine │  │             │              │        │  │
│  │ • Demo Fallback Scanner │  │             ▼              ▼        │  │
│  └───────────┬─────────────┘  │      Accepted Risk   Verified Fixed │  │
│              │                └─────────────────────────────────────┘  │
│              ▼                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │             Security Gate Evaluator (securityGate.ts)            │  │
│  │   • Evaluates Critical / High CVSS findings                      │  │
│  │   • Binary Go / No-Go deployment blocker                         │  │
│  │   • One-Click "Promote Finding to Dev Task" on Kanban Board      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Modular Scanner Adapters:**
  - `VulnClawSecurityAdapter`: Simulates dynamic API probers detecting BOLA (Broken Object Level Authorization), IDOR, and SSRF flaws.
  - `StrixSecurityAdapter`: Simulates static AST scanners detecting SQL injection, hardcoded secrets, and XSS sinks.
- **Evidence Chain:** Every finding stores raw HTTP requests, response headers, and line-level code references.
- **Formal Risk Acceptance:** Findings can be formally accepted with approver identity, rationale, and expiration dates.
- **1-Click Remediation Promotion:** Clicking "Create Remediation Task" automatically instantiates a `DevTask` on the Kanban board with linked CVE/CWE data.
- **Release Security Gate:** Automatically evaluates whether open vulnerabilities exceed the maximum risk threshold, blocking production releases when unresolved P0 issues remain.

---

## 📡 Data Connectors Hub & Transcript Ingestion

Implemented in [`ConnectorsView.tsx`](src/components/views/ConnectorsView.tsx) and [`connectorService.ts`](src/services/connectorService.ts):

- **Supported Platforms:**
  - **Google Meet:** Audio transcript ingestion and speaker diarization.
  - **Zoom:** Video recording metadata and closed-caption transcripts.
  - **GitHub:** Repository branches, commit lineage, and pull request synchronization.
  - **Slack:** Architecture discussions and thread synthesis.
  - **Notion:** Knowledge base and documentation import.
- **Native Heuristic Transcript Parsing:**
  The ingestion engine parses raw meeting transcripts into structured components:
  - **Attendees:** Automatically identified from speaker turns.
  - **Executive Summary:** Synthesized from discussion flow.
  - **Key Decisions:** Extracted using linguistic decision indicators (*"we agreed to"*, *"the decision is"*, *"we mandate"*).
  - **Action Items:** Extracted with assigned owners and deadlines (*"Alice will implement"*, *"Bob to review"*).
  - **Unresolved Questions:** Flagged for subsequent sync follow-ups.
- **Direct Entity Promotion:** With one click, parsed decisions become permanent ADRs in `DecisionsLogView`, and action items become tasks in `DevTasksView`.

---

## 🔥 Firebase Real-Time Cloud Sync & Offline Architecture

DevAtlas utilizes Google Cloud Firebase to deliver multi-client real-time synchronization:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      Cloud Firestore Structure                      │
│                                                                     │
│  users/{userId}                    ── User Profile & Preferences    │
│  projects/{projectId}              ── Workspace Metadata Document   │
│    ├── members/{userId}            ── RBAC Membership Document      │
│    ├── tasks/{taskId}              ── DevTask (Real-Time Kanban)    │
│    ├── meetings/{meetingId}        ── ProjectMeeting & Action Items │
│    ├── decisions/{decisionId}      ── ProjectDecision (ADR Lineage) │
│    ├── memoryEvents/{eventId}      ── ProjectMemoryEvent Ledger     │
│    ├── aiConversations/{convId}    ── Multi-turn AI Chat Threads    │
│    └── files/{fileId}              ── File Metadata Documents       │
└─────────────────────────────────────────────────────────────────────┘
```

### Domain Repositories Layer (`src/services/repositories/`)
- [`taskRepository.ts`](src/services/repositories/taskRepository.ts): Real-time `onSnapshot` listeners, `createTask`, `updateTaskStatus`, `deleteTask`.
- [`meetingRepository.ts`](src/services/repositories/meetingRepository.ts): `onSnapshot` listeners, `createMeeting`, `toggleActionItem`, `deleteMeeting`.
- [`decisionRepository.ts`](src/services/repositories/decisionRepository.ts): `onSnapshot` listeners, `createDecision`, `supersedeDecision`, `deleteDecision`.
- [`memoryRepository.ts`](src/services/repositories/memoryRepository.ts): `onSnapshot` listeners, `createMemoryEvent`, `updateMemoryState`, `deleteMemoryEvent`.
- [`projectRepository.ts`](src/services/repositories/projectRepository.ts): Workspace creation, metadata updates, member management.
- [`fileRepository.ts`](src/services/repositories/fileRepository.ts): File metadata management and Firebase Storage pointers.

### Offline Resilience & Optimistic Updates
1. When a user updates a task status or checks an action item, local React state updates **in < 1ms**.
2. The mutation is saved immediately to `localStorage` under `devatlas_ws_<id>_data`.
3. The repository dispatches an asynchronous write to Cloud Firestore via `setDoc`, `updateDoc`, or `deleteDoc`.
4. If the client is offline, Firestore's offline persistence buffers the mutation until connectivity is restored.

---

## 🗑️ Full CRUD & Delete Operations

DevAtlas supports complete **Create, Read, Update, and Delete** operations across all major entities, featuring confirmation modals, Firestore cascading deletes, and metric recalculations:

| Entity | Create UI | Read / Inspect | Update / Modify | Delete Action | Storage & Sync Layer |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Dev Tasks** | Modal | Kanban Card & Detail Modal | Drag-and-drop status, priority | Trash icon + confirmation | Real-time Cloud Firestore (`tasks/`) + LocalStorage |
| **Meetings** | Modal | Master-Detail Inspector | Toggle action item checkboxes | Trash icon + confirmation | Real-time Cloud Firestore (`meetings/`) + LocalStorage |
| **Decisions (ADRs)** | Modal | Living ADR Cards | Mark superseded, edit context | Trash icon + confirmation | Real-time Cloud Firestore (`decisions/`) + LocalStorage |
| **Project Memory** | Modal | Slide-over Memory Drawer | Transition state, attach diffs | Trash icon + confirmation | Real-time Cloud Firestore (`memoryEvents/`) + LocalStorage |
| **Bug Reports** | Modal | Bug Tracker Table | Status & assignee updates | Trash icon + confirmation | LocalStorage (`devatlas_ws_<id>_data`) |
| **Second Brain Notes**| Inline | Scratchpad Cards | AI Executive Refiner | Trash icon + confirmation | LocalStorage (`devatlas_ws_<id>_data`) |
| **Context Blocks** | Modal | Card Grid | Edit invariants & contracts | Trash icon + confirmation | LocalStorage (`devatlas_ws_<id>_data`) |
| **Feedback Items** | Modal | Feedback Hub Board | Upvoting & sentiment tagging | Trash icon + confirmation | LocalStorage (`devatlas_ws_<id>_data`) |
| **Workspaces** | Header Modal | Workspace Switcher | Edit metadata & version | LocalStorage | LocalStorage (`devatlas_workspaces_v2`) |

---

## 🔗 Central Cross-Entity Link Resolver

Implemented in [`src/services/linkResolver.ts`](src/services/linkResolver.ts), the Link Resolver provides a uniform routing mechanism that maps any entity citation to its target view, role, and item identifier:

```typescript
export interface EntityLinkTarget {
  type: string;  // 'decision' | 'meeting' | 'task' | 'memory' | 'prd' | 'bug' | 'security'
  id: string;    // e.g. 'ADR-001', 'MTG-024', 'DEV-SIGN-001'
  label?: string;
}

export function resolveInternalEntityLink(target: EntityLinkTarget): ResolvedNavigationState;
```

Used uniformly across:
- **AI Source Citations:** Clicking `[decision] ADR-001` in the chat drawer opens the Decisions Log and highlights the record.
- **Rationale Chains:** Clicking `Originating Sync: MTG-021` in a Kanban card navigates to the meeting notes.
- **Meeting Decisions:** Clicking a decision pill inside a meeting card switches to the Decisions Log.
- **Global Command Palette (<kbd>⌘K</kbd>):** Searches across all entity types and executes instantaneous navigation.

---

## 🎨 Design System & Accessibility (WCAG AA)

DevAtlas is crafted in accordance with modern design standards, anti-slop frontend principles, and strict **WCAG AA** accessibility standards:

### 1. The 60:30:10 Color Rule
- **60% Neutral Base:** Warm Creme (`#FAF7F2`) page background, pure white (`#FFFFFF`) card surfaces, and subtle stone borders (`#EBE5DC`).
- **30% Brand Color:** Charcoal Black (`#161616` / `#18181b`) on headings, dark hero cards, and navigation bars.
- **10% Accent / CTA:** High-Contrast Terracotta Orange (`#FF6039`, hover `#E54D26`, subtle `#FFF0EC`, border `#FFD6CC`).

### 2. Triple-Coded Status System
To ensure complete accessibility for users with color vision deficiencies, status badges never rely solely on color. Every badge renders:
$$\textbf{Status Badge} = \textbf{Icon} + \textbf{Text Label} + \textbf{Color Tint}$$
- **Done / Active:** `CheckCircle2` + `"Done"` + Emerald (`#059669`)
- **In Progress / Warning:** `Clock` + `"In Progress"` + Amber (`#D97706`)
- **Blocked / Critical:** `AlertOctagon` + `"Blocked"` + Red (`#B91C1C`)
- **Architectural ADR:** `Scale` + `"Active Decision"` + Purple (`#7C3AED`)

### 3. Typography Hierarchy
- **Display & Headings:** Google Font **`Space Grotesk`** (weights 500, 600, 700) with tight letter tracking (`tracking-tight`).
- **Body & UI Controls:** **`Space Grotesk`** (weights 400, 500) and system sans-serif fallback.
- **Monospace & Metadata:** Google Font **`Space Mono`** for ticket codes (`DEV-001`, `ADR-001`), timestamps, commit hashes, and token counts.

### 4. 3-Tier Card Elevation Hierarchy
- `.card-level-1`: Standard white card (`bg-white border-[#EBE5DC] shadow-[0px_2px_4px_rgba(0,0,0,0.02)]`).
- `.card-level-2`: Highlighted accent card (`bg-[#FFF9F6] border-[#FF6039]/40 ring-1 ring-[#FF6039]/20`).
- `.card-level-3`: Dark hero card (`bg-[#161616] text-white border-[#2E2E2E] shadow-[0px_8px_32px_rgba(0,0,0,0.25)]`).

### 5. Keyboard Navigation & Reduced Motion
- Universal focus visible ring: `*:focus-visible { ring-2 ring-[#FF6039] ring-offset-2 }`.
- Full compliance with `@media (prefers-reduced-motion: reduce)` zeroes animations for users with vestibular sensitivities.
- Button text `#161616` on Accent Orange `#FF6039` delivers a **5.9:1 contrast ratio**, well exceeding the WCAG AA requirement of 4.5:1.

---

## 🛠️ Tech Stack & Dependencies

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Core Runtime & Build                          │
│  React 18.3.1  •  TypeScript 5.7.3  •  Vite 6.1.0  •  PostCSS 8.5.2   │
├────────────────────────────────────────────────────────────────────────┤
│                          Styling & Design                              │
│  Tailwind CSS 3.4.17  •  clsx 2.1.1  •  tailwind-merge 3.0.1           │
├────────────────────────────────────────────────────────────────────────┤
│                          Icons & Visuals                               │
│  Lucide React 0.475.0  •  Recharts 3.10.1  •  Google Fonts Space Mono  │
├────────────────────────────────────────────────────────────────────────┤
│                          Backend & Cloud                               │
│  Firebase 12.x (Firestore, Auth, Storage, Functions)  •  Firebase Emul │
├────────────────────────────────────────────────────────────────────────┤
│                          Testing & QA                                  │
│  Vitest 5.0.0  •  React Testing Library  •  jsdom                      │
└────────────────────────────────────────────────────────────────────────┘
```

| Dependency | Version | Purpose in DevAtlas |
| :--- | :---: | :--- |
| `react` & `react-dom` | `^18.3.1` | Core UI component lifecycle and DOM rendering |
| `typescript` | `~5.7.3` | Strict static type safety across 50+ domain interfaces |
| `vite` | `^6.1.0` | Ultra-fast HMR development server and production bundler |
| `tailwindcss` | `^3.4.17` | Utility-first styling with custom design tokens |
| `firebase` | `^12.19.0` | Cloud Firestore real-time sync, Auth, Storage, Functions |
| `lucide-react` | `^0.475.0` | Accessible icon library for triple-coded UI states |
| `recharts` | `^3.10.1` | Sentiment radar charts, donut charts, and health graphs |
| `clsx` & `tailwind-merge` | Latest | Conditional and conflict-free class name composition |
| `vitest` | `^5.0.2` | High-speed unit and integration test runner |

---

## 📁 Repository Directory Structure

```
Signalslab/Signalslab/ (Git Repository Root: https://github.com/tnex0734-ops/Dev-Atlas)
├── README.md                        # Master Documentation (This File)
├── .env.example                     # Environment variable template
├── .firebaserc                      # Firebase project aliases
├── firebase.json                    # Firebase hosting, functions, emulator config
├── firestore.rules                  # Firestore security rules
├── firestore.indexes.json           # Firestore composite indexes
├── storage.rules                    # Firebase Storage security rules
├── vercel.json                      # Vercel SPA deployment configuration
├── package.json                     # NPM dependencies and scripts
├── tailwind.config.js               # Design tokens, color palette, animations
├── tsconfig.json                    # TypeScript compiler configuration
├── vite.config.ts                   # Vite plugins and server configuration
├── index.html                       # Entry HTML with Google Fonts
│
├── docs/                            # Deep Architectural Documentation
│   ├── deployment.md                # Deployment pipeline & environments
│   ├── firebase-architecture.md     # Firebase backend migration blueprint
│   ├── firestore-schema.md          # Cloud Firestore data dictionary
│   ├── security.md                  # Access control & least privilege guide
│   └── testing.md                   # Test execution & verification matrix
│
├── public/                          # Static Brand & 3D Mascot Assets
│   ├── dev-ai.png                   # Dev AI Studio mascot
│   ├── health.png                   # Sprint Health circular gauge mascot
│   ├── done.png                     # Shipped & Done mascot
│   ├── progress.png                 # In-Progress builds mascot
│   ├── blocked.png                  # Blocked / Hotspots mascot
│   ├── devatlas-logo.png            # Brand logo
│   └── favicon.png                  # Browser tab favicon
│
└── src/
    ├── App.tsx                      # Root component & 34-view state router
    ├── main.tsx                     # React DOM bootstrap
    ├── index.css                    # Tailwind directives, design tokens, focus styles
    │
    ├── context/                     # Central State Management
    │   ├── ProjectContext.tsx       # Global store (workspaces, tasks, sync, CRUD)
    │   ├── AIContext.tsx            # AI Studio chat state, providers, voice input
    │   └── AuthContext.tsx          # Authentication & session provider
    │
    ├── types/                       # TypeScript Domain Definitions
    │   ├── index.ts                 # 50+ core domain models (tasks, ADRs, memory)
    │   └── aiTypes.ts               # AI Studio models (conversations, messages, sources)
    │
    ├── data/                        # Seed Data & Role Configurations
    │   ├── initialSeedData.ts       # Flagship workspace dataset (StreamFlow Media)
    │   └── roleAIConfigs.ts         # Role system prompts, prompt cards, starter queries
    │
    ├── security/                    # Security Intelligence Subsystem
    │   ├── types.ts                 # Vulnerability scanner & finding interfaces
    │   ├── adapters/                # Modular scanner implementations
    │   │   ├── SecurityScannerAdapter.ts # Abstract adapter contract
    │   │   ├── VulnClawSecurityAdapter.ts# DAST BOLA/IDOR dynamic prober simulator
    │   │   ├── StrixSecurityAdapter.ts   # SAST AST code scanner simulator
    │   │   └── DemoSecurityAdapter.ts    # Fallback synthetic scanner
    │   └── services/
    │       ├── securityService.ts   # Scan execution coordinator
    │       ├── securityGate.ts      # Release Go/No-Go gate evaluator
    │       └── securityMetrics.ts   # CVSS & security health calculators
    │
    ├── services/                    # Business Logic & External Integrations
    │   ├── aiService.ts             # Cloud LLM HTTP client (OpenRouter, OpenAI, Groq)
    │   ├── connectorService.ts      # Multi-platform transcript ingestion & parsing
    │   ├── contextRetriever.ts      # Role-aware context filtering & token budgeting
    │   ├── githubService.ts         # GitHub public API repo scraper
    │   ├── groundedMemoryEngine.ts  # Deterministic offline Project Memory reasoner
    │   ├── linkResolver.ts          # Central cross-entity deep-link resolution
    │   ├── firebase/
    │   │   └── config.ts            # Firebase app initialization & emulator hookup
    │   └── repositories/            # Firestore Data Access Layer
    │       ├── taskRepository.ts    # Task CRUD & onSnapshot listeners
    │       ├── meetingRepository.ts # Meeting CRUD & action item sync
    │       ├── decisionRepository.ts# ADR CRUD & immutable lineage sync
    │       ├── memoryRepository.ts  # Memory event CRUD & state tracking
    │       ├── projectRepository.ts # Workspace creation & metadata sync
    │       ├── fileRepository.ts    # File metadata & Storage management
    │       ├── aiRepository.ts      # Conversation history persistence
    │       └── domainRepositories.ts# Aggregated repository exports
    │
    ├── components/
    │   ├── ai/                      # AI Studio UI Components
    │   │   ├── AIStudioDrawer.tsx   # Slide-over chat interface
    │   │   ├── AIMessageBubble.tsx  # Message renderer with markdown & source pills
    │   │   ├── AIPromptLibrary.tsx  # Categorized prompt card catalog
    │   │   ├── AIHistoryPanel.tsx   # Conversation history list
    │   │   ├── AISettingsModal.tsx  # Provider & model picker
    │   │   ├── AIFloatingButton.tsx # Role-adaptive launcher button
    │   │   └── VoiceInput.tsx       # Web Speech API microphone dictation
    │   ├── memory/                  # Project Memory Components
    │   │   ├── MemoryDrawer.tsx     # Slide-over audit inspector (diffs & lineage)
    │   │   ├── MemoryTrigger.tsx    # Entity inline link button
    │   │   ├── MemoryStateBadge.tsx # Triple-coded memory state badge
    │   │   ├── RecordRationaleModal.tsx # Form modal for capturing diffs & why
    │   │   └── RoleMemoryWidget.tsx # Role-scoped active ADRs summary banner
    │   ├── layout/                  # Navigation & Shell
    │   │   ├── Header.tsx           # Global header, workspace switcher, repo import
    │   │   └── Sidebar.tsx          # Collapsible role-based navigation sidebar
    │   ├── common/                  # Shared Design System Elements
    │   │   ├── CommandPalette.tsx   # Global Cmd+K universal search modal
    │   │   ├── Modal.tsx            # Accessible dialog with backdrop blur
    │   │   ├── Toast.tsx            # Toast notification container
    │   │   ├── MeetingCard.tsx      # Reusable meeting summary tile
    │   │   ├── MetricCard.tsx       # Standardized metric card
    │   │   ├── StatusBadge.tsx      # Triple-coded status badge
    │   │   ├── IconBadge3D.tsx      # 3D icon container
    │   │   ├── OnboardingBanner.tsx # Dismissable welcome journey
    │   │   └── BrandLogos.tsx       # Platform SVG icons (Play, App Store, Discord)
    │   └── views/                   # 34 Specialized Domain Screens
    │
    └── __tests__/                   # Automated Vitest Test Suite (28 Tests)
        ├── connectorService.test.ts # Transcript regex parsing tests
        ├── groundedMemoryEngine.test.ts # Deterministic AI response tests
        ├── linkResolver.test.ts     # Deep-link routing tests
        └── repositories.test.ts     # Repository layer & Firestore mapper tests
```

---

## 🚀 Getting Started & Local Development

The application is deployed live at [https://devatlas-lake.vercel.app/?role=all&section=overview](https://devatlas-lake.vercel.app/?role=all&section=overview) or can be executed locally using the instructions below.

### Prerequisites
- **Node.js** `≥ 18.0.0`
- **npm** `≥ 9.0.0`
- **Git**

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/tnex0734-ops/Dev-Atlas.git
cd Dev-Atlas

# 2. Install dependencies
npm install

# 3. Optional: Configure environment variables
cp .env.example .env

# 4. Launch the Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Configuration (`.env`)

```env
# Firebase Configuration (Optional: in-memory fallbacks enable instant local run)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=devatlas-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=devatlas-app
VITE_FIREBASE_STORAGE_BUCKET=devatlas-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Firebase Emulator Toggle (Set to true to connect to local emulators)
VITE_USE_FIREBASE_EMULATORS=false

# Optional Cloud LLM Keys (Can also be entered interactively in the AI Studio Settings UI)
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_GROQ_API_KEY=your_groq_key
```

> [!NOTE]
> **Zero-Config Local Execution:** DevAtlas runs **100% functional out-of-the-box** without any `.env` keys. If no Firebase keys are set, it operates with local storage caching. If no AI keys are provided, the **Grounded Memory Engine** handles all queries deterministically without network calls.

### Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with instant Hot Module Replacement (HMR) |
| `npm run build` | Runs TypeScript type-checking (`tsc`) and compiles production bundle to `dist/` |
| `npm run preview` | Locally serves the compiled production build from `dist/` |
| `npm test` | Executes the Vitest automated test suite |
| `npm run test:watch` | Runs Vitest in interactive watch mode for TDD workflows |
| `npm run emulators` | Launches the local Firebase Emulator Suite (Auth, Firestore, Storage, Functions) |

---

## 🧪 Testing & Quality Assurance

DevAtlas includes a comprehensive automated test suite powered by **Vitest** and **React Testing Library**:

```bash
# Run all tests
npm test

# Run tests with code coverage report
npm run test -- --coverage
```

### Verified Test Suites (28/28 Tests Passing ✅)
1. **`linkResolver.test.ts` (7 tests):** Validates that all internal entity types (`decision`, `meeting`, `task`, `memory`, `finding`, `prd`, `bug`) resolve to valid view sections and item identifiers.
2. **`groundedMemoryEngine.test.ts` (8 tests):** Confirms that query intent routing, entity retrieval, and source citation extraction produce 100% deterministic, non-hallucinatory responses across all roles.
3. **`connectorService.test.ts` (6 tests):** Verifies meeting transcript parsing, speaker diarization, action item extraction, and decision detection heuristics.
4. **`repositories.test.ts` (7 tests):** Tests bidirectional Firestore document-to-domain mapping, optimistic state mutations, and error handling.

---

## 🚢 Deployment Guide

### Option 1: Vercel (Production Deployment)

- **Production URL:** [https://devatlas-lake.vercel.app/?role=all&section=overview](https://devatlas-lake.vercel.app/?role=all&section=overview)
- **Status:** Live & Operational ✅

The repository includes a pre-configured [`vercel.json`](vercel.json):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

1. Import the repository `https://github.com/tnex0734-ops/Dev-Atlas` into your [Vercel Dashboard](https://vercel.com).
2. Set Root Directory to `./`.
3. Add any desired environment variables (`VITE_FIREBASE_API_KEY`, etc.).
4. Click **Deploy**. Vercel will build and serve the application globally with automatic SPA routing rewrites.

### Option 2: Firebase Hosting

```bash
# Build the production bundle
npm run build

# Deploy only static hosting
firebase deploy --only hosting

# Deploy full Firebase stack (Hosting, Security Rules, Functions, Storage)
firebase deploy
```

### Option 3: Netlify / Cloudflare Pages / AWS S3
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **SPA Rewrites:** Redirect `/*` to `/index.html` with status `200`.

---

## 📐 Core Domain Data Schema

All models are defined as strict TypeScript interfaces in [`src/types/index.ts`](src/types/index.ts):

### 1. `DevTask` (Kanban Task with Rationale Chain)
```typescript
export interface DevTask {
  id: string;                       // Primary Key
  taskCode: string;                 // e.g. 'DEV-SIGN-001'
  title: string;
  requirementId: string;           // FK to ProductRequirement
  requirementTitle: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'P0' | 'P1' | 'P2';
  assignee: { name: string; avatar: string; role: string };
  branch?: string;                  // Git branch name
  contextSummary: string;
  techStackTags: string[];
  // Relational Rationale Chain
  whyItExists?: string;             // "Why am I doing this?"
  relatedDecisionCode?: string;     // e.g. 'ADR-001'
  relatedDecisionId?: string;
  relatedMeetingTitle?: string;     // e.g. 'MTG-021: Architecture Sync'
  relatedMeetingId?: string;
  dependencies?: string[];
}
```

### 2. `ProjectDecision` (Architecture Decision Record - ADR)
```typescript
export interface ProjectDecision {
  id: string;                       // Primary Key
  decisionCode: string;             // e.g. 'ADR-001', 'DEC-101'
  title: string;
  category: 'Product' | 'Architecture' | 'Design' | 'Operations';
  context: string;                  // Problem statement & constraints
  decisionMade: string;             // Mandated technical solution
  consequences: string;             // Downstream architectural trade-offs
  stakeholders: string[];
  date: string;
  status: 'active' | 'superseded' | 'deprecated' | 'proposed';
  relatedMeetingTitle?: string;     // Provenance link to sync
  relatedMeetingId?: string;
  relatedTaskCode?: string;         // Downstream implementation link
  relatedTaskId?: string;
  supersededBy?: string;            // Historical lineage pointer
  supersedes?: string;
}
```

### 3. `ProjectMeeting` (Structured Discussion Sync)
```typescript
export interface ProjectMeeting {
  id: string;                       // Primary Key
  meetingCode: string;              // e.g. 'MTG-024'
  title: string;
  date: string;
  durationMinutes: number;
  attendees: Array<{ name: string; role: string; avatar?: string }>;
  summary: string;                  // Executive meeting synthesis
  discussionPoints: Array<{ topic: string; summary: string; speaker?: string }>;
  decisions: Array<{ id: string; text: string; linkedDecisionId?: string; linkedDecisionCode?: string }>;
  actionItems: Array<MeetingActionItem>;
  unresolvedQuestions: string[];
  status: 'Completed' | 'Action Required' | 'Follow-up Scheduled';
  roleTag: RoleType;
}
```

---

## 🔄 Core System Workflows

### 1. Discussion to Decision & Task Pipeline
1. Team conducts a technical sync recorded in [`MeetingsView.tsx`](src/components/views/MeetingsView.tsx) (`MTG-024`).
2. Meeting minutes record key decisions reached (`ADR-004`) and concrete action items.
3. Checking an action item modifies its state across the UI and updates progress counters.
4. Extracted decisions are promoted into permanent records in [`DecisionsLogView.tsx`](src/components/views/DecisionsLogView.tsx).

### 2. Contextual Task Execution & Rationale Chain
1. Engineering opens a sprint item on the Kanban board ([`DevTasksView.tsx`](src/components/views/DevTasksView.tsx)) such as `DEV-SIGN-001`.
2. The task inspects its explicit **"Why am I doing this? (Rationale Chain)"** link connecting directly to `ADR-001` and `MTG-021`.
3. Clicking linked pills routes through the [Central Link Resolver](src/services/linkResolver.ts), jumping to the exact source entity without losing state.

### 3. Decision Lineage & Memory Lifecycle
1. When an architectural constraint changes, the previous decision record transitions to `superseded` rather than being silently deleted.
2. A new `ProjectMemoryEvent` is recorded with before/after field diffs, plain-language justifications, and metric deltas.
3. The global slide-over [`MemoryDrawer.tsx`](src/components/memory/MemoryDrawer.tsx) renders the complete historical lineage chain (`Previous` $\rightarrow$ `Current` $\rightarrow$ `Superseded By`).

### 4. Cross-Role AI Grounding & Source Deep-Linking
1. Team members query the AI Studio via text or Web Speech voice dictation ([`VoiceInput.tsx`](src/components/ai/VoiceInput.tsx)).
2. If offline or without an API key, [`groundedMemoryEngine.ts`](src/services/groundedMemoryEngine.ts) deterministically extracts context from in-memory arrays.
3. If configured with cloud keys, [`aiService.ts`](src/services/aiService.ts) executes against OpenRouter, OpenAI, or Groq with token and cost tracking.
4. Every response includes verified `AISource` pills (`[decision] ADR-001`, `[meeting] MTG-021`). Clicking any chip immediately opens that source record.

---

## ❓ Technical FAQ

<details>
<summary><strong>Q: Does DevAtlas require an external AI API key to function?</strong></summary>

**No.** DevAtlas includes a custom **Grounded Offline Memory Engine** that runs 100% deterministically in browser memory. It classifies query intent, retrieves real in-memory project entities, formats structured answers, and attaches verified source citations without making any network calls. Cloud providers (OpenRouter, OpenAI, Groq) are optional.
</details>

<details>
<summary><strong>Q: How does DevAtlas operate without a live Firebase backend?</strong></summary>

If Firebase configuration keys are absent or invalid, the repository automatically falls back to reactive React Context state persisted to browser `localStorage`. All Kanban drag-and-drop actions, meeting action item toggles, decision creations, and memory event updates function seamlessly.
</details>

<details>
<summary><strong>Q: How does DevAtlas prevent AI hallucinations?</strong></summary>

By enforcing strict **Role-Aware Context Retrieval** (bounded to ~3,000 tokens) combined with deterministic project grounding rules. System prompts mandate: *"Answer directly using project evidence. Never invent meetings, decisions, or people. When information is missing, say so clearly."* Every key claim is accompanied by a verified `AISource` chip that deep-links directly to the underlying record.
</details>

<details>
<summary><strong>Q: How does GitHub repository ingestion work?</strong></summary>

In the top navigation header, clicking **"Import Repo"** triggers `githubService.ts`. It queries the public GitHub API for repository metadata, languages, and README content, then bootstraps a synthesized multi-role workspace in local session memory.
</details>

---

## 🤝 Contributing

Contributions are welcome! Please follow this workflow:

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feat/my-new-feature
   ```
3. **Ensure Code Quality & Tests:**
   ```bash
   npm run build   # Must compile with 0 TypeScript errors
   npm test        # All 28 tests must pass
   ```
4. **Follow Conventional Commits:**
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation improvements
   - `refactor:` Code refactoring without behavior changes
   - `test:` Test additions or modifications
   - `chore:` Maintenance and build configuration
5. **Open a Pull Request** with a detailed explanation of your changes.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details.

---

<div align="center">

**Built with precision for modern engineering teams.**  
*Cross-Role Intelligence • Institutional Memory • Zero Context Loss*

[**Back to Top ⬆**](#-devatlas--cross-role-project-intelligence--institutional-memory-operating-system)

</div>
