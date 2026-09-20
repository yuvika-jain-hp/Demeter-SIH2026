import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Truck, ArrowRight, Package } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { aggregationDemo } from '../data/mockData';

const agg = aggregationDemo;
const totalCollected = agg.farmers.filter(f => f.status !== 'Confirmed').reduce((s, f) => s + f.quantity, 0);
const totalRequired = agg.totalRequired;

const farmerColors = ['bg-[#1B4332]', 'bg-[#7CA982]', 'bg-[#D4A843]'];
const farmerWidths = agg.farmers.map(f => Math.round((f.quantity / totalRequired) * 100));

export default function Aggregation() {
  return (
    <DashboardLayout role="buyer">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-[#6B7280] mb-1">{agg.orderId} · {agg.crop}</p>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Produce Aggregation</h1>
          <p className="text-sm text-[#6B7280] mt-1">Pooling produce from multiple farmers to fulfill the bulk order.</p>
        </div>
        <Link to="/logistics" className="inline-flex items-center gap-2 bg-[#1B4332] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#2D6A4F] transition-colors">
          <Truck size={14} /> View Logistics
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Visual Pooling Diagram */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Produce Pooling Overview</h2>
            </div>
            <div className="px-5 py-6">
              {/* Farmer → Hub → Buyer flow */}
              <div className="flex items-center gap-0 mb-8">
                {/* Farmers column */}
                <div className="flex flex-col gap-3 flex-1">
                  {agg.farmers.map((farmer, i) => (
                    <div key={farmer.id} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${farmerColors[i]} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                        {farmer.name[0]}
                      </div>
                      <div className="flex-1 bg-[#FAFAF7] border border-[#E5E7E0] rounded-lg px-3 py-2">
                        <p className="text-xs font-semibold text-[#1C1C1E]">{farmer.name}</p>
                        <p className="text-xs text-[#6B7280]">{farmer.location} · {farmer.quantity} kg</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center px-4 gap-1">
                  <div className="w-12 h-px bg-[#D1D5DB]" />
                  <div className="w-2 h-2 rounded-full bg-[#1B4332]" />
                  <div className="w-12 h-px bg-[#D1D5DB]" />
                  <div className="text-xs text-[#9CA3AF] font-medium mt-1">Pool</div>
                </div>

                {/* Hub */}
                <div className="flex flex-col items-center bg-[#1B4332] text-white rounded-xl px-4 py-3 mx-2">
                  <Package size={20} className="mb-1" />
                  <p className="text-xs font-bold text-center">Collection<br />Hub</p>
                  <p className="text-xs text-white/70 mt-0.5">{totalRequired.toLocaleString()} kg</p>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center px-4 gap-1">
                  <div className="w-12 h-px bg-[#D1D5DB]" />
                  <div className="w-2 h-2 rounded-full bg-[#D4A843]" />
                  <div className="text-xs text-[#9CA3AF] font-medium mt-1">Dispatch</div>
                </div>

                {/* Buyer */}
                <div className="flex flex-col items-center bg-[#D4A843]/15 border border-[#D4A843]/30 rounded-xl px-4 py-3">
                  <Truck size={20} className="text-[#D4A843] mb-1" />
                  <p className="text-xs font-bold text-center text-[#1C1C1E]">Bulk<br />Buyer</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 text-center">Vashi<br />APMC</p>
                </div>
              </div>

              {/* Stacked bar */}
              <div>
                <div className="flex justify-between text-xs text-[#6B7280] mb-2">
                  <span>Contribution breakdown</span>
                  <span className="font-semibold text-[#1C1C1E]">{totalRequired.toLocaleString()} kg total</span>
                </div>
                <div className="h-6 rounded-full overflow-hidden flex">
                  {agg.farmers.map((f, i) => (
                    <div
                      key={f.id}
                      className={`h-full ${farmerColors[i]} flex items-center justify-center text-white text-xs font-bold`}
                      style={{ width: `${farmerWidths[i]}%` }}
                      title={`${f.name}: ${f.quantity} kg`}
                    >
                      {farmerWidths[i] > 15 ? `${f.quantity}kg` : ''}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-2">
                  {agg.farmers.map((f, i) => (
                    <div key={f.id} className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                      <div className={`w-2 h-2 rounded-full ${farmerColors[i]}`} />
                      {f.name.split(' ')[0]} ({farmerWidths[i]}%)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Farmer Contribution Table */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Farmer Contributions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7E0]">
                    {['Farmer', 'Location', 'Quantity', 'Collection Time', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F0]">
                  {agg.farmers.map((farmer, i) => (
                    <tr key={farmer.id} className="hover:bg-[#FAFAF7] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${farmerColors[i]} flex items-center justify-center text-white font-bold text-xs`}>
                            {farmer.name[0]}
                          </div>
                          <span className="font-medium text-[#1C1C1E]">{farmer.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#6B7280]">{farmer.location}</td>
                      <td className="px-5 py-3.5 font-semibold text-[#1C1C1E]">{farmer.quantity} kg</td>
                      <td className="px-5 py-3.5 text-[#6B7280] text-xs">{farmer.collection}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={farmer.status} /></td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#E5E7E0] bg-[#FAFAF7]">
                    <td className="px-5 py-3 font-bold text-[#1C1C1E]" colSpan={2}>TOTAL</td>
                    <td className="px-5 py-3 font-bold text-[#1B4332] text-lg">{totalRequired.toLocaleString()} kg</td>
                    <td colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right — Timeline */}
        <div className="space-y-5">
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Order Timeline</h2>
            </div>
            <div className="px-5 py-4 space-y-0">
              {agg.timeline.map((step, i, arr) => (
                <div key={step.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      step.status === 'done' ? 'bg-[#1B4332] border-[#1B4332]' :
                      step.status === 'active' ? 'bg-white border-[#1B4332]' :
                      'bg-white border-[#D1D5DB]'
                    }`}>
                      {step.status === 'done' && <CheckCircle size={10} className="text-white" />}
                      {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-[#1B4332]" />}
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${step.status === 'done' ? 'bg-[#1B4332]' : 'bg-[#E5E7E0]'}`} style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-5">
                    <p className={`text-sm ${step.status === 'done' ? 'font-medium text-[#1B4332]' : step.status === 'active' ? 'font-semibold text-[#1C1C1E]' : 'text-[#9CA3AF]'}`}>
                      {step.step}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hub Info */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Collection Hub</h2>
            </div>
            <div className="px-5 py-4 space-y-2 text-sm">
              <div>
                <p className="text-xs text-[#9CA3AF]">Hub Name</p>
                <p className="font-medium text-[#1C1C1E]">{agg.collectionHub}</p>
              </div>
              <div>
                <p className="text-xs text-[#9CA3AF]">Delivery Destination</p>
                <p className="font-medium text-[#1C1C1E]">{agg.deliveryLocation}</p>
              </div>
              <div className="pt-2">
                <Link to="/logistics" className="inline-flex items-center gap-1.5 text-sm text-[#1B4332] font-medium hover:underline">
                  View Route Plan <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
