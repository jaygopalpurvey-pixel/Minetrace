import React from 'react';
import { cn } from '@/lib/utils';

export interface BarItem {
  id: string;
  label: string;
  code?: string;
  value: number;
  secondaryValue?: string;
  color?: string;
}

export interface HorizontalBarChartProps {
  items: BarItem[];
  valueFormatter?: (val: number) => string;
  className?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  items,
  valueFormatter = (val) => val.toLocaleString(),
  className,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-xs font-mono text-[#8D9AB2]">
        <span>No mineral analytics available in database</span>
      </div>
    );
  }

  const maxValue = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={cn('space-y-3.5', className)}>
      {items.map((item) => {
        const percentage = Math.round((item.value / maxValue) * 100);

        return (
          <div key={item.id} className="group">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-[#F5F7FF] truncate group-hover:text-[#43D9FF] transition-colors">
                  {item.label}
                </span>
                {item.code && (
                  <span className="text-[10px] text-[#8D9AB2] px-1 py-0.2 rounded bg-[#111A2B] border border-[#8D9AB2]/15">
                    HS {item.code}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.secondaryValue && (
                  <span className="text-[11px] text-[#7287FF]">
                    {item.secondaryValue}
                  </span>
                )}
                <span className="font-semibold text-[#F5F7FF] tabular-nums">
                  {valueFormatter(item.value)}
                </span>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="h-2 w-full bg-[#111A2B] rounded-full overflow-hidden border border-[#8D9AB2]/15">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color || '#43D9FF',
                  boxShadow: item.color ? `0 0 10px ${item.color}40` : '0 0 10px rgba(67, 217, 255, 0.3)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
