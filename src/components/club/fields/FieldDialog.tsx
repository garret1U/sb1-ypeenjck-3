import { Dialog } from '@headlessui/react';
import { X, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Field, GameType, TrapMachine, MaintenanceEntry } from '../../../types/field';

interface FieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (field: Field | Omit<Field, 'field_id'>) => void;
  field?: Field | null;
}

const GAME_TYPES: GameType[] = ['Skeet', 'Doubles Skeet', 'Trap', '5-Stand', 'Sporting Clays'];

export function FieldDialog({ isOpen, onClose, onSubmit, field }: FieldDialogProps) {
  const [formData, setFormData] = useState<Partial<Field>>({
    name: '',
    games_supported: [],
    configurations: {},
    maintenance_schedule: [],
    availability: 'available'
  });

  useEffect(() => {
    if (field) {
      setFormData(field);
    } else {
      setFormData({
        name: '',
        games_supported: [],
        configurations: {},
        maintenance_schedule: [],
        availability: 'available'
      });
    }
  }, [field]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.games_supported.length === 0) return;
    onSubmit(formData as Field);
  };

  const toggleGame = (game: GameType) => {
    setFormData(prev => {
      const games = prev.games_supported || [];
      const newGames = games.includes(game)
        ? games.filter(g => g !== game)
        : [...games, game];
      
      // Remove configurations for games that are no longer supported
      const newConfigs = { ...prev.configurations };
      if (!newGames.includes('5-Stand')) delete newConfigs['5-Stand'];
      if (!newGames.includes('Trap')) delete newConfigs['Trap'];

      return {
        ...prev,
        games_supported: newGames,
        configurations: newConfigs
      };
    });
  };

  const addMaintenance = () => {
    setFormData(prev => ({
      ...prev,
      maintenance_schedule: [
        ...(prev.maintenance_schedule || []),
        { date: '', note: '' }
      ]
    }));
  };

  const removeMaintenance = (index: number) => {
    setFormData(prev => ({
      ...prev,
      maintenance_schedule: prev.maintenance_schedule?.filter((_, i) => i !== index)
    }));
  };

  const updateMaintenance = (index: number, updates: Partial<MaintenanceEntry>) => {
    setFormData(prev => ({
      ...prev,
      maintenance_schedule: prev.maintenance_schedule?.map((entry, i) =>
        i === index ? { ...entry, ...updates } : entry
      )
    }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-medium">
              {field ? 'Edit Field' : 'Add New Field'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Field Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supported Games *
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {GAME_TYPES.map(game => (
                  <button
                    key={game}
                    type="button"
                    onClick={() => toggleGame(game)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      formData.games_supported?.includes(game)
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {game}
                  </button>
                ))}
              </div>
            </div>

            {formData.games_supported?.includes('Trap') && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Trap Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600">
                      Trap House Location
                    </label>
                    <input
                      type="text"
                      value={formData.configurations?.['Trap']?.trap_house_location || ''}
                      onChange={e => setFormData({
                        ...formData,
                        configurations: {
                          ...formData.configurations,
                          'Trap': {
                            ...formData.configurations?.['Trap'],
                            trap_house_location: e.target.value
                          }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="wobbleTrap"
                      checked={formData.configurations?.['Trap']?.wobble_trap || false}
                      onChange={e => setFormData({
                        ...formData,
                        configurations: {
                          ...formData.configurations,
                          'Trap': {
                            ...formData.configurations?.['Trap'],
                            wobble_trap: e.target.checked
                          }
                        }
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="wobbleTrap" className="ml-2 block text-sm text-gray-900">
                      Wobble Trap Capable
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600">
                      Arc Angle (degrees)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={formData.configurations?.['Trap']?.arc_angle || 45}
                      onChange={e => setFormData({
                        ...formData,
                        configurations: {
                          ...formData.configurations,
                          'Trap': {
                            ...formData.configurations?.['Trap'],
                            arc_angle: Number(e.target.value)
                          }
                        }
                      })}
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-700">Maintenance Schedule</h3>
                <button
                  type="button"
                  onClick={addMaintenance}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Entry
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.maintenance_schedule?.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <input
                      type="date"
                      value={entry.date}
                      onChange={e => updateMaintenance(index, { date: e.target.value })}
                      className="block w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      value={entry.note}
                      onChange={e => updateMaintenance(index, { note: e.target.value })}
                      placeholder="Maintenance note"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeMaintenance(index)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {formData.games_supported?.includes('Sporting Clays') && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sporting Clays Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600">
                      Number of Stations
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.configurations?.['Sporting Clays']?.total_stations || ''}
                      onChange={e => {
                        const totalStations = Number(e.target.value);
                        const stations = Array.from({ length: totalStations }, (_, i) => ({
                          station_number: i + 1,
                          birds_per_station: 2 // Default to 2 birds per station
                        }));
                        setFormData({
                          ...formData,
                          configurations: {
                            ...formData.configurations,
                            'Sporting Clays': {
                              total_stations: totalStations,
                              stations
                            }
                          }
                        });
                      }}
                      className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  {formData.configurations?.['Sporting Clays']?.stations && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Birds per Station</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {formData.configurations['Sporting Clays'].stations.map((station, index) => (
                          <div key={station.station_number} className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Station {station.station_number}</span>
                            <input
                              type="number"
                              min="1"
                              max="6"
                              value={station.birds_per_station}
                              onChange={e => {
                                const newStations = [...formData.configurations!['Sporting Clays']!.stations];
                                newStations[index] = {
                                  ...station,
                                  birds_per_station: Number(e.target.value)
                                };
                                setFormData({
                                  ...formData,
                                  configurations: {
                                    ...formData.configurations,
                                    'Sporting Clays': {
                                      ...formData.configurations['Sporting Clays']!,
                                      stations: newStations
                                    }
                                  }
                                });
                              }}
                              className="block w-16 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        Total birds: {formData.configurations['Sporting Clays'].stations.reduce(
                          (sum, station) => sum + station.birds_per_station, 0
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={e => setFormData({ 
                  ...formData, 
                  availability: e.target.value as Field['availability']
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="available">Available</option>
                <option value="under_maintenance">Under Maintenance</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                {field ? 'Save Changes' : 'Add Field'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}