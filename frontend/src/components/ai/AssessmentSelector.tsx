import React from 'react';
import { Search, ChevronDown, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { RiskAnalysisResponse } from '@/types/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export interface AssessmentSelectorProps {
  analyses: RiskAnalysisResponse[];
  selectedAnalysisId: string | null;
  onSelect: (analysisId: string) => void;
  loading?: boolean;
}

export const AssessmentSelector: React.FC<AssessmentSelectorProps> = ({
  analyses,
  selectedAnalysisId,
  onSelect,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const filtered = analyses.filter((a) => {
    const term = searchTerm.toLowerCase();
    const mineral = (a.mineral_type || '').toLowerCase();
    const rep = (a.reporter_country_code || '').toLowerCase();
    const part = (a.partner_country_code || '').toLowerCase();
    return (
      a.analysis_id.toLowerCase().includes(term) ||
      mineral.includes(term) ||
      rep.includes(term) ||
      part.includes(term) ||
      (a.commodity_code && a.commodity_code.toLowerCase().includes(term))
    );
  });

  const selected = analyses.find((a) => a.analysis_id === selectedAnalysisId) || analyses[0];

  return (
    <GlassCard className="p-4 border-[#8D9AB2]/20 font-mono text-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#8D9AB2]/15">
        <div className="flex items-center gap-2 text-[#43D9FF] font-bold uppercase tracking-wider text-xs">
          <ShieldAlert className="w-4 h-4" />
          <span>Select Target Risk Assessment</span>
        </div>
        <span className="text-[11px] text-[#8D9AB2]">
          {analyses.length} saved intelligence assessments available
        </span>
      </div>

      {/* Main Select Button / Trigger */}
      <div className="relative">
        <button
          type="button"
          disabled={loading || analyses.length === 0}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#070A12] border border-[#8D9AB2]/25 hover:border-[#43D9FF]/50 text-left transition-all"
        >
          {selected ? (
            <div className="flex items-center justify-between w-full pr-2 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-sm text-[#F5F7FF]">
                  <span className="text-[#43D9FF]">{selected.reporter_country_code}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8D9AB2]" />
                  <span className="text-[#7287FF]">{selected.partner_country_code}</span>
                </div>
                <span className="text-[11px] text-[#8D9AB2] truncate">
                  {selected.mineral_type || 'Critical Mineral'} ({selected.period})
                </span>
                <span className="text-[10px] text-[#8D9AB2]/80 bg-[#111A2B] px-1.5 py-0.5 rounded border border-[#8D9AB2]/20">
                  {selected.analysis_id}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-[#FF5B65] text-xs">
                  {selected.combined_anomaly_score.toFixed(1)} / 100
                </span>
                <StatusBadge
                  status={selected.classification || 'UNCLASSIFIED'}
                  variant={
                    selected.classification === 'RED'
                      ? 'error'
                      : selected.classification === 'AMBER'
                      ? 'warning'
                      : 'healthy'
                  }
                  size="sm"
                />
              </div>
            </div>
          ) : (
            <span className="text-[#8D9AB2]">
              {loading ? 'Loading assessments...' : 'No assessments found in database'}
            </span>
          )}

          <ChevronDown
            className={`w-4 h-4 text-[#8D9AB2] transition-transform ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl bg-[#090D17] border border-[#8D9AB2]/30 shadow-2xl p-2 space-y-2 animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8D9AB2]" />
              <input
                type="text"
                placeholder="Search mineral, corridor (e.g. CHL, USA), or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#070A12] border border-[#8D9AB2]/20 text-xs text-[#F5F7FF] placeholder-[#8D9AB2]/60 focus:outline-none focus:border-[#43D9FF]"
                autoFocus
              />
            </div>

            {/* List options */}
            <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar pr-1">
              {filtered.length === 0 ? (
                <div className="p-3 text-center text-[#8D9AB2] text-xs">
                  No matching assessments found.
                </div>
              ) : (
                filtered.map((item) => {
                  const isCur = item.analysis_id === selected?.analysis_id;
                  return (
                    <button
                      key={item.analysis_id}
                      type="button"
                      onClick={() => {
                        onSelect(item.analysis_id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-colors ${
                        isCur
                          ? 'bg-[#111A2B] border border-[#43D9FF]/40 text-[#F5F7FF]'
                          : 'hover:bg-[#111A2B]/60 text-[#8D9AB2] hover:text-[#F5F7FF]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isCur ? (
                          <Check className="w-3.5 h-3.5 text-[#43D9FF] shrink-0" />
                        ) : (
                          <span className="w-3.5 shrink-0" />
                        )}
                        <div className="truncate">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5F7FF]">
                            <span>{item.reporter_country_code}</span>
                            <ArrowRight className="w-3 h-3 text-[#8D9AB2]" />
                            <span>{item.partner_country_code}</span>
                            <span className="text-[11px] font-normal text-[#8D9AB2]">
                              ({item.mineral_type || 'Mineral'})
                            </span>
                          </div>
                          <span className="text-[10px] text-[#8D9AB2] block">
                            ID: {item.analysis_id} // Period: {item.period}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-bold text-[#FF5B65]">
                          {item.combined_anomaly_score.toFixed(1)}
                        </span>
                        <StatusBadge
                          status={item.classification || 'UNCLASSIFIED'}
                          variant={
                            item.classification === 'RED'
                              ? 'error'
                              : item.classification === 'AMBER'
                              ? 'warning'
                              : 'healthy'
                          }
                          size="sm"
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
