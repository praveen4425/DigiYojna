import React from 'react';
import { Language, Scheme } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { SCHEMES } from '../data/schemes';
import { SchemeCard } from './SchemeCard';
import { Bookmark, Sparkles } from 'lucide-react';

interface SavedViewProps {
  currentLang: Language;
  savedSchemeIds: string[];
  onSelectScheme: (schemeId: string) => void;
  onToggleSaveScheme: (schemeId: string) => void;
  onNavigateBrowse: () => void;
  onCheckEligibility?: (scheme: Scheme) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({
  currentLang,
  savedSchemeIds,
  onSelectScheme,
  onToggleSaveScheme,
  onNavigateBrowse,
  onCheckEligibility,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const savedSchemes = SCHEMES.filter((scheme) => savedSchemeIds.includes(scheme.id));

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto px-4 pt-3">
      {/* Header Banner */}
      <div className="bg-[#144A46] text-white p-4 rounded-2xl shadow-sm border border-teal-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-300 fill-amber-300" />
          <div>
            <h2 className="font-bold text-base text-white">{t.savedSchemes}</h2>
            <p className="text-xs text-teal-100/80">
              {savedSchemes.length} {savedSchemes.length === 1 ? 'योजना सहेजी गई' : 'योजनाएं सहेजी गईं'}
            </p>
          </div>
        </div>
      </div>

      {savedSchemes.length > 0 ? (
        <div className="space-y-3">
          {savedSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              currentLang={currentLang}
              onSelectScheme={onSelectScheme}
              isSaved={true}
              onToggleSave={onToggleSaveScheme}
              onCheckEligibility={onCheckEligibility}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-600 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">{t.noSavedSchemes}</h3>
            <p className="text-xs text-stone-500 mt-1">
              योजना कार्ड पर बुकमार्क बटन पर टैप करके योजनाएं सहेजें।
            </p>
          </div>
          <button
            onClick={onNavigateBrowse}
            className="py-2.5 px-4 rounded-xl bg-[#144A46] text-white font-bold text-xs hover:bg-teal-900 transition-all active:scale-95"
          >
            {t.browse}
          </button>
        </div>
      )}
    </div>
  );
};
