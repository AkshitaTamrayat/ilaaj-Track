import React, { useState, useEffect, useRef } from 'react';
import type { FamilyMember, PrescriptionMedicine, LabParameter } from '../types';
import { fetchFamilyMembers, addFamilyMember, addPrescription, addLabReport, addCheckup, toggleCheckup, runPrescriptionOCR, runLabReportOCR } from '../services/api';
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
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // OCR Analysis loading states
  const [isAnalyzingRx, setIsAnalyzingRx] = useState<boolean>(false);
  const [rxOcrSuccess, setRxOcrSuccess] = useState<boolean>(false);
  const [rxImagePreview, setRxImagePreview] = useState<string | null>(null);

  const [isAnalyzingReport, setIsAnalyzingReport] = useState<boolean>(false);
  const [reportOcrSuccess, setReportOcrSuccess] = useState<boolean>(false);
  const [reportImagePreview, setReportImagePreview] = useState<string | null>(null);

  const rxFileInputRef = useRef<HTMLInputElement>(null);
  const reportFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    relation: 'Spouse' as const,
    age: '',
    gender: 'Female' as const,
    bloodGroup: 'B+',
    contactNumber: '',
    chronicConditions: '',
    village: 'Semadoh Village'
  });

  // Prescription form with editable medicines list
  const [newRxForm, setNewRxForm] = useState({
    doctorName: '',
    facilityName: '',
    contactNumber: '',
    diagnosis: '',
    notes: '',
    investigations: ''
  });

  const [rxMedicinesList, setRxMedicinesList] = useState<PrescriptionMedicine[]>([
    { name: '', dosage: '', frequency: '1-0-1 (सुबह-रात)', duration: '15 Days', instructions: 'After food' }
  ]);

  // Lab Report form with editable parameters list
  const [newReportForm, setNewReportForm] = useState({
    testName: '',
    category: 'BLOOD' as const,
    facilityName: '',
    contactNumber: '',
    summaryStatus: 'NORMAL' as const,
    doctorRemarks: ''
  });

  const [reportKeyValuesList, setReportKeyValuesList] = useState<LabParameter[]>([
    { parameter: '', value: '', normalRange: '', isAbnormal: false }
  ]);

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

  // ==========================================
  // OCR Photo Handlers
  // ==========================================

  const handleScanPrescriptionPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local image preview
    const reader = new FileReader();
    reader.onload = () => {
      setRxImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsAnalyzingRx(true);
    setRxOcrSuccess(false);

    try {
      const res = await runPrescriptionOCR(file);
      if (res && res.result) {
        const ocr = res.result;
        setNewRxForm({
          doctorName: ocr.detectedDoctor || '',
          facilityName: ocr.facilityName || 'District Hospital / Community Clinic',
          contactNumber: ocr.contactNumber || '+91 721 266 2300',
          diagnosis: ocr.diagnosis || 'Clinical Consultation',
          notes: ocr.doctorNotes || 'Take medications regularly and follow diet instructions.',
          investigations: Array.isArray(ocr.prescribedInvestigations) ? ocr.prescribedInvestigations.join(', ') : ''
        });

        if (Array.isArray(ocr.prescribedMedicines) && ocr.prescribedMedicines.length > 0) {
          const parsedMeds: PrescriptionMedicine[] = ocr.prescribedMedicines.map((m: any) => {
            if (typeof m === 'string') {
              return {
                name: m,
                dosage: 'Standard',
                frequency: '1-0-1 (सुबह-रात)',
                duration: '15 Days',
                instructions: 'Take after meals'
              };
            }
            return {
              name: m.name || 'Prescribed Medicine',
              dosage: m.dosage || 'Standard',
              frequency: m.frequency || '1-0-1 (सुबह-रात)',
              duration: m.duration || '15 Days',
              instructions: m.instructions || 'Take with water'
            };
          });
          setRxMedicinesList(parsedMeds);
        }

        setRxOcrSuccess(true);
        confetti({ particleCount: 40, spread: 50 });
      }
    } finally {
      setIsAnalyzingRx(false);
    }
  };

  const handleScanReportPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local image preview
    const reader = new FileReader();
    reader.onload = () => {
      setReportImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsAnalyzingReport(true);
    setReportOcrSuccess(false);

    try {
      const res = await runLabReportOCR(file);
      if (res && res.result) {
        const ocr = res.result;
        setNewReportForm({
          testName: ocr.testName || 'Diagnostic Lab Investigation',
          category: ocr.category || 'BLOOD',
          facilityName: ocr.facilityName || 'District Hospital Diagnostic Laboratory',
          contactNumber: ocr.contactNumber || '+91 721 266 2304',
          summaryStatus: ocr.summaryStatus || 'NORMAL',
          doctorRemarks: ocr.doctorRemarks || 'All values verified by attending pathologist.'
        });

        if (Array.isArray(ocr.keyValues) && ocr.keyValues.length > 0) {
          setReportKeyValuesList(ocr.keyValues);
        }

        setReportOcrSuccess(true);
        confetti({ particleCount: 40, spread: 50 });
      }
    } finally {
      setIsAnalyzingReport(false);
    }
  };

  // Medicine list modifiers
  const handleAddMedicineRow = () => {
    setRxMedicinesList([
      ...rxMedicinesList,
      { name: '', dosage: '', frequency: '1-0-1 (सुबह-रात)', duration: '15 Days', instructions: 'After meals' }
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    setRxMedicinesList(rxMedicinesList.filter((_, i) => i !== index));
  };

  const handleUpdateMedicineRow = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    const updated = [...rxMedicinesList];
    updated[index] = { ...updated[index], [field]: value };
    setRxMedicinesList(updated);
  };

  // Parameter list modifiers
  const handleAddParameterRow = () => {
    setReportKeyValuesList([
      ...reportKeyValuesList,
      { parameter: '', value: '', normalRange: '', isAbnormal: false }
    ]);
  };

  const handleRemoveParameterRow = (index: number) => {
    setReportKeyValuesList(reportKeyValuesList.filter((_, i) => i !== index));
  };

  const handleUpdateParameterRow = (index: number, field: keyof LabParameter, value: any) => {
    const updated = [...reportKeyValuesList];
    updated[index] = { ...updated[index], [field]: value };
    setReportKeyValuesList(updated);
  };

  // ==========================================
  // Form Submission Handlers
  // ==========================================

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name.trim()) return;

    // Strictly positive age clamp
    const safeAge = Math.max(0, Math.min(125, parseInt(newMemberForm.age, 10) || 0));

    const res = await addFamilyMember({
      ...newMemberForm,
      age: safeAge,
      contactNumber: newMemberForm.contactNumber || '+91 98765 43210',
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
        contactNumber: '',
        chronicConditions: '',
        village: 'Semadoh Village'
      });
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const filteredMeds = rxMedicinesList.filter(m => m.name.trim().length > 0);
    const res = await addPrescription(selectedMember.id, {
      doctorName: newRxForm.doctorName || 'Attending Doctor',
      facilityName: newRxForm.facilityName || 'Primary Health Center',
      contactNumber: newRxForm.contactNumber,
      diagnosis: newRxForm.diagnosis || 'General Consultation',
      medicines: filteredMeds.length > 0 ? filteredMeds : [
        { name: 'Tab. Paracetamol 650mg', dosage: '650mg', frequency: '1-0-1', duration: '5 Days' }
      ],
      investigations: newRxForm.investigations ? newRxForm.investigations.split(',').map(s => s.trim()) : [],
      notes: newRxForm.notes,
      imageUrl: rxImagePreview || undefined
    });

    if (res && res.success) {
      confetti({ particleCount: 40, spread: 50 });
      await loadMembers();
      setShowAddRxModal(false);
      setRxImagePreview(null);
      setRxOcrSuccess(false);
      setNewRxForm({
        doctorName: '',
        facilityName: '',
        contactNumber: '',
        diagnosis: '',
        notes: '',
        investigations: ''
      });
      setRxMedicinesList([
        { name: '', dosage: '', frequency: '1-0-1 (सुबह-रात)', duration: '15 Days', instructions: 'After food' }
      ]);
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const filteredParams = reportKeyValuesList.filter(p => p.parameter.trim().length > 0);
    const res = await addLabReport(selectedMember.id, {
      testName: newReportForm.testName || 'Diagnostic Investigation',
      category: newReportForm.category,
      facilityName: newReportForm.facilityName || 'District Hospital Diagnostic Lab',
      contactNumber: newReportForm.contactNumber,
      summaryStatus: newReportForm.summaryStatus,
      keyValues: filteredParams.length > 0 ? filteredParams : [
        { parameter: 'Observed Parameter', value: 'Normal', normalRange: 'Standard', isAbnormal: false }
      ],
      doctorRemarks: newReportForm.doctorRemarks || 'Verified by attending medical officer.',
      imageUrl: reportImagePreview || undefined
    });

    if (res && res.success) {
      confetti({ particleCount: 40, spread: 50 });
      await loadMembers();
      setShowAddReportModal(false);
      setReportImagePreview(null);
      setReportOcrSuccess(false);
      setNewReportForm({
        testName: '',
        category: 'BLOOD',
        facilityName: '',
        contactNumber: '',
        summaryStatus: 'NORMAL',
        doctorRemarks: ''
      });
      setReportKeyValuesList([
        { parameter: '', value: '', normalRange: '', isAbnormal: false }
      ]);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Ilaaj Track Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-xs border border-teal-100 bg-white shrink-0"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Family Health Vault (परिवार स्वास्थ्य खाता)
            </h1>
            <p className="text-xs text-slate-500">
              AI Photo Scanner • Prescription Slips • Lab Reports • Contact Helpline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowPrintModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs cursor-pointer transition active:scale-95"
          >
            <span className="material-symbols-outlined text-base text-teal-700">print</span>
            Health Card
          </button>
          <button
            type="button"
            onClick={() => setShowAddMemberModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            + Add Member
          </button>
        </div>
      </div>

      {/* Family Member Switcher Horizontal Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-teal-700 text-base">groups</span>
            Select Family Member (परिवार का सदस्य चुनें)
          </span>
          <span className="text-[11px] text-teal-800 font-semibold lowercase">
            {members.length} members
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
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
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-2xl text-white p-4 sm:p-6 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-inner shrink-0">
                <span className="material-symbols-outlined text-2xl sm:text-3xl">
                  {selectedMember.gender === 'Female' ? 'face_3' : 'face'}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight">
                    {selectedMember.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-teal-400 text-teal-950">
                    {selectedMember.relation} • {selectedMember.age} Yrs
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-teal-100">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">badge</span>
                    ABHA ID: <strong className="font-mono text-white">{selectedMember.abhaId}</strong>
                  </span>
                  <span>•</span>
                  <span>Blood: <strong className="text-white">{selectedMember.bloodGroup}</strong></span>
                  <span>•</span>
                  <span>{selectedMember.village}</span>
                  {selectedMember.contactNumber && (
                    <>
                      <span>•</span>
                      <a href={`tel:${selectedMember.contactNumber}`} className="flex items-center gap-1 text-teal-200 hover:text-white underline">
                        <span className="material-symbols-outlined text-xs">call</span>
                        {selectedMember.contactNumber}
                      </a>
                    </>
                  )}
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
            <div className="flex items-center justify-around sm:justify-start gap-2 sm:gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/15 w-full md:w-auto">
              <div className="text-center px-2 sm:px-3">
                <div className="text-base sm:text-lg font-bold text-white">{selectedMember.prescriptions.length}</div>
                <div className="text-[10px] text-teal-200">Slips (पर्ची)</div>
              </div>
              <div className="w-px h-7 bg-white/20"></div>
              <div className="text-center px-2 sm:px-3">
                <div className="text-base sm:text-lg font-bold text-white">{selectedMember.labReports.length}</div>
                <div className="text-[10px] text-teal-200">Reports (रिपोर्ट)</div>
              </div>
              <div className="w-px h-7 bg-white/20"></div>
              <div className="text-center px-2 sm:px-3">
                <div className="text-base sm:text-lg font-bold text-white">{selectedMember.checkups.length}</div>
                <div className="text-[10px] text-teal-200">Checkups (जांच)</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Sub-Tabs: Prescriptions, Reports, Check-ups */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('prescriptions')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 border-b-2 font-bold text-xs transition cursor-pointer shrink-0 ${
              activeSubTab === 'prescriptions'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg">prescriptions</span>
            <span>Doctor Slips (दवाई पर्ची)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {selectedMember?.prescriptions.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('reports')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 border-b-2 font-bold text-xs transition cursor-pointer shrink-0 ${
              activeSubTab === 'reports'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg">lab_profile</span>
            <span>Lab Reports (जांच रिपोर्ट्स)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {selectedMember?.labReports.length || 0}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('checkups')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 border-b-2 font-bold text-xs transition cursor-pointer shrink-0 ${
              activeSubTab === 'checkups'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-base sm:text-lg">event_available</span>
            <span>Check-ups (नियमित जांच)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {selectedMember?.checkups.length || 0}
            </span>
          </button>
        </div>

        {/* Tab specific action buttons */}
        <div className="w-full sm:w-auto pb-2 sm:pb-0">
          {activeSubTab === 'prescriptions' && (
            <button
              type="button"
              onClick={() => {
                setShowAddRxModal(true);
                setRxOcrSuccess(false);
                setRxImagePreview(null);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
            >
              <span className="material-symbols-outlined text-base">photo_camera</span>
              📸 Scan / Add Prescription (पर्ची फोटो लें)
            </button>
          )}

          {activeSubTab === 'reports' && (
            <button
              type="button"
              onClick={() => {
                setShowAddReportModal(true);
                setReportOcrSuccess(false);
                setReportImagePreview(null);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
            >
              <span className="material-symbols-outlined text-base">photo_camera</span>
              📸 Scan / Add Report (रिपोर्ट फोटो लें)
            </button>
          )}

          {activeSubTab === 'checkups' && (
            <button
              type="button"
              onClick={() => setShowAddCheckupModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition active:scale-95"
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
              <p className="text-xs text-slate-500">Take a photo of your paper slip or upload doctor prescriptions.</p>
              <button
                type="button"
                onClick={() => setShowAddRxModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-sm"
              >
                📸 Scan / Upload Prescription Slip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMember?.prescriptions.map((rx) => (
                <div key={rx.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-teal-300 transition flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                            Date: {rx.date}
                          </span>
                          {rx.imageUrl && (
                            <button
                              type="button"
                              onClick={() => setLightboxImageUrl(rx.imageUrl || null)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-white border border-teal-200 px-2 py-0.5 rounded hover:bg-teal-50 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">image</span>
                              View Original Photo (मूल पर्ची देखें)
                            </button>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{rx.doctorName}</h3>
                        <p className="text-xs text-slate-500">{rx.facilityName}</p>
                        {rx.contactNumber && (
                          <div className="pt-0.5">
                            <a
                              href={`tel:${rx.contactNumber}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50/70 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition"
                            >
                              <span className="material-symbols-outlined text-xs text-teal-700">call</span>
                              Call Clinic: {rx.contactNumber}
                            </a>
                          </div>
                        )}
                      </div>
                      <span className="material-symbols-outlined text-teal-700 text-2xl">receipt_long</span>
                    </div>

                    <div className="space-y-1.5">
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
              <p className="text-xs text-slate-500">Take a photo of your test paper or report slip to analyze and store.</p>
              <button
                type="button"
                onClick={() => setShowAddReportModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-sm"
              >
                📸 Scan / Add Lab Report
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedMember?.labReports.map((rep) => (
                <div key={rep.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-teal-300 transition flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
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
                          {rep.imageUrl && (
                            <button
                              type="button"
                              onClick={() => setLightboxImageUrl(rep.imageUrl || null)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-white border border-teal-200 px-2 py-0.5 rounded hover:bg-teal-50 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">image</span>
                              View Photo (फोटो देखें)
                            </button>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{rep.testName}</h3>
                        <p className="text-xs text-slate-500">{rep.facilityName}</p>
                        {rep.contactNumber && (
                          <div className="pt-0.5">
                            <a
                              href={`tel:${rep.contactNumber}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50/70 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition"
                            >
                              <span className="material-symbols-outlined text-xs text-teal-700">call</span>
                              Call Lab: {rep.contactNumber}
                            </a>
                          </div>
                        )}
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

      {/* ========================================================= */}
      {/* Modal 1: Add Family Member (With Strictly Non-Negative Age) */}
      {/* ========================================================= */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
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

                {/* Non-Negative Age Field with Strict Bounds */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age (उम्र - Positive Only) *</label>
                  <input
                    type="number"
                    min="0"
                    max="125"
                    step="1"
                    required
                    placeholder="e.g. 35"
                    value={newMemberForm.age}
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === '+' || e.key === 'e') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setNewMemberForm({ ...newMemberForm, age: '' });
                      } else {
                        const clamped = Math.max(0, Math.min(125, parseInt(val, 10) || 0));
                        setNewMemberForm({ ...newMemberForm, age: String(clamped) });
                      }
                    }}
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
                <label className="font-bold text-slate-700 block mb-1">Contact Phone Number (मोबाइल नंबर)</label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={newMemberForm.contactNumber}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, contactNumber: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                />
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

      {/* ========================================================================= */}
      {/* Modal 2: Add / Scan Prescription Slip (Photo OCR + Fully Editable Fields) */}
      {/* ========================================================================= */}
      {showAddRxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-4 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700">document_scanner</span>
                Prescription Slip Scanner & Entry (दवाई पर्ची स्कैनर)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddRxModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Photo Capture & AI OCR Scanner Box */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border-2 border-dashed border-teal-300 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-2xl">photo_camera</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-teal-950">Take a Photo of the Prescription Slip</h4>
                    <p className="text-[11px] text-teal-700">Gemini Vision AI automatically extracts Doctor, Clinic & Medicines</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={rxFileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleScanPrescriptionPhoto}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => rxFileInputRef.current?.click()}
                    disabled={isAnalyzingRx}
                    className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isAnalyzingRx ? 'sync' : 'add_a_photo'}
                    </span>
                    <span>{isAnalyzingRx ? 'Analyzing Photo...' : 'Snap / Upload Photo'}</span>
                  </button>
                </div>
              </div>

              {/* Progress or Success Indicator */}
              {isAnalyzingRx && (
                <div className="p-2.5 rounded-xl bg-white border border-teal-200 flex items-center gap-2.5 text-xs text-teal-800 font-semibold animate-pulse">
                  <span className="material-symbols-outlined text-base animate-spin text-teal-700">progress_activity</span>
                  Analyzing prescription with Gemini Multimodal Vision... reading handwriting...
                </div>
              )}

              {rxOcrSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-center gap-2 text-xs text-emerald-900 font-bold">
                  <span className="material-symbols-outlined text-base text-emerald-700">check_circle</span>
                  ✓ AI extracted Doctor, Clinic, & Medicines! You can edit any details below before saving.
                </div>
              )}

              {rxImagePreview && (
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-teal-100">
                  <img src={rxImagePreview} alt="Slip Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                  <div className="text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800 block">Prescription Image Attached</span>
                    <span>This photo will be saved in your family records.</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Doctor Name (डॉक्टर का नाम) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. S. K. Deshmukh"
                    value={newRxForm.doctorName}
                    onChange={(e) => setNewRxForm({ ...newRxForm, doctorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinic / Hospital (अस्पताल या क्लीनिक)</label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Hospital Amravati"
                    value={newRxForm.facilityName}
                    onChange={(e) => setNewRxForm({ ...newRxForm, facilityName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone Number (डॉक्टर / अस्पताल संपर्क)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 721 266 2300"
                    value={newRxForm.contactNumber}
                    onChange={(e) => setNewRxForm({ ...newRxForm, contactNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Diagnosis (रोग / स्थिति)</label>
                  <input
                    type="text"
                    placeholder="e.g. High BP & Diabetes Follow-up"
                    value={newRxForm.diagnosis}
                    onChange={(e) => setNewRxForm({ ...newRxForm, diagnosis: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800"
                  />
                </div>
              </div>

              {/* Editable Medicines List */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Prescribed Medicines (पहचानी गई दवाइयां - संपादित करें)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-teal-700 hover:text-teal-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    + Add Medicine (दवाई जोड़ें)
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {rxMedicinesList.map((med, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <div className="w-full sm:flex-1">
                          <input
                            type="text"
                            placeholder="Medicine Name (e.g. Tab. Telmisartan)"
                            value={med.name}
                            onChange={(e) => handleUpdateMedicineRow(idx, 'name', e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                          />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            placeholder="Dosage (40mg)"
                            value={med.dosage}
                            onChange={(e) => handleUpdateMedicineRow(idx, 'dosage', e.target.value)}
                            className="w-1/2 sm:w-28 p-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                          />
                          <input
                            type="text"
                            placeholder="Duration (30 Days)"
                            value={med.duration}
                            onChange={(e) => handleUpdateMedicineRow(idx, 'duration', e.target.value)}
                            className="w-1/2 sm:w-28 p-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                          />
                          {rxMedicinesList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicineRow(idx)}
                              className="text-rose-500 hover:text-rose-700 p-1.5 shrink-0"
                              title="Delete row"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Frequency (e.g. 1-0-1 सुबह-रात)"
                          value={med.frequency}
                          onChange={(e) => handleUpdateMedicineRow(idx, 'frequency', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="Instructions (e.g. After breakfast with warm water)"
                          value={med.instructions || ''}
                          onChange={(e) => handleUpdateMedicineRow(idx, 'instructions', e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ordered Diagnostic Tests (जांच के आदेश)</label>
                <input
                  type="text"
                  placeholder="e.g. Fasting Sugar, ECG, Lipid Profile"
                  value={newRxForm.investigations}
                  onChange={(e) => setNewRxForm({ ...newRxForm, investigations: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Remarks / Dietary Advice</label>
                <input
                  type="text"
                  placeholder="e.g. Avoid salt and fried food, walk daily"
                  value={newRxForm.notes}
                  onChange={(e) => setNewRxForm({ ...newRxForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRxModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm cursor-pointer active:scale-95 transition"
                >
                  Save Prescription (पर्ची सुरक्षित करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal 3: Add / Scan Lab Report (Photo OCR + Fully Editable Fields) */}
      {/* ========================================================================= */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-4 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700">science</span>
                Diagnostic Lab Report Scanner & Entry (जांच रिपोर्ट स्कैनर)
              </h3>
              <button
                type="button"
                onClick={() => setShowAddReportModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Photo Capture & AI OCR Scanner Box for Lab Reports */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border-2 border-dashed border-teal-300 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-2xl">document_scanner</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-teal-950">Snap a Photo of the Lab / Test Report</h4>
                    <p className="text-[11px] text-teal-700">Gemini Vision AI extracts parameters, values, and normal ranges</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={reportFileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleScanReportPhoto}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => reportFileInputRef.current?.click()}
                    disabled={isAnalyzingReport}
                    className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isAnalyzingReport ? 'sync' : 'add_a_photo'}
                    </span>
                    <span>{isAnalyzingReport ? 'Reading Report...' : 'Snap / Upload Report'}</span>
                  </button>
                </div>
              </div>

              {isAnalyzingReport && (
                <div className="p-2.5 rounded-xl bg-white border border-teal-200 flex items-center gap-2.5 text-xs text-teal-800 font-semibold animate-pulse">
                  <span className="material-symbols-outlined text-base animate-spin text-teal-700">progress_activity</span>
                  Analyzing report with Gemini Vision OCR... reading lab values...
                </div>
              )}

              {reportOcrSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 flex items-center gap-2 text-xs text-emerald-900 font-bold">
                  <span className="material-symbols-outlined text-base text-emerald-700">check_circle</span>
                  ✓ AI extracted test parameters and findings! You can review or edit below.
                </div>
              )}

              {reportImagePreview && (
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-teal-100">
                  <img src={reportImagePreview} alt="Report Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                  <div className="text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800 block">Report Document Attached</span>
                    <span>This photo will be saved in your family records.</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Test Name (जांच का नाम) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Blood Count (CBC)"
                    value={newReportForm.testName}
                    onChange={(e) => setNewReportForm({ ...newReportForm, testName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lab / Diagnostic Center (प्रयोगशाला)</label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Hospital Pathology Lab"
                    value={newReportForm.facilityName}
                    onChange={(e) => setNewReportForm({ ...newReportForm, facilityName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category (प्रकार)</label>
                  <select
                    value={newReportForm.category}
                    onChange={(e) => setNewReportForm({ ...newReportForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  >
                    <option value="BLOOD">Blood Test (रक्त जांच)</option>
                    <option value="CARDIAC">Cardiac ECG (ईसीजी)</option>
                    <option value="IMAGING">X-Ray / Scan (एक्स-रे)</option>
                    <option value="URINE">Urine Routine (पेशाब जांच)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Result Status (स्थिति)</label>
                  <select
                    value={newReportForm.summaryStatus}
                    onChange={(e) => setNewReportForm({ ...newReportForm, summaryStatus: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  >
                    <option value="NORMAL">🟢 Normal (सामान्य)</option>
                    <option value="ATTENTION">🟡 Attention Needed (ध्यान दें)</option>
                    <option value="CRITICAL">🔴 Critical (गंभीर)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lab Contact Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 721 266 2304"
                    value={newReportForm.contactNumber}
                    onChange={(e) => setNewReportForm({ ...newReportForm, contactNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              {/* Editable Test Parameters List */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Test Parameters & Observed Values (पैरामीटर और परिणाम)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddParameterRow}
                    className="text-teal-700 hover:text-teal-900 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    + Add Parameter (पैरामीटर जोड़ें)
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {reportKeyValuesList.map((param, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                        <input
                          type="text"
                          placeholder="Parameter (e.g. Hemoglobin)"
                          value={param.parameter}
                          onChange={(e) => handleUpdateParameterRow(idx, 'parameter', e.target.value)}
                          className="w-full sm:flex-1 p-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                        />
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            placeholder="Value (e.g. 11.2 g/dL)"
                            value={param.value}
                            onChange={(e) => handleUpdateParameterRow(idx, 'value', e.target.value)}
                            className="w-1/2 sm:w-28 p-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                          />
                          <input
                            type="text"
                            placeholder="Normal (12 - 15)"
                            value={param.normalRange}
                            onChange={(e) => handleUpdateParameterRow(idx, 'normalRange', e.target.value)}
                            className="w-1/2 sm:w-28 p-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-800"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-rose-700 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                            checked={param.isAbnormal || false}
                            onChange={(e) => handleUpdateParameterRow(idx, 'isAbnormal', e.target.checked)}
                          />
                          <span>Abnormal / Out of Range (असामान्य)</span>
                        </label>
                        {reportKeyValuesList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveParameterRow(idx)}
                            className="text-rose-500 hover:text-rose-700 p-1 flex items-center gap-1 text-xs"
                            title="Remove parameter"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            <span className="text-[11px]">Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Doctor Remarks (डॉक्टर की टिप्पणी)</label>
                <input
                  type="text"
                  placeholder="e.g. Normal findings, repeat test in 30 days"
                  value={newReportForm.doctorRemarks}
                  onChange={(e) => setNewReportForm({ ...newReportForm, doctorRemarks: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm cursor-pointer active:scale-95 transition"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
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
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 sm:space-y-5 my-auto max-h-[92vh] overflow-y-auto">
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

      {/* Lightbox Image Preview Modal */}
      {lightboxImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4">
          <div className="max-w-3xl w-full bg-slate-900 rounded-3xl p-3 sm:p-4 space-y-3 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between text-white pb-2 border-b border-slate-800">
              <span className="text-xs font-bold">Original Medical Document / Slip Photo</span>
              <button
                type="button"
                onClick={() => setLightboxImageUrl(null)}
                className="text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-black/50 rounded-2xl p-2">
              <img src={lightboxImageUrl} alt="Full Resolution" className="max-w-full max-h-[65vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
