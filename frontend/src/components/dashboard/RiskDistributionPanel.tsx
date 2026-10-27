import React from 'react';
import { PieChart, ShieldCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { DonutChart, DonutSegment } from '@/components/ui/DonutChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ClassificationSummaryResponse } from '@/types/api';

export interface RiskDistributionPanelProps {
  summary: ClassificationSummaryResponse | null;
  loading?: boolean;
}

export const RiskDistributionPanel: React.FC<RiskDistributionPanelProps> = ({
  summary,
  loading = false,
}) => {
  const breakdown = summary?.classification_breakdown || {};

  const greenCount = breakdown.GREEN || 0;
  const amberCount = breakdown.AMBER || 0;
  const redCount = breakdown.RED || 0;
  const insufficientCount = breakdown.INSUFFICIENT_DATA || 0;

  const totalClassified = greenCount + amberCount + redCount + insufficientCount;

  const chartSegments: DonutSegment[] = [
    {
      id: 'RED',
      label: 'RED (Score 50-100)',
      value: redCount,
      color: '#FF5B65',
    },
    {
      id: 'AMBER',
      label: 'AMBER (Score 20-49)',
      value: amberCount,
      color: '#FFB547',
    },
    {
      id: 'GREEN',
      label: 'GREEN (Score 0-19)',
      value: greenCount,
      color: '#20E09E',
    },
    {
      id: 'INSUFFICIENT_DATA',
      label: 'INSUFFICIENT DATA',
      value: insufficientCount,
      color: '#8D9AB2',
    },
  ];

  return (
    <GlassCard className="p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/20 shadow-glow-cyan">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-[#F5F7FF] tracking-tight">
                Risk Distribution
              </h3>
              <p className="text-[11px] text-[#8D9AB2]">
                Distribution of saved risk classifications.
              </p>
            </div>
          </div>

          <StatusBadge
            status={totalClassified > 0 ? `${totalClassified} CLASSIFIED` : 'AWAITING RUN'}
            variant={totalClassified > 0 ? 'cyan' : 'neutral'}
            size="sm"
          />
        </div>

        {/* Donut Chart or Empty State */}
        <div className="py-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-6 space-y-3">
              <div className="w-36 h-36 rounded-full border-4 border-dashed border-[#8D9AB2]/20 animate-spin" />
              <div className="h-4 w-28 rounded bg-[#111A2B] animate-pulse" />
            </div>
          ) : (
            <DonutChart
              data={chartSegments}
              size={190}
              strokeWidth={24}
              centerLabel={totalClassified > 0 ? String(totalClassified) : '0'}
              centerSublabel="ANALYSES"
            />
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#8D9AB2]/10 flex items-center justify-between text-[11px] font-mono text-[#8D9AB2]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#20E09E]" />
          <span>Strict Guardrails: Partial scores mapped to Insufficient</span>
        </div>
        <span className="text-[10px] text-[#8D9AB2]/60">Rule Policy v1.0</span>
      </div>
    </GlassCard>
  );
};
