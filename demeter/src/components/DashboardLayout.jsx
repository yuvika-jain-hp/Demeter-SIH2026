import Sidebar from './Sidebar';

export default function DashboardLayout({ children, role = 'farmer' }) {
  return (
    <div className="flex min-h-screen bg-[#FAFAF7]">
      <Sidebar role={role} />
      <main className="flex-1 ml-60 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
