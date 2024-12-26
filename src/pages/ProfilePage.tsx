import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { init, lookup, id } from '@instantdb/react';
import { Camera, Loader, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id?: string; 
  email: string;
  username: string;
  phoneNumber: string;
  imageUrl: string;
  lastUpdated?: number;
}


interface UpdateMessage {
  type: 'success' | 'error' | '';
  message: string;
}



const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isLoading: authLoading, user } = db.useAuth();
  const [profile, setProfile] = useState<Profile>({
    email: '',
    username: '',
    phoneNumber: '',
    imageUrl: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<UpdateMessage>({ type: '', message: '' });

  const { data, error, isLoading: queryLoading } = db.useQuery({
    profiles: {
      $: {
        where: {
          email: user?.email || ''
        }
      }
    }
  });
  
  // Add logging for debugging
  useEffect(() => {
    // Log auth state
    console.log('Auth state:', { 
      user, 
      authLoading, 
      timestamp: new Date().toISOString() 
    });
  
    // Log query results
    console.log('Query results:', {
      data,
      error,
      profileFound: Boolean(data?.profiles?.[0])
    });
  
    if (data?.profiles?.[0]) {
      const userProfile = data.profiles[0];
      console.log('Profile details:', {
        id: userProfile.id,
        username: userProfile.username,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber,
        lastUpdated: new Date(userProfile.lastUpdated || 0).toISOString()
      });
    }
  }, [data, user, authLoading, queryLoading, error]);

  
  

  useEffect(() => {
    if (profile.username) {
      const robotAvatarUrl = `https://robohash.org/${encodeURIComponent(profile.username)}?set=set3`;
      setProfile(prev => ({
        ...prev,
        imageUrl: robotAvatarUrl
      }));
    }
  }, [profile.username]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!user?.email) {
        throw new Error('User email not found');
      }

      setIsUpdating(true);

      // Create new profile ID if doesn't exist
      const profileId = data?.profiles?.[0]?.id || id();

      await db.transact([
        db.tx.profiles[profileId].update({
          email: user.email,
          username: profile.username.trim(),
          phoneNumber: profile.phoneNumber.trim(),
          imageUrl: `https://robohash.org/${encodeURIComponent(profile.username.trim())}?set=set3`,
          lastUpdated: Date.now()
        })
      ]);

        setUpdateMessage({
          type: 'success',
          message: 'Profile updated successfully!'
        });

        setTimeout(() => navigate('/chat'), 1500);
      }
    catch (err) {
      console.error('Profile update error:', { err, profileData: data?.profiles });
      setUpdateMessage({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update profile'
      });
    }
  };


  const handleSignOut = async () => {
    try {
      setIsUpdating(true);
      await db.auth.signOut();
      navigate('/signup');
    } catch (err) {
      console.error('Signout error:', err);
      setUpdateMessage({
        type: 'error',
        message: 'Failed to sign out'
      });
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
      <div className="flex justify-end mb-4">
          <button
            onClick={handleSignOut}
            disabled={isUpdating}
            className="text-red-600 hover:text-red-800"
          >
            Sign Out
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">Profile Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
          src={profile.imageUrl || `https://robohash.org/${encodeURIComponent(profile.username || 'default')}?set=set3`}
          alt="Profile" 
          className="w-full h-full object-cover"
        />
              </div>
              
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phoneNumber}
              onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Update Message */}
          {updateMessage.message && (
            <div className={`p-3 rounded ${
              updateMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {updateMessage.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdating}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isUpdating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isUpdating ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              'Update Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;