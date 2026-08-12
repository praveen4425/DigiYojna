export type Language = 'hi' | 'en' | 'mr' | 'bn' | 'ta';

export type SchemeCategory = 
  | 'agriculture'
  | 'education'
  | 'social_security'
  | 'certificates'
  | 'employment'
  | 'health';

export interface EligibilityQuestion {
  question: Record<Language, string>;
  expectedAnswer: boolean;
  failedReason: Record<Language, string>;
}

export interface Scheme {
  id: string;
  category: SchemeCategory;
  iconName: string;
  officialUrl: string;
  name: Record<Language, string>;
  tagline: Record<Language, string>;
  benefit: Record<Language, string>;
  eligibility: Record<Language, string[]>;
  documents: Record<Language, string[]>;
  steps: Record<Language, string[]>;
  faqs?: Record<Language, { q: string; a: string }[]>;
  eligibilityQuestions: EligibilityQuestion[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedSchemes?: string[]; // IDs of matched schemes
}

export type ViewMode = 'language_select' | 'home' | 'chat' | 'browse' | 'scheme_detail' | 'eligibility' | 'saved';

export interface EligibilityAnswers {
  occupation?: string;
  incomeRange?: string;
  needCategory?: SchemeCategory;
  ageGroup?: string;
}
