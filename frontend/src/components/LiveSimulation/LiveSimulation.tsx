import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, AlertTriangle, Shield, Activity,
  Gauge, TrendingDown, TrendingUp, Zap, ChevronRight, CheckCircle2,
  Sliders, ArrowDown, Droplets, Info, Volume2
} from 'lucide-react';
import { Well } from '../../types';

interface LiveSimulationProps {
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
}

type HazardType = 'NONE' | 'MUD_LOSS' | 'GAS_KICK' | 'TORQUE_SURGE';

export const LiveSimulation: React.FC<LiveSimulationProps> = ({ activeWell, onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simulation State
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [depth, setDepth] = useState<number>(3420.0);
  const [rop, setRop] = useState<number>(14.8);
  const [wob, setWob] = useState<number>(22.4);
  const [rpm, setRpm] = useState<number>(118);
  const [torque, setTorque] = useState<number>(18.2);
  const [spp, setSpp] = useState<number>(3250);
  const [flowIn, setFlowIn] = useState<number>(550);
  const [flowOut, setFlowOut] = useState<number>(550);
  const [activeHazard, setActiveHazard] = useState<HazardType>('NONE');

  // History sparklines
  const [ropHistory, setRopHistory] = useState<number[]>(Array(30).fill(14.8));
  const [torqueHistory, setTorqueHistory] = useState<number[]>(Array(30).fill(18.2));
  const [flowDeltaHistory, setFlowDeltaHistory] = useState<number[]>(Array(30).fill(0));

  // Stratigraphy bands
  const formations = [
    { name: 'Alluvium & Upper Clays', top: 0, bottom: 800, color: '#334155' },
    { name: 'Tipam Sandstone Group', top: 800, bottom: 2100, color: '#1e293b' },
    { name: 'Surma Siltstones & Shales', top: 2100, bottom: 2950, color: '#0f2942' },
    { name: 'Barail Sandstone / XYZ (Target)', top: 2950, bottom: 3650, color: '#143825' },
    { name: 'Kopili Marine Shale', top: 3650, bottom: 4200, color: '#2d1b4e' },
  ];

  // Micro-telemetry tick interval
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDepth((prev) => {
        const increment = 0.05 * simSpeed;
        const newDepth = +(prev + increment).toFixed(2);

        // Auto trigger Barail loss hazard if depth crosses 3439.5m without manual hazard
        if (newDepth >= 3439.8 && newDepth <= 3445 && activeHazard === 'NONE') {
          setActiveHazard('MUD_LOSS');
        }
        return newDepth;
      });

      // Fluctuate telemetry values based on active hazard state
      let currentRop = 14.5 + Math.sin(Date.now() / 1000) * 1.2;
      let currentWob = 22.0 + Math.cos(Date.now() / 1200) * 1.5;
      let currentRpm = 118 + Math.sin(Date.now() / 1400) * 3;
      let currentTorque = 18.0 + Math.sin(Date.now() / 800) * 0.9;
      let currentSpp = 3250 + Math.sin(Date.now() / 2000) * 40;
      let currentFlowIn = 550;
      let currentFlowOut = 550;

      if (activeHazard === 'MUD_LOSS') {
        currentRop = 9.2 + Math.random() * 0.8; // ROP drops due to loss of hydraulic head
        currentSpp = 2820 + Math.random() * 60; // Pressure drops
        currentFlowOut = 380 + Math.random() * 20; // 170 gpm loss (~48 bbl/hr)
        currentTorque = 21.0 + Math.random() * 1.5;
      } else if (activeHazard === 'GAS_KICK') {
        currentRop = 22.5 + Math.random() * 2.0; // Drilling break (ROP spike)
        currentSpp = 3580 + Math.random() * 80;
        currentFlowOut = 720 + Math.random() * 30; // Pit gain, flow out > flow in!
        currentTorque = 24.5 + Math.random() * 2.0;
      } else if (activeHazard === 'TORQUE_SURGE') {
        currentTorque = 28.5 + Math.sin(Date.now() / 200) * 4.5; // High stick-slip oscillation
        currentRpm = 85 + Math.sin(Date.now() / 200) * 35;
        currentRop = 6.4 + Math.random() * 1.0;
      }

      setRop(+currentRop.toFixed(1));
      setWob(+currentWob.toFixed(1));
      setRpm(Math.round(currentRpm));
      setTorque(+currentTorque.toFixed(1));
      setSpp(Math.round(currentSpp));
      setFlowIn(currentFlowIn);
      setFlowOut(Math.round(currentFlowOut));

      const deltaFlow = Math.round(currentFlowOut - currentFlowIn);
      setRopHistory((prev) => [...prev.slice(1), +currentRop.toFixed(1)]);
      setTorqueHistory((prev) => [...prev.slice(1), +currentTorque.toFixed(1)]);
      setFlowDeltaHistory((prev) => [...prev.slice(1), deltaFlow]);

    }, 300 / simSpeed);

    return () => clearInterval(interval);
  }, [isRunning, simSpeed, activeHazard]);

  // Subsurface Stratigraphy & Drill String Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particleOffset = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      // Stratigraphic geological column background (from 3350m to 3500m window)
      const windowTopDepth = 3360;
      const windowBottomDepth = 3480;
      const depthRange = windowBottomDepth - windowTopDepth;

      // Draw active Barail Sandstone interval
      const barailTopY = ((3360 - windowTopDepth) / depthRange) * h;
      const barailLossZoneY = ((3440 - windowTopDepth) / depthRange) * h;

      // Layer gradient
      const lithGrad = ctx.createLinearGradient(0, 0, w, h);
      lithGrad.addColorStop(0, '#0d2218');
      lithGrad.addColorStop(0.5, '#0b1d15');
      lithGrad.addColorStop(1, '#06130e');
      ctx.fillStyle = lithGrad;
      ctx.fillRect(0, 0, w, h);

      // Geological bedding laminae lines
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.12)';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y + Math.sin(y * 0.2) * 3);
        ctx.lineTo(w, y + Math.cos(y * 0.15) * 4);
        ctx.stroke();
      }

      // Predicted Mud Loss Hazard Bedding Band at 3,440 m (Matching WELL-B-03)
      const hazardBandHeight = 35;
      const hazardGrad = ctx.createLinearGradient(0, barailLossZoneY - hazardBandHeight / 2, 0, barailLossZoneY + hazardBandHeight / 2);
      hazardGrad.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
      hazardGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.25)');
      hazardGrad.addColorStop(1, 'rgba(239, 68, 68, 0.05)');
      ctx.fillStyle = hazardGrad;
      ctx.fillRect(0, barailLossZoneY - hazardBandHeight / 2, w, hazardBandHeight);

      // Hazard line marker
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, barailLossZoneY);
      ctx.lineTo(w, barailLossZoneY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Hazard Label
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('CRITICAL HAZARD DEPTH: 3,440 m (WELL-B-03 Mud Loss 48 bbl/hr)', 15, barailLossZoneY - 6);

      // Calculate current bit position on screen
      const clampedDepth = Math.max(windowTopDepth, Math.min(windowBottomDepth, depth));
      const bitY = ((clampedDepth - windowTopDepth) / depthRange) * h;
      const wellCenterX = w * 0.5;
      const wellWidth = 50;

      // Wellbore Hole Walls (Casing & Open Hole)
      ctx.fillStyle = 'rgba(2, 6, 12, 0.95)';
      ctx.fillRect(wellCenterX - wellWidth / 2, 0, wellWidth, bitY + 10);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      // Left wellbore wall
      ctx.beginPath();
      ctx.moveTo(wellCenterX - wellWidth / 2, 0);
      ctx.lineTo(wellCenterX - wellWidth / 2, bitY);
      ctx.stroke();
      // Right wellbore wall
      ctx.beginPath();
      ctx.moveTo(wellCenterX + wellWidth / 2, 0);
      ctx.lineTo(wellCenterX + wellWidth / 2, bitY);
      ctx.stroke();

      // Annular Mud Circulation (Upward flowing mud particles)
      if (isRunning) {
        ctx.fillStyle = activeHazard === 'MUD_LOSS' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(52, 211, 153, 0.6)';
        for (let p = 0; p < 8; p++) {
          const py = (bitY - ((particleOffset * 2 + p * 30) % bitY));
          if (py > 0 && py < bitY) {
            ctx.beginPath();
            ctx.arc(wellCenterX - wellWidth / 2 + 6, py, 2, 0, Math.PI * 2);
            ctx.arc(wellCenterX + wellWidth / 2 - 6, py, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Drill String Steel Pipe
      const pipeWidth = 16;
      const pipeGrad = ctx.createLinearGradient(wellCenterX - pipeWidth / 2, 0, wellCenterX + pipeWidth / 2, 0);
      pipeGrad.addColorStop(0, '#64748b');
      pipeGrad.addColorStop(0.5, '#e2e8f0');
      pipeGrad.addColorStop(1, '#475569');
      ctx.fillStyle = pipeGrad;
      ctx.fillRect(wellCenterX - pipeWidth / 2, 0, pipeWidth, bitY);

      // Downward Drilling Mud In-Pipe Arrows
      ctx.fillStyle = '#38bdf8';
      for (let y = 15; y < bitY - 15; y += 45) {
        const arrowY = (y + particleOffset * 1.5) % Math.max(1, bitY - 20);
        ctx.beginPath();
        ctx.moveTo(wellCenterX, arrowY + 6);
        ctx.lineTo(wellCenterX - 3, arrowY);
        ctx.lineTo(wellCenterX + 3, arrowY);
        ctx.closePath();
        ctx.fill();
      }

      // PDC Drill Bit Assembly
      const bitWidth = 36;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(wellCenterX - bitWidth / 2, bitY);
      ctx.lineTo(wellCenterX + bitWidth / 2, bitY);
      ctx.lineTo(wellCenterX + bitWidth / 4, bitY + 12);
      ctx.lineTo(wellCenterX, bitY + 18); // bit nozzle tip
      ctx.lineTo(wellCenterX - bitWidth / 4, bitY + 12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rock Cutting Vibration Sparks at Bit Tip
      if (isRunning) {
        ctx.fillStyle = activeHazard === 'TORQUE_SURGE' ? '#ef4444' : '#fde047';
        for (let s = 0; s < 5; s++) {
          const sparkAngle = Math.random() * Math.PI;
          const sparkDist = Math.random() * 14;
          const sx = wellCenterX + Math.cos(sparkAngle) * sparkDist;
          const sy = bitY + 16 + Math.sin(sparkAngle) * 6;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.random() * 2 + 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Bit Depth Crosshair & Dynamic Callout
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(0, bitY + 18);
      ctx.lineTo(wellCenterX - bitWidth / 2 - 5, bitY + 18);
      ctx.moveTo(wellCenterX + bitWidth / 2 + 5, bitY + 18);
      ctx.lineTo(w, bitY + 18);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dynamic Bit Depth Badge
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(w - 145, bitY + 5, 135, 24);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.strokeRect(w - 145, bitY + 5, 135, 24);

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText(`BIT: ${depth.toFixed(2)} m`, w - 135, bitY + 21);

      particleOffset += 1.2;
      animationFrameId = requestAnimationFrame(render);
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = (canvas.parentElement?.clientWidth || 600) * dpr;
    canvas.height = (canvas.parentElement?.clientHeight || 450) * dpr;
    ctx.scale(dpr, dpr);

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [depth, isRunning, activeHazard]);

  // Delta to hazard depth (3,440 m)
  const deltaToHazard = +(3440 - depth).toFixed(1);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050e18] text-slate-100 overflow-y-auto select-none font-sans p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold font-mono text-white">Live Rig Telemetry & Geological Simulation Studio</h1>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-700/50 font-bold">
                  MWD DIGITAL TWIN
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Simulating continuous PDC bit penetration, mud pulse hydraulics, and real-time offset formation hazard triggers
              </p>
            </div>
          </div>
        </div>

        {/* Global Simulation Controls */}
        <div className="flex items-center space-x-2 bg-[#09182a] p-1.5 rounded-xl border border-[#1b3455]">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Rig' : 'Resume Drill'}</span>
          </button>

          {/* Speed Controls */}
          <div className="flex items-center space-x-1 border-l border-slate-700 pl-2">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSimSpeed(spd)}
                className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                  simSpeed === spd
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white bg-[#0e223b]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setDepth(3420.0);
              setActiveHazard('NONE');
            }}
            className="p-1.5 rounded bg-[#0e223b] hover:bg-[#163359] text-slate-400 hover:text-white transition-colors"
            title="Reset Depth to 3,420 m"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Status Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Depth */}
        <div className="bg-[#09182a] p-3 rounded-xl border border-[#16304f] relative overflow-hidden">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Bit Depth (MD)</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {depth.toFixed(2)} <span className="text-xs text-slate-400">m</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-500/80 mt-1 flex items-center space-x-1">
            <ArrowDown className="w-3 h-3 text-emerald-400 animate-bounce" />
            <span>Advancing in Barail</span>
          </div>
        </div>

        {/* ROP */}
        <div className="bg-[#09182a] p-3 rounded-xl border border-[#16304f]">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Rate of Penetration</div>
          <div className="text-xl font-bold font-mono text-blue-400 mt-1">
            {rop} <span className="text-xs text-slate-400">m/hr</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Target: 14 - 16 m/hr
          </div>
        </div>

        {/* WOB */}
        <div className="bg-[#09182a] p-3 rounded-xl border border-[#16304f]">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Weight on Bit</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {wob} <span className="text-xs text-slate-400">klbs</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            RPM: {rpm}
          </div>
        </div>

        {/* Surface Torque */}
        <div className={`p-3 rounded-xl border transition-all ${
          activeHazard === 'TORQUE_SURGE'
            ? 'bg-red-950/40 border-red-500/80 text-red-300'
            : 'bg-[#09182a] border-[#16304f]'
        }`}>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Surface Torque</div>
          <div className="text-xl font-bold font-mono text-amber-400 mt-1">
            {torque} <span className="text-xs text-slate-400">kft-lbs</span>
          </div>
          <div className={`text-[10px] font-mono mt-1 ${activeHazard === 'TORQUE_SURGE' ? 'text-red-400 font-bold' : 'text-slate-400'}`}>
            {activeHazard === 'TORQUE_SURGE' ? 'STICK-SLIP SURGE!' : 'Nominal'}
          </div>
        </div>

        {/* Mud Flow In/Out */}
        <div className={`p-3 rounded-xl border transition-all ${
          activeHazard === 'MUD_LOSS'
            ? 'bg-red-950/40 border-red-500/80'
            : 'bg-[#09182a] border-[#16304f]'
        }`}>
          <div className="text-[10px] font-mono text-slate-400 uppercase">Flow Delta (Out - In)</div>
          <div className={`text-xl font-bold font-mono mt-1 ${
            flowOut - flowIn < -50
              ? 'text-red-400'
              : flowOut - flowIn > 50
              ? 'text-amber-400'
              : 'text-emerald-400'
          }`}>
            {flowOut - flowIn > 0 ? `+${flowOut - flowIn}` : flowOut - flowIn} <span className="text-xs text-slate-400">gpm</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            In: {flowIn} | Out: {flowOut}
          </div>
        </div>

        {/* Delta to Historical Hazard */}
        <div className="bg-[#0c1f36] p-3 rounded-xl border border-blue-500/40">
          <div className="text-[10px] font-mono text-blue-300 uppercase">Hazard Delta (WELL-B-03)</div>
          <div className={`text-xl font-bold font-mono mt-1 ${
            Math.abs(deltaToHazard) <= 5 ? 'text-red-400 font-extrabold animate-pulse' : 'text-amber-400'
          }`}>
            {deltaToHazard > 0 ? `+${deltaToHazard} m ahead` : `${Math.abs(deltaToHazard)} m past`}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Barail Loss Zone (3,440 m)
          </div>
        </div>
      </div>

      {/* Main Simulation Viewport: Subsurface Rig Canvas + Live Telemetry Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Subsurface Rig Visualizer (5 Cols) */}
        <div className="lg:col-span-5 bg-[#071424] rounded-2xl border border-[#163254] flex flex-col overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-[#0a1c31] border-b border-[#163254] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-slate-200">
                Subsurface Wellbore Penetration Visualizer
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              3,360 m - 3,480 m Window
            </span>
          </div>

          <div className="h-[420px] relative w-full bg-[#030a13]">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Quick Step Buttons */}
          <div className="p-3 bg-[#071424] border-t border-[#163254] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 text-[11px]">Manual Feed:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDepth((d) => +(d + 1).toFixed(2))}
                className="px-2.5 py-1 rounded bg-[#0d233d] hover:bg-[#153459] text-slate-200 border border-[#1b3d66]"
              >
                +1 m
              </button>
              <button
                onClick={() => setDepth((d) => +(d + 5).toFixed(2))}
                className="px-2.5 py-1 rounded bg-[#0d233d] hover:bg-[#153459] text-slate-200 border border-[#1b3d66]"
              >
                +5 m
              </button>
              <button
                onClick={() => setDepth(3439.5)}
                className="px-2.5 py-1 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700/60 font-semibold"
              >
                Jump to 3,439.5 m (Hazard Lip)
              </button>
            </div>
          </div>
        </div>

        {/* Right Telemetry Oscilloscope & Hazard Simulator Lab (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          {/* Active Hazard Warning Banner */}
          {activeHazard !== 'NONE' && (
            <div className={`p-4 rounded-xl border animate-pulse ${
              activeHazard === 'MUD_LOSS'
                ? 'bg-red-950/80 border-red-500 text-red-200'
                : activeHazard === 'GAS_KICK'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                : 'bg-purple-950/80 border-purple-500 text-purple-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-mono font-bold uppercase tracking-wider">
                      {activeHazard === 'MUD_LOSS' && 'CRITICAL MUD LOSS IN PROGRESS (48 bbl/hr Delta)'}
                      {activeHazard === 'GAS_KICK' && 'WELL CONTROL ALARM: PIT GAIN DETECTED'}
                      {activeHazard === 'TORQUE_SURGE' && 'STICK-SLIP TORQUE OSCILLATION (28.5 kft-lbs)'}
                    </div>
                    <div className="text-xs mt-1 font-mono text-slate-300">
                      {activeHazard === 'MUD_LOSS' && 'Formation pressure deficit matched: Offset Appraisal Well WELL-B-03 suffered identical 48 bbl/hr thief zone at 3,440 m in Barail Sandstone.'}
                      {activeHazard === 'GAS_KICK' && 'Formation influx detected! Annular flow out exceeds pump rate by 170 gpm. Immediate shut-in recommended.'}
                      {activeHazard === 'TORQUE_SURGE' && 'Matched with WELL-C-07 historical DDR record: Tight borehole led to 28.2 kft-lbs torque surge and stuck pipe warning.'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveHazard('NONE')}
                  className="px-2.5 py-1 rounded bg-slate-900 text-xs font-mono hover:bg-slate-800 border border-slate-700"
                >
                  Clear Hazard
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-red-800/40 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">AI Mitigation Protocol: Pump 30 bbl high-viscosity LCM pill (nut plug + mica).</span>
                <button
                  onClick={() => onNavigate('copilot')}
                  className="text-amber-400 hover:text-white underline font-semibold"
                >
                  Consult AI Copilot →
                </button>
              </div>
            </div>
          )}

          {/* Interactive Hazard Injection Lab */}
          <div className="bg-[#08182b] p-4 rounded-2xl border border-[#163457] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <h3 className="font-mono text-xs font-bold uppercase text-slate-200 tracking-wider">
                  Interactive Drilling Hazard Injection Lab
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Click to simulate real borehole anomalies
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => setActiveHazard('MUD_LOSS')}
                className={`p-3 rounded-xl border text-left font-mono transition-all ${
                  activeHazard === 'MUD_LOSS'
                    ? 'bg-red-900/50 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'bg-[#0d2238] border-[#1d3d63] hover:bg-[#132c48]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-red-400">
                  <TrendingDown className="w-4 h-4" />
                  <span>Severe Mud Loss</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Replicates WELL-B-03 48 bbl/hr event in Barail Sandstone
                </div>
              </button>

              <button
                onClick={() => setActiveHazard('GAS_KICK')}
                className={`p-3 rounded-xl border text-left font-mono transition-all ${
                  activeHazard === 'GAS_KICK'
                    ? 'bg-amber-900/50 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-[#0d2238] border-[#1d3d63] hover:bg-[#132c48]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>Overpressure Gas Kick</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Rapid pit volume surge & flow out increase
                </div>
              </button>

              <button
                onClick={() => setActiveHazard('TORQUE_SURGE')}
                className={`p-3 rounded-xl border text-left font-mono transition-all ${
                  activeHazard === 'TORQUE_SURGE'
                    ? 'bg-purple-900/50 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                    : 'bg-[#0d2238] border-[#1d3d63] hover:bg-[#132c48]'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-400">
                  <Zap className="w-4 h-4" />
                  <span>Torque Surge / Stick-Slip</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Replicates WELL-C-07 28.2 kft-lbs torsional friction
                </div>
              </button>
            </div>
          </div>

          {/* Real-time Telemetry Sparkline Strips */}
          <div className="bg-[#08182b] p-4 rounded-2xl border border-[#163457] space-y-4">
            <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>Continuous Telemetry Waveforms (Last 30 Seconds)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Sampling: 10 Hz</span>
            </div>

            {/* Mud Flow Delta Wave */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Flow Differential (Out - In): {flowOut - flowIn} gpm</span>
                <span className={flowOut - flowIn < -50 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {flowOut - flowIn < -50 ? 'Circulation Loss' : 'Balanced'}
                </span>
              </div>
              <div className="h-10 bg-[#040e1b] rounded-lg p-1 flex items-end space-x-1 overflow-hidden border border-[#122742]">
                {flowDeltaHistory.map((val, idx) => {
                  const barHeight = Math.min(100, Math.max(10, Math.abs(val) / 2));
                  const isNegative = val < -20;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-sm transition-all ${
                        isNegative ? 'bg-red-500' : val > 20 ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ height: `${barHeight}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Surface Torque Wave */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Torque: {torque} kft-lbs</span>
                <span className={torque > 25 ? 'text-red-400 font-bold' : 'text-blue-400'}>
                  Threshold: 24.0 kft-lbs
                </span>
              </div>
              <div className="h-10 bg-[#040e1b] rounded-lg p-1 flex items-end space-x-1 overflow-hidden border border-[#122742]">
                {torqueHistory.map((val, idx) => {
                  const barHeight = Math.min(100, Math.max(15, (val / 35) * 100));
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-sm transition-all ${
                        val > 25 ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                      style={{ height: `${barHeight}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stratigraphic Navigation Shortcut */}
          <div className="bg-[#0a1e35] p-3 rounded-xl border border-blue-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200">
                Correlate live telemetry with surrounding offset wells in Barail Sandstone:
              </span>
            </div>
            <button
              onClick={() => onNavigate('correlation')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-sm"
            >
              <span>View Correlation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
