import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  X,
  MapPin,
  Calendar,
  Phone,
  User,
  FileText,
  ExternalLink,
  Info,
  Clock,
  Search,
  Sparkles,
  HelpCircle,
  Check,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import {
  PROBLEM_TYPES,
  STATES_AND_DISTRICTS,
  COMMON_CROPS,
  getSchemeGuidanceForProblem,
  cropLossService,
} from '../data/cropLossService';
import { currentFarmer } from '../data/mockData';

export default function CropLossHelp() {
  const navigate = useNavigate();

  // Language toggle for farmer accessibility (English / Hindi)
  const [lang, setLang] = useState('en'); // 'en' | 'hi'

  // Wizard state: 1: Problem Selection, 2: Gov Guidance, 3: Details & Location, 4: Evidence & Review, 5: Submitted
  const [step, setStep] = useState(1);

  // Selected Problem
  const [selectedProblemId, setSelectedProblemId] = useState('rain_flood');

  // Form Details
  const [form, setForm] = useState({
    farmerName: currentFarmer?.name || 'Ramesh Kumar',
    mobileNumber: '9876543210',
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Dindori',
    crop: 'Tomatoes',
    landArea: '3.0',
    landUnit: 'Acres',
    damageDate: new Date().toISOString().split('T')[0],
    description: '',
  });

  // Location mode: 'manual' | 'gps'
  const [locationMode, setLocationMode] = useState('manual');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState(null);
  const [locationError, setLocationError] = useState('');

  // Evidence files
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [fileError, setFileError] = useState('');

  // Confirmation & submission state
  const [confirmedDeclaration, setConfirmedDeclaration] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  // Helper translations
  const t = {
    en: {
      portalTitle: 'Crop Loss & Government Help',
      portalSubtitle: 'Crop damaged or facing a farming problem? Get help from the right government service.',
      disclaimerNotice: 'Demeter assists farmers in documenting crop losses and connecting with official government schemes. Submitting a report does not guarantee compensation. Official claims and compensation are subject to the rules and eligibility criteria of the respective government authorities.',
      step1: '1. Select Problem',
      step2: '2. Govt Scheme',
      step3: '3. Farm Details',
      step4: '4. Evidence & Submit',
      step5: '5. Confirmation',
      selectProblemTitle: 'What type of damage or problem occurred?',
      selectProblemSub: 'Tap on the card that best matches your situation.',
      schemeTitle: 'Recommended Government Assistance Scheme',
      schemeSub: 'Based on your selected problem, here is the official mechanism:',
      schemeRules: 'Eligibility & Rules',
      nextActionSteps: 'Recommended Next Steps for Farmer',
      officialPortal: 'View Official Government Portal',
      helpline: 'Toll-free Helpline',
      continueBtn: 'Continue',
      backBtn: 'Back',
      farmerInfoTitle: 'Farmer & Farm Information',
      nameLabel: 'Farmer Name',
      mobileLabel: 'Mobile Number',
      cropLabel: 'Damaged Crop',
      landAreaLabel: 'Affected Land Area',
      dateLabel: 'Date of Damage',
      descLabel: 'Problem Description (Optional)',
      descPlaceholder: 'Describe the weather, water stagnation, pest symptoms, or market condition...',
      locationTitle: 'Location of Damaged Field',
      useGpsBtn: '📍 Use My Location (GPS)',
      manualBtn: 'Select Location Manually',
      stateLabel: 'State',
      districtLabel: 'District',
      villageLabel: 'Village / Tehsil',
      detectedLocation: 'Detected GPS Location',
      evidenceTitle: 'Upload Photos & Video Evidence',
      evidenceSub: 'Upload photos of the affected field, close-ups of damaged crop, or mandi slips. (Max 15MB each)',
      dragDropText: 'Click or tap to upload photos/videos',
      supportedTypes: 'Supports JPG, PNG, WEBP, MP4',
      reviewTitle: 'Review & Submit Report',
      reviewNoticeTitle: 'Official Notice & Confirmation',
      reviewNoticeText: 'Your report will be recorded and forwarded to the relevant government service or authority where supported. Submitting a report does not guarantee compensation. Eligibility and assistance are determined strictly by the applicable government scheme and its rules.',
      checkboxConfirm: 'I confirm that the details and damage evidence provided are true and accurate to the best of my knowledge.',
      submitBtn: '🚨 Submit Crop Loss Report',
      submittingText: 'Recording Report...',
      submittedTitle: '✅ Crop Loss Report Submitted',
      reportIdLabel: 'Report ID',
      submittedDate: 'Submission Date',
      statusLabel: 'Current Status',
      trackBtn: 'Track My Report Status',
      dashboardBtn: 'Return to Dashboard',
      printBtn: 'Print / Save Receipt',
    },
    hi: {
      portalTitle: 'फसल नुकसान व सरकारी सहायता',
      portalSubtitle: 'फसल खराब हुई या कोई कृषि समस्या है? सही सरकारी सेवा और योजना से मदद पाएं।',
      disclaimerNotice: 'डिमेटर किसानों को फसल नुकसान दर्ज करने और आधिकारिक सरकारी योजनाओं से जोड़ने में मदद करता है। रिपोर्ट दर्ज करने से मुआवजे की गारंटी नहीं मिलती। अंतिम पात्रता और सहायता संबंधित सरकारी नियमों के अनुसार निर्धारित की जाती है।',
      step1: '1. समस्या चुनें',
      step2: '2. सरकारी योजना',
      step3: '3. किसान विवरण',
      step4: '4. साक्ष्य व जमा करें',
      step5: '5. पावती / स्थिति',
      selectProblemTitle: 'किस प्रकार का नुकसान या समस्या हुई है?',
      selectProblemSub: 'अपनी स्थिति से मेल खाने वाले कार्ड पर टैप करें।',
      schemeTitle: 'अनुशंसित सरकारी सहायता योजना',
      schemeSub: 'आपकी समस्या के आधार पर यह आधिकारिक सरकारी तंत्र है:',
      schemeRules: 'पात्रता व मुख्य नियम',
      nextActionSteps: 'किसान के लिए जरूरी कदम',
      officialPortal: 'आधिकारिक सरकारी पोर्टल देखें',
      helpline: 'टोल-फ्री हेल्पलाइन',
      continueBtn: 'आगे बढ़ें',
      backBtn: 'पीछे जाएं',
      farmerInfoTitle: 'किसान व खेत की जानकारी',
      nameLabel: 'किसान का नाम',
      mobileLabel: 'मोबाइल नंबर',
      cropLabel: 'क्षतिग्रस्त फसल',
      landAreaLabel: 'प्रभावित रकबा / क्षेत्रफल',
      dateLabel: 'नुकसान की तिथि',
      descLabel: 'समस्या का विवरण (वैकल्पिक)',
      descPlaceholder: 'बारिश, जलभराव, कीट के लक्षण या मंडी भाव के बारे में बताएं...',
      locationTitle: 'क्षतिग्रस्त खेत का स्थान',
      useGpsBtn: '📍 मेरी वर्तमान लोकेशन लें (GPS)',
      manualBtn: 'स्थान स्वयं चुनें',
      stateLabel: 'राज्य',
      districtLabel: 'ज़िला',
      villageLabel: 'गाँव / तहसील',
      detectedLocation: 'प्राप्त जीपीएस (GPS) स्थान',
      evidenceTitle: 'तस्वीरें व वीडियो साक्ष्य अपलोड करें',
      evidenceSub: 'खेत में हुए नुकसान की तस्वीरें, पौधे की स्थिति या मंडी रसीद अपलोड करें। (अधिकतम 15MB)',
      dragDropText: 'फोटो या वीडियो अपलोड करने के लिए टैप करें',
      supportedTypes: 'JPG, PNG, WEBP, MP4 मान्य',
      reviewTitle: 'जांचें और रिपोर्ट जमा करें',
      reviewNoticeTitle: 'आधिकारिक सूचना एवं पुष्टि',
      reviewNoticeText: 'आपकी रिपोर्ट दर्ज की जाएगी और संबंधित सरकारी विभाग को प्रेषित की जाएगी। रिपोर्ट जमा करने से मुआवजे की गारंटी नहीं होती। सहायता व पात्रता पूरी तरह से संबंधित सरकारी योजना के नियमों के अनुसार निर्धारित होगी।',
      checkboxConfirm: 'मैं पुष्टि करता/करती हूँ कि दी गई सभी जानकारी और फसल नुकसान के साक्ष्य पूरी तरह सत्य हैं।',
      submitBtn: '🚨 फसल नुकसान रिपोर्ट जमा करें',
      submittingText: 'रिपोर्ट दर्ज हो रही है...',
      submittedTitle: '✅ फसल नुकसान रिपोर्ट सफलतापूर्वक दर्ज',
      reportIdLabel: 'रिपोर्ट नंबर (Report ID)',
      submittedDate: 'दर्ज करने की तिथि',
      statusLabel: 'वर्तमान स्थिति',
      trackBtn: 'रिपोर्ट की स्थिति ट्रैक करें',
      dashboardBtn: 'डैशबोर्ड पर वापस जाएं',
      printBtn: 'रसीद प्रिंट / डाउनलोड करें',
    },
  }[lang];

  const currentScheme = getSchemeGuidanceForProblem(selectedProblemId);
  const selectedProblem = PROBLEM_TYPES.find((p) => p.id === selectedProblemId);
  const districtsForState = STATES_AND_DISTRICTS[form.state] || STATES_AND_DISTRICTS['Maharashtra'];

  // GPS Location Handler with graceful fallback
  const handleGetLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Please select location manually.');
      setLocationMode('manual');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lng = parseFloat(pos.coords.longitude.toFixed(4));
        setGpsCoordinates({ latitude: lat, longitude: lng });
        setLocationMode('gps');
      },
      (err) => {
        setGpsLoading(false);
        console.warn('Geolocation error:', err);
        setLocationError(
          'Location access was denied or timed out. You can easily choose your State, District, and Village manually below.'
        );
        setLocationMode('manual');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Evidence file handler
  const handleFileUpload = (e) => {
    setFileError('');
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = [];
    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];

    for (const f of files) {
      if (!ALLOWED.includes(f.type)) {
        setFileError(`File "${f.name}" is not a supported format. Please upload JPG, PNG, WEBP, or MP4.`);
        return;
      }
      if (f.size > MAX_SIZE) {
        setFileError(`File "${f.name}" exceeds 15MB limit.`);
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(f);
      validFiles.push({
        id: Math.random().toString(36).substring(7),
        name: f.name,
        size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: f.type,
        previewUrl,
        rawFile: f,
      });
    }

    setEvidenceFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (fileId) => {
    setEvidenceFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // Submit Handler
  const handleSubmitReport = async () => {
    if (!confirmedDeclaration) return;
    setIsSubmitting(true);

    try {
      const payload = {
        userId: currentFarmer?.id || 'F001',
        farmerName: form.farmerName,
        mobileNumber: form.mobileNumber,
        state: form.state,
        district: form.district,
        village: form.village,
        latitude: gpsCoordinates?.latitude || null,
        longitude: gpsCoordinates?.longitude || null,
        crop: form.crop,
        landArea: form.landArea,
        landUnit: form.landUnit,
        damageType: selectedProblemId,
        damageDate: form.damageDate,
        description: form.description,
        evidenceFiles: evidenceFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      };

      const result = await cropLossService.submitReport(payload);
      setSubmittedReport(result);
      setStep(5);
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Failed to record report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="farmer">
      {/* Top Header & Language Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌾</span>
            <h1 className="text-2xl font-bold text-[#1C1C1E]">{t.portalTitle}</h1>
          </div>
          <p className="text-sm text-[#6B7280]">{t.portalSubtitle}</p>
        </div>

        {/* Action Pills: Language Toggle & Track Report */}
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-[#E5E7E0] bg-white p-1 shadow-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                lang === 'en' ? 'bg-[#1B4332] text-white shadow-xs' : 'text-[#6B7280] hover:text-[#1C1C1E]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                lang === 'hi' ? 'bg-[#1B4332] text-white shadow-xs' : 'text-[#6B7280] hover:text-[#1C1C1E]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <Link
            to="/farmer/track-report"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1B4332] bg-[#1B4332]/10 border border-[#1B4332]/20 rounded-lg hover:bg-[#1B4332]/15 transition-colors"
          >
            <Search size={14} />
            {t.trackBtn}
          </Link>
        </div>
      </div>

      {/* Official Government Role Disclaimer Banner */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
        <Info size={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold">Notice:</strong> {t.disclaimerNotice}
        </p>
      </div>

      {/* Step Indicator Progress Bar */}
      {step < 5 && (
        <div className="mb-7">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            {[
              { num: 1, label: t.step1 },
              { num: 2, label: t.step2 },
              { num: 3, label: t.step3 },
              { num: 4, label: t.step4 },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-lg border transition-all ${
                  step === s.num
                    ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-sm'
                    : step > s.num
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-white text-gray-400 border-gray-200'
                }`}
              >
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 1: PROBLEM SELECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7E0] shadow-xs">
            <h2 className="text-xl font-bold text-[#1C1C1E] mb-1">{t.selectProblemTitle}</h2>
            <p className="text-sm text-[#6B7280] mb-6">{t.selectProblemSub}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROBLEM_TYPES.map((p) => {
                const isSelected = selectedProblemId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedProblemId(p.id)}
                    className={`text-left p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#1B4332] bg-[#1B4332]/5 shadow-md ring-2 ring-[#1B4332]/20'
                        : 'border-[#E5E7E0] bg-white hover:border-[#7CA982] hover:bg-[#FAFAF7]'
                    }`}
                  >
                    <div>
                      <div className="text-4xl mb-3">{p.icon}</div>
                      <h3 className="font-bold text-base text-[#1C1C1E] mb-1">
                        {lang === 'hi' ? p.titleHi : p.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] leading-relaxed">{p.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold">
                      <span className={isSelected ? 'text-[#1B4332]' : 'text-gray-400'}>
                        {isSelected ? '✓ Selected' : 'Tap to select'}
                      </span>
                      <ArrowRight size={14} className={isSelected ? 'text-[#1B4332]' : 'text-gray-300'} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-semibold px-7 py-3 rounded-xl hover:bg-[#2D6A4F] transition-all text-base shadow-sm"
            >
              {t.continueBtn} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 2: GOVERNMENT ASSISTANCE GUIDANCE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              {/* Problem summary badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-4">
                <span>{selectedProblem?.icon}</span>
                <span>{lang === 'hi' ? selectedProblem?.titleHi : selectedProblem?.title}</span>
              </div>

              <h2 className="text-xl font-bold text-[#1C1C1E] mb-1">{t.schemeTitle}</h2>
              <p className="text-sm text-[#6B7280] mb-6">{t.schemeSub}</p>

              {/* Main Scheme Hero Box */}
              <div className="bg-[#1B4332]/5 border-2 border-[#1B4332]/20 rounded-2xl p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1B4332]/10">
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase text-[#1B4332]">
                      Official Assistance Mechanism
                    </span>
                    <h3 className="text-2xl font-bold text-[#1B4332] mt-0.5">
                      {lang === 'hi' ? currentScheme.nameHi : currentScheme.name}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-1">{currentScheme.ministry}</p>
                  </div>

                  <a
                    href={currentScheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#1B4332] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors self-start md:self-center shadow-xs"
                  >
                    <span>{t.officialPortal}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>

                <p className="text-sm text-[#374151] font-medium my-4">
                  {lang === 'hi' ? currentScheme.taglineHi : currentScheme.tagline}
                </p>

                {/* Statutory Required Eligibility Disclaimer */}
                <div className="bg-white border-l-4 border-amber-500 rounded-r-lg p-3 text-xs sm:text-sm text-[#1C1C1E] font-medium shadow-xs">
                  ⚠️ <strong className="text-amber-800">Important:</strong>{' '}
                  {lang === 'hi' ? currentScheme.eligibilityNoticeHi : currentScheme.eligibilityNotice}
                </div>

                {/* Helpline */}
                <div className="mt-4 pt-3 flex items-center gap-2 text-xs text-[#1B4332] font-semibold">
                  <Phone size={14} className="text-[#1B4332]" />
                  <span>
                    {t.helpline}: <strong className="underline">{currentScheme.helpline}</strong>
                  </span>
                </div>
              </div>

              {/* Two Column details: Scheme Rules & Farmer Steps */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-[#E5E7E0] rounded-xl p-5 bg-[#FAFAF7]">
                  <h4 className="font-bold text-sm text-[#1C1C1E] mb-3 flex items-center gap-2">
                    <FileText size={16} className="text-[#1B4332]" />
                    {t.schemeRules}
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#374151]">
                    {currentScheme.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-[#E5E7E0] rounded-xl p-5 bg-[#FAFAF7]">
                  <h4 className="font-bold text-sm text-[#1C1C1E] mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-[#D4A843]" />
                    {t.nextActionSteps}
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#374151]">
                    {currentScheme.nextSteps.map((st, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 border border-[#E5E7E0] bg-white text-[#374151] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#FAFAF7] transition-all text-sm"
            >
              <ArrowLeft size={16} /> {t.backBtn}
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-semibold px-7 py-3 rounded-xl hover:bg-[#2D6A4F] transition-all text-base shadow-sm"
            >
              {t.continueBtn} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 3: FARMER INFORMATION & LOCATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#1C1C1E] mb-1">{t.farmerInfoTitle}</h2>
              <p className="text-sm text-[#6B7280] mb-6">
                Please provide basic details about yourself and the damaged plot.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {/* Farmer Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1C1E] mb-1.5">
                    {t.nameLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={form.farmerName}
                      onChange={(e) => setForm({ ...form, farmerName: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1C1E] mb-1.5">
                    {t.mobileLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="tel"
                      value={form.mobileNumber}
                      onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-1">Used to track and verify your report.</p>
                </div>

                {/* Predefined Crop List */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1C1E] mb-1.5">
                    {t.cropLabel} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.crop}
                    onChange={(e) => setForm({ ...form, crop: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none cursor-pointer"
                  >
                    {COMMON_CROPS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Land Area */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1C1E] mb-1.5">
                    {t.landAreaLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={form.landArea}
                      onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none"
                      placeholder="e.g. 2.5"
                    />
                    <select
                      value={form.landUnit}
                      onChange={(e) => setForm({ ...form, landUnit: e.target.value })}
                      className="w-28 px-2 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none cursor-pointer"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Hectares">Hectares</option>
                      <option value="Bigha">Bigha</option>
                      <option value="Guntha">Guntha</option>
                    </select>
                  </div>
                </div>

                {/* Date of damage */}
                <div>
                  <label className="block text-sm font-semibold text-[#1C1C1E] mb-1.5">
                    {t.dateLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input
                      type="date"
                      max={new Date().toISOString().split('T')[0]}
                      value={form.damageDate}
                      onChange={(e) => setForm({ ...form, damageDate: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1C1C1E] mb-1.5">
                    {t.descLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={t.descPlaceholder}
                    className="w-full px-3.5 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none resize-none"
                  />
                </div>
              </div>

              {/* ── Section 4: Location Options ───────────────────────── */}
              <div className="pt-6 border-t border-[#E5E7E0]">
                <h3 className="text-lg font-bold text-[#1C1C1E] mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-[#1B4332]" />
                  {t.locationTitle}
                </h3>

                {/* Toggle Buttons for GPS vs Manual */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gpsLoading}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
                      locationMode === 'gps' && gpsCoordinates
                        ? 'bg-[#1B4332] text-white border-[#1B4332]'
                        : 'bg-white text-[#1B4332] border-[#1B4332]/40 hover:bg-[#1B4332]/5'
                    }`}
                  >
                    <MapPin size={16} />
                    {gpsLoading ? 'Detecting Location...' : t.useGpsBtn}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocationMode('manual')}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all ${
                      locationMode === 'manual'
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {t.manualBtn}
                  </button>
                </div>

                {locationError && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-800 flex items-center gap-2">
                    <AlertTriangle size={14} className="flex-shrink-0" />
                    <span>{locationError}</span>
                  </div>
                )}

                {/* GPS Detected Badge */}
                {gpsCoordinates && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      {t.detectedLocation}: Latitude {gpsCoordinates.latitude}°, Longitude {gpsCoordinates.longitude}°
                    </span>
                    <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded text-emerald-900 font-bold uppercase">
                      GPS Active
                    </span>
                  </div>
                )}

                {/* Manual Dropdowns (Always available as primary or fallback) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAFAF7] p-4 rounded-xl border border-[#E5E7E0]">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                      {t.stateLabel} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const newDists = STATES_AND_DISTRICTS[newState] || [];
                        setForm({
                          ...form,
                          state: newState,
                          district: newDists[0] || '',
                        });
                      }}
                      className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 outline-none cursor-pointer"
                    >
                      {Object.keys(STATES_AND_DISTRICTS).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                      {t.districtLabel} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 outline-none cursor-pointer"
                    >
                      {districtsForState.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1">
                      {t.villageLabel}
                    </label>
                    <input
                      type="text"
                      value={form.village}
                      onChange={(e) => setForm({ ...form, village: e.target.value })}
                      placeholder="e.g. Dindori / Pimpalgaon"
                      className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 border border-[#E5E7E0] bg-white text-[#374151] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#FAFAF7] transition-all text-sm"
            >
              <ArrowLeft size={16} /> {t.backBtn}
            </button>

            <button
              type="button"
              onClick={() => {
                if (!form.farmerName.trim() || !form.mobileNumber.trim()) {
                  alert('Please enter Farmer Name and a valid 10-digit Mobile Number.');
                  return;
                }
                setStep(4);
              }}
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white font-semibold px-7 py-3 rounded-xl hover:bg-[#2D6A4F] transition-all text-base shadow-sm"
            >
              {t.continueBtn} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 4: EVIDENCE UPLOAD & SUBMIT CONFIRMATION */}
      {/* ───────────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          {/* Upload Evidence Card */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#1C1C1E] mb-1">{t.evidenceTitle}</h2>
              <p className="text-sm text-[#6B7280] mb-5">{t.evidenceSub}</p>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-[#1B4332]/30 hover:border-[#1B4332] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-[#1B4332]/5 hover:bg-[#1B4332]/10 transition-colors">
                <UploadCloud size={36} className="text-[#1B4332] mb-2" />
                <span className="font-semibold text-sm text-[#1B4332]">{t.dragDropText}</span>
                <span className="text-xs text-[#6B7280] mt-1">{t.supportedTypes}</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {fileError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertTriangle size={14} className="flex-shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {/* Uploaded File Previews */}
              {evidenceFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                    Attached Files ({evidenceFiles.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {evidenceFiles.map((file) => (
                      <div
                        key={file.id}
                        className="relative group border border-[#E5E7E0] rounded-xl overflow-hidden bg-white shadow-xs"
                      >
                        {file.type.startsWith('video') ? (
                          <div className="h-28 bg-gray-900 flex items-center justify-center text-white text-xs p-2 text-center">
                            🎥 Video ({file.size})
                          </div>
                        ) : (
                          <img
                            src={file.previewUrl}
                            alt={file.name}
                            className="h-28 w-full object-cover"
                          />
                        )}
                        <div className="p-2 bg-white">
                          <p className="text-[11px] font-medium text-[#1C1C1E] truncate">{file.name}</p>
                          <p className="text-[10px] text-[#6B7280]">{file.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-xs"
                          title="Remove file"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Report Summary Card */}
          <Card>
            <div className="p-6">
              <h3 className="text-base font-bold text-[#1C1C1E] mb-4">{t.reviewTitle}</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs border-b border-[#E5E7E0] pb-4">
                <div>
                  <span className="text-[#6B7280]">Problem:</span>
                  <p className="font-semibold text-[#1C1C1E] text-sm mt-0.5">
                    {selectedProblem?.icon} {lang === 'hi' ? selectedProblem?.titleHi : selectedProblem?.title}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B7280]">Crop:</span>
                  <p className="font-semibold text-[#1C1C1E] text-sm mt-0.5">{form.crop}</p>
                </div>
                <div>
                  <span className="text-[#6B7280]">Affected Land:</span>
                  <p className="font-semibold text-[#1C1C1E] text-sm mt-0.5">
                    {form.landArea} {form.landUnit}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B7280]">Location:</span>
                  <p className="font-semibold text-[#1C1C1E] text-sm mt-0.5">
                    {form.village ? `${form.village}, ` : ''}
                    {form.district}, {form.state}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B7280]">Date of Damage:</span>
                  <p className="font-semibold text-[#1C1C1E] text-sm mt-0.5">{form.damageDate}</p>
                </div>
                <div>
                  <span className="text-[#6B7280]">Applicable Scheme:</span>
                  <p className="font-semibold text-[#1B4332] text-sm mt-0.5 truncate">
                    {currentScheme.name}
                  </p>
                </div>
              </div>

              {/* Legal Notice Before Submission (Explicitly Required) */}
              <div className="mt-5 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2 mb-1.5">
                  <ShieldAlert size={18} className="text-amber-800" />
                  {t.reviewNoticeTitle}
                </h4>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed italic">
                  “{t.reviewNoticeText}”
                </p>

                {/* Confirmation Checkbox */}
                <label className="mt-4 flex items-start gap-3 cursor-pointer pt-3 border-t border-amber-200">
                  <input
                    type="checkbox"
                    checked={confirmedDeclaration}
                    onChange={(e) => setConfirmedDeclaration(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded text-[#1B4332] focus:ring-[#1B4332] cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-semibold text-amber-950">
                    {t.checkboxConfirm}
                  </span>
                </label>
              </div>
            </div>
          </Card>

          {/* Action Navigation */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 border border-[#E5E7E0] bg-white text-[#374151] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#FAFAF7] transition-all text-sm"
            >
              <ArrowLeft size={16} /> {t.backBtn}
            </button>

            <button
              type="button"
              disabled={!confirmedDeclaration || isSubmitting}
              onClick={handleSubmitReport}
              className={`inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl transition-all text-base shadow-md ${
                confirmedDeclaration && !isSubmitting
                  ? 'bg-red-700 hover:bg-red-800 cursor-pointer scale-100 active:scale-95'
                  : 'bg-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Clock className="animate-spin" size={18} />
                  {t.submittingText}
                </>
              ) : (
                <>
                  <span>🚨</span>
                  {t.submitBtn}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP 5: SUBMITTED CONFIRMATION & RECEIPT */}
      {/* ───────────────────────────────────────────────────────────── */}
      {step === 5 && submittedReport && (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <div className="p-8 text-center border-b border-[#E5E7E0]">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border-2 border-emerald-300">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">{t.submittedTitle}</h2>
              <p className="text-sm text-[#6B7280]">
                Your crop loss report has been safely logged in Demeter and is prepared for official intimation.
              </p>

              {/* Prominent Report ID Banner */}
              <div className="mt-6 bg-[#1B4332]/8 border-2 border-dashed border-[#1B4332]/40 rounded-xl p-4 inline-block">
                <span className="text-xs uppercase font-bold text-[#1B4332] tracking-wider">
                  {t.reportIdLabel}
                </span>
                <p className="text-3xl font-black text-[#1B4332] tracking-widest mt-1">
                  {submittedReport.reportId}
                </p>
                <p className="text-[11px] text-[#6B7280] mt-1">
                  Save this number along with mobile <strong className="text-[#1C1C1E]">{submittedReport.mobileNumber}</strong> to track progress.
                </p>
              </div>
            </div>

            {/* Receipt Summary Details */}
            <div className="p-6 bg-[#FAFAF7] space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#6B7280]">{t.submittedDate}:</span>
                  <p className="font-semibold text-[#1C1C1E] mt-0.5">
                    {new Date(submittedReport.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B7280]">{t.statusLabel}:</span>
                  <div className="mt-0.5">
                    <StatusBadge status={submittedReport.status} />
                  </div>
                </div>
                <div>
                  <span className="text-[#6B7280]">Reported Problem:</span>
                  <p className="font-semibold text-[#1C1C1E] mt-0.5">{submittedReport.damageTypeName}</p>
                </div>
                <div>
                  <span className="text-[#6B7280]">Crop & Area:</span>
                  <p className="font-semibold text-[#1C1C1E] mt-0.5">
                    {submittedReport.crop} · {submittedReport.landArea} {submittedReport.landUnit}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B7280]">Location:</span>
                  <p className="font-semibold text-[#1C1C1E] mt-0.5">
                    {submittedReport.village}, {submittedReport.district}, {submittedReport.state}
                  </p>
                </div>
                <div>
                  <span className="text-[#6B7280]">Associated Scheme:</span>
                  <p className="font-semibold text-[#1B4332] mt-0.5 truncate">
                    {submittedReport.governmentService}
                  </p>
                </div>
              </div>

              {/* Next Steps Guidance */}
              <div className="pt-4 border-t border-[#E5E7E0]">
                <h4 className="text-xs font-bold text-[#1C1C1E] uppercase tracking-wider mb-2">
                  Immediate Recommended Actions:
                </h4>
                <ul className="text-xs text-[#374151] space-y-1.5 list-disc pl-4">
                  <li>
                    Intimate your local Taluka Agriculture Officer or call the PMFBY helpline <strong>14447</strong> within 72 hours of damage.
                  </li>
                  <li>
                    Keep your land documents (7/12 / Patta extract) and sowing certificate ready for surveyor inspection.
                  </li>
                  <li>
                    Check report status periodically using the <strong>Track My Report</strong> portal.
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/farmer/track-report?id=${submittedReport.reportId}&mobile=${submittedReport.mobileNumber}`}
              className="inline-flex items-center justify-center gap-2 bg-[#1B4332] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#2D6A4F] transition-all text-sm shadow-sm"
            >
              <Search size={16} />
              {t.trackBtn}
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 border border-[#E5E7E0] bg-white text-[#1C1C1E] font-semibold px-5 py-3 rounded-xl hover:bg-gray-50 transition-all text-sm"
            >
              <FileText size={16} />
              {t.printBtn}
            </button>

            <Link
              to="/farmer"
              className="inline-flex items-center justify-center gap-2 border border-transparent text-[#6B7280] font-semibold px-4 py-3 rounded-xl hover:text-[#1C1C1E] transition-all text-sm"
            >
              {t.dashboardBtn}
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
