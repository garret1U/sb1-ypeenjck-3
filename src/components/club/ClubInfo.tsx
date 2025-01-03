import React, { useState, ChangeEvent } from 'react';
import { PenSquare, Save, X } from 'lucide-react';
import type { Club } from '../../types/club';

interface ClubInfoProps {
  club: Club;
  onUpdate: (updates: Partial<Club>) => void;
}

export function ClubInfo({ club, onUpdate }: ClubInfoProps): JSX.Element {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClub, setEditedClub] = useState<Club>(club);

  const handleSave = (): void => {
    onUpdate(editedClub);
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setEditedClub(club);
    setIsEditing(false);
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditedClub({ ...editedClub, name: e.target.value });
  };

  const handleAddressChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setEditedClub({ ...editedClub, address: e.target.value });
  };

  return (
    <div className="p-6 dark:bg-gray-800">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Club Information</h2>
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Save className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <X className="h-4 w-4 mr-1.5" aria-hidden="true" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <PenSquare className="h-4 w-4 mr-1.5" aria-hidden="true" />
            Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="club-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Club Name
          </label>
          {isEditing ? (
            <input
              id="club-name"
              type="text"
              value={editedClub.name}
              onChange={handleNameChange}
              placeholder="Enter club name"
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{club.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="club-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>
          {isEditing ? (
            <textarea
              id="club-address"
              value={editedClub.address || ''}
              onChange={handleAddressChange}
              placeholder="Enter club address"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {club.address || 'No address specified'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}