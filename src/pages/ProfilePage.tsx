import { useState, useEffect, FormEvent } from 'react';
import { init, id } from '@instantdb/react';
import { Loader, ArrowLeft, LogOut, Phone, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

interface Profile {
  id?: string;
  email: string;
  username: string;
  phoneNumber: string;
  imageUrl: string;
  lastUpdated?: number;
}



const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user } = db.useAuth();
  const [profile, setProfile] = useState<Profile>({
    email: '',
    username: '',
    phoneNumber: '',
    imageUrl: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { data } = db.useQuery({
    profiles: {
      $: {
        where: {
          email: user?.email || ''
        }
      }
    }
  });

  useEffect(() => {
    if (data?.profiles?.[0]) {
      const userProfile = data.profiles[0];
      setProfile({
        id: userProfile.id,
        email: userProfile.email,
        username: userProfile.username || '',
        phoneNumber: userProfile.phoneNumber || '',
        imageUrl: userProfile.imageUrl || '',
        lastUpdated: userProfile.lastUpdated
      });
    }
  }, [data]);

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

      // Validate username if it's a new profile
      if (!data?.profiles?.[0]?.username && !profile.username.trim()) {
        throw new Error('Username is required');
      }

      setIsUpdating(true);
      const profileId = data?.profiles?.[0]?.id || id();

      await db.transact([
        db.tx.profiles[profileId].update({
          email: user.email,
          // Only include username in the update if it's not already set
          ...(data?.profiles?.[0]?.username ? {} : { username: profile.username.trim() }),
          phoneNumber: profile.phoneNumber.trim(),
          imageUrl: `https://robohash.org/${encodeURIComponent(profile.username.trim())}?set=set3`,
          lastUpdated: Date.now()
        })
      ]);

      toast.success('Profile updated successfully!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          paddingLeft: '16px',
          paddingRight: '16px',
        },
        icon: '👍',
      });

      setTimeout(() => navigate('/chat'), 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await db.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
      <Toaster
        toastOptions={{
          className: '',
          style: {
            borderRadius: '10px',
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#e5e7eb' : '#1f2937',
          },
        }}
      />
      
      {/* Header */}
      <header className={`sticky top-0 z-10 backdrop-blur-sm border-b ${
        isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-gray-100'
      }`}>
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className={`p-2.5 rounded-xl transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-zinc-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={`text-xl font-bold ${
              isDarkMode ? 'text-gray-200' : 'text-gray-900'
            }`}>
              Profile Settings
            </h1>
          </div>
          
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              isDarkMode
                ? 'text-red-400 hover:bg-red-500/10'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Avatar Section */}
        <div className={`mb-8 p-8 rounded-2xl text-center ${
          isDarkMode ? 'bg-zinc-800/50' : 'bg-white'
        } shadow-lg`}>
          <div className="relative inline-block">
            <img
              src={`https://robohash.org/${encodeURIComponent(profile.username || 'default')}?set=set3`}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {profile.username || 'New User'}
          </h2>
          <p className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {profile.email}
          </p>
        </div>

        {/* Profile Form */}
        <div className={`rounded-2xl ${
          isDarkMode ? 'bg-zinc-800/50' : 'bg-white'
        } shadow-lg`}>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Field (Read-only) */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-3 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-zinc-900/50 border-zinc-700 text-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  } cursor-not-allowed`}
                />
              </div>
            </div>

            {/* Username field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Username {!data?.profiles?.[0]?.username && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <User className={`absolute left-4 top-3 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl border transition-colors ${
                    isDarkMode 
                      ? 'bg-zinc-900/50 border-zinc-700 text-gray-200' 
                      : 'bg-white border-gray-200 text-gray-900'
                  } ${
                    data?.profiles?.[0]?.username 
                      ? 'opacity-75 cursor-not-allowed' 
                      : isDarkMode 
                        ? 'focus:border-violet-500' 
                        : 'focus:border-blue-500'
                  } focus:ring-2 ${
                    isDarkMode ? 'focus:ring-violet-500/20' : 'focus:ring-blue-500/20'
                  }`}
                  disabled={!!data?.profiles?.[0]?.username}
                  required={!data?.profiles?.[0]?.username}
                  placeholder={data?.profiles?.[0]?.username ? undefined : "Choose a username"}
                />
              </div>
              {!data?.profiles?.[0]?.username && (
                <p className={`mt-2 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Choose carefully - username cannot be changed later
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Phone Number
              </label>
              <div className="relative">
                <Phone className={`absolute left-4 top-3 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`} size={18} />
                <input
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className={`w-full pl-12 pr-4 py-2.5 rounded-xl border transition-colors ${
                    isDarkMode 
                      ? 'bg-zinc-900/50 border-zinc-700 text-gray-200 focus:border-violet-500' 
                      : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 ${
                    isDarkMode ? 'focus:ring-violet-500/20' : 'focus:ring-blue-500/20'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUpdating}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl 
                font-medium transition-colors ${
                isDarkMode
                  ? 'bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50'
                  : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400'
              } text-white`}
            >
              {isUpdating ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  <span>Updating Profile...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;