import React, { useState } from 'react';
import {
  FileText,
  FileDown,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Hash,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { GeneratePDFReportRequest, PDFReportSummary, RiskAnalysisResponse } from '@/types/api';
import { generatePdfReport, getReportDownloadUrl } from '@/services/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface ReportGeneratorCardProps {
  analyses: RiskAnalysisResponse[];
  selectedAnalysisId: string | null;
  onSelectAnalysis: (analysisId: string) => void;
  onReportGenerated: (report: PDFReportSummary) => void;
  onPreviewReport: (report: PDFReportSummary) => void;
  loadingAnalyses?: boolean;
}

export const ReportGeneratorCard: React.FC<ReportGeneratorCardProps> = ({
  analyses,
  selectedAnalysisId,
  onSelectAnalysis,
  onReportGenerated,
  onPreviewReport,
  loadingAnalyses = false,
}) => {
  const [includeAI, setIncludeAI] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<PDFReportSummary | null>(null);

  const selectedAssessment =
    analyses.find((a) => a.analysis_id === selectedAnalysisId) || analyses[0] || null;

  const handleGenerate = async () => {
    if (!selectedAssessment) return;

    setGenerating(true);
    setError(null);

    const payload: GeneratePDFReportRequest = {
      analysis_id: selectedAssessment.analysis_id,
      include_ai_explanation: includeAI,
      notes: notes.trim() || undefined,
    };

    try {
      const result = await generatePdfReport(payload);
      if (result) {
        setLastGenerated(result);
        onReportGenerated(result);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate PDF evidence report. Please check backend connection.'
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <GlassCard className="p-5 border-[#8D9AB2]/20 font-mono text-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F5F7FF]">
              Generate Printable Evidence Dossier
            </h2>
            <p className="text-[11px] text-[#8D9AB2]">
              Compiles authoritative risk engine telemetry, rule proofs, audit events, and SHA-256 seal.
            </p>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/20 text-[#8D9AB2] text-[11px] self-start sm:self-auto">
          FORMAT: ISO 32000-1 A4 MULTI-PAGE
        </div>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Assessment & Corridor */}
        <div className="space-y-3">
          <label className="text-[10px] text-[#8D9AB2] uppercase tracking-wider block">
            Target Risk Assessment
          </label>
          <select
            value={selectedAssessment?.analysis_id || ''}
            disabled={generating || loadingAnalyses || analyses.length === 0}
            onChange={(e) => onSelectAnalysis(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-[#070A12] border border-[#8D9AB2]/25 text-xs text-[#F5F7FF] focus:outline-none focus:border-[#43D9FF]"
          >
            {analyses.map((a) => (
              <option key={a.analysis_id} value={a.analysis_id}>
                {a.reporter_country_code} → {a.partner_country_code} | {a.mineral_type || 'Mineral'} ({a.period}) - Score:{' '}
                {a.combined_anomaly_score.toFixed(1)}
              </option>
            ))}
          </select>

          {/* Assessment Summary Quick Strip */}
          {selectedAssessment && (
            <div className="p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xs text-[#F5F7FF]">
                  <span className="text-[#43D9FF]">{selectedAssessment.reporter_country_code}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8D9AB2]" />
                  <span className="text-[#7287FF]">{selectedAssessment.partner_country_code}</span>
                </div>
                <StatusBadge
                  status={selectedAssessment.classification || 'UNCLASSIFIED'}
                  variant={
                    selectedAssessment.classification === 'RED'
                      ? 'error'
                      : selectedAssessment.classification === 'AMBER'
                      ? 'warning'
                      : 'healthy'
                  }
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8D9AB2]">
                <span>Mineral: {selectedAssessment.mineral_type || 'Critical Mineral'}</span>
                <span className="font-bold text-[#FF5B65]">
                  Score: {selectedAssessment.combined_anomaly_score.toFixed(1)} / 100
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Report Options and Notes */}
        <div className="space-y-3">
          <label className="text-[10px] text-[#8D9AB2] uppercase tracking-wider block">
            Dossier Inclusions & Scope
          </label>

          <div className="p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15 space-y-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#F5F7FF] select-none">
              <input
                type="checkbox"
                checked={includeAI}
                disabled={generating}
                onChange={(e) => setIncludeAI(e.target.checked)}
                className="w-4 h-4 rounded bg-[#111A2B] border-[#8D9AB2]/30 text-[#43D9FF] focus:ring-0"
              />
              <div>
                <span className="block font-semibold">Include Validated AI Explanation</span>
                <span className="text-[10px] text-[#8D9AB2] block">
                  Appends verified local RAG synthesis and numerical claim audit.
                </span>
              </div>
            </label>
          </div>

          <div>
            <label className="text-[10px] text-[#8D9AB2] uppercase tracking-wider block mb-1">
              Analyst Scope Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              disabled={generating}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prepared for quarterly customs enforcement review..."
              className="w-full p-2.5 rounded-xl bg-[#070A12] border border-[#8D9AB2]/25 text-xs text-[#F5F7FF] placeholder-[#8D9AB2]/60 focus:outline-none focus:border-[#43D9FF] font-sans"
            />
          </div>
        </div>
      </div>

      {/* Generate Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#8D9AB2]/15">
        <div className="text-[11px] text-[#8D9AB2] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#20E09E]" />
          <span>Output is cryptographically hashed with SHA-256 for audit immutability.</span>
        </div>

        <PrimaryButton
          disabled={generating || !selectedAssessment}
          onClick={handleGenerate}
          className="text-xs flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Compiling PDF Dossier...</span>
            </>
          ) : (
            <>
              <FileDown className="w-3.5 h-3.5" />
              <span>Generate PDF Report</span>
            </>
          )}
        </PrimaryButton>
      </div>

      {/* Generation Error State */}
      {error && (
        <div className="p-3.5 rounded-xl bg-[#FF5B65]/10 border border-[#FF5B65]/30 flex items-start gap-2.5 text-xs text-[#FF5B65]">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Report Generation Failed</span>
            <p className="text-[11px] text-[#F5F7FF]/90 font-sans mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Last Generated Report Success Banner */}
      {lastGenerated && (
        <div className="p-4 rounded-xl bg-[#20E09E]/10 border border-[#20E09E]/30 space-y-2.5 animate-in fade-in-0 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#20E09E] shrink-0" />
              <div>
                <span className="font-bold text-[#F5F7FF] text-xs">
                  PDF Report Compiled Successfully
                </span>
                <span className="text-[11px] text-[#8D9AB2] block">
                  REF: {lastGenerated.report_id} // Size:{' '}
                  {lastGenerated.file_size_bytes
                    ? (lastGenerated.file_size_bytes / 1024).toFixed(1)
                    : '14.5'}{' '}
                  KB
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SecondaryButton
                size="sm"
                onClick={() => onPreviewReport(lastGenerated)}
                className="text-xs flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#43D9FF]" />
                <span>Preview</span>
              </SecondaryButton>

              <a
                href={getReportDownloadUrl(lastGenerated.report_id)}
                download={`${lastGenerated.report_id}.pdf`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#20E09E] hover:bg-[#20E09E]/90 text-[#070A12] font-bold text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          {(lastGenerated.content_hash || lastGenerated.sha256_hash) && (
            <div className="flex items-center gap-2 pt-1 border-t border-[#20E09E]/20 text-[10px] text-[#8D9AB2]">
              <Hash className="w-3 h-3 text-[#20E09E]" />
              <span className="font-mono text-[#20E09E] truncate">
                SHA-256: {lastGenerated.content_hash || lastGenerated.sha256_hash}
              </span>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};
