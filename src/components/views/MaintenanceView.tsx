import React from 'react';
import {
  Database,
  Calendar,
  Clock,
  CheckCircle2,
  HardDrive,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const MaintenanceView: React.FC = () => {
  const { maintenanceTasks } = useProject();

  const categoryIcons = {
    Database: <Database className="h-4 w-4 text-[#0070f3]" />,
    Cache: <Cpu className="h-4 w-4 text-[#ab570a]" />,
    'Edge CDN': <HardDrive className="h-4 w-4 text-[#047857]" />,
    Security: <CheckCircle2 className="h-4 w-4 text-[#7928ca]" />,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              System Maintenance & Operations
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Scheduled maintenance windows, Redis cache key purges, PostgreSQL query re-indexing, and Edge SSL cert cycles.
          </p>
        </div>
      </div>

      {/* Maintenance Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maintenanceTasks.map((task) => {
          const statusVariants = {
            Scheduled: 'neutral',
            Running: 'amber',
            Completed: 'green',
          } as const;

          return (
            <div
              key={task.id}
              className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all space-y-4"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                      {categoryIcons[task.category]}
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#171717]">
                      {task.category}
                    </span>
                  </div>
                  <StatusBadge
                    label={task.status}
                    variant={statusVariants[task.status]}
                    size="sm"
                    dot={task.status === 'Running'}
                  />
                </div>

                <h3 className="mt-3 font-sans font-semibold text-base text-[#171717]">
                  {task.title}
                </h3>

                <div className="mt-4 space-y-2 text-xs font-mono text-[#4d4d4d]">
                  <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                    <span className="text-[#8f8f8f]">Next Run / Window:</span>
                    <span className="text-[#171717] font-medium">{task.nextRun}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                    <span className="text-[#8f8f8f]">Est. Duration:</span>
                    <span className="text-[#ab570a] font-medium">{task.estimatedDuration}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#f2f2f2] text-xs font-mono text-[#8f8f8f] flex items-center justify-between">
                <span>Lead: {task.responsibleEngineer}</span>
                <span className="text-[#047857] font-medium">Zero Downtime Guaranteed</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
