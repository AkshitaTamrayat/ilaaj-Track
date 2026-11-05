import React from 'react';
import { Activity, Cpu, Award } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'triage', label: '1. ASHA Voice Triage', badge: 'Indic AI' },
    { id: 'map', label: '2. Dynamic GIS Reroute', badge: 'WOW Engine' },
    { id: 'hospital', label: '3. Casualty & Counter-Referral', badge: 'Closed Loop' },
    { id: 'telemetry', label: '4. District CMO Radar', badge: 'MoHFW' },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#070c18]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Ilaaj<span className="text-emerald-400"> Track</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                SIH 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">
              AI-Orchestrated Closed-Loop Healthcare Referral & Care Continuity
            </p>
          </div>
        </div>

        {/* Render Workflows Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg text-xs text-purple-300">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Render Workflows Blueprint Active</span>
          <Award className="w-3.5 h-3.5 text-amber-400 ml-1" />
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
