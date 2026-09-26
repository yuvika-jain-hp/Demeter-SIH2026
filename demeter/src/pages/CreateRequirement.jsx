import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';

const crops = ['Tomatoes', 'Onions', 'Potatoes', 'Wheat', 'Rice', 'Maize', 'Grapes', 'Pomegranate'];
const grades = ['Grade A', 'Grade B', 'Grade C', 'Any / Unspecified'];
const units = ['kg', 'Quintals', 'Tonnes'];
const states = ['Maharashtra', 'Karnataka', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Gujarat'];

const inputCls = 'w-full border border-[#D1D5DB] rounded-lg px-3.5 py-2.5 text-sm text-[#1C1C1E] bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332] transition-all placeholder:text-[#9CA3AF]';
const selectCls = inputCls + ' appearance-none cursor-pointer';

const Field = ({ label, required, hint, children }) => (
  <div>
    <label className="block text-sm font-medium text-[#1C1C1E] mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-[#9CA3AF] mt-1.5 flex items-start gap-1"><Info size={11} className="mt-0.5 flex-shrink-0" />{hint}</p>}
  </div>
);

export default function CreateRequirement() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    crop: 'Tomatoes',
    quantity: '2000',
    unit: 'kg',
    grade: 'Grade A',
    requiredDate: '2026-09-25',
    state: 'Maharashtra',
    city: 'Navi Mumbai',
    deliveryAddress: 'Vashi APMC Market, Sector 19A',
    price: '26',
    recurring: false,
    frequency: 'Weekly',
    notes: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/matching'), 2000);
  };

  if (submitted) {
    return (
      <DashboardLayout role="buyer">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">Requirement Posted!</h2>
            <p className="text-[#6B7280] text-sm">DEMETER is matching your requirement with available farmer supply. Redirecting…</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="buyer">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Create Bulk Requirement</h1>
        <p className="text-sm text-[#6B7280] mt-1">Specify your bulk procurement need. DEMETER will match you with suitable farmers.</p>
      </div>

      {/* Bulk Procurement Notice */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex gap-3">
        <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-900">This platform is for BULK PROCUREMENT only.</p>
          <p className="text-sm text-amber-800 mt-0.5">
            DEMETER is designed for wholesalers, retailers, caterers, and institutional buyers who require large quantities of agricultural produce.
            Minimum order quantities apply. This is not a consumer grocery platform.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Produce Requirement */}
            <Card>
              <div className="px-6 py-4 border-b border-[#E5E7E0]">
                <h2 className="font-semibold text-[#1C1C1E]">Produce Requirement</h2>
              </div>
              <div className="px-6 py-5 grid sm:grid-cols-2 gap-5">
                <Field label="Crop Required" required>
                  <div className="relative">
                    <select className={selectCls} value={form.crop} onChange={e => set('crop', e.target.value)}>
                      {crops.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </Field>
                <Field label="Quality / Grade" required hint="Grade A = premium, B = standard, C = processing grade">
                  <div className="relative">
                    <select className={selectCls} value={form.grade} onChange={e => set('grade', e.target.value)}>
                      {grades.map(g => <option key={g}>{g}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </Field>
                <Field label="Required Quantity" required>
                  <input type="number" className={inputCls} value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="e.g. 2000" min="100" />
                </Field>
                <Field label="Unit" required>
                  <div className="relative">
                    <select className={selectCls} value={form.unit} onChange={e => set('unit', e.target.value)}>
                      {units.map(u => <option key={u}>{u}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-3 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </Field>
                <Field label="Required By (Date)" required>
                  <input type="date" className={inputCls} value={form.requiredDate} onChange={e => set('requiredDate', e.target.value)} />
                </Field>
                <Field label="Indicative Price (₹/kg)" hint="Non-binding floor price. Farmers may negotiate.">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">₹</span>
                    <input type="number" className={inputCls + ' pl-7'} value={form.price} onChange={e => set('price', e.target.value)} placeholder="26" />
                  </div>
                </Field>
              </div>
            </Card>

            {/* Delivery Location */}
            <Card>
              <div className="px-6 py-4 border-b border-[#E5E7E0]">
                <h2 className="font-semibold text-[#1C1C1E]">Delivery Location</h2>
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
                <Field label="City" required>
                  <input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Navi Mumbai" />
                </Field>
                <Field label="Delivery Address / Hub" required hint="APMC market, warehouse, cold storage, processing unit, etc.">
                  <input className={inputCls} value={form.deliveryAddress} onChange={e => set('deliveryAddress', e.target.value)} placeholder="e.g. Vashi APMC, Sector 19A" />
                </Field>
              </div>
            </Card>

            {/* Recurring Order */}
            <Card>
              <div className="px-6 py-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.recurring} onChange={e => set('recurring', e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#1B4332]" />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1E]">This is a recurring requirement</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Enable for regular bulk procurement needs (weekly, bi-weekly, monthly).</p>
                  </div>
                </label>
                {form.recurring && (
                  <div className="mt-4 ml-7">
                    <Field label="Frequency">
                      <div className="relative w-48">
                        <select className={selectCls} value={form.frequency} onChange={e => set('frequency', e.target.value)}>
                          {['Weekly', 'Bi-Weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-[#9CA3AF] pointer-events-none" />
                      </div>
                    </Field>
                  </div>
                )}
              </div>
            </Card>

            {/* Notes */}
            <Card>
              <div className="px-6 py-5">
                <Field label="Special Requirements / Notes">
                  <textarea className={inputCls + ' resize-none h-24'} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Packaging requirements, cold chain, delivery time window, certifications needed…" />
                </Field>
              </div>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-5">
            <Card>
              <div className="px-5 py-4 border-b border-[#E5E7E0]">
                <h2 className="font-semibold text-[#1C1C1E]">Requirement Summary</h2>
              </div>
              <div className="px-5 py-4">
                <div className="bg-[#FAFAF7] rounded-lg p-4 border border-[#E5E7E0] space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-[#6B7280]">Crop</span><span className="font-semibold">{form.crop}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Quantity</span><span className="font-semibold">{Number(form.quantity || 0).toLocaleString()} {form.unit}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Grade</span><span className="font-semibold">{form.grade}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Required By</span><span className="font-semibold">{form.requiredDate ? new Date(form.requiredDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-[#6B7280]">Delivery</span><span className="font-semibold text-right max-w-[140px] text-xs">{form.city}, {form.state}</span></div>
                  {form.price && <div className="flex justify-between border-t border-[#E5E7E0] pt-2"><span className="text-[#6B7280]">Indicative Price</span><span className="font-semibold text-[#1B4332]">₹{form.price}/kg</span></div>}
                </div>

                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-xs text-emerald-800">
                  <p className="font-medium mb-0.5">🌿 DEMETER Matching</p>
                  <p>Once posted, DEMETER will identify matching farmer supply within your region and notify matched farmers within 2–4 hours.</p>
                </div>
              </div>
            </Card>

            <button type="submit" className="w-full bg-[#1B4332] text-white font-semibold py-3 rounded-lg hover:bg-[#2D6A4F] transition-colors text-sm">
              Post Bulk Requirement
            </button>
            <button type="button" onClick={() => navigate('/buyer')} className="w-full border border-[#E5E7E0] text-[#6B7280] font-medium py-3 rounded-lg hover:bg-[#F3F4F0] transition-colors text-sm">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
