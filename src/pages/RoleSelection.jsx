import { Link } from 'react-router-dom';
import { ArrowRight, Tractor, Building2, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';

export default function RoleSelection() {
  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans selection:bg-[#1B4332] selection:text-white">
      {/* Top Simple Header */}
      <header className="px-6 py-6 border-b border-[#E5E7E0] bg-[#FAFAF7]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-[#1B4332] flex items-center justify-center text-[#D4A843] font-bold text-sm">
              D
            </div>
            <span className="font-bold tracking-widest text-[#1C1C1E] text-lg uppercase">DEMETER</span>
          </Link>
          <Link
            to="/"
            className="text-xs font-semibold text-[#6B7280] hover:text-[#1B4332] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Choice Section */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          {/* Title Area */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1B4332]/10 text-[#1B4332] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={12} className="text-[#D4A843]" />
              <span>Unified Agriculture Supply Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1C1E] mb-3">
              Choose your platform role
            </h1>
            <p className="text-sm sm:text-base text-[#6B7280] max-w-lg mx-auto">
              Select how you wish to access DEMETER to manage agricultural produce, coordinate procurement, or review quality.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Farmer Card */}
            <div className="bg-white border-2 border-[#E5E7E0] hover:border-[#1B4332] rounded-2xl p-7 transition-all hover:shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#1B4332]/10 text-[#1B4332] flex items-center justify-center mb-5 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                  <Tractor size={28} strokeWidth={2} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7CA982]">Supply Side</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Farmer / FPO</h2>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                  List harvest produce, manage quality reports, respond to bulk purchase offers, negotiate pricing, and access harvest & crop loss support.
                </p>

                <div className="space-y-2 mb-8 text-xs text-[#374151]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                    <span>List produce lots & harvest batches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                    <span>AI-assisted quality screening & grading</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1B4332]" />
                    <span>Harvest & crop damage assistance</span>
                  </div>
                </div>
              </div>

              <Link
                to="/farmer"
                onClick={() => localStorage.setItem('demeter_role', 'farmer')}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold py-3.5 px-5 rounded-xl transition-all shadow-sm group-hover:shadow"
              >
                <span>Continue as Farmer</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Buyer Card */}
            <div className="bg-white border-2 border-[#E5E7E0] hover:border-[#1B4332] rounded-2xl p-7 transition-all hover:shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-xl bg-[#D4A843]/15 text-[#8C6B1F] flex items-center justify-center mb-5 group-hover:bg-[#1B4332] group-hover:text-white transition-colors">
                  <Building2 size={28} strokeWidth={2} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4A843]">Demand Side</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Bulk Buyer</h2>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                  Post high-volume institutional requirements, review multi-farmer aggregation matches, negotiate terms, and track verified procurement.
                </p>

                <div className="space-y-2 mb-8 text-xs text-[#374151]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                    <span>Create bulk procurement requirements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                    <span>Multi-farmer aggregated lot matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                    <span>Verified grading & quality assessment</span>
                  </div>
                </div>
              </div>

              <Link
                to="/buyer"
                onClick={() => localStorage.setItem('demeter_role', 'buyer')}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold py-3.5 px-5 rounded-xl transition-all shadow-sm group-hover:shadow"
              >
                <span>Continue as Bulk Buyer</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="mt-8 text-center text-xs text-[#9CA3AF]">
            Prototype Mode · No credentials required · Select a role to navigate directly to that portal view
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#9CA3AF] border-t border-[#E5E7E0]">
        DEMETER · SIH26193 · Agriculture Produce Management & Supply Chain Platform
      </footer>
    </div>
  );
}
