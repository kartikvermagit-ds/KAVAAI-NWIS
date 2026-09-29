import React from 'react';
import {
  LayoutDashboard, Map, Compass, FileText, Layers,
  AlertTriangle, Bot, BellRing, Database, Activity, ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, alertCount }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'map', label: 'Well Map', icon: Map, badge: 'Live GIS' },
    { id: 'explorer', label: 'Well Explorer', icon: Compass },
    { id: 'reports', label: 'Historical Reports', icon: FileText, badge: 'WCR/DDR' },
    { id: 'correlation', label: 'Formation Correlation', icon: Layers },
    { id: 'risks', label: 'Risk Dashboard', icon: AlertTriangle },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, badge: 'Qwen/RAG' },
    { id: 'alerts', label: 'Alert Center', icon: BellRing, count: alertCount },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database },
    { id: 'status', label: 'System / Data Status', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-[#050e1a] border-r border-[#15253b] flex flex-col flex-shrink-0 select-none">
      {/* Module Title */}
      <div className="p-3.5 border-b border-[#15253b] space-y-1.5">
        <div className="flex items-center space-x-2">
          <div className="relative w-5 h-5 rounded bg-gradient-to-br from-[#0e2746] to-[#040e1b] border border-amber-500/80 flex items-center justify-center">
            <span className="font-mono font-black text-[10px] text-amber-400">K</span>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
            KAVAAI<span className="text-amber-400">-NWIS</span>
          </span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">Exploration Block-4 • Rig Horizon-04</div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1829]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span>{item.label}</span>
              </div>

              <div className="flex items-center space-x-1.5">
                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-blue-500/30 text-blue-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="bg-red-500/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {item.count}
                  </span>
                )}
                <ChevronRight className={`w-3 h-3 transition-transform ${isActive ? 'text-blue-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#15253b] bg-[#030913]">
        <div className="bg-[#091524] p-2.5 rounded border border-[#1a2d47] text-[11px]">
          <div className="flex items-center justify-between font-mono text-slate-400 mb-1">
            <span>Rig Telemetry</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Synchronized
            </span>
          </div>
          <div className="text-slate-300 font-mono text-[10px]">
            Offset Radius: <span className="text-blue-400 font-semibold">10.0 km</span>
          </div>
          <div className="text-slate-400 text-[10px] mt-1">
            SIH Smart Automation • Team KAVAAI
          </div>
        </div>
      </div>
    </aside>
  );
};
