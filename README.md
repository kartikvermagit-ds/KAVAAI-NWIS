# KAVAAI-NWIS: Nearby Wells Intelligence System
### AI-Powered Drilling Knowledge & Decision Support
**Problem Statement:** SIH26121 | **Theme:** Smart Automation | **Category:** Software  
**Team:** KAVAAI | **Event:** Smart India Hackathon 2026

---

> **IMPORTANT DISCLAIMER — SYNTHETIC DEMONSTRATION DATASET**  
> All well names, coordinates, trajectories, formation lithologies, daily drilling reports (DDR), well completion reports (WCR), and incident logs in this application are **100% synthetic demonstration data** created specifically for the SIH26121 hackathon prototype.  
> This system does **NOT** contain, use, or claim to represent any confidential, proprietary, or actual field data of **Oil India Limited (OIL)** or any other exploration and production operator.

---

## 1. Problem Statement & Operational Context
During exploration and development drilling operations, drilling engineers often operate in isolated data silos. When encountering downhole hazards—such as sudden lost circulation, severe torque/drag, gas kicks, pack-offs, or differential sticking—valuable historical operational experience from nearby offset wells (drilled months or years prior) exists primarily locked away in unstructured PDF reports, such as:
- **DDR** (Daily Drilling Reports)
- **WCR** (Well Completion Reports)
- **Mud Logs & Lithology Reports**
- **Casing & Cementing Reports**

Without rapid spatial-stratigraphic correlation, drilling teams risk repeating costly non-productive time (NPT) incidents in comparable depth intervals and formations.

---

## 2. Solution: KAVAAI-NWIS
**KAVAAI-NWIS** connects the active drilling context with historical experience from nearby offset wells.

The core engineering questions answered in real-time:
1. *Which nearby wells are spatially and stratigraphically relevant?*
2. *What downhole events and parameter anomalies occurred there?*
3. *Does that historical experience matter to the current drilling bit position right now?*

---

## 3. Key Capabilities & Features

1. **Active Well Context & Telemetry:** Continuous tracking of active well (`WELL-A-01`) at 3,420m MD in the Barail Sandstone / XYZ Formation.
2. **Interactive GIS Well Map (Leaflet):**
   - High-contrast industrial map displaying the target well, 21 offset wells, and dynamic distance rings (3km, 5km, 10km, 15km).
   - Real-time filters for distance radius, formation horizons, hazard types (mud loss, torque, stuck pipe), and status.
   - Interactive popups and side-drawer well inspector with quick navigation to profiles and reports.
3. **Well Explorer:**
   - Deep-dive into any well profile with 6 dedicated tabs: Overview, 3D/2D Trajectory (MD vs TVD & Inclination), Drilling Events Timeline, Stratigraphic Column, Reports, and Side-by-Side Target Comparison.
4. **Historical Document Intelligence:**
   - Ingestion and structured parameter extraction from DDRs and WCRs.
   - Full OCR text preview with extracted tables: Well ID, Date, Depth Interval, Mud Weight, Flow Rate, Standpipe Pressure, Event Type, Severity, Action Taken, and Outcome.
5. **Formation & Depth Correlation:**
   - Direct stratigraphic tying comparing active well interval (`3,420m`) with offset incidents (`WELL-B-03` at 3,440m; `WELL-C-07` at 3,390m).
   - Transparent, explainable correlation metric based on spatial proximity, stratigraphic alignment, and depth delta.
6. **Explainable Risk Dashboard:**
   - 7 risk categories evaluated dynamically:
     1. Mud Loss
     2. Kick / Gas Influx
     3. Stuck Pipe
     4. Torque / Drag
     5. Casing & Shoe Integrity
     6. Cementing Quality
     7. Formation & Instability Risk
   - Transparent multi-factor breakdown with clear human-in-the-loop warnings: *"Historical pattern detected — engineer review required."*
7. **KAVAAI Drilling Copilot (AI Knowledge Assistant):**
   - Search historical well knowledge and synthesize answers.
   - Dual-mode architecture: connects to local **Ollama (Qwen2.5)** when available, and provides seamless fallback to deterministic semantic retrieval when offline.
   - Strict source traceability: cites exact documents (e.g. `DDR-2024-017`, Page 4) and tags all answers with human engineer validation notices.
8. **Real-Time Alert Center:**
   - Advisory notices with actionable recommendations and audit-ready one-click engineer acknowledgement.

---

## 4. System Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │            KAVAAI-NWIS Frontend (React + Vite)         │
                    │  - React 18, TypeScript, Tailwind CSS, Lucide Icons    │
                    │  - Leaflet GIS Interactive Mapping                     │
                    │  - Recharts Trajectory & Depth Visualizations          │
                    └───────────────────────────┬────────────────────────────┘
                                                │ REST API (JSON)
                                                ▼
                    ┌────────────────────────────────────────────────────────┐
                    │               FastAPI Application Server               │
                    │  - Python 3.12, Uvicorn, Pydantic Data Contracts       │
                    │  - CORS Middleware, Multipart Upload Pipeline          │
                    └───────┬───────────────────┬───────────────────┬────────┘
                            │                   │                   │
         ┌──────────────────▼────┐     ┌────────▼────────┐    ┌─────▼───────────────┐
         │ Transparent Risk      │     │  Doc Processor  │    │  AI Copilot Engine  │
         │ Engine (v1.0 Rules)   │     │  - NLP / Regex  │    │  - Local Ollama LLM │
         │ - Spatial Distance    │     │  - OCR Parser   │    │    (Qwen2.5)        │
         │ - Depth Proximity     │     │  - Param Table  │    │  - Deterministic    │
         │ - Formation Matching  │     └────────┬────────┘    │    Semantic RAG     │
         └──────────────────┬────┘              │             └─────┬───────────────┘
                            │                   │                   │
                            └───────────────────┼───────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │ SQLite Local Data Repository    │
                               │ - 22 Synthetic Wells            │
                               │ - 115 Drilling Events           │
                               │ - 47 Historical Documents       │
                               │ - Full Stratigraphic Column     │
                               └─────────────────────────────────┘
```

---

## 5. Synthetic Demonstration Dataset Overview

| Metric | Count | Details |
|---|---|---|
| **Wells** | 22 | 1 Active Target (`WELL-A-01`) + 21 Offset Wells across 3 blocks |
| **Historical Events** | 115 | Mud losses, torque surges, kicks, stuck pipe, pack-offs, tight hole |
| **Historical Reports** | 47 | Realistic DDR, WCR, Mud Logs, Casing Reports, Geological Prognoses |
| **Formations** | 6 | Dihing Alluvium, Tipam, Bokabil, Barail XYZ, Kopili, Jaintia ABC |
| **Depth Scale** | 0 – 4,500m | Comprehensive basin lithostratigraphic section |

---

## 6. Live Demo Workflow (Step-by-Step Hackathon Story)

1. **Step 1: Open Dashboard**
   - Active Well: `WELL-A-01`
   - Current Depth: `3,420 m`
   - Active Formation: `Barail Sandstone / XYZ Formation`
   - Review top KPI cards and AI Highlight banner.
2. **Step 2: Open Well Map**
   - View surrounding offset wells and distance rings.
   - Click on `WELL-B-03` marker (2.8 km away).
3. **Step 3: Inspect Well Inspector Drawer**
   - Notice distance (2.8 km), similarity score (92%), and identified historical hazard.
   - Click **[Explore Well]**.
4. **Step 4: Well Explorer**
   - Inspect borehole trajectory chart (MD vs TVD).
   - Switch to **Drilling Events** tab: see **Mud Loss (48 bbl/hr) at 3,440m**.
5. **Step 5: Historical Reports**
   - Open report `DOC-DDR-2024-017`.
   - Inspect OCR transcript and structured extracted parameters (mud weight 1.30 SG, LCM pill formulation).
6. **Step 6: Formation Correlation**
   - View side-by-side stratigraphic comparison between `WELL-A-01` (at 3,420m) and offset wells `WELL-B-03` (loss at 3,440m) and `WELL-C-07` (torque surge at 3,390m).
7. **Step 7: Risk Dashboard**
   - The explainable risk engine flags **Mud Loss** and **Torque/Drag** as **WATCH / HIGH RISK**.
   - Review transparent factor breakdown and human-in-the-loop warning.
8. **Step 8: AI Copilot**
   - Ask: *"What happened in nearby wells around 3400m?"*
   - Review structured answer, relevant wells (`WELL-B-03`, `WELL-C-07`), source evidence (`DDR-2024-017`), and engineer note.
9. **Step 9: Alert Center**
   - Review High Priority Alert `ALT-2026-0810-01`: *"Potential Historical Risk Interval: Mud Loss & Drag"*.
   - Click **[Acknowledge Risk Protocol]** to register engineer review.
10. **Step 10: System Telemetry**
    - Check System / Data Status: verify all microservices, local LLM bridge, and synthetic dataset metrics.

---

## 7. Local Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js v18+ / v20+ / v22+
- npm 10+
- Optional: [Ollama](https://ollama.com/) with `qwen2.5:latest` for local generative LLM inference.

---

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the backend server
python run.py
```
Backend will start on `http://localhost:8000`.  
Swagger documentation available at `http://localhost:8000/docs`.

---

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start Vite development server
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

### Ollama Setup (Optional Local LLM)

```bash
# Install and pull Qwen2.5 model
ollama pull qwen2.5:latest
ollama serve
```
If Ollama is offline or not installed, KAVAAI-NWIS automatically engages its internal deterministic semantic knowledge engine—**no crash, no cloud API dependency, 100% runnable offline.**

---

### Docker Deployment

```bash
# Run both Backend and Frontend via Docker Compose
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

---

## 8. Future Roadmap: Integration with eRTMAC
In future development phases for Oil India Limited's operational ecosystem:
- **eRTMAC Bridge:** Direct real-time streaming ingestion via WITSML / OPC-UA from rig sensors into the NWIS spatial engine.
- **Automated Mud Weight Advisories:** Coupling historical fracture gradient logs with real-time equivalent circulating density (ECD) tracking.
- **Geosteering Support:** Real-time 3D seismic horizon correlation to anticipate loss zones 30–50 meters before bit penetration.
- **Fine-Tuned Domain LLM:** Offline quantized models trained on specialized drilling terminology (BHA, LOT, FIT, LCM, stick-slip).

---

## 9. Hackathon Verification Checklist

- [x] Frontend runs (`http://localhost:5173`)
- [x] Backend runs (`http://localhost:8000`)
- [x] Database/data layer works (SQLite with 22 wells, 115 events, 47 documents)
- [x] Dashboard loads with KPIs and active well context
- [x] Map loads with Leaflet, markers, distance rings, and filters
- [x] Well Explorer works with MD vs TVD trajectory charts and event logs
- [x] Historical Reports work with OCR transcript and structured parameter extraction
- [x] Formation correlation works with stratigraphic bands and depth deltas
- [x] Risk engine works with transparent factors and human-in-the-loop warnings
- [x] Alerts work with one-click engineer acknowledgement
- [x] Knowledge search works with multi-faceted filtering
- [x] AI Copilot works with evidence traceability and offline fallback
- [x] Synthetic demonstration dataset clearly labelled throughout
- [x] No proprietary or confidential OIL data claimed
- [x] Zero hardcoded secrets
- [x] Complete runnable prototype ready for live jury demonstration
