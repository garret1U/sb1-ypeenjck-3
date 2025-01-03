import React, { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { gunBrands } from '../../data/gunBrands';
import { BarrelLengthSelector } from './BarrelLengthSelector';
import type { Gun, BarrelType, ChokeType } from '../../types/gun';

interface GunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (gun: Gun) => void;
  gun?: Gun | null;
}

const GAUGE_OPTIONS = ['12', '20', '28', '.410'] as const;
const ACTION_OPTIONS = ['Break Action', 'Semi-Auto', 'Pump', 'Bolt Action', 'Lever Action'] as const;
const BARREL_TYPES: BarrelType[] = ['Single', 'Over/Under', 'Side-by-Side'];
const CHOKE_OPTIONS: Array<{ value: ChokeType; label: string; description: string }> = [
  { value: 'Cylinder (Cyl)', label: 'Cylinder (Cyl)', description: 'No constriction; the widest spread, ideal for short-range shooting' },
  { value: 'Skeet (Skt)', label: 'Skeet (Skt)', description: 'Slightly tighter than Cylinder, designed specifically for skeet shooting and close-range targets' },
  { value: 'Improved Cylinder (IC)', label: 'Improved Cylinder (IC)', description: 'Mild constriction, offering a bit more range than Cylinder' },
  { value: 'Light Modified (LM)', label: 'Light Modified (LM)', description: 'Falls between Improved Cylinder and Modified, offering a versatile option for moderate ranges' },
  { value: 'Modified (Mod)', label: 'Modified (Mod)', description: 'Medium constriction for a good balance between spread and range' },
  { value: 'Improved Modified (IM)', label: 'Improved Modified (IM)', description: 'Tighter than Modified, suitable for longer-range shooting' },
  { value: 'Full (F)', label: 'Full (F)', description: 'High constriction for long-range accuracy and dense patterns' },
  { value: 'Extra Full (XF/SF)', label: 'Extra Full (XF/SF)', description: 'Extreme constriction for the tightest patterns, often used in turkey hunting' }
] as const;
const STOCK_OPTIONS = ['Standard', 'Pistol Grip', 'Adjustable'] as const;
const STOCK_MATERIAL_OPTIONS = ['Wood', 'Synthetic'] as const;
const SIGHT_OPTIONS = ['Bead', 'Ribbed', 'Red Dot', 'Scope'] as const;
const FINISH_OPTIONS = ['Blued', 'Stainless', 'Camo'] as const;

export function GunDialog({ isOpen, onClose, onSubmit, gun }: GunDialogProps) {
  const [formData, setFormData] = useState<Partial<Gun>>({
    gauge: '12',
    brand: '',
    isPrimary: false,
    barrelConfig: {
      type: 'Single',
      chokes: {
        first: 'Modified (Mod)'
      }
    }
  });

  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);
  
  useEffect(() => {
    if (gun) {
      setFormData(gun);
      setIsCustomBrand(!gunBrands.some(b => b.brand === gun.brand));
      setIsCustomModel(!gunBrands.find(b => b.brand === gun.brand)?.models.includes(gun.model || ''));
    } else {
      setFormData({
        gauge: '12',
        isPrimary: false,
        barrelConfig: { type: 'Single', chokes: { first: 'Modified (Mod)' } }
      });
      setIsCustomBrand(false);
      setIsCustomModel(false);
    }
  }, [gun]);

  const availableModels = formData.brand && !isCustomBrand
    ? gunBrands.find(b => b.brand === formData.brand)?.models || []
    : [];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.brand || !formData.gauge) return;
    
    onSubmit(formData as Gun);
    setFormData({ gauge: '12', isPrimary: false });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-medium">
              {gun ? 'Edit Gun' : 'Add New Gun'}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Gun Name"
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
                      setFormData({ ...formData, brand: '', model: undefined });
                    } else {
                      setIsCustomBrand(false);
                      setFormData({ ...formData, brand: value, model: undefined });
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
                {isCustomBrand && (
                  <input
                    type="text"
                    required
                    placeholder="Enter brand name"
                    value={formData.brand || ''}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                {!isCustomBrand && availableModels.length > 0 ? (
                  <select
                    value={isCustomModel ? '' : (formData.model || '')}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === 'other') {
                        setIsCustomModel(true);
                        setFormData({ ...formData, model: undefined });
                      } else {
                        setIsCustomModel(false);
                        setFormData({ ...formData, model: value });
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Select model</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter model name"
                    value={formData.model || ''}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                )}
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
                  Barrel Configuration
                </label>
                <select
                  value={formData.barrelConfig?.type}
                  onChange={e => {
                    const type = e.target.value as BarrelType;
                    setFormData({
                      ...formData,
                      barrelConfig: {
                        type,
                        chokes: {
                          first: formData.barrelConfig?.chokes.first || 'Modified (Mod)',
                          ...(type !== 'Single' && { second: formData.barrelConfig?.chokes.second || 'Modified (Mod)' })
                        }
                      }
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {BARREL_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choke Configuration
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">
                      {formData.barrelConfig?.type === 'Over/Under' ? 'Top Barrel' :
                       formData.barrelConfig?.type === 'Side-by-Side' ? 'Left Barrel' :
                       'Choke'}
                    </label>
                    <select
                      value={formData.barrelConfig?.chokes.first}
                      onChange={e => setFormData({
                        ...formData,
                        barrelConfig: {
                          ...formData.barrelConfig!,
                          chokes: {
                            ...formData.barrelConfig!.chokes,
                            first: e.target.value as ChokeType
                          }
                        }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      {CHOKE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  {formData.barrelConfig?.type !== 'Single' && (
                    <div>
                      <label className="text-sm text-gray-600">
                        {formData.barrelConfig?.type === 'Over/Under' ? 'Bottom Barrel' : 'Right Barrel'}
                      </label>
                      <select
                        value={formData.barrelConfig?.chokes.second}
                        onChange={e => setFormData({
                          ...formData,
                          barrelConfig: {
                            ...formData.barrelConfig!,
                            chokes: {
                              ...formData.barrelConfig!.chokes,
                              second: e.target.value as ChokeType
                            }
                          }
                        })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        {CHOKE_OPTIONS.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {formData.barrelConfig?.chokes.first && (
                  <div className="mt-2 text-sm text-gray-500">
                    {CHOKE_OPTIONS.find(c => c.value === formData.barrelConfig?.chokes.first)?.description}
                  </div>
                )}
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrimary"
                checked={formData.isPrimary || false}
                onChange={e => setFormData({ ...formData, isPrimary: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
                Set as primary gun configuration
              </label>
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
                {gun ? 'Save Changes' : 'Add Gun'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}