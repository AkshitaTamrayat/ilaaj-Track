import React, { useState } from 'react';
import type { Facility, Referral } from '../types';
import { simulateBottleneck } from '../services/api';
import confetti from 'canvas-confetti';

interface DynamicMapSectionProps {
  facilities: Facility[];
  referrals: Referral[];
  onRefresh: () => void;
}

export const DynamicMapSection: React.FC<DynamicMapSectionProps> = ({ facilities, referrals, onRefresh }) => {
  const [simulating, setSimulating] = useState(false);
  const [reroutedBanner, setReroutedBanner] = useState<string | null>(null);

  const activeReferral = referrals[0];
  const isRerouted = activeReferral?.isRerouted || activeReferral?.destinationFacilityId === 'fac-sdh-achlapur';

  const handleSimulateBottleneck = async () => {
    setSimulating(true);
    try {
      const res = await simulateBottleneck('fac-dh-amravati', isRerouted ? 'RESET' : 'ICU_FULL');
      if (res && res.success) {
        if (!isRerouted) {
          confetti({ particleCount: 50, spread: 50 });
          setReroutedBanner('🚨 Amravati District Hospital reached 100% ICU capacity! Dynamic Haversine routing immediately recovered and rerouted the ambulance to Achalpur Sub-District Hospital.');
        } else {
          setReroutedBanner('Amravati District Hospital capacity restored.');
        }
        onRefresh();
      }
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Breadcrumb & Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Ilaaj Track"
            className="w-10 h-10 rounded-xl object-contain shadow-xs border border-teal-100 bg-white"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Care & Transit — Dynamic Reroute Engine (एम्बुलेंस ट्रैकिंग)
            </h1>
            <p className="text-xs text-slate-500">
              Live GPS Transit Corridor • 6-Factor Facility Verification • Real-time Haversine Auto-Reroute
            </p>
          </div>
        </div>

        {/* Hackathon Demo Trigger Button */}
        <button
          onClick={handleSimulateBottleneck}
          disabled={simulating}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
            isRerouted
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
              : 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-700/20 active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {isRerouted ? 'restart_alt' : 'crisis_alert'}
          </span>
          <span>
            {simulating
              ? 'Calculating Spatial Haversine Matrix...'
              : isRerouted
              ? 'Reset District Hospital Telemetry'
              : 'Simulate District Hospital ICU 100% (अस्पताल जाम सिमुलेशन)'}
          </span>
        </button>
      </div>

      {/* Rerouted Alert Banner */}
      {reroutedBanner && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 text-amber-900 text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-700 text-lg flex-shrink-0">warning</span>
            <span>{reroutedBanner}</span>
          </div>
          <button
            onClick={() => setReroutedBanner(null)}
            className="text-amber-800 hover:text-amber-950 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive Map & Route Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Visual Map Simulation */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-teal-700 text-lg">navigation</span>
              Active Ambulance Transit Corridor
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold w-fit">
              Live GPS • ALS Ambulance #KA-04-E-108
            </span>
          </div>

          {/* SVG Map Canvas (Clean Daylight Medical View) */}
          <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-2 sm:p-6">
            
            {/* Background Map Grid */}
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <svg className="w-full h-full" viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              
              {/* Route Path A: Rampur PHC -> Amravati DH */}
              <path
                d="M 80 160 C 200 130, 360 80, 520 70"
                stroke={isRerouted ? '#e11d48' : '#0f766e'}
                strokeWidth={isRerouted ? '2.5' : '4'}
                strokeDasharray={isRerouted ? '5 5' : 'none'}
                opacity={isRerouted ? '0.4' : '0.9'}
              />

              {/* Route Path B: Rampur PHC -> Achalpur SDH */}
              <path
                d="M 80 160 C 220 180, 340 230, 480 250"
                stroke={isRerouted ? '#0f766e' : '#cbd5e1'}
                strokeWidth={isRerouted ? '4' : '2'}
                strokeDasharray={isRerouted ? 'none' : '4 4'}
                opacity={isRerouted ? '1' : '0.4'}
              />

              {/* Dynamic Ambulance Marker */}
              <g transform={isRerouted ? 'translate(280, 195)' : 'translate(260, 115)'} className="transition-all duration-700">
                <circle cx="0" cy="0" r="14" fill="#0f766e" fillOpacity="0.15" />
                <circle cx="0" cy="0" r="8" fill="#0f766e" />
                <text x="14" y="4" fill="#0f766e" fontSize="11" fontWeight="bold">
                  ALS Ambulance En Route
                </text>
              </g>

              {/* Origin Node: Rampur Sub-Center */}
              <g transform="translate(80, 160)">
                <circle cx="0" cy="0" r="10" fill="#0284c7" />
                <circle cx="0" cy="0" r="16" stroke="#0284c7" strokeOpacity="0.3" strokeWidth="2" />
                <text x="-35" y="28" fill="#334155" fontSize="11" fontWeight="bold">Rampur Sub-Center</text>
                <text x="-20" y="42" fill="#64748b" fontSize="9">(Origin Clinic)</text>
              </g>

              {/* Destination A Node: Amravati DH */}
              <g transform="translate(520, 70)">
                <circle cx="0" cy="0" r="12" fill={isRerouted ? '#e11d48' : '#0f766e'} />
                <text x="-70" y="-18" fill={isRerouted ? '#9f1239' : '#0f172a'} fontSize="12" fontWeight="bold">
                  Amravati District Hospital
                </text>
                <text x="-40" y="-4" fill="#64748b" fontSize="10">
                  {isRerouted ? '⛔ ICU 100% Full (Blocked)' : '✓ 64 km • 78 min'}
                </text>
              </g>

              {/* Destination B Node: Achalpur SDH */}
              <g transform="translate(480, 250)">
                <circle cx="0" cy="0" r="12" fill={isRerouted ? '#0f766e' : '#94a3b8'} />
                <text x="-65" y="24" fill={isRerouted ? '#0f766e' : '#475569'} fontSize="12" fontWeight="bold">
                  Achalpur Sub-District Hospital
                </text>
                <text x="-40" y="38" fill={isRerouted ? '#0f766e' : '#64748b'} fontSize="10">
                  {isRerouted ? '★ Auto-Rerouted Target • 38 km • 45 min' : '38 km (Secondary Backup)'}
                </text>
              </g>

            </svg>

            {/* In-Transit Floating Badge */}
            <div className="absolute bottom-3 left-4 bg-white/95 px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-teal-700 text-base">near_me</span>
              <span>
                Active Target:{' '}
                <strong className={isRerouted ? 'text-emerald-700 font-bold' : 'text-teal-900 font-bold'}>
                  {isRerouted ? 'Achalpur Sub-District Hospital (Rerouted)' : 'Amravati District Hospital'}
                </strong>
              </span>
            </div>
          </div>

          {/* Active Referral State Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Active Patient Record</span>
              <div className="text-sm font-bold text-slate-900">
                {activeReferral?.patientName || 'Ramesh K. Gurjar'} (Age: {activeReferral?.age || 52}) • {activeReferral?.id || 'REF-2026-9041'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Condition: {activeReferral?.suspectedCondition || 'Acute Coronary Syndrome / STEMI'}
              </div>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isRerouted ? 'bg-amber-100 text-amber-900 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                {isRerouted ? 'REROUTED TO SUB-DISTRICT' : 'EN ROUTE TO DISTRICT HOSPITAL'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 6-Factor Facility Comparison */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-teal-700 text-lg">verified</span>
              6-Factor Hospital Readiness Scorecard
            </span>

            {/* Facility Cards */}
            <div className="space-y-3">
              {facilities.map((fac) => {
                const isSelected = activeReferral?.destinationFacilityId === fac.id;
                const isBottleneck = fac.status.includes('BOTTLENECK') || fac.icuBedsOccupied >= fac.icuBedsTotal;

                return (
                  <div
                    key={fac.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-teal-50/60 border-teal-500 ring-1 ring-teal-500/20'
                        : isBottleneck
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{fac.name}</h4>
                          {isSelected && (
                            <span className="text-[10px] bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.2 rounded font-bold uppercase">
                              Active Target
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {fac.distanceKm} km away • ~{fac.driveTimeMin} min transit
                        </p>
                      </div>

                      {/* Readiness Score Badge */}
                      <div className="text-right">
                        <div className={`text-xl font-bold ${fac.readinessScore > 75 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {fac.readinessScore}%
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase block font-medium">Readiness</span>
                      </div>
                    </div>

                    {/* 6-Factor Telemetry Badges */}
                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Doctor Roster</span>
                        <span className={fac.doctorOnDuty ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {fac.doctorOnDuty ? '✓ On Duty' : '✕ Absent'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ICU Occupancy</span>
                        <span className={fac.icuBedsOccupied / fac.icuBedsTotal > 0.85 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}>
                          {fac.icuBedsOccupied}/{fac.icuBedsTotal} ({Math.round((fac.icuBedsOccupied / fac.icuBedsTotal) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">ECG/Lab Uptime</span>
                        <span className={fac.diagnostics.ecg.status === 'ONLINE' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                          {fac.diagnostics.ecg.status}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Why Dynamic Haversine Routing Saves Lives:</strong> When rural ambulances travel blindly, patients reach full hospitals and risk death during secondary transfers. Ilaaj Track reroutes them mid-transit before arrival.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
