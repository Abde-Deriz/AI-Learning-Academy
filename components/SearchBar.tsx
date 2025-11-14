import React from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full md:w-80">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search for courses or lessons..."
        className="w-full pl-11 pr-4 py-3 text-base bg-white border-2 border-slate-200 rounded-full shadow-inner focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 focus:outline-none transition"
        aria-label="Search for courses or lessons"
      />
    </div>
  );
};

export default SearchBar;