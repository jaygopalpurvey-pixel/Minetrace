import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface DonutSegment {
  id: string;
  label: string;
  value: number;
  color: string;
  hoverColor?: string;
}

export interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSublabel?: string;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 220,
  strokeWidth = 26,
  centerLabel,
  centerSublabel = 'TOTAL',
  className,
}) => {
  const [activeSegment, setActiveSegment] = useState<DonutSegment | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Empty state handling
  if (total === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center p-6 text-center', className)}>
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="rotate-[-90deg]">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="rgba(141, 154, 178, 0.15)"
              strokeWidth={strokeWidth}
              strokeDasharray="4 6"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-mono font-bold text-[#8D9AB2]">0</span>
            <span className="text-[10px] font-mono text-[#5C6B84] uppercase">NO DATA</span>
          </div>
        </div>
        <p className="text-xs text-[#8D9AB2] mt-4 font-mono">
          No classified risk records available in database
        </p>
      </div>
    );
  }

  let accumulatedPercent = 0;

  return (
    <div className={cn('flex flex-col lg:flex-row items-center justify-center gap-6', className)}>
      {/* SVG Donut Chart with Center Information */}
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg] overflow-visible">
          {/* Base background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(141, 154, 178, 0.08)"
            strokeWidth={strokeWidth}
          />

          {data.map((seg) => {
            if (seg.value === 0) return null;
            const percent = seg.value / total;
            const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
            const strokeDashoffset = -circumference * accumulatedPercent;
            accumulatedPercent += percent;

            const isHovered = activeSegment?.id === seg.id;

            return (
              <circle
                key={seg.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${seg.color})` : undefined,
                }}
                onMouseEnter={() => setActiveSegment(seg)}
                onMouseLeave={() => setActiveSegment(null)}
              />
            );
          })}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
          <span className="text-2xl font-mono font-bold text-[#F5F7FF] tabular-nums tracking-tight">
            {activeSegment ? activeSegment.value : (centerLabel || total)}
          </span>
          <span className="text-[10px] font-mono text-[#8D9AB2] uppercase tracking-wider mt-0.5">
            {activeSegment ? activeSegment.label : centerSublabel}
          </span>
        </div>
      </div>

      {/* Accessible Interactive Legend */}
      <div className="flex-1 w-full space-y-2">
        {data.map((seg) => {
          const percent = total > 0 ? ((seg.value / total) * 100).toFixed(1) : '0.0';
          const isHovered = activeSegment?.id === seg.id;

          return (
            <div
              key={seg.id}
              onMouseEnter={() => setActiveSegment(seg)}
              onMouseLeave={() => setActiveSegment(null)}
              className={cn(
                'flex items-center justify-between p-2 rounded-lg transition-all duration-200 cursor-pointer border',
                isHovered
                  ? 'bg-[#111A2B] border-[#43D9FF]/40 shadow-[0_0_12px_rgba(67,217,255,0.15)]'
                  : 'bg-[#0D1320]/60 border-[#8D9AB2]/10 hover:border-[#8D9AB2]/25'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-xs font-mono font-medium text-[#F5F7FF] truncate">
                  {seg.label}
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                <span className="text-[#8D9AB2] tabular-nums font-medium">
                  {seg.value}
                </span>
                <span className="text-[10px] text-[#5C6B84] w-12 text-right tabular-nums">
                  {percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
