import React from 'react';

export const MapFooter: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-[#090D17]/90 border-t border-[#8D9AB2]/15 text-xs font-mono text-[#8D9AB2]">
      {/* Risk Color Legend */}
      <div className="flex items-center gap-3.5 flex-wrap">
        <span className="text-[10px] uppercase font-bold text-[#8D9AB2]/70 tracking-wider">
          LEGEND:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B65] shadow-[0_0_8px_#FF5B65]" />
          <span className="text-[11px] text-[#FF5B65] font-semibold">RED (≥50)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB547] shadow-[0_0_8px_#FFB547]" />
          <span className="text-[11px] text-[#FFB547] font-semibold">AMBER (20-49)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#20E09E] shadow-[0_0_8px_#20E09E]" />
          <span className="text-[11px] text-[#20E09E] font-semibold">GREEN (0-19)</span>
        </div>
      </div>

      {/* Geopolitical Telemetry & Navigation Tip */}
      <div className="flex items-center gap-2.5 text-[10px] text-[#8D9AB2]/70 flex-wrap">
        <span className="hidden md:inline">WGS84 EQUIRECTANGULAR // GEOPOLITICAL BORDERS</span>
        <span className="hidden md:inline">•</span>
        <span>HOVER JURISDICTION FOR INTEL • CLICK CORRIDOR FOR DOSSIER</span>
      </div>
    </div>
  );
};
