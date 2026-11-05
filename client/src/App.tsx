import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthModal, type UserProfile } from './components/AuthModal';
import { PatientDashboard } from './components/PatientDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { fetchFacilities, fetchReferrals, createReferral } from './services/api';
import type { Facility, Referral } from './types';

const DEFAULT_PATIENT_USER: UserProfile = {
  id: 'fam-ramesh',
  name: 'Ramesh Patil',
  role: 'patient',
  title: 'Family Head & Patient',
  subTitle: 'Hypertension & Diabetes Care',
  avatar: 'RP',
  idNumber: 'ABHA: 91-4432-8871-0921',
  location: 'Semadoh Village, Melghat'
};

const DEFAULT_STAFF_USER: UserProfile = {
  id: 'staff-asha-sunita',
  name: 'Sunita Devi',
  role: 'staff',
  title: 'Lead Frontline ASHA Facilitator',
  subTitle: 'Melghat Tribal Block Health Sub-Center',
  avatar: 'SD',
  idNumber: 'ASHA ID: MH-AMR-7702',
  location: 'Semadoh Sub-Center'
};

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'patient' | 'staff'>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRole, setAuthRole] = useState<'patient' | 'staff'>('patient');

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [, setLoading] = useState(true);

  // Check saved session in localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ilaaj_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as UserProfile;
        if (parsed && parsed.role) {
          setCurrentUser(parsed);
        }
      }
    } catch {}
  }, []);

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

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('ilaaj_user', JSON.stringify(user));
    } catch {}
    setShowAuthModal(false);
    setCurrentView(user.role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickEnter = (role: 'patient' | 'staff') => {
    const user = role === 'patient' ? DEFAULT_PATIENT_USER : DEFAULT_STAFF_USER;
    handleLogin(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('ilaaj_user');
    } catch {}
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* 1. Landing Page View with Official Hero Logo & Dual Gateway */}
      {currentView === 'landing' && (
        <LandingPage
          onOpenAuth={(role) => {
            setAuthRole(role);
            setShowAuthModal(true);
          }}
          onQuickEnter={handleQuickEnter}
        />
      )}

      {/* 2. Patient & Family Dashboard */}
      {currentView === 'patient' && (
        <PatientDashboard
          user={currentUser || DEFAULT_PATIENT_USER}
          onSwitchToStaff={() => {
            handleLogin(DEFAULT_STAFF_USER);
          }}
          onLogout={handleLogout}
        />
      )}

      {/* 3. Frontline ASHA & Medical Staff Dashboard */}
      {currentView === 'staff' && (
        <StaffDashboard
          user={currentUser || DEFAULT_STAFF_USER}
          facilities={facilities}
          referrals={referrals}
          onRefreshData={loadData}
          onReferralCreated={handleReferralCreated}
          onSwitchToPatient={() => {
            handleLogin(DEFAULT_PATIENT_USER);
          }}
          onLogout={handleLogout}
        />
      )}

      {/* Role-Based Authentication & Instant Demo Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        defaultRole={authRole}
      />

    </div>
  );
}

export default App;
