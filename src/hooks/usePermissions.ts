import { useClub } from '../contexts/ClubContext';

type Permission = 
  | 'manage_club'
  | 'manage_members'
  | 'manage_fields'
  | 'view_scores'
  | 'manage_own_scores'
  | 'manage_all_scores';

const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'manage_club',
    'manage_members',
    'manage_fields',
    'view_scores',
    'manage_own_scores',
    'manage_all_scores'
  ],
  coach: [
    'view_scores',
    'manage_own_scores',
    'manage_all_scores'
  ],
  member: [
    'view_scores',
    'manage_own_scores'
  ]
};

export function usePermissions() {
  const { selectedClub } = useClub();

  const hasPermission = (permission: Permission): boolean => {
    if (!selectedClub) return false;
    return rolePermissions[selectedClub.role]?.includes(permission) || false;
  };

  return {
    hasPermission,
    isAdmin: selectedClub?.role === 'admin',
    isCoach: selectedClub?.role === 'coach',
    isMember: selectedClub?.role === 'member'
  };
}