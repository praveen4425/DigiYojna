import React from 'react';
import { Language, ViewMode, SchemeCategory, Scheme } from '../types';
import { UI_TRANSLATIONS, LANGUAGES } from '../data/translations';
import { SCHEMES } from '../data/schemes';
import { SchemeCard } from './SchemeCard';
import {
  Sprout,
  GraduationCap,
  HeartHandshake,
  FileText,
  Briefcase,
  ShieldPlus,
  Sparkles,
  ArrowRight,
  MessageSquareText,
  CheckCircle2,
  Volume2,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface HomeViewProps {
  currentLang: Language;
  onNavigate: (view: ViewMode) => void;
  onSelectCategoryFilter: (category: SchemeCategory | 'all') => void;
  onSendSuggestionToChat: (questionText: string) => void;
  onSelectScheme: (schemeId: string) => void;
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  onCheckEligibility?: (scheme: Scheme) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLang,
  onNavigate,
  onSelectCategoryFilter,
  onSendSuggestionToChat,
  onSelectScheme,
  savedSchemeIds,
  onToggleSaveScheme,
  onCheckEligibility,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  // Suggestion chips with native text for all 5 languages
  const suggestionChips: Record<Language, string[]> = {
    hi: [
      'क्या मैं पीएम किसान के लिए पात्र हूँ?',
      'छात्रवृत्ति के लिए कौन से दस्तावेज चाहिए?',
      'वृद्धावस्था पेंशन कैसे मिलेगी?',
      'आय प्रमाण पत्र कैसे बनवाएं?',
      'आयुष्मान भारत कार्ड कैसे डाउनलोड करें?',
    ],
    en: [
      'Am I eligible for PM Kisan?',
      'What documents are required for scholarship?',
      'How to apply for Old Age Pension?',
      'How to get Income Certificate?',
      'How to download Ayushman Bharat card?',
    ],
    mr: [
      'मी पीएम किसान योजनेसाठी पात्र आहे का?',
      'शिष्यवृत्तीसाठी कोणती कागदपत्रे लागतील?',
      'ज्येष्ठ नागरिक पेन्शन कशी मिळेल?',
      'उत्पन्नाचा दाखला कसा काढायचा?',
      'आयुष्मान कार्ड कसे डाउनलोड करायचे?',
    ],
    bn: [
      'আমি কি পিএম কিষাণ প্রকল্পের যোগ্য?',
      'স্কলারশিপের জন্য কী কী নথি লাগবে?',
      'বার্ধক্য ভাতা বা পেনশন কীভাবে পাব?',
      'আয়ের শংসাপত্র কীভাবে তৈরি করব?',
      'আয়ুষ্মান ভারত কার্ড কীভাবে ডাউনলোড করব?',
    ],
    ta: [
      'நான் PM கிசான் திட்டத்திற்கு தகுதியானவனா?',
      'கல்வி உதவித்தொகைக்கு என்னென்ன ஆவணங்கள் தேவை?',
      'முதியோர் ஓய்வூதியத்திற்கு কীভাবে விண்ணப்பிப்பது?',
      'வருமானச் சான்றிதழ் பெறுவது எப்படி?',
      'ஆயுஷ்மான் கார்டு பதிவிறக்கம் செய்வது எப்படி?',
    ],
  };

  const currentChips = suggestionChips[currentLang] || suggestionChips.hi;

  const categories: { id: SchemeCategory; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'agriculture', label: t.agriCategory, icon: <Sprout className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { id: 'education', label: t.eduCategory, icon: <GraduationCap className="w-6 h-6" />, color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { id: 'social_security', label: t.socialCategory, icon: <HeartHandshake className="w-6 h-6" />, color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { id: 'certificates', label: t.certCategory, icon: <FileText className="w-6 h-6" />, color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'employment', label: t.empCategory, icon: <Briefcase className="w-6 h-6" />, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { id: 'health', label: t.healthCategory, icon: <ShieldPlus className="w-6 h-6" />, color: 'bg-teal-50 text-teal-800 border-teal-200' },
  ];

  const handleCategoryClick = (cat: SchemeCategory) => {
    onSelectCategoryFilter(cat);
    onNavigate('browse');
  };

  const handleChipClick = (chipText: string) => {
    onSendSuggestionToChat(chipText);
  };

  const handleSpeakGreeting = () => {
    speakText(currentLangObj.greeting, currentLang);
  };

  return (
    <div className="space-y-5 pb-20 max-w-md mx-auto px-4 pt-3">
      {/* Welcome Citizen Hero Card */}
      <div className="bg-gradient-to-r from-[#144A46] to-[#1c5d58] rounded-2xl p-4 text-white shadow-md border border-teal-800 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> DigiYojna Assistant
            </span>
            <button
              onClick={handleSpeakGreeting}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 transition-colors"
              title={t.speak}
              aria-label={t.speak}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-white mb-1 leading-snug">
            {currentLangObj.greeting}
          </h2>
          <p className="text-xs text-teal-100/90 leading-relaxed mb-3">
            {t.botWelcome}
          </p>

          <button
            onClick={() => onNavigate('chat')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#B8791F] hover:bg-[#a36918] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>{t.askAssistant}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Try Asking Suggestion Chips Section (Requirement #4) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            💡 {t.tryAsking}
          </h3>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {currentChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="shrink-0 py-2 px-3 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:border-[#144A46] hover:bg-teal-50/50 hover:text-[#144A46] transition-all shadow-2xs active:scale-95"
            >
              💬 "{chip}"
            </button>
          ))}
        </div>
      </div>

      {/* 3-Step Eligibility Quick Checker Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            {t.checkEligibilityTitle}
          </h4>
          <p className="text-[11px] text-amber-800 line-clamp-1">{t.checkEligibilitySub}</p>
        </div>
        <button
          onClick={() => onNavigate('eligibility')}
          className="shrink-0 py-2 px-3 rounded-xl bg-[#B8791F] text-white font-bold text-xs shadow-xs hover:bg-[#a36918] transition-all active:scale-95"
        >
          {t.eligibility}
        </button>
      </div>

      {/* Clickable Category Cards Section (Requirement #3) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm">{t.categories}</h3>
          <button
            onClick={() => {
              onSelectCategoryFilter('all');
              onNavigate('browse');
            }}
            className="text-xs font-bold text-[#144A46] hover:underline"
          >
            {t.viewAll} →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat) => {
            const count = SCHEMES.filter((s) => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-3 rounded-2xl border ${cat.color} transition-all flex flex-col items-start text-left hover:shadow-sm active:scale-95`}
              >
                <div className="mb-2 p-2 rounded-xl bg-white/80 shadow-2xs">
                  {cat.icon}
                </div>
                <span className="font-bold text-xs leading-snug line-clamp-1">{cat.label}</span>
                <span className="text-[10px] opacity-75 font-medium mt-0.5">
                  {count} {count === 1 ? 'योजना / Scheme' : 'योजनाएं / Schemes'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Schemes List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 text-sm">{t.featuredSchemes}</h3>
          <button
            onClick={() => onNavigate('browse')}
            className="text-xs font-bold text-[#144A46] hover:underline"
          >
            {t.viewAll} →
          </button>
        </div>

        <div className="space-y-3">
          {SCHEMES.slice(0, 4).map((scheme) => (
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
      </div>
    </div>
  );
};
