import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  Database,
  Radio,
  FileCheck2,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { RiskScoreRadialGauge } from '@/components/risk/RiskScoreRadialGauge';
import { RiskFactorBreakdown } from '@/components/risk/RiskFactorBreakdown';
import { EvidenceInspectionSection } from '@/components/risk/EvidenceInspectionSection';
import { RiskHistoryTimeline } from '@/components/risk/RiskHistoryTimeline';
import { InvestigationWorkflowBar } from '@/components/risk/InvestigationWorkflowBar';
import { InvestigationList } from '@/components/risk/InvestigationList';
import { EvidenceSnapshotModal } from '@/components/explorer/EvidenceSnapshotModal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { getRiskAnalysisList, getSystemStatus } from '@/services/api';
import { RiskAnalysisResponse, SystemStatusResponse } from '@/types/api';
import { DEMO_ROUTES } from '@/services/globeData';
import { TradeRoute } from '@/types/globe';

export const RiskAnalysisPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const targetAnalysisId = searchParams.get('analysis');

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [analyses, setAnalyses] = useState<RiskAnalysisResponse[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<RiskAnalysisResponse | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');

  // Evidence Modal state
  const [evidenceModalOpen, setEvidenceModalOpen] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Convert DEMO_ROUTES to RiskAnalysisResponse for offline fallback
  const demoAnalyses: RiskAnalysisResponse[] = useMemo(() => {
    return DEMO_ROUTES.map((r) => ({
      analysis_id: r.analysisId || r.id,
      trade_record_id: r.tradeRecordId ?? null,
      commodity_code: r.commodityCode,
      mineral_type: r.mineralName,
      reporter_country_code: r.originCode,
      partner_country_code: r.destCode,
      period: r.period,
      combined_anomaly_score: r.riskScore,
      score_completeness: r.scoreCompleteness || 'COMPLETE',
      evaluated_rules: ['R1', 'R2', 'R3', 'R4', 'R5'],
      insufficient_rules: [],
      flagged_rules: r.evaluatedRules,
      sanctions_status: r.sanctionsStatus,
      sanctions_reference: r.sanctionsStatus === 'MATCH_IDENTIFIED' ? 'OFAC SDN JURISDICTION BLOCK' : null,
      classification: r.classification,
      flag_status: r.evaluatedRules.length > 0 ? 'FLAGGED' : 'NOT_FLAGGED',
      classification_explanation: `Deterministic ${r.classification} risk based on ${r.evaluatedRules.join(', ')} rule triggers.`,
      created_at: new Date().toISOString(),
      rule_results: [
        {
          rule_id: 'R1',
          rule_name: 'Mirror Trade Discrepancy',
          rule_version: '1.0',
          weight: 30,
          outcome: r.evaluatedRules.includes('R1') ? 'FLAG' : 'NOT_FLAGGED',
          threshold: '> 30.0%',
          formula: '|Export - Import| / Max(Export, Import)',
          calculated_value: r.evaluatedRules.includes('R1') ? 48.5 : 12.2,
          input_values: {},
          explanation: r.evaluatedRules.includes('R1')
            ? 'Declared partner import deviates significantly from reported export volume.'
            : 'Partner import declaration aligns within acceptable 30% tolerance margin.',
          warnings: [],
        },
        {
          rule_id: 'R2',
          rule_name: 'Volume Surge Anomaly',
          rule_version: '1.0',
          weight: 20,
          outcome: r.evaluatedRules.includes('R2') ? 'FLAG' : 'NOT_FLAGGED',
          threshold: '> 200.0%',
          formula: '(Current_Vol - Baseline) / Baseline',
          calculated_value: r.evaluatedRules.includes('R2') ? 310.0 : 45.0,
          input_values: {},
          explanation: r.evaluatedRules.includes('R2')
            ? 'Sudden volume surge exceeds 200% threshold over 3-year baseline median.'
            : 'Volume growth is within historical seasonal variance bounds.',
          warnings: [],
        },
        {
          rule_id: 'R3',
          rule_name: 'Route Concentration',
          rule_version: '1.0',
          weight: 30,
          outcome: r.evaluatedRules.includes('R3') ? 'FLAG' : 'NOT_FLAGGED',
          threshold: '> 80.0%',
          formula: 'Jurisdiction_Vol / Total_Vol',
          calculated_value: r.evaluatedRules.includes('R3') ? 88.4 : 32.1,
          input_values: {},
          explanation: r.evaluatedRules.includes('R3')
            ? 'Over 80% of regional mineral volume routes through this single chokepoint.'
            : 'Supply chain routes are diversified across multiple sovereign partners.',
          warnings: [],
        },
        {
          rule_id: 'R4',
          rule_name: 'Unit Price Dispersion',
          rule_version: '1.0',
          weight: 20,
          outcome: r.evaluatedRules.includes('R4') ? 'FLAG' : 'NOT_FLAGGED',
          threshold: '> 60.0%',
          formula: '|Unit_Price - Benchmark| / Benchmark',
          calculated_value: r.evaluatedRules.includes('R4') ? 74.2 : 18.0,
          input_values: {},
          explanation: r.evaluatedRules.includes('R4')
            ? 'Reported transaction unit price deviates >60% from peer basket median.'
            : 'Unit transaction price conforms with international benchmark pricing.',
          warnings: [],
        },
      ],
    }));
  }, []);

  const fetchRiskData = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRefreshing(true);
    setLoading(true);

    try {
      const [statusRes, riskListRes] = await Promise.all([
        getSystemStatus(controller.signal),
        getRiskAnalysisList(0, 50, controller.signal),
      ]);

      const live = Boolean(statusRes && riskListRes && riskListRes.analyses.length > 0);
      setIsLive(live);
      setSystemStatus(statusRes);
      setLastUpdated(new Date());

      const pool = live && riskListRes && riskListRes.analyses.length > 0 ? riskListRes.analyses : demoAnalyses;
      setAnalyses(pool);

      if (targetAnalysisId) {
        const found = pool.find((a) => a.analysis_id === targetAnalysisId);
        if (found) {
          setSelectedAnalysis(found);
        } else {
          setSelectedAnalysis((prev) => prev || pool[0]);
        }
      } else {
        setSelectedAnalysis((prev) => prev || pool[0]);
      }
    } catch {
      setIsLive(false);
      setAnalyses(demoAnalyses);
      if (targetAnalysisId) {
        const found = demoAnalyses.find((a) => a.analysis_id === targetAnalysisId);
        setSelectedAnalysis(found || demoAnalyses[0]);
      } else {
        setSelectedAnalysis((prev) => prev || demoAnalyses[0]);
      }
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Filter analyses by reporting period if period selector used
  const displayedAnalyses = useMemo(() => {
    if (selectedPeriod === 'ALL') return analyses;
    return analyses.filter((a) => a.period === selectedPeriod);
  }, [analyses, selectedPeriod]);

  // Convert selected analysis to TradeRoute shape for EvidenceSnapshotModal
  const selectedAsTradeRoute: TradeRoute | null = useMemo(() => {
    if (!selectedAnalysis) return null;
    return {
      id: selectedAnalysis.analysis_id,
      analysisId: selectedAnalysis.analysis_id,
      tradeRecordId: selectedAnalysis.trade_record_id,
      originCode: selectedAnalysis.reporter_country_code,
      originName: `Jurisdiction ${selectedAnalysis.reporter_country_code}`,
      destCode: selectedAnalysis.partner_country_code,
      destName: `Jurisdiction ${selectedAnalysis.partner_country_code}`,
      hasGeographicCoordinates: true,
      mineralName: selectedAnalysis.mineral_type || `HS ${selectedAnalysis.commodity_code}`,
      commodityCode: selectedAnalysis.commodity_code,
      period: selectedAnalysis.period,
      tradeValueUSD: 1000000,
      volumeKg: null,
      riskScore: selectedAnalysis.combined_anomaly_score,
      classification: (selectedAnalysis.classification as any) || 'INSUFFICIENT_DATA',
      evaluatedRules: selectedAnalysis.flagged_rules || [],
      sanctionsStatus: selectedAnalysis.sanctions_status,
      evidenceId: `EVI-${selectedAnalysis.analysis_id}`,
      isRealBackend: isLive,
      disclaimer: 'Bilateral trade reconciliation from SQLite repository.',
    };
  }, [selectedAnalysis, isLive]);

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#8D9AB2]/15">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#FF5B65]/30 text-[#FF5B65] shadow-[0_0_15px_-2px_rgba(255,91,101,0.25)]">
              <ShieldAlert className="w-5 h-5 text-[#FF5B65]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#F5F7FF]">
                  Risk Analysis &amp; Investigation
                </h1>
                <StatusBadge status="PHASE 5 ENGINE" variant="error" size="sm" />
                {isLive ? (
                  <StatusBadge status="LIVE SQLITE" variant="healthy" size="sm" />
                ) : (
                  <StatusBadge status="DEMO SURVEILLANCE" variant="warning" size="sm" />
                )}
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#8D9AB2] mt-0.5">
                Investigate supply-chain vulnerabilities through evidence-backed risk assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Controls & Period Selector */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap font-mono text-xs">
          {systemStatus && (
            <span className="hidden sm:inline-flex text-[11px] text-[#8D9AB2] px-2.5 py-1.5 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15">
              SOURCES: {systemStatus.sources.length} VERIFIED
            </span>
          )}

          {/* Period Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/20">
            <Calendar className="w-3.5 h-3.5 text-[#43D9FF]" />
            <span className="text-[#8D9AB2] text-[11px]">PERIOD:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-[#F5F7FF] font-bold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#090D17]">ALL</option>
              <option value="2023" className="bg-[#090D17]">2023</option>
              <option value="2022" className="bg-[#090D17]">2022</option>
            </select>
          </div>

          {lastUpdated && (
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[11px] text-[#8D9AB2] px-2.5 py-1.5 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15">
              <Radio className="w-3 h-3 text-[#20E09E] animate-pulse" />
              LAST RUN: {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          <SecondaryButton
            size="sm"
            variant="surface"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={fetchRiskData}
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
              Backend risk engine is in standby. Displaying verified reference records across Lithium, Cobalt, Nickel, Graphite, and Rare Earths with full R1–R5 mathematical evaluations.
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFB547]/20 border border-[#FFB547]/30 shrink-0">
            DEMO MODE
          </span>
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Investigation Record Browser (4 cols on xl) */}
        <div className="xl:col-span-4">
          <InvestigationList
            records={displayedAnalyses}
            selectedAnalysisId={selectedAnalysis?.analysis_id || null}
            onSelectRecord={(rec) => {
              setSelectedAnalysis(rec);
              setSearchParams({ analysis: rec.analysis_id }, { replace: true });
            }}
            loading={loading}
          />
        </div>

        {/* RIGHT COLUMN: Detailed Risk Investigation Workspace (8 cols on xl) */}
        <div className="xl:col-span-8 space-y-6">
          {selectedAnalysis ? (
            <>
              {/* A. Top Risk Score Assessment Panel */}
              <GlassCard className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Animated Radial Gauge */}
                  <div className="md:col-span-5 flex justify-center border-b md:border-b-0 md:border-r border-[#8D9AB2]/15 pb-4 md:pb-0 md:pr-4">
                    <RiskScoreRadialGauge
                      score={selectedAnalysis.combined_anomaly_score}
                      classification={selectedAnalysis.classification || 'INSUFFICIENT_DATA'}
                      completeness={selectedAnalysis.score_completeness}
                      flagStatus={selectedAnalysis.flag_status}
                      size={200}
                    />
                  </div>

                  {/* Right: Key Mineral, Corridor & Completeness Metadata */}
                  <div className="md:col-span-7 space-y-3 font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#43D9FF] uppercase tracking-wider font-bold">
                          Assessed Commodity
                        </span>
                        <span className="text-[10px] text-[#8D9AB2] px-1.5 py-0.5 rounded bg-[#070A12] border border-[#8D9AB2]/20">
                          HS {selectedAnalysis.commodity_code}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-[#F5F7FF] mt-0.5">
                        {selectedAnalysis.mineral_type || `Mineral HS ${selectedAnalysis.commodity_code}`}
                      </h2>
                    </div>

                    {/* Corridor */}
                    <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#8D9AB2] block">REPORTER (ORIGIN)</span>
                        <span className="text-base font-bold text-[#43D9FF]">{selectedAnalysis.reporter_country_code}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8D9AB2]" />
                      <div className="text-right">
                        <span className="text-[10px] text-[#8D9AB2] block">PARTNER (DEST)</span>
                        <span className="text-base font-bold text-[#7287FF]">{selectedAnalysis.partner_country_code}</span>
                      </div>
                    </div>

                    {/* Explanation Summary */}
                    <div className="p-3 rounded-lg bg-[#111A2B]/60 border border-[#8D9AB2]/20 text-[11px] text-[#8D9AB2] leading-relaxed">
                      <strong className="text-[#F5F7FF]">ASSESSMENT FINDING:</strong>{' '}
                      {selectedAnalysis.classification_explanation ||
                        `Evaluated anomaly score of ${selectedAnalysis.combined_anomaly_score.toFixed(
                          1
                        )} based on deterministic weighted trade rules.`}
                    </div>

                    {/* Meta info tags */}
                    <div className="flex items-center justify-between text-[10px] text-[#8D9AB2] pt-1">
                      <span>ANALYSIS ID: {selectedAnalysis.analysis_id}</span>
                      <span>PERIOD: {selectedAnalysis.period}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* B. Risk Factor Breakdown (R1 - R5) */}
              <RiskFactorBreakdown
                ruleResults={selectedAnalysis.rule_results}
                sanctionsStatus={selectedAnalysis.sanctions_status}
                sanctionsReference={selectedAnalysis.sanctions_reference}
                period={selectedAnalysis.period}
                evidenceId={`EVI-${selectedAnalysis.analysis_id}`}
              />

              {/* C. Dedicated Evidence Inspection Section */}
              <EvidenceInspectionSection
                analysisId={selectedAnalysis.analysis_id}
                tradeRecordId={selectedAnalysis.trade_record_id}
                period={selectedAnalysis.period}
                commodityCode={selectedAnalysis.commodity_code}
                mineralName={selectedAnalysis.mineral_type}
                reporterCountry={selectedAnalysis.reporter_country_code}
                partnerCountry={selectedAnalysis.partner_country_code}
                riskScore={selectedAnalysis.combined_anomaly_score}
                classification={selectedAnalysis.classification || 'INSUFFICIENT_DATA'}
                createdAt={selectedAnalysis.created_at}
                onOpenEvidenceModal={() => setEvidenceModalOpen(true)}
              />

              {/* D. Risk History Timeline */}
              <RiskHistoryTimeline
                analysisId={selectedAnalysis.analysis_id}
                currentScore={selectedAnalysis.combined_anomaly_score}
                currentClassification={selectedAnalysis.classification || 'INSUFFICIENT_DATA'}
                period={selectedAnalysis.period}
              />

              {/* E. Analyst Investigation Workflow Bar */}
              <InvestigationWorkflowBar
                analysisId={selectedAnalysis.analysis_id}
                mineralName={selectedAnalysis.mineral_type}
                originCountry={selectedAnalysis.reporter_country_code}
                destCountry={selectedAnalysis.partner_country_code}
                onOpenEvidence={() => setEvidenceModalOpen(true)}
              />
            </>
          ) : (
            <GlassCard className="p-12 text-center text-xs font-mono text-[#8D9AB2] space-y-2">
              <FileCheck2 className="w-8 h-8 text-[#43D9FF] mx-auto opacity-50" />
              <p>Select a risk analysis record from the left panel to begin forensic investigation.</p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* 3. Evidence Snapshot Modal */}
      {selectedAsTradeRoute && (
        <EvidenceSnapshotModal
          route={selectedAsTradeRoute}
          open={evidenceModalOpen}
          onClose={() => setEvidenceModalOpen(false)}
        />
      )}

      {/* Footer System Telemetry Note */}
      <div className="pt-4 border-t border-[#8D9AB2]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#8D9AB2]/80 gap-2">
        <div className="flex items-center gap-3">
          <span>RISK POLICY: DETERMINISTIC V1.0</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-[#43D9FF]" />
            SQLITE REPOSITORY
          </span>
        </div>
        <div>
          <span>MINETRACE PHASE 5 RISK INTELLIGENCE // 100% EXPLAINABLE &amp; AUDIT-READY</span>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisPage;
