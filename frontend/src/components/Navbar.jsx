import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, BarChart3 } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path 
    ? 'bg-sky-700 text-white' 
    : 'text-slate-300 hover:bg-sky-800 hover:text-white';

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-sky-600 p-2 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide">MarketAnalytics</span>
          </div>

          <div className="flex space-x-3">
            <Link to="/vagas" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition ${isActive('/vagas')}`}>
              <Briefcase className="h-4 w-4" />
              <span>Vagas</span>
            </Link>
            <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition ${isActive('/dashboard')}`}>
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}