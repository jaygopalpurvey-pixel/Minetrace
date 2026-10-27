import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Globe2,
  Sparkles,
  FileDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { generatePdfReport } from '@/services/api';
import { PDFReportSummary } from '@/types/api';

export interface InvestigationWorkflowBarProps {
  analysisId: string;
  mineralName?: string | null;
  originCountry: string;
  destCountry: string;
  onOpenEvidence: () => void;
}

export const InvestigationWorkflowBar: React.FC<InvestigationWorkflowBarProps> = ({
  analysisId,
  mineralName,
  originCountry,
  destCountry,
  onOpenEvidence,
}) => {
  const navigate = useNavigate();
  const [generatingReport, setGeneratingReport] = useState<boolean>(false);
  const [reportResult, setReportResult] = useState<PDFReportSummary | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);

  const handleGeneratePdf = async () => {
    setGeneratingReport(true);
    setReportError(null);
    try {
      const summary = await generatePdfReport(analysisId);
      if (summary) {
        setReportResult(summary);
      } else {
        setReportError('Report engine offline or analysis record not found.');
      }
    } catch {
      setReportError('Failed to generate PDF evidence report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleNavigateExplorer = () => {
    navigate('/explorer');
  };

  const handleNavigateAI = () => {
    const q = `Explain the critical mineral supply chain risk and anomaly drivers for ${mineralName || 'mineral'} trade between ${originCountry} and ${destCountry} (Analysis ID: ${analysisId})`;
    navigate(`/ai?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="p-4 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 space-y-3 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#F5F7FF] uppercase tracking-wider">
          Analyst Investigation Workflow Actions
        </span>
        <span className="text-[10px] text-[#8D9AB2]">
          CONNECTED APPLICATION WORKSPACES
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* 1. Evidence Inspection */}
        <PrimaryButton
          size="sm"
          leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
          onClick={onOpenEvidence}
          className="text-xs justify-center"
        >
          INSPECT EVIDENCE PROOF
        </PrimaryButton>

        {/* 2. Supply Chain Explorer Navigation */}
        <SecondaryButton
          size="sm"
          variant="surface"
          leftIcon={<Globe2 className="w-3.5 h-3.5 text-[#43D9FF]" />}
          onClick={handleNavigateExplorer}
          className="text-xs"
        >
          VIEW ON 3D EXPLORER
        </SecondaryButton>

        {/* 3. AI Assistant Explanation */}
        <SecondaryButton
          size="sm"
          variant="surface"
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#20E09E]" />}
          onClick={handleNavigateAI}
          className="text-xs"
        >
          ASK AI ASSISTANT
        </SecondaryButton>

        {/* 4. Generate Printable PDF Report */}
        <SecondaryButton
          size="sm"
          variant="surface"
          leftIcon={
            generatingReport ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFB547]" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-[#FFB547]" />
            )
          }
          onClick={handleGeneratePdf}
          disabled={generatingReport}
          className="text-xs border-[#FFB547]/30 text-[#FFB547] hover:bg-[#FFB547]/10"
        >
          {generatingReport ? 'GENERATING PDF...' : 'GENERATE PDF REPORT'}
        </SecondaryButton>
      </div>

      {/* Report Generation Result Banner */}
      {reportResult && (
        <div className="p-3 rounded-lg bg-[#20E09E]/10 border border-[#20E09E]/30 text-xs flex items-center justify-between gap-3 text-[#20E09E] animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              PDF Report generated successfully: <strong>{reportResult.file_name || reportResult.report_id}</strong> ({((reportResult.file_size_bytes || 14000) / 1024).toFixed(1)} KB)
            </span>
          </div>
          <a
            href={reportResult.download_url}
            download={reportResult.file_name}
            className="px-3 py-1 rounded bg-[#20E09E] text-[#070A12] font-bold text-xs hover:bg-[#20E09E]/90 transition-colors shrink-0"
          >
            DOWNLOAD PDF
          </a>
        </div>
      )}

      {/* Report Generation Error */}
      {reportError && (
        <div className="p-3 rounded-lg bg-[#FF5B65]/10 border border-[#FF5B65]/30 text-xs flex items-center gap-2 text-[#FF5B65]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{reportError}</span>
        </div>
      )}
    </div>
  );
};
