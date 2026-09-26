import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Phone,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Building2,
  RefreshCw,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { cropLossService, GOVERNMENT_SCHEMES } from '../data/cropLossService';

const STATUS_STEPS = [
  { key: 'Submitted', label: 'Report Submitted', desc: 'Received and registered in Demeter system.' },
  { key: 'Under Review', label: 'Under Review', desc: 'Crop damage photos, geo-tag, and land records under verification.' },
  { key: 'Forwarded to Department', label: 'Forwarded to Department', desc: 'Report forwarded to local Agriculture Office / Insurance Nodal Officer.' },
  { key: 'Resolved', label: 'Resolved / Assessment Done', desc: 'Survey inspection complete and final status updated.' },
];

export default function TrackReport() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const initialMobile = searchParams.get('mobile') || '';

  const [reportIdInput, setReportIdInput] = useState(initialId);
  const [mobileInput, setMobileInput] = useState(initialMobile);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample recent reports for quick demo click
  const [recentReports, setRecentReports] = useState([]);

  useEffect(() => {
    async function loadRecents() {
      const all = await cropLossService.getUserReports('F001');
      setRecentReports(all);
    }
    loadRecents();

    if (initialId && initialMobile) {
      handleSearch(initialId, initialMobile);
    }
  }, []);

  const handleSearch = async (targetId = reportIdInput, targetMobile = mobileInput) => {
    if (!targetId.trim() || !targetMobile.trim()) {
      setErrorMsg('Please enter both your Report ID and registered Mobile Number.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setSearched(true);

    try {
      const found = await cropLossService.getReportByIdAndMobile(targetId, targetMobile);
      if (found) {
        setReportData(found);
      } else {
        setReportData(null);
        setErrorMsg(`No record found matching Report ID "${targetId}" and mobile ending with "${targetMobile.slice(-4)}". Please check the details.`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred while retrieving report details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    const map = {
      Submitted: 0,
      'Under Review': 1,
      'Forwarded to Department': 2,
      Resolved: 3,
    };
    return map[status] !== undefined ? map[status] : 0;
  };

  return (
    <DashboardLayout role="farmer">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/farmer/help" className="text-[#6B7280] hover:text-[#1C1C1E] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-[#1C1C1E]">Track Crop Loss Report</h1>
          </div>
          <p className="text-sm text-[#6B7280]">
            Enter your Report ID (e.g. CR-784201) and registered mobile number to check latest verification status.
          </p>
        </div>

        <Link
          to="/farmer/help"
          className="inline-flex items-center gap-2 bg-[#1B4332] text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors self-start sm:self-auto"
        >
          <span>🌾 New Crop Loss Report</span>
        </Link>
      </div>

      {/* Search Filter Box */}
      <Card>
        <div className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
          >
            <div>
              <label className="block text-xs font-bold text-[#1C1C1E] uppercase tracking-wider mb-1.5">
                Report ID (CR-XXXXXX)
              </label>
              <input
                type="text"
                placeholder="e.g. CR-784201"
                value={reportIdInput}
                onChange={(e) => setReportIdInput(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1E] uppercase tracking-wider mb-1.5">
                Registered Mobile Number
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#D1D5DB] rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] outline-none font-medium"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1B4332] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-all text-sm shadow-xs"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} /> Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} /> Track Status
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-fills */}
          {recentReports.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#6B7280]">Quick fill sample reports:</span>
              {recentReports.map((r) => (
                <button
                  key={r.reportId}
                  type="button"
                  onClick={() => {
                    setReportIdInput(r.reportId);
                    setMobileInput(r.mobileNumber);
                    handleSearch(r.reportId, r.mobileNumber);
                  }}
                  className="px-2.5 py-1 rounded bg-[#1B4332]/8 text-[#1B4332] hover:bg-[#1B4332]/15 font-semibold transition-colors"
                >
                  {r.reportId} ({r.crop})
                </button>
              ))}
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Report Result Container */}
      {reportData && (
        <div className="mt-6 space-y-6">
          {/* Status Lifecycle Stepper */}
          <Card>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E7E0] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-[#1B4332] tracking-wider">
                      {reportData.reportId}
                    </span>
                    <StatusBadge status={reportData.status} />
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Submitted on{' '}
                    {new Date(reportData.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="text-right sm:text-right">
                  <span className="text-xs text-[#6B7280] block">Assisting Scheme:</span>
                  <span className="text-xs font-bold text-[#1B4332] block max-w-xs truncate">
                    {reportData.governmentService}
                  </span>
                </div>
              </div>

              {/* Step indicator */}
              <div className="py-6">
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                    {STATUS_STEPS.map((st, idx) => {
                      const currentIdx = getStepIndex(reportData.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div
                          key={st.key}
                          className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 text-left sm:text-center"
                        >
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                              isCompleted
                                ? 'bg-[#1B4332] text-white ring-4 ring-[#1B4332]/20'
                                : 'bg-gray-100 text-gray-400 border border-gray-300'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                          </div>
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? 'text-[#1B4332]'
                                  : isCompleted
                                  ? 'text-[#1C1C1E]'
                                  : 'text-gray-400'
                              }`}
                            >
                              {st.label}
                            </p>
                            <p className="text-[11px] text-[#6B7280] hidden sm:block mt-0.5 max-w-[150px]">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status History Logs */}
              {reportData.statusHistory && reportData.statusHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E5E7E0] bg-[#FAFAF7] rounded-xl p-4">
                  <h4 className="text-xs font-bold text-[#1C1C1E] uppercase tracking-wider mb-3">
                    Progress Timeline
                  </h4>
                  <div className="space-y-3">
                    {reportData.statusHistory.map((hist, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className="w-2 h-2 rounded-full bg-[#1B4332] mt-1.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1C1C1E]">{hist.status}</span>
                            <span className="text-[10px] text-[#9CA3AF]">
                              {new Date(hist.timestamp).toLocaleString('en-IN', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              })}
                            </span>
                          </div>
                          <p className="text-[#4B5563] mt-0.5">{hist.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Dossier Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <div className="p-6">
                  <h3 className="font-bold text-sm text-[#1C1C1E] mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-[#1B4332]" />
                    Damage & Land Inspection Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[#6B7280]">Farmer Name</span>
                      <p className="font-semibold text-[#1C1C1E] mt-0.5">{reportData.farmerName}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Contact Number</span>
                      <p className="font-semibold text-[#1C1C1E] mt-0.5">{reportData.mobileNumber}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Reported Damage</span>
                      <p className="font-semibold text-[#1C1C1E] mt-0.5">{reportData.damageTypeName}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Affected Crop</span>
                      <p className="font-semibold text-[#1C1C1E] mt-0.5">{reportData.crop}</p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Acreage Affected</span>
                      <p className="font-semibold text-[#1C1C1E] mt-0.5">
                        {reportData.landArea} {reportData.landUnit}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#6B7280]">Incident Date</span>
                      <p className="font-semibold text-[#1C1C1E] mt-0.5">{reportData.damageDate}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#6B7280]">Field Location</span>
                      <p className="font-semibold text-[#1C1C1E] mt-0.5">
                        {reportData.village}, {reportData.district}, {reportData.state}
                        {reportData.latitude && (
                          <span className="ml-2 text-emerald-700 font-mono text-[11px]">
                            (GPS: {reportData.latitude}°, {reportData.longitude}°)
                          </span>
                        )}
                      </p>
                    </div>
                    {reportData.description && (
                      <div className="col-span-2 mt-1">
                        <span className="text-[#6B7280]">Farmer Note</span>
                        <p className="font-medium text-[#374151] mt-0.5 bg-white p-2.5 rounded border border-gray-200">
                          {reportData.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Evidence attachments */}
                  {reportData.evidenceFiles && reportData.evidenceFiles.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-[#E5E7E0]">
                      <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                        Attached Evidence ({reportData.evidenceFiles.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {reportData.evidenceFiles.map((f, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700"
                          >
                            <span>📎</span>
                            <span className="max-w-[140px] truncate">{f.name}</span>
                            <span className="text-[10px] text-gray-400">({f.size})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column: Government Nodal Agency Info */}
            <div className="space-y-6">
              <div className="bg-[#1B4332] text-white rounded-xl p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={18} className="text-[#D4A843]" />
                  <h4 className="font-bold text-sm">Relevant Government Scheme</h4>
                </div>
                <p className="text-sm font-semibold text-white/95 mb-2">{reportData.governmentService}</p>
                <p className="text-xs text-white/75 leading-relaxed mb-4">
                  Eligibility and claim amounts depend entirely upon scheme norms, survey Panchnama, and verification by designated district officers.
                </p>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <a
                    href="https://pmfby.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs text-[#D4A843] hover:underline font-semibold"
                  >
                    <span>PMFBY Official Portal</span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://farmer.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-xs text-[#D4A843] hover:underline font-semibold"
                  >
                    <span>Kisan Portal (Govt of India)</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Help & Contact */}
              <Card>
                <div className="p-5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#6B7280] mb-3">
                    Need Help With This Report?
                  </h4>
                  <div className="space-y-3 text-xs text-[#374151]">
                    <div className="flex items-start gap-2">
                      <Phone size={14} className="text-[#1B4332] mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block text-[#1C1C1E]">National Kisan Call Center</strong>
                        <span className="text-emerald-700 font-bold">1800-180-1551</span> (Toll-Free, 6 AM - 10 PM)
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 size={14} className="text-[#1B4332] mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="block text-[#1C1C1E]">Local Assistance</strong>
                        <span>Contact your Taluka Agriculture Officer or Gram Sevak</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
