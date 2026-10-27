import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: LucideIcon;
  accentColor?: 'orange' | 'amber' | 'green' | 'blue' | 'purple' | 'terracotta';
  level?: 1 | 2 | 3;
  sparklineData?: number[];
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon: Icon,
  accentColor = 'orange',
  level = 1,
  sparklineData,
  onClick,
}) => {
  const isLevel2 = level === 2;
  const isLevel3 = level === 3;

  const chartData = sparklineData?.map((val, idx) => ({ i: idx, v: val }));

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden transition-all duration-200 ${
        isLevel3
          ? 'card-level-3'
          : isLevel2
          ? 'rounded-[12px] border border-[#FF6039]/40 bg-[#FFF9F6] p-5 shadow-[0px_2px_8px_rgba(255,96,57,0.06)]'
          : 'card-level-1 hover:border-[#FF6039]/40 hover:shadow-sm'
      } ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs font-sans font-semibold uppercase tracking-wider ${isLevel3 ? 'text-neutral-400' : 'text-[#71717a]'}`}>
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-sans tabular-nums text-2xl font-bold tracking-tight sm:text-3xl ${isLevel3 ? 'text-white' : 'text-[#18181b]'}`}>
              {value}
            </span>
          </div>
        </div>
        {Icon && (
          <div className={`rounded-[8px] p-2 border transition-all ${
            isLevel3
              ? 'bg-[#262626] border-[#383838] text-[#FF6039]'
              : 'bg-[#fafafa] border-[#e4e4e7] text-[#18181b] group-hover:border-[#FF6039]/50 group-hover:text-[#FF6039]'
          }`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Optional Mini Recharts Sparkline */}
      {chartData && chartData.length > 0 && (
        <div className="mt-3 h-8 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Area
                type="monotone"
                dataKey="v"
                stroke="#FF6039"
                strokeWidth={2}
                fill="none"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {(subtitle || change) && (
        <div className={`mt-3 flex items-center justify-between text-xs pt-2 border-t ${isLevel3 ? 'border-[#2e2e2e]' : 'border-[#f4f4f5]'}`}>
          {subtitle && (
            <span className={`truncate max-w-[200px] text-xs font-sans ${isLevel3 ? 'text-neutral-400' : 'text-[#71717a]'}`}>
              {subtitle}
            </span>
          )}
          {change && (
            <span
              className={`flex items-center gap-1 font-sans text-xs font-semibold ${
                changeType === 'up'
                  ? 'text-emerald-700'
                  : changeType === 'down'
                  ? 'text-rose-700'
                  : isLevel3 ? 'text-neutral-400' : 'text-[#71717a]'
              }`}
            >
              {changeType === 'up' && <TrendingUp className="h-3 w-3" />}
              {changeType === 'down' && <TrendingDown className="h-3 w-3" />}
              {changeType === 'neutral' && <Minus className="h-3 w-3" />}
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

