import React from 'react';
import {
  BrainCircuit,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';

export const InsightsView: React.FC = () => {
  const { strategicInsights, setActiveSection } = useProject();

  const categoryIcons = {
    'Behavior Shift': <TrendingUp className="h-5 w-5 text-[#047857]" />,
    'UX Opportunity': <Sparkles className="h-5 w-5 text-[#ab570a]" />,
    'Competitive Threat': <Compass className="h-5 w-5 text-[#0070f3]" />,
    'Technical Debt': <ShieldAlert className="h-5 w-5 text-[#ee0000]" />,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Strategic AI Insights
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Cognitive synthesis of telemetry patterns, UX friction signals, and competitive dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge label="Predictive Synthesis Engine" variant="neutral" dot />
        </div>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {strategicInsights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                    {categoryIcons[insight.category]}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#171717]">
                    {insight.category}
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8f8f8f]">{insight.date}</span>
              </div>

              <h3 className="mt-4 font-sans font-semibold text-lg text-[#171717] leading-snug">
                {insight.headline}
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
                {insight.description}
              </p>

              {/* Impact & Confidence Scores */}
              <div className="mt-5 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                  <span className="text-[#8f8f8f] block text-[10px]">IMPACT POTENTIAL</span>
                  <span className="text-[#171717] font-bold text-sm">{insight.impactScore}/100</span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-[#fafafa] border border-[#ebebeb]">
                  <span className="text-[#8f8f8f] block text-[10px]">AI CONFIDENCE</span>
                  <span className="text-[#047857] font-bold text-sm">{insight.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#f2f2f2]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8f8f8f] block mb-1 font-semibold">
                Recommended Initiative:
              </span>
              <p className="text-xs text-[#171717] font-medium">
                {insight.recommendedInitiative}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
