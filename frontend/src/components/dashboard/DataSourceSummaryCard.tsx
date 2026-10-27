import React from 'react';
import { Database, HardDrive, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const DataSourceSummaryCard: React.FC = () => {
  return (
    <GlassCard className="p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#20E09E]/10 text-[#20E09E] border border-[#20E09E]/20">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-[#F5F7FF] tracking-tight">
                DATA REGISTRIES & FEEDS
              </h3>
              <p className="text-[11px] text-[#8D9AB2]">
                Offline-First Data Pipeline Coverage
              </p>
            </div>
          </div>
          <StatusBadge status="STANDBY" variant="neutral" size="sm" />
        </div>

        <div className="space-y-2.5">
          {/* Source 1 */}
          <div className="p-3 rounded-lg bg-[#111A2B]/70 border border-[#8D9AB2]/10 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[#F5F7FF]">UN Comtrade API v1</span>
              <span className="text-[10px] text-[#43D9FF] px-1.5 py-0.5 rounded bg-[#43D9FF]/10 border border-[#43D9FF]/20">
                HS 283691, 2605, 7501+
              </span>
            </div>
            <p className="text-[11px] text-[#8D9AB2] leading-relaxed">
              Bilateral critical mineral trade flows with partner mirror reconciliation.
            </p>
          </div>

          {/* Source 2 */}
          <div className="p-3 rounded-lg bg-[#111A2B]/70 border border-[#8D9AB2]/10 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-[#F5F7FF]">US Treasury OFAC SDN List</span>
              <span className="text-[10px] text-[#FFB547] px-1.5 py-0.5 rounded bg-[#FFB547]/10 border border-[#FFB547]/20">
                SDN ADVANCED CACHE
              </span>
            </div>
            <p className="text-[11px] text-[#8D9AB2] leading-relaxed">
              Entity sanctions screening and blocked person verification with offline cache.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#8D9AB2]/10 flex items-center justify-between text-[11px] font-mono text-[#8D9AB2]">
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-[#20E09E]" />
          <span>Local SQLite: data/minetrace.db</span>
        </div>
        <div className="flex items-center gap-1 text-[#20E09E]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>13 Tables Intact</span>
        </div>
      </div>
    </GlassCard>
  );
};
