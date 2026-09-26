// ─────────────────────────────────────────────────────────────────────────────
// DEMETER — Mock Data
// All static demonstration data for the frontend prototype.
// Replace with real API calls when backend is integrated.
// ─────────────────────────────────────────────────────────────────────────────

export const currentFarmer = {
  id: 'F001',
  name: 'Ramesh Kumar',
  fpo: 'Nashik FPO',
  location: 'Nashik, Maharashtra',
  avatar: 'RK',
  totalLand: '12 acres',
  primaryCrops: ['Tomatoes', 'Onions', 'Grapes'],
};

export const currentBuyer = {
  id: 'B001',
  name: 'Ananya Singh',
  company: 'FreshLink Wholesale Pvt. Ltd.',
  location: 'Mumbai, Maharashtra',
  avatar: 'AS',
  tier: 'Enterprise',
};

// ─── Farmer Produce Listings ──────────────────────────────────────────────────
export const farmerProduce = [
  {
    id: 'P001',
    crop: 'Tomatoes',
    quantity: 3000,
    unit: 'kg',
    grade: 'Grade A',
    location: 'Nashik, Maharashtra',
    harvestDate: '2026-09-28',
    expectedPrice: 28,
    status: 'Active',
    listed: '2026-09-15',
  },
  {
    id: 'P002',
    crop: 'Onions',
    quantity: 1500,
    unit: 'kg',
    grade: 'Grade B',
    location: 'Nashik, Maharashtra',
    harvestDate: '2026-10-05',
    expectedPrice: 18,
    status: 'Active',
    listed: '2026-09-16',
  },
  {
    id: 'P003',
    crop: 'Potatoes',
    quantity: 2000,
    unit: 'kg',
    grade: 'Grade A',
    location: 'Nashik, Maharashtra',
    harvestDate: '2026-10-12',
    expectedPrice: 22,
    status: 'Pending',
    listed: '2026-09-17',
  },
  {
    id: 'P004',
    crop: 'Maize',
    quantity: 5000,
    unit: 'kg',
    grade: 'Grade B',
    location: 'Nashik, Maharashtra',
    harvestDate: '2026-10-20',
    expectedPrice: 14,
    status: 'Active',
    listed: '2026-09-18',
  },
];

// ─── Farmer Orders ─────────────────────────────────────────────────────────────
export const farmerOrders = [
  {
    id: 'ORD-2841',
    crop: 'Tomatoes',
    buyer: 'FreshLink Wholesale Pvt. Ltd.',
    quantity: 800,
    unit: 'kg',
    grade: 'Grade A',
    offeredPrice: 26,
    status: 'Pending Negotiation',
    deadline: '2026-09-25',
  },
  {
    id: 'ORD-2792',
    crop: 'Onions',
    buyer: 'Metro Cash & Carry',
    quantity: 1200,
    unit: 'kg',
    grade: 'Grade A',
    offeredPrice: 20,
    status: 'Active',
    deadline: '2026-09-30',
  },
  {
    id: 'ORD-2755',
    crop: 'Potatoes',
    buyer: 'AgroMart Foods',
    quantity: 1000,
    unit: 'kg',
    grade: 'Grade A',
    offeredPrice: 21,
    status: 'Accepted',
    deadline: '2026-10-10',
  },
];

// ─── Buyer Requirements ────────────────────────────────────────────────────────
export const buyerRequirements = [
  {
    id: 'REQ-1042',
    crop: 'Tomatoes',
    quantity: 2000,
    unit: 'kg',
    grade: 'Grade A',
    requiredDate: '2026-09-25',
    deliveryLocation: 'Vashi APMC, Navi Mumbai',
    indicativePrice: 26,
    status: 'Matching',
    matchPercent: 100,
    posted: '2026-09-18',
  },
  {
    id: 'REQ-1031',
    crop: 'Onions',
    quantity: 5000,
    unit: 'kg',
    grade: 'Grade A',
    requiredDate: '2026-10-01',
    deliveryLocation: 'Vashi APMC, Navi Mumbai',
    indicativePrice: 19,
    status: 'Active',
    matchPercent: 72,
    posted: '2026-09-15',
  },
  {
    id: 'REQ-1019',
    crop: 'Potatoes',
    quantity: 3000,
    unit: 'kg',
    grade: 'Grade B',
    requiredDate: '2026-10-08',
    deliveryLocation: 'Bhiwandi Cold Storage Hub',
    indicativePrice: 16,
    status: 'In Progress',
    matchPercent: 100,
    posted: '2026-09-10',
  },
  {
    id: 'REQ-0998',
    crop: 'Wheat',
    quantity: 10000,
    unit: 'kg',
    grade: 'Grade A',
    requiredDate: '2026-10-15',
    deliveryLocation: 'Pune Processing Unit',
    indicativePrice: 24,
    status: 'Completed',
    matchPercent: 100,
    posted: '2026-09-01',
  },
];

// ─── Order Matching Demo (REQ-1042 Tomatoes) ──────────────────────────────────
export const orderMatchDemo = {
  requirement: {
    id: 'REQ-1042',
    crop: 'Tomatoes',
    quantity: 2000,
    unit: 'kg',
    grade: 'Grade A',
    requiredDate: '2026-09-25',
    deliveryLocation: 'Vashi APMC, Navi Mumbai',
    indicativePrice: 26,
    buyer: 'FreshLink Wholesale Pvt. Ltd.',
  },
  farmers: [
    {
      id: 'F001',
      name: 'Ramesh Kumar',
      fpo: 'Nashik FPO',
      location: 'Nashik, Maharashtra',
      distance: '167 km',
      quantity: 800,
      grade: 'Grade A',
      offeredPrice: 26,
      status: 'Pending',
      rating: 4.8,
      completedOrders: 23,
    },
    {
      id: 'F002',
      name: 'Sunita Patil',
      fpo: 'Nashik FPO',
      location: 'Dindori, Maharashtra',
      distance: '182 km',
      quantity: 700,
      grade: 'Grade A',
      offeredPrice: 27,
      status: 'Accepted',
      rating: 4.6,
      completedOrders: 18,
    },
    {
      id: 'F003',
      name: 'Vijay Shinde',
      fpo: 'Ahmednagar FPO',
      location: 'Sangamner, Maharashtra',
      distance: '145 km',
      quantity: 500,
      grade: 'Grade A',
      offeredPrice: 25,
      status: 'Accepted',
      rating: 4.9,
      completedOrders: 31,
    },
  ],
};

// ─── Negotiation Demo ─────────────────────────────────────────────────────────
export const negotiationDemo = {
  order: farmerOrders[0],
  marketPrice: { min: 24, max: 30, avg: 27 },
  history: [
    { from: 'Buyer', message: 'We offer ₹26/kg for 800 kg Grade A Tomatoes, delivery by Sep 25.', time: '2026-09-18 10:30', price: 26 },
    { from: 'Farmer', message: 'Our produce quality is excellent. We need ₹28/kg considering current input costs.', time: '2026-09-18 14:15', price: 28 },
    { from: 'Buyer', message: 'We can go up to ₹27/kg. This is our best offer for this volume.', time: '2026-09-18 16:00', price: 27 },
  ],
};

// ─── Quality Assessment Demo ──────────────────────────────────────────────────
export const mockQualityReports = [
  {
    id: 'QA-2026-0841',
    crop: 'Tomatoes',
    batch: 'TOM-2841',
    quantity: 800,
    farmerFpo: 'Nashik FPO',
    submitted: '24 Sept 2026',
    aiGrade: 'A',
    confidence: 91,
    status: 'Pending Physical Inspection',
    parameters: [
      { name: 'Appearance', score: 92 },
      { name: 'Size consistency', score: 88 },
      { name: 'Surface defects', score: 94 },
      { name: 'Color consistency', score: 95 },
      { name: 'Visible damage', score: 89 },
    ],
    physicalInspection: {
      completed: false,
      inspector: null,
      date: null,
      finalGrade: null,
      notes: null,
    },
    feedback: {
      buyer: 'FreshLink Wholesale Pvt. Ltd.',
      rating: null,
      comment: null
    }
  },
  {
    id: 'QA-2026-0838',
    crop: 'Onions',
    batch: 'ONI-1932',
    quantity: 1200,
    farmerFpo: 'Green Valley FPO',
    submitted: '20 Sept 2026',
    aiGrade: 'B',
    confidence: 87,
    status: 'Verified — Grade B',
    parameters: [
      { name: 'Appearance', score: 84 },
      { name: 'Size consistency', score: 82 },
      { name: 'Surface defects', score: 85 },
      { name: 'Color consistency', score: 88 },
      { name: 'Visible damage', score: 86 },
    ],
    physicalInspection: {
      completed: true,
      inspector: 'Physical Verifier',
      date: '22 Sept 2026',
      finalGrade: 'B',
      notes: 'Standard quality checked. Minor skin peeling observed, appropriate for Grade B standard. No rot detected.',
    },
    feedback: {
      buyer: 'Metro Cash & Carry',
      rating: 4.0,
      comment: 'Produce quality matched the agreed Grade B standard. Good sizing overall.'
    }
  },
  {
    id: 'QA-2026-0799',
    crop: 'Potatoes',
    batch: 'POT-1049',
    quantity: 2000,
    farmerFpo: 'Nashik FPO',
    submitted: '15 Sept 2026',
    aiGrade: 'A',
    confidence: 89,
    status: 'Verified — Grade B',
    parameters: [
      { name: 'Appearance', score: 90 },
      { name: 'Size consistency', score: 92 },
      { name: 'Surface defects', score: 88 },
      { name: 'Color consistency', score: 87 },
      { name: 'Visible damage', score: 89 },
    ],
    physicalInspection: {
      completed: true,
      inspector: 'Physical Verifier',
      date: '18 Sept 2026',
      finalGrade: 'B',
      notes: 'AI predicted Grade A, but physical verification found more surface bruising than allowed for Grade A. Downgraded to Grade B. Nutritionally sound.',
    },
    feedback: {
      buyer: 'AgroMart Foods',
      rating: 4.5,
      comment: 'Satisfied with the transparent regrading. Fair pricing for Grade B.'
    }
  }
];

// Fallback for any lingering code using old qualityDemo
export const qualityDemo = mockQualityReports[0];

// ─── Aggregation Demo ─────────────────────────────────────────────────────────
export const aggregationDemo = {
  orderId: 'ORD-2841',
  crop: 'Tomatoes',
  totalRequired: 2000,
  collectionHub: 'Nashik Agri Collection Hub, Satpur',
  deliveryLocation: 'Vashi APMC, Navi Mumbai',
  farmers: [
    { id: 'F001', name: 'Ramesh Kumar', location: 'Nashik', quantity: 800, status: 'Confirmed', collection: '2026-09-22 08:00' },
    { id: 'F002', name: 'Sunita Patil', location: 'Dindori', quantity: 700, status: 'Confirmed', collection: '2026-09-22 09:30' },
    { id: 'F003', name: 'Vijay Shinde', location: 'Sangamner', quantity: 500, status: 'In Transit', collection: '2026-09-22 07:00' },
  ],
  timeline: [
    { step: 'Requirement Created', status: 'done', time: '2026-09-18' },
    { step: 'Farmers Matched', status: 'done', time: '2026-09-18' },
    { step: 'Farmer Agreements', status: 'done', time: '2026-09-19' },
    { step: 'Quality Check', status: 'done', time: '2026-09-20' },
    { step: 'Produce Collection', status: 'active', time: '2026-09-22' },
    { step: 'Aggregation at Hub', status: 'pending', time: '2026-09-22' },
    { step: 'Dispatch to Buyer', status: 'pending', time: '2026-09-23' },
    { step: 'Delivered', status: 'pending', time: '2026-09-25' },
  ],
};

// ─── Logistics Demo ───────────────────────────────────────────────────────────
export const logisticsDemo = {
  orderId: 'ORD-2841',
  vehicle: { type: 'Refrigerated Truck', capacity: '5 tonnes', number: 'MH-04-GK-7821', driver: 'Mahesh Jadhav' },
  route: [
    { name: 'Farmer Vijay Shinde', type: 'pickup', location: 'Sangamner', lat: 19.57, lng: 74.20, time: '07:00 AM', quantity: '500 kg', status: 'Completed' },
    { name: 'Farmer Ramesh Kumar', type: 'pickup', location: 'Nashik', lat: 20.00, lng: 73.78, time: '08:00 AM', quantity: '800 kg', status: 'Completed' },
    { name: 'Farmer Sunita Patil', type: 'pickup', location: 'Dindori', lat: 20.21, lng: 73.74, time: '09:30 AM', quantity: '700 kg', status: 'Active' },
    { name: 'Nashik Collection Hub', type: 'hub', location: 'Nashik Satpur', lat: 19.97, lng: 73.82, time: '11:00 AM', quantity: '2000 kg', status: 'Pending' },
    { name: 'FreshLink Wholesale — Vashi APMC', type: 'delivery', location: 'Navi Mumbai', lat: 19.07, lng: 73.00, time: '03:30 PM', quantity: '2000 kg', status: 'Pending' },
  ],
  summary: { totalDistance: '287 km', estimatedTime: '6h 30m', fuelCost: '₹3,200', carbonOffset: '42 kg CO₂' },
};

// ─── Demand Forecasting Data ───────────────────────────────────────────────────
export const forecastingData = {
  crops: ['Tomatoes', 'Onions', 'Potatoes', 'Wheat', 'Rice', 'Maize'],
  monthly: {
    Tomatoes: [
      { month: 'Apr', actual: 18400, forecast: null },
      { month: 'May', actual: 19200, forecast: null },
      { month: 'Jun', actual: 22100, forecast: null },
      { month: 'Jul', actual: 24500, forecast: null },
      { month: 'Aug', actual: 23800, forecast: null },
      { month: 'Sep', actual: 21300, forecast: null },
      { month: 'Oct', actual: null, forecast: 26200 },
      { month: 'Nov', actual: null, forecast: 28900 },
      { month: 'Dec', actual: null, forecast: 31000 },
    ],
    Onions: [
      { month: 'Apr', actual: 32000, forecast: null },
      { month: 'May', actual: 29500, forecast: null },
      { month: 'Jun', actual: 27000, forecast: null },
      { month: 'Jul', actual: 26200, forecast: null },
      { month: 'Aug', actual: 28900, forecast: null },
      { month: 'Sep', actual: 31200, forecast: null },
      { month: 'Oct', actual: null, forecast: 34500 },
      { month: 'Nov', actual: null, forecast: 38000 },
      { month: 'Dec', actual: null, forecast: 42000 },
    ],
    Potatoes: [
      { month: 'Apr', actual: 41000, forecast: null },
      { month: 'May', actual: 39500, forecast: null },
      { month: 'Jun', actual: 36200, forecast: null },
      { month: 'Jul', actual: 33800, forecast: null },
      { month: 'Aug', actual: 35100, forecast: null },
      { month: 'Sep', actual: 37500, forecast: null },
      { month: 'Oct', actual: null, forecast: 40200 },
      { month: 'Nov', actual: null, forecast: 43800 },
      { month: 'Dec', actual: null, forecast: 47000 },
    ],
  },
  topCrops: [
    { crop: 'Onions', demand: 38000, growth: '+12%', trend: 'up' },
    { crop: 'Tomatoes', demand: 26200, growth: '+23%', trend: 'up' },
    { crop: 'Potatoes', demand: 40200, growth: '+7%', trend: 'up' },
    { crop: 'Wheat', demand: 85000, growth: '-3%', trend: 'down' },
    { crop: 'Rice', demand: 120000, growth: '+2%', trend: 'up' },
  ],
};

// ─── Recent Activity ──────────────────────────────────────────────────────────
export const recentActivity = [
  { id: 1, type: 'order', message: 'New order request for 800 kg Tomatoes from FreshLink Wholesale', time: '2h ago', color: 'wheat' },
  { id: 2, type: 'quality', message: 'Quality assessment completed for batch QA-2026-0841 — Grade A', time: '5h ago', color: 'success' },
  { id: 3, type: 'payment', message: 'Payment of ₹21,000 received for ORD-2755 (Potatoes)', time: '1d ago', color: 'info' },
  { id: 4, type: 'negotiation', message: 'Counter-offer submitted for ORD-2841 at ₹28/kg', time: '1d ago', color: 'warning' },
  { id: 5, type: 'listing', message: 'Maize listing of 5,000 kg added successfully', time: '2d ago', color: 'sage' },
];
