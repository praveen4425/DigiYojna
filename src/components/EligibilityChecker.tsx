import React, { useState } from 'react';
import { Language, SchemeCategory, EligibilityAnswers, Scheme } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { SCHEMES } from '../data/schemes';
import { SchemeCard } from './SchemeCard';
import {
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  UserCheck,
  IndianRupee,
  Layers,
} from 'lucide-react';

interface EligibilityCheckerProps {
  currentLang: Language;
  onSelectScheme: (schemeId: string) => void;
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onCheckEligibility?: (scheme: Scheme) => void;
}

export const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({
  currentLang,
  onSelectScheme,
  savedSchemeIds,
  onToggleSaveScheme,
  onCheckEligibility,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [answers, setAnswers] = useState<EligibilityAnswers>({});
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const occupations = [
    { id: 'farmer', label: t.farmer, category: 'agriculture' as SchemeCategory },
    { id: 'student', label: t.student, category: 'education' as SchemeCategory },
    { id: 'senior', label: t.seniorCitizen, category: 'social_security' as SchemeCategory },
    { id: 'jobseeker', label: t.jobSeeker, category: 'employment' as SchemeCategory },
    { id: 'lowincome', label: t.lowIncome, category: 'certificates' as SchemeCategory },
  ];

  const incomeRanges = [
    { id: 'less_1l', label: t.lessThan1L },
    { id: '1l_3l', label: t.between1L3L },
    { id: '3l_8l', label: t.between3L8L },
    { id: 'above_8l', label: t.above8L },
  ];

  const needCategories: { id: SchemeCategory; label: string }[] = [
    { id: 'agriculture', label: t.agriCategory },
    { id: 'education', label: t.eduCategory },
    { id: 'social_security', label: t.socialCategory },
    { id: 'certificates', label: t.certCategory },
    { id: 'employment', label: t.empCategory },
    { id: 'health', label: t.healthCategory },
  ];

  const handleSelectOccupation = (occId: string, cat: SchemeCategory) => {
    setAnswers((prev) => ({ ...prev, occupation: occId, needCategory: cat }));
    setStep(2);
  };

  const handleSelectIncome = (incomeId: string) => {
    setAnswers((prev) => ({ ...prev, incomeRange: incomeId }));
    setStep(3);
  };

  const handleSelectNeed = (needCat: SchemeCategory) => {
    setAnswers((prev) => ({ ...prev, needCategory: needCat }));
    setStep(4); // Show Results
  };

  const handleReset = () => {
    setAnswers({});
    setStep(1);
  };

  // Calculate matching schemes based on wizard answers
  const matchedSchemes = SCHEMES.filter((scheme) => {
    if (step !== 4) return false;

    // Filter by explicitly selected need category
    if (answers.needCategory && scheme.category === answers.needCategory) {
      return true;
    }

    // Role / Occupation based scheme matching
    if (answers.occupation === 'farmer' && scheme.category === 'agriculture') return true;
    if (answers.occupation === 'student' && scheme.category === 'education') return true;
    if (answers.occupation === 'senior' && (scheme.id === 'old-age-pension' || scheme.id === 'ayushman-bharat' || scheme.id === 'pm-suraksha-bima')) return true;
    if (answers.occupation === 'jobseeker' && scheme.category === 'employment') return true;
    if (answers.occupation === 'lowincome' && (scheme.category === 'certificates' || scheme.id === 'ayushman-bharat' || scheme.id === 'ration-card')) return true;

    return false;
  });

  return (
    <div className="space-y-4 pb-24 max-w-md mx-auto px-4 pt-3">
      {/* Wizard Header Banner */}
      <div className="bg-gradient-to-r from-[#144A46] to-[#1c5d58] rounded-2xl p-4 text-white shadow-md border border-teal-800 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {t.checkEligibilityTitle}
          </span>
          {step > 1 && (
            <button
              onClick={handleReset}
              className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              {t.resetFilter}
            </button>
          )}
        </div>
        <p className="text-xs text-teal-100/90">{t.checkEligibilitySub}</p>

        {/* Progress Step Indicator */}
        <div className="flex items-center gap-1.5 pt-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-amber-400' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Occupation */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#144A46]" />
            1. {t.step1Title}
          </h3>

          <div className="space-y-2">
            {occupations.map((occ) => (
              <button
                key={occ.id}
                onClick={() => handleSelectOccupation(occ.id, occ.category)}
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-teal-50 hover:border-teal-400 text-stone-800 font-semibold text-xs text-left transition-all flex items-center justify-between active:scale-95"
              >
                <span>{occ.label}</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Income Range */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-600" />
            2. {t.step2Title}
          </h3>

          <div className="space-y-2">
            {incomeRanges.map((inc) => (
              <button
                key={inc.id}
                onClick={() => handleSelectIncome(inc.id)}
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-teal-50 hover:border-teal-400 text-stone-800 font-semibold text-xs text-left transition-all flex items-center justify-between active:scale-95"
              >
                <span>{inc.label}</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Need Category */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-600" />
            3. {t.step3Title}
          </h3>

          <div className="space-y-2">
            {needCategories.map((need) => (
              <button
                key={need.id}
                onClick={() => handleSelectNeed(need.id)}
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-teal-50 hover:border-teal-400 text-stone-800 font-semibold text-xs text-left transition-all flex items-center justify-between active:scale-95"
              >
                <span>{need.label}</span>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.matchedSchemes}
            </span>
            <button
              onClick={handleReset}
              className="text-teal-800 hover:underline font-bold"
            >
              {t.resetFilter}
            </button>
          </div>

          {matchedSchemes.length > 0 ? (
            matchedSchemes.map((scheme) => (
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
            <div className="p-6 bg-white rounded-2xl border border-stone-200 text-center space-y-2 text-stone-600">
              <p className="font-semibold text-xs text-stone-700">Recommended Schemes:</p>
              {SCHEMES.slice(0, 3).map((scheme) => (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  currentLang={currentLang}
                  onSelectScheme={onSelectScheme}
                  isSaved={savedSchemeIds.includes(scheme.id)}
                  onToggleSave={onToggleSaveScheme}
                  onCheckEligibility={onCheckEligibility}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
