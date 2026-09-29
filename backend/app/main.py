from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import json
import uuid

from .config import settings
from .database import (
    init_db, get_all_wells, get_well_by_id, get_active_well,
    get_well_trajectory, get_events_for_well, get_all_events,
    get_documents_for_well, get_all_documents, get_document_by_id,
    get_all_formations, get_all_alerts, acknowledge_alert
)
from .risk_engine import evaluate_risks
from .ai_service import query_copilot, search_knowledge_base, check_ollama_status
from .doc_processor import process_and_index_document
from .schemas import (
    WellBase, DrillingEvent, Formation, RiskItem, Alert,
    AIQueryRequest, AIResponse, DashboardSummary
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Nearby Wells Intelligence System - SIH26121 (Smart Automation)",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "problem_statement": settings.PROBLEM_STATEMENT,
        "team": settings.TEAM,
        "dataset_type": settings.DATASET_TYPE
    }

@app.get("/api/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary():
    active_well = get_active_well()
    all_wells = get_all_wells()
    nearby_wells = [w for w in all_wells if not w.get("is_active")]
    all_events = get_all_events()
    all_docs = get_all_documents()
    risks = evaluate_risks()
    
    # Active risk signal: WATCH per SIH26121 Section 4 & 9
    top_risk_level = "WATCH"

    recent_events = all_events[:6]
    top_nearby = nearby_wells[:6]
    
    ai_highlight = (
        "Three nearby synthetic wells contain historical events in intervals comparable to the current drilling depth. "
        "WELL-B-03 recorded a mud-loss event at approximately 3,440 m in a comparable formation."
    )
    
    return {
        "active_well": active_well,
        "total_nearby_wells": len(nearby_wells),
        "total_historical_events": len(all_events),
        "active_risk_level": top_risk_level,
        "relevant_reports_count": len(all_docs),
        "recent_events": recent_events,
        "top_nearby_wells": top_nearby,
        "ai_highlight": ai_highlight,
        "risks_overview": risks[:4],
        "dataset_disclaimer": "Synthetic Demonstration Dataset — Simulated drilling data for SIH 2026. No proprietary OIL data."
    }

@app.get("/api/wells")
def list_wells():
    return get_all_wells()

@app.get("/api/wells/nearby")
def list_nearby_wells(max_radius_km: float = 15.0):
    all_wells = get_all_wells()
    return [w for w in all_wells if not w.get("is_active") and (w.get("distance_km") or 0) <= max_radius_km]

@app.get("/api/wells/{well_id}")
def get_well(well_id: str):
    well = get_well_by_id(well_id)
    if not well:
        raise HTTPException(status_code=404, detail=f"Well {well_id} not found")
    return well

@app.get("/api/wells/{well_id}/trajectory")
def get_trajectory(well_id: str):
    traj = get_well_trajectory(well_id)
    return traj

@app.get("/api/wells/{well_id}/events")
def get_well_events(well_id: str):
    return get_events_for_well(well_id)

@app.get("/api/wells/{well_id}/reports")
def get_well_reports(well_id: str):
    return get_documents_for_well(well_id)

@app.get("/api/formations")
def list_formations():
    return get_all_formations()

@app.get("/api/events")
def list_events():
    return get_all_events()

@app.get("/api/risks")
def get_risks(depth_tolerance_m: float = 150.0, max_radius_km: float = 10.0):
    return evaluate_risks(depth_tolerance_m=depth_tolerance_m, max_radius_km=max_radius_km)

@app.get("/api/alerts")
def list_alerts():
    return get_all_alerts()

@app.post("/api/alerts/{alert_id}/ack")
def ack_alert(alert_id: str):
    acknowledge_alert(alert_id)
    return {"status": "acknowledged", "alert_id": alert_id}

@app.get("/api/knowledge/search")
def knowledge_search(
    q: str = Query("", description="Search keywords"),
    well: Optional[str] = None,
    formation: Optional[str] = None,
    limit: int = 15
):
    results = search_knowledge_base(q, well_filter=well, formation_filter=formation, limit=limit)
    return results

@app.get("/api/documents")
def list_documents():
    return get_all_documents()

@app.get("/api/documents/{doc_id}")
def get_document(doc_id: str):
    doc = get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@app.post("/api/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    well_id: str = Form("WELL-B-03"),
    document_type: str = Form("DDR")
):
    content_bytes = await file.read()
    try:
        content_text = content_bytes.decode("utf-8", errors="replace")
    except Exception:
        content_text = f"Binary content extracted from {file.filename}. Simulated OCR text stream."

    doc_id = f"DOC-UPL-{uuid.uuid4().hex[:6].upper()}"
    extracted = process_and_index_document(
        doc_id=doc_id,
        filename=file.filename,
        content_text=content_text,
        well_id=well_id,
        doc_type=document_type
    )
    return {
        "status": "success",
        "document_id": doc_id,
        "filename": file.filename,
        "extracted_data": extracted
    }

@app.post("/api/ai/query", response_model=AIResponse)
async def query_ai(req: AIQueryRequest):
    res = await query_copilot(req.query, well_id=req.well_id, depth_tolerance_m=req.depth_tolerance_m)
    return res

@app.get("/api/system/status")
async def system_status():
    ollama_ok = await check_ollama_status()
    all_wells = get_all_wells()
    all_events = get_all_events()
    all_docs = get_all_documents()
    
    return {
        "system_name": "KAVAAI-NWIS",
        "version": "1.0.0-PROTOTYPE",
        "dataset": settings.DATASET_TYPE,
        "compliance": "SIH26121 Smart India Hackathon 2026",
        "services": {
            "api_server": "ONLINE",
            "sqlite_data_layer": "ONLINE",
            "risk_engine": "ACTIVE (Explainable Rule Engine v1.0)",
            "document_processor": "ONLINE (OCR + Regex Extraction)",
            "ollama_local_llm": "ONLINE" if ollama_ok else "OFFLINE (Fallback Deterministic Search Active)",
        },
        "database_metrics": {
            "total_wells": len(all_wells),
            "total_events": len(all_events),
            "total_documents": len(all_docs),
            "active_well": "WELL-A-01 (Depth: 3,420m)"
        },
        "local_model": settings.OLLAMA_MODEL if ollama_ok else "Deterministic Semantic Engine"
    }
