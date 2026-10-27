import React from 'react';
import { Search, X, Filter, RotateCcw, Shield } from 'lucide-react';
import { GlobeFilters, RiskClassification } from '@/types/globe';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface RelationshipFilterBarProps {
  filters: GlobeFilters;
  onFilterChange: (filters: GlobeFilters) => void;
  availableMinerals: string[];
  availableOrigins: string[];
  availableDestinations: string[];
  filteredCount: number;
  totalCount: number;
}

export const RelationshipFilterBar: React.FC<RelationshipFilterBarProps> = ({
  filters,
  onFilterChange,
  availableMinerals,
  availableOrigins,
  availableDestinations,
  filteredCount,
  totalCount,
}) => {
  const classificationOptions: Array<{ label: string; value: string; color: string }> = [
    { label: 'ALL', value: 'ALL', color: 'hover:border-[#8D9AB2]' },
    { label: 'RED (HIGH)', value: 'RED', color: 'text-[#FF5B65] border-[#FF5B65]/40 hover:bg-[#FF5B65]/10' },
    { label: 'AMBER (MED)', value: 'AMBER', color: 'text-[#FFB547] border-[#FFB547]/40 hover:bg-[#FFB547]/10' },
    { label: 'GREEN (LOW)', value: 'GREEN', color: 'text-[#20E09E] border-[#20E09E]/40 hover:bg-[#20E09E]/10' },
    { label: 'INSUFFICIENT', value: 'INSUFFICIENT_DATA', color: 'text-[#7287FF] border-[#7287FF]/40 hover:bg-[#7287FF]/10' },
  ];

  const handleClearFilters = () => {
    onFilterChange({
      mineral: 'ALL',
      classification: 'ALL',
      searchQuery: '',
      originCountry: 'ALL',
      destCountry: 'ALL',
      minScore: 0,
      maxScore: 100,
    });
  };

  const isFiltered =
    (filters.mineral && filters.mineral !== 'ALL') ||
    (filters.classification && filters.classification !== 'ALL') ||
    (filters.searchQuery && filters.searchQuery.trim() !== '') ||
    (filters.originCountry && filters.originCountry !== 'ALL') ||
    (filters.destCountry && filters.destCountry !== 'ALL') ||
    (filters.minScore !== undefined && filters.minScore > 0);

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20">
      {/* 1. Search Bar & Status */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8D9AB2] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search country, mineral (e.g. Lithium), or code..."
            className="w-full pl-9 pr-9 py-2 text-xs font-mono bg-[#111A2B] border border-[#8D9AB2]/25 rounded-lg text-[#F5F7FF] placeholder-[#8D9AB2]/50 focus:outline-none focus:border-[#43D9FF] transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D9AB2] hover:text-[#F5F7FF]"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Counter and Clear Action */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span className="text-[11px] font-mono text-[#8D9AB2] px-2.5 py-1.5 rounded bg-[#111A2B] border border-[#8D9AB2]/20">
            SHOWING <strong className="text-[#43D9FF]">{filteredCount}</strong> / {totalCount}
          </span>
          {isFiltered && (
            <SecondaryButton
              size="sm"
              variant="surface"
              leftIcon={<RotateCcw className="w-3 h-3" />}
              onClick={handleClearFilters}
              className="text-[11px] font-mono py-1 px-2 border-[#FF5B65]/30 text-[#FF5B65] hover:bg-[#FF5B65]/10"
            >
              CLEAR
            </SecondaryButton>
          )}
        </div>
      </div>

      {/* 2. Facet Selectors: Mineral, Origin, Destination, Min Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 border-t border-[#8D9AB2]/10">
        {/* Mineral Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-[#8D9AB2] uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#43D9FF]" />
            Mineral
          </label>
          <select
            value={filters.mineral || 'ALL'}
            onChange={(e) => onFilterChange({ ...filters, mineral: e.target.value })}
            className="bg-[#111A2B] border border-[#8D9AB2]/25 rounded px-2 py-1.5 text-xs font-mono text-[#F5F7FF] focus:outline-none focus:border-[#43D9FF]"
          >
            <option value="ALL">All Minerals</option>
            {availableMinerals.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Origin Country */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-[#8D9AB2] uppercase tracking-wider">
            Origin (Exporter)
          </label>
          <select
            value={filters.originCountry || 'ALL'}
            onChange={(e) => onFilterChange({ ...filters, originCountry: e.target.value })}
            className="bg-[#111A2B] border border-[#8D9AB2]/25 rounded px-2 py-1.5 text-xs font-mono text-[#F5F7FF] focus:outline-none focus:border-[#43D9FF]"
          >
            <option value="ALL">All Origin Countries</option>
            {availableOrigins.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Country */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-[#8D9AB2] uppercase tracking-wider">
            Destination (Importer)
          </label>
          <select
            value={filters.destCountry || 'ALL'}
            onChange={(e) => onFilterChange({ ...filters, destCountry: e.target.value })}
            className="bg-[#111A2B] border border-[#8D9AB2]/25 rounded px-2 py-1.5 text-xs font-mono text-[#F5F7FF] focus:outline-none focus:border-[#43D9FF]"
          >
            <option value="ALL">All Destination Countries</option>
            {availableDestinations.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Min Risk Score */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-mono text-[#8D9AB2] uppercase tracking-wider flex items-center justify-between">
            <span>Min Risk Score</span>
            <span className="text-[#43D9FF] font-bold">{filters.minScore || 0}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={filters.minScore || 0}
            onChange={(e) => onFilterChange({ ...filters, minScore: Number(e.target.value) })}
            className="w-full accent-[#43D9FF] cursor-pointer mt-1"
          />
        </div>
      </div>

      {/* 3. Classification Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#8D9AB2]/10">
        <span className="text-[10px] font-mono text-[#8D9AB2] uppercase tracking-wider mr-1 flex items-center gap-1">
          <Shield className="w-3 h-3 text-[#7287FF]" />
          Risk Class:
        </span>
        {classificationOptions.map((opt) => {
          const isSelected = (filters.classification || 'ALL') === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  classification: isSelected && opt.value !== 'ALL' ? 'ALL' : (opt.value as RiskClassification),
                })
              }
              className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                isSelected
                  ? 'bg-[#111A2B] border-[#43D9FF] text-[#43D9FF] font-bold shadow-[0_0_10px_-2px_rgba(67,217,255,0.3)]'
                  : `bg-[#070A12]/60 border-[#8D9AB2]/20 text-[#8D9AB2] ${opt.color}`
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
