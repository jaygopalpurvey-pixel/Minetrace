import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { Layers, Network, AlertOctagon, Database } from 'lucide-react';

export const OverviewMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Minerals Monitored"
        category="CRITICAL ASSETS"
        statusText="Awaiting data"
        subtitle="Lithium, Cobalt, Nickel, Graphite, Rare Earths"
        icon={<Layers className="w-5 h-5" />}
      />

      <MetricCard
        title="Routes Analyzed"
        category="BILATERAL CORRIDORS"
        statusText="Awaiting data"
        subtitle="Export vs import mirror discrepancies"
        icon={<Network className="w-5 h-5" />}
      />

      <MetricCard
        title="High-Risk Findings"
        category="SEVERITY ALERTS"
        statusText="Awaiting data"
        subtitle="Combined anomaly scores ≥ 50.0"
        icon={<AlertOctagon className="w-5 h-5 text-[#FF5B65]" />}
      />

      <MetricCard
        title="Data Coverage"
        category="PROVENANCE"
        statusText="Awaiting data"
        subtitle="UN Comtrade & OFAC SDN registries"
        icon={<Database className="w-5 h-5 text-[#20E09E]" />}
      />
    </div>
  );
};
