import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, GitMerge,
  Award, Layers, Truck, TrendingUp, MessageSquare, LogOut, ChevronRight
} from 'lucide-react';
import Logo from './Logo';

const farmerNav = [
  { label: 'Dashboard', to: '/farmer', icon: LayoutDashboard },
  { label: 'My Produce', to: '/farmer/add-produce', icon: Package },
  { label: 'Orders', to: '/matching', icon: ShoppingCart },
  { label: 'Negotiations', to: '/negotiation', icon: MessageSquare },
  { label: 'Quality Reports', to: '/quality', icon: Award },
  { label: 'Logistics', to: '/logistics', icon: Truck },
];

const buyerNav = [
  { label: 'Dashboard', to: '/buyer', icon: LayoutDashboard },
  { label: 'Requirements', to: '/buyer/create-requirement', icon: ShoppingCart },
  { label: 'Matching', to: '/matching', icon: GitMerge },
  { label: 'Aggregation', to: '/aggregation', icon: Layers },
  { label: 'Logistics', to: '/logistics', icon: Truck },
  { label: 'Demand Forecast', to: '/forecasting', icon: TrendingUp },
];

export default function Sidebar({ role = 'farmer' }) {
  const location = useLocation();
  const nav = role === 'farmer' ? farmerNav : buyerNav;
  const profile = role === 'farmer'
    ? { name: 'Ramesh Kumar', sub: 'Nashik FPO', avatar: 'RK' }
    : { name: 'Ananya Singh', sub: 'FreshLink Wholesale', avatar: 'AS' };

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-[#1B4332] flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#D4A843] flex items-center justify-center">
            <span className="text-[#1B4332] font-black text-xs">D</span>
          </div>
          <span className="font-bold tracking-[0.18em] text-white text-lg">DEMETER</span>
        </div>
        <div className="mt-1 text-xs text-white/40 tracking-widest uppercase ml-9">
          {role === 'farmer' ? 'Farmer Portal' : 'Buyer Portal'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ label, to, icon: Icon }) => {
          const isActive = location.pathname === to || (to !== '/farmer' && to !== '/buyer' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/65 hover:bg-white/8 hover:text-white/90'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {label}
              {isActive && <ChevronRight size={12} className="ml-auto opacity-60" />}
            </Link>
          );
        })}
        {/* Demand forecasting always visible */}
        {role === 'farmer' && (
          <Link
            to="/forecasting"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/forecasting'
                ? 'bg-white/15 text-white'
                : 'text-white/65 hover:bg-white/8 hover:text-white/90'
            }`}
          >
            <TrendingUp size={16} strokeWidth={2} />
            Demand Forecast
          </Link>
        )}
      </nav>

      {/* Profile */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/8 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#D4A843] flex items-center justify-center flex-shrink-0">
            <span className="text-[#1B4332] font-bold text-xs">{profile.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{profile.name}</p>
            <p className="text-white/50 text-xs truncate">{profile.sub}</p>
          </div>
          <LogOut size={14} className="text-white/40 flex-shrink-0" />
        </div>
        <Link to="/" className="mt-1 flex items-center gap-2 px-3 py-1.5 text-xs text-white/40 hover:text-white/70 transition-colors rounded-lg">
          ← Switch Role
        </Link>
      </div>
    </aside>
  );
}
