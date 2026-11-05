import React from 'react';

interface HeaderProps {
  activeTab: string;
  mobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, onToggleMobileMenu }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="h-16 w-full px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="lg:hidden p-1.5 -ml-1 text-slate-700 hover:text-teal-800 hover:bg-slate-100 rounded-xl cursor-pointer transition active:scale-95"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          )}

          <img
            src="/logo.png"
            alt="Ilaaj Track Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain shadow-xs border border-teal-100 bg-white shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-none font-outfit truncate">
              Ilaaj<span className="text-teal-700"> Track</span>
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-500 mt-1 truncate">
              Rural Care Continuity
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-medium">14 District Hospitals Connected</span>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="hidden lg:flex items-center gap-6 bg-slate-100/80 px-4 py-1.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-teal-700 text-xl">ambulance</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider leading-none">
                Active Transits
              </span>
              <span className="text-xs font-bold text-slate-800 mt-0.5">42 Ambulances</span>
            </div>
          </div>
          <div className="w-px h-6 bg-slate-300"></div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-emerald-600 text-xl">verified</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider leading-none">
                Verified Slots
              </span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5">94.8% Guaranteed</span>
            </div>
          </div>
          <div className="w-px h-6 bg-slate-300"></div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-teal-700 text-xl">wifi_tethering</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider leading-none">
                Signal Status
              </span>
              <span className="text-xs font-bold text-slate-800 mt-0.5">Online • High Speed</span>
            </div>
          </div>
        </div>

        {/* User Profile & Emergency Helpline */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Quick Dial Button */}
          <a
            href="tel:108"
            title="Emergency Ambulance Hotline: Call 108"
            className="flex sm:hidden items-center justify-center w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-xs transition cursor-pointer"
            aria-label="Call Emergency 108"
          >
            <span className="material-symbols-outlined text-base">call</span>
          </a>

          {/* Desktop/Tablet Clickable Emergency Banner */}
          <a
            href="tel:108"
            title="Emergency Toll-Free Helpline: Click to Call 108 / 104"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 text-rose-800 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg text-rose-600">call</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold leading-none text-rose-600">Emergency Helpline</span>
              <span className="text-xs font-bold leading-tight mt-0.5 text-rose-900">108 / 104 Toll-Free (Call)</span>
            </div>
          </a>
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm ring-2 ring-teal-600/20">
                SD
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-bold text-slate-800 leading-none">Sunita Devi</span>
              <span className="text-xs text-slate-500 mt-0.5">Lead ASHA Facilitator</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

