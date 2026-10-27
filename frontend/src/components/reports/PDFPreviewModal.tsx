import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, FileText, Download, Hash } from 'lucide-react';
import { PDFReportSummary } from '@/types/api';
import { getReportDownloadUrl } from '@/services/api';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface PDFPreviewModalProps {
  report: PDFReportSummary | null;
  open: boolean;
  onClose: () => void;
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ report, open, onClose }) => {
  if (!report) return null;

  const downloadUrl = getReportDownloadUrl(report.report_id);
  const hash = report.content_hash || report.sha256_hash;
  const sizeKb = report.file_size_bytes ? (report.file_size_bytes / 1024).toFixed(1) : '14.5';

  return (
    <Dialog.Root open={open} onOpenChange={(val) => !val && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#070A12]/80 backdrop-blur-sm animate-in fade-in-0 duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 h-[92vh] w-[95vw] max-w-5xl bg-[#090D17] border border-[#8D9AB2]/25 rounded-2xl p-6 shadow-2xl flex flex-col justify-between font-mono text-xs animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#8D9AB2]/20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Dialog.Title className="text-base font-bold text-[#F5F7FF]">
                    {report.report_title || report.title || 'Printable PDF Evidence Report'}
                  </Dialog.Title>
                  <StatusBadge
                    status={report.report_status || 'COMPLETED'}
                    variant="healthy"
                    size="sm"
                  />
                </div>
                <Dialog.Description className="text-[11px] text-[#8D9AB2] mt-0.5">
                  REPORT REF: {report.report_id} // TARGET ANALYSIS: {report.analysis_id}
                </Dialog.Description>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={downloadUrl}
                download={`${report.report_id}.pdf`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#43D9FF] hover:bg-[#43D9FF]/90 text-[#070A12] font-bold text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>

              <Dialog.Close asChild>
                <button
                  className="p-1.5 rounded-lg text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B] transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Metadata Strip */}
          <div className="my-3 p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/15 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-[#8D9AB2] block">FILE SIZE</span>
                <span className="text-[#F5F7FF] font-bold">{sizeKb} KB</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8D9AB2] block">GENERATED AT</span>
                <span className="text-[#F5F7FF] font-mono">
                  {new Date(report.created_at).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#8D9AB2] block">SCHEMA</span>
                <span className="text-[#43D9FF] font-bold">
                  {report.template_version || 'ISO 32000-1'}
                </span>
              </div>
            </div>

            {hash && (
              <div className="flex items-center gap-2 min-w-0">
                <Hash className="w-3.5 h-3.5 text-[#20E09E] shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-[#8D9AB2] block">SHA-256 INTEGRITY HASH</span>
                  <span className="text-[#20E09E] font-mono text-[10px] truncate block max-w-xs">
                    {hash}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Embedded PDF Viewer Frame */}
          <div className="flex-1 w-full rounded-xl bg-[#070A12] border border-[#8D9AB2]/20 overflow-hidden relative">
            <object
              data={downloadUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              {/* Fallback if browser inline PDF preview is disabled */}
              <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3">
                <FileText className="w-12 h-12 text-[#43D9FF]" />
                <h3 className="text-sm font-bold text-[#F5F7FF]">
                  PDF Ready for Review & Printing
                </h3>
                <p className="text-xs text-[#8D9AB2] max-w-md font-sans">
                  Your browser does not support embedded PDF previewing or has native extensions disabled.
                  You can download the compiled PDF document directly.
                </p>
                <a
                  href={downloadUrl}
                  download={`${report.report_id}.pdf`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#43D9FF] text-[#070A12] font-bold text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {report.report_id}.pdf ({sizeKb} KB)</span>
                </a>
              </div>
            </object>
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-[#8D9AB2]/15 text-[11px] text-[#8D9AB2]">
            <span>MineTrace Court-Ready Supply Chain Intelligence Dossier</span>
            <SecondaryButton size="sm" onClick={onClose} className="text-xs">
              Close
            </SecondaryButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
