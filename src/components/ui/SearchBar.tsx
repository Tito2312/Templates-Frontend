import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar por título o contenido...',
}) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-100 placeholder-slate-400 text-sm shadow-inner transition"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};