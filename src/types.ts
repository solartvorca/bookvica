export interface Bukvitsa {
  id: number;
  number: number;
  letter: string;
  name: string;
  transliteration: string;
  meaning: string;
  semantic_modules: string[];
  full_description?: string;
}

export interface DailyRune {
  date: string;
  bukvitsa: Bukvitsa;
}

export interface BirthdayRunes {
  personality: Bukvitsa;
  destiny: Bukvitsa;
}
