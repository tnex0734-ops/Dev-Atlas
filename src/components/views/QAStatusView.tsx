import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ArrowRight,
  AlertTriangle,
  Play,
  RotateCw,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { QATestCase } from '../../types';

export const QAStatusView: React.FC = () => {
  const { qaTestCases, toggleQATest, setActiveSection, metrics } = useProject();
  const [filterType, setFilterType] = useState<string>('All');

  const types = ['All', 'Automated E2E', 'Integration Unit', 'Manual Exploratory', 'Performance Load'];

  const filteredTests = qaTestCases.filter(
    (tc) => filterType === 'All' || tc.type === filterType
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Acceptance Test Matrix
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Automated E2E and exploratory test cases mapped 1-to-1 against PRD acceptance criteria numbers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-[6px] bg-[#fafafa] px-3.5 py-1.5 border border-[#ebebeb] font-mono text-xs">
            <span className="text-[#8f8f8f]">Pass Rate:</span>
            <span className="font-bold text-[#047857]">{metrics.qaPassRate}%</span>
          </div>
          <button
            onClick={() => setActiveSection('release-readiness')}
            className="flex items-center gap-2 rounded-[6px] bg-[#171717] px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-[#333333] transition-all shadow-[0px_1px_2px_rgba(0,0,0,0.08)]"
          >
            <span>Release Readiness Gate</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all ${
              filterType === t
                ? 'bg-[#171717] text-white font-medium shadow-sm'
                : 'bg-white text-[#8f8f8f] hover:text-[#171717] border border-[#ebebeb]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Test Cases Table / Cards */}
      <div className="space-y-4">
        {filteredTests.map((tc) => {
          const isPassed = tc.status === 'Passed';

          return (
            <div
              key={tc.id}
              className={`rounded-[12px] border bg-white p-5 sm:p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] transition-all ${
                isPassed
                  ? 'border-[#ebebeb] hover:border-[#171717]'
                  : 'border-[#fecaca] bg-[#fff5f5]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                      {tc.testCode}
                    </span>
                    <span className="font-mono text-xs text-[#8f8f8f]">
                      Mapped to {tc.requirementCode} (Criterion #{tc.acceptanceCriteriaIndex + 1})
                    </span>
                    <StatusBadge label={tc.type} variant="neutral" size="sm" />
                    <StatusBadge
                      label={tc.status}
                      variant={isPassed ? 'green' : 'red'}
                      size="sm"
                      dot
                    />
                  </div>

                  <h3 className="font-sans font-semibold text-base sm:text-lg text-[#171717]">
                    {tc.title}
                  </h3>

                  {tc.errorMessage && (
                    <div className="p-3 rounded-[6px] bg-[#fef2f2] border border-[#fecaca] text-xs font-mono text-[#ee0000] flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#ee0000] shrink-0 mt-0.5" />
                      <span>{tc.errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* Right controls: Execution details & Pass/Fail Toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0 font-mono text-xs">
                  <div className="text-[#8f8f8f] text-right sm:text-left">
                    <div>Duration: <span className="text-[#171717] font-medium">{tc.durationMs}ms</span></div>
                    <div>Assigned QA: <span className="text-[#171717] font-medium">{tc.assignedQA}</span></div>
                    <div className="text-[10px] text-[#8f8f8f]">Last Run: {tc.lastRun}</div>
                  </div>

                  <button
                    onClick={() => toggleQATest(tc.id)}
                    className={`flex items-center gap-1.5 rounded-[6px] px-3.5 py-1.5 text-xs font-medium font-mono transition-all border ${
                      isPassed
                        ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0] hover:bg-[#fee2e2] hover:text-[#ee0000] hover:border-[#fecaca]'
                        : 'bg-[#fef2f2] text-[#ee0000] border-[#fecaca] hover:bg-[#d1fae5] hover:text-[#047857] hover:border-[#a7f3d0]'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <span>{isPassed ? 'Passed (Click to Fail)' : 'Failed (Click to Pass)'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
