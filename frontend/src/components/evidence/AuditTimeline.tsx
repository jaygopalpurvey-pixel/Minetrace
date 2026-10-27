import React from 'react';
import {
  Clock,
  History,
  FileCheck2,
  Shield,
  FileDown,
  AlertCircle,
  User,
} from 'lucide-react';
import { AuditEvent } from '@/types/api';
import { GlassCard } from '@/components/ui/GlassCard';

export interface AuditTimelineProps {
  events: AuditEvent[];
  loading?: boolean;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ events, loading = false }) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'EVIDENCE_SNAPSHOT_CREATED':
      case 'EVIDENCE_CAPTURED':
        return <FileCheck2 className="w-3.5 h-3.5 text-[#20E09E]" />;
      case 'RISK_ANALYSIS_CREATED':
      case 'RISK_EVALUATION':
        return <Shield className="w-3.5 h-3.5 text-[#43D9FF]" />;
      case 'PDF_REPORT_GENERATED':
      case 'REPORT_EXPORTED':
        return <FileDown className="w-3.5 h-3.5 text-[#FFB547]" />;
      default:
        return <History className="w-3.5 h-3.5 text-[#7287FF]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-[#20E09E] bg-[#20E09E]/10 border-[#20E09E]/30';
      case 'FAILED':
        return 'text-[#FF5B65] bg-[#FF5B65]/10 border-[#FF5B65]/30';
      case 'WARNING':
        return 'text-[#FFB547] bg-[#FFB547]/10 border-[#FFB547]/30';
      default:
        return 'text-[#8D9AB2] bg-[#111A2B] border-[#8D9AB2]/20';
    }
  };

  return (
    <GlassCard className="p-5 space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#43D9FF]" />
          <div>
            <h3 className="text-sm font-bold text-[#F5F7FF] uppercase tracking-wider">
              Append-Only Operational Audit Trail ({events.length} events)
            </h3>
            <span className="text-[10px] text-[#8D9AB2]">
              CHRONOLOGICAL EVENT LOG FROM LOCAL SQLITE REPOSITORY
            </span>
          </div>
        </div>

        <span className="text-[10px] text-[#20E09E] bg-[#20E09E]/10 px-2 py-0.5 rounded border border-[#20E09E]/30 self-start sm:self-auto">
          APPEND-ONLY ARCHIVE
        </span>
      </div>

      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-6 h-6 rounded-full border-2 border-[#43D9FF] border-t-transparent animate-spin" />
          <span className="text-xs text-[#8D9AB2]">Retrieving audit events from SQLite...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="p-8 text-center bg-[#070A12] rounded-xl border border-[#8D9AB2]/15 space-y-2">
          <AlertCircle className="w-6 h-6 text-[#FFB547] mx-auto" />
          <h4 className="text-xs font-bold text-[#F5F7FF]">No Audit Events Recorded Yet</h4>
          <p className="text-[11px] text-[#8D9AB2] max-w-sm mx-auto">
            Operational events (evidence captures, score calculations, PDF report exports) will appear here chronologically as actions are performed in the backend.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-3.5 border-l-2 border-[#111A2B] my-2">
          {events.map((evt) => (
            <div key={evt.event_id} className="relative group">
              {/* Timeline Node */}
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#111A2B] border-2 border-[#43D9FF] group-hover:scale-125 transition-transform" />

              <div className="p-3 rounded-lg bg-[#070A12] border border-[#8D9AB2]/15 space-y-1.5 hover:border-[#8D9AB2]/30 transition-colors">
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    {getEventIcon(evt.event_type)}
                    <span className="font-bold text-[#F5F7FF] text-xs">{evt.event_type}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <span className={`px-1.5 py-0.5 rounded border font-bold ${getStatusColor(evt.operation_status)}`}>
                      {evt.operation_status}
                    </span>
                    <span className="text-[#8D9AB2] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8D9AB2] pt-1">
                  <div>
                    {evt.related_record_id && (
                      <span>
                        TARGET ID: <strong className="text-[#43D9FF]">{evt.related_record_id}</strong>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <User className="w-3 h-3" />
                    <span>ACTOR: {evt.actor || 'SYSTEM_ENGINE'}</span>
                  </div>
                </div>

                {/* Metadata Summary if present */}
                {evt.metadata_summary && Object.keys(evt.metadata_summary).length > 0 && (
                  <div className="p-2 rounded bg-[#111A2B]/60 text-[10px] text-[#8D9AB2] font-mono overflow-x-auto">
                    {JSON.stringify(evt.metadata_summary)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};
