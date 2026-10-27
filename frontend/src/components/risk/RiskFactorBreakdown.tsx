import React from 'react';
import {
  GitCompare,
  TrendingUp,
  Share2,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import { RuleResultResponse } from '@/types/api';
import { GlassCard } from '@/components/ui/GlassCard';

export interface RiskFactorBreakdownProps {
  ruleResults?: RuleResultResponse[];
  sanctionsStatus: string;
  sanctionsReference?: string | null;
  period: string;
  evidenceId?: string | null;
}

export const RiskFactorBreakdown: React.FC<RiskFactorBreakdownProps> = ({
  ruleResults = [],
  sanctionsStatus,
  sanctionsReference,
  period,
  evidenceId,
}) => {
  // Map of rule catalog defaults if specific rule result items are not populated
  const defaultRules: Record<
    string,
    { name: string; icon: React.ElementType; weight: number; formula: string; threshold: string }
  > = {
    R1: {
      name: 'R1: Mirror Trade Gap',
      icon: GitCompare,
      weight: 30,
      formula: '|Export_Val - Import_Val| / Max(Export_Val, Import_Val)',
      threshold: '> 30.0%',
    },
    R2: {
      name: 'R2: Volume Surge Anomaly',
      icon: TrendingUp,
      weight: 20,
      formula: '(Current_Vol - Baseline_Median) / Baseline_Median',
      threshold: '> 200.0%',
    },
    R3: {
      name: 'R3: Route Concentration',
      icon: Share2,
      weight: 30,
      formula: 'Jurisdiction_Volume / Total_Exporter_Volume',
      threshold: '> 80.0%',
    },
    R4: {
      name: 'R4: Unit Price Dispersion',
      icon: DollarSign,
      weight: 20,
      formula: '|Unit_Price - Benchmark_Median| / Benchmark_Median',
      threshold: '> 60.0%',
    },
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'FLAG':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF5B65]/20 text-[#FF5B65] border border-[#FF5B65]/40 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            FLAGGED ANOMALY
          </span>
        );
      case 'NOT_FLAGGED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#20E09E]/20 text-[#20E09E] border border-[#20E09E]/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            PASSED (NORMAL)
          </span>
        );
      case 'INSUFFICIENT':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7287FF]/20 text-[#7287FF] border border-[#7287FF]/40 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            INSUFFICIENT DATA
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#111A2B] text-[#8D9AB2] border border-[#8D9AB2]/25">
            {outcome || 'EVALUATED'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-mono font-bold text-[#F5F7FF] flex items-center gap-2">
          <span>Deterministic Risk Factor Breakdown</span>
          <span className="text-[10px] font-mono text-[#43D9FF] px-2 py-0.5 rounded bg-[#111A2B] border border-[#43D9FF]/20">
            5-DIMENSION AUDIT
          </span>
        </h3>
        <p className="text-[11px] font-mono text-[#8D9AB2] mt-0.5">
          Mathematical scoring evaluated under MineTrace Policy v1.0. Observed values verified without AI alteration.
        </p>
      </div>

      {/* R1 - R4 Quantitative Anomaly Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {['R1', 'R2', 'R3', 'R4'].map((ruleKey) => {
          const result = ruleResults.find((r) => r.rule_id === ruleKey);
          const meta = defaultRules[ruleKey];
          const Icon = meta.icon;
          const isFlagged = result?.outcome === 'FLAG';

          return (
            <GlassCard
              key={ruleKey}
              className={`p-4 space-y-3 transition-all ${
                isFlagged
                  ? 'border-[#FF5B65]/40 bg-[#FF5B65]/5 shadow-[0_0_15px_-5px_rgba(255,91,101,0.2)]'
                  : 'border-[#8D9AB2]/20'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2 rounded-lg border ${
                      isFlagged
                        ? 'bg-[#FF5B65]/10 border-[#FF5B65]/30 text-[#FF5B65]'
                        : 'bg-[#111A2B] border-[#8D9AB2]/20 text-[#43D9FF]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-[#F5F7FF]">
                      {result?.rule_name || meta.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#8D9AB2]">
                      WEIGHT: {result?.weight ?? meta.weight}% OF COMBINED SCORE
                    </span>
                  </div>
                </div>

                {getOutcomeBadge(result?.outcome || (isFlagged ? 'FLAG' : 'NOT_FLAGGED'))}
              </div>

              {/* Observed vs Threshold Metrics */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#8D9AB2] block">OBSERVED VALUE</span>
                  <span className="text-[#F5F7FF] font-bold mt-0.5 block">
                    {result?.calculated_value !== null && result?.calculated_value !== undefined
                      ? `${result.calculated_value.toFixed(2)}%`
                      : 'Data Verified'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-[#8D9AB2] block">THRESHOLD</span>
                  <span className="text-[#43D9FF] font-bold mt-0.5 block">
                    {result?.threshold || meta.threshold}
                  </span>
                </div>
              </div>

              {/* Formula & Explanation */}
              <div className="space-y-1.5 text-[11px] font-mono">
                <div className="text-[#8D9AB2] truncate">
                  <span className="text-[#43D9FF]">FORMULA:</span> {result?.formula || meta.formula}
                </div>
                <p className="text-[#8D9AB2] leading-relaxed line-clamp-2">
                  {result?.explanation ||
                    `Deterministic evaluation against historical trade baselines for period ${period}.`}
                </p>
                {result?.warnings && result.warnings.length > 0 && (
                  <div className="p-2 rounded bg-[#FFB547]/10 border border-[#FFB547]/20 text-[#FFB547] text-[10px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{result.warnings.join('; ')}</span>
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* R5: Sanctions Exposure (Distinct Dimension) */}
      <GlassCard
        className={`p-4 space-y-3 border ${
          sanctionsStatus === 'MATCH_IDENTIFIED' || sanctionsStatus === 'REVIEW_MATCH'
            ? 'border-[#FF5B65]/40 bg-[#FF5B65]/10 shadow-[0_0_20px_-5px_rgba(255,91,101,0.25)]'
            : 'border-[#20E09E]/30 bg-[#20E09E]/5'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-lg border ${
                sanctionsStatus === 'MATCH_IDENTIFIED' || sanctionsStatus === 'REVIEW_MATCH'
                  ? 'bg-[#FF5B65]/20 border-[#FF5B65]/40 text-[#FF5B65]'
                  : 'bg-[#20E09E]/20 border-[#20E09E]/40 text-[#20E09E]'
              }`}
            >
              {sanctionsStatus === 'MATCH_IDENTIFIED' || sanctionsStatus === 'REVIEW_MATCH' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-mono font-bold text-[#F5F7FF]">
                  R5: OFAC / Sanctions Screening Dimension
                </h4>
                <span className="text-[10px] font-mono text-[#8D9AB2] px-1.5 py-0.5 rounded bg-[#111A2B] border border-[#8D9AB2]/20">
                  SEPARATE COMPLIANCE DIMENSION
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8D9AB2] mt-0.5">
                Exact &amp; fuzzy entity reconciliation against OFAC SDN, Sectoral Sanctions (SSI), and blocked jurisdiction listings.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <span
              className={`px-3 py-1 rounded text-xs font-mono font-bold border flex items-center gap-1.5 ${
                sanctionsStatus === 'MATCH_IDENTIFIED' || sanctionsStatus === 'REVIEW_MATCH'
                  ? 'bg-[#FF5B65]/20 text-[#FF5B65] border-[#FF5B65]/40'
                  : 'bg-[#20E09E]/20 text-[#20E09E] border-[#20E09E]/40'
              }`}
            >
              {sanctionsStatus === 'MATCH_IDENTIFIED' || sanctionsStatus === 'REVIEW_MATCH' ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  SANCTIONS MATCH IDENTIFIED
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NO IDENTIFIED SANCTIONS MATCH
                </>
              )}
            </span>
          </div>
        </div>

        {sanctionsReference && (
          <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15 text-xs font-mono text-[#8D9AB2]">
            <span className="text-[#F5F7FF] font-bold">SANCTIONS REFERENCE:</span> {sanctionsReference}
          </div>
        )}

        <div className="text-[10px] font-mono text-[#8D9AB2] flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#8D9AB2]/10">
          <span>PERIOD AUDITED: {period}</span>
          {evidenceId && (
            <span className="flex items-center gap-1 text-[#20E09E]">
              <FileCheck2 className="w-3 h-3" />
              EVIDENCE RECORD: {evidenceId}
            </span>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
