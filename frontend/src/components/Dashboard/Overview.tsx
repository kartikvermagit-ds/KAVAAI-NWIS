import React from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BookOpen, Compass,
  Database, Eye, FileText, Layers, MapPin, Sparkles, TrendingUp
} from 'lucide-react';
import { DashboardSummary, Well } from '../../types';

interface OverviewProps {
  summary: DashboardSummary | null;
  loading: boolean;
  onNavigate: (view: string, targetId?: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({ summary, loading, onNavigate }) => {
  if (loading || !summary) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-mono text-sm">Loading KAVAAI Rig Intelligence Telemetry...</p>
        </div>
      </div>
    );
  }

  const { active_well, top_nearby_wells, recent_events, risks_overview } = summary;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              KAVAAI-NWIS
            </h1>
            <span className="text-xs bg-blue-900/60 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-700/50">
              SIH26121 • Smart Automation
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Nearby Wells Intelligence System — AI-Powered Drilling Knowledge & Decision Support
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('map')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Launch Offset Map</span>
          </button>
          <button
            onClick={() => onNavigate('copilot')}
            className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Drilling Copilot</span>
          </button>
        </div>
      </div>

      {/* Synthetic Dataset Alert Banner */}
      <div className="bg-slate-900/80 border border-slate-700/70 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span className="font-mono text-slate-200 font-semibold">Synthetic Demonstration Dataset</span>
          <span className="text-slate-400 text-[11px]">— Simulated exploration block for SIH 2026. Contains no proprietary OIL data.</span>
        </div>
        <span className="text-[11px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
          Strictly Non-Confidential
        </span>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Active Well</div>
          <div className="text-lg font-bold font-mono text-white mt-1">{active_well.id}</div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
            DRILLING ACTIVE
          </div>
        </div>

        <div className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Current Depth</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
            {active_well.current_depth ? `${active_well.current_depth.toLocaleString()} m` : '3,420 m'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">MD (TVD: 3,398 m)</div>
        </div>

        <div className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => onNavigate('map')}>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Nearby Wells</div>
          <div className="text-lg font-bold font-mono text-blue-400 mt-1">{summary.total_nearby_wells}</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Radius &lt; 15 km</span>
            <ArrowRight className="w-3 h-3 text-blue-400" />
          </div>
        </div>

        <div className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => onNavigate('knowledge')}>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Historical Events</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">{summary.total_historical_events}</div>
          <div className="text-[10px] text-slate-400 mt-1">Indexed in RAG</div>
        </div>

        <div className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm cursor-pointer hover:border-red-500/50 transition-colors" onClick={() => onNavigate('risks')}>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Current Risk Level</div>
          <div className="text-lg font-bold font-mono text-red-400 mt-1 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span>{summary.active_risk_level}</span>
          </div>
          <div className="text-[10px] text-red-300/80 mt-1 font-mono">Mud Loss / Torque</div>
        </div>

        <div className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm cursor-pointer hover:border-blue-500/50 transition-colors" onClick={() => onNavigate('reports')}>
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Relevant Reports</div>
          <div className="text-lg font-bold font-mono text-indigo-400 mt-1">{summary.relevant_reports_count}</div>
          <div className="text-[10px] text-slate-400 mt-1">WCR / DDR / Logs</div>
        </div>
      </div>

      {/* AI Insight Highlight Banner (Section 5.E) */}
      <div className="bg-gradient-to-r from-purple-950/70 via-[#0e1a2f] to-[#0a1526] border border-purple-800/40 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-lg bg-purple-900/60 border border-purple-700/50 text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wide text-purple-300 uppercase">
                AI Knowledge Correlation Insight
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/40">
                Depth Correlation Active
              </span>
            </div>
            <p className="text-sm text-slate-200 font-medium mt-1 leading-relaxed">
              &quot;{summary.ai_highlight}&quot;
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onNavigate('reports', 'DOC-DDR-2024-017')}
            className="flex items-center space-x-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs px-3.5 py-2 rounded-lg font-medium shadow transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Evidence (DDR-2024-017)</span>
          </button>
          <button
            onClick={() => onNavigate('correlation')}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-lg font-medium border border-slate-700 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare Formation</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Section A & B */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Current Well Status */}
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <h2 className="text-sm font-semibold text-slate-200 font-mono">Current Well Status</h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              Active Drilling
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Well ID</span>
              <span className="text-white font-mono font-bold text-sm">{active_well.id}</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Field Block</span>
              <span className="text-slate-200 font-medium truncate block">{active_well.field}</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Current Depth</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                {active_well.current_depth?.toLocaleString()} m
              </span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Planned Depth</span>
              <span className="text-slate-200 font-mono font-medium">{active_well.total_depth.toLocaleString()} m</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48] col-span-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Formation</span>
              <span className="text-amber-300 font-medium">{active_well.formation}</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Latitude</span>
              <span className="text-slate-300 font-mono">{active_well.latitude.toFixed(4)}° N</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Longitude</span>
              <span className="text-slate-300 font-mono">{active_well.longitude.toFixed(4)}° E</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48] col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Last Rig Sync</span>
                <span className="text-slate-300 font-mono text-[11px]">2026-08-10 14:30 IST</span>
              </div>
              <button
                onClick={() => onNavigate('explorer', active_well.id)}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
              >
                <span>View Full Well Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Section B: Nearby Well Summary (4-6 nearby wells) */}
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 font-mono">Nearby Offset Wells Summary</h2>
              <p className="text-[11px] text-slate-400">Closest historical analog wells ranked by spatial & geological similarity</p>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
            >
              <span>Explore in Map</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-2">Well ID</th>
                  <th className="pb-2">Distance</th>
                  <th className="pb-2">Total Depth</th>
                  <th className="pb-2">Formation</th>
                  <th className="pb-2">Major Historical Event</th>
                  <th className="pb-2 text-right">Similarity</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {top_nearby_wells.map((well) => (
                  <tr key={well.id} className="hover:bg-[#0e1f36] transition-colors group">
                    <td className="py-2.5 font-mono text-blue-400 font-semibold">{well.id}</td>
                    <td className="py-2.5 font-mono text-slate-300">{well.distance_km} km</td>
                    <td className="py-2.5 font-mono text-slate-300">{well.total_depth} m</td>
                    <td className="py-2.5 text-slate-300 max-w-[140px] truncate" title={well.formation}>
                      {well.formation}
                    </td>
                    <td className="py-2.5">
                      {well.id === 'WELL-B-03' ? (
                        <span className="text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded text-[10px] font-mono">
                          Mud Loss at 3,440m (48 bbl/hr)
                        </span>
                      ) : well.id === 'WELL-C-07' ? (
                        <span className="text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded text-[10px] font-mono">
                          Torque Surge at 3,390m
                        </span>
                      ) : well.id === 'WELL-E-11' ? (
                        <span className="text-red-400 bg-red-950/60 border border-red-800/40 px-2 py-0.5 rounded text-[10px] font-mono">
                          Total Mud Loss at 3,460m
                        </span>
                      ) : well.id === 'WELL-D-02' ? (
                        <span className="text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded text-[10px] font-mono">
                          Stuck Pipe at 3,610m
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Normal section drilling</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                      {Math.round((well.similarity_score || 0.8) * 100)}%
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onNavigate('explorer', well.id)}
                        className="text-[11px] bg-[#142844] hover:bg-blue-600 text-blue-300 hover:text-white px-2.5 py-1 rounded transition-colors font-mono"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section C: Current Risk Overview */}
      <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-slate-200 font-mono">Current Risk Overview (Current Depth: 3,420m)</h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Explainable multi-criteria assessment correlating offset-well historical hazards
            </p>
          </div>
          <button
            onClick={() => onNavigate('risks')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
          >
            <span>Full Risk Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {risks_overview.map((risk) => {
            const isHigh = risk.severity === 'High';
            const isMed = risk.severity === 'Medium';
            return (
              <div
                key={risk.category}
                className={`p-4 rounded-xl border transition-all ${
                  isHigh
                    ? 'bg-red-950/20 border-red-800/40 hover:border-red-600/60'
                    : isMed
                    ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-600/60'
                    : 'bg-[#0d1d33] border-[#1a2d48] hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">{risk.category}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isHigh
                        ? 'bg-red-600 text-white'
                        : isMed
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {risk.status} ({risk.severity})
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                    <span>Risk Score</span>
                    <span className="font-bold text-white">{risk.risk_score} / 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${risk.risk_score}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">
                    Supporting Wells: <span className="text-slate-200 font-semibold">{risk.supporting_wells.join(', ')}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Interval: <span className="text-blue-300">{risk.relevant_interval}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60">
                  <p className="text-[10px] text-slate-400 italic leading-snug line-clamp-2">
                    {risk.recommendation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section D: Recent Historical Events Timeline */}
      <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-slate-200 font-mono">Recent Historical Events Log</h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Chronological incident log indexed across surrounding offset wells</p>
          </div>
          <button
            onClick={() => onNavigate('knowledge')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
          >
            <span>Search All 100+ Events</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recent_events.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#0d1c31] hover:bg-[#11243f] p-3 rounded-lg border border-[#192f4e] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="font-mono text-slate-400 text-[11px] w-20 flex-shrink-0 pt-0.5">{evt.date}</div>
                <div className="font-mono font-bold text-blue-400 w-24 flex-shrink-0">{evt.well_id}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200">{evt.event_type}</span>
                    <span className="text-[10px] font-mono text-slate-400">@ {evt.depth}m</span>
                    <span className="text-[10px] text-amber-300/80 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/30">
                      {evt.formation}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{evt.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0 self-end md:self-center">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    evt.severity === 'CRITICAL'
                      ? 'bg-red-700 text-white'
                      : evt.severity === 'HIGH'
                      ? 'bg-red-900/80 text-red-200 border border-red-700'
                      : evt.severity === 'MEDIUM'
                      ? 'bg-amber-900/80 text-amber-200 border border-amber-700'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {evt.severity}
                </span>

                {evt.document_id && (
                  <button
                    onClick={() => onNavigate('reports', evt.document_id)}
                    className="text-[10px] font-mono bg-blue-950 hover:bg-blue-900 text-blue-300 px-2 py-1 rounded border border-blue-800 flex items-center space-x-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Report #{evt.document_id.replace('DOC-', '')}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
