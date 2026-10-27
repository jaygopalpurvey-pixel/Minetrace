import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RefreshCw, Radio } from 'lucide-react';
import { AIStatusResponse, RiskAnalysisResponse } from '@/types/api';
import { getAIStatus, getRiskAnalysisList } from '@/services/api';
import { AIStatusBanner } from '@/components/ai/AIStatusBanner';
import { AssessmentSelector } from '@/components/ai/AssessmentSelector';
import { SelectedAssessmentCard } from '@/components/ai/SelectedAssessmentCard';
import { AIExplanationPanel } from '@/components/ai/AIExplanationPanel';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export const AIIntelligencePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [analyses, setAnalyses] = useState<RiskAnalysisResponse[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const analysisParam = searchParams.get('analysis');

  const loadData = useCallback(async () => {
    try {
      const [statusRes, analysesRes] = await Promise.all([
        getAIStatus(),
        getRiskAnalysisList(0, 100),
      ]);

      setAiStatus(statusRes);

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
      console.warn('[MineTrace AI] Failed to load data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [analysisParam, selectedAnalysisId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectAnalysis = (analysisId: string) => {
    setSelectedAnalysisId(analysisId);
    setSearchParams({ analysis: analysisId }, { replace: true });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleNavigateToEvidence = (evidenceId: string) => {
    if (selectedAnalysisId) {
      navigate(`/evidence?analysis=${encodeURIComponent(selectedAnalysisId)}`);
    } else if (evidenceId) {
      navigate(`/evidence?analysis=${encodeURIComponent(evidenceId)}`);
    } else {
      navigate('/evidence');
    }
  };

  const selectedAssessment =
    analyses.find((a) => a.analysis_id === selectedAnalysisId) || analyses[0] || null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#8D9AB2]/15">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FF] font-mono">
              AI Intelligence
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/30">
              LOCAL RAG ENGINE
            </span>
          </div>
          <p className="text-sm text-[#8D9AB2] mt-1 font-sans">
            Investigate supply-chain risks with evidence-grounded AI explanations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Data Source Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 font-mono text-xs">
            <Radio className="w-3.5 h-3.5 text-[#20E09E] animate-pulse" />
            <span className="text-[#8D9AB2]">SOURCE:</span>
            <span className="font-bold text-[#F5F7FF]">
              {aiStatus?.offline_mode ? 'LOCAL VECTOR DB' : 'OFFLINE CHROMA'}
            </span>
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

      {/* 2. AI Subsystem Status Banner */}
      <AIStatusBanner status={aiStatus} loading={loading} />

      {/* 3. Target Risk Assessment Selector */}
      <AssessmentSelector
        analyses={analyses}
        selectedAnalysisId={selectedAnalysisId}
        onSelect={handleSelectAnalysis}
        loading={loading}
      />

      {/* 4. Selected Assessment Summary Card */}
      <SelectedAssessmentCard assessment={selectedAssessment} loading={loading} />

      {/* 5. Evidence-Grounded AI Explanation Panel */}
      <AIExplanationPanel
        selectedAssessment={selectedAssessment}
        onNavigateToEvidence={handleNavigateToEvidence}
      />
    </div>
  );
};
