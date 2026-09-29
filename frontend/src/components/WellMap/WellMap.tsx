import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import {
  Compass, Eye, FileText, Filter, Layers, MapPin,
  Search, Shield, Sliders, AlertTriangle
} from 'lucide-react';
import { Well } from '../../types';

interface WellMapProps {
  wells: Well[];
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
}

// Custom modern SVG icons for wells
const createWellIcon = (isActive: boolean, hasCriticalRisk: boolean, isSelected: boolean) => {
  const bgColor = isActive
    ? '#10b981' // emerald
    : hasCriticalRisk
    ? '#ef4444' // red
    : '#3b82f6'; // blue

  const borderColor = isSelected ? '#fbbf24' : '#ffffff';
  const size = isActive ? 34 : isSelected ? 32 : 26;

  const html = `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size}px;
      height: ${size}px;
      background: ${bgColor};
      border: 2px solid ${borderColor};
      border-radius: 50%;
      box-shadow: 0 0 12px ${bgColor}99;
      cursor: pointer;
    ">
      ${isActive ? '<div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>' : ''}
      ${isActive ? '<span style="position: absolute; top: -18px; background: #064e3b; color: #6ee7b7; font-size: 9px; font-weight: bold; padding: 1px 4px; border-radius: 3px; border: 1px solid #059669; font-family: monospace;">TARGET</span>' : ''}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-well-marker',
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

  const centerLat = activeWell ? activeWell.latitude : 27.5015;
  const centerLon = activeWell ? activeWell.longitude : 95.3540;

  // Filter wells
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

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#060e19]">
      {/* Map Control Toolbar */}
      <div className="bg-[#081525] border-b border-[#182944] px-5 py-3 flex flex-wrap items-center justify-between gap-3 z-10 shadow-sm">
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search well ID (e.g. WELL-B-03)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0d1d33] border border-[#1d3353] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-56 font-mono"
            />
          </div>

          {/* Radius Filter */}
          <div className="flex items-center space-x-1.5 bg-[#0d1d33] px-2.5 py-1.5 rounded-lg border border-[#1d3353] text-xs">
            <span className="text-slate-400 text-[11px] font-mono">Radius:</span>
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(Number(e.target.value))}
              className="bg-transparent text-blue-400 font-mono font-semibold focus:outline-none cursor-pointer"
            >
              <option value={3} className="bg-[#0d1d33] text-slate-200">3 km</option>
              <option value={5} className="bg-[#0d1d33] text-slate-200">5 km</option>
              <option value={10} className="bg-[#0d1d33] text-slate-200">10 km</option>
              <option value={15} className="bg-[#0d1d33] text-slate-200">15 km</option>
              <option value={99} className="bg-[#0d1d33] text-slate-200">All Basin</option>
            </select>
          </div>

          {/* Formation Filter */}
          <div className="flex items-center space-x-1.5 bg-[#0d1d33] px-2.5 py-1.5 rounded-lg border border-[#1d3353] text-xs">
            <span className="text-slate-400 text-[11px] font-mono">Formation:</span>
            <select
              value={formationFilter}
              onChange={(e) => setFormationFilter(e.target.value)}
              className="bg-transparent text-amber-400 font-mono font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#0d1d33] text-slate-200">All Formations</option>
              <option value="Barail" className="bg-[#0d1d33] text-slate-200">Barail Sandstone / XYZ</option>
              <option value="Kopili" className="bg-[#0d1d33] text-slate-200">Kopili Shale</option>
              <option value="Jaintia" className="bg-[#0d1d33] text-slate-200">Jaintia Limestone / ABC</option>
            </select>
          </div>

          {/* Event Filter */}
          <div className="flex items-center space-x-1.5 bg-[#0d1d33] px-2.5 py-1.5 rounded-lg border border-[#1d3353] text-xs">
            <span className="text-slate-400 text-[11px] font-mono">Incident Filter:</span>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-transparent text-red-400 font-mono font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#0d1d33] text-slate-200">All Events</option>
              <option value="MUD_LOSS" className="bg-[#0d1d33] text-slate-200">Mud Loss Events</option>
              <option value="TORQUE" className="bg-[#0d1d33] text-slate-200">Torque Surges</option>
              <option value="STUCK_PIPE" className="bg-[#0d1d33] text-slate-200">Stuck Pipe</option>
            </select>
          </div>

          <label className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer select-none pl-2">
            <input
              type="checkbox"
              checked={showCircles}
              onChange={(e) => setShowCircles(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0"
            />
            <span className="text-[11px] font-mono text-slate-400">Distance Rings</span>
          </label>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Visible: <strong className="text-white font-bold">{filteredWells.length}</strong> / {wells.length} wells
          </span>
          <div className="bg-slate-900/90 text-slate-400 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-400" />
            <span>Synthetic Demo Grid</span>
          </div>
        </div>
      </div>

      {/* Main Map + Side Inspector Drawer */}
      <div className="flex-1 relative flex">
        {/* Leaflet Map Container */}
        <div className="flex-1 h-full w-full">
          <MapContainer
            center={[centerLat, centerLon]}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', backgroundColor: '#07111e' }}
          >
            {/* OpenStreetMap Dark CartoDB basemap */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {/* Distance buffer circles centered on active well */}
            {showCircles && activeWell && (
              <>
                <Circle
                  center={[centerLat, centerLon]}
                  radius={3000}
                  pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.05, dashArray: '4, 4', weight: 1.5 }}
                />
                <Circle
                  center={[centerLat, centerLon]}
                  radius={5000}
                  pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.03, dashArray: '6, 6', weight: 1.5 }}
                />
                <Circle
                  center={[centerLat, centerLon]}
                  radius={10000}
                  pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.02, dashArray: '8, 8', weight: 1 }}
                />
              </>
            )}

            {/* Well Markers */}
            {filteredWells.map((well) => {
              const isActive = !!well.is_active;
              const hasCriticalRisk = ['WELL-B-03', 'WELL-E-11', 'WELL-D-02'].includes(well.id);
              const isSelected = selectedWell?.id === well.id;
              const icon = createWellIcon(isActive, hasCriticalRisk, isSelected);

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
                    <div className="p-1 space-y-2 min-w-[200px] text-xs">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                        <span className="font-mono font-bold text-blue-400 text-sm">{well.id}</span>
                        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {well.distance_km ? `${well.distance_km} km away` : 'TARGET RIG'}
                        </span>
                      </div>
                      <div className="space-y-1 font-mono text-[11px] text-slate-300">
                        <div>Depth: <strong className="text-white">{well.current_depth || well.total_depth}m</strong></div>
                        <div className="truncate">Formation: <span className="text-amber-300">{well.formation}</span></div>
                        <div>Status: <span className="text-emerald-400">{well.status}</span></div>
                        <div>Similarity: <strong className="text-blue-400">{Math.round((well.similarity_score || 0.8) * 100)}%</strong></div>
                      </div>

                      {well.id === 'WELL-B-03' && (
                        <div className="bg-red-950/70 border border-red-700/60 p-1.5 rounded text-[10px] text-red-200">
                          <strong>Historical Hazard:</strong> 48 bbl/hr mud loss at 3,440m (DDR-2024-017)
                        </div>
                      )}

                      <div className="pt-2 flex flex-col gap-1">
                        <button
                          onClick={() => {
                            onNavigate('explorer', well.id);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-2 rounded text-[11px] text-center"
                        >
                          Explore Well Profile
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('reports', well.id === 'WELL-B-03' ? 'DOC-DDR-2024-017' : undefined);
                          }}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 px-2 rounded text-[11px] text-center"
                        >
                          View Reports
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Selected Well Inspector Drawer (Right overlay) */}
        {selectedWell && (
          <div className="w-80 bg-[#081525]/95 backdrop-blur-md border-l border-[#1a2d48] p-5 flex flex-col justify-between overflow-y-auto z-20 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-mono font-bold text-lg text-white">{selectedWell.id}</h3>
                    {selectedWell.is_active && (
                      <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-emerald-700">
                        ACTIVE TARGET
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{selectedWell.well_name}</p>
                </div>
                <button
                  onClick={() => setSelectedWell(null)}
                  className="text-slate-400 hover:text-white text-sm p-1"
                >
                  ✕
                </button>
              </div>

              {/* Coordinates & Proximity */}
              <div className="bg-[#0d1d33] p-3 rounded-lg border border-[#1a2d48] space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Distance to Target:</span>
                  <span className="text-blue-400 font-bold">{selectedWell.distance_km ? `${selectedWell.distance_km} km` : '0.0 km'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Similarity Metric:</span>
                  <span className="text-emerald-400 font-bold">{Math.round((selectedWell.similarity_score || 0.8) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Depth:</span>
                  <span className="text-slate-200">{selectedWell.total_depth} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Depth:</span>
                  <span className="text-slate-200">{selectedWell.current_depth || selectedWell.total_depth} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Formation:</span>
                  <span className="text-amber-300 text-right truncate max-w-[150px]">{selectedWell.formation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Field Sector:</span>
                  <span className="text-slate-300">{selectedWell.field}</span>
                </div>
              </div>

              {/* Major Historical Incidents */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider block">
                  Identified Historical Hazards
                </span>
                {selectedWell.id === 'WELL-B-03' ? (
                  <div className="bg-red-950/40 border border-red-800/60 p-3 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-red-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Severe Mud Loss (48 bbl/hr)</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Occurred at 3,440m in Barail Sandstone / XYZ. Required 50 bbl engineered CaCO3/mica LCM pill.
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-red-900/40">
                      Source: DDR-2024-017 (Page 4)
                    </div>
                  </div>
                ) : selectedWell.id === 'WELL-C-07' ? (
                  <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Severe Torque Surge & Stick-Slip</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      At 3,390m depth. Peak torque 28.2 kft-lbs. Pumped polymer bead pill and altered rotary speed.
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-amber-900/40">
                      Source: DDR-2023-112 (Page 3)
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-lg text-xs text-slate-400">
                    Routine offset well with historical logging intervals available in repository.
                  </div>
                )}
              </div>
            </div>

            {/* Direct Action Buttons matching Section 6 */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => onNavigate('explorer', selectedWell.id)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-xs shadow transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Well</span>
              </button>
              <button
                onClick={() => onNavigate('knowledge', selectedWell.id)}
                className="w-full flex items-center justify-center space-x-2 bg-[#12233b] hover:bg-[#182f50] text-slate-200 font-medium py-2 rounded-lg text-xs border border-slate-700 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View Historical Events</span>
              </button>
              <button
                onClick={() => onNavigate('reports', selectedWell.id === 'WELL-B-03' ? 'DOC-DDR-2024-017' : undefined)}
                className="w-full flex items-center justify-center space-x-2 bg-[#12233b] hover:bg-[#182f50] text-slate-200 font-medium py-2 rounded-lg text-xs border border-slate-700 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Reports</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
