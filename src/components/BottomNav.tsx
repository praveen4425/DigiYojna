import React from 'react';
import { ViewMode, Language } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { Home, MessageSquareText, Search, CheckCircle2, Bookmark } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  currentLang: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, currentLang }) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: t.home, icon: <Home className="w-5 h-5" /> },
    { id: 'chat', label: t.chat, icon: <MessageSquareText className="w-5 h-5" /> },
    { id: 'browse', label: t.browse, icon: <Search className="w-5 h-5" /> },
    { id: 'eligibility', label: t.eligibility, icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'saved', label: t.saved, icon: <Bookmark className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[60px] min-h-[48px] active:scale-95 ${
                isActive
                  ? 'text-[#144A46] font-bold bg-teal-50/80 border border-teal-200/60'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div className={`${isActive ? 'text-[#144A46] scale-110' : 'text-stone-500'} transition-transform`}>
                {item.icon}
              </div>
              <span className={`text-[11px] mt-0.5 whitespace-nowrap ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
