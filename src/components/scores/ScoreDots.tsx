import type { BirdResult } from '../../types';

export interface BirdDisplay {
  result: BirdResult;
  isOption?: boolean;
}

interface ScoreDotsProps {
  birds: BirdDisplay[];
  className?: string;
}

export function ScoreDots({ birds, className = '' }: ScoreDotsProps) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {birds.map(({ result, isOption }, idx) => (
        <div
          key={idx}
          className={`w-1.5 h-1.5 ${isOption ? 'rounded-sm' : 'rounded-full'} ${
            result === 'hit' ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      ))}
    </div>
  );
}