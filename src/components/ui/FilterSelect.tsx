import React from 'react';
import { Filter } from 'lucide-react';

interface Option {
  id: number;
  name: string;
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  defaultText: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
  defaultText,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
        <Filter className="w-3 h-3 text-indigo-400" /> {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
      >
        <option value="">{defaultText}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};