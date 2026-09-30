import React, { useState } from 'react';
import {
  Shield, CheckCircle2, ChevronRight, ChevronLeft, ArrowRight,
  ExternalLink, Layers, MapPin, FileText, AlertTriangle, Bot,
  Activity, Globe, Cpu, X, Sparkles, BookOpen
} from 'lucide-react';

interface SIHStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, targetId?: string) => void;
}

interface StoryStep {
  step: number;
  title: string;
  category: string;
  targetView: string;
  problemContext: string;
  solutionDelivered: string;
  keyMetric: string;
  actionText: string;
}

export const SIHStoryModal: React.FC<SIHStoryModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const steps: StoryStep[] = [
    {
      step: 1,
      title: 'Active Well Drilling Context (WELL-A-01)',
      category: 'Problem Isolation',
      targetView: 'overview',
      problemContext: 'Engineers drill in operational silos without knowing what hazards past offset wells encountered at the upcoming formation depths.',
      solutionDelivered: 'Continuous telemetry tracking of target well WELL-A-01 at 3,420 m in Barail Sandstone / XYZ formation with live MWD telemetry stream.',
      keyMetric: 'Active Well: WELL-A-01 • Depth: 3,420 m • Status: Live Drilling',
      actionText: 'Open Overview Dashboard'
    },
    {
      step: 2,
      title: 'Geographic & Spatial Radius GIS Mapping',
      category: 'Spatial Intelligence',
      targetView: 'map',
      problemContext: 'Unclear spatial correlation of surrounding exploratory and appraisal wells drilled months or years prior across exploration blocks.',
      solutionDelivered: 'Interactive Leaflet GIS map with 3km, 5km, 10km, and 15km distance rings, offset filtering, and instant proximity calculations to offset well WELL-B-03 (2.69 km away).',
      keyMetric: '21 Offset Wells • Dynamic Distance Rings • 10.0 km Default Buffer',
      actionText: 'Launch Live GIS Offset Map'
    },
    {
      step: 3,
      title: 'Historical Report OCR & Structured Extraction',
      category: 'Document Intelligence',
      targetView: 'reports',
      problemContext: 'Critical offset well experience is trapped in unstructured DDR (Daily Drilling Reports) and WCR (Well Completion Reports) PDFs that nobody has time to search.',
      solutionDelivered: 'Automated OCR & NLP ingestion extracting structured mud weights, flow rates, event logs, and operational outcomes from DOC-DDR-2024-017.',
      keyMetric: '47 Historical Reports • Zero Hallucination • Exact Page Citing',
      actionText: 'Inspect Ingested DDR & WCR Reports'
    },
    {
      step: 4,
      title: 'Stratigraphic Hazard Tying & Bit Countdown',
      category: 'Early Warning',
      targetView: 'correlation',
      problemContext: 'Drilling teams repeat non-productive time (NPT) because they do not know the exact depth delta to historical offset incidents.',
      solutionDelivered: 'Direct stratigraphic alignment showing WELL-B-03 suffered severe 48 bbl/hr mud loss at 3,440 m — exactly +20 m ahead of active bit position.',
      keyMetric: 'Delta vs Bit: +20 m • Similarity: 91% • Precedent: WELL-B-03',
      actionText: 'Open Stratigraphic Correlation'
    },
    {
      step: 5,
      title: 'Zero Black-Box Explainable Risk Matrix',
      category: 'Decision Support',
      targetView: 'risks',
      problemContext: 'AI tools often output arbitrary "87% risk" black-box scores that petroleum superintendents cannot audit or trust.',
      solutionDelivered: 'Transparent multi-factor risk scoring evaluating mud loss, kicks, stuck pipe, and torque with clear Human-in-the-Loop operational directives.',
      keyMetric: '7 Hazard Categories • Mathematical Proximity Model • Audit Trail',
      actionText: 'Review Risk Dashboard'
    },
    {
      step: 6,
      title: 'AI Copilot & Historical Knowledge RAG',
      category: 'Knowledge Retrieval',
      targetView: 'copilot',
      problemContext: 'Engineers on the drill floor need instantaneous answers on past mitigation formulas (LCM pill composition, mud weight adjustments).',
      solutionDelivered: 'RAG-powered conversational assistant (Qwen2.5 / deterministic hybrid) citing exact historical DDR paragraphs and engineer validation notices.',
      keyMetric: 'Instant Retrieval • Local LLM Support • Strict Verification Tagging',
      actionText: 'Consult Drilling AI Copilot'
    },
    {
      step: 7,
      title: 'Real-Time Alert Center & Protocol Audit',
      category: 'Rig Safety',
      targetView: 'alerts',
      problemContext: 'Warning fatigue and lack of accountability when potential downhole risk intervals are approached.',
      solutionDelivered: 'Role-based alert notifications with actionable mitigation steps and 1-click cryptographic engineer review acknowledgement.',
      keyMetric: 'Priority Watch Signals • Immutable Audit Trail • Timestamped',
      actionText: 'Open Alert Center'
    },
    {
      step: 8,
      title: '3D Green Planetary Earth Twin & Live Rig Sim',
      category: 'Digital Twin Simulation',
      targetView: 'globe',
      problemContext: 'Modern operations require global tactical visualization of exploration blocks and live dynamic drillstring physics simulation.',
      solutionDelivered: 'Holographic 3D Green Tactical Earth Globe with continental landmasses, satellite orbital paths, and live PDC bit penetration simulation studio.',
      keyMetric: 'WGS-84 Geodetic Sphere • 10 Basin Networks • Live Rig Physics',
      actionText: 'Explore 3D Green Tactical Globe'
    }
  ];

  const currentStep = steps[currentStepIndex];

  const handleGoToView = (view: string) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#061527] border-2 border-cyan-500/60 rounded-2xl w-full max-w-4xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1e36] border-b border-cyan-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)]">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-mono text-sm font-bold text-white tracking-wider">
                  SIH26121 PROBLEM STATEMENT DEMO STORYLINE
                </h2>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-700 font-bold">
                  STEP {currentStep.step} OF {steps.length}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-300">
                Nearby Wells Intelligence System (KAVAAI-NWIS) • Smart India Hackathon 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#0e2746] hover:bg-[#163863] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 py-3 bg-[#051120] border-b border-[#122844] flex items-center justify-between overflow-x-auto gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                currentStepIndex === idx
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : idx < currentStepIndex
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : 'bg-[#091a2e] text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{s.step}.</span>
              <span className="hidden md:inline">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 font-sans">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                {currentStep.category} // SIH26121 CAPABILITY
              </span>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">
                {currentStep.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono bg-blue-950 text-blue-300 px-3 py-1 rounded-full border border-blue-700/60">
                Evaluation Step {currentStep.step}
              </span>
            </div>
          </div>

          {/* Two-Column Comparison: The Problem vs KAVAAI Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* The Industry Problem */}
            <div className="bg-[#12111d] p-4 rounded-xl border border-red-900/60 space-y-2">
              <div className="flex items-center space-x-2 text-red-400 font-bold uppercase tracking-wider text-[11px]">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>The Industry Pain Point:</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-sm">
                {currentStep.problemContext}
              </p>
            </div>

            {/* KAVAAI NWIS Solution */}
            <div className="bg-[#071f1a] p-4 rounded-xl border border-emerald-600/60 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>KAVAAI Engineered Solution:</span>
              </div>
              <p className="text-slate-200 leading-relaxed font-sans text-sm">
                {currentStep.solutionDelivered}
              </p>
            </div>
          </div>

          {/* Key Metric Highlight */}
          <div className="bg-[#0b1f38] p-4 rounded-xl border border-cyan-500/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Demonstration Evidence:</span>
                <span className="text-sm font-bold font-mono text-emerald-300">{currentStep.keyMetric}</span>
              </div>
            </div>

            <button
              onClick={() => handleGoToView(currentStep.targetView)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-all shadow-md group"
            >
              <span>{currentStep.actionText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#0a1e36] border-t border-cyan-700/50 flex items-center justify-between">
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#0e2746] hover:bg-[#163863] text-slate-300 disabled:opacity-40 text-xs font-mono transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="text-xs font-mono text-slate-400">
            Click on any step or action to test the live module directly
          </div>

          <button
            onClick={() => {
              if (currentStepIndex < steps.length - 1) {
                setCurrentStepIndex((prev) => prev + 1);
              } else {
                handleGoToView(currentStep.targetView);
              }
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono font-bold text-xs transition-all shadow-md"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
