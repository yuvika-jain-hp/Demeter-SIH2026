export default function StatCard({ label, value, subtext, icon: Icon, color = 'forest', trend }) {
  const colorMap = {
    forest:  { bg: 'bg-[#1B4332]/8',  icon: 'text-[#1B4332]',  border: 'border-[#1B4332]/15' },
    wheat:   { bg: 'bg-[#D4A843]/10', icon: 'text-[#D4A843]',  border: 'border-[#D4A843]/20' },
    sage:    { bg: 'bg-[#7CA982]/10', icon: 'text-[#7CA982]',  border: 'border-[#7CA982]/20' },
    blue:    { bg: 'bg-blue-50',      icon: 'text-blue-600',   border: 'border-blue-100' },
    warning: { bg: 'bg-orange-50',    icon: 'text-orange-600', border: 'border-orange-100' },
  };
  const c = colorMap[color] || colorMap.forest;

  return (
    <div className="bg-white rounded-xl border border-[#E5E7E0] shadow-sm p-5 flex items-start gap-4">
      {Icon && (
        <div className={`flex-shrink-0 w-11 h-11 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[#6B7280] font-medium">{label}</p>
        <p className="text-2xl font-bold text-[#1C1C1E] mt-0.5 leading-tight">{value}</p>
        {subtext && <p className="text-xs text-[#6B7280] mt-1">{subtext}</p>}
        {trend && (
          <p className={`text-xs font-medium mt-1 ${trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend} vs last month
          </p>
        )}
      </div>
    </div>
  );
}
