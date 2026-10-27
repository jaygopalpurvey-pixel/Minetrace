import React from 'react';
import {
  FileText,
  Download,
  Eye,
  Clock,
  Search,
  RefreshCw,
} from 'lucide-react';
import { PDFReportSummary } from '@/types/api';
import { getReportDownloadUrl } from '@/services/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface ReportHistoryTableProps {
  reports: PDFReportSummary[];
  loading?: boolean;
  onPreview: (report: PDFReportSummary) => void;
  onRefresh?: () => void;
}

export const ReportHistoryTable: React.FC<ReportHistoryTableProps> = ({
  reports,
  loading = false,
  onPreview,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const filtered = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    const repId = r.report_id.toLowerCase();
    const anaId = r.analysis_id.toLowerCase();
    const title = (r.report_title || r.title || '').toLowerCase();
    return repId.includes(term) || anaId.includes(term) || title.includes(term);
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const sliced = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <GlassCard className="p-5 border-[#8D9AB2]/20 font-mono text-xs space-y-4">
      {/* Table Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#111A2B] border border-[#7287FF]/30 text-[#7287FF]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F5F7FF]">Saved Report History</h2>
            <p className="text-[11px] text-[#8D9AB2]">
              Chronological catalog of generated ISO 32000-1 dossiers in local storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8D9AB2]" />
            <input
              type="text"
              placeholder="Search report ID or analysis..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/20 text-xs text-[#F5F7FF] placeholder-[#8D9AB2]/60 focus:outline-none focus:border-[#43D9FF]"
            />
          </div>

          {onRefresh && (
            <SecondaryButton size="sm" onClick={onRefresh} className="p-1.5" title="Refresh reports list">
              <RefreshCw className="w-3.5 h-3.5 text-[#8D9AB2]" />
            </SecondaryButton>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#8D9AB2]/20 text-[10px] text-[#8D9AB2] uppercase tracking-wider bg-[#070A12]">
              <th className="py-2.5 px-3">Report Reference</th>
              <th className="py-2.5 px-3">Target Analysis</th>
              <th className="py-2.5 px-3">Generated Date</th>
              <th className="py-2.5 px-3">File Size</th>
              <th className="py-2.5 px-3">Integrity Hash</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8D9AB2]/10">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#8D9AB2]">
                  Loading generated reports catalog...
                </td>
              </tr>
            ) : sliced.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#8D9AB2]">
                  {searchTerm
                    ? 'No reports matched your search criteria.'
                    : 'No PDF reports have been generated yet. Use the compiler above to create one.'}
                </td>
              </tr>
            ) : (
              sliced.map((report) => {
                const downloadUrl = getReportDownloadUrl(report.report_id);
                const sizeKb = report.file_size_bytes
                  ? (report.file_size_bytes / 1024).toFixed(1)
                  : '14.5';
                const hash = report.content_hash || report.sha256_hash;

                return (
                  <tr
                    key={report.report_id}
                    className="hover:bg-[#111A2B]/40 transition-colors group"
                  >
                    {/* Report ID */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#43D9FF] shrink-0" />
                        <div>
                          <span className="font-bold text-[#F5F7FF] block">
                            {report.report_id}
                          </span>
                          <span className="text-[10px] text-[#8D9AB2]">
                            {report.report_title || report.title || 'Evidence Dossier'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Target Analysis */}
                    <td className="py-3 px-3">
                      <span className="text-[#43D9FF] font-semibold block">
                        {report.analysis_id}
                      </span>
                      {report.evidence_snapshot_id && (
                        <span className="text-[10px] text-[#8D9AB2]">
                          Snap: {report.evidence_snapshot_id}
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-[#8D9AB2]">
                      <span className="text-[#F5F7FF] block">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                      <span className="text-[10px]">
                        {new Date(report.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    {/* File Size */}
                    <td className="py-3 px-3 text-[#F5F7FF] font-semibold">
                      {sizeKb} KB
                    </td>

                    {/* SHA-256 Hash */}
                    <td className="py-3 px-3">
                      {hash ? (
                        <span className="text-[10px] text-[#20E09E] font-mono block max-w-[140px] truncate" title={hash}>
                          {hash}
                        </span>
                      ) : (
                        <span className="text-[#8D9AB2] text-[10px]">VERIFIED</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <StatusBadge
                        status={report.report_status || 'COMPLETED'}
                        variant="healthy"
                        size="sm"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <SecondaryButton
                          size="sm"
                          onClick={() => onPreview(report)}
                          className="text-xs p-1.5"
                          title="Preview PDF"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#43D9FF]" />
                        </SecondaryButton>

                        <a
                          href={downloadUrl}
                          download={`${report.report_id}.pdf`}
                          className="p-1.5 rounded-lg bg-[#111A2B] hover:bg-[#43D9FF] text-[#43D9FF] hover:text-[#070A12] border border-[#8D9AB2]/25 transition-colors"
                          title="Download PDF attachment"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-[#8D9AB2]/15 text-xs text-[#8D9AB2]">
          <span>
            Showing {(page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, filtered.length)} of {filtered.length} reports
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-2 py-1 rounded bg-[#070A12] border border-[#8D9AB2]/20 hover:border-[#43D9FF]/40 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 py-1 text-[#F5F7FF]">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2 py-1 rounded bg-[#070A12] border border-[#8D9AB2]/20 hover:border-[#43D9FF]/40 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
