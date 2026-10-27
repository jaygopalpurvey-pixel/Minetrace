import React from 'react';
import { FolderSearch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Records Found',
  description = 'There are no active intelligence records matching the selected parameters or timeframe.',
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl',
        'border border-dashed border-[#8D9AB2]/20 bg-[#0D1320]/40 backdrop-blur-sm',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#111A2B] border border-[#8D9AB2]/20 flex items-center justify-center text-[#43D9FF] mb-4 shadow-[0_0_15px_-3px_rgba(67,217,255,0.15)]">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-[#F5F7FF] mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#8D9AB2] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <PrimaryButton size="sm" onClick={onAction}>
          {actionLabel}
        </PrimaryButton>
      )}
    </div>
  );
};
