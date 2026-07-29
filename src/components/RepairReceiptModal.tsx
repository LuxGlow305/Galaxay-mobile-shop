import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SHOP_INFO } from '../data/mockData';
import { Printer, X, Wrench, ShieldCheck, PhoneCall, Calendar } from 'lucide-react';

export const RepairReceiptModal: React.FC = () => {
  const { selectedRepairTicketForModal, setSelectedRepairTicketForModal } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  if (!selectedRepairTicketForModal) return null;

  const ticket = selectedRepairTicketForModal;
  const remainingBalance = Math.max(0, ticket.estimatedCost - ticket.advancePaid);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
        {/* Modal Action Header */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Repair Job Sheet Slip / Claim Card
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Printer className="w-3.5 h-3.5" /> Print Job Slip
            </button>
            <button
              onClick={() => setSelectedRepairTicketForModal(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
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

          {/* Ticket Header & Claim Code */}
          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Job Ticket Number
              </span>
              <span className="font-mono text-base font-black text-slate-900">{ticket.ticketNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Date Received</span>
              <span className="font-mono text-xs font-bold text-slate-700">
                {new Date(ticket.receivedDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Customer & Device Information */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-500 font-medium">Customer Name:</span>
              <span className="font-bold text-slate-900">{ticket.customerName}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-500 font-medium">Contact Phone:</span>
              <span className="font-bold font-mono text-slate-900">{ticket.customerPhone}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-500 font-medium">Device Model:</span>
              <span className="font-bold text-slate-900">
                {ticket.deviceBrand} {ticket.deviceModel}
              </span>
            </div>

            {ticket.imeiOrSerial && (
              <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
                <span className="text-slate-500 font-medium">IMEI / Serial:</span>
                <span className="font-mono text-slate-800">{ticket.imeiOrSerial}</span>
              </div>
            )}

            <div className="flex justify-between py-1 border-b border-dashed border-slate-200">
              <span className="text-slate-500 font-medium">Repair Category:</span>
              <span className="font-bold text-cyan-800">{ticket.category}</span>
            </div>

            <div className="py-1">
              <span className="text-slate-500 font-medium block">Reported Fault:</span>
              <p className="font-semibold text-slate-900 bg-slate-50 p-2 rounded border border-slate-200 mt-0.5">
                {ticket.faultDescription}
              </p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Estimated Repair Charges:</span>
              <span className="font-bold text-slate-900">PKR {(ticket?.estimatedCost ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Advance Paid at Counter:</span>
              <span className="font-bold">- PKR {(ticket?.advancePaid ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-300">
              <span>Payable at Delivery:</span>
              <span className="text-emerald-800">PKR {(remainingBalance ?? 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Warranty & Terms */}
          <div className="text-[10px] text-slate-500 space-y-1 border-t pt-2 border-slate-200">
            <p className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> {ticket.warrantyDays} Days Repair Warranty Included
            </p>
            <p className="text-[9px] text-slate-400 leading-tight">
              * Please present this physical claim ticket when collecting device. Repairs carry {ticket.warrantyDays} days warranty for tested component only. Water damage/physical drop post-repair voids warranty.
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 flex justify-between text-[10px] text-slate-500">
            <div className="border-t border-slate-300 pt-1 w-28 text-center">Customer Sign</div>
            <div className="border-t border-slate-300 pt-1 w-28 text-center">Counter Stamp</div>
          </div>
        </div>
      </div>
    </div>
  );
};
