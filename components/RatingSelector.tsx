
import React from 'react';
import { RatingValue } from '../types';
import { RATING_OPTIONS } from '../constants';

interface RatingSelectorProps {
  label: string;
  value: RatingValue | undefined;
  onChange: (value: RatingValue) => void;
}

const RatingSelector: React.FC<RatingSelectorProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 md:mb-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {RATING_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
              value === opt.value
                ? opt.color + ' ring-2 ring-offset-1 ring-gray-300 dark:ring-gray-600'
                : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingSelector;
