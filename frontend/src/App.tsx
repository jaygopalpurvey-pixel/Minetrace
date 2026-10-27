import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { OverviewPage } from '@/pages/Overview';
import { ExplorerPage } from '@/pages/Explorer';
import { RiskAnalysisPage } from '@/pages/RiskAnalysis';
import { RankingsPage } from '@/pages/Rankings';
import { EvidencePage } from '@/pages/Evidence';
import { AIIntelligencePage } from '@/pages/AIIntelligence';
import { ReportsPage } from '@/pages/Reports';
import { SettingsPage } from '@/pages/Settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          {/* Default Overview */}
          <Route path="/" element={<OverviewPage />} />
          <Route path="/overview" element={<OverviewPage />} />

          {/* Dedicated Phase 3 Supply Chain Explorer */}
          <Route path="/explorer" element={<ExplorerPage />} />

          {/* Phase 2+ Navigation Placeholders */}

          {/* Dedicated Phase 5 Risk Analysis & Investigation */}
          <Route path="/risk-analysis" element={<RiskAnalysisPage />} />

          {/* Dedicated Phase 6 Risk Rankings */}
          <Route path="/rankings" element={<RankingsPage />} />

          {/* Dedicated Phase 6 Evidence & Audit Trail */}
          <Route path="/evidence" element={<EvidencePage />} />

          {/* Dedicated Phase 7 AI Intelligence */}
          <Route path="/ai" element={<AIIntelligencePage />} />

          {/* Dedicated Phase 7 PDF Evidence Reports */}
          <Route path="/reports" element={<ReportsPage />} />

          {/* Dedicated Phase 8 Settings & System Readiness */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};

export default App;
