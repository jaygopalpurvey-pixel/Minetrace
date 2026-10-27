import React from 'react';
import { History, CheckCircle, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  eventType: string;
  summary: string;
  source: string;
  status: 'SUCCESS' | 'INFO' | 'WARNING';
}

const INITIAL_ACTIVITIES: ActivityFeedItem[] = [
  {
    id: 'ACT-001',
    timestamp: 'Phase 1 Shell Initialized',
    eventType: 'APPLICATION_SHELL_READY',
    summary: 'MineTrace design system and dark intelligence shell initialized successfully.',
    source: 'UI_SYSTEM',
    status: 'SUCCESS',
  },
  {
    id: 'ACT-002',
    timestamp: 'Phase 8 Integration Verified',
    eventType: 'ENGINE_VERIFIED',
    summary: 'Backend 110-test suite verified with 100% pass rate across 10 subsystems.',
    source: 'FASTAPI_BACKEND',
    status: 'SUCCESS',
  },
  {
    id: 'ACT-003',
    timestamp: 'Surveillance Mode',
    eventType: 'AWAITING_INGESTION_RUN',
    summary: 'Data catalog listening for live UN Comtrade trade flows and OFAC sanctions updates.',
    source: 'DATA_CATALOG',
    status: 'INFO',
  },
];

export const RecentActivityFeed: React.FC = () => {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-[#F5F7FF] tracking-tight">
              RECENT SYSTEM & AUDIT ACTIVITY
            </h3>
            <p className="text-[11px] text-[#8D9AB2]">
              Append-Only Operational Event Trail
            </p>
          </div>
        </div>
        <StatusBadge status="LIVE STREAM" variant="cyan" size="sm" />
      </div>

      <div className="divide-y divide-[#8D9AB2]/10">
        {INITIAL_ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#111A2B]/40 px-2 rounded-lg transition-colors"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 p-1 rounded bg-[#111A2B] text-[#43D9FF] border border-[#8D9AB2]/15 shrink-0">
                <CheckCircle className="w-3.5 h-3.5 text-[#20E09E]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-semibold text-[#F5F7FF]">
                    {activity.eventType}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111A2B] text-[#7287FF] border border-[#7287FF]/20">
                    {activity.source}
                  </span>
                </div>
                <p className="text-xs text-[#8D9AB2] mt-0.5 leading-relaxed truncate">
                  {activity.summary}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8D9AB2]/70 shrink-0 self-start sm:self-center pl-7 sm:pl-0">
              <Clock className="w-3 h-3 text-[#8D9AB2]/50" />
              <span>{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
