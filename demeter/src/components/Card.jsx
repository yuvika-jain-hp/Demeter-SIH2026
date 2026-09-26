export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E5E7E0] shadow-sm ${
        hover ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
      } ${className}`}
      style={{ transition: 'box-shadow 0.2s ease, transform 0.2s ease' }}
    >
      {children}
    </div>
  );
}
