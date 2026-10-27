import React from 'react';
import { cn } from '@/lib/utils';

export type StatusVariant = 'healthy' | 'warning' | 'error' | 'neutral' | 'cyan';

export interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  dot?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'neutral',
  dot = true,
  className,
  size = 'md',
}) => {
  const variantStyles: Record<StatusVariant, { bg: string; text: string; dot: string; border: string }> = {
    healthy: {
      bg: 'bg-[#20E09E]/10',
      text: 'text-[#20E09E]',
      dot: 'bg-[#20E09E]',
      border: 'border-[#20E09E]/25',
    },
    warning: {
      bg: 'bg-[#FFB547]/10',
      text: 'text-[#FFB547]',
      dot: 'bg-[#FFB547]',
      border: 'border-[#FFB547]/25',
    },
    error: {
      bg: 'bg-[#FF5B65]/10',
      text: 'text-[#FF5B65]',
      dot: 'bg-[#FF5B65]',
      border: 'border-[#FF5B65]/25',
    },
    neutral: {
      bg: 'bg-[#8D9AB2]/10',
      text: 'text-[#8D9AB2]',
      dot: 'bg-[#8D9AB2]',
      border: 'border-[#8D9AB2]/20',
    },
    cyan: {
      bg: 'bg-[#43D9FF]/10',
      text: 'text-[#43D9FF]',
      dot: 'bg-[#43D9FF]',
      border: 'border-[#43D9FF]/30',
    },
  };

  const style = variantStyles[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wider uppercase font-medium select-none',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'rounded-full animate-pulse',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            style.dot
          )}
        />
      )}
      <span>{status}</span>
    </span>
  );
};
