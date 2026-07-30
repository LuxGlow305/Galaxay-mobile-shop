import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { UTILITY_COMPANIES } from '../data/mockData';
import { DigitalServiceType, FinancialTransactionType, DigitalTransaction } from '../types';
import {
  Wallet,
  Smartphone,
  Zap,
  Flame,
  Droplets,
  Wifi,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  DollarSign,
  Building2,
  RefreshCw,
  ShieldCheck,
  Receipt,
  Sparkles,
  CreditCard,
  UserCheck,
  Calculator,
  ArrowRightLeft,
} from 'lucide-react';
import { FinancialCalculatorModal } from './FinancialCalculatorModal';
import { CashRegisterModal } from './CashRegisterModal';

export const DigitalFinancialsView: React.FC = () => {
  const {
    digitalTransactions,
    agentBalances,
    addDigitalTransaction,
    topUpAgentBalance,
    setSelectedDigitalTrxForModal,
    currentUser,
    hasRole,
  } = useApp();

  const [activeTab, setActiveTab] = useState<DigitalServiceType>('EasyPaisa');

  // EasyPaisa & JazzCash Form State
  const [trxType, setTrxType] = useState<'CashIn' | 'CashOut' | 'Transfer'>('CashIn');
  const [customerName, setCustomerName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [commission, setCommission] = useState<number>(20);
  const [notes, setNotes] = useState('');

  // Bill Payment Form State
  const [selectedUtilityCompanyId, setSelectedUtilityCompanyId] = useState<string>('util_fepco');
  const [consumerNo, setConsumerNo] = useState('');
  const [isFetchingBill, setIsFetchingBill] = useState(false);
  const [fetchedBillData, setFetchedBillData] = useState<{
    customerName: string;
    billingMonth: string;
    dueDate: string;
    amount: number;
    lateFee: number;
  } | null>(null);

  // Mobile EasyLoad & Network Cards Form State
  const [loadOperator, setLoadOperator] = useState<'Jazz' | 'Telenor' | 'Zong' | 'Ufone' | 'ONIC'>('Jazz');
  const [loadType, setLoadType] = useState<'EasyLoad' | 'Scratch Card' | 'Super Card / Hybrid Bundle'>('EasyLoad');
  const [loadPhone, setLoadPhone] = useState('');
  const [loadAmount, setLoadAmount] = useState<number | ''>(200);
  const [bundleName, setBundleName] = useState('');
  const [scratchCardPin, setScratchCardPin] = useState('');

  // NADRA e-Sahulat Form State
  const [nadraCategory, setNadraCategory] = useState<
    'ETD Punjab Vehicle Verification' | 'CNIC Biometric Verification' | 'SIM Verification' | 'E-challan / Govt Fee'
  >('ETD Punjab Vehicle Verification');
  const [citizenName, setCitizenName] = useState('Mian Shahzad Ahmad');
  const [citizenUrduName, setCitizenUrduName] = useState('میان شہزاد احمد');
  const [nadraCnic, setNadraCnic] = useState('37405-7994611-7');
  const [chassisNo, setChassisNo] = useState('U525757');
  const [nadraFee, setNadraFee] = useState<number>(120);

  // Search & Filters for Log Table
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [logFilterService, setLogFilterService] = useState<string>('All');

  // Topup Modal State
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [topupProvider, setTopupProvider] = useState<'easyPaisa' | 'jazzCash' | 'billFloat' | 'easyLoad' | 'eSahulat'>('easyPaisa');
  const [topupAmount, setTopupAmount] = useState<number | ''>('');

  const selectedCompany = useMemo(() => {
    return UTILITY_COMPANIES.find((c) => c.id === selectedUtilityCompanyId) || UTILITY_COMPANIES[0];
  }, [selectedUtilityCompanyId]);

  // Calculate default commission based on amount
  const handleAmountChange = (val: number) => {
    setAmount(val);
    if (val <= 1000) setCommission(20);
    else if (val <= 5000) setCommission(50);
    else if (val <= 10000) setCommission(100);
    else setCommission(Math.round(val * 0.01)); // 1%
  };

  // Quick amount buttons handler
  const setPresetAmount = (val: number) => {
    handleAmountChange(val);
  };

  // Submit EasyPaisa / JazzCash Transaction
  const handleDigitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !senderPhone) return;

    const numAmt = Number(amount);
    let finType: FinancialTransactionType = 'EasyPaisa Cash-In (Deposit)';

    if (activeTab === 'EasyPaisa') {
      if (trxType === 'CashIn') finType = 'EasyPaisa Cash-In (Deposit)';
      else if (trxType === 'CashOut') finType = 'EasyPaisa Cash-Out (Withdrawal)';
      else finType = 'EasyPaisa Money Transfer';
    } else if (activeTab === 'JazzCash') {
      if (trxType === 'CashIn') finType = 'JazzCash Cash-In (Deposit)';
      else if (trxType === 'CashOut') finType = 'JazzCash Cash-Out (Withdrawal)';
      else finType = 'JazzCash Money Transfer';
    }

    addDigitalTransaction({
      serviceType: activeTab,
      type: finType,
      senderName: customerName || 'Walk-in Client',
      senderPhone,
      receiverPhone: receiverPhone || senderPhone,
      cnic,
      amount: numAmt,
      feeCommission: commission,
      totalCollected: numAmt + (trxType === 'CashOut' ? 0 : commission),
      paymentMethodUsed: 'Cash',
      agentId: currentUser.id,
      agentName: currentUser.name,
      notes: notes || `${activeTab} transaction processed at counter`,
    });

    // Reset Form
    setAmount('');
    setCustomerName('');
    setSenderPhone('');
    setReceiverPhone('');
    setCnic('');
    setNotes('');
  };

  // Simulate Bill Inquiry / Fetching
  const handleFetchBill = () => {
    if (!consumerNo) return;
    setIsFetchingBill(true);

    setTimeout(() => {
      // Mock generated bill details based on consumer number
      const mockNames = ['Zeeshan Ahmad', 'Sajid Ali', 'Zeeshan', 'Sajid'];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const baseAmt = Math.floor(1500 + Math.random() * 8500);

      setFetchedBillData({
        customerName: randomName,
        billingMonth: 'July 2026',
        dueDate: '2026-07-29',
        amount: baseAmt,
        lateFee: Math.round(baseAmt * 0.05),
      });
      setIsFetchingBill(false);
    }, 700);
  };

  // Submit Bill Payment
  const handleBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerNo || !fetchedBillData) return;

    let billType: FinancialTransactionType = 'Electricity Bill Payment';
    if (selectedCompany.category === 'Gas') billType = 'Gas Bill Payment';
    else if (selectedCompany.category === 'Water') billType = 'Water Bill Payment';
    else if (selectedCompany.category === 'Internet & Landline') billType = 'Internet / PTCL Bill Payment';

    addDigitalTransaction({
      serviceType: 'Utility Bill Payment',
      type: billType,
      senderName: fetchedBillData.customerName,
      senderPhone: senderPhone || '0300-0000000',
      amount: fetchedBillData.amount,
      feeCommission: 30, // Standard PKR 30 bill collection fee
      totalCollected: fetchedBillData.amount + 30,
      paymentMethodUsed: 'Cash',
      agentId: currentUser.id,
      agentName: currentUser.name,
      billDetails: {
        company: selectedCompany.name,
        consumerNumber: consumerNo,
        billingMonth: fetchedBillData.billingMonth,
        dueDate: fetchedBillData.dueDate,
        lateFeeAmount: fetchedBillData.lateFee,
        customerName: fetchedBillData.customerName,
        paidStatus: true,
      },
      notes: `${selectedCompany.code} Bill Paid Ref #${consumerNo}`,
    });

    // Reset Form
    setConsumerNo('');
    setFetchedBillData(null);
    setSenderPhone('');
  };

  // Submit Mobile EasyLoad / Network Card
  const handleMobileLoadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadAmount || Number(loadAmount) <= 0 || !loadPhone) return;

    const numAmt = Number(loadAmount);
    let finType: FinancialTransactionType = 'Jazz EasyLoad';
    if (loadType === 'Scratch Card' || loadType === 'Super Card / Hybrid Bundle') {
      finType = 'Scratch Card / Super Card Bundle';
    } else {
      if (loadOperator === 'Telenor') finType = 'Telenor Easyload';
      else if (loadOperator === 'Zong') finType = 'Zong Load';
      else if (loadOperator === 'Ufone') finType = 'Ufone Easyload';
      else if (loadOperator === 'ONIC') finType = 'ONIC Digital Top-up';
      else finType = 'Jazz EasyLoad';
    }

    addDigitalTransaction({
      serviceType: 'Mobile EasyLoad & Network Cards',
      type: finType,
      senderName: customerName || `${loadOperator} Customer`,
      senderPhone: loadPhone,
      amount: numAmt,
      feeCommission: 10,
      totalCollected: numAmt + 10,
      paymentMethodUsed: 'Cash',
      agentId: currentUser.id,
      agentName: currentUser.name,
      mobileLoadDetails: {
        networkOperator: loadOperator,
        mobileNumber: loadPhone,
        loadType: loadType,
        bundleName: bundleName || undefined,
        scratchCardPin: scratchCardPin || undefined,
      },
      notes: `${loadOperator} ${loadType} sent to ${loadPhone}`,
    });

    setLoadPhone('');
    setBundleName('');
    setScratchCardPin('');
  };

  // Submit NADRA e-Sahulat Verification
  const handleNadraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nadraCnic) return;

    let finType: FinancialTransactionType = 'NADRA Biometric Verification';
    if (nadraCategory === 'ETD Punjab Vehicle Verification') finType = 'ETD Punjab Vehicle Clearance';

    const randomTrack = Math.floor(100000000 + Math.random() * 900000000).toString();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB').replace(/\//g, '-');
    const timeStr = now.toTimeString().split(' ')[0];

    addDigitalTransaction({
      serviceType: 'NADRA e-Sahulat & Biometric',
      type: finType,
      senderName: citizenName,
      senderPhone: senderPhone || '0300-8929016',
      cnic: nadraCnic,
      amount: nadraFee,
      feeCommission: 30,
      totalCollected: nadraFee + 30,
      paymentMethodUsed: 'Cash',
      agentId: currentUser.id,
      agentName: currentUser.name,
      nadraDetails: {
        cnic: nadraCnic,
        citizenUrduName: citizenUrduName,
        verificationStatus: 'Verified',
        trackingId: randomTrack,
        serviceCategory: nadraCategory,
        eSahulatId: '43262',
        chassisNo: chassisNo || undefined,
        serviceCharges: nadraFee,
        issueDate: dateStr,
        issueTime: timeStr,
        barcodeNumber: `43262${dateStr.replace(/-/g, '').slice(-6)}${randomTrack.slice(0, 5)}`,
        helpLine: '051-2772100',
      },
      notes: `NADRA ${nadraCategory} Verified for ${citizenName}`,
    });
  };

  // Submit Top Up
  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || Number(topupAmount) <= 0) return;
    topUpAgentBalance(topupProvider, Number(topupAmount));
    setTopupAmount('');
    setShowTopupModal(false);
  };

  // Filtered log transactions
  const filteredTrxs = useMemo(() => {
    return digitalTransactions.filter((t) => {
      const matchesService = logFilterService === 'All' || t.serviceType === logFilterService;
      const term = logSearchTerm.toLowerCase();
      const matchesSearch =
        t.trxId.toLowerCase().includes(term) ||
        t.senderName.toLowerCase().includes(term) ||
        t.senderPhone.includes(term) ||
        (t.billDetails && t.billDetails.consumerNumber.includes(term));

      return matchesService && matchesSearch;
    });
  }, [digitalTransactions, logFilterService, logSearchTerm]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 p-6 rounded-3xl border border-emerald-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              EasyPaisa • JazzCash • Bill Payment Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">گلیکسی ڈیجیٹل بینکنگ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial Services & Utility Bills
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Instant EasyPaisa money transfers, JazzCash biometric cash-in/out & official utility bill payments (FEPCO, SNGPL, WASA, PTCL) with agent till balance tracking.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-serif font-bold text-amber-300">
            <span>Returned from something</span>
            <span>•</span>
            <span>نوٹ: خریدی ہوئی چیز کی واپسی نہیںے۔</span>
            <span>•</span>
            <span>موبائل وارنٹی کمپنی کی ہے ہماری نہیں۔</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowCalcModal(true)}
            className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-bold px-3.5 py-2.5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-cyan-400" />
            <span>Calculator (کیلکولیٹر)</span>
          </button>

          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 hover:bg-slate-800 text-amber-300 font-bold px-3.5 py-2.5 rounded-2xl shadow-lg transition-all text-xs cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
            <span>Cash Register / Galla (گلہ مینیجر)</span>
          </button>

          {hasRole(['admin', 'manager']) && (
            <button
              onClick={() => setShowTopupModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4" /> Top Up Float
            </button>
          )}
        </div>
      </div>

      {/* Agent Balances Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* EasyPaisa Float Card */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> EasyPaisa Float
            </span>
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-white font-mono">
              PKR {(agentBalances?.easyPaisaBalance ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Till: 0300-8929016</p>
          </div>
        </div>

        {/* JazzCash Float Card */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> JazzCash Float
            </span>
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-white font-mono">
              PKR {(agentBalances?.jazzCashBalance ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Till: 0300-8929016 (Auto Till)</p>
          </div>
        </div>

        {/* Mobile EasyLoad Balance Card */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> EasyLoad Reserve
            </span>
            <div className="p-1.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-white font-mono">
              PKR {(agentBalances?.easyLoadBalance ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Jazz/Telenor/Zong/Ufone</p>
          </div>
        </div>

        {/* NADRA e-Sahulat Reserve Card */}
        <div className="bg-slate-900/90 border border-blue-500/30 rounded-3xl p-4 shadow-xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> NADRA eSahulat
            </span>
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-white font-mono">
              PKR {(agentBalances?.eSahulatBalance ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">ID: 43262 (Verified)</p>
          </div>
        </div>

        {/* Today's Agent Commission Card */}
        <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/50 rounded-3xl p-4 shadow-xl relative overflow-hidden col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Today's Commission
            </span>
            <div className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xl font-black text-emerald-400 font-mono">
              PKR {(agentBalances?.todayCommissionEarned ?? 0).toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-300 mt-0.5">Net Service Revenue</p>
          </div>
        </div>
      </div>

      {/* Main Working Counter / Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('EasyPaisa')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'EasyPaisa'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" /> EasyPaisa
          </button>

          <button
            onClick={() => setActiveTab('JazzCash')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'JazzCash'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" /> JazzCash
          </button>

          <button
            onClick={() => setActiveTab('Mobile EasyLoad & Network Cards')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'Mobile EasyLoad & Network Cards'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Mobile EasyLoad & Cards
          </button>

          <button
            onClick={() => setActiveTab('NADRA e-Sahulat & Biometric')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'NADRA e-Sahulat & Biometric'
                ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> NADRA e-Sahulat
          </button>

          <button
            onClick={() => setActiveTab('Utility Bill Payment')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'Utility Bill Payment'
                ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" /> Utility Bill Payments
          </button>
        </div>

        {/* Form Container */}
        {activeTab === 'EasyPaisa' || activeTab === 'JazzCash' ? (
          <form onSubmit={handleDigitalSubmit} className="space-y-5">
            {/* Operation Type Switcher */}
            <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl w-fit">
              <button
                type="button"
                onClick={() => setTrxType('CashIn')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  trxType === 'CashIn'
                    ? 'bg-slate-900 text-cyan-400 shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> Cash-In (Wallet Deposit)
              </button>

              <button
                type="button"
                onClick={() => setTrxType('CashOut')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  trxType === 'CashOut'
                    ? 'bg-slate-900 text-cyan-400 shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-rose-400" /> Cash-Out (Biometric Withdrawal)
              </button>

              <button
                type="button"
                onClick={() => setTrxType('Transfer')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  trxType === 'Transfer'
                    ? 'bg-slate-900 text-cyan-400 shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Send className="w-4 h-4 text-cyan-400" /> Money Send (CNIC / Bank)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mian Shahzad Ahmad"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Customer Phone Number *
                  </label>
                  {(() => {
                    const clean = senderPhone.replace(/\D/g, '');
                    if (clean.length >= 4) {
                      const pfx = clean.slice(0, 4);
                      if (['0300', '0301', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0320', '0321', '0322', '0323', '0324'].includes(pfx)) {
                        return <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">⚡ Auto: JazzCash</span>;
                      }
                      if (['0340', '0341', '0342', '0343', '0344', '0345', '0346', '0347', '0348', '0349'].includes(pfx)) {
                        return <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">⚡ Auto: EasyPaisa</span>;
                      }
                      if (['0310', '0311', '0312', '0313', '0314', '0315', '0316', '0317', '0318', '0319'].includes(pfx)) {
                        return <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30">⚡ Auto: Zong</span>;
                      }
                      if (['0330', '0331', '0332', '0333', '0334', '0335', '0336', '0337'].includes(pfx)) {
                        return <span className="text-[10px] text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/30">⚡ Auto: Ufone</span>;
                      }
                    }
                    return null;
                  })()}
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300-8929016"
                  value={senderPhone}
                  onChange={(e) => {
                    const val = e.target.value;
                    const digits = val.replace(/\D/g, '').slice(0, 11);
                    const formatted = digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
                    setSenderPhone(formatted);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {trxType === 'Transfer' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Receiver Account / Mobile No
                    </label>
                    {(() => {
                      const clean = receiverPhone.replace(/\D/g, '');
                      if (clean.length >= 4) {
                        const pfx = clean.slice(0, 4);
                        if (['0300', '0301', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309', '0320', '0321', '0322', '0323', '0324'].includes(pfx)) {
                          return <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">⚡ Auto: JazzCash Account</span>;
                        }
                        if (['0340', '0341', '0342', '0343', '0344', '0345', '0346', '0347', '0348', '0349'].includes(pfx)) {
                          return <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">⚡ Auto: EasyPaisa Account</span>;
                        }
                      }
                      return null;
                    })()}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 0302-1234567"
                    value={receiverPhone}
                    onChange={(e) => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, '').slice(0, 11);
                      const formatted = digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
                      setReceiverPhone(formatted);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  CNIC Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 33100-1234567-1"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transaction Amount (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Enter amount (e.g. 5000)"
                  value={amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Agent Service Commission (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Quick Amount Presets:</span>
              <div className="flex flex-wrap items-center gap-2">
                {[500, 1000, 2000, 5000, 10000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPresetAmount(amt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs cursor-pointer"
                  >
                    PKR {(amt ?? 0).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Note / Reference</label>
              <input
                type="text"
                placeholder="Optional internal shop memo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Agent Operator:{' '}
                <span className="font-bold text-white">{currentUser.name}</span>
              </div>

              <button
                type="submit"
                className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm text-slate-950 flex items-center gap-2 shadow-xl transition-all cursor-pointer ${
                  activeTab === 'EasyPaisa'
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Process {activeTab} Transaction</span>
              </button>
            </div>
          </form>
        ) : activeTab === 'Mobile EasyLoad & Network Cards' ? (
          /* Mobile Load & Scratch Cards Form */
          <form onSubmit={handleMobileLoadSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Network Operator */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Telecom Network Operator *
                </label>
                <div className="grid grid-cols-5 gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
                  {(['Jazz', 'Telenor', 'Zong', 'Ufone', 'ONIC'] as const).map((op) => (
                    <button
                      type="button"
                      key={op}
                      onClick={() => setLoadOperator(op)}
                      className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        loadOperator === op
                          ? op === 'Jazz'
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : op === 'Telenor'
                            ? 'bg-blue-500 text-white font-black'
                            : op === 'Zong'
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : op === 'Ufone'
                            ? 'bg-orange-500 text-white font-black'
                            : 'bg-cyan-500 text-slate-950 font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>

              {/* Load Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Service Category *
                </label>
                <select
                  value={loadType}
                  onChange={(e) => setLoadType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="EasyLoad">Direct EasyLoad (Balance Transfer)</option>
                  <option value="Scratch Card">Scratch Card Pin Code</option>
                  <option value="Super Card / Hybrid Bundle">Super Card / Monthly Hybrid Bundle</option>
                </select>
              </div>

              {/* Customer Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0300-1234567"
                  value={loadPhone}
                  onChange={(e) => setLoadPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Recharge Amount (PKR) *
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  value={loadAmount}
                  onChange={(e) => setLoadAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-cyan-400 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Bundle Name if applicable */}
              {loadType === 'Super Card / Hybrid Bundle' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Package / Bundle Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weekly Super Duper / Monthly Max"
                    value={bundleName}
                    onChange={(e) => setBundleName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {/* Scratch card pin if applicable */}
              {loadType === 'Scratch Card' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Card Scratch Pin Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1423 8921 9012"
                    value={scratchCardPin}
                    onChange={(e) => setScratchCardPin(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-amber-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}
            </div>

            {/* Quick Amount Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Quick EasyLoad Presets:</span>
              <div className="flex flex-wrap items-center gap-2">
                {[100, 200, 300, 500, 1000, 1500, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setLoadAmount(amt)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs cursor-pointer"
                  >
                    PKR {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Network: <span className="font-bold text-cyan-400">{loadOperator}</span> | Agent:{' '}
                <span className="font-bold text-white">{currentUser.name}</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 shadow-xl shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Send {loadOperator} EasyLoad & Print Slip</span>
              </button>
            </div>
          </form>
        ) : activeTab === 'NADRA e-Sahulat & Biometric' ? (
          /* NADRA e-Sahulat Form */
          <form onSubmit={handleNadraSubmit} className="space-y-5">
            <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 p-3 rounded-2xl border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold">NADRA e-Sahulat Terminal Active (ID: 43262)</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Biometric Scanner Connected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  NADRA Service Category *
                </label>
                <select
                  value={nadraCategory}
                  onChange={(e) => setNadraCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-bold"
                >
                  <option value="ETD Punjab Vehicle Verification">ETD Punjab Vehicle Clearance & Tax</option>
                  <option value="CNIC Biometric Verification">CNIC Biometric Identity Verification</option>
                  <option value="SIM Verification">SIM Card Biometric Verification</option>
                  <option value="E-challan / Govt Fee">E-Challan / Provincial Govt Tax</option>
                </select>
              </div>

              {/* Citizen Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Citizen English Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mian Shahzad Ahmad"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Citizen Urdu Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  نام (Urdu Name on CNIC)
                </label>
                <input
                  type="text"
                  placeholder="e.g. میان شہزاد احمد"
                  value={citizenUrduName}
                  onChange={(e) => setCitizenUrduName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-emerald-400 font-urdu focus:outline-none focus:border-cyan-500 text-right"
                />
              </div>

              {/* CNIC */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  CNIC Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 37405-7994611-7"
                  value={nadraCnic}
                  onChange={(e) => setNadraCnic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Chassis No if Vehicle */}
              {nadraCategory === 'ETD Punjab Vehicle Verification' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vehicle Chassis No / Reg No
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. U525757"
                    value={chassisNo}
                    onChange={(e) => setChassisNo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {/* Service Charges Fee */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Govt Service Fee (PKR)
                </label>
                <input
                  type="number"
                  value={nadraFee}
                  onChange={(e) => setNadraFee(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Official Verification • Help Line: <span className="font-mono text-slate-200">051-2772100</span>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl font-black text-xs sm:text-sm bg-blue-500 hover:bg-blue-400 text-slate-950 flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Process NADRA Verification & Issue Official Slip</span>
              </button>
            </div>
          </form>
        ) : (
          /* Utility Bill Payment Terminal Form */
          <form onSubmit={handleBillSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Utility Company Select */}
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Select Utility Company *
                </label>
                <select
                  value={selectedUtilityCompanyId}
                  onChange={(e) => {
                    setSelectedUtilityCompanyId(e.target.value);
                    setFetchedBillData(null);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {UTILITY_COMPANIES.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      [{comp.category}] {comp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consumer / Reference Number with Fetch Button */}
              <div className="md:col-span-2 lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Consumer Reference Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${'14234567890123'.slice(0, selectedCompany.sampleReferenceLength)}`}
                    value={consumerNo}
                    onChange={(e) => setConsumerNo(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleFetchBill}
                    disabled={isFetchingBill || !consumerNo}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetchingBill ? 'animate-spin' : ''}`} />
                    <span>{isFetchingBill ? 'Fetching...' : 'Fetch Bill'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Fetched Bill Details Card */}
            {fetchedBillData && (
              <div className="bg-slate-800/80 border border-cyan-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bill Details Found
                  </span>
                  <span className="text-xs font-mono text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-700">
                    Ref: {consumerNo}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Customer Name</span>
                    <span className="font-bold text-white">{fetchedBillData.customerName}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Billing Month</span>
                    <span className="font-bold text-slate-200">{fetchedBillData.billingMonth}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Due Date</span>
                    <span className="font-bold text-amber-400">{fetchedBillData.dueDate}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Payable Amount</span>
                    <span className="font-black text-emerald-400 text-sm font-mono">
                      PKR {(fetchedBillData?.amount ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer Mobile Number (For SMS Receipt)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0300-8929016"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Collection Service Fee (PKR)
                </label>
                <input
                  type="number"
                  value={30}
                  readOnly
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Agent Operator: <span className="font-bold text-white">{currentUser.name}</span>
              </div>

              <button
                type="submit"
                disabled={!fetchedBillData}
                className={`px-6 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all cursor-pointer ${
                  fetchedBillData
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Pay Utility Bill & Issue Stamp Receipt</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Transaction History Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-400" /> Digital Financials Transaction Log
            </h3>
            <p className="text-xs text-slate-400">
              Complete history of EasyPaisa, JazzCash transfers & utility bill payments
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search TID, phone or ref..."
                value={logSearchTerm}
                onChange={(e) => setLogSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={logFilterService}
              onChange={(e) => setLogFilterService(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Services</option>
              <option value="EasyPaisa">EasyPaisa</option>
              <option value="JazzCash">JazzCash</option>
              <option value="Mobile EasyLoad & Network Cards">EasyLoad & Cards</option>
              <option value="NADRA e-Sahulat & Biometric">NADRA e-Sahulat</option>
              <option value="Utility Bill Payment">Utility Bills</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">TID & Service</th>
                <th className="p-3">Customer / Details</th>
                <th className="p-3">Amount (PKR)</th>
                <th className="p-3">Commission</th>
                <th className="p-3">Agent</th>
                <th className="p-3">Date / Time</th>
                <th className="p-3 text-right rounded-r-xl">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredTrxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filteredTrxs.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <span className="font-mono font-bold text-white block">{trx.trxId}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          trx.serviceType === 'EasyPaisa'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : trx.serviceType === 'JazzCash'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : trx.serviceType === 'Mobile EasyLoad & Network Cards'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : trx.serviceType === 'NADRA e-Sahulat & Biometric'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                        }`}
                      >
                        {trx.type}
                      </span>
                    </td>

                    <td className="p-3">
                      <p className="font-bold text-slate-100">{trx.senderName}</p>
                      <p className="font-mono text-[11px] text-slate-400">{trx.senderPhone}</p>
                      {trx.mobileLoadDetails && (
                        <p className="text-[10px] text-cyan-300 font-mono mt-0.5">
                          {trx.mobileLoadDetails.networkOperator} ({trx.mobileLoadDetails.loadType})
                        </p>
                      )}
                      {trx.nadraDetails && (
                        <p className="text-[10px] text-blue-300 font-mono mt-0.5">
                          CNIC: {trx.nadraDetails.cnic} • {trx.nadraDetails.serviceCategory}
                        </p>
                      )}
                      {trx.billDetails && (
                        <p className="text-[10px] text-emerald-300 font-mono mt-0.5">
                          Ref: {trx.billDetails.consumerNumber} ({trx.billDetails.company.split(' ')[0]})
                        </p>
                      )}
                    </td>

                    <td className="p-3 font-mono font-black text-emerald-400">
                      PKR {(trx?.amount ?? 0).toLocaleString()}
                    </td>

                    <td className="p-3 font-mono text-cyan-300">
                      +PKR {trx.feeCommission}
                    </td>

                    <td className="p-3 text-slate-300 text-[11px]">
                      {trx.agentName}
                    </td>

                    <td className="p-3 text-[11px] text-slate-400">
                      {trx?.createdAt ? new Date(trx.createdAt).toLocaleString() : ''}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedDigitalTrxForModal(trx)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-xl transition-colors cursor-pointer"
                        title="Print Digital Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Agent Balance Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" /> Top Up Agent Float / Balance
              </h3>
              <button onClick={() => setShowTopupModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleTopupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Provider Account</label>
                <select
                  value={topupProvider}
                  onChange={(e) => setTopupProvider(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="easyPaisa">EasyPaisa Agent Account</option>
                  <option value="jazzCash">JazzCash Agent Account</option>
                  <option value="easyLoad">Mobile EasyLoad Reserve Account</option>
                  <option value="eSahulat">NADRA e-Sahulat Terminal Reserve</option>
                  <option value="billFloat">Utility Bill Reserve Float</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Top Up Amount (PKR) *</label>
                <input
                  type="number"
                  required
                  min="1000"
                  placeholder="e.g. 50000"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  Confirm Topup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EasyPaisa & JazzCash Calculator Modal */}
      <FinancialCalculatorModal
        isOpen={showCalcModal}
        onClose={() => setShowCalcModal(false)}
        onSelectAmount={(calculatedAmt) => {
          handleAmountChange(calculatedAmt);
          setShowCalcModal(false);
        }}
      />

      {/* Cash Register / Galla Management Modal */}
      <CashRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />
    </div>
  );
};
