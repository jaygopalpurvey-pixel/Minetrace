import React from 'react';
import { FileCheck2, Database, AlertCircle, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export interface EvidenceSummaryCardsProps {
  totalEvidenceRecords: number;
  completeEvidenceCount: number;
  incompleteEvidenceCount: number;
  latestSnapshotTime?: string | null;
  loading?: boolean;
}

export const EvidenceSummaryCards: React.FC<EvidenceSummaryCardsProps> = ({
  totalEvidenceRecords,
  completeEvidenceCount,
  incompleteEvidenceCount,
  latestSnapshotTime,
  loading = false,
}) => {
  const cards = [
    {
      title: 'Evidence Records',
      value: totalEvidenceRecords,
      subtext: 'Immutable point-in-time snapshots',
      icon: FileCheck2,
      color: 'text-[#20E09E]',
      border: 'border-[#20E09E]/30',
      bg: 'bg-[#20E09E]/10',
    },
    {
      title: 'Assessments with Evidence',
      value: completeEvidenceCount,
      subtext: '100% verified source traceability',
      icon: Database,
      color: 'text-[#43D9FF]',
      border: 'border-[#43D9FF]/30',
      bg: 'bg-[#43D9FF]/10',
    },
    {
      title: 'Incomplete Evidence',
      value: incompleteEvidenceCount,
      subtext: 'Missing partner mirror filings',
      icon: AlertCircle,
      color: 'text-[#FFB547]',
      border: 'border-[#FFB547]/30',
      bg: 'bg-[#FFB547]/10',
    },
    {
      title: 'Latest Snapshot Time',
      value: latestSnapshotTime ? new Date(latestSnapshotTime).toLocaleTimeString() : 'RECENT',
      subtext: latestSnapshotTime ? new Date(latestSnapshotTime).toLocaleDateString() : 'Active SQLite Session',
      icon: Clock,
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
            className="p-4 flex flex-col justify-between transition-all hover:border-[#8D9AB2]/30"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#8D9AB2] uppercase tracking-wider">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.border} ${card.bg} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              {loading ? (
                <div className="h-8 w-20 bg-[#111A2B] animate-pulse rounded my-1" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-[#F5F7FF] truncate">
                  {card.value}
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
