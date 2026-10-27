import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { StatusBadge, StatusVariant } from '@/components/ui/StatusBadge';

export interface EvidenceRecordItem {
  snapshot_id: string;
  analysis_id: string;
  commodity_code: string;
  mineral_name: string;
  reporter_country: string;
  partner_country: string;
  evidence_type: string;
  source_dataset: string;
  period: string;
  capture_timestamp: string;
  anomaly_score: number;
  classification: string;
  completeness: string;
}

export interface EvidenceRecordsTableProps {
  records: EvidenceRecordItem[];
  onSelectRecord: (record: EvidenceRecordItem) => void;
  loading?: boolean;
}

export const EvidenceRecordsTable: React.FC<EvidenceRecordsTableProps> = ({
  records,
  onSelectRecord,
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return records.slice(start, start + pageSize);
  }, [records, currentPage]);

  const getClassificationVariant = (classification: string): StatusVariant => {
    switch (classification) {
      case 'RED':
        return 'error';
      case 'AMBER':
        return 'warning';
      case 'GREEN':
        return 'healthy';
      default:
        return 'cyan';
    }
  };

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 space-y-3 font-mono">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-[#111A2B] animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="p-12 text-center bg-[#0D1320] rounded-xl border border-[#8D9AB2]/20 font-mono text-xs space-y-2">
        <AlertCircle className="w-8 h-8 text-[#FFB547] mx-auto" />
        <h4 className="text-sm font-bold text-[#F5F7FF]">No Evidence Snapshots Found</h4>
        <p className="text-[#8D9AB2] max-w-sm mx-auto">
          No point-in-time evidence snapshots match the current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 overflow-hidden font-mono text-xs">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#8D9AB2]/20 bg-[#111A2B]/60 text-[11px] text-[#8D9AB2]">
              <th className="py-3 px-3.5 font-bold">SNAPSHOT ID</th>
              <th className="py-3 px-3.5 font-bold">CORRIDOR / MINERAL</th>
              <th className="py-3 px-3.5 font-bold">EVIDENCE TYPE</th>
              <th className="py-3 px-3.5 font-bold">SOURCE</th>
              <th className="py-3 px-3.5 font-bold">PERIOD</th>
              <th className="py-3 px-3.5 font-bold">CAPTURE TIMESTAMP</th>
              <th className="py-3 px-3.5 font-bold">ASSESSMENT</th>
              <th className="py-3 px-3.5 font-bold">COMPLETENESS</th>
              <th className="py-3 px-3.5 font-bold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8D9AB2]/10">
            {paginated.map((rec) => (
              <tr
                key={rec.snapshot_id}
                onClick={() => onSelectRecord(rec)}
                className="hover:bg-[#111A2B]/50 transition-colors cursor-pointer group"
              >
                {/* Snapshot ID */}
                <td className="py-3 px-3.5 font-bold">
                  <span className="text-[#20E09E] flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{rec.snapshot_id.substring(0, 14)}...</span>
                  </span>
                </td>

                {/* Corridor / Mineral */}
                <td className="py-3 px-3.5">
                  <div className="font-bold text-[#F5F7FF] flex items-center gap-1.5">
                    <span className="text-[#43D9FF]">{rec.reporter_country}</span>
                    <ArrowRight className="w-3 h-3 text-[#8D9AB2]" />
                    <span className="text-[#7287FF]">{rec.partner_country}</span>
                  </div>
                  <span className="text-[10px] text-[#8D9AB2] block truncate max-w-[140px]">
                    {rec.mineral_name}
                  </span>
                </td>

                {/* Evidence Type */}
                <td className="py-3 px-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#111A2B] text-[#43D9FF] border border-[#43D9FF]/20">
                    {rec.evidence_type}
                  </span>
                </td>

                {/* Source */}
                <td className="py-3 px-3.5 text-[#8D9AB2]">
                  <span className="truncate max-w-[120px] block">{rec.source_dataset}</span>
                </td>

                {/* Period */}
                <td className="py-3 px-3.5 text-[#8D9AB2]">{rec.period}</td>

                {/* Capture Timestamp */}
                <td className="py-3 px-3.5 text-[#8D9AB2] text-[10px]">
                  {new Date(rec.capture_timestamp).toLocaleString()}
                </td>

                {/* Assessment */}
                <td className="py-3 px-3.5">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge
                      status={rec.classification}
                      variant={getClassificationVariant(rec.classification)}
                      size="sm"
                    />
                    <span className="font-bold text-[#F5F7FF]">{rec.anomaly_score.toFixed(1)}</span>
                  </div>
                </td>

                {/* Completeness */}
                <td className="py-3 px-3.5">
                  <span
                    className={
                      rec.completeness === 'COMPLETE'
                        ? 'text-[#20E09E] font-bold'
                        : 'text-[#FFB547] font-bold'
                    }
                  >
                    {rec.completeness}
                  </span>
                </td>

                {/* Action */}
                <td className="py-3 px-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onSelectRecord(rec)}
                    className="p-1 rounded text-[#8D9AB2] hover:text-[#43D9FF] hover:bg-[#111A2B] transition-colors"
                    title="View Evidence Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-[#8D9AB2]/20 flex items-center justify-between text-[11px] text-[#8D9AB2]">
        <span>
          Showing {(currentPage - 1) * pageSize + 1}–{Math.min(records.length, currentPage * pageSize)} of{' '}
          {records.length} saved evidence records
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-[#8D9AB2]/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-[#8D9AB2]/20 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
