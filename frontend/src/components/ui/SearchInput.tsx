import React, { InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  shortcutHint?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, shortcutHint = 'Ctrl K', placeholder = 'Search intelligence, minerals, routes...', ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center w-full max-w-md', className)}>
        <Search className="absolute left-3 w-4 h-4 text-[#8D9AB2] pointer-events-none" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full bg-[#0D1320] text-[#F5F7FF] text-sm rounded-lg pl-9 pr-14 py-2 border border-[#8D9AB2]/20',
            'placeholder:text-[#8D9AB2]/60',
            'transition-all duration-200 outline-none',
            'hover:border-[#8D9AB2]/40',
            'focus:border-[#43D9FF]/70 focus:bg-[#111A2B] focus:shadow-[0_0_15px_-3px_rgba(67,217,255,0.2)]'
          )}
          {...props}
        />
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {value && onClear ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="p-1 rounded text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : shortcutHint ? (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#8D9AB2] bg-[#111A2B] rounded border border-[#8D9AB2]/20 select-none">
              {shortcutHint}
            </kbd>
          ) : null}
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
