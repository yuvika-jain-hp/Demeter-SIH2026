import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, MapPin, Calendar, Package, Info, CheckCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';

const crops = ['Tomatoes', 'Onions', 'Potatoes', 'Wheat', 'Rice', 'Maize', 'Grapes', 'Pomegranate', 'Cotton', 'Soybean'];
const units = ['kg', 'Quintals', 'Tonnes', 'Bags (50kg)'];
const grades = ['Grade A', 'Grade B', 'Grade C'];
const states = ['Maharashtra', 'Karnataka', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Gujarat', 'Andhra Pradesh', 'Madhya Pradesh'];

const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-[#9CA3AF] mt-1.5 flex items-start gap-1"><Info size={11} className="mt-0.5 flex-shrink-0" />{hint}</p>}
  </div>
);

const inputCls = 'w-full border border-[#D1D5DB] rounded-lg px-3.5 py-2.5 text-sm text-[#1C1C1E] bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] transition-all placeholder:text-[#9CA3AF]';
const selectCls = inputCls + ' appearance-none cursor-pointer';

export default function AddProduce() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    crop: 'Tomatoes',
    variety: 'Deshi',
    quantity: '3000',
    unit: 'kg',
    grade: 'Grade A',
    state: 'Maharashtra',
    district: 'Nashik',
    harvestDate: '2026-09-28',
    availableFrom: '2026-09-28',
    price: '28',
    organic: false,
    pesticide: true,
    irrigated: true,
    notes: 'Freshly harvested from our farm. Available for bulk order pickup from farm gate.',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/farmer'), 2200);
  };

  if (submitted) {
    return (
      <DashboardLayout role="farmer">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">Produce Listed Successfully!</h2>
            <p className="text-[#6B7280] text-sm">Your listing is now visible to bulk buyers. Redirecting to dashboard…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="farmer">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Add Produce Listing</h1>
        <p className="text-sm text-[#6B7280] mt-1">List your available or upcoming harvest to connect with bulk buyers.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Crop Details */}
            <Card>
              <div className="px-6 py-4 border-b border-[#E5E7E0]">
                <h2 className="font-semibold text-[#1C1C1E]">Crop Details</h2>
              </div>
              <div className="px-6 py-5 grid sm:grid-cols-2 gap-5">
                <Field label="Crop" required>
                  <div className="relative">
                    <select className={selectCls} value={form.crop} onChange={e => set('crop', e.target.value)}>
                      {crops.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </Field>
                <Field label="Variety / Type" hint="Optional — helps buyers identify your produce">
                  <input className={inputCls} value={form.variety} onChange={e => set('variety', e.target.value)} placeholder="e.g. Deshi, Hybrid, Arka Rakshak" />
                </Field>
                <Field label="Quantity" required>
                  <input type="number" className={inputCls} value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 3000" min="1" />
                </Field>
                <Field label="Unit" required>
                  <div className="relative">
                    <select className={selectCls} value={form.unit} onChange={e => set('unit', e.target.value)}>
                      {units.map(u => <option key={u}>{u}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </Field>
                <Field label="Quality Grade" required>
                  <div className="relative">
                    <select className={selectCls} value={form.grade} onChange={e => set('grade', e.target.value)}>
                      {grades.map(g => <option key={g}>{g}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </Field>
                <Field label="Expected Price (₹/kg)" required hint="Your floor price. Buyers may negotiate.">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">₹</span>
                    <input type="number" className={inputCls + ' pl-7'} value={form.price} onChange={e => set('price', e.target.value)} placeholder="28" />
                  </div>
                </Field>
              </div>
            </Card>

            {/* Location */}
            <Card>
              <div className="px-6 py-4 border-b border-[#E5E7E0]">
                <h2 className="font-semibold text-[#1C1C1E] flex items-center gap-2"><MapPin size={16} /> Location</h2>
              </div>
              <div className="px-6 py-5 grid sm:grid-cols-2 gap-5">
                <Field label="State" required>
                  <div className="relative">
                    <select className={selectCls} value={form.state} onChange={e => set('state', e.target.value)}>
                      {states.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </Field>
                <Field label="District / Taluka" required>
                  <input className={inputCls} value={form.district} onChange={e => set('district', e.target.value)} placeholder="e.g. Nashik" />
                </Field>
              </div>
            </Card>

            {/* Availability */}
            <Card>
              <div className="px-6 py-4 border-b border-[#E5E7E0]">
                <h2 className="font-semibold text-[#1C1C1E] flex items-center gap-2"><Calendar size={16} /> Availability</h2>
              </div>
              <div className="px-6 py-5 grid sm:grid-cols-2 gap-5">
                <Field label="Expected Harvest Date" required>
                  <input type="date" className={inputCls} value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} />
                </Field>
                <Field label="Available For Pickup From" required>
                  <input type="date" className={inputCls} value={form.availableFrom} onChange={e => set('availableFrom', e.target.value)} />
                </Field>
              </div>
            </Card>

            {/* Quality Info */}
            <Card>
              <div className="px-6 py-4 border-b border-[#E5E7E0]">
                <h2 className="font-semibold text-[#1C1C1E]">Quality Information</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: 'organic', label: 'Certified Organic' },
                    { key: 'pesticide', label: 'Pesticide Residue Tested' },
                    { key: 'irrigated', label: 'Irrigated Crop' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={e => set(key, e.target.checked)}
                        className="w-4 h-4 rounded border-[#D1D5DB] accent-[#1B4332]"
                      />
                      <span className="text-sm text-[#374151]">{label}</span>
                    </label>
                  ))}
                </div>
                <Field label="Additional Notes" hint="Any other details that may be useful for the buyer">
                  <textarea className={inputCls + ' resize-none h-24'} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Describe your produce, farming practices, storage conditions…" />
                </Field>
              </div>
            </Card>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-5">
            <Card>
              <div className="px-5 py-4 border-b border-[#E5E7E0]">
                <h2 className="font-semibold text-[#1C1C1E]">Listing Preview</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="bg-[#FAFAF7] rounded-lg p-4 border border-[#E5E7E0]">
                  <p className="text-lg font-bold text-[#1C1C1E]">{form.crop}</p>
                  <p className="text-sm text-[#6B7280] mt-0.5">{form.variety}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-[#9CA3AF]">Quantity</p><p className="font-semibold">{Number(form.quantity).toLocaleString()} {form.unit}</p></div>
                    <div><p className="text-xs text-[#9CA3AF]">Grade</p><p className="font-semibold">{form.grade}</p></div>
                    <div><p className="text-xs text-[#9CA3AF]">Location</p><p className="font-semibold">{form.district}, {form.state}</p></div>
                    <div><p className="text-xs text-[#9CA3AF]">Price</p><p className="font-semibold text-[#1B4332]">₹{form.price}/kg</p></div>
                  </div>
                  {form.harvestDate && (
                    <p className="text-xs text-[#6B7280] mt-3 flex items-center gap-1">
                      <Calendar size={11} /> Available from {new Date(form.harvestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800">
                  <p className="font-medium mb-0.5">⚡ Expected Match</p>
                  <p>Based on current buyer demand, your listing is likely to receive interest within 24–48 hours.</p>
                </div>
              </div>
            </Card>

            <button
              type="submit"
              className="w-full bg-[#1B4332] text-white font-semibold py-3 rounded-lg hover:bg-[#2D6A4F] transition-colors text-sm"
            >
              Publish Produce Listing
            </button>
            <button
              type="button"
              onClick={() => navigate('/farmer')}
              className="w-full border border-[#E5E7E0] text-[#6B7280] font-medium py-3 rounded-lg hover:bg-[#F3F4F0] transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
