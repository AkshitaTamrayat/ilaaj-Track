import React, { useState } from 'react';
import { QrCode, CheckCircle2, UserCheck, ShieldPlus, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import type { Referral } from '../types';
import { advanceReferral } from '../services/api';
import confetti from 'canvas-confetti';

interface CasualtySectionProps {
  referrals: Referral[];
  onRefresh: () => void;
}

export const CasualtySection: React.FC<CasualtySectionProps> = ({ referrals, onRefresh }) => {
  const [updating, setUpdating] = useState(false);
  const activeReferral = referrals[0];

  const handleAdvance = async (nextStatus: string, notes: string) => {
    if (!activeReferral) return;
    setUpdating(true);
    try {
      const res = await advanceReferral(activeReferral.id, nextStatus, notes);
      if (res && res.success) {
        if (nextStatus === 'DISCHARGED') {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
        }
        onRefresh();
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldPlus className="w-4 h-4" /> Pillar 4 & Stage 10: Closed-Loop Counter-Referral
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            Casualty Fast-Track & Village ASHA Handback Loop
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Pre-arrival notification allows casualty wards to prepare ICU beds before arrival, slashing wait times from 3.5 hours to under 45 minutes. On discharge, an automated counter-referral task is assigned back to the village ASHA with a ₹50 performance incentive.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <QrCode className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-mono">Token: {activeReferral?.qrToken}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Casualty Triage Card */}
        <div className="lg:col-span-7 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Casualty Pre-Arrival Queue</span>
              <h3 className="text-lg font-bold text-white mt-0.5">{activeReferral?.patientName}</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
              Status: {activeReferral?.status}
            </span>
          </div>

          {/* Clinical Case Summary */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Suspected Condition:</span>
              <strong className="text-white">{activeReferral?.suspectedCondition}</strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Origin Village:</span>
              <span className="text-slate-300">{activeReferral?.village}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Frontline Worker:</span>
              <span className="text-slate-300">{activeReferral?.ashaWorker}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Care Bundle:</span>
              <span className="text-emerald-400 font-semibold">{activeReferral?.careBundle?.diagnosticSlots?.join(' • ')}</span>
            </div>
          </div>

          {/* State Machine Transition Actions */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Transition Patient Care Journey:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAdvance('ARRIVED', 'Patient reached casualty triage gate via 108 transit')}
                disabled={updating || activeReferral?.status !== 'EN_ROUTE'}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 cursor-pointer"
              >
                1. Confirm Casualty Arrival
              </button>
              <button
                onClick={() => handleAdvance('TREATED', 'Priority 12-lead ECG completed; cardiology intervention administered')}
                disabled={updating || activeReferral?.status !== 'ARRIVED'}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 cursor-pointer"
              >
                2. Mark Treatment Complete
              </button>
              <button
                onClick={() => handleAdvance('DISCHARGED', 'Discharge finalized. Counter-referral loop activated for village ASHA')}
                disabled={updating || activeReferral?.status === 'DISCHARGED'}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>3. Discharge & Handback to Village</span>
              </button>
            </div>
          </div>

          {/* Care Journey Timeline */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Audit Trail & Care Timeline:
            </span>
            <div className="space-y-2">
              {activeReferral?.timeline?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <span className="text-slate-500 font-mono w-16">{step.time}</span>
                  <div className="flex-1">
                    <strong className="text-slate-300 block">{step.stage}</strong>
                    <span className="text-slate-400 text-[11px]">{step.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Village ASHA Counter-Referral Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Village Counter-Referral
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-bold">
                100% Closed Loop
              </span>
            </div>

            {activeReferral?.counterReferral ? (
              <div className="space-y-3">
                <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span>Assigned to: {activeReferral.counterReferral.assignedAsha}</span>
                    <span className="flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded">
                      <DollarSign className="w-3.5 h-3.5" /> ₹50 Incentive Validated
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong>Scheduled Village Visit:</strong> {activeReferral.counterReferral.followUpDate} (At Semadoh)
                  </div>
                  <div className="text-xs text-slate-300">
                    <strong>Post-Discharge Protocol:</strong> {activeReferral.counterReferral.prescribedCare}
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                  <div className="flex items-center gap-1.5 text-white font-semibold">
                    <Calendar className="w-4 h-4 text-cyan-400" /> Automated Missed-Visit Recovery
                  </div>
                  <p className="text-[11px]">
                    If the patient misses their 7-day follow-up at the District Hospital, Ilaaj Track automatically reschedules the appointment at the local Semadoh PHC (2.1 km away), eliminating redundant travel friction.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800/80 text-center space-y-2 text-slate-500">
                <AlertCircle className="w-8 h-8 mx-auto opacity-30 text-amber-400" />
                <p className="text-xs">
                  Counter-referral task will be automatically triggered upon completing hospital discharge.
                </p>
                <button
                  onClick={() => handleAdvance('DISCHARGED', 'Discharge finalized. Counter-referral loop activated')}
                  className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  ⚡ Click to Simulate Patient Discharge
                </button>
              </div>
            )}

            {/* B2G Unit Economics Highlight */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                B2G Public Health Economics
              </span>
              <div className="flex justify-between text-slate-300">
                <span>District Operating Margin:</span>
                <strong className="text-emerald-400">48.5% (Self-Funded NHM)</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Federal ABDM DHIS Revenue:</span>
                <strong className="text-cyan-400">₹500 / digitized bed / mo</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>ASHA Follow-Up Pay:</span>
                <strong className="text-amber-400">₹50 / verified home visit</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
