import React, { useState, useMemo } from 'react';
import {
  RadioTower,
  Calendar,
  GitBranch,
  Github,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  ExternalLink,
  Scale,
  Code,
  MessageSquare,
  Users,
  Shield,
  Layers,
  Sparkles,
  Check,
  X,
  Play,
  Copy,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { IconBadge3D } from '../common/IconBadge3D';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { connectorService } from '../../services/connectorService';
import { ConnectorPlatform, DataConnector } from '../../types';

export const ConnectorsView: React.FC = () => {
  const {
    activeWorkspace,
    addMeeting,
    logDecision,
    recordMemoryEvent,
    setActiveSection,
    showToast,
  } = useProject();

  const [connectors, setConnectors] = useState<DataConnector[]>(() =>
    connectorService.getConnectors(activeWorkspace.id, activeWorkspace.repoUrl)
  );

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'meetings' | 'code' | 'other'>('all');
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Transcript Modal State
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [transcriptPlatform, setTranscriptPlatform] = useState<ConnectorPlatform>('google-meet');
  const [transcriptTitle, setTranscriptTitle] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<ReturnType<typeof connectorService.parseMeetingTranscript> | null>(null);

  // Connection Config Modal State
  const [configuringConnector, setConfiguringConnector] = useState<DataConnector | null>(null);
  const [configAccount, setConfigAccount] = useState('');

  // Re-sync connector state when workspace changes
  React.useEffect(() => {
    setConnectors(connectorService.getConnectors(activeWorkspace.id, activeWorkspace.repoUrl));
  }, [activeWorkspace.id, activeWorkspace.repoUrl]);

  // Statistics
  const connectedCount = connectors.filter((c) => c.status === 'connected').length;
  const totalTranscripts = connectors.reduce((acc, c) => acc + (c.stats?.transcriptsCount || 0), 0);
  const totalDecisions = connectors.reduce((acc, c) => acc + (c.stats?.decisionsCount || 0), 0);

  const filteredConnectors = useMemo(() => {
    return connectors.filter((c) => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'meetings') return c.category === 'meetings';
      if (selectedCategory === 'code') return c.category === 'code';
      return c.category === 'design' || c.category === 'feedback';
    });
  }, [connectors, selectedCategory]);

  const handleToggleConnector = (connectorId: ConnectorPlatform, connect: boolean) => {
    const updated = connectorService.toggleConnector(activeWorkspace.id, connectorId, connect);
    setConnectors(updated);
    showToast(
      connect
        ? `Connected ${connectorId.toUpperCase()} to ${activeWorkspace.name}`
        : `Disconnected ${connectorId.toUpperCase()}`,
      connect ? 'success' : 'info'
    );
  };

  const handleOpenConfigure = (c: DataConnector) => {
    setConfiguringConnector(c);
    setConfigAccount(c.connectedAccount || '');
  };

  const handleSaveConfiguration = () => {
    if (!configuringConnector) return;
    const updated = connectorService.toggleConnector(activeWorkspace.id, configuringConnector.id, true, {
      account: configAccount.trim() || undefined,
    });
    setConnectors(updated);
    setConfiguringConnector(null);
    showToast(`Configuration updated for ${configuringConnector.name}`, 'success');
  };

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      const updated = connectors.map((c) => ({
        ...c,
        lastSyncedAt: 'Just now',
      }));
      connectorService.saveConnectors(activeWorkspace.id, updated);
      setConnectors(updated);
      setIsSyncingAll(false);
      showToast('All active data connectors synchronized successfully', 'success');
    }, 800);
  };

  const handleLoadSampleTranscript = (platform: 'google-meet' | 'zoom' | 'teams') => {
    const sample = connectorService.getSampleTranscript(platform);
    setTranscriptPlatform(platform);
    setTranscriptTitle(sample.title);
    setTranscriptText(sample.content);
    const parsed = connectorService.parseMeetingTranscript(sample.content, platform, sample.title);
    setParsedPreview(parsed);
  };

  const handleAnalyzeTranscript = () => {
    if (!transcriptText.trim()) return;
    const parsed = connectorService.parseMeetingTranscript(transcriptText, transcriptPlatform, transcriptTitle);
    setParsedPreview(parsed);
  };

  const handleConfirmIngestion = () => {
    if (!parsedPreview) return;

    // 1. Add meeting record
    addMeeting({
      title: parsedPreview.title,
      date: parsedPreview.date,
      durationMinutes: parsedPreview.durationMinutes,
      attendees: parsedPreview.attendees,
      summary: parsedPreview.summary,
      discussionPoints: parsedPreview.discussionPoints,
      decisions: [
        ...parsedPreview.technicalDecisions.map((td, idx) => ({
          id: `dec-tech-${Date.now()}-${idx}`,
          text: td.decisionMade,
          type: 'technical' as const,
        })),
        ...parsedPreview.verbalDecisions.map((vd, idx) => ({
          id: `dec-verb-${Date.now()}-${idx}`,
          text: vd.decisionMade,
          type: 'verbal' as const,
        })),
      ],
      actionItems: parsedPreview.actionItems.map((ai, idx) => ({
        id: `act-item-${Date.now()}-${idx}`,
        text: ai.text,
        owner: ai.owner,
        role: ai.role,
        done: false,
      })),
      unresolvedQuestions: parsedPreview.unresolvedQuestions,
      status: parsedPreview.actionItems.length > 0 ? 'Action Required' : 'Completed',
      roleTag: parsedPreview.roleTag,
    });

    // 2. Add each technical decision as a permanent ADR
    parsedPreview.technicalDecisions.forEach((td) => {
      logDecision({
        title: td.title,
        category: 'Architecture',
        decisionType: 'technical',
        context: td.context,
        decisionMade: td.decisionMade,
        consequences: td.consequences,
        stakeholders: td.stakeholders,
        status: 'active',
      });
    });

    // 3. Add each verbal decision as a recorded team agreement
    parsedPreview.verbalDecisions.forEach((vd) => {
      logDecision({
        title: vd.title,
        category: 'Product',
        decisionType: 'verbal',
        context: vd.context,
        decisionMade: vd.decisionMade,
        consequences: vd.consequences,
        stakeholders: vd.stakeholders,
        status: 'active',
      });
    });

    // 4. Record memory event
    recordMemoryEvent({
      eventType: 'created',
      state: 'active',
      title: `Meeting Transcript Ingested: ${parsedPreview.title}`,
      summary: `Extracted ${parsedPreview.technicalDecisions.length} Technical Decisions (ADRs) and ${parsedPreview.verbalDecisions.length} Verbal Team Agreements from ${transcriptPlatform.toUpperCase()}.`,
      entityType: 'meeting',
      entityId: `mtg-${Date.now()}`,
      entityLabel: parsedPreview.title,
      whyChanged: `Ingested team discussion to synchronize architectural decisions with active sprint tasks.`,
      decision: `${parsedPreview.technicalDecisions.length} Technical ADRs and ${parsedPreview.verbalDecisions.length} Verbal Agreements recorded.`,
      author: parsedPreview.attendees[0]?.name || 'Alex Thorne',
      role: 'all',
      source: 'manual',
      rationaleRecorded: true,
    });

    // 5. Update connector stats & ensure it's marked connected
    const updated = connectorService.toggleConnector(activeWorkspace.id, transcriptPlatform, true);
    const updatedWithStats = connectorService.updateConnectorStats(activeWorkspace.id, transcriptPlatform, {
      transcriptsCount: 1,
      decisionsCount: parsedPreview.technicalDecisions.length + parsedPreview.verbalDecisions.length,
    });
    setConnectors(updatedWithStats);

    // Reset and close
    setIsTranscriptModalOpen(false);
    setTranscriptText('');
    setTranscriptTitle('');
    setParsedPreview(null);
    showToast(
      `Ingested transcript: ${parsedPreview.technicalDecisions.length} Technical ADRs & ${parsedPreview.verbalDecisions.length} Verbal Decisions added!`,
      'success'
    );
  };

  const getPlatformIcon = (platform: ConnectorPlatform) => {
    switch (platform) {
      case 'github':
        return <Github className="h-5 w-5 text-white" />;
      case 'google-meet':
        return <Video className="h-5 w-5 text-white" />;
      case 'zoom':
        return <RadioTower className="h-5 w-5 text-white" />;
      case 'teams':
        return <Users className="h-5 w-5 text-white" />;
      case 'figma':
        return <Layers className="h-5 w-5 text-white" />;
      case 'customer-signals':
        return <MessageSquare className="h-5 w-5 text-white" />;
    }
  };

  const getPlatformBadgeColor = (platform: ConnectorPlatform): 'orange' | 'purple' | 'emerald' | 'blue' => {
    switch (platform) {
      case 'github':
        return 'purple';
      case 'google-meet':
        return 'orange';
      case 'zoom':
        return 'blue';
      case 'teams':
        return 'purple';
      case 'figma':
        return 'orange';
      case 'customer-signals':
        return 'emerald';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EBE5DC] pb-6">
        <div className="flex items-center gap-3">
          <IconBadge3D
            icon={<RadioTower className="h-5 w-5 text-white" />}
            color="orange"
            size="md"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              Data Connectors & Meeting Ingestion Hub
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-[#71717a]">
              Automate data synchronization across GitHub repositories, meeting platforms (Google Meet, Zoom, Teams), and design systems.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setIsTranscriptModalOpen(true);
              handleLoadSampleTranscript('google-meet');
            }}
            className="btn-primary-orange flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>Ingest Meeting Transcript</span>
          </button>

          <button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#18181b] bg-white border border-[#EBE5DC] rounded-xl hover:bg-[#FAF7F2] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingAll ? 'animate-spin text-[#FF6039]' : 'text-[#71717a]'}`} />
            <span>{isSyncingAll ? 'Syncing...' : 'Sync All'}</span>
          </button>
        </div>
      </div>

      {/* ── Top Metrics Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-[#EBE5DC] p-4 shadow-sm">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Active Connectors
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#18181b]">
              {connectedCount} / {connectors.length}
            </span>
            <span className="text-xs font-medium text-emerald-600">Online</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#EBE5DC] p-4 shadow-sm">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Ingested Transcripts
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#FF6039]">{totalTranscripts}</span>
            <span className="text-xs font-medium text-[#71717a]">Syncs parsed</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#EBE5DC] p-4 shadow-sm">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            ADRs & Decisions Extracted
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#18181b]">{totalDecisions}</span>
            <span className="text-xs font-medium text-indigo-600">Prioritized</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#EBE5DC] p-4 shadow-sm">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Target Workspace
          </span>
          <div className="mt-1 truncate">
            <span className="text-sm font-bold text-[#18181b] block truncate">
              {activeWorkspace.name}
            </span>
            <span className="font-mono text-[11px] text-[#71717a]">{activeWorkspace.code}</span>
          </div>
        </div>
      </div>

      {/* ── Disconnected Warning Banner if meetings or github are offline ── */}
      {connectedCount < connectors.length && (
        <div className="rounded-2xl bg-[#FFFBF0] border border-[#FDE68A] p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#92400E]">
                {connectors.length - connectedCount} Data Connector(s) Not Connected
              </h4>
              <p className="mt-0.5 text-xs text-[#B45309] leading-relaxed">
                Some platforms are disconnected. Ingestion is paused until connected. Connect Google Meet, Zoom, or Teams to automatically extract ADRs and prioritize team commitments.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const updated = connectors.map((c) => ({
                ...c,
                status: 'connected' as const,
                lastSyncedAt: 'Just now',
              }));
              connectorService.saveConnectors(activeWorkspace.id, updated);
              setConnectors(updated);
              showToast('All data connectors connected successfully', 'success');
            }}
            className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
          >
            Connect All Sources
          </button>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#EBE5DC] pb-3 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#18181b] text-white shadow-sm'
              : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#FAF7F2]'
          }`}
        >
          All Connectors ({connectors.length})
        </button>
        <button
          onClick={() => setSelectedCategory('meetings')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'meetings'
              ? 'bg-[#18181b] text-white shadow-sm'
              : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#FAF7F2]'
          }`}
        >
          Meeting Transcripts (3)
        </button>
        <button
          onClick={() => setSelectedCategory('code')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'code'
              ? 'bg-[#18181b] text-white shadow-sm'
              : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#FAF7F2]'
          }`}
        >
          Code & GitHub (1)
        </button>
        <button
          onClick={() => setSelectedCategory('other')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'other'
              ? 'bg-[#18181b] text-white shadow-sm'
              : 'text-[#71717a] hover:text-[#18181b] hover:bg-[#FAF7F2]'
          }`}
        >
          Design & Customer Signals (2)
        </button>
      </div>

      {/* ── Connectors Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnectors.map((connector) => {
          const isConnected = connector.status === 'connected';

          return (
            <div
              key={connector.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all shadow-sm ${
                isConnected
                  ? 'bg-white border-[#EBE5DC] hover:border-[#FF6039]/40 hover:shadow-md'
                  : 'bg-[#FAF7F2]/60 border-dashed border-[#D4CEBF]'
              }`}
            >
              <div>
                {/* Card Top: Icon + Status */}
                <div className="flex items-start justify-between gap-3">
                  <IconBadge3D
                    icon={getPlatformIcon(connector.id)}
                    color={getPlatformBadgeColor(connector.id)}
                    size="md"
                  />
                  <div>
                    {isConnected ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#71717a] bg-[#F4EFE6] border border-[#E5DFD5] px-2.5 py-1 rounded-full">
                        Not Connected
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & Description */}
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#18181b]">{connector.name}</h3>
                  </div>
                  <p className="mt-1 text-xs text-[#71717a] leading-relaxed line-clamp-3">
                    {connector.description}
                  </p>
                </div>

                {/* Live Connected Meta */}
                {isConnected ? (
                  <div className="mt-4 rounded-xl bg-[#FAF7F2] p-3 border border-[#EBE5DC] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#71717a]">Target:</span>
                      <span className="font-bold text-[#18181b] truncate max-w-[170px]">
                        {connector.connectedAccount || 'Active Link'}
                      </span>
                    </div>
                    {connector.lastSyncedAt && (
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[#71717a]">Last Sync:</span>
                        <span className="text-[#18181b]">{connector.lastSyncedAt}</span>
                      </div>
                    )}

                    {/* Stats Strip */}
                    {connector.stats && (
                      <div className="pt-2 border-t border-[#EBE5DC]/80 grid grid-cols-2 gap-2 text-center text-xs">
                        {connector.stats.branchesCount !== undefined && (
                          <div className="bg-white rounded-lg p-1.5 border border-[#EBE5DC]">
                            <span className="block font-black text-[#18181b]">
                              {connector.stats.branchesCount}
                            </span>
                            <span className="text-[10px] text-[#71717a] uppercase font-mono">Branches</span>
                          </div>
                        )}
                        {connector.stats.mergedPRsCount !== undefined && (
                          <div className="bg-white rounded-lg p-1.5 border border-[#EBE5DC]">
                            <span className="block font-black text-emerald-600">
                              {connector.stats.mergedPRsCount}
                            </span>
                            <span className="text-[10px] text-[#71717a] uppercase font-mono">Merged PRs</span>
                          </div>
                        )}
                        {connector.stats.transcriptsCount !== undefined && (
                          <div className="bg-white rounded-lg p-1.5 border border-[#EBE5DC]">
                            <span className="block font-black text-[#FF6039]">
                              {connector.stats.transcriptsCount}
                            </span>
                            <span className="text-[10px] text-[#71717a] uppercase font-mono">Transcripts</span>
                          </div>
                        )}
                        {connector.stats.decisionsCount !== undefined && (
                          <div className="bg-white rounded-lg p-1.5 border border-[#EBE5DC]">
                            <span className="block font-black text-indigo-600">
                              {connector.stats.decisionsCount}
                            </span>
                            <span className="text-[10px] text-[#71717a] uppercase font-mono">Decisions</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl bg-white/70 p-3 border border-dashed border-[#D4CEBF] text-center">
                    <p className="text-xs text-[#71717a]">
                      No active stream connected. Connect this source to pull real-time data into your project memory.
                    </p>
                  </div>
                )}
              </div>

              {/* Card Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-[#EBE5DC] flex items-center justify-between gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleOpenConfigure(connector)}
                      className="text-xs font-bold text-[#18181b] hover:text-[#FF6039] transition-colors cursor-pointer"
                    >
                      Configure
                    </button>

                    <div className="flex items-center gap-2">
                      {connector.category === 'meetings' && (
                        <button
                          onClick={() => {
                            setIsTranscriptModalOpen(true);
                            handleLoadSampleTranscript(connector.id as any);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-[#FF6039] bg-[#FFF8F5] border border-[#FFD6CC] rounded-lg hover:bg-[#FFEBE5] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Ingest</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleConnector(connector.id, false)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#71717a] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleToggleConnector(connector.id, true)}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-[#18181b] hover:bg-[#27272a] rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Connect Platform</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Meeting Transcript Ingestion Modal ── */}
      <Modal
        isOpen={isTranscriptModalOpen}
        onClose={() => setIsTranscriptModalOpen(false)}
        title="Ingest Meeting Transcript & Extract Decisions"
        subtitle="Parses raw meeting notes or speech-to-text transcripts into structured discussions, action items, and categorized decisions."
      >
        <div className="space-y-6">
          {/* Source Selection & Quick Sample Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a] mb-1">
                Meeting Platform
              </label>
              <div className="flex items-center gap-2">
                {(['google-meet', 'zoom', 'teams'] as const).map((plt) => (
                  <button
                    key={plt}
                    type="button"
                    onClick={() => handleLoadSampleTranscript(plt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      transcriptPlatform === plt
                        ? 'bg-[#18181b] text-white border-[#18181b]'
                        : 'bg-white text-[#71717a] border-[#EBE5DC] hover:border-[#FF6039]'
                    }`}
                  >
                    {plt === 'google-meet' && 'Google Meet'}
                    {plt === 'zoom' && 'Zoom Cloud'}
                    {plt === 'teams' && 'MS Teams'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleLoadSampleTranscript(transcriptPlatform as any)}
                className="px-2.5 py-1.5 text-xs font-bold text-[#FF6039] bg-[#FFF8F5] border border-[#FFD6CC] rounded-xl hover:bg-[#FFEBE5] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Load Sample Transcript</span>
              </button>
            </div>
          </div>

          {/* Meeting Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a] mb-1">
              Meeting Title
            </label>
            <input
              type="text"
              value={transcriptTitle}
              onChange={(e) => setTranscriptTitle(e.target.value)}
              placeholder="e.g. Sprint 14 Core Architecture & Edge Ingestion Review"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE5DC] bg-white text-sm text-[#18181b] focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          {/* Raw Transcript Area */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a]">
                Raw Transcript / Notes
              </label>
              <span className="text-[11px] text-[#71717a]">
                {transcriptText.split('\n').filter(Boolean).length} lines
              </span>
            </div>
            <textarea
              rows={7}
              value={transcriptText}
              onChange={(e) => {
                setTranscriptText(e.target.value);
                setParsedPreview(null);
              }}
              placeholder="Paste raw transcript from Google Meet, Zoom, or Teams..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE5DC] bg-white text-xs font-mono text-[#18181b] focus:border-[#FF6039] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAnalyzeTranscript}
              disabled={!transcriptText.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-[#18181b] hover:bg-[#27272a] rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF6039]" />
              <span>Synthesize & Extract Decisions</span>
            </button>
          </div>

          {/* ── Extracted Preview Breakdown ── */}
          {parsedPreview && (
            <div className="rounded-2xl bg-[#FAF7F2] p-5 border border-[#EBE5DC] space-y-5 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#EBE5DC] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#FF6039] bg-white px-2.5 py-0.5 rounded-md border border-[#EBE5DC]">
                    PREVIEW SYNTHESIS
                  </span>
                  <span className="text-xs text-[#71717a]">
                    Duration: {parsedPreview.durationMinutes} mins • {parsedPreview.attendees.length} Attendees
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Ready to Ingest
                </span>
              </div>

              {/* Attendees */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#71717a] block mb-1.5">
                  Detected Attendees ({parsedPreview.attendees.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {parsedPreview.attendees.map((att) => (
                    <span
                      key={att.name}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#18181b] bg-white px-2.5 py-1 rounded-lg border border-[#EBE5DC]"
                    >
                      <Users className="h-3 w-3 text-[#71717a]" />
                      <strong>{att.name}</strong>
                      <span className="text-[#71717a]">({att.role})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Decisions (Prioritized) */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 block mb-2 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5 text-indigo-600" />
                  1. Technical Decisions (Architectural ADRs) — High Priority ({parsedPreview.technicalDecisions.length})
                </span>
                <div className="space-y-2">
                  {parsedPreview.technicalDecisions.map((td, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-indigo-50/70 border border-indigo-200 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-900">{td.title}</span>
                        <span className="font-mono text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                          TECHNICAL ADR
                        </span>
                      </div>
                      <p className="text-indigo-950 font-medium">{td.decisionMade}</p>
                      <p className="text-indigo-700/80 text-[11px]">{td.consequences}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verbal Decisions (Team Agreements) */}
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 block mb-2 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                  2. Verbal Decisions (Team Agreements & Commitments) ({parsedPreview.verbalDecisions.length})
                </span>
                <div className="space-y-2">
                  {parsedPreview.verbalDecisions.map((vd, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900">{vd.title}</span>
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                          VERBAL AGREEMENT
                        </span>
                      </div>
                      <p className="text-emerald-950 font-medium">{vd.decisionMade}</p>
                      <p className="text-emerald-700/80 text-[11px]">{vd.consequences}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Items */}
              {parsedPreview.actionItems.length > 0 && (
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#71717a] block mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    3. Action Items ({parsedPreview.actionItems.length})
                  </span>
                  <div className="space-y-1.5">
                    {parsedPreview.actionItems.map((ai, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-white border border-[#EBE5DC] p-2.5 text-xs flex items-center justify-between gap-3"
                      >
                        <span className="text-[#18181b]">{ai.text}</span>
                        <span className="font-mono text-[11px] font-bold text-[#FF6039] bg-[#FFF8F5] px-2 py-0.5 rounded border border-[#FFD6CC] shrink-0">
                          Owner: {ai.owner}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTranscriptModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#71717a] hover:bg-white rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmIngestion}
                  className="btn-primary-orange flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Save to Project Memory & Decisions Log</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ── Configure Connector Modal ── */}
      <Modal
        isOpen={Boolean(configuringConnector)}
        onClose={() => setConfiguringConnector(null)}
        title={`Configure ${configuringConnector?.name}`}
        subtitle="Manage repository URL, webhook secret, or organizational workspace account."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#71717a] mb-1">
              Connected Target / Account Name
            </label>
            <input
              type="text"
              value={configAccount}
              onChange={(e) => setConfigAccount(e.target.value)}
              placeholder="e.g. devatlas/signalslab or team-calendar@org.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBE5DC] bg-white text-sm text-[#18181b] focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          <div className="rounded-xl bg-[#FAF7F2] p-3 border border-[#EBE5DC] text-xs text-[#71717a] space-y-1">
            <p>
              • <strong>Webhook Lineage:</strong> Real-time changes are synchronized with localStorage and Firestore.
            </p>
            <p>
              • <strong>Privacy:</strong> Tokens and transcripts remain scoped to workspace <code>{activeWorkspace.code}</code>.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setConfiguringConnector(null)}
              className="px-4 py-2 text-xs font-semibold text-[#71717a] hover:bg-[#FAF7F2] rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveConfiguration}
              className="btn-primary-orange"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
