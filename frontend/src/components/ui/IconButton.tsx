import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'surface' | 'cyan';
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  className,
  size = 'md',
  variant = 'ghost',
  active = false,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5 text-xs',
    md: 'w-9 h-9 p-2 text-sm',
    lg: 'w-10 h-10 p-2.5 text-base',
  }[size];

  const variantClasses = {
    ghost: cn(
      'bg-transparent text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]',
      active && 'bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/30'
    ),
    surface: cn(
      'bg-[#111A2B] text-[#8D9AB2] border border-[#8D9AB2]/20 hover:text-[#F5F7FF] hover:border-[#43D9FF]/40 hover:bg-[#162238]',
      active && 'border-[#43D9FF] text-[#43D9FF] shadow-[0_0_12px_rgba(67,217,255,0.2)]'
    ),
    cyan: cn(
      'bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/30 hover:bg-[#43D9FF]/20 hover:border-[#43D9FF]/60',
      active && 'bg-[#43D9FF] text-[#070A12]'
    ),
  }[variant];

  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-200 outline-none select-none',
        'active:scale-95',
        'focus-visible:ring-2 focus-visible:ring-[#43D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070A12]',
        'disabled:opacity-40 disabled:pointer-events-none',
        sizeClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};
