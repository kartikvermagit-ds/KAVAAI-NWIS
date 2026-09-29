import React from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BookOpen, Compass,
  Database, Eye, FileText, Layers, MapPin, Sparkles, TrendingUp,
  Shield, HelpCircle, HardHat, ExternalLink
} from 'lucide-react';
import { DashboardSummary, Well } from '../../types';
import { BrandLogo } from '../Common/BrandLogo';
import { RotatingGlobeBackdrop } from './RotatingGlobeBackdrop';

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

  const { active_well, recent_events, risks_overview } = summary;

  // Exact 6 nearby offset records matching Section 7
  const nearbyOffsetRows = [
    {
      id: 'WELL-N-02',
      dist: '1.48 km',
      td: '3,870 m',
      formation: 'Barail Sandstone / XYZ Formation',
      event: 'Normal section drilling',
      eventSeverity: 'normal',
      similarity: '95%',
      docId: 'DOC-DDR-2024-072'
    },
    {
      id: 'WELL-B-03',
      dist: '2.69 km',
      td: '3,920 m',
      formation: 'Barail Sandstone / XYZ Formation',
      event: 'Mud Loss at 3,440 m',
      eventSeverity: 'watch',
      similarity: '91%',
      docId: 'DOC-DDR-2024-017'
    },
    {
      id: 'WELL-U-22',
      dist: '2.86 km',
      td: '3,790 m',
      formation: 'Barail Sandstone / XYZ Formation',
      event: 'Normal section drilling',
      eventSeverity: 'normal',
      similarity: '90%',
      docId: 'DOC-DDR-2024-015'
    },
    {
      id: 'WELL-E-11',
      dist: '3.10 km',
      td: '3,810 m',
      formation: 'Barail Sandstone / XYZ Formation',
      event: 'Total Mud Loss at 3,460 m',
      eventSeverity: 'watch',
      similarity: '90%',
      docId: 'DOC-DDR-2024-045'
    },
    {
      id: 'WELL-G-09',
      dist: '3.69 km',
      td: '3,950 m',
      formation: 'Kopili Shale Formation',
      event: 'Normal section drilling',
      eventSeverity: 'normal',
      similarity: '67%',
      docId: 'DOC-WCR-2021-032'
    },
    {
      id: 'WELL-C-07',
      dist: '3.95 km',
      td: '3,780 m',
      formation: 'Barail Sandstone / XYZ Formation',
      event: 'Torque Surge at 3,390 m',
      eventSeverity: 'watch',
      similarity: '87%',
      docId: 'DOC-DDR-2023-112'
    }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto relative">
      {/* 3D Green Rotating Half-Globe Telemetry Backdrop */}
      <RotatingGlobeBackdrop />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4 relative z-10">
        <div className="flex items-center space-x-3.5">
          <BrandLogo size="lg" />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('map')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md transition-all font-mono"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Launch Offset Map</span>
          </button>
          <button
            onClick={() => onNavigate('copilot')}
            className="flex items-center space-x-2 bg-purple-700 hover:bg-purple-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md transition-all font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Drilling Copilot</span>
          </button>
        </div>
      </div>

      {/* Rest of Dashboard Content */}
      <div className="space-y-6 relative z-10">
        {/* Synthetic Dataset Alert Banner (Section 3) */}
        <div className="bg-slate-900/90 border border-slate-700/70 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-slate-300 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span className="font-mono text-slate-200 font-semibold">Synthetic Demonstration Dataset</span>
          <span className="text-slate-400 text-[11px]">
            — Simulated drilling data for SIH 2026. No proprietary OIL data.
          </span>
        </div>
        <span className="text-[11px] font-mono text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800/60 font-semibold">
          Strictly Non-Confidential
        </span>
      </div>

      {/* Top 6 KPI Cards (Section 4) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Active Well */}
        <div className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">ACTIVE WELL</div>
          <div className="text-lg font-bold font-mono text-white mt-1">WELL-A-01</div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
            DRILLING ACTIVE
          </div>
        </div>

        {/* 2. Current Depth */}
        <div className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">CURRENT DEPTH</div>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-1">3,420 m</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">MD: 3,420 m / TVD: 3,398 m</div>
        </div>

        {/* 3. Nearby Offset Wells */}
        <div
          className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm cursor-pointer hover:border-blue-500/50 transition-colors"
          onClick={() => onNavigate('map')}
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">NEARBY OFFSET WELLS</div>
          <div className="text-lg font-bold font-mono text-blue-400 mt-1">21</div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
            <span>Radius &lt; 15 km</span>
            <ArrowRight className="w-3 h-3 text-blue-400" />
          </div>
        </div>

        {/* 4. Historical Events */}
        <div
          className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm cursor-pointer hover:border-amber-500/50 transition-colors"
          onClick={() => onNavigate('knowledge')}
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">HISTORICAL EVENTS</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1">116</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Indexed synthetic logs</div>
        </div>

        {/* 5. Historical Risk Signal (WATCH) */}
        <div
          className="bg-[#0b1728] p-4 rounded-xl border border-amber-800/40 shadow-sm cursor-pointer hover:border-amber-500/60 transition-colors"
          onClick={() => onNavigate('risks')}
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">HISTORICAL RISK SIGNAL</div>
          <div className="text-lg font-bold font-mono text-amber-400 mt-1 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>WATCH</span>
          </div>
          <div className="text-[10px] text-amber-300/80 mt-1 font-mono">Mud Loss / Torque</div>
        </div>

        {/* 6. Relevant Reports */}
        <div
          className="bg-[#0b1728] p-4 rounded-xl border border-[#1a2d48] shadow-sm cursor-pointer hover:border-indigo-500/50 transition-colors"
          onClick={() => onNavigate('reports')}
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">RELEVANT REPORTS</div>
          <div className="text-lg font-bold font-mono text-indigo-400 mt-1">48</div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">WCR / DDR / Mud Logs</div>
        </div>
      </div>

      {/* AI Insight Card (Section 5) */}
      <div className="bg-gradient-to-r from-purple-950/70 via-[#0e1a2f] to-[#0a1526] border border-purple-800/50 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-lg bg-purple-900/60 border border-purple-700/50 text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold tracking-wide text-purple-300 uppercase">
                AI KNOWLEDGE CORRELATION INSIGHT
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-700/50">
                Depth Correlation Active
              </span>
            </div>
            <p className="text-sm text-slate-200 font-medium mt-1 leading-relaxed">
              &quot;Three nearby synthetic wells contain historical events in intervals comparable to the current drilling depth. WELL-B-03 recorded a mud-loss event at approximately 3,440 m in a comparable formation.&quot;
            </p>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              AI-assisted summary — verify against source reports.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onNavigate('reports', 'DOC-DDR-2024-017')}
            className="flex items-center space-x-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs px-3.5 py-2 rounded-lg font-semibold shadow transition-colors font-mono"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>VIEW EVIDENCE</span>
          </button>
          <button
            onClick={() => onNavigate('correlation')}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-lg font-medium border border-slate-700 transition-colors font-mono"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>COMPARE FORMATION</span>
          </button>
        </div>
      </div>

      {/* Grid: Current Well Status & Nearby Offset Wells Summary (Section 6 & 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section 6: Current Well Status */}
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <h2 className="text-sm font-semibold text-slate-200 font-mono">Current Well Status</h2>
            </div>
            <span className="text-[10px] font-mono text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              SYNTHETIC DEMO
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">WELL ID</span>
              <span className="text-white font-mono font-bold text-sm">WELL-A-01</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">FIELD / BLOCK</span>
              <span className="text-slate-200 font-medium truncate block">Synthetic Exploration Block-4</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">CURRENT DEPTH</span>
              <span className="text-emerald-400 font-mono font-bold text-sm">3,420 m</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">PLANNED DEPTH</span>
              <span className="text-slate-200 font-mono font-medium">3,850 m</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48] col-span-2">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">ACTIVE FORMATION</span>
              <span className="text-amber-300 font-medium">Barail Sandstone / XYZ Formation</span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">LATITUDE</span>
              <span className="text-slate-300 font-mono">27.5015° N <span className="text-[9px] text-slate-500">(Synthetic)</span></span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48]">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">LONGITUDE</span>
              <span className="text-slate-300 font-mono">95.3540° E <span className="text-[9px] text-slate-500">(Synthetic)</span></span>
            </div>

            <div className="bg-[#0d1d33] p-2.5 rounded border border-[#1a2d48] col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">LAST DATA UPDATE</span>
                <span className="text-slate-300 font-mono text-[11px]">2026-08-10 14:30 IST</span>
              </div>
              <button
                onClick={() => onNavigate('explorer', 'WELL-A-01')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1 font-mono"
              >
                <span>View Well Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 7: Nearby Offset Wells Summary (Section 7 & 8) */}
        <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-semibold text-slate-200 font-mono">Nearby Offset Wells</h2>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Synthetic Demo
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Closest historical analog wells ranked using spatial and formation similarity
              </p>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1 font-mono"
            >
              <span>Explore in Map</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-2">WELL ID</th>
                  <th className="pb-2">DISTANCE</th>
                  <th className="pb-2">TOTAL DEPTH</th>
                  <th className="pb-2">FORMATION</th>
                  <th className="pb-2">HISTORICAL EVENT</th>
                  <th className="pb-2 text-right">
                    <span className="inline-flex items-center gap-1" title="Similarity combines configurable spatial, depth and formation factors.">
                      SIMILARITY
                      <HelpCircle className="w-3 h-3 text-slate-500" />
                    </span>
                  </th>
                  <th className="pb-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {nearbyOffsetRows.map((well) => (
                  <tr key={well.id} className="hover:bg-[#0e1f36] transition-colors group">
                    <td className="py-2.5 font-mono text-blue-400 font-semibold">{well.id}</td>
                    <td className="py-2.5 font-mono text-slate-300">{well.dist}</td>
                    <td className="py-2.5 font-mono text-slate-300">{well.td}</td>
                    <td className="py-2.5 text-slate-300 max-w-[150px] truncate" title={well.formation}>
                      {well.formation}
                    </td>
                    <td className="py-2.5">
                      {well.eventSeverity === 'watch' ? (
                        <span className="text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded text-[10px] font-mono">
                          {well.event}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">{well.event}</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400">
                      {well.similarity}
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

          <div className="pt-1 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>* Demo Similarity = (Distance Weight 45%) + (Formation Alignment 35%) + (Depth Delta 20%)</span>
            <span>Deterministic transparent logic</span>
          </div>
        </div>
      </div>

      {/* Section 10: Historical Events Log with Evidence Traceability */}
      <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-slate-200 font-mono">Recent Historical Events & Evidence Traceability</h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Trace downhole incidents directly to verified source documents, depth intervals, and page citations
            </p>
          </div>
          <button
            onClick={() => onNavigate('knowledge')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1 font-mono"
          >
            <span>Search All 116 Events</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recent_events.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#0d1c31] hover:bg-[#11243f] p-3.5 rounded-lg border border-[#192f4e] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors"
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
                  
                  {/* Traceability line per Section 10 */}
                  <div className="text-[10px] font-mono text-slate-400 mt-1">
                    Evidence: <span className="text-blue-300 font-semibold">{evt.document_id || 'DOC-DDR-2024-017'}</span> | Well: <span className="text-slate-200">{evt.well_id}</span> | Depth: <span className="text-emerald-400">{evt.depth} m</span> | Formation: <span className="text-amber-300">XYZ</span> | Page: <span className="text-purple-300">{evt.page_number || 4}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                {evt.document_id && (
                  <button
                    onClick={() => onNavigate('reports', evt.document_id)}
                    className="text-[10px] font-mono bg-blue-950 hover:bg-blue-900 text-blue-300 px-2.5 py-1 rounded border border-blue-800 flex items-center space-x-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>OPEN REPORT</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigate('explorer', evt.well_id)}
                  className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded border border-slate-700 flex items-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>VIEW EVENT</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 11: Current Drilling Context & Decision Support */}
      <div className="bg-[#091524] rounded-xl border border-[#162a45] p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HardHat className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-200 font-mono">CURRENT DRILLING CONTEXT</h2>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
            SIGNAL: WATCH
          </span>
        </div>

        {/* 5 Context Data Points */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
          <div className="bg-[#0c182b] p-3 rounded-lg border border-[#172b47]">
            <span className="text-slate-400 text-[10px] uppercase block">Current Depth</span>
            <span className="text-emerald-400 font-bold text-sm">3,420 m MD</span>
          </div>

          <div className="bg-[#0c182b] p-3 rounded-lg border border-[#172b47]">
            <span className="text-slate-400 text-[10px] uppercase block">Active Formation</span>
            <span className="text-amber-300 font-semibold truncate block">Barail Sandstone / XYZ</span>
          </div>

          <div className="bg-[#0c182b] p-3 rounded-lg border border-[#172b47]">
            <span className="text-slate-400 text-[10px] uppercase block">Nearby Relevant Wells</span>
            <span className="text-blue-300 font-semibold">WELL-B-03, WELL-C-07</span>
          </div>

          <div className="bg-[#0c182b] p-3 rounded-lg border border-[#172b47]">
            <span className="text-slate-400 text-[10px] uppercase block">Events in Interval</span>
            <span className="text-amber-400 font-bold">3 Historical Incidents</span>
          </div>

          <div className="bg-[#0c182b] p-3 rounded-lg border border-[#172b47]">
            <span className="text-slate-400 text-[10px] uppercase block">Current Watch Signal</span>
            <span className="text-amber-400 font-bold">WATCH (Loss & Torque)</span>
          </div>
        </div>

        {/* Decision Support Box */}
        <div className="bg-[#0c1729] rounded-xl border border-amber-800/40 p-4 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
              DECISION SUPPORT DIRECTIVE
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            &quot;Historical events were found in comparable intervals from nearby synthetic wells. Review the linked reports and formation comparison before proceeding.&quot;
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <button
              onClick={() => onNavigate('correlation')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg font-semibold shadow transition-colors flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>VIEW FORMATION CORRELATION</span>
            </button>
            <button
              onClick={() => onNavigate('knowledge')}
              className="bg-[#12233b] hover:bg-[#193254] text-slate-200 px-3.5 py-2 rounded-lg font-semibold border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>VIEW HISTORICAL EVENTS</span>
            </button>
            <button
              onClick={() => onNavigate('copilot')}
              className="bg-purple-700 hover:bg-purple-600 text-white px-3.5 py-2 rounded-lg font-semibold shadow transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ASK DRILLING COPILOT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
