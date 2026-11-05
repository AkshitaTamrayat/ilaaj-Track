import React, { useState } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';

export const LanguageModal: React.FC = () => {
  const { currentLanguage, setLanguage, isModalOpen, closeLanguageModal } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isModalOpen) return null;

  const filtered = SUPPORTED_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-4 sm:p-6 space-y-4 my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <span className="material-symbols-outlined text-2xl">translate</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Select Platform & Voice Language
              </h3>
              <p className="text-xs text-slate-500">
                12 Indian & Vernacular Languages Available
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeLanguageModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
            aria-label="Close language selector"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Search language (e.g. Hindi, Bengali, தமிழ், Marathi)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-teal-700 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-80 pr-1">
          {filtered.map((lang) => {
            const isSelected = currentLanguage.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  closeLanguageModal();
                }}
                className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/20'
                    : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl shrink-0">{lang.flag}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {lang.nativeName}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({lang.name})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {lang.region}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span className="material-symbols-outlined text-teal-700 text-xl shrink-0 ml-2">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Voice Model Notice */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 text-teal-800 font-medium">
            <span className="material-symbols-outlined text-sm text-teal-600">graphic_eq</span>
            Speech AI: Whisper Large v3 Turbo + Gemini Multilingual
          </span>
          <button
            type="button"
            onClick={closeLanguageModal}
            className="px-3 py-1.5 rounded-lg bg-teal-700 text-white font-bold hover:bg-teal-800 transition cursor-pointer"
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  );
};
