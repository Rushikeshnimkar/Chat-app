// Chat Component
import { useEffect, useState } from 'react';
import { init } from '@instantdb/react';
import { useNavigate } from 'react-router-dom';
import { ContactList } from '../components/chat/ContactList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Contact, Profile } from '../types';
import { AddContactModal } from '../components/chat/AddContactModal';
import toast from 'react-hot-toast';
import { useDarkMode } from '../context/DarkModeContext';

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

const Chat = () => {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const { isDarkMode } = useDarkMode();

  const { user } = db.useAuth();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user profile
  const { data: profileData, error: profileError } = db.useQuery({
    profiles: user?.email ? {
      $: {
        where: { email: user.email }
      }
    } : {}
  });

  // Check for profile and redirect if needed
  useEffect(() => {
    if (user && profileData?.profiles) {
      const userProfile = profileData.profiles[0];
      
      // If profile exists but username is not set, redirect to profile page
      if (!userProfile?.username) {
        toast.error('Please complete your profile first');
        navigate('/profile');
        return;
      }

      // Set profile if username exists
      if (userProfile) {
        setProfile({
          id: userProfile.id,
          username: userProfile.username,
          email: userProfile.email,
          lastUpdated: userProfile.lastUpdated || Date.now(),
          phoneNumber: userProfile.phoneNumber || '',
          imageUrl: userProfile.imageUrl || ''
        });
      }
    }
  }, [user, profileData, navigate]);

  // Handle unauthorized access
  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }
  }, [user, navigate]);

  // Handle profile error
  useEffect(() => {
    if (profileError) {
      console.error('Error loading profile:', profileError);
      toast.error('Failed to load profile');
    }
  }, [profileError]);

  // Modified contact selection handler for mobile
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // Handle back to contact list (mobile only)
  const handleBackToContacts = () => {
    setSelectedContact(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-100'}`}>
      {/* Mobile View */}
      {isMobileView ? (
        <div className="h-full">
          {selectedContact ? (
            <ChatWindow
              selectedContact={selectedContact}
              currentUserEmail={user.email}
              onBack={handleBackToContacts}
              isMobileView={true}
            />
          ) : (
            <ContactList
              profile={profile}
              searchQuery={searchQuery}
              selectedContact={selectedContact}
              onSearchChange={setSearchQuery}
              onContactSelect={handleContactSelect}
              onAddContact={() => setIsAddingContact(true)}
              isMobileView={true}
            />
          )}
        </div>
      ) : (
        /* Desktop View */
        <div className="flex h-full">
          <ContactList
            profile={profile}
            searchQuery={searchQuery}
            selectedContact={selectedContact}
            onSearchChange={setSearchQuery}
            onContactSelect={handleContactSelect}
            onAddContact={() => setIsAddingContact(true)}
            isMobileView={false}
          />
          <ChatWindow
            selectedContact={selectedContact}
            currentUserEmail={user.email}
            onBack={handleBackToContacts}
            isMobileView={false}
          />
        </div>
      )}

      {isAddingContact && (
        <AddContactModal
          onClose={() => setIsAddingContact(false)}
          onContactAdded={(contact) => {
            setSelectedContact(contact);
            setIsAddingContact(false);
            toast.success(`Added ${contact.name} to contacts`);
          }}
        />
      )}
    </div>
  );
};

export default Chat;