import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_USERS } from '../data/mockData';
import { SHOP_INFO } from '../data/mockData';
import {
  Smartphone,
  AlertTriangle,
  UserCheck,
  Bell,
  X,
  Menu,
  Sparkles,
  MapPin,
  PhoneCall,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  toggleMobileMenu: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleMobileMenu, openAuthModal }) => {
  const { currentUser, lowStockProducts, notifications, dismissNotification, setActiveTab } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Ticker for Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3 animate-pulse" />
              Low Stock Alert ({lowStockProducts.length})
            </span>
            <span className="text-slate-300 truncate">
              {lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(' • ')}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="text-amber-400 hover:text-amber-200 underline text-xs font-medium ml-2 shrink-0 cursor-pointer"
          >
            Manage Stock
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Shop Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  GALAXY MOBILE
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                  Faisalabad
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-xs">
                {SHOP_INFO.urduName} • POS & Inventory
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contact Info Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-400 bg-slate-800/60 border border-slate-700/60 px-3.5 py-1.5 rounded-full">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chak 117 JB Dhanola</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>0300-8929016</span>
          </div>
        </div>

        {/* Right Controls: Notifications & Active User Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="System Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-cyan-500 rounded-full ring-2 ring-slate-900 animate-ping" />
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Activity Log & Alerts
                  </span>
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 text-xs">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-slate-500 text-center">No new notifications</p>
                  ) : (
                    notifications.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 hover:bg-slate-800/40 flex items-start justify-between gap-2 text-slate-300"
                      >
                        <span className="leading-relaxed">{note}</span>
                        <button
                          onClick={() => dismissNotification(idx)}
                          className="text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Pill */}
          <button
            onClick={openAuthModal}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer group"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-500/50"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-100 leading-tight group-hover:text-cyan-300">
                {currentUser.name.split(' ')[0]}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-cyan-400 capitalize">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{currentUser.role}</span>
              </div>
            </div>
            <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 ml-1" />
          </button>
        </div>
      </div>
    </header>
  );
};
