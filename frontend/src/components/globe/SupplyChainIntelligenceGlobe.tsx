import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { EarthGlobe3D } from '@/components/globe/EarthGlobe3D';
import { GlobeTooltip } from '@/components/globe/GlobeTooltip';
import { RouteInspectionDrawer } from '@/components/globe/RouteInspectionDrawer';
import { PoliticalWorldMap } from '@/components/map/PoliticalWorldMap';
import { MapToolbar } from '@/components/map/MapToolbar';
import { MapFooter } from '@/components/map/MapFooter';
import { GlassCard } from '@/components/ui/GlassCard';
import { TradeRoute, TradeHub, GlobeFilters } from '@/types/globe';
import { DEMO_ROUTES, buildRoutesFromRankings, buildHubsFromRoutes } from '@/services/globeData';
import { RankingEntry } from '@/types/api';

export interface SupplyChainIntelligenceGlobeProps {
  realRankings?: RankingEntry[];
  isLive?: boolean;
  className?: string;
  selectedRouteId?: string | null;
  onSelectRoute?: (route: TradeRoute | null) => void;
  filters?: GlobeFilters;
  onFilterChange?: (filters: GlobeFilters) => void;
  hideInternalControls?: boolean;
  hideInternalDrawer?: boolean;
  rawRoutesOverride?: TradeRoute[];
  defaultViewMode?: '2D_MAP' | '3D_GLOBE';
}

export const SupplyChainIntelligenceGlobe: React.FC<SupplyChainIntelligenceGlobeProps> = ({
  realRankings = [],
  isLive = false,
  className,
  selectedRouteId,
  onSelectRoute,
  filters: externalFilters,
  onFilterChange: externalOnFilterChange,
  hideInternalControls = false,
  hideInternalDrawer = false,
  rawRoutesOverride,
  defaultViewMode = '2D_MAP', // Default to 2D Political World Map as requested
}) => {
  // 1. View Mode: 2D Political Map (Default) vs 3D Globe
  const [viewMode, setViewMode] = useState<'2D_MAP' | '3D_GLOBE'>(defaultViewMode);

  // 2. Determine raw routes (Override vs Backend vs Demo Mode)
  const isRealBackendData = isLive && realRankings.length > 0;
  const rawRoutes: TradeRoute[] = useMemo(() => {
    if (rawRoutesOverride && rawRoutesOverride.length > 0) {
      return rawRoutesOverride;
    }
    if (isRealBackendData) {
      const backendRoutes = buildRoutesFromRankings(realRankings);
      if (backendRoutes.length > 0) return backendRoutes;
    }
    return DEMO_ROUTES;
  }, [rawRoutesOverride, isRealBackendData, realRankings]);

  // 3. Filters State (Support both external controlled and internal state)
  const [internalFilters, setInternalFilters] = useState<GlobeFilters>({
    mineral: 'ALL',
    classification: 'ALL',
    searchQuery: '',
  });

  const activeFilters = externalFilters || internalFilters;
  const handleFilterUpdate = (newFilters: GlobeFilters) => {
    if (externalOnFilterChange) {
      externalOnFilterChange(newFilters);
    } else {
      setInternalFilters(newFilters);
    }
  };

  // 4. Filtered Routes Calculation
  const filteredRoutes = useMemo(() => {
    return rawRoutes.filter((route) => {
      // Mineral filter
      if (activeFilters.mineral && activeFilters.mineral !== 'ALL') {
        const queryMin = activeFilters.mineral.toLowerCase();
        if (!route.mineralName.toLowerCase().includes(queryMin)) {
          return false;
        }
      }

      // Classification filter
      if (activeFilters.classification && activeFilters.classification !== 'ALL') {
        if (route.classification !== activeFilters.classification) {
          return false;
        }
      }

      // Origin filter
      if (activeFilters.originCountry && activeFilters.originCountry !== 'ALL') {
        if (route.originCode.toUpperCase() !== activeFilters.originCountry.toUpperCase()) {
          return false;
        }
      }

      // Destination filter
      if (activeFilters.destCountry && activeFilters.destCountry !== 'ALL') {
        if (route.destCode.toUpperCase() !== activeFilters.destCountry.toUpperCase()) {
          return false;
        }
      }

      // Score range filters
      if (activeFilters.minScore !== undefined && route.riskScore < activeFilters.minScore) {
        return false;
      }
      if (activeFilters.maxScore !== undefined && route.riskScore > activeFilters.maxScore) {
        return false;
      }

      // Country / text search
      if (activeFilters.searchQuery && activeFilters.searchQuery.trim() !== '') {
        const q = activeFilters.searchQuery.toLowerCase().trim();
        const matchesOrigin =
          route.originCode.toLowerCase().includes(q) || route.originName.toLowerCase().includes(q);
        const matchesDest =
          route.destCode.toLowerCase().includes(q) || route.destName.toLowerCase().includes(q);
        const matchesMineral = route.mineralName.toLowerCase().includes(q);

        if (!matchesOrigin && !matchesDest && !matchesMineral) {
          return false;
        }
      }

      return true;
    });
  }, [rawRoutes, activeFilters]);

  // 5. Derive Hubs for 3D Globe
  const filteredHubs = useMemo(() => {
    return buildHubsFromRoutes(filteredRoutes);
  }, [filteredRoutes]);

  // 6. Interactive States
  const [hoveredRoute, setHoveredRoute] = useState<TradeRoute | null>(null);
  const [hoveredHub, setHoveredHub] = useState<TradeHub | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [internalSelectedRoute, setInternalSelectedRoute] = useState<TradeRoute | null>(null);
  const [selectedHub, setSelectedHub] = useState<TradeHub | null>(null);

  // Sync internal selected route with external selectedRouteId prop
  useEffect(() => {
    if (selectedRouteId) {
      const match = rawRoutes.find(
        (r) => r.id === selectedRouteId || r.analysisId === selectedRouteId
      );
      if (match) {
        setInternalSelectedRoute(match);
      }
    } else if (selectedRouteId === null) {
      setInternalSelectedRoute(null);
    }
  }, [selectedRouteId, rawRoutes]);

  const activeSelectedRoute = selectedRouteId
    ? rawRoutes.find((r) => r.id === selectedRouteId || r.analysisId === selectedRouteId) ||
      internalSelectedRoute
    : internalSelectedRoute;

  const [autoRotate, setAutoRotate] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [resetViewTrigger, setResetViewTrigger] = useState<number>(0);

  const handleHoverRoute = useCallback((route: TradeRoute | null, x: number, y: number) => {
    setHoveredRoute(route);
    if (route) setTooltipPos({ x, y });
  }, []);

  const handleHoverHub = useCallback((hub: TradeHub | null, x: number, y: number) => {
    setHoveredHub(hub);
    if (hub) setTooltipPos({ x, y });
  }, []);

  const handleResetView = () => {
    setResetViewTrigger((prev) => prev + 1);
  };

  const handleCloseDrawer = () => {
    setInternalSelectedRoute(null);
    setSelectedHub(null);
    if (onSelectRoute) {
      onSelectRoute(null);
    }
  };

  const handleSelectCorridor = (route: TradeRoute | null) => {
    setInternalSelectedRoute(route);
    setSelectedHub(null);
    if (onSelectRoute) {
      onSelectRoute(route);
    }
  };

  return (
    <GlassCard
      className={`relative flex flex-col overflow-hidden transition-all duration-300 border border-[#8D9AB2]/20 shadow-2xl ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen bg-[#070A12]'
          : 'min-h-[560px]'
      } ${className || ''}`}
    >
      {/* 1. Dedicated Top Map Toolbar (Search Bar, Filters, View Switcher) */}
      {!hideInternalControls && (
        <MapToolbar
          filters={activeFilters}
          onFilterChange={handleFilterUpdate}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
          onResetView={handleResetView}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
          isRealBackend={isRealBackendData}
          activeRoutesCount={filteredRoutes.length}
          totalRoutesCount={rawRoutes.length}
        />
      )}

      {/* 2. Map Canvas: 2D Political World Map OR 3D Earth Globe */}
      <div className="relative flex-1 w-full min-h-[440px] bg-[#070A12] overflow-hidden">
        {viewMode === '2D_MAP' ? (
          <PoliticalWorldMap
            routes={filteredRoutes}
            selectedRouteId={activeSelectedRoute ? activeSelectedRoute.id : null}
            onSelectRoute={handleSelectCorridor}
            onHoverRoute={handleHoverRoute}
            highlightCountryCode={
              activeFilters.searchQuery && activeFilters.searchQuery.length >= 2
                ? activeFilters.searchQuery.trim().toUpperCase()
                : null
            }
          />
        ) : (
          <EarthGlobe3D
            routes={filteredRoutes}
            hubs={filteredHubs}
            autoRotate={autoRotate}
            selectedRouteId={activeSelectedRoute ? activeSelectedRoute.id : null}
            onHoverRoute={handleHoverRoute}
            onHoverHub={handleHoverHub}
            onSelectRoute={handleSelectCorridor}
            onSelectHub={(hub) => {
              setSelectedHub(hub);
              setInternalSelectedRoute(null);
            }}
            resetViewTrigger={resetViewTrigger}
          />
        )}

        {/* 3D Floating Tooltip when in 3D globe mode */}
        {viewMode === '3D_GLOBE' && (
          <GlobeTooltip
            visible={Boolean(hoveredRoute || hoveredHub)}
            x={tooltipPos.x}
            y={tooltipPos.y}
            hoveredRoute={hoveredRoute}
            hoveredHub={hoveredHub}
          />
        )}
      </div>

      {/* 3. Bottom Legend and Telemetry Footer */}
      {!hideInternalControls && <MapFooter />}

      {/* 4. Inspection Slide-over Dossier */}
      {!hideInternalDrawer && (
        <RouteInspectionDrawer
          route={activeSelectedRoute}
          hub={selectedHub}
          onClose={handleCloseDrawer}
        />
      )}
    </GlassCard>
  );
};
