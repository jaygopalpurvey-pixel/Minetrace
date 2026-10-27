import React from 'react';
import { TradeRoute, TradeHub } from '@/types/globe';
import { MapPin, ArrowRight } from 'lucide-react';

export interface GlobeTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  hoveredRoute: TradeRoute | null;
  hoveredHub: TradeHub | null;
}

export const GlobeTooltip: React.FC<GlobeTooltipProps> = ({
  visible,
  x,
  y,
  hoveredRoute,
  hoveredHub,
}) => {
  if (!visible || (!hoveredRoute && !hoveredHub)) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transform -translate-x-1/2 -translate-y-full mb-3"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      <div className="bg-[#090D17]/90 border border-[#43D9FF]/30 p-3 rounded-xl shadow-2xl backdrop-blur-xl text-xs font-mono min-w-[220px] max-w-[280px] animate-in fade-in-0 zoom-in-95 duration-150">
        {hoveredRoute && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 border-b border-[#8D9AB2]/15 pb-1.5">
              <span className="text-[10px] text-[#43D9FF] font-bold uppercase tracking-wider">
                TRADE CORRIDOR
              </span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                  hoveredRoute.classification === 'RED'
                    ? 'bg-[#FF5B65]/20 text-[#FF5B65]'
                    : hoveredRoute.classification === 'AMBER'
                    ? 'bg-[#FFB547]/20 text-[#FFB547]'
                    : 'bg-[#20E09E]/20 text-[#20E09E]'
                }`}
              >
                {hoveredRoute.classification}
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-[#F5F7FF] text-sm">
              <span>{hoveredRoute.originCode}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#43D9FF]" />
              <span>{hoveredRoute.destCode}</span>
            </div>

            <div className="text-[11px] text-[#8D9AB2] truncate">
              {hoveredRoute.mineralName}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#8D9AB2]/10">
              <span className="text-[#8D9AB2]/80">Anomaly Score:</span>
              <span
                className={`font-bold tabular-nums ${
                  hoveredRoute.riskScore >= 50
                    ? 'text-[#FF5B65]'
                    : hoveredRoute.riskScore >= 20
                    ? 'text-[#FFB547]'
                    : 'text-[#20E09E]'
                }`}
              >
                {hoveredRoute.riskScore.toFixed(1)} / 100
              </span>
            </div>

            <div className="text-[9px] text-[#43D9FF]/70 pt-0.5 text-center font-sans">
              Click to inspect detailed risk dossier
            </div>
          </div>
        )}

        {hoveredHub && !hoveredRoute && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 border-b border-[#8D9AB2]/15 pb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#43D9FF]" />
              <span className="text-xs font-bold text-[#F5F7FF] truncate">
                {hoveredHub.name} ({hoveredHub.code})
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8D9AB2]">Outbound Corridors:</span>
              <span className="text-[#43D9FF] font-bold">{hoveredHub.outboundRoutes.length}</span>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8D9AB2]">Inbound Corridors:</span>
              <span className="text-[#7287FF] font-bold">{hoveredHub.inboundRoutes.length}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#8D9AB2]/10">
              <span className="text-[#8D9AB2]">Max Anomaly Score:</span>
              <span
                className={`font-bold tabular-nums ${
                  hoveredHub.maxRiskScore >= 50
                    ? 'text-[#FF5B65]'
                    : hoveredHub.maxRiskScore >= 20
                    ? 'text-[#FFB547]'
                    : 'text-[#20E09E]'
                }`}
              >
                {hoveredHub.maxRiskScore.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
