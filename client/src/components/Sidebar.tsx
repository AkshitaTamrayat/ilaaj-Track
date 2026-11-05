import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  onCloseMobileMenu
}) => {
  const navItems = [
    {
      id: 'family',
      title: 'Family Health Vault',
      subtitle: 'Health Records & Rx OCR',
      icon: 'family_restroom'
    },
    {
      id: 'triage',
      title: 'Voice & Intake',
      subtitle: 'Voice CDSS & Slip Triage',
      icon: 'mic'
    },
    {
      id: 'map',
      title: 'Care & Transit',
      subtitle: 'GPS Corridor & Reroute',
      icon: 'local_shipping'
    },
    {
      id: 'hospital',
      title: 'Hospital Handover',
      subtitle: 'Casualty Gate & Handback',
      icon: 'domain_verification'
    },
    {
      id: 'telemetry',
      title: 'District Dashboard',
      subtitle: 'DHO Telemetry Radar',
      icon: 'analytics'
    }
  ];

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const navContent = (isMobileDrawer: boolean) => (
    <>
      <div className="flex flex-col gap-1">
        <div className="px-3 py-2 flex items-center justify-between mb-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Ilaaj Track Official Emblem"
              className="w-11 h-11 rounded-xl object-contain shadow-xs border border-teal-100 bg-white"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-tight">National Health Portal</span>
              <span className="text-[10px] text-teal-700 font-semibold">Rural Care Continuity</span>
            </div>
          </div>
          {isMobileDrawer && onCloseMobileMenu && (
            <button
              type="button"
              onClick={onCloseMobileMenu}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Close Navigation"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Clinical Referral Workflow
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white font-semibold text-sm shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className={`truncate ${isActive ? 'text-white font-bold' : 'text-slate-800'}`}>
                    {item.title}
                  </span>
                  <span className={`text-[10px] truncate ${isActive ? 'text-teal-100 font-normal' : 'text-slate-400'}`}>
                    {item.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Offline Sync Banner for Rural Field */}
      <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex flex-col gap-2 mt-4">
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
    </>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (visible on lg+) */}
      <aside className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 z-40 flex-col justify-between p-4 overflow-y-auto">
        {navContent(false)}
      </aside>

      {/* 2. Mobile & Tablet Slide-Over Drawer (visible on < lg when opened) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobileMenu}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl p-4 flex flex-col justify-between lg:hidden transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent(true)}
      </aside>
    </>
  );
};
