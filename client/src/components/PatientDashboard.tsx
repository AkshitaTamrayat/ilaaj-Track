import React, { useState } from 'react';
import type { UserProfile } from './AuthModal';
import { FamilyHealthSection } from './FamilyHealthSection';

interface PatientDashboardProps {
  user: UserProfile;
  onSwitchToStaff: () => void;
  onLogout: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  user,
  onSwitchToStaff,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'emergency'>('vault');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Patient Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Citizen Identity */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Ilaaj Track Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 border border-teal-100 shadow-xs"
            />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 leading-tight">
                  Ilaaj<span className="text-teal-700">Track</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Citizen Health Vault • नागरिक खाता
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Semadoh Village Family Health Records
              </span>
            </div>
          </div>

          {/* User Profile, Emergency 108 & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Clickable Emergency 108 Call */}
            <a
              href="tel:108"
              title="Call Emergency 108 Ambulance Hotline"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-rose-600">call</span>
              <span className="hidden sm:inline">Emergency</span> 108
            </a>

            {/* User Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-teal-600/20">
                {user.avatar || 'RP'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                <span className="text-[10px] text-teal-800 font-mono font-semibold">{user.idNumber}</span>
              </div>
            </div>

            {/* Switch Role & Home Buttons */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={onSwitchToStaff}
                title="Switch to ASHA & Medical Staff Portal"
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base text-teal-700">medical_services</span>
                <span className="hidden lg:inline">Staff View</span>
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

      {/* Citizen Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-4 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold">
                नमस्ते, {user.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-900/60 text-teal-100 border border-teal-600">
                Verified Citizen Account
              </span>
            </div>
            <p className="text-xs text-teal-100">
              Your family health vault stores doctor slips, medicines, lab reports, and upcoming ASHA visits safely in one place.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-white font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-emerald-300">verified</span>
              <span>PM-JAY Cashless: Active</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-white font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-teal-200">contact_phone</span>
              <span>Village ASHA: Kavita M.</span>
            </span>
          </div>
        </div>
      </div>

      {/* Patient Sub-Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'vault'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-base">family_restroom</span>
            <span>Family Health Vault & Slips (परिवार खाता व पर्चियां)</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'emergency'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="material-symbols-outlined text-base">emergency</span>
            <span>Emergency & Hospital Telemetry (अस्पताल सुविधा)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 md:p-8 space-y-6">
        
        {activeTab === 'vault' && (
          <div>
            <FamilyHealthSection />
          </div>
        )}

        {activeTab === 'emergency' && (
          <div className="space-y-6 text-left">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-2xl">emergency</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Nearest Tertiary Emergency Facility</h2>
                    <p className="text-xs text-slate-500">Live Hospital Telemetry & Bed Status for Melghat Corridor</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Ready (94% Verified)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Hospital Name</span>
                  <div className="text-sm font-bold text-slate-900">Amravati District Hospital (DH)</div>
                  <span className="text-xs text-teal-700 font-medium">Distance: 64 km (~78 min via 108)</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">ICU Capacity</span>
                  <div className="text-sm font-bold text-slate-900">8 Vacant ICU Beds (22/30 Occupied)</div>
                  <span className="text-xs text-emerald-700 font-medium">Under critical 85% threshold</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Diagnostics On Duty</span>
                  <div className="text-sm font-bold text-slate-900">12-Lead ECG & X-Ray ONLINE</div>
                  <span className="text-xs text-teal-700 font-medium">Cardiologist & Emergency MD Available</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-rose-900">Immediate Ambulance Dispatch (मुफ्त 108 एम्बुलेंस)</h3>
                  <p className="text-xs text-rose-700">Toll-free emergency dispatch with trained paramedic and oxygen support.</p>
                </div>
                <a
                  href="tel:108"
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">call</span>
                  <span>Dial 108 Ambulance Hotline</span>
                </a>
              </div>
            </div>

            {/* First-Aid Emergency Guidelines for Families */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-700 text-lg">medical_information</span>
                First-Aid Actions While Awaiting 108 Ambulance (प्राथमिक उपचार)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">Chest Pain / Heart Attack:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Keep patient sitting upright, loosen tight clothing. If available and advised by doctor, give Tab. Aspirin 300mg to chew. Avoid walking or exertion.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">Maternal Labor Emergencies:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Call village ASHA immediately. Keep the mother lying on her left side, keep warm clean blankets ready, and carry Maternal Mother-Child Protection (MCP) card.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 block font-bold">Breathlessness / Asthmatic Attack:</strong>
                  <p className="text-slate-600 leading-relaxed">
                    Ensure adequate fresh air. Sit leaning forward. Do not crowd the patient. Administer prescribed inhaler doses if available.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="pt-6 pb-8 border-t border-slate-200 text-xs text-slate-500 text-center">
        <p>
          <strong>Ilaaj Track Citizen Portal</strong> • Ayushman Bharat Digital Mission (ABDM) Compliant • National Health Authority
        </p>
      </footer>

    </div>
  );
};
