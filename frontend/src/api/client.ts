import {
  Well, TrajectoryPoint, Formation, DrillingEvent,
  DocumentMetadata, RiskItem, Alert, AIResponse, DashboardSummary, SystemStatus
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText || res.statusText}`);
  }
  return res.json();
}

export const api = {
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    return handleResponse<DashboardSummary>(res);
  },

  getWells: async (): Promise<Well[]> => {
    const res = await fetch(`${API_BASE}/wells`);
    return handleResponse<Well[]>(res);
  },

  getNearbyWells: async (radiusKm = 15): Promise<Well[]> => {
    const res = await fetch(`${API_BASE}/wells/nearby?max_radius_km=${radiusKm}`);
    return handleResponse<Well[]>(res);
  },

  getWell: async (id: string): Promise<Well> => {
    const res = await fetch(`${API_BASE}/wells/${id}`);
    return handleResponse<Well>(res);
  },

  getWellTrajectory: async (id: string): Promise<TrajectoryPoint[]> => {
    const res = await fetch(`${API_BASE}/wells/${id}/trajectory`);
    return handleResponse<TrajectoryPoint[]>(res);
  },

  getWellEvents: async (id: string): Promise<DrillingEvent[]> => {
    const res = await fetch(`${API_BASE}/wells/${id}/events`);
    return handleResponse<DrillingEvent[]>(res);
  },

  getWellReports: async (id: string): Promise<DocumentMetadata[]> => {
    const res = await fetch(`${API_BASE}/wells/${id}/reports`);
    return handleResponse<DocumentMetadata[]>(res);
  },

  getFormations: async (): Promise<Formation[]> => {
    const res = await fetch(`${API_BASE}/formations`);
    return handleResponse<Formation[]>(res);
  },

  getEvents: async (): Promise<DrillingEvent[]> => {
    const res = await fetch(`${API_BASE}/events`);
    return handleResponse<DrillingEvent[]>(res);
  },

  getRisks: async (depthTolerance = 150, maxRadius = 10): Promise<RiskItem[]> => {
    const res = await fetch(`${API_BASE}/risks?depth_tolerance_m=${depthTolerance}&max_radius_km=${maxRadius}`);
    return handleResponse<RiskItem[]>(res);
  },

  getAlerts: async (): Promise<Alert[]> => {
    const res = await fetch(`${API_BASE}/alerts`);
    return handleResponse<Alert[]>(res);
  },

  acknowledgeAlert: async (alertId: string): Promise<{ status: string }> => {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/ack`, { method: 'POST' });
    return handleResponse<{ status: string }>(res);
  },

  searchKnowledge: async (query: string, well?: string, formation?: string): Promise<any[]> => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (well && well !== 'all') params.append('well', well);
    if (formation && formation !== 'all') params.append('formation', formation);
    const res = await fetch(`${API_BASE}/knowledge/search?${params.toString()}`);
    return handleResponse<any[]>(res);
  },

  getDocuments: async (): Promise<DocumentMetadata[]> => {
    const res = await fetch(`${API_BASE}/documents`);
    return handleResponse<DocumentMetadata[]>(res);
  },

  getDocument: async (id: string): Promise<DocumentMetadata> => {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    return handleResponse<DocumentMetadata>(res);
  },

  uploadDocument: async (formData: FormData): Promise<any> => {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<any>(res);
  },

  queryAICopilot: async (query: string, wellId = 'WELL-A-01', depthTolerance = 150): Promise<AIResponse> => {
    const res = await fetch(`${API_BASE}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, well_id: wellId, depth_tolerance_m: depthTolerance }),
    });
    return handleResponse<AIResponse>(res);
  },

  getSystemStatus: async (): Promise<SystemStatus> => {
    const res = await fetch(`${API_BASE}/system/status`);
    return handleResponse<SystemStatus>(res);
  }
};
