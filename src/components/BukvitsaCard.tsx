import React, { useState } from 'react';
import { Star, Share2 } from 'lucide-react';
import { Bukvitsa } from '../types';

interface BukvitsaCardProps {
  bukvitsa: Bukvitsa;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  showFullDescription?: boolean;
}

export default function BukvitsaCard({
  bukvitsa,
  isFavorite = false,
  onToggleFavorite,
  showFullDescription = false,
}: BukvitsaCardProps) {
  const [isExpanded, setIsExpanded] = useState(showFullDescription);

  const handleShare = () => {
    const text = `${bukvitsa.name} (${bukvitsa.letter}) - ${bukvitsa.meaning}\n\nСемантические модули:\n${bukvitsa.semantic_modules.join('\n')}`;
    if (navigator.share) {
      navigator.share({
        title: `Буквица: ${bukvitsa.name}`,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="card-glow bg-gradient-to-br from-bukvitsa-dark-blue to-bukvitsa-black rounded-lg p-6 border border-bukvitsa-gold/20 max-w-md mx-auto w-full">
      {/* Символ буквицы */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-gradient-to-br from-bukvitsa-cream to-yellow-100 rounded-lg flex items-center justify-center shadow-lg shadow-bukvitsa-red/40 animate-glow">
          <span
            className="text-7xl font-bold text-bukvitsa-red"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {bukvitsa.letter}
          </span>
        </div>
      </div>

      {/* Название и транслитерация */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-bukvitsa-cream mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
          {bukvitsa.name}
        </h2>
        <p className="text-sm text-bukvitsa-gold font-semibold">
          {bukvitsa.transliteration}
        </p>
      </div>

      {/* Номер */}
      <div className="text-center mb-4 text-xs text-gray-400">
        Буквица № {bukvitsa.number}
      </div>

      {/* Краткое описание */}
      <p className="text-center text-bukvitsa-cream text-sm mb-4 leading-relaxed">
        {bukvitsa.meaning}
      </p>

      {/* Семантические модули */}
      <div className="bg-bukvitsa-black/50 rounded-lg p-4 mb-4 border border-bukvitsa-gold/10">
        <h3 className="text-bukvitsa-gold text-xs font-bold uppercase mb-3 tracking-wider">
          🔮 Семантические модули:
        </h3>
        <ul className="space-y-2">
          {bukvitsa.semantic_modules.map((module, idx) => (
            <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
              <span className="text-bukvitsa-gold mt-1">◆</span>
              <span>{module}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Развёрнутое описание */}
      {isExpanded && bukvitsa.full_description && (
        <div className="border-t border-bukvitsa-gold/20 pt-4 mb-4 bg-bukvitsa-black/30 p-4 rounded text-sm text-gray-300 leading-relaxed">
          {bukvitsa.full_description}
        </div>
      )}

      {/* Кнопки действий */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 min-w-[120px] bg-bukvitsa-red/80 hover:bg-bukvitsa-red text-white py-2 rounded font-semibold text-sm transition active:scale-95"
        >
          {isExpanded ? '↑ Свернуть' : '↓ Подробнее'}
        </button>
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`flex-1 min-w-[120px] py-2 rounded font-semibold text-sm transition active:scale-95 flex items-center justify-center gap-2 ${
              isFavorite
                ? 'bg-bukvitsa-gold/20 text-bukvitsa-gold border border-bukvitsa-gold/50'
                : 'bg-bukvitsa-gold/10 text-bukvitsa-gold border border-bukvitsa-gold/20 hover:border-bukvitsa-gold/50'
            }`}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            <span className="hidden sm:inline">{isFavorite ? 'В избранном' : 'В избранное'}</span>
          </button>
        )}
        <button
          onClick={handleShare}
          className="px-4 py-2 rounded font-semibold text-sm transition active:scale-95 bg-bukvitsa-gold/10 text-bukvitsa-gold border border-bukvitsa-gold/20 hover:border-bukvitsa-gold/50 flex items-center justify-center"
        >
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
}
