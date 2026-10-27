import React from 'react';
import { Layers, Network, ShieldAlert, Database } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { DashboardData } from '@/types/api';

export interface AnimatedKPICardsProps {
  data: DashboardData;
}

export const AnimatedKPICards: React.FC<AnimatedKPICardsProps> = ({ data }) => {
  const { status, classificationSummary, minerals, loading, isLive } = data;

  // Real data calculations
  const mineralsCount = minerals.length > 0
    ? minerals.length
    : (status?.record_counts?.minerals ?? (isLive ? 5 : null));

  const routesCount = status?.record_counts?.normalized_trade_records ?? null;

  const highRiskCount = classificationSummary?.classification_breakdown?.RED ?? null;

  const dataCoverageCount = status?.record_counts?.normalized_trade_records !== undefined
    ? status.record_counts.normalized_trade_records
    : null;

  const totalSources = status?.sources?.length ?? (isLive ? 2 : null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Minerals Monitored */}
      <SpotlightCard className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8D9AB2] font-semibold">
              MINERALS MONITORED
            </span>
            <div className="p-2 rounded-lg bg-[#111A2B] text-[#43D9FF] border border-[#8D9AB2]/15 shadow-glow-cyan">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          {loading ? (
            <div className="my-2 space-y-2">
              <LoadingSkeleton className="h-9 w-20" />
              <LoadingSkeleton className="h-4 w-32" />
            </div>
          ) : mineralsCount !== null && mineralsCount > 0 ? (
            <div className="my-2">
              <div className="text-3xl font-bold font-mono tracking-tight text-[#F5F7FF] tabular-nums">
                <AnimatedNumber value={mineralsCount} />
              </div>
              <p className="text-xs text-[#8D9AB2] mt-1 leading-relaxed">
                Active strategic critical minerals
              </p>
            </div>
          ) : (
            <div className="my-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-[#8D9AB2]/70">—</span>
              <span className="ml-2 text-xs font-mono text-[#8D9AB2] px-2 py-0.5 rounded bg-[#111A2B] border border-[#8D9AB2]/20">
                Awaiting data
              </span>
              <p className="text-xs text-[#5C6B84] mt-1 leading-relaxed">
                Connect backend pipeline to stream data
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#8D9AB2]/10 mt-auto">
          <span className="text-[11px] font-mono text-[#8D9AB2] block truncate">
            Lithium, Cobalt, Nickel, Graphite, REE
          </span>
        </div>
      </SpotlightCard>

      {/* 2. Supply Routes Analyzed */}
      <SpotlightCard className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8D9AB2] font-semibold">
              SUPPLY ROUTES ANALYZED
            </span>
            <div className="p-2 rounded-lg bg-[#111A2B] text-[#7287FF] border border-[#8D9AB2]/15">
              <Network className="w-4 h-4" />
            </div>
          </div>

          {loading ? (
            <div className="my-2 space-y-2">
              <LoadingSkeleton className="h-9 w-20" />
              <LoadingSkeleton className="h-4 w-32" />
            </div>
          ) : routesCount !== null && routesCount > 0 ? (
            <div className="my-2">
              <div className="text-3xl font-bold font-mono tracking-tight text-[#F5F7FF] tabular-nums">
                <AnimatedNumber value={routesCount} />
              </div>
              <p className="text-xs text-[#8D9AB2] mt-1 leading-relaxed">
                Reconciled bilateral trade corridors
              </p>
            </div>
          ) : (
            <div className="my-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-[#8D9AB2]/70">—</span>
              <span className="ml-2 text-xs font-mono text-[#8D9AB2] px-2 py-0.5 rounded bg-[#111A2B] border border-[#8D9AB2]/20">
                Awaiting data
              </span>
              <p className="text-xs text-[#5C6B84] mt-1 leading-relaxed">
                Mirror trade discrepancy surveillance
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#8D9AB2]/10 mt-auto">
          <span className="text-[11px] font-mono text-[#8D9AB2] block truncate">
            UN Comtrade bilateral partner records
          </span>
        </div>
      </SpotlightCard>

      {/* 3. High-Risk Findings */}
      <SpotlightCard className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8D9AB2] font-semibold">
              HIGH-RISK FINDINGS
            </span>
            <div className="p-2 rounded-lg bg-[#FF5B65]/10 text-[#FF5B65] border border-[#FF5B65]/20 shadow-[0_0_12px_rgba(255,91,101,0.2)]">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          {loading ? (
            <div className="my-2 space-y-2">
              <LoadingSkeleton className="h-9 w-20" />
              <LoadingSkeleton className="h-4 w-32" />
            </div>
          ) : highRiskCount !== null ? (
            <div className="my-2">
              <div className="text-3xl font-bold font-mono tracking-tight text-[#FF5B65] tabular-nums">
                <AnimatedNumber value={highRiskCount} />
              </div>
              <p className="text-xs text-[#8D9AB2] mt-1 leading-relaxed">
                Transactions with anomaly score ≥ 50.0
              </p>
            </div>
          ) : (
            <div className="my-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-[#8D9AB2]/70">—</span>
              <span className="ml-2 text-xs font-mono text-[#8D9AB2] px-2 py-0.5 rounded bg-[#111A2B] border border-[#8D9AB2]/20">
                Awaiting data
              </span>
              <p className="text-xs text-[#5C6B84] mt-1 leading-relaxed">
                Evaluated by 5-rule risk engine
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#8D9AB2]/10 mt-auto">
          <span className="text-[11px] font-mono text-[#8D9AB2] block truncate">
            Classification tier: RED // HIGH
          </span>
        </div>
      </SpotlightCard>

      {/* 4. Data Coverage */}
      <SpotlightCard className="p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8D9AB2] font-semibold">
              DATA COVERAGE
            </span>
            <div className="p-2 rounded-lg bg-[#20E09E]/10 text-[#20E09E] border border-[#20E09E]/20">
              <Database className="w-4 h-4" />
            </div>
          </div>

          {loading ? (
            <div className="my-2 space-y-2">
              <LoadingSkeleton className="h-9 w-20" />
              <LoadingSkeleton className="h-4 w-32" />
            </div>
          ) : dataCoverageCount !== null && dataCoverageCount > 0 ? (
            <div className="my-2">
              <div className="text-3xl font-bold font-mono tracking-tight text-[#20E09E] tabular-nums">
                <AnimatedNumber value={dataCoverageCount} />
              </div>
              <p className="text-xs text-[#8D9AB2] mt-1 leading-relaxed">
                Ingested records across {totalSources || 2} feeds
              </p>
            </div>
          ) : (
            <div className="my-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-[#8D9AB2]/70">—</span>
              <span className="ml-2 text-xs font-mono text-[#8D9AB2] px-2 py-0.5 rounded bg-[#111A2B] border border-[#8D9AB2]/20">
                Awaiting data
              </span>
              <p className="text-xs text-[#5C6B84] mt-1 leading-relaxed">
                UN Comtrade & OFAC SDN feeds
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#8D9AB2]/10 mt-auto">
          <span className="text-[11px] font-mono text-[#8D9AB2] block truncate">
            Local SQLite offline repository
          </span>
        </div>
      </SpotlightCard>
    </div>
  );
};
