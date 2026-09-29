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
import { LoginPage } from './components/Auth/LoginPage';
import { HomePage } from './components/Home/HomePage';

import { api } from './api/client';
import { Well, DashboardSummary, Alert } from './types';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nwis_authenticated') === 'true';
  });

  const [currentScreen, setCurrentScreen] = useState<'home' | 'login' | 'dashboard'>(() => {
    return localStorage.getItem('nwis_authenticated') === 'true' ? 'dashboard' : 'home';
  });

  const [operator, setOperator] = useState<{ name: string; id: string; role: string } | null>(() => {
    const saved = localStorage.getItem('nwis_operator');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return { name: 'Lead Drilling Eng.', id: 'engineer@nwis.local', role: 'Drilling Engineer' };
  });

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

  const handleLogin = (op: { name: string; id: string; role: string }) => {
    localStorage.setItem('nwis_authenticated', 'true');
    localStorage.setItem('nwis_operator', JSON.stringify(op));
    setOperator(op);
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
    setCurrentView('overview');
  };

  const handleContinueGuest = () => {
    const guest = {
      name: 'Guest Operator',
      id: 'NWIS-GUEST-01',
      role: 'Operations Specialist'
    };
    localStorage.setItem('nwis_authenticated', 'true');
    localStorage.setItem('nwis_operator', JSON.stringify(guest));
    setOperator(guest);
    setIsAuthenticated(true);
    setCurrentScreen('dashboard');
    setCurrentView('overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('nwis_authenticated');
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  if (currentScreen === 'home') {
    return (
      <HomePage
        onEnterLogin={() => setCurrentScreen('login')}
        onEnterDashboard={handleContinueGuest}
      />
    );
  }

  if (currentScreen === 'login' || !isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onContinueGuest={handleContinueGuest}
        onBackToHome={() => setCurrentScreen('home')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050c17] text-slate-100 overflow-hidden select-none font-sans">
      {/* Top Application Bar */}
      <Topbar
        activeWell={activeWell}
        alertCount={alertCount}
        onNavigate={handleNavigate}
        operator={operator}
        onLogout={handleLogout}
        onGoHome={() => setCurrentScreen('home')}
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
