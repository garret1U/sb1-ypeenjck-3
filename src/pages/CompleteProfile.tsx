import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProfileForm } from '../components/auth/ProfileForm';
import { UserCircle } from 'lucide-react';

export default function CompleteProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user already has profile data, redirect to dashboard
    if (user?.user_metadata?.full_name && user?.user_metadata?.phone) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleProfileComplete = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserCircle className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide your name and phone number to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ProfileForm onComplete={handleProfileComplete} />
        </div>
      </div>
    </div>
  );
}