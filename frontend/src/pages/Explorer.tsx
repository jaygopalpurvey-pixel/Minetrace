import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe2,
  RefreshCw,
  AlertCircle,
  Database,
  Radio,
} from 'lucide-react';
import { SupplyChainIntelligenceGlobe } from '@/components/globe/SupplyChainIntelligenceGlobe';
import { ExplorerSummaryCards } from '@/components/explorer/ExplorerSummaryCards';
import { RelationshipFilterBar } from '@/components/explorer/RelationshipFilterBar';
import { RelationshipList } from '@/components/explorer/RelationshipList';
import { RelationshipDetailPanel } from '@/components/explorer/RelationshipDetailPanel';
import { EvidenceSnapshotModal } from '@/components/explorer/EvidenceSnapshotModal';
import { RelationshipAnalysisPanel } from '@/components/explorer/RelationshipAnalysisPanel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { loadDashboardOverview, getRankings } from '@/services/api';
import { DashboardData } from '@/types/api';
import { TradeRoute, GlobeFilters } from '@/types/globe';
import { DEMO_ROUTES, buildRoutesFromRankings } from '@/services/globeData';

export const ExplorerPage: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    status: null,
    classificationSummary: null,
    rankings: null,
    minerals: [],
    auditEvents: [],
    lastUpdated: null,
    isLive: false,
    loading: true,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // 1. Fetch live backend data
  const fetchExplorerData = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRefreshing(true);
    setDashboardData((prev) => ({ ...prev, loading: true }));

    try {
      const data = await loadDashboardOverview('ALL', controller.signal);
      // Also fetch up to 50 rankings for deep exploration if live
      if (data.isLive) {
        const fullRankings = await getRankings({ page: 1, pageSize: 50 }, 50, 'ALL', controller.signal);
        if (fullRankings && fullRankings.rankings.length > 0) {
          data.rankings = fullRankings;
        }
      }
      setDashboardData(data);
    } catch {
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: 'Error loading geospatial corridor data',
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExplorerData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 2. Base routes derived from live rankings or verified demo fixture
  const isRealBackendData = dashboardData.isLive && (dashboardData.rankings?.rankings?.length ?? 0) > 0;
  const rawRoutes: TradeRoute[] = useMemo(() => {
    if (isRealBackendData && dashboardData.rankings?.rankings) {
      const liveRoutes = buildRoutesFromRankings(dashboardData.rankings.rankings);
      if (liveRoutes.length > 0) return liveRoutes;
    }
    return DEMO_ROUTES;
  }, [isRealBackendData, dashboardData.rankings]);

  // 3. Filtering State
  const [filters, setFilters] = useState<GlobeFilters>({
    mineral: 'ALL',
    classification: 'ALL',
    searchQuery: '',
    originCountry: 'ALL',
    destCountry: 'ALL',
    minScore: 0,
    maxScore: 100,
  });

  // 4. Filtered Routes Calculation
  const filteredRoutes = useMemo(() => {
    return rawRoutes.filter((route) => {
      // Mineral filter
      if (filters.mineral && filters.mineral !== 'ALL') {
        const queryMin = filters.mineral.toLowerCase();
        if (!route.mineralName.toLowerCase().includes(queryMin)) {
          return false;
        }
      }

      // Classification filter
      if (filters.classification && filters.classification !== 'ALL') {
        if (route.classification !== filters.classification) {
          return false;
        }
      }

      // Origin filter
      if (filters.originCountry && filters.originCountry !== 'ALL') {
        if (route.originCode.toUpperCase() !== filters.originCountry.toUpperCase()) {
          return false;
        }
      }

      // Destination filter
      if (filters.destCountry && filters.destCountry !== 'ALL') {
        if (route.destCode.toUpperCase() !== filters.destCountry.toUpperCase()) {
          return false;
        }
      }

      // Min score filter
      if (filters.minScore !== undefined && route.riskScore < filters.minScore) {
        return false;
      }

      // Search Query
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesOrigin =
          route.originCode.toLowerCase().includes(q) || route.originName.toLowerCase().includes(q);
        const matchesDest =
          route.destCode.toLowerCase().includes(q) || route.destName.toLowerCase().includes(q);
        const matchesMineral =
          route.mineralName.toLowerCase().includes(q) || route.commodityCode.includes(q);

        if (!matchesOrigin && !matchesDest && !matchesMineral) {
          return false;
        }
      }

      return true;
    });
  }, [rawRoutes, filters]);

  // 5. Dynamic filter facet values
  const availableMinerals = useMemo(() => {
    const set = new Set<string>();
    rawRoutes.forEach((r) => {
      if (r.mineralName) set.add(r.mineralName.trim());
    });
    return Array.from(set).sort();
  }, [rawRoutes]);

  const availableOrigins = useMemo(() => {
    const set = new Set<string>();
    rawRoutes.forEach((r) => {
      if (r.originCode) set.add(r.originCode.toUpperCase());
    });
    return Array.from(set).sort();
  }, [rawRoutes]);

  const availableDestinations = useMemo(() => {
    const set = new Set<string>();
    rawRoutes.forEach((r) => {
      if (r.destCode) set.add(r.destCode.toUpperCase());
    });
    return Array.from(set).sort();
  }, [rawRoutes]);

  // 6. Selection & Evidence Inspection States
  const [selectedRoute, setSelectedRoute] = useState<TradeRoute | null>(null);
  const [evidenceModalRoute, setEvidenceModalRoute] = useState<TradeRoute | null>(null);

  // If filteredRoutes changes and selectedRoute is filtered out, keep or clear
  const handleSelectRoute = (route: TradeRoute | null) => {
    setSelectedRoute(route);
  };

  const handleInspectEvidence = (route: TradeRoute) => {
    setEvidenceModalRoute(route);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#8D9AB2]/15">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF] shadow-[0_0_15px_-2px_rgba(67,217,255,0.2)]">
              <Globe2 className="w-5 h-5 text-[#43D9FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-[#F5F7FF]">
                  Supply Chain Explorer
                </h1>
                <StatusBadge status="PHASE 4 ACTIVE" variant="cyan" size="sm" />
                {dashboardData.isLive ? (
                  <StatusBadge status="LIVE BACKEND (SQLITE)" variant="healthy" size="sm" />
                ) : (
                  <StatusBadge status="DEMO SURVEILLANCE MODE" variant="warning" size="sm" />
                )}
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#8D9AB2] mt-0.5">
                Explore critical mineral trade relationships and supply-chain vulnerabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Last Updated */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {dashboardData.lastUpdated && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-[#8D9AB2] px-2.5 py-1.5 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15">
              <Radio className="w-3 h-3 text-[#20E09E] animate-pulse" />
              LAST SYNC: {dashboardData.lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <SecondaryButton
            size="sm"
            variant="surface"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={fetchExplorerData}
            disabled={isRefreshing}
            className="text-xs font-mono"
          >
            {isRefreshing ? 'SYNCING...' : 'REFRESH'}
          </SecondaryButton>
        </div>
      </div>

      {/* Offline Alert Banner */}
      {!dashboardData.isLive && !dashboardData.loading && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFB547]/10 border border-[#FFB547]/25 text-xs font-mono text-[#FFB547]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FFB547]" />
            <span>
              Backend engine is currently in standby. Operating in offline demonstration surveillance mode using verified reference trade corridors across Lithium, Cobalt, Nickel, Graphite, and Rare Earths.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#FFB547]/20 border border-[#FFB547]/30 shrink-0">
            DEMO MODE
          </span>
        </div>
      )}

      {/* 2. Four Summary Cards */}
      <ExplorerSummaryCards routes={rawRoutes} loading={dashboardData.loading} />

      {/* 3. Main Exploration Split Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Filter Controls & Relationship List (5 cols on xl) */}
        <div className="xl:col-span-5 space-y-4">
          <RelationshipFilterBar
            filters={filters}
            onFilterChange={setFilters}
            availableMinerals={availableMinerals}
            availableOrigins={availableOrigins}
            availableDestinations={availableDestinations}
            filteredCount={filteredRoutes.length}
            totalCount={rawRoutes.length}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8D9AB2] px-1">
              <span>ACTIVE CORRIDORS ({filteredRoutes.length})</span>
              <span>CLICK TO INSPECT DOSSIER</span>
            </div>

            <RelationshipList
              routes={filteredRoutes}
              selectedRouteId={selectedRoute?.id || null}
              onSelectRoute={handleSelectRoute}
              onResetFilters={() =>
                setFilters({
                  mineral: 'ALL',
                  classification: 'ALL',
                  searchQuery: '',
                  originCountry: 'ALL',
                  destCountry: 'ALL',
                  minScore: 0,
                  maxScore: 100,
                })
              }
              loading={dashboardData.loading}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Earth Globe & Detailed Inspection Panel (7 cols on xl) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Synchronized 3D Earth Globe */}
          <SupplyChainIntelligenceGlobe
            realRankings={dashboardData.rankings?.rankings || []}
            isLive={dashboardData.isLive}
            selectedRouteId={selectedRoute?.id || null}
            onSelectRoute={handleSelectRoute}
            filters={filters}
            onFilterChange={setFilters}
            hideInternalControls={true}
            hideInternalDrawer={true}
            rawRoutesOverride={filteredRoutes}
            className="h-[460px] lg:h-[500px]"
          />

          {/* Relationship Details Panel */}
          <RelationshipDetailPanel
            route={selectedRoute}
            onClose={() => setSelectedRoute(null)}
            onInspectEvidence={handleInspectEvidence}
          />
        </div>
      </div>

      {/* 4. Relationship Analytics Section */}
      <RelationshipAnalysisPanel routes={rawRoutes} />

      {/* 5. Frozen Evidence Snapshot Modal */}
      <EvidenceSnapshotModal
        route={evidenceModalRoute}
        open={Boolean(evidenceModalRoute)}
        onClose={() => setEvidenceModalRoute(null)}
      />

      {/* Footer System Telemetry Note */}
      <div className="pt-4 border-t border-[#8D9AB2]/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#8D9AB2]/80 gap-2">
        <div className="flex items-center gap-3">
          <span>COORDINATE PROJECTION: WGS84 EQUIRECTANGULAR</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3 text-[#43D9FF]" />
            SQLITE REPOSITORY
          </span>
        </div>
        <div>
          <span>MINETRACE PHASE 4 EXPLORER // DETERMINISTIC AUDIT READY</span>
        </div>
      </div>
    </div>
  );
};

export default ExplorerPage;
