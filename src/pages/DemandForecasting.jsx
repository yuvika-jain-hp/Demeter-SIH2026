import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, ChevronDown } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import { forecastingData } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7E0] rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-[#1C1C1E] mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name === 'actual' ? 'Actual' : 'Forecast'}: <strong>{p.value?.toLocaleString()} kg</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DemandForecasting() {
  const [selectedCrop, setSelectedCrop] = useState('Tomatoes');
  const cropData = forecastingData.monthly[selectedCrop] || forecastingData.monthly['Tomatoes'];

  const chartData = cropData.map(d => ({
    month: d.month,
    actual: d.actual,
    forecast: d.forecast,
  }));

  const lastActual = cropData.filter(d => d.actual).slice(-1)[0];
  const firstForecast = cropData.filter(d => d.forecast)[0];
  const growthPct = lastActual && firstForecast
    ? (((firstForecast.forecast - lastActual.actual) / lastActual.actual) * 100).toFixed(1)
    : null;

  return (
    <DashboardLayout role="buyer">
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1E]">Demand Forecasting</h1>
          <p className="text-sm text-[#6B7280] mt-1">Historical trends and AI-generated demand projections for bulk procurement planning.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
          <AlertTriangle size={13} />
          Mock data — ML model integration pending
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Crop Selector + Chart */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0] flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-semibold text-[#1C1C1E]">Demand Trend — {selectedCrop}</h2>
              <div className="relative">
                <select
                  className="border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] appearance-none pr-8 cursor-pointer"
                  value={selectedCrop}
                  onChange={e => setSelectedCrop(e.target.value)}
                >
                  {forecastingData.crops.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              </div>
            </div>
            <div className="px-5 py-5">
              {/* KPI strip */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Last Recorded Demand', value: `${(lastActual?.actual / 1000).toFixed(1)}k kg`, sub: 'Sep 2026' },
                  { label: 'Forecasted (Oct)', value: `${(firstForecast?.forecast / 1000).toFixed(1)}k kg`, sub: 'Next month' },
                  { label: 'Projected Growth', value: growthPct ? `+${growthPct}%` : 'N/A', sub: 'Month-on-month', green: true },
                ].map(({ label, value, sub, green }) => (
                  <div key={label} className="bg-[#FAFAF7] rounded-xl border border-[#E5E7E0] p-4 text-center">
                    <p className="text-xs text-[#9CA3AF] mb-1">{label}</p>
                    <p className={`text-xl font-bold ${green ? 'text-emerald-600' : 'text-[#1C1C1E]'}`}>{value}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Line Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0E8" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={35} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#1B4332"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#1B4332', strokeWidth: 0 }}
                      connectNulls={false}
                      name="actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#D4A843"
                      strokeWidth={2.5}
                      strokeDasharray="6 3"
                      dot={{ r: 4, fill: '#D4A843', strokeWidth: 0 }}
                      connectNulls={false}
                      name="forecast"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-5 mt-3 justify-center text-xs text-[#6B7280]">
                <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-[#1B4332] rounded" /> Actual Demand</div>
                <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-[#D4A843] rounded border-dashed" style={{ borderTop: '2px dashed #D4A843', background: 'none' }} /> AI Forecast</div>
              </div>
            </div>
          </Card>

          {/* Monthly comparison bar chart */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Crop Demand Comparison (Forecast Oct 2026)</h2>
            </div>
            <div className="px-5 py-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={forecastingData.topCrops}
                  margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  barSize={28}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0E8" vertical={false} />
                  <XAxis dataKey="crop" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={35} />
                  <Tooltip formatter={(v) => [`${v.toLocaleString()} kg`, 'Demand']} contentStyle={{ borderRadius: 10, border: '1px solid #E5E7E0', fontSize: 12 }} />
                  <Bar dataKey="demand" fill="#1B4332" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right — Top Crops Table */}
        <div className="space-y-5">
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Top Demanded Crops</h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">October 2026 Forecast</p>
            </div>
            <div className="divide-y divide-[#F3F4F0]">
              {forecastingData.topCrops.map((c, i) => (
                <div key={c.crop} className="px-5 py-3.5 flex items-center gap-3">
                  <span className="text-sm font-bold text-[#9CA3AF] w-5">{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1C1C1E]">{c.crop}</p>
                    <p className="text-xs text-[#6B7280]">{(c.demand / 1000).toFixed(0)}k kg forecast</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold ${c.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {c.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {c.growth}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Seasonal Insights */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Seasonal Insights</h2>
            </div>
            <div className="px-5 py-4 space-y-3 text-sm">
              {[
                { icon: '🍅', text: 'Tomato demand peaks in Oct–Nov driven by festival season HORECA demand.' },
                { icon: '🧅', text: 'Onion demand set to spike 38% — early procurement advised.' },
                { icon: '🥔', text: 'Potato demand stable with post-monsoon supply shortage expected.' },
              ].map(({ icon, text }) => (
                <div key={icon} className="flex gap-2.5 text-[#374151] leading-relaxed">
                  <span className="text-base flex-shrink-0">{icon}</span>
                  <p className="text-xs">{text}</p>
                </div>
              ))}
              <div className="mt-3 bg-[#1B4332]/6 border border-[#1B4332]/15 rounded-lg px-3 py-2.5 text-xs text-[#1B4332]">
                <p className="font-medium mb-0.5">⚡ AI Recommendation</p>
                <p>Post your Onion and Tomato requirements now to lock in pre-peak pricing.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
