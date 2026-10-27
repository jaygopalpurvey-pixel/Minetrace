import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Send,
  Square,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  FileCheck2,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { ExplainRequest, ExplainResponse, RiskAnalysisResponse } from '@/types/api';
import { explainRiskQuery } from '@/services/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface AIExplanationPanelProps {
  selectedAssessment: RiskAnalysisResponse | null;
  onNavigateToEvidence?: (evidenceId: string) => void;
}

const PRESET_PROMPTS = [
  { id: 'explain', label: 'Explain this risk assessment', query: 'Explain the risk assessment and primary drivers for this trade corridor.' },
  { id: 'evidence', label: 'Summarize supporting evidence', query: 'Summarize the empirical customs evidence and transaction observed values.' },
  { id: 'gaps', label: 'Identify missing information', query: 'Identify data gaps, unverified benchmarks, and missing trade statistics.' },
  { id: 'indicators', label: 'Explain risk indicators', query: 'Explain each evaluated anomaly indicator and triggered rule flag in detail.' },
  { id: 'investigator', label: 'Key investigator findings', query: 'Synthesize key findings and recommended next steps for a customs investigator.' },
];

export const AIExplanationPanel: React.FC<AIExplanationPanelProps> = ({
  selectedAssessment,
  onNavigateToEvidence,
}) => {
  const [question, setQuestion] = useState<string>('Explain the risk assessment and primary drivers for this trade corridor.');
  const [useTemplateOnly, setUseTemplateOnly] = useState<boolean>(false);
  const [topK, setTopK] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ExplainResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedChunks, setExpandedChunks] = useState<Record<string, boolean>>({});

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleRunExplanation = async (overridePrompt?: string) => {
    const q = (overridePrompt ?? question).trim();
    if (!q || !selectedAssessment) return;

    if (overridePrompt) {
      setQuestion(overridePrompt);
    }

    // Cancel existing in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const payload: ExplainRequest = {
      question: q,
      analysis_id: selectedAssessment.analysis_id,
      top_k: topK,
      use_template_only: useTemplateOnly,
    };

    try {
      const data = await explainRiskQuery(payload, controller.signal);
      if (data) {
        setResponse(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // user aborted
        return;
      }
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to generate AI explanation. Please check backend connection.'
      );
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (!response?.answer) return;
    navigator.clipboard.writeText(response.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setQuestion(PRESET_PROMPTS[0].query);
    setResponse(null);
    setError(null);
  };

  const toggleChunk = (chunkId: string) => {
    setExpandedChunks((prev) => ({
      ...prev,
      [chunkId]: !prev[chunkId],
    }));
  };

  return (
    <GlassCard className="p-5 border-[#8D9AB2]/20 font-mono text-xs space-y-4">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F5F7FF]">
              Evidence-Grounded AI Analysis Workspace
            </h2>
            <p className="text-[11px] text-[#8D9AB2]">
              Queries are grounded exclusively in SQLite trade records & ChromaDB methodology passages.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {response && (
            <SecondaryButton size="sm" onClick={handleReset} className="text-xs">
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              New Analysis
            </SecondaryButton>
          )}
        </div>
      </div>

      {/* Investigator Action Presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-[#8D9AB2] uppercase tracking-wider block">
          Investigator Analysis Prompts
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_PROMPTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={loading || !selectedAssessment}
              onClick={() => handleRunExplanation(preset.query)}
              className="px-2.5 py-1.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/20 hover:border-[#43D9FF]/50 text-[#8D9AB2] hover:text-[#43D9FF] text-[11px] transition-all disabled:opacity-50"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            rows={3}
            value={question}
            disabled={loading || !selectedAssessment}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask an analytical question about this critical mineral supply chain assessment..."
            className="w-full p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/25 focus:border-[#43D9FF] text-xs text-[#F5F7FF] placeholder-[#8D9AB2]/60 focus:outline-none resize-none font-sans leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Execution Options Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4 text-[11px] text-[#8D9AB2]">
            {/* Force Deterministic Template Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useTemplateOnly}
                onChange={(e) => setUseTemplateOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#070A12] border-[#8D9AB2]/30 text-[#43D9FF] focus:ring-0 focus:ring-offset-0"
              />
              <span>Force Deterministic Template</span>
            </label>

            {/* Top K Chunks */}
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-[#8D9AB2]" />
              <span>Chunks:</span>
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="bg-[#070A12] border border-[#8D9AB2]/20 rounded px-1.5 py-0.5 text-xs text-[#F5F7FF]"
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              <SecondaryButton
                size="sm"
                onClick={handleStopGeneration}
                className="text-xs text-[#FF5B65] border-[#FF5B65]/40 hover:bg-[#FF5B65]/10"
              >
                <Square className="w-3.5 h-3.5 mr-1" />
                Stop Generation
              </SecondaryButton>
            ) : (
              <PrimaryButton
                size="sm"
                disabled={!selectedAssessment || !question.trim()}
                onClick={() => handleRunExplanation()}
                className="text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Generate Grounded Explanation
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>

      {/* Error State with Retry */}
      {error && (
        <div className="p-3.5 rounded-xl bg-[#FF5B65]/10 border border-[#FF5B65]/30 flex items-start justify-between gap-3 text-xs text-[#FF5B65]">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Inference Request Failed</span>
              <p className="text-[11px] text-[#F5F7FF]/90 font-sans mt-0.5 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          <SecondaryButton
            size="sm"
            onClick={() => handleRunExplanation()}
            className="text-xs shrink-0"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </SecondaryButton>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-5 rounded-xl bg-[#070A12] border border-[#8D9AB2]/20 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-4 w-48 bg-[#111A2B] rounded" />
            <div className="h-4 w-24 bg-[#111A2B] rounded" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3.5 w-full bg-[#111A2B] rounded" />
            <div className="h-3.5 w-5/6 bg-[#111A2B] rounded" />
            <div className="h-3.5 w-4/6 bg-[#111A2B] rounded" />
          </div>
          <div className="flex items-center gap-2 pt-2 text-[#43D9FF] text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Synthesizing empirical evidence & verifying numerical claims...</span>
          </div>
        </div>
      )}

      {/* Generated Response View */}
      {response && !loading && (
        <div className="space-y-4 pt-2">
          {/* Response Metadata Bar */}
          <div className="p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/20 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[#8D9AB2]">MODE:</span>
                <span className="text-[#43D9FF] font-bold">
                  {response.generation_mode}
                </span>
              </div>
              {response.model_name && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8D9AB2]">MODEL:</span>
                  <span className="text-[#F5F7FF] font-semibold">{response.model_name}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-[#8D9AB2]">CLAIM AUDIT:</span>
                <StatusBadge
                  status={response.validation_status}
                  variant={
                    response.validation_status === 'VALID'
                      ? 'healthy'
                      : response.validation_status === 'WARNINGS'
                      ? 'warning'
                      : 'error'
                  }
                  size="sm"
                />
              </div>
            </div>

            <SecondaryButton
              size="sm"
              onClick={handleCopyResponse}
              className="text-xs flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#20E09E]" />
                  <span className="text-[#20E09E]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </SecondaryButton>
          </div>

          {/* Explanation Text Body */}
          <div className="p-5 rounded-xl bg-[#070A12] border border-[#8D9AB2]/20 space-y-4 text-xs font-sans leading-relaxed text-[#F5F7FF]">
            <div className="prose prose-invert max-w-none space-y-3 font-sans text-xs">
              {response.answer.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Headings
                if (trimmed.startsWith('###')) {
                  return (
                    <h3
                      key={idx}
                      className="text-sm font-bold font-mono text-[#43D9FF] pt-2 pb-1 border-b border-[#8D9AB2]/15"
                    >
                      {trimmed.replace(/^###\s*/, '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('##')) {
                  return (
                    <h2
                      key={idx}
                      className="text-base font-bold font-mono text-[#F5F7FF] pt-2 pb-1 border-b border-[#8D9AB2]/20"
                    >
                      {trimmed.replace(/^##\s*/, '')}
                    </h2>
                  );
                }

                // Bullet lists
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  const items = trimmed.split('\n').map((li) => li.replace(/^[-*]\s*/, ''));
                  return (
                    <ul key={idx} className="list-disc pl-5 space-y-1 text-[#F5F7FF]/90">
                      {items.map((it, itemIdx) => (
                        <li key={itemIdx}>{it}</li>
                      ))}
                    </ul>
                  );
                }

                // Regular Paragraph
                return (
                  <p key={idx} className="text-[#F5F7FF]/90 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Numerical Claim Validation Audit Section */}
          {response.numerical_claims && response.numerical_claims.length > 0 && (
            <div className="p-4 rounded-xl bg-[#090D17] border border-[#8D9AB2]/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#43D9FF] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Numerical Claim Verification Audit
                </span>
                <span className="text-[10px] text-[#8D9AB2]">
                  {response.numerical_claims.length} claims audited against SQLite truth
                </span>
              </div>

              <div className="space-y-2">
                {response.numerical_claims.map((claim, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          status={claim.verified ? 'VERIFIED' : 'UNVERIFIED'}
                          variant={claim.verified ? 'healthy' : 'error'}
                          size="sm"
                        />
                        <span className="text-[#F5F7FF] font-semibold">{claim.claim}</span>
                      </div>
                      <p className="text-[11px] text-[#8D9AB2] font-sans">{claim.notes}</p>
                    </div>

                    {claim.expected_value !== undefined && (
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-[#8D9AB2] block">DATABASE VALUE</span>
                        <span className="text-xs font-mono font-bold text-[#43D9FF]">
                          {String(claim.expected_value)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supporting Document Chunks (Expandable Vector Citations) */}
          {response.supporting_document_chunks && response.supporting_document_chunks.length > 0 && (
            <div className="p-4 rounded-xl bg-[#090D17] border border-[#8D9AB2]/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7287FF] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Retrieved Methodology & Policy Passages
                </span>
                <span className="text-[10px] text-[#8D9AB2]">
                  ChromaDB Semantic Retrieval ({response.supporting_document_chunks.length})
                </span>
              </div>

              <div className="space-y-2">
                {response.supporting_document_chunks.map((chunk) => {
                  const isExp = Boolean(expandedChunks[chunk.chunk_id]);
                  return (
                    <div
                      key={chunk.chunk_id}
                      className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 text-xs space-y-1.5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleChunk(chunk.chunk_id)}
                        className="w-full flex items-center justify-between text-left hover:text-[#43D9FF] transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isExp ? (
                            <ChevronDown className="w-3.5 h-3.5 text-[#43D9FF] shrink-0" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-[#8D9AB2] shrink-0" />
                          )}
                          <span className="font-semibold text-[#F5F7FF] truncate">
                            {chunk.filename}
                          </span>
                          <span className="text-[10px] text-[#8D9AB2]">
                            (Chunk: {chunk.chunk_id})
                          </span>
                        </div>

                        {chunk.relevance_score !== null && chunk.relevance_score !== undefined && (
                          <span className="text-[10px] text-[#7287FF] shrink-0">
                            Similarity: {(chunk.relevance_score * 100).toFixed(1)}%
                          </span>
                        )}
                      </button>

                      {isExp && (
                        <div className="p-3 rounded bg-[#111A2B] border border-[#8D9AB2]/20 text-[11px] font-mono text-[#8D9AB2] whitespace-pre-wrap leading-relaxed animate-in fade-in-0 duration-150">
                          {chunk.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Supporting Evidence IDs */}
          {response.supporting_evidence_ids && response.supporting_evidence_ids.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#8D9AB2] flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-[#20E09E]" />
                Point-in-Time Evidence References:
              </span>
              {response.supporting_evidence_ids.map((evId) => (
                <button
                  key={evId}
                  type="button"
                  onClick={() => onNavigateToEvidence && onNavigateToEvidence(evId)}
                  className="px-2 py-0.5 rounded bg-[#111A2B] border border-[#20E09E]/30 text-[#20E09E] hover:border-[#20E09E] text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>{evId}</span>
                  <ExternalLink className="w-3 h-3 text-[#8D9AB2]" />
                </button>
              ))}
            </div>
          )}

          {/* Statutory Disclaimer */}
          <div className="p-3 rounded-xl bg-[#090D17] border border-[#8D9AB2]/15 text-[11px] text-[#8D9AB2] leading-relaxed">
            <strong className="text-[#F5F7FF]">Regulatory Notice: </strong>
            {response.disclaimer}
          </div>
        </div>
      )}
    </GlassCard>
  );
};
