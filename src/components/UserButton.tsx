import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircle, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserButtonProps {
  expanded?: boolean;
}

export function UserButton({ expanded = false }: UserButtonProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="flex items-center w-full p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-white transition-colors"
      >
        <UserCircle className="h-6 w-6 flex-shrink-0" />
        {expanded && (
          <span className="ml-3 text-sm font-medium truncate">
            {user?.email}
          </span>
        )}
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
        <Menu.Items
          className="absolute bottom-full left-0 mb-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-50 dark:bg-gray-700' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-gray-50 dark:bg-gray-700' : ''
                  } flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}