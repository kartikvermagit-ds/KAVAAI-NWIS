import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface SimulationProps {
  onComplete?: () => void;
}

export const DrillingSimulationBackdrop: React.FC<SimulationProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSettled, setIsSettled] = useState(false);
  const [simTime, setSimTime] = useState(0); // 0 to 10 seconds
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 10000; // 10 seconds

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const formations = [
      { name: 'SURFACE ALLUVIUM', depth: '0m', yRatio: 0.18, color: 'rgba(56, 189, 248, 0.25)' },
      { name: 'GIRUJAN CLAY FORMATION', depth: '1,150m', yRatio: 0.38, color: 'rgba(129, 140, 248, 0.25)' },
      { name: 'TIPAM SANDSTONE FORMATION', depth: '2,400m', yRatio: 0.58, color: 'rgba(245, 158, 11, 0.3)' },
      { name: 'BARAIL FORMATION (TARGET)', depth: '3,420m', yRatio: 0.78, color: 'rgba(16, 185, 129, 0.35)' },
      { name: 'KOPILI SHALE', depth: '4,100m', yRatio: 0.94, color: 'rgba(147, 51, 234, 0.2)' }
    ];

    const offsetWells = [
      { id: 'WELL-B-03', xOffset: -0.28, depthRatio: 0.78, dist: '3.2 km', hazard: 'MUD LOSS (48 bbl/hr)', isHazard: true },
      { id: 'WELL-C-07', xOffset: 0.26, depthRatio: 0.75, dist: '5.8 km', hazard: 'TORQUE SURGE', isHazard: false },
      { id: 'WELL-D-02', xOffset: -0.42, depthRatio: 0.82, dist: '8.4 km', hazard: 'STUCK PIPE RISK', isHazard: true },
      { id: 'WELL-E-11', xOffset: 0.39, depthRatio: 0.68, dist: '11.2 km', hazard: 'NORMAL CORRELATION', isHazard: false },
    ];

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1.0); // 0.0 to 1.0
      const currentSeconds = Math.min(elapsed / 1000, 10.0);
      setSimTime(currentSeconds);

      const w = window.innerWidth;
      const h = window.innerHeight;
      const cx = w * 0.5;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw Geological Stratigraphic Layers
      formations.forEach((f) => {
        const y = h * f.yRatio;

        // Stratigraphy separator line
        ctx.strokeStyle = f.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Stratigraphy text label on left margin
        ctx.font = '10px monospace';
        ctx.fillStyle = f.color;
        ctx.fillText(`[STRATA] ${f.name} // ${f.depth}`, 24, y - 6);
      });

      // 2. PHASE 1 (0s - 3.5s): Target Well Drilling Downward
      const drillProgress = Math.min(progress / 0.35, 1.0);
      const targetMaxY = h * 0.78; // At Barail Target
      const currentDrillY = h * 0.15 + (targetMaxY - h * 0.15) * drillProgress;

      // Draw Main Target Well Trajectory (WELL-A-01)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(cx, h * 0.12);
      ctx.lineTo(cx, currentDrillY);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Drill bit glowing beacon
      ctx.fillStyle = '#6ee7b7';
      ctx.beginPath();
      ctx.arc(cx, currentDrillY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Top Rig Head Indicator
      ctx.fillStyle = '#34d399';
      ctx.font = '10px monospace';
      ctx.fillText('TARGET RIG: WELL-A-01', cx - 58, h * 0.10);

      // 3. PHASE 2 (3.5s - 7s): Radar Scan Wave Radiating to Offset Wells
      if (progress > 0.35) {
        const radarProgress = Math.min((progress - 0.35) / 0.35, 1.0);
        const maxRadius = Math.max(w, h) * 0.45;
        const currentRadius = maxRadius * radarProgress;

        // Expanding Radar rings
        ctx.strokeStyle = `rgba(34, 211, 238, ${0.4 * (1.0 - radarProgress * 0.6)})`;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(cx, targetMaxY, currentRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(245, 158, 11, ${0.3 * (1.0 - radarProgress * 0.6)})`;
        ctx.beginPath();
        ctx.arc(cx, targetMaxY, currentRadius * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Render Offset Wells as radar reaches them
        offsetWells.forEach((ow) => {
          const ox = cx + w * ow.xOffset;
          const oy = h * ow.depthRatio;

          // Draw offset well trajectory
          ctx.strokeStyle = ow.isHazard ? 'rgba(239, 68, 68, 0.7)' : 'rgba(56, 189, 248, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ox, h * 0.16);
          ctx.lineTo(ox, oy);
          ctx.stroke();

          // Wellhead point
          ctx.fillStyle = ow.isHazard ? '#ef4444' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Label
          ctx.font = '9px monospace';
          ctx.fillStyle = ow.isHazard ? '#fca5a5' : '#7dd3fc';
          ctx.fillText(`${ow.id} (${ow.dist})`, ox - 25, oy + 16);
        });
      }

      // 4. PHASE 3 (7s - 10s): Neural Telemetry Correlation Arcs & Data Flow
      if (progress > 0.65) {
        const corrProgress = Math.min((progress - 0.65) / 0.35, 1.0);

        offsetWells.forEach((ow, idx) => {
          const ox = cx + w * ow.xOffset;
          const oy = h * ow.depthRatio;

          // Curving Correlation Beam
          ctx.strokeStyle = ow.isHazard
            ? `rgba(239, 68, 68, ${0.8 * corrProgress})`
            : `rgba(34, 211, 238, ${0.6 * corrProgress})`;
          ctx.lineWidth = ow.isHazard ? 2 : 1;
          ctx.setLineDash(ow.isHazard ? [4, 4] : [2, 4]);

          ctx.beginPath();
          ctx.moveTo(ox, oy);
          // quadratic curve to target bit
          ctx.quadraticCurveTo(
            (cx + ox) / 2,
            targetMaxY - 30 * (idx % 2 === 0 ? 1 : -1),
            cx,
            targetMaxY
          );
          ctx.stroke();
          ctx.setLineDash([]);

          // Historical Event Callout for WELL-B-03
          if (ow.id === 'WELL-B-03') {
            ctx.fillStyle = 'rgba(127, 29, 29, 0.85)';
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 1;
            const bx = (cx + ox) / 2 - 95;
            const by = targetMaxY - 45;
            ctx.fillRect(bx, by, 190, 22);
            ctx.strokeRect(bx, by, 190, 22);

            ctx.fillStyle = '#fecaca';
            ctx.font = '9px monospace';
            ctx.fillText('⚠ 48 bbl/hr MUD LOSS AT 3,440m', bx + 6, by + 14);
          }
        });
      }

      // 5. PHASE 4 (At 10s): Settle into Fixed State
      if (progress >= 1.0) {
        setIsSettled(true);
        if (onComplete) onComplete();
        // Continue drawing steady fixed frame without looping
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [replayKey, onComplete]);

  const handleReplay = () => {
    setIsSettled(false);
    setSimTime(0);
    setReplayKey((prev) => prev + 1);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {/* HTML5 Canvas Background */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-60 transition-opacity duration-1000"
      />

      {/* Floating 10-Second Status Tracker / Replay Controller */}
      <div className="absolute top-20 right-6 z-20 pointer-events-auto flex items-center space-x-2.5 bg-[#071424]/90 backdrop-blur-md border border-[#143354] rounded-lg px-3 py-1.5 font-mono text-[10px] shadow-xl">
        <div className="flex items-center space-x-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isSettled
                ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                : 'bg-amber-400 animate-ping'
            }`}
          />
          <span className="text-slate-300 font-bold">
            {isSettled ? 'SIMULATION LOCKED' : `SIH26121 SIMULATION: ${simTime.toFixed(1)}s / 10.0s`}
          </span>
        </div>

        {isSettled && (
          <button
            onClick={handleReplay}
            className="flex items-center space-x-1 ml-2 px-2 py-0.5 rounded bg-[#0b2444] hover:bg-[#123661] text-cyan-300 hover:text-white border border-cyan-500/50 transition-colors"
            title="Replay 10-second SIH Problem Statement Animation"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>REPLAY (10s)</span>
          </button>
        )}
      </div>
    </div>
  );
};
