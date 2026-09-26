// Role-specific AI Studio configurations
import { RoleAIConfig } from '../types/aiTypes';

export const roleAIConfigs: RoleAIConfig[] = [
  // ── Product Overview (role: 'all') ──
  {
    role: 'all',
    label: 'Product Overview',
    studioName: 'Product Overview AI',
    description: 'Ask about your project\'s overall health',
    icon: '📊',
    accentColor: '#171717',
    systemPrompt: `You are the Product Overview AI assistant for this DevAtlas project. You help stakeholders understand overall project health, cross-team progress, key decisions, and important changes. You have access to the complete project context including tasks, feedback, meetings, decisions, releases, and team activity. Answer directly using project evidence. Never invent project facts. When information is missing, say so clearly. Keep answers scannable with bullets. Always suggest practical next actions.`,
    contextSources: ['task', 'decision', 'feedback', 'release', 'memory', 'meeting', 'bug'],
    promptCategories: [
      { id: 'health', label: 'Project Health', icon: '📈' },
      { id: 'progress', label: 'Progress', icon: '🎯' },
      { id: 'decisions', label: 'Decisions', icon: '⚖️' },
      { id: 'memory', label: 'Project Memory', icon: '🧠' },
    ],
    promptCards: [
      { id: 'po-1', title: 'Project health check', description: 'Get a quick summary of how the project is doing across all teams.', prompt: 'Give me a quick health check of the project. What\'s going well, what needs attention, and what\'s blocked?', category: 'health' },
      { id: 'po-2', title: 'What changed recently?', description: 'See important project changes from recent work and meetings.', prompt: 'What are the most important changes in this project from the last week?', category: 'progress' },
      { id: 'po-3', title: 'Show recent decisions', description: 'See the decisions that were made recently and who made them.', prompt: 'Show me the recent project decisions, who was involved, and what was decided.', category: 'decisions' },
      { id: 'po-4', title: 'What needs attention?', description: 'Find the most urgent items that need someone\'s action.', prompt: 'What are the most urgent items that need attention right now? Include blocked tasks, critical bugs, and open decisions.', category: 'health' },
      { id: 'po-5', title: 'Team progress summary', description: 'Get a cross-team view of what each role is working on.', prompt: 'Summarize what each team is currently working on — dev, design, QA, and ops.', category: 'progress' },
      { id: 'po-6', title: 'What happened before?', description: 'Understand the history behind a specific topic or decision.', prompt: 'What is the full history and context behind the most recent major project decision?', category: 'memory' },
    ],
    starterQuestions: [
      'How is the project doing overall?',
      'What changed this week?',
      'What needs attention right now?',
      'Show recent decisions',
    ],
  },

  // ── Product Manager ──
  {
    role: 'pm',
    label: 'Product',
    studioName: 'Product AI',
    description: 'Ask about requirements, progress, and priorities',
    icon: '📋',
    accentColor: '#c2410c',
    systemPrompt: `You are the Product AI assistant for this DevAtlas project. You help product managers and product owners understand project progress, requirements status, priorities, decisions, meeting outcomes, risks, and next actions. Use the project context provided to you — tasks, PRDs, roadmap, feedback, decisions, and meeting notes. Answer directly with project evidence. Never invent meetings, decisions, or people. Separate facts from suggestions. Always provide actionable next steps.`,
    contextSources: ['task', 'decision', 'feedback', 'release', 'memory', 'meeting', 'research'],
    promptCategories: [
      { id: 'project', label: 'Project Status', icon: '📊' },
      { id: 'meetings', label: 'Meetings', icon: '🗓️' },
      { id: 'planning', label: 'Planning', icon: '🎯' },
      { id: 'decisions', label: 'Decisions', icon: '⚖️' },
    ],
    promptCards: [
      { id: 'pm-1', title: 'Are we on track?', description: 'Check if the project is progressing according to plan.', prompt: 'Are we on track with the current sprint and roadmap? What\'s ahead of schedule and what\'s behind?', category: 'project' },
      { id: 'pm-2', title: 'What is pending?', description: 'See all work that\'s waiting to be done or decided.', prompt: 'What work is still pending? Show open tasks, unresolved decisions, and items waiting for input.', category: 'project' },
      { id: 'pm-3', title: 'What is blocked?', description: 'Find work that can\'t move forward and why.', prompt: 'What is currently blocked? Show the blockers, who owns them, and what needs to happen to unblock.', category: 'project' },
      { id: 'pm-4', title: 'Summarize the latest meeting', description: 'Get the key points from recent discussions.', prompt: 'Summarize the most recent project meeting or discussion. What was decided, what needs follow-up, and who owns each action?', category: 'meetings' },
      { id: 'pm-5', title: 'What should we do next?', description: 'Get recommendations for the team\'s next priorities.', prompt: 'Based on current project state, what should the team focus on next? Consider deadlines, blockers, and dependencies.', category: 'planning' },
      { id: 'pm-6', title: 'What risks should we watch?', description: 'Identify potential problems before they happen.', prompt: 'What are the current project risks? Consider timeline, dependencies, team capacity, and unresolved decisions.', category: 'planning' },
      { id: 'pm-7', title: 'Why was this decided?', description: 'Understand the reasoning behind a specific decision.', prompt: 'What was the rationale behind the most recent major decision? What alternatives were considered?', category: 'decisions' },
      { id: 'pm-8', title: 'Open decisions', description: 'See which decisions are still waiting to be made.', prompt: 'What decisions are still open and need to be made? Who should be involved in each?', category: 'decisions' },
    ],
    starterQuestions: [
      'Are we on track?',
      'What needs attention?',
      'Summarize recent meetings',
      'What decisions are pending?',
    ],
  },

  // ── Designer ──
  {
    role: 'designer',
    label: 'Design',
    studioName: 'Design AI',
    description: 'Ask about UX research, design decisions, and user flows',
    icon: '🎨',
    accentColor: '#7c3aed',
    systemPrompt: `You are the Design AI assistant for this DevAtlas project. You help designers understand UX research findings, user feedback patterns, design decisions, product requirements, design review discussions, and identify UX improvements. Use the project context — research sessions, UX findings, personas, design reviews, feedback, and decisions. Clearly identify when information is missing. Focus on user problems, design rationale, and actionable design recommendations.`,
    contextSources: ['research', 'feedback', 'decision', 'memory', 'task'],
    promptCategories: [
      { id: 'brainstorm', label: 'Brainstorm', icon: '💡' },
      { id: 'research', label: 'UX Research', icon: '🔬' },
      { id: 'ux', label: 'User Experience', icon: '🧩' },
      { id: 'context', label: 'Product Context', icon: '📖' },
      { id: 'review', label: 'Design Review', icon: '👁️' },
    ],
    promptCards: [
      { id: 'ds-1', title: 'Summarize UX research', description: 'Turn recent research notes into clear user problems and patterns.', prompt: 'Summarize the recent UX research findings. What are the main user problems, patterns, and insights?', category: 'research' },
      { id: 'ds-2', title: 'Find user pain points', description: 'Identify the biggest problems users are facing right now.', prompt: 'Based on feedback and research, what are the top user pain points? Group them by severity and frequency.', category: 'research' },
      { id: 'ds-3', title: 'Group feedback patterns', description: 'Find recurring themes in user feedback across sources.', prompt: 'Analyze user feedback and group it into patterns. What themes keep coming up?', category: 'research' },
      { id: 'ds-4', title: 'Improve this user flow', description: 'Get suggestions for making a flow easier to use.', prompt: 'What are the usability problems in the current flows? Where do users struggle and how can we improve?', category: 'ux' },
      { id: 'ds-5', title: 'Find UX problems', description: 'Identify confusing or frustrating parts of the experience.', prompt: 'What UX problems exist in the current design? List confusing steps, friction points, and missing affordances.', category: 'ux' },
      { id: 'ds-6', title: 'What did the team decide?', description: 'See recent design and product decisions.', prompt: 'What design-related decisions were made recently? What was the context and rationale?', category: 'context' },
      { id: 'ds-7', title: 'What changed?', description: 'See what requirements or designs changed recently.', prompt: 'What design or product requirements changed recently? What triggered the change?', category: 'context' },
      { id: 'ds-8', title: 'Generate ideas', description: 'Brainstorm creative solutions for a design problem.', prompt: 'Help me brainstorm design solutions for the most critical UX problem. Give me 5 different approaches.', category: 'brainstorm' },
      { id: 'ds-9', title: 'Review for usability', description: 'Check a design concept for common usability issues.', prompt: 'Review the current design patterns for common usability issues — clarity, consistency, error handling, and accessibility.', category: 'review' },
    ],
    starterQuestions: [
      'Summarize UX research',
      'What are the user pain points?',
      'What design decisions were made?',
      'Find UX problems',
    ],
  },

  // ── Developer ──
  {
    role: 'dev',
    label: 'Developer',
    studioName: 'Dev AI',
    description: 'Ask about code, tasks, architecture, and technical decisions',
    icon: '💻',
    accentColor: '#0070f3',
    systemPrompt: `You are the Developer AI assistant for this DevAtlas project. You help developers understand implementation progress, technical decisions, assigned tasks, bugs, dependencies, architecture context, and coding priorities. Use the project context — dev tasks, context blocks, PRDs, security findings, bugs, builds, and decisions. Be precise about technical details. Reference specific task codes and decision IDs. Never invent technical decisions or project facts. Provide clear next actions.`,
    contextSources: ['task', 'decision', 'context-block', 'bug', 'security', 'memory'],
    promptCategories: [
      { id: 'code', label: 'Code', icon: '⚡' },
      { id: 'project', label: 'Project', icon: '📋' },
      { id: 'debug', label: 'Debug', icon: '🐛' },
      { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    ],
    promptCards: [
      { id: 'dv-1', title: 'What should I work on next?', description: 'See your highest priority pending tasks.', prompt: 'Based on current task priorities and dependencies, what should I work on next?', category: 'project' },
      { id: 'dv-2', title: 'Technical decisions', description: 'See what technical decisions were made and why.', prompt: 'What technical and architecture decisions were made recently? What was the rationale?', category: 'project' },
      { id: 'dv-3', title: 'What changed recently?', description: 'See code-relevant changes from recent work.', prompt: 'What changed recently that affects development? New requirements, changed priorities, or updated specs.', category: 'project' },
      { id: 'dv-4', title: 'Show blocked work', description: 'Find tasks that can\'t proceed and what\'s needed.', prompt: 'What dev tasks are currently blocked? What dependencies or decisions are holding them up?', category: 'project' },
      { id: 'dv-5', title: 'Find likely cause', description: 'Analyze a bug based on project context.', prompt: 'Based on recent changes and current architecture, what are the likely causes of the current critical bugs?', category: 'debug' },
      { id: 'dv-6', title: 'Check security issues', description: 'Review current security findings and what to fix.', prompt: 'What are the current security findings? Which ones need immediate attention and what\'s the recommended fix?', category: 'debug' },
      { id: 'dv-7', title: 'Architecture context', description: 'Understand the system architecture and constraints.', prompt: 'Explain the current system architecture, key constraints, and important technical patterns.', category: 'architecture' },
      { id: 'dv-8', title: 'Suggest tests', description: 'Get testing recommendations for current work.', prompt: 'Based on current tasks and recent changes, what test cases should be written? Focus on edge cases and regressions.', category: 'code' },
    ],
    starterQuestions: [
      'What should I work on next?',
      'Show blocked tasks',
      'What technical decisions were made?',
      'What security issues need fixing?',
    ],
  },

  // ── QA / Tester ──
  {
    role: 'qa',
    label: 'QA',
    studioName: 'QA AI',
    description: 'Ask about testing, bugs, and release readiness',
    icon: '🧪',
    accentColor: '#059669',
    systemPrompt: `You are the QA AI assistant for this DevAtlas project. You help testers and QA engineers understand what needs testing, find edge cases, analyze bugs, check regression risks, and assess release readiness. Use the project context — test cases, bugs, release readiness checks, security findings, requirements, and recent changes. Be specific about test coverage gaps. Reference specific bug codes and test IDs. Help prioritize testing effort.`,
    contextSources: ['bug', 'task', 'security', 'release', 'decision', 'memory'],
    promptCategories: [
      { id: 'testing', label: 'Testing', icon: '✅' },
      { id: 'bugs', label: 'Bugs', icon: '🐛' },
      { id: 'release', label: 'Release', icon: '🚀' },
    ],
    promptCards: [
      { id: 'qa-1', title: 'What should I test?', description: 'See the highest priority items that need testing.', prompt: 'What areas need testing most urgently? Consider recent changes, open bugs, and upcoming release.', category: 'testing' },
      { id: 'qa-2', title: 'Create test cases', description: 'Generate test cases for a feature or requirement.', prompt: 'Generate test cases for the current in-progress features. Include happy path, edge cases, and error scenarios.', category: 'testing' },
      { id: 'qa-3', title: 'Find edge cases', description: 'Discover scenarios that might break the app.', prompt: 'What edge cases should we test for the current features? Consider data boundaries, concurrency, and error states.', category: 'testing' },
      { id: 'qa-4', title: 'Summarize open bugs', description: 'Get a quick overview of active bugs.', prompt: 'Summarize all open bugs by severity. Which ones are most likely to affect users?', category: 'bugs' },
      { id: 'qa-5', title: 'Check regression risk', description: 'Find areas where recent changes might cause regressions.', prompt: 'Based on recent code changes, what areas have the highest regression risk? What should be retested?', category: 'bugs' },
      { id: 'qa-6', title: 'Release readiness', description: 'Check if we\'re ready to ship.', prompt: 'Are we ready to release? Check test pass rate, open blockers, security findings, and unresolved bugs.', category: 'release' },
      { id: 'qa-7', title: 'What is unresolved?', description: 'Find items that need to be fixed before release.', prompt: 'What is still unresolved? List all open critical/high bugs, failing tests, and unmitigated security findings.', category: 'release' },
    ],
    starterQuestions: [
      'What should I test next?',
      'Show open bugs by severity',
      'Are we ready to release?',
      'What areas have regression risk?',
    ],
  },

  // ── Ops ──
  {
    role: 'ops',
    label: 'Ops',
    studioName: 'Ops AI',
    description: 'Ask about production, incidents, and system health',
    icon: '🚀',
    accentColor: '#dc2626',
    systemPrompt: `You are the Ops AI assistant for this DevAtlas project. You help operations engineers understand production health, active incidents, release performance, system maintenance, and post-deployment sentiment. Use the project context — releases, incidents, maintenance tasks, security assessments, and production metrics. Be direct about current system status. Prioritize incidents by user impact. Provide clear operational recommendations.`,
    contextSources: ['release', 'security', 'bug', 'memory', 'task'],
    promptCategories: [
      { id: 'production', label: 'Production', icon: '📡' },
      { id: 'incidents', label: 'Incidents', icon: '🚨' },
      { id: 'releases', label: 'Releases', icon: '📦' },
    ],
    promptCards: [
      { id: 'ops-1', title: 'Production status', description: 'Quick check on production system health.', prompt: 'What is the current production status? Any active incidents, degradations, or pending maintenance?', category: 'production' },
      { id: 'ops-2', title: 'Active incidents', description: 'See what\'s currently happening in production.', prompt: 'Are there any active incidents? What\'s the impact, who\'s investigating, and what\'s the current status?', category: 'incidents' },
      { id: 'ops-3', title: 'Release impact', description: 'Check how the latest release is performing.', prompt: 'How is the latest release performing? Compare pre and post-release sentiment, and flag any new issues.', category: 'releases' },
      { id: 'ops-4', title: 'What needs maintenance?', description: 'See upcoming or overdue system maintenance.', prompt: 'What system maintenance is scheduled or overdue? Any critical infrastructure work needed?', category: 'production' },
      { id: 'ops-5', title: 'Security posture', description: 'Check the current security health of production.', prompt: 'What is the current security posture? Any critical or high vulnerabilities in production systems?', category: 'production' },
    ],
    starterQuestions: [
      'What\'s the production status?',
      'Any active incidents?',
      'How is the latest release doing?',
      'What maintenance is needed?',
    ],
  },
];

export const getRoleAIConfig = (role: string): RoleAIConfig => {
  return roleAIConfigs.find(c => c.role === role) || roleAIConfigs[0];
};
