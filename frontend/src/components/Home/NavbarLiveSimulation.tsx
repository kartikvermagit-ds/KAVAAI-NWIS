import React, { useEffect, useRef, useState } from 'react';
import { Activity, Radio } from 'lucide-react';

export const NavbarLiveSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [depth, setDepth] = useState(3420.4);
  const [rop, setRop] = useState(14.8);
  const [torque, setTorque] = useState(18.2);

  // Continuous micro-telemetry fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setDepth((prev) => +(prev + 0.02).toFixed(2));
      setRop((prev) => +(14.5 + Math.sin(Date.now() / 1500) * 0.8).toFixed(1));
      setTorque((prev) => +(18.0 + Math.cos(Date.now() / 1800) * 0.7).toFixed(1));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Continuous MWD Mud-Pulse Waveform Canvas Simulation
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

      // Subtle background grid lines
      ctx.strokeStyle = 'rgba(18, 58, 90, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      // Continuous Oscilloscope Wave
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
      ctx.shadowBlur = 6;
      ctx.beginPath();

      for (let x = 0; x < w; x++) {
        // Compound wave simulating mud-pulse telemetry + drilling bit vibration
        const wave1 = Math.sin((x + offset) * 0.05) * 8;
        const wave2 = Math.sin((x * 2 - offset * 1.5) * 0.08) * 4;
        const noise = (Math.sin((x * 5 + offset * 3) * 0.1) * 2);
        const y = h / 2 + wave1 + wave2 + noise;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Leading pulse dot
      const dotX = (offset * 1.2) % w;
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(dotX, h / 2 + Math.sin(dotX * 0.05 + offset * 0.05) * 8, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      offset += 1.2;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="hidden lg:flex items-center space-x-3 bg-[#061424]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#143960] shadow-[0_0_15px_rgba(8,35,65,0.4)]">
      {/* Mini Radar / Sonar Ping Indicator */}
      <div className="flex items-center space-x-2 border-r border-[#143960] pr-3">
        <div className="relative flex items-center justify-center w-5 h-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </div>
        <div className="text-left font-mono">
          <div className="text-[9px] text-cyan-400 leading-none flex items-center space-x-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>MWD TELEMETRY</span>
          </div>
          <div className="text-[10px] text-slate-300 font-bold leading-tight mt-0.5">
            LIVE RIG STREAM
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Waveform Canvas */}
      <div className="w-28 h-6 relative overflow-hidden rounded bg-[#030b15] border border-[#123152]/80 flex items-center">
        <canvas
          ref={canvasRef}
          width={112}
          height={24}
          className="w-full h-full block"
        />
      </div>

      {/* Live Numerical Readouts */}
      <div className="flex items-center space-x-3 font-mono text-[11px] border-l border-[#143960] pl-3">
        {/* Continuous Depth Increment */}
        <div>
          <span className="text-[9px] text-slate-500 uppercase block leading-none">DEPTH</span>
          <span className="text-emerald-400 font-bold font-mono">
            {depth.toFixed(2)}m
          </span>
        </div>

        <div className="h-4 w-[1px] bg-[#143960]" />

        {/* Rate of Penetration */}
        <div>
          <span className="text-[9px] text-slate-500 uppercase block leading-none">ROP</span>
          <span className="text-cyan-300 font-semibold font-mono">
            {rop} m/h
          </span>
        </div>

        <div className="h-4 w-[1px] bg-[#143960]" />

        {/* Torque */}
        <div>
          <span className="text-[9px] text-slate-500 uppercase block leading-none">TORQUE</span>
          <span className="text-amber-400 font-semibold font-mono">
            {torque} kft-lb
          </span>
        </div>
      </div>
    </div>
  );
};
