import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  GitBranch,
  BrainCircuit,
  Zap,
  Terminal,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  Trash2,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { MemoryTrigger } from '../memory/MemoryTrigger';
import { RoleMemoryWidget } from '../memory/RoleMemoryWidget';
import { IconBadge3D } from '../common/IconBadge3D';
import { DevTask, PriorityType } from '../../types';

export const DevTasksView: React.FC = () => {
  const { devTasks, updateTaskStatus, createDevTask, deleteDevTask, setActiveSection, showToast } = useProject();
  const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<DevTask | null>(null);

  // Drag and Drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [activeDragCol, setActiveDragCol] = useState<DevTask['status'] | null>(null);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskRequirementTitle, setTaskRequirementTitle] = useState('Core Architecture Engine');
  const [taskPriority, setTaskPriority] = useState<PriorityType>('P0');
  const [taskContext, setTaskContext] = useState('');
  const [taskTags, setTaskTags] = useState('TypeScript, React, Node.js');

  const columns: Array<{
    id: DevTask['status'];
    label: string;
    description: string;
    badgeColor: 'dark' | 'amber' | 'purple' | 'emerald';
    countBadgeColor: string;
  }> = [
    {
      id: 'todo',
      label: 'To Do',
      description: 'Backlog items ready for work',
      badgeColor: 'dark',
      countBadgeColor: 'bg-zinc-100 text-zinc-700',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      description: 'Actively being coded & tested',
      badgeColor: 'amber',
      countBadgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
    },
    {
      id: 'review',
      label: 'In Review',
      description: 'PR open & review pending',
      badgeColor: 'purple',
      countBadgeColor: 'bg-purple-50 text-purple-800 border-purple-200/80',
    },
    {
      id: 'done',
      label: 'Done',
      description: 'Passed QA and merged',
      badgeColor: 'emerald',
      countBadgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    createDevTask({
      title: taskTitle,
      requirementId: 'prd-main-01',
      requirementTitle: taskRequirementTitle,
      status: 'todo',
      priority: taskPriority,
      assignee: {
        name: 'Project Maintainer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        role: 'Core Engineer',
      },
      contextSummary: taskContext || 'Follow project architecture and acceptance criteria.',
      techStackTags: taskTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewTaskModalOpen(false);
    setTaskTitle('');
    setTaskContext('');
    showToast('Created new task in To Do!', 'success');
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setActiveDragCol(null);
  };

  const handleDragOver = (e: React.DragEvent, colId: DevTask['status']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDragCol !== colId) {
      setActiveDragCol(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setActiveDragCol(null);
  };

  const handleDrop = (e: React.DragEvent, colId: DevTask['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      updateTaskStatus(taskId, colId);
      const colLabel = columns.find((c) => c.id === colId)?.label || colId;
      showToast(`Moved task to ${colLabel}!`, 'info');
    }
    setActiveDragCol(null);
    setDraggedTaskId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EBE5DC] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <IconBadge3D
              icon={<Kanban className="h-5 w-5 text-white" />}
              color="orange"
              size="md"
            />
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
                Developer Tasks & Kanban
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#71717a] font-sans">
                Drag and drop cards across columns to update task progress in real time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('prompts')}
            className="btn-secondary-dark"
          >
            <Zap className="h-4 w-4 text-[#FF6039]" />
            <span>Engineering Prompts</span>
          </button>
          <button
            onClick={() => setNewTaskModalOpen(true)}
            className="btn-primary-orange"
          >
            <Plus className="h-4 w-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Role Memory: Engineering & Architecture Decisions */}
      <RoleMemoryWidget role="dev" />

      {/* 4-Column Drag-and-Drop Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colTasks = devTasks.filter((t) => t.status === col.id);
          const isOver = activeDragCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-2xl border p-4 shadow-sm flex flex-col min-h-[540px] transition-all duration-200 ${
                isOver
                  ? 'border-[#FF6039] bg-[#FFF8F5] ring-2 ring-[#FF6039]/30 shadow-md'
                  : 'border-[#EBE5DC] bg-[#FAF7F2]'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-[#EBE5DC] pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-bold text-[#18181b]">
                    {col.label}
                  </span>
                  <span
                    className={`font-sans text-xs font-semibold px-2 py-0.5 rounded-full border border-black/5 ${col.countBadgeColor}`}
                  >
                    {colTasks.length}
                  </span>
                </div>
                <span className="text-[11px] text-[#71717a] font-sans font-medium hidden sm:inline">
                  Drag here
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div
                    className={`h-36 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-4 transition-colors ${
                      isOver
                        ? 'border-[#FF6039] bg-[#FFF0EC]/50 text-[#FF6039]'
                        : 'border-[#EBE5DC] text-[#a1a1aa]'
                    }`}
                  >
                    <span className="text-xs font-sans font-medium">
                      {isOver ? 'Drop card here' : `No tasks in ${col.label}`}
                    </span>
                    <span className="text-[10px] text-[#a1a1aa] mt-1 font-sans">
                      Drag another card into this column
                    </span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isDragging = draggedTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedTaskForModal(task)}
                        className={`rounded-xl border border-[#EBE5DC] bg-white p-4 shadow-2xs hover:border-[#FF6039]/60 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-grab active:cursor-grabbing space-y-3 group select-none relative ${
                          isDragging ? 'opacity-40 scale-95 border-dashed border-[#FF6039]' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[#a1a1aa] group-hover:text-[#FF6039] transition-colors">
                              <GripVertical className="h-3.5 w-3.5" />
                            </span>
                            <span className="font-sans text-xs font-bold text-[#18181b] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#EBE5DC]">
                              {task.taskCode}
                            </span>
                            <StatusBadge
                              label={task.priority}
                              variant={task.priority === 'P0' ? 'red' : 'amber'}
                              size="sm"
                              dot={true}
                            />
                            {task.relatedDecisionCode && (
                              <span className="font-mono text-[10px] font-bold text-[#FF6039] bg-[#FFF0EC] px-1.5 py-0.5 rounded border border-[#FFD6CC]">
                                {task.relatedDecisionCode}
                              </span>
                            )}
                          </div>
                          <MemoryTrigger entityType="task" entityId={task.id} variant="compact" />
                        </div>

                        <h4 className="font-sans font-bold text-sm text-[#18181b] group-hover:text-[#E54D26] transition-colors leading-snug">
                          {task.title}
                        </h4>

                        <p className="text-xs text-[#52525b] line-clamp-2 leading-relaxed font-sans">
                          {task.contextSummary}
                        </p>

                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {task.techStackTags.map((tag) => (
                            <span
                              key={tag}
                              className="font-sans text-[10px] font-medium bg-[#FAF7F2] px-2 py-0.5 rounded-md text-[#52525b] border border-[#EBE5DC]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Assignee & Git Branch */}
                        <div className="pt-2.5 border-t border-[#f4f4f5] flex items-center justify-between text-xs font-sans">
                          <div className="flex items-center gap-2 text-[#52525b]">
                            <img
                              src={task.assignee.avatar}
                              alt={task.assignee.name}
                              className="h-5 w-5 rounded-full object-cover border border-[#EBE5DC]"
                            />
                            <span className="text-[11px] font-medium truncate max-w-[100px]">
                              {task.assignee.name}
                            </span>
                          </div>

                          {task.branch && (
                            <span className="text-sky-700 bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
                              <GitBranch className="h-3 w-3" />
                              <span className="truncate max-w-[85px]">
                                {task.branch.replace('feature/', '').replace('fix/', '')}
                              </span>
                            </span>
                          )}
                        </div>

                        {/* Quick Step Buttons */}
                        <div className="flex items-center justify-end gap-1 pt-1 border-t border-dashed border-[#f4f4f5]">
                          {col.id !== 'todo' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const prevStatus: Record<DevTask['status'], DevTask['status']> = {
                                  'in-progress': 'todo',
                                  review: 'in-progress',
                                  done: 'review',
                                  todo: 'todo',
                                };
                                updateTaskStatus(task.id, prevStatus[task.status]);
                                showToast(`Moved back to ${prevStatus[task.status]}`, 'info');
                              }}
                              className="text-[10px] font-sans font-medium text-[#71717a] hover:text-[#18181b] px-2 py-0.5 rounded hover:bg-[#FAF7F2] cursor-pointer"
                            >
                              ← Move back
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextStatus: Record<DevTask['status'], DevTask['status']> = {
                                  todo: 'in-progress',
                                  'in-progress': 'review',
                                  review: 'done',
                                  done: 'done',
                                };
                                updateTaskStatus(task.id, nextStatus[task.status]);
                                showToast(`Moved forward to ${nextStatus[task.status]}`, 'success');
                              }}
                              className="text-[10px] font-sans font-bold text-[#E54D26] hover:text-[#C2410C] px-2 py-0.5 rounded hover:bg-[#FFF0EC] flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>Next</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete task ${task.taskCode}?`)) {
                                deleteDevTask(task.id);
                              }
                            }}
                            className="text-[10px] font-sans font-medium text-[#a1a1aa] hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 cursor-pointer ml-auto"
                            title="Delete task"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      {selectedTaskForModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTaskForModal(null)}
          title={`${selectedTaskForModal.taskCode}: ${selectedTaskForModal.title}`}
          subtitle={selectedTaskForModal.requirementTitle}
        >
          <div className="space-y-5 font-sans">
            <div className="flex items-center justify-between border-b border-[#EBE5DC] pb-3">
              <div className="flex items-center gap-2">
                <StatusBadge label={selectedTaskForModal.status} variant="neutral" dot={true} />
                <StatusBadge
                  label={selectedTaskForModal.priority}
                  variant={selectedTaskForModal.priority === 'P0' ? 'red' : 'amber'}
                  dot={true}
                />
              </div>
              <span className="text-xs text-[#71717a]">
                Assigned to: <strong className="text-[#18181b]">{selectedTaskForModal.assignee.name}</strong>
              </span>
            </div>

            {/* Why Am I Doing This? (Project Memory Rationale) */}
            {selectedTaskForModal.whyItExists && (
              <div className="rounded-xl bg-[#FFF8F5] border border-[#FFD6CC] p-4 space-y-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6039] flex items-center gap-1.5">
                  <BrainCircuit className="h-3.5 w-3.5" />
                  Why am I doing this? (Rationale Chain)
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#18181b] leading-relaxed">
                  {selectedTaskForModal.whyItExists}
                </p>
                <div className="pt-2 border-t border-[#FFD6CC] flex flex-wrap items-center gap-3 text-xs">
                  {selectedTaskForModal.relatedDecisionCode && (
                    <button
                      onClick={() => {
                        setSelectedTaskForModal(null);
                        setActiveSection('decisions');
                      }}
                      className="inline-flex items-center gap-1 font-bold text-[#FF6039] hover:underline cursor-pointer"
                    >
                      <span>Related Decision: {selectedTaskForModal.relatedDecisionCode}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                  {selectedTaskForModal.relatedMeetingTitle && (
                    <button
                      onClick={() => {
                        setSelectedTaskForModal(null);
                        setActiveSection('meetings');
                      }}
                      className="inline-flex items-center gap-1 font-medium text-[#71717a] hover:text-[#18181b] hover:underline cursor-pointer"
                    >
                      <span>Originating Sync: {selectedTaskForModal.relatedMeetingTitle}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#71717a] block mb-1">
                Context & Requirements:
              </span>
              <p className="text-xs sm:text-sm text-[#3f3f46] leading-relaxed bg-[#FAF7F2] p-4 rounded-xl border border-[#EBE5DC]">
                {selectedTaskForModal.contextSummary}
              </p>
            </div>

            {selectedTaskForModal.branch && (
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EBE5DC] flex items-center justify-between text-xs font-sans">
                <span className="text-[#71717a]">Git Branch:</span>
                <span className="text-sky-700 font-semibold flex items-center gap-1.5">
                  <GitBranch className="h-4 w-4" />
                  {selectedTaskForModal.branch}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#EBE5DC]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedTaskForModal(null);
                    setActiveSection('prompts');
                  }}
                  className="flex items-center gap-1.5 text-xs text-[#E54D26] hover:underline font-semibold cursor-pointer"
                >
                  <Zap className="h-4 w-4 text-[#FF6039]" />
                  <span>Developer Prompts</span>
                </button>
                <MemoryTrigger entityType="task" entityId={selectedTaskForModal.id} variant="button" label="Why this changed" />
              </div>

              <button
                onClick={() => setSelectedTaskForModal(null)}
                className="btn-secondary-dark"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* New Task Modal */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        title="Create New Sprint Task"
        subtitle="Add a task to the board with linked requirements."
      >
        <form onSubmit={handleCreateTask} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement Google Pay fallback recovery loop"
              className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs sm:text-sm text-[#18181b] focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as PriorityType)}
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] focus:border-[#FF6039] focus:outline-none"
              >
                <option value="P0">P0 - Critical</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Medium</option>
                <option value="P3">P3 - Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Tech Stack
              </label>
              <input
                type="text"
                value={taskTags}
                onChange={(e) => setTaskTags(e.target.value)}
                placeholder="React, TypeScript, Redis"
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] focus:border-[#FF6039] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
              Context & Notes
            </label>
            <textarea
              rows={3}
              value={taskContext}
              onChange={(e) => setTaskContext(e.target.value)}
              placeholder="Describe requirements and what needs to be verified..."
              className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs sm:text-sm text-[#18181b] focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#EBE5DC] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setNewTaskModalOpen(false)}
              className="btn-secondary-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-orange"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
