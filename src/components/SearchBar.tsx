import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Поиск...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 text-bukvitsa-gold/50" size={20} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bukvitsa-dark-blue/50 border border-bukvitsa-gold/30 rounded-lg pl-10 pr-10 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-bukvitsa-gold transition"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-3 text-gray-400 hover:text-bukvitsa-gold transition"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
