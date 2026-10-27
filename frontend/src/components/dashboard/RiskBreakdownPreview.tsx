import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

export const RiskBreakdownPreview: React.FC = () => {
  const rules = [
    { id: 'R1', name: 'Mirror Trade Gap', weight: '30%', threshold: '> 30% gap', status: 'READY' },
    { id: 'R2', name: 'Volume Surge Anomaly', weight: '20%', threshold: '> 200% spike', status: 'READY' },
    { id: 'R3', name: 'Jurisdiction Transit Risk', weight: '30%', threshold: '> 80% route', status: 'READY' },
    { id: 'R4', name: 'Unit Price Dispersion', weight: '20%', threshold: '> 60% dev', status: 'READY' },
    { id: 'R5', name: 'OFAC Sanctions Exposure', weight: 'Screening', threshold: 'SDN match', status: 'READY' },
  ];

  return (
    <GlassCard className="p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FF5B65]/10 text-[#FF5B65] border border-[#FF5B65]/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-[#F5F7FF] tracking-tight">
                RISK DETECTION CATALOG
              </h3>
              <p className="text-[11px] text-[#8D9AB2]">
                Deterministic 5-Rule Engine Architecture
              </p>
            </div>
          </div>
          <StatusBadge status="MODEL READY" variant="healthy" size="sm" />
        </div>

        {/* Rule breakdown table / list */}
        <div className="space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#111A2B]/70 border border-[#8D9AB2]/10 text-xs font-mono hover:border-[#43D9FF]/30 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[#43D9FF] font-bold shrink-0">{rule.id}</span>
                <span className="text-[#F5F7FF] truncate">{rule.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-[#8D9AB2]">
                <span className="text-[11px] text-[#7287FF] font-medium">{rule.weight}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#070A12] border border-[#8D9AB2]/15">
                  {rule.threshold}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#8D9AB2]/10 flex items-center justify-between text-[11px] font-mono text-[#8D9AB2]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#43D9FF]" />
          <span>Weights sum to 100% across R1–R4</span>
        </div>
        <span className="text-[#20E09E]">Engine Verified</span>
      </div>
    </GlassCard>
  );
};
