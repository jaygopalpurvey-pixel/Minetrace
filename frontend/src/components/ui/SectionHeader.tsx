import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6', className)}>
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[#F5F7FF]">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className="text-sm text-[#8D9AB2] mt-1 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
};
