import React, { useState, useEffect } from 'react';
import { Language, ViewMode, SchemeCategory, ChatMessage, Scheme } from './types';
import { UI_TRANSLATIONS, LANGUAGES } from './data/translations';
import { SCHEMES } from './data/schemes';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { EligibilityModal } from './components/EligibilityModal';
import { HomeView } from './components/HomeView';
import { ChatView } from './components/ChatView';
import { BrowseView } from './components/BrowseView';
import { SchemeDetailView } from './components/SchemeDetailView';
import { EligibilityChecker } from './components/EligibilityChecker';
import { SavedView } from './components/SavedView';
import { speakText } from './utils/speech';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedCategory, setSelectedCategory] = useState<SchemeCategory | 'all'>('all');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [eligibilityModalScheme, setEligibilityModalScheme] = useState<Scheme | null>(null);

  // Saved scheme IDs state with localStorage persistence
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('digiyojna_saved_schemes');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          return [];
        }
      }
    }
    return ['pm-kisan'];
  });

  // Chat message history
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: UI_TRANSLATIONS.en.botWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedSchemes: ['pm-kisan', 'ayushman-bharat'],
    },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('digiyojna_saved_schemes', JSON.stringify(savedSchemeIds));
    }
  }, [savedSchemeIds]);

  // Update welcome message when language changes
  useEffect(() => {
    const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;
    setChatMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            ...prev[0],
            text: t.botWelcome,
          },
        ];
      }
      return prev;
    });
  }, [currentLang]);

  const handleToggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds((prev) =>
      prev.includes(schemeId) ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
    );
  };

  const handleSelectScheme = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    setCurrentView('scheme_detail');
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsLoadingChat(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: currentLang,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch AI chat response');
      }

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedSchemes: data.suggestedSchemes,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Chat request failed, using local match fallback:', err);

      // Local Fallback reply
      const q = text.toLowerCase();
      let matchedIds: string[] = [];

      SCHEMES.forEach((s) => {
        if (
          q.includes(s.id) ||
          q.includes(s.category) ||
          q.includes('kisan') && s.id === 'pm-kisan' ||
          q.includes('pension') && s.id === 'old-age-pension' ||
          q.includes('scholarship') && s.id === 'post-matric-scholarship' ||
          q.includes('certificate') && (s.id === 'income-certificate' || s.id === 'caste-certificate') ||
          q.includes('internship') && s.id === 'pm-internship' ||
          q.includes('ayushman') && s.id === 'ayushman-bharat'
        ) {
          matchedIds.push(s.id);
        }
      });

      if (matchedIds.length === 0) matchedIds = ['pm-kisan', 'post-matric-scholarship'];

      const fallbackText =
        currentLang === 'hi'
          ? `आपके सवाल के अनुसार यहाँ मुख्य योजनाओं की जानकारी दी गई है:`
          : currentLang === 'mr'
          ? `तुमच्या प्रश्नानुसार मुख्य योजनांची माहिती खालीलप्रमाणे आहे:`
          : currentLang === 'bn'
          ? `আপনার প্রশ্নের ভিত্তিতে প্রধান প্রকল্পগুলির তথ্য নিচে দেওয়া হলো:`
          : currentLang === 'ta'
          ? `உங்கள் கேள்விக்கு ஏற்ப முக்கிய திட்டங்களின் விவரங்கள் கீழே தரப்பட்டுள்ளன:`
          : `Based on your question, here is the relevant scheme information:`;

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedSchemes: matchedIds,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleSendSuggestionToChat = (text: string) => {
    setCurrentView('chat');
    handleSendMessage(text);
  };

  const handleSpeakGreeting = () => {
    const langObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
    speakText(langObj.greeting, currentLang);
  };

  const selectedSchemeObj = SCHEMES.find((s) => s.id === selectedSchemeId);

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-[#2c2c2c] font-sans antialiased selection:bg-teal-100 selection:text-[#144A46]">
      {/* Top Mobile Sticky Header */}
      <Header
        currentLang={currentLang}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedSchemeIds.length}
        onSpeakGreeting={handleSpeakGreeting}
      />

      {/* Main View Display Area */}
      <main className="min-h-[calc(100vh-130px)]">
        {currentView === 'home' && (
          <HomeView
            currentLang={currentLang}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCategoryFilter={(cat) => setSelectedCategory(cat)}
            onSendSuggestionToChat={handleSendSuggestionToChat}
            onSelectScheme={handleSelectScheme}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            onCheckEligibility={(scheme) => setEligibilityModalScheme(scheme)}
          />
        )}

        {currentView === 'chat' && (
          <ChatView
            currentLang={currentLang}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClearHistory={() =>
              setChatMessages([
                {
                  id: 'welcome',
                  sender: 'bot',
                  text: UI_TRANSLATIONS[currentLang]?.botWelcome || UI_TRANSLATIONS.en.botWelcome,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  suggestedSchemes: ['pm-kisan', 'ayushman-bharat'],
                },
              ])
            }
            onSelectScheme={handleSelectScheme}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            isLoading={isLoadingChat}
            onCheckEligibility={(scheme) => setEligibilityModalScheme(scheme)}
          />
        )}

        {currentView === 'browse' && (
          <BrowseView
            currentLang={currentLang}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectScheme={handleSelectScheme}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            onCheckEligibility={(scheme) => setEligibilityModalScheme(scheme)}
          />
        )}

        {currentView === 'scheme_detail' && selectedSchemeObj && (
          <SchemeDetailView
            scheme={selectedSchemeObj}
            currentLang={currentLang}
            onBack={() => setCurrentView('browse')}
            isSaved={savedSchemeIds.includes(selectedSchemeObj.id)}
            onToggleSave={handleToggleSaveScheme}
            onCheckEligibility={(scheme) => setEligibilityModalScheme(scheme)}
          />
        )}

        {currentView === 'eligibility' && (
          <EligibilityChecker
            currentLang={currentLang}
            onSelectScheme={handleSelectScheme}
            savedSchemeIds={savedSchemeIds}
            onToggleSaveScheme={handleToggleSaveScheme}
            onCheckEligibility={(scheme) => setEligibilityModalScheme(scheme)}
          />
        )}

        {currentView === 'saved' && (
          <SavedView
            currentLang={currentLang}
            savedSchemeIds={savedSchemeIds}
            onSelectScheme={handleSelectScheme}
            onToggleSaveScheme={handleToggleSaveScheme}
            onNavigateBrowse={() => setCurrentView('browse')}
            onCheckEligibility={(scheme) => setEligibilityModalScheme(scheme)}
          />
        )}
      </main>

      {/* Am I Eligible? Modal Flow */}
      {eligibilityModalScheme && (
        <EligibilityModal
          scheme={eligibilityModalScheme}
          currentLang={currentLang}
          onClose={() => setEligibilityModalScheme(null)}
          onApplyNow={(schemeId) => {
            setEligibilityModalScheme(null);
            handleSelectScheme(schemeId);
          }}
        />
      )}

      {/* Language Switcher Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={currentLang}
        onSelectLanguage={(lang) => setCurrentLang(lang)}
      />

      {/* Fixed Mobile Bottom Navigation Bar */}
      <BottomNav
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
      />
    </div>
  );
}
