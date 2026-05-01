import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import BukvitsaCard from '../components/BukvitsaCard';
import { useBukvitsyStore } from '../store/bukvitsyStore';

export default function FavoritesScreen() {
  const { bukvitsy, favorites, history, removeFavorite, isFavorite } = useBukvitsyStore();
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites');

  const favoritesBukvitsy = bukvitsy.filter((b) => favorites.includes(b.id));
  const historyBukvitsy = bukvitsy.filter((b) => history.includes(b.id));

  const handleRemoveFavorite = (id: number) => {
    removeFavorite(id);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-bukvitsa-cream mb-2">Избранное</h1>
        <p className="text-gray-400">Ваша личная коллекция буквиц</p>
      </div>

      {/* Вкладки */}
      <div className="flex gap-2 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${
            activeTab === 'favorites'
              ? 'bg-bukvitsa-red text-white'
              : 'bg-bukvitsa-dark-blue/50 text-bukvitsa-gold hover:bg-bukvitsa-dark-blue'
          }`}
        >
          ⭐ Избранные ({favoritesBukvitsy.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-lg font-bold transition ${
            activeTab === 'history'
              ? 'bg-bukvitsa-red text-white'
              : 'bg-bukvitsa-dark-blue/50 text-bukvitsa-gold hover:bg-bukvitsa-dark-blue'
          }`}
        >
          📖 История ({historyBukvitsy.length})
        </button>
      </div>

      {/* Содержание вкладок */}
      {activeTab === 'favorites' ? (
        <div className="space-y-6">
          {favoritesBukvitsy.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoritesBukvitsy.map((b) => (
                  <div key={b.id} className="relative">
                    <BukvitsaCard
                      bukvitsa={b}
                      isFavorite={true}
                      onToggleFavorite={() => handleRemoveFavorite(b.id)}
                    />
                    <button
                      onClick={() => handleRemoveFavorite(b.id)}
                      className="absolute top-4 right-4 p-2 bg-bukvitsa-red/80 hover:bg-bukvitsa-red text-white rounded transition active:scale-95 z-10"
                      title="Удалить из избранного"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">У вас еще нет избранных буквиц</p>
              <a
                href="/study"
                className="inline-block text-bukvitsa-gold hover:text-bukvitsa-gold/80 transition font-semibold"
              >
                Добавить буквицы в избранное →
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {historyBukvitsy.length > 0 ? (
            <>
              <div className="bg-bukvitsa-dark-blue/30 border border-bukvitsa-gold/20 rounded-lg p-6">
                <p className="text-sm text-gray-400 mb-4">Последние просмотры (всего {historyBukvitsy.length})</p>
                <div className="space-y-2">
                  {historyBukvitsy.map((b, idx) => (
                    <div
                      key={b.id}
                      className="flex items-center gap-4 p-3 bg-bukvitsa-black/50 rounded border border-bukvitsa-gold/10 hover:border-bukvitsa-gold/30 transition"
                    >
                      <div className="text-2xl font-bold text-bukvitsa-red" style={{ fontFamily: 'Cinzel, serif' }}>
                        {b.letter}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-bukvitsa-cream">{b.name}</p>
                        <p className="text-sm text-gray-400">{b.meaning}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(b.id)}
                        className={`p-2 rounded transition ${
                          isFavorite(b.id)
                            ? 'bg-bukvitsa-gold/20 text-bukvitsa-gold'
                            : 'bg-bukvitsa-dark-blue/50 text-gray-400 hover:text-bukvitsa-gold'
                        }`}
                      >
                        {isFavorite(b.id) ? '★' : '☆'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">История пуста</p>
              <a
                href="/study"
                className="inline-block text-bukvitsa-gold hover:text-bukvitsa-gold/80 transition font-semibold"
              >
                Начать изучение буквиц →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
