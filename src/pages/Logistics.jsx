import { Truck, MapPin, Clock, Fuel, Leaf, CheckCircle, Navigation, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { logisticsDemo } from '../data/mockData';

const log = logisticsDemo;

const stopTypeStyle = {
  pickup:   { bg: 'bg-[#1B4332]', label: 'Pickup' },
  hub:      { bg: 'bg-[#D4A843]', label: 'Hub' },
  delivery: { bg: 'bg-blue-600', label: 'Delivery' },
};

const svgPoints = [
  { x: 30, y: 160, label: 'Sangamner' },
  { x: 95, y: 60,  label: 'Nashik' },
  { x: 80, y: 100, label: 'Dindori' },
  { x: 135, y: 85, label: 'Hub' },
  { x: 330, y: 145, label: 'Vashi APMC' },
];

export default function Logistics() {
  return (
    <DashboardLayout role="buyer">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-[#6B7280] mb-1">{log.orderId} · Logistics</p>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Route & Logistics</h1>
          <p className="text-sm text-[#6B7280] mt-1">Optimized collection and delivery route for your bulk order.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
          <AlertTriangle size={13} />
          Live map integration coming soon
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Navigation, label: 'Total Distance', value: log.summary.totalDistance, color: 'text-[#1B4332]', bg: 'bg-[#1B4332]/8' },
          { icon: Clock, label: 'Estimated Time', value: log.summary.estimatedTime, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Fuel, label: 'Fuel Cost (Est.)', value: log.summary.fuelCost, color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: Leaf, label: 'CO₂ Offset', value: log.summary.carbonOffset, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E5E7E0] p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={color} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">{label}</p>
              <p className="font-bold text-[#1C1C1E] text-sm">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0] flex items-center justify-between">
              <h2 className="font-semibold text-[#1C1C1E]">Optimized Route</h2>
              <span className="text-xs text-[#6B7280] bg-[#F3F4F0] px-2.5 py-1 rounded-full">Mock Route Visualization</span>
            </div>
            <div className="p-5">
              {/* SVG Map Placeholder */}
              <div className="bg-[#F0F4F0] rounded-xl overflow-hidden border border-[#E5E7E0] relative" style={{ height: 260 }}>
                {/* Grid background */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, #e0e8e0 0px, #e0e8e0 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, #e0e8e0 0px, #e0e8e0 1px, transparent 1px, transparent 30px)',
                }} />

                <svg width="100%" height="100%" viewBox="0 0 380 220" className="absolute inset-0">
                  {/* Route line */}
                  <polyline
                    points={svgPoints.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#1B4332"
                    strokeWidth="2.5"
                    strokeDasharray="8 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Direction arrows */}
                  {svgPoints.slice(0, -1).map((p, i) => {
                    const n = svgPoints[i + 1];
                    const mx = (p.x + n.x) / 2;
                    const my = (p.y + n.y) / 2;
                    return (
                      <circle key={i} cx={mx} cy={my} r="3" fill="#D4A843" />
                    );
                  })}
                  {/* Stop points */}
                  {log.route.map((stop, i) => {
                    const p = svgPoints[i];
                    const isDelivery = stop.type === 'delivery';
                    const isHub = stop.type === 'hub';
                    return (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r={isDelivery ? 10 : isHub ? 9 : 7}
                          fill={isDelivery ? '#3B82F6' : isHub ? '#D4A843' : '#1B4332'}
                          stroke="white" strokeWidth="2"
                        />
                        <text x={p.x} y={p.y + 22} textAnchor="middle" fontSize="8" fill="#374151" fontWeight="600">
                          {p.label}
                        </text>
                      </g>
                    );
                  })}
                  {/* Labels */}
                  <text x="10" y="198" fontSize="9" fill="#9CA3AF">Maharashtra Region — Not to scale</text>
                </svg>

                {/* Legend */}
                <div className="absolute bottom-3 right-3 bg-white/90 rounded-lg p-2.5 text-xs space-y-1 border border-[#E5E7E0]">
                  {[
                    { color: 'bg-[#1B4332]', label: 'Pickup Point' },
                    { color: 'bg-[#D4A843]', label: 'Collection Hub' },
                    { color: 'bg-blue-500', label: 'Delivery Point' },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-[#6B7280]">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#9CA3AF] mt-2 text-center flex items-center justify-center gap-1">
                <AlertTriangle size={10} />
                Route visualization is illustrative. OSRM / Google Maps integration will be added in a future release.
              </p>
            </div>
          </Card>

          {/* Stop Details */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Stop Details</h2>
            </div>
            <div className="divide-y divide-[#F3F4F0]">
              {log.route.map((stop, i) => {
                const style = stopTypeStyle[stop.type];
                return (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full ${style.bg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1C1C1E] text-sm">{stop.name}</p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-[#6B7280] flex-wrap">
                        <span className="flex items-center gap-1"><MapPin size={10} />{stop.location}</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{stop.time}</span>
                        <span>{stop.quantity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.bg} text-white`}>{style.label}</span>
                      <StatusBadge status={stop.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Vehicle Info */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Vehicle Details</h2>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              {[
                { label: 'Vehicle Type', value: log.vehicle.type },
                { label: 'Capacity', value: log.vehicle.capacity },
                { label: 'Reg. Number', value: log.vehicle.number },
                { label: 'Driver', value: log.vehicle.driver },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-[#F3F4F0] last:border-0">
                  <span className="text-[#6B7280]">{label}</span>
                  <span className="font-medium text-[#1C1C1E]">{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 mt-1 w-fit">
                <CheckCircle size={11} /> Refrigerated · Active GPS
              </div>
            </div>
          </Card>

          {/* Live Status */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Delivery Status</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="text-center py-3">
                <Truck size={36} className="text-[#1B4332] mx-auto mb-2" />
                <p className="font-bold text-[#1C1C1E]">En Route — Stop 3 of 5</p>
                <p className="text-sm text-[#6B7280] mt-0.5">Collecting from Sunita Patil · Dindori</p>
              </div>
              <div className="h-2 bg-[#F3F4F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#1B4332] rounded-full" style={{ width: '45%' }} />
              </div>
              <div className="flex justify-between text-xs text-[#6B7280]">
                <span>45% complete</span>
                <span>ETA: 03:30 PM · Vashi APMC</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
