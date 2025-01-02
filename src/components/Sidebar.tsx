import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, Target, BarChart2, Crosshair, Building2 } from 'lucide-react';
import { UserButton } from './UserButton';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'My Club', icon: Building2, path: '/club' },
  { name: 'Shooters', icon: Users, path: '/shooters' },
  { name: 'Scores', icon: Target, path: '/scores' },
  { name: 'Statistics', icon: BarChart2, path: '/statistics' },
  { name: 'My Guns', icon: Crosshair, path: '/guns' }
];

export function Sidebar({ expanded, onExpandedChange }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
        expanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => onExpandedChange(true)}
      onMouseLeave={() => onExpandedChange(false)}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-800">
        <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-500" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`group flex items-center w-full p-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-gray-800 text-indigo-600 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-white'
              }`}
            >
              <item.icon className={`h-6 w-6 flex-shrink-0 transition-colors ${
                isActive ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-white'
              }`} />
              <span
                className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                  expanded ? 'opacity-100' : 'opacity-0 translate-x-2'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User Button */}
      <div className="p-2 space-y-2 border-t border-gray-200 dark:border-gray-800">
        <ThemeToggle expanded={expanded} />
        <UserButton expanded={expanded} />
      </div>
    </div>
  );
}