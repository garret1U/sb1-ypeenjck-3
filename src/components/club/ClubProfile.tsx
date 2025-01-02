import { useState } from 'react';
import { Building2, Phone, Mail, Globe, Calendar, Users, PenSquare, Save } from 'lucide-react';
import { useClub } from '../../hooks/useClub';
import { useRole } from '../../hooks/useRole';
import type { Club } from '../../types/club';

export function ClubProfile() {
  const { club, updateClub } = useClub('1'); // TODO: Get club ID from context/route
  const { hasPermission } = useRole();
  const [isEditing, setIsEditing] = useState(false);
  const [editedClub, setEditedClub] = useState<Club>(club);

  const canEdit = hasPermission('manage_clubs') || hasPermission('manage_club_settings');

  const handleSave = async () => {
    await updateClub(editedClub);
    setIsEditing(false);
  };

  const InfoRow = ({ icon: Icon, label, value, field }: {
    icon: React.ElementType;
    label: string;
    value: string;
    field: keyof Club;
  }) => (
    <div className="flex items-start py-3 border-b border-gray-200">
      <Icon className="h-5 w-5 text-gray-400 mt-1" />
      <div className="ml-4 flex-1">
        <div className="text-sm font-medium text-gray-500">{label}</div>
        {isEditing && typeof value === 'string' ? (
          <input
            type="text"
            value={editedClub[field] as string || ''}
            onChange={(e) => setEditedClub({ ...editedClub, [field]: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        ) : (
          <div className="mt-1 text-sm text-gray-900">{value || 'Not specified'}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Club Profile</h2>
          {canEdit && (
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <PenSquare className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-1">
          <InfoRow icon={Building2} label="Address" value={club.address || ''} field="address" />
          <InfoRow icon={Phone} label="Phone" value={club.phone || ''} field="phone" />
          <InfoRow icon={Mail} label="Email" value={club.email || ''} field="email" />
          <InfoRow icon={Globe} label="Website" value={club.website || ''} field="website" />
          <InfoRow icon={Calendar} label="Founded" value={club.founded || ''} field="founded" />
          <InfoRow icon={Users} label="Member Count" value={String(club.memberCount || 0)} field="memberCount" />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
          {isEditing ? (
            <textarea
              value={editedClub.description || ''}
              onChange={(e) => setEditedClub({ ...editedClub, description: e.target.value })}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          ) : (
            <p className="text-sm text-gray-600">{club.description || 'No description available.'}</p>
          )}
        </div>
      </div>
    </div>
  );
}