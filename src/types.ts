export interface SemanticModule {
  name: string;
  description?: string;
}

export interface Bukvitsa {
  id: number;
  number: number;
  letter: string;
  name: string;
  transliteration: string;
  meaning: string;
  semantic_modules: Array<SemanticModule | string>;
  description?: string;
  full_description?: string;
  example?: string;
  mysteries?: string;
  divination?: string;
}

export interface DailyRune {
  date: string;
  bukvitsa: Bukvitsa;
}

export interface BirthdayRunes {
  personality: Bukvitsa;
  destiny: Bukvitsa;
}
