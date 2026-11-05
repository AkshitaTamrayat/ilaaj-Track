import React, { useState } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  role: 'patient' | 'staff';
  title: string;
  subTitle: string;
  avatar: string;
  idNumber: string; // ABHA ID or Staff ID
  location: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  defaultRole?: 'patient' | 'staff';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  defaultRole = 'patient'
}) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'staff'>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [pinOrOtp, setPinOrOtp] = useState('');

  if (!isOpen) return null;

  // Pre-configured 1-click quick login profiles
  const patientProfiles: UserProfile[] = [
    {
      id: 'fam-ramesh',
      name: 'Ramesh Patil',
      role: 'patient',
      title: 'Family Head & Patient',
      subTitle: 'Hypertension & Diabetes Care',
      avatar: 'RP',
      idNumber: 'ABHA: 91-4432-8871-0921',
      location: 'Semadoh Village, Melghat'
    },
    {
      id: 'fam-kamla',
      name: 'Kamla Devi Patil',
      role: 'patient',
      title: 'Senior Citizen Patient',
      subTitle: 'Osteoarthritis Management',
      avatar: 'KP',
      idNumber: 'ABHA: 91-1029-4481-7734',
      location: 'Semadoh Village, Melghat'
    },
    {
      id: 'fam-sunita',
      name: 'Sunita Bai Patil',
      role: 'patient',
      title: 'Family Member',
      subTitle: 'Post-Op Care & Anemia Treatment',
      avatar: 'SP',
      idNumber: 'ABHA: 91-5502-3199-8812',
      location: 'Semadoh Village, Melghat'
    }
  ];

  const staffProfiles: UserProfile[] = [
    {
      id: 'staff-asha-sunita',
      name: 'Sunita Devi',
      role: 'staff',
      title: 'Lead Frontline ASHA Facilitator',
      subTitle: 'Melghat Tribal Block Health Sub-Center',
      avatar: 'SD',
      idNumber: 'ASHA ID: MH-AMR-7702',
      location: 'Semadoh Sub-Center'
    },
    {
      id: 'staff-doc-deshmukh',
      name: 'Dr. S. K. Deshmukh',
      role: 'staff',
      title: 'Casualty Medical Officer (Emergency MD)',
      subTitle: 'Amravati District Hospital Casualty Gate',
      avatar: 'SK',
      idNumber: 'MCI Reg: 2011/04/1829',
      location: 'District Hospital Amravati'
    },
    {
      id: 'staff-dho-sharma',
      name: 'Dr. Rajesh Sharma',
      role: 'staff',
      title: 'District Health Officer (DHO)',
      subTitle: 'Amravati District Administration',
      avatar: 'RS',
      idNumber: 'Officer Code: DHO-AMR-01',
      location: 'Civil Surgeon & DHO Complex'
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'patient') {
      onLogin({
        id: `pat-${Date.now()}`,
        name: identifier || 'Citizen Patient',
        role: 'patient',
        title: 'Verified Citizen / Patient',
        subTitle: 'Family Health Vault',
        avatar: (identifier ? identifier[0] : 'P').toUpperCase(),
        idNumber: identifier ? `ABHA: ${identifier}` : 'ABHA: 91-0000-0000-0000',
        location: 'Amravati District'
      });
    } else {
      onLogin({
        id: `staff-${Date.now()}`,
        name: identifier || 'Medical Officer',
        role: 'staff',
        title: 'Medical Healthcare Professional',
        subTitle: 'Clinical Referral System',
        avatar: (identifier ? identifier[0] : 'S').toUpperCase(),
        idNumber: identifier ? `Staff: ${identifier}` : 'Staff Code: ASHA-9901',
        location: 'District Referral Hub'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header with official branding */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Ilaaj Track Logo"
              className="w-10 h-10 rounded-xl bg-white p-0.5 object-contain shadow-xs"
            />
            <div>
              <h2 className="text-lg font-bold leading-tight">Ilaaj Track Portal Sign-In</h2>
              <p className="text-xs text-teal-100">Secure Healthcare Access • Choose Your Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-teal-900/40 hover:bg-teal-900/60 flex items-center justify-center text-teal-100 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Role Toggle Tabs */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="grid grid-cols-2 p-1 bg-slate-200 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('patient')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'patient'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">family_restroom</span>
              <span>Patient & Family</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">health_and_safety</span>
              <span>ASHA & Clinical Staff</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">

          {/* Quick Demo 1-Click Profile Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-teal-700 text-sm">flash_on</span>
                1-Click Fast Login (Instant Demo)
              </span>
              <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Recommended
              </span>
            </div>

            <div className="space-y-2">
              {(activeTab === 'patient' ? patientProfiles : staffProfiles).map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => onLogin(profile)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-600 bg-white hover:bg-teal-50/40 text-left transition-all group shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition">
                      {profile.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {profile.name}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {profile.title} • <span className="font-mono text-teal-800 font-semibold">{profile.idNumber}</span>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-teal-700 transition text-lg">
                    login
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">Or enter custom credentials</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Custom Input Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {activeTab === 'patient' ? 'ABHA ID or 10-Digit Mobile Number' : 'Staff Employee ID / ASHA Registration Code'}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
                  {activeTab === 'patient' ? 'badge' : 'clinical_notes'}
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={activeTab === 'patient' ? 'e.g. 91-4432-8871-0921 or 98765 43210' : 'e.g. ASHA-7702 or DOC-AMR-101'}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {activeTab === 'patient' ? 'OTP or Security PIN (Use any 4 digits)' : 'Staff Passcode / Security PIN'}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
                  lock
                </span>
                <input
                  type="password"
                  value={pinOrOtp}
                  onChange={(e) => setPinOrOtp(e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-700 tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Enter {activeTab === 'patient' ? 'Patient Health Vault' : 'Clinical Telemetry Portal'}</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </form>

        </div>

        {/* Footer info note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500">
          <span className="material-symbols-outlined text-xs align-text-bottom mr-1 text-teal-700">verified_user</span>
          Compliant with Ayushman Bharat Digital Mission (ABDM) & National Health Authority Standards
        </div>

      </div>
    </div>
  );
};

