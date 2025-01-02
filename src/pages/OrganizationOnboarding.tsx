import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useOrganizationList } from '@clerk/clerk-react';
import { Building2, Plus, Users } from 'lucide-react';

export default function OrganizationOnboarding() {
  const { user } = useUser();
  const { organizationList, isLoaded } = useOrganizationList();
  const navigate = useNavigate();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  useEffect(() => {
    // If user is already in an organization, redirect to dashboard
    if (isLoaded && organizationList?.length > 0) {
      navigate('/');
    }
  }, [isLoaded, organizationList, navigate]);

  const handleJoinOrg = async (orgId: string) => {
    try {
      // In the future, this will create a membership request
      // For now, directly join the organization
      await organizationList?.createOrganizationMembership({
        organizationId: orgId,
        role: 'basic_member'
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to join organization:', error);
    }
  };

  const handleCreateOrg = () => {
    navigate('/organization');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Building2 className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Welcome to Gun Club Scorer</h2>
          <p className="mt-2 text-lg text-gray-600">
            Join an existing organization or create your own
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Join Organization */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <Users className="mx-auto h-8 w-8 text-indigo-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Join Organization
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Connect with your existing club
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {/* In the future, this will show a list of available organizations */}
              <button
                onClick={() => handleJoinOrg('demo-org')}
                className="w-full flex items-center justify-between p-4 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center">
                  <Building2 className="h-6 w-6 text-gray-400" />
                  <span className="ml-3 text-gray-900">Demo Gun Club</span>
                </div>
                <span className="text-sm text-gray-500">12 members</span>
              </button>
            </div>
          </div>

          {/* Create Organization */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <Plus className="mx-auto h-8 w-8 text-indigo-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Create Organization
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Set up your own gun club
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={handleCreateOrg}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create New Organization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}