import React from 'react';
import { Menu, RefreshCw, Terminal, ExternalLink } from 'lucide-react';
import { SearchInput } from '@/components/ui/SearchInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { IconButton } from '@/components/ui/IconButton';
import { Tooltip } from '@/components/ui/Tooltip';
import { API_BASE_URL } from '@/services/api';

export interface TopNavbarProps {
  pageTitle: string;
  breadcrumb?: string;
  onOpenMobileNav: () => void;
  connectionStatus: string;
  isConnected: boolean | null;
  onRefreshHealth: () => void;
  isCheckingHealth?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  pageTitle,
  breadcrumb = 'MineTrace Intelligence',
  onOpenMobileNav,
  connectionStatus,
  isConnected,
  onRefreshHealth,
  isCheckingHealth = false,
}) => {
  const statusVariant =
    isConnected === true ? 'healthy' : isConnected === false ? 'error' : 'neutral';

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-[#8D9AB2]/15 bg-[#090D17]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Drawer Trigger & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
          className="md:hidden p-2 rounded-lg text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B] border border-[#8D9AB2]/20"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8D9AB2] tracking-wider uppercase">
            <span>{breadcrumb}</span>
            <span className="text-[#8D9AB2]/40">/</span>
            <span className="text-[#43D9FF] truncate font-medium">{pageTitle}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-[#F5F7FF] tracking-tight truncate">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Center: Search Field */}
      <div className="hidden lg:flex flex-1 justify-center max-w-md mx-4">
        <SearchInput />
      </div>

      {/* Right: Actions & Backend Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Connection Status Badge */}
        <Tooltip
          content={
            <div className="text-xs">
              <p className="font-semibold text-[#F5F7FF]">MineTrace Backend Service</p>
              <p className="text-[#8D9AB2] mt-0.5">Status: {connectionStatus}</p>
              <p className="text-[#43D9FF] text-[10px] mt-1 font-mono">Port: 8000 (FastAPI)</p>
            </div>
          }
        >
          <div className="hidden sm:inline-flex cursor-default">
            <StatusBadge
              status={connectionStatus}
              variant={statusVariant}
              size="sm"
            />
          </div>
        </Tooltip>

        {/* Check Backend Health Button */}
        <Tooltip content="Ping backend health endpoint (/health)">
          <IconButton
            label="Refresh Backend Status"
            icon={<RefreshCw className={isCheckingHealth ? 'w-4 h-4 animate-spin text-[#43D9FF]' : 'w-4 h-4'} />}
            onClick={onRefreshHealth}
            disabled={isCheckingHealth}
            variant="surface"
            size="sm"
          />
        </Tooltip>

        {/* API Docs Link */}
        <Tooltip content={`Open Backend Interactive OpenAPI Docs (${API_BASE_URL || 'http://127.0.0.1:8000'}/docs)`}>
          <SecondaryButton
            size="sm"
            variant="outline"
            leftIcon={<Terminal className="w-3.5 h-3.5 text-[#43D9FF]" />}
            rightIcon={<ExternalLink className="w-3 h-3 text-[#8D9AB2]" />}
            onClick={() => window.open(`${API_BASE_URL || 'http://127.0.0.1:8000'}/docs`, '_blank')}
            className="hidden sm:inline-flex text-xs font-mono"
          >
            API DOCS
          </SecondaryButton>
        </Tooltip>
      </div>
    </header>
  );
};
