import { useState } from 'react';
import { ScoreEntry } from '../components/scores/ScoreEntry';
import { ScoreDots } from '../components/scores/ScoreDots';
import type { Score } from '../types';

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([]);

  const handleScoreSubmit = (score: Omit<Score, 'score_id' | 'shooter_id' | 'date'>) => {
    const newScore: Score = {
      score_id: crypto.randomUUID(),
      shooter_id: 'current-user',
      date: new Date().toISOString(),
      ...score
    };
    setScores([newScore, ...scores]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Scores</h1>
      
      <div className="space-y-6">
        <ScoreEntry onSubmit={handleScoreSubmit} />

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Scores</h2>
            
            {scores.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No scores recorded yet</p>
            ) : (
              <div className="space-y-4">
                {scores.map((score) => (
                  <div 
                    key={score.score_id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{score.game}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(score.date).toLocaleDateString()} • {score.gauge} gauge
                        {(score.game === 'Trap' || score.game === '5-Stand') && score.starting_stand && (
                          <> • Station {score.starting_stand}</>
                        )}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {score.total_score}/25
                    </div>
                    <ScoreDots birds={score.birds} className="mt-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}