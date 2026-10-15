import React from 'react';

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
  value,
  options,
  onChange,
  defaultText,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-theme-surface/90 border border-theme rounded-xl px-3.5 py-2.5 text-xs text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent/50 transition shadow-sm cursor-pointer"
    >
      <option value="" className="bg-theme-surface text-theme-primary">
        {defaultText}
      </option>
      {options.map((opt) => (
        <option
          key={opt.id}
          value={opt.name}
          className="bg-theme-surface text-theme-primary"
        >
          {opt.name}
        </option>
      ))}
    </select>
  );
};