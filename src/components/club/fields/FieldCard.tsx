import { Target, Calendar, PenSquare, X, AlertTriangle } from 'lucide-react';
import type { Field } from '../../../types/field';

interface FieldCardProps {
  field: Field;
  onEdit: () => void;
  onDelete: () => void;
}

export function FieldCard({ field, onEdit, onDelete }: FieldCardProps) {
  const nextMaintenance = field.maintenance_schedule
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center
                ${field.availability === 'available' 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-yellow-100 dark:bg-yellow-900'
                }`}
              >
                {field.availability === 'available' ? (
                  <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{field.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {field.games_supported.join(', ')}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors"
            >
              <PenSquare className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {nextMaintenance && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-md">
            <div className="flex">
              <Calendar className="h-5 w-5 text-yellow-400 dark:text-yellow-500" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Upcoming Maintenance
                </h4>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                  {new Date(nextMaintenance.date).toLocaleDateString()}
                  {nextMaintenance.note && ` - ${nextMaintenance.note}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {field.configurations['5-Stand'] && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">5-Stand Setup</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {field.configurations['5-Stand'].machines.length} machines,{' '}
              {field.configurations['5-Stand'].stands} stands
            </p>
          </div>
        )}

        {field.configurations['Trap'] && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Trap Setup</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {field.configurations['Trap'].wobble_trap ? 'Wobble Trap' : 'Standard'},{' '}
              {field.configurations['Trap'].arc_angle}° arc
            </p>
          </div>
        )}

        {field.configurations['Sporting Clays'] && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Sporting Clays Setup</h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {field.configurations['Sporting Clays'].total_stations} stations,{' '}
              {field.configurations['Sporting Clays'].stations.reduce((sum, station) => 
                sum + station.birds_per_station, 0)} total birds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}