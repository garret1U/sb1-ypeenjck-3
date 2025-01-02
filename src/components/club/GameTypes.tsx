import { GameType } from '../../types';

interface GameTypesProps {
  selectedGames: GameType[];
  onUpdate: (games: GameType[]) => void;
}

const ALL_GAMES: GameType[] = ['Skeet', 'Doubles Skeet', 'Trap', '5-Stand'];

export function GameTypes({ selectedGames, onUpdate }: GameTypesProps) {
  const handleToggleGame = (game: GameType) => {
    if (selectedGames.includes(game)) {
      onUpdate(selectedGames.filter(g => g !== game));
    } else {
      onUpdate([...selectedGames, game]);
    }
  };

  return (
    <div className="p-6 dark:bg-gray-800">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Games</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {ALL_GAMES.map((game) => (
          <button
            key={game}
            onClick={() => handleToggleGame(game)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedGames.includes(game)
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {game}
          </button>
        ))}
      </div>
    </div>
  );
}