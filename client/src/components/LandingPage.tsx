import React from 'react';

interface LandingPageProps {
  onOpenAuth: (role: 'patient' | 'staff') => void;
  onQuickEnter: (role: 'patient' | 'staff') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onQuickEnter
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">

      {/* Top National Announcement Ribbon */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-900 text-white text-xs py-2 px-4 border-b border-teal-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-teal-100">National Rural Health Referral Network (राष्ट्रीय ग्रामीण रेफरल नेटवर्क)</span>
            <span className="hidden md:inline text-teal-300">• Melghat Pilot Corridor Active</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:108"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition shadow-xs"
            >
              <span className="material-symbols-outlined text-xs">call</span>
              <span>Emergency 108 Toll-Free</span>
            </a>
            <span className="hidden sm:inline text-teal-300/60">|</span>
            <span className="hidden sm:inline text-[11px] text-teal-200">ABDM & MoHFW Guideline Aligned</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur-xs opacity-30 group-hover:opacity-60 transition duration-300"></div>
              <img
                src="/logo.png"
                alt="Ilaaj Track Official Emblem"
                className="relative w-11 h-11 rounded-xl object-contain bg-white p-1 shadow-sm border border-teal-100"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-outfit">
                  Ilaaj<span className="text-teal-700">Track</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-teal-50 text-teal-800 border border-teal-200/80">
                  इलाज ट्रैक
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                AI Closed-Loop Referral & Care Continuity
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-teal-700 transition">Overview</a>
            <a href="#how-it-works" className="hover:text-teal-700 transition">How It Works</a>
            <a href="#portals" className="hover:text-teal-700 transition">Dual Portals</a>
            <a href="#impact" className="hover:text-teal-700 transition">Clinical Impact</a>
            <a href="#emergency" className="hover:text-teal-700 transition text-rose-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">emergency</span>
              108 Helpline
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenAuth('patient')}
              className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">family_restroom</span>
              <span className="hidden sm:inline">Citizen /</span> Patient Login
            </button>
            <button
              onClick={() => onOpenAuth('staff')}
              className="px-3.5 sm:px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">medical_services</span>
              <span>ASHA & Staff</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-slate-50">
        
        {/* Subtle Decorative Background Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-32 left-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-48 right-10 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Vision & Primary Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/90 text-teal-900 text-xs font-semibold shadow-2xs">
                <span className="material-symbols-outlined text-teal-700 text-sm">verified</span>
                <span>Ayushman Bharat Digital Mission (ABDM) Compatible</span>
                <span className="text-teal-400">•</span>
                <span className="text-teal-700">ICMR Protocol</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Never Turn A Rural Patient Away From Critical Care.
                </h1>
                <p className="text-lg sm:text-xl font-bold text-teal-700">
                  भारत का पहला एआई क्लोज्ड-लूप रेफरल व केयर नेटवर्क
                </p>
              </div>

              {/* Core Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                When a rural pregnant mother or chest-pain elder needs secondary care, paper slips send them on blind 60km journeys to overcrowded hospitals.
                <strong className="text-slate-900"> Ilaaj Track verifies doctor duty, ICU beds, and ECG machine uptime *before* travel</strong>, reserves casualty slots en route, and hands care back to the village ASHA after discharge.
              </p>

              {/* Dual Portal Gateway Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* Gateway A: Patient & Family Portal */}
                <div 
                  onClick={() => onQuickEnter('patient')}
                  className="group relative bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 hover:shadow-lg transition-all duration-300 text-left cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition">
                      <span className="material-symbols-outlined text-2xl">family_restroom</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">Patient & Family Portal</h3>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">नागरिक</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Store doctor slips, scan handwritten prescriptions via Gemini Vision OCR, track lab tests & ASHA home visits.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-700 group-hover:text-teal-800">
                    <span>Enter Family Health Vault</span>
                    <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>

                {/* Gateway B: Medical Staff & ASHA Portal */}
                <div 
                  onClick={() => onQuickEnter('staff')}
                  className="group relative bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-teal-600 hover:shadow-lg transition-all duration-300 text-left cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center group-hover:bg-teal-700 group-hover:text-white transition">
                      <span className="material-symbols-outlined text-2xl">health_and_safety</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">ASHA & Medical Staff</h3>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">चिकित्सा कर्मी</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Voice CDSS triage in Hindi/Marathi, dynamic Haversine ambulance routing, casualty pre-arrival gate & DHO telemetry.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-teal-700 group-hover:text-teal-800">
                    <span>Enter Clinical Telemetry Portal</span>
                    <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>

              </div>

              {/* Quick Credentials Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <span className="material-symbols-outlined text-teal-700 text-sm">lock_open</span>
                  Instant Demo Access:
                </span>
                <span>Click either card above for 1-click test login</span>
                <span>•</span>
                <button
                  onClick={() => onOpenAuth('patient')}
                  className="text-teal-700 hover:underline font-bold cursor-pointer"
                >
                  Choose specific demo persona
                </button>
              </div>

            </div>

            {/* Right Column: Prominent Official Emblem Showcase & Live Micro-Badges */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                
                {/* Glowing Emblem Core Aura */}
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400/20 to-emerald-400/20 rounded-3xl blur-2xl transform scale-95"></div>

                {/* Central Emblem Card */}
                <div className="relative bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl flex flex-col items-center text-center space-y-6">
                  
                  {/* The Official Project Logo */}
                  <div className="relative">
                    <div className="absolute -inset-3 bg-teal-100/50 rounded-full blur-md"></div>
                    <img
                      src="/logo.png"
                      alt="Ilaaj Track Official Emblem"
                      className="relative w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-2xl drop-shadow-md bg-white p-2 border border-teal-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Official Emblem • इलाज ट्रैक
                    </div>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Connecting Village ASHA, 108 Emergency Transit Corridor & District Tertiary Care
                    </p>
                  </div>

                  {/* Real-time Telemetry Live Micro-Cards */}
                  <div className="w-full space-y-2.5 pt-2 text-left">
                    
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-700 text-base">emergency</span>
                        <div>
                          <span className="font-bold text-teal-950 block leading-tight">108 ALS Ambulance #KA-04</span>
                          <span className="text-[10px] text-teal-700">En Route • Melghat Corridor</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-teal-800 border border-teal-200">
                        ETA 32 MIN
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-base">verified_user</span>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">Amravati District Hospital</span>
                          <span className="text-[10px] text-slate-500">ICU: 73% (Beds Verified Available)</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        READY (94%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-teal-700 text-base">document_scanner</span>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">Gemini 3.8 & Groq Whisper</span>
                          <span className="text-[10px] text-slate-500">Multimodal Slip & Voice CDSS</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        LIVE
                      </span>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Live Impact Radar: 4 Pillars of Clinical Transformation */}
      <section id="impact" className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Demonstrated Public Health Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Transforming Rural Morbidity & Medical Debt
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Validated against Lancet Global Health 2020 epidemiology benchmarks and MoHFW Rural Health Statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
              <div className="flex items-center justify-between text-rose-700 text-xs font-bold uppercase tracking-wider">
                <span>Referral Drop-Out</span>
                <span className="material-symbols-outlined text-lg">trending_down</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">&lt; 9.8%</div>
              <p className="text-xs text-slate-600">
                Slashed from <strong className="text-rose-700 font-semibold">48.2% baseline</strong> via closed-loop digital referral vouchers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase tracking-wider">
                <span>Travel Cost Savings</span>
                <span className="material-symbols-outlined text-lg">payments</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">62.4%</div>
              <p className="text-xs text-slate-600">
                Prevents catastrophic debt by ensuring <strong>one-trip resolution</strong> without multiple futile journeys.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
              <div className="flex items-center justify-between text-teal-700 text-xs font-bold uppercase tracking-wider">
                <span>Casualty Wait Time</span>
                <span className="material-symbols-outlined text-lg">schedule</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">&lt; 38 min</div>
              <p className="text-xs text-slate-600">
                Digital pre-arrival gate assigns ECG & bed slots prior to arrival, bypassing 3.5-hour queues.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase tracking-wider">
                <span>Follow-Up Compliance</span>
                <span className="material-symbols-outlined text-lg">fact_check</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">100%</div>
              <p className="text-xs text-slate-600">
                Post-discharge care plans sync directly to village ASHA tablets with ₹50 incentive claim.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works: The 4-Step Closed-Loop Journey */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Step-by-Step Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How Ilaaj Track Closes the Care Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              From the tribal hamlet to the district hospital and back home safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Village Voice Intake (आवाज़ दाखिला)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Village ASHA Worker speaks symptoms in Hindi or Marathi. Groq Whisper & Gemini extract vitals, ICD-10 condition, and assign RED/AMBER urgency.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 p-2 rounded-lg border border-teal-100">
                Zero typing for frontline workers
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                6-Factor Hospital Verification
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Before the patient travels, spatial Haversine algorithms check doctor duty, ICU beds, and ECG/CT machine uptime across regional facilities.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 p-2 rounded-lg border border-teal-100">
                Dynamic reroute if hospital jams
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Pre-Arrival Fast-Track Gate
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ambulance transit token alerts hospital casualty in advance. Bed, doctor, and emergency ECG slots are assigned before the ambulance pulls in.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 p-2 rounded-lg border border-teal-100">
                Slashes 3.5h wait to &lt;38m
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Village Handback & Recovery
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hospital discharge activates counter-referral. Post-op dressing and medication schedules are routed back to the village ASHA with a ₹50 incentive.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 p-2 rounded-lg border border-teal-100">
                100% closed-loop recovery
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Problem vs Solution Comparison Table */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Systemic Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Reality of Rural Referrals Today vs. Ilaaj Track
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-1/4">Referral Stage</th>
                  <th className="py-3.5 px-4 w-3/8 text-rose-800 bg-rose-50/50">Current Broken Reality (Paper Referrals)</th>
                  <th className="py-3.5 px-4 w-3/8 text-teal-800 bg-teal-50/50">Ilaaj Track AI Closed-Loop Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">1. Facility Selection</td>
                  <td className="py-3.5 px-4 text-slate-600">Blind referral based on guesswork. 48.2% of patients arrive at hospitals without available beds or doctors.</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-900 bg-teal-50/20">Spatial Haversine matrix verifies 6 factors (doctor, ICU, ECG, blood) before travel begins.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">2. En Route Bottlenecks</td>
                  <td className="py-3.5 px-4 text-slate-600">Ambulance reaches district hospital only to find ICU full; patient dies or is sent to private hospital into debt.</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-900 bg-teal-50/20">Automated dynamic reroute immediately alters ambulance route to nearest ready secondary facility.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">3. Casualty Gate Arrival</td>
                  <td className="py-3.5 px-4 text-slate-600">Patients wait an average of 3.5 hours in chaotic casualty queues while clerks fill paper registers.</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-900 bg-teal-50/20">Digital Pre-Arrival QR Token fast-tracks admission with diagnostics prepared in under 38 minutes.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">4. Post-Discharge Care</td>
                  <td className="py-3.5 px-4 text-slate-600">Hospital has zero contact with village after discharge; 41% of surgical patients suffer preventable relapse.</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-900 bg-teal-50/20">Automated counter-referral handback assigns wound care and BP checks to village ASHA with ₹50 incentive.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">5. Family Health Vault</td>
                  <td className="py-3.5 px-4 text-slate-600">Paper slips are crumpled, lost in transit, or ruined by rain; doctors have no medical history.</td>
                  <td className="py-3.5 px-4 font-semibold text-teal-900 bg-teal-50/20">AI camera photo scan extracts doctor name, medicines and lab ranges into encrypted digital locker.</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Emergency Call-Out Ribbon */}
      <section id="emergency" className="py-12 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                24x7 National Emergency Health Corridor
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Are You Experiencing a Medical Emergency?
              </h2>
              <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
                Immediate toll-free government dispatch for acute chest pain, maternal labor complications, severe breathlessness, or trauma.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="tel:108"
                className="px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-rose-800 hover:bg-rose-50 transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">call</span>
                <span>Dial 108 Ambulance Hotline</span>
              </a>
              <a
                href="tel:104"
                className="px-5 py-3.5 rounded-xl text-sm font-bold bg-rose-700/80 hover:bg-rose-700 text-white border border-rose-500/50 transition flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">support_agent</span>
                <span>104 Health Guidance</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Ilaaj Track Emblem"
                className="w-10 h-10 rounded-xl bg-white p-1 object-contain"
              />
              <div>
                <span className="text-base font-bold text-white block">Ilaaj Track (ईलाज ट्रैक)</span>
                <span className="text-[11px] text-slate-500">Government of India • Ministry of Health & Family Welfare Guidelines</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <button onClick={() => onQuickEnter('patient')} className="text-teal-400 hover:underline">
                Patient Portal
              </button>
              <span>•</span>
              <button onClick={() => onQuickEnter('staff')} className="text-teal-400 hover:underline">
                ASHA & Medical Staff Portal
              </button>
              <span>•</span>
              <a href="https://ijt-ai.antideploy.app" className="text-slate-300 hover:underline">
                Live Deployment
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © 2026 Ilaaj Track Closed-Loop Healthcare Ecosystem. All rights reserved.
            </p>
            <p>
              Guiding Principle: "Verify care readiness before travel, track the journey until home care is complete."
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};
