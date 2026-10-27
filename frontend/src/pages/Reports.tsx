import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  RefreshCw,
  Radio,
  ShieldCheck,
  Hash,
  Layers,
} from 'lucide-react';
import { PDFReportSummary, RiskAnalysisResponse } from '@/types/api';
import { getReportsList, getRiskAnalysisList } from '@/services/api';
import { ReportGeneratorCard } from '@/components/reports/ReportGeneratorCard';
import { ReportHistoryTable } from '@/components/reports/ReportHistoryTable';
import { PDFPreviewModal } from '@/components/reports/PDFPreviewModal';
import { GlassCard } from '@/components/ui/GlassCard';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export const ReportsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [reports, setReports] = useState<PDFReportSummary[]>([]);
  const [analyses, setAnalyses] = useState<RiskAnalysisResponse[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<PDFReportSummary | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const analysisParam = searchParams.get('analysis');

  const loadData = useCallback(async () => {
    try {
      const [reportsRes, analysesRes] = await Promise.all([
        getReportsList(undefined, 1, 100),
        getRiskAnalysisList(0, 100),
      ]);

      setReports(reportsRes?.reports || []);

      const items = analysesRes?.analyses || [];
      setAnalyses(items);

      if (items.length > 0) {
        if (analysisParam && items.some((a) => a.analysis_id === analysisParam)) {
          setSelectedAnalysisId(analysisParam);
        } else if (!selectedAnalysisId) {
          setSelectedAnalysisId(items[0].analysis_id);
        }
      }
    } catch (err) {
      console.warn('[MineTrace Reports] Failed to load data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [analysisParam, selectedAnalysisId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleReportGenerated = (newReport: PDFReportSummary) => {
    setReports((prev) => [newReport, ...prev.filter((r) => r.report_id !== newReport.report_id)]);
  };

  const handleOpenPreview = (report: PDFReportSummary) => {
    setPreviewReport(report);
    setPreviewOpen(true);
  };

  // Metrics
  const totalReports = reports.length;
  const reportsWithEvidence = reports.filter((r) => r.has_evidence_snapshot).length;
  const reportsWithAI = reports.filter((r) => r.has_validated_ai_explanation).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#8D9AB2]/15">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FF] font-mono">
              Reports
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7287FF]/10 text-[#7287FF] border border-[#7287FF]/30">
              ISO 32000-1 COMPLIANT
            </span>
          </div>
          <p className="text-sm text-[#8D9AB2] mt-1 font-sans">
            Generate and review evidence-backed critical mineral risk reports.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 font-mono text-xs">
            <Radio className="w-3.5 h-3.5 text-[#20E09E] animate-pulse" />
            <span className="text-[#8D9AB2]">CATALOG:</span>
            <span className="font-bold text-[#F5F7FF]">LOCAL DISK STORAGE</span>
          </div>

          {/* Refresh Button */}
          <SecondaryButton
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 font-mono text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </SecondaryButton>
        </div>
      </div>

      {/* 2. Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
        <GlassCard className="p-4 border-[#8D9AB2]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8D9AB2] block">TOTAL REPORTS STORED</span>
            <span className="text-2xl font-bold text-[#F5F7FF] mt-0.5 block">
              {totalReports}
            </span>
            <span className="text-[10px] text-[#8D9AB2]">Indexed in SQLite metadata</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111A2B] text-[#43D9FF] border border-[#43D9FF]/30">
            <FileText className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-[#8D9AB2]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8D9AB2] block">WITH FROZEN EVIDENCE</span>
            <span className="text-2xl font-bold text-[#20E09E] mt-0.5 block">
              {reportsWithEvidence}
            </span>
            <span className="text-[10px] text-[#8D9AB2]">Phase 5 snapshot attached</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111A2B] text-[#20E09E] border border-[#20E09E]/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-[#8D9AB2]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8D9AB2] block">WITH GROUNDED AI</span>
            <span className="text-2xl font-bold text-[#7287FF] mt-0.5 block">
              {reportsWithAI}
            </span>
            <span className="text-[10px] text-[#8D9AB2]">Verified RAG synthesis</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111A2B] text-[#7287FF] border border-[#7287FF]/30">
            <Layers className="w-5 h-5" />
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-[#8D9AB2]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8D9AB2] block">INTEGRITY ALGORITHM</span>
            <span className="text-lg font-bold text-[#F5F7FF] mt-1 block">
              SHA-256 HASH
            </span>
            <span className="text-[10px] text-[#20E09E]">Tamper-evident sealing</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#111A2B] text-[#FFB547] border border-[#FFB547]/30">
            <Hash className="w-5 h-5" />
          </div>
        </GlassCard>
      </div>

      {/* 3. Report Generator Card */}
      <ReportGeneratorCard
        analyses={analyses}
        selectedAnalysisId={selectedAnalysisId}
        onSelectAnalysis={(id) => {
          setSelectedAnalysisId(id);
          setSearchParams({ analysis: id }, { replace: true });
        }}
        onReportGenerated={handleReportGenerated}
        onPreviewReport={handleOpenPreview}
        loadingAnalyses={loading}
      />

      {/* 4. Saved Report History Catalog */}
      <ReportHistoryTable
        reports={reports}
        loading={loading}
        onPreview={handleOpenPreview}
        onRefresh={handleRefresh}
      />

      {/* 5. PDF Modal Viewer */}
      <PDFPreviewModal
        report={previewReport}
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewReport(null);
        }}
      />
    </div>
  );
};
