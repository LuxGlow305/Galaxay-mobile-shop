import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SHOP_INFO } from '../data/mockData';
import { Printer, X, CreditCard, ShieldCheck } from 'lucide-react';

export const LoanStatementModal: React.FC = () => {
  const { selectedLoanForModal, setSelectedLoanForModal } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!selectedLoanForModal) return null;

  const loan = selectedLoanForModal;
  const totalPaid = loan.installments.reduce((s, i) => s + i.amountPaid, 0);
  const remainingBalance = Math.max(0, loan.totalRepayableAmount - totalPaid);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Loan & Installment Agreement Card
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-purple-500/20"
            >
              <Printer className="w-3.5 h-3.5" /> Print Loan Card
            </button>
            <button
              onClick={() => setSelectedLoanForModal(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Body */}
        <div ref={printRef} className="p-6 bg-white text-slate-900 font-sans space-y-4 print:p-2 print:m-0">
          {/* Shop Header */}
          <div className="text-center border-b pb-3 border-slate-200">
            <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
              {SHOP_INFO.name}
            </h2>
            <p className="text-sm font-bold text-emerald-800 font-urdu">{SHOP_INFO.urduName}</p>
            <p className="text-[11px] text-slate-600 font-medium mt-0.5">{SHOP_INFO.address}</p>
            <p className="text-[10px] font-mono text-slate-500">Ph: {SHOP_INFO.phones.join(' / ')}</p>
          </div>

          {/* Account Box */}
          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Loan Account #</span>
              <span className="font-mono text-base font-black text-slate-900">{loan.loanNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Start Date</span>
              <span className="font-mono text-xs font-bold text-slate-700">{loan.startDate}</span>
            </div>
          </div>

          {/* Customer & Guarantor Details */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-500 font-medium">Borrower Name:</span>
              <span className="font-bold text-slate-900">{loan.customerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-500 font-medium">CNIC:</span>
              <span className="font-mono font-bold text-slate-900">{loan.customerCnic}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-500 font-medium">Financed Item:</span>
              <span className="font-bold text-purple-900">{loan.itemPurchased}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-500 font-medium">Guarantor Reference:</span>
              <span className="font-bold text-slate-800">
                {loan.guarantorName} ({loan.guarantorPhone})
              </span>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Total Item Price:</span>
              <span>PKR {(loan?.totalItemPrice ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Down Payment Paid:</span>
              <span>- PKR {(loan?.downPayment ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Markup Rate ({loan?.markupPercentage ?? 0}%):</span>
              <span>+ PKR {(((loan?.loanPrincipalAmount ?? 0) * (loan?.markupPercentage ?? 0)) / 100).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 border-t pt-1 border-slate-200">
              <span>Total Repayable Amount:</span>
              <span>PKR {(loan?.totalRepayableAmount ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-black text-emerald-800 text-sm pt-1">
              <span>Remaining Balance:</span>
              <span>PKR {(remainingBalance ?? 0).toLocaleString()}</span>
            </div>
          </div>

          {/* EMI Schedule Grid */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">
              Installment Schedule ({loan.tenureMonths} Months)
            </span>

            <table className="w-full text-left text-[11px] font-mono border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-600 font-bold">
                  <th className="border border-slate-200 p-1.5">No</th>
                  <th className="border border-slate-200 p-1.5">Due Date</th>
                  <th className="border border-slate-200 p-1.5">Amount</th>
                  <th className="border border-slate-200 p-1.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {loan.installments.map((inst) => (
                  <tr key={inst.installmentNo}>
                    <td className="border border-slate-200 p-1.5">#{inst.installmentNo}</td>
                    <td className="border border-slate-200 p-1.5">{inst.dueDate}</td>
                    <td className="border border-slate-200 p-1.5">PKR {(inst?.amountDue ?? 0).toLocaleString()}</td>
                    <td className="border border-slate-200 p-1.5 text-right font-bold">
                      {inst.status === 'Paid' ? (
                        <span className="text-emerald-700">PAID</span>
                      ) : (
                        <span className="text-amber-700">PENDING</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Return Policy */}
          <div className="pt-4 space-y-3">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl space-y-0.5 text-center text-[10px]">
              <p className="font-bold text-amber-800 text-xs">Returned from something</p>
              <p className="font-serif text-amber-900 text-xs font-bold">نوٹ: خریدی ہوئی چیز کی واپسی نہیںے۔</p>
              <p className="font-serif text-slate-700 text-[10px]">موبائل وارنٹی کمپنی کی ہے ہماری نہیں۔</p>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 pt-2">
              <div className="border-t border-slate-300 pt-1 w-24 text-center">Borrower Sign</div>
              <div className="border-t border-slate-300 pt-1 w-24 text-center">Guarantor Sign</div>
              <div className="border-t border-slate-300 pt-1 w-24 text-center">Shop Stamp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
