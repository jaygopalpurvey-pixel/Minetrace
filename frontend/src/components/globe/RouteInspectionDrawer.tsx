import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  ArrowRight,
  FileCheck2,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';
import { TradeRoute, TradeHub } from '@/types/globe';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface RouteInspectionDrawerProps {
  route: TradeRoute | null;
  hub: TradeHub | null;
  onClose: () => void;
}

export const RouteInspectionDrawer: React.FC<RouteInspectionDrawerProps> = ({
  route,
  hub,
  onClose,
}) => {
  const isOpen = Boolean(route || hub);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#070A12]/80 backdrop-blur-sm animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed right-0 inset-y-0 z-50 w-full max-w-md bg-[#090D17] border-l border-[#8D9AB2]/20 shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200 outline-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#8D9AB2]/15 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/30 shadow-glow-cyan">
                {route ? <Layers className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-bold font-mono text-[#F5F7FF] tracking-tight">
                  {route ? 'SUPPLY CORRIDOR DOSSIER' : 'TRADE HUB SURVEILLANCE'}
                </h3>
                <span className="text-[10px] font-mono text-[#43D9FF] uppercase tracking-wider">
                  {route?.isRealBackend ? 'LIVE FASTAPI RECORD' : 'VERIFIED SURVEILLANCE REFERENCE'}
                </span>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                aria-label="Close details"
                className="p-2 rounded-lg text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B] border border-[#8D9AB2]/15"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Route Details Body */}
          {route && (
            <div className="space-y-5 flex-1">
              {/* Origin to Destination Card */}
              <div className="p-4 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/15 space-y-3">
                <span className="text-[10px] font-mono text-[#8D9AB2] uppercase block tracking-wider font-semibold">
                  BILATERAL CORRIDOR
                </span>

                <div className="flex items-center justify-between gap-3 font-mono">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xl font-bold text-[#F5F7FF]">{route.originCode}</span>
                    <span className="text-xs text-[#8D9AB2] truncate">{route.originName}</span>
                  </div>

                  <div className="flex flex-col items-center shrink-0 px-2">
                    <span className="text-[10px] text-[#43D9FF] font-mono">EXPORT → IMPORT</span>
                    <ArrowRight className="w-5 h-5 text-[#43D9FF] my-0.5" />
                  </div>

                  <div className="flex flex-col items-end min-w-0 text-right">
                    <span className="text-xl font-bold text-[#F5F7FF]">{route.destCode}</span>
                    <span className="text-xs text-[#8D9AB2] truncate">{route.destName}</span>
                  </div>
                </div>
              </div>

              {/* Anomaly & Risk Score Card */}
              <div className="p-4 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8D9AB2] uppercase font-semibold">
                    COMBINED ANOMALY ASSESSMENT
                  </span>
                  <StatusBadge
                    status={route.classification}
                    variant={
                      route.classification === 'RED'
                        ? 'error'
                        : route.classification === 'AMBER'
                        ? 'warning'
                        : 'healthy'
                    }
                    size="sm"
                  />
                </div>

                <div className="flex items-baseline justify-between font-mono">
                  <span className="text-3xl font-bold text-[#F5F7FF] tabular-nums">
                    {route.riskScore.toFixed(1)}
                    <span className="text-sm text-[#8D9AB2]/60 font-normal"> / 100</span>
                  </span>
                  <span className="text-xs text-[#8D9AB2]">
                    Sanctions: <span className="font-semibold text-[#F5F7FF]">{route.sanctionsStatus}</span>
                  </span>
                </div>
              </div>

              {/* Mineral & Trade Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15 space-y-1">
                  <span className="text-[#8D9AB2] text-[10px] block">MINERAL ASSET</span>
                  <span className="font-bold text-[#F5F7FF] truncate block">
                    {route.mineralName}
                  </span>
                  <span className="text-[10px] text-[#43D9FF] block">HS {route.commodityCode}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15 space-y-1">
                  <span className="text-[#8D9AB2] text-[10px] block">REPORTING PERIOD</span>
                  <span className="font-bold text-[#F5F7FF] block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#7287FF]" />
                    {route.period}
                  </span>
                  <span className="text-[10px] text-[#8D9AB2] block">Annual Cycle</span>
                </div>

                <div className="p-3 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15 space-y-1">
                  <span className="text-[#8D9AB2] text-[10px] block">REPORTED VALUE</span>
                  <span className="font-bold text-[#F5F7FF] block tabular-nums">
                    ${(route.tradeValueUSD / 1000000).toFixed(1)}M USD
                  </span>
                  <span className="text-[10px] text-[#8D9AB2] block">Customs valuation</span>
                </div>

                <div className="p-3 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15 space-y-1">
                  <span className="text-[#8D9AB2] text-[10px] block">NET WEIGHT</span>
                  <span className="font-bold text-[#F5F7FF] block tabular-nums">
                    {route.volumeKg ? `${(route.volumeKg / 1000).toLocaleString()} MT` : 'Not reported'}
                  </span>
                  <span className="text-[10px] text-[#8D9AB2] block">Physical volume</span>
                </div>
              </div>

              {/* Evaluated 5-Rule Breakdown */}
              <div className="p-4 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/15 space-y-2">
                <span className="text-[10px] font-mono text-[#8D9AB2] uppercase block font-semibold">
                  EVALUATED RULES & ANOMALIES
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded bg-[#111A2B]/60 border border-[#8D9AB2]/10">
                    <span className="text-[#43D9FF]">R1 Mirror Trade Gap (30%)</span>
                    <span className={route.evaluatedRules.includes('R1') ? 'text-[#FF5B65] font-bold' : 'text-[#8D9AB2]'}>
                      {route.evaluatedRules.includes('R1') ? 'FLAGGED (>30%)' : 'NORMAL'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#111A2B]/60 border border-[#8D9AB2]/10">
                    <span className="text-[#43D9FF]">R2 Volume Surge (20%)</span>
                    <span className={route.evaluatedRules.includes('R2') ? 'text-[#FF5B65] font-bold' : 'text-[#8D9AB2]'}>
                      {route.evaluatedRules.includes('R2') ? 'FLAGGED (>200%)' : 'NORMAL'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#111A2B]/60 border border-[#8D9AB2]/10">
                    <span className="text-[#43D9FF]">R3 Jurisdiction Transit (30%)</span>
                    <span className={route.evaluatedRules.includes('R3') ? 'text-[#FF5B65] font-bold' : 'text-[#8D9AB2]'}>
                      {route.evaluatedRules.includes('R3') ? 'FLAGGED (>80%)' : 'NORMAL'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#111A2B]/60 border border-[#8D9AB2]/10">
                    <span className="text-[#43D9FF]">R4 Unit Price Dispersion (20%)</span>
                    <span className={route.evaluatedRules.includes('R4') ? 'text-[#FF5B65] font-bold' : 'text-[#8D9AB2]'}>
                      {route.evaluatedRules.includes('R4') ? 'FLAGGED (>60%)' : 'NORMAL'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#111A2B]/60 border border-[#8D9AB2]/10">
                    <span className="text-[#43D9FF]">R5 OFAC Sanctions Screening</span>
                    <span className={route.sanctionsStatus === 'REVIEW_MATCH' ? 'text-[#FF5B65] font-bold' : 'text-[#20E09E]'}>
                      {route.sanctionsStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Evidence Snapshot Reference */}
              {route.evidenceId && (
                <div className="p-3 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-[#43D9FF]" />
                    <span className="text-[#8D9AB2]">Evidence Ref:</span>
                    <span className="font-semibold text-[#F5F7FF] truncate max-w-[160px]">
                      {route.evidenceId}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#20E09E]">Frozen</span>
                </div>
              )}

              {/* Mandatory Legal & Methodology Disclaimer Pill */}
              <div className="p-3 rounded-lg bg-[#FFB547]/10 border border-[#FFB547]/25 text-[11px] font-mono text-[#FFB547] leading-relaxed">
                <strong>METHODOLOGY NOTICE:</strong> {route.disclaimer}
              </div>
            </div>
          )}

          {/* Hub Details Body */}
          {hub && !route && (
            <div className="space-y-5 flex-1">
              <div className="p-4 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/15 space-y-2">
                <span className="text-[10px] font-mono text-[#8D9AB2] uppercase block tracking-wider font-semibold">
                  LOCATION IDENTIFIER
                </span>
                <h4 className="text-xl font-bold font-mono text-[#F5F7FF]">
                  {hub.name} ({hub.code})
                </h4>
                <p className="text-xs font-mono text-[#8D9AB2]">
                  Coordinates: {hub.coords[0].toFixed(4)}°, {hub.coords[1].toFixed(4)}°
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15">
                  <span className="text-[#8D9AB2] text-[10px] block">OUTBOUND CORRIDORS</span>
                  <span className="text-2xl font-bold text-[#43D9FF]">{hub.outboundRoutes.length}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/15">
                  <span className="text-[#8D9AB2] text-[10px] block">INBOUND CORRIDORS</span>
                  <span className="text-2xl font-bold text-[#7287FF]">{hub.inboundRoutes.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-[#8D9AB2] uppercase font-semibold">
                  CONNECTED SUPPLY-CHAIN CORRIDORS:
                </span>
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                  {[...hub.outboundRoutes, ...hub.inboundRoutes].map((r) => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-lg bg-[#111A2B]/60 border border-[#8D9AB2]/15 text-xs font-mono flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-[#F5F7FF] block truncate">
                          {r.originCode} → {r.destCode}
                        </span>
                        <span className="text-[11px] text-[#8D9AB2] truncate block">
                          {r.mineralName}
                        </span>
                      </div>
                      <StatusBadge
                        status={r.classification}
                        variant={
                          r.classification === 'RED'
                            ? 'error'
                            : r.classification === 'AMBER'
                            ? 'warning'
                            : 'healthy'
                        }
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-4 border-t border-[#8D9AB2]/15 mt-auto">
            <SecondaryButton onClick={onClose} className="w-full font-mono text-xs">
              Dismiss Dossier
            </SecondaryButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
