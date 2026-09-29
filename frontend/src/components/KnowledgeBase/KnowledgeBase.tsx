import React, { useState, useEffect } from 'react';
import {
  Database, Search, Filter, FileText, ArrowRight,
  Shield, Eye, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import { api } from '../../api/client';
import { Well, Formation } from '../../types';

interface KnowledgeBaseProps {
  initialWellId?: string;
  onNavigate: (view: string, targetId?: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ initialWellId, onNavigate }) => {
  const [query, setQuery] = useState('mud loss XYZ');
  const [selectedWell, setSelectedWell] = useState(initialWellId || 'ALL');
  const [selectedFormation, setSelectedFormation] = useState('ALL');
  const [wells, setWells] = useState<Well[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getWells(), api.getFormations()]).then(([wData, fData]) => {
      setWells(wData);
      setFormations(fData);
    });
  }, []);

  const handleSearch = () => {
    setLoading(true);
    api.searchKnowledge(query, selectedWell, selectedFormation)
      .then(setResults)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleSearch();
  }, [selectedWell, selectedFormation]);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-mono text-white">Borehole Knowledge Repository</h1>
            <span className="text-xs bg-blue-950 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-700/50">
              Semantic Search & Document Index
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Search 100+ historical drilling incidents, daily drilling reports, mud logs, and casing records
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Search Mode: <span className="text-emerald-400 font-bold">Hybrid Semantic + Keyword</span>
        </div>
      </div>

      {/* Search Bar & Multi-faceted Filters */}
      <div className="bg-[#091524] p-5 rounded-2xl border border-[#162a45] space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search query (e.g. mud loss XYZ, stuck pipe 3600m, torque spike)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-[#0c182b] border border-[#1b2f4d] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-semibold font-mono transition-colors shadow flex items-center justify-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Knowledge</span>
          </button>
        </div>

        {/* Filter Facets */}
        <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-mono">Well:</span>
            <select
              value={selectedWell}
              onChange={(e) => setSelectedWell(e.target.value)}
              className="bg-[#0c182b] border border-[#1b2f4d] rounded-lg px-2.5 py-1 text-slate-200 font-mono focus:outline-none"
            >
              <option value="ALL">All Wells</option>
              {wells.map((w) => (
                <option key={w.id} value={w.id}>{w.id}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400 font-mono">Formation:</span>
            <select
              value={selectedFormation}
              onChange={(e) => setSelectedFormation(e.target.value)}
              className="bg-[#0c182b] border border-[#1b2f4d] rounded-lg px-2.5 py-1 text-slate-200 font-mono focus:outline-none"
            >
              <option value="ALL">All Formations</option>
              <option value="Barail">Barail Sandstone / XYZ</option>
              <option value="Kopili">Kopili Shale</option>
              <option value="Jaintia">Jaintia Limestone / ABC</option>
              <option value="Tipam">Tipam Sandstone</option>
            </select>
          </div>

          <div className="text-slate-400 font-mono text-[11px] ml-auto">
            Showing <strong className="text-white">{results.length}</strong> matching records
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.map((item, idx) => {
          const ev = item.event;
          const doc = item.document;
          const isHigh = ev.severity === 'HIGH' || ev.severity === 'CRITICAL';

          return (
            <div
              key={idx}
              className="bg-[#091524] hover:bg-[#0c1c2f] p-4 rounded-xl border border-[#162a45] space-y-2.5 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-blue-400 font-bold text-sm">{ev.well_id}</span>
                  <span className="font-mono text-emerald-400 font-bold">{ev.depth} m</span>
                  <span className="text-amber-300 font-mono text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    {ev.formation}
                  </span>
                  <span className="font-semibold text-white">{ev.event_type}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-mono text-slate-400 text-[11px]">{ev.date}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isHigh ? 'bg-red-700 text-white' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {ev.severity}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-[#060e19] p-2.5 rounded border border-slate-800/80">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Action:</span>
                  <span className="text-slate-300">{ev.action_taken}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Outcome:</span>
                  <span className="text-emerald-400">{ev.outcome}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                <span className="font-mono text-[11px] text-slate-400">
                  Source: <strong className="text-blue-300">{ev.document_id || 'DOC-DDR-SYN'}</strong> (Page {ev.page_number || 1})
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('explorer', ev.well_id)}
                    className="text-xs text-slate-400 hover:text-white font-mono"
                  >
                    Explore Well
                  </button>
                  {ev.document_id && (
                    <button
                      onClick={() => onNavigate('reports', ev.document_id)}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Report</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
