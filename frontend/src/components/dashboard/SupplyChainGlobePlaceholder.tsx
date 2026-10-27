import React from 'react';
import { Globe, Compass, Maximize2, Shield } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export const SupplyChainGlobePlaceholder: React.FC = () => {
  return (
    <GlassCard className="p-6 md:p-8 flex flex-col justify-between min-h-[420px] relative overflow-hidden group">
      {/* Background Technical Grid and Concentric Radar Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-tech-grid" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full border border-[#43D9FF]/10 pointer-events-none" />
      <div className="absolute -right-4 -bottom-4 w-64 h-64 rounded-full border border-[#7287FF]/10 pointer-events-none" />
      <div className="absolute right-12 bottom-12 w-32 h-32 rounded-full border border-dashed border-[#43D9FF]/20 animate-spin" style={{ animationDuration: '40s' }} />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF] shadow-[0_0_15px_-2px_rgba(67,217,255,0.2)]">
            <Globe className="w-5 h-5 text-[#43D9FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#F5F7FF]">
                GLOBAL SUPPLY CHAIN VISUALIZATION
              </h3>
              <StatusBadge status="PHASE 3 ROADMAP" variant="cyan" size="sm" />
            </div>
            <p className="text-xs font-mono text-[#8D9AB2] mt-0.5">
              TELEMETRY: SPHERICAL PROJECTION // MULTI-TIER MINING NODES
            </p>
          </div>
        </div>

        {/* View Controls Placeholder */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:inline-flex text-[11px] font-mono text-[#8D9AB2] px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/15">
            GRID: WGS84 GEO-INT
          </span>
          <SecondaryButton
            size="sm"
            variant="surface"
            leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
            disabled
            className="text-xs font-mono opacity-60"
          >
            EXPAND VIEW
          </SecondaryButton>
        </div>
      </div>

      {/* Central Reserved Staging Area */}
      <div className="my-8 flex flex-col items-center justify-center text-center py-10 px-4 relative z-10 max-w-xl mx-auto">
        {/* Futuristic Reticle Graphic */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#43D9FF]/30 flex items-center justify-center bg-[#070A12]/80 backdrop-blur-md shadow-glow-cyan">
            <Compass className="w-10 h-10 text-[#43D9FF] animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#43D9FF]" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#43D9FF]" />
        </div>

        <h4 className="text-lg font-bold text-[#F5F7FF] mb-2 tracking-wide font-mono">
          3D GEOSPATIAL PROJECTION ENGINE
        </h4>
        <p className="text-sm text-[#8D9AB2] leading-relaxed max-w-lg mb-6">
          The interactive 3D WebGL globe will be integrated in <strong>Phase 3</strong>. It will render real-time
          critical mineral trade arcs, mirror-gap divergence vectors, transshipment bottleneck hubs, and jurisdiction-risk heatmaps.
        </p>

        {/* Planned Capabilities Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#8D9AB2]">
          <span className="px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/15">
            • 3D Bilateral Trade Arcs
          </span>
          <span className="px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/15">
            • Transshipment Jurisdiction Hubs
          </span>
          <span className="px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/15">
            • OFAC Blocked Port Screening
          </span>
        </div>
      </div>

      {/* Footer metadata bar */}
      <div className="pt-4 border-t border-[#8D9AB2]/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#8D9AB2]/80 gap-2 relative z-10">
        <div className="flex items-center gap-4">
          <span>LAT: —°—'—"</span>
          <span>LON: —°—'—"</span>
          <span className="text-[#43D9FF]">MODE: STANDBY</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <Shield className="w-3.5 h-3.5 text-[#7287FF]" />
          <span>Reserved for Phase 3 3D Globe Implementation</span>
        </div>
      </div>
    </GlassCard>
  );
};
