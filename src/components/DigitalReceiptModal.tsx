import React from 'react';
import { useApp } from '../context/AppContext';
import { SHOP_INFO } from '../data/mockData';
import { Printer, CheckCircle2, ShieldCheck, Download, X, Copy, Zap, Wallet, Smartphone, Receipt } from 'lucide-react';

export const DigitalReceiptModal: React.FC = () => {
  const { selectedDigitalTrxForModal, setSelectedDigitalTrxForModal } = useApp();

  if (!selectedDigitalTrxForModal) return null;

  const trx = selectedDigitalTrxForModal;
  const isNadra = trx.serviceType === 'NADRA e-Sahulat & Biometric' || !!trx.nadraDetails;
  const isMobileLoad = trx.serviceType === 'Mobile EasyLoad & Network Cards' || !!trx.mobileLoadDetails;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    let text = `GALAXY MOBILE DIGITAL RECEIPT
Trx ID: ${trx.trxId}
Service: ${trx.type}
Customer: ${trx.senderName} (${trx.senderPhone})
Amount: PKR ${(trx?.amount ?? 0).toLocaleString()}
Service Fee: PKR {trx.feeCommission}
Total: PKR ${(trx?.totalCollected ?? 0).toLocaleString()}
Agent: ${trx.agentName}
Shop Location: ${SHOP_INFO.address}, ${SHOP_INFO.city}
Date: ${new Date(trx.createdAt).toLocaleString()}`;

    if (trx.nadraDetails) {
      text = `NADRA e-Sahulat RECEIPT
Biometric Verification: ${trx.nadraDetails.serviceCategory}
Name: ${trx.nadraDetails.citizenUrduName || trx.senderName}
CNIC: ${trx.nadraDetails.cnic}
Status: ${trx.nadraDetails.verificationStatus}
Tracking ID: ${trx.nadraDetails.trackingId}
eSahulat ID: ${trx.nadraDetails.eSahulatId}
Service Charges: PKR ${trx.nadraDetails.serviceCharges}
Issue Date: ${trx.nadraDetails.issueDate} ${trx.nadraDetails.issueTime}
Help Line: ${trx.nadraDetails.helpLine}`;
    }

    navigator.clipboard.writeText(text);
    alert('Receipt copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 p-4 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="font-bold text-xs text-white uppercase tracking-wider">
              {isNadra
                ? 'Official NADRA e-Sahulat Slip'
                : isMobileLoad
                ? 'Mobile Load & Recharge Receipt'
                : 'Official Digital Transaction Receipt'}
            </span>
          </div>

          <button
            onClick={() => setSelectedDigitalTrxForModal(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RECEIPT CONTENT BODY */}
        {isNadra ? (
          /* NADRA e-Sahulat Authentic Verification Slip (Matching Uploaded Image) */
          <div id="digital-receipt-print" className="p-6 bg-white text-slate-900 font-sans space-y-4 print:p-2">
            {/* Header Logos */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-300">
              {/* Left Logo - NADRA PAKISTAN */}
              <div className="text-left">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-800 flex items-center justify-center font-black text-emerald-800 text-[10px] p-0.5 leading-none text-center">
                  NADRA
                </div>
                <span className="text-[9px] font-black uppercase text-slate-700 tracking-tighter block mt-0.5">
                  NADRA PAKISTAN
                </span>
              </div>

              {/* Center Title */}
              <div className="text-center">
                <h2 className="text-base font-serif font-black uppercase tracking-widest text-slate-900">
                  RECEIPT
                </h2>
              </div>

              {/* Right Logo - e-Sahulat */}
              <div className="text-right">
                <div className="inline-flex items-center gap-1 bg-emerald-700 text-white font-bold text-[10px] px-2 py-0.5 rounded-md">
                  <span className="font-mono">e</span>
                  <span className="font-urdu">ایسہولت</span>
                </div>
                <p className="text-[8px] font-mono text-slate-500 mt-0.5">e-Sahulat Verified</p>
              </div>
            </div>

            {/* Main Biometric Title */}
            <div className="text-center space-y-0.5 py-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Biometric Verification
              </h3>
              <p className="text-sm font-extrabold uppercase text-slate-800">
                {trx.nadraDetails?.serviceCategory || 'ETD, PUNJAB'}
              </p>
              {trx.nadraDetails?.citizenUrduName && (
                <p className="text-base font-extrabold text-slate-900 font-urdu pt-1">
                  نام: {trx.nadraDetails.citizenUrduName}
                </p>
              )}
            </div>

            {/* Verification Details Table */}
            <div className="border border-slate-300 rounded-xl p-3 font-mono text-xs space-y-1.5 bg-slate-50/80">
              <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-1">
                <span className="text-slate-600 font-sans font-medium">CNIC:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {trx.nadraDetails?.cnic || trx.cnic || '3740579946117'}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-1">
                <span className="text-slate-600 font-sans font-medium">Verification Status:</span>
                <span className="font-black text-emerald-700 text-sm uppercase">
                  {trx.nadraDetails?.verificationStatus || 'Verified'}
                </span>
              </div>

              {trx.nadraDetails?.chassisNo && (
                <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-1">
                  <span className="text-slate-600 font-sans font-medium">Chassis No / Reg:</span>
                  <span className="font-bold text-slate-900">{trx.nadraDetails.chassisNo}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-1">
                <span className="text-slate-600 font-sans font-medium">Tracking Id:</span>
                <span className="font-bold text-slate-900">
                  {trx.nadraDetails?.trackingId || '102592780'}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-1">
                <span className="text-slate-600 font-sans font-medium">Date:</span>
                <span>{trx.nadraDetails?.issueDate || '01-07-2026'}</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-1">
                <span className="text-slate-600 font-sans font-medium">Time:</span>
                <span>{trx.nadraDetails?.issueTime || '11:45:41'}</span>
              </div>

              <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-1">
                <span className="text-slate-600 font-sans font-medium">Service Charges:</span>
                <span className="font-bold text-slate-900">
                  {trx.nadraDetails?.serviceCharges || trx.amount || 120}
                </span>
              </div>

              <div className="flex justify-between items-baseline border-b border-dashed border-slate-200 pb-1">
                <span className="text-slate-600 font-sans font-medium">eSahulat ID:</span>
                <span className="font-bold text-slate-900">
                  {trx.nadraDetails?.eSahulatId || '43262'}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-slate-600 font-sans font-medium">Issue Date:</span>
                <span>{trx.nadraDetails?.issueDate || '01-07-2026'}</span>
              </div>
            </div>

            {/* Barcode Block */}
            <div className="pt-2 text-center space-y-1">
              <div className="bg-slate-900 h-10 w-full rounded flex items-center justify-around px-2 py-1">
                {/* Simulated Barcode vertical bars */}
                {Array.from({ length: 38 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-white h-full ${
                      i % 3 === 0 ? 'w-1.5' : i % 2 === 0 ? 'w-0.5' : 'w-1'
                    }`}
                  />
                ))}
              </div>
              <p className="font-mono text-xs font-bold tracking-widest text-slate-900">
                {trx.nadraDetails?.barcodeNumber || '4326226070111445601'}
              </p>
            </div>

            {/* Helpline Footer */}
            <div className="border-t border-slate-300 pt-2 text-center text-xs font-semibold text-slate-700 font-mono">
              Help Line : {trx.nadraDetails?.helpLine || '051-2772100'}
            </div>

            {/* Shop Agent Stamp Verification */}
            <div className="text-center pt-2 text-[10px] text-slate-500 border-t border-dashed border-slate-200">
              Issued at Agent Counter: {SHOP_INFO.name} ({SHOP_INFO.phones[0]})
            </div>
          </div>
        ) : (
          /* Standard / Mobile Load Receipt */
          <div id="digital-receipt-print" className="p-6 space-y-5 text-slate-200">
            {/* Shop Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-700">
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="font-black text-lg text-white uppercase tracking-tight">
                  {SHOP_INFO.name}
                </span>
              </div>
              <p className="text-[11px] text-emerald-400 font-urdu">{SHOP_INFO.urduName}</p>
              <p className="text-[10px] text-slate-400 mt-1">{SHOP_INFO.address}</p>
              <p className="text-[10px] text-slate-400">Phone: {SHOP_INFO.phones.join(' / ')}</p>
            </div>

            {/* Transaction Stamp Badge */}
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> RECHARGE / TRX SUCCESSFUL
              </div>

              <div className="text-2xl font-black text-white font-mono mt-1">
                {trx.trxId}
              </div>

              <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">
                {trx.type}
              </p>
            </div>

            {/* Details Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Customer Name:</span>
                <span className="font-bold text-white">{trx.senderName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Mobile Number:</span>
                <span className="font-mono font-bold text-cyan-300 text-sm">{trx.senderPhone}</span>
              </div>

              {/* Mobile Load Details */}
              {trx.mobileLoadDetails && (
                <div className="bg-slate-950/80 border border-cyan-500/30 rounded-xl p-3 my-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">Network Operator:</span>
                    <span className="font-black text-cyan-400 text-xs uppercase">
                      {trx.mobileLoadDetails.networkOperator}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">Load / Card Type:</span>
                    <span className="text-slate-200 font-bold text-[11px]">{trx.mobileLoadDetails.loadType}</span>
                  </div>
                  {trx.mobileLoadDetails.bundleName && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10px]">Active Package:</span>
                      <span className="text-emerald-400 font-bold text-[11px]">{trx.mobileLoadDetails.bundleName}</span>
                    </div>
                  )}
                  {trx.mobileLoadDetails.scratchCardPin && (
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400 text-[10px]">Card Pin Code:</span>
                      <span className="font-mono text-amber-300 font-black text-xs">{trx.mobileLoadDetails.scratchCardPin}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Bill Details Block */}
              {trx.billDetails && (
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 my-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">Utility Company:</span>
                    <span className="font-bold text-cyan-400 text-[11px]">{trx.billDetails.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">Consumer Reference No:</span>
                    <span className="font-mono font-bold text-white text-[11px]">{trx.billDetails.consumerNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">Billing Month:</span>
                    <span className="text-slate-300 text-[10px]">{trx.billDetails.billingMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-[10px]">Due Date:</span>
                    <span className="text-amber-400 text-[10px]">{trx.billDetails.dueDate}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Recharge / Amount:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  PKR {(trx?.amount ?? 0).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Shop Service Fee:</span>
                <span className="font-mono text-cyan-300">PKR {trx.feeCommission}</span>
              </div>

              <div className="flex justify-between py-2 border-t border-slate-700 text-sm font-black text-white">
                <span>Total Cash Collected:</span>
                <span className="font-mono text-emerald-400">PKR {(trx?.totalCollected ?? 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="pt-2 text-center text-[10px] text-slate-500 space-y-1 border-t border-dashed border-slate-800">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-0.5 text-center my-1">
                <p className="font-bold text-amber-300 text-xs">Returned from something</p>
                <p className="font-serif text-amber-400 text-xs font-bold">نوٹ: خریدی ہوئی چیز کی واپسی نہیںے۔</p>
                <p className="font-serif text-slate-300 text-[10px]">موبائل وارنٹی کمپنی کی ہے ہماری نہیں۔</p>
              </div>
              <p>Agent Operator: {trx.agentName} | Station: Counter 1</p>
              <p>Date & Time: {new Date(trx.createdAt).toLocaleString()}</p>
              <p className="font-bold text-slate-400 mt-1">
                Official Agent Stamp Verified • Galaxy Mobile & EasyLoad Center
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2 print:hidden">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Details
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print Thermal Slip
          </button>
        </div>
      </div>
    </div>
  );
};
