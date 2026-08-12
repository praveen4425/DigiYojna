import React, { useState } from 'react';
import { Scheme, Language } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle,
  FileCheck,
  Bookmark,
  BookmarkCheck,
  Volume2,
  Sprout,
  GraduationCap,
  HeartHandshake,
  FileText,
  Award,
  Briefcase,
  ShieldPlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface SchemeCardProps {
  scheme: Scheme;
  currentLang: Language;
  onSelectScheme?: (schemeId: string) => void;
  isSaved?: boolean;
  onToggleSave?: (schemeId: string) => void;
  defaultExpanded?: boolean;
  onCheckEligibility?: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  currentLang,
  onSelectScheme,
  isSaved = false,
  onToggleSave,
  defaultExpanded = false,
  onCheckEligibility,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const name = scheme.name[currentLang] || scheme.name.en;
  const tagline = scheme.tagline[currentLang] || scheme.tagline.en;
  const benefit = scheme.benefit[currentLang] || scheme.benefit.en;
  const eligibility = scheme.eligibility[currentLang] || scheme.eligibility.en;
  const documents = scheme.documents[currentLang] || scheme.documents.en;
  const steps = scheme.steps[currentLang] || scheme.steps.en;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return <Sprout className="w-5 h-5 text-emerald-700" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-indigo-700" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-700" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-blue-700" />;
      case 'Award':
        return <Award className="w-5 h-5 text-amber-700" />;
      case 'Briefcase':
      case 'BriefcaseCheck':
        return <Briefcase className="w-5 h-5 text-purple-700" />;
      case 'ShieldPlus':
        return <ShieldPlus className="w-5 h-5 text-teal-700" />;
      default:
        return <FileText className="w-5 h-5 text-[#144A46]" />;
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToSpeak = `${name}. ${tagline}. ${benefit}.`;
    speakText(textToSpeak, currentLang);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col my-3">
      {/* Top Banner & Header */}
      <div className="p-4 bg-gradient-to-br from-stone-50 via-white to-teal-50/20 border-b border-stone-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100/70 border border-teal-200/60 shrink-0 mt-0.5">
              {getCategoryIcon(scheme.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#144A46] bg-teal-100/80 px-2 py-0.5 rounded-md">
                  {scheme.category.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-bold text-stone-900 text-base leading-snug">{name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleSpeak}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-[#144A46] transition-colors"
              title={t.speak}
              aria-label={t.speak}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(scheme.id)}
                className={`p-1.5 rounded-full transition-colors ${
                  isSaved ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                }`}
                title={t.saveScheme}
                aria-label={t.saveScheme}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500" /> : <Bookmark className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-stone-600 mt-2.5 leading-relaxed">{tagline}</p>

        {/* Benefit Highlight Box */}
        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-semibold text-amber-900">
          <span className="shrink-0 text-amber-600 font-bold">💰 {t.featuredSchemes ? 'लाभ / Benefit:' : 'Benefit:'}</span>
          <span className="line-clamp-2">{benefit}</span>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="p-4 space-y-3 text-xs text-stone-700">
        {/* Eligibility Snippet */}
        <div>
          <h4 className="font-bold text-stone-800 text-xs mb-1.5 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {t.eligibilityCriteria}
          </h4>
          <ul className="space-y-1 pl-5 list-disc text-stone-600">
            {eligibility.slice(0, 2).map((item, idx) => (
              <li key={idx} className="leading-snug">{item}</li>
            ))}
          </ul>
        </div>

        {/* Action Buttons: Eligibility Checker & Steps Toggle */}
        <div className="flex items-center gap-2 mt-2">
          {onCheckEligibility && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCheckEligibility(scheme);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#144A46] hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.amIEligible || 'Am I Eligible?'}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-between gap-1.5 transition-all active:scale-95 ${
              onCheckEligibility ? '' : 'w-full'
            } ${
              isExpanded 
                ? 'bg-teal-50 border-teal-200 text-[#144A46]' 
                : 'bg-stone-100 hover:bg-stone-200/70 border-stone-200 text-stone-700'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#B8791F]" />
              {isExpanded ? t.hideSteps : t.showSteps}
            </span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Expandable Section */}
        {isExpanded && (
          <div className="pt-2 space-y-4 border-t border-stone-100 animate-in fade-in duration-200">
            {/* Required Documents */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
              <h5 className="font-bold text-stone-800 text-xs mb-2 flex items-center gap-1.5">
                📄 {t.requiredDocuments}
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {documents.map((doc, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-stone-200 text-[11px] font-medium text-stone-700 shadow-2xs"
                  >
                    • {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <div>
              <h5 className="font-bold text-stone-800 text-xs mb-2 flex items-center gap-1.5">
                🔢 {t.stepByStepGuide}
              </h5>
              <div className="space-y-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-100 text-stone-700 leading-relaxed text-xs">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Official Portal Link CTA */}
            <div className="pt-1">
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#B8791F] hover:bg-[#a36918] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <span>{t.applyNow}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Footer link to detail page */}
      {onSelectScheme && (
        <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-medium">
            {documents.length} {t.requiredDocuments ? 'दस्तावेज / Docs' : 'Docs'}
          </span>
          <button
            onClick={() => onSelectScheme(scheme.id)}
            className="font-bold text-[#144A46] hover:text-teal-800 flex items-center gap-1"
          >
            {t.viewAll} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
