import React, { useState, Suspense, lazy } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { AIProvider } from './context/AIContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/Toast';
import { AIFloatingButton } from './components/ai/AIFloatingButton';
import { AIStudioDrawer } from './components/ai/AIStudioDrawer';
import { MemoryDrawer } from './components/memory/MemoryDrawer';

// Primary landing view is kept eager for instant zero-latency paint
import { OverviewView } from './components/views/OverviewView';

// Code-split modular views for high-performance bundle loading
const ProductHealthView = lazy(() => import('./components/views/ProductHealthView').then(m => ({ default: m.ProductHealthView })));
const RoadmapView = lazy(() => import('./components/views/RoadmapView').then(m => ({ default: m.RoadmapView })));
const FeaturesView = lazy(() => import('./components/views/FeaturesView').then(m => ({ default: m.FeaturesView })));
const RequirementsView = lazy(() => import('./components/views/RequirementsView').then(m => ({ default: m.RequirementsView })));
const FeedbackHubView = lazy(() => import('./components/views/FeedbackHubView').then(m => ({ default: m.FeedbackHubView })));
const UserIssuesView = lazy(() => import('./components/views/UserIssuesView').then(m => ({ default: m.UserIssuesView })));
const FeatureRequestsView = lazy(() => import('./components/views/FeatureRequestsView').then(m => ({ default: m.FeatureRequestsView })));
const InsightsView = lazy(() => import('./components/views/InsightsView').then(m => ({ default: m.InsightsView })));
const ResearchSessionsView = lazy(() => import('./components/views/ResearchSessionsView').then(m => ({ default: m.ResearchSessionsView })));
const ResearchView = lazy(() => import('./components/views/ResearchView').then(m => ({ default: m.ResearchView })));
const UserPatternsView = lazy(() => import('./components/views/UserPatternsView').then(m => ({ default: m.UserPatternsView })));
const ValidationStudioView = lazy(() => import('./components/views/ValidationStudioView').then(m => ({ default: m.ValidationStudioView })));
const DesignLibraryView = lazy(() => import('./components/views/DesignLibraryView').then(m => ({ default: m.DesignLibraryView })));
const FigmaSpecsView = lazy(() => import('./components/views/FigmaSpecsView').then(m => ({ default: m.FigmaSpecsView })));
const DesignReviewsView = lazy(() => import('./components/views/DesignReviewsView').then(m => ({ default: m.DesignReviewsView })));
const DevTasksView = lazy(() => import('./components/views/DevTasksView').then(m => ({ default: m.DevTasksView })));
const DevFeaturesView = lazy(() => import('./components/views/DevFeaturesView').then(m => ({ default: m.DevFeaturesView })));
const BuildsSandboxView = lazy(() => import('./components/views/BuildsSandboxView').then(m => ({ default: m.BuildsSandboxView })));
const PromptGeneratorView = lazy(() => import('./components/views/PromptGeneratorView').then(m => ({ default: m.PromptGeneratorView })));
const QAStatusView = lazy(() => import('./components/views/QAStatusView').then(m => ({ default: m.QAStatusView })));
const BugTrackerView = lazy(() => import('./components/views/BugTrackerView').then(m => ({ default: m.BugTrackerView })));
const ReleaseReadinessView = lazy(() => import('./components/views/ReleaseReadinessView').then(m => ({ default: m.ReleaseReadinessView })));
const SecurityCommandCenterView = lazy(() => import('./components/views/SecurityCommandCenterView').then(m => ({ default: m.SecurityCommandCenterView })));
const ReleasesView = lazy(() => import('./components/views/ReleasesView').then(m => ({ default: m.ReleasesView })));
const IncidentsView = lazy(() => import('./components/views/IncidentsView').then(m => ({ default: m.IncidentsView })));
const MaintenanceView = lazy(() => import('./components/views/MaintenanceView').then(m => ({ default: m.MaintenanceView })));
const ContextBlocksView = lazy(() => import('./components/views/ContextBlocksView').then(m => ({ default: m.ContextBlocksView })));
const SecondBrainView = lazy(() => import('./components/views/SecondBrainView').then(m => ({ default: m.SecondBrainView })));
const FileVaultView = lazy(() => import('./components/views/FileVaultView').then(m => ({ default: m.FileVaultView })));
const DecisionsLogView = lazy(() => import('./components/views/DecisionsLogView').then(m => ({ default: m.DecisionsLogView })));
const ProjectMemoryView = lazy(() => import('./components/views/ProjectMemoryView').then(m => ({ default: m.ProjectMemoryView })));
const MeetingsView = lazy(() => import('./components/views/MeetingsView').then(m => ({ default: m.MeetingsView })));
const ConnectorsView = lazy(() => import('./components/views/ConnectorsView').then(m => ({ default: m.ConnectorsView })));

const MainAppContent: React.FC = () => {
  const { activeSection } = useProject();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewView />;
      case 'product-health':
        return <ProductHealthView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'meetings':
        return <MeetingsView />;

      case 'features':
        return <FeaturesView />;
      case 'requirements':
        return <RequirementsView />;

      case 'feedback':
        return <FeedbackHubView />;
      case 'user-issues':
        return <UserIssuesView />;
      case 'feature-requests':
        return <FeatureRequestsView />;
      case 'insights':
        return <InsightsView />;

      case 'research':
        return <ResearchSessionsView />;
      case 'findings':
        return <ResearchView />;
      case 'user-patterns':
        return <UserPatternsView />;

      case 'validation':
        return <ValidationStudioView />;
      case 'designs':
        return <DesignLibraryView />;
      case 'figma':
        return <FigmaSpecsView />;
      case 'reviews':
        return <DesignReviewsView />;

      case 'tasks':
        return <DevTasksView />;
      case 'dev-features':
        return <DevFeaturesView />;
      case 'builds':
        return <BuildsSandboxView />;
      case 'prompts':
        return <PromptGeneratorView />;

      case 'security':
        return <SecurityCommandCenterView />;
      case 'qa-status':
        return <QAStatusView />;
      case 'bugs':
        return <BugTrackerView />;
      case 'release-readiness':
        return <ReleaseReadinessView />;

      case 'releases':
        return <ReleasesView />;
      case 'incidents':
        return <IncidentsView />;
      case 'maintenance':
        return <MaintenanceView />;

      case 'context':
        return <ContextBlocksView />;
      case 'notes':
        return <SecondBrainView />;
      case 'files':
        return <FileVaultView />;
      case 'decisions':
        return <DecisionsLogView />;
      case 'project-memory':
        return <ProjectMemoryView />;
      case 'connectors':
        return <ConnectorsView />;

      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#18181b] selection:bg-[#18181b] selection:text-white font-sans antialiased">
      {/* Universal Command Palette */}
      <CommandPalette />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Global Project Memory Drawer */}
      <MemoryDrawer />

      {/* AI Studio */}
      <AIStudioDrawer />
      <AIFloatingButton />

      {/* Top Navigation Header */}
      <Header onToggleSidebar={() => setMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Main Layout Shell */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Suspense
            fallback={
              <div className="flex min-h-[320px] w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FF6039] border-t-transparent" />
                  <span className="text-xs font-mono text-[#71717a]">Loading section...</span>
                </div>
              </div>
            }
          >
            {renderActiveView()}
          </Suspense>
        </main>
      </div>
    </div>
  );
};

import { AuthProvider } from './context/AuthContext';

const AuthBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeWorkspace } = useProject();
  return <AuthProvider currentProjectId={activeWorkspace.id}>{children}</AuthProvider>;
};

export function App() {
  return (
    <ProjectProvider>
      <AuthBridge>
        <AIProvider>
          <MainAppContent />
        </AIProvider>
      </AuthBridge>
    </ProjectProvider>
  );
}

export default App;

