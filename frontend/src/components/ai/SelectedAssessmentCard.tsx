import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileCheck2,
  ExternalLink,
  ArrowRight,
  Database,
  Info,
  Calendar,
} from 'lucide-react';
import { RiskAnalysisResponse } from '@/types/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface SelectedAssessmentCardProps {
  assessment: RiskAnalysisResponse | null;
  loading?: boolean;
}

export const SelectedAssessmentCard: React.FC<SelectedAssessmentCardProps> = ({
  assessment,
  loading = false,
}) => {
  const navigate = useNavigate();

  if (loading || !assessment) {
    return (
      <GlassCard className="p-5 border-[#8D9AB2]/20 font-mono text-xs animate-pulse">
        <div className="h-6 w-1/3 bg-[#111A2B] rounded mb-3" />
        <div className="h-16 bg-[#111A2B] rounded" />
      </GlassCard>
    );
  }

  const isComplete = assessment.score_completeness === 'COMPLETE';
  const hasEvidence = Boolean(assessment.analysis_id);

  return (
    <GlassCard className="p-5 border-[#8D9AB2]/20 font-mono text-xs space-y-4">
      {/* Header and Bilateral Corridor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#F5F7FF]">
                {assessment.mineral_type || 'Critical Mineral'}
              </span>
              {assessment.commodity_code && (
                <span className="text-[10px] text-[#43D9FF] bg-[#43D9FF]/10 px-2 py-0.5 rounded border border-[#43D9FF]/20">
                  HS {assessment.commodity_code}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm font-bold text-[#F5F7FF]">
              <span className="text-[#43D9FF]">{assessment.reporter_country_code}</span>
              <ArrowRight className="w-4 h-4 text-[#8D9AB2]" />
              <span className="text-[#7287FF]">{assessment.partner_country_code}</span>
              <span className="text-xs font-normal text-[#8D9AB2] flex items-center gap-1 ml-2">
                <Calendar className="w-3.5 h-3.5" />
                Period: {assessment.period}
              </span>
            </div>
          </div>
        </div>

        {/* Action to jump to full Evidence dossier */}
        {hasEvidence && (
          <SecondaryButton
            size="sm"
            onClick={() => navigate(`/evidence?analysis=${encodeURIComponent(assessment.analysis_id)}`)}
            className="flex items-center gap-1.5 self-start sm:self-auto text-xs"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#20E09E]" />
            <span>View Evidence Snapshot</span>
            <ExternalLink className="w-3 h-3 ml-0.5 text-[#8D9AB2]" />
          </SecondaryButton>
        )}
      </div>

      {/* Metrics Row: Score, Classification, Completeness, Sanctions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Authoritative Risk Score */}
        <div className="p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15">
          <span className="text-[10px] text-[#8D9AB2] block">AUTHORITATIVE SCORE</span>
          <div className="text-xl font-bold text-[#FF5B65] mt-0.5 flex items-baseline gap-1">
            <span>{assessment.combined_anomaly_score.toFixed(1)}</span>
            <span className="text-xs text-[#8D9AB2] font-normal">/ 100</span>
          </div>
          <span className="text-[10px] text-[#8D9AB2] block mt-0.5">Deterministic Anomaly</span>
        </div>

        {/* Risk Classification */}
        <div className="p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15">
          <span className="text-[10px] text-[#8D9AB2] block">CLASSIFICATION</span>
          <div className="mt-1">
            <StatusBadge
              status={assessment.classification || 'UNCLASSIFIED'}
              variant={
                assessment.classification === 'RED'
                  ? 'error'
                  : assessment.classification === 'AMBER'
                  ? 'warning'
                  : 'healthy'
              }
              size="md"
            />
          </div>
          <span className="text-[10px] text-[#8D9AB2] block mt-1 truncate">
            Flag: {assessment.flag_status || 'NONE'}
          </span>
        </div>

        {/* Completeness Status */}
        <div className="p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15">
          <span className="text-[10px] text-[#8D9AB2] block">DATA COMPLETENESS</span>
          <div className="mt-1">
            <StatusBadge
              status={assessment.score_completeness || 'UNKNOWN'}
              variant={isComplete ? 'healthy' : 'warning'}
              size="md"
            />
          </div>
          <span className="text-[10px] text-[#8D9AB2] block mt-1">
            {isComplete ? 'All Rules Evaluated' : 'Partial Evidence Set'}
          </span>
        </div>

        {/* Sanctions Screening Status */}
        <div className="p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15">
          <span className="text-[10px] text-[#8D9AB2] block">SANCTIONS SCREENING</span>
          <div className="text-sm font-bold text-[#F5F7FF] mt-1 flex items-center gap-1.5">
            <ShieldCheck
              className={`w-4 h-4 ${
                assessment.sanctions_status === 'CLEARED' ? 'text-[#20E09E]' : 'text-[#FF5B65]'
              }`}
            />
            <span>{assessment.sanctions_status || 'NOT SCREENED'}</span>
          </div>
          <span className="text-[10px] text-[#8D9AB2] block mt-0.5">OFAC SDN Screening</span>
        </div>
      </div>

      {/* Strict Score Integrity Callout Banner */}
      <div className="p-3 rounded-xl bg-[#111A2B]/80 border border-[#43D9FF]/20 flex items-start gap-2.5 text-[11px] text-[#8D9AB2]">
        <Info className="w-4 h-4 text-[#43D9FF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F5F7FF]">Score Integrity Rule:</strong> The backend risk engine remains
          the sole authoritative source for scores and classifications. Local AI explanations synthesize
          empirical observations and regulatory context for investigator review, but never alter scores,
          override classifications, or manufacture unsupported claims of legal wrongdoing.
        </p>
      </div>
    </GlassCard>
  );
};
