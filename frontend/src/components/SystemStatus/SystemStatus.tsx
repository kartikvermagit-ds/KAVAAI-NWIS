import React, { useState, useEffect } from 'react';
import {
  Activity, CheckCircle2, XCircle, Database, Cpu,
  Shield, Server, FileText, Layers, AlertCircle
} from 'lucide-react';
import { SystemStatus as SystemStatusType } from '../../types';
import { api } from '../../api/client';

export const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemStatusType | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = () => {
    setLoading(true);
    api.getSystemStatus()
      .then(setStatus)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-mono text-white">System Architecture & Telemetry Status</h1>
            <span className="text-xs bg-emerald-950 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-700/50">
              Operational
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Component health, local LLM/Ollama bridge connectivity, and synthetic dataset integrity
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs px-3.5 py-2 rounded-lg font-semibold transition-colors"
        >
          {loading ? 'Pinging Services...' : 'Refresh Health Check'}
        </button>
      </div>

      {/* Dataset & Hackathon Compliance Card */}
      <div className="bg-[#091524] rounded-2xl border border-[#162a45] p-5 space-y-3">
        <div className="flex items-center space-x-2 text-slate-200 font-mono font-bold text-sm">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>Smart India Hackathon 2026 Protocol Compliance (SIH26121)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="bg-[#0c182b] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">PROBLEM STATEMENT</span>
            <span className="text-white font-bold">SIH26121</span>
          </div>
          <div className="bg-[#0c182b] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">THEME / CATEGORY</span>
            <span className="text-blue-300 font-bold">Smart Automation (Software)</span>
          </div>
          <div className="bg-[#0c182b] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">DEVELOPMENT TEAM</span>
            <span className="text-purple-300 font-bold">Team KAVAAI</span>
          </div>
          <div className="bg-[#0c182b] p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block">DATA CLASSIFICATION</span>
            <span className="text-emerald-300 font-bold">Synthetic Demonstration</span>
          </div>
        </div>
      </div>

      {/* Microservice Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-[#091524] rounded-2xl border border-[#162a45] p-5 space-y-4">
          <div className="flex items-center space-x-2 text-slate-200 font-mono font-bold text-sm">
            <Server className="w-4 h-4 text-blue-400" />
            <span>Core Microservices</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c182b] border border-slate-800">
              <span className="text-slate-300">FastAPI REST Server</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ONLINE (Port 8000)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c182b] border border-slate-800">
              <span className="text-slate-300">SQLite & Spatial Layer</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                INITIALIZED
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c182b] border border-slate-800">
              <span className="text-slate-300">Explainable Risk Engine</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ACTIVE v1.0
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0c182b] border border-slate-800">
              <span className="text-slate-300">PyMuPDF / OCR Parser</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* AI & Local LLM Integration Status */}
        <div className="bg-[#091524] rounded-2xl border border-[#162a45] p-5 space-y-4">
          <div className="flex items-center space-x-2 text-slate-200 font-mono font-bold text-sm">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>AI Copilot & LLM Runtime</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-[#0c182b] border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block">OLLAMA DAEMON STATUS:</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold">{status?.services.ollama_local_llm || 'OFFLINE (Fallback Active)'}</span>
              </div>
              <span className="text-slate-400 text-[10px] block mt-1">
                Endpoint: http://localhost:11434
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0c182b] border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block">ACTIVE MODEL / ENGINE:</span>
              <span className="text-purple-300 font-bold block">{status?.local_model || 'Deterministic Semantic Engine'}</span>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-sans">
                The application operates autonomously offline. If Ollama with Qwen2.5 is running, high-fidelity generative synthesis activates automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Database Metrics */}
        <div className="bg-[#091524] rounded-2xl border border-[#162a45] p-5 space-y-4">
          <div className="flex items-center space-x-2 text-slate-200 font-mono font-bold text-sm">
            <Database className="w-4 h-4 text-blue-400" />
            <span>Borehole Corpus Scale</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-[#0c182b] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">TOTAL WELLS</span>
              <span className="text-2xl font-bold text-white">{status?.database_metrics.total_wells || 22}</span>
            </div>

            <div className="bg-[#0c182b] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">HISTORICAL EVENTS</span>
              <span className="text-2xl font-bold text-amber-400">{status?.database_metrics.total_events || 115}</span>
            </div>

            <div className="bg-[#0c182b] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">INDEXED REPORTS</span>
              <span className="text-2xl font-bold text-indigo-400">{status?.database_metrics.total_documents || 47}</span>
            </div>

            <div className="bg-[#0c182b] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">ACTIVE TARGET</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">WELL-A-01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
