import React, { useState } from 'react';
import {
  FileCheck2,
  Lock,
  Sparkles,
  Info,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface EvidenceInspectionSectionProps {
  analysisId: string;
  tradeRecordId?: number | null;
  period: string;
  commodityCode: string;
  mineralName?: string | null;
  reporterCountry: string;
  partnerCountry: string;
  riskScore: number;
  classification: string;
  sourceDataset?: string;
  createdAt?: string;
  onOpenEvidenceModal: () => void;
  onRequestAIExplanation?: () => void;
}

export const EvidenceInspectionSection: React.FC<EvidenceInspectionSectionProps> = ({
  analysisId,
  tradeRecordId,
  period,
  commodityCode,
  mineralName,
  reporterCountry,
  partnerCountry,
  riskScore,
  classification,
  sourceDataset = 'UN Comtrade (Verified Offline Repository)',
  createdAt,
  onOpenEvidenceModal,
  onRequestAIExplanation,
}) => {
  const [activeCategory, setActiveCategory] = useState<'observed' | 'assessment' | 'missing' | 'ai'>('observed');

  return (
    <GlassCard className="p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#111A2B] border border-[#20E09E]/30 text-[#20E09E]">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-[#F5F7FF] flex items-center gap-2">
              Authoritative Evidence &amp; Traceability
            </h3>
            <span className="text-[10px] font-mono text-[#8D9AB2]">
              FROZEN HISTORICAL PROOF // IMMUTABLE SNAPSHOT REF: EVI-{analysisId}
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveCategory('observed')}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              activeCategory === 'observed'
                ? 'bg-[#111A2B] border-[#43D9FF] text-[#43D9FF] font-bold'
                : 'bg-[#070A12]/50 border-[#8D9AB2]/20 text-[#8D9AB2]'
            }`}
          >
            1. Observed Data
          </button>
          <button
            onClick={() => setActiveCategory('assessment')}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              activeCategory === 'assessment'
                ? 'bg-[#111A2B] border-[#FFB547] text-[#FFB547] font-bold'
                : 'bg-[#070A12]/50 border-[#8D9AB2]/20 text-[#8D9AB2]'
            }`}
          >
            2. Risk Engine Output
          </button>
          <button
            onClick={() => setActiveCategory('missing')}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              activeCategory === 'missing'
                ? 'bg-[#111A2B] border-[#7287FF] text-[#7287FF] font-bold'
                : 'bg-[#070A12]/50 border-[#8D9AB2]/20 text-[#8D9AB2]'
            }`}
          >
            3. Missing Baselines
          </button>
          <button
            onClick={() => setActiveCategory('ai')}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              activeCategory === 'ai'
                ? 'bg-[#111A2B] border-[#20E09E] text-[#20E09E] font-bold'
                : 'bg-[#070A12]/50 border-[#8D9AB2]/20 text-[#8D9AB2]'
            }`}
          >
            4. AI Synthesis
          </button>
        </div>
      </div>

      {/* Category 1: Observed Data */}
      {activeCategory === 'observed' && (
        <div className="space-y-3 font-mono text-xs animate-in fade-in-0 duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">SOURCE DATASET</span>
              <span className="text-[#F5F7FF] font-bold mt-0.5 block truncate">{sourceDataset}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">TRADE RECORD ID</span>
              <span className="text-[#43D9FF] font-bold mt-0.5 block">{tradeRecordId ?? 'REC-AUTO'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">REPORTING PERIOD</span>
              <span className="text-[#F5F7FF] font-bold mt-0.5 block">{period}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">COMMODITY CODE</span>
              <span className="text-[#F5F7FF] font-bold mt-0.5 block">HS {commodityCode}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#111A2B]/60 border border-[#8D9AB2]/20 text-[11px] leading-relaxed text-[#8D9AB2]">
            <strong className="text-[#F5F7FF]">PRIMARY SOURCE EVIDENCE:</strong> Customs declarations submitted by sovereign reporter jurisdiction ({reporterCountry}) matching bilateral declarations by partner jurisdiction ({partnerCountry}) for mineral {mineralName || 'Critical Mineral'}.
          </div>
        </div>
      )}

      {/* Category 2: Backend-Generated Risk Assessments */}
      {activeCategory === 'assessment' && (
        <div className="space-y-3 font-mono text-xs animate-in fade-in-0 duration-150">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">ANOMALY SCORE</span>
              <span className="text-base font-bold text-[#FF5B65] mt-0.5 block">{riskScore.toFixed(1)} / 100</span>
            </div>
            <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">RISK CLASSIFICATION</span>
              <span className="text-base font-bold text-[#F5F7FF] mt-0.5 block">{classification}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">POLICY VERSION</span>
              <span className="text-base font-bold text-[#43D9FF] mt-0.5 block">MineTrace v1.0</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#111A2B]/60 border border-[#8D9AB2]/20 text-[11px] leading-relaxed text-[#8D9AB2]">
            <strong className="text-[#FFB547]">DETERMINISTIC FORMULATION:</strong> Aggregated anomaly score computed using strict linear combination of four weighted trade rules (R1 Mirror Gap 30%, R2 Volume Spike 20%, R3 Route Concentration 30%, R4 Unit Price Dispersion 20%) plus independent OFAC sanctions verification.
          </div>
        </div>
      )}

      {/* Category 3: Missing Information */}
      {activeCategory === 'missing' && (
        <div className="space-y-3 font-mono text-xs animate-in fade-in-0 duration-150">
          <div className="p-3.5 rounded-lg bg-[#070A12] border border-[#7287FF]/30 space-y-2">
            <div className="flex items-center gap-2 text-[#7287FF] font-bold text-xs">
              <Info className="w-4 h-4" />
              <span>Baseline Sufficiency &amp; Missing Information Audit</span>
            </div>
            <p className="text-[#8D9AB2] text-[11px] leading-relaxed">
              When bilateral partner declarations or 3-year historical trade baselines are unavailable in the local repository, the rule engine marks the factor as <strong className="text-[#7287FF]">INSUFFICIENT_DATA</strong> rather than assuming zero risk.
            </p>
          </div>
        </div>
      )}

      {/* Category 4: AI Synthesis */}
      {activeCategory === 'ai' && (
        <div className="space-y-3 font-mono text-xs animate-in fade-in-0 duration-150">
          <div className="p-3.5 rounded-lg bg-[#111A2B] border border-[#20E09E]/30 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#20E09E] font-bold text-xs">
                <Bot className="w-4 h-4" />
                <span>Local RAG Intelligence Synthesis</span>
              </div>
              <span className="text-[10px] text-[#8D9AB2] px-2 py-0.5 rounded bg-[#070A12] border border-[#8D9AB2]/20">
                OLLAMA LOCAL LLM
              </span>
            </div>
            <p className="text-[#8D9AB2] text-[11px] leading-relaxed">
              AI explanations provide understandable summaries grounded strictly in retrieved SQLite evidence. Numerical claims are audited against SQLite truth.
            </p>
            <div className="p-2 rounded bg-[#070A12] border border-[#8D9AB2]/15 text-[10px] text-[#FFB547]">
              <strong>MANDATORY EVIDENCE NOTICE:</strong> AI synthesis is provided for analyst explanation only and is never presented or stored as primary evidence.
            </div>
            {onRequestAIExplanation && (
              <SecondaryButton
                size="sm"
                variant="surface"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#20E09E]" />}
                onClick={onRequestAIExplanation}
                className="text-xs font-mono mt-1"
              >
                Request AI Intelligence Explanation
              </SecondaryButton>
            )}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-[#8D9AB2]/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-[#8D9AB2]">
          <Lock className="w-3.5 h-3.5 text-[#20E09E]" />
          <span>FROZEN AT: {createdAt ? new Date(createdAt).toLocaleString() : 'RECORD INGESTION'}</span>
        </div>

        <PrimaryButton
          size="sm"
          leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
          onClick={onOpenEvidenceModal}
          className="text-xs font-mono"
        >
          INSPECT COMPLETE EVIDENCE DOSSIER
        </PrimaryButton>
      </div>
    </GlassCard>
  );
};
