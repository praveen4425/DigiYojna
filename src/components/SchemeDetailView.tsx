import React, { useState } from 'react';
import { Scheme, Language } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  FileCheck2,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Share2,
  HelpCircle,
  Building2,
  Check,
  Sparkles,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface SchemeDetailViewProps {
  scheme: Scheme;
  currentLang: Language;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (schemeId: string) => void;
  onCheckEligibility?: (scheme: Scheme) => void;
}

export const SchemeDetailView: React.FC<SchemeDetailViewProps> = ({
  scheme,
  currentLang,
  onBack,
  isSaved,
  onToggleSave,
  onCheckEligibility,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'documents' | 'steps' | 'faqs'>('overview');
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const name = scheme.name[currentLang] || scheme.name.en;
  const tagline = scheme.tagline[currentLang] || scheme.tagline.en;
  const benefit = scheme.benefit[currentLang] || scheme.benefit.en;
  const eligibility = scheme.eligibility[currentLang] || scheme.eligibility.en;
  const documents = scheme.documents[currentLang] || scheme.documents.en;
  const steps = scheme.steps[currentLang] || scheme.steps.en;
  const faqs = scheme.faqs ? scheme.faqs[currentLang] || scheme.faqs.en : [];

  const handleToggleDoc = (idx: number) => {
    setCheckedDocs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSpeak = () => {
    const speechText = `${name}. ${tagline}. Benefit: ${benefit}.`;
    speakText(speechText, currentLang);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: name,
          text: `${name}: ${benefit}`,
          url: scheme.officialUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(scheme.officialUrl);
      alert('Official link copied to clipboard!');
    }
  };

  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;

  return (
    <div className="pb-28 max-w-md mx-auto min-h-screen bg-[#fcf9f2]">
      {/* Detail Header Banner */}
      <div className="bg-[#144A46] text-white p-4 pt-4 rounded-b-2xl shadow-md border-b border-teal-800">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
            aria-label={t.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSpeak}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-300 transition-colors"
              title={t.speak}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={t.share}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(scheme.id)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title={t.saveScheme}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Bookmark className="w-4 h-4 text-white" />}
            </button>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-teal-950 px-2 py-0.5 rounded-md">
          {scheme.category.replace('_', ' ')}
        </span>
        <h1 className="text-lg font-bold text-white mt-1.5 leading-snug">{name}</h1>
        <p className="text-xs text-teal-100/90 mt-1">{tagline}</p>

        {/* Benefit Highlight */}
        <div className="mt-3 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-xs font-semibold text-amber-200">
          💰 <span className="font-bold text-white">{benefit}</span>
        </div>
      </div>

      {/* Detail Tabs Bar */}
      <div className="flex bg-white border-b border-stone-200 px-2 overflow-x-auto scrollbar-none sticky top-[57px] z-30 shadow-2xs">
        {[
          { id: 'overview', label: 'विवरण / Overview' },
          { id: 'eligibility', label: t.eligibilityCriteria },
          { id: 'documents', label: t.requiredDocuments },
          { id: 'steps', label: t.stepByStepGuide },
          { id: 'faqs', label: t.faqs },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-[#144A46] text-[#144A46]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Container */}
      <div className="p-4 space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Quick Am I Eligible Banner */}
            {onCheckEligibility && (
              <div className="p-3.5 bg-gradient-to-r from-teal-900 to-[#144A46] rounded-2xl text-white shadow-sm flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.amIEligible || 'Am I Eligible?'}
                  </h4>
                  <p className="text-[11px] text-teal-100/90 mt-0.5">
                    {t.checkEligibilitySub ? '2-3 आसान प्रश्नों में अपनी पात्रता जांचें' : 'Check your eligibility in 2-3 quick questions'}
                  </p>
                </div>
                <button
                  onClick={() => onCheckEligibility(scheme)}
                  className="py-2 px-3.5 rounded-xl bg-[#B8791F] hover:bg-[#a36918] text-white font-bold text-xs shrink-0 active:scale-95 transition-all shadow-xs"
                >
                  {t.checkMyEligibility || 'Check Now'}
                </button>
              </div>
            )}

            <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#144A46]" />
                {name}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">{tagline}</p>
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                मुख्य लाभ / Primary Benefit
              </h4>
              <p className="text-sm font-semibold leading-relaxed">{benefit}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-xs text-stone-800">{t.eligibilityCriteria}</h4>
              <ul className="space-y-1.5 text-xs text-stone-600 pl-4 list-disc">
                {eligibility.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'eligibility' && (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.eligibilityCriteria}
            </h3>
            <div className="space-y-2.5">
              {eligibility.map((item, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-800 font-medium leading-relaxed flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                {t.documentsChecklist}
              </h3>
              <span className="text-xs font-bold text-[#144A46] bg-teal-50 px-2 py-1 rounded-full border border-teal-200">
                {checkedCount} / {documents.length}
              </span>
            </div>

            <p className="text-xs text-stone-500">
              टैप करके टिक करें जो दस्तावेज आपके पास तैयार हैं:
            </p>

            <div className="space-y-2">
              {documents.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleDoc(idx)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isChecked
                        ? 'bg-teal-50/80 border-teal-400 text-teal-950 font-semibold'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xs leading-snug">{doc}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isChecked ? 'bg-[#144A46] border-[#144A46] text-white' : 'border-stone-400 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">
              🔢 {t.stepByStepGuide}
            </h3>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="p-3.5 bg-teal-50/40 rounded-xl border border-teal-200/80 space-y-1">
                  <div className="text-[11px] font-bold text-[#144A46] uppercase tracking-wider">
                    Step {idx + 1}
                  </div>
                  <p className="text-xs text-stone-800 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#144A46]" />
              {t.faqs}
            </h3>

            {faqs.length > 0 ? (
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <p className="font-bold text-xs text-stone-900">Q: {faq.q}</p>
                    <p className="text-xs text-stone-600 leading-relaxed">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500">इस योजना के मुख्य प्रश्न ऊपर दिए गए चरणों में शामिल हैं।</p>
            )}
          </div>
        )}
      </div>

      {/* Fixed Sticky Bottom Apply CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 max-w-md mx-auto shadow-2xl flex items-center gap-2">
        {onCheckEligibility && (
          <button
            onClick={() => onCheckEligibility(scheme)}
            className="py-3 px-3 rounded-xl bg-[#144A46] hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t.amIEligible || 'Am I Eligible?'}</span>
          </button>
        )}
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 px-4 rounded-xl bg-[#B8791F] hover:bg-[#a36918] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
        >
          <span>{t.applyNow}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
