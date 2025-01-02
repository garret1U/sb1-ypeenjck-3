import { ClubSwitcher } from './club/ClubSwitcher';

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex justify-end items-center">
          <div className="flex items-center">
            <ClubSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}