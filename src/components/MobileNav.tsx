import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  Images,
  MapPin,
  Wallet,
  X,
} from 'lucide-react';
import { navItems } from './Sidebar';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, cartItems, lowStockProducts, digitalTransactions } = useApp();

  const mainTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'pos', label: 'POS', icon: ShoppingCart, badge: cartItems.length },
    { id: 'financials', label: 'EasyPaisa', icon: Wallet, badge: digitalTransactions.length },
    { id: 'inventory', label: 'Stock', icon: Package, badge: lowStockProducts.length },
    { id: 'invoices', label: 'Sales', icon: Receipt },
  ];

  return (
    <>
      {/* Mobile Drawer Slide-over */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-4/5 max-w-sm bg-slate-900 border-r border-slate-800 text-slate-100 h-full p-5 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    GM
                  </div>
                  <span className="font-bold text-sm tracking-tight text-white">
                    GALAXY MOBILE
                  </span>
                </div>
                <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Galaxy Mobile Shop</p>
              <p className="text-[11px] text-slate-500">Chak 117 JB Dhanola, Faisalabad</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Fixed Navigation Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-slate-400 px-2 py-2 flex items-center justify-around shadow-2xl">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-cyan-400 scale-110' : ''}`} />
              <span className="text-[10px]">{tab.label}</span>
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 right-1 bg-cyan-500 text-slate-950 font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>
    </>
  );
};
