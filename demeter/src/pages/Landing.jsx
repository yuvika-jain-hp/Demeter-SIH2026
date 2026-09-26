import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, ShieldCheck, TrendingUp, Truck,
  Leaf, Package, CheckCircle
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans selection:bg-[#1B4332] selection:text-white">
      {/* ── Navbar ────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#E5E7E0]">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <Leaf size={22} className="text-[#1B4332]" strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-widest text-[#1C1C1E] text-lg uppercase">DEMETER</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B7280]">
            <a href="#how-it-works" className="hover:text-[#1B4332] transition-colors">How It Works</a>
            <a href="#benefits" className="hover:text-[#1B4332] transition-colors">Platform Benefits</a>
            <Link to="/farmer" className="hover:text-[#1B4332] transition-colors">For Farmers</Link>
            <Link to="/buyer" className="hover:text-[#1B4332] transition-colors">For Buyers</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/farmer" className="hidden sm:inline-block text-sm font-semibold text-[#1C1C1E] hover:text-[#1B4332]">
              Sign In
            </Link>
            <Link to="/farmer" className="inline-flex items-center gap-2 bg-[#1B4332] text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-[#2D6A4F] transition-colors">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="pt-[72px] min-h-[90vh] flex flex-col lg:flex-row items-stretch border-b border-[#E5E7E0]">
        {/* Left: Content */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16 xl:p-24 bg-[#FAFAF7] relative z-10">
          <div className="max-w-xl w-full">
            <h1 className="text-5xl lg:text-[4rem] font-bold text-[#1B4332] leading-[1.1] tracking-tight mb-6">
              Connecting Farmers to Bulk Demand.
            </h1>
            <p className="text-lg lg:text-xl text-[#6B7280] leading-relaxed mb-10 max-w-md">
              An AI-driven farmer-to-bulk-buyer supply chain platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/farmer"
                className="inline-flex items-center justify-center gap-2 bg-[#1B4332] text-white font-semibold px-8 py-4 rounded hover:bg-[#2D6A4F] transition-colors text-base"
              >
                Explore DEMETER
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Credibility / Quick Stats */}
            <div className="mt-16 pt-8 border-t border-[#E5E7E0] grid grid-cols-2 gap-8">
              <div>
                <p className="text-3xl font-bold text-[#1C1C1E]">2,400+</p>
                <p className="text-sm font-medium text-[#6B7280] mt-1">Farmers Onboarded</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#1C1C1E]">₹4.2Cr</p>
                <p className="text-sm font-medium text-[#6B7280] mt-1">Bulk Trade Volume</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Immersive Photography Slot */}
        <div className="flex-1 min-h-[50vh] lg:min-h-full relative bg-[#1B4332]/10 overflow-hidden">
          {/* 
            Local Image Slot: Hero Field
            Required file: /public/assets/hero-field.jpg
          */}
          <img 
            src="/assets/hero-field.jpg" 
            alt="Vast, lush crop field at sunrise" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── What DEMETER Does (Value Pillars) ────────────────────── */}
      <section id="benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#1B4332] mb-4">A unified bulk procurement platform</h2>
            <p className="text-lg text-[#6B7280] leading-relaxed">
              DEMETER reduces reliance on intermediary layers by bridging the gap between local farmer supply and institutional bulk demand.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-x-8 gap-y-12">
            {[
              { icon: Users, t: 'Direct Connections', d: 'Link bulk buyers directly to verified farmer cooperatives.' },
              { icon: ShieldCheck, t: 'Quality Transparency', d: 'Standardized grading with independent physical inspections.' },
              { icon: Truck, t: 'Aggregated Logistics', d: 'Pooled harvests and optimized regional collection routes.' },
              { icon: TrendingUp, t: 'Demand Visibility', d: 'Predictive forecasting for better planting and procurement.' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#FAFAF7] border border-[#E5E7E0] flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[#1B4332]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1C1C1E] mb-2">{t}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-[#FAFAF7] border-y border-[#E5E7E0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-[#1B4332] mb-6">How the platform works</h2>
              <div className="space-y-10">
                {[
                  { step: '01', title: 'List Bulk Supply & Demand', desc: 'Farmers list their available harvest. Buyers post their bulk procurement requirements.' },
                  { step: '02', title: 'Intelligent Matching', desc: 'The platform matches regional supply to bulk demand, pooling produce from multiple farms if necessary.' },
                  { step: '03', title: 'Quality & Agreement', desc: 'Grades are verified, prices are negotiated transparently, and orders are confirmed.' },
                  { step: '04', title: 'Optimized Delivery', desc: 'Produce is collected via aggregated routes and delivered directly to the buyer\'s destination.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="text-xl font-bold text-[#7CA982] mt-0.5">{item.step}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1C1C1E] mb-1">{item.title}</h3>
                      <p className="text-[#6B7280] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[600px] rounded-lg overflow-hidden border border-[#E5E7E0] shadow-sm bg-[#1B4332]/5">
              {/* 
                Local Image Slot: Farmer Harvest
                Required file: /public/assets/farmer-harvest.jpg
              */}
              <img 
                src="/assets/farmer-harvest.jpg" 
                alt="Farmer examining freshly harvested produce" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Technology / Intelligence Section ─────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center flex-row-reverse">
            <div className="order-2 lg:order-1 relative h-[500px] rounded-lg overflow-hidden border border-[#E5E7E0] shadow-sm bg-[#1B4332]/5">
              {/* 
                Local Image Slot: Seedling Soil
                Required file: /public/assets/seedling-soil.jpg
              */}
              <img 
                src="/assets/seedling-soil.jpg" 
                alt="Close up of a seedling in rich soil" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-[#1B4332] mb-6">Modern efficiency, grounded in reality.</h2>
              <p className="text-lg text-[#6B7280] leading-relaxed mb-8">
                DEMETER utilizes modern technology to handle the complexities of agricultural supply chains behind the scenes, leaving you with a simple, practical tool for doing business.
              </p>
              
              <ul className="space-y-4">
                {[
                  'Automated supply-demand matching across regions.',
                  'Data-backed pricing guidance for fair negotiation.',
                  'Quality assessment screening for consistent standards.',
                  'Logistics aggregation to minimize transportation costs.',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#1C1C1E] font-medium">
                    <CheckCircle size={20} className="text-[#7CA982] flex-shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-[#1B4332] text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to streamline your agricultural supply chain?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Join the platform connecting the region's top farmers with institutional bulk buyers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/farmer" className="inline-flex items-center justify-center gap-2 bg-[#FAFAF7] text-[#1B4332] font-semibold px-8 py-4 rounded hover:bg-white transition-colors">
              <Leaf size={18} />
              Join as Farmer / FPO
            </Link>
            <Link to="/buyer" className="inline-flex items-center justify-center gap-2 bg-[#1B4332] border border-[#7CA982] text-white font-semibold px-8 py-4 rounded hover:bg-[#2D6A4F] transition-colors">
              <Package size={18} />
              Join as Bulk Buyer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E5E7E0] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <Leaf size={16} className="text-[#1B4332]" strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-widest text-[#1C1C1E] text-sm uppercase">DEMETER</span>
          </div>
          <p className="text-[#6B7280] text-sm text-center md:text-left">
            © 2026 DEMETER. Farmer-to-Buyer Supply Chain Platform.
          </p>
          <div className="flex gap-6 text-sm font-medium text-[#6B7280]">
            <a href="#" className="hover:text-[#1B4332]">Privacy Policy</a>
            <a href="#" className="hover:text-[#1B4332]">Terms of Service</a>
            <a href="#" className="hover:text-[#1B4332]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
