import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Star,
  ThumbsUp,
  Plus,
  Smartphone,
  Globe,
  Sparkles,
  Copy,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { useProject } from '../../context/ProjectContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { IconBadge3D } from '../common/IconBadge3D';
import { SentimentType, PlatformType, FeedbackItem } from '../../types';
import {
  BrandLogo,
  GooglePlayLogo,
  RedditLogo,
  AppStoreLogo,
  DiscordLogo,
  GitHubLogo,
  SupportDeskLogo,
  SurveyLogo,
  AllChannelsLogo,
  AndroidLogo,
  AppleLogo,
} from '../common/BrandLogos';

export const FeedbackHubView: React.FC = () => {
  const { feedback, upvoteFeedback, addFeedbackItem, setActiveSection, addPRD, showToast } = useProject();

  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [selectedFeedbackForInspection, setSelectedFeedbackForInspection] = useState<FeedbackItem | null>(null);

  // New feedback form state
  const [newComment, setNewComment] = useState('');
  const [newUserHandle, setNewUserHandle] = useState('@mobile_tester');
  const [newSource, setNewSource] = useState<any>('Google Play');
  const [newSentiment, setNewSentiment] = useState<SentimentType>('negative');
  const [newPlatform, setNewPlatform] = useState<PlatformType>('Android');
  const [newRating, setNewRating] = useState(5);

  const sources = [
    'All',
    'Google Play',
    'Reddit',
    'App Store',
    'GitHub Issues',
    'Discord',
    'Support Desk',
    'User Survey',
  ];

  const playStoreReviews = feedback.filter((f) => f.source === 'Google Play');
  const redditReviews = feedback.filter((f) => f.source === 'Reddit');
  const appStoreReviews = feedback.filter((f) => f.source === 'App Store');

  const avgPlayStoreRating = playStoreReviews.length > 0
    ? (playStoreReviews.reduce((sum, f) => sum + (f.rating || 0), 0) / playStoreReviews.length).toFixed(1)
    : '4.8';

  const avgAppStoreRating = appStoreReviews.length > 0
    ? (appStoreReviews.reduce((sum, f) => sum + (f.rating || 0), 0) / appStoreReviews.length).toFixed(1)
    : '5.0';

  const filteredFeedback = feedback.filter((item) => {
    const matchesSource = selectedSource === 'All' || item.source === selectedSource;
    const matchesSentiment = selectedSentiment === 'All' || item.sentiment === selectedSentiment;
    const matchesPlatform = selectedPlatform === 'All' || item.platform === selectedPlatform;
    const matchesSearch =
      item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.aiSummary && item.aiSummary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.productArea && item.productArea.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSource && matchesSentiment && matchesPlatform && matchesSearch;
  });

  // Bar Graph Data: Reviews & Impact by Channel
  const channelBarData = [
    { channel: 'Google Play', reviews: playStoreReviews.length || 4, severity: 92 },
    { channel: 'Reddit', reviews: redditReviews.length || 4, severity: 74 },
    { channel: 'App Store', reviews: appStoreReviews.length || 1, severity: 65 },
    { channel: 'GitHub', reviews: feedback.filter((f) => f.source.includes('GitHub')).length || 2, severity: 80 },
    { channel: 'Discord', reviews: feedback.filter((f) => f.source === 'Discord').length || 1, severity: 55 },
  ];

  // Circle / Donut Graph Data: Customer Sentiment
  const sentimentDistribution = [
    { name: 'Positive Reviews', value: feedback.filter((f) => f.sentiment === 'positive').length || 9, color: '#10B981' },
    { name: 'Neutral Questions', value: feedback.filter((f) => f.sentiment === 'neutral').length || 1, color: '#F59E0B' },
    { name: 'Critical Issues', value: feedback.filter((f) => f.sentiment === 'negative').length || 2, color: '#FF6039' },
  ];

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-[#18181b]/95 backdrop-blur-md border border-white/10 px-3.5 py-2.5 text-white shadow-xl text-xs space-y-1 font-sans">
          <p className="font-semibold text-[#FF6039]">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-[11px]">
              <span className="text-zinc-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                {entry.name}:
              </span>
              <span className="font-semibold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addFeedbackItem({
      source: newSource,
      userHandle: newUserHandle,
      comment: newComment,
      sentiment: newSentiment,
      platform: newPlatform,
      rating: newRating,
      appVersion: 'v1.4.0',
      aiSummary: `User reported ${newSentiment} issue on ${newPlatform} via ${newSource}.`,
      aiKeyTakeaway: newComment.length > 90 ? newComment.slice(0, 90) + '...' : newComment,
      aiRecommendedAction: newSentiment === 'negative' ? 'Inspect error trace and schedule hotfix review.' : 'Acknowledge positive user sentiment.',
      severity: newSentiment === 'negative' ? 'high' : 'low',
      impactScore: newSentiment === 'negative' ? 78 : 50,
      affectedUsersEstimate: 60,
      productArea: newPlatform === 'Android' ? 'Android Mobile App' : newPlatform === 'iOS' ? 'iOS Mobile App' : 'Web App',
      tags: ['Live Review', newPlatform, newSource],
    });

    setAddModalOpen(false);
    setNewComment('');
    showToast(`Saved feedback from ${newSource}!`, 'success');
  };

  const handlePromoteToPRD = (item: FeedbackItem) => {
    addPRD({
      reqCode: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      title: item.aiSummary || `Address Feedback: ${item.userHandle}`,
      problemStatement: `User feedback from ${item.source} (${item.userHandle}): "${item.comment}". Root Cause: ${item.aiKeyTakeaway || 'Investigate reported behavior.'}`,
      businessImpact: `Severity: ${item.severity || 'Medium'}. Affects ~${item.affectedUsersEstimate || 50} users. Impact score: ${item.impactScore || 75}/100.`,
      userStories: [
        `As a user on ${item.platform}, I need ${item.aiSummary || 'the reported issue resolved'} so that I can reliably use the application.`,
      ],
      acceptanceCriteria: [
        `Resolve root cause: ${item.aiKeyTakeaway || item.aiSummary || item.comment}`,
        `Verify zero regressions on ${item.platform} under production conditions`,
        `Pass automated tests and release checks`,
      ],
      priority: item.severity === 'critical' ? 'P0' : item.severity === 'high' ? 'P1' : 'P2',
      targetRelease: 'v1.4.1',
      stage: 'Discovery',
      leadPM: 'Alex Thorne',
      leadDesigner: 'Maya Lin',
      leadDev: 'Dev Squad Alpha',
      originFeedbackCount: 1,
    });
    showToast(`Promoted feedback to PRD Requirement!`, 'success');
    setSelectedFeedbackForInspection(null);
    setActiveSection('requirements');
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'Google Play':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
            <GooglePlayLogo className="h-3.5 w-3.5 shrink-0" />
            <span>Google Play</span>
          </span>
        );
      case 'Reddit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-orange-50 text-[#C2410C] border border-orange-200/80 shadow-2xs">
            <RedditLogo className="h-3.5 w-3.5 shrink-0" />
            <span>Reddit</span>
          </span>
        );
      case 'App Store':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-sky-50 text-sky-800 border border-sky-200/80 shadow-2xs">
            <AppStoreLogo className="h-3.5 w-3.5 shrink-0" />
            <span>App Store</span>
          </span>
        );
      case 'Discord':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-indigo-50 text-indigo-800 border border-indigo-200/80 shadow-2xs">
            <DiscordLogo className="h-3.5 w-3.5 shrink-0" />
            <span>Discord</span>
          </span>
        );
      case 'GitHub Issues':
      case 'GitHub':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-zinc-100 text-zinc-900 border border-zinc-200/80 shadow-2xs">
            <GitHubLogo className="h-3.5 w-3.5 shrink-0" />
            <span>GitHub</span>
          </span>
        );
      case 'Support Desk':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs">
            <SupportDeskLogo className="h-3.5 w-3.5 shrink-0" />
            <span>Support</span>
          </span>
        );
      case 'User Survey':
      case 'Surveys':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-purple-50 text-purple-800 border border-purple-200/80 shadow-2xs">
            <SurveyLogo className="h-3.5 w-3.5 shrink-0" />
            <span>Surveys</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/80 shadow-2xs">
            <AllChannelsLogo className="h-3.5 w-3.5 shrink-0" />
            <span>{source}</span>
          </span>
        );
    }
  };

  const getItemRadarData = (item: FeedbackItem) => [
    { subject: 'Severity', value: item.severity === 'critical' ? 95 : item.severity === 'high' ? 80 : 50, fullMark: 100 },
    { subject: 'Blast Radius', value: Math.min(100, Math.round((item.affectedUsersEstimate || 50) / 4.2)), fullMark: 100 },
    { subject: 'Friction', value: item.impactScore || 70, fullMark: 100 },
    { subject: 'Blocker Risk', value: item.severity === 'critical' ? 100 : item.severity === 'high' ? 75 : 40, fullMark: 100 },
    { subject: 'Upvotes', value: Math.min(100, (item.upvotes || 10) * 1.4), fullMark: 100 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EBE5DC] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <IconBadge3D
              icon={<MessageSquare className="h-5 w-5 text-white" />}
              color="orange"
              size="md"
            />
            <div>
              <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
                Customer Reviews & Feedback
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-[#71717a] font-sans">
                Real-time reviews and discussions across Google Play, Reddit, App Store, and GitHub.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveSection('user-issues')}
            className="btn-secondary-dark"
          >
            <span>View Problem Clusters</span>
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="btn-primary-orange"
          >
            <Plus className="h-4 w-4" />
            <span>Ingest Feedback</span>
          </button>
        </div>
      </div>

      {/* Top Channel KPI Cards (No graphs, clean metrics & strong hover states) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Google Play */}
        <div
          onClick={() => setSelectedSource(selectedSource === 'Google Play' ? 'All' : 'Google Play')}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
            selectedSource === 'Google Play'
              ? 'border-[#FF6039] bg-[#FFF9F6] shadow-sm ring-2 ring-[#FF6039]/30'
              : 'border-[#EBE5DC] bg-white hover:border-[#FF6039]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/80 p-1.5 shadow-2xs">
                <GooglePlayLogo className="h-5 w-5" />
              </div>
              <div>
                <span className="font-sans text-xs font-bold text-[#18181b] block">Google Play</span>
                <span className="text-[11px] text-[#71717a] font-sans">Android Vitals</span>
              </div>
            </div>
            <span className="font-sans text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
              {playStoreReviews.length} Reviews
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-sans text-[#18181b]">{avgPlayStoreRating}</span>
              <span className="flex text-amber-500 text-sm">★★★★★</span>
            </div>
            <span className="text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Stable
            </span>
          </div>
          <p className="mt-2 text-xs text-[#71717a] font-sans">
            Crash vitals & rating reviews
          </p>
        </div>

        {/* Reddit */}
        <div
          onClick={() => setSelectedSource(selectedSource === 'Reddit' ? 'All' : 'Reddit')}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
            selectedSource === 'Reddit'
              ? 'border-[#FF6039] bg-[#FFF9F6] shadow-sm ring-2 ring-[#FF6039]/30'
              : 'border-[#EBE5DC] bg-white hover:border-[#FF6039]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 border border-orange-200/80 p-1 shadow-2xs">
                <RedditLogo className="h-6 w-6" />
              </div>
              <div>
                <span className="font-sans text-xs font-bold text-[#18181b] block">Reddit</span>
                <span className="text-[11px] text-[#71717a] font-sans">Discussions</span>
              </div>
            </div>
            <span className="font-sans text-xs font-semibold bg-orange-50 text-[#C2410C] px-2.5 py-0.5 rounded-full border border-orange-200/80">
              {redditReviews.length} Posts
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-sans text-[#18181b]">
                {redditReviews.reduce((sum, r) => sum + (r.upvotes || 0), 0)}
              </span>
              <span className="text-xs font-sans text-[#71717a]">Upvotes</span>
            </div>
            <span className="text-[11px] font-sans font-semibold text-[#C2410C] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
              High Resonance
            </span>
          </div>
          <p className="mt-2 text-xs text-[#71717a] font-sans">
            r/AndroidDev & r/reactnative
          </p>
        </div>

        {/* App Store */}
        <div
          onClick={() => setSelectedSource(selectedSource === 'App Store' ? 'All' : 'App Store')}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
            selectedSource === 'App Store'
              ? 'border-[#FF6039] bg-[#FFF9F6] shadow-sm ring-2 ring-[#FF6039]/30'
              : 'border-[#EBE5DC] bg-white hover:border-[#FF6039]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 border border-sky-200/80 p-1 shadow-2xs">
                <AppStoreLogo className="h-6 w-6" />
              </div>
              <div>
                <span className="font-sans text-xs font-bold text-[#18181b] block">App Store</span>
                <span className="text-[11px] text-[#71717a] font-sans">iOS & iPadOS</span>
              </div>
            </div>
            <span className="font-sans text-xs font-semibold bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-200/80">
              {appStoreReviews.length} Reviews
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-sans text-[#18181b]">{avgAppStoreRating}</span>
              <span className="flex text-amber-500 text-sm">★★★★★</span>
            </div>
            <span className="text-[11px] font-sans font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
              5.0 Rating
            </span>
          </div>
          <p className="mt-2 text-xs text-[#71717a] font-sans">
            iOS 18 & stylus reviews
          </p>
        </div>

        {/* All Streams */}
        <div
          onClick={() => setSelectedSource('All')}
          className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
            selectedSource === 'All'
              ? 'border-[#FF6039] bg-[#FFF9F6] shadow-sm ring-2 ring-[#FF6039]/30'
              : 'border-[#EBE5DC] bg-white hover:border-[#FF6039]/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#18181b] p-1.5 shadow-2xs">
                <AllChannelsLogo className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-sans text-xs font-bold text-[#18181b] block">All Channels</span>
                <span className="text-[11px] text-[#71717a] font-sans">Unified Stream</span>
              </div>
            </div>
            <span className="font-sans text-xs font-semibold bg-[#18181b] text-white px-2.5 py-0.5 rounded-full">
              {feedback.length} Reviews
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-sans text-[#18181b]">
                {Math.round((feedback.filter((f) => f.sentiment === 'positive').length / (feedback.length || 1)) * 100)}%
              </span>
              <span className="text-xs font-sans font-medium text-emerald-700">Positive</span>
            </div>
            <span className="text-[11px] font-sans font-semibold text-[#E54D26] bg-[#FFF0EC] border border-[#FFD6CC] px-2 py-0.5 rounded-full">
              7 Channels
            </span>
          </div>
          <p className="mt-2 text-xs text-[#71717a] font-sans">
            Synthesized customer feedback
          </p>
        </div>
      </div>

      {/* Dual Analytics Section: Bar Graph (Left) & Circle Donut Graph (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Bar Graph */}
        <div className="col-span-12 lg:col-span-7 rounded-2xl border border-[#EBE5DC] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4f4f5]">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4.5 w-4.5 text-[#FF6039]" />
              <h2 className="font-sans text-sm sm:text-base font-bold text-[#18181b]">
                Reviews by Channel
              </h2>
            </div>
            <span className="text-xs text-[#71717a] font-sans">
              Feedback volume & impact score
            </span>
          </div>

          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={channelBarData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="channel" tick={{ fontSize: 11, fill: '#71717a' }} stroke="#EBE5DC" />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} stroke="#EBE5DC" />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="reviews" name="Review Count" fill="#FF6039" radius={[6, 6, 0, 0]} />
                <Bar dataKey="severity" name="Severity Score" fill="#18181B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Circle Graph */}
        <div className="col-span-12 lg:col-span-5 rounded-2xl border border-[#EBE5DC] bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4f4f5]">
            <div className="flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-emerald-600" />
              <h2 className="font-sans text-sm sm:text-base font-bold text-[#18181b]">
                Customer Sentiment
              </h2>
            </div>
            <span className="text-xs text-[#71717a] font-sans">
              12 total reviews
            </span>
          </div>

          <div className="my-2 h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={4}
                >
                  {sentimentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-sans text-[#18181b]">75%</span>
              <span className="text-[10px] font-sans font-medium text-emerald-700">Positive</span>
            </div>
          </div>

          <div className="space-y-1.5 font-sans pt-2 border-t border-[#f4f4f5]">
            {sentimentDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-[#FAF7F2] border border-[#EBE5DC]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[#18181b] font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-[#18181b]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source Channel Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-[#EBE5DC]">
        <span className="text-xs font-sans font-semibold text-[#71717a] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
          <span>Source:</span>
        </span>
        {sources.map((s) => {
          const count = s === 'All' ? feedback.length : feedback.filter((f) => f.source === s).length;
          const isSelected = selectedSource === s;
          return (
            <button
              key={s}
              onClick={() => setSelectedSource(s)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium border transition-all whitespace-nowrap shadow-2xs cursor-pointer ${
                isSelected
                  ? 'bg-[#18181b] text-white border-[#18181b] shadow-sm font-semibold'
                  : 'bg-white text-[#52525b] border-[#EBE5DC] hover:border-[#FF6039]/60 hover:text-[#18181b]'
              }`}
            >
              <BrandLogo source={s} className="h-4 w-4 shrink-0" />
              <span>{s}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans font-semibold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Sentiment/Platform Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#71717a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews, errors, handles (NullPointer, S24, Figma)..."
            className="w-full rounded-lg border border-[#EBE5DC] bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-[#18181b] placeholder-[#a1a1aa] focus:border-[#FF6039] focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sentiment Filter */}
          <div className="flex items-center rounded-lg bg-[#FAF7F2] p-1 border border-[#EBE5DC] text-xs">
            {['All', 'positive', 'neutral', 'negative'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSentiment(s)}
                className={`rounded-md px-3 py-1 capitalize font-sans transition-all cursor-pointer ${
                  selectedSentiment === s
                    ? 'bg-white text-[#18181b] font-bold shadow-2xs border border-[#EBE5DC]'
                    : 'text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Platform Filter */}
          <div className="flex items-center rounded-lg bg-[#FAF7F2] p-1 border border-[#EBE5DC] text-xs">
            {['All', 'Android', 'iOS', 'Web', 'Cross-Platform'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`rounded-md px-3 py-1 font-sans transition-all cursor-pointer ${
                  selectedPlatform === p
                    ? 'bg-white text-[#18181b] font-bold shadow-2xs border border-[#EBE5DC]'
                    : 'text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Showing count indicator & Hint */}
      <div className="flex items-center justify-between text-xs font-sans text-[#71717a]">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#18181b] font-semibold">{filteredFeedback.length}</strong> of{' '}
            {feedback.length} items
            {selectedSource !== 'All' && <span> • Filtered by <strong>{selectedSource}</strong></span>}
            {selectedSentiment !== 'All' && <span> • <strong>{selectedSentiment}</strong></span>}
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[#C2410C] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/80 font-medium">
            <Sparkles className="h-3 w-3 text-[#FF6039]" />
            <span>Click any card to inspect full review and impact details</span>
          </span>
        </div>
        {(selectedSource !== 'All' || selectedSentiment !== 'All' || selectedPlatform !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedSource('All');
              setSelectedSentiment('All');
              setSelectedPlatform('All');
              setSearchQuery('');
            }}
            className="text-[#FF6039] hover:underline font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Feedback Stream Grid - Impeccable AI-Summarized Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeedback.map((fb) => {
          const sentimentVariants: Record<SentimentType, 'green' | 'neutral' | 'red'> = {
            positive: 'green',
            neutral: 'neutral',
            negative: 'red',
          };

          return (
            <div
              key={fb.id}
              onClick={() => setSelectedFeedbackForInspection(fb)}
              className="group rounded-2xl border border-[#EBE5DC] bg-white p-5 flex flex-col justify-between hover:border-[#FF6039]/60 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer relative"
            >
              <div>
                {/* Card Header: User Avatar & Handle + Source Badge + Rating & Sentiment */}
                <div className="flex items-center justify-between border-b border-[#f4f4f5] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-[#18181b] flex items-center justify-center text-white text-xs font-bold font-sans shadow-2xs">
                      {fb.userHandle.replace(/^[@/]/, '').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-sans text-xs font-semibold text-[#18181b] block">
                        {fb.userHandle}
                      </span>
                    </div>
                    {getSourceBadge(fb.source)}
                  </div>

                  <div className="flex items-center gap-2">
                    {fb.rating && (
                      <div className="flex items-center text-amber-500 text-xs font-semibold font-sans">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span className="ml-1">{fb.rating}/5</span>
                      </div>
                    )}
                    <StatusBadge label={fb.sentiment} variant={sentimentVariants[fb.sentiment]} size="sm" dot={true} />
                  </div>
                </div>

                {/* Primary AI Problem Summary Block */}
                <div className="mt-3.5 rounded-xl bg-[#FFF9F6] border border-[#FFD6CC] p-3.5 group-hover:border-[#FF6039]/60 transition-all shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#E54D26]">
                      <Sparkles className="h-3.5 w-3.5 text-[#FF6039]" />
                      <span>AI Problem Summary</span>
                    </div>

                    {fb.severity && (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider flex items-center gap-1 ${
                          fb.severity === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/80'
                            : fb.severity === 'high'
                            ? 'bg-orange-50 text-[#C2410C] border border-orange-200/80'
                            : fb.severity === 'medium'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            fb.severity === 'critical'
                              ? 'bg-rose-500'
                              : fb.severity === 'high'
                              ? 'bg-orange-500'
                              : fb.severity === 'medium'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        {fb.severity === 'critical' ? 'P0 Blocker' : `${fb.severity} priority`}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold font-sans text-[#18181b] leading-relaxed">
                    {fb.aiSummary || fb.comment}
                  </p>

                  {fb.aiKeyTakeaway && (
                    <div className="mt-2.5 bg-white rounded-lg border border-[#FFD6CC]/80 p-2 text-xs font-sans text-[#3f3f46]">
                      <strong className="text-[#18181b] font-semibold">What happened: </strong>
                      <span>{fb.aiKeyTakeaway}</span>
                    </div>
                  )}

                  {/* Visual Impact Indicator Bar */}
                  <div className="mt-2.5 pt-2 border-t border-[#f4f4f5] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5 font-sans text-[11px] text-[#71717a]">
                      <span className="font-semibold text-[#18181b]">Impact:</span>
                      <span className="font-bold text-[#E54D26]">{fb.impactScore || 75}/100</span>
                    </div>
                    <div className="flex-1 max-w-[120px] bg-[#f4f4f5] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (fb.impactScore || 75) > 85
                            ? 'bg-[#E11D48]'
                            : 'bg-[#FF6039]'
                        }`}
                        style={{ width: `${fb.impactScore || 75}%` }}
                      />
                    </div>
                    <span className="font-sans text-[11px] font-medium text-[#71717a]">
                      ~{fb.affectedUsersEstimate || 50} users
                    </span>
                  </div>
                </div>

                {/* Verbatim Teaser */}
                <div className="mt-2.5 px-1 flex items-start gap-1.5 text-xs text-[#71717a] italic font-sans">
                  <span className="text-[#a1a1aa] font-serif text-sm leading-none shrink-0 select-none">“</span>
                  <p className="line-clamp-2 leading-relaxed">
                    {fb.comment}
                  </p>
                </div>

                {/* Domain & Platform Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5 px-1">
                  {fb.productArea && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF7F2] text-[11px] font-sans text-[#52525b] border border-[#EBE5DC]">
                      <Layers className="h-3 w-3 text-[#71717a]" />
                      {fb.productArea}
                    </span>
                  )}
                  {fb.tags && fb.tags.map((t) => (
                    <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white text-[10px] font-sans text-[#71717a] border border-[#EBE5DC]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-[#f4f4f5] flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2.5 text-[#71717a]">
                  <div className="flex items-center gap-1 font-semibold text-[#18181b]">
                    {fb.platform === 'Android' && <AndroidLogo className="h-3.5 w-3.5 shrink-0" />}
                    {fb.platform === 'iOS' && <AppleLogo className="h-3.5 w-3.5 shrink-0 text-[#18181b]" />}
                    {fb.platform === 'Web' && <Globe className="h-3.5 w-3.5 shrink-0 text-[#2563eb]" />}
                    {fb.platform === 'Cross-Platform' && <Smartphone className="h-3.5 w-3.5 shrink-0 text-[#7c3aed]" />}
                    <span>{fb.platform}</span>
                  </div>
                  <span>•</span>
                  <span>{fb.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-sans font-semibold text-[#FF6039] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      upvoteFeedback(fb.id);
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-[#EBE5DC] bg-white px-2.5 py-1 text-[#52525b] hover:text-[#18181b] hover:border-[#FF6039] transition-all cursor-pointer"
                    title="Upvote / Prioritize signal"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 text-[#FF6039]" />
                    <span className="font-bold text-[#18181b] text-xs font-sans">{fb.upvotes || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive Inspection Modal */}
      {selectedFeedbackForInspection && (
        <Modal
          isOpen={!!selectedFeedbackForInspection}
          onClose={() => setSelectedFeedbackForInspection(null)}
          title="Review Details & Impact"
          subtitle={`Multi-channel signal from ${selectedFeedbackForInspection.userHandle} via ${selectedFeedbackForInspection.source}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Top Source Meta Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F2] border border-[#EBE5DC] rounded-xl p-3.5 text-xs font-sans">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <BrandLogo source={selectedFeedbackForInspection.source} className="h-5 w-5" />
                  <span className="font-bold text-[#18181b] text-sm">
                    {selectedFeedbackForInspection.source}
                  </span>
                </div>
                <span className="text-[#d4d4d8]">•</span>
                <span className="font-semibold text-[#18181b]">{selectedFeedbackForInspection.userHandle}</span>
                <span className="text-[#d4d4d8]">•</span>
                <div className="flex items-center gap-1 text-[#52525b]">
                  {selectedFeedbackForInspection.platform === 'Android' && <AndroidLogo className="h-3.5 w-3.5" />}
                  {selectedFeedbackForInspection.platform === 'iOS' && <AppleLogo className="h-3.5 w-3.5 text-[#18181b]" />}
                  {selectedFeedbackForInspection.platform === 'Web' && <Globe className="h-3.5 w-3.5 text-[#2563eb]" />}
                  {selectedFeedbackForInspection.platform === 'Cross-Platform' && <Smartphone className="h-3.5 w-3.5 text-[#7c3aed]" />}
                  <span>{selectedFeedbackForInspection.platform}</span>
                </div>
                <span className="text-[#d4d4d8]">•</span>
                <span className="text-[#71717a] font-medium">{selectedFeedbackForInspection.appVersion}</span>
              </div>

              <div className="flex items-center gap-2.5">
                {selectedFeedbackForInspection.rating && (
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="ml-1 text-sm">{selectedFeedbackForInspection.rating}/5</span>
                  </div>
                )}
                <StatusBadge
                  label={selectedFeedbackForInspection.sentiment}
                  variant={
                    selectedFeedbackForInspection.sentiment === 'positive'
                      ? 'green'
                      : selectedFeedbackForInspection.sentiment === 'neutral'
                      ? 'neutral'
                      : 'red'
                  }
                  size="sm"
                  dot={true}
                />
              </div>
            </div>

            {/* Side-by-Side: AI Summary vs. Actual Raw Review */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: AI Summary */}
              <div className="rounded-xl border border-[#FFD6CC] bg-[#FFF9F6] p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#FFD6CC]">
                  <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#E54D26]">
                    <Sparkles className="h-4 w-4 text-[#FF6039]" />
                    <span>AI Problem Summary & Recommendation</span>
                  </div>
                  <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-[#FF6039] text-white font-bold">
                    AI Analyzed
                  </span>
                </div>

                <div>
                  <span className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#71717a] mb-1">
                    Problem Summary
                  </span>
                  <p className="text-sm font-bold font-sans text-[#18181b] leading-relaxed">
                    {selectedFeedbackForInspection.aiSummary || selectedFeedbackForInspection.comment}
                  </p>
                </div>

                {selectedFeedbackForInspection.aiKeyTakeaway && (
                  <div className="bg-white rounded-lg border border-[#FFD6CC] p-3">
                    <span className="block text-[11px] font-sans font-semibold uppercase tracking-wider text-[#E54D26] mb-1">
                      What happened
                    </span>
                    <p className="text-xs font-sans text-[#18181b] leading-relaxed">
                      {selectedFeedbackForInspection.aiKeyTakeaway}
                    </p>
                  </div>
                )}

                {selectedFeedbackForInspection.aiRecommendedAction && (
                  <div className="bg-white rounded-xl border border-[#FFD6CC] p-3.5 shadow-2xs font-sans">
                    <span className="block text-[11px] font-sans font-bold uppercase tracking-wider text-[#C2410C] mb-1.5 flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-[#FF6039]" />
                      Suggested Action
                    </span>
                    <p className="text-xs text-[#18181b] font-medium leading-relaxed">
                      {selectedFeedbackForInspection.aiRecommendedAction}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column: Actual User Review */}
              <div className="rounded-xl border border-[#EBE5DC] bg-white p-4.5 space-y-3.5 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f4f4f5]">
                    <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#18181b]">
                      <MessageSquare className="h-4 w-4 text-[#71717a]" />
                      <span>Actual User Review</span>
                    </div>
                    <span className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#52525b] font-semibold border border-[#EBE5DC]">
                      Original
                    </span>
                  </div>

                  <div className="relative rounded-lg bg-[#FAF7F2] border border-[#EBE5DC] p-3.5 text-xs sm:text-sm text-[#18181b] leading-relaxed font-sans">
                    <p className="text-[#18181b] leading-relaxed">
                      "{selectedFeedbackForInspection.comment}"
                    </p>
                  </div>

                  <div className="space-y-2 pt-1 text-xs font-sans text-[#52525b]">
                    <div className="flex items-center justify-between py-1 border-b border-[#f4f4f5]">
                      <span>Source Platform</span>
                      <span className="font-semibold text-[#18181b]">{selectedFeedbackForInspection.source}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#f4f4f5]">
                      <span>Author</span>
                      <span className="font-semibold text-[#18181b]">{selectedFeedbackForInspection.userHandle}</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-[#f4f4f5]">
                      <span>Date</span>
                      <span className="text-[#18181b] font-medium">{selectedFeedbackForInspection.date}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Build</span>
                      <span className="font-sans text-[#18181b] font-medium">{selectedFeedbackForInspection.appVersion}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#f4f4f5] flex items-center justify-between">
                  <span className="text-xs text-[#71717a] font-sans">Community Upvotes</span>
                  <button
                    onClick={() => upvoteFeedback(selectedFeedbackForInspection.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-[#EBE5DC] bg-white px-3 py-1.5 text-xs font-sans text-[#52525b] hover:text-[#18181b] hover:border-[#FF6039] transition-all cursor-pointer shadow-2xs"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 text-[#FF6039]" />
                    <span className="font-bold text-[#18181b]">{selectedFeedbackForInspection.upvotes || 0} Upvotes</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Impact Telemetry Row */}
            <div className="rounded-xl border border-[#EBE5DC] bg-[#FAF7F2] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[#EBE5DC] pb-2">
                <div className="flex items-center gap-2 text-xs font-sans font-bold text-[#18181b]">
                  <BarChart3 className="h-4 w-4 text-[#FF6039]" />
                  <span>Impact Metrics & Key Telemetry</span>
                </div>
                <span className="text-[11px] font-sans text-[#71717a]">Signal Profile</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-3 border border-[#EBE5DC] shadow-2xs">
                  <span className="text-[10px] font-sans text-[#71717a] uppercase font-semibold block">Impact Score</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold font-sans text-[#18181b]">
                      {selectedFeedbackForInspection.impactScore || 75}
                    </span>
                    <span className="text-xs font-sans text-[#71717a]">/100</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-[#EBE5DC] shadow-2xs">
                  <span className="text-[10px] font-sans text-[#71717a] uppercase font-semibold block">Affected Users</span>
                  <div className="mt-1 text-xl font-bold font-sans text-[#18181b]">
                    ~{selectedFeedbackForInspection.affectedUsersEstimate || 150}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-[#EBE5DC] shadow-2xs">
                  <span className="text-[10px] font-sans text-[#71717a] uppercase font-semibold block">Severity</span>
                  <div className="mt-1 text-base font-bold font-sans capitalize text-[#E54D26]">
                    {selectedFeedbackForInspection.severity || 'Medium'}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3 border border-[#EBE5DC] shadow-2xs">
                  <span className="text-[10px] font-sans text-[#71717a] uppercase font-semibold block">Product Area</span>
                  <div className="mt-1 text-xs font-bold font-sans text-[#18181b] truncate">
                    {selectedFeedbackForInspection.productArea || 'Core Platform'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer - Sticky at bottom */}
            <div className="sticky bottom-0 bg-white pt-3 pb-1 border-t border-[#EBE5DC] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `[${selectedFeedbackForInspection.source}] ${selectedFeedbackForInspection.aiSummary || selectedFeedbackForInspection.comment} (Reported by ${selectedFeedbackForInspection.userHandle})`
                  );
                  showToast('Copied summary to clipboard!', 'info');
                }}
                className="btn-secondary-dark flex items-center justify-center gap-1.5"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Summary</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFeedbackForInspection(null)}
                  className="btn-secondary-dark"
                >
                  Close
                </button>
                <button
                  onClick={() => handlePromoteToPRD(selectedFeedbackForInspection)}
                  className="btn-primary-orange flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Promote to PRD</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Ingest Feedback Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Ingest Customer Feedback"
        subtitle="Log a review from Google Play, Reddit, or Discord."
      >
        <form onSubmit={handleAddFeedback} className="space-y-4 font-sans">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Source
              </label>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#EBE5DC] bg-white shadow-2xs">
                  <BrandLogo source={newSource} className="h-5 w-5" />
                </div>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] font-sans focus:border-[#FF6039] focus:outline-none"
                >
                  {sources.filter((s) => s !== 'All').map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Platform
              </label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as PlatformType)}
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] font-sans focus:border-[#FF6039] focus:outline-none mt-1"
              >
                <option value="Android">Android</option>
                <option value="iOS">iOS</option>
                <option value="Web">Web</option>
                <option value="Cross-Platform">Cross-Platform</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                User Handle
              </label>
              <input
                type="text"
                value={newUserHandle}
                onChange={(e) => setNewUserHandle(e.target.value)}
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] font-sans focus:border-[#FF6039] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs text-[#18181b] font-sans focus:border-[#FF6039] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#71717a] uppercase tracking-wider mb-1">
              Feedback Comment
            </label>
            <textarea
              rows={3}
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Paste raw feedback or review text..."
              className="w-full rounded-lg border border-[#EBE5DC] bg-white p-2.5 text-xs sm:text-sm text-[#18181b] font-sans focus:border-[#FF6039] focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-[#EBE5DC] flex justify-end gap-3 font-sans">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="btn-secondary-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-orange"
            >
              Save Feedback
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
