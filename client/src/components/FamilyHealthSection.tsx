import React, { useState, useEffect } from 'react';
import type { FamilyMember } from '../types';
import { fetchFamilyMembers, addFamilyMember, addPrescription, addLabReport, addCheckup, toggleCheckup } from '../services/api';
import confetti from 'canvas-confetti';

export const FamilyHealthSection: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'prescriptions' | 'reports' | 'checkups'>('prescriptions');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [showAddRxModal, setShowAddRxModal] = useState<boolean>(false);
  const [showAddReportModal, setShowAddReportModal] = useState<boolean>(false);
  const [showAddCheckupModal, setShowAddCheckupModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Form states
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    relation: 'Spouse' as const,
    age: '',
    gender: 'Female' as const,
    bloodGroup: 'B+',
    chronicConditions: '',
    village: 'Semadoh Village'
  });

  const [newRxForm, setNewRxForm] = useState({
    doctorName: '',
    facilityName: '',
    diagnosis: '',
    medName: '',
    dosage: '',
    frequency: '1-0-1 (सुबह-रात)',
    duration: '15 Days',
    notes: ''
  });

  const [newReportForm, setNewReportForm] = useState({
    testName: '',
    category: 'BLOOD' as const,
    facilityName: '',
    paramName: '',
    paramValue: '',
    paramRange: '',
    summaryStatus: 'NORMAL' as const,
    doctorRemarks: ''
  });

  const [newCheckupForm, setNewCheckupForm] = useState({
    title: '',
    date: '',
    facilityOrAsha: 'Kavita Meshram (Village ASHA Worker)',
    type: 'ASHA_HOME_VISIT' as const,
    notes: ''
  });

  // Load family members on mount
  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchFamilyMembers();
      if (data && data.length > 0) {
        setMembers(data);
        if (!selectedMemberId) {
          setSelectedMemberId(data[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const selectedMember = members.find(m => m.id === selectedMemberId) || members[0];

  // Handlers
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name.trim()) return;

    const res = await addFamilyMember({
      ...newMemberForm,
      age: Number(newMemberForm.age) || 30,
      chronicConditions: newMemberForm.chronicConditions ? newMemberForm.chronicConditions.split(',').map(s => s.trim()) : []
    });

    if (res && res.success) {
      confetti({ particleCount: 50, spread: 60 });
      await loadMembers();
      if (res.member) setSelectedMemberId(res.member.id);
      setShowAddMemberModal(false);
      setNewMemberForm({
        name: '',
        relation: 'Spouse',
        age: '',
        gender: 'Female',
        bloodGroup: 'B+',
        chronicConditions: '',
        village: 'Semadoh Village'
      });
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const res = await addPrescription(selectedMember.id, {
      doctorName: newRxForm.doctorName || 'Medical Officer',
      facilityName: newRxForm.facilityName || 'Primary Health Center',
      diagnosis: newRxForm.diagnosis || 'General Consultation',
      medicines: [
        {
          name: newRxForm.medName || 'Tab. Paracetamol 650mg',
          dosage: newRxForm.dosage || '650mg',
          frequency: newRxForm.frequency,
          duration: newRxForm.duration,
          instructions: 'Take after meals'
        }
      ],
      investigations: ['Routine Follow-up'],
      notes: newRxForm.notes
    });

    if (res && res.success) {
      confetti({ particleCount: 40, spread: 50 });
      await loadMembers();
      setShowAddRxModal(false);
      setNewRxForm({
        doctorName: '',
        facilityName: '',
        diagnosis: '',
        medName: '',
        dosage: '',
        frequency: '1-0-1 (सुबह-रात)',
        duration: '15 Days',
        notes: ''
      });
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const res = await addLabReport(selectedMember.id, {
      testName: newReportForm.testName || 'Routine Diagnostic Test',
      category: newReportForm.category,
      facilityName: newReportForm.facilityName || 'PHC Diagnostic Lab',
      summaryStatus: newReportForm.summaryStatus,
      keyValues: [
        {
          parameter: newReportForm.paramName || 'Observed Parameter',
          value: newReportForm.paramValue || 'Normal',
          normalRange: newReportForm.paramRange || 'Standard',
          isAbnormal: newReportForm.summaryStatus !== 'NORMAL'
        }
      ],
      doctorRemarks: newReportForm.doctorRemarks || 'Report verified by attending medical officer.'
    });

    if (res && res.success) {
      confetti({ particleCount: 40, spread: 50 });
      await loadMembers();
      setShowAddReportModal(false);
      setNewReportForm({
        testName: '',
        category: 'BLOOD',
        facilityName: '',
        paramName: '',
        paramValue: '',
        paramRange: '',
        summaryStatus: 'NORMAL',
        doctorRemarks: ''
      });
    }
  };

  const handleCreateCheckup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const res = await addCheckup(selectedMember.id, {
      title: newCheckupForm.title || 'Routine Follow-up',
      date: newCheckupForm.date || new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      facilityOrAsha: newCheckupForm.facilityOrAsha,
      type: newCheckupForm.type,
      notes: newCheckupForm.notes
    });

    if (res && res.success) {
      confetti({ particleCount: 40, spread: 50 });
      await loadMembers();
      setShowAddCheckupModal(false);
      setNewCheckupForm({
        title: '',
        date: '',
        facilityOrAsha: 'Kavita Meshram (Village ASHA Worker)',
        type: 'ASHA_HOME_VISIT',
        notes: ''
      });
    }
  };

  const handleToggleCheckup = async (checkupId: string, currentStatus: string) => {
    if (!selectedMember) return;
    const nextStatus = currentStatus === 'COMPLETED' ? 'UPCOMING' : 'COMPLETED';
    const res = await toggleCheckup(selectedMember.id, checkupId, nextStatus);
    if (res && res.success) {
      if (nextStatus === 'COMPLETED') {
        confetti({ particleCount: 40, spread: 45 });
      }
      await loadMembers();
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 text-sm font-medium">
        <span className="material-symbols-outlined text-2xl text-teal-700 animate-spin mr-2">
          progress_activity
        </span>
        Loading Family Health Records...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb & Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Ilaaj Track Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-xs border border-teal-100 bg-white"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Family Health Records & Check-up Vault (परिवार स्वास्थ्य खाता)
            </h1>
            <p className="text-xs text-slate-500">
              Prescription Slips • Diagnostic Lab Reports • Upcoming ASHA Visits • Digital Health ID
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer transition"
          >
            <span className="material-symbols-outlined text-base text-teal-700">print</span>
            Health Card (स्वास्थ्य कार्ड)
          </button>
          <button
            type="button"
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            + Add Member (नया सदस्य)
          </button>
        </div>
      </div>

      {/* Family Member Switcher Horizontal Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-teal-700 text-base">groups</span>
            Select Family Member (परिवार का सदस्य चुनें)
          </span>
          <span className="text-[11px] text-teal-800 font-semibold lowercase">
            {members.length} members registered
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {members.map((member) => {
            const isSelected = member.id === selectedMember?.id;
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedMemberId(member.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-700 ring-2 ring-teal-700/20 shadow-xs'
                    : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  isSelected ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  <span className="material-symbols-outlined text-xl">
                    {member.gender === 'Female' ? 'face_3' : 'face'}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {member.name.split(' (')[0]}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-semibold text-teal-800 bg-teal-100/60 px-1.5 py-0.2 rounded">
                      {member.relation}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {member.age} yrs
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Member Hero Card */}
      {selectedMember && (
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl text-white p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                <span className="material-symbols-outlined text-3xl">
                  {selectedMember.gender === 'Female' ? 'face_3' : 'face'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg md:text-xl font-bold tracking-tight">
                    {selectedMember.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-400 text-teal-950">
                    {selectedMember.relation} • {selectedMember.age} Yrs
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-teal-100">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">badge</span>
                    ABHA ID: <strong className="font-mono text-white">{selectedMember.abhaId}</strong>
                  </span>
                  <span>•</span>
                  <span>Blood: <strong className="text-white">{selectedMember.bloodGroup}</strong></span>
                  <span>•</span>
                  <span>{selectedMember.village}</span>
                </div>
                {selectedMember.chronicConditions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {selectedMember.chronicConditions.map((cond, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/15 text-white font-medium border border-white/20">
                        {cond}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/15">
              <div className="text-center px-3">
                <div className="text-lg font-bold text-white">{selectedMember.prescriptions.length}</div>
                <div className="text-[10px] text-teal-200">Slips (पर्ची)</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center px-3">
                <div className="text-lg font-bold text-white">{selectedMember.labReports.length}</div>
                <div className="text-[10px] text-teal-200">Reports (रिपोर्ट)</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center px-3">
                <div className="text-lg font-bold text-white">{selectedMember.checkups.length}</div>
                <div className="text-[10px] text-teal-200">Checkups (जांच)</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Sub-Tabs: Prescriptions, Reports, Check-ups */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('prescriptions')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold text-xs transition cursor-pointer ${
              activeSubTab === 'prescriptions'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">prescriptions</span>
            <span>Doctor Prescriptions & Slips (दवाई की पर्ची)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {selectedMember?.prescriptions.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('reports')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold text-xs transition cursor-pointer ${
              activeSubTab === 'reports'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">lab_profile</span>
            <span>Diagnostic Lab Reports (जांच रिपोर्ट्स)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {selectedMember?.labReports.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('checkups')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 font-bold text-xs transition cursor-pointer ${
              activeSubTab === 'checkups'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-lg">event_available</span>
            <span>Follow-up & Check-up Timeline (नियमित जांच)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {selectedMember?.checkups.length || 0}
            </span>
          </button>
        </div>

        {/* Tab specific action buttons */}
        <div>
          {activeSubTab === 'prescriptions' && (
            <button
              type="button"
              onClick={() => setShowAddRxModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition"
            >
              <span className="material-symbols-outlined text-base">add_photo_alternate</span>
              + Upload Prescription (पर्ची जोड़ें)
            </button>
          )}

          {activeSubTab === 'reports' && (
            <button
              type="button"
              onClick={() => setShowAddReportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition"
            >
              <span className="material-symbols-outlined text-base">post_add</span>
              + Add Report (रिपोर्ट जोड़ें)
            </button>
          )}

          {activeSubTab === 'checkups' && (
            <button
              type="button"
              onClick={() => setShowAddCheckupModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition"
            >
              <span className="material-symbols-outlined text-base">add_alarm</span>
              + Schedule Check-up (जांच तय करें)
            </button>
          )}
        </div>
      </div>

      {/* Tab 1 Content: Prescriptions */}
      {activeSubTab === 'prescriptions' && (
        <div className="space-y-4">
          {selectedMember?.prescriptions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-400">prescriptions</span>
              <p className="text-sm font-bold text-slate-700">No prescription slips added yet</p>
              <p className="text-xs text-slate-500">Upload doctor slips or prescriptions for this family member.</p>
              <button
                type="button"
                onClick={() => setShowAddRxModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-sm"
              >
                + Upload First Prescription Slip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMember?.prescriptions.map((rx) => (
                <div key={rx.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-teal-300 transition">
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        Date: {rx.date}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{rx.doctorName}</h3>
                      <p className="text-xs text-slate-500">{rx.facilityName}</p>
                    </div>
                    <span className="material-symbols-outlined text-teal-700 text-2xl">receipt_long</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Diagnosis (रोग/स्थिति):
                    </div>
                    <p className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {rx.diagnosis}
                    </p>
                  </div>

                  {/* Medicines List with Rural Dosage Guide */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Prescribed Medicines (दवाइयां):
                    </div>
                    <div className="space-y-1.5">
                      {rx.medicines.map((med, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-100 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-teal-950 block">{med.name}</span>
                            <span className="text-[11px] text-teal-700">{med.frequency} • {med.duration}</span>
                            {med.instructions && (
                              <span className="text-[10px] text-slate-500 block italic">{med.instructions}</span>
                            )}
                          </div>
                          <span className="px-2 py-0.5 rounded bg-white text-teal-800 font-bold border border-teal-200 text-[11px]">
                            {med.dosage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investigations / Tests */}
                  {rx.investigations && rx.investigations.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-bold text-slate-500">Ordered Diagnostic Tests:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {rx.investigations.map((inv, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                            {inv}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {rx.notes && (
                    <p className="text-[11px] text-slate-500 bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900">
                      💡 <strong>Doctor Note:</strong> {rx.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2 Content: Diagnostic Reports */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          {selectedMember?.labReports.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-400">lab_profile</span>
              <p className="text-sm font-bold text-slate-700">No diagnostic reports stored yet</p>
              <p className="text-xs text-slate-500">Add lab test results, ECG, or X-Ray reports for quick family access.</p>
              <button
                type="button"
                onClick={() => setShowAddReportModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-sm"
              >
                + Add Lab Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMember?.labReports.map((rep) => (
                <div key={rep.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-teal-300 transition">
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {rep.date}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          rep.summaryStatus === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : rep.summaryStatus === 'ATTENTION'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {rep.summaryStatus === 'CRITICAL' ? '🔴 Critical' : rep.summaryStatus === 'ATTENTION' ? '🟡 Attention Needed' : '🟢 Normal Range'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">{rep.testName}</h3>
                      <p className="text-xs text-slate-500">{rep.facilityName}</p>
                    </div>
                    <span className="material-symbols-outlined text-teal-700 text-2xl">
                      {rep.category === 'CARDIAC' ? 'monitor_heart' : rep.category === 'IMAGING' ? 'radiology' : 'science'}
                    </span>
                  </div>

                  {/* Key Test Values Table with Rural Explanations */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Observed Values (जांच के परिणाम):
                    </div>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                      {rep.keyValues.map((kv, i) => (
                        <div key={i} className={`p-2.5 flex items-center justify-between ${kv.isAbnormal ? 'bg-amber-50/70' : 'bg-white'}`}>
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 block">{kv.parameter}</span>
                            <span className="text-[10px] text-slate-400">Normal: {kv.normalRange}</span>
                          </div>
                          <div className="text-right">
                            <span className={`font-mono font-bold text-xs ${kv.isAbnormal ? 'text-amber-800' : 'text-slate-800'}`}>
                              {kv.value}
                            </span>
                            {kv.isAbnormal && (
                              <span className="block text-[10px] text-rose-600 font-bold">Outside Range</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {rep.doctorRemarks && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      📋 <strong>Doctor Remarks:</strong> {rep.doctorRemarks}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3 Content: Check-ups & ASHA Timeline */}
      {activeSubTab === 'checkups' && (
        <div className="space-y-4">
          {selectedMember?.checkups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-400">calendar_month</span>
              <p className="text-sm font-bold text-slate-700">No scheduled check-ups</p>
              <p className="text-xs text-slate-500">Schedule regular blood pressure, sugar, or ASHA home visits.</p>
              <button
                type="button"
                onClick={() => setShowAddCheckupModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-sm"
              >
                + Schedule Next Check-up
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedMember?.checkups.map((chk) => {
                const isCompleted = chk.status === 'COMPLETED';
                return (
                  <div
                    key={chk.id}
                    className={`bg-white rounded-2xl border p-4.5 flex flex-wrap items-center justify-between gap-4 transition shadow-xs ${
                      isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleCheckup(chk.id, chk.status)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border-2 border-slate-300 text-slate-400 hover:border-teal-700 hover:text-teal-700 bg-white'
                        }`}
                        title={isCompleted ? 'Click to mark as pending' : 'Click to mark completed'}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {isCompleted ? 'check' : 'radio_button_unchecked'}
                        </span>
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {chk.title}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            chk.type === 'ASHA_HOME_VISIT'
                              ? 'bg-purple-100 text-purple-900'
                              : chk.type === 'SPECIALIST_CLINIC'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-teal-100 text-teal-900'
                          }`}>
                            {chk.type === 'ASHA_HOME_VISIT' ? 'आशा कार्यकर्ता मुलाकात' : 'अस्पताल जांच'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {chk.facilityOrAsha} • <strong className="text-teal-900 font-bold">{chk.date}</strong>
                        </p>
                        {chk.notes && (
                          <p className="text-[11px] text-slate-600 mt-1 italic">
                            {chk.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {isCompleted ? '✓ Completed (जांच पूरी)' : '⏰ Upcoming (प्रतीक्षित)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Add Family Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700">person_add</span>
                Add Family Member (नया सदस्य जोड़ें)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name (पूरा नाम) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meena Patil"
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Relation (रिश्ता)</label>
                  <select
                    value={newMemberForm.relation}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, relation: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  >
                    <option value="Self">Self (स्वयं)</option>
                    <option value="Spouse">Spouse (पति / पत्नी)</option>
                    <option value="Mother">Mother (माताजी)</option>
                    <option value="Father">Father (पिताजी)</option>
                    <option value="Child">Child (बच्चा / संतान)</option>
                    <option value="Other">Other (अन्य)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age (उम्र)</label>
                  <input
                    type="number"
                    placeholder="e.g. 42"
                    value={newMemberForm.age}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, age: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender (लिंग)</label>
                  <select
                    value={newMemberForm.gender}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, gender: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  >
                    <option value="Female">Female (महिला)</option>
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group (रक्त समूह)</label>
                  <input
                    type="text"
                    placeholder="e.g. B+, O+, AB+"
                    value={newMemberForm.bloodGroup}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, bloodGroup: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Chronic Illnesses (पुरानी बीमारी, यदि कोई हो)</label>
                <input
                  type="text"
                  placeholder="e.g. Diabetes, High BP, Asthma"
                  value={newMemberForm.chronicConditions}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, chronicConditions: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm"
                >
                  Save Member (सुरक्षित करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Prescription Slip */}
      {showAddRxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700">receipt_long</span>
                Add Doctor Prescription (पर्ची जोड़ें)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRxModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Name (डॉक्टर का नाम) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Deshmukh (Civil Hospital)"
                  value={newRxForm.doctorName}
                  onChange={(e) => setNewRxForm({ ...newRxForm, doctorName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic (अस्पताल)</label>
                <input
                  type="text"
                  placeholder="e.g. Achalpur Sub-District Hospital"
                  value={newRxForm.facilityName}
                  onChange={(e) => setNewRxForm({ ...newRxForm, facilityName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Diagnosis (रोग विवरण)</label>
                <input
                  type="text"
                  placeholder="e.g. Seasonal Cough & Fever"
                  value={newRxForm.diagnosis}
                  onChange={(e) => setNewRxForm({ ...newRxForm, diagnosis: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medicine Name (दवाई)</label>
                  <input
                    type="text"
                    placeholder="e.g. Tab. Paracetamol 650mg"
                    value={newRxForm.medName}
                    onChange={(e) => setNewRxForm({ ...newRxForm, medName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frequency (खुराक)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1-0-1 (सुबह-रात)"
                    value={newRxForm.frequency}
                    onChange={(e) => setNewRxForm({ ...newRxForm, frequency: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRxModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm"
                >
                  Save Slip (पर्ची सुरक्षित करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Lab Report */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700">science</span>
                Add Diagnostic Report (जांच रिपोर्ट जोड़ें)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddReportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Test Name (जांच का नाम) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Blood Count (CBC) or Fasting Blood Sugar"
                  value={newReportForm.testName}
                  onChange={(e) => setNewReportForm({ ...newReportForm, testName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category (प्रकार)</label>
                  <select
                    value={newReportForm.category}
                    onChange={(e) => setNewReportForm({ ...newReportForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  >
                    <option value="BLOOD">Blood Test (रक्त जांच)</option>
                    <option value="CARDIAC">Cardiac ECG (ईसीजी)</option>
                    <option value="IMAGING">X-Ray / Scan (एक्स-रे)</option>
                    <option value="URINE">Urine Routine (पेशाब जांच)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status (परिणाम)</label>
                  <select
                    value={newReportForm.summaryStatus}
                    onChange={(e) => setNewReportForm({ ...newReportForm, summaryStatus: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  >
                    <option value="NORMAL">🟢 Normal (सामान्य)</option>
                    <option value="ATTENTION">🟡 Attention Needed (ध्यान दें)</option>
                    <option value="CRITICAL">🔴 Critical (गंभीर)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parameter</label>
                  <input
                    type="text"
                    placeholder="e.g. Hemoglobin"
                    value={newReportForm.paramName}
                    onChange={(e) => setNewReportForm({ ...newReportForm, paramName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Observed Value</label>
                  <input
                    type="text"
                    placeholder="e.g. 9.8 g/dL"
                    value={newReportForm.paramValue}
                    onChange={(e) => setNewReportForm({ ...newReportForm, paramValue: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Normal Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 12-15"
                    value={newReportForm.paramRange}
                    onChange={(e) => setNewReportForm({ ...newReportForm, paramRange: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Remarks (टिप्पणी)</label>
                <input
                  type="text"
                  placeholder="e.g. Take iron tablets, repeat test in 30 days"
                  value={newReportForm.doctorRemarks}
                  onChange={(e) => setNewReportForm({ ...newReportForm, doctorRemarks: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm"
                >
                  Save Report (रिपोर्ट सुरक्षित करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Schedule Checkup */}
      {showAddCheckupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700">calendar_add_on</span>
                Schedule Routine Check-up (जांच तय करें)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCheckupModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCheckup} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Check-up Title (जांच का विषय) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Blood Pressure & Sugar Checkup"
                  value={newCheckupForm.title}
                  onChange={(e) => setNewCheckupForm({ ...newCheckupForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date (तारीख) *</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Nov 2026"
                    value={newCheckupForm.date}
                    onChange={(e) => setNewCheckupForm({ ...newCheckupForm, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Visit Type (प्रकार)</label>
                  <select
                    value={newCheckupForm.type}
                    onChange={(e) => setNewCheckupForm({ ...newCheckupForm, type: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  >
                    <option value="ASHA_HOME_VISIT">ASHA Home Visit (घर पर मुलाकात)</option>
                    <option value="PHC_VISIT">PHC Visit (स्वास्थ्य केंद्र)</option>
                    <option value="SPECIALIST_CLINIC">Hospital Clinic (अस्पताल)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Health Worker / Facility</label>
                <input
                  type="text"
                  placeholder="e.g. Kavita Meshram (ASHA Worker #7702)"
                  value={newCheckupForm.facilityOrAsha}
                  onChange={(e) => setNewCheckupForm({ ...newCheckupForm, facilityOrAsha: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Instructions / Notes (टिप्पणी)</label>
                <input
                  type="text"
                  placeholder="e.g. Fasting before test, keep BP log ready"
                  value={newCheckupForm.notes}
                  onChange={(e) => setNewCheckupForm({ ...newCheckupForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCheckupModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm"
                >
                  Schedule (तय करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Printable / Shareable Rural Health Card */}
      {showPrintModal && selectedMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">National Rural Health Card (स्वास्थ्य पत्र)</h3>
                  <p className="text-[11px] text-slate-500">Ilaaj Track • Government of India Ayushman Linked</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Health Card Preview */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-teal-950 block">{selectedMember.name}</span>
                  <span className="text-xs text-teal-700 font-medium">
                    {selectedMember.relation} • {selectedMember.age} Yrs • {selectedMember.gender}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-teal-700 text-white font-bold text-xs">
                  Blood: {selectedMember.bloodGroup}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-3 rounded-xl border border-teal-100">
                <div>
                  <span className="text-slate-400 block">ABHA ID:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedMember.abhaId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Village Block:</span>
                  <span className="font-semibold text-slate-800">{selectedMember.village}</span>
                </div>
              </div>

              <div className="text-[11px] space-y-1">
                <span className="font-bold text-slate-600 block">Chronic Conditions:</span>
                <span className="text-slate-800 font-medium">
                  {selectedMember.chronicConditions.join(', ') || 'None recorded'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Current Active Medications:</span>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {selectedMember.prescriptions.flatMap(p => p.medicines).slice(0, 4).map((med, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{med.name}</span>
                    <span className="text-teal-800 font-bold">{med.frequency}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">print</span>
                Print Health Slip (प्रिंट करें)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
