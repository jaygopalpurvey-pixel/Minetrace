import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AnimatedKPICards } from '@/components/dashboard/AnimatedKPICards';
import { SupplyChainIntelligenceGlobe } from '@/components/globe/SupplyChainIntelligenceGlobe';
import { RiskDistributionPanel } from '@/components/dashboard/RiskDistributionPanel';
import { PriorityInvestigationsPanel } from '@/components/dashboard/PriorityInvestigationsPanel';
import { MineralRiskChartPanel } from '@/components/dashboard/MineralRiskChartPanel';
import { RecentActivityPanel } from '@/components/dashboard/RecentActivityPanel';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { loadDashboardOverview, API_BASE_URL } from '@/services/api';
import { DashboardData } from '@/types/api';

export const OverviewPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    status: null,
    classificationSummary: null,
    rankings: null,
    minerals: [],
    auditEvents: [],
    lastUpdated: null,
    isLive: false,
    loading: true,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOverviewData = async (period: string) => {
    // Prevent duplicate concurrent requests by aborting previous if in flight
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsRefreshing(true);
    setDashboardData((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await loadDashboardOverview(period, controller.signal);
      setDashboardData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error syncing dashboard data';
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: msg,
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverviewData(selectedPeriod);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedPeriod]);

  const handleRefresh = () => {
    if (isRefreshing) return;
    fetchOverviewData(selectedPeriod);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* 1. Header with Period Selector, Freshness & Refresh Action */}
      <DashboardHeader
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={dashboardData.lastUpdated}
        isLive={dashboardData.isLive}
      />

      {/* Backend connection warning banner if server is offline */}
      {!dashboardData.isLive && !dashboardData.loading && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FFB547]/10 border border-[#FFB547]/25 text-xs font-mono text-[#FFB547]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FFB547]" />
            <span>
              Backend engine is offline ({API_BASE_URL || '127.0.0.1:8000'}). Displaying local standby mode with placeholders.
            </span>
          </div>
          <SecondaryButton
            size="sm"
            variant="surface"
            leftIcon={<RefreshCw className="w-3 h-3" />}
            onClick={handleRefresh}
            className="text-[11px] py-1 px-2 border-[#FFB547]/30 text-[#FFB547] hover:bg-[#FFB547]/10"
          >
            Retry Connection
          </SecondaryButton>
        </div>
      )}

      {/* 2. Four Animated KPI Cards */}
      <AnimatedKPICards data={dashboardData} />

      {/* 3. Global Supply Chain Intelligence 3D Interactive Visualization */}
      <SupplyChainIntelligenceGlobe
        realRankings={dashboardData.rankings?.rankings || []}
        isLive={dashboardData.isLive}
      />

      {/* 4. Analytics Grid: Risk Distribution & Risk by Mineral */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskDistributionPanel
          summary={dashboardData.classificationSummary}
          loading={dashboardData.loading}
        />
        <MineralRiskChartPanel
          minerals={dashboardData.minerals}
          rankings={dashboardData.rankings?.rankings || []}
          loading={dashboardData.loading}
        />
      </div>

      {/* 5. Surveillance Grid: Priority Investigations & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityInvestigationsPanel
          rankings={dashboardData.rankings?.rankings || []}
          loading={dashboardData.loading}
        />
        <RecentActivityPanel
          events={dashboardData.auditEvents}
          loading={dashboardData.loading}
        />
      </div>
    </div>
  );
};
