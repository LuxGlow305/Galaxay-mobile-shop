import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SHOP_INFO } from '../data/mockData';
import {
  Mail,
  Send,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Wrench,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { addInquiry, setActiveTab } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [issueCategory, setIssueCategory] = useState<
    'Repair Request' | 'Product Availability' | 'Bulk Order' | 'General Query'
  >('Repair Request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !message) return;

    addInquiry({
      customerName,
      phone,
      email,
      deviceModel,
      issueCategory,
      message,
    });

    setSubmitted(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-extrabold text-white">Contact & Mobile Repair Inquiry</h2>
        </div>
        <p className="text-xs text-slate-400">
          Have a broken screen, loose charging jack, or want to check accessory availability at Galaxy Mobile Shop? Send us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Inquiry Submitted Successfully!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-bold text-white">{customerName}</span>. Your ticket has been logged into our shop support system. Our team at Galaxy Mobile Centre will call you back shortly on <span className="font-mono text-cyan-400 font-bold">{phone}</span>.
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                >
                  Send Another Message
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  View Inquiry Tickets
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Submit Support Request
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mian Tanveer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0300-9876543"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Device Model (If applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Samsung A32, Vivo Y20, iPhone 12"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Repair Request">Mobile Repair Request</option>
                    <option value="Product Availability">Product / Accessory Query</option>
                    <option value="Bulk Order">Wholesale / Bulk Order</option>
                    <option value="General Query">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Message / Issue Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your device repair issue or required product specifications..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Send className="w-4 h-4" /> Send Request to Galaxy Mobile
              </button>
            </form>
          )}
        </div>

        {/* Direct Shop Info (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="font-bold text-lg text-white mb-1">{SHOP_INFO.name}</h3>
            <p className="text-xs text-cyan-400 font-serif font-semibold">{SHOP_INFO.urduName}</p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{SHOP_INFO.slogan}</p>
          </div>

          <div className="space-y-3 text-xs pt-2 border-t border-slate-800">
            <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-200">Shop Location</p>
                <p className="text-slate-400">{SHOP_INFO.address}, Faisalabad, Pakistan</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-200">Call / WhatsApp Hotlines</p>
                {SHOP_INFO.phones.map((p, idx) => (
                  <p key={idx} className="font-mono text-emerald-400 font-semibold">{p}</p>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-200">Working Hours</p>
                <p className="text-slate-400">{SHOP_INFO.hours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
