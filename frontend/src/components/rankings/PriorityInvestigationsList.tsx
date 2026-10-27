import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { RankingEntry } from '@/types/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface PriorityInvestigationsListProps {
  rankings: RankingEntry[];
  onSelectRanking?: (entry: RankingEntry) => void;
}

export const PriorityInvestigationsList: React.FC<PriorityInvestigationsListProps> = ({
  rankings,
  onSelectRanking,
}) => {
  const navigate = useNavigate();

  // Filter top findings that warrant priority analyst attention:
  // 1. Sanctions matches (critical)
  // 2. High score (RED)
  // 3. Insufficient data / partial completeness
  const priorityItems = React.useMemo(() => {
    return rankings
      .filter(
        (r) =>
          r.sanctions_status === 'MATCH_IDENTIFIED' ||
          r.sanctions_status === 'REVIEW_MATCH' ||
          r.anomaly_score >= 50 ||
          r.classification === 'RED' ||
          r.score_completeness === 'PARTIAL'
      )
      .slice(0, 4);
  }, [rankings]);

  const getReason = (r: RankingEntry) => {
    if (r.sanctions_status === 'MATCH_IDENTIFIED' || r.sanctions_status === 'REVIEW_MATCH') {
      return 'OFAC / Sanctions proximity match identified on consignee or partner';
    }
    if (r.score_completeness === 'PARTIAL') {
      return 'Incomplete baseline data — requires manual verification of mirror declarations';
    }
    if (r.anomaly_score >= 70) {
      return 'Severe compound anomaly across mirror gap and transshipment volume surge';
    }
    if (r.anomaly_score >= 50) {
      return 'High composite anomaly score exceeding 50.0 risk threshold';
    }
    return 'Elevated variance requiring forensic audit review';
  };

  if (priorityItems.length === 0) {
    return null;
  }

  return (
    <GlassCard className="p-4 space-y-3 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FF5B65]/10 text-[#FF5B65] border border-[#FF5B65]/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#F5F7FF] uppercase tracking-wider">
              Priority Investigations &amp; Chokepoint Alerts
            </h3>
            <span className="text-[10px] text-[#8D9AB2]">
              IDENTIFIED ANOMALIES &amp; MISSING BASELINES REQUIRING TRIAGE
            </span>
          </div>
        </div>

        <span className="text-[10px] text-[#FFB547] bg-[#FFB547]/10 px-2.5 py-1 rounded border border-[#FFB547]/20 self-start sm:self-auto">
          ATTENTION REQUIRED: {priorityItems.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {priorityItems.map((item) => {
          const isSanction =
            item.sanctions_status === 'MATCH_IDENTIFIED' ||
            item.sanctions_status === 'REVIEW_MATCH';
          const isPartial = item.score_completeness === 'PARTIAL';

          return (
            <div
              key={item.analysis_id}
              className={`p-3 rounded-xl border flex flex-col justify-between space-y-2.5 transition-all ${
                isSanction
                  ? 'bg-[#FF5B65]/10 border-[#FF5B65]/40 shadow-[0_0_12px_-3px_rgba(255,91,101,0.2)]'
                  : isPartial
                  ? 'bg-[#7287FF]/10 border-[#7287FF]/30'
                  : 'bg-[#070A12] border-[#8D9AB2]/20 hover:border-[#8D9AB2]/40'
              }`}
            >
              {/* Header: Rank, Corridor, Score */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#111A2B] text-[#43D9FF] border border-[#43D9FF]/30">
                      RANK #{item.rank}
                    </span>
                    <span className="font-bold text-xs text-[#F5F7FF] truncate">
                      {item.mineral_type || `HS ${item.commodity_code}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#F5F7FF] mt-1">
                    <span className="text-[#43D9FF] font-bold">{item.reporter_country_code}</span>
                    <ArrowRight className="w-3 h-3 text-[#8D9AB2]" />
                    <span className="text-[#7287FF] font-bold">{item.partner_country_code}</span>
                    <span className="text-[10px] text-[#8D9AB2] ml-2">PERIOD: {item.period}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm font-bold px-2 py-0.5 rounded border inline-block ${
                      item.anomaly_score >= 50
                        ? 'text-[#FF5B65] bg-[#FF5B65]/20 border-[#FF5B65]/40'
                        : 'text-[#FFB547] bg-[#FFB547]/20 border-[#FFB547]/40'
                    }`}
                  >
                    {item.anomaly_score.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-[#8D9AB2] block mt-0.5">
                    {item.classification || 'UNCLASSIFIED'}
                  </span>
                </div>
              </div>

              {/* Attention Reason */}
              <div className="p-2 rounded bg-[#070A12]/80 border border-[#8D9AB2]/15 text-[11px] leading-relaxed">
                <span className="text-[#FFB547] font-bold block text-[10px]">REASON FOR TRIAGE:</span>
                <p className="text-[#8D9AB2] mt-0.5">{getReason(item)}</p>
              </div>

              {/* Footer and Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#8D9AB2]/10 text-[10px]">
                <div className="flex items-center gap-1.5 text-[#20E09E]">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>EVIDENCE: EVI-{item.analysis_id.substring(0, 8)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <SecondaryButton
                    size="sm"
                    variant="surface"
                    leftIcon={<ExternalLink className="w-3 h-3" />}
                    onClick={() => {
                      if (onSelectRanking) {
                        onSelectRanking(item);
                      } else {
                        navigate(`/risk-analysis?analysis=${item.analysis_id}`);
                      }
                    }}
                    className="text-[10px] py-1 px-2 font-mono"
                  >
                    INVESTIGATE
                  </SecondaryButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2 rounded bg-[#111A2B]/40 border border-[#8D9AB2]/10 text-[10px] text-[#8D9AB2] leading-relaxed">
        <strong>INTEGRITY POLICY:</strong> Priority flags indicate statistical anomalies or compliance screening requirements and do not constitute legal proof of illicit activity or sanctions violation.
      </div>
    </GlassCard>
  );
};
