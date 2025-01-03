import React from 'react';
import { Target, Calendar, PenSquare, X, AlertTriangle } from 'lucide-react';
import type { Field } from '../../../types/field';

interface FieldCardProps {
  field: Field;
  onEdit: () => void;
  onDelete: () => void;
}

export function FieldCard({ field, onEdit, onDelete }: FieldCardProps): JSX.Element {
  const nextMaintenance = field.maintenance_schedule
    .filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{field.name}</h3>
        <div className="flex space-x-2">
          <button onClick={onEdit} className="text-indigo-600 hover:text-indigo-900">
            <PenSquare className="h-5 w-5" />
          </button>
          <button onClick={onDelete} className="text-red-600 hover:text-red-900">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        <p>Games Supported: {field.games_supported.join(', ')}</p>
        {nextMaintenance ? (
          <p>
            <Calendar className="inline-block h-4 w-4 mr-1" />
            Next Maintenance: {new Date(nextMaintenance.date).toLocaleDateString()}
          </p>
        ) : (
          <p>
            <AlertTriangle className="inline-block h-4 w-4 mr-1 text-yellow-500" />
            No upcoming maintenance scheduled
          </p>
        )}
      </div>
    </div>
  );
}