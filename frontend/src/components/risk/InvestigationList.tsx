import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Filter,
  ArrowRight,
  Shield,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { RiskAnalysisResponse } from '@/types/api';
import { StatusBadge, StatusVariant } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface InvestigationListProps {
  records: RiskAnalysisResponse[];
  selectedAnalysisId?: string | null;
  onSelectRecord: (record: RiskAnalysisResponse) => void;
  loading?: boolean;
}

export const InvestigationList: React.FC<InvestigationListProps> = ({
  records,
  selectedAnalysisId,
  onSelectRecord,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [selectedMineral, setSelectedMineral] = useState<string>('ALL');

  // Extract distinct minerals
  const availableMinerals = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.mineral_type) set.add(r.mineral_type.trim());
    });
    return Array.from(set).sort();
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Classification
      if (selectedClassification !== 'ALL') {
        const norm = (r.classification || 'INSUFFICIENT_DATA').toUpperCase();
        if (norm !== selectedClassification) return false;
      }

      // Mineral
      if (selectedMineral !== 'ALL') {
        if (!r.mineral_type || !r.mineral_type.toLowerCase().includes(selectedMineral.toLowerCase())) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesOrigin = r.reporter_country_code.toLowerCase().includes(q);
        const matchesDest = r.partner_country_code.toLowerCase().includes(q);
        const matchesMineral = (r.mineral_type || '').toLowerCase().includes(q);
        const matchesId = r.analysis_id.toLowerCase().includes(q);
        const matchesCode = r.commodity_code.includes(q);

        if (!matchesOrigin && !matchesDest && !matchesMineral && !matchesId && !matchesCode) {
          return false;
        }
      }

      return true;
    });
  }, [records, selectedClassification, selectedMineral, searchQuery]);

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

  return (
    <div className="p-4 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 space-y-3 font-mono flex flex-col h-full">
      {/* List Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#43D9FF]" />
          <span className="text-xs font-bold text-[#F5F7FF] uppercase tracking-wider">
            Investigate Records ({filteredRecords.length}/{records.length})
          </span>
        </div>
        <span className="text-[10px] text-[#8D9AB2]">SQLITE REPOSITORY</span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#8D9AB2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search country, mineral, HS..."
          className="w-full pl-8 pr-8 py-1.5 text-xs bg-[#111A2B] border border-[#8D9AB2]/25 rounded text-[#F5F7FF] placeholder-[#8D9AB2]/50 focus:outline-none focus:border-[#43D9FF]"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8D9AB2] hover:text-[#F5F7FF]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Selectors: Mineral & Classification */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Mineral Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[#8D9AB2] uppercase flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#43D9FF]" />
            Mineral
          </label>
          <select
            value={selectedMineral}
            onChange={(e) => setSelectedMineral(e.target.value)}
            className="bg-[#111A2B] border border-[#8D9AB2]/25 rounded px-2 py-1 text-[11px] text-[#F5F7FF] focus:outline-none focus:border-[#43D9FF]"
          >
            <option value="ALL">All Minerals</option>
            {availableMinerals.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Classification Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-[#8D9AB2] uppercase flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#FFB547]" />
            Risk Class
          </label>
          <select
            value={selectedClassification}
            onChange={(e) => setSelectedClassification(e.target.value)}
            className="bg-[#111A2B] border border-[#8D9AB2]/25 rounded px-2 py-1 text-[11px] text-[#F5F7FF] focus:outline-none focus:border-[#43D9FF]"
          >
            <option value="ALL">All Classes</option>
            <option value="RED">RED (&ge;50)</option>
            <option value="AMBER">AMBER (20–49)</option>
            <option value="GREEN">GREEN (&lt;20)</option>
            <option value="INSUFFICIENT_DATA">INSUFFICIENT</option>
          </select>
        </div>
      </div>

      {/* Scrollable List of Records */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[560px] pr-1 custom-scrollbar">
        {loading ? (
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-lg bg-[#111A2B] animate-pulse space-y-1.5">
                <div className="h-3 bg-[#070A12] rounded w-1/2" />
                <div className="h-2.5 bg-[#070A12] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#8D9AB2] bg-[#070A12] rounded-lg border border-[#8D9AB2]/15 space-y-2">
            <AlertCircle className="w-6 h-6 text-[#FFB547] mx-auto" />
            <p>No risk analysis records match the selected filter criteria.</p>
            <SecondaryButton
              size="sm"
              variant="surface"
              onClick={() => {
                setSearchQuery('');
                setSelectedClassification('ALL');
                setSelectedMineral('ALL');
              }}
              className="text-[11px] font-mono mx-auto"
            >
              Reset Filters
            </SecondaryButton>
          </div>
        ) : (
          filteredRecords.map((record) => {
            const isSelected = selectedAnalysisId === record.analysis_id;
            const normClass = record.classification || 'INSUFFICIENT_DATA';
            const isInsufficient = normClass === 'INSUFFICIENT_DATA';

            return (
              <div
                key={record.analysis_id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectRecord(record)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectRecord(record);
                  }
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all outline-none select-none ${
                  isSelected
                    ? 'bg-[#111A2B] border-[#43D9FF] shadow-[0_0_12px_-3px_rgba(67,217,255,0.25)] ring-1 ring-[#43D9FF]/40'
                    : 'bg-[#070A12] border-[#8D9AB2]/15 hover:border-[#8D9AB2]/30 hover:bg-[#111A2B]/40'
                }`}
              >
                {/* Header: Mineral & Score */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <span className="font-bold text-xs text-[#F5F7FF] truncate">
                    {record.mineral_type || `HS ${record.commodity_code}`}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <StatusBadge
                      status={normClass}
                      variant={getClassificationVariant(record.classification)}
                      size="sm"
                    />
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getScoreColor(
                        record.combined_anomaly_score,
                        record.classification
                      )}`}
                    >
                      {isInsufficient ? '—' : record.combined_anomaly_score.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Corridor */}
                <div className="flex items-center gap-2 text-[11px] text-[#F5F7FF] mb-1.5">
                  <span className="font-bold text-[#43D9FF]">{record.reporter_country_code}</span>
                  <ArrowRight className="w-3 h-3 text-[#8D9AB2]" />
                  <span className="font-bold text-[#7287FF]">{record.partner_country_code}</span>
                  <span className="text-[10px] text-[#8D9AB2] ml-auto">PERIOD: {record.period}</span>
                </div>

                {/* Footer Badges */}
                <div className="flex items-center justify-between text-[10px] text-[#8D9AB2] pt-1.5 border-t border-[#8D9AB2]/10">
                  <span className="truncate max-w-[140px]">ID: {record.analysis_id}</span>
                  <div className="flex items-center gap-1.5">
                    {record.flagged_rules && record.flagged_rules.length > 0 && (
                      <span className="text-[#FF5B65] font-bold">
                        {record.flagged_rules.length} FLAGS
                      </span>
                    )}
                    <span
                      className={
                        record.score_completeness === 'COMPLETE'
                          ? 'text-[#20E09E]'
                          : 'text-[#FFB547]'
                      }
                    >
                      {record.score_completeness}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
