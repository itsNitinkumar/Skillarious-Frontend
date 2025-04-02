'use client';

import { useState, useEffect, Suspense } from 'react';
import educatorService from '@/services/educator.service';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import EducatorGuard from '@/components/EducatorGuard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';

interface EducatorProfile {
  bio: string;
  about: string;
  doubtOpen: boolean;
}

function EducatorProfileContent() {
  const [profile, setProfile] = useState<EducatorProfile>({
    bio: '',
    about: '',
    doubtOpen: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.isEducator) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await educatorService.getEducatorProfile();
      
      if (response.success) {
        setProfile(response.data);
      } else {
        if (response.message === 'Educator profile not found') {
          router.push('/educator/register');
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await educatorService.updateEducatorProfile(profile);
      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const response = await educatorService.toggleDoubtAvailability();
      if (response.success) {
        setProfile(prev => ({ ...prev, doubtOpen: response.data.doubtOpen }));
        toast.success(`Availability ${response.data.doubtOpen ? 'enabled' : 'disabled'}`);
      }
    } catch (error) {
      toast.error('Failed to toggle availability');
    }
  };

  if (!user?.isEducator) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">You are not an educator.</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-3xl ">
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Educator Profile</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button
                onClick={handleToggleAvailability}
                className={`px-4 py-2 rounded ${
                  profile.doubtOpen 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                {profile.doubtOpen ? 'Available' : 'Unavailable'}
              </button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white p-2"
                  rows={3}
                  placeholder="Enter your bio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  About
                </label>
                <textarea
                  value={profile.about}
                  onChange={(e) => setProfile(prev => ({ ...prev, about: e.target.value }))}
                  className="mt-1 block w-full rounded bg-gray-700 border-gray-600 text-white p-2"
                  rows={5}
                  placeholder="Tell us more about yourself"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-300">Bio</h3>
                <p className="mt-1 text-white">{profile.bio || 'No bio added yet.'}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-300">About</h3>
                <p className="mt-1 text-white">{profile.about || 'No about information added yet.'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EducatorProfilePage() {
  return (
    <ProtectedRoute>
      <EducatorGuard>
        <Suspense fallback={
          <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        }>
          <EducatorProfileContent />
        </Suspense>
      </EducatorGuard>
    </ProtectedRoute>
  );
}

