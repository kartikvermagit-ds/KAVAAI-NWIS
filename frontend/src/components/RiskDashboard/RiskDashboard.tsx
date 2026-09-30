import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Shield, CheckCircle2, FileText,
  Eye, Sliders, Info, HardHat, RefreshCw, Globe, Cpu, ArrowRight, Activity
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
  const [simulatedMudWeight, setSimulatedMudWeight] = useState<number>(1.26); // Specific Gravity (SG)

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

      {/* Interactive Drilling Margin & Safe Mud Weight Simulator (SIH26121 Hydraulic Verification) */}
      <div className="bg-[#07172b] p-5 rounded-2xl border border-[#1b3f69] space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-mono font-bold text-white text-sm uppercase tracking-wider">
                  Real-time Mud Weight & Hydraulic Margin Sensitivity Lab
                </h3>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                  SIH26121 WELL CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Evaluate drilling mud weight versus Barail Sandstone pore pressure (1.18 SG) and fracture gradient (1.33 SG)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('simulation')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#0d233e] hover:bg-[#14345d] text-cyan-300 text-xs font-mono font-bold border border-cyan-700/60"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rig Simulation</span>
            </button>
            <button
              onClick={() => onNavigate('globe')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#032014] hover:bg-[#063321] text-emerald-300 text-xs font-mono font-bold border border-emerald-700/60"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>3D Globe</span>
            </button>
          </div>
        </div>

        {/* Dynamic Margin Status Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="bg-[#0b1c33] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Simulated Mud Weight</span>
            <span className="text-xl font-bold text-cyan-400">{simulatedMudWeight.toFixed(2)} SG</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">{(simulatedMudWeight * 8.34).toFixed(1)} ppg equivalent</span>
          </div>

          <div className="bg-[#0b1c33] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Formation Pore Pressure</span>
            <span className="text-xl font-bold text-amber-400">1.18 SG</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Kick Influx Threshold</span>
          </div>

          <div className="bg-[#0b1c33] p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Fracture Gradient</span>
            <span className="text-xl font-bold text-red-400">1.33 SG</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Thief Zone Loss Threshold</span>
          </div>

          <div className={`p-3 rounded-xl border flex flex-col justify-center ${
            simulatedMudWeight > 1.33
              ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse'
              : simulatedMudWeight < 1.18
              ? 'bg-amber-950/60 border-amber-500 text-amber-300 animate-pulse'
              : 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
          }`}>
            <span className="text-[10px] block uppercase font-bold">Hydraulic State</span>
            <span className="text-sm font-bold mt-0.5">
              {simulatedMudWeight > 1.33
                ? 'OVERBALANCED: LOSS RISK!'
                : simulatedMudWeight < 1.18
                ? 'UNDERBALANCED: KICK RISK!'
                : 'STABLE DRILLING WINDOW'}
            </span>
            <span className="text-[10px] opacity-80 mt-0.5">
              {simulatedMudWeight > 1.33
                ? 'Replicates WELL-B-03 48 bbl/hr event'
                : simulatedMudWeight < 1.18
                ? 'Formation gas influx expected'
                : 'Safe operational margin maintained'}
            </span>
          </div>
        </div>

        {/* Interactive Slider Bar */}
        <div className="space-y-1 font-mono text-xs pt-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>1.10 SG (Underbalanced)</span>
            <span className="text-emerald-400 font-bold">Operational Setting: {simulatedMudWeight.toFixed(2)} SG</span>
            <span>1.45 SG (Severe Overbalanced)</span>
          </div>
          <input
            type="range"
            min={1.10}
            max={1.45}
            step={0.01}
            value={simulatedMudWeight}
            onChange={(e) => setSimulatedMudWeight(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
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
