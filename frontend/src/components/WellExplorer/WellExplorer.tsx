import React, { useState, useEffect } from 'react';
import {
  Compass, FileText, Activity, Layers, GitCompare,
  Calendar, MapPin, Gauge, Shield, ArrowRight, Eye, AlertTriangle
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, AreaChart, Area
} from 'recharts';
import { Well, TrajectoryPoint, DrillingEvent, DocumentMetadata, Formation } from '../../types';
import { api } from '../../api/client';

interface WellExplorerProps {
  wells: Well[];
  selectedWellId?: string;
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
}

export const WellExplorer: React.FC<WellExplorerProps> = ({
  wells,
  selectedWellId = 'WELL-B-03',
  activeWell,
  onNavigate
}) => {
  const [currentWellId, setCurrentWellId] = useState(selectedWellId || 'WELL-B-03');
  const [activeTab, setActiveTab] = useState<'overview' | 'trajectory' | 'events' | 'formation' | 'reports' | 'comparison'>('overview');
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const [events, setEvents] = useState<DrillingEvent[]>([]);
  const [reports, setReports] = useState<DocumentMetadata[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedWellId && selectedWellId !== currentWellId) {
      setCurrentWellId(selectedWellId);
    }
  }, [selectedWellId]);

  const currentWell = wells.find((w) => w.id === currentWellId) || wells[1] || wells[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      api.getWellTrajectory(currentWellId),
      api.getWellEvents(currentWellId),
      api.getWellReports(currentWellId),
      api.getFormations()
    ])
      .then(([trajData, evData, repData, fmtData]) => {
        if (!isMounted) return;
        setTrajectory(trajData);
        setEvents(evData);
        setReports(repData);
        setFormations(fmtData);
      })
      .catch((err) => console.error('Failed to load well explorer data:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentWellId]);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Top Header & Well Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold font-mono text-white">{currentWell?.id}</h1>
              {currentWell?.is_active ? (
                <span className="bg-emerald-950 text-emerald-300 font-mono text-xs px-2 py-0.5 rounded border border-emerald-700">
                  ACTIVE TARGET WELL
                </span>
              ) : (
                <span className="bg-blue-950 text-blue-300 font-mono text-xs px-2 py-0.5 rounded border border-blue-700">
                  OFFSET WELL ({currentWell?.distance_km} km away)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentWell?.well_name} • {currentWell?.field}</p>
          </div>
        </div>

        {/* Switch Well Dropdown */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">Select Well:</span>
          <select
            value={currentWellId}
            onChange={(e) => setCurrentWellId(e.target.value)}
            className="bg-[#0b1728] border border-[#1b2d48] rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono font-semibold focus:outline-none focus:border-blue-500"
          >
            {wells.map((w) => (
              <option key={w.id} value={w.id} className="bg-[#0b1728]">
                {w.id} {w.is_active ? '(ACTIVE)' : `(${w.distance_km} km)`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs navigation matching Section 7 */}
      <div className="flex items-center space-x-2 border-b border-[#182944] pb-2 text-xs font-medium">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'trajectory', label: 'Trajectory' },
          { id: 'events', label: `Drilling Events (${events.length})` },
          { id: 'formation', label: 'Stratigraphy' },
          { id: 'reports', label: `Reports (${reports.length})` },
          { id: 'comparison', label: 'Active Well Comparison' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg font-mono transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white font-semibold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1829]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Well Metadata & Operations
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Well ID:</span>
                <span className="font-mono font-bold text-white">{currentWell?.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Operator:</span>
                <span className="text-slate-200">{currentWell?.operator}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Field / Basin:</span>
                <span className="text-slate-200">{currentWell?.field}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Current Status:</span>
                <span className="font-mono text-emerald-400 font-bold">{currentWell?.status}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Spud Date:</span>
                <span className="font-mono text-slate-300">{currentWell?.spud_date}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Total Measured Depth:</span>
                <span className="font-mono text-blue-400 font-bold">{currentWell?.total_depth} m</span>
              </div>
            </div>
          </div>

          <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Geographic & Spatial Position
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Surface Latitude:</span>
                <span className="font-mono text-slate-200">{currentWell?.latitude.toFixed(5)}° N</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Surface Longitude:</span>
                <span className="font-mono text-slate-200">{currentWell?.longitude.toFixed(5)}° E</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Offset Distance to WELL-A-01:</span>
                <span className="font-mono text-blue-400 font-bold">{currentWell?.distance_km} km</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Stratigraphic Similarity:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {Math.round((currentWell?.similarity_score || 0.8) * 100)}%
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Current Penetrated Formation:</span>
                <span className="text-amber-300 font-medium">{currentWell?.formation}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              Quick Intelligence Summary
            </h3>
            {currentWell?.id === 'WELL-B-03' ? (
              <div className="bg-red-950/30 border border-red-800/50 p-3.5 rounded-lg space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-red-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>High Mud Loss Incident at 3,440m</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  While drilling 12-1/4 inch section in Barail Sandstone, experienced total fluid loss of 48 bbl/hr. Pushed 50 bbl heavy LCM pill.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">Report: DDR-2024-017</span>
                  <button
                    onClick={() => onNavigate('reports', 'DOC-DDR-2024-017')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Open Report →
                  </button>
                </div>
              </div>
            ) : currentWell?.id === 'WELL-C-07' ? (
              <div className="bg-amber-950/30 border border-amber-800/50 p-3.5 rounded-lg space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Torque Surging at 3,390m</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Stick-slip index spiked above 85% with 28.2 kft-lbs torque. Required copolymer lubricity sweep.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">Report: DDR-2023-112</span>
                  <button
                    onClick={() => onNavigate('reports', 'DOC-DDR-2023-112')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Open Report →
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#0e1c31] border border-[#1b2d48] p-3.5 rounded-lg text-xs text-slate-300 space-y-2">
                <p>Routine offset well with historical data indexed in the RAG knowledge repository.</p>
                <div className="text-[11px] text-slate-400">
                  Total indexed historical events: <strong className="text-white">{events.length}</strong>
                </div>
              </div>
            )}

            <button
              onClick={() => onNavigate('copilot')}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span>Ask Copilot About This Well</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Trajectory Tab */}
      {activeTab === 'trajectory' && (
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 font-mono">Borehole Depth Trajectory Profile</h3>
              <p className="text-xs text-slate-400">Measured Depth (MD) vs True Vertical Depth (TVD) & Inclination Survey</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>TVD (m)</span>
              </span>
              <span className="flex items-center space-x-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Inclination (deg)</span>
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectory}>
                <defs>
                  <linearGradient id="tvdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#182944" />
                <XAxis dataKey="md" stroke="#64748b" label={{ value: 'Measured Depth MD (m)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" label={{ value: 'True Vertical Depth TVD (m)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091524', borderColor: '#1e3a5f', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="tvd" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#tvdGrad)" />
                <Line type="monotone" dataKey="inclination" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Drilling Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 font-mono">Historical Drilling Events</h3>
              <p className="text-xs text-slate-400">Recorded downhole incidents and operations during drilling of {currentWell?.id}</p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
              {events.length} Historical Records
            </span>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#0c182b] hover:bg-[#10223b] p-4 rounded-xl border border-[#172b47] space-y-2.5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-emerald-400 font-bold text-sm">{evt.depth} m</span>
                    <span className="text-white font-semibold text-sm">{evt.event_type}</span>
                    <span className="text-amber-300 font-mono text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                      {evt.formation}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-slate-400 text-[11px]">{evt.date}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        evt.severity === 'CRITICAL'
                          ? 'bg-red-700 text-white'
                          : evt.severity === 'HIGH'
                          ? 'bg-red-600 text-white'
                          : evt.severity === 'MEDIUM'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {evt.severity}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-[#091322] p-2.5 rounded border border-[#15273f]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Action Taken:</span>
                    <span className="text-slate-300">{evt.action_taken}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Outcome:</span>
                    <span className="text-emerald-400">{evt.outcome}</span>
                  </div>
                </div>

                {evt.document_id && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] font-mono text-slate-400">
                      Document Source: <strong className="text-blue-300">{evt.document_id}</strong> (Page {evt.page_number || 1})
                    </span>
                    <button
                      onClick={() => onNavigate('reports', evt.document_id)}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Source Report</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formation Stratigraphy Tab */}
      {activeTab === 'formation' && (
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 font-mono">Stratigraphic Formation Breakdown</h3>
            <p className="text-xs text-slate-400">Lithostratigraphy column and hazard profile across the well depth</p>
          </div>

          <div className="space-y-3">
            {formations.map((fmt) => {
              const isCurrent = fmt.name.toLowerCase().includes('barail') || fmt.name.toLowerCase().includes('xyz');
              return (
                <div
                  key={fmt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-sm'
                      : 'bg-[#0c182b] border-[#172b47]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-amber-300 text-sm">{fmt.name}</span>
                      {isCurrent && (
                        <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          ACTIVE DRILLING HORIZON
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-slate-300 text-xs">
                      {fmt.top_depth}m – {fmt.bottom_depth}m (Thickness: {fmt.bottom_depth - fmt.top_depth}m)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2">{fmt.description}</p>
                  <div className="mt-2 text-xs font-mono text-slate-400">
                    <strong className="text-slate-300">Lithology:</strong> {fmt.lithology}
                  </div>
                  <div className="mt-1 text-xs font-mono text-red-300">
                    <strong>Typical Hazards:</strong> {fmt.typical_hazards}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 font-mono">Historical Reports & Logs</h3>
              <p className="text-xs text-slate-400">Archived operational documentation for {currentWell?.id}</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Open Historical Reports Center →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#0c182b] p-4 rounded-xl border border-[#172b47] space-y-3 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div>
                      <span className="font-mono font-bold text-slate-200 text-xs block">{doc.id}</span>
                      <span className="text-[11px] text-slate-400 truncate max-w-[240px] block">{doc.document_name}</span>
                    </div>
                  </div>
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                    {doc.document_type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">{doc.summary}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-[11px] font-mono text-slate-400">{doc.date}</span>
                  <button
                    onClick={() => onNavigate('reports', doc.id)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Extracted Data</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-200 font-mono">
              Side-by-Side Stratigraphic & Operational Comparison
            </h3>
            <p className="text-xs text-slate-400">
              Active Target Well ({activeWell?.id}) versus Offset Well ({currentWell?.id})
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Well */}
            <div className="bg-[#0b172a] p-4 rounded-xl border border-emerald-600/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-emerald-400 text-base">{activeWell?.id}</span>
                <span className="bg-emerald-950 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded">
                  CURRENT RIG TARGET
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Depth:</span><span className="text-white font-bold">{activeWell?.current_depth} m</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Formation:</span><span className="text-amber-300">{activeWell?.formation}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Total Planned:</span><span className="text-slate-200">{activeWell?.total_depth} m</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="text-emerald-400">DRILLING ACTIVE</span></div>
              </div>
            </div>

            {/* Offset Well */}
            <div className="bg-[#0b172a] p-4 rounded-xl border border-blue-600/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono font-bold text-blue-400 text-base">{currentWell?.id}</span>
                <span className="bg-blue-950 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded">
                  OFFSET ANALOG ({currentWell?.distance_km} km)
                </span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Total Depth:</span><span className="text-white font-bold">{currentWell?.total_depth} m</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Formation:</span><span className="text-amber-300">{currentWell?.formation}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Similarity:</span><span className="text-emerald-400 font-bold">{Math.round((currentWell?.similarity_score || 0.8) * 100)}%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Historical Incidents:</span><span className="text-red-400 font-bold">{events.length} recorded</span></div>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1e36] p-4 rounded-xl border border-[#1f375a] space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300">Decision Support Correlation</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              When offset well {currentWell?.id} penetrated the Barail Sandstone horizon around {currentWell?.id === 'WELL-B-03' ? '3,440m' : '3,390m'},
              it encountered significant non-productive time (NPT). Because active well {activeWell?.id} is currently at 3,420m (within 20m of the hazard window),
              the rig engineer should verify loss-circulation pill readiness and calibrate drilling torque limits.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
