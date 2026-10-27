import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export type ClassificationType = 'RED' | 'AMBER' | 'GREEN' | 'INSUFFICIENT_DATA' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskBadgeProps {
  classification: ClassificationType | string;
  score?: number | null;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  classification,
  score,
  showIcon = true,
  size = 'md',
  className,
}) => {
  const norm = classification.toUpperCase();

  const isRed = norm === 'RED' || norm === 'HIGH';
  const isAmber = norm === 'AMBER' || norm === 'MEDIUM';
  const isGreen = norm === 'GREEN' || norm === 'LOW';

  const config = isRed
    ? {
        label: 'RED // HIGH ANOMALY',
        bg: 'bg-[#FF5B65]/15 text-[#FF5B65] border-[#FF5B65]/35 shadow-[0_0_12px_rgba(255,91,101,0.2)]',
        Icon: ShieldAlert,
      }
    : isAmber
    ? {
        label: 'AMBER // ELEVATED',
        bg: 'bg-[#FFB547]/15 text-[#FFB547] border-[#FFB547]/35 shadow-[0_0_12px_rgba(255,181,71,0.2)]',
        Icon: AlertTriangle,
      }
    : isGreen
    ? {
        label: 'GREEN // NORMAL',
        bg: 'bg-[#20E09E]/15 text-[#20E09E] border-[#20E09E]/35 shadow-[0_0_12px_rgba(32,224,158,0.2)]',
        Icon: ShieldCheck,
      }
    : {
        label: 'INSUFFICIENT DATA',
        bg: 'bg-[#8D9AB2]/15 text-[#8D9AB2] border-[#8D9AB2]/25',
        Icon: HelpCircle,
      };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }[size];

  const IconComponent = config.Icon;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-mono font-semibold tracking-wider select-none uppercase',
        sizeClasses,
        config.bg,
        className
      )}
    >
      {showIcon && <IconComponent className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'shrink-0')} />}
      <span>{config.label}</span>
      {score !== undefined && score !== null && (
        <span className="ml-1 pl-1 border-l border-current/30 tabular-nums">
          {score.toFixed(1)}
        </span>
      )}
    </span>
  );
};
