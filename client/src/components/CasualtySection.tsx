import React, { useState } from 'react';
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
              Hospital Casualty Handover & Counter-Referral (अस्पताल हैंडओवर)
            </h1>
            <p className="text-xs text-slate-500">
              Pre-Arrival Triage Gate • Fast-Track Admission • Automated Village ASHA Post-Discharge Handback
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
          <span className="material-symbols-outlined text-teal-700 text-base">qr_code</span>
          <span className="text-slate-700 font-mono font-bold">
            Token: {activeReferral?.qrToken || 'ILAAJ-SECURE-8834'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Casualty Triage Card */}
        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Casualty Pre-Arrival Queue</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {activeReferral?.patientName || 'Ramesh K. Gurjar'}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase font-mono">
              Status: {activeReferral?.status || 'EN_ROUTE'}
            </span>
          </div>

          {/* Clinical Case Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Suspected Condition:</span>
              <strong className="text-slate-900 font-semibold">{activeReferral?.suspectedCondition || 'Acute Coronary Syndrome / STEMI'}</strong>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Origin Village:</span>
              <span className="text-slate-700">{activeReferral?.village || 'Rampur Village (Ward 4)'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Frontline Health Worker:</span>
              <span className="text-slate-700">{activeReferral?.ashaWorker || 'Sunita Devi (ASHA-902)'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Care Bundle:</span>
              <span className="text-teal-800 font-bold">{activeReferral?.careBundle?.diagnosticSlots?.join(' • ') || '12-Lead ECG • Troponin-I • 2D Echo'}</span>
            </div>
          </div>

          {/* State Machine Transition Actions */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Transition Patient Care Journey:
            </span>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => handleAdvance('ARRIVED', 'Patient arrived at hospital casualty gate via 108 ambulance')}
                disabled={updating || (activeReferral?.status !== 'EN_ROUTE' && activeReferral?.status !== 'ACCEPTED')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 disabled:opacity-40 cursor-pointer"
              >
                1. Confirm Casualty Arrival
              </button>
              <button
                onClick={() => handleAdvance('TREATED', 'Priority 12-lead ECG completed; cardiology intervention administered')}
                disabled={updating || activeReferral?.status !== 'ARRIVED'}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 disabled:opacity-40 cursor-pointer"
              >
                2. Mark Treatment Complete
              </button>
              <button
                onClick={() => handleAdvance('DISCHARGED', 'Discharge finalized. Counter-referral loop activated for village ASHA')}
                disabled={updating || activeReferral?.status === 'DISCHARGED'}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">how_to_reg</span>
                <span>3. Discharge & Handback to Village</span>
              </button>
            </div>
          </div>

          {/* Care Journey Timeline */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Audit Trail & Care Timeline:
            </span>
            <div className="space-y-2">
              {activeReferral?.timeline?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500 font-mono w-16 shrink-0">{step.time}</span>
                  <div className="flex-1">
                    <strong className="text-slate-900 block">{step.stage}</strong>
                    <span className="text-slate-600 text-[11px]">{step.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Village ASHA Counter-Referral Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                Automated Village Counter-Referral
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                100% Closed Loop
              </span>
            </div>

            {activeReferral?.counterReferral ? (
              <div className="space-y-3">
                <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-teal-900 font-bold">
                    <span>Assigned to: {activeReferral.counterReferral.assignedAsha}</span>
                    <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-teal-200 text-teal-800 font-bold">
                      ₹50 Incentive Validated
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <strong>Scheduled Village Visit:</strong> {activeReferral.counterReferral.followUpDate} (At Rampur)
                  </div>
                  <div className="text-xs text-slate-700">
                    <strong>Post-Discharge Protocol:</strong> {activeReferral.counterReferral.prescribedCare}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                    <span className="material-symbols-outlined text-teal-700 text-base">calendar_month</span>
                    Automated Missed-Visit Recovery
                  </div>
                  <p className="text-[11px]">
                    If the patient misses their 7-day follow-up at the District Hospital, Ilaaj Track automatically reschedules the appointment at the local Rampur Sub-Center (2.1 km away), eliminating travel friction.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center space-y-2 text-slate-500">
                <span className="material-symbols-outlined text-3xl text-amber-600 mx-auto block opacity-60">
                  assignment_late
                </span>
                <p className="text-xs">
                  Counter-referral task will be automatically triggered upon completing hospital discharge.
                </p>
                <button
                  onClick={() => handleAdvance('DISCHARGED', 'Discharge finalized. Counter-referral loop activated')}
                  className="mt-2 text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
                >
                  Click to Simulate Patient Discharge
                </button>
              </div>
            )}

            {/* Public Health Unit Economics Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Public Health Unit Economics
              </span>
              <div className="flex justify-between text-slate-700">
                <span>District Operating Margin:</span>
                <strong className="text-emerald-700">48.5% (Self-Funded NHM)</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Digital Health Incentive:</span>
                <strong className="text-teal-800">₹500 / digitized bed / mo</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>ASHA Follow-Up Pay:</span>
                <strong className="text-amber-800">₹50 / verified home visit</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
