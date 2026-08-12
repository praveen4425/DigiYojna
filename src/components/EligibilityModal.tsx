import React, { useState, useEffect } from 'react';
import { Scheme, Language, SchemeCategory } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  ExternalLink,
  ArrowRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Gift,
} from 'lucide-react';
import { speakText } from '../utils/speech';

interface EligibilityModalProps {
  scheme: Scheme | null;
  currentLang: Language;
  isOpen?: boolean;
  onClose: () => void;
  onSelectCategory?: (category: SchemeCategory) => void;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  scheme,
  currentLang,
  isOpen = true,
  onClose,
  onSelectCategory,
}) => {
  if (!isOpen || !scheme) return null;

  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;
  const questions = scheme.eligibilityQuestions || [];

  const [currentStep, setCurrentStep] = useState(0);
  const [failedStepIndex, setFailedStepIndex] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Reset state whenever scheme changes
  useEffect(() => {
    setCurrentStep(0);
    setFailedStepIndex(null);
    setIsFinished(false);
  }, [scheme?.id]);

  const schemeName = scheme.name[currentLang] || scheme.name.en;
  const benefitText = scheme.benefit[currentLang] || scheme.benefit.en;

  const handleAnswer = (userAnswer: boolean) => {
    const currentQ = questions[currentStep];
    const isCorrect = userAnswer === currentQ.expectedAnswer;

    if (!isCorrect) {
      setFailedStepIndex(currentStep);
      setIsFinished(true);
    } else {
      if (currentStep + 1 < questions.length) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsFinished(true);
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setFailedStepIndex(null);
    setIsFinished(false);
  };

  const currentQuestionObj = questions[currentStep];
  const questionText = currentQuestionObj ? currentQuestionObj.question[currentLang] || currentQuestionObj.question.en : '';

  const handleSpeakQuestion = () => {
    if (questionText) {
      speakText(questionText, currentLang);
    }
  };

  const isEligible = isFinished && failedStepIndex === null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#fcf9f2] text-[#2c2c2c] w-full max-w-md rounded-2xl shadow-xl border border-stone-200/90 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#144A46] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-800/80 border border-teal-600">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-100">{t.amIEligible || 'Am I Eligible?'}</h3>
              <p className="text-xs text-teal-100 line-clamp-1 font-medium">{schemeName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-teal-800 text-teal-200 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Flow Content */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
          {!isFinished ? (
            <>
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-stone-600">
                  <span>
                    {t.questionProgress} {currentStep + 1} {t.of} {questions.length}
                  </span>
                  <span className="text-[#144A46] font-bold">
                    {Math.round(((currentStep + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#144A46] h-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Single Question Box */}
              <div className="p-5 rounded-2xl bg-white border border-teal-800/15 shadow-sm space-y-4 my-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2">
                    <HelpCircle className="w-5 h-5 text-[#B8791F] shrink-0 mt-0.5" />
                    <h4 className="font-bold text-base text-stone-900 leading-snug">
                      {questionText}
                    </h4>
                  </div>
                  <button
                    onClick={handleSpeakQuestion}
                    className="p-2 rounded-full bg-teal-50 text-[#144A46] hover:bg-teal-100 shrink-0"
                    title={t.speak}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tappable Response Chips (Yes / No) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAnswer(true)}
                  className="py-4 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 border border-emerald-800"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{t.yes || 'Yes'}</span>
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className="py-4 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-base shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 border border-stone-300"
                >
                  <X className="w-5 h-5 text-stone-600" />
                  <span>{t.no || 'No'}</span>
                </button>
              </div>
            </>
          ) : isEligible ? (
            /* Eligible Result Screen */
            <div className="space-y-5 animate-in zoom-in-95 duration-200 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xl text-emerald-900 leading-tight">
                  {t.likelyEligible || 'You are likely eligible!'}
                </h4>
                <p className="text-xs text-stone-600">
                  Based on your answers, you fulfill the primary conditions for <strong>{schemeName}</strong>.
                </p>
              </div>

              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 text-left space-y-1">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#B8791F]" />
                  <span>Key Benefit:</span>
                </p>
                <p className="text-stone-800 font-medium leading-snug">{benefitText}</p>
              </div>

              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-800 text-left space-y-1">
                <p className="font-semibold text-emerald-900">Next Steps:</p>
                <p className="text-stone-700 leading-snug">• Prepare your Aadhaar and required documents.</p>
                <p className="text-stone-700 leading-snug">• Click below to visit the official government portal directly.</p>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#B8791F] hover:bg-[#a36918] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <span>{t.applyNow}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.tryAgain || 'Test Again'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Not Eligible Screen */
            <div className="space-y-5 animate-in zoom-in-95 duration-200 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-lg text-amber-950 leading-tight">
                  {t.notEligibleTitle || 'You may not meet all eligibility conditions.'}
                </h4>
                <p className="text-xs text-stone-600">
                  Do not worry! You can explore other related government options.
                </p>
              </div>

              {failedStepIndex !== null && questions[failedStepIndex] && (
                <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-300/80 text-xs text-left space-y-1.5">
                  <span className="font-bold text-amber-900 block flex items-center gap-1">
                    ⚠️ {t.failedCondition || 'Unmet Condition:'}
                  </span>
                  <p className="text-amber-950 font-medium leading-relaxed">
                    {questions[failedStepIndex].failedReason[currentLang] || questions[failedStepIndex].failedReason.en}
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                {onSelectCategory && (
                  <button
                    onClick={() => {
                      onClose();
                      onSelectCategory(scheme.category);
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#144A46] hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <span>{t.browseRelatedSchemes || 'Browse Other Schemes'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.tryAgain || 'Test Again'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
