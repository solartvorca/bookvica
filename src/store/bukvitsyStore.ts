import { create } from 'zustand';
import { Bukvitsa, DailyRune } from '../types';
import bukvitsyData from '../data/bukvitsy_complete.json';

const normalizedBukvitsy: Bukvitsa[] = bukvitsyData.map((item) => ({
  ...item,
  full_description: item.description || item.full_description || '',
  semantic_modules: Array.isArray(item.semantic_modules)
    ? item.semantic_modules.map((module) =>
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
  getRandomRune: () => Bukvitsa;
  getBukvitsaById: (id: number) => Bukvitsa | undefined;
}

export const useBukvitsyStore = create<BukvitsyStore>((set, get) => {
  // Load from localStorage
  const savedFavorites = localStorage.getItem('bukvitsa_favorites');
  const savedHistory = localStorage.getItem('bukvitsa_history');
  const savedDailyHistory = localStorage.getItem('bukvitsa_daily_history');

  const initialFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
  const initialHistory = savedHistory ? JSON.parse(savedHistory) : [];
  const initialDailyHistory = savedDailyHistory ? JSON.parse(savedDailyHistory) : [];

  return {
    bukvitsy: [...normalizedBukvitsy].sort((a, b) => a.number - b.number),
    favorites: initialFavorites,
    history: initialHistory,
    dailyHistory: initialDailyHistory,

    addFavorite: (id: number) =>
      set((state) => {
        if (!state.favorites.includes(id)) {
          const newFavorites = [...state.favorites, id];
          localStorage.setItem('bukvitsa_favorites', JSON.stringify(newFavorites));
          return { favorites: newFavorites };
        }
        return state;
      }),

    removeFavorite: (id: number) =>
      set((state) => {
        const newFavorites = state.favorites.filter((fav) => fav !== id);
        localStorage.setItem('bukvitsa_favorites', JSON.stringify(newFavorites));
        return { favorites: newFavorites };
      }),

    isFavorite: (id: number) => {
      return get().favorites.includes(id);
    },

    addToHistory: (id: number) =>
      set((state) => {
        const newHistory = [id, ...state.history.filter((h) => h !== id)].slice(0, 20);
        localStorage.setItem('bukvitsa_history', JSON.stringify(newHistory));
        return { history: newHistory };
      }),

    addDailyRune: (bukvitsa: Bukvitsa) =>
      set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const newHistory = [
          { date: today, bukvitsa },
          ...state.dailyHistory.filter((d) => d.date !== today),
        ].slice(0, 30);
        localStorage.setItem('bukvitsa_daily_history', JSON.stringify(newHistory));
        return { dailyHistory: newHistory };
      }),

    getDailyRune: () => {
      const today = new Date().toISOString().split('T')[0];
      const state = get();
      const existing = state.dailyHistory.find((d) => d.date === today);
      if (existing) return existing.bukvitsa;

      const randomRune = state.getRandomRune();
      state.addDailyRune(randomRune);
      return randomRune;
    },

    getRandomRune: () => {
      const { bukvitsy } = get();
      return bukvitsy[Math.floor(Math.random() * bukvitsy.length)];
    },

    getBukvitsaById: (id: number) => {
      return get().bukvitsy.find((b) => b.id === id);
    },
  };
});
