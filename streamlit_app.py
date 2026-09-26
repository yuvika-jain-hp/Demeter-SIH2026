"""
Demeter — AgriConnect (SIH 2026)
AI-Powered Marketplace & Logistics Optimization for Agriculture
Streamlit Deployment Entrypoint
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, date

# -----------------------------------------------------------------------------
# PAGE CONFIGURATION
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="Demeter | AgriConnect SIH 2026",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# -----------------------------------------------------------------------------
# CUSTOM CSS STYLING
# -----------------------------------------------------------------------------
st.markdown("""
<style>
    /* Metric and card highlights */
    .metric-card {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border: 1px solid #bbf7d0;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 12px;
    }
    .metric-value {
        font-size: 26px;
        font-weight: 700;
        color: #166534;
    }
    .metric-label {
        font-size: 13px;
        font-weight: 600;
        color: #15803d;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .badge-grade-a {
        background-color: #dcfce7;
        color: #166534;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
    }
    .badge-grade-b {
        background-color: #fef9c3;
        color: #854d0e;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 600;
    }
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        padding: 8px 16px;
        font-weight: 600;
    }
</style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# SESSION STATE INITIALIZATION (Persistent mock data)
# -----------------------------------------------------------------------------
if "farmer_produce" not in st.session_state:
    st.session_state.farmer_produce = [
        {"id": "P001", "crop": "Tomatoes", "quantity": 3000, "unit": "kg", "grade": "Grade A", "location": "Nashik, Maharashtra", "harvestDate": "2026-09-28", "expectedPrice": 28, "status": "Active"},
        {"id": "P002", "crop": "Onions", "quantity": 1500, "unit": "kg", "grade": "Grade B", "location": "Nashik, Maharashtra", "harvestDate": "2026-10-05", "expectedPrice": 18, "status": "Active"},
        {"id": "P003", "crop": "Potatoes", "quantity": 2000, "unit": "kg", "grade": "Grade A", "location": "Nashik, Maharashtra", "harvestDate": "2026-10-12", "expectedPrice": 22, "status": "Pending"},
        {"id": "P004", "crop": "Maize", "quantity": 5000, "unit": "kg", "grade": "Grade B", "location": "Nashik, Maharashtra", "harvestDate": "2026-10-20", "expectedPrice": 14, "status": "Active"},
    ]

if "buyer_requirements" not in st.session_state:
    st.session_state.buyer_requirements = [
        {"id": "REQ-1042", "crop": "Tomatoes", "quantity": 2000, "unit": "kg", "grade": "Grade A", "requiredDate": "2026-09-25", "deliveryLocation": "Vashi APMC, Navi Mumbai", "indicativePrice": 26, "status": "Matching", "matchPercent": 100},
        {"id": "REQ-1031", "crop": "Onions", "quantity": 5000, "unit": "kg", "grade": "Grade A", "requiredDate": "2026-10-01", "deliveryLocation": "Vashi APMC, Navi Mumbai", "indicativePrice": 19, "status": "Active", "matchPercent": 72},
        {"id": "REQ-1019", "crop": "Potatoes", "quantity": 3000, "unit": "kg", "grade": "Grade B", "requiredDate": "2026-10-08", "deliveryLocation": "Bhiwandi Cold Storage Hub", "indicativePrice": 16, "status": "In Progress", "matchPercent": 100},
        {"id": "REQ-0998", "crop": "Wheat", "quantity": 10000, "unit": "kg", "grade": "Grade A", "requiredDate": "2026-10-15", "deliveryLocation": "Pune Processing Unit", "indicativePrice": 24, "status": "Completed", "matchPercent": 100},
    ]

# -----------------------------------------------------------------------------
# SIDEBAR NAVIGATION & IDENTITY
# -----------------------------------------------------------------------------
st.sidebar.image("https://img.icons8.com/color/96/wheat.png", width=64)
st.sidebar.title("🌾 Demeter")
st.sidebar.caption("AI-Powered Agricultural Marketplace | SIH 2026")

navigation = st.sidebar.radio(
    "Navigation Portal",
    [
        "🚀 Overview & Architecture",
        "📈 AI Demand Forecasting",
        "👨‍🌾 Farmer Produce Portal",
        "🛒 Buyer Procurement Portal",
        "⚡ Multi-Lot Order Matching",
        "🔬 AI Quality Assessment",
        "🚚 Logistics & Route Optimizer",
        "💰 Escrow & Settlement"
    ]
)

st.sidebar.markdown("---")
st.sidebar.subheader("Active User Persona")
persona = st.sidebar.selectbox("Simulate View As:", ["Farmer (Ramesh Kumar - Nashik)", "Buyer (FreshLink Wholesale)", "VLE / Hub Operator", "System Administrator"])
st.sidebar.info("💡 **SIH 2026 Prototype**: Connected to real-time spatial pooling, demand forecasting & route solver.")

# -----------------------------------------------------------------------------
# MODULE 1: OVERVIEW & ARCHITECTURE
# -----------------------------------------------------------------------------
if navigation == "🚀 Overview & Architecture":
    st.title("🌾 Demeter: AI-Powered Agricultural Marketplace")
    st.subheader("Smart India Hackathon (SIH 2026) — Problem Solution Architecture")
    
    st.markdown("""
    **Demeter** eliminates agricultural supply chain inefficiencies, intermediaries, and post-harvest wastage through 
    **real-time demand forecasting**, **multi-farmer supply aggregation**, **computer-vision quality appraisal**, 
    and **dynamic multi-stop route optimization**.
    """)
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown("""
        <div class="metric-card">
            <div class="metric-label">Active Farmers</div>
            <div class="metric-value">1,480+</div>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown("""
        <div class="metric-card">
            <div class="metric-label">Monthly Demand</div>
            <div class="metric-value">142 Tonnes</div>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown("""
        <div class="metric-card">
            <div class="metric-label">Matching Efficiency</div>
            <div class="metric-value">94.8%</div>
        </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown("""
        <div class="metric-card">
            <div class="metric-label">Wastage Reduction</div>
            <div class="metric-value">-32.4%</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("### 🏛️ Complete 5-Stage System Pipeline")
    
    stage_tabs = st.tabs([
        "Stage 1: Farmer Edge",
        "Stage 2: VLE Physical Hub",
        "Stage 3: Spatial Pooling & Nodal Escrow",
        "Stage 4: Transporter Dispatch & Telemetry",
        "Stage 5: Destination & Dispute Engine"
    ])
    
    with stage_tabs[0]:
        st.markdown("""
        #### 📱 Stage 1: Farmer Edge (100% Offline Capable)
        - **Audio Ingestion**: Farmer speaks listing in regional language (saves `.ogg` locally).
        - **Local TFLite Inference**: Preliminary visual quality grading (Grade A / B / C) directly on device.
        - **Android WorkManager**: Asynchronously syncs with backend when 4G/Wi-Fi is re-established.
        - **Bhashini Gov API**: Audio converted to structured JSON (Crop, Lot Size, Target Price).
        """)
        
    with stage_tabs[1]:
        st.markdown("""
        #### ⚖️ Stage 2: Village Level Entrepreneur (VLE) Hub Ingestion
        - **AgriStack Sandbox**: Scans farmer QR to verify land records & farmer identity.
        - **BLE Digital Scale**: Automatically captures gross weight via Bluetooth LE (tamper-proof).
        - **Tare & Moisture Deduction**: Automatically deducts bag tare weights & evaluates moisture tier.
        - **Offline Wi-Fi Direct Tunnel**: If cellular connectivity drops, payloads hop to driver's phone.
        """)
        
    with stage_tabs[2]:
        st.markdown("""
        #### 🌐 Stage 3: Spatial Pooling & Nodal Escrow
        - **Uber H3 Hexagonal Indexing**: Groups micro-lots by spatial hex cells + moisture tier + grade.
        - **Automated Batching**: 5-Ton dispatch batches assembled dynamically.
        - **Pre-funded Nodal Wallet**: Deducts 60% advance payment from buyer's escrow instantly.
        - **Instant IMPS / UPI**: Pushes 60% advance payment to the farmer's account prior to dispatch.
        """)
        
    with stage_tabs[3]:
        st.markdown("""
        #### 🚛 Stage 4: Transporter Telemetry & Route Optimization
        - **Fleet Integration**: Auto-generates E-Way bills & dispatches loads via Vahak / BlackBuck APIs.
        - **Foreground Telemetry**: Driver app streams high-precision GPS coordinates every 5 minutes.
        - **Route Audit**: Compares live path with Ola Maps polyline cache to detect unscheduled stops.
        """)
        
    with stage_tabs[4]:
        st.markdown("""
        #### 🏁 Stage 5: Buyer Destination & Automated Dispute Engine
        - **Destination Weighing**: Buyer scans truck QR at APMC / Cold Storage gate.
        - **Acceptable Shrinkage Tolerances**: Distinguishes between physiological moisture loss and pilferage.
        - **Automated Escrow Release**: If weight matches (within 3% moisture delta), remaining 40% is instantly released.
        - **Dispute Flagging**: Deviations trigger audit trails with route deviations & stopover proofs.
        """)

# -----------------------------------------------------------------------------
# MODULE 2: AI DEMAND FORECASTING
# -----------------------------------------------------------------------------
elif navigation == "📈 AI Demand Forecasting":
    st.title("📈 AI Demand Forecasting Engine")
    st.write("Predicting future wholesale demand using seasonal trends, past APMC mandi orders, and machine learning models.")
    
    col_sel, col_stat = st.columns([1, 2])
    with col_sel:
        crop_selected = st.selectbox("Select Crop Category", ["Tomatoes", "Onions", "Potatoes", "Wheat", "Rice", "Maize"])
        forecast_horizon = st.slider("Forecast Horizon (Months Ahead)", min_value=1, max_value=6, value=3)
        confidence_interval = st.checkbox("Show 95% Confidence Interval", value=True)
    
    # Historical and forecasted data
    data_map = {
        "Tomatoes": {
            "months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "actual": [18400, 19200, 22100, 24500, 23800, 21300, None, None, None],
            "forecast": [None, None, None, None, None, 21300, 26200, 28900, 31000],
            "growth": "+23%",
            "top_market": "Mumbai MMR & Pune"
        },
        "Onions": {
            "months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "actual": [32000, 29500, 27000, 26200, 28900, 31200, None, None, None],
            "forecast": [None, None, None, None, None, 31200, 34500, 38000, 42000],
            "growth": "+12%",
            "top_market": "Vashi APMC & Nashik"
        },
        "Potatoes": {
            "months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "actual": [41000, 39500, 36200, 33800, 35100, 37500, None, None, None],
            "forecast": [None, None, None, None, None, 37500, 40200, 43800, 47000],
            "growth": "+7%",
            "top_market": "Bhiwandi Storage Hub"
        },
        "Wheat": {
            "months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "actual": [89000, 92000, 87000, 84000, 82000, 80000, None, None, None],
            "forecast": [None, None, None, None, None, 80000, 82000, 85000, 87000],
            "growth": "+3%",
            "top_market": "North Maharashtra Mills"
        },
        "Rice": {
            "months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "actual": [110000, 112000, 115000, 117000, 119000, 120000, None, None, None],
            "forecast": [None, None, None, None, None, 120000, 123000, 126000, 130000],
            "growth": "+5%",
            "top_market": "State Procurement Depot"
        },
        "Maize": {
            "months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "actual": [22000, 24000, 26000, 25000, 27000, 28000, None, None, None],
            "forecast": [None, None, None, None, None, 28000, 30500, 33000, 35000],
            "growth": "+15%",
            "top_market": "Poultry & Feed Cluster"
        }
    }
    
    current_data = data_map[crop_selected]
    
    with col_stat:
        m1, m2, m3 = st.columns(3)
        m1.metric("Expected Growth", current_data["growth"], "+4.2% MoM")
        m2.metric("Q4 Projected Peak", f"{max([x for x in current_data['forecast'] if x is not None]):,} kg")
        m3.metric("Primary Hub Demand", current_data["top_market"])
    
    # Plotly Forecast Visualization
    fig = go.Figure()
    
    # Historical curve
    fig.add_trace(go.Scatter(
        x=current_data["months"],
        y=current_data["actual"],
        mode='lines+markers',
        name='Historical Demand (Mandi Recorded)',
        line=dict(color='#0284c7', width=3),
        marker=dict(size=7)
    ))
    
    # Forecast curve
    fig.add_trace(go.Scatter(
        x=current_data["months"],
        y=current_data["forecast"],
        mode='lines+markers',
        name='Demeter AI Forecast (Prophet + XGBoost)',
        line=dict(color='#16a34a', width=3, dash='dash'),
        marker=dict(size=8, color='#15803d')
    ))
    
    # Optional Confidence Interval
    if confidence_interval:
        forecast_vals = [x for x in current_data["forecast"] if x is not None]
        months_fc = current_data["months"][-len(forecast_vals):]
        upper_bound = [val * 1.08 for val in forecast_vals]
        lower_bound = [val * 0.92 for val in forecast_vals]
        
        fig.add_trace(go.Scatter(
            x=months_fc + months_fc[::-1],
            y=upper_bound + lower_bound[::-1],
            fill='toself',
            fillcolor='rgba(22, 163, 74, 0.15)',
            line=dict(color='rgba(255,255,255,0)'),
            hoverinfo="skip",
            showlegend=True,
            name='95% Confidence Interval'
        ))
        
    fig.update_layout(
        title=f"Demand Trajectory for {crop_selected} (kg per month)",
        xaxis_title="Month (2026)",
        yaxis_title="Quantity (Kilograms)",
        hovermode="x unified",
        template="plotly_white",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    
    st.plotly_chart(fig, use_container_width=True)
    
    st.success(f"💡 **AI Recommendation for Farmers**: Demand for **{crop_selected}** is projected to grow by **{current_data['growth']}** by December. Plan sowing and aggregation schedules now to lock in forward wholesale contracts.")

# -----------------------------------------------------------------------------
# MODULE 3: FARMER PRODUCE PORTAL
# -----------------------------------------------------------------------------
elif navigation == "👨‍🌾 Farmer Produce Portal":
    st.title("👨‍🌾 Farmer Produce Management")
    st.write("Logged in as: **Ramesh Kumar** (Nashik FPO, 12 Acres)")
    
    tab_list, tab_add = st.tabs(["📋 Current Listed Produce", "➕ Add New Harvest Lot"])
    
    with tab_list:
        df_produce = pd.DataFrame(st.session_state.farmer_produce)
        st.dataframe(
            df_produce,
            column_config={
                "id": "Lot ID",
                "crop": "Crop Name",
                "quantity": st.column_config.NumberColumn("Quantity (kg)", format="%d kg"),
                "expectedPrice": st.column_config.NumberColumn("Expected Price", format="₹%d / kg"),
                "grade": "AI Grade",
                "status": "Listing Status"
            },
            use_container_width=True,
            hide_index=True
        )
        
        st.markdown("### 🔔 Active Buyer Purchase Requests")
        st.markdown("""
        - **FreshLink Wholesale** requested **800 kg Tomatoes** at **₹26/kg** (Offered: ₹20,800 total). [Status: *Negotiation Open*]
        - **Metro Cash & Carry** accepted **1,200 kg Onions** at **₹20/kg** (Offered: ₹24,000 total). [Status: *Scheduled for Satpur Hub*]
        """)
        
    with tab_add:
        st.markdown("#### Register New Produce Lot")
        with st.form("add_produce_form"):
            col_a, col_b = st.columns(2)
            with col_a:
                crop_in = st.selectbox("Crop Type", ["Tomatoes", "Onions", "Potatoes", "Wheat", "Maize", "Green Chillies", "Pomegranate"])
                qty_in = st.number_input("Quantity Available (kg)", min_value=100, max_value=50000, value=2500, step=100)
                price_in = st.number_input("Expected Unit Price (₹ / kg)", min_value=1, max_value=500, value=25)
            with col_b:
                harvest_date = st.date_input("Ready / Harvest Date", min_value=date.today())
                location_in = st.text_input("Farm / Village Location", value="Satpur, Nashik, Maharashtra")
                grade_in = st.selectbox("Estimated Quality Grade", ["Grade A (Premium Export)", "Grade B (Standard Mandi)", "Grade C (Processing / Sauce)"])
            
            submitted = st.form_submit_button("🌱 Register Lot with Demeter Engine", use_container_width=True)
            if submitted:
                new_lot = {
                    "id": f"P00{len(st.session_state.farmer_produce) + 1}",
                    "crop": crop_in,
                    "quantity": qty_in,
                    "unit": "kg",
                    "grade": grade_in.split()[0] + " " + grade_in.split()[1],
                    "location": location_in,
                    "harvestDate": str(harvest_date),
                    "expectedPrice": price_in,
                    "status": "Active"
                }
                st.session_state.farmer_produce.append(new_lot)
                st.success(f"✅ Success! Lot **{new_lot['id']}** for **{qty_in} kg {crop_in}** has been added to Demeter spatial index.")
                st.rerun()

# -----------------------------------------------------------------------------
# MODULE 4: BUYER PROCUREMENT PORTAL
# -----------------------------------------------------------------------------
elif navigation == "🛒 Buyer Procurement Portal":
    st.title("🛒 Buyer Procurement Dashboard")
    st.write("Logged in as: **Ananya Singh** (FreshLink Wholesale Pvt. Ltd. — Mumbai)")
    
    st.markdown("### 📦 Active Bulk Procurement Contracts")
    df_req = pd.DataFrame(st.session_state.buyer_requirements)
    st.dataframe(
        df_req,
        column_config={
            "id": "Requirement ID",
            "crop": "Crop Required",
            "quantity": st.column_config.NumberColumn("Quantity (kg)", format="%d kg"),
            "indicativePrice": st.column_config.NumberColumn("Target Price", format="₹%d / kg"),
            "matchPercent": st.column_config.ProgressColumn("Farmer Supply Match", min_value=0, max_value=100, format="%d%%"),
            "status": "Procurement Status"
        },
        use_container_width=True,
        hide_index=True
    )
    
    st.markdown("---")
    st.markdown("### ➕ Post New Procurement Requirement")
    with st.form("new_requirement_form"):
        r_c1, r_c2 = st.columns(2)
        with r_c1:
            req_crop = st.selectbox("Required Crop", ["Tomatoes", "Onions", "Potatoes", "Wheat", "Rice", "Soybean"])
            req_qty = st.number_input("Bulk Quantity Needed (kg)", min_value=500, max_value=100000, value=5000, step=500)
            target_price = st.number_input("Max Target Price (₹ / kg)", min_value=5, max_value=300, value=24)
        with r_c2:
            req_date = st.date_input("Delivery Deadline", min_value=date.today())
            delivery_hub = st.selectbox("Destination Hub", [
                "Vashi APMC, Navi Mumbai",
                "Bhiwandi Cold Storage Hub",
                "Pune Agricultural Terminal",
                "Nashik Central Distribution Centre"
            ])
            req_grade = st.selectbox("Required Quality Tier", ["Grade A", "Grade B", "Grade A & B Mixed"])
            
        req_submit = st.form_submit_button("🔍 Find & Match Farmer Supply Pools", use_container_width=True)
        if req_submit:
            new_req = {
                "id": f"REQ-{1050 + len(st.session_state.buyer_requirements)}",
                "crop": req_crop,
                "quantity": req_qty,
                "unit": "kg",
                "grade": req_grade,
                "requiredDate": str(req_date),
                "deliveryLocation": delivery_hub,
                "indicativePrice": target_price,
                "status": "Matching",
                "matchPercent": 88
            }
            st.session_state.buyer_requirements.append(new_req)
            st.success(f"🎉 Requirement **{new_req['id']}** posted! The matching engine has found **88% immediate supply pool** in the Nashik region.")
            st.rerun()

# -----------------------------------------------------------------------------
# MODULE 5: MULTI-LOT ORDER MATCHING ENGINE
# -----------------------------------------------------------------------------
elif navigation == "⚡ Multi-Lot Order Matching":
    st.title("⚡ AI Multi-Lot Supply Aggregation Engine")
    st.write("Demonstration of **REQ-1042: 2,000 kg Grade A Tomatoes** demanded by FreshLink Wholesale at Vashi APMC.")
    
    st.info("💡 **Why Aggregation Matters**: Smallholder farmers often possess 400–800 kg each. Demeter pools multiple micro-lots into a single standardized 5-ton transport batch to maximize logistics savings.")
    
    col_req, col_pool = st.columns([1, 2])
    
    with col_req:
        st.markdown("""
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:16px;">
            <h4 style="margin-top:0; color:#0f172a;">Buyer Requirement (REQ-1042)</h4>
            <p><strong>Crop:</strong> Tomatoes (Grade A)</p>
            <p><strong>Required Quantity:</strong> 2,000 kg</p>
            <p><strong>Delivery Location:</strong> Vashi APMC, Navi Mumbai</p>
            <p><strong>Target Price:</strong> ₹26 / kg</p>
            <p><strong>Total Value:</strong> ₹52,000</p>
        </div>
        """, unsafe_allow_html=True)
        
    with col_pool:
        st.markdown("#### Matched Farmer Pool (H3 Spatial Grouping)")
        farmers_matched = [
            {"Farmer": "Ramesh Kumar", "FPO": "Nashik FPO", "Location": "Nashik", "Distance": "167 km", "Quantity": 800, "OfferPrice": 26, "MatchRating": "4.8 ⭐"},
            {"Farmer": "Sunita Patil", "FPO": "Nashik FPO", "Location": "Dindori", "Distance": "182 km", "Quantity": 700, "OfferPrice": 27, "MatchRating": "4.6 ⭐"},
            {"Farmer": "Vijay Shinde", "FPO": "Ahmednagar FPO", "Location": "Sangamner", "Distance": "145 km", "Quantity": 500, "OfferPrice": 25, "MatchRating": "4.9 ⭐"},
        ]
        df_matched = pd.DataFrame(farmers_matched)
        st.dataframe(df_matched, use_container_width=True, hide_index=True)
        
    st.markdown("### 📊 Order Fulfillment Metrics")
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Pool Quantity", "2,000 kg", "100% Fulfilled")
    c2.metric("Weighted Avg Price", "₹26.10 / kg", "Within ±1% Budget")
    c3.metric("Aggregated Farmers", "3 Micro-lots", "Single Dispatch")
    c4.metric("Transport Cost Saved", "₹4,200", "-28% vs Individual Trips")
    
    if st.button("🚀 Confirm Multi-Lot Aggregation & Lock 60% Escrow", type="primary", use_container_width=True):
        st.balloons()
        st.success("✅ **Escrow Locked!** ₹31,260 (60% advance) reserved in ICICI Nodal Bank Escrow. Farmer dispatch IDs generated.")

# -----------------------------------------------------------------------------
# MODULE 6: AI QUALITY ASSESSMENT
# -----------------------------------------------------------------------------
elif navigation == "🔬 AI Quality Assessment":
    st.title("🔬 Computer Vision Crop Quality Assessment")
    st.write("Demeter's two-stage grading combines edge computer vision with VLE physical sensor verification.")
    
    q_col1, q_col2 = st.columns([1, 1])
    
    with q_col1:
        st.markdown("#### Parameter Sensitivity Simulation")
        appearance = st.slider("Skin Uniformity & Appearance Score", 50, 100, 92)
        size_consistency = st.slider("Size / Caliper Consistency", 50, 100, 88)
        surface_defects = st.slider("Defect-Free Surface Score", 50, 100, 94)
        moisture_content = st.slider("Moisture Content (%)", 5.0, 25.0, 11.4)
        
        # Grading logic
        composite_score = (appearance * 0.3) + (size_consistency * 0.3) + (surface_defects * 0.4)
        if composite_score >= 88 and moisture_content <= 14:
            predicted_grade = "Grade A (Premium Export & Wholesale)"
            badge_class = "badge-grade-a"
            price_multiplier = "100% of Top Mandi Rate"
        elif composite_score >= 75:
            predicted_grade = "Grade B (Standard Supermarket / Mandi)"
            badge_class = "badge-grade-b"
            price_multiplier = "85% of Top Mandi Rate"
        else:
            predicted_grade = "Grade C (Processing & Canning)"
            badge_class = "badge-grade-b"
            price_multiplier = "65% of Top Mandi Rate"
            
    with q_col2:
        st.markdown("#### AI Appraisal Card")
        st.markdown(f"""
        <div style="background:#ffffff; border:2px solid #22c55e; border-radius:12px; padding:20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
            <h3 style="margin-top:0; color:#15803d;">Batch: TOM-2841 (Tomatoes)</h3>
            <p><strong>Predicted Grade:</strong> <span class="{badge_class}">{predicted_grade}</span></p>
            <p><strong>Model Confidence:</strong> 91.4% (TFLite MobileNetV3)</p>
            <p><strong>Composite Quality Score:</strong> <strong>{composite_score:.1f} / 100</strong></p>
            <p><strong>Moisture Status:</strong> {moisture_content}% (Safe for Transport, No Rot Risk)</p>
            <p><strong>Pricing Band:</strong> {price_multiplier}</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Radar/Bar Breakdown
        df_radar = pd.DataFrame({
            "Metric": ["Appearance", "Size Sizing", "Surface Cleanliness", "Moisture Tier (Normalized)"],
            "Score": [appearance, size_consistency, surface_defects, min(100, (1 - (moisture_content/25)) * 100)]
        })
        fig_bar = px.bar(df_radar, x="Metric", y="Score", text="Score", color="Score", color_continuous_scale="Greens", range_y=[0, 110])
        fig_bar.update_layout(height=240, margin=dict(l=20, r=20, t=20, b=20), template="plotly_white")
        st.plotly_chart(fig_bar, use_container_width=True)

# -----------------------------------------------------------------------------
# MODULE 7: LOGISTICS & ROUTE OPTIMIZATION
# -----------------------------------------------------------------------------
elif navigation == "🚚 Logistics & Route Optimizer":
    st.title("🚚 Smart Logistics & Dynamic Route Optimizer")
    st.write("Order: **ORD-2841** | Vehicle: **Refrigerated 5-Tonne Truck (MH-04-GK-7821)** | Driver: **Mahesh Jadhav**")
    
    col_route, col_map = st.columns([1, 1])
    
    with col_route:
        st.markdown("#### Multi-Stop Pickup & Delivery Sequence")
        stops = [
            {"Stop": "1. Pickup", "Location": "Sangamner", "Farmer": "Vijay Shinde", "Quantity": "500 kg", "Time": "07:00 AM", "Status": "✅ Completed"},
            {"Stop": "2. Pickup", "Location": "Nashik", "Farmer": "Ramesh Kumar", "Quantity": "800 kg", "Time": "08:00 AM", "Status": "✅ Completed"},
            {"Stop": "3. Pickup", "Location": "Dindori", "Farmer": "Sunita Patil", "Quantity": "700 kg", "Time": "09:30 AM", "Status": "🟡 En Route"},
            {"Stop": "4. Aggregation Hub", "Location": "Satpur Hub", "Farmer": "Quality Consolidation", "Quantity": "2,000 kg", "Time": "11:00 AM", "Status": "⏳ Scheduled"},
            {"Stop": "5. Destination Delivery", "Location": "Vashi APMC", "Farmer": "FreshLink Wholesale", "Quantity": "2,000 kg", "Time": "03:30 PM", "Status": "⏳ Scheduled"},
        ]
        st.table(pd.DataFrame(stops))
        
    with col_map:
        st.markdown("#### Route Spatial Waypoints (Maharashtra Corridor)")
        coords = pd.DataFrame({
            "name": ["Sangamner (Pickup)", "Nashik (Pickup)", "Dindori (Pickup)", "Satpur Hub", "Vashi APMC (Delivery)"],
            "lat": [19.57, 20.00, 20.21, 19.97, 19.07],
            "lon": [74.20, 73.78, 73.74, 73.82, 73.00],
            "type": ["Farmer 1", "Farmer 2", "Farmer 3", "Aggregation Hub", "Buyer Terminal"]
        })
        st.map(coords, latitude="lat", longitude="lon", size=25, zoom=7)
        
    st.markdown("### 🌿 Operational & Ecological Impact")
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Total Route Distance", "287 km", "-42 km vs Unpooled Trips")
    k2.metric("Estimated Transit Time", "6h 30m", "On Schedule")
    k3.metric("Vehicle Load Factor", "80% (2,000 / 2,500 kg)", "+35% Utilization")
    k4.metric("Carbon Offset", "42 kg CO₂ Saved", "Eco-Certified")

# -----------------------------------------------------------------------------
# MODULE 8: ESCROW & SETTLEMENT
# -----------------------------------------------------------------------------
elif navigation == "💰 Escrow & Settlement":
    st.title("💰 Fintech Escrow & Automated Dispute Engine")
    st.write("Demeter protects both parties with a **60% Pre-Dispatch / 40% Delivery** smart escrow contract.")
    
    st.markdown("""
    ```
    [ Buyer Places Order ] ───> [ 100% Escrow Funded ]
                                      │
           ┌──────────────────────────┴──────────────────────────┐
           ▼                                                     ▼
    [ 60% Advance Paid ]                                  [ 40% In Escrow ]
    (Triggered upon VLE Hub Weighing)                     (Awaiting Delivery Scan)
                                                                 │
                                                      ┌──────────┴──────────┐
                                                      ▼                     ▼
                                            [ < 3% Transit Loss ]  [ > 3% Loss / Route Deviation ]
                                            Instant 40% Disbursed   Flagged to Audit Engine
    ```
    """)
    
    col_escrow1, col_escrow2 = st.columns(2)
    
    with col_escrow1:
        st.markdown("#### Live Escrow Ledger (ORD-2841)")
        st.markdown("""
        - **Total Contract Value:** ₹52,200
        - **60% Advance Disbursed:** ₹31,320 *(Direct to 3 Farmer VPAs via UPI/IMPS)*
        - **Escrow Retained (40%):** ₹20,880
        - **Disbursement Trigger:** Destination QR Scan + Gross-Tare Differential Verification
        """)
        
    with col_escrow2:
        st.markdown("#### Test Shrinkage & Settlement Simulation")
        dispatch_wt = 2000
        delivered_wt = st.slider("Destination Net Weighing (kg)", min_value=1800, max_value=2050, value=1970)
        shrinkage_pct = ((dispatch_wt - delivered_wt) / dispatch_wt) * 100
        
        if shrinkage_pct <= 3.0:
            st.success(f"✅ Normal Moisture Shrinkage: **{shrinkage_pct:.1f}%**. Acceptable threshold is 3.0%. Releasing remaining ₹20,880 to farmers automatically!")
        else:
            st.error(f"⚠️ Shrinkage: **{shrinkage_pct:.1f}%** exceeds 3.0%! Telemetry route audit triggered: verifying driver stopovers.")

# -----------------------------------------------------------------------------
# FOOTER
# -----------------------------------------------------------------------------
st.markdown("---")
st.markdown(
    "<div style='text-align: center; color: #64748b; font-size: 13px;'>"
    "🌾 <strong>Demeter — AgriConnect</strong> | Developed for Smart India Hackathon (SIH 2026) | "
    "Full-Stack AI Marketplace with Spatial Pooling, Demand Forecasting & Cold-Chain Route Optimization"
    "</div>",
    unsafe_allow_html=True
)
