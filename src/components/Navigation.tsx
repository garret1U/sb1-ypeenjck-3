import { useNavigate } from 'react-router-dom';
import { Home, Users, Target, BarChart2, Crosshair, Building2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', icon: Home },
  { name: 'My Club', icon: Building2 },
  { name: 'Shooters', icon: Users },
  { name: 'Scores', icon: Target },
  { name: 'Statistics', icon: BarChart2 },
  { name: 'My Guns', icon: Crosshair }
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const getPath = (name: string) => {
    switch (name) {
      case 'Dashboard': return '/';
      case 'My Club': return '/club';
      case 'Shooters': return '/shooters';
      case 'Scores': return '/scores';
      case 'Statistics': return '/statistics';
      case 'My Guns': return '/guns';
      default: return '/';
    }
  };

  const isActive = (name: string) => {
    const path = getPath(name);
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white border-b border-gray-200 hidden sm:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(getPath(item.name))}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.name);
            return (
              <button
                key={item.name}
                onClick={() => navigate(getPath(item.name))}
                className={`flex flex-col items-center justify-center py-3 px-1 ${
                  active ? 'text-indigo-600' : 'text-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] mt-1 font-medium truncate">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}