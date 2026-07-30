import React, { useState } from 'react';
import { X, Calculator, ArrowRightLeft, DollarSign, Check, Copy, Sparkles, RefreshCw } from 'lucide-react';

interface FinancialCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAmount?: (amt: number) => void;
}

export const FinancialCalculatorModal: React.FC<FinancialCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectAmount,
}) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'change' | 'fee' | 'standard'>('excel');

  // Excel Formula Calculator State
  const [excelFormula, setExcelFormula] = useState<string>('=SUM(5000, 2500, 1200) - 450');
  const [formulaResult, setFormulaResult] = useState<{ value: number | string; isError: boolean; explanation: string }>({
    value: 8250,
    isError: false,
    explanation: 'SUM(5000, 2500, 1200) = 8700 minus 450 = 8250',
  });

  // Evaluate Excel formula helper
  const evaluateExcelFormula = (expr: string) => {
    let clean = expr.trim();
    if (clean.startsWith('=')) {
      clean = clean.substring(1).trim();
    }
    if (!clean) {
      return { value: 0, isError: false, explanation: 'Empty formula' };
    }

    try {
      // Replace custom functions like FEE(amount)
      let parsed = clean.replace(/FEE\s*\(\s*(\d+(\.\d+)?)\s*\)/gi, (_, amt) => {
        return calculateWalletFee(parseFloat(amt)).toString();
      });

      // Replace SUM(a, b, c)
      parsed = parsed.replace(/SUM\s*\(([^)]+)\)/gi, (_, argsStr) => {
        const nums = argsStr.split(',').map((n: string) => parseFloat(n.trim()) || 0);
        return nums.reduce((a: number, b: number) => a + b, 0).toString();
      });

      // Replace AVERAGE(a, b, c)
      parsed = parsed.replace(/AVERAGE\s*\(([^)]+)\)/gi, (_, argsStr) => {
        const nums = argsStr.split(',').map((n: string) => parseFloat(n.trim()) || 0);
        if (nums.length === 0) return '0';
        return (nums.reduce((a: number, b: number) => a + b, 0) / nums.length).toString();
      });

      // Replace MAX(a, b, c)
      parsed = parsed.replace(/MAX\s*\(([^)]+)\)/gi, (_, argsStr) => {
        const nums = argsStr.split(',').map((n: string) => parseFloat(n.trim()) || 0);
        return Math.max(...nums).toString();
      });

      // Replace MIN(a, b, c)
      parsed = parsed.replace(/MIN\s*\(([^)]+)\)/gi, (_, argsStr) => {
        const nums = argsStr.split(',').map((n: string) => parseFloat(n.trim()) || 0);
        return Math.min(...nums).toString();
      });

      // Replace percentages e.g. 100 * 5% => 100 * 0.05
      parsed = parsed.replace(/(\d+(\.\d+)?)%/g, (_, val) => (parseFloat(val) / 100).toString());

      // Replace multiplication and division symbols if typed
      parsed = parsed.replace(/×/g, '*').replace(/÷/g, '/');

      // Sanitize input to prevent code injection, allow only math characters
      if (!/^[0-9+\-*/().\s]+$/.test(parsed)) {
        return { value: 'Formula Syntax Error', isError: true, explanation: 'Contains unsupported characters' };
      }

      // Safe Function evaluation for arithmetic math
      const res = Function(`"use strict"; return (${parsed})`)();
      if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
        return {
          value: Number(res.toFixed(2)),
          isError: false,
          explanation: `Calculated Excel expression: =${clean}`,
        };
      } else {
        return { value: 'Error', isError: true, explanation: 'Invalid mathematical result' };
      }
    } catch (err) {
      return { value: 'Formula Error', isError: true, explanation: 'Please check syntax (e.g. =SUM(100, 200) or =500 + 300)' };
    }
  };

  const handleFormulaInputChange = (text: string) => {
    setExcelFormula(text);
    const evalRes = evaluateExcelFormula(text);
    setFormulaResult(evalRes);
  };

  // Standard Calc state
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // EasyPaisa / JazzCash Fee Calculator state
  const [feeAmount, setFeeAmount] = useState<number>(2000);
  const [customFeeRate, setCustomFeeRate] = useState<number | null>(null);

  // Cash Change Return Calculator state
  const [cashGiven, setCashGiven] = useState<string>('5000');
  const [billAmount, setBillAmount] = useState<string>('3450');

  if (!isOpen) return null;

  // Standard Calc handlers
  const handleDigit = (digit: string) => {
    if (calcDisplay === '0' || calcDisplay === 'Error') {
      setCalcDisplay(digit);
    } else {
      setCalcDisplay(calcDisplay + digit);
    }
  };

  const handleOp = (op: string) => {
    setPrevVal(parseFloat(calcDisplay));
    setCalcDisplay('0');
    setOperation(op);
  };

  const handleEqual = () => {
    if (prevVal === null || !operation) return;
    const current = parseFloat(calcDisplay);
    let res = 0;
    switch (operation) {
      case '+': res = prevVal + current; break;
      case '-': res = prevVal - current; break;
      case '×': res = prevVal * current; break;
      case '÷': res = current !== 0 ? prevVal / current : 0; break;
    }
    setCalcDisplay(res.toString());
    setPrevVal(null);
    setOperation(null);
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setPrevVal(null);
    setOperation(null);
  };

  const handleCopyDisplay = () => {
    navigator.clipboard.writeText(calcDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onSelectAmount) {
      onSelectAmount(parseFloat(calcDisplay) || 0);
    }
  };

  // Fee Calculation helper (standard Pakistani mobile wallet tier rates)
  const calculateWalletFee = (amt: number) => {
    if (customFeeRate !== null) return (amt * customFeeRate) / 100;
    if (amt <= 1000) return 20;
    if (amt <= 2500) return 40;
    if (amt <= 4000) return 60;
    if (amt <= 6000) return 90;
    if (amt <= 8000) return 120;
    if (amt <= 10000) return 150;
    if (amt <= 15000) return 210;
    if (amt <= 20000) return 280;
    if (amt <= 25000) return 350;
    if (amt <= 35000) return 480;
    if (amt <= 50000) return 650;
    return Math.round(amt * 0.015);
  };

  const calculatedFee = calculateWalletFee(feeAmount);
  const totalWithFee = feeAmount + calculatedFee;

  // Change Return Calculation
  const numGiven = parseFloat(cashGiven) || 0;
  const numBill = parseFloat(billAmount) || 0;
  const changeToReturn = numGiven - numBill;

  // Denomination helper for change
  const getDenominations = (rem: number) => {
    if (rem <= 0) return [];
    let temp = rem;
    const notes = [5000, 1000, 500, 100, 50, 20, 10];
    const breakdown: { note: number; count: number }[] = [];
    for (const note of notes) {
      if (temp >= note) {
        const count = Math.floor(temp / note);
        breakdown.push({ note, count });
        temp %= note;
      }
    }
    return breakdown;
  };

  const changeBreakdown = getDenominations(changeToReturn);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                EasyPaisa & JazzCash Calculator
              </h3>
              <p className="text-xs text-slate-400">
                ایزی پیسہ، جاز کیش اور رٹن کیش کیلکولیٹر
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

        {/* Navigation Tabs */}
        <div className="p-2 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('excel')}
            className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'excel'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel Formula (فارمولا)</span>
          </button>
          <button
            onClick={() => setActiveTab('change')}
            className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'change'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>Cash Change (بقیہ)</span>
          </button>
          <button
            onClick={() => setActiveTab('fee')}
            className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'fee'
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-purple-400" />
            <span>Wallet Fee (فیس)</span>
          </button>
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 min-w-[90px] py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'standard'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>Keypad</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 0: EXCEL FORMULA MODE */}
          {activeTab === 'excel' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl text-xs text-slate-300">
                <p className="font-bold text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Excel-Style Formula Calculator (ایکسل فارمولا میتھڈ)
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ایکسل کی طرح فارمولا کا استعمال کریں۔ جیسے: <code className="text-emerald-300 font-mono bg-slate-900 px-1 rounded">=SUM(5000, 2500)</code>، <code className="text-emerald-300 font-mono bg-slate-900 px-1 rounded">=AVERAGE(100, 200)</code> یا <code className="text-emerald-300 font-mono bg-slate-900 px-1 rounded">=FEE(5000)</code>
                </p>
              </div>

              {/* Excel Formula Bar */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-300 flex items-center justify-between">
                  <span>Excel Formula Input Bar</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">Starts with =</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-mono font-black text-emerald-400 text-sm">fx</span>
                  <input
                    type="text"
                    value={excelFormula}
                    onChange={(e) => handleFormulaInputChange(e.target.value)}
                    placeholder="e.g. =SUM(5000, 2500, 1200) - 450"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                </div>
              </div>

              {/* Quick Excel Function Chips */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-slate-400">Quick Excel Formula Functions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: '=SUM(1000, 2000, 500)', insert: '=SUM(1000, 2000, 500)' },
                    { label: '=AVERAGE(1000, 2000)', insert: '=AVERAGE(1000, 2000)' },
                    { label: '=FEE(5000)', insert: '=FEE(5000)' },
                    { label: '=MAX(1500, 3200)', insert: '=MAX(1500, 3200)' },
                    { label: '=MIN(500, 1200)', insert: '=MIN(500, 1200)' },
                    { label: '=5000 * 15%', insert: '=5000 * 15%' },
                  ].map((fn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFormulaInputChange(fn.insert)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-mono border border-slate-700/60 transition-all"
                    >
                      {fn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Box */}
              <div
                className={`p-4 rounded-2xl border ${
                  formulaResult.isError
                    ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                    : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">Calculated Formula Result</span>
                    <span className="text-2xl font-black font-mono mt-0.5 block">
                      {typeof formulaResult.value === 'number'
                        ? `PKR ${formulaResult.value.toLocaleString()}`
                        : formulaResult.value}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {formulaResult.explanation}
                    </span>
                  </div>

                  {!formulaResult.isError && typeof formulaResult.value === 'number' && (
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(formulaResult.value.toString());
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      {onSelectAmount && (
                        <button
                          onClick={() => onSelectAmount(formulaResult.value as number)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Fill Value
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: CASH CHANGE RETURN CALCULATOR */}
          {activeTab === 'change' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-xs text-slate-300">
                <p className="font-semibold text-slate-200">تبادلہ اور واپسی پیسے کی حساب کتاب</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  کسٹمر سے ملے ہوئے رقم اور بل کے مطابق بقایا (چینج) معلوم کریں۔
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Cash Given by Customer (کسٹمر نے دیے)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">PKR</span>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex gap-1 pt-1">
                    {[500, 1000, 5000].map((quick) => (
                      <button
                        key={quick}
                        onClick={() => setCashGiven(quick.toString())}
                        className="flex-1 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono"
                      >
                        +{quick}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Bill / Transfer Amount (کل رقم/بل)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">PKR</span>
                    <input
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      placeholder="e.g. 3450"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex gap-1 pt-1">
                    {[100, 500, 1000].map((quick) => (
                      <button
                        key={quick}
                        onClick={() => setBillAmount((parseFloat(billAmount || '0') + quick).toString())}
                        className="flex-1 py-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-mono"
                      >
                        +{quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result display */}
              <div
                className={`p-4 rounded-2xl border ${
                  changeToReturn >= 0
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      {changeToReturn >= 0 ? 'Change to Return to Customer (بقایا واپس کریں)' : 'Shortage / Still Due from Customer (مزید رقم چاہئے)'}
                    </p>
                    <p className="text-2xl font-black font-mono mt-0.5">
                      PKR {Math.abs(changeToReturn).toLocaleString()}
                    </p>
                  </div>
                  {onSelectAmount && changeToReturn > 0 && (
                    <button
                      onClick={() => onSelectAmount(changeToReturn)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Use Amount
                    </button>
                  )}
                </div>

                {/* Recommended Cash Notes Breakdown */}
                {changeToReturn > 0 && changeBreakdown.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/20">
                    <p className="text-[11px] font-bold text-emerald-400 mb-1.5">
                      Suggested Note Exchange Breakdown (تجویز کردہ نوٹ):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {changeBreakdown.map((item, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1 bg-slate-900/80 border border-emerald-500/30 rounded-lg text-[11px] font-mono font-bold text-slate-200 flex items-center gap-1.5"
                        >
                          <span className="text-emerald-400">{item.count}x</span>
                          <span>PKR {item.note.toLocaleString()} Note</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: EASYPAISA & JAZZCASH WALLET FEE CALCULATOR */}
          {activeTab === 'fee' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-xs text-slate-300">
                <p className="font-semibold text-slate-200">ایزی پیسہ اور جاز کیش سروس چارجز کیلکولیٹر</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  رقم کے حساب سے آفیشل چارجز اور ٹوٹل حاصل کردہ رقم دیکھیں۔
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-300">
                  Transfer / Cash-Out Amount (رقم درج کریں)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">PKR</span>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-12 pr-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5">
                  {[1000, 2000, 5000, 10000, 15000, 25000, 50000].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setFeeAmount(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                        feeAmount === preset
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {preset >= 1000 ? `${preset / 1000}k` : preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fee breakdown output */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Principal Amount (اصل رقم):</span>
                  <span className="font-mono font-bold text-white">PKR {feeAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-emerald-400 font-medium">Estimated Fee / Service Charges (فیس):</span>
                  <span className="font-mono font-bold text-emerald-400">PKR {calculatedFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-xs text-slate-400 font-bold">Total Cash to Collect (ٹوٹل وصولی):</p>
                    <p className="text-xl font-black font-mono text-cyan-400">
                      PKR {totalWithFee.toLocaleString()}
                    </p>
                  </div>
                  {onSelectAmount && (
                    <button
                      onClick={() => onSelectAmount(totalWithFee)}
                      className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Fill Total
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STANDARD QUICK KEYPAD */}
          {activeTab === 'standard' && (
            <div className="space-y-3">
              {/* Display */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="overflow-x-auto">
                  {prevVal !== null && (
                    <p className="text-xs text-slate-500 font-mono">
                      {prevVal} {operation}
                    </p>
                  )}
                  <p className="text-2xl font-black font-mono text-cyan-400 tracking-tight">
                    {calcDisplay}
                  </p>
                </div>
                <button
                  onClick={handleCopyDisplay}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all flex items-center gap-1 text-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-4 gap-2 font-mono font-bold">
                <button
                  onClick={handleClear}
                  className="p-3 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl hover:bg-rose-500/30 text-sm"
                >
                  C
                </button>
                <button
                  onClick={() => setCalcDisplay(calcDisplay.length > 1 ? calcDisplay.slice(0, -1) : '0')}
                  className="p-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-sm"
                >
                  ⌫
                </button>
                <button
                  onClick={() => handleOp('÷')}
                  className="p-3 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 text-sm"
                >
                  ÷
                </button>
                <button
                  onClick={() => handleOp('×')}
                  className="p-3 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 text-sm"
                >
                  ×
                </button>

                {['7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleDigit(num)}
                    className="p-3.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-base"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleOp('-')}
                  className="p-3.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 text-sm"
                >
                  -
                </button>

                {['4', '5', '6'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleDigit(num)}
                    className="p-3.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-base"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleOp('+')}
                  className="p-3.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/30 text-sm"
                >
                  +
                </button>

                {['1', '2', '3'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleDigit(num)}
                    className="p-3.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-base"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handleEqual}
                  className="row-span-2 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-lg font-black flex items-center justify-center shadow-lg"
                >
                  =
                </button>

                <button
                  onClick={() => handleDigit('0')}
                  className="p-3.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-base"
                >
                  0
                </button>
                <button
                  onClick={() => handleDigit('00')}
                  className="p-3.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-base"
                >
                  00
                </button>
                <button
                  onClick={() => handleDigit('.')}
                  className="p-3.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-base"
                >
                  .
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-amber-400 font-serif">
          Returned from something (خریدی ہوئی چیز کی واپسی نہیں) • Galaxy Mobile Dhanola
        </div>
      </div>
    </div>
  );
};
