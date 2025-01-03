import { Shield, Mail, Calendar } from 'lucide-react';

export function ProfileHeader() {
  const user = null;
  const roleLabel = 'Member';
  const joinDate = 'N/A';

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex sm:space-x-5">
          <div className="flex-shrink-0">
            <img
              className="mx-auto h-20 w-20 rounded-full"
              src=""
              alt="Profile"
            />
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
            <p className="text-xl font-bold text-gray-900 sm:text-2xl">
              User
            </p>
            <div className="flex flex-col space-y-2 mt-2">
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-2" />
                {roleLabel}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                example@mail.com
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