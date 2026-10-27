import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className,
  isLoading = false,
  leftIcon,
  rightIcon,
  size = 'md',
  glow = true,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 font-medium',
    md: 'px-4 py-2 text-sm gap-2 font-semibold',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-semibold',
  }[size];

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg tracking-wide transition-all duration-200 select-none outline-none',
        'bg-[#43D9FF] text-[#070A12]',
        'hover:bg-[#5FE3FF] hover:shadow-glow-cyan hover:-translate-y-0.5',
        'active:translate-y-0 active:scale-[0.98] active:bg-[#34C5EB]',
        'focus-visible:ring-2 focus-visible:ring-[#43D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070A12]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none',
        glow && 'shadow-[0_0_15px_-2px_rgba(67,217,255,0.35)]',
        sizeClasses,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
