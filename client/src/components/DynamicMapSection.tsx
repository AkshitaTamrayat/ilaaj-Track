import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Navigation, Zap, Ambulance } from 'lucide-react';
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
      // Toggle Amravati DH into bottleneck (ICU 100% or CT machine down)
      const res = await simulateBottleneck('fac-dh-amravati', isRerouted ? 'RESET' : 'ICU_FULL');
      if (res && res.success) {
        if (!isRerouted) {
          confetti({ particleCount: 50, spread: 50 });
          setReroutedBanner('🚨 Amravati DH ICU reached 100% capacity! WOW Engine automatically executed dynamic Haversine reroute to Achalpur Sub-District Hospital.');
        } else {
          setReroutedBanner('Amravati DH reset to normal capacity.');
        }
        onRefresh();
      }
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" /> Pillar 4: Care Readiness Engine & Dynamic Haversine Reroute
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Live 6-Factor Facility Verification & Bottleneck Recovery
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Never send a patient blindly. Before the patient leaves home, our algorithm verifies specialist roster, equipment uptime, and ICU bed safety threshold (&lt;85%). If a hospital breaks down mid-transit, automated rerouting recovers the journey instantly.
          </p>
        </div>

        {/* Hackathon Demo Trigger Button */}
        <button
          onClick={handleSimulateBottleneck}
          disabled={simulating}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
            isRerouted
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>
            {simulating
              ? 'Executing Spatial Haversine Matrix...'
              : isRerouted
              ? 'Reset District Hospital Telemetry'
              : '⚡ Simulate DH ICU 100% Breakdown'}
          </span>
        </button>
      </div>

      {/* Rerouted Alert Banner */}
      {reroutedBanner && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-300 text-xs font-medium animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{reroutedBanner}</span>
          </div>
          <button
            onClick={() => setReroutedBanner(null)}
            className="text-amber-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive Map & Route Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Visual Map Simulation */}
        <div className="lg:col-span-7 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-cyan-400" /> Melghat Tribal Corridor: Live Active Transit
            </span>
            <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
              GPS Telemetry Active • 108 Ambulance
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[360px] bg-[#050a14] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-6">
            
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <svg className="w-full h-full" viewBox="0 0 600 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              
              {/* Route Path A: Melghat PHC -> Amravati DH (Longer Route) */}
              <path
                d="M 80 160 C 200 130, 360 80, 520 70"
                stroke={isRerouted ? '#ef4444' : '#10b981'}
                strokeWidth={isRerouted ? '2' : '4'}
                strokeDasharray={isRerouted ? '4 4' : 'none'}
                opacity={isRerouted ? '0.4' : '0.9'}
              />

              {/* Route Path B: Melghat PHC -> Achalpur SDH (Alternative Reroute) */}
              <path
                d="M 80 160 C 220 180, 340 230, 480 250"
                stroke={isRerouted ? '#10b981' : '#334155'}
                strokeWidth={isRerouted ? '4' : '2'}
                strokeDasharray={isRerouted ? 'none' : '4 4'}
                opacity={isRerouted ? '1' : '0.3'}
              />

              {/* Dynamic Ambulance Marker */}
              <g transform={isRerouted ? 'translate(280, 195)' : 'translate(260, 115)'} className="transition-all duration-700">
                <circle cx="0" cy="0" r="14" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
                <circle cx="0" cy="0" r="8" fill="#10b981" />
                <text x="12" y="4" fill="#34d399" fontSize="10" fontWeight="bold">
                  108 Transit (Patient En Route)
                </text>
              </g>

              {/* Origin Node: Semadoh PHC */}
              <g transform="translate(80, 160)">
                <circle cx="0" cy="0" r="10" fill="#0ea5e9" />
                <circle cx="0" cy="0" r="16" stroke="#0ea5e9" strokeOpacity="0.4" strokeWidth="2" />
                <text x="-35" y="28" fill="#94a3b8" fontSize="10" fontWeight="bold">Semadoh Tribal PHC</text>
                <text x="-20" y="40" fill="#64748b" fontSize="8">(Origin Point)</text>
              </g>

              {/* Destination A Node: Amravati DH */}
              <g transform="translate(520, 70)">
                <circle cx="0" cy="0" r="12" fill={isRerouted ? '#ef4444' : '#10b981'} />
                <text x="-65" y="-18" fill={isRerouted ? '#f87171' : '#ffffff'} fontSize="11" fontWeight="bold">
                  Amravati District Hospital
                </text>
                <text x="-40" y="-6" fill="#94a3b8" fontSize="9">
                  {isRerouted ? '⛔ ICU 100% Overcrowded' : '✓ 64 km • 78 min'}
                </text>
              </g>

              {/* Destination B Node: Achalpur SDH */}
              <g transform="translate(480, 250)">
                <circle cx="0" cy="0" r="12" fill={isRerouted ? '#10b981' : '#64748b'} />
                <text x="-60" y="24" fill={isRerouted ? '#34d399' : '#94a3b8'} fontSize="11" fontWeight="bold">
                  Achalpur Sub-District Hospital
                </text>
                <text x="-40" y="36" fill={isRerouted ? '#34d399' : '#64748b'} fontSize="9">
                  {isRerouted ? '★ Auto-Rerouted Target • 38 km • 45 min' : '38 km (Secondary Backup)'}
                </text>
              </g>

            </svg>

            {/* In-Transit Floating Badge */}
            <div className="absolute bottom-3 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
              <Ambulance className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Active Target:{' '}
                <strong className={isRerouted ? 'text-emerald-400' : 'text-cyan-400'}>
                  {isRerouted ? 'Achalpur SDH (Rerouted)' : 'Amravati District Hospital'}
                </strong>
              </span>
            </div>
          </div>

          {/* Active Referral State Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Referral Record</span>
              <div className="text-sm font-bold text-white">
                {activeReferral?.patientName} (Age: {activeReferral?.age}) • {activeReferral?.id}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Condition: {activeReferral?.suspectedCondition}
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${isRerouted ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                {isRerouted ? 'REROUTED TO SDH' : 'EN ROUTE TO DH'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: 6-Factor Facility Comparison */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 6-Factor Readiness Scorecard
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
                        ? 'bg-slate-950 border-emerald-500/40 ring-1 ring-emerald-500/20'
                        : isBottleneck
                        ? 'bg-rose-950/20 border-rose-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{fac.name}</h4>
                          {isSelected && (
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {fac.distanceKm} km away • ~{fac.driveTimeMin} min transit
                        </p>
                      </div>

                      {/* Readiness Score Badge */}
                      <div className="text-right">
                        <div className={`text-base font-display font-extrabold ${fac.readinessScore > 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {fac.readinessScore}%
                        </div>
                        <span className="text-[9px] text-slate-500 uppercase block">Readiness</span>
                      </div>
                    </div>

                    {/* 6-Factor Telemetry Badges */}
                    <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-800/80 text-[10px]">
                      <div>
                        <span className="text-slate-500 block">Doctor Roster</span>
                        <span className={fac.doctorOnDuty ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                          {fac.doctorOnDuty ? '✓ On Duty' : '✕ Absent'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">ICU Occupancy</span>
                        <span className={fac.icuBedsOccupied / fac.icuBedsTotal > 0.85 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                          {fac.icuBedsOccupied}/{fac.icuBedsTotal} ({Math.round((fac.icuBedsOccupied / fac.icuBedsTotal) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">ECG & Lab Uptime</span>
                        <span className={fac.diagnostics.ecg.status === 'ONLINE' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                          {fac.diagnostics.ecg.status}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-white">Why This Solves The 'Clinical Black Hole':</strong> If an ambulance spends 1.5 hours driving to a hospital whose ICU is full, the patient risks mortality en route. SwasthyaSetu reroutes them proactively while in transit.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
