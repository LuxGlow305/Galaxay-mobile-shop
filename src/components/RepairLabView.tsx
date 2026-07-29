import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RepairCategory, RepairStatus, RepairTicket } from '../types';
import {
  Wrench,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Smartphone,
  Printer,
  ChevronRight,
  UserCheck,
  Shield,
  FileText,
  DollarSign,
  Cpu,
  Sparkles,
  Calendar,
  Layers,
  Send,
  Lock,
} from 'lucide-react';

export const RepairLabView: React.FC = () => {
  const {
    repairTickets,
    addRepairTicket,
    updateRepairStatus,
    addRepairLogNote,
    setSelectedRepairTicketForModal,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | RepairStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<RepairTicket | null>(null);

  // New Repair Job Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deviceBrand, setDeviceBrand] = useState('Samsung');
  const [deviceModel, setDeviceModel] = useState('');
  const [imeiOrSerial, setImeiOrSerial] = useState('');
  const [faultDescription, setFaultDescription] = useState('');
  const [category, setCategory] = useState<RepairCategory>('Screen / Display Replacement');
  const [estimatedCost, setEstimatedCost] = useState<number | ''>('');
  const [advancePaid, setAdvancePaid] = useState<number | ''>(0);
  const [sparePartsCost, setSparePartsCost] = useState<number | ''>('');
  const [technicianName, setTechnicianName] = useState('Muhammad Sajid (Master Tech)');
  const [warrantyDays, setWarrantyDays] = useState<number>(30);
  const [passcodePattern, setPasscodePattern] = useState('');
  const [notes, setNotes] = useState('');

  // Log note entry for detail drawer
  const [newLogNote, setNewLogNote] = useState('');

  const filteredTickets = useMemo(() => {
    return repairTickets.filter((t) => {
      const matchesTab = activeTab === 'All' || t.status === activeTab;
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        t.ticketNumber.toLowerCase().includes(term) ||
        t.customerName.toLowerCase().includes(term) ||
        t.customerPhone.includes(term) ||
        t.deviceBrand.toLowerCase().includes(term) ||
        t.deviceModel.toLowerCase().includes(term) ||
        (t.imeiOrSerial && t.imeiOrSerial.includes(term));

      return matchesTab && matchesSearch;
    });
  }, [repairTickets, activeTab, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = repairTickets.length;
    const pending = repairTickets.filter((t) => t.status === 'Received' || t.status === 'Diagnosing' || t.status === 'In Repair').length;
    const ready = repairTickets.filter((t) => t.status === 'Ready for Pickup').length;
    const delivered = repairTickets.filter((t) => t.status === 'Delivered').length;
    const totalRevenue = repairTickets
      .filter((t) => t.status === 'Delivered')
      .reduce((acc, curr) => acc + curr.estimatedCost, 0);

    return { total, pending, ready, delivered, totalRevenue };
  }, [repairTickets]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deviceModel || !faultDescription || !estimatedCost) return;

    addRepairTicket({
      customerName,
      customerPhone,
      deviceBrand,
      deviceModel,
      imeiOrSerial,
      faultDescription,
      category,
      estimatedCost: Number(estimatedCost),
      advancePaid: Number(advancePaid) || 0,
      sparePartsCost: Number(sparePartsCost) || 0,
      technicianName,
      status: 'Received',
      warrantyDays,
      passcodePattern,
      notes,
    });

    // Reset Form
    setCustomerName('');
    setCustomerPhone('');
    setDeviceModel('');
    setImeiOrSerial('');
    setFaultDescription('');
    setEstimatedCost('');
    setAdvancePaid(0);
    setSparePartsCost('');
    setPasscodePattern('');
    setNotes('');
    setShowCreateModal(false);
  };

  const handleAddNoteToDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketForDetail || !newLogNote.trim()) return;
    addRepairLogNote(selectedTicketForDetail.id, newLogNote.trim());

    // Update local state to reflect instantly
    setSelectedTicketForDetail((prev) =>
      prev
        ? {
            ...prev,
            repairLogs: [
              ...prev.repairLogs,
              {
                timestamp: new Date().toISOString(),
                note: newLogNote.trim(),
                performedBy: currentUser.name,
              },
            ],
          }
        : null
    );
    setNewLogNote('');
  };

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'Received':
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Received</span>;
      case 'Diagnosing':
        return <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">Diagnosing</span>;
      case 'Waiting Parts':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Waiting Parts</span>;
      case 'In Repair':
        return <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">In Repair</span>;
      case 'Ready for Pickup':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Ready for Pickup</span>;
      case 'Delivered':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Delivered</span>;
      default:
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border border-cyan-800/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Hardware & Software Repair Lab
            </span>
            <span className="text-xs text-slate-400 font-urdu">موبائل ریپئرنگ اینڈ ورکشاپ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Mobile Repair Schemes & Work Orders
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Track intake job tickets, diagnostic progress, parts usage, technician logs & customer warranty slips for all Android & iPhone repairs.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all cursor-pointer text-xs sm:text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> New Repair Job Sheet
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold uppercase tracking-wider">
            <span>In-Progress Jobs</span>
            <Wrench className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">{stats.pending}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Under technician diagnosis</p>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span>Ready for Pickup</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-2">{stats.ready}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Repaired & SMS alert ready</p>
        </div>

        <div className="bg-slate-900/90 border border-blue-500/30 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-blue-400 font-bold uppercase tracking-wider">
            <span>Total Delivered</span>
            <Smartphone className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-white font-mono mt-2">{stats.delivered}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Completed repair orders</p>
        </div>

        <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold uppercase tracking-wider">
            <span>Lab Service Revenue</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-purple-300 font-mono mt-2">
            PKR {(stats?.totalRevenue ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">From delivered devices</p>
        </div>
      </div>

      {/* Main Table & Filter Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Filter Bar & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {(['All', 'Received', 'In Repair', 'Waiting Parts', 'Ready for Pickup', 'Delivered'] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Ticket #, Name, Phone, IMEI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Repair Job Tickets Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Ticket #</th>
                <th className="p-3">Device & Fault</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Est. Cost / Advance</th>
                <th className="p-3">Technician</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-500">
                    No repair job tickets match your search.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <span className="font-mono font-bold text-white block">{ticket.ticketNumber}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {new Date(ticket.receivedDate).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="p-3">
                      <p className="font-bold text-slate-100">
                        {ticket.deviceBrand} {ticket.deviceModel}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{ticket.faultDescription}</p>
                      <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {ticket.category}
                      </span>
                    </td>

                    <td className="p-3">
                      <p className="font-bold text-slate-200">{ticket.customerName}</p>
                      <p className="font-mono text-[11px] text-slate-400">{ticket.customerPhone}</p>
                    </td>

                    <td className="p-3 font-mono">
                      <div className="font-bold text-emerald-400">PKR {(ticket.estimatedCost ?? 0).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400">
                        Adv: PKR {(ticket.advancePaid ?? 0).toLocaleString()}
                      </div>
                    </td>

                    <td className="p-3 text-slate-300 text-[11px]">
                      {ticket.technicianName}
                    </td>

                    <td className="p-3">{getStatusBadge(ticket.status)}</td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTicketForDetail(ticket)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Logs
                        </button>

                        <button
                          onClick={() => setSelectedRepairTicketForModal(ticket)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Print Job Slip / Warranty Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Job Sheet Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" /> New Mobile Repair Job Ticket
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Arslan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Mobile *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0302-7654321"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Device Brand</label>
                  <select
                    value={deviceBrand}
                    onChange={(e) => setDeviceBrand(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {['Samsung', 'Apple', 'Infinix', 'Tecno', 'Vivo', 'Oppo', 'Redmi / Xiaomi', 'Realme', 'Google Pixel', 'Motorola / Other'].map(
                      (b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Device Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Galaxy A34 5G or iPhone 13"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">IMEI or Serial Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 358901293849102"
                    value={imeiOrSerial}
                    onChange={(e) => setImeiOrSerial(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Repair Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RepairCategory)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {[
                      'Screen / Display Replacement',
                      'Battery Replacement',
                      'Charging Port / Board',
                      'Software / Flashing / Unlocking',
                      'Water Damage Treatment',
                      'Camera / Speaker Repair',
                      'Motherboard BGA Reballing',
                      'Other Hardware Issue',
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fault Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe hardware/software issue in detail..."
                  value={faultDescription}
                  onChange={(e) => setFaultDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Total Cost (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 8500"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Advance Received (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 2000"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Spare Part Cost (Internal)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5500"
                    value={sparePartsCost}
                    onChange={(e) => setSparePartsCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Master Technician</label>
                  <select
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Muhammad Sajid (Master Tech)">Muhammad Sajid (Master Tech)</option>
                    <option value="Ali Raza (Hardware Specialist)">Ali Raza (Hardware Specialist)</option>
                    <option value="Usman Kassim (Software Engineer)">Usman Kassim (Software Engineer)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Repair Warranty Period</label>
                  <select
                    value={warrantyDays}
                    onChange={(e) => setWarrantyDays(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value={7}>7 Days Warranty</option>
                    <option value={15}>15 Days Warranty</option>
                    <option value={30}>30 Days Warranty (Recommended)</option>
                    <option value={90}>90 Days Warranty (OEM Parts)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Device Passcode / Unlock Pattern Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1234 or L-shape pattern starting top left"
                  value={passcodePattern}
                  onChange={(e) => setPasscodePattern(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                >
                  Create Repair Job Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repair Job Detail & Status Update Drawer */}
      {selectedTicketForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-xl h-full p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="font-mono font-bold text-xs text-cyan-400">
                  {selectedTicketForDetail.ticketNumber}
                </span>
                <h3 className="font-black text-lg text-white">
                  {selectedTicketForDetail.deviceBrand} {selectedTicketForDetail.deviceModel}
                </h3>
              </div>

              <button
                onClick={() => setSelectedTicketForDetail(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions & Status Update */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Update Job Status
              </span>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    'Received',
                    'Diagnosing',
                    'Waiting Parts',
                    'In Repair',
                    'Ready for Pickup',
                    'Delivered',
                  ] as RepairStatus[]
                ).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateRepairStatus(selectedTicketForDetail.id, st);
                      setSelectedTicketForDetail((prev) => (prev ? { ...prev, status: st } : null));
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTicketForDetail.status === st
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Logs Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Technician Work Logs
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedTicketForDetail.repairLogs.map((log, idx) => (
                  <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-bold text-cyan-300">{log.performedBy}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{log.note}</p>
                  </div>
                ))}
              </div>

              {/* Add Log Form */}
              <form onSubmit={handleAddNoteToDetail} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add technical log or component note..."
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 cursor-pointer"
                >
                  Log
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
