import { OrganizationProfile, useOrganization, useUser } from '@clerk/clerk-react';
import { Building2, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { OrganizationHeader } from '../components/organization/OrganizationHeader';
import { RoleGuard } from '../components/auth/RoleGuard';
import { CreateOrganization } from '../components/organization/CreateOrganization';

export default function OrganizationProfilePage() {
  const { organization, isLoaded } = useOrganization();
  const { user } = useUser();
  const isAdmin = user?.emailAddresses.some(
    email => email.emailAddress.endsWith('@oneuprising.com')
  );

  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" />
        </div>
      </Layout>
    );
  }

  // Only show create organization option for admin users
  if (!organization && isAdmin) {
    return (
      <Layout>
        <CreateOrganization />
      </Layout>
    );
  } else if (!organization) {
    return (
      <Layout>
        <div className="max-w-md mx-auto text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No Organization</h3>
          <p className="mt-1 text-sm text-gray-500">
            You are not part of any organization yet.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <RoleGuard requiredPermission="manage_clubs">
      <Layout>
        <div className="max-w-4xl mx-auto">
          <OrganizationHeader />
          <div className="mt-8 bg-white shadow rounded-lg">
            <OrganizationProfile
              appearance={{
                elements: {
                  rootBox: 'w-full p-6',
                  card: 'w-full shadow-none p-0',
                  navbar: 'hidden',
                  pageScrollBox: 'p-0',
                  organizationSwitcherTrigger: 'hidden',
                  organizationPreview: {
                    marginBottom: '2rem'
                  },
                  formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
                  formFieldInput: 'rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }
              }}
            />
          </div>
        </div>
      </Layout>
    </RoleGuard>
  );
}