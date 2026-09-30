import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Compass, Eye, FileText, Filter, Layers, MapPin,
  Search, Shield, Sliders, AlertTriangle, Crosshair,
  Radio, Globe, Satellite, Maximize2, RotateCcw
} from 'lucide-react';
import { Well } from '../../types';

interface WellMapProps {
  wells: Well[];
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
}

// Map recentering helper component
const MapRecenterController: React.FC<{
  center: [number, number];
  zoom: number;
  trigger: number;
  wells: Well[];
  flyTarget?: { center: [number, number]; zoom: number; id: number } | null;
}> = ({ center, zoom, trigger, wells, flyTarget }) => {
  const map = useMap();

  React.useEffect(() => {
    // Force Leaflet to recalculate container bounds and zoom into the actual field location
    map.invalidateSize();
    map.setView(center, zoom, { animate: false });

    const timers = [
      setTimeout(() => {
        map.invalidateSize();
        map.setView(center, zoom, { animate: true });
      }, 60),
      setTimeout(() => {
        map.invalidateSize();
        if (wells && wells.length > 0) {
          const bounds = L.latLngBounds(wells.map((w) => [w.latitude, w.longitude]));
          map.fitBounds(bounds.pad(0.18), { maxZoom: 13, animate: true });
        } else {
          map.setView(center, zoom, { animate: true });
        }
      }, 250),
      setTimeout(() => {
        map.invalidateSize();
      }, 600)
    ];

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [map, center[0], center[1], zoom, wells.length]);

  React.useEffect(() => {
    if (trigger > 0) {
      map.invalidateSize();
      map.flyTo(center, zoom, { duration: 1.0 });
    }
  }, [trigger, center, zoom, map]);

  React.useEffect(() => {
    if (flyTarget) {
      map.invalidateSize();
      map.flyTo(flyTarget.center, flyTarget.zoom, { duration: 1.0 });
    }
  }, [flyTarget, map]);

  return null;
};

// Custom tactical SVG icons for wells
const createTacticalWellIcon = (
  wellId: string,
  isActive: boolean,
  hasCriticalRisk: boolean,
  isSelected: boolean
) => {
  const size = isActive ? 36 : isSelected ? 32 : 24;

  let markerContent = '';

  if (isActive) {
    markerContent = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; cursor: pointer;">
        <div style="position: absolute; width: 44px; height: 44px; border: 2px solid #10b981; border-radius: 50%; opacity: 0.8;" class="animate-marker-radar"></div>
        <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #059669, #10b981); border: 2px solid #a7f3d0; border-radius: 50%; box-shadow: 0 0 18px rgba(16,185,129,0.9); display: flex; align-items: center; justify-content: center;">
          <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
        </div>
        <div style="position: absolute; top: -24px; white-space: nowrap; background: rgba(6,78,59,0.95); color: #6ee7b7; border: 1px solid #10b981; font-family: monospace; font-size: 10px; font-weight: bold; padding: 2px 7px; border-radius: 4px; box-shadow: 0 0 10px rgba(16,185,129,0.6);">
          TARGET: ${wellId}
        </div>
      </div>
    `;
  } else if (hasCriticalRisk) {
    markerContent = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; cursor: pointer;">
        <div style="position: absolute; width: 38px; height: 38px; border: 2px solid #ef4444; border-radius: 50%; opacity: 0.7;" class="animate-ping"></div>
        <div style="width: 22px; height: 22px; background: linear-gradient(135deg, #b91c1c, #ef4444); border: 2px solid ${isSelected ? '#fbbf24' : '#fecaca'}; border-radius: 50%; box-shadow: 0 0 14px rgba(239,68,68,0.9); display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; background: #ffffff; border-radius: 50%;"></div>
        </div>
        <div style="position: absolute; top: -20px; white-space: nowrap; background: rgba(127,29,29,0.95); color: #fca5a5; border: 1px solid #ef4444; font-family: monospace; font-size: 9px; font-weight: bold; padding: 1px 5px; border-radius: 4px; box-shadow: 0 0 8px rgba(239,68,68,0.6);">
          HAZARD
        </div>
      </div>
    `;
  } else {
    markerContent = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; cursor: pointer;">
        <div style="width: 18px; height: 18px; background: linear-gradient(135deg, #0284c7, #38bdf8); border: 2px solid ${isSelected ? '#fbbf24' : '#bae6fd'}; border-radius: 50%; box-shadow: 0 0 10px rgba(56,189,248,0.7); display: flex; align-items: center; justify-content: center;">
          <div style="width: 4px; height: 4px; background: #ffffff; border-radius: 50%;"></div>
        </div>
      </div>
    `;
  }

  return L.divIcon({
    html: markerContent,
    className: 'tactical-well-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

export const WellMap: React.FC<WellMapProps> = ({ wells, activeWell, onNavigate }) => {
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusFilter, setRadiusFilter] = useState<number>(15);
  const [formationFilter, setFormationFilter] = useState('ALL');
  const [eventFilter, setEventFilter] = useState('ALL');
  const [showCircles, setShowCircles] = useState(true);

  // Basemap style toggle: 'tactical' (dark GIS) | 'satellite' (high-res earth) | 'cyber' (deep navy grid)
  const [mapStyle, setMapStyle] = useState<'tactical' | 'satellite' | 'cyber'>('tactical');
  const [recenterCount, setRecenterCount] = useState(0);

  const centerLat = activeWell ? activeWell.latitude : 27.5015;
  const centerLon = activeWell ? activeWell.longitude : 95.3540;

  // Filter wells based on search, radius, formation, and historical event filters
  const filteredWells = useMemo(() => {
    return wells.filter((w) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = w.id.toLowerCase().includes(q) || w.well_name.toLowerCase().includes(q);
        if (!matchName) return false;
      }
      if (radiusFilter !== 99 && (w.distance_km || 0) > radiusFilter) {
        return false;
      }
      if (formationFilter !== 'ALL' && !w.formation.toLowerCase().includes(formationFilter.toLowerCase())) {
        return false;
      }
      if (eventFilter === 'MUD_LOSS' && !['WELL-B-03', 'WELL-E-11', 'WELL-I-04', 'WELL-N-02'].includes(w.id)) {
        return false;
      }
      if (eventFilter === 'TORQUE' && !['WELL-C-07', 'WELL-H-14'].includes(w.id)) {
        return false;
      }
      if (eventFilter === 'STUCK_PIPE' && !['WELL-D-02', 'WELL-G-09'].includes(w.id)) {
        return false;
      }
      return true;
    });
  }, [wells, searchQuery, radiusFilter, formationFilter, eventFilter]);

  // Determine basemap configuration without API keys or watermarks
  const basemapConfig = useMemo(() => {
    if (mapStyle === 'satellite') {
      return {
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        className: 'satellite-tiles',
        attribution: '&copy; Esri, Maxar, Earthstar Geographics | KAVAAI-NWIS'
      };
    }
    if (mapStyle === 'cyber') {
      return {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        className: 'cyber-grid-tiles',
        attribution: '&copy; OpenStreetMap | KAVAAI Cyber Grid'
      };
    }
    // Default 'tactical' dark GIS
    return {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      className: 'tactical-dark-tiles',
      attribution: '&copy; OpenStreetMap contributors | KAVAAI-NWIS GIS'
    };
  }, [mapStyle]);

  const [flyTarget, setFlyTarget] = useState<{ center: [number, number]; zoom: number; id: number } | null>(null);

  const handleRecenter = () => {
    setRecenterCount((prev) => prev + 1);
  };

  const handleFocusTarget = () => {
    setFlyTarget({ center: [centerLat, centerLon], zoom: 13.5, id: Date.now() });
  };

  const handleFitAllWells = () => {
    setFlyTarget({ center: [centerLat, centerLon], zoom: 11.5, id: Date.now() });
  };

  const handleFocusDangerZone = () => {
    setFlyTarget({ center: [27.510, 95.362], zoom: 14, id: Date.now() });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#040a14] relative">
      {/* Map Control Toolbar */}
      <div className="bg-[#071322] border-b border-[#142d4a] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-20 shadow-md">
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search well ID (e.g. WELL-B)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#050f1d] border border-[#143354] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 w-52"
            />
          </div>

          {/* Radius Filter */}
          <div className="flex items-center space-x-1.5 bg-[#050f1d] px-2.5 py-1 rounded-lg border border-[#143354] text-xs">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px] font-mono text-slate-400">Radius:</span>
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(Number(e.target.value))}
              className="bg-transparent text-cyan-300 font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value={5} className="bg-[#071322] text-slate-200">5 km</option>
              <option value={10} className="bg-[#071322] text-slate-200">10 km</option>
              <option value={15} className="bg-[#071322] text-slate-200">15 km</option>
              <option value={25} className="bg-[#071322] text-slate-200">25 km</option>
              <option value={99} className="bg-[#071322] text-slate-200">All Wells</option>
            </select>
          </div>

          {/* Formation Filter */}
          <div className="flex items-center space-x-1.5 bg-[#050f1d] px-2.5 py-1 rounded-lg border border-[#143354] text-xs">
            <Layers className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-mono text-slate-400">Formation:</span>
            <select
              value={formationFilter}
              onChange={(e) => setFormationFilter(e.target.value)}
              className="bg-transparent text-amber-300 font-mono text-xs focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              <option value="ALL" className="bg-[#071322] text-slate-200">All Formations</option>
              <option value="Barail" className="bg-[#071322] text-slate-200">Barail Sandstone</option>
              <option value="Tipam" className="bg-[#071322] text-slate-200">Tipam Sandstone</option>
              <option value="Kopili" className="bg-[#071322] text-slate-200">Kopili Shale</option>
              <option value="Girujan" className="bg-[#071322] text-slate-200">Girujan Clay</option>
            </select>
          </div>

          {/* Hazard Filter */}
          <div className="flex items-center space-x-1.5 bg-[#050f1d] px-2.5 py-1 rounded-lg border border-[#143354] text-xs">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-[11px] font-mono text-slate-400">Incidents:</span>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-transparent text-red-300 font-mono text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#071322] text-slate-200">All Events</option>
              <option value="MUD_LOSS" className="bg-[#071322] text-slate-200">Mud Losses</option>
              <option value="TORQUE" className="bg-[#071322] text-slate-200">Torque Surges</option>
              <option value="STUCK_PIPE" className="bg-[#071322] text-slate-200">Stuck Pipe</option>
            </select>
          </div>

          {/* Distance Rings Toggle */}
          <label className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer select-none pl-1">
            <input
              type="checkbox"
              checked={showCircles}
              onChange={(e) => setShowCircles(e.target.checked)}
              className="rounded bg-[#050f1d] border-[#143354] text-cyan-500 focus:ring-0"
            />
            <span className="text-[11px] font-mono text-slate-400">Range Rings</span>
          </label>
        </div>

        {/* Right Controls: Basemap Modes & Stats */}
        <div className="flex items-center space-x-3">
          {/* Basemap Switcher */}
          <div className="flex items-center bg-[#050f1d] p-0.5 rounded-lg border border-[#143354] font-mono text-[10px]">
            <button
              onClick={() => setMapStyle('tactical')}
              className={`px-2 py-1 rounded flex items-center space-x-1 transition-all ${
                mapStyle === 'tactical'
                  ? 'bg-[#0f2c4d] text-cyan-300 font-bold border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dark Tactical GIS View"
            >
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>TACTICAL</span>
            </button>

            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-1 rounded flex items-center space-x-1 transition-all ${
                mapStyle === 'satellite'
                  ? 'bg-[#0f2c4d] text-emerald-300 font-bold border border-emerald-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="High-Resolution Satellite Terrain"
            >
              <Satellite className="w-3 h-3 text-emerald-400" />
              <span>SATELLITE</span>
            </button>

            <button
              onClick={() => setMapStyle('cyber')}
              className={`px-2 py-1 rounded flex items-center space-x-1 transition-all ${
                mapStyle === 'cyber'
                  ? 'bg-[#0f2c4d] text-purple-300 font-bold border border-purple-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Deep Cyber Radar Grid"
            >
              <Globe className="w-3 h-3 text-purple-400" />
              <span>CYBER</span>
            </button>
          </div>

          {/* Re-center Button */}
          <button
            onClick={handleRecenter}
            className="p-1.5 rounded-lg bg-[#0a1e33] hover:bg-[#12365a] border border-[#143d68] text-cyan-300 hover:text-white transition-colors"
            title="Re-center on Target Well (WELL-A-01)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Wells Count */}
          <div className="bg-[#050f1d] px-2.5 py-1 rounded-lg border border-[#143354] font-mono text-[11px] text-slate-300">
            Visible: <span className="text-cyan-400 font-bold">{filteredWells.length}</span> / {wells.length}
          </div>
        </div>
      </div>

      {/* Main Map + Side Inspector Drawer */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Leaflet Map Container */}
        <div className="flex-1 h-full w-full relative">
          {/* Tactical Geospatial Location HUD Overlay */}
          <div className="absolute top-4 left-4 z-[400] flex flex-col space-y-1 bg-[#051120]/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.3)] font-mono pointer-events-auto">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-white tracking-wide">
                UPPER ASSAM DRILLING BASIN // BLOCK-4
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700">
                ACTIVE FIELD
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              Datum: WGS-84 • Field Center: <span className="text-emerald-400 font-bold">{centerLat.toFixed(4)}° N, {centerLon.toFixed(4)}° E</span>
            </div>
            <div className="flex items-center space-x-1.5 pt-1 text-[10px]">
              <button
                onClick={handleFocusTarget}
                className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/70 font-semibold transition-all shadow-sm"
                title="Zoom directly to WELL-A-01"
              >
                🎯 Target (WELL-A-01)
              </button>
              <button
                onClick={handleFitAllWells}
                className="px-2.5 py-1 rounded bg-[#0b2444] hover:bg-[#133766] text-cyan-200 border border-cyan-600/70 font-semibold transition-all shadow-sm"
                title="Fit full 15 km drilling basin"
              >
                📍 15km Field Basin
              </button>
              <button
                onClick={handleFocusDangerZone}
                className="px-2.5 py-1 rounded bg-red-950 hover:bg-red-900 text-red-200 border border-red-600/70 font-semibold transition-all shadow-sm"
                title="Zoom to 3 km offset incident hazard corridor"
              >
                ⚠️ 3km Hazard Ring
              </button>
            </div>
          </div>

          <MapContainer
            center={[centerLat, centerLon]}
            zoom={12.5}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', backgroundColor: '#040b15' }}
          >
            <MapRecenterController
              center={[centerLat, centerLon]}
              zoom={12.5}
              trigger={recenterCount}
              wells={wells}
              flyTarget={flyTarget}
            />

            {/* Custom Dynamic Basemap Layer (Zero watermarks, high contrast) */}
            <TileLayer
              attribution={basemapConfig.attribution}
              url={basemapConfig.url}
              className={basemapConfig.className}
            />

            {/* Distance buffer circles centered on active well with distinct industrial styling */}
            {showCircles && (
              <>
                {/* 3 km Immediate Offset Zone */}
                <Circle
                  center={[centerLat, centerLon]}
                  radius={3000}
                  pathOptions={{
                    color: '#22d3ee',
                    fillColor: '#22d3ee',
                    fillOpacity: 0.05,
                    dashArray: '4, 4',
                    weight: 1.5
                  }}
                />
                {/* 5 km Lithology Boundary */}
                <Circle
                  center={[centerLat, centerLon]}
                  radius={5000}
                  pathOptions={{
                    color: '#818cf8',
                    fillColor: '#818cf8',
                    fillOpacity: 0.035,
                    dashArray: '6, 6',
                    weight: 1.5
                  }}
                />
                {/* 10 km Regional Buffer */}
                <Circle
                  center={[centerLat, centerLon]}
                  radius={10000}
                  pathOptions={{
                    color: '#f59e0b',
                    fillColor: '#f59e0b',
                    fillOpacity: 0.02,
                    dashArray: '8, 8',
                    weight: 1.2
                  }}
                />
                {/* 15 km Exploration Basin Limit */}
                <Circle
                  center={[centerLat, centerLon]}
                  radius={15000}
                  pathOptions={{
                    color: '#ec4899',
                    fillColor: '#ec4899',
                    fillOpacity: 0.015,
                    dashArray: '10, 10',
                    weight: 1
                  }}
                />
              </>
            )}

            {/* Well Markers */}
            {filteredWells.map((well) => {
              const isActive = !!well.is_active;
              const hasCriticalRisk = ['WELL-B-03', 'WELL-E-11', 'WELL-D-02'].includes(well.id);
              const isSelected = selectedWell?.id === well.id;
              const icon = createTacticalWellIcon(well.id, isActive, hasCriticalRisk, isSelected);

              return (
                <Marker
                  key={well.id}
                  position={[well.latitude, well.longitude]}
                  icon={icon}
                  eventHandlers={{
                    click: () => {
                      setSelectedWell(well);
                    },
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-2 min-w-[210px] text-xs font-sans">
                      <div className="flex items-center justify-between border-b border-[#1b3b5f] pb-1.5">
                        <span className="font-mono font-bold text-cyan-400 text-sm">{well.id}</span>
                        <span className="text-[10px] font-mono bg-[#091f38] text-amber-300 border border-amber-600/50 px-1.5 py-0.5 rounded">
                          {well.distance_km ? `${well.distance_km} km away` : 'TARGET RIG'}
                        </span>
                      </div>

                      <div className="space-y-1 font-mono text-[11px] text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Depth:</span>
                          <strong className="text-white">{well.current_depth || well.total_depth}m</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Formation:</span>
                          <span className="text-amber-300 font-semibold truncate max-w-[120px]">{well.formation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Drill Status:</span>
                          <span className="text-emerald-400 font-semibold">{well.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Similarity:</span>
                          <strong className="text-cyan-400">{Math.round((well.similarity_score || 0.8) * 100)}%</strong>
                        </div>
                      </div>

                      {well.id === 'WELL-B-03' && (
                        <div className="bg-red-950/80 border border-red-600/60 p-1.5 rounded text-[10px] text-red-200 font-mono">
                          <strong>CRITICAL INCIDENT:</strong> 48 bbl/hr mud loss in Barail Sandstone
                        </div>
                      )}

                      <div className="pt-2 flex flex-col gap-1.5 font-mono">
                        <button
                          onClick={() => onNavigate('explorer', well.id)}
                          className="w-full bg-[#0a2747] hover:bg-[#103a68] border border-cyan-500/60 text-cyan-200 font-bold py-1.5 px-2 rounded text-[11px] text-center transition-colors"
                        >
                          OPEN WELL PROFILE
                        </button>
                        <button
                          onClick={() => onNavigate('reports', well.id === 'WELL-B-03' ? 'DOC-DDR-2024-017' : undefined)}
                          className="w-full bg-[#061424] hover:bg-[#0b213b] border border-[#14385e] text-slate-300 py-1 px-2 rounded text-[10px] text-center transition-colors"
                        >
                          INSPECT WCR / DDR
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Tactical GIS Compass / North Indicator Overlay (Top Right of Map) */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:flex flex-col items-center bg-[#071321]/90 backdrop-blur-md border border-[#143354] rounded-xl p-2.5 text-center shadow-lg font-mono">
            <div className="relative w-8 h-8 rounded-full border border-cyan-500/40 flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span className="absolute -top-1.5 font-bold text-[9px] text-amber-400">N</span>
            </div>
            <span className="text-[9px] text-slate-400 mt-1">GRID N</span>
          </div>

          {/* Bottom Left Tactical Telemetry HUD Strip */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none hidden md:flex items-center space-x-3 bg-[#071321]/90 backdrop-blur-md border border-[#143354] rounded-xl px-3 py-2 text-xs font-mono shadow-xl">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-bold">LAT: 27.5015° N</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300 font-bold">LON: 95.3540° E</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">DEPTH: 3,420m (±150m)</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">BASIN: ASSAM SHELF</span>
          </div>

          {/* Range Legend Overlay (Bottom Right of Map) */}
          {showCircles && (
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none hidden sm:flex items-center space-x-3 bg-[#071321]/90 backdrop-blur-md border border-[#143354] rounded-lg px-3 py-1.5 text-[10px] font-mono shadow-lg">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full border border-cyan-400 bg-cyan-400/20" />
                <span className="text-cyan-300">3km</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full border border-indigo-400 bg-indigo-400/20" />
                <span className="text-indigo-300">5km</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-amber-400/20" />
                <span className="text-amber-300">10km</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full border border-pink-400 bg-pink-400/20" />
                <span className="text-pink-300">15km</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Well Inspector Drawer (Right overlay) */}
        {selectedWell && (
          <div className="w-80 bg-[#071321]/98 backdrop-blur-md border-l border-[#143354] p-5 flex flex-col justify-between overflow-y-auto z-30 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#143354] pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-mono font-bold text-lg text-white">{selectedWell.id}</h3>
                    {selectedWell.is_active ? (
                      <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-emerald-700">
                        TARGET RIG
                      </span>
                    ) : (
                      <span className="bg-blue-950 text-cyan-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-cyan-700">
                        OFFSET WELL
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">{selectedWell.well_name}</p>
                </div>
                <button
                  onClick={() => setSelectedWell(null)}
                  className="text-slate-400 hover:text-white text-sm p-1 rounded hover:bg-slate-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Coordinates & Proximity */}
              <div className="bg-[#050f1d] p-3 rounded-xl border border-[#143354] space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Radial Offset:</span>
                  <span className="text-cyan-400 font-bold">{selectedWell.distance_km ? `${selectedWell.distance_km} km` : '0.0 km (Target)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Geological Similarity:</span>
                  <span className="text-emerald-400 font-bold">{Math.round((selectedWell.similarity_score || 0.8) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Depth:</span>
                  <span className="text-slate-100 font-semibold">{selectedWell.current_depth || selectedWell.total_depth} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Depth (TD):</span>
                  <span className="text-slate-100">{selectedWell.total_depth} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stratigraphic Zone:</span>
                  <span className="text-amber-300 font-semibold text-right truncate max-w-[140px]">{selectedWell.formation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Basin Sector:</span>
                  <span className="text-slate-300">{selectedWell.field}</span>
                </div>
              </div>

              {/* Major Historical Incidents */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider block">
                  Historical Hazard Incidents
                </span>
                {selectedWell.id === 'WELL-B-03' ? (
                  <div className="bg-red-950/50 border border-red-600/70 p-3 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-red-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Severe Mud Loss (48 bbl/hr)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                      Occurred at 3,440m in Barail Sandstone / XYZ. Required 50 bbl engineered CaCO3/mica LCM pill.
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-red-900/40">
                      Traceability: DDR-2024-017 (Page 4)
                    </div>
                  </div>
                ) : selectedWell.id === 'WELL-C-07' ? (
                  <div className="bg-amber-950/50 border border-amber-600/70 p-3 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Severe Torque Surge & Stick-Slip</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                      At 3,390m depth. Peak torque 28.2 kft-lbs. Pumped polymer bead pill and altered rotary speed.
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-amber-900/40">
                      Traceability: DDR-2023-112 (Page 3)
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#050f1d] border border-[#143354] p-3 rounded-xl text-xs text-slate-400 font-mono">
                    Routine offset well with historical logging intervals available in repository.
                  </div>
                )}
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="pt-4 border-t border-[#143354] space-y-2 font-mono">
              <button
                onClick={() => onNavigate('explorer', selectedWell.id)}
                className="w-full flex items-center justify-center space-x-2 bg-[#0a2747] hover:bg-[#103a68] border border-cyan-500/60 text-cyan-200 font-bold py-2 rounded-xl text-xs shadow-md transition-all"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>EXPLORE WELL PROFILE</span>
              </button>
              <button
                onClick={() => onNavigate('correlation')}
                className="w-full flex items-center justify-center space-x-2 bg-[#050f1d] hover:bg-[#0c2038] text-slate-200 font-medium py-2 rounded-xl text-xs border border-[#143354] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>FORMATION CORRELATION</span>
              </button>
              <button
                onClick={() => onNavigate('reports', selectedWell.id === 'WELL-B-03' ? 'DOC-DDR-2024-017' : undefined)}
                className="w-full flex items-center justify-center space-x-2 bg-[#050f1d] hover:bg-[#0c2038] text-slate-200 font-medium py-2 rounded-xl text-xs border border-[#143354] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>VIEW WCR / DDR REPORTS</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
