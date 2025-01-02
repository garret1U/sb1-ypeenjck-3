import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Building2, ChevronDown } from 'lucide-react';
import { useClub } from '../../contexts/ClubContext';

export function ClubSwitcher() {
  const { clubs, selectedClub, selectClub } = useClub();

  if (!clubs.length) return null;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-x-1 text-sm font-medium text-gray-900 dark:text-white rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2">
        <Building2 className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        <span>{selectedClub?.name || 'Select Club'}</span>
        <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {clubs.map((club) => (
              <Menu.Item key={club.id}>
                {({ active }) => (
                  <button
                    onClick={() => selectClub(club.id)}
                    className={`
                      ${active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}
                      ${selectedClub?.id === club.id ? 'bg-gray-50 dark:bg-gray-700' : ''}
                      group flex items-center w-full px-4 py-2 text-sm
                    `}
                  >
                    <span className="flex-grow text-left">{club.name}</span>
                    <span className="ml-3 text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {club.role}
                    </span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}