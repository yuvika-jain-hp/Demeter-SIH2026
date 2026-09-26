import { useState } from 'react';
import { Send, TrendingUp, TrendingDown, Minus, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { negotiationDemo, currentFarmer } from '../data/mockData';

const { order, marketPrice, history } = negotiationDemo;

export default function NegotiationPage() {
  const [messages, setMessages] = useState(history);
  const [counter, setCounter] = useState('');
  const [note, setNote] = useState('');
  const [action, setAction] = useState(null); // 'accepted' | 'rejected' | null

  const sendCounter = () => {
    if (!counter) return;
    const newMsg = {
      from: 'Farmer',
      message: `Counter-offer: ₹${counter}/kg. ${note}`,
      time: 'Just now',
      price: Number(counter),
    };
    setMessages(m => [...m, newMsg]);
    setCounter('');
    setNote('');
  };

  if (action) {
    return (
      <DashboardLayout role="farmer">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${action === 'accepted' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
              {action === 'accepted' ? <CheckCircle size={32} className="text-emerald-600" /> : <XCircle size={32} className="text-red-500" />}
            </div>
            <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">{action === 'accepted' ? 'Order Accepted!' : 'Order Rejected'}</h2>
            <p className="text-[#6B7280] text-sm">{action === 'accepted' ? 'The buyer has been notified. Quality assessment will begin shortly.' : 'You have declined this order. You can view other available orders.'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="farmer">
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-mono text-[#6B7280]">{order.id}</p>
          <StatusBadge status={order.status} />
        </div>
        <h1 className="text-2xl font-bold text-[#1C1C1E]">Negotiation</h1>
        <p className="text-sm text-[#6B7280] mt-1">Review the offer and respond. You have full control over whether to accept the price.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Order Summary */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Buyer Requirement</h2>
            </div>
            <div className="px-5 py-4 grid sm:grid-cols-3 gap-5">
              {[
                { label: 'Crop', value: order.crop },
                { label: 'Quantity Requested', value: `${order.quantity} kg` },
                { label: 'Grade', value: order.grade },
                { label: 'Buyer', value: order.buyer },
                { label: 'Deadline', value: new Date(order.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-[#9CA3AF] mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#1C1C1E]">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Negotiation Thread */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0] flex items-center gap-2">
              <MessageSquare size={16} className="text-[#6B7280]" />
              <h2 className="font-semibold text-[#1C1C1E]">Negotiation Thread</h2>
            </div>
            <div className="px-5 py-4 space-y-4 max-h-64 overflow-y-auto">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'Farmer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-xl px-4 py-3 ${
                    m.from === 'Farmer'
                      ? 'bg-[#1B4332] text-white rounded-br-sm'
                      : 'bg-[#F3F4F0] text-[#1C1C1E] rounded-bl-sm'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold ${m.from === 'Farmer' ? 'text-white/80' : 'text-[#6B7280]'}`}>{m.from}</span>
                      {m.price && (
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${m.from === 'Farmer' ? 'bg-white/20 text-white' : 'bg-[#1B4332]/10 text-[#1B4332]'}`}>
                          ₹{m.price}/kg
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">{m.message}</p>
                    <p className={`text-xs mt-1.5 ${m.from === 'Farmer' ? 'text-white/50' : 'text-[#9CA3AF]'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Counter Offer Input */}
            <div className="px-5 py-4 border-t border-[#E5E7E0] bg-[#FAFAF7] rounded-b-xl">
              <p className="text-xs text-[#6B7280] font-medium mb-3">Send Counter-Offer</p>
              <div className="flex gap-3 mb-2">
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">₹</span>
                  <input
                    type="number"
                    value={counter}
                    onChange={e => setCounter(e.target.value)}
                    placeholder="Your price"
                    className="w-full border border-[#D1D5DB] rounded-lg pl-6 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332]"
                  />
                </div>
                <span className="self-center text-xs text-[#6B7280]">per kg</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a note (optional)…"
                  className="flex-1 border border-[#D1D5DB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4332]/25 focus:border-[#1B4332]"
                />
                <button onClick={sendCounter} className="flex items-center gap-1.5 bg-[#1B4332] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#2D6A4F] transition-colors font-medium">
                  <Send size={14} /> Send
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Price Reference */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Market Price Reference</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: 'Market Low', value: `₹${marketPrice.min}/kg`, icon: TrendingDown, color: 'text-red-500' },
                { label: 'Market Average', value: `₹${marketPrice.avg}/kg`, icon: Minus, color: 'text-[#6B7280]' },
                { label: 'Market High', value: `₹${marketPrice.max}/kg`, icon: TrendingUp, color: 'text-emerald-600' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#F3F4F0] last:border-0">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={color} />
                    <span className="text-sm text-[#6B7280]">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${color}`}>{value}</span>
                </div>
              ))}
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-800">
                <p className="font-medium">Current Offer: ₹{order.offeredPrice}/kg</p>
                <p className="mt-0.5">This is ₹{marketPrice.avg - order.offeredPrice} below market average. Negotiate for a fair price.</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7E0]">
              <h2 className="font-semibold text-[#1C1C1E]">Your Decision</h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="bg-[#FAFAF7] rounded-lg border border-[#E5E7E0] p-4 mb-2">
                <p className="text-xs text-[#9CA3AF]">Latest Offered Price</p>
                <p className="text-3xl font-black text-[#1B4332]">₹{messages[messages.length - 1].price || order.offeredPrice}<span className="text-base font-normal text-[#6B7280]">/kg</span></p>
                <p className="text-xs text-[#6B7280] mt-1">For {order.quantity} kg {order.crop} · {order.grade}</p>
              </div>
              <button
                onClick={() => setAction('accepted')}
                className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> Accept Offer
              </button>
              <p className="text-center text-xs text-[#9CA3AF]">or send a counter-offer above</p>
              <button
                onClick={() => setAction('rejected')}
                className="w-full border border-red-200 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-50 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <XCircle size={16} /> Reject Order
              </button>
            </div>
          </Card>

          <p className="text-xs text-[#9CA3AF] text-center px-4">
            You are under no obligation to accept any offer. Rejecting an order will not affect your profile rating.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
