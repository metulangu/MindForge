import { Link, Outlet } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Brain size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">MindForge</span>
          </Link>
          <nav className="flex items-center gap-4">
            {/* Navigation links removed as per user request */}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
