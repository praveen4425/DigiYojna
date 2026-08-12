import React from 'react';
import { Language } from '../types';
import { LANGUAGES, UI_TRANSLATIONS } from '../data/translations';
import { Check, X, Volume2, Globe } from 'lucide-react';
import { speakText } from '../utils/speech';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const handleSelect = (code: Language, greeting: string) => {
    onSelectLanguage(code);
    speakText(greeting, code);
    onClose();
  };

  const handlePreviewAudio = (e: React.MouseEvent, code: Language, greeting: string) => {
    e.stopPropagation();
    speakText(greeting, code);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#144A46] text-white p-4 flex items-center justify-between border-b border-teal-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base text-white">{t.selectLanguage}</h2>
              <p className="text-xs text-teal-100/80">{t.chooseLanguageSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Cards List */}
        <div className="p-4 overflow-y-auto space-y-3">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang.code, lang.greeting)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-[0.99] ${
                  isSelected
                    ? 'border-[#144A46] bg-teal-50/80 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-teal-300 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#144A46] text-base">{lang.nativeName}</span>
                      <span className="text-xs font-medium text-stone-500">({lang.name})</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">{lang.greeting}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handlePreviewAudio(e, lang.code, lang.greeting)}
                    className="p-2 rounded-full hover:bg-teal-100 text-teal-800 transition-colors"
                    title="Audio sample"
                    aria-label={`Audio sample for ${lang.name}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#144A46] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer note */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-500 font-medium">
          🇮🇳 22+ Indian languages architecture ready for AI LLM translation
        </div>
      </div>
    </div>
  );
};
