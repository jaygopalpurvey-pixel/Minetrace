import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shimmer?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  shimmer = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-[#111A2B]/60 animate-pulse',
        shimmer &&
          'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-[#43D9FF]/5 before:to-transparent',
        className
      )}
      {...props}
    />
  );
};
