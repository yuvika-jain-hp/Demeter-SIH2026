import { Link } from 'react-router-dom';
import { MapPin, Star, Package, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import { orderMatchDemo } from '../data/mockData';

const { requirement: req, farmers } = orderMatchDemo;
const totalMatched = farmers.reduce((s, f) => s + f.quantity, 0);
const matchPct = Math.round((totalMatched / req.quantity) * 100);

const statusIcon = {
  Accepted: <CheckCircle size={14} className="text-emerald-600" />,
  Pending: <Clock size={14} className="text-amber-600" />,
  Rejected: <AlertCircle size={14} className="text-red-600" />,
};

export default function OrderMatching() {
  return (
    <DashboardLayout role="buyer">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="text-xs text-[#6B7280] font-mono mb-1">REQ-1042</p>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Order Matching</h1>
          <p className="text-sm text-[#6B7280] mt-1">DEMETER has identified farmers to fulfill your bulk requirement.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/aggregation" className="inline-flex items-center gap-2 border border-[#E5E7E0] text-[#374151] text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#F3F4F0] transition-colors">
            View Aggregation <ArrowRight size={14} />
          </Link>
          <button className="inline-flex items-center gap-2 bg-[#1B4332] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors">
            Confirm All Matches
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left — Requirement + Match */}
        <div className="lg:col-span-2 space-y-5">
          {/* Buyer Requirement Card */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0] flex items-center justify-between">
              <h2 className="font-semibold text-[#1C1C1E]">Buyer Requirement</h2>
              <StatusBadge status="Matching" />
            </div>
            <div className="px-5 py-4 grid sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                {[
                  { label: 'Crop', value: req.crop },
                  { label: 'Quantity', value: `${req.quantity.toLocaleString()} ${req.unit}` },
                  { label: 'Grade Required', value: req.grade },
                  { label: 'Indicative Price', value: `₹${req.indicativePrice}/kg` },
                  { label: 'Required By', value: new Date(req.requiredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) },
                  { label: 'Buyer', value: req.buyer },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-[#9CA3AF] mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-[#1C1C1E]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center bg-[#FAFAF7] rounded-xl border border-[#E5E7E0] p-4">
                <div className="relative w-20 h-20 mb-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7E0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1B4332" strokeWidth="3"
                      strokeDasharray={`${matchPct} ${100 - matchPct}`} strokeDashoffset="0" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#1B4332]">{matchPct}%</span>
                  </div>
                </div>
                <p className="text-xs text-[#6B7280] text-center font-medium">Match Rate</p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5">Fully Matched</p>
              </div>
            </div>
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-2 bg-[#F3F4F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#1B4332] rounded-full" style={{ width: `${matchPct}%` }} />
                </div>
                <span className="text-sm font-bold text-[#1B4332] whitespace-nowrap">{totalMatched.toLocaleString()} / {req.quantity.toLocaleString()} kg</span>
              </div>
              <div className="flex items-center gap-3">
                {farmers.map((f, i) => (
                  <div key={f.id} className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#1B4332]' : i === 1 ? 'bg-[#7CA982]' : 'bg-[#D4A843]'}`} />
                    {f.name.split(' ')[0]} · {f.quantity} kg
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Delivery Location */}
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <MapPin size={14} className="text-[#1B4332]" />
            Delivery to: <span className="font-medium text-[#1C1C1E]">{req.deliveryLocation}</span>
          </div>

          {/* Farmer Cards */}
          <div>
            <h2 className="font-semibold text-[#1C1C1E] mb-3">Matched Farmers ({farmers.length})</h2>
            <div className="space-y-3">
              {farmers.map((farmer, i) => (
                <Card key={farmer.id} className="hover:shadow-md transition-shadow">
                  <div className="px-5 py-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      i === 0 ? 'bg-[#1B4332] text-white' : i === 1 ? 'bg-[#7CA982] text-white' : 'bg-[#D4A843] text-[#1C1C1E]'
                    }`}>
                      {farmer.name[0]}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#1C1C1E] text-sm">{farmer.name}</p>
                        <span className="text-xs text-[#6B7280]">· {farmer.fpo}</span>
                        <div className="flex items-center gap-0.5">
                          <Star size={11} className="text-[#D4A843] fill-current" />
                          <span className="text-xs text-[#6B7280]">{farmer.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#6B7280] flex-wrap">
                        <span className="flex items-center gap-1"><MapPin size={10} />{farmer.location}</span>
                        <span>{farmer.distance} from delivery point</span>
                        <span>{farmer.completedOrders} completed orders</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-[#9CA3AF]">Quantity</p>
                        <p className="font-bold text-[#1C1C1E]">{farmer.quantity} kg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#9CA3AF]">Offered</p>
                        <p className="font-bold text-[#1B4332]">₹{farmer.offeredPrice}/kg</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {statusIcon[farmer.status]}
                        <StatusBadge status={farmer.status} />
                      </div>
                    </div>
                  </div>

                  {farmer.status === 'Pending' && (
                    <div className="px-5 pb-4 flex gap-2 ml-14">
                      <Link to="/negotiation" className="text-xs bg-[#1B4332] text-white px-3 py-1.5 rounded-lg hover:bg-[#2D6A4F] transition-colors font-medium">
                        View Negotiation
                      </Link>
                      <button className="text-xs border border-emerald-300 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors font-medium">
                        Accept Offer
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Order Flow */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Order Flow</h2>
            </div>
            <div className="px-5 py-4 space-y-0">
              {[
                { label: 'Requirement Created', done: true },
                { label: 'Farmers Matched', done: true },
                { label: 'Farmer Agreements', done: false, active: true },
                { label: 'Quality Assessment', done: false },
                { label: 'Produce Aggregation', done: false },
                { label: 'Route Optimization', done: false },
                { label: 'Delivery to Buyer', done: false },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                      step.done ? 'bg-[#1B4332] border-[#1B4332]' : step.active ? 'bg-white border-[#1B4332]' : 'bg-white border-[#D1D5DB]'
                    }`}>
                      {step.done && <CheckCircle size={10} className="text-white" />}
                      {step.active && <div className="w-2 h-2 rounded-full bg-[#1B4332]" />}
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${step.done ? 'bg-[#1B4332]' : 'bg-[#E5E7E0]'}`} style={{ minHeight: 20 }} />
                    )}
                  </div>
                  <p className={`text-sm pb-4 ${step.done ? 'text-[#1B4332] font-medium' : step.active ? 'text-[#1C1C1E] font-medium' : 'text-[#9CA3AF]'}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Quick Actions</h2>
            </div>
            <div className="px-5 py-4 space-y-2">
              {[
                { label: 'View Quality Reports', to: '/quality' },
                { label: 'Aggregation Plan', to: '/aggregation' },
                { label: 'Logistics & Route', to: '/logistics' },
              ].map(({ label, to }) => (
                <Link key={to} to={to} className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#FAFAF7] transition-colors text-sm text-[#374151] group">
                  {label}
                  <ArrowRight size={14} className="text-[#6B7280] group-hover:text-[#1B4332] transition-colors" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
