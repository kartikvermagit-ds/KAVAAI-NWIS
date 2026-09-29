import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Shield, CheckCircle2, FileText,
  Eye, Sliders, Info, HardHat, RefreshCw
} from 'lucide-react';
import { RiskItem, Well } from '../../types';
import { api } from '../../api/client';

interface RiskDashboardProps {
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
}

export const RiskDashboard: React.FC<RiskDashboardProps> = ({ activeWell, onNavigate }) => {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [depthTolerance, setDepthTolerance] = useState<number>(150);
  const [maxRadius, setMaxRadius] = useState<number>(10);
  const [loading, setLoading] = useState(false);

  const fetchRisks = () => {
    setLoading(true);
    api.getRisks(depthTolerance, maxRadius)
      .then(setRisks)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRisks();
  }, [depthTolerance, maxRadius]);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-mono text-white">Risk Intelligence & Decision Support</h1>
            <span className="text-xs bg-amber-950 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-700/50">
              CURRENT RISK SIGNAL: WATCH
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Historical mud-loss / torque events found in comparable intervals across synthetic offset wells
          </p>
        </div>

        {/* Filters and Refresh */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 bg-[#0d1d33] px-3 py-1.5 rounded-lg border border-[#1b2d48]">
            <span className="text-slate-400 font-mono">Depth Tolerance:</span>
            <select
              value={depthTolerance}
              onChange={(e) => setDepthTolerance(Number(e.target.value))}
              className="bg-transparent text-emerald-400 font-mono font-semibold focus:outline-none"
            >
              <option value={100} className="bg-[#0d1d33]">± 100 m</option>
              <option value={150} className="bg-[#0d1d33]">± 150 m (Standard)</option>
              <option value={250} className="bg-[#0d1d33]">± 250 m</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#0d1d33] px-3 py-1.5 rounded-lg border border-[#1b2d48]">
            <span className="text-slate-400 font-mono">Radius:</span>
            <select
              value={maxRadius}
              onChange={(e) => setMaxRadius(Number(e.target.value))}
              className="bg-transparent text-blue-400 font-mono font-semibold focus:outline-none"
            >
              <option value={5} className="bg-[#0d1d33]">5 km</option>
              <option value={10} className="bg-[#0d1d33]">10 km (Standard)</option>
              <option value={15} className="bg-[#0d1d33]">15 km</option>
            </select>
          </div>

          <button
            onClick={fetchRisks}
            disabled={loading}
            className="p-2 rounded-lg bg-[#0d1d33] hover:bg-[#152a47] text-slate-300 hover:text-white border border-[#1b2d48] transition-colors"
            title="Recalculate Risk Matrix"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Critical Mandatory Product Principle Banner (Section 11 & Section 20) */}
      <div className="bg-amber-950/40 border-2 border-amber-600/70 rounded-xl p-4 flex items-start space-x-3.5 shadow-lg">
        <HardHat className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              MANDATORY OPERATIONAL DIRECTIVE: HUMAN-IN-THE-LOOP VERIFICATION
            </span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            &quot;Historical pattern detected — engineer review required.&quot;
            The KAVAAI system provides evidence-backed situational intelligence from offset wells.
            It does NOT claim to predict drilling accidents with certainty nor does it replace the certified judgment of the rig drilling engineer.
          </p>
        </div>
      </div>

      {/* 7 Risk Categories Grid */}
      <div className="space-y-4">
        {risks.map((risk) => {
          const isHigh = risk.severity === 'High';
          const isMed = risk.severity === 'Medium';
          const isWatchOrElevated = ['WATCH', 'ELEVATED', 'CRITICAL'].includes(risk.status);

          return (
            <div
              key={risk.category}
              className={`p-5 rounded-2xl border transition-all ${
                isWatchOrElevated
                  ? 'bg-[#0e1726] border-red-800/60 shadow-lg shadow-red-950/10'
                  : isMed
                  ? 'bg-[#0a1525] border-amber-800/40'
                  : 'bg-[#081220] border-[#14263f]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isHigh
                        ? 'bg-red-950/80 text-red-400 border border-red-800'
                        : isMed
                        ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-mono font-bold text-white text-base">{risk.category}</h3>
                      <span
                        className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-bold ${
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
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      Historical Evidence: <strong className="text-slate-200">{risk.historical_evidence_count} incidents</strong> across offset wells
                    </span>
                  </div>
                </div>

                {/* Score gauge */}
                <div className="flex items-center space-x-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Risk Score</span>
                    <span className="text-xl font-bold font-mono text-white">{risk.risk_score} <span className="text-xs text-slate-400">/ 100</span></span>
                  </div>
                  <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${risk.risk_score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Middle Section: Interval, Supporting Wells, Factors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                <div className="bg-[#0b1728] p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Relevant Depth Interval</span>
                  <span className="font-mono font-bold text-blue-300 text-sm">{risk.relevant_interval}</span>
                  <span className="text-[11px] text-slate-400 block">Barail Sandstone / XYZ Horizon</span>
                </div>

                <div className="bg-[#0b1728] p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Supporting Offset Wells</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {risk.supporting_wells.length > 0 ? (
                      risk.supporting_wells.map((wId) => (
                        <button
                          key={wId}
                          onClick={() => onNavigate('explorer', wId)}
                          className="bg-blue-950 hover:bg-blue-900 text-blue-300 px-2 py-0.5 rounded font-mono text-xs border border-blue-800"
                        >
                          {wId}
                        </button>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs">None in radius</span>
                    )}
                  </div>
                </div>

                <div className="bg-[#0b1728] p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Evidence Source Documents</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {risk.evidence_documents.length > 0 ? (
                      risk.evidence_documents.map((docId) => (
                        <button
                          key={docId}
                          onClick={() => onNavigate('reports', docId)}
                          className="bg-purple-950 hover:bg-purple-900 text-purple-300 px-2 py-0.5 rounded font-mono text-xs border border-purple-800 flex items-center space-x-1"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{docId}</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs">Baseline operational logs</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendation & Engineer Action */}
              <div className="bg-[#07101b] p-3.5 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    Decision Support Recommendation:
                  </span>
                  <p className="text-slate-200 font-medium">{risk.recommendation}</p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => onNavigate('correlation')}
                    className="bg-[#122238] hover:bg-[#1a3152] text-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-700 transition-colors"
                  >
                    View Correlation
                  </button>
                  <button
                    onClick={() => onNavigate('alerts')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors"
                  >
                    Open Alert Center
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
