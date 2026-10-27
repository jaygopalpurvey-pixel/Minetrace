import React, { useState } from 'react';
import { ShieldAlert, Eye, X, ShieldCheck } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { RankingEntry } from '@/types/api';

export interface PriorityInvestigationsPanelProps {
  rankings: RankingEntry[];
  loading?: boolean;
}

export const PriorityInvestigationsPanel: React.FC<PriorityInvestigationsPanelProps> = ({
  rankings,
  loading = false,
}) => {
  const [selectedRecord, setSelectedRecord] = useState<RankingEntry | null>(null);

  return (
    <GlassCard className="p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FF5B65]/10 text-[#FF5B65] border border-[#FF5B65]/20 shadow-[0_0_12px_rgba(255,91,101,0.2)]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-[#F5F7FF] tracking-tight">
                Priority Investigations
              </h3>
              <p className="text-[11px] text-[#8D9AB2]">
                Highest-scoring saved critical mineral trade anomalies.
              </p>
            </div>
          </div>

          <StatusBadge
            status={rankings.length > 0 ? `${rankings.length} PRIORITIES` : 'NO ANOMALIES'}
            variant={rankings.length > 0 ? 'error' : 'neutral'}
            size="sm"
          />
        </div>

        {/* Findings List or Empty State */}
        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-[#111A2B]/60 animate-pulse" />
            ))}
          </div>
        ) : rankings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-[#8D9AB2]/15 bg-[#0D1320]/40 my-2">
            <ShieldCheck className="w-8 h-8 text-[#20E09E]/60 mb-2" />
            <span className="text-xs font-mono font-semibold text-[#F5F7FF]">
              No High-Risk Investigations Pending
            </span>
            <p className="text-[11px] text-[#8D9AB2] mt-1 max-w-xs leading-relaxed">
              No saved trade records currently breach the anomaly thresholds (R1–R5).
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {rankings.slice(0, 5).map((entry) => {
              const isRed = entry.classification === 'RED';
              const isAmber = entry.classification === 'AMBER';

              return (
                <div
                  key={entry.analysis_id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#111A2B]/60 border border-[#8D9AB2]/15 hover:border-[#43D9FF]/40 hover:bg-[#111A2B]/90 transition-all duration-200"
                >
                  {/* Left Classification Accent Bar */}
                  <span
                    className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r ${
                      isRed ? 'bg-[#FF5B65]' : isAmber ? 'bg-[#FFB547]' : 'bg-[#8D9AB2]'
                    }`}
                  />

                  {/* Mineral & Corridor Details */}
                  <div className="flex items-start gap-3 min-w-0 pl-2">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#F5F7FF] truncate">
                          {entry.mineral_type || `HS ${entry.commodity_code}`}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#070A12] text-[#43D9FF] border border-[#43D9FF]/20">
                          {entry.reporter_country_code} → {entry.partner_country_code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#8D9AB2] mt-0.5">
                        <span>Period: {entry.period}</span>
                        <span>•</span>
                        <span className="truncate">ID: {entry.analysis_id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>

                  {/* Score, Classification & Action */}
                  <div className="flex items-center gap-3 shrink-0 pl-2 sm:pl-0">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-mono font-bold text-[#F5F7FF] tabular-nums">
                          {entry.anomaly_score.toFixed(1)}
                        </span>
                        <span className="text-[10px] font-mono text-[#8D9AB2]/70">/ 100</span>
                      </div>
                      <span
                        className={`text-[9px] font-mono uppercase font-semibold ${
                          isRed ? 'text-[#FF5B65]' : isAmber ? 'text-[#FFB547]' : 'text-[#8D9AB2]'
                        }`}
                      >
                        {entry.classification || entry.score_completeness}
                      </span>
                    </div>

                    <SecondaryButton
                      size="sm"
                      variant="surface"
                      leftIcon={<Eye className="w-3.5 h-3.5 text-[#43D9FF]" />}
                      onClick={() => setSelectedRecord(entry)}
                      className="text-xs font-mono px-2.5 py-1"
                    >
                      INSPECT
                    </SecondaryButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#8D9AB2]/10 flex items-center justify-between text-[11px] font-mono text-[#8D9AB2]">
        <span>Tie-Breaking: Score DESC → Created DESC</span>
        <span className="text-[#43D9FF]">Ranked by Priority</span>
      </div>

      {/* Investigation Details Modal Dialog */}
      <Dialog.Root open={Boolean(selectedRecord)} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-[#070A12]/80 backdrop-blur-sm animate-in fade-in-0 duration-200" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl bg-[#090D17] border border-[#8D9AB2]/25 p-6 shadow-2xl outline-none animate-in zoom-in-95 duration-200">
            {selectedRecord && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#8D9AB2]/15 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-[#FF5B65]/10 text-[#FF5B65] border border-[#FF5B65]/20">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-mono text-[#F5F7FF]">
                        INVESTIGATION DOSSIER
                      </h4>
                      <p className="text-[10px] font-mono text-[#8D9AB2]">
                        ANALYSIS ID: {selectedRecord.analysis_id}
                      </p>
                    </div>
                  </div>

                  <Dialog.Close asChild>
                    <button className="p-1.5 rounded-lg text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Key metadata grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#0D1320] p-3.5 rounded-lg border border-[#8D9AB2]/15">
                  <div>
                    <span className="text-[#8D9AB2] text-[10px] block">MINERAL COMMODITY</span>
                    <span className="font-bold text-[#F5F7FF]">
                      {selectedRecord.mineral_type || selectedRecord.commodity_code}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8D9AB2] text-[10px] block">TRADE CORRIDOR</span>
                    <span className="font-bold text-[#43D9FF]">
                      {selectedRecord.reporter_country_code} → {selectedRecord.partner_country_code}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8D9AB2] text-[10px] block">ANOMALY SCORE</span>
                    <span className="font-bold text-[#FF5B65] text-base tabular-nums">
                      {selectedRecord.anomaly_score.toFixed(1)} / 100
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8D9AB2] text-[10px] block">CLASSIFICATION TIER</span>
                    <span className="font-bold text-[#F5F7FF]">
                      {selectedRecord.classification || 'INSUFFICIENT DATA'}
                    </span>
                  </div>
                </div>

                {/* Evaluated Rules List */}
                <div>
                  <span className="text-xs font-mono text-[#8D9AB2] block mb-2 font-medium">
                    EVALUATED RISK RULES:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                    {selectedRecord.evaluated_rules?.length > 0 ? (
                      selectedRecord.evaluated_rules.map((r) => (
                        <span key={r} className="px-2 py-0.5 rounded bg-[#111A2B] text-[#43D9FF] border border-[#43D9FF]/20">
                          Rule {r}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-[#8D9AB2]">R1 Mirror Gap, R2 Volume, R3 Transit, R4 Price, R5 OFAC</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#8D9AB2]/15 flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <SecondaryButton size="sm">Dismiss</SecondaryButton>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </GlassCard>
  );
};
