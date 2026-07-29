import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Inquiry } from '../types';
import {
  MessageSquare,
  Wrench,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Smartphone,
  Calendar,
} from 'lucide-react';

export const InquiriesView: React.FC = () => {
  const { inquiries, updateInquiryStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = filterStatus === 'All' || inq.status === filterStatus;
    const matchesSearch =
      inq.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm) ||
      (inq.deviceModel && inq.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Repair Tickets & Support Requests</h2>
          </div>
          <p className="text-xs text-slate-400">
            Incoming customer queries, mobile repairing quotations & stock availability inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by customer name, phone number or device model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Inquiries Cards List */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-sm">
            No inquiries matching your filter.
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-base">{inq.customerName}</span>
                  <span className="text-xs font-mono text-cyan-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {inq.phone}
                  </span>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                    {inq.issueCategory}
                  </span>
                </div>

                {inq.deviceModel && (
                  <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    Device: {inq.deviceModel}
                  </p>
                )}

                <p className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-2xl leading-relaxed border border-slate-800">
                  "{inq.message}"
                </p>

                <p className="text-[10px] text-slate-500 flex items-center gap-1 pt-1">
                  <Calendar className="w-3 h-3" /> Submitted on{' '}
                  {inq.createdAt ? new Date(inq.createdAt).toLocaleString() : ''}
                </p>
              </div>

              {/* Status Updater */}
              <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
                {(['Pending', 'In Progress', 'Resolved'] as Inquiry['status'][]).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateInquiryStatus(inq.id, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      inq.status === st
                        ? st === 'Resolved'
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                          : st === 'In Progress'
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                          : 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
