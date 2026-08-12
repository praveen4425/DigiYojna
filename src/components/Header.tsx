import React from 'react';
import { Language, ViewMode } from '../types';
import { UI_TRANSLATIONS, LANGUAGES } from '../data/translations';
import { ArrowLeft, Globe, Volume2, ShieldCheck, Bookmark } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onOpenLanguageModal: () => void;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  savedCount: number;
  onSpeakGreeting: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onOpenLanguageModal,
  currentView,
  onNavigate,
  savedCount,
  onSpeakGreeting,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const isSubPage = currentView !== 'home' && currentView !== 'language_select';

  return (
    <header className="sticky top-0 z-40 bg-[#144A46] text-white shadow-md border-b border-[#1c5d58]">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left Side: Back button or Emblem logo */}
        <div className="flex items-center gap-2.5">
          {isSubPage ? (
            <button
              onClick={() => onNavigate('home')}
              className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white flex items-center gap-1 focus:outline-none"
              aria-label={t.back}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#B8791F]/20 border border-[#B8791F]/40 flex items-center justify-center text-[#E6A035]">
              <ShieldCheck className="w-5 h-5 text-[#E6A035]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1">
                {t.appTitle}
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-[#B8791F] text-white">
                AI Gov
              </span>
            </div>
            <p className="text-[11px] text-teal-100/80 line-clamp-1 font-medium">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Language Switcher pill & Audio speaker */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSpeakGreeting}
            className="p-2 rounded-full bg-teal-800/80 hover:bg-teal-700 text-amber-300 transition-all active:scale-95 border border-teal-600/50"
            title={t.speak}
            aria-label={t.speak}
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLanguageModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all border border-white/20 text-xs font-semibold text-white"
            aria-label={t.changeLanguage}
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>{currentLangObj.nativeName}</span>
          </button>

          {savedCount > 0 && (
            <button
              onClick={() => onNavigate('saved')}
              className="relative p-2 rounded-full bg-teal-800/80 text-white hover:bg-teal-700 transition-all"
              aria-label={t.saved}
            >
              <Bookmark className="w-4 h-4 text-amber-300" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-teal-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
