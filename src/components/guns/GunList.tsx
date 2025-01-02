import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Gun } from '../../types/gun';
import { GunCard } from './GunCard';
import { GunDialog } from './GunDialog';

export function GunList() {
  const [guns, setGuns] = useState<Gun[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGun, setEditingGun] = useState<Gun | null>(null);

  const filteredGuns = guns.filter(gun =>
    gun.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gun.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddGun = (gun: Gun) => {
    const newGun = { ...gun, id: crypto.randomUUID() };
    if (newGun.isPrimary) {
      // Remove primary status from other guns
      setGuns(guns.map(g => ({ ...g, isPrimary: false })));
    }
    setGuns([...guns, newGun]);
    setIsDialogOpen(false);
  };

  const handleEditGun = (updatedGun: Gun) => {
    if (updatedGun.isPrimary) {
      // Remove primary status from other guns
      setGuns(guns.map(g => 
        g.id === updatedGun.id ? updatedGun : { ...g, isPrimary: false }
      ));
    } else {
      setGuns(guns.map(g => 
        g.id === updatedGun.id ? updatedGun : g
      ));
    }
    setIsDialogOpen(false);
    setEditingGun(null);
  };

  const handleDeleteGun = (gunId: string) => {
    setGuns(guns.filter(gun => gun.id !== gunId));
  };

  const handleTogglePrimary = (gunId: string) => {
    setGuns(guns.map(gun => ({
      ...gun,
      isPrimary: gun.id === gunId ? !gun.isPrimary : false
    })));
  };

  const handleOpenDialog = (gun?: Gun) => {
    setEditingGun(gun || null);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Guns</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Gun
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search guns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {filteredGuns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No guns found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Get started by adding your first gun'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuns.map((gun) => (
            <GunCard
              key={gun.id}
              gun={gun}
              onEdit={() => handleOpenDialog(gun)}
              onTogglePrimary={() => handleTogglePrimary(gun.id)}
              onDelete={() => handleDeleteGun(gun.id)}
            />
          ))}
        </div>
      )}

      <GunDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={editingGun ? handleEditGun : handleAddGun}
        gun={editingGun}
      />
    </div>
  );
}