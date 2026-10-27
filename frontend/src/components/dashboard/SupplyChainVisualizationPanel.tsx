import React from 'react';
import { Globe, Compass, Maximize2, Shield, Radio } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export const SupplyChainVisualizationPanel: React.FC = () => {
  return (
    <GlassCard className="p-6 md:p-8 flex flex-col justify-between min-h-[400px] relative overflow-hidden group">
      {/* Background Technical Grid and Concentric Radar Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-tech-grid" />
      <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full border border-[#43D9FF]/10 pointer-events-none" />
      <div className="absolute -right-4 -bottom-4 w-52 h-52 rounded-full border border-[#7287FF]/10 pointer-events-none" />
      <div
        className="absolute right-12 bottom-12 w-28 h-28 rounded-full border border-dashed border-[#43D9FF]/20 animate-spin"
        style={{ animationDuration: '36s' }}
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#111A2B] border border-[#43D9FF]/30 text-[#43D9FF] shadow-[0_0_15px_-2px_rgba(67,217,255,0.2)]">
            <Globe className="w-5 h-5 text-[#43D9FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-[#F5F7FF]">
                Global Supply Chain Intelligence
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
            PROJECTION: WGS84
          </span>
          <SecondaryButton
            size="sm"
            variant="surface"
            leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
            disabled
            className="text-xs font-mono opacity-50 cursor-not-allowed"
          >
            PREVIEW (PHASE 3)
          </SecondaryButton>
        </div>
      </div>

      {/* Central Reserved Staging Area */}
      <div className="my-8 flex flex-col items-center justify-center text-center py-8 px-4 relative z-10 max-w-xl mx-auto">
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#43D9FF]/30 flex items-center justify-center bg-[#070A12]/80 backdrop-blur-md shadow-glow-cyan">
            <Compass className="w-9 h-9 text-[#43D9FF] animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#43D9FF]" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#43D9FF]" />
        </div>

        <h4 className="text-base sm:text-lg font-bold text-[#F5F7FF] mb-2 tracking-wide font-mono">
          Interactive 3D globe coming in Phase 3.
        </h4>
        <p className="text-xs sm:text-sm text-[#8D9AB2] leading-relaxed max-w-md mb-5 font-sans">
          The Phase 3 WebGL globe will render geospatial trade arcs, mirror-gap divergence corridors, transshipment bottlenecks, and OFAC port alerts.
        </p>

        {/* Feature telemetry tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#8D9AB2]">
          <span className="px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/15">
            • 3D Geospatial Arcs
          </span>
          <span className="px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/15">
            • Transshipment Hub Markers
          </span>
          <span className="px-2.5 py-1 rounded bg-[#111A2B] border border-[#8D9AB2]/15">
            • Port Sanctions Screening
          </span>
        </div>
      </div>

      {/* Footer metadata bar */}
      <div className="pt-3 border-t border-[#8D9AB2]/15 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#8D9AB2]/80 gap-2 relative z-10">
        <div className="flex items-center gap-3">
          <span>LAT: 00°00'00"</span>
          <span>LON: 00°00'00"</span>
          <span className="text-[#43D9FF] flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#43D9FF] animate-pulse" />
            STANDBY FOR PHASE 3
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <Shield className="w-3.5 h-3.5 text-[#7287FF]" />
          <span>Interactive Earth Reserved</span>
        </div>
      </div>
    </GlassCard>
  );
};
