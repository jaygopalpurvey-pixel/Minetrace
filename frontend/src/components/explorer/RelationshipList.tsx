import React from 'react';
import { ArrowRight, FileCheck2, AlertCircle, Database, MapPinOff } from 'lucide-react';
import { TradeRoute } from '@/types/globe';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface RelationshipListProps {
  routes: TradeRoute[];
  selectedRouteId?: string | null;
  onSelectRoute: (route: TradeRoute) => void;
  onResetFilters?: () => void;
  loading?: boolean;
}

export const RelationshipList: React.FC<RelationshipListProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onResetFilters,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/15 animate-pulse space-y-2"
          >
            <div className="h-4 bg-[#111A2B] rounded w-1/3" />
            <div className="h-3 bg-[#111A2B] rounded w-2/3" />
            <div className="h-3 bg-[#111A2B] rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-[#0D1320] rounded-xl border border-[#8D9AB2]/20">
        <AlertCircle className="w-8 h-8 text-[#FFB547] mb-2" />
        <h4 className="text-sm font-mono font-bold text-[#F5F7FF]">No matching trade relationships</h4>
        <p className="text-xs font-mono text-[#8D9AB2] mt-1 max-w-xs">
          No records in the active dataset match your current search and filter parameters.
        </p>
        {onResetFilters && (
          <SecondaryButton
            size="sm"
            variant="surface"
            onClick={onResetFilters}
            className="mt-4 text-xs font-mono"
          >
            Reset All Filters
          </SecondaryButton>
        )}
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 50) return 'text-[#FF5B65] bg-[#FF5B65]/10 border-[#FF5B65]/30';
    if (score >= 20) return 'text-[#FFB547] bg-[#FFB547]/10 border-[#FFB547]/30';
    return 'text-[#20E09E] bg-[#20E09E]/10 border-[#20E09E]/30';
  };

  const getClassificationVariant = (classification: string): 'healthy' | 'warning' | 'error' | 'neutral' => {
    switch (classification) {
      case 'RED':
        return 'error';
      case 'AMBER':
        return 'warning';
      case 'GREEN':
        return 'healthy';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1 focus:outline-none custom-scrollbar">
      {routes.map((route) => {
        const isSelected =
          selectedRouteId === route.id || (route.analysisId && selectedRouteId === route.analysisId);

        return (
          <div
            key={route.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelectRoute(route)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectRoute(route);
              }
            }}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-200 outline-none select-none ${
              isSelected
                ? 'bg-[#111A2B] border-[#43D9FF] shadow-[0_0_15px_-3px_rgba(67,217,255,0.25)] ring-1 ring-[#43D9FF]/50'
                : 'bg-[#0D1320] border-[#8D9AB2]/20 hover:border-[#8D9AB2]/40 hover:bg-[#111A2B]/60'
            }`}
          >
            {/* Top row: Mineral and Risk Badges */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-mono font-bold text-[#F5F7FF] truncate">
                  {route.mineralName}
                </span>
                <span className="text-[10px] font-mono text-[#8D9AB2] px-1.5 py-0.5 rounded bg-[#070A12] border border-[#8D9AB2]/20 shrink-0">
                  HS {route.commodityCode}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <StatusBadge
                  status={route.classification}
                  variant={getClassificationVariant(route.classification)}
                  size="sm"
                />
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(
                    route.riskScore
                  )}`}
                >
                  {route.riskScore.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Corridor: Origin -> Destination */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#F5F7FF] mb-2">
              <span className="font-bold text-[#43D9FF] shrink-0">{route.originCode}</span>
              <span className="text-[#8D9AB2] truncate text-[11px] max-w-[120px]">{route.originName}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#8D9AB2] shrink-0" />
              <span className="font-bold text-[#7287FF] shrink-0">{route.destCode}</span>
              <span className="text-[#8D9AB2] truncate text-[11px] max-w-[120px]">{route.destName}</span>
            </div>

            {/* Metrics & Metadata Row */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#8D9AB2]/10 text-[11px] font-mono text-[#8D9AB2]">
              <div className="flex items-center gap-3">
                <span>PERIOD: {route.period}</span>
                <span>
                  {route.volumeKg !== null && route.volumeKg !== undefined
                    ? `${(route.volumeKg / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} MT`
                    : 'Vol: Unrecorded'}
                </span>
                {route.tradeValueUSD > 0 && (
                  <span className="hidden sm:inline">
                    ${(route.tradeValueUSD / 1000000).toFixed(1)}M USD
                  </span>
                )}
              </div>

              {/* Status and Geodata Flags */}
              <div className="flex items-center gap-1.5 shrink-0">
                {!route.hasGeographicCoordinates && (
                  <span
                    className="inline-flex items-center gap-1 text-[10px] text-[#FFB547] bg-[#FFB547]/10 px-1.5 py-0.5 rounded border border-[#FFB547]/20"
                    title={route.missingInfoReason || 'Geographic coordinates unavailable for this corridor'}
                  >
                    <MapPinOff className="w-3 h-3" />
                    NO GEO
                  </span>
                )}
                {route.evidenceId && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#20E09E] bg-[#20E09E]/10 px-1.5 py-0.5 rounded border border-[#20E09E]/20">
                    <FileCheck2 className="w-3 h-3" />
                    EVIDENCE
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[10px] text-[#8D9AB2] bg-[#111A2B] px-1.5 py-0.5 rounded border border-[#8D9AB2]/15">
                  <Database className="w-2.5 h-2.5" />
                  {route.isRealBackend ? 'LIVE' : 'DEMO'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
