import React from 'react';
import {
  Compass,
  RotateCw,
  Maximize2,
  Minimize2,
  Search,
  X,
  Radio,
  Layers,
} from 'lucide-react';
import { GlobeFilters } from '@/types/globe';
import { Tooltip } from '@/components/ui/Tooltip';

export interface GlobeControlOverlayProps {
  filters: GlobeFilters;
  onFilterChange: (filters: GlobeFilters) => void;
  onResetView: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isRealBackend: boolean;
  activeRoutesCount: number;
  totalRoutesCount: number;
}

export const GlobeControlOverlay: React.FC<GlobeControlOverlayProps> = ({
  filters,
  onFilterChange,
  onResetView,
  autoRotate,
  onToggleAutoRotate,
  isFullscreen,
  onToggleFullscreen,
  isRealBackend,
  activeRoutesCount,
  totalRoutesCount,
}) => {
  const hasActiveFilters =
    filters.mineral !== 'ALL' || filters.classification !== 'ALL' || filters.searchQuery !== '';

  const handleClearFilters = () => {
    onFilterChange({
      mineral: 'ALL',
      classification: 'ALL',
      searchQuery: '',
    });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-5 select-none">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Mode Badge & Quick Telemetry */}
        <div className="pointer-events-auto flex items-center gap-2 flex-wrap">
          {/* Real vs Demo Mode Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#090D17]/85 border border-[#8D9AB2]/25 shadow-xl backdrop-blur-md">
            <Radio
              className={`w-3.5 h-3.5 ${
                isRealBackend ? 'text-[#20E09E] animate-pulse' : 'text-[#43D9FF] animate-pulse'
              }`}
            />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#F5F7FF]">
              {isRealBackend ? 'LIVE BACKEND DATA' : 'DEMO SURVEILLANCE MODE'}
            </span>
          </div>

          {/* Active routes count badge */}
          <span className="text-xs font-mono px-2.5 py-1.5 rounded-xl bg-[#090D17]/85 border border-[#8D9AB2]/20 text-[#8D9AB2] backdrop-blur-md">
            CORRIDORS:{' '}
            <strong className="text-[#43D9FF] tabular-nums">
              {activeRoutesCount}/{totalRoutesCount}
            </strong>
          </span>
        </div>

        {/* Right: Camera, Rotation & Fullscreen Actions */}
        <div className="pointer-events-auto flex items-center gap-2 self-end sm:self-auto">
          {/* Reset Camera */}
          <Tooltip content="Reset Earth Camera to Prime Surveillance Position">
            <button
              onClick={onResetView}
              aria-label="Reset Camera View"
              className="p-2 rounded-xl bg-[#090D17]/85 border border-[#8D9AB2]/20 text-[#8D9AB2] hover:text-[#43D9FF] hover:border-[#43D9FF]/40 backdrop-blur-md shadow-lg transition-all duration-200 outline-none"
            >
              <Compass className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Auto-Rotation Toggle */}
          <Tooltip content={autoRotate ? 'Pause Earth Rotation' : 'Resume Earth Rotation'}>
            <button
              onClick={onToggleAutoRotate}
              aria-label={autoRotate ? 'Pause rotation' : 'Resume rotation'}
              className={`p-2 rounded-xl bg-[#090D17]/85 border backdrop-blur-md shadow-lg transition-all duration-200 outline-none ${
                autoRotate
                  ? 'border-[#43D9FF]/40 text-[#43D9FF]'
                  : 'border-[#8D9AB2]/20 text-[#8D9AB2] hover:text-[#F5F7FF]'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
            </button>
          </Tooltip>

          {/* Fullscreen Toggle */}
          <Tooltip content={isFullscreen ? 'Exit Fullscreen' : 'Expand to Fullscreen View'}>
            <button
              onClick={onToggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Expand fullscreen'}
              className="p-2 rounded-xl bg-[#090D17]/85 border border-[#8D9AB2]/20 text-[#8D9AB2] hover:text-[#F5F7FF] hover:border-[#43D9FF]/40 backdrop-blur-md shadow-lg transition-all duration-200 outline-none"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Middle Floating Filter Toolbar */}
      <div className="pointer-events-auto self-start flex flex-wrap items-center gap-2 max-w-2xl bg-[#090D17]/80 border border-[#8D9AB2]/20 p-2 rounded-xl backdrop-blur-md shadow-2xl mt-auto sm:mt-0 mb-3">
        {/* Mineral Selector */}
        <div className="flex items-center gap-1 text-xs font-mono px-2 py-1 bg-[#111A2B] rounded-lg border border-[#8D9AB2]/20">
          <Layers className="w-3.5 h-3.5 text-[#43D9FF]" />
          <select
            value={filters.mineral}
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

        {/* Risk Classification Filter Buttons */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => onFilterChange({ ...filters, classification: 'ALL' })}
            className={`px-2 py-1 rounded-md transition-all ${
              filters.classification === 'ALL'
                ? 'bg-[#43D9FF] text-[#070A12] font-bold shadow-glow-cyan'
                : 'text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, classification: 'RED' })}
            className={`px-2 py-1 rounded-md transition-all ${
              filters.classification === 'RED'
                ? 'bg-[#FF5B65] text-[#070A12] font-bold'
                : 'text-[#FF5B65] hover:bg-[#FF5B65]/15'
            }`}
          >
            RED
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, classification: 'AMBER' })}
            className={`px-2 py-1 rounded-md transition-all ${
              filters.classification === 'AMBER'
                ? 'bg-[#FFB547] text-[#070A12] font-bold'
                : 'text-[#FFB547] hover:bg-[#FFB547]/15'
            }`}
          >
            AMBER
          </button>
          <button
            onClick={() => onFilterChange({ ...filters, classification: 'GREEN' })}
            className={`px-2 py-1 rounded-md transition-all ${
              filters.classification === 'GREEN'
                ? 'bg-[#20E09E] text-[#070A12] font-bold'
                : 'text-[#20E09E] hover:bg-[#20E09E]/15'
            }`}
          >
            GREEN
          </button>
        </div>

        {/* Search by Country */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#111A2B] rounded-lg border border-[#8D9AB2]/20 text-xs font-mono">
          <Search className="w-3.5 h-3.5 text-[#8D9AB2]" />
          <input
            type="text"
            placeholder="Search country..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-24 sm:w-28 bg-transparent text-[#F5F7FF] text-xs outline-none placeholder:text-[#8D9AB2]/50 font-mono"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="text-[#8D9AB2] hover:text-[#F5F7FF]"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-[10px] font-mono px-2 py-1 rounded bg-[#FF5B65]/15 text-[#FF5B65] hover:bg-[#FF5B65]/25 border border-[#FF5B65]/30 transition-all font-semibold"
          >
            RESET FILTERS
          </button>
        )}
      </div>

      {/* Bottom Footer: Risk Legend & Interaction Tip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Risk Color Legend */}
        <div className="pointer-events-auto flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#090D17]/85 border border-[#8D9AB2]/20 text-xs font-mono backdrop-blur-md">
          <span className="text-[#8D9AB2] text-[10px] uppercase font-bold tracking-wider">LEGEND:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF5B65] shadow-[0_0_6px_#FF5B65]" />
            <span className="text-[11px] text-[#FF5B65] font-semibold">RED (≥50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFB547] shadow-[0_0_6px_#FFB547]" />
            <span className="text-[11px] text-[#FFB547] font-semibold">AMBER (20-49)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#20E09E] shadow-[0_0_6px_#20E09E]" />
            <span className="text-[11px] text-[#20E09E] font-semibold">GREEN (0-19)</span>
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-[#8D9AB2] px-3 py-1.5 rounded-xl bg-[#090D17]/80 border border-[#8D9AB2]/15 backdrop-blur-md">
          <span>DRAG: ROTATE</span>
          <span>•</span>
          <span>SCROLL: ZOOM</span>
          <span>•</span>
          <span>CLICK ARCS: DOSSIER</span>
        </div>
      </div>
    </div>
  );
};
