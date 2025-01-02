import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  expanded?: boolean;
}

export function ThemeToggle({ expanded = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center w-full p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
    >
      {theme === 'dark' ? (
        <Sun className="h-6 w-6 flex-shrink-0" />
      ) : (
        <Moon className="h-6 w-6 flex-shrink-0" />
      )}
      {expanded && (
        <span className="ml-3 text-sm font-medium">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}