import React, { useState, type FormEvent } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { gunBrands } from '../../data/gunBrands';
import type { Gun } from '../../types/gun';

export interface NewGunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gun: Gun) => void;
}

export function NewGunDialog({ isOpen, onClose, onSubmit }: NewGunDialogProps) {
  const [gun, setGun] = useState<Partial<Gun>>({});
  const [errors, setErrors] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Validation logic here
    onSubmit(gun as Gun);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-md w-full bg-white rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-lg font-medium text-gray-900">Add New Gun</Dialog.Title>
                <button type="button" onClick={onClose} aria-label="Close">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mt-4">
                <label htmlFor="gauge-select" className="block text-sm font-medium text-gray-700">Gauge</label>
                <select
                  id="gauge-select"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={gun.gauge ?? ''}
                  onChange={(e) => setGun({ ...gun, gauge: e.target.value as Gun['gauge'] })}
                >
                  <option value="">Select a gauge</option>
                  <option value="12">12</option>
                  <option value="20">20</option>
                  <option value="28">28</option>
                  <option value=".410">.410</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="action-select" className="block text-sm font-medium text-gray-700">Action</label>
                <select
                  id="action-select"
                  className="mt-1 block w-full rounded-md"
                  value={gun.action ?? ''}
                  onChange={(e) => setGun({ ...gun, action: e.target.value as Gun['action'] })}
                >
                  <option value="">Select an action</option>
                  <option value="Break Action">Break Action</option>
                  <option value="Semi-Auto">Semi-Auto</option>
                  <option value="Pump">Pump</option>
                  <option value="Bolt Action">Bolt Action</option>
                  <option value="Lever Action">Lever Action</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="model-input" className="block text-sm font-medium text-gray-700">Model</label>
                <input
                  id="model-input"
                  placeholder="Model name"
                  className="mt-1 block w-full rounded-md border-gray-300"
                  value={gun.model ?? ''}
                  onChange={(e) => setGun({ ...gun, model: e.target.value })}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="barrel-type-select" className="block text-sm font-medium text-gray-700">Barrel Type</label>
                <select
                  id="barrel-type-select"
                  className="mt-1 block w-full rounded-md"
                  value={gun.barrelConfig?.type ?? 'Single'}
                  onChange={(e) =>
                    setGun({
                      ...gun,
                      barrelConfig: {
                        ...(gun.barrelConfig || {}),
                        type: e.target.value as Gun['barrelConfig']['type'],
                        chokes: gun.barrelConfig?.chokes || { first: 'Cylinder (Cyl)' },
                      },
                    })
                  }
                >
                  <option value="Single">Single</option>
                  <option value="Over/Under">Over/Under</option>
                  <option value="Side-by-Side">Side-by-Side</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="barrel-length-input" className="block text-sm font-medium text-gray-700">Barrel Length</label>
                <input
                  type="number"
                  min={18}
                  id="barrel-length-input"
                  placeholder="Barrel length"
                  className="mt-1 block w-full rounded-md border-gray-300"
                  value={gun.barrelLength ?? ''}
                  onChange={(e) => setGun({ ...gun, barrelLength: Number(e.target.value) })}
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  aria-label="Add Gun"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Gun
                </button>
              </div>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}