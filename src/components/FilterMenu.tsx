import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useBukvitsyStore } from '../store/bukvitsyStore';

interface FilterMenuProps {
  selectedModules: string[];
  onChange: (modules: string[]) => void;
}

export default function FilterMenu({ selectedModules, onChange }: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const bukvitsy = useBukvitsyStore((state) => state.bukvitsy);

  // Get unique modules
  const allModules = Array.from(
    new Set(bukvitsy.flatMap((b) => b.semantic_modules))
  ).sort();

  const toggleModule = (module: string) => {
    if (selectedModules.includes(module)) {
      onChange(selectedModules.filter((m) => m !== module));
    } else {
      onChange([...selectedModules, module]);
    }
  };

  const clearFilters = () => {
    onChange([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/30 rounded-lg px-4 py-2 text-white hover:border-bukvitsa-gold transition"
      >
        <span className="text-sm font-semibold">
          🔍 Фильтр по модулям {selectedModules.length > 0 && `(${selectedModules.length})`}
        </span>
        <ChevronDown
          size={20}
          className={`transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bukvitsa-dark-blue border border-bukvitsa-gold/30 rounded-lg p-4 z-20 shadow-lg max-h-64 overflow-y-auto">
          <div className="space-y-2 mb-3">
            {allModules.map((module) => (
              <label key={module} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedModules.includes(module)}
                  onChange={() => toggleModule(module)}
                  className="w-4 h-4 rounded border border-bukvitsa-gold/50 bg-bukvitsa-black/50 cursor-pointer accent-bukvitsa-gold"
                />
                <span className="text-sm text-gray-300 group-hover:text-bukvitsa-gold transition">
                  {module}
                </span>
              </label>
            ))}
          </div>

          {selectedModules.length > 0 && (
            <button
              onClick={clearFilters}
              className="w-full text-xs py-2 text-bukvitsa-gold hover:bg-bukvitsa-gold/10 rounded transition border border-bukvitsa-gold/20"
            >
              Очистить фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
}
