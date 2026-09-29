import json
import math
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data", "synthetic")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. Formations (6 Formations)
FORMATIONS = [
    {
        "id": "FMT-01",
        "name": "Dihing / Alluvium Formation",
        "top_depth": 0.0,
        "bottom_depth": 850.0,
        "lithology": "Unconsolidated sands, gravels, clay beds",
        "description": "Surface and shallow unconsolidated fluvial sediments. Prone to boulder washouts and surface hole enlargement.",
        "typical_hazards": "Washout, bit balling, top-hole water flow"
    },
    {
        "id": "FMT-02",
        "name": "Tipam Sandstone Formation",
        "top_depth": 850.0,
        "bottom_depth": 2100.0,
        "lithology": "Medium to coarse grained sandstone with intercalated clays",
        "description": "Massive porous water-bearing sandstone sequence with high permeability streaks and occasional coal stringers.",
        "typical_hazards": "Differential sticking, seepage mud losses, tight hole on trips"
    },
    {
        "id": "FMT-03",
        "name": "Bokabil Formation",
        "top_depth": 2100.0,
        "bottom_depth": 2950.0,
        "lithology": "Silty shales, laminated sandstones, carbonaceous shales",
        "description": "Interbedded shale-sandstone transition zone exhibiting abnormal pore pressure ramp in basal sections.",
        "typical_hazards": "Shale swelling, sloughing, gas kicks, pack-offs"
    },
    {
        "id": "FMT-04",
        "name": "Barail Sandstone / XYZ Formation",
        "top_depth": 2950.0,
        "bottom_depth": 3650.0,
        "lithology": "Hard quartzitic sandstones, fractured sand reservoirs, coal seams",
        "description": "Primary hydrocarbon target interval featuring natural fracture networks, micro-faulted zones, and depleted pressure sub-units.",
        "typical_hazards": "Severe to total lost circulation (mud loss), sudden torque surges, differential sticking, gas influx"
    },
    {
        "id": "FMT-05",
        "name": "Kopili Shale Formation",
        "top_depth": 3650.0,
        "bottom_depth": 3950.0,
        "lithology": "Dark grey fissile splinty shales with calcareous bands",
        "description": "Heavily stressed tectonized marine shale sequence with high chemical reactivity and narrow mud weight window.",
        "typical_hazards": "Severe borehole breakout, wellbore collapse, stuck pipe, reaming delays"
    },
    {
        "id": "FMT-06",
        "name": "Jaintia Limestone / ABC Formation",
        "top_depth": 3950.0,
        "bottom_depth": 4500.0,
        "lithology": "Dense fossiliferous limestone, dolomite, vuggy carbonate",
        "description": "Deep carbonate platform deposit with karstic dissolution vugs and high reservoir temperatures.",
        "typical_hazards": "Catastrophic cavernous losses, high H2S potential, extreme vibration / MWD failure"
    }
]

# 2. Wells (22 Wells total: 1 active target + 21 offset wells)
# Coordinates calibrated to exact requested distances from WELL-A-01
BASE_LAT = 27.5015
BASE_LON = 95.3540

WELLS = [
    {
        "id": "WELL-A-01",
        "well_name": "Synthetic Exploration Well A-01",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT,
        "longitude": BASE_LON,
        "spud_date": "2026-08-10",
        "total_depth": 3850.0,
        "current_depth": 3420.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "DRILLING ACTIVE",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": True,
        "distance_km": 0.0,
        "similarity_score": 1.0,
        "similarity_label": "Active Target"
    },
    # Top 6 exact requested offset wells
    {
        "id": "WELL-N-02",
        "well_name": "Offset Appraisal Well N-02",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT + 0.0095,
        "longitude": BASE_LON + 0.0090,
        "spud_date": "2024-06-25",
        "total_depth": 3870.0,
        "current_depth": 3870.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 1.48,
        "similarity_score": 0.95,
        "similarity_label": "95%",
        "major_event": "Normal section drilling"
    },
    {
        "id": "WELL-B-03",
        "well_name": "Offset Appraisal Well B-03",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT + 0.0175,
        "longitude": BASE_LON + 0.0165,
        "spud_date": "2024-05-14",
        "total_depth": 3920.0,
        "current_depth": 3920.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 2.69,
        "similarity_score": 0.91,
        "similarity_label": "91%",
        "major_event": "Mud Loss at 3,440 m"
    },
    {
        "id": "WELL-U-22",
        "well_name": "Offset Pilot Producer U-22",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT - 0.0185,
        "longitude": BASE_LON + 0.0170,
        "spud_date": "2024-11-12",
        "total_depth": 3790.0,
        "current_depth": 3790.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 2.86,
        "similarity_score": 0.90,
        "similarity_label": "90%",
        "major_event": "Normal section drilling"
    },
    {
        "id": "WELL-E-11",
        "well_name": "Offset Delineation Well E-11",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT - 0.0200,
        "longitude": BASE_LON - 0.0195,
        "spud_date": "2024-02-18",
        "total_depth": 3810.0,
        "current_depth": 3810.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 3.10,
        "similarity_score": 0.90,
        "similarity_label": "90%",
        "major_event": "Total Mud Loss at 3,460 m"
    },
    {
        "id": "WELL-G-09",
        "well_name": "Offset Fault Block G-09",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT + 0.0235,
        "longitude": BASE_LON - 0.0235,
        "spud_date": "2021-08-30",
        "total_depth": 3950.0,
        "current_depth": 3950.0,
        "formation": "Kopili Shale Formation",
        "status": "PLUGGED & ABANDONED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 3.69,
        "similarity_score": 0.67,
        "similarity_label": "67%",
        "major_event": "Normal section drilling"
    },
    {
        "id": "WELL-C-07",
        "well_name": "Offset Development Well C-07",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT - 0.0260,
        "longitude": BASE_LON + 0.0250,
        "spud_date": "2023-11-20",
        "total_depth": 3780.0,
        "current_depth": 3780.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 3.95,
        "similarity_score": 0.87,
        "similarity_label": "87%",
        "major_event": "Torque Surge at 3,390 m"
    },
    # Additional 15 offset wells (total 22 wells)
    {
        "id": "WELL-D-02",
        "well_name": "Offset Deep Exploration D-02",
        "field": "Synthetic Hapjan Sector",
        "latitude": BASE_LAT + 0.0380,
        "longitude": BASE_LON - 0.0290,
        "spud_date": "2022-09-05",
        "total_depth": 4410.0,
        "current_depth": 4410.0,
        "formation": "Jaintia Limestone / ABC Formation",
        "status": "SUSPENDED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 5.20,
        "similarity_score": 0.64,
        "similarity_label": "64%",
        "major_event": "Stuck Pipe at 3,610 m"
    },
    {
        "id": "WELL-F-05",
        "well_name": "Offset Northern Flank F-05",
        "field": "Synthetic Deomali Sector",
        "latitude": BASE_LAT + 0.0410,
        "longitude": BASE_LON + 0.0150,
        "spud_date": "2023-04-12",
        "total_depth": 3650.0,
        "current_depth": 3650.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 4.80,
        "similarity_score": 0.82,
        "similarity_label": "82%",
        "major_event": "Gas Influx at 3,410 m"
    },
    {
        "id": "WELL-H-14",
        "well_name": "Offset Crestal Probe H-14",
        "field": "Synthetic Hapjan Sector",
        "latitude": BASE_LAT - 0.0390,
        "longitude": BASE_LON - 0.0180,
        "spud_date": "2024-09-02",
        "total_depth": 3720.0,
        "current_depth": 3720.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 4.70,
        "similarity_score": 0.81,
        "similarity_label": "81%",
        "major_event": "Torque Fluctuation at 3,425 m"
    },
    {
        "id": "WELL-I-04",
        "well_name": "Offset Infill Producer I-04",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT + 0.0150,
        "longitude": BASE_LON + 0.0380,
        "spud_date": "2023-07-21",
        "total_depth": 3590.0,
        "current_depth": 3590.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 4.25,
        "similarity_score": 0.84,
        "similarity_label": "84%",
        "major_event": "Seepage Loss at 3,450 m"
    },
    {
        "id": "WELL-J-08",
        "well_name": "Offset Southern Stepout J-08",
        "field": "Synthetic Deomali Sector",
        "latitude": BASE_LAT - 0.0480,
        "longitude": BASE_LON + 0.0310,
        "spud_date": "2022-12-10",
        "total_depth": 4120.0,
        "current_depth": 4120.0,
        "formation": "Kopili Shale Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 6.10,
        "similarity_score": 0.61,
        "similarity_label": "61%",
        "major_event": "Shale Sloughing at 3,750 m"
    },
    {
        "id": "WELL-K-12",
        "well_name": "Offset Stratigraphic Test K-12",
        "field": "Synthetic Hapjan Sector",
        "latitude": BASE_LAT + 0.0520,
        "longitude": BASE_LON - 0.0410,
        "spud_date": "2020-03-15",
        "total_depth": 4350.0,
        "current_depth": 4350.0,
        "formation": "Jaintia Limestone / ABC Formation",
        "status": "PLUGGED & ABANDONED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 7.40,
        "similarity_score": 0.55,
        "similarity_label": "55%",
        "major_event": "Vuggy Losses at 4,120 m"
    },
    {
        "id": "WELL-L-06",
        "well_name": "Offset Eastern Flank L-06",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT - 0.0120,
        "longitude": BASE_LON + 0.0490,
        "spud_date": "2024-01-08",
        "total_depth": 3680.0,
        "current_depth": 3680.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 5.10,
        "similarity_score": 0.79,
        "similarity_label": "79%",
        "major_event": "Tight Hole at 3,340 m"
    },
    {
        "id": "WELL-M-15",
        "well_name": "Offset High-Pressure Probe M-15",
        "field": "Synthetic Deomali Sector",
        "latitude": BASE_LAT + 0.0330,
        "longitude": BASE_LON + 0.0450,
        "spud_date": "2023-10-04",
        "total_depth": 4010.0,
        "current_depth": 4010.0,
        "formation": "Kopili Shale Formation",
        "status": "SUSPENDED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 5.80,
        "similarity_score": 0.63,
        "similarity_label": "63%",
        "major_event": "Overpressure Ramp at 3,710 m"
    },
    {
        "id": "WELL-P-18",
        "well_name": "Offset Structural Test P-18",
        "field": "Synthetic Hapjan Sector",
        "latitude": BASE_LAT - 0.0360,
        "longitude": BASE_LON - 0.0450,
        "spud_date": "2021-05-19",
        "total_depth": 4200.0,
        "current_depth": 4200.0,
        "formation": "Kopili Shale Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 6.30,
        "similarity_score": 0.58,
        "similarity_label": "58%",
        "major_event": "Wellbore Cavings at 3,820 m"
    },
    {
        "id": "WELL-Q-21",
        "well_name": "Offset Deep Gas Wildcat Q-21",
        "field": "Synthetic Deomali Sector",
        "latitude": BASE_LAT + 0.0610,
        "longitude": BASE_LON - 0.0190,
        "spud_date": "2022-04-11",
        "total_depth": 4650.0,
        "current_depth": 4650.0,
        "formation": "Jaintia Limestone / ABC Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 7.20,
        "similarity_score": 0.52,
        "similarity_label": "52%",
        "major_event": "Gas Kick at 4,310 m"
    },
    {
        "id": "WELL-R-10",
        "well_name": "Offset Western Boundary R-10",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT - 0.0070,
        "longitude": BASE_LON - 0.0520,
        "spud_date": "2023-08-14",
        "total_depth": 3740.0,
        "current_depth": 3740.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 5.40,
        "similarity_score": 0.77,
        "similarity_label": "77%",
        "major_event": "Mud Loss Seepage at 3,420 m"
    },
    {
        "id": "WELL-S-07",
        "well_name": "Offset Horizon Delineator S-07",
        "field": "Synthetic Hapjan Sector",
        "latitude": BASE_LAT + 0.0260,
        "longitude": BASE_LON - 0.0560,
        "spud_date": "2024-04-03",
        "total_depth": 3910.0,
        "current_depth": 3910.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 6.20,
        "similarity_score": 0.74,
        "similarity_label": "74%",
        "major_event": "Stick-Slip Vibration at 3,380 m"
    },
    {
        "id": "WELL-T-16",
        "well_name": "Offset Northern Fault Block T-16",
        "field": "Synthetic Deomali Sector",
        "latitude": BASE_LAT + 0.0470,
        "longitude": BASE_LON + 0.0360,
        "spud_date": "2021-11-28",
        "total_depth": 3830.0,
        "current_depth": 3830.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 6.40,
        "similarity_score": 0.72,
        "similarity_label": "72%",
        "major_event": "Tight Spot on Connection at 3,410 m"
    },
    {
        "id": "WELL-V-01",
        "well_name": "Offset Regional Exploration V-01",
        "field": "Synthetic Hapjan Sector",
        "latitude": BASE_LAT - 0.0590,
        "longitude": BASE_LON - 0.0340,
        "spud_date": "2020-07-09",
        "total_depth": 4510.0,
        "current_depth": 4510.0,
        "formation": "Jaintia Limestone / ABC Formation",
        "status": "PLUGGED & ABANDONED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 7.80,
        "similarity_score": 0.49,
        "similarity_label": "49%",
        "major_event": "Lost Returns at 4,280 m"
    },
    {
        "id": "WELL-W-13",
        "well_name": "Offset South-East Flank W-13",
        "field": "Synthetic Exploration Block-4",
        "latitude": BASE_LAT - 0.0370,
        "longitude": BASE_LON + 0.0430,
        "spud_date": "2023-03-27",
        "total_depth": 3860.0,
        "current_depth": 3860.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "status": "COMPLETED",
        "operator": "Synthetic E&P Demo Corp",
        "is_active": False,
        "distance_km": 5.90,
        "similarity_score": 0.75,
        "similarity_label": "75%",
        "major_event": "Minor Seepage at 3,460 m"
    }
]

# 3. Documents (Exactly 48 documents across WCR, DDR, Mud Logs, Casing, Cementing, Geological)
DOCUMENTS = [
    {
        "id": "DOC-DDR-2024-017",
        "document_name": "DDR-2024-017_WELL-B-03_Daily_Drilling_Report.pdf",
        "well_id": "WELL-B-03",
        "document_type": "DDR",
        "date": "2024-08-17",
        "depth_interval": "3,400m - 3,520m",
        "processed": True,
        "source_type": "Synthetic Demonstration Document",
        "summary": "Daily drilling report for WELL-B-03 covering 12-1/4 inch hole section through Barail Sandstone / XYZ Formation. Records severe lost circulation event at 3,440m with 48 bbl/hr mud loss and pumping of 50 bbl high-fluid-loss LCM pill.",
        "file_size_kb": 312,
        "page_count": 6,
        "extracted_parameters": {
            "well": "WELL-B-03",
            "date": "2024-08-17",
            "interval_md": "3400.0 - 3520.0 m",
            "formation": "Barail Sandstone / XYZ Formation",
            "mud_type": "Water-Based Glycol Polymer (WBM)",
            "mud_weight_sg": 1.30,
            "flow_rate_gpm": 540,
            "standpipe_pressure_psi": 2650,
            "wob_klbs": 26.5,
            "rpm": 125,
            "losses_recorded": "48 bbl/hr dynamic loss at 3,440m",
            "lcm_pill_pumped": "50 bbl (30 ppb coarse CaCO3 + 15 ppb nutshells + 5 ppb fiber)",
            "outcome": "Stabilized at 4 bbl/hr, safe drilling resumed"
        },
        "content_text": """
========================================================================================
[SYNTHETIC DEMONSTRATION DOCUMENT - NOT ACTUAL OIL INDIA LIMITED DATA]
OPERATOR: SYNTHETIC E&P DEMO CORP
DAILY DRILLING REPORT (DDR) #17 | WELL: WELL-B-03
FIELD: SYNTHETIC EXPLORATION BLOCK-4 | RIG: SYNTHETIC HORIZON RIG-04
DATE: 17-AUG-2024 | REPORT TIME: 06:00 HRS - 06:00 HRS (24 HR PERIOD)
CURRENT DEPTH: 3,520.0 m MD / 3,248.0 m TVD | MIDNIGHT DEPTH: 3,400.0 m MD
========================================================================================

SECTION SUMMARY:
- Hole Size: 12-1/4 inch
- Formation at bit: Barail Sandstone / XYZ Formation (Top penetrated at 2,985m)
- Lithology: Interbedded hard sandstone, micro-fractured reservoir facies, coal stringers

DRILLING DRIFT / OPERATIONS LOG:
06:00 - 11:30: Rotary drilling 12-1/4" hole from 3,400m to 3,440m with WOB 26 klbs, RPM 125, SPP 2650 psi, GPM 540.
11:30 - 12:15: EVENT OCCURRENCE - At 3,440m depth, sudden drop in pit volume observed (-62 bbls in 40 mins).
               Flow paddle dropped from 100% to 55%. Calculated loss rate: 48 bbl/hr into Barail XYZ natural fracture network.
12:15 - 13:00: Ceased drilling, picked up off bottom to 3,415m. Monitored annulus: well static with pumps off.
13:00 - 15:30: Mixed 50 bbl engineered high-fluid-loss LCM pill:
               - 30 ppb coarse calcium carbonate
               - 15 ppb walnut shells (medium/coarse blend)
               - 5 ppb cellulosic bridging fiber
15:30 - 17:00: Displaced LCM pill through bit nozzles at 200 gpm, squeezed 15 bbls into loss zone at 250 psi surface pressure.
17:00 - 19:30: Soaked pill for 2.5 hours. Re-established circulation at 350 gpm with 100% returns.
19:30 - 06:00: Washed back to bottom, resumed drilling with 1.26 SG mud weight to 3,520m. Dynamic loss controlled at <4 bbl/hr.

MUD PARAMETERS:
- Mud Weight: 1.30 SG reduced to 1.26 SG
- Funnel Viscosity: 52 sec/qt
- Plastic Viscosity: 22 cP | Yield Point: 24 lb/100ft2
- API Fluid Loss: 5.2 cc/30min
- Chlorides: 38,000 mg/L

ENGINEER SIGN-OFF:
Lead Drilling Engineer: R. Barua (Synthetic Demo) | Rig Superintendent: M. Ahmed
        """
    },
    {
        "id": "DOC-DDR-2023-112",
        "document_name": "DDR-2023-112_WELL-C-07_Daily_Drilling_Report.pdf",
        "well_id": "WELL-C-07",
        "document_type": "DDR",
        "date": "2023-12-04",
        "depth_interval": "3,350m - 3,480m",
        "processed": True,
        "source_type": "Synthetic Demonstration Document",
        "summary": "Daily drilling report for WELL-C-07 documenting extreme torque surges and stick-slip oscillations at 3,390m in Barail Sandstone / XYZ Formation.",
        "file_size_kb": 288,
        "page_count": 5,
        "extracted_parameters": {
            "well": "WELL-C-07",
            "date": "2023-12-04",
            "interval_md": "3350.0 - 3480.0 m",
            "formation": "Barail Sandstone / XYZ Formation",
            "mud_type": "Synthetic Ester-Based OBM",
            "mud_weight_sg": 1.28,
            "torque_kft_lbs": "Spiked to 28.2 kft-lbs",
            "event": "Torque Surge / Stick-Slip",
            "action": "Pumped 25 bbl polymer bead pill, adjusted WOB/RPM"
        },
        "content_text": """
========================================================================================
[SYNTHETIC DEMONSTRATION DOCUMENT - NOT ACTUAL OIL INDIA LIMITED DATA]
OPERATOR: SYNTHETIC E&P DEMO CORP
DAILY DRILLING REPORT (DDR) #112 | WELL: WELL-C-07
FIELD: SYNTHETIC EXPLORATION BLOCK-4 | RIG: EXPLORER VII
DATE: 04-DEC-2023 | CURRENT DEPTH: 3,480.0 m MD
========================================================================================

INTERVAL ANALYSIS:
Depth 3,390m - Barail Sandstone XYZ Formation. Hard abrasive sandstone lenses causing severe top-drive motor stall.
Rotary torque peaked at 28.2 kft-lbs (maximum allowable 30 kft-lbs). MWD telemetry recorded stick-slip severity index >85%.

REMEDIATION:
Pumping 25 bbl lubricity pill containing copolymer beads. Reduced WOB from 32 klbs to 18 klbs and raised string rotation to 140 RPM.
Torque dampened to smooth 16 kft-lbs.
        """
    },
    {
        "id": "DOC-DDR-2024-045",
        "document_name": "DDR-2024-045_WELL-E-11_Daily_Drilling_Report.pdf",
        "well_id": "WELL-E-11",
        "document_type": "DDR",
        "date": "2024-03-22",
        "depth_interval": "3,410m - 3,500m",
        "processed": True,
        "source_type": "Synthetic Demonstration Document",
        "summary": "Report on total mud loss and well control standby at 3,460m in WELL-E-11.",
        "file_size_kb": 340,
        "page_count": 6,
        "extracted_parameters": {
            "well": "WELL-E-11",
            "date": "2024-03-22",
            "interval_md": "3410.0 - 3500.0 m",
            "formation": "Barail Sandstone / XYZ Formation",
            "mud_weight_sg": 1.32,
            "event": "Total Mud Loss (85 bbl loss)",
            "action": "Spotted 80 bbl cross-linked polymer pill + gunk plug"
        },
        "content_text": """
========================================================================================
[SYNTHETIC DEMONSTRATION DOCUMENT - NOT ACTUAL OIL INDIA LIMITED DATA]
OPERATOR: SYNTHETIC E&P DEMO CORP
DAILY DRILLING REPORT #45 | WELL: WELL-E-11
DATE: 22-MAR-2024 | DEPTH: 3,500.0 m MD
========================================================================================

Total fluid loss encountered at 3,460m upon drilling through faulted boundary of Barail XYZ sand.
Returns dropped to zero. Pit dropped 85 bbls. Spotted 80 bbl high viscosity crosslinked gel pill.
Successfully tagged top of plug and restored full circulation.
        """
    },
    {
        "id": "DOC-WCR-2022-088",
        "document_name": "WCR-2022-088_WELL-D-02_Well_Completion_Report.pdf",
        "well_id": "WELL-D-02",
        "document_type": "WCR",
        "date": "2022-11-15",
        "depth_interval": "0m - 4,410m",
        "processed": True,
        "source_type": "Synthetic Demonstration Document",
        "summary": "Comprehensive Well Completion Report for WELL-D-02 detailing deep drilling hazards, stuck pipe incidents at 3,610m, and formation evaluation across Jaintia Limestone.",
        "file_size_kb": 890,
        "page_count": 48,
        "extracted_parameters": {
            "well": "WELL-D-02",
            "total_depth_md": "4,410.0 m",
            "spud_date": "2022-09-05",
            "completion_date": "2022-11-10",
            "primary_hazards": "Stuck pipe at 3610m, Jaintia carbonate vug losses"
        },
        "content_text": """
========================================================================================
[SYNTHETIC DEMONSTRATION DOCUMENT - NOT ACTUAL OIL INDIA LIMITED DATA]
WELL COMPLETION REPORT (WCR) | WELL: WELL-D-02
FIELD: SYNTHETIC HAPJAN SECTOR | TOTAL DEPTH: 4,410.0 m MD
========================================================================================

FINAL GEOLOGICAL & DRILLING REVIEW:
Well spudded on 05-SEP-2022 and reached TD of 4,410m in Jaintia Limestone.
Key operational bottleneck occurred at 3,610m with differential and mechanical stuck pipe during wiper trip.
Jarred for 6 hours with 90 klbs downward impact after spotting organic freeing agent.
        """
    },
    {
        "id": "DOC-ML-2024-019",
        "document_name": "ML-2024-019_WELL-B-03_Mud_Log_Barail.pdf",
        "well_id": "WELL-B-03",
        "document_type": "Mud Log",
        "date": "2024-08-18",
        "depth_interval": "3,400m - 3,600m",
        "processed": True,
        "source_type": "Synthetic Demonstration Document",
        "summary": "Mud logging evaluation log recording total gas readings, lithology percentage, rate of penetration (ROP), and fracture indicators across Barail Sandstone.",
        "file_size_kb": 420,
        "page_count": 8,
        "extracted_parameters": {
            "well": "WELL-B-03",
            "formation": "Barail Sandstone / XYZ Formation",
            "gas_peaks": "C1-C4 chromatograph peaks at 3438-3444m",
            "rop_m_hr": "Spike from 4.5 m/hr to 18 m/hr (drilling break)"
        },
        "content_text": """
========================================================================================
[SYNTHETIC DEMONSTRATION DOCUMENT - NOT ACTUAL OIL INDIA LIMITED DATA]
MUD LOGGING REPORT | WELL: WELL-B-03 | INTERVAL: 3400m - 3600m
========================================================================================
At 3,439m - 3,442m: Sharp drilling break observed (ROP surged to 18.2 m/hr).
Total gas spiked to 14.8% followed immediately by lost circulation.
Lithology: 85% quartz sandstone, sub-angular, calcareous cement with secondary calcite veins.
        """
    },
    {
        "id": "DOC-CR-2024-008",
        "document_name": "CR-2024-008_WELL-B-03_9_5_8_Casing_Report.pdf",
        "well_id": "WELL-B-03",
        "document_type": "Casing Report",
        "date": "2024-07-28",
        "depth_interval": "2,950m Casing Shoe",
        "processed": True,
        "source_type": "Synthetic Demonstration Document",
        "summary": "Casing and cementing report for 9-5/8 inch intermediate casing string set at 2,950m at top of Barail Formation.",
        "file_size_kb": 210,
        "page_count": 4,
        "extracted_parameters": {
            "well": "WELL-B-03",
            "casing_size": "9-5/8 inch, 47 lb/ft L-80",
            "shoe_depth": "2,950m MD",
            "fit_lot_emw": "1.52 SG equivalent mud weight"
        },
        "content_text": """
========================================================================================
[SYNTHETIC DEMONSTRATION DOCUMENT - NOT ACTUAL OIL INDIA LIMITED DATA]
CASING & CEMENTING SUMMARY | WELL: WELL-B-03 | 9-5/8" INTERMEDIATE STRING
========================================================================================
Casing set at 2,950m MD right above Barail formation entrance.
Formation Integrity Test (FIT) conducted to 1.52 SG equivalent mud weight without leak-off.
        """
    },
    {
        "id": "DOC-GEO-2024-012",
        "document_name": "GEO-2024-012_Block4_Barail_Correlation.pdf",
        "well_id": "WELL-A-01",
        "document_type": "Geological Report",
        "date": "2026-08-01",
        "depth_interval": "3,000m - 3,700m",
        "processed": True,
        "source_type": "Synthetic Demonstration Document",
        "summary": "Pre-drill geological prognosis and stratigraphic correlation study for WELL-A-01 tying into offset wells WELL-B-03 and WELL-C-07.",
        "file_size_kb": 560,
        "page_count": 14,
        "extracted_parameters": {
            "target_well": "WELL-A-01",
            "predicted_barail_top": "2,975m MD",
            "predicted_hazard_window": "3,400m - 3,475m MD",
            "offset_analogs": "WELL-B-03, WELL-C-07, WELL-E-11"
        },
        "content_text": """
========================================================================================
[SYNTHETIC DEMONSTRATION DOCUMENT - NOT ACTUAL OIL INDIA LIMITED DATA]
PRE-DRILL GEOLOGICAL PROGNOSIS | BLOCK-4 EXPLORATION | WELL-A-01
========================================================================================
Seismic correlation indicates prominent fault-bounded anticline.
The Barail XYZ reservoir facies at ~3,400-3,460m displays high amplitude seismic anomalies matching
the fractured loss interval observed in WELL-B-03 (2.69 km NE) and torque anomalies in WELL-C-07 (3.95 km SW).
        """
    }
]

# Generate synthetic documents to reach exactly 48 documents
doc_counter = 8
for well in WELLS[1:]:
    w_id = well["id"]
    doc_types = ["DDR", "Mud Log", "Casing Report", "Geological Report", "Drilling Report", "Cementing Report"]
    for sub in range(2):
        if len(DOCUMENTS) >= 48:
            break
        dtype = doc_types[(doc_counter + sub) % len(doc_types)]
        DOCUMENTS.append({
            "id": f"DOC-{dtype[:3].upper()}-SYN-{doc_counter:03d}",
            "document_name": f"{dtype[:3].upper()}-2024-{doc_counter:03d}_{w_id}_Operational_Log.pdf",
            "well_id": w_id,
            "document_type": dtype,
            "date": f"202{3 + (doc_counter % 2)}-{(doc_counter % 12) + 1:02d}-15",
            "depth_interval": f"{3000 + ((doc_counter % 10) * 40)}m - {3300 + ((doc_counter % 10) * 40)}m",
            "processed": True,
            "source_type": "Synthetic Demonstration Document",
            "summary": f"Historical {dtype} report for synthetic offset well {w_id} covering section operations and parameters.",
            "file_size_kb": 180 + (doc_counter * 6),
            "page_count": 3 + (doc_counter % 5),
            "extracted_parameters": {
                "well": w_id,
                "report_type": dtype,
                "monitored_depth": f"{3200 + ((doc_counter % 10) * 30)}m",
                "status": "Verified synthetic historical record"
            },
            "content_text": f"""
========================================================================================
[SYNTHETIC DEMONSTRATION DOCUMENT - NOT ACTUAL OIL INDIA LIMITED DATA]
OPERATIONAL REPORT: {dtype} | WELL: {w_id}
========================================================================================
Routine operational log for synthetic offset well {w_id} recording drilling parameters,
lithological evaluation, and telemetry through {well['formation']}.
All operational limits maintained within synthetic tolerance standards.
            """
        })
        doc_counter += 1

# 4. Historical Events (Exactly 116 Events)
EVENTS = [
    # Key anchor events matching demo story
    {
        "id": "EVT-2024-017-01",
        "well_id": "WELL-B-03",
        "date": "2024-08-17",
        "depth": 3440.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "event_type": "Mud Loss",
        "severity": "HIGH",
        "description": "Severe dynamic lost circulation of 48 bbl/hr encountered while penetrating fractured Barail Sandstone at 3,440m with 1.30 SG water-based mud. Pit volume decreased by 62 bbls within 40 minutes.",
        "action_taken": "Halted rotary drilling immediately. Pulled off bottom to 3,415m. Mixed and pumped 50 bbl engineered high-fluid-loss LCM pill (30 ppb coarse calcium carbonate + 15 ppb walnut shells + 5 ppb cellulosic fiber). Squeezed into loss zone at 250 psi.",
        "outcome": "Loss rate stabilized down to 4 bbl/hr after 3 hours soaking. Resumed drilling with LCM sweep in active system and adjusted mud weight to 1.26 SG.",
        "document_id": "DOC-DDR-2024-017",
        "document_type": "DDR",
        "page_number": 4
    },
    {
        "id": "EVT-2023-112-01",
        "well_id": "WELL-C-07",
        "date": "2023-12-04",
        "depth": 3390.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "event_type": "Torque Surge",
        "severity": "MEDIUM",
        "description": "Erratic rotary torque surging from 14.5 kft-lbs to 28.2 kft-lbs while drilling through interbedded sandstone stringers at 3,390m. Significant stick-slip oscillations observed on MWD surface telemetry.",
        "action_taken": "Reduced WOB from 32 klbs to 18 klbs and increased RPM from 110 to 140. Pumped 25 bbl lubricity-enhancing polymer bead pill and performed short trip 6 stands off bottom.",
        "outcome": "Stick-slip reduced from 85% to 15%. Smooth drilling torque re-established at 16.2 kft-lbs.",
        "document_id": "DOC-DDR-2023-112",
        "document_type": "DDR",
        "page_number": 3
    },
    {
        "id": "EVT-2024-045-01",
        "well_id": "WELL-E-11",
        "date": "2024-03-22",
        "depth": 3460.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "event_type": "Total Mud Loss",
        "severity": "HIGH",
        "description": "Total loss of returns (dry drilling) at 3,460m upon penetrating sub-seismic fault plane within Barail XYZ horizon. Flow paddle indicated 0% returns, pit dropped 85 bbl.",
        "action_taken": "Stopped pumps, pulled back inside previous 9-5/8 inch casing shoe. Spotted 80 bbl cross-linked polymer pill followed by high-solid bentonite-diesel oil plug. Squeezed 300 psi.",
        "outcome": "Borehole integrity restored with 1.34 SG equivalent mud window. Re-entered hole and washed to bottom successfully.",
        "document_id": "DOC-DDR-2024-045",
        "document_type": "DDR",
        "page_number": 2
    },
    {
        "id": "EVT-2022-088-01",
        "well_id": "WELL-D-02",
        "date": "2022-10-14",
        "depth": 3610.0,
        "formation": "Jaintia Limestone / ABC Formation",
        "event_type": "Stuck Pipe",
        "severity": "CRITICAL",
        "description": "Mechanically stuck bottom-hole assembly (BHA) at 3,610m during wiper trip following 24-hr logging run. Overpull exceeded 120 klbs above string weight with zero rotation or downward movement.",
        "action_taken": "Pumped 40 bbl organic pipe-freeing solvent pill and allowed 4 hours soak time. Rigged up hydraulic jar and jarred downward at 90 klbs impact force while applying left-hand torque.",
        "outcome": "String freed after 6 hours jarring operations. Reamed tight section with high-viscosity sweeps before continuing trip.",
        "document_id": "DOC-WCR-2022-088",
        "document_type": "WCR",
        "page_number": 12
    },
    {
        "id": "EVT-2024-072-01",
        "well_id": "WELL-N-02",
        "date": "2024-07-19",
        "depth": 3435.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "event_type": "Mud Loss Seepage",
        "severity": "MEDIUM",
        "description": "Seepage losses escalating to 25 bbl/hr at 3,435m during bit trip in Barail Sandstone upper member.",
        "action_taken": "Added 20 ppb medium nut plug to active pit system and reduced pump discharge pressure.",
        "outcome": "Loss rate brought down to 3 bbl/hr; acceptable seepage level maintained.",
        "document_id": "DOC-DDR-2024-072",
        "document_type": "DDR",
        "page_number": 1
    },
    {
        "id": "EVT-2023-054-01",
        "well_id": "WELL-F-05",
        "date": "2023-05-18",
        "depth": 3410.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "event_type": "Gas Influx",
        "severity": "HIGH",
        "description": "Well kicked while drilling at 3,410m. Pit gain of 18 bbl detected with 380 psi SIDPP and 450 psi SICP. Background gas spiked to 42%.",
        "action_taken": "Executed hard shut-in using annular preventer. Circulated out gas bubble with 1.34 SG kill mud via choke manifold.",
        "outcome": "Well killed cleanly in 1.5 circulations without secondary influx. Gas levels returned to baseline 1.2%.",
        "document_id": "DOC-DDR-2023-054",
        "document_type": "DDR",
        "page_number": 5
    },
    {
        "id": "EVT-2024-098-01",
        "well_id": "WELL-H-14",
        "date": "2024-10-11",
        "depth": 3425.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "event_type": "Torque Fluctuation",
        "severity": "MEDIUM",
        "description": "High cyclic drag and torque fluctuation exceeding 22 kft-lbs at 3,425m during slide drilling mode.",
        "action_taken": "Switched from sliding to rotary steerable mode, pumped lubricating graphite beads pill.",
        "outcome": "Torque dropped to 13.5 kft-lbs, toolface control regained.",
        "document_id": "DOC-DDR-2024-098",
        "document_type": "DDR",
        "page_number": 3
    },
    {
        "id": "EVT-2021-032-01",
        "well_id": "WELL-G-09",
        "date": "2021-09-24",
        "depth": 3720.0,
        "formation": "Kopili Shale Formation",
        "event_type": "Shale Sloughing",
        "severity": "HIGH",
        "description": "Heavy sloughing shale cavings over shakers (>8 tons cavings/hr). Splintery and blocky cavings indicated high horizontal tectonic stress.",
        "action_taken": "Elevated mud weight from 1.32 to 1.38 SG and treated system with 3% glycol shale inhibitor.",
        "outcome": "Cavings volume reduced by 75%; hole stabilized for casing run.",
        "document_id": "DOC-WCR-2021-032",
        "document_type": "WCR",
        "page_number": 8
    },
    {
        "id": "EVT-2023-140-01",
        "well_id": "WELL-I-04",
        "date": "2023-08-30",
        "depth": 3450.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "event_type": "Mud Loss Seepage",
        "severity": "MEDIUM",
        "description": "Seepage losses of 18 bbl/hr noted at 3,450m when tripping into hole with new PDC bit.",
        "action_taken": "Circulated bottoms-up with 25 ppb fine graphite LCM pill at reduced flow rate (380 gpm).",
        "outcome": "Losses fully cured prior to resuming drilling.",
        "document_id": "DOC-DDR-2023-140",
        "document_type": "DDR",
        "page_number": 2
    },
    {
        "id": "EVT-2024-015-01",
        "well_id": "WELL-U-22",
        "date": "2024-12-05",
        "depth": 3415.0,
        "formation": "Barail Sandstone / XYZ Formation",
        "event_type": "Pack-Off",
        "severity": "HIGH",
        "description": "Sudden standpipe pressure spike from 2,800 psi to 3,950 psi indicating annular pack-off around stabilizers at 3,415m.",
        "action_taken": "Shut down mud pumps instantly. Worked drill string up and down with maximum allowable pull (60 klbs) while pulsing pump.",
        "outcome": "Pack-off broken within 15 minutes; circulated large cutting beds out of hole.",
        "document_id": "DOC-DDR-2024-015",
        "document_type": "DDR",
        "page_number": 4
    }
]

EVENT_POOL = [
    ("Mud Loss", "LOW", "Minor seepage of 6 bbl/hr in porous sandstone.", "Treated with 10 ppb fine calcium carbonate.", "Seepage arrested."),
    ("Mud Loss", "MEDIUM", "Partial returns loss of 22 bbl/hr in micro-fractured section.", "Spotted 35 bbl mica LCM pill.", "Returns restored to 95%."),
    ("Mud Loss", "HIGH", "Dynamic lost circulation of 50 bbl/hr with rapid pit decrease.", "Pushed 60 bbl combo LCM pill (nutshell + mica).", "Stabilized at 5 bbl/hr."),
    ("Torque Increase", "LOW", "Minor torque ripple of 3 kft-lbs.", "Adjusted RPM by +15.", "Torque smoothed."),
    ("Torque Increase", "MEDIUM", "Severe torque surging and stick-slip oscillations.", "Pumped 20 bbl polymer bead pill.", "Drilling torque normalized."),
    ("Tight Hole", "LOW", "15 klbs drag on connection.", "Washed and reamed connection interval.", "Clear passage established."),
    ("Tight Hole", "MEDIUM", "35 klbs overpull on pulling out of hole.", "Short trip with high-vis pill.", "Hole condition improved."),
    ("Gas Influx", "MEDIUM", "Pit gain of 8 bbl with connection gas spike to 18%.", "Shut in on annular, circulated through degasser.", "Circulated clean with 0.04 SG mud weight increment."),
    ("Pack-Off", "MEDIUM", "Standpipe pressure increased by 650 psi with loss of rotation.", "Reciprocated pipe and staged pump rate.", "Annular channel cleared."),
    ("Vibration / Shocks", "MEDIUM", "High lateral and axial vibrations detected by downhole MWD tool.", "Reduced RPM to avoid resonant frequency.", "Vibrations dampened below alarm limits.")
]

# Generate synthetic events to reach exactly 116 total events
ev_idx = 11
while len(EVENTS) < 116:
    target_well = WELLS[(ev_idx % (len(WELLS) - 1)) + 1]
    w_id = target_well["id"]
    tot_d = target_well["total_depth"]
    step_ratio = ((ev_idx % 5) + 1) / 6.0
    ev_depth = round(tot_d * step_ratio, 0)
    
    if ev_depth < 850:
        fmt_name = "Dihing / Alluvium Formation"
    elif ev_depth < 2100:
        fmt_name = "Tipam Sandstone Formation"
    elif ev_depth < 2950:
        fmt_name = "Bokabil Formation"
    elif ev_depth < 3650:
        fmt_name = "Barail Sandstone / XYZ Formation"
    elif ev_depth < 3950:
        fmt_name = "Kopili Shale Formation"
    else:
        fmt_name = "Jaintia Limestone / ABC Formation"
        
    tpl = EVENT_POOL[ev_idx % len(EVENT_POOL)]
    EVENTS.append({
        "id": f"EVT-SYN-{ev_idx:04d}",
        "well_id": w_id,
        "date": f"202{3 + (ev_idx % 2)}-{(ev_idx % 12) + 1:02d}-{(ev_idx % 27) + 1:02d}",
        "depth": ev_depth,
        "formation": fmt_name,
        "event_type": tpl[0],
        "severity": tpl[1],
        "description": f"{tpl[2]} Recorded in synthetic well {w_id} at {ev_depth:.0f}m within {fmt_name}.",
        "action_taken": tpl[3],
        "outcome": tpl[4],
        "document_id": f"DOC-DDR-SYN-{(ev_idx % 40) + 8:03d}",
        "document_type": "DDR",
        "page_number": (ev_idx % 5) + 1
    })
    ev_idx += 1

# 5. Trajectories
TRAJECTORIES = {}
for w in WELLS:
    w_id = w["id"]
    tot_d = w["total_depth"]
    pts = []
    steps = int(tot_d // 250) + 1
    is_deviated = ("B-03" in w_id or "C-07" in w_id or "E-11" in w_id or "N-02" in w_id)
    for i in range(steps):
        md = min(i * 250.0, tot_d)
        if md < 800.0 or not is_deviated:
            inc = 0.5 + (i * 0.1) if not is_deviated else 0.8
            tvd = md * 0.999
            dls = 0.1
        elif md < 2400.0:
            inc = 14.5 + (md - 800.0) * 0.012
            tvd = md * 0.965
            dls = 1.2
        else:
            inc = 28.0 + math.sin(md / 300.0) * 2.0
            tvd = md * 0.920
            dls = 0.8
        az = 45.0 + (hash(w_id) % 90)
        pts.append({
            "md": round(md, 1),
            "tvd": round(tvd, 1),
            "inclination": round(inc, 2),
            "azimuth": round(az, 1),
            "dogleg_severity": round(dls, 2)
        })
    TRAJECTORIES[w_id] = pts

# 6. Risk Rules Definition
RISK_RULES = {
    "engine_name": "Multi-Factor Spatial-Stratigraphic Risk Signal Engine",
    "version": "1.1-SIH26121",
    "status_levels": ["NORMAL", "WATCH", "REVIEW REQUIRED"],
    "categories": [
        {"name": "Mud Loss", "keywords": ["Mud Loss", "Lost Circulation", "Seepage", "Thief Zone"]},
        {"name": "Kick / Gas Influx", "keywords": ["Kick", "Gas Influx", "Gas", "Flow", "Well Control"]},
        {"name": "Stuck Pipe", "keywords": ["Stuck Pipe", "Differential Sticking", "Overpull", "Jarring"]},
        {"name": "Torque / Drag", "keywords": ["Torque", "Drag", "Stick-Slip", "Tight Hole", "Vibration"]},
        {"name": "Casing & Shoe Integrity", "keywords": ["Casing", "Shoe", "FIT", "LOT", "Wear"]},
        {"name": "Cementing Quality", "keywords": ["Cementing", "Channeling", "Micro-Annulus", "Squeeze"]},
        {"name": "Formation & Instability Risk", "keywords": ["Instability", "Cavings", "Washout", "Pack-Off", "Breakout"]}
    ],
    "similarity_weights": {
        "distance": 0.45,
        "formation_match": 0.35,
        "depth_proximity": 0.20
    }
}

# Write files
with open(os.path.join(DATA_DIR, "formations.json"), "w", encoding="utf-8") as f:
    json.dump(FORMATIONS, f, indent=2)

with open(os.path.join(DATA_DIR, "wells.json"), "w", encoding="utf-8") as f:
    json.dump(WELLS, f, indent=2)

with open(os.path.join(DATA_DIR, "documents.json"), "w", encoding="utf-8") as f:
    json.dump(DOCUMENTS, f, indent=2)

with open(os.path.join(DATA_DIR, "events.json"), "w", encoding="utf-8") as f:
    json.dump(EVENTS, f, indent=2)

with open(os.path.join(DATA_DIR, "trajectories.json"), "w", encoding="utf-8") as f:
    json.dump(TRAJECTORIES, f, indent=2)

with open(os.path.join(DATA_DIR, "risk_rules.json"), "w", encoding="utf-8") as f:
    json.dump(RISK_RULES, f, indent=2)

print(f"Generated synthetic dataset in {DATA_DIR}:")
print(f"- Wells: {len(WELLS)}")
print(f"- Formations: {len(FORMATIONS)}")
print(f"- Historical Events: {len(EVENTS)}")
print(f"- Historical Documents: {len(DOCUMENTS)}")
