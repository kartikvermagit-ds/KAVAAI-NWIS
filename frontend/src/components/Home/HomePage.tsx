import React from 'react';
import {
  Compass,
  FileText,
  Layers,
  AlertTriangle,
  Cpu,
  ArrowRight,
  Database,
  Lock,
  ChevronRight,
  Shield,
  Activity,
  HardHat,
  Search,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { BrandLogo } from '../Common/BrandLogo';

interface HomePageProps {
  onEnterLogin: () => void;
  onEnterDashboard: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onEnterLogin,
  onEnterDashboard,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#030912] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Background Engineering Grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(18, 58, 90, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(18, 58, 90, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient Radial Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 15%, rgba(14, 55, 95, 0.28) 0%, transparent 65%)',
        }}
      />

      {/* Top Engineering Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#071321]/90 backdrop-blur-md border-b border-[#123A5A]/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Product Title */}
          <BrandLogo size="md" />

          {/* Quick Status Pill */}
          <div className="hidden lg:flex items-center space-x-4 bg-[#0a1b2d] px-3.5 py-1.5 rounded-lg border border-[#143354] font-mono text-[11px]">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-slate-300">NODE: LOCAL-01</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-700" />
            <span className="text-cyan-400">DATASET: SYNTHETIC BENCHMARK</span>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onEnterDashboard}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0c223c]/80 hover:bg-[#112d4f] border border-[#1b436d] text-cyan-300 hover:text-white font-mono text-xs tracking-wider transition-all"
            >
              <span>EXPLORE DEMO</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onEnterLogin}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0e2747] hover:bg-[#163863] border border-amber-500/70 hover:border-amber-400 text-amber-300 font-mono text-xs font-bold tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>OPERATOR ACCESS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16 space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#091f38] border border-cyan-500/40 rounded-full px-4 py-1 text-xs font-mono text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>SIH 2026 // SMART AUTOMATION // PROBLEM STATEMENT SIH26121</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-sans">
            AI-Powered Drilling Knowledge &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400">
              Offset Well Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans">
            Transforming unstructured historical Well Completion Reports (WCR), Daily Drilling Reports (DDR),
            and offset event logs into actionable real-time hazard mitigation, lithology correlation, and
            predictive decision support.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterLogin}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0b2444] to-[#0c315e] border border-cyan-400 hover:border-amber-400 text-white font-mono font-bold text-sm tracking-wider shadow-[0_0_25px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.45)] transition-all group"
            >
              <HardHat className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-12" />
              <span>AUTHENTICATE OPERATOR</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-[#071728] hover:bg-[#0b213b] border border-[#143960] hover:border-slate-400 text-slate-200 font-mono text-sm tracking-wider transition-all"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>LAUNCH LIVE WORKSTATION (GUEST)</span>
            </button>
          </div>

          {/* Telemetry Metrics Strip */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="bg-[#071526]/80 border border-[#12385c] rounded-xl p-4">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                <span>ACTIVE OFFSET WELLS</span>
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">10 Wells</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Assam Shelf Synthetic Basin</div>
            </div>

            <div className="bg-[#071526]/80 border border-[#12385c] rounded-xl p-4">
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center justify-between">
                <span>HISTORICAL INCIDENTS</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-300 mt-1">42 Events</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Stuck pipe, losses & kicks</div>
            </div>

            <div className="bg-[#071526]/80 border border-[#12385c] rounded-xl p-4">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>STRATIGRAPHIC ZONES</span>
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">5 Formations</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Barail, Tipam, Kopili, etc.</div>
            </div>

            <div className="bg-[#071526]/80 border border-[#12385c] rounded-xl p-4">
              <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider flex items-center justify-between">
                <span>RAG COPILOT REASONING</span>
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-purple-300 mt-1">&lt; 1.2s</div>
              <div className="text-[11px] text-slate-400 mt-0.5">With document traceability</div>
            </div>
          </div>
        </section>

        {/* Core Operational Capabilities */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              [SYSTEM MODULES // SIH26121 CAPABILITIES]
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Comprehensive Drilling Intelligence Architecture
            </h2>
            <p className="text-sm text-slate-400">
              Each module directly addresses critical challenges in modern drilling exploration:
              correlating past offsets, mitigating non-productive time (NPT), and grounding AI answers in engineering documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#071424] border border-[#12385c] rounded-2xl p-6 space-y-4 hover:border-cyan-500/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                Offset Well Discovery (GIS)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Interactive spatial visualization pinpointing nearby offset wells within adjustable radiuses (5–25 km).
                Inspect trajectories, target depths, coordinates, and well statuses.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-cyan-400">
                <span>MODULE: GIS_SPATIAL_01</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#071424] border border-[#12385c] rounded-2xl p-6 space-y-4 hover:border-amber-500/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono group-hover:text-amber-300 transition-colors">
                WCR / DDR Document Intelligence
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Ingests historical Well Completion Reports, Daily Drilling Reports, and incident summaries.
                Automatic parameter extraction, OCR integration, and page-level source citation.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-amber-400">
                <span>MODULE: DOC_INGEST_RAG</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#071424] border border-[#12385c] rounded-2xl p-6 space-y-4 hover:border-emerald-500/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono group-hover:text-emerald-300 transition-colors">
                Formation & Depth Correlation
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Correlates stratigraphy across offset wells at equivalent depths (±150m). Highlights lithology boundaries,
                historical mud loss intervals, and casing seat recommendations.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
                <span>MODULE: STRATA_CORRELATE</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#071424] border border-[#12385c] rounded-2xl p-6 space-y-4 hover:border-red-500/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono group-hover:text-red-300 transition-colors">
                Proactive Hazard Risk Engine
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Continuous risk evaluation for pack-offs, stuck pipe, kick detection, and circulation loss.
                Generates actionable watch signals with evidence-backed operational guidelines.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-red-400">
                <span>MODULE: RISK_ENGINE_V1</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#071424] border border-[#12385c] rounded-2xl p-6 space-y-4 hover:border-purple-500/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono group-hover:text-purple-300 transition-colors">
                Grounded AI Drilling Copilot
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Engineered for rig operations. Queries offset wells and drilling events with zero hallucination.
                Outputs direct references to specific DDR logs, bit sizes, and historical mud weights.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-purple-400">
                <span>MODULE: DRILL_COPILOT_LLM</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#071424] border border-[#12385c] rounded-2xl p-6 space-y-4 hover:border-blue-500/60 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono group-hover:text-blue-300 transition-colors">
                Synthetic Benchmark Compliance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Fully transparent synthetic data schema modeled after realistic onshore basin geology.
                Engineered for hackathon evaluation without disclosing proprietary exploration data.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] font-mono text-blue-400">
                <span>MODULE: SYNTHETIC_VERIFY</span>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Pipeline */}
        <section className="bg-[#071321]/90 border border-[#123A5A] rounded-2xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#123A5A]">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                END-TO-END PIPELINE
              </span>
              <h3 className="text-xl font-bold text-white font-mono mt-1">
                How KAVAAI-NWIS Generates Operational Intelligence
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 mt-2 sm:mt-0">
              SIH26121 SMART AUTOMATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-[#050e1a] border border-[#143354] space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400">01. INGESTION</div>
              <h4 className="text-sm font-semibold text-white">Historical WCR & DDR</h4>
              <p className="text-xs text-slate-400">
                Extracts unstructured lithology, mud weights, bit runs, and NPT incidents from historical PDF/text files.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#050e1a] border border-[#143354] space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-400">02. SPATIAL INDEXING</div>
              <h4 className="text-sm font-semibold text-white">GIS & Offset Proximity</h4>
              <p className="text-xs text-slate-400">
                Computes geodesic distances and spatial clustering across regional wells to isolate true geological offsets.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#050e1a] border border-[#143354] space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400">03. CORRELATION</div>
              <h4 className="text-sm font-semibold text-white">Depth & Strata Alignment</h4>
              <p className="text-xs text-slate-400">
                Aligns target well depth against historical formations to detect mud loss zones and stuck pipe risks early.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#050e1a] border border-[#143354] space-y-2">
              <div className="text-xs font-mono font-bold text-purple-400">04. DECISION SUPPORT</div>
              <h4 className="text-sm font-semibold text-white">Actionable Watch Signals</h4>
              <p className="text-xs text-slate-400">
                Presents quantified risk scores, engineering advisories, and document citations to rig operations.
              </p>
            </div>
          </div>
        </section>

        {/* Call To Action Banner */}
        <section className="bg-gradient-to-r from-[#091b32] via-[#071b30] to-[#0d2a4a] border border-[#16426d] rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-[0_0_40px_rgba(11,36,68,0.5)]">
          <div className="max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">
              Ready to Inspect the Drilling Intelligence Workstation?
            </h3>
            <p className="text-sm text-slate-300">
              Access the secure operator terminal with demonstration credentials or explore the live dashboard directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterLogin}
              className="w-full sm:w-auto px-6 py-3 bg-[#0c2647] hover:bg-[#123661] border border-amber-400/80 text-amber-300 font-mono font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
            >
              SIGN IN AS OPERATOR
            </button>
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-6 py-3 bg-[#061424] hover:bg-[#0b213b] border border-[#1b4e7c] text-cyan-300 font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
            >
              LAUNCH GUEST WORKSTATION
            </button>
          </div>
        </section>
      </main>

      {/* Engineering Footer */}
      <footer className="mt-20 border-t border-[#123A5A]/80 bg-[#050e1a] px-4 sm:px-8 py-8 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" showBadge={false} />

          <div className="flex items-center space-x-6 text-[11px]">
            <span className="text-slate-500">CATEGORY: SMART AUTOMATION</span>
            <span className="text-slate-500">TEAM: KAVAAI</span>
            <span className="text-emerald-400">SYSTEM STATUS: OPERATIONAL</span>
          </div>

          <div className="text-[10px] text-slate-500">
            Synthetic Benchmark Prototype • Non-Confidential Data
          </div>
        </div>
      </footer>
    </div>
  );
};
