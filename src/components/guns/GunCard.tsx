import { Crosshair, Star, StarOff, PenSquare, X } from 'lucide-react';
import type { Gun as GunType } from '../../types/gun';

interface GunCardProps {
  gun: GunType;
  onDelete: () => void;
  onEdit: () => void;
  onTogglePrimary: () => void;
}

export function GunCard({ gun, onDelete, onEdit, onTogglePrimary }: GunCardProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="flex-shrink-0">
              <div className="relative h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Crosshair className="h-5 w-5 text-indigo-600" />
                {gun.isPrimary && (
                  <div className="absolute -top-1 -right-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">{gun.name}</h3>
              <p className="text-sm text-gray-500">{gun.brand}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={onTogglePrimary}
              className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
              title={gun.isPrimary ? "Remove as primary" : "Set as primary"}
            >
              {gun.isPrimary ? (
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Edit gun"
            >
              <PenSquare className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Delete gun"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Gauge</dt>
            <dd className="mt-1 text-sm text-gray-900">{gun.gauge}</dd>
          </div>
          {gun.model && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Model</dt>
              <dd className="mt-1 text-sm text-gray-900">{gun.model}</dd>
            </div>
          )}
          {gun.action && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Action</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {gun.action} - {gun.barrelConfig.type}
              </dd>
            </div>
          )}
          {gun.barrelConfig && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Choke Configuration</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {gun.barrelConfig.type === 'Single' ? (
                  gun.barrelConfig.chokes.first
                ) : (
                  <>
                    {gun.barrelConfig.type === 'Over/Under' ? 'Top: ' : 'Left: '}
                    {gun.barrelConfig.chokes.first}
                    <br />
                    {gun.barrelConfig.type === 'Over/Under' ? 'Bottom: ' : 'Right: '}
                    {gun.barrelConfig.chokes.second}
                  </>
                )}
              </dd>
            </div>
          )}
        </dl>

        {gun.notes && (
          <div className="mt-4 text-sm text-gray-500">
            <p className="font-medium">Notes</p>
            <p className="mt-1">{gun.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}