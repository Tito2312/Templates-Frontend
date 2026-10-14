import React from 'react';

interface Option {
  id: number;
  name: string;
}

interface FilterSelectProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  defaultText: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  options,
  onChange,
  defaultText,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full py-3 px-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-300 text-sm cursor-pointer transition"
    >
      <option value="">{defaultText}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};