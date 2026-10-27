import React from 'react';
import {
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Info,
  Server,
} from 'lucide-react';
import { AIStatusResponse } from '@/types/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface AIStatusBannerProps {
  status: AIStatusResponse | null;
  loading?: boolean;
}

export const AIStatusBanner: React.FC<AIStatusBannerProps> = ({ status, loading = false }) => {
  if (loading) {
    return (
      <GlassCard className="p-4 border-[#8D9AB2]/20 animate-pulse font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-[#111A2B]" />
          <div className="h-4 w-48 bg-[#111A2B] rounded" />
        </div>
      </GlassCard>
    );
  }

  const isOllamaOnline = Boolean(status?.ollama_reachable && status?.ollama_model_available);
  const isChromaOnline = Boolean(status?.chromadb_available);

  return (
    <GlassCard className="p-4 border-[#8D9AB2]/20 font-mono text-xs space-y-3">
      {/* Top row: Badges and Core Architecture */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#F5F7FF] text-sm">
                Local RAG Intelligence Engine
              </span>
              <StatusBadge
                status={status?.rag_service_available ? 'OPERATIONAL' : 'OFFLINE'}
                variant={status?.rag_service_available ? 'healthy' : 'error'}
                size="sm"
              />
            </div>
            <p className="text-[11px] text-[#8D9AB2] mt-0.5">
              Evidence-grounded local retrieval & explanation pipeline without cloud telemetry.
            </p>
          </div>
        </div>

        {/* Security / Isolation Tag */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded bg-[#20E09E]/10 border border-[#20E09E]/30 text-[#20E09E] flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ZERO CLOUD EGRESS</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/20 text-[#8D9AB2] text-[11px]">
            AIR-GAPPED COMPATIBLE
          </div>
        </div>
      </div>

      {/* Subsystem Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#8D9AB2]/15">
        {/* ChromaDB Vector Storage */}
        <div className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Database className="w-3.5 h-3.5 text-[#43D9FF] shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#8D9AB2] block">VECTOR RETRIEVAL</span>
              <span className="text-[#F5F7FF] font-semibold text-[11px] truncate block">
                {isChromaOnline
                  ? `ChromaDB (${status?.indexed_chunks_count ?? 0} Chunks)`
                  : 'Vector Index Offline'}
              </span>
            </div>
          </div>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isChromaOnline ? 'bg-[#20E09E]' : 'bg-[#FF5B65]'
            }`}
          />
        </div>

        {/* Local Embeddings */}
        <div className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-3.5 h-3.5 text-[#7287FF] shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#8D9AB2] block">EMBEDDINGS MODEL</span>
              <span className="text-[#F5F7FF] font-semibold text-[11px] truncate block">
                {status?.embedding_model || 'Local Cosine Hash'}
              </span>
            </div>
          </div>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              status?.embedding_model_available ? 'bg-[#20E09E]' : 'bg-[#FFB547]'
            }`}
          />
        </div>

        {/* Local Ollama / Deterministic Fallback */}
        <div className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Server className="w-3.5 h-3.5 text-[#FFB547] shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-[#8D9AB2] block">INFERENCE RUNTIME</span>
              <span className="text-[#F5F7FF] font-semibold text-[11px] truncate block">
                {isOllamaOnline
                  ? `Ollama: ${status?.ollama_model}`
                  : 'Deterministic Template Synthesizer'}
              </span>
            </div>
          </div>
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOllamaOnline ? 'bg-[#20E09E]' : 'bg-[#43D9FF]'
            }`}
          />
        </div>
      </div>

      {/* Warnings / Explanations when Ollama is in fallback mode */}
      {!isOllamaOnline && status?.warnings && status.warnings.length > 0 && (
        <div className="p-2.5 rounded-lg bg-[#FFB547]/10 border border-[#FFB547]/25 flex items-start gap-2 text-[11px] text-[#FFB547]">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block">DETERMINISTIC SYNTHESIZER ACTIVE</span>
            <p className="text-[#F5F7FF]/90 font-sans text-xs leading-relaxed">
              Ollama is not running locally. The RAG pipeline will automatically generate
              verifiable, deterministic evidence explanations from SQLite facts and vector references
              with 100% offline consistency.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
