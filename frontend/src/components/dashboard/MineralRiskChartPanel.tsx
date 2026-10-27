import React from 'react';
import { BarChart3, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { HorizontalBarChart, BarItem } from '@/components/ui/HorizontalBarChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MineralSummary, RankingEntry } from '@/types/api';

export interface MineralRiskChartPanelProps {
  minerals: MineralSummary[];
  rankings: RankingEntry[];
  loading?: boolean;
}

export const MineralRiskChartPanel: React.FC<MineralRiskChartPanelProps> = ({
  minerals,
  rankings,
  loading = false,
}) => {
  // Compute mineral analytics from real backend records
  const items: BarItem[] = minerals.map((m) => {
    // Count associated rankings or trade records
    const matchingRankings = rankings.filter(
      (r) => r.commodity_code === m.commodity_code || r.mineral_type?.toLowerCase() === m.mineral_name.toLowerCase()
    );
    const avgScore = matchingRankings.length > 0
      ? (matchingRankings.reduce((sum, r) => sum + r.anomaly_score, 0) / matchingRankings.length).toFixed(1)
      : null;

    return {
      id: m.commodity_code,
      label: m.mineral_name,
      code: m.commodity_code,
      value: m.record_count > 0 ? m.record_count : matchingRankings.length,
      secondaryValue: avgScore ? `Avg Score: ${avgScore}` : undefined,
      color: avgScore && Number(avgScore) >= 50 ? '#FF5B65' : avgScore && Number(avgScore) >= 20 ? '#FFB547' : '#43D9FF',
    };
  });

  return (
    <GlassCard className="p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#7287FF]/10 text-[#7287FF] border border-[#7287FF]/20 shadow-[0_0_12px_rgba(114,135,255,0.2)]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-[#F5F7FF] tracking-tight">
                Risk by Mineral
              </h3>
              <p className="text-[11px] text-[#8D9AB2]">
                Critical mineral surveillance volume and anomaly distribution.
              </p>
            </div>
          </div>

          <StatusBadge
            status={items.length > 0 ? `${items.length} MONITORED` : 'AWAITING FEEDS'}
            variant={items.length > 0 ? 'cyan' : 'neutral'}
            size="sm"
          />
        </div>

        {/* Horizontal Ranked Bar Chart */}
        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 rounded bg-[#111A2B]/60 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-[#8D9AB2]/15 bg-[#0D1320]/40 my-2">
            <Info className="w-6 h-6 text-[#8D9AB2] mb-2" />
            <span className="text-xs font-mono font-semibold text-[#F5F7FF]">
              Mineral Risk Aggregations Unavailable
            </span>
            <p className="text-[11px] text-[#8D9AB2] mt-1 max-w-xs leading-relaxed">
              Ingest trade data from UN Comtrade to populate mineral volume and risk distributions.
            </p>
          </div>
        ) : (
          <div className="py-2">
            <HorizontalBarChart
              items={items}
              valueFormatter={(val) => `${val} flows`}
            />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#8D9AB2]/10 flex items-center justify-between text-[11px] font-mono text-[#8D9AB2]">
        <span>Aggregated by UN Comtrade HS Taxonomy</span>
        <span className="text-[#20E09E]">Official Data Only</span>
      </div>
    </GlassCard>
  );
};
