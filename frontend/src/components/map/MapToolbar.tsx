import React from 'react';
import {
  Search,
  X,
  Layers,
  Map as MapIcon,
  Globe2,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { GlobeFilters } from '@/types/globe';
import { Tooltip } from '@/components/ui/Tooltip';

export interface MapToolbarProps {
  filters: GlobeFilters;
  onFilterChange: (filters: GlobeFilters) => void;
  viewMode: '2D_MAP' | '3D_GLOBE';
  onToggleViewMode: (mode: '2D_MAP' | '3D_GLOBE') => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onResetView?: () => void;
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
  isRealBackend: boolean;
  activeRoutesCount: number;
  totalRoutesCount: number;
}

export const MapToolbar: React.FC<MapToolbarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onToggleViewMode,
  isFullscreen,
  onToggleFullscreen,
  onResetView,
  autoRotate,
  onToggleAutoRotate,
  isRealBackend,
  activeRoutesCount,
  totalRoutesCount,
}) => {
  const hasActiveFilters =
    filters.mineral !== 'ALL' ||
    filters.classification !== 'ALL' ||
    Boolean(filters.searchQuery && filters.searchQuery.trim() !== '') ||
    (filters.originCountry && filters.originCountry !== 'ALL') ||
    (filters.destCountry && filters.destCountry !== 'ALL');

  const handleClearFilters = () => {
    onFilterChange({
      mineral: 'ALL',
      classification: 'ALL',
      searchQuery: '',
      originCountry: 'ALL',
      destCountry: 'ALL',
    });
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 bg-[#090D17]/90 border-b border-[#8D9AB2]/15 backdrop-blur-md">
      {/* 1. Primary Top Row: Search Bar, View Mode Switcher & Fullscreen */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Prominent Search Bar with Clear Button */}
        <div className="relative flex-1 max-w-xl">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3.5 w-4 h-4 text-[#8D9AB2] pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              placeholder="Search country (e.g. Chile, China, USA), mineral, or corridor..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/25 text-sm font-mono text-[#F5F7FF] placeholder:text-[#8D9AB2]/50 focus:outline-none focus:border-[#43D9FF] focus:ring-1 focus:ring-[#43D9FF]/40 transition-all shadow-inner"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="absolute right-3 p-0.5 rounded-full text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B] transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* View Mode Toggle: 2D Political Map (Default) vs 3D Globe */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <div className="inline-flex p-1 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 shadow-inner">
            <button
              onClick={() => onToggleViewMode('2D_MAP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === '2D_MAP'
                  ? 'bg-[#43D9FF] text-[#070A12] shadow-[0_0_12px_rgba(67,217,255,0.4)]'
                  : 'text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>2D Political Map</span>
            </button>
            <button
              onClick={() => onToggleViewMode('3D_GLOBE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                viewMode === '3D_GLOBE'
                  ? 'bg-[#43D9FF] text-[#070A12] shadow-[0_0_12px_rgba(67,217,255,0.4)]'
                  : 'text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>
          </div>

          {/* Auto-Rotation Toggle (when in 3D globe mode) */}
          {viewMode === '3D_GLOBE' && onToggleAutoRotate && (
            <Tooltip content={autoRotate ? 'Pause Earth Rotation' : 'Resume Earth Rotation'}>
              <button
                onClick={onToggleAutoRotate}
                aria-label={autoRotate ? 'Pause rotation' : 'Resume rotation'}
                className={`p-2 rounded-xl bg-[#0D1320] border transition-all shadow-sm outline-none ${
                  autoRotate
                    ? 'border-[#43D9FF]/40 text-[#43D9FF]'
                    : 'border-[#8D9AB2]/20 text-[#8D9AB2] hover:text-[#F5F7FF]'
                }`}
              >
                <RotateCw
                  className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`}
                  style={{ animationDuration: '10s' }}
                />
              </button>
            </Tooltip>
          )}

          {/* Fullscreen & Reset View Actions */}
          {onResetView && (
            <Tooltip content="Reset View to Default Surveillance Perspective">
              <button
                onClick={onResetView}
                aria-label="Reset View"
                className="p-2 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 text-[#8D9AB2] hover:text-[#43D9FF] hover:border-[#43D9FF]/40 transition-all shadow-sm outline-none"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </Tooltip>
          )}

          <Tooltip content={isFullscreen ? 'Exit Fullscreen' : 'Expand to Fullscreen'}>
            <button
              onClick={onToggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Expand fullscreen'}
              className="p-2 rounded-xl bg-[#0D1320] border border-[#8D9AB2]/20 text-[#8D9AB2] hover:text-[#F5F7FF] hover:border-[#43D9FF]/40 transition-all shadow-sm outline-none"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 2. Secondary Filter Row: Mineral Dropdown, Risk Classification Pills, Active Counts */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#8D9AB2]/10 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mineral Filter Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1320] border border-[#8D9AB2]/20">
            <Layers className="w-3.5 h-3.5 text-[#43D9FF] shrink-0" />
            <select
              value={filters.mineral || 'ALL'}
              onChange={(e) => onFilterChange({ ...filters, mineral: e.target.value })}
              className="bg-transparent text-[#F5F7FF] font-medium outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#090D17] text-[#F5F7FF]">
                All Minerals
              </option>
              <option value="Lithium" className="bg-[#090D17] text-[#F5F7FF]">
                Lithium (Carbonate & Spodumene)
              </option>
              <option value="Cobalt" className="bg-[#090D17] text-[#F5F7FF]">
                Cobalt (Ores & Hydroxides)
              </option>
              <option value="Nickel" className="bg-[#090D17] text-[#F5F7FF]">
                Nickel (Mattes & Intermediates)
              </option>
              <option value="Graphite" className="bg-[#090D17] text-[#F5F7FF]">
                Natural Graphite
              </option>
              <option value="Rare Earth" className="bg-[#090D17] text-[#F5F7FF]">
                Rare Earth Elements
              </option>
            </select>
          </div>

          {/* Risk Classification Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0D1320] border border-[#8D9AB2]/20">
            <button
              onClick={() => onFilterChange({ ...filters, classification: 'ALL' })}
              className={`px-2.5 py-1 rounded-md transition-all text-xs ${
                filters.classification === 'ALL'
                  ? 'bg-[#43D9FF] text-[#070A12] font-bold shadow-sm'
                  : 'text-[#8D9AB2] hover:text-[#F5F7FF]'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, classification: 'RED' })}
              className={`px-2.5 py-1 rounded-md transition-all text-xs ${
                filters.classification === 'RED'
                  ? 'bg-[#FF5B65] text-[#070A12] font-bold'
                  : 'text-[#FF5B65] hover:bg-[#FF5B65]/15'
              }`}
            >
              RED
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, classification: 'AMBER' })}
              className={`px-2.5 py-1 rounded-md transition-all text-xs ${
                filters.classification === 'AMBER'
                  ? 'bg-[#FFB547] text-[#070A12] font-bold'
                  : 'text-[#FFB547] hover:bg-[#FFB547]/15'
              }`}
            >
              AMBER
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, classification: 'GREEN' })}
              className={`px-2.5 py-1 rounded-md transition-all text-xs ${
                filters.classification === 'GREEN'
                  ? 'bg-[#20E09E] text-[#070A12] font-bold'
                  : 'text-[#20E09E] hover:bg-[#20E09E]/15'
              }`}
            >
              GREEN
            </button>
          </div>

          {/* Reset Filters Action */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-2.5 py-1 rounded-lg bg-[#FF5B65]/15 text-[#FF5B65] hover:bg-[#FF5B65]/25 border border-[#FF5B65]/30 transition-all font-semibold text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}
        </div>

        {/* Right: Active Corridors Counter & Backend Status */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="px-2.5 py-1 rounded-lg bg-[#0D1320] border border-[#8D9AB2]/20 text-[#8D9AB2]">
            CORRIDORS:{' '}
            <strong className="text-[#43D9FF] tabular-nums">
              {activeRoutesCount}/{totalRoutesCount}
            </strong>
          </span>

          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${
              isRealBackend
                ? 'bg-[#20E09E]/10 border-[#20E09E]/30 text-[#20E09E]'
                : 'bg-[#43D9FF]/10 border-[#43D9FF]/30 text-[#43D9FF]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isRealBackend ? 'bg-[#20E09E] animate-pulse' : 'bg-[#43D9FF] animate-pulse'
              }`}
            />
            {isRealBackend ? 'LIVE BACKEND' : 'DEMO MODE'}
          </span>
        </div>
      </div>
    </div>
  );
};
