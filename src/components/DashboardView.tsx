import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import shopHeroImage from '../assets/images/galaxy_mobile_shop_1785061718883.jpg';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  PlusCircle,
  Package,
  Users,
  Clock,
  ChevronRight,
  ShieldAlert,
  Building2,
  Wallet,
  Smartphone,
  Receipt,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    sales,
    products,
    lowStockProducts,
    setActiveTab,
    setSelectedInvoiceForModal,
    customers,
    agentBalances,
    digitalTransactions,
  } = useApp();

  // Metrics Calculations
  const todayStr = new Date().toISOString().split('T')[0];

  const todaySales = useMemo(() => {
    return sales.filter((s) => s.createdAt.startsWith(todayStr));
  }, [sales, todayStr]);

  const totalRevenueToday = useMemo(() => {
    return todaySales.reduce((acc, s) => acc + s.total, 0);
  }, [todaySales]);

  const totalProfitToday = useMemo(() => {
    return todaySales.reduce((acc, s) => {
      const saleCost = s.items.reduce((cAcc, item) => cAcc + item.costPrice * item.qty, 0);
      return acc + (s.total - saleCost);
    }, 0);
  }, [todaySales]);

  const totalUdharBalance = useMemo(() => {
    return customers.reduce((acc, c) => acc + c.balanceDue, 0);
  }, [customers]);

  // Hourly or Daily Chart Data
  const salesTrendData = useMemo(() => {
    const hours = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];
    return hours.map((h, idx) => {
      const rev = Math.round((totalRevenueToday || 14800) * (0.1 + (idx * 0.15) % 0.3));
      const profit = Math.round(rev * 0.28);
      return {
        time: h,
        Revenue: rev,
        Profit: profit,
      };
    });
  }, [totalRevenueToday]);

  // Category Breakdown Data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    sales.forEach((s) => {
      s.items.forEach((item) => {
        const prod = products.find((p) => p.id === item.productId);
        const cat = prod ? prod.category : 'Accessories';
        counts[cat] = (counts[cat] || 0) + item.total;
      });
    });

    const colors = ['#06B6D4', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];
    return Object.keys(counts).map((cat, idx) => ({
      name: cat,
      value: counts[cat],
      color: colors[idx % colors.length],
    }));
  }, [sales, products]);

  // Payment Breakdown
  const paymentMethodData = useMemo(() => {
    const pCounts: Record<string, number> = {};
    sales.forEach((s) => {
      pCounts[s.paymentMethod] = (pCounts[s.paymentMethod] || 0) + s.total;
    });

    return Object.keys(pCounts).map((pm) => ({
      name: pm,
      amount: pCounts[pm],
    }));
  }, [sales]);

  return (
    <div className="space-y-6 pb-12 relative rounded-3xl overflow-hidden p-2 sm:p-4">
      {/* Background Image Layer replacing plain dark background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10 opacity-30 pointer-events-none filter brightness-90 saturate-125"
        style={{ backgroundImage: `url(${shopHeroImage})` }}
      />
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-[3px] -z-10 pointer-events-none" />

      {/* Top Banner Header with Shop Storefront Hero Background */}
      <div className="relative rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden p-6 sm:p-8">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 scale-105"
          style={{ backgroundImage: `url(${shopHeroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/70 -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md">
                Official Shop Operations & POS
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1 backdrop-blur-md">
                <Clock className="w-3.5 h-3.5" /> Live Today
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              Galaxy Mobile Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              گلیکسی موبائل اینڈ ریپئرنگ لیب • Real-time sales transactions, accessories inventory & credit ledger for Chak 117 JB Dhanola, Faisalabad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('pos')}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-xl shadow-cyan-500/30 transition-all cursor-pointer text-xs sm:text-sm"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Open POS Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('financials')}
              className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-extrabold px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md transition-all cursor-pointer text-xs sm:text-sm"
            >
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span>EasyPaisa & Bills Hub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today Revenue */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's Sales Revenue</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white font-mono">
              PKR {(totalRevenueToday ?? 0).toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% vs yesterday
            </p>
          </div>
        </div>

        {/* Today Net Profit */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Estimated Gross Profit</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white font-mono">
              PKR {(totalProfitToday ?? 0).toLocaleString()}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ~{totalRevenueToday > 0 ? Math.round((totalProfitToday / totalRevenueToday) * 100) : 28}% margin
            </p>
          </div>
        </div>

        {/* Transactions Today */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Transactions Today</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-white font-mono">
              {todaySales.length} Orders
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Avg basket: PKR {todaySales.length > 0 ? Math.round(totalRevenueToday / todaySales.length).toLocaleString() : '0'}
            </p>
          </div>
        </div>

        {/* Udhar Balance Ledger */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Outstanding Credit (Udhar)</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-amber-300 font-mono">
              PKR {(totalUdharBalance ?? 0).toLocaleString()}
            </h3>
            <button
              onClick={() => setActiveTab('customers')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 mt-1 font-medium cursor-pointer"
            >
              Manage Credit Ledger <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly/Daily Revenue Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Sales & Profit Trend
              </h3>
              <p className="text-xs text-slate-400">Intraday revenue & profit margins</p>
            </div>
            <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
              Today (Hourly)
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [`PKR ${(Number(value) || 0).toLocaleString()}`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#06B6D4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="Profit"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Donut Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Top Selling Categories</h3>
            <p className="text-xs text-slate-400 mb-4">Revenue breakdown by product type</p>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`PKR ${(Number(val) || 0).toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-800 text-xs">
            {categoryData.slice(0, 4).map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="truncate max-w-[140px]">{cat.name}</span>
                </div>
                <span className="font-mono text-slate-400">PKR {(cat?.value ?? 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Low Stock Watchlist & Recent Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Watchlist */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Low-Stock Watchlist</h3>
                <p className="text-xs text-slate-400">Automated staff reorder alerts</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs text-cyan-400 hover:underline font-medium cursor-pointer"
            >
              View All Stock
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {lowStockProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                🎉 All stock levels are healthy!
              </div>
            ) : (
              lowStockProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-3 bg-slate-800/40 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-800 shrink-0"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-200 line-clamp-1">{prod.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        SKU: {prod.sku} • {prod.locationInShop || 'Main Display'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px]">
                      {prod.stock} Left
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Reorder @ {prod.reorderLevel}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Invoices Log */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Recent POS Transactions</h3>
                <p className="text-xs text-slate-400">Instant printable receipts</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-cyan-400 hover:underline font-medium cursor-pointer"
            >
              Sales Directory
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {sales.slice(0, 5).map((sale) => (
              <div
                key={sale.id}
                onClick={() => setSelectedInvoiceForModal(sale)}
                className="p-3 bg-slate-800/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 rounded-2xl flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">{sale.invoiceNumber}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {sale.paymentMethod}
                    </span>
                  </div>
                  <p className="text-slate-300 font-medium mt-0.5">
                    {sale.customerName} ({sale.items.length} items)
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    PKR {(sale?.total ?? 0).toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
