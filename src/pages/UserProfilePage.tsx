import Layout from '../components/Layout';
import { ProfileHeader } from '../components/profile/ProfileHeader';

export default function UserProfilePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader />
      </div>
    </Layout>
  );
}