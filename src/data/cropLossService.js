// ─────────────────────────────────────────────────────────────────────────────
// DEMETER — Crop Loss & Government Assistance Service
// Handles storage, retrieval, validation, and government scheme guidance
// for farmer crop damage reports.
// ─────────────────────────────────────────────────────────────────────────────

export const PROBLEM_TYPES = [
  {
    id: 'rain_flood',
    title: 'Crop damaged by rain/flood',
    titleHi: 'बारिश या बाढ़ से फसल खराब',
    icon: '🌧️',
    description: 'Excessive rainfall, waterlogging, flash floods, or river overflow damaging standing crops.',
    category: 'weather',
  },
  {
    id: 'drought_heat',
    title: 'Crop damaged by drought/heat',
    titleHi: 'सूखा या अत्यधिक गर्मी से नुकसान',
    icon: '☀️',
    description: 'Dry spells, deficit monsoon, prolonged drought, or acute heatwaves drying up crops.',
    category: 'weather',
  },
  {
    id: 'pest_disease',
    title: 'Pest or disease damage',
    titleHi: 'कीट या फफूंद रोग से नुकसान',
    icon: '🐛',
    description: 'Invasive pest attacks (e.g. locusts, bollworms) or fungal, viral, and bacterial crop blight.',
    category: 'biological',
  },
  {
    id: 'hailstorm',
    title: 'Hailstorm/weather damage',
    titleHi: 'ओलावृष्टि या आंधी तूफान से नुकसान',
    icon: '🧊',
    description: 'Severe hailstorms, localized cyclonic squalls, or frost destroying flowering & pods.',
    category: 'weather',
  },
  {
    id: 'market_price',
    title: 'Harvested crop but market price is too low',
    titleHi: 'फसल तैयार है पर मंडी में भाव बहुत कम है',
    icon: '📉',
    description: 'Market crash below Minimum Support Price (MSP), distress sales, or procurement delays.',
    category: 'market',
  },
  {
    id: 'other_problem',
    title: 'Other farming problem',
    titleHi: 'अन्य कृषि संबंधी समस्या',
    icon: '🚜',
    description: 'Soil degradation, irrigation canal breakdown, fertilizer shortage, or seed germination failure.',
    category: 'general',
  },
];

export const STATES_AND_DISTRICTS = {
  Maharashtra: [
    'Nashik',
    'Pune',
    'Ahmednagar',
    'Aurangabad (Chhatrapati Sambhajinagar)',
    'Solapur',
    'Nagpur',
    'Amravati',
    'Kolhapur',
    'Jalgaon',
    'Satara',
  ],
  'Madhya Pradesh': [
    'Indore',
    'Ujjain',
    'Bhopal',
    'Dewas',
    'Dhar',
    'Hoshangabad (Narmadapuram)',
    'Sehore',
  ],
  Karnataka: [
    'Belagavi',
    'Dharwad',
    'Vijayapura',
    'Bagalkote',
    'Shivamogga',
    'Mysuru',
    'Tumakuru',
  ],
  Punjab: [
    'Ludhiana',
    'Amritsar',
    'Patiala',
    'Jalandhar',
    'Bathinda',
    'Sangrur',
    'Firozpur',
  ],
  Haryana: [
    'Karnal',
    'Hisar',
    'Sirsa',
    'Ambala',
    'Kurukshetra',
    'Rohtak',
    'Sonipat',
  ],
  'Uttar Pradesh': [
    'Varanasi',
    'Prayagraj',
    'Gorakhpur',
    'Bareilly',
    'Aligarh',
    'Meerut',
    'Agra',
    'Lucknow',
  ],
  Gujarat: [
    'Rajkot',
    'Surat',
    'Junagadh',
    'Vadodara',
    'Mehsana',
    'Bhavnagar',
    'Amreli',
  ],
  'Andhra Pradesh': [
    'Guntur',
    'Krishna',
    'Kurnool',
    'Anantapur',
    'East Godavari',
    'West Godavari',
  ],
  Rajasthan: [
    'Jaipur',
    'Kota',
    'Jodhpur',
    'Sri Ganganagar',
    'Bikaner',
    'Nagaur',
    'Alwar',
  ],
};

export const COMMON_CROPS = [
  'Tomatoes',
  'Onions',
  'Potatoes',
  'Wheat',
  'Paddy (Rice)',
  'Cotton',
  'Soybean',
  'Maize',
  'Sugarcane',
  'Mustard',
  'Gram (Chana)',
  'Grapes',
  'Pomegranate',
  'Banana',
  'Tur (Arhar/Pigeon Pea)',
  'Moong (Green Gram)',
];

export const GOVERNMENT_SCHEMES = {
  pmfby: {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    tagline: 'Comprehensive crop insurance covering natural calamities, pests, and post-harvest losses.',
    taglineHi: 'प्राकृतिक आपदाओं, कीटों और कटाई उपरांत नुकसान के लिए व्यापक फसल बीमा योजना।',
    officialUrl: 'https://pmfby.gov.in/',
    helpline: '14447 (Toll-Free PMFBY Helpline) / 1800-180-1551 (Kisan Call Centre)',
    ministry: 'Ministry of Agriculture & Farmers Welfare, Govt. of India',
    eligibilityNotice: 'Your eligibility will be determined by the applicable government scheme and its rules.',
    eligibilityNoticeHi: 'आपकी पात्रता लागू सरकारी योजना और उसके नियमों के अनुसार ही तय की जाएगी।',
    keyPoints: [
      'Covers localized calamities: Hailstorm, Landslide, Inundation, Cloudburst, and Natural Fire.',
      'Mandatory intimation of crop damage within 72 hours of occurrence to the insurance company or local Agriculture Office.',
      'Insurance claim settlements are credited directly to the farmer Aadhaar-linked bank account.',
      'Farmer share of premium is low (1.5% for Rabi, 2% for Kharif, 5% for Annual Commercial/Horticultural crops).',
    ],
    nextSteps: [
      'Take photos and note the exact date and GPS location of the damaged field.',
      'Intimate your local Agriculture Officer or call the PMFBY helpline 14447 within 72 hours.',
      'Keep your Land 7/12 extract / Patta and Bank Passbook ready for survey inspection.',
    ],
  },
  pmaasha: {
    id: 'pmaasha',
    name: 'PM-AASHA / Price Support Scheme (PSS)',
    nameHi: 'पीएम-आशा / मूल्य समर्थन योजना (PSS)',
    tagline: 'Price protection and government procurement when market prices fall below MSP.',
    taglineHi: 'जब बाजार भाव एमएसपी (MSP) से नीचे गिर जाए तो मूल्य सुरक्षा और सरकारी खरीद।',
    officialUrl: 'https://farmer.gov.in/',
    helpline: '1800-180-1551 (Kisan Call Centre)',
    ministry: 'Department of Agriculture & Farmers Welfare, Govt. of India',
    eligibilityNotice: 'Your eligibility will be determined by the applicable government scheme and its rules.',
    eligibilityNoticeHi: 'आपकी पात्रता लागू सरकारी योजना और उसके नियमों के अनुसार ही तय की जाएगी।',
    keyPoints: [
      'Covers physical procurement of pulses, oilseeds, and copra through central nodal agencies like NAFED and FCI.',
      'Price Deficiency Payment Scheme (PDPS) compensates registered farmers for the difference between MSP and sale price.',
      'Requires pre-registration on state agricultural marketing portals (e.g. e-NAM, Bhavantar, or state procurement portals).',
    ],
    nextSteps: [
      'Verify whether your crop is notified under current Minimum Support Price (MSP) schedule.',
      'Visit your nearest APMC Mandi or primary agriculture credit society (PACS) procurement center.',
      'Check official MSP price notices at agmarknet.gov.in and farmer.gov.in.',
    ],
  },
  disaster_relief: {
    id: 'disaster_relief',
    name: 'State Disaster Response Fund (SDRF) / Agri Relief Assistance',
    nameHi: 'राज्य आपदा मोचन निधि (SDRF) / कृषि सहायता',
    tagline: 'Ex-gratia relief assistance provided by State Revenue and Agriculture departments during notified natural disasters.',
    taglineHi: 'अधिसूचित प्राकृतिक आपदाओं के दौरान राज्य राजस्व एवं कृषि विभाग द्वारा अनुग्रह सहायता।',
    officialUrl: 'https://agricoop.nic.in/',
    helpline: '1800-180-1551 (Kisan Call Centre)',
    ministry: 'State Revenue & Agriculture Department',
    eligibilityNotice: 'Your eligibility will be determined by the applicable government scheme and its rules.',
    eligibilityNoticeHi: 'आपकी पात्रता लागू सरकारी योजना और उसके नियमों के अनुसार ही तय की जाएगी।',
    keyPoints: [
      'Provides financial input subsidy relief to farmers whose crop loss exceeds 33% due to notified natural calamities.',
      'Panchnama and joint survey conducted by Talathi/Patwari and Agriculture Assistant.',
      'Applicable in cases where disaster affects notified talukas or blocks.',
    ],
    nextSteps: [
      'Submit written loss intimation to your local Gram Panchayat or Talathi/Patwari.',
      'Cooperate during physical Panchnama / field survey.',
      'Ensure bank account is Aadhaar-seeded for direct benefit transfer (DBT).',
    ],
  },
};

/**
 * Returns government assistance guidance tailored to the reported problem type.
 */
export function getSchemeGuidanceForProblem(problemId) {
  if (problemId === 'market_price') {
    return GOVERNMENT_SCHEMES.pmaasha;
  }
  if (['rain_flood', 'drought_heat', 'pest_disease', 'hailstorm'].includes(problemId)) {
    return GOVERNMENT_SCHEMES.pmfby;
  }
  return GOVERNMENT_SCHEMES.disaster_relief;
}

const STORAGE_KEY = 'demeter_crop_loss_reports_v1';

// Seed realistic reports if none exist
const SEED_REPORTS = [
  {
    reportId: 'CR-784201',
    userId: 'F001',
    farmerName: 'Ramesh Kumar',
    mobileNumber: '9876543210',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Dindori',
    latitude: 20.201,
    longitude: 73.832,
    crop: 'Tomatoes',
    landArea: '3.5',
    landUnit: 'Acres',
    damageType: 'rain_flood',
    damageTypeName: 'Crop damaged by rain/flood',
    damageDate: '2026-09-22',
    description: 'Unseasonal torrential rains caused severe waterlogging in low-lying beds. Approximately 70% of the standing tomato crop is submerged and rotting.',
    evidenceFiles: [
      { name: 'field_flood_01.jpg', size: '2.4 MB', type: 'image/jpeg' },
      { name: 'damaged_plants.jpg', size: '1.8 MB', type: 'image/jpeg' },
    ],
    governmentService: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    schemeId: 'pmfby',
    status: 'Forwarded to Department',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-09-23T10:15:00Z', note: 'Report recorded in Demeter platform.' },
      { status: 'Under Review', timestamp: '2026-09-24T09:30:00Z', note: 'Preliminary evidence and GPS geo-coordinates verified.' },
      { status: 'Forwarded to Department', timestamp: '2026-09-25T14:20:00Z', note: 'Dossier prepared and dispatched for intimation to District Agriculture Office & PMFBY Survey representative.' },
    ],
    createdAt: '2026-09-23T10:15:00Z',
    updatedAt: '2026-09-25T14:20:00Z',
  },
  {
    reportId: 'CR-629144',
    userId: 'F001',
    farmerName: 'Ramesh Kumar',
    mobileNumber: '9876543210',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Niphad',
    latitude: 20.089,
    longitude: 74.112,
    crop: 'Onions',
    landArea: '2.0',
    landUnit: 'Acres',
    damageType: 'market_price',
    damageTypeName: 'Harvested crop but market price is too low',
    damageDate: '2026-09-18',
    description: 'Current APMC Mandi price dropped to ₹8/kg which does not even cover harvest labor and transport. Seeking procurement under PSS / NAFED buffer program.',
    evidenceFiles: [
      { name: 'mandi_receipt.jpg', size: '1.2 MB', type: 'image/jpeg' },
    ],
    governmentService: 'PM-AASHA / Price Support Scheme (PSS)',
    schemeId: 'pmaasha',
    status: 'Under Review',
    statusHistory: [
      { status: 'Submitted', timestamp: '2026-09-19T11:00:00Z', note: 'Report recorded in Demeter platform.' },
      { status: 'Under Review', timestamp: '2026-09-20T16:45:00Z', note: 'Mandi pricing and harvest receipts under assessment.' },
    ],
    createdAt: '2026-09-19T11:00:00Z',
    updatedAt: '2026-09-20T16:45:00Z',
  },
];

function getStoredReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_REPORTS));
      return SEED_REPORTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('localStorage not accessible, using in-memory reports:', err);
    return SEED_REPORTS;
  }
}

function saveStoredReports(reports) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

/**
 * Generate a unique Report ID in the format CR-XXXXXX
 */
function generateReportId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CR-${num}`;
}

export const cropLossService = {
  /**
   * Submit a new crop loss report
   */
  async submitReport(payload) {
    // Simulate brief network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    const reportId = generateReportId();
    const now = new Date().toISOString();
    const problem = PROBLEM_TYPES.find((p) => p.id === payload.damageType);
    const scheme = getSchemeGuidanceForProblem(payload.damageType);

    const newReport = {
      reportId,
      userId: payload.userId || 'F001',
      farmerName: payload.farmerName.trim(),
      mobileNumber: payload.mobileNumber.trim(),
      state: payload.state,
      district: payload.district,
      village: payload.village ? payload.village.trim() : 'Not Specified',
      latitude: payload.latitude || null,
      longitude: payload.longitude || null,
      crop: payload.crop,
      landArea: payload.landArea,
      landUnit: payload.landUnit || 'Acres',
      damageType: payload.damageType,
      damageTypeName: problem ? problem.title : payload.damageType,
      damageDate: payload.damageDate,
      description: payload.description ? payload.description.trim() : '',
      evidenceFiles: payload.evidenceFiles || [],
      governmentService: scheme.name,
      schemeId: scheme.id,
      status: 'Submitted',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: now,
          note: 'Crop loss report recorded in Demeter system. Ready for departmental processing.',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const currentReports = getStoredReports();
    const updated = [newReport, ...currentReports];
    saveStoredReports(updated);

    return newReport;
  },

  /**
   * Retrieve report by ID and Mobile Number
   */
  async getReportByIdAndMobile(reportId, mobileNumber) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const all = getStoredReports();
    const cleanId = (reportId || '').trim().toUpperCase();
    const cleanMobile = (mobileNumber || '').trim().replace(/[^0-9]/g, '');

    const found = all.find((r) => {
      const matchId = r.reportId.toUpperCase() === cleanId;
      const matchMobile = r.mobileNumber.replace(/[^0-9]/g, '').endsWith(cleanMobile.slice(-10));
      return matchId && matchMobile;
    });

    return found || null;
  },

  /**
   * Get all reports for a specific user/farmer
   */
  async getUserReports(userId = 'F001') {
    const all = getStoredReports();
    return all.filter((r) => r.userId === userId);
  },

  /**
   * Get all reports (admin / debug overview)
   */
  async getAllReports() {
    return getStoredReports();
  },
};
