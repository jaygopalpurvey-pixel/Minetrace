import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export interface RankingsSummaryCardsProps {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  insufficientCount: number;
  totalEligible: number;
  loading?: boolean;
}

export const RankingsSummaryCards: React.FC<RankingsSummaryCardsProps> = ({
  highRiskCount,
  mediumRiskCount,
  lowRiskCount,
  insufficientCount,
  totalEligible,
  loading = false,
}) => {
  const cards = [
    {
      title: 'High-Risk Findings',
      count: highRiskCount,
      subtext: 'Score ≥ 50 // Immediate Review',
      icon: ShieldAlert,
      color: 'text-[#FF5B65]',
      border: 'border-[#FF5B65]/30',
      bg: 'bg-[#FF5B65]/10',
    },
    {
      title: 'Medium-Risk Findings',
      count: mediumRiskCount,
      subtext: 'Score 20–49 // Elevated Variance',
      icon: AlertTriangle,
      color: 'text-[#FFB547]',
      border: 'border-[#FFB547]/30',
      bg: 'bg-[#FFB547]/10',
    },
    {
      title: 'Low-Risk Findings',
      count: lowRiskCount,
      subtext: `Score < 20 // of ${totalEligible} eligible`,
      icon: ShieldCheck,
      color: 'text-[#20E09E]',
      border: 'border-[#20E09E]/30',
      bg: 'bg-[#20E09E]/10',
    },
    {
      title: 'Insufficient Data',
      count: insufficientCount,
      subtext: 'Excluded from primary rank (No Zero Assumption)',
      icon: HelpCircle,
      color: 'text-[#7287FF]',
      border: 'border-[#7287FF]/30',
      bg: 'bg-[#7287FF]/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <GlassCard
            key={idx}
            className={`p-4 flex flex-col justify-between transition-all hover:border-[#8D9AB2]/30`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#8D9AB2] uppercase tracking-wider">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.border} ${card.bg} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              {loading ? (
                <div className="h-8 w-16 bg-[#111A2B] animate-pulse rounded my-1" />
              ) : (
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F7FF]">
                  {card.count}
                </div>
              )}
              <div className="text-[11px] text-[#8D9AB2] mt-0.5 truncate">{card.subtext}</div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
