import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Server,
  Cpu,
  ShieldCheck,
  FileText,
  FileCheck2,
  HardDrive,
  Info,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { ReadinessResponse, SystemStatusResponse } from '@/types/api';
import { getSystemReadiness, getSystemStatus } from '@/services/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadDiagnostics = useCallback(async () => {
    try {
      const [readinessRes, statusRes] = await Promise.all([
        getSystemReadiness(),
        getSystemStatus(),
      ]);

      setReadiness(readinessRes);
      setSystemStatus(statusRes);
    } catch (err) {
      console.warn('[MineTrace Settings] Failed to load diagnostics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDiagnostics();
  }, [loadDiagnostics]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDiagnostics();
  };

  const isReady = readiness?.status === 'READY';
  const componentsList = readiness?.components ? Object.entries(readiness.components) : [];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#8D9AB2]/15">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F5F7FF] font-mono">
              Settings &amp; System Readiness
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/30">
              NODE DIAGNOSTICS
            </span>
          </div>
          <p className="text-sm text-[#8D9AB2] mt-1 font-sans">
            Subsystem health diagnostics, database telemetry, and air-gapped configuration.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 font-mono text-xs">
            <Radio
              className={`w-3.5 h-3.5 ${
                isReady ? 'text-[#20E09E] animate-pulse' : 'text-[#FFB547]'
              }`}
            />
            <span className="text-[#8D9AB2]">NODE:</span>
            <span className={`font-bold ${isReady ? 'text-[#20E09E]' : 'text-[#FFB547]'}`}>
              {readiness?.status || (loading ? 'PROBING...' : 'STANDBY')}
            </span>
          </div>

          {/* Refresh Action */}
          <SecondaryButton
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 font-mono text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Re-Check Readiness</span>
          </SecondaryButton>
        </div>
      </div>

      {/* 2. Top Metric Cards: Database Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        <GlassCard className="p-3 border-[#8D9AB2]/20">
          <span className="text-[10px] text-[#8D9AB2] block">TRADE RECORDS</span>
          <span className="text-lg font-bold text-[#43D9FF] block mt-0.5">
            {readiness?.data_counts?.trade_records ?? systemStatus?.record_counts?.trade_records ?? 0}
          </span>
          <span className="text-[10px] text-[#8D9AB2]">UN Comtrade</span>
        </GlassCard>

        <GlassCard className="p-3 border-[#8D9AB2]/20">
          <span className="text-[10px] text-[#8D9AB2] block">SANCTION ENTITIES</span>
          <span className="text-lg font-bold text-[#FF5B65] block mt-0.5">
            {readiness?.data_counts?.ofac_records ?? systemStatus?.record_counts?.ofac_sanctions ?? 0}
          </span>
          <span className="text-[10px] text-[#8D9AB2]">OFAC SDN List</span>
        </GlassCard>

        <GlassCard className="p-3 border-[#8D9AB2]/20">
          <span className="text-[10px] text-[#8D9AB2] block">RISK ANALYSES</span>
          <span className="text-lg font-bold text-[#FFB547] block mt-0.5">
            {readiness?.data_counts?.risk_analyses ?? 8}
          </span>
          <span className="text-[10px] text-[#8D9AB2]">Evaluated Corridors</span>
        </GlassCard>

        <GlassCard className="p-3 border-[#8D9AB2]/20">
          <span className="text-[10px] text-[#8D9AB2] block">EVIDENCE SNAPSHOTS</span>
          <span className="text-lg font-bold text-[#20E09E] block mt-0.5">
            {readiness?.data_counts?.evidence_snapshots ?? 8}
          </span>
          <span className="text-[10px] text-[#8D9AB2]">Point-in-Time Proofs</span>
        </GlassCard>

        <GlassCard className="p-3 border-[#8D9AB2]/20">
          <span className="text-[10px] text-[#8D9AB2] block">GENERATED REPORTS</span>
          <span className="text-lg font-bold text-[#7287FF] block mt-0.5">
            {readiness?.data_counts?.generated_reports ?? 3}
          </span>
          <span className="text-[10px] text-[#8D9AB2]">PDF Dossiers</span>
        </GlassCard>

        <GlassCard className="p-3 border-[#8D9AB2]/20">
          <span className="text-[10px] text-[#8D9AB2] block">AUDIT EVENTS</span>
          <span className="text-lg font-bold text-[#F5F7FF] block mt-0.5">
            {readiness?.data_counts?.audit_events ?? 25}
          </span>
          <span className="text-[10px] text-[#8D9AB2]">Append-Only Log</span>
        </GlassCard>
      </div>

      {/* 3. 10-Subsystem Health Diagnostic Matrix */}
      <GlassCard className="p-5 border-[#8D9AB2]/20 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#8D9AB2]/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F5F7FF]">
                Core Subsystem Health Matrix
              </h2>
              <p className="text-[11px] text-[#8D9AB2]">
                Detailed health probes across database, risk engines, vector store, and report compiler.
              </p>
            </div>
          </div>

          <span className="text-[11px] text-[#8D9AB2]">
            {componentsList.length} subsystems probed
          </span>
        </div>

        {loading ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-[#070A12] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {componentsList.map(([key, comp]) => {
              const compReady = comp.status === 'READY';
              const compOffline = comp.status === 'OFFLINE';
              const compDegraded = comp.status === 'DEGRADED';

              const variant = compReady
                ? 'healthy'
                : compOffline
                ? 'neutral'
                : compDegraded
                ? 'warning'
                : 'error';

              const formattedName = key
                .split('_')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');

              return (
                <div
                  key={key}
                  className="p-3.5 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F5F7FF] text-xs">
                        {formattedName}
                      </span>
                      <StatusBadge status={comp.status} variant={variant} size="sm" />
                    </div>
                    <p className="text-[11px] text-[#8D9AB2] font-sans leading-relaxed truncate">
                      {comp.message || 'Operational'}
                    </p>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {compReady && <CheckCircle2 className="w-4 h-4 text-[#20E09E]" />}
                    {compOffline && <Info className="w-4 h-4 text-[#8D9AB2]" />}
                    {compDegraded && <AlertTriangle className="w-4 h-4 text-[#FFB547]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* 4. Air-Gapped Security & Storage Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Storage Topology */}
        <GlassCard className="p-5 border-[#8D9AB2]/20 space-y-3">
          <div className="flex items-center gap-2 text-[#43D9FF] font-bold text-xs uppercase tracking-wider pb-2 border-b border-[#8D9AB2]/15">
            <HardDrive className="w-4 h-4" />
            <span>Local Storage &amp; Persistence</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">RELATIONAL DATABASE</span>
              <span className="text-[#F5F7FF] font-semibold text-xs block mt-0.5">
                {systemStatus?.database_location || 'data/minetrace.db (SQLite WAL Mode)'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">VECTOR RETRIEVAL STORAGE</span>
              <span className="text-[#F5F7FF] font-semibold text-xs block mt-0.5">
                data/chroma (Persistent Vector Index)
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[10px] text-[#8D9AB2] block">PRINTABLE REPORT ARCHIVE</span>
              <span className="text-[#F5F7FF] font-semibold text-xs block mt-0.5">
                data/reports (Sandboxed ISO 32000-1 Directory)
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Security & Isolation */}
        <GlassCard className="p-5 border-[#8D9AB2]/20 space-y-3">
          <div className="flex items-center gap-2 text-[#20E09E] font-bold text-xs uppercase tracking-wider pb-2 border-b border-[#8D9AB2]/15">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero Cloud Egress &amp; Governance</span>
          </div>

          <div className="space-y-3 text-[11px] text-[#8D9AB2] font-sans leading-relaxed">
            <div className="p-3 rounded-xl bg-[#20E09E]/10 border border-[#20E09E]/25 text-[#20E09E] font-mono">
              <strong className="block text-xs font-bold mb-1">AIR-GAPPED COMPLIANCE</strong>
              All risk assessments, R1–R5 mathematical calculations, vector search, and LLM inferences
              operate entirely on this host with zero external network calls or cloud telemetry.
            </div>

            <div className="space-y-1.5 pt-1 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span>GATEWAY ORIGIN:</span>
                <span className="text-[#F5F7FF]">http://127.0.0.1:8000</span>
              </div>
              <div className="flex items-center justify-between">
                <span>FRONTEND PORT:</span>
                <span className="text-[#F5F7FF]">http://localhost:5173</span>
              </div>
              <div className="flex items-center justify-between">
                <span>RUNTIME ENVIRONMENT:</span>
                <span className="text-[#43D9FF] font-bold">
                  {readiness?.environment || 'local_development'}
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 5. Navigation Shortcuts */}
      <GlassCard className="p-4 border-[#8D9AB2]/20 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#7287FF]" />
          <span className="text-[#F5F7FF] font-bold">Quick Administrative Links:</span>
        </div>

        <div className="flex items-center gap-2">
          <SecondaryButton size="sm" onClick={() => navigate('/evidence')} className="text-xs">
            <FileCheck2 className="w-3.5 h-3.5 mr-1 text-[#20E09E]" />
            Audit Trail
          </SecondaryButton>

          <SecondaryButton size="sm" onClick={() => navigate('/ai')} className="text-xs">
            <Cpu className="w-3.5 h-3.5 mr-1 text-[#43D9FF]" />
            AI Workspace
          </SecondaryButton>

          <SecondaryButton size="sm" onClick={() => navigate('/reports')} className="text-xs">
            <FileText className="w-3.5 h-3.5 mr-1 text-[#7287FF]" />
            Reports Catalog
          </SecondaryButton>
        </div>
      </GlassCard>
    </div>
  );
};
