import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer';
import { AmbientBackground } from '@/components/layout/AmbientBackground';
import { checkBackendHealth } from '@/services/healthService';

export interface AppShellProps {
  children: React.ReactNode;
}

const PAGE_TITLES: Record<string, { title: string; breadcrumb: string }> = {
  '/': { title: 'Intelligence Overview', breadcrumb: 'Global Surveillance' },
  '/explorer': { title: 'Supply Chain Explorer', breadcrumb: 'Route Analytics' },
  '/risk-analysis': { title: 'Risk Analysis Engine', breadcrumb: 'Anomaly Detection' },
  '/rankings': { title: 'Risk Rankings', breadcrumb: 'Priority Triage' },
  '/evidence': { title: 'Evidence & Audit Trail', breadcrumb: 'Forensic Records' },
  '/ai': { title: 'AI Intelligence Assistant', breadcrumb: 'Local RAG' },
  '/reports': { title: 'Printable Evidence Reports', breadcrumb: 'Dossier Generation' },
  '/settings': { title: 'System Configuration', breadcrumb: 'Node Parameters' },
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('minetrace_sidebar_collapsed') === 'true';
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Connection state defaults strictly to "Connection not checked" as required by Phase 1 prompt
  const [connectionStatus, setConnectionStatus] = useState<string>('Connection not checked');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('minetrace_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleRefreshHealth = async () => {
    setIsCheckingHealth(true);
    setConnectionStatus('Checking...');
    const result = await checkBackendHealth();
    setIsConnected(result.connected);
    setConnectionStatus(result.connected ? 'ONLINE' : 'OFFLINE');
    setIsCheckingHealth(false);
  };

  useEffect(() => {
    // Check initial health status once on mount
    handleRefreshHealth();
  }, []);

  const pageInfo = PAGE_TITLES[location.pathname] || {
    title: 'Intelligence Overview',
    breadcrumb: 'MineTrace Intelligence',
  };

  return (
    <div className="min-h-screen flex bg-[#070A12] text-[#F5F7FF] relative selection:bg-[#43D9FF]/20 selection:text-[#43D9FF]">
      {/* Ambient Technical Background */}
      <AmbientBackground />

      {/* Desktop Collapsible Left Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        connectionStatus={connectionStatus}
        isConnected={isConnected}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        connectionStatus={connectionStatus}
        isConnected={isConnected}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <TopNavbar
          pageTitle={pageInfo.title}
          breadcrumb={pageInfo.breadcrumb}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          connectionStatus={connectionStatus}
          isConnected={isConnected}
          onRefreshHealth={handleRefreshHealth}
          isCheckingHealth={isCheckingHealth}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
