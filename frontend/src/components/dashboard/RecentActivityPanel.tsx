import React from 'react';
import { History, CheckCircle, AlertTriangle, XCircle, Clock, Shield } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AuditEvent } from '@/types/api';

export interface RecentActivityPanelProps {
  events: AuditEvent[];
  loading?: boolean;
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  events,
  loading = false,
}) => {
  const formatEventTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return <CheckCircle className="w-3.5 h-3.5 text-[#20E09E]" />;
      case 'WARNING':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#FFB547]" />;
      case 'FAILED':
        return <XCircle className="w-3.5 h-3.5 text-[#FF5B65]" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-[#43D9FF]" />;
    }
  };

  return (
    <GlassCard className="p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/20 shadow-glow-cyan">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-[#F5F7FF] tracking-tight">
                Recent Audit Activity
              </h3>
              <p className="text-[11px] text-[#8D9AB2]">
                Append-only operational and surveillance event trail.
              </p>
            </div>
          </div>

          <StatusBadge
            status={events.length > 0 ? `${events.length} LOGGED` : 'STANDBY'}
            variant={events.length > 0 ? 'cyan' : 'neutral'}
            size="sm"
          />
        </div>

        {/* Activity rows or Empty State */}
        {loading ? (
          <div className="space-y-2 py-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-[#111A2B]/60 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-[#8D9AB2]/15 bg-[#0D1320]/40 my-2">
            <History className="w-6 h-6 text-[#8D9AB2] mb-2" />
            <span className="text-xs font-mono font-semibold text-[#F5F7FF]">
              No Audit Events Recorded Yet
            </span>
            <p className="text-[11px] text-[#8D9AB2] mt-1 max-w-xs leading-relaxed">
              Operational events will appear here automatically as trade ingestion, risk scoring, and report exports occur.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#8D9AB2]/10">
            {events.slice(0, 6).map((evt) => (
              <div
                key={evt.event_id}
                className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#111A2B]/40 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 p-1 rounded bg-[#111A2B] border border-[#8D9AB2]/15 shrink-0">
                    {getStatusIcon(evt.operation_status)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-semibold text-[#F5F7FF]">
                        {evt.event_type}
                      </span>
                      {evt.related_record_id && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#070A12] text-[#43D9FF] border border-[#43D9FF]/20 truncate max-w-[140px]">
                          {evt.related_record_id}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-[#8D9AB2] block truncate">
                      Actor: {evt.actor || 'SYSTEM_DAEMON'} // Status: {evt.operation_status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8D9AB2]/70 shrink-0 self-start sm:self-center pl-7 sm:pl-0">
                  <Clock className="w-3 h-3 text-[#8D9AB2]/50" />
                  <span>{formatEventTimestamp(evt.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#8D9AB2]/10 flex items-center justify-between text-[11px] font-mono text-[#8D9AB2]">
        <span>Tamper-evident SQLite audit_events table</span>
        <span className="text-[#20E09E]">Immutable Log</span>
      </div>
    </GlassCard>
  );
};
