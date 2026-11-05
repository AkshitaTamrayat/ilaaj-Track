import React from 'react';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'family',
      label: 'Family',
      icon: 'family_restroom'
    },
    {
      id: 'triage',
      label: 'Intake',
      icon: 'mic'
    },
    {
      id: 'map',
      label: 'Transit',
      icon: 'local_shipping'
    },
    {
      id: 'hospital',
      label: 'Handover',
      icon: 'domain_verification'
    },
    {
      id: 'telemetry',
      label: 'District',
      icon: 'analytics'
    }
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 safe-bottom shadow-lg flex items-center justify-around"
      aria-label="Mobile Bottom Navigation"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-teal-800 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`w-9 h-7 rounded-full flex items-center justify-center transition-colors ${
                isActive ? 'bg-teal-100/90 text-teal-800' : 'bg-transparent text-slate-500'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${isActive ? 'fill' : ''}`}>
                {tab.icon}
              </span>
            </div>
            <span className="text-[11px] leading-tight mt-1 font-semibold">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

