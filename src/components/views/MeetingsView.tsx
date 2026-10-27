import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BrainCircuit,
  Plus,
  Search,
  ArrowRight,
  Filter,
  Check,
  Scale,
  Kanban,
  Clock,
  Layers,
  MessageSquare,
  RadioTower,
  Code,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAI } from '../../context/AIContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { IconBadge3D } from '../common/IconBadge3D';
import { ProjectMeeting, RoleType } from '../../types';
import { connectorService } from '../../services/connectorService';

export const MeetingsView: React.FC = () => {
  const { meetings, addMeeting, deleteMeeting, toggleMeetingActionItem, setActiveSection, showToast, activeWorkspace } = useProject();
  const { openStudio, sendMessage } = useAI();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | RoleType>('all');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(meetings[0]?.id || null);
  const [isNewMeetingModalOpen, setNewMeetingModalOpen] = useState(false);

  // Form State for Recording a New Meeting
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('Sep 25, 2026');
  const [newDuration, setNewDuration] = useState('30');
  const [newRoleTag, setNewRoleTag] = useState<RoleType>('dev');
  const [newSummary, setNewSummary] = useState('');
  const [newDecision, setNewDecision] = useState('');
  const [newDecisionType, setNewDecisionType] = useState<'technical' | 'verbal'>('technical');
  const [newActionItemText, setNewActionItemText] = useState('');
  const [newActionItemOwner, setNewActionItemOwner] = useState('Alex Thorne');
  const [newAttendees, setNewAttendees] = useState('Alex Thorne, Maya Lin, Sarah Jenkins');

  const meetingConnectors = useMemo(() => {
    const list = connectorService.getConnectors(activeWorkspace.id);
    return list.filter((c) => c.category === 'meetings');
  }, [activeWorkspace.id]);
  const hasActiveMeetingConnector = meetingConnectors.some((c) => c.status === 'connected');

  // Filtered Meetings
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      const matchesSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.meetingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.attendees.some((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === 'all' || m.roleTag === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [meetings, searchQuery, roleFilter]);

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId) || filteredMeetings[0] || meetings[0];

  const handleAskAIAboutMeeting = (meeting: ProjectMeeting) => {
    openStudio(meeting.roleTag);
    // Send or prefill query
    setTimeout(() => {
      sendMessage(
        `Summarize the key decisions and unresolved questions from meeting [${meeting.meetingCode}] "${meeting.title}". Who owns each pending action item?`
      );
    }, 150);
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const attendeesList = newAttendees
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        role: 'Team Contributor',
      }));

    const actionItems = newActionItemText.trim()
      ? [
          {
            id: `act-${Date.now()}`,
            text: newActionItemText.trim(),
            owner: newActionItemOwner.trim() || 'Unassigned',
            role: newRoleTag.toUpperCase(),
            done: false,
          },
        ]
      : [];

    const decisions = newDecision.trim()
      ? [
          {
            id: `dec-${Date.now()}`,
            text: newDecision.trim(),
            type: newDecisionType,
          },
        ]
      : [];

    addMeeting({
      title: newTitle,
      date: newDate,
      durationMinutes: parseInt(newDuration, 10) || 30,
      attendees: attendeesList.length > 0 ? attendeesList : [{ name: 'Alex Thorne', role: 'Principal Architect' }],
      summary: newSummary,
      discussionPoints: [
        {
          topic: 'Initial Sync & Context Alignment',
          summary: newSummary,
          speaker: attendeesList[0]?.name || 'Alex Thorne',
        },
      ],
      decisions,
      actionItems,
      unresolvedQuestions: [],
      status: actionItems.length > 0 ? 'Action Required' : 'Completed',
      roleTag: newRoleTag,
    });

    setNewMeetingModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewDecision('');
    setNewActionItemText('');
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EBE5DC] pb-6">
        <div className="flex items-center gap-3">
          <IconBadge3D
            icon={<Calendar className="h-5 w-5 text-white" />}
            color="orange"
            size="md"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              Project Discussions & Syncs
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-[#71717a]">
              Structured meeting memory connecting discussions directly to decisions, tasks, and rationale.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveSection('connectors')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#18181b] bg-white border border-[#EBE5DC] rounded-xl hover:bg-[#FAF7F2] transition-colors shadow-2xs cursor-pointer"
            title="Ingest transcripts from Google Meet, Zoom, or Teams"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#FF6039]" />
            <span>Ingest Transcript</span>
          </button>
          <button
            onClick={() => openStudio('all')}
            className="btn-secondary-dark"
            aria-label="Ask AI about recent discussions"
          >
            <BrainCircuit className="h-4 w-4 text-[#FF6039]" />
            <span>Ask Meeting AI</span>
          </button>
          <button
            onClick={() => setNewMeetingModalOpen(true)}
            className="btn-primary-orange"
            aria-label="Record new sync notes"
          >
            <Plus className="h-4 w-4" />
            <span>Record Sync Notes</span>
          </button>
        </div>
      </div>

      {/* ── Meeting Connector Offline Notice ── */}
      {!hasActiveMeetingConnector && (
        <div className="rounded-xl bg-[#FFFBF0] border border-[#FDE68A] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 text-[#92400E]">
            <RadioTower className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Meeting Connectors Disconnected:</strong> Connect Google Meet or Zoom in Data Connectors to auto-ingest transcripts and prioritize decisions.
            </span>
          </div>
          <button
            onClick={() => setActiveSection('connectors')}
            className="px-2.5 py-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            Connect Sources
          </button>
        </div>
      )}

      {/* ── Filter & Search Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#EBE5DC] shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syncs, topics, attendees..."
            aria-label="Search meetings by keyword"
            className="w-full rounded-lg border border-[#EBE5DC] bg-[#FAF7F2] pl-9 pr-3 py-1.5 text-xs sm:text-sm text-[#18181b] focus:border-[#FF6039] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-[#71717a] font-medium mr-1 hidden sm:inline">Role:</span>
          {(['all', 'dev', 'designer', 'pm', 'qa'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                roleFilter === r
                  ? 'bg-[#18181b] text-white border-[#18181b] shadow-xs'
                  : 'bg-[#FAF7F2] text-[#52525b] border-[#EBE5DC] hover:border-[#FF6039]/40'
              }`}
            >
              {r === 'all' ? 'All Roles' : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Master-Detail Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Meeting List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#71717a] px-1 font-semibold">
            <span>Synchronizations ({filteredMeetings.length})</span>
            <span>Sorted by Recent</span>
          </div>

          {filteredMeetings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#EBE5DC] bg-white p-8 text-center">
              <Calendar className="h-8 w-8 text-[#a1a1aa] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#18181b]">No syncs match your search</p>
              <p className="text-xs text-[#71717a] mt-1">Try clearing filters or search query.</p>
            </div>
          ) : (
            filteredMeetings.map((m) => {
              const isSelected = selectedMeeting?.id === m.id;
              const completedCount = m.actionItems.filter((a) => a.done).length;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeetingId(m.id)}
                  className={`rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#FF6039] bg-[#FFF8F5] ring-2 ring-[#FF6039]/20 shadow-sm'
                      : 'border-[#EBE5DC] bg-white hover:border-[#FF6039]/50 hover:bg-[#FAF7F2]'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelectedMeetingId(m.id);
                  }}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#18181b] bg-[#FAF7F2] border border-[#EBE5DC] px-2 py-0.5 rounded-md">
                        {m.meetingCode}
                      </span>
                      <StatusBadge
                        label={m.status}
                        variant={m.status === 'Completed' ? 'green' : 'amber'}
                        size="sm"
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[#71717a] flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3 text-[#FF6039]" />
                      {m.durationMinutes}m
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete meeting ${m.meetingCode}?`)) {
                          deleteMeeting(m.id);
                          if (selectedMeeting?.id === m.id) setSelectedMeetingId(null);
                        }
                      }}
                      className="text-[#a1a1aa] hover:text-red-600 p-0.5 rounded hover:bg-red-50 cursor-pointer"
                      title="Delete meeting"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-[#18181b] line-clamp-1">
                    {m.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#52525b] line-clamp-2 leading-relaxed">
                    {m.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#71717a] pt-2 border-t border-[#f0ebe3]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {m.date}
                    </span>
                    <span className="font-semibold text-[#18181b]">
                      {m.actionItems.length} Actions ({completedCount} done)
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Meeting Memory Inspector (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedMeeting ? (
            <div className="rounded-2xl border border-[#EBE5DC] bg-white p-6 shadow-sm space-y-6">
              {/* Meeting Header */}
              <div className="border-b border-[#EBE5DC] pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#18181b] bg-[#FAF7F2] border border-[#EBE5DC] px-2.5 py-1 rounded-md">
                      {selectedMeeting.meetingCode}
                    </span>
                    <StatusBadge
                      label={selectedMeeting.status}
                      variant={selectedMeeting.status === 'Completed' ? 'green' : 'amber'}
                      size="sm"
                    />
                    <span className="font-mono text-xs text-[#71717a] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#EBE5DC]">
                      {selectedMeeting.roleTag.toUpperCase()} Focus
                    </span>
                  </div>

                  <button
                    onClick={() => handleAskAIAboutMeeting(selectedMeeting)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6039] hover:text-[#E54D26] hover:underline cursor-pointer"
                  >
                    <BrainCircuit className="h-3.5 w-3.5" />
                    <span>Ask AI about this meeting</span>
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181b]">
                  {selectedMeeting.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-[#71717a]">
                  <span className="flex items-center gap-1.5 font-medium text-[#18181b]">
                    <Calendar className="h-3.5 w-3.5 text-[#FF6039]" />
                    {selectedMeeting.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium text-[#18181b]">
                    <Clock className="h-3.5 w-3.5 text-[#FF6039]" />
                    {selectedMeeting.durationMinutes} Minutes
                  </span>
                  {selectedMeeting.relatedFeature && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-[#52525b]">
                        <Layers className="h-3.5 w-3.5" />
                        {selectedMeeting.relatedFeature}
                      </span>
                    </>
                  )}
                </div>

                {/* Attendees */}
                <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                  <span className="text-xs text-[#71717a] font-semibold shrink-0">Attendees:</span>
                  <div className="flex items-center gap-2">
                    {selectedMeeting.attendees.map((attendee, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2] border border-[#EBE5DC] px-2.5 py-1 text-xs text-[#18181b]"
                        title={attendee.role}
                      >
                        {attendee.avatar ? (
                          <img
                            src={attendee.avatar}
                            alt={attendee.name}
                            className="h-4 w-4 rounded-full object-cover"
                          />
                        ) : (
                          <span className="h-4 w-4 rounded-full bg-[#18181b] text-white flex items-center justify-center text-[9px] font-bold">
                            {attendee.name[0]}
                          </span>
                        )}
                        <span className="font-medium">{attendee.name}</span>
                        <span className="text-[10px] text-[#71717a]">({attendee.role.split(' ')[0]})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Hierarchy Layer 1: Executive Summary ── */}
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#71717a] block mb-2">
                  1. Executive Summary
                </span>
                <div className="rounded-xl bg-[#FAF7F2] p-4 border border-[#EBE5DC] text-sm text-[#18181b] leading-relaxed">
                  {selectedMeeting.summary}
                </div>
              </div>

              {/* ── Hierarchy Layer 2: Decisions Made (Orange Highlight) ── */}
              {selectedMeeting.decisions.length > 0 && (
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E54D26] block mb-2 flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-[#FF6039]" />
                    2. Decisions Reached ({selectedMeeting.decisions.length})
                  </span>
                  <div className="space-y-2.5">
                    {selectedMeeting.decisions.map((dec) => {
                      const isTech =
                        dec.type === 'technical' ||
                        (dec.linkedDecisionCode && dec.linkedDecisionCode.startsWith('ADR')) ||
                        !dec.type;

                      return (
                        <div
                          key={dec.id}
                          className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isTech
                              ? 'bg-indigo-50/40 border-indigo-200/80'
                              : 'bg-emerald-50/40 border-emerald-200/80'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              {dec.linkedDecisionCode && (
                                <span className="inline-block font-mono text-[11px] font-bold text-[#18181b] bg-white px-2 py-0.5 rounded border border-[#EBE5DC]">
                                  {dec.linkedDecisionCode}
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  isTech
                                    ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                {isTech ? <Code className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                                {isTech ? 'TECHNICAL ADR' : 'VERBAL AGREEMENT'}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-[#18181b] leading-relaxed">
                              {dec.text}
                            </p>
                          </div>

                          {dec.linkedDecisionId && (
                            <button
                              onClick={() => setActiveSection('decisions')}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6039] hover:underline shrink-0"
                            >
                              <span>Inspect ADR</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Hierarchy Layer 3: Action Items & Responsibilities ── */}
              {selectedMeeting.actionItems.length > 0 && (
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#71717a] block mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    3. Action Items ({selectedMeeting.actionItems.length})
                  </span>
                  <div className="space-y-2">
                    {selectedMeeting.actionItems.map((action) => (
                      <div
                        key={action.id}
                        className={`rounded-xl border p-3 flex items-start justify-between gap-3 transition-colors ${
                          action.done
                            ? 'bg-[#f0fdf4] border-emerald-200/80 text-[#52525b]'
                            : 'bg-white border-[#EBE5DC] text-[#18181b]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() =>
                              toggleMeetingActionItem(selectedMeeting.id, action.id, !action.done)
                            }
                            className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                              action.done
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-[#d4d4d8] hover:border-[#FF6039]'
                            }`}
                            aria-label={`Toggle action item: ${action.text}`}
                          >
                            {action.done && <Check className="h-3 w-3 stroke-[3]" />}
                          </button>

                          <div>
                            <p
                              className={`text-xs sm:text-sm font-medium leading-relaxed ${
                                action.done ? 'line-through text-[#71717a]' : 'text-[#18181b]'
                              }`}
                            >
                              {action.text}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-[#71717a] font-mono">
                              <span className="font-semibold text-[#18181b]">
                                Owner: @{action.owner}
                              </span>
                              {action.linkedTaskCode && (
                                <>
                                  <span>•</span>
                                  <button
                                    onClick={() => setActiveSection('tasks')}
                                    className="text-[#FF6039] hover:underline font-bold"
                                  >
                                    Linked Task: {action.linkedTaskCode}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {action.linkedTaskCode && (
                          <button
                            onClick={() => setActiveSection('tasks')}
                            className="btn-secondary-dark text-xs py-1 px-2.5 shrink-0 hidden sm:inline-flex"
                          >
                            <Kanban className="h-3 w-3 text-[#FF6039]" />
                            <span>View Task</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Hierarchy Layer 4: Key Discussion Points ── */}
              {selectedMeeting.discussionPoints.length > 0 && (
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#71717a] block mb-2 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-[#52525b]" />
                    4. In-Depth Discussion Notes
                  </span>
                  <div className="space-y-2">
                    {selectedMeeting.discussionPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-[#FAF7F2] p-3.5 border border-[#EBE5DC] space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#18181b]">
                          <span>{pt.topic}</span>
                          {pt.speaker && (
                            <span className="font-mono text-[10px] text-[#71717a] font-medium">
                              Raised by {pt.speaker}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#52525b] leading-relaxed">
                          {pt.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Hierarchy Layer 5: Unresolved Questions ── */}
              {selectedMeeting.unresolvedQuestions.length > 0 && (
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 block mb-2 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                    5. Unresolved Questions & Follow-ups
                  </span>
                  <div className="rounded-xl bg-amber-50/60 border border-amber-200/80 p-3.5 space-y-2">
                    {selectedMeeting.unresolvedQuestions.map((q, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-amber-900 leading-relaxed font-medium">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#EBE5DC] bg-white p-12 text-center">
              <Calendar className="h-10 w-10 text-[#a1a1aa] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#18181b]">No sync selected</h3>
              <p className="text-xs text-[#71717a] mt-1">Select a sync from the left panel to inspect its decisions and actions.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Record New Meeting Modal ── */}
      <Modal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setNewMeetingModalOpen(false)}
        title="Record Project Sync & Meeting Memory"
        subtitle="Turn meetings into actionable, searchable project intelligence."
      >
        <form onSubmit={handleCreateMeeting} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
              Meeting Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Sprint 25 Architecture & Cache Invalidation Review"
              className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs sm:text-sm text-[#18181b] focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="text"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] font-mono focus:border-[#FF6039] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Duration (min)
              </label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] font-mono focus:border-[#FF6039] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Role Focus
              </label>
              <select
                value={newRoleTag}
                onChange={(e) => setNewRoleTag(e.target.value as RoleType)}
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] font-mono focus:border-[#FF6039] focus:outline-none"
              >
                <option value="dev">Engineering (DEV)</option>
                <option value="designer">Design (DESIGNER)</option>
                <option value="pm">Product (PM)</option>
                <option value="qa">Quality & Security (QA)</option>
                <option value="all">Cross-Functional (ALL)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
              Attendees (Comma separated)
            </label>
            <input
              type="text"
              value={newAttendees}
              onChange={(e) => setNewAttendees(e.target.value)}
              className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
              1. Executive Summary
            </label>
            <textarea
              rows={2}
              required
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="What was the main topic and outcome of this sync?"
              className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs sm:text-sm text-[#18181b] focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider">
                2. Key Decision (Optional)
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setNewDecisionType('technical')}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    newDecisionType === 'technical'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-[#71717a] border-[#EBE5DC] hover:text-[#18181b]'
                  }`}
                >
                  <Code className="h-3 w-3" />
                  <span>Technical ADR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewDecisionType('verbal')}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                    newDecisionType === 'verbal'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-[#71717a] border-[#EBE5DC] hover:text-[#18181b]'
                  }`}
                >
                  <MessageSquare className="h-3 w-3" />
                  <span>Verbal Agreement</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              value={newDecision}
              onChange={(e) => setNewDecision(e.target.value)}
              placeholder={
                newDecisionType === 'technical'
                  ? 'e.g. Standardize on Cloudflare KV with stale-while-revalidate caching'
                  : 'e.g. Agreed to Thursday 5:00 PM code freeze and Friday QA sign-off'
              }
              className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs sm:text-sm text-[#18181b] focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                3. Action Item
              </label>
              <input
                type="text"
                value={newActionItemText}
                onChange={(e) => setNewActionItemText(e.target.value)}
                placeholder="e.g. Implement Redis distributed lock middleware"
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] focus:border-[#FF6039] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Action Owner
              </label>
              <input
                type="text"
                value={newActionItemOwner}
                onChange={(e) => setNewActionItemOwner(e.target.value)}
                placeholder="e.g. Alex Thorne"
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] focus:border-[#FF6039] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#EBE5DC] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setNewMeetingModalOpen(false)}
              className="btn-secondary-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-orange"
            >
              Record Sync
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
