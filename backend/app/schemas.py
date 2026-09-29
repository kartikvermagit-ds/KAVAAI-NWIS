from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class WellBase(BaseModel):
    id: str
    well_name: str
    field: str
    latitude: float
    longitude: float
    spud_date: str
    total_depth: float
    current_depth: Optional[float] = None
    formation: str
    status: str
    operator: str = "Synthetic E&P Demo Corp"
    is_active: bool = False
    distance_km: Optional[float] = None
    similarity_score: Optional[float] = None

class TrajectoryPoint(BaseModel):
    md: float
    tvd: float
    inclination: float
    azimuth: float
    dogleg_severity: float

class Formation(BaseModel):
    id: str
    name: str
    top_depth: float
    bottom_depth: float
    lithology: str
    description: str
    typical_hazards: str

class DrillingEvent(BaseModel):
    id: str
    well_id: str
    date: str
    depth: float
    formation: str
    event_type: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    description: str
    action_taken: str
    outcome: str
    document_id: Optional[str] = None
    page_number: Optional[int] = None

class DocumentMetadata(BaseModel):
    id: str
    document_name: str
    well_id: str
    document_type: str  # WCR, DDR, Mud Log, Drilling Report, Casing Report, Cementing Report, Geological Report
    date: str
    depth_interval: str
    processed: bool
    source_type: str = "Synthetic Demonstration Document"
    summary: str
    file_size_kb: int = 240
    page_count: int = 5
    raw_snippet: Optional[str] = None
    extracted_parameters: Optional[Dict[str, Any]] = None

class RiskItem(BaseModel):
    category: str
    status: str  # NORMAL, MONITOR, WATCH, ELEVATED, CRITICAL
    severity: str
    risk_score: float  # 0 to 100
    historical_evidence_count: int
    relevant_interval: str
    supporting_wells: List[str]
    evidence_documents: List[str]
    factors: Dict[str, Any]
    recommendation: str

class Alert(BaseModel):
    id: str
    priority: str  # LOW, MEDIUM, HIGH, CRITICAL
    title: str
    current_depth: float
    comparable_events_count: int
    relevant_formation: str
    supporting_wells: List[str]
    evidence_document_id: str
    description: str
    recommended_action: str
    acknowledged: bool = False
    timestamp: str

class AIQueryRequest(BaseModel):
    query: str
    well_id: Optional[str] = "WELL-A-01"
    depth_tolerance_m: Optional[float] = 150.0

class AIResponse(BaseModel):
    query: str
    answer: str
    relevant_wells: List[str]
    historical_events: List[DrillingEvent]
    evidence_documents: List[str]
    engineer_note: str
    confidence_factors: Dict[str, Any]
    source_traceability: List[Dict[str, Any]]
    model_used: str
    is_fallback: bool

class DashboardSummary(BaseModel):
    active_well: WellBase
    total_nearby_wells: int
    total_historical_events: int
    active_risk_level: str
    relevant_reports_count: int
    recent_events: List[DrillingEvent]
    top_nearby_wells: List[WellBase]
    ai_highlight: str
    risks_overview: List[RiskItem]
    dataset_disclaimer: str = "Synthetic Demonstration Dataset - SIH26121 Hackathon Prototype"
