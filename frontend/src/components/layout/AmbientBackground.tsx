import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none bg-[#070A12]"
    >
      {/* Subtle Technical Grid Lines */}
      <div className="absolute inset-0 bg-tech-grid opacity-60" />

      {/* Primary Cyan Ambient Radial Illumination (Top Left / Center) */}
      <div
        className="absolute -top-[15%] left-[10%] w-[650px] h-[650px] rounded-full opacity-20 blur-[140px] bg-gradient-to-br from-[#43D9FF] to-transparent animate-ambient-glow"
        style={{ animationDuration: '16s' }}
      />

      {/* Secondary Indigo Accent Illumination (Bottom Right) */}
      <div
        className="absolute top-[40%] -right-[10%] w-[550px] h-[550px] rounded-full opacity-15 blur-[160px] bg-gradient-to-tl from-[#7287FF] to-transparent"
      />

      {/* Subtle Vignette Gradient to maintain crisp text contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,#070A12_90%)]" />
    </div>
  );
};
