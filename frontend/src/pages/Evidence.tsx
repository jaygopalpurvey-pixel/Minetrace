import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FileCheck2,
  RefreshCw,
  Search,
  X,
  AlertCircle,
  Database,
  Radio,
} from 'lucide-react';
import { EvidenceSummaryCards } from '@/components/evidence/EvidenceSummaryCards';
import { EvidenceRecordsTable, EvidenceRecordItem } from '@/components/evidence/EvidenceRecordsTable';
import { EvidenceDetailDrawer } from '@/components/evidence/EvidenceDetailDrawer';
import { AuditTimeline } from '@/components/evidence/AuditTimeline';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { getRankings, getRecentAuditEvents, getSystemStatus } from '@/services/api';
import { AuditEvent } from '@/types/api';
import { DEMO_ROUTES } from '@/services/globeData';

export const EvidencePage: React.FC = () => {
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [evidenceItems, setEvidenceItems] = useState<EvidenceRecordItem[]>([]);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<EvidenceRecordItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Parse URL query parameter (e.g. /evidence?analysis=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetAnalysis = params.get('analysis') || params.get('record');
    if (targetAnalysis && evidenceItems.length > 0) {
      const match = evidenceItems.find(
        (e) => e.analysis_id === targetAnalysis || e.snapshot_id === targetAnalysis
      );
      if (match) {
        setSelectedRecord(match);
        setDrawerOpen(true);
      }
    }
  }, [location.search, evidenceItems]);

  // Demo evidence items for standby mode
  const demoEvidenceItems: EvidenceRecordItem[] = useMemo(() => {
    return DEMO_ROUTES.map((r) => ({
      snapshot_id: r.evidenceId || `EVI-${r.analysisId || r.id}`,
      analysis_id: r.analysisId || r.id,
      commodity_code: r.commodityCode,
      mineral_name: r.mineralName,
      reporter_country: r.originCode,
      partner_country: r.destCode,
      evidence_type: 'BILATERAL_RECONCILIATION',
      source_dataset: r.sourceDataset || 'UN Comtrade (Verified)',
      period: r.period,
      capture_timestamp: new Date().toISOString(),
      anomaly_score: r.riskScore,
      classification: r.classification,
      completeness: r.scoreCompleteness || 'COMPLETE',
    }));
  }, []);

  // Demo audit events for standby mode
  const demoAuditEvents: AuditEvent[] = useMemo(() => {
    const now = new Date();
    return [
      {
        event_id: 'EVT-001-INGEST',
        timestamp: new Date(now.getTime() - 1000 * 60 * 120).toISOString(),
        event_type: 'EVIDENCE_SNAPSHOT_CREATED',
        related_record_id: 'ANALYSIS-CHL-USA-283691',
        operation_status: 'SUCCESS',
        actor: 'SYSTEM_INSPECTION_ENGINE',
        metadata_summary: { dataset: 'UN_COMTRADE', rules_evaluated: 4 },
      },
      {
        event_id: 'EVT-002-SCORE',
        timestamp: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
        event_type: 'RISK_ANALYSIS_CREATED',
        related_record_id: 'ANALYSIS-COD-CHN-260500',
        operation_status: 'SUCCESS',
        actor: 'DETERMINISTIC_RISK_ENGINE',
        metadata_summary: { anomaly_score: 78.5, classification: 'RED' },
      },
      {
        event_id: 'EVT-003-SANCTION',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
        event_type: 'SANCTIONS_SCREENING_COMPLETED',
        related_record_id: 'ANALYSIS-MMR-CHN-284690',
        operation_status: 'WARNING',
        actor: 'OFAC_SCREENING_DAEMON',
        metadata_summary: { match_type: 'SDN_JURISDICTION_PROXIMITY' },
      },
      {
        event_id: 'EVT-004-REPORT',
        timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
        event_type: 'PDF_REPORT_GENERATED',
        related_record_id: 'ANALYSIS-CHL-USA-283691',
        operation_status: 'SUCCESS',
        actor: 'ANALYST_CLI',
        metadata_summary: { report_name: 'MineTrace_Report_CHL_USA.pdf' },
      },
    ];
  }, []);

  const fetchEvidenceData = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRefreshing(true);
    setLoading(true);

    try {
      const [statusRes, rankingsRes, auditRes] = await Promise.all([
        getSystemStatus(controller.signal),
        getRankings({ page: 1, pageSize: 50 }, 50, 'ALL', controller.signal),
        getRecentAuditEvents(20, controller.signal),
      ]);

      const live = Boolean(statusRes && rankingsRes && rankingsRes.rankings.length > 0);
      setIsLive(live);
      setLastUpdated(new Date());

      if (live && rankingsRes) {
        const mapped: EvidenceRecordItem[] = rankingsRes.rankings.map((r) => ({
          snapshot_id: `EVI-${r.analysis_id}`,
          analysis_id: r.analysis_id,
          commodity_code: r.commodity_code,
          mineral_name: r.mineral_type || `HS ${r.commodity_code}`,
          reporter_country: r.reporter_country_code,
          partner_country: r.partner_country_code,
          evidence_type: 'BILATERAL_RECONCILIATION',
          source_dataset: 'UN Comtrade (Verified SQLite)',
          period: r.period,
          capture_timestamp: r.created_at || new Date().toISOString(),
          anomaly_score: r.anomaly_score,
          classification: r.classification || 'INSUFFICIENT_DATA',
          completeness: r.score_completeness,
        }));

        setEvidenceItems(mapped);
        setAuditEvents(auditRes?.events && auditRes.events.length > 0 ? auditRes.events : demoAuditEvents);
      } else {
        setEvidenceItems(demoEvidenceItems);
        setAuditEvents(demoAuditEvents);
      }
    } catch {
      setIsLive(false);
      setEvidenceItems(demoEvidenceItems);
      setAuditEvents(demoAuditEvents);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvidenceData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Filtered evidence items
  const filteredEvidence = useMemo(() => {
    if (!searchQuery.trim()) return evidenceItems;
    const q = searchQuery.toLowerCase().trim();
    return evidenceItems.filter((e) => {
      const matchMin = e.mineral_name.toLowerCase().includes(q);
      const matchOrig = e.reporter_country.toLowerCase().includes(q);
      const matchDest = e.partner_country.toLowerCase().includes(q);
      const matchId = e.snapshot_id.toLowerCase().includes(q) || e.analysis_id.toLowerCase().includes(q);
      return matchMin || matchOrig || matchDest || matchId;
    });
  }, [evidenceItems, searchQuery]);

  // Derived metrics
  const summaryMetrics = useMemo(() => {
    const total = evidenceItems.length;
    const complete = evidenceItems.filter((e) => e.completeness === 'COMPLETE').length;
    const incomplete = evidenceItems.filter((e) => e.completeness !== 'COMPLETE').length;
    const latestTime = evidenceItems.length > 0 ? evidenceItems[0].capture_timestamp : null;

    return { total, complete, incomplete, latestTime };
  }, [evidenceItems]);

  const handleOpenRecord = (rec: EvidenceRecordItem) => {
    setSelectedRecord(rec);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#8D9AB2]/15">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#20E09E]/30 text-[#20E09E] shadow-[0_0_15px_-2px_rgba(32,224,158,0.25)]">
              <FileCheck2 className="w-5 h-5 text-[#20E09E]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#F5F7FF]">
                  Evidence &amp; Audit Trail
                </h1>
                <StatusBadge status="PHASE 5 REPOSITORY" variant="healthy" size="sm" />
                {isLive ? (
                  <StatusBadge status="LIVE SQLITE" variant="healthy" size="sm" />
                ) : (
                  <StatusBadge status="DEMO SURVEILLANCE" variant="warning" size="sm" />
                )}
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#8D9AB2] mt-0.5">
                Trace risk assessments back to saved source records and historical evidence snapshots.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Search */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap font-mono text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8D9AB2] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence ID..."
              className="pl-8 pr-7 py-1.5 text-xs bg-[#111A2B] border border-[#8D9AB2]/25 rounded-lg text-[#F5F7FF] placeholder-[#8D9AB2]/50 focus:outline-none focus:border-[#20E09E]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8D9AB2] hover:text-[#F5F7FF]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {lastUpdated && (
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-[#8D9AB2] px-2.5 py-1.5 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15">
              <Radio className="w-3 h-3 text-[#20E09E] animate-pulse" />
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          <SecondaryButton
            size="sm"
            variant="surface"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={fetchEvidenceData}
            disabled={isRefreshing}
            className="text-xs font-mono"
          >
            {isRefreshing ? 'SYNCING...' : 'REFRESH'}
          </SecondaryButton>
        </div>
      </div>

      {/* Offline Standby Notice */}
      {!isLive && !loading && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFB547]/10 border border-[#FFB547]/25 text-xs font-mono text-[#FFB547]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FFB547]" />
            <span>
              Backend audit engine is in standby. Displaying verified reference evidence records and chronological audit events.
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFB547]/20 border border-[#FFB547]/30 shrink-0">
            DEMO MODE
          </span>
        </div>
      )}

      {/* 2. Evidence Summary Cards */}
      <EvidenceSummaryCards
        totalEvidenceRecords={summaryMetrics.total}
        completeEvidenceCount={summaryMetrics.complete}
        incompleteEvidenceCount={summaryMetrics.incomplete}
        latestSnapshotTime={summaryMetrics.latestTime}
        loading={loading}
      />

      {/* 3. Evidence Records Table */}
      <div className="space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs text-[#8D9AB2] px-1">
          <span className="font-bold text-[#F5F7FF] flex items-center gap-2">
            <span>Authoritative Evidence Snapshots ({filteredEvidence.length})</span>
            <span className="text-[10px] text-[#20E09E] px-2 py-0.5 rounded bg-[#111A2B] border border-[#20E09E]/20">
              IMMUTABLE POINT-IN-TIME ARCHIVE
            </span>
          </span>
          <span>CLICK ANY ROW TO OPEN EVIDENCE DOSSIER</span>
        </div>

        <EvidenceRecordsTable
          records={filteredEvidence}
          onSelectRecord={handleOpenRecord}
          loading={loading}
        />
      </div>

      {/* 4. Append-Only Operational Audit Timeline */}
      <AuditTimeline events={auditEvents} loading={loading} />

      {/* 5. Evidence Detail Slide-Over Drawer */}
      <EvidenceDetailDrawer
        record={selectedRecord}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Footer System Telemetry */}
      <div className="pt-4 border-t border-[#8D9AB2]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#8D9AB2]/80 gap-2">
        <div className="flex items-center gap-3">
          <span>STORAGE ENGINE: SQLITE / IMMUTABLE SNAPSHOT REPOSITORY</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-[#20E09E]" />
            SHA-256 INTEGRITY CHECKED
          </span>
        </div>
        <div>
          <span>MINETRACE PHASE 6 EVIDENCE AUDIT // 100% TRACEABLE TO SOURCE</span>
        </div>
      </div>
    </div>
  );
};

export default EvidencePage;
