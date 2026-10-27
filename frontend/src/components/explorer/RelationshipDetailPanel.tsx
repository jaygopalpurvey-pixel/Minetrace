import React from 'react';
import {
  X,
  ArrowRight,
  ShieldAlert,
  FileCheck2,
  Calendar,
  DollarSign,
  Scale,
  Database,
  MapPinOff,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { TradeRoute } from '@/types/globe';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface RelationshipDetailPanelProps {
  route: TradeRoute | null;
  onClose: () => void;
  onInspectEvidence?: (route: TradeRoute) => void;
}

export const RelationshipDetailPanel: React.FC<RelationshipDetailPanelProps> = ({
  route,
  onClose,
  onInspectEvidence,
}) => {
  if (!route) {
    return (
      <div className="p-6 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
        <Info className="w-8 h-8 text-[#43D9FF]/60 mb-2" />
        <h4 className="text-sm font-mono font-bold text-[#F5F7FF]">No Relationship Selected</h4>
        <p className="text-xs font-mono text-[#8D9AB2] mt-1 max-w-xs">
          Select a trade corridor from the list or click an arc on the 3D Earth globe to inspect verified customs evidence and anomaly evaluations.
        </p>
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

  const rulesMap: Record<string, { name: string; desc: string }> = {
    R1: { name: 'Mirror Trade Discrepancy', desc: 'Declared export vs declared partner import divergence >30%' },
    R2: { name: 'Volume Surge Anomaly', desc: 'Short-term volume acceleration >200% above historical baseline' },
    R3: { name: 'Jurisdiction Route Concentration', desc: 'Concentration in high-risk transshipment chokepoint >80%' },
    R4: { name: 'Unit Price Dispersion', desc: 'Reported unit price deviates >60% from peer benchmark' },
    R5: { name: 'OFAC Sanctions Proximity', desc: 'Consignee or carrier matched against SDN/OFAC listings' },
  };

  return (
    <div className="p-5 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 flex flex-col justify-between h-full space-y-4 animate-in fade-in-0 duration-200">
      {/* Header with Title and Close Action */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#8D9AB2]/15">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-mono font-bold text-[#F5F7FF]">
              {route.mineralName}
            </span>
            <StatusBadge
              status={route.classification}
              variant={getClassificationVariant(route.classification)}
              size="sm"
            />
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getScoreColor(
                route.riskScore
              )}`}
            >
              {route.riskScore.toFixed(1)} / 100
            </span>
          </div>
          <div className="text-[11px] font-mono text-[#8D9AB2] mt-0.5">
            COMMODITY CODE: HS {route.commodityCode} // RECORD: {route.id}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B] transition-colors"
          title="Close details panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[520px] pr-1 custom-scrollbar">
        {/* Bilateral Sovereign Corridor */}
        <div className="p-3.5 rounded-lg bg-[#111A2B] border border-[#8D9AB2]/20 space-y-2">
          <div className="text-[10px] font-mono text-[#8D9AB2] uppercase tracking-wider">
            Bilateral Customs Corridor
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-base font-mono font-bold text-[#43D9FF]">{route.originCode}</div>
              <div className="text-xs text-[#8D9AB2] max-w-[150px] leading-snug">{route.originName}</div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#8D9AB2] shrink-0" />
            <div className="text-right">
              <div className="text-base font-mono font-bold text-[#7287FF]">{route.destCode}</div>
              <div className="text-xs text-[#8D9AB2] max-w-[150px] leading-snug">{route.destName}</div>
            </div>
          </div>
        </div>

        {/* 1. Observed Customs Data Section */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-[#43D9FF] uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            1. Observed Customs Declaration Data
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[#8D9AB2] text-[10px] block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#43D9FF]" />
                REPORTING PERIOD
              </span>
              <span className="text-[#F5F7FF] font-bold mt-0.5 block">{route.period}</span>
            </div>

            <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[#8D9AB2] text-[10px] block flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-[#20E09E]" />
                REPORTED VALUE (USD)
              </span>
              <span className="text-[#F5F7FF] font-bold mt-0.5 block">
                {route.tradeValueUSD > 0
                  ? `$${route.tradeValueUSD.toLocaleString()}`
                  : 'Normalized Estimate'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[#8D9AB2] text-[10px] block flex items-center gap-1">
                <Scale className="w-3 h-3 text-[#FFB547]" />
                REPORTED VOLUME
              </span>
              <span className="text-[#F5F7FF] font-bold mt-0.5 block">
                {route.volumeKg !== null && route.volumeKg !== undefined
                  ? `${route.volumeKg.toLocaleString()} ${route.unit || 'kg'}`
                  : 'Unrecorded in filing'}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
              <span className="text-[#8D9AB2] text-[10px] block flex items-center gap-1">
                <Database className="w-3 h-3 text-[#7287FF]" />
                DATA SOURCE
              </span>
              <span className="text-[#F5F7FF] font-bold mt-0.5 block truncate">
                {route.sourceDataset || 'UN Comtrade (Verified)'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Calculated Anomaly Indicators Section */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-[#FFB547] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            2. Calculated Anomaly Indicators
          </div>

          {/* Anomaly Score Progress Meter */}
          <div className="p-3 rounded bg-[#070A12] border border-[#8D9AB2]/15 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8D9AB2]">Aggregated Anomaly Score</span>
              <span className="font-bold text-[#F5F7FF]">{route.riskScore.toFixed(1)} / 100</span>
            </div>
            <div className="w-full bg-[#111A2B] h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  route.riskScore >= 50
                    ? 'bg-[#FF5B65]'
                    : route.riskScore >= 20
                    ? 'bg-[#FFB547]'
                    : 'bg-[#20E09E]'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, route.riskScore))}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8D9AB2]">
              <span>Low (&lt;20)</span>
              <span>Medium (20–49)</span>
              <span>High (50–100)</span>
            </div>
          </div>

          {/* Evaluated 5-Rule Anomaly Grid */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-[#8D9AB2] uppercase block">
              Evaluated Deterministic Risk Rules
            </span>
            <div className="space-y-1">
              {['R1', 'R2', 'R3', 'R4', 'R5'].map((ruleId) => {
                const isFlagged = route.evaluatedRules.includes(ruleId);
                const info = rulesMap[ruleId] || { name: ruleId, desc: '' };
                return (
                  <div
                    key={ruleId}
                    className={`p-2 rounded border text-xs font-mono flex items-center justify-between gap-2 ${
                      isFlagged
                        ? 'bg-[#FF5B65]/10 border-[#FF5B65]/30 text-[#F5F7FF]'
                        : 'bg-[#070A12] border-[#8D9AB2]/15 text-[#8D9AB2]'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span className={isFlagged ? 'text-[#FF5B65]' : 'text-[#8D9AB2]'}>
                          {ruleId}
                        </span>
                        <span>{info.name}</span>
                      </div>
                      <div className="text-[10px] text-[#8D9AB2]">{info.desc}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                        isFlagged
                          ? 'bg-[#FF5B65]/20 border-[#FF5B65]/40 text-[#FF5B65]'
                          : 'bg-[#111A2B] border-[#8D9AB2]/20 text-[#8D9AB2]'
                      }`}
                    >
                      {isFlagged ? 'FLAGGED' : 'PASSED'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sanctions Review Status */}
          <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15 flex items-center justify-between text-xs font-mono">
            <span className="text-[#8D9AB2]">Sanctions Screening Status</span>
            <span
              className={`font-bold px-2 py-0.5 rounded border ${
                route.sanctionsStatus === 'MATCH_IDENTIFIED'
                  ? 'text-[#FF5B65] bg-[#FF5B65]/10 border-[#FF5B65]/40'
                  : 'text-[#20E09E] bg-[#20E09E]/10 border-[#20E09E]/40'
              }`}
            >
              {route.sanctionsStatus}
            </span>
          </div>
        </div>

        {/* 3. Missing / Baseline Information Section */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-[#7287FF] uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            3. Completeness &amp; Geographic Coverage
          </div>
          <div className="p-2.5 rounded bg-[#070A12] border border-[#8D9AB2]/15 text-xs font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#8D9AB2]">Score Completeness:</span>
              <span className="font-bold text-[#F5F7FF]">{route.scoreCompleteness || 'COMPLETE'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8D9AB2]">Geographic Centroids:</span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  route.hasGeographicCoordinates ? 'text-[#20E09E]' : 'text-[#FFB547]'
                }`}
              >
                {!route.hasGeographicCoordinates && <MapPinOff className="w-3 h-3" />}
                {route.hasGeographicCoordinates ? 'MAPPED TO 3D GLOBE' : 'UNMAPPED CENTROID'}
              </span>
            </div>
            {!route.hasGeographicCoordinates && route.missingInfoReason && (
              <p className="text-[11px] text-[#FFB547] bg-[#FFB547]/10 p-1.5 rounded border border-[#FFB547]/20 mt-1">
                {route.missingInfoReason}
              </p>
            )}
          </div>
        </div>

        {/* Methodology and Integrity Notice */}
        <div className="p-2.5 rounded bg-[#111A2B]/60 border border-[#8D9AB2]/15 text-[10px] font-mono text-[#8D9AB2] leading-relaxed">
          <strong className="text-[#F5F7FF]">DATA INTEGRITY NOTICE:</strong> Bilateral corridors represent sovereign customs declaration reconciliations between reporting and partner jurisdictions. Visual 3D arcs illustrate trade connections and do not represent physical maritime vessel routes or specific mine coordinates.
        </div>
      </div>

      {/* Action Footer: Inspect Forensic Evidence Proof */}
      <div className="pt-3 border-t border-[#8D9AB2]/15 flex items-center justify-between gap-2">
        {onInspectEvidence && (
          <PrimaryButton
            size="sm"
            leftIcon={<FileCheck2 className="w-3.5 h-3.5" />}
            onClick={() => onInspectEvidence(route)}
            className="w-full text-xs font-mono justify-center"
          >
            INSPECT EVIDENCE SNAPSHOT
          </PrimaryButton>
        )}
        <SecondaryButton
          size="sm"
          variant="surface"
          onClick={onClose}
          className="text-xs font-mono shrink-0"
        >
          CLOSE
        </SecondaryButton>
      </div>
    </div>
  );
};
