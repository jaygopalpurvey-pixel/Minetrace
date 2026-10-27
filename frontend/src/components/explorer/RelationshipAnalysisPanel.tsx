import React, { useState } from 'react';
import { Layers, Globe2, ShieldAlert, AlertCircle, BarChart2 } from 'lucide-react';
import { TradeRoute } from '@/types/globe';
import { GlassCard } from '@/components/ui/GlassCard';

export interface RelationshipAnalysisPanelProps {
  routes: TradeRoute[];
}

export const RelationshipAnalysisPanel: React.FC<RelationshipAnalysisPanelProps> = ({ routes }) => {
  const [activeTab, setActiveTab] = useState<'mineral' | 'geography' | 'risk' | 'incomplete'>('mineral');

  // 1. Mineral Breakdown
  const mineralBreakdown = React.useMemo(() => {
    const map = new Map<string, { count: number; totalValue: number; highRiskCount: number }>();
    routes.forEach((r) => {
      const min = r.mineralName || 'Other';
      if (!map.has(min)) {
        map.set(min, { count: 0, totalValue: 0, highRiskCount: 0 });
      }
      const data = map.get(min)!;
      data.count += 1;
      data.totalValue += r.tradeValueUSD || 0;
      if (r.classification === 'RED' || r.riskScore >= 50) {
        data.highRiskCount += 1;
      }
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [routes]);

  // 2. Geographic Concentration (Origins and Destinations)
  const geoConcentration = React.useMemo(() => {
    const originMap = new Map<string, { code: string; name: string; count: number }>();
    const destMap = new Map<string, { code: string; name: string; count: number }>();

    routes.forEach((r) => {
      // Origin
      if (!originMap.has(r.originCode)) {
        originMap.set(r.originCode, { code: r.originCode, name: r.originName, count: 0 });
      }
      originMap.get(r.originCode)!.count += 1;

      // Dest
      if (!destMap.has(r.destCode)) {
        destMap.set(r.destCode, { code: r.destCode, name: r.destName, count: 0 });
      }
      destMap.get(r.destCode)!.count += 1;
    });

    const topOrigins = Array.from(originMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);
    const topDestinations = Array.from(destMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);

    return { topOrigins, topDestinations };
  }, [routes]);

  // 3. Risk Distribution
  const riskDistribution = React.useMemo(() => {
    let red = 0;
    let amber = 0;
    let green = 0;
    let insufficient = 0;

    routes.forEach((r) => {
      if (r.classification === 'RED') red += 1;
      else if (r.classification === 'AMBER') amber += 1;
      else if (r.classification === 'GREEN') green += 1;
      else insufficient += 1;
    });

    const total = routes.length || 1;
    return {
      red: { count: red, pct: ((red / total) * 100).toFixed(1) },
      amber: { count: amber, pct: ((amber / total) * 100).toFixed(1) },
      green: { count: green, pct: ((green / total) * 100).toFixed(1) },
      insufficient: { count: insufficient, pct: ((insufficient / total) * 100).toFixed(1) },
      total: routes.length,
    };
  }, [routes]);

  // 4. Incomplete or Excluded Records
  const incompleteRecords = React.useMemo(() => {
    return routes.filter(
      (r) =>
        !r.hasGeographicCoordinates ||
        r.classification === 'INSUFFICIENT_DATA' ||
        (r.scoreCompleteness && r.scoreCompleteness !== 'COMPLETE') ||
        r.missingInfoReason
    );
  }, [routes]);

  const tabs = [
    { id: 'mineral', label: 'Mineral Groups', icon: Layers },
    { id: 'geography', label: 'Concentration', icon: Globe2 },
    { id: 'risk', label: 'Risk Distribution', icon: ShieldAlert },
    { id: 'incomplete', label: `Incomplete Records (${incompleteRecords.length})`, icon: AlertCircle },
  ];

  return (
    <GlassCard className="p-5 space-y-4">
      {/* Panel Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#8D9AB2]/15">
        <div>
          <h3 className="text-sm font-mono font-bold text-[#F5F7FF] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#43D9FF]" />
            Supply Chain Relationship Analytics
          </h3>
          <p className="text-[11px] font-mono text-[#8D9AB2] mt-0.5">
            DERIVED OBSERVATIONAL METRICS FROM ACTIVE DATASET // REPORTING PERIOD: 2023
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  isActive
                    ? 'bg-[#111A2B] border-[#43D9FF] text-[#43D9FF] font-bold shadow-[0_0_10px_-2px_rgba(67,217,255,0.25)]'
                    : 'bg-[#070A12]/50 border-[#8D9AB2]/20 text-[#8D9AB2] hover:border-[#8D9AB2]/40 hover:text-[#F5F7FF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'mineral' && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {mineralBreakdown.map((item) => (
              <div
                key={item.name}
                className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 space-y-1 font-mono text-xs"
              >
                <div className="font-bold text-[#F5F7FF] flex items-center justify-between">
                  <span className="truncate">{item.name}</span>
                  <span className="text-[#43D9FF] text-[11px]">{item.count} routes</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#8D9AB2]">
                  <span>Total Value:</span>
                  <span>${(item.totalValue / 1000000).toFixed(1)}M USD</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8D9AB2]">High Risk Corridors:</span>
                  <span className={item.highRiskCount > 0 ? 'text-[#FF5B65] font-bold' : 'text-[#20E09E]'}>
                    {item.highRiskCount} flagged
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'geography' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {/* Top Exporter Jurisdictions */}
          <div className="p-3.5 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15 space-y-2">
            <h4 className="text-[11px] font-bold text-[#43D9FF] uppercase tracking-wider">
              Top Exporter Jurisdictions (Origin)
            </h4>
            <div className="space-y-1.5">
              {geoConcentration.topOrigins.map((geo, idx) => (
                <div key={geo.code} className="flex items-center justify-between p-2 rounded bg-[#111A2B]/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#8D9AB2]">#{idx + 1}</span>
                    <span className="font-bold text-[#43D9FF]">{geo.code}</span>
                    <span className="text-[#8D9AB2] text-[11px] truncate max-w-[140px]">{geo.name}</span>
                  </div>
                  <span className="font-bold text-[#F5F7FF]">{geo.count} corridors</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Importer Jurisdictions */}
          <div className="p-3.5 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15 space-y-2">
            <h4 className="text-[11px] font-bold text-[#7287FF] uppercase tracking-wider">
              Top Importer Jurisdictions (Destination)
            </h4>
            <div className="space-y-1.5">
              {geoConcentration.topDestinations.map((geo, idx) => (
                <div key={geo.code} className="flex items-center justify-between p-2 rounded bg-[#111A2B]/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#8D9AB2]">#{idx + 1}</span>
                    <span className="font-bold text-[#7287FF]">{geo.code}</span>
                    <span className="text-[#8D9AB2] text-[11px] truncate max-w-[140px]">{geo.name}</span>
                  </div>
                  <span className="font-bold text-[#F5F7FF]">{geo.count} corridors</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risk' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-[#FF5B65]/10 border border-[#FF5B65]/30">
            <span className="text-[10px] text-[#FF5B65] uppercase block">RED (HIGH RISK &ge;50)</span>
            <div className="text-xl font-bold text-[#FF5B65] mt-1">{riskDistribution.red.count}</div>
            <div className="text-[10px] text-[#8D9AB2] mt-0.5">{riskDistribution.red.pct}% of active dataset</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFB547]/10 border border-[#FFB547]/30">
            <span className="text-[10px] text-[#FFB547] uppercase block">AMBER (MEDIUM RISK 20–49)</span>
            <div className="text-xl font-bold text-[#FFB547] mt-1">{riskDistribution.amber.count}</div>
            <div className="text-[10px] text-[#8D9AB2] mt-0.5">{riskDistribution.amber.pct}% of active dataset</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#20E09E]/10 border border-[#20E09E]/30">
            <span className="text-[10px] text-[#20E09E] uppercase block">GREEN (LOW RISK &lt;20)</span>
            <div className="text-xl font-bold text-[#20E09E] mt-1">{riskDistribution.green.count}</div>
            <div className="text-[10px] text-[#8D9AB2] mt-0.5">{riskDistribution.green.pct}% of active dataset</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#7287FF]/10 border border-[#7287FF]/30">
            <span className="text-[10px] text-[#7287FF] uppercase block">INSUFFICIENT DATA</span>
            <div className="text-xl font-bold text-[#7287FF] mt-1">{riskDistribution.insufficient.count}</div>
            <div className="text-[10px] text-[#8D9AB2] mt-0.5">{riskDistribution.insufficient.pct}% baseline missing</div>
          </div>
        </div>
      )}

      {activeTab === 'incomplete' && (
        <div className="space-y-2 font-mono text-xs">
          {incompleteRecords.length === 0 ? (
            <div className="p-6 text-center text-[#8D9AB2] bg-[#070A12] rounded-xl border border-[#8D9AB2]/15">
              All records in the current dataset have complete score evaluations and verified coordinate centroids.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {incompleteRecords.map((r) => (
                <div
                  key={r.id}
                  className="p-2.5 rounded bg-[#070A12] border border-[#FFB547]/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#F5F7FF]">
                      {r.originCode} &rarr; {r.destCode} ({r.mineralName})
                    </span>
                    <span className="block text-[10px] text-[#FFB547]">
                      {r.missingInfoReason || 'Incomplete baseline or unmapped coordinates'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8D9AB2] px-2 py-0.5 rounded bg-[#111A2B] border border-[#8D9AB2]/20">
                    ID: {r.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};
