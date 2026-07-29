import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  MessageSquare,
  Images,
  MapPin,
  Mail,
  Shield,
  ChevronRight,
  TrendingUp,
  Wallet,
  Wrench,
  CreditCard,
} from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badgeKey: null, roles: ['admin', 'manager', 'cashier'] },
  { id: 'pos', label: 'POS Terminal', icon: ShoppingCart, badgeKey: 'cart', roles: ['admin', 'manager', 'cashier'] },
  { id: 'financials', label: 'EasyPaisa & Bills', icon: Wallet, badgeKey: 'digitalTrxs', roles: ['admin', 'manager', 'cashier'] },
  { id: 'repairs', label: 'Repairing Lab', icon: Wrench, badgeKey: 'repairs', roles: ['admin', 'manager', 'cashier'] },
  { id: 'loans', label: 'Loans & EMI', icon: CreditCard, badgeKey: null, roles: ['admin', 'manager', 'cashier'] },
  { id: 'inventory', label: 'Stock & Items', icon: Package, badgeKey: 'lowStock', roles: ['admin', 'manager', 'cashier'] },
  { id: 'invoices', label: 'Sales & Invoices', icon: Receipt, badgeKey: null, roles: ['admin', 'manager', 'cashier'] },
  { id: 'customers', label: 'Customer Records', icon: Users, badgeKey: null, roles: ['admin', 'manager', 'cashier'] },
  { id: 'inquiries', label: 'Online Inquiries', icon: MessageSquare, badgeKey: 'inquiries', roles: ['admin', 'manager', 'cashier'] },
  { id: 'gallery', label: 'Shop Photos', icon: Images, badgeKey: null, roles: ['admin', 'manager', 'cashier'] },
  { id: 'map', label: 'Facility Location', icon: MapPin, badgeKey: null, roles: ['admin', 'manager', 'cashier'] },
  { id: 'contact', label: 'Contact Support', icon: Mail, badgeKey: null, roles: ['admin', 'manager', 'cashier'] },
];

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    lowStockProducts,
    cartItems,
    inquiries,
    digitalTransactions,
    repairTickets,
    currentUser,
  } = useApp();

  const getBadge = (key: string | null) => {
    if (key === 'repairs') {
      const active = repairTickets.filter((t) => t.status !== 'Delivered' && t.status !== 'Cancelled').length;
      if (active > 0) {
        return (
          <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {active}
          </span>
        );
      }
    }
    if (key === 'digitalTrxs' && digitalTransactions.length > 0) {
      return (
        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {digitalTransactions.length}
        </span>
      );
    }
    if (key === 'lowStock' && lowStockProducts.length > 0) {
      return (
        <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {lowStockProducts.length}
        </span>
      );
    }
    if (key === 'cart' && cartItems.length > 0) {
      return (
        <span className="bg-cyan-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
          {cartItems.reduce((acc, i) => acc + i.qty, 0)}
        </span>
      );
    }
    if (key === 'inquiries') {
      const pending = inquiries.filter((i) => i.status === 'Pending').length;
      if (pending > 0) {
        return (
          <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {pending}
          </span>
        );
      }
    }
    return null;
  };

  return (
    <aside className="w-64 bg-slate-900/80 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const badge = getBadge(item.badgeKey);

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600/20 to-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {badge ? (
                    badge
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? 'text-cyan-400 opacity-100' : 'text-slate-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Sales Stats Badge */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/60 text-slate-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-200">Daily Quick Goal</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
            Track daily accessories & charger sales targets in real-time.
          </p>
          <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[72%]" />
          </div>
        </div>
      </div>

      {/* Role Footer */}
      <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="truncate max-w-[120px] font-medium text-slate-300">
            {currentUser.name}
          </span>
        </div>
        <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase">
          {currentUser.role}
        </span>
      </div>
    </aside>
  );
};
