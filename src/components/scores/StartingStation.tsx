import type { GameType } from '../../types';

interface StartingStationProps {
  game: GameType;
  station: number;
  onChange: (station: number) => void;
  disabled?: boolean;
}

export function StartingStation({ game, station, onChange, disabled }: StartingStationProps) {
  const maxStations = game === 'Trap' ? 5 : game === '5-Stand' ? 5 : 8;

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Starting Station
      </label>
      <div className="flex space-x-2">
        {Array.from({ length: maxStations }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            disabled={disabled}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              station === num
                ? 'bg-indigo-600 text-white'
                : disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}