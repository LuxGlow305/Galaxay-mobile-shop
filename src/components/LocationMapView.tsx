import React from 'react';
import { SHOP_INFO } from '../data/mockData';
import {
  MapPin,
  Navigation,
  PhoneCall,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  Compass,
} from 'lucide-react';

export const LocationMapView: React.FC = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${SHOP_INFO.name}, ${SHOP_INFO.address}, ${SHOP_INFO.city}, Pakistan`
  )}`;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Facility Location & Directions</h2>
          </div>
          <p className="text-xs text-slate-400">
            Find Galaxy Mobile & Repairing Centre at Plus Code {SHOP_INFO.plusCode}, Chak 117 JB Dhanola, Faisalabad.
          </p>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 text-xs transition-all cursor-pointer shrink-0"
        >
          <Navigation className="w-4 h-4" /> Open Directions in Google Maps <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Map & Facility Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Map Container */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl min-h-[420px] flex flex-col justify-between">
          <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs text-white">Interactive OpenStreetMap Viewer</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              Plus Code: {SHOP_INFO.plusCode}
            </span>
          </div>

          <div className="relative w-full h-[380px] bg-slate-950">
            {/* Embedded OpenStreetMap interactive iframe */}
            <iframe
              title="Galaxy Mobile Shop Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=73.1200%2C31.4900%2C73.1500%2C31.5200&layer=mapnik&marker=${SHOP_INFO.coordinates.lat}%2C${SHOP_INFO.coordinates.lng}`}
              className="w-full h-full filter contrast-125 saturate-110"
            />

            {/* Custom Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-slate-900/95 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-md space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                <Building2 className="w-4 h-4" />
                <span>{SHOP_INFO.name}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">{SHOP_INFO.address}</p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                <span>0300-8929016</span>
                <span>Open 9:00 AM - 10:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Location & Facility Highlights */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Shop Facility Address
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Street Address</span>
                <p className="font-medium text-slate-100">{SHOP_INFO.address}</p>
                <p className="text-slate-400">{SHOP_INFO.city}, Punjab, Pakistan</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Contact Numbers</span>
                {SHOP_INFO.phones.map((p, idx) => (
                  <p key={idx} className="font-mono text-cyan-400 font-semibold flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> {p}
                  </p>
                ))}
              </div>

              <div className="p-3 bg-slate-800/60 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Operating Hours</span>
                <p className="font-medium text-emerald-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> {SHOP_INFO.hours}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/20 rounded-2xl text-xs space-y-2">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Landmark Navigation
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Located directly near Dhanola Stop on Millat Road, Faisalabad. Easily accessible with parking outside the shop front.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
