import React, { useState } from 'react';
import { Mic, MicOff, Upload, Sparkles, HeartPulse, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { runVoiceTriage, runPrescriptionOCR } from '../services/api';
import confetti from 'canvas-confetti';

interface VoiceTriageSectionProps {
  onReferralCreated: (referralData: any) => void;
}

export const VoiceTriageSection: React.FC<VoiceTriageSectionProps> = ({ onReferralCreated }) => {
  const [spokenText, setSpokenText] = useState('छातीत खूप दुखतंय, डाव्या हाताला मुंग्या येतायत आणि खूप घाम फुटलाय');
  const [language, setLanguage] = useState<'mr' | 'hi'>('mr');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<any>(null);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [activeInputMode, setActiveInputMode] = useState<'voice' | 'slip'>('voice');

  // Quick preset symptom dictations for hackathon judging demo
  const presets = [
    {
      title: 'Chest Pain & Sweating (Emergency)',
      lang: 'mr',
      text: 'छातीत खूप दुखतंय, डाव्या हाताला मुंग्या येतायत आणि खूप घाम फुटलाय (Patient: 34yo Female, BP 160/100, Melghat Tribal block)',
    },
    {
      title: 'Post-Partum Hemorrhage (Maternal Emergency)',
      lang: 'hi',
      text: 'डिलीवरी के बाद बहुत ज्यादा ब्लीडिंग हो रही है, चक्कर आ रहे हैं और हाथ पैर ठंडे पड़ रहे हैं (ASHA: Rapid transfer needed)',
    },
    {
      title: 'Pediatric High Fever & Seizures (Urgent)',
      lang: 'hi',
      text: 'बच्चे को 3 दिन से तेज बुखार है, आज सुबह झटके आए हैं और कुछ खा नहीं रहा है',
    }
  ];

  const handleRunTriage = async () => {
    if (!spokenText.trim()) return;
    setLoading(true);
    try {
      const res = await runVoiceTriage(spokenText, language);
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
        setOcrResult(res.result);
        setSpokenText(`Prescription slip parsed: ${res.result.detectedDoctor}. Prescribed: ${res.result.prescribedMedicines.join(', ')}`);
        // Auto-run triage
        const triageRes = await runVoiceTriage(res.result.prescribedMedicines.join(', '), 'hi');
        setTriageResult(triageRes.result);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReferral = () => {
    confetti({ particleCount: 75, spread: 60, origin: { y: 0.8 } });
    onReferralCreated({
      patientName: 'Sunita Bai Rathod',
      age: 34,
      gender: 'Female',
      village: 'Semadoh, Melghat Tribal Block',
      ashaWorker: 'Kavita Meshram (ASHA-7702)',
      presentingSymptoms: spokenText,
      vitals: triageResult?.extractedVitals || { bp: '160/100 mmHg', pulse: '108 bpm', spo2: '93%' },
      cdssSeverity: triageResult?.cdssSeverity || 'RED',
      suspectedCondition: triageResult?.suspectedCondition || 'Acute Coronary Syndrome',
      requiredSpecialty: triageResult?.requiredSpecialty || 'Cardiology',
      careBundle: triageResult?.suggestedCareBundle || {
        consultation: 'Emergency Cardiologist',
        diagnosticSlots: ['Priority 12-Lead ECG', 'Serum Troponin-I', 'Chest X-Ray'],
        transitToken: '108 Emergency Green Corridor Assigned'
      },
      destinationFacilityId: 'fac-dh-amravati'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 p-6 rounded-2xl border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Pillar 1: Voice-First Indic Frontline
          </div>
          <h2 className="text-2xl font-display font-bold text-white">
            ASHA Vernacular Voice & Prescription Slip Intake
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Frontline village health workers speak colloquial Hindi or Marathi. Multimodal AI extracts ICMR-standard vitals and assembles a <strong>One-Trip Care Bundle</strong> in &lt;50 seconds on basic 2GB RAM phones.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveInputMode('voice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${activeInputMode === 'voice' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            Voice Dictation
          </button>
          <button
            onClick={() => setActiveInputMode('slip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${activeInputMode === 'slip' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
          >
            Prescription OCR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Intake Controls */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Preset Buttons for Demo */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              ⚡ Quick Demo Presets (Click to Load Real Rural Symptoms):
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSpokenText(p.text);
                    setLanguage(p.lang as any);
                    setTriageResult(null);
                  }}
                  className="text-left text-xs bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-emerald-500/50 p-2.5 rounded-lg text-slate-300 transition cursor-pointer"
                >
                  <span className="font-semibold text-white block">{p.title}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{p.text}</span>
                </button>
              ))}
            </div>
          </div>

          {activeInputMode === 'voice' ? (
            /* Voice Recording Area */
            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Vernacular Audio Dictation (Hindi / Marathi)
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('mr')}
                    className={`px-2 py-0.5 text-xs rounded font-medium ${language === 'mr' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'}`}
                  >
                    मराठी (Marathi)
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-0.5 text-xs rounded font-medium ${language === 'hi' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'}`}
                  >
                    हिंदी (Hindi)
                  </button>
                </div>
              </div>

              <textarea
                value={spokenText}
                onChange={(e) => setSpokenText(e.target.value)}
                rows={4}
                placeholder="Dictate symptoms in local dialect..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition resize-none font-mono"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                  <span>{isRecording ? 'Listening (Groq Whisper)...' : 'Record Native Speech'}</span>
                </button>

                <button
                  onClick={handleRunTriage}
                  disabled={loading}
                  className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'AI CDSS Analyzing...' : 'Analyze with Gemini CDSS'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Prescription Slip OCR Area */
            <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Multimodal Prescription Slip Scanner
              </span>
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer relative bg-slate-950/40 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-200">
                  Drop photographed prescription slip or click to browse
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Gemini 2.5 Flash Vision extracts handwritten medications & diagnostic tests
                </p>
              </div>

              {ocrResult && (
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-400 font-semibold">
                    <span>Parsed Doctor: {ocrResult.detectedDoctor}</span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                      Confidence: {ocrResult.confidenceScore}%
                    </span>
                  </div>
                  <div className="text-slate-300">
                    <strong>Medicines:</strong> {ocrResult.prescribedMedicines.join(', ')}
                  </div>
                  <div className="text-slate-300">
                    <strong>Prescribed Investigations:</strong> {ocrResult.prescribedInvestigations.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: CDSS Results & One-Trip Care Bundle */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-400" /> ICMR Rule Engine & CDSS
                </span>
                {triageResult && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      triageResult.cdssSeverity === 'RED'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                        : triageResult.cdssSeverity === 'AMBER'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    Level: {triageResult.cdssSeverity} (Emergency)
                  </span>
                )}
              </div>

              {triageResult ? (
                <div className="space-y-4">
                  {/* Suspected Condition */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold block">
                      Suspected Condition (ICD-10)
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {triageResult.suspectedCondition}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {triageResult.clinicalSummaryEn}
                    </p>
                  </div>

                  {/* Extracted Vitals */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Blood Pressure</span>
                      <span className="text-xs font-bold text-white">{triageResult.extractedVitals.bp}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">Pulse</span>
                      <span className="text-xs font-bold text-white">{triageResult.extractedVitals.pulse}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 block uppercase">SpO2 Oxygen</span>
                      <span className="text-xs font-bold text-white">{triageResult.extractedVitals.spo2}</span>
                    </div>
                  </div>

                  {/* One-Trip Care Bundle */}
                  <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase">
                      <ShieldCheck className="w-4 h-4" /> Pillar 3: Coordinated One-Trip Care Bundle
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Specialist Consult:</strong> {triageResult.suggestedCareBundle?.consultation}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Bundled Diagnostics:</strong> {triageResult.suggestedCareBundle?.diagnosticSlots?.join(', ')}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Transit Token:</strong> {triageResult.suggestedCareBundle?.transitPriority}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 space-y-2">
                  <FileText className="w-10 h-10 mx-auto opacity-30" />
                  <p className="text-xs">
                    Select a preset or dictate native audio above, then click <strong>"Analyze with Gemini CDSS"</strong>.
                  </p>
                </div>
              )}
            </div>

            {triageResult && (
              <button
                onClick={handleCreateReferral}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-lg shadow-emerald-500/20"
              >
                <span>Proceed to Care Readiness Check</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
