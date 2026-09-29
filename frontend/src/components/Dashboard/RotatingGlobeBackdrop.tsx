import React, { useEffect, useRef } from 'react';

export const RotatingGlobeBackdrop: React.FC = () => {
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
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

      ctx.clearRect(0, 0, w, h);

      // Globe center positioned at top-right / center-right background of Overview
      const globeRadius = Math.min(w, h) * 0.42;
      const cx = w > 1024 ? w * 0.82 : w * 0.5;
      const cy = h > 800 ? h * 0.38 : h * 0.42;

      // 1. Atmospheric Ambient Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.7, cx, cy, globeRadius * 1.35);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      glowGrad.addColorStop(0.5, 'rgba(5, 150, 105, 0.06)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Outer Silhouette Rim Ring
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
      ctx.shadowBlur = 12;
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

      // 2. Draw Latitude Rings (Parallels)
      const latSteps = [-60, -45, -30, -15, 0, 15, 30, 45, 60];
      latSteps.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        const isEquator = lat === 0;

        ctx.strokeStyle = isEquator ? 'rgba(52, 211, 153, 0.4)' : 'rgba(16, 185, 129, 0.2)';
        ctx.lineWidth = isEquator ? 1.5 : 1;

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

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.22)';
        ctx.lineWidth = 1;

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

      // 4. Draw Rotating Surface Exploration Basins & Target Radar Nodes
      surfacePoints.forEach((sp) => {
        const pt = project(sp.lat, sp.lon);
        if (pt.visible) {
          const isTarget = sp.name.includes('Assam');
          const alpha = 0.3 + 0.7 * pt.depth; // brighter when facing forward

          ctx.fillStyle = isTarget ? `rgba(245, 158, 11, ${alpha})` : `rgba(52, 211, 153, ${alpha})`;
          ctx.beginPath();
          ctx.arc(pt.px, pt.py, isTarget ? 4.5 : 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Radar pulse ring on active Assam target
          if (isTarget) {
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, 8 + Math.sin(rotation * 4) * 3, 0, Math.PI * 2);
            ctx.stroke();

            // Label
            ctx.font = '9px monospace';
            ctx.fillStyle = `rgba(253, 230, 138, ${alpha})`;
            ctx.fillText('WELL-A-01 [27°N, 95°E]', pt.px + 10, pt.py + 3);
          }
        }
      });

      // 5. Equatorial Horizon Laser Glow Scan
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.5)';
      ctx.lineWidth = 1.2;
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
        className="w-full h-full block opacity-40 transition-opacity duration-700"
      />
      {/* Subtle Orbital Tag in Corner */}
      <div className="absolute top-4 right-6 font-mono text-[9px] text-emerald-400/60 uppercase tracking-widest hidden xl:block">
        GLOBAL GIS RECON // 3D ROTATION: 0.28°/s // DATUM: WGS84
      </div>
    </div>
  );
};
