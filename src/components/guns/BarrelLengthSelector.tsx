import { useState } from 'react';

interface BarrelLengthSelectorProps {
  value: number | undefined;
  onChange: (length: number) => void;
}

const BARREL_LENGTHS = [26, 28, 30, 32, 34];

export function BarrelLengthSelector({ value, onChange }: BarrelLengthSelectorProps) {
  const [isCustom, setIsCustom] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Barrel Length (inches)
      </label>
      <div className="flex flex-wrap gap-2">
        {BARREL_LENGTHS.map((length) => (
          <button
            key={length}
            type="button"
            onClick={() => {
              setIsCustom(false);
              onChange(length);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
              ${value === length
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
          >
            {length}"
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsCustom(true)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
            ${isCustom
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
        >
          Other
        </button>
      </div>
      {isCustom && (
        <input
          type="number"
          min="18"
          max="36"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-2 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Length"
        />
      )}
    </div>
  );
}