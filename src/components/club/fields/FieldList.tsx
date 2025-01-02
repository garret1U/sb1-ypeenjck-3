import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import type { Field } from '../../../types/field';
import { FieldCard } from './FieldCard';
import { FieldDialog } from './FieldDialog';

export function FieldList() {
  const [fields, setFields] = useState<Field[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  const handleAddField = (field: Omit<Field, 'field_id'>) => {
    const newField = { ...field, field_id: crypto.randomUUID() };
    setFields([...fields, newField]);
    setIsDialogOpen(false);
  };

  const handleEditField = (updatedField: Field) => {
    setFields(fields.map(f => 
      f.field_id === updatedField.field_id ? updatedField : f
    ));
    setIsDialogOpen(false);
    setEditingField(null);
  };

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter(f => f.field_id !== fieldId));
  };

  return (
    <div className="p-6 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Fields</h2>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Target className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No fields configured</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first field</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <FieldCard
              key={field.field_id}
              field={field}
              onEdit={() => {
                setEditingField(field);
                setIsDialogOpen(true);
              }}
              onDelete={() => handleDeleteField(field.field_id)}
            />
          ))}
        </div>
      )}

      <FieldDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingField(null);
        }}
        onSubmit={editingField ? handleEditField : handleAddField}
        field={editingField}
      />
    </div>
  );
}