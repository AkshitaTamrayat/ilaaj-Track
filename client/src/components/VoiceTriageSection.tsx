import React, { useState } from 'react';
import { runVoiceTriage, runPrescriptionOCR } from '../services/api';
import confetti from 'canvas-confetti';

interface VoiceTriageSectionProps {
  onReferralCreated: (referralData: any) => void;
}

export const VoiceTriageSection: React.FC<VoiceTriageSectionProps> = ({ onReferralCreated }) => {
  const [spokenText, setSpokenText] = useState(
    'मरीज़ को सुबह से छाती में तेज़ दर्द है, पसीना आ रहा है और सांस लेने में दिक्कत है। BP 168/104 है, पल्स 112 है। सुबह 10:15 बजे Sorbitrate 5mg और Aspirin 300mg दे दी गई है...'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dispatched, setDispatched] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);

  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsRecording(!isRecording);
      return;
    }

    if (!isRecording) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN';
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
          if (transcript) {
            setSpokenText(transcript);
          }
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognition.start();
        setIsRecording(true);
      } catch {
        setIsRecording(!isRecording);
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleRunTriage = async () => {
    if (!spokenText.trim()) return;
    setLoading(true);
    try {
      const res = await runVoiceTriage(spokenText, 'hi');
      if (res && res.result) {
        setTriageResult(res.result);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await runPrescriptionOCR(file);
      if (res && res.result) {
        const triageRes = await runVoiceTriage(res.result.prescribedMedicines.join(', '), 'hi');
        setTriageResult(triageRes.result);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAndDispatch = () => {
    setDispatched(true);
    confetti({ particleCount: 75, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => {
      onReferralCreated({
        patientName: 'Ramesh K. Gurjar',
        age: 52,
        gender: 'Male',
        village: 'Rampur Village (Ward 4)',
        ashaWorker: 'Sunita Devi (ASHA-902)',
        presentingSymptoms: spokenText,
        vitals: triageResult?.extractedVitals || { bp: '168/104 mmHg', pulse: '112 bpm', spo2: '91%', bloodSugar: '210 mg/dL' },
        cdssSeverity: triageResult?.cdssSeverity || 'RED',
        suspectedCondition: triageResult?.suspectedCondition || 'Acute Coronary Syndrome / STEMI',
        requiredSpecialty: triageResult?.requiredSpecialty || 'Cardiology',
        careBundle: triageResult?.suggestedCareBundle || {
          consultation: 'Dr. Vikram Sen (Cardiologist on Duty)',
          diagnosticSlots: ['12-Lead ECG', 'Cardiac Troponin-I', 'Bedside 2D Echo'],
          transitToken: 'Ambulance #KA-04-E-108 (ALS)'
        },
        destinationFacilityId: 'fac-dh-amravati'
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb & Field Context Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Ilaaj Track Official Emblem"
            className="w-10 h-10 rounded-xl object-contain shadow-xs border border-teal-100 bg-white"
          />
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              Emergency Patient Triage & Intake (रोगी दाखिला)
            </h1>
            <p className="text-xs text-slate-500">
              Sub-Center Rampur • Attending ASHA Worker: Sunita Devi (#ASHA-902)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            District Hospital Gateway Connected
          </span>
        </div>
      </div>

      {/* Patient Header & Vitals Card (High-Contrast Daylight Friendly) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Patient Identity Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wide border border-rose-200">
                <span className="material-symbols-outlined text-sm">priority_high</span>
                Urgent Referral • Priority 1 (अति आवश्यक)
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                ABHA ID: 8921-4410-09
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900">Ramesh K. Gurjar</h2>
                <span className="text-base font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  52 yrs, Male
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-slate-400">home_pin</span>
                Rampur Village (Ward 4) • <strong className="text-slate-700 font-semibold">38 km to District Hospital</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                <span className="material-symbols-outlined text-sm text-amber-700">report</span>
                Reported Symptoms (मुख्य लक्षण):
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                Severe chest pain radiating to left shoulder and jaw, profuse cold sweating, difficulty breathing. Started ~95 minutes ago.
              </p>
            </div>
          </div>

          {/* Key Vitals Display (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              {/* Vital 1: BP */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase">Blood Pressure</span>
                  <span className="material-symbols-outlined text-rose-600 text-lg">monitor_heart</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-extrabold text-slate-900">168/104</span>
                  <span className="text-xs font-medium text-slate-500 block">mmHg</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 w-fit">
                  High (उच्च)
                </span>
              </div>

              {/* Vital 2: Pulse */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase">Pulse / Heart</span>
                  <span className="material-symbols-outlined text-amber-600 text-lg">favorite</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-extrabold text-slate-900">112</span>
                  <span className="text-xs font-medium text-slate-500 block">bpm</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 w-fit">
                  Fast (तेज़)
                </span>
              </div>

              {/* Vital 3: SpO2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase">Oxygen SpO2</span>
                  <span className="material-symbols-outlined text-rose-600 text-lg">air</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-extrabold text-slate-900">91%</span>
                  <span className="text-xs font-medium text-slate-500 block">Room Air</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 w-fit">
                  Low (कम O2)
                </span>
              </div>

              {/* Vital 4: Blood Sugar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-semibold uppercase">Blood Sugar</span>
                  <span className="material-symbols-outlined text-amber-600 text-lg">bloodtype</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl font-extrabold text-slate-900">210</span>
                  <span className="text-xs font-medium text-slate-500 block">mg/dL</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 w-fit">
                  Elevated
                </span>
              </div>

            </div>

            {/* Golden Hour Warning Strip */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900">
                <span className="material-symbols-outlined text-emerald-700 text-xl">timer</span>
                <span className="text-xs font-bold">Optimal Transfer Window (गोल्डन ऑवर):</span>
                <span className="text-xs font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  54 mins remaining
                </span>
              </div>
              <span className="text-xs font-medium text-emerald-800">Oxygen Cylinder Ready on site</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Operational Modules: Voice Intake & Prescription Digitizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Module 1: Friendly Voice Dictation & Symptom Extraction (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">mic</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Voice Symptom Intake (आवाज़ से विवरण)</h3>
                  <p className="text-xs text-slate-500">Speak naturally in Hindi or local language</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Microphone Active
              </span>
            </div>

            {/* Voice Dictation Interactive Strip */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-sm cursor-pointer ${
                      isRecording ? 'bg-teal-700 text-white hover:bg-teal-800' : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {isRecording ? 'mic' : 'mic_off'}
                    </span>
                  </button>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">
                      Recording in Hindi • Voice Assistant
                    </span>
                    <span className="text-xs text-slate-500">
                      Tap microphone to pause or speak again
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-mono font-bold text-slate-700">
                  00:48 / Live
                </span>
              </div>

              {/* Calm Waveform Graphic */}
              <div className="h-8 w-full flex items-center justify-between gap-1 px-3 bg-white rounded-lg border border-slate-200">
                <div className="w-1.5 bg-teal-400 h-2 rounded-full"></div>
                <div className="w-1.5 bg-teal-600 h-4 rounded-full"></div>
                <div className="w-1.5 bg-teal-700 h-6 rounded-full"></div>
                <div className="w-1.5 bg-teal-500 h-3 rounded-full"></div>
                <div className="w-1.5 bg-teal-700 h-7 rounded-full"></div>
                <div className="w-1.5 bg-teal-500 h-4 rounded-full"></div>
                <div className="w-1.5 bg-teal-700 h-5 rounded-full"></div>
                <div className="w-1.5 bg-teal-600 h-6 rounded-full"></div>
                <div className="w-1.5 bg-teal-400 h-3 rounded-full"></div>
                <div className="w-1.5 bg-teal-700 h-7 rounded-full"></div>
                <div className="w-1.5 bg-teal-600 h-5 rounded-full"></div>
                <div className="w-1.5 bg-teal-500 h-4 rounded-full"></div>
                <div className="w-1.5 bg-teal-700 h-6 rounded-full"></div>
                <div className="w-1.5 bg-teal-600 h-3 rounded-full"></div>
                <div className="w-1.5 bg-teal-400 h-2 rounded-full"></div>
                <div className="w-1.5 bg-teal-600 h-5 rounded-full"></div>
                <div className="w-1.5 bg-teal-700 h-6 rounded-full"></div>
                <div className="w-1.5 bg-teal-500 h-3 rounded-full"></div>
                <div className="w-1.5 bg-teal-400 h-2 rounded-full"></div>
              </div>
            </div>

            {/* Spoken Audio Transcript */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Spoken Audio Transcript (बोली गई बातें)
              </label>
              <textarea
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed font-normal focus:outline-none focus:border-teal-700 focus:bg-white transition resize-none"
              />
            </div>

            {/* Identified Clinical Findings */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Identified Clinical Findings (पहचाने गए लक्षण)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-900">
                  <span className="material-symbols-outlined text-rose-600 text-xl shrink-0">emergency</span>
                  <div>
                    <span className="text-xs font-bold block">Suspected Heart Attack (STEMI)</span>
                    <span className="text-[11px] text-rose-700">Severe chest pain radiating to arm</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
                  <span className="material-symbols-outlined text-amber-600 text-xl shrink-0">air</span>
                  <div>
                    <span className="text-xs font-bold block">Low Oxygen Warning (91%)</span>
                    <span className="text-[11px] text-amber-800">Supportive Oxygen initiated in clinic</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-900 sm:col-span-2">
                  <span className="material-symbols-outlined text-emerald-600 text-xl shrink-0">medication</span>
                  <div>
                    <span className="text-xs font-bold block">First-Aid Given: Aspirin 300mg + Sorbitrate 5mg</span>
                    <span className="text-[11px] text-emerald-700">Given at 10:15 AM by ASHA • Confirmed recorded</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Micro-Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Protocol Matched: <strong className="text-teal-800 font-semibold">Tier-1 Cardiac Fast-Track</strong></span>
            <button
              onClick={handleRunTriage}
              disabled={loading}
              className="text-teal-700 font-semibold hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              {loading ? 'AI Analyzing...' : 'Re-analyze with Gemini'}
            </button>
          </div>
        </div>

        {/* Module 2: Prescription Slip Optical Scanner (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">document_scanner</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Doctor Prescription Slip</h3>
                  <p className="text-xs text-slate-500">डॉक्टर की पर्ची स्कैन</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                OCR Scanned
              </span>
            </div>

            {/* Scanned Slip Photo Card */}
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
              <img
                alt="Doctor prescription slip with scanned medicines"
                className="w-full h-44 object-cover"
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
              />
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                <label className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 hover:bg-white text-xs font-bold shadow-md flex items-center gap-1 border border-slate-200 cursor-pointer">
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  Upload Slip
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Scanned Medications List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Recognized Medicines from Slip
              </span>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Tab. Clopidogrel 300mg</span>
                    <span className="text-[11px] text-slate-500">Blood thinner loading dose • Confirmed</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Ready
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-amber-600 text-lg">schedule</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Inj. Fondaparinux 2.5mg SC</span>
                    <span className="text-[11px] text-slate-500">Anticoagulant injection • Hospital will administer</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                  Reserved
                </span>
              </div>
            </div>

            {/* Pre-Ordered Tests Pill tags */}
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200">
              <span className="text-[11px] font-bold uppercase text-teal-900 block mb-1.5">
                Pre-Ordered Tests at Hospital:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 rounded bg-white border border-teal-200 text-teal-800 text-xs font-semibold">
                  12-Lead ECG
                </span>
                <span className="px-2 py-1 rounded bg-white border border-teal-200 text-teal-800 text-xs font-semibold">
                  Cardiac Troponin-I
                </span>
                <span className="px-2 py-1 rounded bg-white border border-teal-200 text-teal-800 text-xs font-semibold">
                  Bedside 2D Echo
                </span>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Prescription digitized accurately</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span> Verified by ASHA
            </span>
          </div>
        </div>

      </div>

      {/* Module 3: 'One-Trip Care Bundle' Package Card (Clean Daylight Medical Card) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">bookmark_added</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                One-Trip Care Package (सिंगल-ट्रिप सुरक्षा टोकन)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                TOKEN #OTB-8834
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              All 4 critical hospital resources are pre-locked so the patient receives immediate treatment upon arrival with zero waiting time.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">verified</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-emerald-900">All 4 Care Nodes Verified</span>
              <span className="text-[11px] text-emerald-700">District Trauma Center Ready</span>
            </div>
          </div>
        </div>

        {/* 4 Step-by-Step Verified Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Step 1: Specialist */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">1. Cardiologist</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">check</span> Reserved
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Dr. Vikram Sen</h4>
              <p className="text-xs text-teal-700 font-semibold">Chief Cardiologist on Duty</p>
              <p className="text-[11px] text-slate-500 mt-1">Cath Lab Standby for 11:45 AM</p>
            </div>
            <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">notifications_active</span> Patient profile sent to doctor
            </div>
          </div>

          {/* Step 2: Diagnostics */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">2. Rapid Lab Slot</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">check</span> Ready
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Lab Bay C-04</h4>
              <p className="text-xs text-teal-700 font-semibold">ECG & Troponin-I Kit</p>
              <p className="text-[11px] text-slate-500 mt-1">Pre-calibrated testing kit ready</p>
            </div>
            <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span> 0-minute test queue
            </div>
          </div>

          {/* Step 3: Bed */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">3. Emergency Bed</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">check</span> Locked
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">CCU Bed #07 (Tower B)</h4>
              <p className="text-xs text-teal-700 font-semibold">Equipped with Oxygen & NIV</p>
              <p className="text-[11px] text-slate-500 mt-1">Reserved for next 2 hours</p>
            </div>
            <div className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">lock</span> Guaranteed admission
            </div>
          </div>

          {/* Step 4: Ambulance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">4. Ambulance (ALS)</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                <span className="material-symbols-outlined text-xs">near_me</span> En Route
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ambulance #KA-04-E-108</h4>
              <p className="text-xs text-teal-700 font-semibold">Paramedic: Devraj Singh</p>
              <p className="text-[11px] text-slate-500 mt-1">Reaching Rampur in 7 minutes</p>
            </div>
            <div className="text-[11px] font-medium text-teal-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">cell_tower</span> Live GPS tracking active
            </div>
          </div>

        </div>

        {/* Green Corridor Route Strip */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">route</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Green Corridor Clearance Active</h4>
              <p className="text-xs text-slate-500">Highway NH-48 toll gate alerted for priority ambulance pass</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
            <span>Rampur Sub-Center</span>
            <span className="material-symbols-outlined text-teal-600 text-sm">arrow_forward</span>
            <span>Toll Plaza 4</span>
            <span className="material-symbols-outlined text-teal-600 text-sm">arrow_forward</span>
            <span className="text-teal-800 font-bold">District Trauma Hospital</span>
            <span className="px-2 py-1 rounded bg-teal-100 text-teal-900 font-bold ml-2">~32 mins transit</span>
          </div>
        </div>

        {/* Primary Dispatch Action & Support Banner */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="material-symbols-outlined text-emerald-600 text-lg">verified_user</span>
            <span>Government Cashless Treatment (Ayushman Bharat / PM-JAY Covered)</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">print</span>
              Print Slip
            </button>
            <button
              onClick={handleConfirmAndDispatch}
              disabled={dispatched}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                dispatched
                  ? 'bg-emerald-700 text-white'
                  : 'bg-teal-700 hover:bg-teal-800 active:scale-95 text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">
                {dispatched ? 'check_circle' : 'ambulance'}
              </span>
              <span>
                {dispatched
                  ? 'Dispatched! Proceeding to Live Tracking...'
                  : 'Confirm Readiness & Dispatch Ambulance (एम्बुलेंस रवाना करें)'}
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Quick Rural Safety Context Footnote Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
            <span className="material-symbols-outlined text-lg">sms</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Family Notified via SMS</span>
            <span className="text-[11px] text-slate-500">Saroj Gurjar (Wife) • +91 98210-XXXXX</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-lg">health_and_safety</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">100% Cashless Transfer</span>
            <span className="text-[11px] text-slate-500">Ayushman Card #PMJAY-6632 Pre-cleared</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <span className="material-symbols-outlined text-lg">schedule</span>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Estimated Arrival Window</span>
            <span className="text-[11px] text-slate-500">Expected at Cath Lab by 11:42 AM</span>
          </div>
        </div>
      </div>

    </div>
  );
};
