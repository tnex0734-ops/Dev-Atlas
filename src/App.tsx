import React, { useState } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { AIProvider } from './context/AIContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/Toast';
import { AIFloatingButton } from './components/ai/AIFloatingButton';
import { AIStudioDrawer } from './components/ai/AIStudioDrawer';

import { OverviewView } from './components/views/OverviewView';
import { ProductHealthView } from './components/views/ProductHealthView';
import { RoadmapView } from './components/views/RoadmapView';
import { FeaturesView } from './components/views/FeaturesView';
import { RequirementsView } from './components/views/RequirementsView';
import { FeedbackHubView } from './components/views/FeedbackHubView';
import { UserIssuesView } from './components/views/UserIssuesView';
import { FeatureRequestsView } from './components/views/FeatureRequestsView';
import { InsightsView } from './components/views/InsightsView';
import { ResearchSessionsView } from './components/views/ResearchSessionsView';
import { ResearchView } from './components/views/ResearchView';
import { UserPatternsView } from './components/views/UserPatternsView';
import { ValidationStudioView } from './components/views/ValidationStudioView';
import { DesignLibraryView } from './components/views/DesignLibraryView';
import { FigmaSpecsView } from './components/views/FigmaSpecsView';
import { DesignReviewsView } from './components/views/DesignReviewsView';
import { DevTasksView } from './components/views/DevTasksView';
import { DevFeaturesView } from './components/views/DevFeaturesView';
import { BuildsSandboxView } from './components/views/BuildsSandboxView';
import { PromptGeneratorView } from './components/views/PromptGeneratorView';
import { QAStatusView } from './components/views/QAStatusView';
import { BugTrackerView } from './components/views/BugTrackerView';
import { ReleaseReadinessView } from './components/views/ReleaseReadinessView';
import { SecurityCommandCenterView } from './components/views/SecurityCommandCenterView';
import { ReleasesView } from './components/views/ReleasesView';
import { IncidentsView } from './components/views/IncidentsView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { ContextBlocksView } from './components/views/ContextBlocksView';
import { SecondBrainView } from './components/views/SecondBrainView';
import { FileVaultView } from './components/views/FileVaultView';
import { DecisionsLogView } from './components/views/DecisionsLogView';
import { ProjectMemoryView } from './components/views/ProjectMemoryView';
import { MeetingsView } from './components/views/MeetingsView';
import { ConnectorsView } from './components/views/ConnectorsView';
import { MemoryDrawer } from './components/memory/MemoryDrawer';

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
          {renderActiveView()}
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

