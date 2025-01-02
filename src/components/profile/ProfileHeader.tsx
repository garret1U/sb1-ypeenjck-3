import { useUser } from '@clerk/clerk-react';
import { Shield, Mail, Calendar } from 'lucide-react';
import { useRole } from '../../hooks/useRole';

export function ProfileHeader() {
  const { user } = useUser();
  const { role } = useRole();
  const roleLabel = role === 'admin' ? 'Administrator' : 'Member';
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex sm:space-x-5">
          <div className="flex-shrink-0">
            <img
              className="mx-auto h-20 w-20 rounded-full"
              src={user?.imageUrl}
              alt={user?.fullName || 'Profile'}
            />
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
            <p className="text-xl font-bold text-gray-900 sm:text-2xl">
              {user?.fullName || 'User'}
            </p>
            <div className="flex flex-col space-y-2 mt-2">
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-2" />
                {roleLabel}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                {user?.primaryEmailAddress?.emailAddress}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                Member since {joinDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}