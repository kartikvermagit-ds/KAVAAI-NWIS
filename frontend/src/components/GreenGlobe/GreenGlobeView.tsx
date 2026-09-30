import React, { useEffect, useRef, useState } from 'react';
import {
  Globe, RotateCw, ZoomIn, ZoomOut, Compass, Eye,
  Shield, Play, Pause, RefreshCw, Crosshair, ChevronRight, Layers
} from 'lucide-react';
import { Well } from '../../types';

interface GreenGlobeViewProps {
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
}

interface ExplorationBasin {
  name: string;
  country: string;
  lat: number;
  lon: number;
  status: 'ACTIVE_TARGET' | 'OFFSET_REFERENCE' | 'GLOBAL_BASIN';
  formation: string;
  depthM: number;
  hazards: string;
  wellCount: number;
}

export const GreenGlobeView: React.FC<GreenGlobeViewProps> = ({ activeWell, onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.004);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [selectedBasin, setSelectedBasin] = useState<ExplorationBasin | null>(null);

  // Layer toggles
  const [showLandmass, setShowLandmass] = useState<boolean>(true);
  const [showOrbitRings, setShowOrbitRings] = useState<boolean>(true);
  const [showRadarScan, setShowRadarScan] = useState<boolean>(true);
  const [showBasinNodes, setShowBasinNodes] = useState<boolean>(true);

  // Mouse interaction state for 3D orbital dragging
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationAngleRef = useRef<number>(0);
  const pitchAngleRef = useRef<number>(0.25); // Slight tilt
  const targetRotationRef = useRef<number | null>(null);

  // Major global exploration basins & target well
  const basins: ExplorationBasin[] = [
    {
      name: 'Assam Shelf (WELL-A-01 Target)',
      country: 'India',
      lat: 26.84,
      lon: 94.22,
      status: 'ACTIVE_TARGET',
      formation: 'Barail Sandstone / XYZ',
      depthM: 3420,
      hazards: 'Severe Mud Loss (48 bbl/hr) at 3,440 m',
      wellCount: 14
    },
    {
      name: 'Mumbai High Offshore',
      country: 'India',
      lat: 19.42,
      lon: 71.33,
      status: 'OFFSET_REFERENCE',
      formation: 'Basheer Carbonates / L-III',
      depthM: 2200,
      hazards: 'H2S Corrosive Influx & Tight Hole',
      wellCount: 42
    },
    {
      name: 'Krishna-Godavari Deepwater (KG-D6)',
      country: 'India',
      lat: 16.32,
      lon: 82.25,
      status: 'OFFSET_REFERENCE',
      formation: 'Pliocene Channel Sands',
      depthM: 3100,
      hazards: 'Shallow Water Flows & Hydrate Plugs',
      wellCount: 28
    },
    {
      name: 'Barmer Basin (Mangala Field)',
      country: 'India',
      lat: 25.82,
      lon: 71.24,
      status: 'OFFSET_REFERENCE',
      formation: 'Fatehgarh Fluvial Sandstone',
      depthM: 1450,
      hazards: 'Waxy Crude Viscosity & High Temp',
      wellCount: 35
    },
    {
      name: 'Cambay Rift Basin',
      country: 'India',
      lat: 22.35,
      lon: 72.62,
      status: 'OFFSET_REFERENCE',
      formation: 'Cambay Shale / Olpad',
      depthM: 2750,
      hazards: 'Overpressured Shales & Sloughing',
      wellCount: 19
    },
    {
      name: 'Persian Gulf / Ghawar',
      country: 'Saudi Arabia',
      lat: 25.40,
      lon: 50.10,
      status: 'GLOBAL_BASIN',
      formation: 'Arab-D Carbonate',
      depthM: 2300,
      hazards: 'Super-permeable Thief Zones',
      wellCount: 120
    },
    {
      name: 'North Sea (Brent / Ekofisk)',
      country: 'Norway / UK',
      lat: 56.55,
      lon: 3.21,
      status: 'GLOBAL_BASIN',
      formation: 'Brent Group Sandstone',
      depthM: 3200,
      hazards: 'High Pressure / High Temperature (HPHT)',
      wellCount: 85
    },
    {
      name: 'Gulf of Mexico Deepwater (Mississippi Canyon)',
      country: 'USA',
      lat: 27.50,
      lon: -90.50,
      status: 'GLOBAL_BASIN',
      formation: 'Norphlet / Wilcox Sandstone',
      depthM: 7800,
      hazards: 'Subsalt Rubble Zones & Narrow Mud Windows',
      wellCount: 94
    },
    {
      name: 'Campos Pre-Salt Basin',
      country: 'Brazil',
      lat: -22.50,
      lon: -40.50,
      status: 'GLOBAL_BASIN',
      formation: 'Barra Velha Microbialites',
      depthM: 5400,
      hazards: 'Thick Halite Salt Creep & Loss of Circulation',
      wellCount: 62
    },
    {
      name: 'Northwest Shelf Basin',
      country: 'Australia',
      lat: -19.80,
      lon: 116.50,
      status: 'GLOBAL_BASIN',
      formation: 'Mungaroo Formation',
      depthM: 3600,
      hazards: 'Severe Cyclone Swells & Differential Sticking',
      wellCount: 47
    }
  ];

  // Dense continental landmass point cloud (geodetic coordinates for earth outlines)
  const continentalPoints: { lat: number; lon: number }[] = [
    // Indian Subcontinent & Himalayas
    { lat: 8.1, lon: 77.5 }, { lat: 10.0, lon: 76.2 }, { lat: 13.1, lon: 80.3 },
    { lat: 15.3, lon: 73.8 }, { lat: 17.7, lon: 83.3 }, { lat: 19.1, lon: 72.8 },
    { lat: 21.0, lon: 86.8 }, { lat: 21.8, lon: 69.5 }, { lat: 22.8, lon: 70.2 },
    { lat: 22.5, lon: 88.3 }, { lat: 24.5, lon: 68.2 }, { lat: 26.8, lon: 94.2 },
    { lat: 27.5, lon: 95.3 }, { lat: 26.2, lon: 92.5 }, { lat: 25.5, lon: 91.8 },
    { lat: 28.6, lon: 77.2 }, { lat: 31.1, lon: 75.3 }, { lat: 34.1, lon: 74.8 },
    { lat: 35.8, lon: 76.5 }, { lat: 27.7, lon: 85.3 }, { lat: 28.0, lon: 88.0 },
    // South-East Asia
    { lat: 21.0, lon: 105.8 }, { lat: 13.7, lon: 100.5 }, { lat: 10.8, lon: 106.6 },
    { lat: 1.35, lon: 103.8 }, { lat: 3.14, lon: 101.7 }, { lat: -6.2, lon: 106.8 },
    { lat: -7.2, lon: 112.7 }, { lat: 14.6, lon: 121.0 }, { lat: 4.5, lon: 114.0 },
    // China & East Asia
    { lat: 39.9, lon: 116.4 }, { lat: 31.2, lon: 121.5 }, { lat: 22.3, lon: 114.2 },
    { lat: 35.6, lon: 139.7 }, { lat: 37.5, lon: 127.0 }, { lat: 43.1, lon: 131.9 },
    // Middle East & Caspian
    { lat: 24.7, lon: 46.7 }, { lat: 25.3, lon: 55.3 }, { lat: 29.3, lon: 47.9 },
    { lat: 35.7, lon: 51.4 }, { lat: 33.3, lon: 44.4 }, { lat: 38.9, lon: 35.2 },
    { lat: 40.4, lon: 49.8 }, { lat: 39.0, lon: 53.0 },
    // Europe
    { lat: 37.9, lon: 23.7 }, { lat: 41.9, lon: 12.5 }, { lat: 40.4, lon: -3.7 },
    { lat: 48.8, lon: 2.3 }, { lat: 51.5, lon: -0.1 }, { lat: 52.5, lon: 13.4 },
    { lat: 55.7, lon: 37.6 }, { lat: 59.9, lon: 30.3 }, { lat: 59.3, lon: 18.1 },
    { lat: 60.2, lon: 24.9 }, { lat: 64.1, lon: -21.9 }, { lat: 56.5, lon: 3.2 },
    // Africa
    { lat: 30.0, lon: 31.2 }, { lat: 36.8, lon: 10.2 }, { lat: 33.5, lon: -7.6 },
    { lat: 14.7, lon: -17.4 }, { lat: 6.5, lon: 3.4 }, { lat: 4.0, lon: 9.7 },
    { lat: -8.8, lon: 13.2 }, { lat: -22.5, lon: 17.0 }, { lat: -33.9, lon: 18.4 },
    { lat: -25.7, lon: 28.2 }, { lat: -15.4, lon: 28.3 }, { lat: -1.3, lon: 36.8 },
    { lat: 9.0, lon: 38.7 }, { lat: 15.6, lon: 32.5 },
    // North America
    { lat: 25.8, lon: -80.2 }, { lat: 29.9, lon: -90.0 }, { lat: 29.7, lon: -95.3 },
    { lat: 32.7, lon: -117.1 }, { lat: 37.7, lon: -122.4 }, { lat: 47.6, lon: -122.3 },
    { lat: 40.7, lon: -74.0 }, { lat: 42.3, lon: -71.0 }, { lat: 45.5, lon: -73.5 },
    { lat: 51.0, lon: -114.0 }, { lat: 61.2, lon: -149.9 }, { lat: 19.4, lon: -99.1 },
    // South America
    { lat: 10.5, lon: -66.9 }, { lat: 4.7, lon: -74.0 }, { lat: -0.2, lon: -78.5 },
    { lat: -12.0, lon: -77.0 }, { lat: -22.9, lon: -43.2 }, { lat: -23.5, lon: -46.6 },
    { lat: -34.6, lon: -58.4 }, { lat: -33.4, lon: -70.6 }, { lat: -53.1, lon: -70.9 },
    // Australia & Pacific
    { lat: -33.8, lon: 151.2 }, { lat: -37.8, lon: 144.9 }, { lat: -27.4, lon: 153.0 },
    { lat: -31.9, lon: 115.8 }, { lat: -12.4, lon: 130.8 }, { lat: -41.3, lon: 174.7 }
  ];

  // Set default selection to target well
  useEffect(() => {
    setSelectedBasin(basins[0]);
  }, []);

  // Main 3D Green Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth || 900;
      const height = canvas.parentElement?.clientHeight || 650;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      // Globe sphere center and dynamic radius
      const baseRadius = Math.min(w, h) * 0.38;
      const globeRadius = baseRadius * zoomLevel;
      const cx = w * 0.48;
      const cy = h * 0.50;

      // Handle smooth animation towards a targeted basin when clicked
      if (targetRotationRef.current !== null) {
        const diff = targetRotationRef.current - rotationAngleRef.current;
        if (Math.abs(diff) > 0.01) {
          rotationAngleRef.current += diff * 0.08;
        } else {
          targetRotationRef.current = null;
        }
      } else if (isRotating && !isDraggingRef.current) {
        rotationAngleRef.current += rotationSpeed;
      }

      const rot = rotationAngleRef.current;
      const pitch = pitchAngleRef.current;
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      // 3D Spherical Projection Function with Pitch & Yaw
      const project = (latDeg: number, lonDeg: number) => {
        const phi = (latDeg * Math.PI) / 180;
        const theta = ((lonDeg * Math.PI) / 180) + rot;

        // Base 3D Sphere Coordinates
        const x0 = globeRadius * Math.cos(phi) * Math.sin(theta);
        const y0 = -globeRadius * Math.sin(phi);
        const z0 = globeRadius * Math.cos(phi) * Math.cos(theta);

        // Apply pitch rotation around X axis
        const x = x0;
        const y = y0 * cosPitch - z0 * sinPitch;
        const z = y0 * sinPitch + z0 * cosPitch;

        return {
          px: cx + x,
          py: cy + y,
          visible: z > 0, // front hemisphere
          depth: z / globeRadius // 0 to 1
        };
      };

      // 1. Deep Space Matrix Starfield / Grid Backdrop
      ctx.strokeStyle = 'rgba(6, 78, 59, 0.25)';
      ctx.lineWidth = 0.5;
      const gridSpacing = 40;
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 2. High-Tech Green Atmospheric Rim Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.75, cx, cy, globeRadius * 1.35);
      glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.22)');
      glowGrad.addColorStop(0.4, 'rgba(5, 150, 105, 0.12)');
      glowGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.04)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 3. Holographic Sphere Ocean Core (Deep cyber green)
      const oceanGrad = ctx.createRadialGradient(cx - globeRadius * 0.25, cy - globeRadius * 0.25, 0, cx, cy, globeRadius);
      oceanGrad.addColorStop(0, '#032014');
      oceanGrad.addColorStop(0.7, '#02160d');
      oceanGrad.addColorStop(1, '#010c07');
      ctx.fillStyle = oceanGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Outer Sphere Neon Rim
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // 4. Latitude Rings (Parallels in Glowing Emerald)
      const latSteps = [-60, -45, -30, -15, 0, 15, 30, 45, 60];
      latSteps.forEach((lat) => {
        ctx.beginPath();
        let first = true;
        const isEquator = lat === 0;

        ctx.strokeStyle = isEquator ? 'rgba(52, 211, 153, 0.65)' : 'rgba(16, 185, 129, 0.28)';
        ctx.lineWidth = isEquator ? 1.5 : 0.8;

        for (let lon = 0; lon <= 360; lon += 4) {
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

      // 5. Longitude Meridians (Rotating Wireframe Sphere)
      const lonSteps = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
      lonSteps.forEach((lon) => {
        ctx.beginPath();
        let first = true;

        ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = 0.8;

        for (let lat = -80; lat <= 80; lat += 3) {
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

      // 6. Continental Landmass Point Cloud (Green Glowing Land Matrix)
      if (showLandmass) {
        continentalPoints.forEach((cp) => {
          const pt = project(cp.lat, cp.lon);
          if (pt.visible) {
            const alpha = 0.35 + 0.65 * pt.depth;
            ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.px, pt.py, 2.2 * pt.depth + 1.0, 0, Math.PI * 2);
            ctx.fill();

            // Connecting matrix micro-lines to simulate geological crust
            if (cp.lat > 15 && cp.lat < 35 && cp.lon > 65 && cp.lon < 95) {
              // Indian Subcontinent high-density cluster highlight
              ctx.fillStyle = `rgba(110, 231, 183, ${alpha * 0.9})`;
              ctx.beginPath();
              ctx.arc(pt.px, pt.py, 3.2 * pt.depth, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      }

      // 7. Rotating Orbital Telemetry Satellite Rings
      if (showOrbitRings) {
        // Equatorial Geostationary Orbit Ring
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.4)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const rx = cx + (globeRadius * 1.28) * Math.cos(a + rot * 0.5);
          const ry = cy + (globeRadius * 0.42) * Math.sin(a + rot * 0.5);
          if (a === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.stroke();

        // Polar Telemetry Orbit Ring
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const rx = cx + (globeRadius * 0.45) * Math.cos(a + rot * 0.8);
          const ry = cy + (globeRadius * 1.25) * Math.sin(a + rot * 0.8);
          if (a === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbiting Satellite Beacon Point
        const satAngle = rot * 1.5;
        const satX = cx + (globeRadius * 1.28) * Math.cos(satAngle);
        const satY = cy + (globeRadius * 0.42) * Math.sin(satAngle);
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(satX, satY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '9px monospace';
        ctx.fillStyle = 'rgba(167, 243, 208, 0.8)';
        ctx.fillText('NAV-SAT [IRNSS-1]', satX + 6, satY - 4);
      }

      // 8. Laser Radar Scanning Sweep Beam
      if (showRadarScan) {
        const sweepAngle = (rot * 2) % (Math.PI * 2);
        const scanLength = globeRadius * 1.05;
        const beamX = cx + Math.cos(sweepAngle) * scanLength;
        const beamY = cy + Math.sin(sweepAngle) * scanLength;

        const scanGrad = ctx.createLinearGradient(cx, cy, beamX, beamY);
        scanGrad.addColorStop(0, 'rgba(52, 211, 153, 0.05)');
        scanGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.3)');
        scanGrad.addColorStop(1, '#00ff88');

        ctx.strokeStyle = scanGrad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(beamX, beamY);
        ctx.stroke();
      }

      // 9. Exploration Basins & Active Well Marker Beacons
      if (showBasinNodes) {
        basins.forEach((basin) => {
          const pt = project(basin.lat, basin.lon);
          if (pt.visible) {
            const isTarget = basin.status === 'ACTIVE_TARGET';
            const isOffset = basin.status === 'OFFSET_REFERENCE';
            const alpha = 0.4 + 0.6 * pt.depth;

            // Target Node (Assam Shelf / WELL-A-01)
            if (isTarget) {
              // Glowing Concentric Radar Pulse Ring
              const pulse = (Date.now() / 300) % 20;
              ctx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0, 1 - pulse / 20)})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(pt.px, pt.py, 6 + pulse, 0, Math.PI * 2);
              ctx.stroke();

              // Solid Glowing Beacon
              ctx.fillStyle = '#fbbf24';
              ctx.shadowColor = '#f59e0b';
              ctx.shadowBlur = 12;
              ctx.beginPath();
              ctx.arc(pt.px, pt.py, 5.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;

              // Reticle Crosshairs
              ctx.strokeStyle = '#f59e0b';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(pt.px - 10, pt.py);
              ctx.lineTo(pt.px + 10, pt.py);
              ctx.moveTo(pt.px, pt.py - 10);
              ctx.lineTo(pt.px, pt.py + 10);
              ctx.stroke();

              // High-tech Tactical Label
              ctx.font = 'bold 11px monospace';
              ctx.fillStyle = '#fde68a';
              ctx.shadowColor = '#000000';
              ctx.shadowBlur = 4;
              ctx.fillText('TARGET: WELL-A-01', pt.px + 14, pt.py - 6);
              ctx.font = '9px monospace';
              ctx.fillStyle = '#6ee7b7';
              ctx.fillText(`3,420 m • [${basin.lat.toFixed(1)}°N, ${basin.lon.toFixed(1)}°E]`, pt.px + 14, pt.py + 8);
              ctx.shadowBlur = 0;
            } else if (isOffset) {
              // Offset reference well (Bright Neon Emerald)
              ctx.fillStyle = `rgba(52, 211, 153, ${alpha})`;
              ctx.shadowColor = '#10b981';
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(pt.px, pt.py, 3.8, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;

              ctx.font = '10px monospace';
              ctx.fillStyle = `rgba(209, 250, 229, ${alpha})`;
              ctx.fillText(basin.name.split(' ')[0], pt.px + 8, pt.py + 3);
            } else {
              // Global Basin
              ctx.fillStyle = `rgba(16, 185, 129, ${alpha * 0.7})`;
              ctx.beginPath();
              ctx.arc(pt.px, pt.py, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });
      }

      // 10. Corner Compass Reticle in Cyber Green
      const compX = 40;
      const compY = h - 45;
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(compX, compY, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('N', compX - 3, compY - 24);
      ctx.beginPath();
      ctx.moveTo(compX, compY - 16);
      ctx.lineTo(compX - 4, compY);
      ctx.lineTo(compX + 4, compY);
      ctx.closePath();
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isRotating, rotationSpeed, zoomLevel, showLandmass, showOrbitRings, showRadarScan, showBasinNodes]);

  // Mouse Interaction handlers for dragging globe to rotate
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    rotationAngleRef.current += deltaX * 0.008;
    pitchAngleRef.current = Math.max(-0.8, Math.min(0.8, pitchAngleRef.current + deltaY * 0.005));

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Focus directly onto a specific basin
  const handleFocusBasin = (basin: ExplorationBasin) => {
    setSelectedBasin(basin);
    // Calculate required rotation angle to bring basin longitude to the front
    const targetTheta = -(basin.lon * Math.PI) / 180 + Math.PI / 2;
    targetRotationRef.current = targetTheta;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#030c08] text-emerald-100 overflow-hidden select-none font-sans relative">
      {/* Top Holographic Mission Header */}
      <div className="h-14 bg-[#04160f]/90 border-b border-[#0b3825] px-6 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Globe className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '18s' }} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-emerald-300 tracking-wider">
                3D GREEN PLANETARY DIGITAL TWIN
              </span>
              <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-700/60">
                TACTICAL GIS RECON
              </span>
            </div>
            <div className="text-[10px] font-mono text-emerald-500/70">
              GEODETIC SPHERE WGS-84 • 3D SUBSURFACE OFFSET PROJECTION
            </div>
          </div>
        </div>

        {/* Tactical Status Readout */}
        <div className="hidden lg:flex items-center space-x-4 bg-[#021f14] px-4 py-1.5 rounded-lg border border-emerald-800/60 font-mono text-xs">
          <div>
            <span className="text-[9px] text-emerald-500/70 block leading-none">TARGET BASIN</span>
            <span className="text-amber-400 font-bold">Assam Shelf Block-4</span>
          </div>
          <div className="h-5 w-[1px] bg-emerald-800" />
          <div>
            <span className="text-[9px] text-emerald-500/70 block leading-none">ACTIVE RIG</span>
            <span className="text-emerald-300 font-bold">WELL-A-01 (3,420 m)</span>
          </div>
          <div className="h-5 w-[1px] bg-emerald-800" />
          <div>
            <span className="text-[9px] text-emerald-500/70 block leading-none">STRATIGRAPHY</span>
            <span className="text-cyan-300 font-bold">Barail Sandstone / XYZ</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('correlation')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-emerald-900/50 hover:bg-emerald-800/70 text-emerald-300 hover:text-white border border-emerald-700/60 text-xs font-mono transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Formation View</span>
          </button>
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 hover:text-white border border-blue-700/60 text-xs font-mono transition-all"
          >
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas & Side HUD Layout */}
      <div className="flex-1 flex overflow-hidden relative" ref={containerRef}>
        {/* Interactive 3D Green Canvas */}
        <div className="flex-1 relative cursor-grab active:cursor-grabbing">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-full h-full block"
          />

          {/* Interactive Floating Control Deck */}
          <div className="absolute bottom-5 left-6 flex items-center space-x-2 bg-[#041d13]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-800/70 shadow-[0_0_20px_rgba(4,29,19,0.7)] z-10">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-2 rounded-lg border transition-colors ${
                isRotating
                  ? 'bg-emerald-800 text-emerald-200 border-emerald-600'
                  : 'bg-emerald-950/60 text-emerald-500 border-emerald-800'
              }`}
              title={isRotating ? 'Pause Rotation' : 'Resume 3D Rotation'}
            >
              {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setZoomLevel((z) => Math.min(1.6, z + 0.15));
              }}
              className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setZoomLevel((z) => Math.max(0.6, z - 0.15));
              }}
              className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setZoomLevel(1.0);
                pitchAngleRef.current = 0.25;
                handleFocusBasin(basins[0]);
              }}
              className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
              title="Reset View to Target"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="h-6 w-[1px] bg-emerald-800 mx-1" />

            {/* Quick target button */}
            <button
              onClick={() => handleFocusBasin(basins[0])}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-mono font-semibold transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
            >
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>Lock WELL-A-01</span>
            </button>
          </div>

          {/* Top Left Layer Toggles Overlay */}
          <div className="absolute top-5 left-6 flex flex-wrap gap-2 z-10">
            <button
              onClick={() => setShowLandmass(!showLandmass)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                showLandmass
                  ? 'bg-emerald-900/70 text-emerald-200 border-emerald-500'
                  : 'bg-emerald-950/40 text-emerald-600 border-emerald-900'
              }`}
            >
              Landmass Matrix {showLandmass ? '✓' : ''}
            </button>
            <button
              onClick={() => setShowOrbitRings(!showOrbitRings)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                showOrbitRings
                  ? 'bg-emerald-900/70 text-emerald-200 border-emerald-500'
                  : 'bg-emerald-950/40 text-emerald-600 border-emerald-900'
              }`}
            >
              Orbital Rings {showOrbitRings ? '✓' : ''}
            </button>
            <button
              onClick={() => setShowRadarScan(!showRadarScan)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                showRadarScan
                  ? 'bg-emerald-900/70 text-emerald-200 border-emerald-500'
                  : 'bg-emerald-950/40 text-emerald-600 border-emerald-900'
              }`}
            >
              Radar Sweep {showRadarScan ? '✓' : ''}
            </button>
            <button
              onClick={() => setShowBasinNodes(!showBasinNodes)}
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                showBasinNodes
                  ? 'bg-emerald-900/70 text-emerald-200 border-emerald-500'
                  : 'bg-emerald-950/40 text-emerald-600 border-emerald-900'
              }`}
            >
              Basin Nodes {showBasinNodes ? '✓' : ''}
            </button>
          </div>
        </div>

        {/* Right Tactical Intelligence Drawer */}
        <aside className="w-80 lg:w-96 bg-[#04160f]/95 border-l border-[#0b3825] flex flex-col p-4 space-y-4 overflow-y-auto backdrop-blur-md z-20">
          <div className="flex items-center justify-between pb-3 border-b border-[#0b3825]">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-emerald-400" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-300">
                Basin Telemetry & Hazards
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              10 SITES
            </span>
          </div>

          {/* Active Basin Detail Card */}
          {selectedBasin && (
            <div className="bg-[#021f14] p-4 rounded-xl border border-emerald-600/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase">
                    {selectedBasin.country} • {selectedBasin.status}
                  </div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {selectedBasin.name}
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  selectedBasin.status === 'ACTIVE_TARGET'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                }`}>
                  {selectedBasin.status === 'ACTIVE_TARGET' ? 'LIVE DRILLING' : 'OFFSET BASIN'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-emerald-800/50">
                <div>
                  <span className="text-[10px] text-emerald-500/80 block">COORDINATES</span>
                  <span className="text-emerald-300">{selectedBasin.lat.toFixed(2)}°N, {selectedBasin.lon.toFixed(2)}°E</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-500/80 block">DEPTH WINDOW</span>
                  <span className="text-emerald-300">{selectedBasin.depthM.toLocaleString()} m TVD</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-500/80 block">KEY FORMATION</span>
                  <span className="text-amber-300 truncate block">{selectedBasin.formation}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-500/80 block">CORRELATED WELLS</span>
                  <span className="text-cyan-300">{selectedBasin.wellCount} Offset Wells</span>
                </div>
              </div>

              {/* Observed Geological Hazard */}
              <div className="bg-[#052e1f] p-2.5 rounded-lg border border-emerald-700/60">
                <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-semibold mb-1">
                  <Shield className="w-3 h-3 text-amber-400" />
                  PREDICTIVE HAZARD PROFILE
                </span>
                <p className="text-xs text-emerald-200 font-mono leading-relaxed">
                  {selectedBasin.hazards}
                </p>
              </div>

              {selectedBasin.status === 'ACTIVE_TARGET' && (
                <button
                  onClick={() => onNavigate('correlation')}
                  className="w-full flex items-center justify-center space-x-2 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md"
                >
                  <span>Launch Barail Sandstone Correlation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Quick Basin Selector List */}
          <div className="space-y-1.5 flex-1">
            <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider mb-2">
              Select Exploration Basin to Re-orient:
            </div>
            {basins.map((b) => (
              <button
                key={b.name}
                onClick={() => handleFocusBasin(b)}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all font-mono text-xs border ${
                  selectedBasin?.name === b.name
                    ? 'bg-emerald-900/60 border-emerald-500 text-white shadow-sm'
                    : 'bg-[#021810] border-emerald-900/80 text-emerald-300/80 hover:bg-emerald-950 hover:text-emerald-200'
                }`}
              >
                <div>
                  <div className="font-semibold truncate max-w-[200px]">{b.name}</div>
                  <div className="text-[10px] text-emerald-500/70">{b.country} • {b.formation}</div>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                  b.status === 'ACTIVE_TARGET'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-950 text-emerald-400'
                }`}>
                  {b.status === 'ACTIVE_TARGET' ? 'TARGET' : 'OFFSET'}
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
