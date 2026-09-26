import { Link } from 'react-router-dom';
import { ShoppingCart, GitMerge, Clock, CheckCircle, Plus, ArrowRight, MapPin, TrendingUp, AlertCircle, FileText } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import { buyerRequirements, currentBuyer } from '../data/mockData';

export default function BuyerDashboard() {
  const active = buyerRequirements.filter(r => r.status === 'Active' || r.status === 'Matching').length;
  const inProgress = buyerRequirements.filter(r => r.status === 'In Progress').length;
  const completed = buyerRequirements.filter(r => r.status === 'Completed').length;
  const matched = buyerRequirements.filter(r => r.matchPercent === 100 && r.status === 'Matching').length;

  const matchesForReview = buyerRequirements.find(r => r.matchPercent === 100 && r.status === 'Matching');

  return (
    <DashboardLayout role="buyer">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-sm text-[#6B7280] mb-0.5">Welcome back, {currentBuyer.name.split(' ')[0]} 👋</p>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Buyer Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-1">{currentBuyer.company}</p>
        </div>
        <Link
          to="/buyer/create-requirement"
          className="inline-flex items-center gap-2 bg-[#1B4332] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create Bulk Requirement
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Active Requirements" value={active} subtext="Pending fulfillment" icon={FileText} color="forest" />
        <StatCard label="Matches to Review" value={matched} subtext="Ready for negotiation" icon={GitMerge} color="warning" />
        <StatCard label="Orders in Progress" value={inProgress} subtext="Quality & logistics" icon={Clock} color="blue" />
        <StatCard label="Completed Orders" value={completed} subtext="This quarter" icon={CheckCircle} color="sage" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Urgent Action Panel for Matches */}
          {matchesForReview && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={16} className="text-amber-600" />
                    <h2 className="font-semibold text-amber-900">Matches Ready for Review</h2>
                  </div>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-amber-800 mt-2">
                    <span className="font-bold">{matchesForReview.crop} · {matchesForReview.quantity.toLocaleString()} kg</span>
                    <span className="hidden sm:inline-block w-1 h-1 bg-amber-300 rounded-full"></span>
                    <span>Required by {new Date(matchesForReview.requiredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span className="hidden sm:inline-block w-1 h-1 bg-amber-300 rounded-full"></span>
                    <span className="font-medium">100% Volume Matched</span>
                  </div>
                </div>
                <Link 
                  to="/matching" 
                  className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap text-sm shadow-sm"
                >
                  Review Matches <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}

          {/* Active Requirements Table */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0] flex items-center justify-between bg-[#FAFAF7] rounded-t-xl">
              <div>
                <h2 className="font-semibold text-[#1C1C1E]">Your Bulk Requirements</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">Track matching progress and active orders</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7E0] bg-white">
                    {['Requirement', 'Required By', 'Indicative Price', 'Status', 'Action'].map((h, i) => (
                      <th key={h} className={`px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F0]">
                  {buyerRequirements.map(r => (
                    <tr key={r.id} className="hover:bg-[#FAFAF7] transition-colors bg-white">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#1C1C1E]">{r.crop} · {r.quantity.toLocaleString()} kg</p>
                        <p className="text-xs text-[#6B7280] mt-1">Grade: {r.grade.replace('Grade ', '')} · ID: {r.id}</p>
                      </td>
                      <td className="px-5 py-4 text-[#374151]">
                        {new Date(r.requiredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-5 py-4 text-[#374151] font-medium">
                        ₹{r.indicativePrice}/kg
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <StatusBadge status={r.status === 'Matching' && r.matchPercent === 100 ? 'Matches Found' : r.status} />
                          {r.status !== 'Completed' && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-[#E5E7E0] rounded-full overflow-hidden w-16">
                                <div
                                  className={`h-full rounded-full ${r.matchPercent === 100 ? 'bg-[#1B4332]' : 'bg-[#D4A843]'}`}
                                  style={{ width: `${r.matchPercent}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-medium text-[#6B7280]">{r.matchPercent}% matched</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {r.status === 'Matching' && r.matchPercent === 100 ? (
                          <Link to="/matching" className="text-sm text-amber-700 font-medium hover:underline">Review</Link>
                        ) : r.status === 'In Progress' ? (
                          <Link to="/logistics" className="text-sm text-[#1B4332] font-medium hover:underline">Track Order</Link>
                        ) : r.status === 'Completed' ? (
                          <span className="text-sm text-[#6B7280]">Done</span>
                        ) : (
                          <Link to="/matching" className="text-sm text-[#6B7280] hover:text-[#1C1C1E] font-medium">View</Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          
          {/* Create Requirement CTA Card */}
          <div className="bg-[#1B4332] rounded-xl p-6 text-white text-center shadow-md">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus size={24} className="text-[#D4A843]" />
            </div>
            <h3 className="font-bold text-lg mb-2">New Procurement</h3>
            <p className="text-sm text-white/80 mb-5 leading-relaxed">
              Define your crop, volume, and quality needs. We will find matching farmer FPOs.
            </p>
            <Link 
              to="/buyer/create-requirement" 
              className="block w-full py-2.5 bg-[#D4A843] hover:bg-[#E8C56A] text-[#1C1C1E] font-semibold rounded-lg transition-colors"
            >
              Create Requirement
            </Link>
          </div>

          {/* Company Profile */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0] bg-[#FAFAF7] rounded-t-xl">
              <h2 className="font-semibold text-[#1C1C1E]">Organization Profile</h2>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#E5E7E0] border border-[#D1D5DB] flex items-center justify-center font-bold text-[#374151] text-lg">
                  {currentBuyer.avatar}
                </div>
                <div>
                  <p className="font-bold text-[#1C1C1E]">{currentBuyer.company}</p>
                  <p className="text-sm text-[#6B7280]">{currentBuyer.name}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm pt-2">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#6B7280] mt-0.5" />
                  <span className="text-[#374151] leading-snug">{currentBuyer.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShoppingCart size={16} className="text-[#6B7280]" />
                  <span className="text-[#374151]">{currentBuyer.tier} Buyer</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Procurement Summary */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Procurement Summary</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Total Volume This Quarter', value: '18,000 kg' },
                { label: 'Avg. Order Value', value: '₹3.8L' },
                { label: 'Sourced Farmers', value: '14 FPOs' },
                { label: 'Fulfillment Rate', value: '96%' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[#F3F4F0] last:border-0 last:pb-0">
                  <span className="text-sm text-[#6B7280]">{label}</span>
                  <span className="text-sm font-semibold text-[#1C1C1E]">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Demand Insights Link */}
          <div className="bg-white border border-[#E5E7E0] rounded-xl p-5 shadow-sm hover:border-[#1B4332]/30 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-[#1B4332]" />
              <p className="font-semibold text-[#1C1C1E]">Market Demand Insights</p>
            </div>
            <p className="text-sm text-[#6B7280] mb-4 leading-relaxed">
              Analyze upcoming crop availability and pricing trends to plan your procurement.
            </p>
            <Link to="/forecasting" className="inline-flex items-center gap-1.5 text-sm text-[#1B4332] font-medium hover:underline">
              View Insights <ArrowRight size={14} />
            </Link>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
