import React, { useState } from 'react';
import { SchemeCategory, Language, Scheme } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { SCHEMES } from '../data/schemes';
import { SchemeCard } from './SchemeCard';
import { Search, Filter, X } from 'lucide-react';

interface BrowseViewProps {
  currentLang: Language;
  selectedCategory: SchemeCategory | 'all';
  onSelectCategory: (cat: SchemeCategory | 'all') => void;
  onSelectScheme: (schemeId: string) => void;
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onCheckEligibility?: (scheme: Scheme) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  currentLang,
  selectedCategory,
  onSelectCategory,
  onSelectScheme,
  savedSchemeIds,
  onToggleSaveScheme,
  onCheckEligibility,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const categories: { id: SchemeCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.allCategories },
    { id: 'agriculture', label: t.agriCategory },
    { id: 'education', label: t.eduCategory },
    { id: 'social_security', label: t.socialCategory },
    { id: 'certificates', label: t.certCategory },
    { id: 'employment', label: t.empCategory },
    { id: 'health', label: t.healthCategory },
  ];

  const filteredSchemes = SCHEMES.filter((scheme) => {
    // Filter by Category
    if (selectedCategory !== 'all' && scheme.category !== selectedCategory) {
      return false;
    }

    // Filter by Search Query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const name = (scheme.name[currentLang] || scheme.name.en).toLowerCase();
      const tagline = (scheme.tagline[currentLang] || scheme.tagline.en).toLowerCase();
      const benefit = (scheme.benefit[currentLang] || scheme.benefit.en).toLowerCase();

      return name.includes(q) || tagline.includes(q) || benefit.includes(q) || scheme.id.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-20 max-w-md mx-auto px-4 pt-3">
      {/* Search Input Header */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white border border-stone-300 rounded-2xl pl-10 pr-9 py-3 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#144A46] focus:ring-2 focus:ring-teal-100 shadow-2xs transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-xs font-bold text-stone-600">
          <Filter className="w-3.5 h-3.5 text-[#144A46]" />
          <span>{t.categories}:</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 py-1.5 px-3 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#144A46] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500 font-medium pt-1">
        <span>
          {filteredSchemes.length} {filteredSchemes.length === 1 ? 'योजना / Scheme' : 'योजनाएं / Schemes'}
        </span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-teal-800 font-bold hover:underline"
          >
            {t.resetFilter}
          </button>
        )}
      </div>

      {/* Scheme Cards */}
      <div className="space-y-3">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              currentLang={currentLang}
              onSelectScheme={onSelectScheme}
              isSaved={savedSchemeIds.includes(scheme.id)}
              onToggleSave={onToggleSaveScheme}
              onCheckEligibility={onCheckEligibility}
            />
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 space-y-2">
            <p className="font-semibold text-sm">कोई योजना नहीं मिली / No schemes found</p>
            <p className="text-xs">कृपया दूसरे शब्द खोजें या श्रेणी बदलें</p>
          </div>
        )}
      </div>
    </div>
  );
};
