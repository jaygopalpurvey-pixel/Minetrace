import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Layers,
  LayoutDashboard,
  Globe2,
  ShieldAlert,
  BarChart3,
  FileCheck2,
  Sparkles,
  FileText,
  Settings,
  Radio,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/navigation';

export interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  connectionStatus: string;
  isConnected: boolean | null;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', path: '/', icon: LayoutDashboard },
  { id: 'explorer', label: 'Supply Chain Explorer', path: '/explorer', icon: Globe2, isPhase1Placeholder: true },
  { id: 'risk-analysis', label: 'Risk Analysis', path: '/risk-analysis', icon: ShieldAlert, isPhase1Placeholder: true },
  { id: 'rankings', label: 'Risk Rankings', path: '/rankings', icon: BarChart3, isPhase1Placeholder: true },
  { id: 'evidence', label: 'Evidence & Audit', path: '/evidence', icon: FileCheck2, isPhase1Placeholder: true },
  { id: 'ai', label: 'AI Intelligence', path: '/ai', icon: Sparkles, isPhase1Placeholder: true },
  { id: 'reports', label: 'Reports', path: '/reports', icon: FileText, isPhase1Placeholder: true },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings, isPhase1Placeholder: true },
];

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  onClose,
  connectionStatus,
  isConnected,
}) => {
  const location = useLocation();

  return (
    <Dialog.Root open={open} onOpenChange={(val) => !val && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#070A12]/80 backdrop-blur-sm animate-in fade-in-0 duration-200" />

        {/* Content Sheet */}
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-[#090D17] border-r border-[#8D9AB2]/20 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 outline-none">
          {/* Header */}
          <div className="h-16 px-5 border-b border-[#8D9AB2]/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#111A2B] border border-[#43D9FF]/40 text-[#43D9FF] flex items-center justify-center shadow-glow-cyan">
                <Layers className="w-5 h-5 text-[#43D9FF]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider font-mono text-[#F5F7FF]">
                  MINETRACE
                </span>
                <span className="text-[9px] tracking-widest font-mono text-[#43D9FF] uppercase">
                  CRITICAL MINERAL INTEL
                </span>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                aria-label="Close menu"
                className="p-2 rounded-lg text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5" aria-label="Mobile Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none',
                    isActive
                      ? 'bg-[#43D9FF]/10 text-[#43D9FF] border border-[#43D9FF]/30 font-semibold'
                      : 'text-[#8D9AB2] hover:text-[#F5F7FF] hover:bg-[#111A2B]'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-[#43D9FF]' : 'text-[#8D9AB2]')} />
                  <span className="flex-1">{item.label}</span>
                  {item.isPhase1Placeholder && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#111A2B] text-[#8D9AB2] border border-[#8D9AB2]/20">
                      P2+
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Status */}
          <div className="p-4 border-t border-[#8D9AB2]/15 bg-[#070A12]/90 space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111A2B]/80 border border-[#8D9AB2]/20 text-xs">
              <div className="flex items-center gap-2">
                <Radio
                  className={cn(
                    'w-3.5 h-3.5',
                    isConnected === true ? 'text-[#20E09E] animate-pulse' : 'text-[#FFB547]'
                  )}
                />
                <span className="font-mono text-[#8D9AB2] text-[11px]">Backend:</span>
                <span className="font-mono font-medium text-[#F5F7FF] text-[11px]">
                  {connectionStatus}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#8D9AB2]/60">v0.8.0</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
