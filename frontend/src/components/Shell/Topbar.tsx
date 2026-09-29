import { Shield, HardHat, Bell, LogOut, Lock } from 'lucide-react';
import { Well } from '../../types';

interface TopbarProps {
  activeWell: Well | null;
  alertCount: number;
  onNavigate: (view: string) => void;
  operator?: { name: string; id: string; role: string } | null;
  onLogout?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeWell,
  alertCount,
  onNavigate,
  operator,
  onLogout
}) => {
  return (
    <header className="h-16 bg-[#071322] border-b border-[#1b2d48] px-6 flex items-center justify-between z-30 sticky top-0 shadow-md">
      {/* Brand & Context */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="KAVAAI-NWIS Logo"
            className="h-10 w-auto object-contain rounded cursor-pointer transition-transform hover:scale-105"
            onClick={() => onNavigate('overview')}
          />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono font-bold tracking-wider text-white text-base">KAVAAI-NWIS</span>
              <span className="bg-blue-950/80 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-700/50">
                SIH 2026 • SIH26121
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Nearby Wells Intelligence & Decision Support</p>
          </div>
        </div>

        <div className="h-7 w-[1px] bg-slate-800 hidden md:block" />

        {/* Current Active Well Telemetry Display (Section 2) */}
        <div className="hidden lg:flex items-center space-x-4 bg-[#0c1a2e] px-3.5 py-1.5 rounded-md border border-[#1b2e4b]">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block leading-none">CURRENT WELL</span>
            <span className="font-mono text-xs font-semibold text-blue-400">
              {activeWell ? activeWell.id : 'WELL-A-01'}
            </span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800" />

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block leading-none">CURRENT DEPTH</span>
            <span className="font-mono text-xs font-semibold text-emerald-400">
              {activeWell?.current_depth ? `${activeWell.current_depth.toLocaleString()} m` : '3,420 m'}
            </span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800" />

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block leading-none">ACTIVE FORMATION</span>
            <span className="font-mono text-xs font-semibold text-amber-300 truncate max-w-[150px] inline-block">
              Barail Sandstone / XYZ
            </span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800" />

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block leading-none">STATUS</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-mono font-semibold text-emerald-400">DRILLING ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-3">
        {/* Synthetic dataset disclaimer pill */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-slate-900/90 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-700/60">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-mono font-medium text-slate-300">Synthetic Demonstration Dataset</span>
        </div>

        {/* Alerts quick badge */}
        <button
          onClick={() => onNavigate('alerts')}
          className="relative p-2 rounded bg-[#0e1d33] hover:bg-[#162947] text-slate-300 hover:text-white border border-[#1e3455] transition-colors"
          title="Active Watch Signals"
        >
          <Bell className="w-4 h-4 text-amber-400" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 rounded-full">
              {alertCount}
            </span>
          )}
        </button>

        {/* Engineer profile & Logout */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <HardHat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="hidden xl:block leading-tight text-left">
            <div className="text-xs font-medium text-slate-200 truncate max-w-[140px]">
              {operator?.name || 'Lead Drilling Eng.'}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {operator?.id || 'Rig Horizon-04'}
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded bg-slate-900/80 hover:bg-red-950/60 border border-slate-700/60 hover:border-red-500/50 text-slate-400 hover:text-red-300 transition-colors ml-1"
              title="Lock Workstation / Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
