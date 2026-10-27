import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { StatusBadge, StatusVariant } from '@/components/ui/StatusBadge';

export interface RiskScoreRadialGaugeProps {
  score: number;
  classification: string; // 'RED' | 'AMBER' | 'GREEN' | 'INSUFFICIENT_DATA'
  completeness?: string;  // 'COMPLETE' | 'PARTIAL' | 'UNAVAILABLE'
  flagStatus?: string | null;
  size?: number;
}

export const RiskScoreRadialGauge: React.FC<RiskScoreRadialGaugeProps> = ({
  score,
  classification,
  completeness = 'COMPLETE',
  flagStatus,
  size = 200,
}) => {
  const [animatedScore, setAnimatedScore] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return score;
    }
    return score;
  });

  useEffect(() => {
    setAnimatedScore(score);
  }, [score]);

  const isInsufficient = classification === 'INSUFFICIENT_DATA' || completeness === 'UNAVAILABLE';

  // SVG Geometry
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = isInsufficient ? 0 : Math.min(100, Math.max(0, animatedScore));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getColorHex = () => {
    if (isInsufficient) return '#7287FF';
    if (classification === 'RED' || score >= 50) return '#FF5B65';
    if (classification === 'AMBER' || (score >= 20 && score < 50)) return '#FFB547';
    return '#20E09E';
  };

  const getStatusVariant = (): StatusVariant => {
    if (isInsufficient) return 'cyan';
    if (classification === 'RED') return 'error';
    if (classification === 'AMBER') return 'warning';
    return 'healthy';
  };

  const getIcon = () => {
    if (isInsufficient) return <HelpCircle className="w-4 h-4 text-[#7287FF]" />;
    if (classification === 'RED') return <ShieldAlert className="w-4 h-4 text-[#FF5B65]" />;
    if (classification === 'AMBER') return <AlertTriangle className="w-4 h-4 text-[#FFB547]" />;
    return <ShieldCheck className="w-4 h-4 text-[#20E09E]" />;
  };

  const colorHex = getColorHex();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Radial Gauge SVG */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#111A2B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Glowing Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorHex}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 8px ${colorHex}40)`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="mb-0.5">{getIcon()}</div>
          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-[#F5F7FF]">
            {isInsufficient ? '—' : score.toFixed(1)}
          </div>
          <div className="text-[10px] font-mono uppercase text-[#8D9AB2] tracking-wider mt-0.5">
            {isInsufficient ? 'NO SCORE' : 'OUT OF 100'}
          </div>
        </div>
      </div>

      {/* Badges & Status Information */}
      <div className="mt-3 flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-2">
          <StatusBadge status={classification} variant={getStatusVariant()} size="sm" />
          {flagStatus && (
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                flagStatus === 'FLAGGED'
                  ? 'bg-[#FF5B65]/15 text-[#FF5B65] border-[#FF5B65]/30'
                  : 'bg-[#111A2B] text-[#8D9AB2] border-[#8D9AB2]/25'
              }`}
            >
              {flagStatus}
            </span>
          )}
        </div>

        <div className="text-[11px] font-mono text-[#8D9AB2]">
          DATA COMPLETENESS:{' '}
          <span
            className={
              completeness === 'COMPLETE'
                ? 'text-[#20E09E] font-bold'
                : completeness === 'PARTIAL'
                ? 'text-[#FFB547] font-bold'
                : 'text-[#7287FF] font-bold'
            }
          >
            {completeness}
          </span>
        </div>
      </div>
    </div>
  );
};
