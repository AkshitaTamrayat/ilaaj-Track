import React, { useState } from 'react';
import type { UserProfile } from './AuthModal';
import { VoiceTriageSection } from './VoiceTriageSection';
import { DynamicMapSection } from './DynamicMapSection';
import { CasualtySection } from './CasualtySection';
import { DhoHeatmapSection } from './DhoHeatmapSection';
import { FamilyHealthSection } from './FamilyHealthSection';
import type { Facility, Referral } from '../types';

interface StaffDashboardProps {
  user: UserProfile;
  facilities: Facility[];
  referrals: Referral[];
  onRefreshData: () => void;
  onReferralCreated: (referralData: any) => void;
  onSwitchToPatient: () => void;
  onLogout: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  user,
  facilities,
  referrals,
  onRefreshData,
  onReferralCreated,
  onSwitchToPatient,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'triage' | 'map' | 'hospital' | 'telemetry' | 'community'>('triage');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'triage' as const,
      label: 'Voice & Intake',
      icon: 'mic',
      description: 'Voice CDSS & Slip OCR'
    },
    {
      id: 'map' as const,
      label: 'Care & Transit',
      icon: 'local_shipping',
      description: 'Dynamic GPS & Reroute'
    },
    {
      id: 'hospital' as const,
      label: 'Casualty Handover',
      icon: 'domain_verification',
      description: 'Pre-Arrival & ASHA Handback'
    },
    {
      id: 'telemetry' as const,
      label: 'DHO Radar',
      icon: 'analytics',
      description: 'Equipment Uptime Heatmap'
    },
    {
      id: 'community' as const,
      label: 'Community Locker',
      icon: 'family_restroom',
      description: 'Village Patient Slips'
    }
  ];

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Professional Medical Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Clinical Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-xl">menu</span>
            </button>

            <img
              src="/logo.png"
              alt="Ilaaj Track Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-teal-100 shadow-xs shrink-0"
            />
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none font-outfit">
              Ilaaj<span className="text-teal-700"> Track</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-teal-50 text-teal-800 border border-teal-200 ml-1">
              Clinical & Staff Portal
            </span>
          </div>

          {/* User Profile, Emergency 108 & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Clickable Emergency 108 Call */}
            <a
              href="tel:108"
              title="Emergency Helpline: Dial 108"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-rose-600">call</span>
              <span className="hidden sm:inline">Ambulance</span> 108
            </a>

            {/* Staff Profile Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs ring-2 ring-teal-600/20">
                {user.avatar || 'SD'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{user.title}</span>
              </div>
            </div>

            {/* Switch Role & Home Buttons */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={onSwitchToPatient}
                title="Switch to Citizen & Family Health Vault"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">family_restroom</span>
                <span className="hidden lg:inline">Patient View</span>
              </button>
              <button
                onClick={onLogout}
                title="Return to Home Landing Page"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Logout"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Slide-Over */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 animate-fadeIn text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
                  <div>
                    <span className="font-bold text-sm text-slate-900 block leading-tight">Clinical Portal</span>
                    <span className="text-[10px] text-teal-700 font-medium">Melghat Corridor</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="space-y-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                      <div>
                        <div>{tab.label}</div>
                        <div className={`text-[10px] font-normal ${isActive ? 'text-teal-200' : 'text-slate-400'}`}>
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2">
              <button
                onClick={onSwitchToPatient}
                className="w-full py-2 px-3 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">family_restroom</span>
                <span>Switch to Patient View</span>
              </button>
              <button
                onClick={onLogout}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs Bar (Desktop & Tablet) */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 md:p-8 space-y-6 pb-20 lg:pb-8">
        
        {activeTab === 'triage' && (
          <VoiceTriageSection onReferralCreated={(newRef) => {
            onReferralCreated(newRef);
            setActiveTab('map');
          }} />
        )}

        {activeTab === 'map' && (
          <DynamicMapSection
            facilities={facilities}
            referrals={referrals}
            onRefresh={onRefreshData}
          />
        )}

        {activeTab === 'hospital' && (
          <CasualtySection
            referrals={referrals}
            onRefresh={onRefreshData}
          />
        )}

        {activeTab === 'telemetry' && (
          <DhoHeatmapSection facilities={facilities} />
        )}

        {activeTab === 'community' && (
          <div className="space-y-4">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-700 text-lg">info</span>
              <span>
                <strong>Community Health Records View:</strong> Frontline ASHA workers and doctors can view, verify, and upload prescription slips or lab reports on behalf of rural village families.
              </span>
            </div>
            <FamilyHealthSection />
          </div>
        )}

      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 safe-bottom shadow-lg flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-teal-800 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-teal-100 text-teal-800' : 'bg-transparent text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              </div>
              <span className="text-[11px] leading-tight mt-1 font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
};
