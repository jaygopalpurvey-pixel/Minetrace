import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SecondaryButton } from '@/components/ui/SecondaryButton';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Intelligence Stream Disrupted',
  message = 'An unexpected issue occurred while requesting analytical models or backend pipelines.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl',
        'border border-[#FF5B65]/30 bg-[#FF5B65]/5 backdrop-blur-sm',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-[#FF5B65]/15 border border-[#FF5B65]/40 flex items-center justify-center text-[#FF5B65] mb-4 shadow-[0_0_15px_-3px_rgba(255,91,101,0.25)]">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F5F7FF] mb-1.5">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#8D9AB2] max-w-md mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <SecondaryButton
          size="sm"
          variant="outline"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
          className="border-[#FF5B65]/40 text-[#FF5B65] hover:bg-[#FF5B65]/10 hover:border-[#FF5B65]"
        >
          Retry Connection
        </SecondaryButton>
      )}
    </div>
  );
};
