import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { RequirementStage } from '../../types';

export const FeaturesView: React.FC = () => {
  const { features, setActiveSection } = useProject();
  const [filterStage, setFilterStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const stages: Array<'All' | RequirementStage> = [
    'All',
    'Discovery',
    'In Design',
    'In Development',
    'Ready for QA',
    'Shipped',
  ];

  const filteredFeatures = features.filter((feat) => {
    const matchesStage = filterStage === 'All' || feat.stage === filterStage;
    const matchesSearch =
      feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.featureCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ebebeb] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#171717]" />
            <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-[-1.28px] text-[#171717]">
              Features Master Directory
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#4d4d4d]">
            Inventory of all platform capabilities mapped across lifecycle stages from discovery to shipped production.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8f8f8f]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features, codes, categories..."
            className="w-full rounded-[6px] border border-[#ebebeb] bg-white pl-9 pr-4 py-2 text-xs sm:text-sm text-[#171717] placeholder-[#8f8f8f] focus:border-[#171717] focus:outline-none"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStage(st)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                filterStage === st
                  ? 'bg-[#171717] text-white font-medium shadow-sm'
                  : 'bg-white text-[#8f8f8f] hover:text-[#171717] border border-[#ebebeb]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFeatures.map((feat) => {
          const stageVariants: Record<RequirementStage, 'neutral' | 'purple' | 'amber' | 'blue' | 'green'> = {
            Discovery: 'neutral',
            'In Design': 'purple',
            'In Development': 'amber',
            'Ready for QA': 'blue',
            Shipped: 'green',
          };

          return (
            <div
              key={feat.id}
              className="rounded-[12px] border border-[#ebebeb] bg-white p-6 shadow-[0px_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between hover:border-[#a1a1a1] transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#f2f2f2] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#171717] bg-[#f5f5f5] px-2 py-0.5 rounded-[4px] border border-[#ebebeb]">
                      {feat.featureCode}
                    </span>
                    <span className="text-xs font-mono text-[#8f8f8f]">{feat.category}</span>
                  </div>
                  <StatusBadge label={feat.stage} variant={stageVariants[feat.stage]} size="sm" dot />
                </div>

                <h3 className="mt-3 font-sans font-semibold text-lg text-[#171717]">
                  {feat.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-[#4d4d4d] leading-relaxed">
                  {feat.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#8f8f8f]">Implementation Progress</span>
                    <span className="font-bold text-[#171717]">{feat.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#ebebeb] overflow-hidden">
                    <div
                      className="h-full bg-[#171717] rounded-full"
                      style={{ width: `${feat.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#f2f2f2] flex items-center justify-between text-xs font-mono">
                <div className="text-[#8f8f8f]">
                  Owner: <span className="text-[#171717] font-medium">{feat.owner}</span> • Target: <span className="text-[#171717] font-medium">{feat.targetVersion}</span>
                </div>
                <button
                  onClick={() => setActiveSection('requirements')}
                  className="flex items-center gap-1 text-[#0070f3] hover:underline font-semibold"
                >
                  <span>{feat.associatedPRD}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
