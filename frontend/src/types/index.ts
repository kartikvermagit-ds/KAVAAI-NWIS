export interface Well {
  id: string;
  well_name: string;
  field: string;
  latitude: float;
  longitude: float;
  spud_date: string;
  total_depth: number;
  current_depth?: number;
  formation: string;
  status: string;
  operator: string;
  is_active: boolean;
  distance_km?: number;
  similarity_score?: number;
}

export type float = number;

export interface TrajectoryPoint {
  md: number;
  tvd: number;
  inclination: number;
  azimuth: number;
  dogleg_severity: number;
}

export interface Formation {
  id: string;
  name: string;
  top_depth: number;
  bottom_depth: number;
  lithology: string;
  description: string;
  typical_hazards: string;
}

export interface DrillingEvent {
  id: string;
  well_id: string;
  date: string;
  depth: number;
  formation: string;
  event_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  action_taken: string;
  outcome: string;
  document_id?: string;
  page_number?: number;
}

export interface DocumentMetadata {
  id: string;
  document_name: string;
  well_id: string;
  document_type: string;
  date: string;
  depth_interval: string;
  processed: boolean;
  source_type: string;
  summary: string;
  file_size_kb: number;
  page_count: number;
  extracted_parameters?: Record<string, any>;
  content_text?: string;
}

export interface RiskItem {
  category: string;
  status: 'NORMAL' | 'MONITOR' | 'WATCH' | 'ELEVATED' | 'CRITICAL';
  severity: 'Low' | 'Medium' | 'High';
  risk_score: number;
  historical_evidence_count: number;
  relevant_interval: string;
  supporting_wells: string[];
  evidence_documents: string[];
  factors: Record<string, any>;
  recommendation: string;
}

export interface Alert {
  id: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  current_depth: number;
  comparable_events_count: number;
  relevant_formation: string;
  supporting_wells: string[];
  evidence_document_id: string;
  description: string;
  recommended_action: string;
  acknowledged: boolean;
  timestamp: string;
}

export interface AIResponse {
  query: string;
  answer: string;
  relevant_wells: string[];
  historical_events: DrillingEvent[];
  evidence_documents: string[];
  engineer_note: string;
  confidence_factors: Record<string, any>;
  source_traceability: {
    document_id: string;
    document_name: string;
    well_id: string;
    page: number;
    event_type: string;
    depth: string;
    verified_status: string;
  }[];
  model_used: string;
  is_fallback: boolean;
}

export interface DashboardSummary {
  active_well: Well;
  total_nearby_wells: number;
  total_historical_events: number;
  active_risk_level: string;
  relevant_reports_count: number;
  recent_events: DrillingEvent[];
  top_nearby_wells: Well[];
  ai_highlight: string;
  risks_overview: RiskItem[];
  dataset_disclaimer: string;
}

export interface SystemStatus {
  system_name: string;
  version: string;
  dataset: string;
  compliance: string;
  services: {
    api_server: string;
    sqlite_data_layer: string;
    risk_engine: string;
    document_processor: string;
    ollama_local_llm: string;
  };
  database_metrics: {
    total_wells: number;
    total_events: number;
    total_documents: number;
    active_well: string;
  };
  local_model: string;
}
