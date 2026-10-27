import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe2,
  ShieldAlert,
  BarChart3,
  FileCheck2,
  Sparkles,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Radio,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/Tooltip';
import { NavItem } from '@/types/navigation';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  connectionStatus: string;
  isConnected: boolean | null;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', path: '/', icon: LayoutDashboard, isPhase1Placeholder: false },
  { id: 'explorer', label: 'Supply Chain Explorer', path: '/explorer', icon: Globe2, isPhase1Placeholder: false },
  { id: 'risk-analysis', label: 'Risk Analysis', path: '/risk-analysis', icon: ShieldAlert, isPhase1Placeholder: false },
  { id: 'rankings', label: 'Risk Rankings', path: '/rankings', icon: BarChart3, isPhase1Placeholder: false },
  { id: 'evidence', label: 'Evidence & Audit', path: '/evidence', icon: FileCheck2, isPhase1Placeholder: false },
  { id: 'ai', label: 'AI Intelligence', path: '/ai', icon: Sparkles, isPhase1Placeholder: false },
  { id: 'reports', label: 'Reports', path: '/reports', icon: FileText, isPhase1Placeholder: false },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings, isPhase1Placeholder: false },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  connectionStatus,
  isConnected,
}) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'relative hidden md:flex flex-col h-screen shrink-0 border-r border-[#8D9AB2]/15 bg-[#090D17] transition-all duration-300 z-30 select-none',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-[#8D9AB2]/15">
        <div className={cn('flex items-center gap-3 overflow-hidden', collapsed && 'justify-center w-full')}>
          {/* Cyan Glow Brand Mark */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#111A2B] border border-[#43D9FF]/40 text-[#43D9FF] shadow-[0_0_15px_-2px_rgba(67,217,255,0.3)] shrink-0">
            <Layers className="w-5 h-5 text-[#43D9FF]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#43D9FF] animate-pulse" />
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-wider font-mono text-[#F5F7FF] truncate">
                MINETRACE
              </span>
              <span className="text-[10px] tracking-widest font-mono text-[#43D9FF]/90 uppercase font-medium truncate">
                CRITICAL MINERAL INTEL
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          const linkContent = (
            <NavLink
              key={item.id}
              to={item.path}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none',
                isActive
                  ? 'bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/30 font-semibold shadow-[0_0_15px_-3px_rgba(67,217,255,0.15)]'
                  : 'text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B] hover:border hover:border-[#8D9AB2]/20',
                collapsed && 'justify-center px-0'
              )}
            >
              {/* Left Accent indicator when active */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#43D9FF] rounded-r shadow-[0_0_8px_#43D9FF]" />
              )}

              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  isActive ? 'text-[#43D9FF]' : 'text-[#8D9AB2] group-hover:text-[#F5F7FF]'
                )}
              />

              {!collapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!collapsed && item.isPhase1Placeholder && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#111A2B] text-[#8D9AB2]/70 border border-[#8D9AB2]/15 shrink-0 uppercase">
                  P2+
                </span>
              )}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip
                key={item.id}
                side="right"
                content={
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.label}</span>
                    {item.isPhase1Placeholder && (
                      <span className="text-[10px] text-[#43D9FF]/80 font-mono">Phase 2+ Feature</span>
                    )}
                  </div>
                }
              >
                {linkContent}
              </Tooltip>
            );
          }

          return <div key={item.id}>{linkContent}</div>;
        })}
      </nav>

      {/* Bottom Sidebar Status Section */}
      <div className="p-3 border-t border-[#8D9AB2]/15 bg-[#070A12]/80 space-y-3">
        {/* Connection status indicator */}
        <div
          className={cn(
            'flex items-center rounded-lg p-2 bg-[#111A2B]/60 border border-[#8D9AB2]/15 text-xs',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Radio
              className={cn(
                'w-3.5 h-3.5 shrink-0',
                isConnected === true
                  ? 'text-[#20E09E] animate-pulse'
                  : isConnected === false
                  ? 'text-[#FF5B65]'
                  : 'text-[#FFB547]'
              )}
            />
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-mono text-[#8D9AB2] truncate">
                  Backend Engine
                </span>
                <span
                  className={cn(
                    'text-[10px] font-mono font-semibold truncate',
                    isConnected === true
                      ? 'text-[#20E09E]'
                      : isConnected === false
                      ? 'text-[#FF5B65]'
                      : 'text-[#8D9AB2]'
                  )}
                >
                  {connectionStatus}
                </span>
              </div>
            )}
          </div>

          {!collapsed && (
            <span className="text-[9px] font-mono text-[#8D9AB2]/60 px-1 py-0.5 rounded bg-[#070A12] border border-[#8D9AB2]/15 shrink-0">
              v0.8.0
            </span>
          )}
        </div>

        {/* Collapse Toggle Control */}
        <button
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-mono text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B] border border-transparent hover:border-[#8D9AB2]/20 transition-all duration-200 outline-none"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[#43D9FF]" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>COLLAPSE SIDEBAR</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
