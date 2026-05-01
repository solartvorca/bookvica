import { create } from 'zustand';
import { Bukvitsa, DailyRune } from '../types';
import bukvitsyData from '../data/bukvitsy_complete.json';

const normalizedBukvitsy: Bukvitsa[] = (bukvitsyData as any[]).map((item) => ({
  id: item.id,
  number: item.number,
  letter: item.letter,
  name: item.name,
  transliteration: item.transliteration || item.name || '',
  meaning: item.meaning || item.description?.split('\n')[0] || '',
  description: item.description || '',
  full_description: item.description || item.full_description || '',
  example: item.example || '',
  mysteries: item.mysteries || '',
  divination: item.divination || '',
  semantic_modules: Array.isArray(item.semantic_modules)
    ? item.semantic_modules.map((module: any) =>
        typeof module === 'string'
          ? module
          : {
              name: module.name || String(module),
              description: module.description || '',
            }
      )
    : [],
}));

interface BukvitsyStore {
  bukvitsy: Bukvitsa[];
  favorites: number[];
  history: number[];
  dailyHistory: DailyRune[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  addToHistory: (id: number) => void;
  addDailyRune: (bukvitsa: Bukvitsa) => void;
  getDailyRune: () => Bukvitsa | null;
  getRandomRune: () => Bukvitsa | null;
  getBukvitsaById: (id: number) => Bukvitsa | undefined;
}

export const useBukvitsyStore = create<BukvitsyStore>((set, get) => {
  // Load from localStorage with error handling
  let initialFavorites: number[] = [];
  let initialHistory: number[] = [];
  let initialDailyHistory: DailyRune[] = [];

  try {
    const savedFavorites = localStorage.getItem('bukvitsa_favorites');
    initialFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (e) {
    console.error('Error loading favorites:', e);
  }

  try {
    const savedHistory = localStorage.getItem('bukvitsa_history');
    initialHistory = savedHistory ? JSON.parse(savedHistory) : [];
  } catch (e) {
    console.error('Error loading history:', e);
  }

  try {
    const savedDailyHistory = localStorage.getItem('bukvitsa_daily_history');
    if (savedDailyHistory) {
      const parsed = JSON.parse(savedDailyHistory);
      // Validate that dailyHistory items have the required structure
      initialDailyHistory = Array.isArray(parsed)
        ? parsed.filter((item: any) => item && item.date && item.bukvitsa && item.bukvitsa.id)
        : [];
    }
  } catch (e) {
    console.error('Error loading daily history:', e);
  }

  console.log('Store initialized:', {
    bukvitsyCount: normalizedBukvitsy.length,
    favoritesCount: initialFavorites.length,
    historyCount: initialHistory.length,
    dailyHistoryCount: initialDailyHistory.length,
  });

  return {
    bukvitsy: [...normalizedBukvitsy].sort((a, b) => a.number - b.number),
    favorites: initialFavorites,
    history: initialHistory,
    dailyHistory: initialDailyHistory,

    addFavorite: (id: number) =>
      set((state) => {
        if (!state.favorites.includes(id)) {
          const newFavorites = [...state.favorites, id];
          try {
            localStorage.setItem('bukvitsa_favorites', JSON.stringify(newFavorites));
          } catch (e) {
            console.error('Error saving favorites:', e);
          }
          return { favorites: newFavorites };
        }
        return state;
      }),

    removeFavorite: (id: number) =>
      set((state) => {
        const newFavorites = state.favorites.filter((fav) => fav !== id);
        try {
          localStorage.setItem('bukvitsa_favorites', JSON.stringify(newFavorites));
        } catch (e) {
          console.error('Error saving favorites:', e);
        }
        return { favorites: newFavorites };
      }),

    isFavorite: (id: number) => {
      return get().favorites.includes(id);
    },

    addToHistory: (id: number) =>
      set((state) => {
        const newHistory = [id, ...state.history.filter((h) => h !== id)].slice(0, 20);
        try {
          localStorage.setItem('bukvitsa_history', JSON.stringify(newHistory));
        } catch (e) {
          console.error('Error saving history:', e);
        }
        return { history: newHistory };
      }),

    addDailyRune: (bukvitsa: Bukvitsa) =>
      set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const newHistory = [
          { date: today, bukvitsa },
          ...state.dailyHistory.filter((d) => d.date !== today),
        ].slice(0, 30);
        try {
          localStorage.setItem('bukvitsa_daily_history', JSON.stringify(newHistory));
        } catch (e) {
          console.error('Error saving daily history:', e);
        }
        return { dailyHistory: newHistory };
      }),

    getDailyRune: () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const state = get();

        if (!state.bukvitsy || state.bukvitsy.length === 0) {
          console.error('No bukvitsy data available');
          return null;
        }

        const existing = state.dailyHistory.find((d) => d.date === today);
        if (existing && existing.bukvitsa) {
          return existing.bukvitsa;
        }

        const randomRune = state.getRandomRune();
        if (randomRune) {
          state.addDailyRune(randomRune);
          return randomRune;
        }

        console.error('Failed to get random rune');
        return null;
      } catch (e) {
        console.error('Error in getDailyRune:', e);
        return null;
      }
    },

    getRandomRune: () => {
      try {
        const { bukvitsy } = get();
        if (!bukvitsy || bukvitsy.length === 0) {
          console.error('Bukvitsy array is empty or undefined');
          return null;
        }
        const randomIndex = Math.floor(Math.random() * bukvitsy.length);
        const rune = bukvitsy[randomIndex];
        if (!rune) {
          console.error('Got undefined rune at index', randomIndex);
          return null;
        }
        return rune;
      } catch (e) {
        console.error('Error in getRandomRune:', e);
        return null;
      }
    },

    getBukvitsaById: (id: number) => {
      return get().bukvitsy.find((b) => b.id === id);
    },
  };
});
