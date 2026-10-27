import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  FileCheck2,
  Database,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { EvidenceRecordItem } from '@/components/evidence/EvidenceRecordsTable';
import { EvidenceSnapshotResponse, EvidenceValidationResponse } from '@/types/api';
import { getEvidenceSnapshot, validateEvidence } from '@/services/api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface EvidenceDetailDrawerProps {
  record: EvidenceRecordItem | null;
  open: boolean;
  onClose: () => void;
}

export const EvidenceDetailDrawer: React.FC<EvidenceDetailDrawerProps> = ({
  record,
  open,
  onClose,
}) => {
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = useState<EvidenceSnapshotResponse | null>(null);
  const [validation, setValidation] = useState<EvidenceValidationResponse | null>(null);
  const [validating, setValidating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!open || !record) {
      setSnapshot(null);
      setValidation(null);
      return;
    }

    const loadSnapshot = async () => {
      setLoading(true);
      try {
        const data = await getEvidenceSnapshot(record.analysis_id);
        setSnapshot(data);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };

    loadSnapshot();
  }, [open, record]);

  const handleRunValidation = async () => {
    if (!record) return;
    setValidating(true);
    try {
      const res = await validateEvidence(record.analysis_id);
      setValidation(res);
    } catch {
      //
    } finally {
      setValidating(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(val) => !val && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#070A12]/80 backdrop-blur-sm animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-[#090D17] border-l border-[#8D9AB2]/25 p-6 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col justify-between font-mono text-xs">
          {/* Drawer Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#8D9AB2]/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#20E09E]/30 text-[#20E09E]">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Dialog.Title className="text-base font-bold text-[#F5F7FF]">
                    Evidence Snapshot Dossier
                  </Dialog.Title>
                  <StatusBadge status="POINT-IN-TIME PROOF" variant="healthy" size="sm" />
                  {loading && (
                    <RefreshCw className="w-3.5 h-3.5 text-[#43D9FF] animate-spin" />
                  )}
                </div>
                <Dialog.Description className="text-[11px] text-[#8D9AB2] mt-0.5">
                  SNAPSHOT REF: {record.snapshot_id} // ANALYSIS ID: {record.analysis_id}
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className="p-1.5 rounded-lg text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B] transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Drawer Content */}
          <div className="my-4 space-y-4 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">
            {/* Corridor Overview */}
            <div className="p-3.5 rounded-xl bg-[#111A2B] border border-[#8D9AB2]/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8D9AB2] block">BILATERAL CORRIDOR</span>
                <div className="flex items-center gap-2 mt-0.5 text-sm font-bold text-[#F5F7FF]">
                  <span className="text-[#43D9FF]">{record.reporter_country}</span>
                  <ArrowRight className="w-4 h-4 text-[#8D9AB2]" />
                  <span className="text-[#7287FF]">{record.partner_country}</span>
                </div>
                <span className="text-[11px] text-[#8D9AB2] block mt-0.5">{record.mineral_name}</span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#8D9AB2] block">ANOMALY SCORE</span>
                <span className="text-lg font-bold text-[#FF5B65] mt-0.5 block">
                  {record.anomaly_score.toFixed(1)} / 100
                </span>
                <span className="text-[10px] text-[#8D9AB2] block">{record.classification}</span>
              </div>
            </div>

            {/* 1. Raw Observed Evidence Fields */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-[#43D9FF] uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                1. Raw Observed Customs Evidence
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
                  <span className="text-[10px] text-[#8D9AB2] block">SOURCE DATASET</span>
                  <span className="text-[#F5F7FF] font-bold truncate block">{record.source_dataset}</span>
                </div>
                <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
                  <span className="text-[10px] text-[#8D9AB2] block">COMMODITY CODE</span>
                  <span className="text-[#F5F7FF] font-bold block">HS {record.commodity_code}</span>
                </div>
                <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
                  <span className="text-[10px] text-[#8D9AB2] block">REPORTING PERIOD</span>
                  <span className="text-[#F5F7FF] font-bold block">{record.period}</span>
                </div>
                <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
                  <span className="text-[10px] text-[#8D9AB2] block">CAPTURE TIMESTAMP</span>
                  <span className="text-[#F5F7FF] font-bold text-[10px] block truncate">
                    {new Date(record.capture_timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Mathematical Consistency Validation Check */}
            <div className="p-3.5 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#20E09E]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Deterministic Consistency Audit</span>
                </div>
                <SecondaryButton
                  size="sm"
                  variant="surface"
                  onClick={handleRunValidation}
                  disabled={validating}
                  className="text-[10px] py-1 px-2.5"
                >
                  {validating ? 'AUDITING...' : 'RUN VERIFICATION'}
                </SecondaryButton>
              </div>

              {validation ? (
                <div className="space-y-2 pt-1 border-t border-[#8D9AB2]/15">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8D9AB2]">Validation Result:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded border text-[10px] ${
                        validation.validation_status === 'VALID'
                          ? 'bg-[#20E09E]/20 text-[#20E09E] border-[#20E09E]/40'
                          : 'bg-[#FF5B65]/20 text-[#FF5B65] border-[#FF5B65]/40'
                      }`}
                    >
                      {validation.validation_status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {validation.checks_performed.map((chk) => (
                      <div
                        key={chk.check_name}
                        className="flex items-center justify-between text-[11px] p-1.5 rounded bg-[#070A12]"
                      >
                        <span className="text-[#8D9AB2]">{chk.check_name}</span>
                        <span className={chk.passed ? 'text-[#20E09E]' : 'text-[#FF5B65]'}>
                          {chk.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[#8D9AB2] text-[11px] leading-relaxed">
                  Run the 9-point mathematical consistency audit to verify that rule weights sum to 100%, threshold bounds are respected, and scores match frozen inputs within 0.01 tolerance.
                </p>
              )}
            </div>

            {/* 3. Detailed Rule Calculations from Backend Snapshot */}
            {snapshot && snapshot.rules.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#FFB547] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Calculated Rule Proofs
                </div>

                <div className="space-y-1.5">
                  {snapshot.rules.map((rule) => (
                    <div
                      key={rule.rule_id}
                      className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#F5F7FF]">
                          [{rule.rule_id}] {rule.rule_name}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] border ${
                            rule.outcome === 'FLAG'
                              ? 'bg-[#FF5B65]/20 text-[#FF5B65] border-[#FF5B65]/40'
                              : 'bg-[#20E09E]/20 text-[#20E09E] border-[#20E09E]/40'
                          }`}
                        >
                          {rule.outcome}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#8D9AB2]">
                        <strong>Formula:</strong> {rule.formula}
                      </div>
                      <p className="text-[11px] text-[#8D9AB2]">{rule.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-3 border-t border-[#8D9AB2]/20 flex items-center justify-between gap-3">
            <SecondaryButton
              size="sm"
              variant="surface"
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => {
                onClose();
                navigate(`/risk-analysis?analysis=${record.analysis_id}`);
              }}
              className="text-xs"
            >
              OPEN IN RISK ANALYSIS
            </SecondaryButton>

            <SecondaryButton size="sm" variant="surface" onClick={onClose} className="text-xs">
              CLOSE DOSSIER
            </SecondaryButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
