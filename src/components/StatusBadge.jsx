export default function StatusBadge({ status }) {
  const map = {
    'Active':               'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Pending':              'bg-amber-50 text-amber-700 border border-amber-200',
    'Pending Negotiation':  'bg-orange-50 text-orange-700 border border-orange-200',
    'Accepted':             'bg-blue-50 text-blue-700 border border-blue-200',
    'Rejected':             'bg-red-50 text-red-700 border border-red-200',
    'In Progress':          'bg-violet-50 text-violet-700 border border-violet-200',
    'Completed':            'bg-slate-50 text-slate-600 border border-slate-200',
    'Matching':             'bg-teal-50 text-teal-700 border border-teal-200',
    'Confirmed':            'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'In Transit':           'bg-blue-50 text-blue-700 border border-blue-200',
    'Scheduled':            'bg-purple-50 text-purple-700 border border-purple-200',
    'Grade A':              'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Grade B':              'bg-amber-50 text-amber-700 border border-amber-200',
    'Grade C':              'bg-orange-50 text-orange-700 border border-orange-200',
    'Submitted':            'bg-blue-50 text-blue-700 border border-blue-200',
    'Under Review':         'bg-amber-50 text-amber-700 border border-amber-200',
    'Forwarded to Department': 'bg-purple-50 text-purple-700 border border-purple-200',
    'Resolved':             'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };
  const cls = map[status] || 'bg-gray-50 text-gray-600 border border-gray-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}
