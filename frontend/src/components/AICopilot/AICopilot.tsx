import React, { useState } from 'react';
import {
  Bot, Send, Sparkles, FileText, CheckCircle2,
  AlertTriangle, Shield, ExternalLink, RefreshCw, Cpu
} from 'lucide-react';
import { AIResponse, Well } from '../../types';
import { api } from '../../api/client';

interface AICopilotProps {
  activeWell: Well | null;
  onNavigate: (view: string, targetId?: string) => void;
}

export const AICopilot: React.FC<AICopilotProps> = ({ activeWell, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([
    {
      query: "What happened in nearby wells around 3400m?",
      answer: "Within the 3,380m – 3,470m depth interval across the Barail Sandstone / XYZ Formation, historical records reveal two critical operational events in immediate offset wells. WELL-B-03 (2.8 km NE) encountered severe dynamic lost circulation of 48 bbl/hr at 3,440m requiring a 50 bbl engineered high-fluid-loss LCM pill. Concurrently, WELL-C-07 (4.1 km SW) experienced severe torsional stick-slip oscillations and torque surging up to 28.2 kft-lbs at 3,390m.",
      relevant_wells: ["WELL-B-03", "WELL-C-07"],
      historical_events: [
        {
          id: "EVT-2024-017-01",
          well_id: "WELL-B-03",
          date: "2024-08-17",
          depth: 3440,
          formation: "Barail Sandstone / XYZ Formation",
          event_type: "Mud Loss",
          severity: "HIGH",
          description: "Severe dynamic lost circulation of 48 bbl/hr at 3,440m.",
          action_taken: "Pumped 50 bbl engineered high-fluid-loss LCM pill.",
          outcome: "Loss rate stabilized down to 4 bbl/hr.",
          document_id: "DOC-DDR-2024-017",
          page_number: 4
        }
      ],
      evidence_documents: ["DOC-DDR-2024-017", "DOC-DDR-2023-112"],
      engineer_note: "AI-assisted summary — verify against source reports.",
      confidence_factors: {
        spatial_correlation: 0.92,
        stratigraphic_match: 0.98,
        source_documents_count: 2,
        evidence_grade: "High (Multi-Well Verified)"
      },
      source_traceability: [
        {
          document_id: "DOC-DDR-2024-017",
          document_name: "DDR-2024-017_WELL-B-03_Daily_Drilling_Report.pdf",
          well_id: "WELL-B-03",
          page: 4,
          event_type: "Mud Loss",
          depth: "3,440m",
          verified_status: "Human-Signed Operational Log"
        }
      ],
      model_used: "KAVAAI Local Rig Engine / Ollama Architecture",
      is_fallback: false
    }
  ]);

  const suggestedQuestions = [
    "What happened around 3400 m in nearby wells?",
    "Show mud-loss events in this formation.",
    "Which nearby wells have similar drilling conditions?",
    "What reports support the current watch signal?",
    "Compare WELL-B-03 with the current well."
  ];

  const handleSend = async (qToSend?: string) => {
    const text = qToSend || query;
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const resp = await api.queryAICopilot(text, activeWell?.id || 'WELL-A-01');
      setResponses((prev) => [resp, ...prev]);
      if (!qToSend) setQuery('');
    } catch (e: any) {
      alert(`Copilot error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-mono text-white">KAVAAI Drilling Copilot</h1>
            <span className="text-xs bg-purple-950 text-purple-300 font-mono px-2 py-0.5 rounded border border-purple-700/50">
              Qwen2.5 / Local RAG Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Historical offset knowledge synthesis with strict source traceability and verifiable document links
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#091524] px-3 py-1.5 rounded-lg border border-[#162a45] text-xs font-mono">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-slate-400">Target Context:</span>
          <span className="text-emerald-400 font-bold">{activeWell?.id || 'WELL-A-01'} @ {activeWell?.current_depth || 3420}m</span>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Suggested Engineering Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="bg-[#0b172a] hover:bg-purple-950/60 text-slate-300 hover:text-purple-200 text-xs px-3 py-1.5 rounded-lg border border-[#1b2d48] hover:border-purple-600/60 font-mono transition-all text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="bg-[#081220] p-3 rounded-2xl border border-[#1a2d48] flex items-center space-x-3 shadow-lg">
        <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800/60 text-purple-400">
          <Bot className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Ask the drilling copilot (e.g. Compare WELL-B-03 with the current well)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-semibold font-mono flex items-center space-x-1.5 transition-colors shadow"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Send</span>
        </button>
      </div>

      {/* Structured Copilot Responses (Section 13 structure) */}
      <div className="space-y-6">
        {responses.map((resp, idx) => (
          <div
            key={idx}
            className="bg-[#091524] rounded-2xl border border-[#182c47] p-6 space-y-5 shadow-xl"
          >
            {/* Query Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-purple-400 font-bold text-xs uppercase">Question:</span>
                <span className="text-white text-sm font-semibold">&quot;{resp.query}&quot;</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {resp.model_used}
              </span>
            </div>

            {/* Answer Section */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300 block">
                Answer Briefing
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                {resp.answer}
              </p>
            </div>

            {/* Relevant Wells & Historical Events Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#0c182b] p-3.5 rounded-xl border border-[#172b47] space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                  Relevant Offset Wells
                </span>
                <div className="flex flex-wrap gap-2">
                  {resp.relevant_wells.map((wId) => (
                    <button
                      key={wId}
                      onClick={() => onNavigate('explorer', wId)}
                      className="bg-blue-950 hover:bg-blue-900 text-blue-300 font-mono text-xs px-2.5 py-1 rounded border border-blue-800 flex items-center space-x-1"
                    >
                      <span>{wId}</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0c182b] p-3.5 rounded-xl border border-[#172b47] space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                  Evidence Source Documents
                </span>
                <div className="flex flex-wrap gap-2">
                  {resp.evidence_documents.map((docId) => (
                    <button
                      key={docId}
                      onClick={() => onNavigate('reports', docId)}
                      className="bg-purple-950 hover:bg-purple-900 text-purple-300 font-mono text-xs px-2.5 py-1 rounded border border-purple-800 flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      <span>{docId}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Source Traceability Breakdown */}
            {resp.source_traceability && resp.source_traceability.length > 0 && (
              <div className="bg-[#07111e] rounded-xl border border-slate-800 p-3.5 space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                  Source Traceability & Verification Trail
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  {resp.source_traceability.map((st, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-300 border-b border-slate-800/60 pb-1">
                      <span>{st.document_id} (Page {st.page}) • {st.well_id} @ {st.depth}</span>
                      <span className="text-emerald-400 text-[10px]">{st.verified_status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Engineer Note / Human In the loop disclaimer (Section 13 requirement) */}
            <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl flex items-center justify-between text-xs text-amber-200 font-mono">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{resp.engineer_note}</span>
              </div>
              <span className="text-[10px] text-slate-400">Strict Rig Decision Protocol</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
