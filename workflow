==================================================================================================================================
 [ STAGE 1: FARMER EDGE ]                [ STAGE 3: CLOUD & SPATIAL ENGINE ]                 [ STAGE 4: FINTECH & LOGISTICS ]
==================================================================================================================================

[ FIELD (100% OFFLINE) ]
        │
[ Audio Mic ] ──> (Saves .ogg to File System) 
        │         (Writes file_path to SQLite)
[ TFLite ] ─────> (Visual Grade A/B/C UI Hint)
        │
[ WorkManager ] ─(Waits for 4G)──┐
                                 │
                                 ▼
                     [ FastAPI Ingestion Gate ] ──────> [ Bhashini Gov API ] (Async Audio->JSON)
                                 │
                                 ▼
                         [ PostgreSQL DB ] (Table: micro_lots, Status: Pending)

==================================================================================================================================
 [ STAGE 2: VLE HUB (PHYSICAL INGESTION) ]
==================================================================================================================================
        │
[ Scan Farmer QR ] ──> [ AgriStack Sandbox ] (Verifies ID/Land)
        │
[ BLE Digital Scale ] ──> [ Gross Weight ]
        │                       │
[ VLE Manual Input ] ───> [ Bag Count (Tare Deduction) ] + [ Pin-Moisture Meter % ] + [ Visual Grade Confirm ]
        │                       │
[ App Computes ] ───────> (Net Weight = Gross - (Bags * 1.2kg))
                                │
[ Network Check ] ──────────────┤
        │                       ├──> [ IF 4G FAILS: Wi-Fi Direct Tunnel to Driver's Phone ] ──┐
        ▼                       │                                                             │
[ API Payload ] ────────────────┴─────────────────────────────────────────────────────────────┘
        │
        ▼
[ PostgreSQL DB ] (Table: micro_lots, Status: Hub_Verified, Added: Moisture_Tier)

==================================================================================================================================
 [ STAGE 3: SPATIAL POOLING & NODAL ESCROW ] (Runs every 5 mins via Background Worker)
==================================================================================================================================
        │
[ H3 Hexagon Index ] ──> (Groups by: H3_ID + Crop_ID + Moisture_Tier + Grade) -- Prevents Rot Contamination
        │
[ Route Cache DB ] ────> (Checks if drive time is cached. If Miss -> Queries Ola Maps API)
        │
[ Batch Created ] ─────> (5-Ton dispatch_id generated)
        │
        ▼
[ B2B Buyer Nodal Wallet ] ──> (Pre-funded ICICI/RazorpayX Wallet. Deducts 60% Advance instantly)
        │
[ Nodal Bank API ] ──────────> (Pushes 60% IMPS/UPI directly to Farmer VPA) -> Returns HTTP 200
        │
[ PostgreSQL DB ] (Status: Advance_Paid)

==================================================================================================================================
 [ STAGE 4: TRANSPORTER DISPATCH & TELEMETRY ]
==================================================================================================================================
        │
[ Fleet API Integration ] ──> (Pushes load to Transporter via Vahak/BlackBuck API -> Generates E-Way Bill)
        │
[ Assigned Driver App ] ────> (Requires: REQUEST_IGNORE_BATTERY_OPTIMIZATIONS)
        │                     (Runs Foreground Service: "Demeter Active Transit")
        ▼
[ Telemetry DB ] <─────────── (Pushes Lat/Lon every 5 mins. Audits vs. Ola Maps Polyline)

==================================================================================================================================
 [ STAGE 5: DESTINATION & DISPUTE ENGINE ]
==================================================================================================================================
        │
[ Buyer Scans Truck QR ]
        │
[ Destination Weighing ]
        │
        ├─────────────────────────────────────────────────┐
        ▼                                                 ▼
[ Match / Acceptable Shrinkage ]                  [ Weight Discrepancy > 3% ]
        │                                                 │
        │                                         [ Telemetry Audit Engine ]
        │                                                 │
        │                                                 ├──────────────────────────────┐
        │                                                 ▼                              ▼
        │                                         [ Trace Matches Route ]        [ GPS Deviated / Missing ]
        │                                         (Mathematical Moisture Loss)   (Theft/Fraud Detected)
        │                                                 │                              │
        ▼                                                 ▼                              ▼
[ Release Remaining 40% ] <───────────────────────────────┘                      [ Flag for Manual Dispute ]
(Trigger Nodal API)                                                              (Halt 40% Escrow)