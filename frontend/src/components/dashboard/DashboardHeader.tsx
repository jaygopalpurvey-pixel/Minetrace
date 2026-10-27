import React from 'react';
import { Calendar, RefreshCw, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Tooltip } from '@/components/ui/Tooltip';

export interface DashboardHeaderProps {
  selectedPeriod: string;
  onSelectPeriod: (period: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  isLive: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedPeriod,
  onSelectPeriod,
  onRefresh,
  isRefreshing,
  lastUpdated,
  isLive,
}) => {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never checked';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#8D9AB2]/10 mb-6">
      {/* Title & Surveillance Context */}
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-[#F5F7FF]">
            Intelligence Overview
          </h1>
          <StatusBadge
            status={isLive ? 'SYSTEM OPERATIONAL' : 'OFFLINE // STANDBY'}
            variant={isLive ? 'healthy' : 'neutral'}
            size="sm"
          />
        </div>
        <p className="text-sm text-[#8D9AB2] mt-1 font-normal leading-relaxed max-w-2xl">
          Critical mineral supply-chain risk monitoring and analysis.
        </p>
      </div>

      {/* Controls: Analysis Period, Freshness & Refresh */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Data Freshness Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0D1320] border border-[#8D9AB2]/15 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-[#8D9AB2]" />
          <span className="text-[#8D9AB2]/70">UPDATED:</span>
          <span className="text-[#F5F7FF] tabular-nums font-medium">
            {formatTime(lastUpdated)}
          </span>
        </div>

        {/* Period Selector (7d, 30d, 90d, All) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/20 text-xs font-mono">
          <Calendar className="w-3.5 h-3.5 text-[#43D9FF] shrink-0" />
          <span className="text-[#8D9AB2] shrink-0">WINDOW:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => onSelectPeriod(e.target.value)}
            disabled={isRefreshing}
            className="bg-transparent text-[#F5F7FF] font-semibold outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#090D17] text-[#F5F7FF]">
              All available data
            </option>
            <option value="90D" className="bg-[#090D17] text-[#F5F7FF]">
              90 days (Recent cycle)
            </option>
            <option value="30D" className="bg-[#090D17] text-[#F5F7FF]">
              30 days (Monthly review)
            </option>
            <option value="7D" className="bg-[#090D17] text-[#F5F7FF]">
              7 days (Active alerts)
            </option>
          </select>
        </div>

        {/* Refresh Action Button */}
        <Tooltip content="Re-query all live analytical endpoints from FastAPI engine">
          <SecondaryButton
            size="sm"
            variant="surface"
            leftIcon={
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#43D9FF]' : 'text-[#8D9AB2]'}`}
              />
            }
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-xs font-mono font-medium"
          >
            {isRefreshing ? 'SYNCING...' : 'REFRESH'}
          </SecondaryButton>
        </Tooltip>
      </div>
    </div>
  );
};
