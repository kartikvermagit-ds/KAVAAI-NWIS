from typing import List, Dict, Any
from .database import get_active_well, get_all_wells, get_all_events, get_all_formations

def evaluate_risks(active_well_id: str = "WELL-A-01", depth_tolerance_m: float = 150.0, max_radius_km: float = 10.0) -> List[Dict[str, Any]]:
    active_well = get_active_well()
    current_depth = active_well.get("current_depth", 3420.0)
    current_formation = active_well.get("formation", "Barail Sandstone / XYZ Formation")
    
    all_wells = get_all_wells()
    wells_by_id = {w["id"]: w for w in all_wells}
    events = get_all_events()
    
    # 7 Standard Drilling Risk Categories
    categories = [
        {"name": "Mud Loss", "keywords": ["Mud Loss", "Lost Circulation", "Seepage", "Thief Zone"]},
        {"name": "Kick / Gas Influx", "keywords": ["Kick", "Gas Influx", "Gas", "Flow", "Well Control"]},
        {"name": "Stuck Pipe", "keywords": ["Stuck Pipe", "Differential Sticking", "Overpull", "Jarring"]},
        {"name": "Torque / Drag", "keywords": ["Torque", "Drag", "Stick-Slip", "Tight Hole", "Vibration"]},
        {"name": "Casing & Shoe Integrity", "keywords": ["Casing", "Shoe", "FIT", "LOT", "Wear"]},
        {"name": "Cementing Quality", "keywords": ["Cementing", "Channeling", "Micro-Annulus", "Squeeze"]},
        {"name": "Formation & Instability Risk", "keywords": ["Instability", "Cavings", "Washout", "Pack-Off", "Breakout"]}
    ]
    
    risk_results = []
    
    for cat in categories:
        cat_name = cat["name"]
        keywords = cat["keywords"]
        
        # Match events
        matching_events = []
        for ev in events:
            # Skip self
            if ev["well_id"] == active_well_id:
                continue
                
            w = wells_by_id.get(ev["well_id"])
            if not w:
                continue
                
            # Filter by radius
            dist = w.get("distance_km", 999.0)
            if dist > max_radius_km:
                continue
                
            # Filter by event keyword
            is_type_match = any(kw.lower() in ev["event_type"].lower() or kw.lower() in ev["description"].lower() for kw in keywords)
            if not is_type_match:
                continue
                
            # Calculate depth delta
            depth_delta = abs(ev["depth"] - current_depth)
            
            # Check formation alignment or depth proximity
            same_formation = (ev["formation"].strip().lower() == current_formation.strip().lower())
            within_depth = (depth_delta <= depth_tolerance_m)
            
            if same_formation or within_depth:
                matching_events.append({
                    "event": ev,
                    "well": w,
                    "depth_delta": depth_delta,
                    "same_formation": same_formation,
                    "dist": dist
                })
                
        # Calculate transparent score
        evidence_count = len(matching_events)
        unique_wells = list({item["well"]["id"] for item in matching_events})
        evidence_docs = list({item["event"]["document_id"] for item in matching_events if item["event"].get("document_id")})
        
        if evidence_count == 0:
            status = "NORMAL"
            severity = "Low"
            risk_score = 12.0
            interval_str = f"{current_depth - 100:.0f}m - {current_depth + 100:.0f}m"
            rec = "Historical logs indicate nominal background operations in offset wells. Continue standard surveillance."
        else:
            # Transparent weighting formula
            # Factors: Proximity (0-30), Depth correlation (0-30), Formation match (0-20), Event severity (0-20)
            closest_dist = min(item["dist"] for item in matching_events)
            min_depth_delta = min(item["depth_delta"] for item in matching_events)
            
            dist_factor = max(0.0, (1.0 - (closest_dist / max_radius_km))) * 30.0
            depth_factor = max(0.0, (1.0 - (min_depth_delta / (depth_tolerance_m * 1.5)))) * 30.0
            fmt_factor = 20.0 if any(item["same_formation"] for item in matching_events) else 8.0
            
            max_sev = "LOW"
            for item in matching_events:
                sev = item["event"]["severity"]
                if sev == "CRITICAL":
                    max_sev = "CRITICAL"
                    break
                elif sev == "HIGH":
                    max_sev = "HIGH"
                elif sev == "MEDIUM" and max_sev != "HIGH":
                    max_sev = "MEDIUM"
                    
            sev_weights = {"CRITICAL": 20.0, "HIGH": 17.0, "MEDIUM": 12.0, "LOW": 6.0}
            sev_factor = sev_weights.get(max_sev, 10.0)
            
            # Well count bonus (+5 per supporting well up to 10)
            well_bonus = min(10.0, len(unique_wells) * 4.0)
            
            risk_score = round(min(98.0, dist_factor + depth_factor + fmt_factor + sev_factor + well_bonus), 1)
            
            if risk_score >= 75.0 or max_sev in ["CRITICAL", "HIGH"]:
                status = "WATCH" if risk_score < 85 else "ELEVATED"
                severity = "High" if risk_score >= 80 else "Medium"
            elif risk_score >= 50.0:
                status = "MONITOR"
                severity = "Medium"
            else:
                status = "MONITOR"
                severity = "Low"
                
            min_ev_depth = min(item["event"]["depth"] for item in matching_events)
            max_ev_depth = max(item["event"]["depth"] for item in matching_events)
            interval_str = f"{min(min_ev_depth, current_depth - 40):.0f}m - {max(max_ev_depth, current_depth + 50):.0f}m"
            
            rec = f"Historical pattern detected across {len(unique_wells)} offset wells within {closest_dist:.1f}km. Engineer review required before proceeding through the comparable {interval_str} interval."
            
        factors = {
            "closest_offset_distance_km": round(min(item["dist"] for item in matching_events), 2) if matching_events else None,
            "min_depth_delta_m": round(min(item["depth_delta"] for item in matching_events), 1) if matching_events else None,
            "formation_matched": any(item["same_formation"] for item in matching_events),
            "supporting_wells_count": len(unique_wells),
            "historical_event_count": evidence_count,
            "algorithm": "Multi-Criteria Transparent Spatial-Stratigraphic Risk Engine (v1.0-SIH26121)"
        }
        
        risk_results.append({
            "category": cat_name,
            "status": status,
            "severity": severity,
            "risk_score": risk_score,
            "historical_evidence_count": evidence_count,
            "relevant_interval": interval_str,
            "supporting_wells": unique_wells,
            "evidence_documents": evidence_docs,
            "factors": factors,
            "recommendation": rec
        })
        
    # Sort by risk score descending
    risk_results.sort(key=lambda x: x["risk_score"], reverse=True)
    return risk_results
