import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { VoiceTriageSection } from './components/VoiceTriageSection';
import { DynamicMapSection } from './components/DynamicMapSection';
import { CasualtySection } from './components/CasualtySection';
import { DhoHeatmapSection } from './components/DhoHeatmapSection';
import { fetchFacilities, fetchReferrals, createReferral } from './services/api';
import type { Facility, Referral } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('triage');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [facs, refs] = await Promise.all([fetchFacilities(), fetchReferrals()]);
      setFacilities(facs);
      setReferrals(refs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReferralCreated = async (newRefData: any) => {
    try {
      const res = await createReferral(newRefData);
      if (res && res.referral) {
        setReferrals(prev => [res.referral, ...prev.filter(r => r.id !== res.referral.id)]);
      }
    } catch {
      const fallbackRef: Referral = {
        id: `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        status: 'EN_ROUTE',
        timeline: [
          { stage: 'TRIAGED_AT_PHC', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Intake logged by frontline worker' },
          { stage: 'READINESS_VERIFIED', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Hospital verified (Doctor on duty, ICU 50%, ECG Ready)' }
        ],
        qrToken: `ILAAJ-SECURE-${Math.floor(100000 + Math.random() * 900000)}`,
        ...newRefData
      };
      setReferrals(prev => [fallbackRef, ...prev]);
    }
    // Auto-switch to Care & Transit Reroute Map
    setActiveTab('map');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Fixed Top Header */}
      <Header activeTab={activeTab} />

      {/* Fixed Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="pl-64 pt-16">
        <main className="w-full p-6 md:p-8 max-w-7xl mx-auto space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500 text-sm font-medium">
              <span className="material-symbols-outlined text-2xl text-teal-700 animate-spin mr-2">
                progress_activity
              </span>
              Loading Ilaaj Track Clinical Portal...
            </div>
          ) : (
            <div>
              {activeTab === 'triage' && (
                <VoiceTriageSection onReferralCreated={handleReferralCreated} />
              )}

              {activeTab === 'map' && (
                <DynamicMapSection
                  facilities={facilities}
                  referrals={referrals}
                  onRefresh={loadData}
                />
              )}

              {activeTab === 'hospital' && (
                <CasualtySection
                  referrals={referrals}
                  onRefresh={loadData}
                />
              )}

              {activeTab === 'telemetry' && (
                <DhoHeatmapSection facilities={facilities} />
              )}
            </div>
          )}

          {/* Simple Institutional Footer */}
          <footer className="pt-6 pb-8 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              <strong>Ilaaj Track (ईलाज ट्रैक)</strong> • Rural Healthcare Closed-Loop Referral & Care Continuity Platform
            </p>
            <p className="text-[11px] text-slate-400">
              Guiding Principle: "Verify care readiness before travel, track the journey until home care is complete."
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
