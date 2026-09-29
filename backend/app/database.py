import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from .config import settings
from .seed_data import WELLS_DATA, FORMATIONS, DRILLING_EVENTS, DOCUMENTS_DATA, generate_trajectory, calculate_distance

DB_PATH = settings.DATABASE_PATH

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Wells Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wells (
        id TEXT PRIMARY KEY,
        well_name TEXT,
        field TEXT,
        latitude REAL,
        longitude REAL,
        spud_date TEXT,
        total_depth REAL,
        current_depth REAL,
        formation TEXT,
        status TEXT,
        operator TEXT,
        is_active INTEGER,
        distance_km REAL,
        similarity_score REAL
    )
    """)
    
    # 2. Formations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS formations (
        id TEXT PRIMARY KEY,
        name TEXT,
        top_depth REAL,
        bottom_depth REAL,
        lithology TEXT,
        description TEXT,
        typical_hazards TEXT
    )
    """)
    
    # 3. Drilling Events Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS drilling_events (
        id TEXT PRIMARY KEY,
        well_id TEXT,
        date TEXT,
        depth REAL,
        formation TEXT,
        event_type TEXT,
        severity TEXT,
        description TEXT,
        action_taken TEXT,
        outcome TEXT,
        document_id TEXT,
        page_number INTEGER,
        FOREIGN KEY (well_id) REFERENCES wells (id)
    )
    """)
    
    # 4. Documents Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        document_name TEXT,
        well_id TEXT,
        document_type TEXT,
        date TEXT,
        depth_interval TEXT,
        processed INTEGER,
        source_type TEXT,
        summary TEXT,
        file_size_kb INTEGER,
        page_count INTEGER,
        extracted_parameters TEXT,
        content_text TEXT,
        FOREIGN KEY (well_id) REFERENCES wells (id)
    )
    """)
    
    # 5. Trajectories Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS well_trajectories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        well_id TEXT,
        md REAL,
        tvd REAL,
        inclination REAL,
        azimuth REAL,
        dogleg_severity REAL,
        FOREIGN KEY (well_id) REFERENCES wells (id)
    )
    """)
    
    # 6. Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        priority TEXT,
        title TEXT,
        current_depth REAL,
        comparable_events_count INTEGER,
        relevant_formation TEXT,
        supporting_wells TEXT,
        evidence_document_id TEXT,
        description TEXT,
        recommended_action TEXT,
        acknowledged INTEGER,
        timestamp TEXT
    )
    """)
    
    conn.commit()
    
    # Check if data exists, if not seed it
    cursor.execute("SELECT COUNT(*) FROM wells")
    if cursor.fetchone()[0] == 0:
        seed_database(conn)
    
    conn.close()

def seed_database(conn):
    cursor = conn.cursor()
    
    # Insert Wells
    for w in WELLS_DATA:
        cursor.execute("""
        INSERT INTO wells VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            w["id"], w["well_name"], w["field"], w["latitude"], w["longitude"],
            w["spud_date"], w["total_depth"], w["current_depth"], w["formation"],
            w["status"], w["operator"], 1 if w["is_active"] else 0,
            w["distance_km"], w["similarity_score"]
        ))
        
        # Insert trajectory for well
        traj = generate_trajectory(w["id"], w["total_depth"])
        for pt in traj:
            cursor.execute("""
            INSERT INTO well_trajectories (well_id, md, tvd, inclination, azimuth, dogleg_severity)
            VALUES (?, ?, ?, ?, ?, ?)
            """, (w["id"], pt["md"], pt["tvd"], pt["inclination"], pt["azimuth"], pt["dogleg_severity"]))
    
    # Insert Formations
    for f in FORMATIONS:
        cursor.execute("""
        INSERT INTO formations VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (f["id"], f["name"], f["top_depth"], f["bottom_depth"], f["lithology"], f["description"], f["typical_hazards"]))
        
    # Insert Events
    for e in DRILLING_EVENTS:
        cursor.execute("""
        INSERT INTO drilling_events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            e["id"], e["well_id"], e["date"], e["depth"], e["formation"],
            e["event_type"], e["severity"], e["description"], e["action_taken"],
            e["outcome"], e.get("document_id"), e.get("page_number", 1)
        ))
        
    # Insert Documents
    for d in DOCUMENTS_DATA:
        cursor.execute("""
        INSERT INTO documents VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            d["id"], d["document_name"], d["well_id"], d["document_type"],
            d["date"], d["depth_interval"], 1 if d["processed"] else 0,
            d["source_type"], d["summary"], d["file_size_kb"], d["page_count"],
            json.dumps(d.get("extracted_parameters", {})), d["content_text"]
        ))
        
    # Seed Initial Demo Alert
    cursor.execute("""
    INSERT INTO alerts VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "ALT-2026-0810-01",
        "HIGH",
        "Potential Historical Risk Interval: Mud Loss & Drag",
        3420.0,
        3,
        "Barail Sandstone / XYZ Formation",
        json.dumps(["WELL-B-03", "WELL-C-07", "WELL-E-11"]),
        "DOC-DDR-2024-017",
        "Historical pattern detected in comparable depth interval (3,380m - 3,470m) within Barail XYZ Formation. Offset well WELL-B-03 experienced 48 bbl/hr mud loss at 3,440m; WELL-C-07 observed stick-slip and torque surge at 3,390m.",
        "Engineer review required prior to drilling past 3,420m. Verify LCM inventory on rig, pre-treat mud with lubricity beads, and monitor standpipe pressure closely.",
        0,
        "2026-08-10 14:30:00"
    ))
    
    conn.commit()

# Accessor functions
def get_all_wells() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wells ORDER BY is_active DESC, distance_km ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_well_by_id(well_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wells WHERE id = ?", (well_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_active_well() -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wells WHERE is_active = 1 LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return WELLS_DATA[0]

def get_well_trajectory(well_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT md, tvd, inclination, azimuth, dogleg_severity FROM well_trajectories WHERE well_id = ? ORDER BY md ASC", (well_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_events_for_well(well_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM drilling_events WHERE well_id = ? ORDER BY depth ASC", (well_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_all_events() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM drilling_events ORDER BY depth ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_documents_for_well(well_id: str) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents WHERE well_id = ? ORDER BY date DESC", (well_id,))
    rows = cursor.fetchall()
    conn.close()
    res = []
    for r in rows:
        d = dict(r)
        if d.get("extracted_parameters"):
            try:
                d["extracted_parameters"] = json.loads(d["extracted_parameters"])
            except Exception:
                pass
        res.append(d)
    return res

def get_all_documents() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, document_name, well_id, document_type, date, depth_interval, processed, source_type, summary, file_size_kb, page_count FROM documents ORDER BY date DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_document_by_id(doc_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM documents WHERE id = ?", (doc_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        d = dict(row)
        if d.get("extracted_parameters"):
            try:
                d["extracted_parameters"] = json.loads(d["extracted_parameters"])
            except Exception:
                pass
        return d
    return None

def get_all_formations() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM formations ORDER BY top_depth ASC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_all_alerts() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    res = []
    for r in rows:
        d = dict(r)
        if d.get("supporting_wells"):
            try:
                d["supporting_wells"] = json.loads(d["supporting_wells"])
            except Exception:
                pass
        res.append(d)
    return res

def acknowledge_alert(alert_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE alerts SET acknowledged = 1 WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    return True
