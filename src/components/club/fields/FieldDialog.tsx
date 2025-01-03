import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { GameType, MaintenanceEntry } from '../../../types/field';

interface FieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void; // Replace `any` with the appropriate type for your form data
}

export function FieldDialog({ isOpen, onClose, onSubmit }: FieldDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    games_supported: [] as GameType[],
    configurations: undefined,
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-md w-full bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-lg font-medium text-gray-900">Field Details</Dialog.Title>
                <button type="button" onClick={onClose} aria-label="Close">
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-4">
                <label htmlFor="field-name" className="block text-sm font-medium text-gray-700">Field Name</label>
                <input
                  id="field-name"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="games-supported" className="block text-sm font-medium text-gray-700">Games Supported</label>
                <select
                  id="games-supported"
                  multiple
                  value={formData.games_supported}
                  onChange={(e) => setFormData({ ...formData, games_supported: Array.from(e.target.selectedOptions, option => option.value as GameType) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="Trap">Trap</option>
                  <option value="Skeet">Skeet</option>
                  <option value="Sporting Clays">Sporting Clays</option>
                </select>
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  aria-label="Submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}