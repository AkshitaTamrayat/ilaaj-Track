import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    {
      id: 'triage',
      title: 'Voice & Intake',
      subtitle: 'रोगी दाखिला और आवाज़',
      icon: 'mic'
    },
    {
      id: 'map',
      title: 'Care & Transit',
      subtitle: 'एम्बुलेंस ट्रैकिंग & Reroute',
      icon: 'local_shipping'
    },
    {
      id: 'hospital',
      title: 'Hospital Handover',
      subtitle: 'अस्पताल हैंडओवर & Follow-up',
      icon: 'domain_verification'
    },
    {
      id: 'telemetry',
      title: 'District Dashboard',
      subtitle: 'जिला सांख्यिकी & Radar',
      icon: 'analytics'
    }
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 z-40 flex flex-col justify-between p-4">
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Clinical Referral Workflow
        </div>
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white font-semibold text-sm shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                <div className="flex flex-col">
                  <span className={isActive ? 'text-white font-bold' : 'text-slate-800'}>
                    {item.title}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-teal-100 font-normal' : 'text-slate-400'}`}>
                    {item.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Offline Sync Banner for Rural Field */}
      <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-teal-900 text-xs font-bold">
            <span className="material-symbols-outlined text-base text-teal-700">cloud_done</span>
            <span>Offline Ready</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-teal-800 border border-teal-200">
            Synced
          </span>
        </div>
        <p className="text-[11px] text-teal-800 leading-snug">
          Records are stored securely on device and sync automatically when network resumes.
        </p>
      </div>
    </aside>
  );
};

