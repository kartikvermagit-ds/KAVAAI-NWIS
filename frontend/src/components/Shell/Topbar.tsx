import React, { useState, useEffect, useRef } from 'react';
import { Shield, HardHat, Bell, LogOut, Home, Globe, Activity, Radio, Cpu, Sparkles } from 'lucide-react';
import { Well } from '../../types';
import { BrandLogo } from '../Common/BrandLogo';
import { SIHStoryModal } from '../Common/SIHStoryModal';

interface TopbarProps {
  activeWell: Well | null;
  alertCount: number;
  onNavigate: (view: string) => void;
  operator?: { name: string; id: string; role: string } | null;
  onLogout?: () => void;
  onGoHome?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeWell,
  alertCount,
  onNavigate,
  operator,
  onLogout,
  onGoHome
}) => {
  const [simDepth, setSimDepth] = useState<number>(3420.4);
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Micro-telemetry tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSimDepth((prev) => +(prev + 0.02).toFixed(2));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  // Continuous MWD Mud-Pulse Oscilloscope Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Grid line
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Oscilloscope Waveform in Tactical Green
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 4;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        const wave1 = Math.sin((x + offset) * 0.08) * 6;
        const wave2 = Math.sin((x * 2 - offset * 1.2) * 0.12) * 3;
        const y = h / 2 + wave1 + wave2;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Leading beacon
      const dotX = (offset * 1.5) % w;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(dotX, h / 2 + Math.sin(dotX * 0.08 + offset * 0.08) * 6, 2, 0, Math.PI * 2);
      ctx.fill();

      offset += 1.2;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <header className="h-16 bg-[#071322] border-b border-[#1b2d48] px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0 shadow-md">
      {/* Brand & Context */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        <BrandLogo
          size="md"
          onClick={() => onNavigate('overview')}
        />

        <div className="h-7 w-[1px] bg-slate-800 hidden md:block" />

        {/* Current Active Well Telemetry Display */}
        <div className="hidden lg:flex items-center space-x-3.5 bg-[#0c1a2e] px-3.5 py-1.5 rounded-lg border border-[#1b2e4b]">
          <div>
            <span className="text-[9px] uppercase font-mono text-slate-400 block leading-none">CURRENT WELL</span>
            <span className="font-mono text-xs font-semibold text-blue-400">
              {activeWell ? activeWell.id : 'WELL-A-01'}
            </span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800" />

          <div>
            <span className="text-[9px] uppercase font-mono text-slate-400 block leading-none">CURRENT DEPTH</span>
            <span className="font-mono text-xs font-semibold text-emerald-400">
              {simDepth.toFixed(2)} m
            </span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800" />

          <div>
            <span className="text-[9px] uppercase font-mono text-slate-400 block leading-none">ACTIVE FORMATION</span>
            <span className="font-mono text-xs font-semibold text-amber-300 truncate max-w-[140px] inline-block">
              Barail Sandstone / XYZ
            </span>
          </div>

          <div className="h-5 w-[1px] bg-slate-800" />

          <div>
            <span className="text-[9px] uppercase font-mono text-slate-400 block leading-none">STATUS</span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-semibold text-emerald-400">DRILLING ACTIVE</span>
            </div>
          </div>

          {/* Mini MWD Oscilloscope Canvas */}
          <div className="hidden xl:flex items-center space-x-2 pl-2 border-l border-slate-800">
            <canvas ref={canvasRef} width={80} height={22} className="block rounded bg-[#040e1b] border border-emerald-950" />
            <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
              <span>10 Hz</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center space-x-2.5">
        {/* SIH26121 Problem Statement Walkthrough Button */}
        <button
          onClick={() => setIsStoryOpen(true)}
          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-blue-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 text-amber-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)] text-xs font-mono font-bold transition-all animate-pulse"
          title="Launch SIH26121 Problem Statement Walkthrough & Evaluation Storyline"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">SIH26121 Tour</span>
        </button>

        {/* Quick Launch: 3D Green Globe */}
        <button
          onClick={() => onNavigate('globe')}
          className="flex items-center space-x-1.5 bg-[#032014] hover:bg-[#063321] text-emerald-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-emerald-700/60 shadow-[0_0_10px_rgba(16,185,129,0.2)] text-xs font-mono transition-all"
          title="Open Fullscreen 3D Green Planetary Earth Twin"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '24s' }} />
          <span className="hidden sm:inline font-semibold">3D Green Globe</span>
        </button>

        {/* Quick Launch: Live Rig Simulation */}
        <button
          onClick={() => onNavigate('simulation')}
          className="flex items-center space-x-1.5 bg-[#0d233e] hover:bg-[#14345d] text-cyan-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-cyan-700/60 shadow-[0_0_10px_rgba(6,182,212,0.2)] text-xs font-mono transition-all"
          title="Launch Live Rig Telemetry & Hazard Simulation Studio"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline font-semibold">Live Sim</span>
        </button>

        {/* Synthetic dataset disclaimer pill */}
        <div className="hidden 2xl:flex items-center space-x-1.5 bg-slate-900/90 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-700/60">
          <Shield className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-mono font-medium text-slate-300">Synthetic Dataset</span>
        </div>

        {/* Home page button */}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="p-2 rounded bg-[#0e1d33] hover:bg-[#162947] text-cyan-300 hover:text-white border border-[#1e3455] transition-colors"
            title="Landing Page / Product Presentation"
          >
            <Home className="w-4 h-4 text-cyan-400" />
          </button>
        )}

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
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <HardHat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="hidden xl:block leading-tight text-left">
            <div className="text-xs font-medium text-slate-200 truncate max-w-[130px]">
              {operator?.name || 'Lead Drilling Eng.'}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              {operator?.id || 'Rig Horizon-04'}
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* SIH Story Modal */}
      <SIHStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onNavigate={onNavigate}
      />
    </header>
  );
};
