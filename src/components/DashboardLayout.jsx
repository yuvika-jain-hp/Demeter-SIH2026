import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const path = location.pathname;
  
  let activeRole = localStorage.getItem('demeter_role') || 'farmer';
  
  if (path === '/buyer' || path.startsWith('/buyer/')) {
    activeRole = 'buyer';
    localStorage.setItem('demeter_role', 'buyer');
  } else if (path === '/farmer' || path.startsWith('/farmer/')) {
    activeRole = 'farmer';
    localStorage.setItem('demeter_role', 'farmer');
  } else if (location.state?.role) {
    activeRole = location.state.role;
    localStorage.setItem('demeter_role', activeRole);
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAF7]">
      <Sidebar role={activeRole} />
      <main className="flex-1 ml-60 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
