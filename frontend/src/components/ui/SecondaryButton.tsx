import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'surface' | 'ghost';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  className,
  isLoading = false,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'surface',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 font-medium',
    md: 'px-4 py-2 text-sm gap-2 font-medium',
    lg: 'px-5 py-2.5 text-base gap-2.5 font-medium',
  }[size];

  const variantClasses = {
    surface: 'bg-[#111A2B] text-[#F5F7FF] border border-[#8D9AB2]/20 hover:bg-[#162238] hover:border-[#43D9FF]/40 hover:text-white',
    outline: 'bg-transparent text-[#F5F7FF] border border-[#8D9AB2]/25 hover:border-[#43D9FF]/60 hover:text-[#43D9FF] hover:bg-[#43D9FF]/5',
    ghost: 'bg-transparent text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg tracking-wide transition-all duration-200 select-none outline-none',
        'active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-[#7287FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070A12]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:transform-none',
        sizeClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#8D9AB2]" />
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
