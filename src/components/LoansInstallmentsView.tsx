import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerLoan, LoanStatus } from '../types';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Calendar,
  UserCheck,
  FileText,
  Printer,
  DollarSign,
  Calculator,
  Shield,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const LoansInstallmentsView: React.FC = () => {
  const {
    customerLoans,
    addCustomerLoan,
    recordLoanPayment,
    setSelectedLoanForModal,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | LoanStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLoanDetail, setSelectedLoanDetail] = useState<CustomerLoan | null>(null);

  // New Loan Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCnic, setCustomerCnic] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [itemPurchased, setItemPurchased] = useState('');
  const [totalItemPrice, setTotalItemPrice] = useState<number | ''>('');
  const [downPayment, setDownPayment] = useState<number | ''>('');
  const [markupPercentage, setMarkupPercentage] = useState<number>(10);
  const [tenureMonths, setTenureMonths] = useState<number>(6);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Guarantor Info
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorCnic, setGuarantorCnic] = useState('');
  const [guarantorRelation, setGuarantorRelation] = useState('Relative / Friend');
  const [notes, setNotes] = useState('');

  // Payment Recording Modal State
  const [paymentLoan, setPaymentLoan] = useState<{ loan: CustomerLoan; installmentNo: number; amountDue: number } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | ''>('');

  // Calculation previews
  const principalAmt = Math.max(0, (Number(totalItemPrice) || 0) - (Number(downPayment) || 0));
  const markupAmt = (principalAmt * markupPercentage) / 100;
  const totalRepayable = principalAmt + markupAmt;
  const monthlyEmi = Math.round(totalRepayable / Math.max(1, tenureMonths));

  const filteredLoans = useMemo(() => {
    return customerLoans.filter((l) => {
      const matchesTab = activeTab === 'All' || l.status === activeTab;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        l.loanNumber.toLowerCase().includes(term) ||
        l.customerName.toLowerCase().includes(term) ||
        l.customerPhone.includes(term) ||
        l.customerCnic.includes(term) ||
        (l.itemPurchased && l.itemPurchased.toLowerCase().includes(term)) ||
        l.guarantorName.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  }, [customerLoans, activeTab, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    const totalLoansCount = customerLoans.length;
    const activeCount = customerLoans.filter((l) => l.status === 'Active').length;
    const totalOutstandingPrincipal = customerLoans
      .filter((l) => l.status === 'Active')
      .reduce((sum, l) => {
        const totalPaid = l.installments.reduce((instSum, inst) => instSum + inst.amountPaid, 0);
        return sum + Math.max(0, l.totalRepayableAmount - totalPaid);
      }, 0);

    const totalCollected = customerLoans.reduce((sum, l) => {
      return sum + l.installments.reduce((instSum, inst) => instSum + inst.amountPaid, 0);
    }, 0);

    return { totalLoansCount, activeCount, totalOutstandingPrincipal, totalCollected };
  }, [customerLoans]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerCnic || !totalItemPrice) return;

    addCustomerLoan({
      customerName,
      customerPhone,
      customerCnic,
      customerAddress,
      itemPurchased: itemPurchased || 'Mobile Device & Accessories',
      totalItemPrice: Number(totalItemPrice),
      downPayment: Number(downPayment) || 0,
      markupPercentage,
      tenureMonths,
      startDate,
      guarantorName: guarantorName || 'N/A',
      guarantorPhone: guarantorPhone || 'N/A',
      guarantorCnic: guarantorCnic || 'N/A',
      guarantorRelation,
      notes,
    });

    // Reset Form
    setCustomerName('');
    setCustomerPhone('');
    setCustomerCnic('');
    setCustomerAddress('');
    setItemPurchased('');
    setTotalItemPrice('');
    setDownPayment('');
    setGuarantorName('');
    setGuarantorPhone('');
    setGuarantorCnic('');
    setNotes('');
    setShowCreateModal(false);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentLoan || !paymentAmount) return;

    recordLoanPayment(paymentLoan.loan.id, paymentLoan.installmentNo, Number(paymentAmount));
    setPaymentLoan(null);
    setPaymentAmount('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border border-purple-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              Customer Loans & Installments
            </span>
            <span className="text-xs text-slate-400 font-urdu">موبائل نقد و اقساط سکیم</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Easy Installment Schemes & Loans
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Issue smartphone financing schemes, record monthly EMI installment payments, track guarantor records, CNIC documentation & printable agreement slips.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black px-5 py-3 rounded-2xl shadow-xl shadow-purple-500/20 transition-all cursor-pointer text-xs sm:text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Installment Loan
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold uppercase tracking-wider">
            <span>Active Loan Accounts</span>
            <CreditCard className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">{stats.activeCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active EMI schedules</p>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
            <span>Outstanding Loan Principal</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-amber-300 font-mono mt-2">
            PKR {(stats?.totalOutstandingPrincipal ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">To be collected in installments</p>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span>Total EMI Collected</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-2">
            PKR {(stats?.totalCollected ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Received from borrowers</p>
        </div>

        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider">
            <span>Total Loan Files</span>
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">{stats.totalLoansCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Total customer finance accounts</p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Search & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(['All', 'Active', 'Paid Off', 'Overdue'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Customer, CNIC, Phone, Loan #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Loan Accounts List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Loan #</th>
                <th className="p-3">Borrower & Device</th>
                <th className="p-3">CNIC & Guarantor</th>
                <th className="p-3">Financed Amount</th>
                <th className="p-3">Monthly EMI</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    No customer loan accounts found.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const paidTotal = loan.installments.reduce((s, i) => s + i.amountPaid, 0);
                  const balanceLeft = Math.max(0, loan.totalRepayableAmount - paidTotal);

                  return (
                    <tr key={loan.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <span className="font-mono font-bold text-white block">{loan.loanNumber}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{loan.startDate}</span>
                      </td>

                      <td className="p-3">
                        <p className="font-bold text-slate-100">{loan.customerName}</p>
                        <p className="text-[11px] text-purple-300">{loan.itemPurchased}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{loan.customerPhone}</p>
                      </td>

                      <td className="p-3">
                        <p className="font-mono text-[11px] text-slate-200">{loan.customerCnic}</p>
                        <p className="text-[10px] text-slate-400">
                          Guarantor: <span className="text-slate-200 font-bold">{loan.guarantorName}</span>
                        </p>
                      </td>

                      <td className="p-3 font-mono">
                        <p className="font-bold text-white">PKR {(loan.totalRepayableAmount ?? 0).toLocaleString()}</p>
                        <p className="text-[10px] text-amber-400">Bal: PKR {(balanceLeft ?? 0).toLocaleString()}</p>
                      </td>

                      <td className="p-3 font-mono">
                        <p className="font-bold text-emerald-400">PKR {(loan.monthlyInstallmentAmount ?? 0).toLocaleString()}/mo</p>
                        <p className="text-[10px] text-slate-400">{loan.tenureMonths} Months Plan</p>
                      </td>

                      <td className="p-3">
                        {loan.status === 'Active' && (
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                        {loan.status === 'Paid Off' && (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            Paid Off
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLoanDetail(loan)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Schedule
                          </button>

                          <button
                            onClick={() => setSelectedLoanForModal(loan)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Print Customer Agreement & Installment Card"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Loan Account Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-400" /> New Mobile Financing / Loan Account
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5" /> Installment Scheme Calculator
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Principal Loan:</span>
                    <span className="text-white font-bold">PKR {(principalAmt ?? 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Markup ({markupPercentage}%):</span>
                    <span className="text-amber-400 font-bold">PKR {(markupAmt ?? 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Total Repayable:</span>
                    <span className="text-purple-300 font-bold">PKR {(totalRepayable ?? 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Monthly EMI:</span>
                    <span className="text-emerald-400 font-bold text-sm">PKR {(monthlyEmi ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Borrower Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mian Shahzad Ahmad"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Borrower Mobile *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0300-8929016"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Borrower CNIC *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 33100-1234567-1"
                    value={customerCnic}
                    onChange={(e) => setCustomerCnic(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Item Financed</label>
                  <input
                    type="text"
                    placeholder="e.g. Vivo Y27 8GB/128GB Blue"
                    value={itemPurchased}
                    onChange={(e) => setItemPurchased(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Item Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    placeholder="e.g. 48000"
                    value={totalItemPrice}
                    onChange={(e) => setTotalItemPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Down Payment Paid (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 18000"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scheme Rate / Profit Markup</label>
                  <select
                    value={markupPercentage}
                    onChange={(e) => setMarkupPercentage(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value={0}>0% (Interest-Free Scheme)</option>
                    <option value={5}>5% Profit Markup</option>
                    <option value={10}>10% Standard Rate</option>
                    <option value={12}>12% Premium Rate</option>
                    <option value={15}>15% Extended Term Rate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tenure (Months)</label>
                  <select
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value={2}>2 Months Plan</option>
                    <option value={3}>3 Months Plan</option>
                    <option value={4}>4 Months Plan</option>
                    <option value={6}>6 Months Plan</option>
                    <option value={12}>12 Months Plan</option>
                  </select>
                </div>
              </div>

              {/* Guarantor Details */}
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" /> Guarantor / Reference Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Guarantor Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sajid Ali"
                      value={guarantorName}
                      onChange={(e) => setGuarantorName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Guarantor Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. 0305-6543210"
                      value={guarantorPhone}
                      onChange={(e) => setGuarantorPhone(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Guarantor CNIC</label>
                    <input
                      type="text"
                      placeholder="e.g. 33100-9876543-1"
                      value={guarantorCnic}
                      onChange={(e) => setGuarantorCnic(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-500 text-white hover:bg-purple-400 shadow-lg shadow-purple-500/20"
                >
                  Confirm & Issue Installment Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Installments Schedule Drawer */}
      {selectedLoanDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono font-bold text-xs text-purple-400">{selectedLoanDetail.loanNumber}</span>
                <h3 className="font-black text-lg text-white">{selectedLoanDetail.customerName}</h3>
                <p className="text-xs text-purple-300">{selectedLoanDetail.itemPurchased}</p>
              </div>

              <button onClick={() => setSelectedLoanDetail(null)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            {/* Installments List */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" /> EMI Schedule & Payments
              </h4>

              <div className="space-y-2">
                {selectedLoanDetail.installments.map((inst) => (
                  <div
                    key={inst.installmentNo}
                    className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-bold text-xs text-white">Month #{inst.installmentNo}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">Due: {inst.dueDate}</span>
                    </div>

                    <div className="font-mono text-xs">
                      <div className="font-bold text-white">PKR {(inst.amountDue ?? 0).toLocaleString()}</div>
                      {inst.amountPaid > 0 && (
                        <div className="text-[10px] text-emerald-400">Paid: PKR {(inst.amountPaid ?? 0).toLocaleString()}</div>
                      )}
                    </div>

                    <div>
                      {inst.status === 'Paid' ? (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          Paid ({inst.receiptNo})
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setPaymentLoan({
                              loan: selectedLoanDetail,
                              installmentNo: inst.installmentNo,
                              amountDue: inst.amountDue - inst.amountPaid,
                            });
                            setPaymentAmount(inst.amountDue - inst.amountPaid);
                          }}
                          className="px-3 py-1 bg-purple-500 hover:bg-purple-400 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                        >
                          Receive Payment
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record EMI Payment Modal */}
      {paymentLoan && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Receive Installment Payment</h3>
              <button onClick={() => setPaymentLoan(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              <p className="text-xs text-slate-300">
                Recording Installment #{paymentLoan.installmentNo} for{' '}
                <span className="font-bold text-white">{paymentLoan.loan.customerName}</span>
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amount Received (PKR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentLoan(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  Record Payment & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
