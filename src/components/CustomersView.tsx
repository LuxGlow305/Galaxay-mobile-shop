import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import {
  Users,
  Search,
  UserPlus,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Notebook,
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, updateCustomer, settleCustomerBalance, sales, setSelectedInvoiceForModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustForLedger, setSelectedCustForLedger] = useState<Customer | null>(null);

  // Settlement Form State
  const [settleAmount, setSettleAmount] = useState<number>(0);

  // New Customer State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Chak 117 JB Dhanola, Faisalabad');
  const [notes, setNotes] = useState('');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalUdharAll = customers.reduce((acc, c) => acc + c.balanceDue, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addCustomer({
      name,
      phone,
      email,
      address,
      balanceDue: 0,
      notes,
    });

    setName('');
    setPhone('');
    setEmail('');
    setAddress('Chak 117 JB Dhanola, Faisalabad');
    setNotes('');
    setShowAddModal(false);
  };

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustForLedger || settleAmount <= 0) return;

    settleCustomerBalance(selectedCustForLedger.id, settleAmount);
    setSelectedCustForLedger(null);
    setSettleAmount(0);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Customer Directory & Udhar Ledger</h2>
          </div>
          <p className="text-xs text-slate-400">
            Track customer purchase history, contact records & outstanding credit balances.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl text-right">
            <span className="text-[10px] uppercase font-semibold text-amber-400 block">Total Udhar Balance</span>
            <span className="font-mono font-black text-amber-300 text-base">
              PKR {(totalUdharAll ?? 0).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 text-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add New Customer
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, phone number or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => {
          const custSales = sales.filter((s) => s.customerId === cust.id);

          return (
            <div
              key={cust.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-colors space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-white">{cust.name}</h3>
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      {cust.phone}
                    </p>
                  </div>
                  {cust.balanceDue > 0 ? (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                      Udhar: PKR {(cust.balanceDue ?? 0).toLocaleString()}
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
                      Clear Account
                    </span>
                  )}
                </div>

                {cust.address && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{cust.address}</span>
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Total Spent</span>
                    <span className="font-mono font-bold text-emerald-400">
                      PKR {(cust.totalSpent ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Orders Placed</span>
                    <span className="font-mono font-bold text-slate-200">
                      {cust.totalPurchases} Purchases
                    </span>
                  </div>
                </div>

                {cust.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-800/40 p-2 rounded-xl mt-2">
                    "{cust.notes}"
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedCustForLedger(cust);
                    setSettleAmount(cust.balanceDue);
                  }}
                  disabled={cust.balanceDue <= 0}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                    cust.balanceDue > 0
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Settle Udhar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">Add Customer Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chaudhry Aslam"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0300-1234567"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Village</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Preferences</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Buys Ronin fast chargers regularly"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settle Balance Modal */}
      {selectedCustForLedger && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Record Udhar Payment</h3>
              <button
                onClick={() => setSelectedCustForLedger(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-white text-sm">{selectedCustForLedger.name}</p>
              <p className="text-slate-400 font-mono">{selectedCustForLedger.phone}</p>
              <p className="text-amber-400 font-mono font-bold text-xs pt-1">
                Current Udhar Balance: PKR {(selectedCustForLedger?.balanceDue ?? 0).toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Received (PKR)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedCustForLedger.balanceDue}
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-emerald-400 font-bold font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustForLedger(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                >
                  Confirm Payment Received
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
