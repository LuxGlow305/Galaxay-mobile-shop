import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Receipt, Search, Calendar, Printer, Eye, DollarSign, User } from 'lucide-react';

export const InvoicesView: React.FC = () => {
  const { sales, setSelectedInvoiceForModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('All');

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        s.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customerPhone.includes(searchTerm);

      const matchesMethod = selectedMethod === 'All' || s.paymentMethod === selectedMethod;
      return matchesSearch && matchesMethod;
    });
  }, [sales, searchTerm, selectedMethod]);

  const totalSalesSum = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + s.total, 0);
  }, [filteredSales]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Sales & Invoice History</h2>
          </div>
          <p className="text-xs text-slate-400">
            Complete transaction log with instant receipt re-printing & WhatsApp receipt sharing.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-2xl text-right">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Filtered Sales</span>
          <span className="font-mono font-black text-emerald-400 text-lg">
            PKR {totalSalesSum.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Invoice # (e.g. INV-2026-001), Customer Name or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {['All', 'Cash', 'EasyPaisa', 'JazzCash', 'HBL Konnect', 'Udhar / Credit'].map((pm) => (
            <button
              key={pm}
              onClick={() => setSelectedMethod(pm)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                selectedMethod === pm
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Directory Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Date & Cashier</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 text-right">Items Count</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-800/40 text-slate-200 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-400 text-sm">
                    {sale.invoiceNumber}
                  </td>

                  <td className="p-4">
                    <p className="font-semibold text-slate-100 text-xs">{sale.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{sale.customerPhone}</p>
                  </td>

                  <td className="p-4 text-slate-400 text-[11px]">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">By {sale.cashierName}</p>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {sale.paymentMethod}
                    </span>
                  </td>

                  <td className="p-4 text-right font-mono text-slate-300">
                    {sale.items.length} items
                  </td>

                  <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                    PKR {(sale.total ?? 0).toLocaleString()}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedInvoiceForModal(sale)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors font-semibold flex items-center gap-1 mx-auto cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
