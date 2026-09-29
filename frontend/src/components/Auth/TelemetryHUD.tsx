import React from 'react';

export const TelemetryHUD: React.FC = () => {
  return (
    <>
      {/* Top Left HUD */}
      <div className="absolute top-6 left-6 z-10 font-mono text-[11px] text-cyan-400/90 tracking-wider space-y-1 select-none pointer-events-none hidden sm:block">
        <div className="flex items-center space-x-2">
          <span className="text-cyan-500 font-bold">[SYS]</span>
          <span>KAVAAI-NWIS // NODE_01</span>
        </div>
        <div className="flex items-center space-x-2 text-cyan-400/70">
          <span className="text-cyan-500 font-bold">[COORD]</span>
          <span>SYNTHETIC DEMO // WELL-A-01</span>
        </div>
      </div>

      {/* Top Right HUD */}
      <div className="absolute top-6 right-6 z-10 font-mono text-[11px] text-cyan-400/90 tracking-wider space-y-1 select-none pointer-events-none text-right hidden sm:block">
        <div className="flex items-center justify-end space-x-2">
          <span className="text-amber-400 font-bold">[SEC]</span>
          <span>CONTROLLED ACCESS</span>
        </div>
        <div className="flex items-center justify-end space-x-2 text-cyan-400/70">
          <span className="text-cyan-500 font-bold">[NET]</span>
          <span>LOCAL WORKSTATION</span>
        </div>
      </div>

      {/* Bottom Left HUD */}
      <div className="absolute bottom-6 left-6 z-10 font-mono text-[11px] text-cyan-400/80 tracking-wider space-y-1 select-none pointer-events-none hidden sm:block">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 font-bold">[DATA]</span>
          <span className="text-slate-400">SYNTHETIC DRILLING DATA</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-cyan-500 font-bold">[GIS]</span>
          <span className="text-slate-400">OFFSET WELL INTELLIGENCE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-purple-400 font-bold">[AI]</span>
          <span className="text-slate-400">LOCAL / CONFIGURABLE</span>
        </div>
      </div>

      {/* Bottom Right HUD */}
      <div className="absolute bottom-6 right-6 z-10 font-mono text-[11px] text-cyan-400/80 tracking-wider space-y-1 select-none pointer-events-none text-right hidden sm:block">
        <div className="flex items-center justify-end space-x-2">
          <span className="text-amber-500 font-bold">[ENGINE]</span>
          <span className="text-slate-400">DRILLING INTELLIGENCE</span>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <span className="text-cyan-400 font-bold">[MODULE]</span>
          <span className="text-slate-400">NWIS CORE</span>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <span className="text-emerald-400 font-bold">[VERSION]</span>
          <span className="text-slate-400">1.0.0</span>
        </div>
      </div>
    </>
  );
};
