import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useState } from 'react';
import { gunBrands } from '../../data/gunBrands';
import { BarrelLengthSelector } from './BarrelLengthSelector';
import type { Gun } from '../../types/gun';

interface NewGunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gun: Gun) => void;
}

const GAUGE_OPTIONS = ['12', '20', '28', '.410'] as const;
const ACTION_OPTIONS = ['Break Action', 'Semi-Auto', 'Pump', 'Bolt Action', 'Lever Action'] as const;
const CHOKE_OPTIONS = ['Cylinder', 'Improved Cylinder', 'Modified', 'Full'] as const;
const STOCK_OPTIONS = ['Standard', 'Pistol Grip', 'Adjustable'] as const;
const STOCK_MATERIAL_OPTIONS = ['Wood', 'Synthetic'] as const;
const SIGHT_OPTIONS = ['Bead', 'Ribbed', 'Red Dot', 'Scope'] as const;
const FINISH_OPTIONS = ['Blued', 'Stainless', 'Camo'] as const;

export function NewGunDialog({ isOpen, onClose, onSubmit }: NewGunDialogProps) {
  const [formData, setFormData] = useState<Partial<Gun>>({
    gauge: '12',
    brand: '',
    model: ''
  });
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);

  const availableModels = formData.brand && !isCustomBrand
    ? gunBrands.find(b => b.brand === formData.brand)?.models || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.gauge) return;
    
    onSubmit(formData as Gun);
    setFormData({ gauge: '12' });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-medium">Add New Gun</Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Required Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand *
                </label>
                <select
                  required
                  value={isCustomBrand ? '' : (formData.brand || '')}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'other') {
                      setIsCustomBrand(true);
                      setFormData({ ...formData, brand: '', model: '' });
                    } else {
                      setIsCustomBrand(false);
                      setFormData({ ...formData, brand: value, model: '' });
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select brand</option>
                  {gunBrands.map((brand) => (
                    <option key={brand.brand} value={brand.brand}>
                      {brand.brand}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gauge *
                </label>
                <select
                  required
                  value={formData.gauge}
                  onChange={e => setFormData({ ...formData, gauge: e.target.value as Gun['gauge'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {GAUGE_OPTIONS.map(gauge => (
                    <option key={gauge} value={gauge}>{gauge}</option>
                  ))}
                </select>
              </div>

              {/* Optional Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model || ''}
                  onChange={e => setFormData({ ...formData, model: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Action Type
                </label>
                <select
                  value={formData.action || ''}
                  onChange={e => setFormData({ ...formData, action: e.target.value as Gun['action'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select action</option>
                  {ACTION_OPTIONS.map(action => (
                    <option key={action} value={action}>{action}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Choke
                </label>
                <select
                  value={formData.choke || ''}
                  onChange={e => setFormData({ ...formData, choke: e.target.value as Gun['choke'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select choke</option>
                  {CHOKE_OPTIONS.map(choke => (
                    <option key={choke} value={choke}>{choke}</option>
                  ))}
                </select>
              </div>

              <BarrelLengthSelector
                value={formData.barrelLength}
                onChange={(length) => setFormData({ ...formData, barrelLength: length })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes || ''}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
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
                Add Gun
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}