import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { RankingEntry } from '@/types/api';
import { StatusBadge, StatusVariant } from '@/components/ui/StatusBadge';

export interface RankedFindingsTableProps {
  rankings: RankingEntry[];
  onSelectRanking: (entry: RankingEntry) => void;
  loading?: boolean;
}

type SortField = 'rank' | 'anomaly_score' | 'mineral_type' | 'classification' | 'period';

export const RankedFindingsTable: React.FC<RankedFindingsTableProps> = ({
  rankings,
  onSelectRanking,
  loading = false,
}) => {
  const navigate = useNavigate();

  // Sorting state (default: rank ascending, preserving backend tie-breaker order)
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'anomaly_score' ? 'desc' : 'asc');
    }
  };

  const sortedRankings = useMemo(() => {
    return [...rankings].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'anomaly_score':
          comparison = a.anomaly_score - b.anomaly_score;
          break;
        case 'mineral_type':
          comparison = (a.mineral_type || '').localeCompare(b.mineral_type || '');
          break;
        case 'classification':
          comparison = (a.classification || '').localeCompare(b.classification || '');
          break;
        case 'period':
          comparison = a.period.localeCompare(b.period);
          break;
        default:
          comparison = a.rank - b.rank;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [rankings, sortField, sortDirection]);

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(sortedRankings.length / pageSize));
  const paginatedRankings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRankings.slice(start, start + pageSize);
  }, [sortedRankings, currentPage, pageSize]);

  const getClassificationVariant = (classification?: string | null): StatusVariant => {
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

  const getScoreColor = (score: number, classification?: string | null) => {
    if (classification === 'INSUFFICIENT_DATA') return 'text-[#7287FF] bg-[#7287FF]/10 border-[#7287FF]/30';
    if (score >= 50) return 'text-[#FF5B65] bg-[#FF5B65]/10 border-[#FF5B65]/30';
    if (score >= 20) return 'text-[#FFB547] bg-[#FFB547]/10 border-[#FFB547]/30';
    return 'text-[#20E09E] bg-[#20E09E]/10 border-[#20E09E]/30';
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-[#8D9AB2] opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#43D9FF]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#43D9FF]" />
    );
  };

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 space-y-3 font-mono">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-[#111A2B] animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="p-12 text-center bg-[#0D1320] rounded-xl border border-[#8D9AB2]/20 font-mono text-xs space-y-3">
        <AlertCircle className="w-8 h-8 text-[#FFB547] mx-auto" />
        <h4 className="text-sm font-bold text-[#F5F7FF]">No Ranked Findings Available</h4>
        <p className="text-[#8D9AB2] max-w-sm mx-auto">
          No records match the current ranking query. If the backend is running, verify that risk analysis records have been ingested.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 overflow-hidden font-mono text-xs space-y-0">
      {/* Table responsive scroll wrapper */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#8D9AB2]/20 bg-[#111A2B]/60 text-[11px] text-[#8D9AB2]">
              <th className="py-3 px-3.5 font-bold cursor-pointer" onClick={() => handleSort('rank')}>
                <div className="flex items-center gap-1.5">
                  <span>RANK</span>
                  {renderSortIcon('rank')}
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold cursor-pointer" onClick={() => handleSort('mineral_type')}>
                <div className="flex items-center gap-1.5">
                  <span>MINERAL / HS</span>
                  {renderSortIcon('mineral_type')}
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold">
                <span>CORRIDOR (ORIGIN &rarr; DEST)</span>
              </th>

              <th className="py-3 px-3.5 font-bold cursor-pointer" onClick={() => handleSort('anomaly_score')}>
                <div className="flex items-center gap-1.5">
                  <span>SCORE</span>
                  {renderSortIcon('anomaly_score')}
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold cursor-pointer" onClick={() => handleSort('classification')}>
                <div className="flex items-center gap-1.5">
                  <span>CLASS</span>
                  {renderSortIcon('classification')}
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold">
                <span>KEY RISK INDICATORS</span>
              </th>

              <th className="py-3 px-3.5 font-bold cursor-pointer" onClick={() => handleSort('period')}>
                <div className="flex items-center gap-1.5">
                  <span>PERIOD</span>
                  {renderSortIcon('period')}
                </div>
              </th>

              <th className="py-3 px-3.5 font-bold">
                <span>EVIDENCE</span>
              </th>

              <th className="py-3 px-3.5 font-bold text-right">
                <span>ACTIONS</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#8D9AB2]/10">
            {paginatedRankings.map((entry) => {
              const isInsufficient = entry.classification === 'INSUFFICIENT_DATA';
              const isSanctionMatch =
                entry.sanctions_status === 'MATCH_IDENTIFIED' ||
                entry.sanctions_status === 'REVIEW_MATCH';

              return (
                <tr
                  key={entry.analysis_id}
                  className="hover:bg-[#111A2B]/50 transition-colors cursor-pointer group"
                  onClick={() => onSelectRanking(entry)}
                >
                  {/* Rank */}
                  <td className="py-3 px-3.5 font-bold">
                    <span className="text-[#43D9FF] px-2 py-0.5 rounded bg-[#111A2B] border border-[#43D9FF]/20">
                      #{entry.rank}
                    </span>
                  </td>

                  {/* Mineral */}
                  <td className="py-3 px-3.5 font-bold text-[#F5F7FF]">
                    <div className="truncate max-w-[150px]">
                      {entry.mineral_type || `Mineral HS ${entry.commodity_code}`}
                    </div>
                    <span className="text-[10px] text-[#8D9AB2] block font-normal">
                      HS {entry.commodity_code}
                    </span>
                  </td>

                  {/* Corridor */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#43D9FF]">{entry.reporter_country_code}</span>
                      <ArrowRight className="w-3 h-3 text-[#8D9AB2]" />
                      <span className="font-bold text-[#7287FF]">{entry.partner_country_code}</span>
                    </div>
                  </td>

                  {/* Risk Score */}
                  <td className="py-3 px-3.5 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded border inline-block ${getScoreColor(
                        entry.anomaly_score,
                        entry.classification
                      )}`}
                    >
                      {isInsufficient ? '—' : entry.anomaly_score.toFixed(1)}
                    </span>
                  </td>

                  {/* Classification */}
                  <td className="py-3 px-3.5">
                    <StatusBadge
                      status={entry.classification || 'INSUFFICIENT_DATA'}
                      variant={getClassificationVariant(entry.classification)}
                      size="sm"
                    />
                  </td>

                  {/* Key Indicators */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1 flex-wrap max-w-[180px]">
                      {isSanctionMatch && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#FF5B65]/20 text-[#FF5B65] border border-[#FF5B65]/40 font-bold">
                          R5: OFAC
                        </span>
                      )}
                      {entry.evaluated_rules && entry.evaluated_rules.length > 0 ? (
                        entry.evaluated_rules.map((r) => (
                          <span
                            key={r}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-[#111A2B] text-[#8D9AB2] border border-[#8D9AB2]/20"
                          >
                            {r}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#8D9AB2] text-[10px]">No Flags</span>
                      )}
                    </div>
                  </td>

                  {/* Period */}
                  <td className="py-3 px-3.5 text-[#8D9AB2]">{entry.period}</td>

                  {/* Evidence Status */}
                  <td className="py-3 px-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border ${
                        entry.score_completeness === 'COMPLETE'
                          ? 'bg-[#20E09E]/10 text-[#20E09E] border-[#20E09E]/30'
                          : 'bg-[#FFB547]/10 text-[#FFB547] border-[#FFB547]/30'
                      }`}
                    >
                      <FileCheck2 className="w-3 h-3" />
                      {entry.score_completeness === 'COMPLETE' ? 'AVAILABLE' : 'PARTIAL'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onSelectRanking(entry)}
                      className="p-1 rounded text-[#8D9AB2] hover:text-[#43D9FF] hover:bg-[#111A2B] transition-colors"
                      title="Inspect Ranking Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigate(`/risk-analysis?analysis=${entry.analysis_id}`)}
                      className="p-1 rounded text-[#8D9AB2] hover:text-[#20E09E] hover:bg-[#111A2B] transition-colors"
                      title="Open Full Risk Analysis"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary Bar */}
      <div className="p-3 border-t border-[#8D9AB2]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8D9AB2]">
        <div>
          Showing {Math.min(sortedRankings.length, (currentPage - 1) * pageSize + 1)}–
          {Math.min(sortedRankings.length, currentPage * pageSize)} of {sortedRankings.length} ranked
          records (Deterministic Tie-Breaker: score DESC, created_at DESC)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-[#8D9AB2]/20 text-[#8D9AB2] hover:text-[#F5F7FF] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-[#8D9AB2]/20 text-[#8D9AB2] hover:text-[#F5F7FF] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
