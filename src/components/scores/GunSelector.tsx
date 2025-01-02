import { useEffect } from 'react';
import { Crosshair, Star } from 'lucide-react';
import { useGuns } from '../../hooks/useGuns';
import type { GaugeType } from '../../types';

interface GunSelectorProps {
  gauge: GaugeType;
  selectedGunId: string | null;
  onSelect: (gunId: string | null) => void;
}

export function GunSelector({ gauge, selectedGunId, onSelect }: GunSelectorProps) {
  const { guns } = useGuns();
  const gaugeFilteredGuns = guns.filter(g => g.gauge === gauge);
  const primaryGun = guns.find(g => g.isPrimary);

  // Set primary gun as default when gauge matches
  useEffect(() => {
    if (primaryGun && primaryGun.gauge === gauge) {
      onSelect(primaryGun.id);
    } else {
      onSelect(null);
    }
  }, [gauge, primaryGun, onSelect]);

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Gun Configuration
      </label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gaugeFilteredGuns.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">
            No {gauge} gauge guns configured. 
            <a href="/guns" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 ml-1">
              Add one now
            </a>
          </p>
        ) : (
          gaugeFilteredGuns.map((gun) => (
            <button
              key={gun.id}
              type="button"
              onClick={() => onSelect(gun.id)}
              className={`flex items-center p-3 border rounded-lg text-left transition-colors ${
                selectedGunId === gun.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900 ring-1 ring-indigo-500'
                  : 'border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400'
              }`}
            >
              <div className="relative flex-shrink-0">
                <Crosshair className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                {gun.isPrimary && (
                  <Star className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                )}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {gun.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {gun.brand} {gun.model && `• ${gun.model}`}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}