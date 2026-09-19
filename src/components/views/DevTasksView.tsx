import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  GitBranch,
  ExternalLink,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { MemoryTrigger } from '../memory/MemoryTrigger';
import { RoleMemoryWidget } from '../memory/RoleMemoryWidget';
import { DevTask, PriorityType } from '../../types';

export const DevTasksView: React.FC = () => {
  const { devTasks, updateTaskStatus, createDevTask, setActiveSection } = useProject();
  const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<DevTask | null>(null);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskRequirementTitle, setTaskRequirementTitle] = useState('Core Architecture Engine');
  const [taskPriority, setTaskPriority] = useState<PriorityType>('P0');
  const [taskContext, setTaskContext] = useState('');
  const [taskTags, setTaskTags] = useState('TypeScript, React, Node.js');

  const columns: Array<{ id: DevTask['status']; label: string; countColor: string }> = [
    { id: 'todo', label: 'TODO', countColor: 'text-[#8f8f8f]' },
    { id: 'in-progress', label: 'IN PROGRESS', countColor: 'text-[#ab570a]' },
    { id: 'review', label: 'CODE REVIEW', countColor: 'text-[#7928ca]' },
    { id: 'done', label: 'DONE / VERIFIED', countColor: 'text-[#047857]' },
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
      contextSummary: taskContext || 'Follow project architecture and PRD acceptance criteria.',
      techStackTags: taskTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewTaskModalOpen(false);
    setTaskTitle('');
    setTaskContext('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Developer Kanban Execution Board
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Sprint tasks backed by injected Context Blocks, PRD acceptance criteria, and linked Git branches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('prompts')}
            className="flex items-center gap-1.5 rounded-[6px] border border-[#ebebeb] bg-white px-3 py-1.5 text-xs font-mono font-medium text-[#171717] hover:bg-[#fafafa]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#f5a623]" />
            <span>Generate Prompt</span>
          </button>
          <button
            onClick={() => setNewTaskModalOpen(true)}
            className="flex items-center gap-1.5 rounded-[6px] bg-[#171717] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Role Memory: Engineering & Architecture Decisions */}
      <RoleMemoryWidget role="dev" />

      {/* 4-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = devTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="rounded-[12px] border border-[#ebebeb] bg-[#fafafa] p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3 mb-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#171717]">
                  {col.label}
                </span>
                <span className={`font-mono text-xs font-bold ${col.countColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks in column */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-[#ebebeb] rounded-[8px] flex flex-col items-center justify-center text-center p-3">
                    <span className="text-[11px] text-[#a1a1a1] font-mono">No tasks in {col.label}</span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskForModal(task)}
                    className="rounded-[8px] border border-[#ebebeb] bg-white p-4 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] hover:border-[#171717] hover:shadow-[0px_2px_4px_rgba(0,0,0,0.06)] transition-all cursor-pointer space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                          {task.taskCode}
                        </span>
                        <StatusBadge label={task.priority} variant={task.priority === 'P0' ? 'red' : 'amber'} size="sm" />
                      </div>
                      <MemoryTrigger entityType="task" entityId={task.id} variant="compact" />
                    </div>

                    <h4 className="font-sans font-semibold text-sm text-[#171717] group-hover:text-[#0070f3] transition-colors">
                      {task.title}
                    </h4>

                    <p className="text-xs text-[#4d4d4d] line-clamp-2 leading-relaxed">
                      {task.contextSummary}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-1">
                      {task.techStackTags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] bg-[#fafafa] px-1.5 py-0.5 rounded-[4px] text-[#8f8f8f] border border-[#ebebeb]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Assignee and Branch */}
                    <div className="pt-2 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-1.5 text-[#4d4d4d]">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="h-5 w-5 rounded-full object-cover border border-[#ebebeb]"
                        />
                        <span className="text-[11px] truncate max-w-[100px]">{task.assignee.name}</span>
                      </div>

                      {task.branch && (
                        <span className="text-[#0070f3] text-[10px] flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          <span className="truncate max-w-[90px]">{task.branch.replace('feature/', '').replace('fix/', '')}</span>
                        </span>
                      )}
                    </div>

                    {/* Status Mover Buttons */}
                    <div className="flex items-center justify-end gap-1 pt-1">
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
                          }}
                          className="text-[10px] font-mono text-[#8f8f8f] hover:text-[#171717] px-1.5 py-0.5 rounded-[4px] hover:bg-[#fafafa]"
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
                          }}
                          className="text-[10px] font-mono text-[#171717] font-semibold hover:text-[#0070f3] px-1.5 py-0.5 rounded-[4px] hover:bg-[#fafafa] flex items-center gap-0.5"
                        >
                          <span>Advance</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  )))}
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
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#ebebeb] pb-3">
              <div className="flex items-center gap-2">
                <StatusBadge label={selectedTaskForModal.status.toUpperCase()} variant="neutral" />
                <StatusBadge label={selectedTaskForModal.priority} variant={selectedTaskForModal.priority === 'P0' ? 'red' : 'amber'} />
              </div>
              <span className="font-mono text-xs text-[#8f8f8f]">
                Assignee: {selectedTaskForModal.assignee.name} ({selectedTaskForModal.assignee.role})
              </span>
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#ab570a] font-semibold block mb-1">
                Context & Rationale:
              </span>
              <p className="text-xs sm:text-sm text-[#4d4d4d] leading-relaxed bg-[#fafafa] p-4 rounded-[8px] border border-[#ebebeb]">
                {selectedTaskForModal.contextSummary}
              </p>
            </div>

            {selectedTaskForModal.branch && (
              <div className="p-3 rounded-[8px] bg-[#fafafa] border border-[#ebebeb] flex items-center justify-between text-xs font-mono">
                <span className="text-[#8f8f8f]">Git Branch:</span>
                <span className="text-[#0070f3] font-medium flex items-center gap-1">
                  <GitBranch className="h-3.5 w-3.5" />
                  {selectedTaskForModal.branch}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#ebebeb]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedTaskForModal(null);
                    setActiveSection('prompts');
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-[#0070f3] hover:underline"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Inject into AI Prompt Generator</span>
                </button>
                <MemoryTrigger entityType="task" entityId={selectedTaskForModal.id} variant="button" label="Why this changed" />
              </div>

              <button
                onClick={() => setSelectedTaskForModal(null)}
                className="rounded-[6px] bg-[#171717] px-4 py-2 text-xs font-medium text-white hover:bg-[#333333]"
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
        title="Create New Sprint Engineering Task"
        subtitle="Tasks link directly to PRDs and architecture memory."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement Google Pay fallback recovery loop"
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Parent Requirement
              </label>
              <input
                type="text"
                value={taskRequirementTitle}
                onChange={(e) => setTaskRequirementTitle(e.target.value)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as any)}
                className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
              >
                <option value="P0">P0 - Blocker</option>
                <option value="P1">P1 - High</option>
                <option value="P2">P2 - Normal</option>
                <option value="P3">P3 - Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Architectural Context & Instructions
            </label>
            <textarea
              rows={3}
              value={taskContext}
              onChange={(e) => setTaskContext(e.target.value)}
              placeholder="Provide exact state transitions, null-check requirements, or token guidelines..."
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs sm:text-sm text-[#171717] focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#8f8f8f] uppercase tracking-wider mb-1">
              Tech Stack Tags (Comma separated)
            </label>
            <input
              type="text"
              value={taskTags}
              onChange={(e) => setTaskTags(e.target.value)}
              className="w-full rounded-[6px] border border-[#ebebeb] bg-[#fafafa] p-2.5 text-xs text-[#171717] font-mono focus:border-[#171717] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setNewTaskModalOpen(false)}
              className="rounded-[6px] border border-[#ebebeb] bg-white px-4 py-2 text-xs text-[#4d4d4d] hover:bg-[#fafafa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[6px] bg-[#171717] px-5 py-2 text-xs font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
            >
              Create Sprint Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
