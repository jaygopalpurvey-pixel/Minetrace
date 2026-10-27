import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  RefreshCw,
  Search,
  X,
  AlertCircle,
  Database,
  Radio,
  Calendar,
  HelpCircle,
} from 'lucide-react';
import { RankingsSummaryCards } from '@/components/rankings/RankingsSummaryCards';
import { PriorityInvestigationsList } from '@/components/rankings/PriorityInvestigationsList';
import { RankedFindingsTable } from '@/components/rankings/RankedFindingsTable';
import { RouteInspectionDrawer } from '@/components/globe/RouteInspectionDrawer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { getRankings, getRankingSummary, getIncompleteRankings } from '@/services/api';
import { RankingEntry, IncompleteRecordEntry, RankingSummaryResponse } from '@/types/api';
import { DEMO_ROUTES } from '@/services/globeData';
import { TradeRoute } from '@/types/globe';

export const RankingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [summaryData, setSummaryData] = useState<RankingSummaryResponse | null>(null);
  const [incompleteRecords, setIncompleteRecords] = useState<IncompleteRecordEntry[]>([]);

  // Search & Period Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');

  // Selected entry for inspection drawer
  const [selectedRoute, setSelectedRoute] = useState<TradeRoute | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Convert DEMO_ROUTES to RankingEntry[] for offline demonstration mode
  const demoRankings: RankingEntry[] = useMemo(() => {
    return DEMO_ROUTES.map((r, idx) => ({
      rank: idx + 1,
      analysis_id: r.analysisId || r.id,
      trade_record_id: r.tradeRecordId ?? idx + 100,
      commodity_code: r.commodityCode,
      mineral_type: r.mineralName,
      reporter_country_code: r.originCode,
      partner_country_code: r.destCode,
      period: r.period,
      anomaly_score: r.riskScore,
      score_completeness: r.scoreCompleteness || 'COMPLETE',
      classification: r.classification,
      flag_status: r.evaluatedRules.length > 0 ? 'FLAGGED' : 'NOT_FLAGGED',
      sanctions_status: r.sanctionsStatus,
      evaluated_rules: r.evaluatedRules,
      flagged_rules: r.evaluatedRules,
      insufficient_rules: [],
      created_at: new Date().toISOString(),
    }));
  }, []);

  const fetchRankingsData = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRefreshing(true);
    setLoading(true);

    try {
      const [rankingsRes, summaryRes, incompleteRes] = await Promise.all([
        getRankings({ page: 1, pageSize: 50, period: selectedPeriod !== 'ALL' ? selectedPeriod : undefined }, 50, selectedPeriod, controller.signal),
        getRankingSummary(controller.signal),
        getIncompleteRankings(1, 20, controller.signal),
      ]);

      const live = Boolean(rankingsRes && rankingsRes.rankings && rankingsRes.rankings.length > 0);
      setIsLive(live);
      setLastUpdated(new Date());

      if (live && rankingsRes) {
        setRankings(rankingsRes.rankings);
        setSummaryData(summaryRes);
        setIncompleteRecords(incompleteRes?.records || []);
      } else {
        // Fallback to demo rankings in standby mode
        setRankings(demoRankings);
        setSummaryData(null);
        setIncompleteRecords([]);
      }
    } catch {
      setIsLive(false);
      setRankings(demoRankings);
      setSummaryData(null);
      setIncompleteRecords([]);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingsData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedPeriod]);

  // Filter rankings by search query
  const filteredRankings = useMemo(() => {
    if (!searchQuery.trim()) return rankings;
    const q = searchQuery.toLowerCase().trim();
    return rankings.filter((r) => {
      const matchMineral = (r.mineral_type || '').toLowerCase().includes(q);
      const matchOrigin = r.reporter_country_code.toLowerCase().includes(q);
      const matchDest = r.partner_country_code.toLowerCase().includes(q);
      const matchCode = r.commodity_code.includes(q);
      const matchId = r.analysis_id.toLowerCase().includes(q);
      return matchMineral || matchOrigin || matchDest || matchCode || matchId;
    });
  }, [rankings, searchQuery]);

  // Derived Summary Counts
  const counts = useMemo(() => {
    if (summaryData) {
      return {
        high: summaryData.classification_breakdown['RED'] || 0,
        medium: summaryData.classification_breakdown['AMBER'] || 0,
        low: summaryData.classification_breakdown['GREEN'] || 0,
        insufficient: summaryData.partial_excluded_count + summaryData.unavailable_excluded_count,
        totalEligible: summaryData.eligible_complete_count,
      };
    }
    // Compute from active array
    let high = 0;
    let medium = 0;
    let low = 0;
    let insufficient = 0;

    rankings.forEach((r) => {
      if (r.classification === 'RED' || r.anomaly_score >= 50) high += 1;
      else if (r.classification === 'AMBER' || r.anomaly_score >= 20) medium += 1;
      else if (r.classification === 'GREEN') low += 1;
      else insufficient += 1;
    });

    return {
      high,
      medium,
      low,
      insufficient: insufficient + incompleteRecords.length,
      totalEligible: rankings.length,
    };
  }, [summaryData, rankings, incompleteRecords]);

  // Convert RankingEntry to TradeRoute for inspection drawer
  const handleSelectRanking = (entry: RankingEntry) => {
    const route: TradeRoute = {
      id: entry.analysis_id,
      analysisId: entry.analysis_id,
      tradeRecordId: entry.trade_record_id,
      originCode: entry.reporter_country_code,
      originName: `Jurisdiction ${entry.reporter_country_code}`,
      destCode: entry.partner_country_code,
      destName: `Jurisdiction ${entry.partner_country_code}`,
      hasGeographicCoordinates: true,
      mineralName: entry.mineral_type || `HS ${entry.commodity_code}`,
      commodityCode: entry.commodity_code,
      period: entry.period,
      tradeValueUSD: 1000000,
      volumeKg: null,
      riskScore: entry.anomaly_score,
      scoreCompleteness: entry.score_completeness,
      classification: (entry.classification as any) || 'INSUFFICIENT_DATA',
      evaluatedRules: entry.evaluated_rules,
      sanctionsStatus: entry.sanctions_status,
      evidenceId: `EVI-${entry.analysis_id}`,
      isRealBackend: isLive,
      disclaimer: 'Ranked finding from SQLite repository.',
    };
    setSelectedRoute(route);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#8D9AB2]/15">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF] shadow-[0_0_15px_-2px_rgba(67,217,255,0.2)]">
              <BarChart3 className="w-5 h-5 text-[#43D9FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#F5F7FF]">
                  Risk Rankings
                </h1>
                <StatusBadge status="PHASE 4 ENGINE" variant="cyan" size="sm" />
                {isLive ? (
                  <StatusBadge status="LIVE SQLITE" variant="healthy" size="sm" />
                ) : (
                  <StatusBadge status="DEMO SURVEILLANCE" variant="warning" size="sm" />
                )}
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#8D9AB2] mt-0.5">
                Prioritize critical mineral supply-chain vulnerabilities using evidence-backed risk assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap font-mono text-xs">
          {/* Search Field */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8D9AB2] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter findings..."
              className="pl-8 pr-7 py-1.5 text-xs bg-[#111A2B] border border-[#8D9AB2]/25 rounded-lg text-[#F5F7FF] placeholder-[#8D9AB2]/50 focus:outline-none focus:border-[#43D9FF]"
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
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          <SecondaryButton
            size="sm"
            variant="surface"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={fetchRankingsData}
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
              Backend ranking engine is in standby. Showing verified reference ranking queue under deterministic tie-breaker policy (Score DESC, Created DESC, ID ASC).
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFB547]/20 border border-[#FFB547]/30 shrink-0">
            DEMO MODE
          </span>
        </div>
      )}

      {/* 2. Risk Summary Cards */}
      <RankingsSummaryCards
        highRiskCount={counts.high}
        mediumRiskCount={counts.medium}
        lowRiskCount={counts.low}
        insufficientCount={counts.insufficient}
        totalEligible={counts.totalEligible}
        loading={loading}
      />

      {/* 3. Priority Investigations Section */}
      <PriorityInvestigationsList
        rankings={filteredRankings}
        onSelectRanking={handleSelectRanking}
      />

      {/* 4. Ranked Findings Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#8D9AB2] px-1">
          <span className="font-bold text-[#F5F7FF] flex items-center gap-2">
            <span>Primary Anomaly Ranking Queue</span>
            <span className="text-[10px] text-[#43D9FF] px-2 py-0.5 rounded bg-[#111A2B] border border-[#43D9FF]/20">
              POLICY V1.0 // COMPLETE RECORDS ONLY
            </span>
          </span>
          <span>CLICK ANY ROW TO OPEN INVESTIGATION DOSSIER</span>
        </div>

        <RankedFindingsTable
          rankings={filteredRankings}
          onSelectRanking={handleSelectRanking}
          loading={loading}
        />
      </div>

      {/* 5. Incomplete or Excluded Records Notice */}
      {incompleteRecords.length > 0 && (
        <GlassCard className="p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#8D9AB2]/15">
            <div className="flex items-center gap-2 text-[#7287FF]">
              <HelpCircle className="w-4 h-4" />
              <span className="font-bold uppercase tracking-wider text-[#F5F7FF]">
                Records Excluded From Primary Ranking ({incompleteRecords.length})
              </span>
            </div>
            <span className="text-[10px] text-[#8D9AB2]">INCOMPLETE / UNAVAILABLE BASELINE</span>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {incompleteRecords.map((inc) => (
              <div
                key={inc.analysis_id}
                className="p-2.5 rounded bg-[#070A12] border border-[#7287FF]/25 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-[#F5F7FF]">
                    {inc.reporter_country_code} &rarr; {inc.partner_country_code} ({inc.mineral_type || `HS ${inc.commodity_code}`})
                  </span>
                  <span className="text-[11px] text-[#FFB547] block mt-0.5">
                    EXCLUSION REASON: {inc.exclusion_reason}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/risk-analysis?analysis=${inc.analysis_id}`)}
                  className="text-[11px] text-[#43D9FF] hover:underline shrink-0 ml-3"
                >
                  View Details &rarr;
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Inspection Drawer */}
      <RouteInspectionDrawer
        route={selectedRoute}
        hub={null}
        onClose={() => setSelectedRoute(null)}
      />

      {/* Footer System Telemetry */}
      <div className="pt-4 border-t border-[#8D9AB2]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#8D9AB2]/80 gap-2">
        <div className="flex items-center gap-3">
          <span>TIE-BREAKER: SCORE DESC &rarr; CREATED_AT DESC &rarr; ID ASC</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-[#43D9FF]" />
            SQLITE RECORD STORE
          </span>
        </div>
        <div>
          <span>MINETRACE PHASE 6 RISK RANKINGS // FORENSIC TRIAGE READY</span>
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;
