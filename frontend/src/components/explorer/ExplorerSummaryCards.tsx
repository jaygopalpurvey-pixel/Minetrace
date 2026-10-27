import React from 'react';
import { Layers, GitFork, Globe2, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { TradeRoute } from '@/types/globe';

export interface ExplorerSummaryCardsProps {
  routes: TradeRoute[];
  loading?: boolean;
}

export const ExplorerSummaryCards: React.FC<ExplorerSummaryCardsProps> = ({ routes, loading = false }) => {
  // 1. Calculate actual distinct metrics from the loaded dataset
  const mineralsTracked = React.useMemo(() => {
    const set = new Set<string>();
    routes.forEach((r) => {
      if (r.mineralName) set.add(r.mineralName.trim().toLowerCase());
    });
    return set.size;
  }, [routes]);

  const totalRelationships = routes.length;

  const countriesCovered = React.useMemo(() => {
    const set = new Set<string>();
    routes.forEach((r) => {
      if (r.originCode) set.add(r.originCode.toUpperCase());
      if (r.destCode) set.add(r.destCode.toUpperCase());
    });
    return set.size;
  }, [routes]);

  const requiringReview = React.useMemo(() => {
    return routes.filter(
      (r) => r.classification === 'RED' || r.classification === 'AMBER' || r.riskScore >= 40
    ).length;
  }, [routes]);

  const cards = [
    {
      title: 'Minerals Tracked',
      value: loading ? null : mineralsTracked,
      subtext: `${mineralsTracked} critical mineral categories`,
      icon: Layers,
      color: 'text-[#43D9FF]',
      borderColor: 'border-[#43D9FF]/30',
      bgColor: 'bg-[#43D9FF]/10',
    },
    {
      title: 'Trade Relationships',
      value: loading ? null : totalRelationships,
      subtext: `${totalRelationships} bilateral customs corridors`,
      icon: GitFork,
      color: 'text-[#7287FF]',
      borderColor: 'border-[#7287FF]/30',
      bgColor: 'bg-[#7287FF]/10',
    },
    {
      title: 'Countries Covered',
      value: loading ? null : countriesCovered,
      subtext: `${countriesCovered} sovereign jurisdictions`,
      icon: Globe2,
      color: 'text-[#20E09E]',
      borderColor: 'border-[#20E09E]/30',
      bgColor: 'bg-[#20E09E]/10',
    },
    {
      title: 'Requiring Review',
      value: loading ? null : requiringReview,
      subtext: `${requiringReview} flagged anomaly corridors`,
      icon: AlertTriangle,
      color: 'text-[#FF5B65]',
      borderColor: 'border-[#FF5B65]/30',
      bgColor: 'bg-[#FF5B65]/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <GlassCard
            key={idx}
            className="p-4 transition-all duration-200 hover:border-[#8D9AB2]/30 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#8D9AB2] uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg border ${card.borderColor} ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              {loading ? (
                <div className="h-8 w-20 bg-[#111A2B] animate-pulse rounded my-1" />
              ) : (
                <div className="text-2xl font-bold font-mono tracking-tight text-[#F5F7FF]">
                  {card.value ?? '—'}
                </div>
              )}
              <div className="text-[11px] font-mono text-[#8D9AB2] mt-0.5 truncate">
                {loading ? 'Calculating verified metrics...' : card.subtext}
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
