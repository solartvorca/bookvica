import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import BukvitsaCard from '../components/BukvitsaCard';
import { useBukvitsyStore } from '../store/bukvitsyStore';
import { calculateBirthdayRunes, getCharacteristicDescription } from '../utils/birthdayCalculator';

export default function BirthdayScreen() {
  const { bukvitsy, getBukvitsaById, addFavorite, removeFavorite, isFavorite } = useBukvitsyStore();
  const [birthDate, setBirthDate] = useState<string>('');
  const [personalityRune, setPersonalityRune] = useState<any>(null);
  const [destinyRune, setDestinyRune] = useState<any>(null);
  const [personalityNum, setPersonalityNum] = useState<number>(0);
  const [destinyNum, setDestinyNum] = useState<number>(0);

  const handleCalculate = () => {
    if (birthDate) {
      const date = new Date(birthDate);
      const { personalityNumber, destinyNumber } = calculateBirthdayRunes(date);

      setPersonalityNum(personalityNumber);
      setDestinyNum(destinyNumber);

      const personality = getBukvitsaById(personalityNumber);
      const destiny = getBukvitsaById(destinyNumber);

      setPersonalityRune(personality);
      setDestinyRune(destiny);

      // Save birthday
      localStorage.setItem('user_birthday', birthDate);
    }
  };

  const handleReset = () => {
    setBirthDate('');
    setPersonalityRune(null);
    setDestinyRune(null);
    setPersonalityNum(0);
    setDestinyNum(0);
  };

  const toggleFavorite = (id: number) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const characteristicText = personalityRune && destinyRune ?
    getCharacteristicDescription(personalityNum, destinyNum) : '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-bukvitsa-cream mb-2">Буквица по Дате Рождения</h1>
        <p className="text-gray-400">Откройте свою личную буквицу и буквицу судьбы</p>
      </div>

      {/* Форма ввода даты */}
      {!personalityRune && (
        <div className="max-w-md mx-auto bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/20 rounded-lg p-8 space-y-6">
          <div>
            <label className="block text-bukvitsa-cream font-bold mb-3 text-lg">📅 Дата вашего рождения:</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-bukvitsa-black/50 border border-bukvitsa-gold/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-bukvitsa-gold transition"
            />
          </div>
          <button
            onClick={handleCalculate}
            disabled={!birthDate}
            className="w-full bg-bukvitsa-red hover:bg-bukvitsa-red/90 disabled:bg-gray-700 disabled:text-gray-600 text-white py-3 rounded-lg font-bold transition active:scale-95"
          >
            ✨ Найти мою буквицу
          </button>
        </div>
      )}

      {/* Результаты */}
      {personalityRune && destinyRune && (
        <div className="space-y-8">
          {/* Буквица Личности */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-bukvitsa-gold mb-1">🌟 Буквица Личности</h2>
              <p className="text-gray-400 text-sm">Ваша основная энергия и природный характер</p>
            </div>
            <BukvitsaCard
              bukvitsa={personalityRune}
              isFavorite={isFavorite(personalityRune.id)}
              onToggleFavorite={() => toggleFavorite(personalityRune.id)}
            />
          </div>

          {/* Буквица Судьбы */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-bukvitsa-gold mb-1">🎯 Буквица Судьбы</h2>
              <p className="text-gray-400 text-sm">Ваше жизненное предназначение и задача</p>
            </div>
            <BukvitsaCard
              bukvitsa={destinyRune}
              isFavorite={isFavorite(destinyRune.id)}
              onToggleFavorite={() => toggleFavorite(destinyRune.id)}
            />
          </div>

          {/* Характеристика */}
          <div className="bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/20 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-bukvitsa-gold">📊 Ваша характеристика</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bukvitsa-black/50 rounded p-4">
                <p className="text-xs text-gray-400 mb-1">Буквица Личности</p>
                <p className="text-lg font-bold text-bukvitsa-gold">{personalityNum}</p>
                <p className="text-xs text-gray-300 mt-2">{personalityRune.name}</p>
              </div>
              <div className="bg-bukvitsa-black/50 rounded p-4">
                <p className="text-xs text-gray-400 mb-1">Буквица Судьбы</p>
                <p className="text-lg font-bold text-bukvitsa-gold">{destinyNum}</p>
                <p className="text-xs text-gray-300 mt-2">{destinyRune.name}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Главная характеристика вашей судьбы: <span className="text-bukvitsa-gold font-semibold">{characteristicText}</span>
            </p>
          </div>

          {/* Путь инициации */}
          <div className="bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/20 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-bukvitsa-gold">🛤️ Путь инициации</h3>
            <p className="text-sm text-gray-300">
              Последовательность буквиц между вашей личностью и судьбой показывает ваш путь развития и духовного роста.
            </p>
            <div className="flex items-center justify-between text-center text-sm">
              <div>
                <p className="font-bold text-bukvitsa-gold">{personalityRune.name}</p>
                <p className="text-xs text-gray-400">Начало</p>
              </div>
              <div className="flex-1 border-t border-bukvitsa-gold/30 mx-2"></div>
              <div>
                <p className="font-bold text-bukvitsa-gold">{destinyRune.name}</p>
                <p className="text-xs text-gray-400">Цель</p>
              </div>
            </div>
          </div>

          {/* Кнопка назад */}
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 bg-bukvitsa-gold/20 hover:bg-bukvitsa-gold/30 text-bukvitsa-gold border border-bukvitsa-gold/50 py-3 rounded-lg font-bold transition active:scale-95"
          >
            <ArrowLeft size={20} />
            Вернуться
          </button>
        </div>
      )}
    </div>
  );
}
