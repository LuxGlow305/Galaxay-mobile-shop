import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  PlusCircle,
  MinusCircle,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CashRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashRegisterModal: React.FC<CashRegisterModalProps> = ({ isOpen, onClose }) => {
  const {
    sales,
    digitalTransactions,
    repairTickets,
    customerLoans,
    currentUser,
    addNotification,
  } = useApp();

  // Local state for morning balance & drawer actions
  const [openingBalance, setOpeningBalance] = useState<number>(() => {
    const saved = localStorage.getItem('galaxy_register_opening');
    return saved ? parseFloat(saved) : 15000;
  });
  const [editingOpening, setEditingOpening] = useState<boolean>(false);
  const [newOpeningInput, setNewOpeningInput] = useState<string>(openingBalance.toString());

  // Exchange Note Form
  const [exchangeGivenAmt, setExchangeGivenAmt] = useState<string>('5000');
  const [exchangeNotesDetail, setExchangeNotesDetail] = useState<string>('1x 5000 note taken -> 5x 1000 change notes given');
  const [exchangeType, setExchangeType] = useState<'Customer Change / Exchange' | 'Neighbor Shop Exchange'>('Customer Change / Exchange');
  const [exchangeLog, setExchangeLog] = useState<
    { id: string; type: string; givenAmt: number; detail: string; time: string; person: string }[]
  >(() => {
    const saved = localStorage.getItem('galaxy_register_exchanges');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'exc_1',
            type: 'Customer Change / Exchange',
            givenAmt: 5000,
            detail: '1x 5000 Note taken -> Given 5x 1000 Notes Change',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            person: 'Zeeshan',
          },
          {
            id: 'exc_2',
            type: 'Neighbor Shop Exchange',
            givenAmt: 1000,
            detail: '1x 1000 Note given -> Received 10x 100 Notes from Madina Sweets',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            person: 'Sajid',
          },
        ];
  });

  // Manual Expense Form
  const [showExpenseModal, setShowExpenseModal] = useState<boolean>(false);
  const [expenseTitle, setExpenseTitle] = useState<string>('');
  const [expenseAmount, setExpenseAmount] = useState<string>('');
  const [expenses, setExpenses] = useState<{ id: string; title: string; amount: number; time: string; person: string }[]>(() => {
    const saved = localStorage.getItem('galaxy_register_expenses');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'exp_1', title: 'Shop Tea & Biscuits', amount: 180, time: '10:30 AM', person: 'Muhammad Sajid' },
          { id: 'exp_2', title: 'Counter Cleaner Spray', amount: 250, time: '11:45 AM', person: 'Zeeshan' },
        ];
  });

  // Physical Note Counting Audit State
  const [notesCount, setNotesCount] = useState<{ [key: number]: number }>({
    5000: 2,
    1000: 8,
    500: 6,
    100: 15,
    50: 10,
    20: 10,
    10: 10,
  });

  if (!isOpen) return null;

  // Calculate Cash In from system transactions
  const cashSalesTotal = sales
    .filter((s) => s.paymentMethod === 'Cash' && s.paymentStatus === 'Paid')
    .reduce((sum, s) => sum + s.total, 0);

  const easyPaisaCashInTotal = digitalTransactions
    .filter((d) => d.type.includes('Cash-In') || d.type.includes('Deposit'))
    .reduce((sum, d) => sum + d.amount, 0);

  const repairAdvanceTotal = repairTickets.reduce((sum, r) => sum + r.advancePaid, 0);

  const loanPaymentsTotal = customerLoans.reduce((sum, l) => {
    return sum + l.installments.filter((i) => i.status === 'Paid').reduce((isum, i) => isum + i.amountPaid, 0);
  }, 0);

  const totalSystemCashIn = cashSalesTotal + easyPaisaCashInTotal + repairAdvanceTotal + loanPaymentsTotal;

  // Calculate Cash Out from system transactions
  const easyPaisaCashOutTotal = digitalTransactions
    .filter((d) => d.type.includes('Cash-Out') || d.type.includes('Withdrawal'))
    .reduce((sum, d) => sum + d.amount, 0);

  const manualExpensesTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  const totalSystemCashOut = easyPaisaCashOutTotal + manualExpensesTotal;

  // Net Expected Cash in Drawer
  const expectedDrawerCash = openingBalance + totalSystemCashIn - totalSystemCashOut;

  // Total counted cash from notes breakdown
  const countedPhysicalCash = Object.entries(notesCount).reduce(
    (sum, [denom, count]) => sum + parseInt(denom) * (count || 0),
    0
  );

  const cashDifference = countedPhysicalCash - expectedDrawerCash;

  // Handlers
  const handleSaveOpening = () => {
    const val = parseFloat(newOpeningInput) || 0;
    setOpeningBalance(val);
    localStorage.setItem('galaxy_register_opening', val.toString());
    setEditingOpening(false);
    addNotification(`Morning opening cash updated to PKR ${val.toLocaleString()}`);
  };

  const handleLogExchange = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(exchangeGivenAmt);
    if (!amt || !exchangeNotesDetail.trim()) return;

    const newRecord = {
      id: `exc_${Date.now()}`,
      type: exchangeType,
      givenAmt: amt,
      detail: exchangeNotesDetail,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      person: currentUser.name,
    };

    const updated = [newRecord, ...exchangeLog];
    setExchangeLog(updated);
    localStorage.setItem('galaxy_register_exchanges', JSON.stringify(updated));

    setExchangeGivenAmt('');
    setExchangeNotesDetail('');
    addNotification(`Currency Note Exchange recorded: PKR ${amt.toLocaleString()}`);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(expenseAmount);
    if (!amt || !expenseTitle.trim()) return;

    const newExp = {
      id: `exp_${Date.now()}`,
      title: expenseTitle,
      amount: amt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      person: currentUser.name,
    };

    const updated = [newExp, ...expenses];
    setExpenses(updated);
    localStorage.setItem('galaxy_register_expenses', JSON.stringify(updated));

    setExpenseTitle('');
    setExpenseAmount('');
    setShowExpenseModal(false);
    addNotification(`Shop Cash Expense logged: PKR ${amt.toLocaleString()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Shop Cash Register & Galla Manager (گلہ مینیجر)
              </h3>
              <p className="text-xs text-slate-400">
                صبح کا ابتدائی کیش، کیش تبادلہ (Change/Exchange)، دراز بیلنس اور روزانہ اینٹری
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Metric Cards: Morning Opening + In + Out = Expected Drawer Cash */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Morning Opening Cash */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Morning Cash (ابتدائی کیش)
                </span>
                <button
                  onClick={() => setEditingOpening(!editingOpening)}
                  className="text-[10px] text-cyan-400 hover:underline font-semibold"
                >
                  {editingOpening ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingOpening ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    value={newOpeningInput}
                    onChange={(e) => setNewOpeningInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono font-bold"
                  />
                  <button
                    onClick={handleSaveOpening}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-2xl font-black font-mono text-amber-400">
                  PKR {openingBalance.toLocaleString()}
                </p>
              )}
              <p className="text-[10px] text-slate-500">Shop morning drawer float balance</p>
            </div>

            {/* 2. Cash Received / In */}
            <div className="p-4 bg-slate-950/80 border border-emerald-500/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  Total Cash In (وصولی)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Today</span>
              </div>
              <p className="text-2xl font-black font-mono text-emerald-400">
                +PKR {totalSystemCashIn.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">Sales, EasyPaisa Cash-In, Repairs</p>
            </div>

            {/* 3. Cash Given / Out */}
            <div className="p-4 bg-slate-950/80 border border-rose-500/20 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium text-rose-400">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                  Total Cash Out (ادائیگی)
                </span>
                <span className="text-[10px] text-rose-400 font-mono">Today</span>
              </div>
              <p className="text-2xl font-black font-mono text-rose-400">
                -PKR {totalSystemCashOut.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">Withdrawals, Expenses, Outflow</p>
            </div>

            {/* 4. Expected Drawer Cash */}
            <div className="p-4 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                  <Wallet className="w-3.5 h-3.5 text-cyan-400" />
                  Drawer Cash (گلہ میں کیش)
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                  Live
                </span>
              </div>
              <p className="text-2xl font-black font-mono text-cyan-300">
                PKR {expectedDrawerCash.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400">Expected balance right now</p>
            </div>
          </div>

          {/* Section 2: Cash Exchange & Change Manager (کیش تبادلہ و چینج مینیجر) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Log Change Exchange Form */}
            <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                    Note Exchange / Change Log
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    کسٹمر یا ہمسایہ دکان سے نوٹ کے تبادلے کی اینٹری کریں۔
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogExchange} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Exchange Type (نوعیت)</label>
                  <select
                    value={exchangeType}
                    onChange={(e: any) => setExchangeType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Customer Change / Exchange">Customer Change / Exchange (کسٹمر نوٹ چینج)</option>
                    <option value="Neighbor Shop Exchange">Neighbor Shop Exchange (ہمسایہ دکان تبادلہ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Note Amount (رقم)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">PKR</span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 5000"
                      value={exchangeGivenAmt}
                      onChange={(e) => setExchangeGivenAmt(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-xs text-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Notes Breakdown / Details</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. 1x 5000 note taken -> 5x 1000 notes change given"
                    value={exchangeNotesDetail}
                    onChange={(e) => setExchangeNotesDetail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  Record Currency Exchange
                </button>
              </form>
            </div>

            {/* Right: History Log of Exchanges & Shop Expenses */}
            <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-cyan-400" />
                    Recent Exchanges & Shop Expenses Log
                  </h4>
                  <p className="text-[11px] text-slate-400">آج کے نوٹ تبادلے اور دکانی اخراجات کی تفصیل</p>
                </div>
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <MinusCircle className="w-3.5 h-3.5" />
                  Log Expense
                </button>
              </div>

              {/* Exchanges list */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {exchangeLog.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {item.type}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-slate-300 font-mono font-semibold text-xs">
                      PKR {item.givenAmt.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-slate-400">{item.detail}</p>
                    <p className="text-[10px] text-slate-500 text-right">By: {item.person}</p>
                  </div>
                ))}

                {/* Expenses list */}
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-2.5 bg-rose-950/20 border border-rose-500/20 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-rose-300 block">{exp.title}</span>
                      <span className="text-[10px] text-slate-400">By {exp.person} at {exp.time}</span>
                    </div>
                    <span className="font-mono font-bold text-rose-400 text-xs">
                      -PKR {exp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Physical Note Count Audit (کاؤنٹ نوٹ audit) */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  Physical Currency Notes Audit (گلہ میں کیش کی گنتی)
                </h4>
                <p className="text-[11px] text-slate-400">
                  دراز میں موجود نوٹ گن کر درج کریں تاکہ بقایا کا موازنہ ہو۔
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total Counted Cash</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    PKR {countedPhysicalCash.toLocaleString()}
                  </span>
                </div>
                <div className="text-right pl-3 border-l border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                      cashDifference === 0
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : cashDifference > 0
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {cashDifference === 0
                      ? 'Exact Match ✓'
                      : cashDifference > 0
                      ? `+PKR ${cashDifference.toLocaleString()} Surplus`
                      : `-PKR ${Math.abs(cashDifference).toLocaleString()} Shortage`}
                  </span>
                </div>
              </div>
            </div>

            {/* Note Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[5000, 1000, 500, 100, 50, 20, 10].map((denom) => {
                const count = notesCount[denom] || 0;
                const total = denom * count;
                return (
                  <div key={denom} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 text-center">
                    <span className="text-xs font-mono font-bold text-amber-300 block">
                      PKR {denom} Note
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) =>
                        setNotesCount({
                          ...notesCount,
                          [denom]: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center font-mono font-bold text-xs text-white"
                    />
                    <span className="text-[10px] font-mono text-slate-400 block truncate">
                      = PKR {total.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expense Modal Sub-dialog */}
        {showExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
              <h4 className="font-bold text-white text-sm">Log Shop Cash Expense</h4>
              <form onSubmit={handleAddExpense} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Expense Title / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Refreshment / Tea for guest"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Amount (PKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 200"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowExpenseModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-amber-400 font-serif">
          Returned from something (خریدی ہوئی چیز کی واپسی نہیں) • Galaxy Mobile Cash Register System
        </div>
      </div>
    </div>
  );
};
