import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SHOP_INFO } from '../data/mockData';
import {
  Printer,
  Download,
  Share2,
  X,
  CheckCircle,
  Smartphone,
  MapPin,
  Phone,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { selectedInvoiceForModal, setSelectedInvoiceForModal } = useApp();
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!selectedInvoiceForModal) return null;

  const invoice = selectedInvoiceForModal;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `Invoice #${invoice.invoiceNumber} from Galaxy Mobile Shop\nTotal Amount: PKR ${(invoice?.total ?? 0).toLocaleString()}\nPayment: ${invoice.paymentMethod}\nThank you for shopping with us!`;
    const url = `https://wa.me/${invoice.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
        {/* Top Control Bar */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Invoice Receipt Generated</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              title="Send to WhatsApp"
            >
              <Share2 className="w-4 h-4" /> WhatsApp
            </button>
            <button
              onClick={() => setSelectedInvoiceForModal(null)}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Thermal / A4 Container */}
        <div className="p-6 sm:p-8 bg-slate-950 text-slate-100 font-sans" ref={invoiceRef}>
          {/* Shop Header */}
          <div className="text-center space-y-1 pb-4 border-b border-dashed border-slate-800">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-1">
              <Smartphone className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase">
              {SHOP_INFO.name}
            </h2>
            <p className="text-sm font-semibold text-cyan-400 font-serif">
              {SHOP_INFO.urduName}
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-tight">
              {SHOP_INFO.address}, {SHOP_INFO.city}, Pakistan
            </p>
            <p className="text-[10px] font-mono text-emerald-400 pt-1">
              Phones: {SHOP_INFO.phones.join(' • ')}
            </p>
          </div>

          {/* Meta Details Grid */}
          <div className="grid grid-cols-2 gap-3 py-4 text-xs border-b border-dashed border-slate-800">
            <div>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">Invoice No</p>
              <p className="font-mono font-bold text-cyan-400 text-sm">{invoice.invoiceNumber}</p>
              <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(invoice.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">Customer Details</p>
              <p className="font-semibold text-slate-200">{invoice.customerName}</p>
              <p className="text-slate-400 text-[11px] font-mono">{invoice.customerPhone}</p>
              <p className="text-[10px] text-emerald-400 font-medium mt-1">
                Cashier: {invoice.cashierName}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-4 border-b border-dashed border-slate-800">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase border-b border-slate-800 pb-1">
                  <th className="py-1">Item Description</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Price</th>
                  <th className="py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-300">
                    <td className="py-2 pr-2">
                      <p className="font-sans font-medium text-slate-200 text-xs">{item.name}</p>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-slate-500">[{item.brand}]</span>
                        <span className="text-amber-400 font-medium font-serif">Returned from something (خریدی ہوئی چیز کی واپسی نہیں)</span>
                      </div>
                    </td>
                    <td className="py-2 text-center text-slate-400">{item.qty}</td>
                    <td className="py-2 text-right text-slate-400">{item.unitPrice}</td>
                    <td className="py-2 text-right font-bold text-emerald-400">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="py-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400 font-mono">
              <span>Subtotal:</span>
              <span>PKR {(invoice?.subtotal ?? 0).toLocaleString()}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-rose-400 font-mono">
                <span>Discount:</span>
                <span>- PKR {(invoice?.discount ?? 0).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800 font-mono">
              <span>Grand Total:</span>
              <span className="text-emerald-400">PKR {(invoice?.total ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] pt-1">
              <span className="text-slate-500">Payment Channel:</span>
              <span className="px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase text-[10px]">
                {invoice.paymentMethod} ({invoice.paymentStatus})
              </span>
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-4 border-t border-dashed border-slate-800 text-center text-[11px] text-slate-400 space-y-1.5">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-center">
              <p className="font-bold text-amber-300 text-xs">Returned from something</p>
              <p className="font-serif text-amber-400 text-xs font-bold">نوٹ: خریدی ہوئی چیز کی واپسی نہیںے۔</p>
              <p className="font-serif text-slate-300 text-[11px]">موبائل وارنٹی کمپنی کی ہے ہماری نہیں۔</p>
            </div>
            <p className="text-[10px] text-amber-400/90 font-serif font-semibold">
              نوٹ: خریدی ہوئی چیز کی واپسی یا تبدیلی نہیں ہو گی۔ (Goods once sold cannot be returned or exchanged)
            </p>
            <div className="pt-1 text-[10px] font-mono text-cyan-400">
              *** Thank You for Shopping at Galaxy Mobile ***
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
