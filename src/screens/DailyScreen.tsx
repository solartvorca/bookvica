import { useState, useEffect } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';
import BukvitsaCard from '../components/BukvitsaCard';
import { useBukvitsyStore } from '../store/bukvitsyStore';
import { Bukvitsa } from '../types';

export default function DailyScreen() {
  const store = useBukvitsyStore();
  const [showHistory, setShowHistory] = useState(false);
  const [dailyRune, setDailyRune] = useState<Bukvitsa | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('DailyScreen: useEffect called');
    try {
      console.log('Store bukvitsy count:', store.bukvitsy.length);
      const rune = store.getDailyRune();
      console.log('Got daily rune:', rune?.name);
      if (rune) {
        setDailyRune(rune);
        setError(null);
      } else {
        setError('Не удалось загрузить послание');
        console.error('getDailyRune returned null');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error loading daily rune:', message);
      setError(`Ошибка: ${message}`);
    }
  }, []);

  const handleGetRandom = () => {
    try {
      const randomRune = store.getRandomRune();
      if (randomRune) {
        store.addDailyRune(randomRune);
        setDailyRune(randomRune);
      } else {
        console.error('Failed to get random rune');
      }
    } catch (error) {
      console.error('Error getting random rune:', error);
    }
  };

  const handleToggleFavorite = () => {
    if (dailyRune) {
      if (store.isFavorite(dailyRune.id)) {
        store.removeFavorite(dailyRune.id);
      } else {
        store.addFavorite(dailyRune.id);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-bukvitsa-cream mb-2">Послание дня</h1>
        <p className="text-gray-400">Послание из глубин времени</p>
      </div>

      {error && (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
        </div>
      )}

      {!dailyRune && !error && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Загружение послания...</p>
          <div className="animate-spin">⏳</div>
        </div>
      )}

      {dailyRune && (
        <>
          {/* Дата */}
          <div className="text-center text-sm text-bukvitsa-gold flex items-center justify-center gap-2">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString('ru-RU')}</span>
          </div>

          {/* Карточка буквицы */}
          <BukvitsaCard
            bukvitsa={dailyRune}
            isFavorite={store.isFavorite(dailyRune.id)}
            onToggleFavorite={handleToggleFavorite}
            showFullDescription={true}
          />

          {/* Интерпретация дня */}
          <div className="bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/20 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-bukvitsa-gold">📖 Совет на день</h3>
            <p className="text-gray-300 leading-relaxed">
              Сегодня <span className="text-bukvitsa-gold font-semibold">{dailyRune.name}</span> приносит вам послание о{' '}
              <span className="text-bukvitsa-gold font-semibold">{dailyRune.meaning.toLowerCase()}</span>. Постарайтесь в течение дня уделить
              внимание следующим аспектам:
            </p>
            <ul className="space-y-2">
              {dailyRune.semantic_modules.map((module, idx) => {
                const moduleName = typeof module === 'string' ? module : module.name;
                return (
                  <li key={idx} className="text-gray-300 flex items-start gap-3">
                    <span className="text-bukvitsa-gold font-bold">→</span>
                    <span>{moduleName}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <button
              onClick={handleGetRandom}
              className="flex-1 flex items-center justify-center gap-2 bg-bukvitsa-red hover:bg-bukvitsa-red/90 text-white py-3 rounded font-bold transition active:scale-95"
            >
              <RefreshCw size={20} />
              <span>Другая буквица</span>
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex-1 flex items-center justify-center gap-2 bg-bukvitsa-gold/20 hover:bg-bukvitsa-gold/30 text-bukvitsa-gold border border-bukvitsa-gold/50 py-3 rounded font-bold transition active:scale-95"
            >
              <Calendar size={20} />
              <span>История</span>
            </button>
          </div>

          {/* История буквиц дня */}
          {showHistory && (
            <div className="bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/20 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-bold text-bukvitsa-gold">📅 История буквиц дня</h3>
              {store.dailyHistory.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {store.dailyHistory.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-bukvitsa-gold/10">
                      <div>
                        <p className="font-semibold text-bukvitsa-gold">{item.bukvitsa.name}</p>
                        <p className="text-xs text-gray-400">{item.bukvitsa.meaning}</p>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">История пуста</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
