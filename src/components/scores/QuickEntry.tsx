import { useState } from 'react';
import { Target } from 'lucide-react';
import type { GameType, BirdResult } from '../../types';

interface QuickEntryProps {
  totalShots: number;
  game: GameType;
  onComplete: (birds: BirdResult[]) => void;
}

export function QuickEntry({ totalShots, game, onComplete }: QuickEntryProps) {
  const [totalScore, setTotalScore] = useState<number>(totalShots);
  const [missedShots, setMissedShots] = useState<number[]>([]);
  const [error, setError] = useState<string>('');

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, parseInt(e.target.value) || 0), totalShots);
    setTotalScore(value);
    setMissedShots([]);
    setError('');
  };

  const handleShotClick = (index: number) => {
    setMissedShots(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else if (prev.length < (totalShots - totalScore)) {
        return [...prev, index].sort((a, b) => a - b);
      }
      return prev;
    });
    setError('');
  };

  const handleComplete = () => {
    if (missedShots.length !== (totalShots - totalScore)) {
      setError('Please select all missed shots before completing');
      return;
    }

    let birds: BirdResult[] = Array(totalShots).fill('hit');
    missedShots.forEach(index => {
      birds[index] = 'miss';
    });

    // Add option shots for Skeet game
    if (game === 'Skeet' && missedShots.length > 0) {
      const firstMissIndex = missedShots[0];
      // Insert option shot after first miss (assumed hit since total score accounts for it)
      birds.splice(firstMissIndex + 1, 0, 'hit');
    }

    onComplete(birds);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <label htmlFor="total-score" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Total Score
          </label>
          <input
            id="total-score"
            type="number"
            min="0"
            max={totalShots}
            value={totalScore}
            aria-label="Total score"
            onChange={handleScoreChange}
            className="block w-24 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Missed Shots ({missedShots.length} of {totalShots - totalScore})
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalShots }, (_, i) => (
              <button
                key={i}
                onClick={() => handleShotClick(i)}
                aria-label={`Missed shot ${i + 1}`}
                title={`Mark shot #${i + 1} as missed`}
                disabled={!missedShots.includes(i) && missedShots.length >= (totalShots - totalScore)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${missedShots.includes(i)
                    ? 'bg-red-500 text-white dark:bg-red-600'
                    : missedShots.length >= (totalShots - totalScore)
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleComplete}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Target className="h-4 w-4 mr-2" />
          Complete Score
        </button>
      </div>
    </div>
  );
}