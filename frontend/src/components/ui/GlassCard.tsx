import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glow?: boolean;
  variant?: 'card' | 'surface' | 'ghost';
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, interactive = false, glow = false, variant = 'card', ...props }, ref) => {
    const variantClasses = {
      card: 'bg-[#0D1320]/80 backdrop-blur-md border border-[#8D9AB2]/15',
      surface: 'bg-[#111A2B]/80 backdrop-blur-md border border-[#8D9AB2]/15',
      ghost: 'bg-transparent border border-[#8D9AB2]/10',
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-xl overflow-hidden transition-all duration-300',
          variantClasses,
          interactive && 'hover:border-[#43D9FF]/40 hover:bg-[#121A2C]/90 hover:shadow-card-subtle hover:-translate-y-0.5 cursor-pointer',
          glow && 'shadow-[0_0_25px_-5px_rgba(67,217,255,0.12)] border-[#43D9FF]/30',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
