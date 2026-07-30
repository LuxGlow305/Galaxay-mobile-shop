import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import shopHeroImage from '../assets/images/galaxy_mobile_shop_1785061718883.jpg';
import { SHOP_INFO } from '../data/mockData';
import { PaymentMethod, RepairStatus } from '../types';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  PlusCircle,
  Package,
  Users,
  Clock,
  ChevronRight,
  Wallet,
  Smartphone,
  Receipt,
  Zap,
  Printer,
  Wrench,
  CheckCircle2,
  CreditCard,
  Plus,
  Search,
  Share2,
  FileText,
  Trash2,
  Phone,
  User,
  ShieldCheck,
  Send,
  MessageSquare,
  Images,
  MapPin,
  ListFilter,
  Check,
  ExternalLink,
  Layers,
  Info,
  Calculator,
  ArrowRightLeft,
} from 'lucide-react';
import { FinancialCalculatorModal } from './FinancialCalculatorModal';
import { CashRegisterModal } from './CashRegisterModal';
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
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    sales,
    products,
    lowStockProducts,
    setActiveTab,
    setSelectedInvoiceForModal,
    setSelectedDigitalTrxForModal,
    setSelectedRepairTicketForModal,
    setSelectedLoanForModal,
    customers,
    agentBalances,
    digitalTransactions,
    repairTickets,
    customerLoans,
    inquiries,
    addSale,
    addDigitalTransaction,
    addRepairTicket,
    currentUser,
  } = useApp();

  // Active Front Section Mode: 'all' (default, everything on front), 'pos', 'payments', 'repairs', 'loans', 'stock', 'sales', 'udhar', 'metrics'
  const [frontTab, setFrontTab] = useState<'all' | 'pos' | 'payments' | 'repairs' | 'loans' | 'stock' | 'sales' | 'udhar' | 'metrics'>('all');

  // --- POS Quick Front State ---
  const [posSearch, setPosSearch] = useState('');
  const [posCart, setPosCart] = useState<{ product: (typeof products)[0]; qty: number }[]>([]);
  const [posCustomerName, setPosCustomerName] = useState('Walk-in Customer');
  const [posCustomerPhone, setPosCustomerPhone] = useState('0300-1234567');
  const [posPaymentMethod, setPosPaymentMethod] = useState<PaymentMethod>('Cash');

  // --- Payments / Digital Financials Quick Front State ---
  const [payService, setPayService] = useState<'EasyPaisa' | 'JazzCash' | 'EasyLoad' | 'Utility Bill'>('EasyPaisa');
  const [paySenderName, setPaySenderName] = useState('');
  const [paySenderPhone, setPaySenderPhone] = useState('');
  const [payReceiverPhone, setPayReceiverPhone] = useState('');
  const [payAmount, setPayAmount] = useState<number>(1000);
  const [payBillCompany, setPayBillCompany] = useState('FESCO Electricity');
  const [payConsumerNo, setPayConsumerNo] = useState('');

  // --- Repair Lab Quick Front State ---
  const [repairCustomerName, setRepairCustomerName] = useState('');
  const [repairCustomerPhone, setRepairCustomerPhone] = useState('');
  const [repairDeviceModel, setRepairDeviceModel] = useState('');
  const [repairProblem, setRepairProblem] = useState('');
  const [repairCost, setRepairCost] = useState<number>(1500);
  const [repairAdvance, setRepairAdvance] = useState<number>(500);

  // Modals for Calculator & Cash Register
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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

  // Hourly Sales Trend Data
  const salesTrendData = useMemo(() => {
    const hours = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];
    return hours.map((h, idx) => {
      const rev = Math.round((totalRevenueToday || 14800) * (0.1 + ((idx * 0.15) % 0.3)));
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

  // Filtered products for Front POS
  const posFilteredProducts = useMemo(() => {
    if (!posSearch) return products.slice(0, 8);
    const q = posSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [products, posSearch]);

  const posCartTotal = useMemo(() => {
    return posCart.reduce((acc, i) => acc + i.product.sellingPrice * i.qty, 0);
  }, [posCart]);

  // Smooth Scroll Helper
  const scrollToSection = (sectionId: string, tabFallback?: string) => {
    setFrontTab('all');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (tabFallback) {
        setActiveTab(tabFallback);
      }
    }, 50);
  };

  // Handle Front POS Add To Cart
  const handlePosAddToCart = (prod: (typeof products)[0]) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.product.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === prod.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product: prod, qty: 1 }];
    });
  };

  // Handle Front POS Checkout & Print Bill
  const handlePosCheckoutAndPrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (posCart.length === 0) return;

    const items = posCart.map((i) => ({
      productId: i.product.id,
      productName: i.product.name,
      sku: i.product.sku,
      unitPrice: i.product.sellingPrice,
      costPrice: i.product.costPrice,
      qty: i.qty,
      total: i.product.sellingPrice * i.qty,
    }));

    const newSale = addSale({
      customerName: posCustomerName || 'Walk-in Customer',
      customerPhone: posCustomerPhone || 'N/A',
      items,
      subtotal: posCartTotal,
      discount: 0,
      tax: 0,
      total: posCartTotal,
      paymentMethod: posPaymentMethod,
      paymentStatus: posPaymentMethod === 'Udhar / Credit' ? 'Pending' : 'Paid',
      cashierId: currentUser.id,
      cashierName: currentUser.name,
    });

    setPosCart([]);
    setSelectedInvoiceForModal(newSale);
  };

  // Handle Front Payment Process & Print Receipt
  const handlePaymentProcessAndPrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount || payAmount <= 0) return;

    const newTrx = addDigitalTransaction({
      serviceType: payService,
      trxType: payService === 'Utility Bill' ? 'Bill Payment' : 'Cash In',
      senderName: paySenderName || 'Counter Customer',
      senderPhone: paySenderPhone || '0300-0000000',
      receiverPhone: payReceiverPhone || paySenderPhone || '0300-0000000',
      amount: Number(payAmount),
      feeCommission: Math.round(Number(payAmount) * 0.015),
      totalCollected: Number(payAmount) + Math.round(Number(payAmount) * 0.015),
      paymentMethod: 'Cash',
      agentName: currentUser.name,
      billDetails:
        payService === 'Utility Bill'
          ? { company: payBillCompany, consumerNumber: payConsumerNo || '4329018471' }
          : undefined,
    });

    setPaySenderName('');
    setPaySenderPhone('');
    setPayReceiverPhone('');
    setSelectedDigitalTrxForModal(newTrx);
  };

  // Handle Front Repair Entry & Print Job Slip
  const handleRepairEntryAndPrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairCustomerName || !repairDeviceModel || !repairProblem) return;

    const newTicket = addRepairTicket({
      customerName: repairCustomerName,
      customerPhone: repairCustomerPhone || '0300-0000000',
      deviceBrand: 'Mobile Device',
      deviceModel: repairDeviceModel,
      imeiOrSerial: '358' + Math.floor(1000000000000 + Math.random() * 9000000000000),
      problemDescription: repairProblem,
      estimatedCost: Number(repairCost),
      advancePaid: Number(repairAdvance),
      assignedTechnician: currentUser.name,
      status: 'Diagnosing',
    });

    setRepairCustomerName('');
    setRepairCustomerPhone('');
    setRepairDeviceModel('');
    setRepairProblem('');
    setSelectedRepairTicketForModal(newTicket);
  };

  // Badges calculations for top menu list
  const activeRepairsCount = repairTickets.filter((t) => t.status !== 'Delivered' && t.status !== 'Cancelled').length;
  const digitalTrxsCount = digitalTransactions.length;
  const lowStockCount = lowStockProducts.length;
  const activeLoansCount = customerLoans.filter((l) => l.status === 'Active').length;
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'Pending').length;

  // Main menu list items corresponding to the screenshot
  const menuListItems = [
    {
      id: 'sec-dashboard',
      tabKey: 'dashboard',
      label: 'Dashboard',
      subtitle: 'Live sales, revenue stats & metrics',
      icon: ShoppingBag,
      badge: null,
      badgeColor: '',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'sec-pos',
      tabKey: 'pos',
      label: 'POS Terminal',
      subtitle: 'Sales checkout counter & printable bills',
      icon: ShoppingCart,
      badge: null,
      badgeColor: '',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'sec-financials',
      tabKey: 'financials',
      label: 'EasyPaisa & Bills',
      subtitle: 'Till balances, money transfers & utility bills',
      icon: Wallet,
      badge: digitalTrxsCount > 0 ? digitalTrxsCount : 5,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'sec-repairs',
      tabKey: 'repairs',
      label: 'Repairing Lab',
      subtitle: 'Mobile intake, tech status & job slips',
      icon: Wrench,
      badge: activeRepairsCount > 0 ? activeRepairsCount : 3,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'sec-loans',
      tabKey: 'loans',
      label: 'Loans & EMI',
      subtitle: 'Smartphone installment schedules & guarantors',
      icon: CreditCard,
      badge: activeLoansCount > 0 ? activeLoansCount : 2,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      id: 'sec-stock',
      tabKey: 'inventory',
      label: 'Stock & Items',
      subtitle: 'Inventory catalog & low stock reorder alerts',
      icon: Package,
      badge: lowStockCount > 0 ? lowStockCount : 5,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'sec-sales',
      tabKey: 'invoices',
      label: 'Sales & Invoices',
      subtitle: 'Customer invoice history & thermal re-print',
      icon: Receipt,
      badge: sales.length,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'sec-udhar',
      tabKey: 'customers',
      label: 'Customer Records (Udhar)',
      subtitle: 'Credit accounts, ledger balance & WhatsApp reminders',
      icon: Users,
      badge: customers.filter((c) => c.balanceDue > 0).length,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      id: 'sec-inquiries',
      tabKey: 'inquiries',
      label: 'Online Inquiries',
      subtitle: 'Customer repair quotes & support questions',
      icon: MessageSquare,
      badge: pendingInquiriesCount > 0 ? pendingInquiriesCount : 2,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      color: 'text-cyan-300',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 'sec-gallery',
      tabKey: 'gallery',
      label: 'Shop Gallery & Location',
      subtitle: 'Store photos, address map & shop contact info',
      icon: Images,
      badge: null,
      badgeColor: '',
      color: 'text-slate-300',
      bgColor: 'bg-slate-800/80 border-slate-700',
    },
  ];

  return (
    <div className="space-y-6 pb-16 relative rounded-3xl overflow-hidden p-2 sm:p-4">
      {/* Background Shop Image Overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10 opacity-30 pointer-events-none filter brightness-90 saturate-125"
        style={{ backgroundImage: `url(${shopHeroImage})` }}
      />
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-[4px] -z-10 pointer-events-none" />

      {/* Top Banner Header with Shop Storefront Hero */}
      <div className="relative rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden p-6 sm:p-8">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10 scale-105"
          style={{ backgroundImage: `url(${shopHeroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/75 -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/30 backdrop-blur-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Galaxy Mobile Hub
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1 backdrop-blur-md">
                <Clock className="w-3.5 h-3.5" /> All Services Open On Website
              </span>
              <span className="text-xs text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 font-semibold flex items-center gap-1 backdrop-blur-md">
                <Printer className="w-3.5 h-3.5" /> Thermal Bill Printing Enabled
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
              Galaxy Mobile & Repairing Lab
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              گلیکسی موبائل اینڈ ریپئرنگ لیب • Galaxy Mobile & EasyPaisa JazzCash services are listed in full below. Scroll down from top or click any menu option to view complete details.
            </p>
          </div>

          {/* Direct Printer Launcher Button */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowCalcModal(true)}
              className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-bold px-3.5 py-2.5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer backdrop-blur-md"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Calculator</span>
            </button>

            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 hover:bg-slate-800 text-amber-300 font-bold px-3.5 py-2.5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer backdrop-blur-md"
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <span>Cash Register (گلہ)</span>
            </button>

            <a
              href={`https://wa.me/${SHOP_INFO.phones[0].replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2.5 rounded-2xl shadow-lg transition-all cursor-pointer text-xs"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => {
                if (sales.length > 0) {
                  setSelectedInvoiceForModal(sales[0]);
                } else {
                  window.print();
                }
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-xl shadow-cyan-500/30 transition-all cursor-pointer text-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📋 MAIN MENU & SERVICE DIRECTORY LIST (PLACED AT THE BEGINNING OF WEBSITE) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/95 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Main Menu & Service Directory
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              Below is the complete list of all Galaxy Mobile and EasyPaisa JazzCash options. Click any item to jump straight to its section or open the module.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs bg-slate-800 text-cyan-300 px-3 py-1.5 rounded-xl border border-slate-700 font-mono font-bold flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-cyan-400" />
              {menuListItems.length} Services Listed
            </span>
          </div>
        </div>

        {/* The Exact Main Menu List - Rendered in Clean High-Visibility Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {menuListItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => scrollToSection(item.id, item.tabKey)}
                className="group relative bg-slate-950/80 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 truncate">
                  {/* Item Icon */}
                  <div className={`p-3 rounded-2xl ${item.bgColor} ${item.color} shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-500 font-bold">0{idx + 1}.</span>
                      <h4 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                        {item.label}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    <p className="text-[10px] text-amber-400/90 font-medium font-serif mt-0.5 truncate">
                      Returned from something (خریدی ہوئی چیز کی واپسی نہیں)
                    </p>
                  </div>
                </div>

                {/* Right Badge or Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.badge !== null && item.badge !== undefined && (
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border shadow-sm ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  <span className="p-1.5 rounded-xl bg-slate-900 text-slate-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Filter View:
          </span>

          <button
            onClick={() => setFrontTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              frontTab === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            Show All Below
          </button>

          <button
            onClick={() => setFrontTab('pos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              frontTab === 'pos'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> POS Terminal
          </button>

          <button
            onClick={() => setFrontTab('payments')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              frontTab === 'payments'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" /> EasyPaisa & Bills
          </button>

          <button
            onClick={() => setFrontTab('repairs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              frontTab === 'repairs'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-indigo-400" /> Repair Lab
          </button>

          <button
            onClick={() => setFrontTab('loans')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              frontTab === 'loans'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Loans & EMI
          </button>

          <button
            onClick={() => setFrontTab('stock')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              frontTab === 'stock'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-amber-400" /> Stock & Items
          </button>

          <button
            onClick={() => setFrontTab('sales')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              frontTab === 'sales'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" /> Sales & Invoices
          </button>

          <button
            onClick={() => setFrontTab('udhar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              frontTab === 'udhar'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-rose-400" /> Udhar Ledger
          </button>
        </div>
      </div>

      {/* METRIC CARDS OVERVIEW ROW */}
      {(frontTab === 'all' || frontTab === 'metrics') && (
        <div id="sec-dashboard" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 scroll-mt-6">
          {/* Today Revenue */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
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

          {/* Estimated Gross Profit */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
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
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Transactions Today</span>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-white font-mono">{todaySales.length} Orders</h3>
              <p className="text-xs text-slate-400 mt-1">
                Avg basket: PKR {todaySales.length > 0 ? Math.round(totalRevenueToday / todaySales.length).toLocaleString() : '0'}
              </p>
            </div>
          </div>

          {/* Udhar Balance Ledger */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
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
                onClick={() => scrollToSection('sec-udhar', 'customers')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 mt-1 font-medium cursor-pointer"
              >
                Manage Credit Ledger <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FRONT MODULE 1: POS TERMINAL COUNTER (VISIBLE ON FRONT) */}
      {(frontTab === 'all' || frontTab === 'pos') && (
        <div id="sec-pos" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">POS Sales Counter</h3>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-extrabold px-2 py-0.5 rounded-full">
                    Instant Printable Bills
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Select item, add to checkout cart & generate printable thermal bill directly from front page
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('pos')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              Expand Full POS Terminal <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Item Quick Selection */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products by name, brand or SKU..."
                  value={posSearch}
                  onChange={(e) => setPosSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                {posFilteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handlePosAddToCart(p)}
                    className="p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500/60 rounded-2xl flex flex-col justify-between text-xs cursor-pointer group transition-all"
                  >
                    <div className="space-y-1">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-20 object-cover rounded-xl bg-slate-800 group-hover:scale-105 transition-transform"
                      />
                      <h4 className="font-semibold text-slate-200 line-clamp-1 text-[11px] mt-1">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">{p.brand}</p>
                      <p className="text-[9px] text-amber-400 font-medium font-serif line-clamp-1">Returned from something (خریدی ہوئی چیز کی واپسی نہیں)</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 mt-2">
                      <span className="font-mono font-bold text-cyan-400 text-xs">
                        PKR {p.sellingPrice.toLocaleString()}
                      </span>
                      <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Front Cart & Printable Bill Checkout */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Receipt className="w-4 h-4 text-cyan-400" />
                    Front Cart ({posCart.reduce((a, b) => a + b.qty, 0)} items)
                  </span>
                  {posCart.length > 0 && (
                    <button
                      onClick={() => setPosCart([])}
                      className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="py-2 max-h-40 overflow-y-auto space-y-2">
                  {posCart.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      Tap products on the left to build order
                    </div>
                  ) : (
                    posCart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-xl border border-slate-800"
                      >
                        <div className="truncate max-w-[150px]">
                          <p className="font-medium text-slate-200 truncate">{item.product.name}</p>
                          <p className="text-[10px] font-mono text-cyan-400">
                            PKR {item.product.sellingPrice.toLocaleString()} x {item.qty}
                          </p>
                          <p className="text-[9px] text-amber-400 font-medium font-serif truncate">Returned from something (خریدی ہوئی چیز کی واپسی نہیں)</p>
                        </div>
                        <span className="font-mono font-bold text-white">
                          PKR {(item.product.sellingPrice * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handlePosCheckoutAndPrint} className="space-y-2.5 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={posCustomerName}
                    onChange={(e) => setPosCustomerName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  />
                  <select
                    value={posPaymentMethod}
                    onChange={(e) => setPosPaymentMethod(e.target.value as PaymentMethod)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="EasyPaisa">EasyPaisa</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Udhar / Credit">Udhar / Credit</option>
                  </select>
                </div>

                <div className="flex items-center justify-between font-mono font-bold text-sm text-white py-1">
                  <span>Grand Total:</span>
                  <span className="text-emerald-400 text-base">PKR {posCartTotal.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={posCart.length === 0}
                  className="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Checkout & Print Thermal Bill</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* FRONT MODULE 2: PAYMENTS & DIGITAL FINANCIALS (VISIBLE ON FRONT) */}
      {(frontTab === 'all' || frontTab === 'payments') && (
        <div id="sec-financials" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">EasyPaisa, JazzCash & Bills</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold px-2 py-0.5 rounded-full">
                    Digital Payment Slips
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Live agent balances & quick digital money transfer / bill payment entry with instant receipt printing
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('financials')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              Full Financial Agent Hub <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Agent Balances Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">EasyPaisa Till</span>
              <p className="text-base font-mono font-black text-white mt-0.5">
                PKR {(agentBalances?.easyPaisaBalance ?? 0).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">Till: 0300-8929016</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-red-400 font-bold uppercase">JazzCash Till</span>
              <p className="text-base font-mono font-black text-white mt-0.5">
                PKR {(agentBalances?.jazzCashBalance ?? 0).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">Till: 0308-7014787</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-amber-400 font-bold uppercase">EasyLoad Float</span>
              <p className="text-base font-mono font-black text-white mt-0.5">
                PKR {(agentBalances?.easyLoadBalance ?? 0).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">Jazz / Telenor / Zong</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-cyan-400 font-bold uppercase">NADRA e-Sahulat</span>
              <p className="text-base font-mono font-black text-white mt-0.5">
                PKR {(agentBalances?.eSahulatBalance ?? 0).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">ID: 43262 Verified</p>
            </div>
          </div>

          {/* Quick Payment Form */}
          <form onSubmit={handlePaymentProcessAndPrint} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {(['EasyPaisa', 'JazzCash', 'EasyLoad', 'Utility Bill'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setPayService(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    payService === s
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Zeeshan Ahmad"
                  value={paySenderName}
                  onChange={(e) => setPaySenderName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Mobile / Account No</label>
                <input
                  type="text"
                  placeholder="0300-1234567"
                  value={paySenderPhone}
                  onChange={(e) => setPaySenderPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                />
              </div>
            </div>

            {payService === 'Utility Bill' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Utility Company</label>
                  <select
                    value={payBillCompany}
                    onChange={(e) => setPayBillCompany(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="FESCO Electricity">FESCO Electricity</option>
                    <option value="SNGPL Gas">SNGPL Gas</option>
                    <option value="WASA Faisalabad Water">WASA Faisalabad Water</option>
                    <option value="PTCL Landline & Broadband">PTCL Broadband</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Consumer Ref / Account No</label>
                  <input
                    type="text"
                    placeholder="14-Digit Reference No"
                    value={payConsumerNo}
                    onChange={(e) => setPayConsumerNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Total Charge with Fee: PKR {(payAmount + Math.round(payAmount * 0.015)).toLocaleString()}
              </span>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Printer className="w-4 h-4" /> Submit & Print Payment Slip
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FRONT MODULE 3: BUSINESS REPAIR LAB (VISIBLE ON FRONT) */}
      {(frontTab === 'all' || frontTab === 'repairs') && (
        <div id="sec-repairs" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Repairing Lab</h3>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-extrabold px-2 py-0.5 rounded-full">
                    Job Ticket Slips
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Mobile device repair intake, technician tracking & printable job repair receipts directly from the front
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('repairs')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              Full Repair Lab Board <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Repair Form */}
            <form onSubmit={handleRepairEntryAndPrint} className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <PlusCircle className="w-4 h-4 text-indigo-400" /> Intake New Device Repair
              </h4>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajid Ali"
                  value={repairCustomerName}
                  onChange={(e) => setRepairCustomerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="0300-0000000"
                    value={repairCustomerPhone}
                    onChange={(e) => setRepairCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Device Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Redmi Note 12"
                    value={repairDeviceModel}
                    onChange={(e) => setRepairDeviceModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Problem / Fault *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken Display Touch, Charging Jack Issue"
                  value={repairProblem}
                  onChange={(e) => setRepairProblem(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Estimated Charges</label>
                  <input
                    type="number"
                    value={repairCost}
                    onChange={(e) => setRepairCost(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Advance Received</label>
                  <input
                    type="number"
                    value={repairAdvance}
                    onChange={(e) => setRepairAdvance(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold text-emerald-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 mt-2"
              >
                <Printer className="w-4 h-4" /> Save Job & Print Repair Slip
              </button>
            </form>

            {/* Active Repair Tickets List */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Wrench className="w-4 h-4 text-cyan-400" /> Active Device Tickets In Lab
              </h4>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {repairTickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{ticket.ticketNumber}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            ticket.status === 'Ready for Pickup'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-200 mt-0.5">
                        {ticket.deviceModel} • {ticket.customerName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">{ticket.problemDescription}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-emerald-400">
                        PKR {(ticket.estimatedCost ?? 0).toLocaleString()}
                      </p>
                      <button
                        onClick={() => setSelectedRepairTicketForModal(ticket)}
                        className="mt-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-slate-700"
                      >
                        <Printer className="w-3 h-3 text-amber-400" /> Print Slip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FRONT MODULE 4: LOANS & SMARTPHONE EMI INSTALLMENTS */}
      {(frontTab === 'all' || frontTab === 'loans') && (
        <div id="sec-loans" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Loans & EMI Installments</h3>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-extrabold px-2 py-0.5 rounded-full">
                    Mobile Installment Plans
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Easy smartphone financing plans, monthly installment schedules, CNIC verification & statement slips
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('loans')}
              className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              Full Installment Manager <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {customerLoans.slice(0, 3).map((loan) => (
              <div
                key={loan.id}
                className="bg-slate-950 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-xs text-purple-400">{loan.loanNumber}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                    {loan.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{loan.customerName}</h4>
                  <p className="text-xs text-slate-300">{loan.itemPurchased}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">CNIC: {loan.customerCnic}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Monthly EMI</span>
                    <span className="font-bold text-cyan-400">PKR {loan.monthlyInstallmentAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tenure</span>
                    <span className="font-bold text-white">{loan.tenureMonths} Months</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLoanForModal(loan)}
                  className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Loan Statement
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FRONT MODULE 5: STOCK & ITEMS INVENTORY CATALOG */}
      {(frontTab === 'all' || frontTab === 'stock') && (
        <div id="sec-stock" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Stock & Items Inventory</h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold px-2 py-0.5 rounded-full">
                    {lowStockProducts.length} Reorder Alerts
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Featured mobile phones & accessories stock with brand specs & low stock notifications
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              Full Inventory Catalog <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Low Stock Warning Bar if exists */}
          {lowStockProducts.length > 0 && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center gap-3 text-xs text-amber-300">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Low Stock Notice:</strong> {lowStockProducts.map((p) => p.name).join(', ')} require inventory reordering.
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {products.slice(0, 6).map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3 flex flex-col justify-between text-xs space-y-2 group"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-24 object-cover rounded-xl bg-slate-800 group-hover:scale-105 transition-transform"
                />
                <div>
                  <span className="text-[10px] text-amber-400 font-semibold">{prod.brand}</span>
                  <h4 className="font-bold text-slate-100 line-clamp-1">{prod.name}</h4>
                  <p className="font-mono font-bold text-cyan-400 text-xs mt-0.5">
                    PKR {prod.sellingPrice.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Stock: {prod.stockQty}</span>
                  <span className="font-mono">{prod.sku}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FRONT MODULE 6: SALES & INVOICES RECEIPT CENTER */}
      {(frontTab === 'all' || frontTab === 'sales') && (
        <div id="sec-sales" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Sales & Invoices</h3>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold px-2 py-0.5 rounded-full">
                    Invoice History & Re-Print
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Recent POS sales bills, cash payment verification & customer thermal receipt printing
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              Full Invoice Archive <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sales.slice(0, 3).map((sale) => (
              <div
                key={sale.id}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-xs text-cyan-400">{sale.invoiceNumber}</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                    {sale.paymentMethod}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{sale.customerName}</h4>
                  <p className="text-xs text-slate-400">
                    {sale.items.length} Items • {sale.createdAt.split('T')[0]}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono font-bold py-1 bg-slate-900/60 px-3 rounded-xl border border-slate-800">
                  <span>Bill Total:</span>
                  <span className="text-emerald-400 text-sm">PKR {sale.total.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setSelectedInvoiceForModal(sale)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Re-Print Customer Bill
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FRONT MODULE 7: CUSTOMERS & UDHAR CREDIT LEDGER */}
      {(frontTab === 'all' || frontTab === 'udhar') && (
        <div id="sec-udhar" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Customer Records (Udhar Ledger)</h3>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-extrabold px-2 py-0.5 rounded-full">
                    Credit Accounts
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Customer contact directory, outstanding udhar credit balances & payment collection reminders
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('customers')}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              Full Udhar Ledger <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {customers.slice(0, 3).map((cust) => (
              <div
                key={cust.id}
                className="bg-slate-950 border border-slate-800 hover:border-rose-500/40 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-white text-sm">{cust.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      cust.balanceDue > 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {cust.balanceDue > 0 ? 'Udhar Due' : 'Paid Up'}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <p className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {cust.phone}
                  </p>
                  <p className="text-[11px] text-slate-400">{cust.address}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono font-bold py-1.5 bg-slate-900/60 px-3 rounded-xl border border-slate-800">
                  <span>Balance Due:</span>
                  <span className={cust.balanceDue > 0 ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}>
                    PKR {cust.balanceDue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${cust.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Assalam-o-Alaikum ${cust.name}, Galaxy Mobile payment reminder for outstanding balance PKR ${cust.balanceDue.toLocaleString()}. Thank you!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> WhatsApp Reminder
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FRONT MODULE 8: SHOP GALLERY, LOCATION MAP & CUSTOMER INQUIRIES */}
      {(frontTab === 'all' || frontTab === 'inquiries') && (
        <div id="sec-gallery" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl scroll-mt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Images className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Shop Gallery, Facility & Support</h3>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-extrabold px-2 py-0.5 rounded-full">
                    {SHOP_INFO.address}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Galaxy Mobile storefront gallery, Google Maps location, opening hours & customer inquiries
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('gallery')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                Shop Photos <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                Facility Map <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Storefront Hero Preview */}
            <div className="relative rounded-2xl border border-slate-800 overflow-hidden h-48 bg-slate-950 flex flex-col justify-end p-4">
              <img src={shopHeroImage} alt="Galaxy Mobile Shop" className="absolute inset-0 w-full h-full object-cover filter brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="relative z-10 space-y-1">
                <h4 className="font-bold text-white text-sm">{SHOP_INFO.name} Storefront</h4>
                <p className="text-xs text-slate-300">{SHOP_INFO.address}</p>
                <p className="text-[10px] text-cyan-400 font-mono">Hours: {SHOP_INFO.hours}</p>
              </div>
            </div>

            {/* Quick Map & Contact Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Facility Location & Info
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Call: {SHOP_INFO.phones[0]}</span>
                </p>
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Proprietor: Muhammad Sajid (Owner)</span>
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>NADRA & Mobile Lab Govt Verified</span>
                </p>
              </div>
              <button
                onClick={() => setActiveTab('contact')}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold cursor-pointer"
              >
                View Full Contact Details
              </button>
            </div>

            {/* Customer Inquiries Quick Status */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Recent Customer Inquiries
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                {inquiries.slice(0, 3).map((inq) => (
                  <div key={inq.id} className="p-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{inq.customerName}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">{inq.status}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{inq.subject}: {inq.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Calculator Modal */}
      <FinancialCalculatorModal
        isOpen={showCalcModal}
        onClose={() => setShowCalcModal(false)}
      />

      {/* Cash Register / Galla Management Modal */}
      <CashRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
};
