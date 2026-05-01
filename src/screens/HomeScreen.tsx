import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, Heart } from 'lucide-react';
import BukvitsaCard from '../components/BukvitsaCard';
import { useBukvitsyStore } from '../store/bukvitsyStore';

export default function HomeScreen() {
  const { getDailyRune, addToHistory } = useBukvitsyStore();
  const dailyRune = getDailyRune();

  useEffect(() => {
    if (dailyRune) {
      addToHistory(dailyRune.id);
    }
  }, [dailyRune, addToHistory]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-5xl font-bold text-bukvitsa-cream" style={{ fontFamily: 'Cinzel, serif' }}>
          Буквица
        </h1>
        <p className="text-bukvitsa-gold text-lg">Древняя Славянская Мудрость</p>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto">
          Изучайте 49 священных букв, открывайте древнюю славянскую мудрость и познавайте себя через архетипы
        </p>
      </div>

      {/* CTA Кнопки */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 max-w-md mx-auto">
        <Link
          to="/study"
          className="flex items-center justify-center gap-2 bg-bukvitsa-red hover:bg-bukvitsa-red/90 text-white py-4 rounded-lg font-bold transition active:scale-95"
        >
          <BookOpen size={20} />
          <span>Учебник</span>
        </Link>
        <Link
          to="/daily"
          className="flex items-center justify-center gap-2 bg-bukvitsa-gold/80 hover:bg-bukvitsa-gold text-bukvitsa-black py-4 rounded-lg font-bold transition active:scale-95"
        >
          <Sparkles size={20} />
          <span>Послание дня</span>
        </Link>
      </div>

      {/* Послание дня */}
      {dailyRune && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-bukvitsa-gold mb-2">✨ Послание дня</h2>
            <p className="text-gray-400 text-sm">Послание, которое нужно услышать именно вам</p>
          </div>
          <BukvitsaCard bukvitsa={dailyRune} showFullDescription={true} />
          <div className="text-center text-sm text-gray-400 max-w-md mx-auto">
            <p className="leading-relaxed">
              Сегодня {dailyRune.name} приносит вам послание о <span className="text-bukvitsa-gold font-semibold">{dailyRune.meaning}</span>.
              Постарайтесь в течение дня уделить внимание этим аспектам вашей жизни.
            </p>
          </div>
        </div>
      )}

      {/* Быстрый доступ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
        <Link
          to="/study"
          className="bg-bukvitsa-dark-blue border border-bukvitsa-gold/20 hover:border-bukvitsa-gold/50 rounded-lg p-6 transition group"
        >
          <div className="text-3xl mb-3">📚</div>
          <h3 className="font-bold text-bukvitsa-gold mb-2">49 Буквиц</h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition">
            Полная база древних букв с их смыслом и энергией
          </p>
        </Link>

        <Link
          to="/birthday"
          className="bg-bukvitsa-dark-blue border border-bukvitsa-gold/20 hover:border-bukvitsa-gold/50 rounded-lg p-6 transition group"
        >
          <div className="text-3xl mb-3">🎂</div>
          <h3 className="font-bold text-bukvitsa-gold mb-2">Моя буквица</h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition">
            Найдите свою буквицу по дате рождения
          </p>
        </Link>

        <Link
          to="/favorites"
          className="bg-bukvitsa-dark-blue border border-bukvitsa-gold/20 hover:border-bukvitsa-gold/50 rounded-lg p-6 transition group"
        >
          <div className="text-3xl mb-3">⭐</div>
          <h3 className="font-bold text-bukvitsa-gold mb-2">Избранное</h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition">
            Ваше личное собрание любимых буквиц
          </p>
        </Link>
      </div>

      {/* Информация */}
      <div className="bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/20 rounded-lg p-6 text-center">
        <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto">
          <span className="text-bukvitsa-gold font-bold">Буквица</span> — это древняя славянская система 49 букв, каждая из которых несёт глубокий
          духовный смысл. Через изучение буквиц вы можете понять основные архетипы человеческого бытия и развить своё сознание.
        </p>
      </div>
    </div>
  );
}
