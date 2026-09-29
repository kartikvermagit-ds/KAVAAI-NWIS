import React, { useState, useEffect } from 'react';
import {
  BellRing, AlertTriangle, CheckCircle2, Shield, Eye,
  Layers, Check, ExternalLink, HardHat
} from 'lucide-react';
import { Alert, Well } from '../../types';
import { api } from '../../api/client';

interface AlertCenterProps {
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
  onAlertAcknowledged?: () => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ activeWell, onNavigate, onAlertAcknowledged }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAlerts = () => {
    setLoading(true);
    api.getAlerts()
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await api.acknowledgeAlert(alertId);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
      );
      if (onAlertAcknowledged) onAlertAcknowledged();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-mono text-white">Alert Center & Action Protocol</h1>
            <span className="text-xs bg-amber-950 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-700/50">
              Historical Watch Signals
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Advisory decision-support notices triggered when active well parameters correlate with synthetic offset hazards
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
          <span>Active Target:</span>
          <strong className="text-white">{activeWell?.id || 'WELL-A-01'} ({activeWell?.current_depth || 3420}m)</strong>
        </div>
      </div>

      {/* Human In The Loop Notice */}
      <div className="bg-slate-900/80 border border-slate-700/70 rounded-xl p-4 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-3">
          <HardHat className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <span className="font-mono text-white font-bold block">Human-in-the-Loop Operational Safeguard</span>
            <span className="text-slate-400 text-[11px]">
              Alerts serve as advisory decision-support notices. Acknowledging an alert logs the drilling engineer review.
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
          Rig Protocol v1.0
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alt) => {
          const isHigh = alt.priority === 'HIGH' || alt.priority === 'CRITICAL';
          return (
            <div
              key={alt.id}
              className={`p-6 rounded-2xl border transition-all ${
                alt.acknowledged
                  ? 'bg-[#08111e] border-slate-800 opacity-75'
                  : isHigh
                  ? 'bg-[#101a2d] border-red-600/70 shadow-xl shadow-red-950/20'
                  : 'bg-[#0a1526] border-amber-600/60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      alt.acknowledged
                        ? 'bg-slate-800 text-slate-400'
                        : isHigh
                        ? 'bg-red-600 text-white shadow-md shadow-red-900/50'
                        : 'bg-amber-600 text-white'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isHigh ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-amber-950 text-amber-300'
                        }`}
                      >
                        {alt.priority} PRIORITY
                      </span>
                      <span className="font-mono text-xs text-slate-400">{alt.id}</span>
                      {alt.acknowledged && (
                        <span className="bg-emerald-950 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Acknowledged by Engineer</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-mono font-bold text-white text-lg mt-1">{alt.title}</h3>
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-slate-400">
                  <div>Timestamp: <span className="text-slate-200">{alt.timestamp}</span></div>
                  <div>Comparable Events Found: <strong className="text-amber-400">{alt.comparable_events_count}</strong></div>
                </div>
              </div>

              {/* Alert Body */}
              <div className="py-4 space-y-3 text-xs">
                <p className="text-slate-200 leading-relaxed font-medium text-sm">
                  {alt.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#081220] p-3.5 rounded-xl border border-slate-800/80 font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">CURRENT DRILLING DEPTH</span>
                    <span className="text-emerald-400 font-bold text-sm">{alt.current_depth} m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">STRATIGRAPHIC FORMATION</span>
                    <span className="text-amber-300 font-semibold">{alt.relevant_formation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">SUPPORTING OFFSET WELLS</span>
                    <span className="text-blue-400 font-semibold">{alt.supporting_wells.join(', ')}</span>
                  </div>
                </div>

                <div className="bg-[#121c2c] border border-amber-800/40 p-3.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block">
                    RECOMMENDED DRILLING ACTION:
                  </span>
                  <p className="text-slate-200 font-medium leading-relaxed">
                    {alt.recommended_action}
                  </p>
                </div>
              </div>

              {/* Action Buttons matching Section 12 */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('reports', alt.evidence_document_id)}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs px-3.5 py-2 rounded-lg font-semibold shadow transition-colors flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Evidence ({alt.evidence_document_id})</span>
                  </button>

                  <button
                    onClick={() => onNavigate('correlation')}
                    className="bg-[#12243d] hover:bg-[#1a3356] text-blue-300 hover:text-white font-mono text-xs px-3.5 py-2 rounded-lg font-semibold border border-blue-800 transition-colors flex items-center space-x-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Open Well Comparison</span>
                  </button>
                </div>

                {!alt.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alt.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs px-4 py-2 rounded-lg font-semibold shadow transition-colors flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge Risk Protocol</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
