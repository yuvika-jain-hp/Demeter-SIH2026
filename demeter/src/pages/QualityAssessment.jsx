import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, Shield, Star, FileText, ArrowRight, Package, Box } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { mockQualityReports } from '../data/mockData';

const gradeColor = {
  'A': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'B': 'bg-amber-50 text-amber-700 border-amber-300',
  'C': 'bg-orange-50 text-orange-700 border-orange-300'
};

export default function QualityAssessment() {
  const [selectedReportId, setSelectedReportId] = useState(mockQualityReports[0].id);
  const [reports, setReports] = useState(mockQualityReports);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleMarkComplete = () => {
    setReports(current =>
      current.map(r => {
        if (r.id === selectedReportId) {
          return {
            ...r,
            status: `Verified — Grade ${r.aiGrade}`,
            physicalInspection: {
              completed: true,
              inspector: 'Physical Verifier',
              date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              finalGrade: r.aiGrade,
              notes: 'Inspection manually marked complete in prototype. Standard quality verified.'
            }
          };
        }
        return r;
      })
    );
  };

  return (
    <DashboardLayout role="farmer">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Quality Reports</h1>
        <p className="text-sm text-[#6B7280] mt-1">Review AI-assisted produce assessments and verified quality reports.</p>
      </div>

      {/* AI Disclaimer Banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex gap-3">
        <AlertTriangle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">AI-assisted assessment</p>
          <p className="text-sm text-blue-800 mt-0.5">
            Visual analysis provides a preliminary quality assessment. Final grading requires physical inspection and verification.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of Reports */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-[#1C1C1E] mb-2">Recent Quality Assessments</h2>
          <div className="space-y-3">
            {reports.map((report) => (
              <div 
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`bg-white rounded-xl border ${selectedReportId === report.id ? 'border-[#1B4332] shadow-md ring-1 ring-[#1B4332]' : 'border-[#E5E7E0] shadow-sm hover:border-[#1B4332]/50'} cursor-pointer p-4 transition-all`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-mono text-xs text-[#6B7280]">{report.id}</p>
                  <p className="text-xs text-[#9CA3AF]">{report.submitted}</p>
                </div>
                <h3 className="font-bold text-[#1C1C1E]">{report.crop}</h3>
                <p className="text-sm text-[#6B7280] mb-3">Batch: {report.batch} · {report.quantity} kg</p>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${gradeColor[report.aiGrade]}`}>
                      {report.aiGrade}
                    </div>
                    <div className="text-xs">
                      <p className="text-[#6B7280]">AI Grade</p>
                      <p className="font-semibold text-[#1C1C1E]">{report.confidence}% Conf.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F3F4F0]">
                  <StatusBadge status={report.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed View */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <Card className="h-full flex flex-col">
              <div className="px-6 py-5 border-b border-[#E5E7E0] flex justify-between items-start bg-[#FAFAF7] rounded-t-xl">
                <div>
                  <h2 className="text-xl font-bold text-[#1C1C1E] mb-1">{selectedReport.crop} Assessment</h2>
                  <p className="text-sm text-[#6B7280] flex items-center gap-2">
                    <Box size={14} /> Batch {selectedReport.batch} 
                    <span className="text-[#D1D5DB]">|</span> 
                    <Package size={14} /> {selectedReport.quantity} kg
                  </p>
                  <p className="text-sm text-[#6B7280] mt-1">{selectedReport.farmerFpo}</p>
                </div>
                <StatusBadge status={selectedReport.status} />
              </div>

              <div className="p-6 flex-1 space-y-8">
                
                {/* Grading Section */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* AI Preliminary */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider">Preliminary AI Assessment</h3>
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-black text-3xl border-2 ${gradeColor[selectedReport.aiGrade]}`}>
                        {selectedReport.aiGrade}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#1C1C1E]">{selectedReport.confidence}%</p>
                        <p className="text-sm text-[#6B7280]">AI Confidence</p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-3">
                      <p className="text-xs font-semibold text-[#1C1C1E]">Observed Parameters:</p>
                      {selectedReport.parameters.map(p => (
                        <div key={p.name}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-[#6B7280]">{p.name}</span>
                            <span className="font-medium text-[#1C1C1E]">{p.score}/100</span>
                          </div>
                          <div className="h-1.5 bg-[#F3F4F0] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#7CA982] rounded-full"
                              style={{ width: `${p.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Physical Inspection & Final Grade */}
                  <div className="space-y-4 border-l border-[#E5E7E0] pl-8">
                    <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider">Physical Inspection</h3>
                    
                    {selectedReport.physicalInspection.completed ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 w-fit">
                          <CheckCircle size={16} />
                          <span className="text-sm font-semibold">Inspection Completed</span>
                        </div>
                        
                        <div className="text-sm space-y-2">
                          <p><span className="text-[#6B7280]">Verifier:</span> <span className="font-medium text-[#1C1C1E]">{selectedReport.physicalInspection.inspector}</span></p>
                          <p><span className="text-[#6B7280]">Date:</span> <span className="font-medium text-[#1C1C1E]">{selectedReport.physicalInspection.date}</span></p>
                          <p className="text-[#374151] bg-[#FAFAF7] p-3 rounded-lg border border-[#E5E7E0] italic text-xs leading-relaxed">
                            "{selectedReport.physicalInspection.notes}"
                          </p>
                        </div>

                        <div className="pt-2 border-t border-[#E5E7E0]">
                          <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Final Verified Grade</p>
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-2xl border-2 ${gradeColor[selectedReport.physicalInspection.finalGrade]}`}>
                              {selectedReport.physicalInspection.finalGrade}
                            </div>
                            <span className="font-semibold text-[#1C1C1E]">
                              {selectedReport.aiGrade === selectedReport.physicalInspection.finalGrade ? 'AI Grade Confirmed' : 'Regraded post-inspection'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-fit">
                          <Clock size={16} />
                          <span className="text-sm font-semibold">Pending Physical Inspection</span>
                        </div>
                        <p className="text-sm text-[#6B7280]">
                          Final grade will be issued once a physical verifier reviews the batch.
                        </p>
                        <button 
                          onClick={handleMarkComplete}
                          className="mt-2 inline-flex items-center justify-center gap-2 bg-white border border-[#D1D5DB] text-[#1C1C1E] text-sm font-medium px-4 py-2 rounded hover:bg-[#FAFAF7] transition-colors"
                        >
                          Mark Physical Inspection Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Buyer Feedback */}
                {selectedReport.feedback.comment && (
                  <div className="pt-6 border-t border-[#E5E7E0]">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={16} className="text-[#1B4332]" />
                      <h3 className="font-semibold text-[#1C1C1E]">Buyer Feedback</h3>
                    </div>
                    <div className="bg-[#FAFAF7] rounded-lg border border-[#E5E7E0] p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-[#1C1C1E] text-sm">{selectedReport.feedback.buyer}</p>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} size={14} className={j < Math.floor(selectedReport.feedback.rating) ? 'text-[#D4A843] fill-current' : 'text-[#D1D5DB]'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#374151] mb-3">"{selectedReport.feedback.comment}"</p>
                      <p className="text-xs text-[#9CA3AF]">
                        Buyer feedback provides additional quality evidence but does not replace formal physical inspection.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Actions Footer */}
              <div className="px-6 py-4 border-t border-[#E5E7E0] bg-[#FAFAF7] rounded-b-xl flex justify-end gap-3">
                <button className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1C1C1E] transition-colors">
                  View Batch
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#D1D5DB] text-sm font-medium text-[#1C1C1E] rounded hover:bg-gray-50 transition-colors shadow-sm">
                  <FileText size={16} /> Download Report
                </button>
                <Link to="/farmer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-sm font-medium text-white rounded hover:bg-[#2D6A4F] transition-colors">
                  Back to Dashboard
                </Link>
              </div>

            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-[#E5E7E0] rounded-xl text-[#6B7280]">
              Select a report to view details
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
