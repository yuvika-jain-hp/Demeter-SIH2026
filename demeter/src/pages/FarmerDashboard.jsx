import { Link } from 'react-router-dom';
import { Package, ShoppingCart, MessageSquare, Plus, ArrowRight, MapPin, Tag, AlertCircle, TrendingUp } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import Card from '../components/Card';
import { farmerProduce, farmerOrders, recentActivity, currentFarmer } from '../data/mockData';

const activityColor = {
  wheat: 'bg-amber-400',
  success: 'bg-emerald-400',
  info: 'bg-blue-400',
  warning: 'bg-orange-400',
  sage: 'bg-[#7CA982]',
};

export default function FarmerDashboard() {
  const totalKg = farmerProduce.reduce((s, p) => s + p.quantity, 0);
  const activeOrders = farmerOrders.filter(o => o.status === 'Active').length;
  const pendingNegs = farmerOrders.filter(o => o.status === 'Pending Negotiation').length;

  return (
    <DashboardLayout role="farmer">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-sm text-[#6B7280] mb-0.5">Good morning, {currentFarmer.name.split(' ')[0]} 👋</p>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Farmer Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-1">{currentFarmer.fpo} · {currentFarmer.location}</p>
        </div>
        <Link
          to="/farmer/add-produce"
          className="inline-flex items-center gap-2 bg-[#1B4332] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors"
        >
          <Plus size={16} />
          Add Produce
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total Produce Listed" value={`${(totalKg / 1000).toFixed(1)}k kg`} subtext="+2k kg from last week" icon={Package} color="forest" trend="+14%" />
        <StatCard label="Active Orders" value={activeOrders} subtext="View all orders" icon={ShoppingCart} color="sage" />
        <StatCard label="Pending Negotiations" value={pendingNegs} subtext="In progress" icon={MessageSquare} color="warning" />
        <StatCard label="Pending Actions" value="1" subtext="1 bulk requirement needs your response" icon={AlertCircle} color="warning" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Action-Oriented Pending Negotiation Panel */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={16} className="text-amber-600" />
                  <h2 className="font-semibold text-amber-900">Needs Your Response</h2>
                </div>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-amber-800 mt-2">
                  <span className="font-bold">Tomatoes · 800 kg</span>
                  <span className="hidden sm:inline-block w-1 h-1 bg-amber-300 rounded-full"></span>
                  <span>FreshLink Wholesale</span>
                  <span className="hidden sm:inline-block w-1 h-1 bg-amber-300 rounded-full"></span>
                  <span className="font-medium">₹26/kg · Grade A</span>
                </div>
              </div>
              <Link 
                to="/negotiation" 
                className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap text-sm shadow-sm"
              >
                Review & Respond <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Produce Listings */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0] flex items-center justify-between">
              <h2 className="font-semibold text-[#1C1C1E]">Current Produce Listings</h2>
              <Link to="/farmer/add-produce" className="text-sm text-[#1B4332] font-medium hover:underline flex items-center gap-1">
                Add New <Plus size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7E0]">
                    {['Crop', 'Quantity', 'Grade', 'Harvest Date', 'Price/kg', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F0]">
                  {farmerProduce.map(p => (
                    <tr key={p.id} className="hover:bg-[#FAFAF7] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-[#1C1C1E]">{p.crop}</td>
                      <td className="px-5 py-3.5 text-[#374151]">{p.quantity.toLocaleString()} kg</td>
                      <td className="px-5 py-3.5"><StatusBadge status={p.grade} /></td>
                      <td className="px-5 py-3.5 text-[#6B7280]">{new Date(p.harvestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                      <td className="px-5 py-3.5 font-medium text-[#1C1C1E]">₹{p.expectedPrice}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Latest Orders */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0] flex items-center justify-between">
              <h2 className="font-semibold text-[#1C1C1E]">Latest Orders</h2>
              <Link to="/matching" className="text-sm text-[#1B4332] font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-[#F3F4F0]">
              {farmerOrders.map(o => (
                <div key={o.id} className="px-5 py-4 flex items-center justify-between hover:bg-[#FAFAF7] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#1B4332]/8 flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-[#1B4332]" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-medium text-[#1C1C1E] text-sm">{o.crop} · {o.quantity} kg</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{o.buyer}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <StatusBadge status={o.status} />
                    <p className="text-xs text-[#6B7280]">₹{o.offeredPrice}/kg</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Recent Activity */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Recent Activity</h2>
            </div>
            <div className="px-5 py-4 space-y-4">
              {recentActivity.map(a => (
                <div key={a.id} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activityColor[a.color] || 'bg-gray-300'}`} />
                  <div>
                    <p className="text-sm text-[#374151] leading-snug">{a.message}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Farm Profile */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Farm Profile</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={14} className="text-[#6B7280]" />
                <span className="text-[#374151]">{currentFarmer.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Tag size={14} className="text-[#6B7280]" />
                <span className="text-[#374151]">{currentFarmer.fpo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Package size={14} className="text-[#6B7280]" />
                <span className="text-[#374151]">{currentFarmer.totalLand} under cultivation</span>
              </div>
              <div className="mt-3 pt-3 border-t border-[#E5E7E0]">
                <p className="text-xs text-[#6B7280] mb-2">Primary Crops</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentFarmer.primaryCrops.map(c => (
                    <span key={c} className="text-xs bg-[#1B4332]/8 text-[#1B4332] px-2.5 py-1 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Quality Quick Action */}
          <div className="bg-[#1B4332] rounded-xl p-5 text-white">
            <p className="font-semibold mb-1">Quality Reports</p>
            <p className="text-sm text-white/70 mb-4">View grading results, inspection details and buyer feedback for your produce.</p>
            <Link to="/quality" className="inline-flex items-center gap-2 text-sm text-[#D4A843] font-medium hover:underline">
              View Reports <ArrowRight size={12} />
            </Link>
          </div>

          {/* Demand Insights Quick Action */}
          <div className="bg-white border border-[#E5E7E0] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-[#1B4332]" />
              <p className="font-semibold text-[#1C1C1E]">Demand Insights</p>
            </div>
            <p className="text-sm text-[#6B7280] mb-4">See upcoming bulk demand trends to help plan your harvest.</p>
            <Link to="/forecasting" className="inline-flex items-center gap-2 text-sm text-[#1B4332] font-medium hover:underline">
              View Insights <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
