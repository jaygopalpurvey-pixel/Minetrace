import React from 'react';
import { cn } from '@/lib/utils';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value?: string | number | null;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  category?: string;
  statusText?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  subtitle,
  category,
  statusText = 'Awaiting data',
  icon,
  isLoading = false,
  className,
}) => {
  const isAwaitingData = value === undefined || value === null;

  return (
    <SpotlightCard className={cn('p-5 flex flex-col justify-between h-full', className)}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-[#8D9AB2] font-semibold">
              {title}
            </span>
            {category && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111A2B] text-[#7287FF] border border-[#7287FF]/20">
                {category}
              </span>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-[#111A2B]/80 text-[#43D9FF] border border-[#8D9AB2]/15">
              {icon}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="my-2 space-y-2">
            <LoadingSkeleton className="h-8 w-24" />
            <LoadingSkeleton className="h-4 w-32" />
          </div>
        ) : isAwaitingData ? (
          <div className="my-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-[#8D9AB2]/70">
                —
              </span>
              <span className="text-xs font-mono text-[#8D9AB2]/80 px-2 py-0.5 rounded bg-[#111A2B] border border-[#8D9AB2]/20">
                {statusText}
              </span>
            </div>
            <p className="text-xs text-[#5C6B84] mt-1.5 leading-relaxed">
              Connect to backend pipeline to stream live calculations
            </p>
          </div>
        ) : (
          <div className="my-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono tracking-tight text-[#F5F7FF] tabular-nums">
                {value}
              </span>
              {change && (
                <span
                  className={cn(
                    'inline-flex items-center text-xs font-mono font-medium gap-0.5',
                    changeType === 'positive' && 'text-[#20E09E]',
                    changeType === 'negative' && 'text-[#FF5B65]',
                    changeType === 'neutral' && 'text-[#8D9AB2]'
                  )}
                >
                  {changeType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
                  {changeType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
                  {changeType === 'neutral' && <Minus className="w-3.5 h-3.5" />}
                  <span>{change}</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {subtitle && (
        <div className="pt-3 border-t border-[#8D9AB2]/10 mt-auto">
          <span className="text-xs text-[#8D9AB2] block truncate">
            {subtitle}
          </span>
        </div>
      )}
    </SpotlightCard>
  );
};
