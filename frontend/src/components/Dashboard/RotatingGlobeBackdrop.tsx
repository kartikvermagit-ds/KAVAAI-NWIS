import React, { useEffect, useRef } from 'react';
import { Globe, Maximize2 } from 'lucide-react';

interface RotatingGlobeBackdropProps {
  onOpenGlobe?: () => void;
}

export const RotatingGlobeBackdrop: React.FC<RotatingGlobeBackdropProps> = ({ onOpenGlobe }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Continental landmass points for recognizing continents in green matrix
    const landmassPoints = [
      // India & South Asia
      { lat: 8.1, lon: 77.5 }, { lat: 13.1, lon: 80.3 }, { lat: 19.1, lon: 72.8 },
      { lat: 22.5, lon: 88.3 }, { lat: 26.8, lon: 94.2 }, { lat: 28.6, lon: 77.2 },
      { lat: 24.5, lon: 68.2 }, { lat: 31.1, lon: 75.3 }, { lat: 22.3, lon: 70.0 },
      // East Asia
      { lat: 31.2, lon: 121.5 }, { lat: 39.9, lon: 116.4 }, { lat: 35.6, lon: 139.7 },
      { lat: 1.35, lon: 103.8 }, { lat: 13.7, lon: 100.5 }, { lat: -6.2, lon: 106.8 },
      // Middle East
      { lat: 24.7, lon: 46.7 }, { lat: 25.3, lon: 55.3 }, { lat: 29.3, lon: 47.9 }, { lat: 35.7, lon: 51.4 },
      // Europe
      { lat: 48.8, lon: 2.3 }, { lat: 51.5, lon: -0.1 }, { lat: 52.5, lon: 13.4 }, { lat: 55.7, lon: 37.6 }, { lat: 56.5, lon: 3.2 },
      // Africa
      { lat: 30.0, lon: 31.2 }, { lat: 6.5, lon: 3.4 }, { lat: -33.9, lon: 18.4 }, { lat: -1.3, lon: 36.8 },
      // Americas
      { lat: 29.9, lon: -90.0 }, { lat: 40.7, lon: -74.0 }, { lat: 37.7, lon: -122.4 }, { lat: -22.9, lon: -43.2 },
      // Australia
      { lat: -33.8, lon: 151.2 }, { lat: -31.9, lon: 115.8 }, { lat: -19.8, lon: 116.5 }
    ];

    // Discrete 3D exploration basin points across the globe
    const surfacePoints = [
      { lat: 26.8, lon: 94.2, name: 'Assam Shelf (Active)' }, // Target Basin
      { lat: 19.1, lon: 72.8, name: 'Mumbai Offshore' },
      { lat: 16.5, lon: 82.3, name: 'KG Basin' },
      { lat: 26.2, lon: 71.3, name: 'Barmer Basin' },
      { lat: 22.5, lon: 70.0, name: 'Cambay Basin' },
      { lat: 24.5, lon: 54.4, name: 'Arabian Gulf' },
      { lat: 56.5, lon: 3.2, name: 'North Sea' },
      { lat: 28.0, lon: -90.0, name: 'Gulf of Mexico' },
      { lat: -22.5, lon: -40.5, name: 'Campos Basin' },
      { lat: 4.5, lon: 114.0, name: 'Borneo Shelf' },
      { lat: 60.0, lon: 75.0, name: 'West Siberian' },
      { lat: 38.0, lon: 50.0, name: 'Caspian Basin' },
    ];

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      // Globe center positioned at top-right / center-right background of Overview
      const globeRadius = Math.min(w, h) * 0.44;
      const cx = w > 1024 ? w * 0.82 : w * 0.5;
      const cy = h > 800 ? h * 0.38 : h * 0.42;

      // 1. High-Tech Green Atmospheric Ambient Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.7, cx, cy, globeRadius * 1.4);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.20)');
      glowGrad.addColorStop(0.4, 'rgba(5, 150, 105, 0.10)');
      glowGrad.addColorStop(0.8, 'rgba(16, 185, 129, 0.03)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Outer Silhouette Rim Ring
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Axial Tilt (23.5 degrees in radians)
      const tilt = 23.5 * (Math.PI / 180);
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      // 3D coordinate projection helper
      const project = (latDeg: number, lonDeg: number) => {
        const phi = latDeg * (Math.PI / 180);
        const theta = (lonDeg * (Math.PI / 180)) + rotation;

        // Base 3D Sphere coordinates
        const x0 = globeRadius * Math.cos(phi) * Math.sin(theta);
        const y0 = -globeRadius * Math.sin(phi);
        const z0 = globeRadius * Math.cos(phi) * Math.cos(theta);

        // Apply axial tilt around X/Z
        const x = x0;
        const y = y0 * cosTilt - z0 * sinTilt;
        const z = y0 * sinTilt + z0 * cosTilt;

        return {
          px: cx + x,
          py: cy + y,
          visible: z > 0, // front hemisphere
          depth: z / globeRadius // -1 to 1
        };
      };

      // 2. Draw Latitude Rings (Parallels in Neon Emerald)
      const latSteps = [-60, -45, -30, -15, 0, 15, 30, 45, 60];
      latSteps.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        const isEquator = lat === 0;

        ctx.strokeStyle = isEquator ? 'rgba(52, 211, 153, 0.55)' : 'rgba(16, 185, 129, 0.28)';
        ctx.lineWidth = isEquator ? 1.5 : 0.8;

        for (let lon = 0; lon <= 360; lon += 5) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.px, pt.py);
              first = false;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      });

      // 3. Draw Longitude Meridians (Rotating with rotation angle)
      const lonSteps = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      lonSteps.forEach((lon) => {
        ctx.beginPath();
        let first = true;

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.26)';
        ctx.lineWidth = 0.8;

        for (let lat = -80; lat <= 80; lat += 4) {
          const pt = project(lat, lon);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.px, pt.py);
              first = false;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      });

      // 4. Draw Continental Landmass Matrix Points
      landmassPoints.forEach((cp) => {
        const pt = project(cp.lat, cp.lon);
        if (pt.visible) {
          const alpha = 0.3 + 0.7 * pt.depth;
          ctx.fillStyle = `rgba(52, 211, 153, ${alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, 2.0 * pt.depth + 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 5. Draw Rotating Surface Exploration Basins & Target Radar Nodes
      surfacePoints.forEach((sp) => {
        const pt = project(sp.lat, sp.lon);
        if (pt.visible) {
          const isTarget = sp.name.includes('Assam');
          const alpha = 0.35 + 0.65 * pt.depth;

          ctx.fillStyle = isTarget ? '#fbbf24' : `rgba(52, 211, 153, ${alpha})`;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, isTarget ? 5.5 : 3.0, 0, Math.PI * 2);
          ctx.fill();

          // Radar pulse ring on active Assam target
          if (isTarget) {
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.9})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, 10 + Math.sin(rotation * 4) * 4, 0, Math.PI * 2);
            ctx.stroke();

            // Label
            ctx.font = 'bold 10px monospace';
            ctx.fillStyle = `rgba(253, 230, 138, ${alpha})`;
            ctx.fillText('WELL-A-01 [27°N, 95°E]', pt.px + 12, pt.py + 4);
          }
        }
      });

      // 6. Orbital Satellite Ring
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.4)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      for (let lon = 0; lon <= 360; lon += 6) {
        const pt = project(0, lon);
        if (pt.visible) {
          ctx.lineTo(pt.px, pt.py);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      rotation += 0.005; // smooth rotation speed
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-60 transition-opacity duration-700"
      />
      {/* Interactive Orbital HUD Tag in Top Corner */}
      <div className="absolute top-4 right-6 font-mono text-[10px] text-emerald-400 uppercase tracking-widest hidden xl:flex items-center space-x-2 pointer-events-auto">
        <span className="bg-[#041a12]/80 px-2.5 py-1 rounded border border-emerald-700/60 shadow-sm">
          GLOBAL 3D GREEN TWIN // WGS84 // 0.28°/s
        </span>
        {onOpenGlobe && (
          <button
            onClick={onOpenGlobe}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-md text-[10px] shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all cursor-pointer"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Interactive 3D Globe</span>
          </button>
        )}
      </div>
    </div>
  );
};
