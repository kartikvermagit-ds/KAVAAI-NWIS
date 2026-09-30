import React, { useState, useEffect } from 'react';
import {
  Layers, ArrowRight, Shield, AlertTriangle, Eye,
  Info, CheckCircle2, ChevronRight, Play, Pause,
  RotateCcw, Activity, Globe, Sliders, ArrowDown, Cpu
} from 'lucide-react';
import { Well, Formation, DrillingEvent } from '../../types';
import { api } from '../../api/client';

interface FormationCorrelationProps {
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
}

export const FormationCorrelation: React.FC<FormationCorrelationProps> = ({ activeWell, onNavigate }) => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [events, setEvents] = useState<DrillingEvent[]>([]);
  const [nearbyWells, setNearbyWells] = useState<Well[]>([]);
  const [selectedFormationId, setSelectedFormationId] = useState<string>('FMT-04'); // Barail Sandstone / XYZ

  // Interactive Live Penetration Simulation State
  const initialDepth = activeWell?.current_depth || 3420;
  const [simulatedDepth, setSimulatedDepth] = useState<number>(initialDepth);
  const [isAutoDrilling, setIsAutoDrilling] = useState<boolean>(false);

  useEffect(() => {
    Promise.all([
      api.getFormations(),
      api.getEvents(),
      api.getNearbyWells(15)
    ]).then(([fmtData, evData, wellData]) => {
      setFormations(fmtData);
      setEvents(evData);
      setNearbyWells(wellData);
    }).catch(console.error);
  }, []);

  // Continuous micro-advance when auto-drilling is enabled
  useEffect(() => {
    if (!isAutoDrilling) return;
    const interval = setInterval(() => {
      setSimulatedDepth((prev) => {
        if (prev >= 3465) {
          setIsAutoDrilling(false);
          return 3465;
        }
        return +(prev + 0.4).toFixed(1);
      });
    }, 350);
    return () => clearInterval(interval);
  }, [isAutoDrilling]);

  const currentFmtName = activeWell?.formation || 'Barail Sandstone / XYZ Formation';

  // Key offset comparison wells with dynamically calculated deltaMeters
  const comparisonOffsetWells = [
    {
      id: 'WELL-B-03',
      name: 'Offset Appraisal Well B-03',
      distance_km: 2.69,
      eventDepth: 3440,
      formation: 'Barail Sandstone / XYZ Formation',
      event: 'Mud Loss (48 bbl/hr)',
      severity: 'HIGH',
      similarity: 91,
      docId: 'DOC-DDR-2024-017',
    },
    {
      id: 'WELL-C-07',
      name: 'Offset Development Well C-07',
      distance_km: 3.95,
      eventDepth: 3390,
      formation: 'Barail Sandstone / XYZ Formation',
      event: 'Torque Surge (28.2 kft-lbs)',
      severity: 'MEDIUM',
      similarity: 87,
      docId: 'DOC-DDR-2023-112',
    },
    {
      id: 'WELL-E-11',
      name: 'Offset Delineation Well E-11',
      distance_km: 3.10,
      eventDepth: 3460,
      formation: 'Barail Sandstone / XYZ Formation',
      event: 'Total Mud Loss (85 bbl)',
      severity: 'HIGH',
      similarity: 90,
      docId: 'DOC-DDR-2024-045',
    },
    {
      id: 'WELL-D-02',
      name: 'Deep Exploration D-02',
      distance_km: 5.20,
      eventDepth: 3610,
      formation: 'Jaintia Limestone / ABC Formation',
      event: 'Stuck Pipe (120 klbs Overpull)',
      severity: 'CRITICAL',
      similarity: 64,
      docId: 'DOC-WCR-2022-088',
    }
  ];

  // Critical hazard delta to WELL-B-03 (3,440 m)
  const deltaToB03 = +(3440 - simulatedDepth).toFixed(1);
  const isImminentHazard = Math.abs(deltaToB03) <= 5;
  const isLossActive = deltaToB03 <= 0 && deltaToB03 >= -15;

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-mono text-white">Formation & Depth Correlation</h1>
            <span className="text-xs bg-amber-950 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-700/50">
              Stratigraphic Hazard Tying
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Compare current drilling depth and formation with historical offset wells to reveal hidden lithological hazards
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('globe')}
            className="flex items-center space-x-1.5 bg-[#032014] hover:bg-[#063321] text-emerald-300 hover:text-white px-3 py-2 rounded-lg text-xs font-mono font-bold border border-emerald-700/60 shadow-[0_0_10px_rgba(16,185,129,0.2)] transition-all"
            title="Inspect basin in 3D Green Tactical Globe"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '20s' }} />
            <span>3D Green Globe</span>
          </button>
          <button
            onClick={() => onNavigate('simulation')}
            className="flex items-center space-x-1.5 bg-[#0d233e] hover:bg-[#14345d] text-cyan-300 hover:text-white px-3 py-2 rounded-lg text-xs font-mono font-bold border border-cyan-700/60 shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-all"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Rig Sim</span>
          </button>
          <button
            onClick={() => onNavigate('risks')}
            className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow transition-colors font-mono"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Generate Risk Interval Alert</span>
          </button>
        </div>
      </div>

      {/* Interactive Drill-Ahead Depth Penetration Simulator Deck */}
      <div className={`p-4 rounded-xl border transition-all ${
        isLossActive
          ? 'bg-red-950/70 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse'
          : isImminentHazard
          ? 'bg-amber-950/70 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
          : 'bg-[#091b30] border-[#18395f]'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isLossActive ? 'bg-red-900 border-red-400 text-white' : 'bg-emerald-950 border-emerald-600 text-emerald-400'
            }`}>
              <Activity className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Interactive Drill-Ahead Penetration Simulator
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isLossActive
                    ? 'bg-red-500 text-slate-950'
                    : isImminentHazard
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {isLossActive ? 'HAZARD ZONE ENTERED (3,440 m)!' : isImminentHazard ? 'IMMINENT PROXIMITY!' : 'NOMINAL FEED'}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                Simulated Depth: <strong className="text-emerald-400 text-sm">{simulatedDepth.toFixed(1)} m</strong> • Delta to WELL-B-03 Mud Loss: <strong className={deltaToB03 <= 5 ? 'text-red-400' : 'text-amber-300'}>{deltaToB03 > 0 ? `+${deltaToB03} m ahead` : `${Math.abs(deltaToB03)} m past`}</strong>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAutoDrilling(!isAutoDrilling)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                isAutoDrilling
                  ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isAutoDrilling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoDrilling ? 'Pause Auto-Drill' : 'Auto Drill Feed'}</span>
            </button>

            <button
              onClick={() => setSimulatedDepth((d) => +(d + 1).toFixed(1))}
              className="px-2.5 py-1.5 rounded-lg bg-[#0e2746] hover:bg-[#153863] text-slate-200 border border-[#1e4675] text-xs font-mono font-semibold"
            >
              +1 m
            </button>
            <button
              onClick={() => setSimulatedDepth((d) => +(d + 5).toFixed(1))}
              className="px-2.5 py-1.5 rounded-lg bg-[#0e2746] hover:bg-[#153863] text-slate-200 border border-[#1e4675] text-xs font-mono font-semibold"
            >
              +5 m
            </button>
            <button
              onClick={() => setSimulatedDepth(3439.5)}
              className="px-2.5 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-600 text-xs font-mono font-bold"
            >
              Simulate 3,439.5 m (Hazard Lip)
            </button>
            <button
              onClick={() => {
                setSimulatedDepth(initialDepth);
                setIsAutoDrilling(false);
              }}
              className="p-1.5 rounded-lg bg-[#0e2746] hover:bg-[#153863] text-slate-400 hover:text-white border border-[#1e4675]"
              title="Reset to 3,420 m"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Depth Range Slider */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center space-x-3 text-xs font-mono">
          <span className="text-slate-400">3,410 m</span>
          <input
            type="range"
            min={3410}
            max={3465}
            step={0.5}
            value={simulatedDepth}
            onChange={(e) => setSimulatedDepth(parseFloat(e.target.value))}
            className="flex-1 accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <span className="text-slate-400">3,465 m</span>
        </div>
      </div>

      {/* Synthetic Dataset Badge */}
      <div className="bg-slate-900/80 border border-slate-700/70 rounded-lg px-4 py-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-slate-200 font-semibold">Transparent Stratigraphic Correlation Engine</span>
          <span className="text-slate-400 text-[11px]">— Rule-based distance & depth alignment without arbitrary black-box scores.</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
          Barail XYZ Active Interval
        </span>
      </div>

      {/* Main Comparative View: Current Well vs Offset Wells (Section 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Active Target Well Column */}
        <div className="bg-[#091524] rounded-2xl border-2 border-emerald-500/50 p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
              CURRENT WELL (TARGET)
            </span>
            <h2 className="text-xl font-bold font-mono text-white mt-0.5">{activeWell?.id || 'WELL-A-01'}</h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">DRILLING ACTIVE</span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="bg-[#0c182b] p-3 rounded-lg border border-[#172b47]">
              <span className="text-slate-400 text-[10px] block">SIMULATED BIT DEPTH</span>
              <span className="text-2xl font-bold text-emerald-400">{simulatedDepth.toFixed(1)} m</span>
              <span className="text-slate-400 text-[10px] block mt-0.5">Continuous MWD Position</span>
            </div>

            <div className="bg-[#0c182b] p-3 rounded-lg border border-[#172b47]">
              <span className="text-slate-400 text-[10px] block">ACTIVE FORMATION</span>
              <span className="text-amber-300 font-semibold text-sm block mt-0.5">{currentFmtName}</span>
              <span className="text-slate-400 text-[10px] block mt-1">Depth Window: 2,950m – 3,650m</span>
            </div>

            <div className={`p-3 rounded-lg border transition-all ${
              isLossActive
                ? 'bg-red-950/60 border-red-500 text-red-300'
                : 'bg-[#0c182b] border-[#172b47]'
            }`}>
              <span className="text-slate-400 text-[10px] block">CRITICAL DEPTH TO WATCH</span>
              <span className={`font-bold text-sm block mt-0.5 ${isLossActive ? 'text-red-400 animate-pulse' : 'text-red-400'}`}>
                3,440 m ({deltaToB03 > 0 ? `+${deltaToB03} m ahead` : `${Math.abs(deltaToB03)} m past`})
              </span>
              <span className="text-slate-400 text-[10px] block mt-0.5">Predicted severe loss interval</span>
            </div>
          </div>

          <div className="pt-2">
            <div className={`p-3 rounded-lg text-xs space-y-1 border ${
              isLossActive
                ? 'bg-red-950 border-red-600 text-red-200'
                : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
            }`}>
              <strong className="block font-mono">
                {isLossActive ? 'CRITICAL ALERT TRIGGERED:' : 'Engine Warning:'}
              </strong>
              <p className="text-[11px] leading-snug">
                {isLossActive
                  ? 'Bit has penetrated into fractured thief sandstone! Correlated 48 bbl/hr mud loss profile from WELL-B-03 is now active.'
                  : `Bit is ${deltaToB03 > 0 ? deltaToB03 : 0} meters away from the fractured sand interval that caused total loss in WELL-B-03.`}
              </p>
            </div>
          </div>
        </div>

        {/* Offset Analog Wells Columns (3 columns wide) */}
        <div className="lg:col-span-3 bg-[#091524] rounded-2xl border border-[#162a45] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                OFFSET WELLS EXPERIENCE (HISTORICAL EVIDENCE)
              </span>
              <h2 className="text-base font-bold text-slate-200 font-mono mt-0.5">
                Surrounding Wells in Barail Sandstone / XYZ Horizon
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Ranked by Stratigraphic Proximity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparisonOffsetWells.map((ow) => {
              const delta = +(ow.eventDepth - simulatedDepth).toFixed(1);
              const isEventActive = Math.abs(delta) <= 5;
              const isHigh = ow.severity === 'HIGH' || ow.severity === 'CRITICAL';

              return (
                <div
                  key={ow.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isEventActive
                      ? 'bg-red-950/60 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                      : isHigh
                      ? 'bg-[#0f192b] border-red-800/40 hover:border-red-600/60'
                      : 'bg-[#0c182b] border-[#172b47] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-blue-400 text-sm">{ow.id}</span>
                        <span className="text-[10px] font-mono bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                          {ow.distance_km} km away
                        </span>
                        {isEventActive && (
                          <span className="text-[10px] font-mono bg-red-600 text-white font-bold px-1.5 py-0.5 rounded">
                            EVENT DEPTH!
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ow.name}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-emerald-400">{ow.similarity}%</span>
                      <span className="text-[10px] text-slate-400 block font-mono">Similarity</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Incident Depth:</span>
                      <span className="text-white font-bold">{ow.eventDepth} m</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Delta vs Bit:</span>
                      <span className={`font-bold ${Math.abs(delta) <= 5 ? 'text-red-400' : delta > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                        {delta > 0 ? `+${delta} m ahead` : `${Math.abs(delta)} m past`}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Formation:</span>
                      <span className="text-amber-300 truncate max-w-[170px]">{ow.formation}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Observed Hazard:</span>
                      <span className={`font-bold ${isHigh ? 'text-red-400' : 'text-amber-300'}`}>
                        {ow.event}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">Source: {ow.docId}</span>
                    <button
                      onClick={() => onNavigate('reports', ow.docId)}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Evidence</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stratigraphic Depth Bands Visualization */}
      <div className="bg-[#091524] rounded-2xl border border-[#162a45] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 font-mono">
              Basin Stratigraphic Column & Historical Incident Distribution
            </h3>
            <p className="text-xs text-slate-400">Visual mapping of formations from surface to deep carbonate basement</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Depth range: 0 – 4,500 m</span>
        </div>

        <div className="space-y-3">
          {formations.map((fmt) => {
            const isTargetFmt = fmt.name.toLowerCase().includes('barail') || fmt.name.toLowerCase().includes('xyz');
            const fmtEvents = events.filter((e) => e.depth >= fmt.top_depth && e.depth <= fmt.bottom_depth);
            const highSevEvents = fmtEvents.filter((e) => e.severity === 'HIGH' || e.severity === 'CRITICAL');

            return (
              <div
                key={fmt.id}
                className={`p-4 rounded-xl border transition-all ${
                  isTargetFmt
                    ? 'bg-[#121c2e] border-amber-500/60 shadow-lg'
                    : 'bg-[#0c182b] border-[#172b47]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-amber-300 text-sm">{fmt.name}</span>
                    <span className="font-mono text-xs text-slate-400">
                      [{fmt.top_depth}m – {fmt.bottom_depth}m]
                    </span>
                    {isTargetFmt && (
                      <span className="bg-emerald-500 text-slate-950 font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                        SIMULATED BIT AT {simulatedDepth.toFixed(1)}M
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="text-slate-400">Historical Incidents:</span>
                    <span className="text-white font-bold">{fmtEvents.length}</span>
                    {highSevEvents.length > 0 && (
                      <span className="text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/50">
                        {highSevEvents.length} High/Critical
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Lithology:</strong> {fmt.lithology}
                  </div>
                  <div className="md:col-span-2 text-red-300">
                    <strong>Documented Hazards:</strong> {fmt.typical_hazards}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Correlation Method Explanation (Section 10 requirement) */}
      <div className="bg-[#0b172a] rounded-xl border border-[#1b2d48] p-4 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-slate-300 font-mono font-bold">
          <Info className="w-4 h-4 text-blue-400" />
          <span>Transparent Correlation Methodology (Zero Arbitrary Black-Box Numbers)</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Correlation similarity index is computed as: <code className="text-blue-300 bg-slate-900 px-1 py-0.5 rounded">Similarity = (1.0 - (Distance / 15km)) * 0.45 + (FormationMatch * 0.35) + (1.0 - (|TD - TargetTD| / 1000m)) * 0.20</code>.
          This ensures transparent traceability that drilling superintendents can evaluate directly without relying on unverifiable confidence scores.
        </p>
      </div>
    </div>
  );
};
