import React from 'react';
import { X, Sliders, Grid3X3, Eye } from 'lucide-react';
import { LanguageCode, getTranslations, SUPPORTED_LANGUAGES, getLanguageDir } from './i18n';

interface SettingsModalProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  showGrid: boolean;
  onToggleGrid: (show: boolean) => void;
  showLinkLabels: boolean;
  onToggleLinkLabels: (show: boolean) => void;
  onClose: () => void;
}

export function SettingsModal({
  currentLang,
  onLanguageChange,
  showGrid,
  onToggleGrid,
  showLinkLabels,
  onToggleLinkLabels,
  onClose
}: SettingsModalProps) {
  const t = getTranslations(currentLang);
  const dir = getLanguageDir(currentLang);

  return (
    <div
      dir={dir}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
    >
      <div className="bg-[#0b1424] border-2 border-[#00bceb]/70 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-100 transition-all duration-300">
        
        {/* Header */}
        <div className="h-12 bg-[#003852] px-4 flex items-center justify-between border-b border-[#00bceb]/40">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#00bceb]" />
            <h3 className="font-bold text-sm text-white">{t.settingsTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#005073] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-slate-300 overflow-y-auto max-h-[80vh]">
          
          {/* ======================================================================= */}
          {/* 1. قسم اللغة المطلوب: 🌐 Language */}
          {/* ======================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <span>🌐</span>
                <span>Language</span>
              </label>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                {currentLang === 'ar' ? 'العربية • RTL' : 'English • LTR'}
              </span>
            </div>
            
            <p className="text-[11px] text-slate-400">
              {t.languageSectionDesc}
            </p>

            {/* 2. خيارات اللغة المعروضة تماماً كما طُلب:
                ○ English
                ○ العربية
            */}
            <div className="space-y-2.5 pt-1">
              {/* خيار English */}
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`w-full p-3.5 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#003852]/80 border-[#00bceb] shadow-lg shadow-cyan-950/60 ring-1 ring-[#00bceb]'
                    : 'bg-[#07101e] border-[#1b2b48] hover:border-slate-500 hover:bg-[#0a1628]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* الراديو الدائري المخصص المطلوب */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    currentLang === 'en'
                      ? 'border-[#00bceb] bg-[#00bceb]/20'
                      : 'border-slate-500 bg-transparent'
                  }`}>
                    {currentLang === 'en' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00bceb] animate-in zoom-in-75 duration-200" />
                    )}
                  </div>

                  <div className="text-left">
                    <span className="font-bold text-sm text-white block">
                      English
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Left-to-Right (LTR) • Default
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="English">🇺🇸</span>
                  {currentLang === 'en' && (
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/60">
                      Active
                    </span>
                  )}
                </div>
              </button>

              {/* خيار العربية */}
              <button
                type="button"
                onClick={() => onLanguageChange('ar')}
                className={`w-full p-3.5 rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                  currentLang === 'ar'
                    ? 'bg-[#003852]/80 border-[#00bceb] shadow-lg shadow-cyan-950/60 ring-1 ring-[#00bceb]'
                    : 'bg-[#07101e] border-[#1b2b48] hover:border-slate-500 hover:bg-[#0a1628]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* الراديو الدائري المخصص المطلوب */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    currentLang === 'ar'
                      ? 'border-[#00bceb] bg-[#00bceb]/20'
                      : 'border-slate-500 bg-transparent'
                  }`}>
                    {currentLang === 'ar' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#00bceb] animate-in zoom-in-75 duration-200" />
                    )}
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-white block">
                      العربية
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      من اليمين إلى اليسار (RTL) • اختيارية
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl" role="img" aria-label="Arabic">🇸🇦</span>
                  {currentLang === 'ar' && (
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/60">
                      نشط
                    </span>
                  )}
                </div>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-[#060d18] border border-[#172742] text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span className="text-cyan-400 font-bold">ℹ</span>
              <span>
                {t.languageNotice}
              </span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* تفضيلات العرض الإضافية (Preferences) */}
          {/* ======================================================================= */}
          <div className="pt-3 border-t border-[#1b2b48] space-y-3">
            <span className="text-xs font-bold text-white block">
              {t.preferencesSection}
            </span>

            {/* Toggle Grid */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070e1b] border border-[#1b2b48]">
              <div className="flex items-center gap-2.5">
                <Grid3X3 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-200">{t.showGrid}</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleGrid(!showGrid)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  showGrid ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    showGrid
                      ? dir === 'rtl'
                        ? '-translate-x-5'
                        : 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle Link Labels */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#070e1b] border border-[#1b2b48]">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-slate-200">{t.showLinkLabels}</span>
              </div>
              <button
                type="button"
                onClick={() => onToggleLinkLabels(!showLinkLabels)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  showLinkLabels ? 'bg-cyan-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    showLinkLabels
                      ? dir === 'rtl'
                        ? '-translate-x-5'
                        : 'translate-x-5'
                      : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-[#060e1a] border-t border-[#1b2b48] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#005073] hover:bg-[#0070a0] text-white font-bold text-xs transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
}
