# Руководство для разработчика - Приложение "Буквица"

## 🔧 Стек технологий (рекомендуется)

### Вариант 1: Web (React + Tailwind)
```
Frontend: React 18+
Styling: Tailwind CSS + PostCSS
State: Zustand или Redux
Storage: localStorage
PWA: Workbox для работы offline
```

### Вариант 2: React Native (iOS + Android)
```
Framework: React Native / Expo
Styling: NativeBase или React Native Paper
Storage: AsyncStorage
Notifications: react-native-push-notification
```

### Вариант 3: Flutter
```
Framework: Flutter
Language: Dart
State: Provider или Riverpod
Storage: SharedPreferences
```

## 📁 Структура проекта

```
bukvitsa-app/
├── src/
│   ├── components/
│   │   ├── BukvitsaCard.tsx
│   │   ├── BukvitsaGrid.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterMenu.tsx
│   │   └── Navigation.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── StudyScreen.tsx
│   │   ├── DailyScreen.tsx
│   │   ├── BirthdayScreen.tsx
│   │   └── FavoritesScreen.tsx
│   ├── hooks/
│   │   ├── useBukvitsy.ts
│   │   ├── useFavorites.ts
│   │   ├── useDailyRune.ts
│   │   └── useBirthdayRune.ts
│   ├── store/
│   │   ├── appStore.ts
│   │   ├── favoritesStore.ts
│   │   └── settingsStore.ts
│   ├── utils/
│   │   ├── birthdayCalculator.ts
│   │   ├── dateUtils.ts
│   │   └── storage.ts
│   ├── styles/
│   │   ├── colors.css
│   │   ├── typography.css
│   │   └── animations.css
│   ├── data/
│   │   └── bukvitsy.json (загружается из файла)
│   └── App.tsx
├── public/
│   ├── images/
│   │   └── stat-buk1-1024x1024.jpg
│   └── index.html
├── package.json
└── tailwind.config.js
```

## 🎨 Компоненты (React примеры)

### 1. BukvitsaCard.tsx - Карточка буквицы
```tsx
import React from 'react';
import { Bukvitsa } from '@/types';

interface BukvitsaCardProps {
  bukvitsa: Bukvitsa;
  isExpanded?: boolean;
  onExpand?: () => void;
  onAddToFavorites?: () => void;
}

export const BukvitsaCard: React.FC<BukvitsaCardProps> = ({
  bukvitsa,
  isExpanded = false,
  onExpand,
  onAddToFavorites,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-6 border border-yellow-600/20 max-w-md mx-auto">
      {/* Символ буквицы */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-yellow-100 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/30">
          <span className="text-6xl font-bold text-red-600" style={{ fontFamily: 'serif' }}>
            {bukvitsa.letter}
          </span>
        </div>
      </div>

      {/* Название и транслитерация */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-100 mb-1">
          {bukvitsa.name}
        </h2>
        <p className="text-sm text-yellow-600">
          {bukvitsa.transliteration}
        </p>
      </div>

      {/* Краткое описание */}
      <p className="text-center text-gray-200 text-sm mb-4">
        {bukvitsa.meaning}
      </p>

      {/* Семантические модули */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
        <h3 className="text-yellow-600 text-xs font-bold uppercase mb-3">
          Семантические модули:
        </h3>
        <ul className="space-y-2">
          {bukvitsa.semantic_modules.map((module, idx) => (
            <li key={idx} className="text-gray-300 text-sm flex items-start">
              <span className="text-red-600 mr-2">•</span>
              <span>{module}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Развёрнутое описание (если expanded) */}
      {isExpanded && bukvitsa.full_description && (
        <div className="border-t border-yellow-600/20 pt-4 mb-4">
          <p className="text-gray-200 text-sm leading-relaxed">
            {bukvitsa.full_description}
          </p>
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex gap-2">
        <button
          onClick={onExpand}
          className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-2 rounded font-semibold text-sm transition"
        >
          {isExpanded ? 'Свернуть' : 'Подробнее'}
        </button>
        <button
          onClick={onAddToFavorites}
          className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 py-2 rounded font-semibold text-sm transition border border-yellow-600/50"
        >
          ★ Избранное
        </button>
      </div>
    </div>
  );
};
```

### 2. StudyScreen.tsx - Экран учебника
```tsx
import React, { useState } from 'react';
import { BukvitsaCard } from '@/components/BukvitsaCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterMenu } from '@/components/FilterMenu';
import { useBukvitsy } from '@/hooks/useBukvitsy';
import { useFavorites } from '@/hooks/useFavorites';

export const StudyScreen: React.FC = () => {
  const { bukvitsy, filterByModule, filterByName } = useBukvitsy();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredBukvitsy = bukvitsy
    .filter(b => searchQuery === '' || filterByName(b, searchQuery))
    .filter(b => selectedModules.length === 0 || selectedModules.some(m => b.semantic_modules.includes(m)));

  const currentBukvitsa = filteredBukvitsy[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredBukvitsy.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setExpandedIndex(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setExpandedIndex(null);
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorite(currentBukvitsa.id)) {
      removeFromFavorites(currentBukvitsa.id);
    } else {
      addToFavorites(currentBukvitsa);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Заголовок */}
      <div className="bg-gray-900/50 border-b border-yellow-600/20 p-4">
        <h1 className="text-3xl font-bold text-yellow-100">Учебник Буквиц</h1>
      </div>

      {/* Поиск и фильтр */}
      <div className="p-4 space-y-3">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по названию или смыслу..."
        />
        <FilterMenu 
          selectedModules={selectedModules}
          onChange={setSelectedModules}
        />
      </div>

      {/* Основной контент */}
      {currentBukvitsa ? (
        <div className="p-4">
          <div className="mb-4 text-center text-sm text-gray-400">
            {currentIndex + 1} из {filteredBukvitsy.length}
          </div>

          <BukvitsaCard
            bukvitsa={currentBukvitsa}
            isExpanded={expandedIndex === currentIndex}
            onExpand={() => 
              setExpandedIndex(expandedIndex === currentIndex ? null : currentIndex)
            }
            onAddToFavorites={handleToggleFavorite}
          />

          {/* Навигация */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white py-3 rounded font-bold transition"
            >
              ← Предыдущая
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === filteredBukvitsy.length - 1}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-white py-3 rounded font-bold transition"
            >
              Следующая →
            </button>
          </div>

          {/* Быстрый переход по номерам */}
          <div className="mt-6 grid grid-cols-7 gap-1">
            {filteredBukvitsy.map((b, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setExpandedIndex(null);
                }}
                className={`p-2 rounded text-xs font-bold transition ${
                  idx === currentIndex
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {b.number}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">Буквицы не найдены</p>
        </div>
      )}
    </div>
  );
};
```

### 3. DailyScreen.tsx - Буквица дня
```tsx
import React, { useEffect, useState } from 'react';
import { BukvitsaCard } from '@/components/BukvitsaCard';
import { useDailyRune } from '@/hooks/useDailyRune';

export const DailyScreen: React.FC = () => {
  const { dailyRune, getDailyRune, getRandomRune, getHistory } = useDailyRune();
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    getDailyRune(); // Получить буквицу дня
    setHistory(getHistory()); // История
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4">
      <h1 className="text-3xl font-bold text-yellow-100 mb-6 text-center">
        Буквица Дня
      </h1>

      {dailyRune && (
        <>
          <BukvitsaCard 
            bukvitsa={dailyRune}
          />

          {/* Интерпретация дня */}
          <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-yellow-600/20">
            <h3 className="text-yellow-600 font-bold mb-3">📖 Совет на день:</h3>
            <p className="text-gray-200 leading-relaxed">
              Сегодня {dailyRune.name} приносит вам послание о {dailyRune.meaning}. 
              Постарайтесь в течение дня уделить внимание этим аспектам вашей жизни.
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={getRandomRune}
              className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-3 rounded font-bold transition"
            >
              🔀 Другая буквица
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 py-3 rounded font-bold border border-yellow-600/50 transition"
            >
              📅 История
            </button>
          </div>
        </>
      )}

      {/* История буквиц дня */}
      {showHistory && (
        <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-yellow-600/20">
          <h3 className="text-yellow-600 font-bold mb-3">История Буквиц Дня</h3>
          <div className="space-y-2">
            {history.map((item, idx) => (
              <div key={idx} className="text-sm text-gray-300 flex justify-between">
                <span>{item.bukvitsa.name}</span>
                <span className="text-gray-500">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### 4. BirthdayScreen.tsx - Буквица по дате рождения
```tsx
import React, { useState } from 'react';
import { BukvitsaCard } from '@/components/BukvitsaCard';
import { useBirthdayRune } from '@/hooks/useBirthdayRune';

export const BirthdayScreen: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [personalityRune, setPersonalityRune] = useState<any>(null);
  const [destinyRune, setDestinyRune] = useState<any>(null);
  const { calculateRunesByDate, getCompatibility } = useBirthdayRune();

  const handleCalculate = () => {
    if (birthDate) {
      const result = calculateRunesByDate(new Date(birthDate));
      setPersonalityRune(result.personality);
      setDestinyRune(result.destiny);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black p-4">
      <h1 className="text-3xl font-bold text-yellow-100 mb-6 text-center">
        Буквица по Дате Рождения
      </h1>

      {/* Форма ввода даты */}
      {!personalityRune && (
        <div className="max-w-md mx-auto bg-gray-900 rounded-lg p-6 border border-yellow-600/20">
          <label className="block text-yellow-100 font-bold mb-3">
            Дата вашего рождения:
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-gray-800 text-white p-3 rounded border border-gray-700 mb-4"
          />
          <button
            onClick={handleCalculate}
            disabled={!birthDate}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-3 rounded font-bold transition"
          >
            ✨ Найти мою буквицу
          </button>
        </div>
      )}

      {/* Результаты */}
      {personalityRune && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-yellow-100 mb-4 text-center">
              🌟 Буквица Личности
            </h2>
            <BukvitsaCard bukvitsa={personalityRune} />
            <p className="text-center text-gray-300 mt-3 text-sm">
              Ваша основная энергия и природный характер
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-yellow-100 mb-4 text-center">
              🎯 Буквица Судьбы
            </h2>
            <BukvitsaCard bukvitsa={destinyRune} />
            <p className="text-center text-gray-300 mt-3 text-sm">
              Ваше жизненное предназначение
            </p>
          </div>

          <button
            onClick={() => {
              setPersonalityRune(null);
              setBirthDate('');
            }}
            className="w-full bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 py-3 rounded font-bold border border-yellow-600/50 transition"
          >
            ← Назад
          </button>
        </div>
      )}
    </div>
  );
};
```

## 🔌 Custom Hooks

### useBukvitsy.ts
```tsx
import { useState, useEffect } from 'react';
import bukvitsyData from '@/data/bukvitsy.json';

export const useBukvitsy = () => {
  const [bukvitsy, setBukvitsy] = useState(bukvitsyData);

  const filterByName = (bukvitsa: any, query: string) => {
    const q = query.toLowerCase();
    return (
      bukvitsa.name.toLowerCase().includes(q) ||
      bukvitsa.meaning.toLowerCase().includes(q)
    );
  };

  const filterByModule = (module: string) => {
    return bukvitsy.filter(b => b.semantic_modules.includes(module));
  };

  return {
    bukvitsy,
    filterByName,
    filterByModule,
  };
};
```

### useFavorites.ts
```tsx
import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('bukvitsa_favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const addToFavorites = (bukvitsa: any) => {
    if (!favorites.find(f => f.id === bukvitsa.id)) {
      const newFavorites = [...favorites, bukvitsa];
      setFavorites(newFavorites);
      localStorage.setItem('bukvitsa_favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (id: number) => {
    const newFavorites = favorites.filter(f => f.id !== id);
    setFavorites(newFavorites);
    localStorage.setItem('bukvitsa_favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (id: number) => {
    return favorites.some(f => f.id === id);
  };

  return { favorites, addToFavorites, removeFromFavorites, isFavorite };
};
```

## 🎯 Утилиты

### birthdayCalculator.ts
```typescript
export const calculateBirthdayRunes = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Простой алгоритм: сумма цифр даты
  const sumDigits = (num: number) => {
    return num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  };

  let personalityNumber = sumDigits(day);
  let destinyNumber = sumDigits(day + month);
  
  // Если больше 49, вычитаем 49
  personalityNumber = personalityNumber > 49 ? personalityNumber - 49 : personalityNumber;
  destinyNumber = destinyNumber > 49 ? destinyNumber - 49 : destinyNumber;

  return {
    personalityNumber,
    destinyNumber,
  };
};
```

## 📱 Mobile-first CSS (Tailwind конфиг)

```js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      'red': '#c41e3a',
      'gold': '#d4a574',
      'cream': '#f5e6d3',
      'black': '#0a0a0a',
      'dark-blue': '#1a2a3a',
      'white': '#ffffff',
      'gray': {
        50: '#f9fafb',
        100: '#f3f4f6',
        // ... стандартные серые
      },
    },
    spacing: {
      'xs': '4px',
      'sm': '8px',
      'md': '12px',
      'lg': '16px',
      'xl': '24px',
      '2xl': '32px',
    },
  },
  extend: {
    animation: {
      'glow': 'glow 2s ease-in-out infinite',
    },
    keyframes: {
      glow: {
        '0%, 100%': { boxShadow: '0 0 5px rgba(196, 30, 58, 0.5)' },
        '50%': { boxShadow: '0 0 15px rgba(196, 30, 58, 0.8)' },
      },
    },
  },
};
```

## 🚀 Развертывание

### Web (Vercel / Netlify)
```bash
npm run build
vercel deploy
```

### React Native (Expo)
```bash
eas build --platform ios
eas build --platform android
```

### PWA
- Добавить `manifest.json`
- Конфигурировать Service Worker (Workbox)
- Тестировать offline режим

## ✅ Чеклист для разработчика

- [ ] Создана папочная структура проекта
- [ ] Установлены зависимости (React, Tailwind, и т.д.)
- [ ] Импортирована база буквиц из JSON
- [ ] Реализованы все основные компоненты
- [ ] Кастомные хуки работают корректно
- [ ] Навигация между экранами работает
- [ ] Поиск и фильтрация реализованы
- [ ] Система избранного работает
- [ ] Буквица дня функционирует
- [ ] Расчет буквицы по дате работает
- [ ] Мобильный дизайн протестирован
- [ ] Оффлайн режим работает
- [ ] Приложение готово к деплою

---

Удачи в разработке! 🎨✨
