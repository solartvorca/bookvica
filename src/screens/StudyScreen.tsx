import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import BukvitsaCard from '../components/BukvitsaCard';
import SearchBar from '../components/SearchBar';
import FilterMenu from '../components/FilterMenu';
import { useBukvitsyStore } from '../store/bukvitsyStore';
import { Bukvitsa } from '../types';

export default function StudyScreen() {
  const { bukvitsy, addFavorite, removeFavorite, isFavorite, addToHistory } = useBukvitsyStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedBukvitsa, setSelectedBukvitsa] = useState<Bukvitsa | null>(null);

  // Filter bukvitsy based on search and modules
  const filteredBukvitsy = useMemo(() => {
    return bukvitsy.filter((b) => {
      const matchesSearch =
        searchQuery === '' ||
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.transliteration.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesModules =
        selectedModules.length === 0 ||
        selectedModules.some((m) => b.semantic_modules.includes(m));

      return matchesSearch && matchesModules;
    });
  }, [searchQuery, selectedModules, bukvitsy]);

  const handleSelectBukvitsa = (b: Bukvitsa) => {
    setSelectedBukvitsa(b);
    addToHistory(b.id);
  };

  const handleToggleFavorite = () => {
    if (selectedBukvitsa) {
      if (isFavorite(selectedBukvitsa.id)) {
        removeFavorite(selectedBukvitsa.id);
      } else {
        addFavorite(selectedBukvitsa.id);
      }
      setSelectedBukvitsa({ ...selectedBukvitsa });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-bukvitsa-cream mb-2">Учебник Буквиц</h1>
        <p className="text-gray-400">49 древних букв в сетке 7×7</p>
      </div>

      {/* Поиск и фильтр */}
      <div className="space-y-4 max-w-md mx-auto w-full">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Поиск по названию, смыслу..."
        />
        <FilterMenu selectedModules={selectedModules} onChange={setSelectedModules} />
      </div>

      {/* Сетка 7×7 */}
      {filteredBukvitsy.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {filteredBukvitsy.map((b) => (
              <button
                key={b.id}
                onClick={() => handleSelectBukvitsa(b)}
                className="aspect-square bg-bukvitsa-dark-blue/40 border border-bukvitsa-gold/40 hover:border-bukvitsa-gold hover:bg-bukvitsa-dark-blue/60 rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition duration-200 hover:shadow-lg hover:shadow-bukvitsa-red/30 active:scale-95"
                title={`${b.number}. ${b.name}`}
              >
                {/* Картинка буквицы */}
                <img
                  src={`/src/assets/bukvitsy/${b.number}.png`}
                  alt={b.letter}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Буква символ как фоллбэк */}
                <div className="text-2xl font-bold text-bukvitsa-red font-serif">
                  {b.letter}
                </div>
                {/* Номер */}
                <div className="text-xs font-bold text-bukvitsa-gold mt-1">
                  {b.number}
                </div>
              </button>
            ))}
          </div>

          {/* Счетчик */}
          <div className="text-center text-sm text-gray-400 mt-6">
            Показано {filteredBukvitsy.length} из {bukvitsy.length} буквиц
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Буквицы не найдены</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedModules([]);
            }}
            className="text-bukvitsa-gold hover:text-bukvitsa-gold/80 transition text-sm font-semibold"
          >
            Очистить фильтры
          </button>
        </div>
      )}

      {/* Модальное окно с карточкой */}
      {selectedBukvitsa && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative bg-bukvitsa-dark/95 border border-bukvitsa-gold/30 rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Кнопка закрытия */}
            <button
              onClick={() => setSelectedBukvitsa(null)}
              className="absolute top-4 right-4 bg-bukvitsa-red/80 hover:bg-bukvitsa-red text-white p-2 rounded-lg transition z-10"
            >
              <X size={24} />
            </button>

            {/* Карточка */}
            <div className="p-6">
              <BukvitsaCard
                bukvitsa={selectedBukvitsa}
                isFavorite={isFavorite(selectedBukvitsa.id)}
                onToggleFavorite={handleToggleFavorite}
                showFullDescription={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
