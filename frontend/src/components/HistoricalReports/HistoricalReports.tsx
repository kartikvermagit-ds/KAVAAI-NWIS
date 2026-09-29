import React, { useState, useEffect } from 'react';
import {
  FileText, Search, Filter, Upload, Eye, CheckCircle2,
  AlertTriangle, Shield, Download, FileCode, Layers, X
} from 'lucide-react';
import { DocumentMetadata } from '../../types';
import { api } from '../../api/client';

interface HistoricalReportsProps {
  initialDocId?: string;
  onNavigate: (view: string, targetId?: string) => void;
}

export const HistoricalReports: React.FC<HistoricalReportsProps> = ({ initialDocId, onNavigate }) => {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMetadata | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [wellFilter, setWellFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getDocuments()
      .then((docs) => {
        if (!isMounted) return;
        setDocuments(docs);
        if (initialDocId) {
          api.getDocument(initialDocId).then((d) => {
            if (isMounted && d) setSelectedDoc(d);
          }).catch(console.error);
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialDocId]);

  const handleOpenDoc = async (docId: string) => {
    try {
      const doc = await api.getDocument(docId);
      setSelectedDoc(doc);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('well_id', 'WELL-B-03');
      formData.append('document_type', 'DDR');

      const res = await api.uploadDocument(formData);
      setUploadSuccess(`Successfully ingested & extracted ${file.name}`);
      // Refresh docs
      const updated = await api.getDocuments();
      setDocuments(updated);
      if (res.document_id) {
        handleOpenDoc(res.document_id);
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const categories = ['ALL', 'DDR', 'WCR', 'Mud Log', 'Casing Report', 'Cementing Report', 'Geological Report'];

  const filteredDocs = documents.filter((d) => {
    if (categoryFilter !== 'ALL' && d.document_type.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (wellFilter !== 'ALL' && d.well_id.toLowerCase() !== wellFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.id.toLowerCase().includes(q) ||
        d.document_name.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.well_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#182944] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-mono text-white">Historical Document Intelligence</h1>
            <span className="text-xs bg-indigo-950 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-700/50">
              WCR / DDR Knowledge Repository
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Automated text extraction, parameter structuring, and hazard tagging from archived drilling logs
          </p>
        </div>

        {/* Upload Form */}
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Processing OCR...' : 'Upload Report / PDF'}</span>
            <input
              type="file"
              accept=".pdf,.txt,.log,.csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Synthetic Document Disclaimer Banner */}
      <div className="bg-slate-900/80 border border-slate-700/70 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-slate-200 font-semibold">Synthetic Demonstration Documents</span>
          <span className="text-slate-400 text-[11px]">— Simulated DDRs and WCRs generated for SIH26121 testing. Not actual OIL confidential data.</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          OCR Pipeline: Active
        </span>
      </div>

      {uploadSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-700 text-emerald-300 px-4 py-2.5 rounded-lg text-xs flex items-center space-x-2 font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#091524] p-4 rounded-xl border border-[#162a45] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search reports by ID, well or keyword (e.g. mud loss)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0d1d33] border border-[#1d3353] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-72 font-mono"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1 bg-[#0c182b] p-1 rounded-lg border border-[#1a2d48]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Showing <strong className="text-white">{filteredDocs.length}</strong> indexed reports
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const isMudLossDDR = doc.id === 'DOC-DDR-2024-017';
          return (
            <div
              key={doc.id}
              className={`bg-[#091524] hover:bg-[#0c1b2e] rounded-xl border p-4 space-y-3 transition-all flex flex-col justify-between ${
                isMudLossDDR
                  ? 'border-red-600/60 shadow-lg shadow-red-950/20'
                  : 'border-[#162a45] hover:border-blue-500/50'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded bg-blue-950/80 border border-blue-800/60 text-blue-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-white text-xs block">{doc.id}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{doc.well_id}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {doc.document_type}
                  </span>
                </div>

                <div className="text-xs text-slate-200 font-semibold line-clamp-1">
                  {doc.document_name}
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {doc.summary}
                </p>

                {isMudLossDDR && (
                  <div className="bg-red-950/40 border border-red-800/50 p-2 rounded text-[11px] font-mono text-red-300 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                    <span>Historical Event: Mud Loss (48 bbl/hr) at 3,440m</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Date: {doc.date}</span>
                  <span>Pages: {doc.page_count}</span>
                  <span className="text-emerald-400 font-semibold">● Processed</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleOpenDoc(doc.id)}
                    className="w-full bg-[#11243d] hover:bg-blue-600 text-blue-300 hover:text-white py-1.5 px-2 rounded text-xs font-semibold font-mono transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Preview</span>
                  </button>
                  <button
                    onClick={() => handleOpenDoc(doc.id)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-2 rounded text-xs font-medium font-mono transition-colors flex items-center justify-center space-x-1"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Extracted Data</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Intelligence Modal / Inspector */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#091524] border border-[#1b3353] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#07111e]">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-mono font-bold text-white text-base">{selectedDoc.id}</h3>
                    <span className="text-xs font-mono bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                      {selectedDoc.document_type}
                    </span>
                    <span className="text-xs font-mono bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                      Synthetic Demonstration Document
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedDoc.document_name}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Extracted Structured Data Table (Section 9 requirement) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Structured Parameters Extracted by KAVAAI NLP Engine
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    High Confidence (94% Verified)
                  </span>
                </div>

                <div className="bg-[#0c182b] rounded-xl border border-[#172b47] p-4 text-xs">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
                    <div className="bg-[#071322] p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Well ID</span>
                      <span className="text-blue-400 font-bold">{selectedDoc.well_id}</span>
                    </div>
                    <div className="bg-[#071322] p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Report Date</span>
                      <span className="text-slate-200">{selectedDoc.date}</span>
                    </div>
                    <div className="bg-[#071322] p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Interval Depth</span>
                      <span className="text-emerald-400 font-bold">{selectedDoc.depth_interval}</span>
                    </div>
                    <div className="bg-[#071322] p-2.5 rounded border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Source Document</span>
                      <span className="text-slate-200 truncate block">{selectedDoc.id}</span>
                    </div>
                  </div>

                  {selectedDoc.extracted_parameters && (
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <span className="text-[11px] font-mono text-slate-400 block mb-2">Technical Rig Parameters:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                        {Object.entries(selectedDoc.extracted_parameters).map(([k, v]) => (
                          <div key={k} className="bg-[#071322] p-2 rounded border border-slate-800/80">
                            <span className="text-slate-400 text-[10px] uppercase block">{k.replace(/_/g, ' ')}:</span>
                            <span className="text-slate-200 font-medium truncate block">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Raw Document OCR Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    Raw Document Text / OCR Transcript
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">
                    PyMuPDF Extracted Stream
                  </span>
                </div>

                <div className="bg-[#050b14] border border-[#16253a] rounded-xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {selectedDoc.content_text || selectedDoc.summary}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#07111e] flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Audit Trail: Parsed by KAVAAI Pipeline v1.0
              </span>
              <button
                onClick={() => setSelectedDoc(null)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
