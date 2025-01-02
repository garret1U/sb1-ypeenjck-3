import { useState } from 'react';
import { Search, Plus, Filter, ChevronDown } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { ShooterCard } from './ShooterCard';
import { useShooters } from '../../hooks/useShooters';

export function ShootersList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const { shooters, isLoading } = useShooters();

  const filteredShooters = shooters.filter(shooter => {
    const matchesSearch = shooter.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || shooter.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shooters</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Shooter
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shooters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
            />
          </div>
        </div>

        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {(['all', 'active', 'inactive'] as const).map((status) => (
                <Menu.Item key={status}>
                  {({ active }) => (
                    <button
                      onClick={() => setFilterStatus(status)}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-600' : ''
                      } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 w-full text-left`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Menu>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
        </div>
      ) : filteredShooters.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Search className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No shooters found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchQuery
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by adding a new shooter'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShooters.map((shooter) => (
            <ShooterCard
              key={shooter.id}
              shooter={shooter}
            />
          ))}
        </div>
      )}
    </div>
  );
}