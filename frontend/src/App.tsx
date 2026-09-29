import React, { useState, useEffect } from 'react';
import { Topbar } from './components/Shell/Topbar';
import { Sidebar } from './components/Shell/Sidebar';
import { Overview } from './components/Dashboard/Overview';
import { WellMap } from './components/WellMap/WellMap';
import { WellExplorer } from './components/WellExplorer/WellExplorer';
import { HistoricalReports } from './components/HistoricalReports/HistoricalReports';
import { FormationCorrelation } from './components/FormationCorrelation/FormationCorrelation';
import { RiskDashboard } from './components/RiskDashboard/RiskDashboard';
import { AICopilot } from './components/AICopilot/AICopilot';
import { AlertCenter } from './components/AlertCenter/AlertCenter';
import { KnowledgeBase } from './components/KnowledgeBase/KnowledgeBase';
import { SystemStatus } from './components/SystemStatus/SystemStatus';

import { api } from './api/client';
import { Well, DashboardSummary, Alert } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<string>('overview');
  const [selectedWellId, setSelectedWellId] = useState<string>('WELL-B-03');
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>('DOC-DDR-2024-017');

  const [activeWell, setActiveWell] = useState<Well | null>(null);
  const [wells, setWells] = useState<Well[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [alertCount, setAlertCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Initial Data Load
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getDashboardSummary(),
      api.getWells(),
      api.getAlerts()
    ])
      .then(([summaryData, wellsData, alertsData]) => {
        if (!isMounted) return;
        setSummary(summaryData);
        setActiveWell(summaryData.active_well);
        setWells(wellsData);
        const unacked = alertsData.filter((a) => !a.acknowledged).length;
        setAlertCount(unacked);
      })
      .catch((err) => console.error('Failed to load initial data:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (view: string, targetId?: string) => {
    if (view === 'explorer' && targetId) {
      setSelectedWellId(targetId);
    }
    if (view === 'reports' && targetId) {
      setSelectedDocId(targetId);
    }
    setCurrentView(view);
  };

  const handleAlertAcknowledged = () => {
    setAlertCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050c17] text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Application Bar */}
      <Topbar
        activeWell={activeWell}
        alertCount={alertCount}
        onNavigate={handleNavigate}
      />

      {/* Main Body with Sidebar + View Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => handleNavigate(v)}
          alertCount={alertCount}
        />

        <main className="flex-1 flex flex-col overflow-y-auto bg-[#060e19]">
          {currentView === 'overview' && (
            <Overview
              summary={summary}
              loading={loading}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'map' && (
            <WellMap
              wells={wells}
              activeWell={activeWell}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'explorer' && (
            <WellExplorer
              wells={wells}
              selectedWellId={selectedWellId}
              activeWell={activeWell}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'reports' && (
            <HistoricalReports
              initialDocId={selectedDocId}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'correlation' && (
            <FormationCorrelation
              activeWell={activeWell}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'risks' && (
            <RiskDashboard
              activeWell={activeWell}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'copilot' && (
            <AICopilot
              activeWell={activeWell}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'alerts' && (
            <AlertCenter
              activeWell={activeWell}
              onNavigate={handleNavigate}
              onAlertAcknowledged={handleAlertAcknowledged}
            />
          )}

          {currentView === 'knowledge' && (
            <KnowledgeBase
              initialWellId={selectedWellId}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'status' && (
            <SystemStatus />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
