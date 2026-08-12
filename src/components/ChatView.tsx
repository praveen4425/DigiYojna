import React, { useState, useRef, useEffect } from 'react';
import { Language, ChatMessage, Scheme } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { SCHEMES } from '../data/schemes';
import { SchemeCard } from './SchemeCard';
import {
  Send,
  Bot,
  User,
  Volume2,
  Sparkles,
  Loader2,
  Mic,
  RotateCcw,
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface ChatViewProps {
  currentLang: Language;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearHistory: () => void;
  onSelectScheme: (schemeId: string) => void;
  savedSchemeIds: string[];
  onToggleSaveScheme: (schemeId: string) => void;
  isLoading: boolean;
  onCheckEligibility?: (scheme: Scheme) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentLang,
  messages,
  onSendMessage,
  onClearHistory,
  onSelectScheme,
  savedSchemeIds,
  onToggleSaveScheme,
  isLoading,
  onCheckEligibility,
}) => {
  const [input, setInput] = useState('');
  const [isListeningMic, setIsListeningMic] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const quickQuestions: Record<Language, string[]> = {
    hi: [
      'पीएम किसान योजना क्या है?',
      'छात्रवृत्ति के लिए आवेदन कैसे करें?',
      'वृद्धावस्था पेंशन की पात्रता क्या है?',
      'आय प्रमाण पत्र के लिए कौन से दस्तावेज चाहिए?',
    ],
    en: [
      'What is PM Kisan Scheme?',
      'How to apply for Post-Matric Scholarship?',
      'What is Old Age Pension eligibility?',
      'Documents needed for Income Certificate?',
    ],
    mr: [
      'पीएम किसान योजना म्हणजे काय?',
      'शिष्यवृत्तीसाठी कसा अर्ज करावा?',
      'वृद्धपकाळ पेन्शनचे निकष काय आहेत?',
      'उत्पन्नाच्या दाखल्यासाठी लागणारी कागदपत्रे?',
    ],
    bn: [
      'পিএম কিষাণ প্রকল্প কী?',
      'পোস্ট-ম্যাট্রিক স্কলারশিপ কীভাবে পাব?',
      'বার্ধক্য পেনশনের যোগ্যতা কী?',
      'আয়ের শংসাপত্রের প্রয়োজনীয় নথি?',
    ],
    ta: [
      'PM கிசான் திட்டம் என்றால் என்ன?',
      'கல்வி உதவித்தொகைக்கு விண்ணப்பிப்பது எப்படி?',
      'முதியோர் ஓய்வூதியத் தகுதிகள் என்ன?',
      'வருமானச் சான்றிதழுக்குத் தேவையான ஆவணங்கள்?',
    ],
  };

  const chips = quickQuestions[currentLang] || quickQuestions.hi;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleChipClick = (text: string) => {
    if (isLoading) return;
    onSendMessage(text);
  };

  const handleSpeakBotMessage = (text: string) => {
    speakText(text, currentLang);
  };

  const handleSpeechToText = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on this browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang =
        currentLang === 'hi'
          ? 'hi-IN'
          : currentLang === 'mr'
          ? 'mr-IN'
          : currentLang === 'bn'
          ? 'bn-IN'
          : currentLang === 'ta'
          ? 'ta-IN'
          : 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListeningMic(true);
      recognition.onend = () => setIsListeningMic(false);
      recognition.onerror = () => setIsListeningMic(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListeningMic(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-md mx-auto relative">
      {/* Top Helper Toolbar */}
      <div className="px-4 py-2 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
        <span className="flex items-center gap-1.5 font-medium text-[#144A46]">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          {t.askAssistant}
        </span>

        <button
          onClick={onClearHistory}
          className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          {t.resetFilter ? 'पुनः शुरू करें' : 'Reset'}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#144A46] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Bubble Container */}
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-[#144A46] text-white rounded-tr-xs font-medium'
                      : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-black/5 text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeakBotMessage(msg.text)}
                        className="p-1 rounded hover:bg-stone-100 text-teal-800 transition-colors"
                        title={t.speak}
                        aria-label={t.speak}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Embedded Matched Scheme Cards */}
                {!isUser && msg.suggestedSchemes && msg.suggestedSchemes.length > 0 && (
                  <div className="space-y-3 mt-2">
                    {msg.suggestedSchemes.map((schemeId) => {
                      const scheme = SCHEMES.find((s) => s.id === schemeId);
                      if (!scheme) return null;
                      return (
                        <SchemeCard
                          key={scheme.id}
                          scheme={scheme}
                          currentLang={currentLang}
                          onSelectScheme={onSelectScheme}
                          isSaved={savedSchemeIds.includes(scheme.id)}
                          onToggleSave={onToggleSaveScheme}
                          defaultExpanded={false}
                          onCheckEligibility={onCheckEligibility}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-[#B8791F] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-stone-500 bg-white p-3 rounded-2xl border border-stone-200 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-[#144A46]" />
            <span>एआई उत्तर तैयार हो रहा है... / Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Fixed Chat Input Bar */}
      <div className="fixed bottom-[60px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-2.5 shadow-lg max-w-md mx-auto">
        {/* Quick Suggestion Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-1">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="shrink-0 text-[11px] font-semibold py-1 px-2.5 rounded-full bg-teal-50 border border-teal-200/80 text-[#144A46] hover:bg-teal-100 transition-colors"
            >
              + {chip}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSpeechToText}
            className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
              isListeningMic
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200'
            }`}
            title="Voice Input"
            aria-label="Voice Input"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#144A46] focus:bg-white transition-all font-medium"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-[#B8791F] hover:bg-[#a36918] disabled:opacity-50 text-white rounded-xl transition-all shadow-xs active:scale-95 shrink-0"
            aria-label={t.send}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
