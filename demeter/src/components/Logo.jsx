import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { text: 'text-lg', icon: 16 },
    md: { text: 'text-xl', icon: 20 },
    lg: { text: 'text-3xl', icon: 28 },
  };
  const s = sizes[size];

  return (
    <Link to="/" className="flex items-center gap-2 group select-none">
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B4332] group-hover:bg-[#2D6A4F] transition-colors">
        <Leaf size={s.icon - 4} className="text-[#D4A843]" strokeWidth={2.5} />
      </div>
      <span className={`font-bold tracking-widest ${s.text} text-[#1B4332] group-hover:text-[#2D6A4F] transition-colors`}
        style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.18em' }}>
        DEMETER
      </span>
    </Link>
  );
}
