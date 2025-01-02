import { UserProfile as ClerkUserProfile } from '@clerk/clerk-react';
import Layout from '../components/Layout';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export default function UserProfilePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader />
        <div className="bg-white shadow rounded-lg">
          <ClerkUserProfile 
            path="/*"
            routing="path"
            appearance={{
              elements: { 
                rootBox: 'w-full p-0',
                card: 'shadow-none rounded-none',
                page: 'p-6',
                navbar: 'hidden',
                pageScrollBox: 'p-0',
                profileSection__emailAddresses: {
                  marginTop: '2rem'
                },
                profileSection__connectedAccounts: {
                  marginTop: '2rem'
                },
                profileSection__danger: {
                  marginTop: '2rem',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '2rem'
                },
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                formButtonReset: 'text-gray-700 hover:bg-gray-50 border border-gray-300',
                formFieldInput: 'rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                formFieldLabel: 'text-sm font-medium text-gray-700',
                formFieldHintText: 'text-sm text-gray-500',
                formFieldErrorText: 'text-sm text-red-600',
                formFieldSuccessText: 'text-sm text-green-600',
                formResendCodeLink: 'text-indigo-600 hover:text-indigo-500',
                userPreviewMainIdentifier: 'text-lg font-medium text-gray-900',
                userPreviewSecondaryIdentifier: 'text-sm text-gray-500'
              }
            }}
          />
        </div>
      </div>
    </Layout>
  );
}