// Chat Component
import  { useEffect, useState } from 'react';
import {  init } from '@instantdb/react';
import { useNavigate } from 'react-router-dom';
import { ContactList } from '../components/chat/ContactList';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Contact, Profile } from '../types';
import { AddContactModal } from '../components/chat/AddContactModal';
import toast from 'react-hot-toast';

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

const Chat = () => {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);

  const { user } = db.useAuth();

  // Fetch user profile
  const { data: profileData, error: profileError } = db.useQuery({
    profiles: user?.email ? {
      $: {
        where: { email: user.email }
      }
    } : {}
  });

  // Update profile when data changes
  useEffect(() => {
    if (profileData?.profiles?.[0]) {
      const userProfile = profileData.profiles[0];
      setProfile({
        id: userProfile.id,
        username: userProfile.username || userProfile.email.split('@')[0],
        email: userProfile.email,
        lastUpdated: userProfile.lastUpdated || Date.now(),
        phoneNumber: userProfile.phoneNumber || '',
        imageUrl: userProfile.imageUrl || ''
      });
    }
  }, [profileData]);

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

  // Handle new contact addition
  const handleContactAdded = (newContact: Contact) => {
    setSelectedContact(newContact);
    setIsAddingContact(false);
    toast.success(`Added ${newContact.name} to contacts`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <ContactList 
        profile={profile}
        searchQuery={searchQuery}
        selectedContact={selectedContact}
        onSearchChange={setSearchQuery}
        onContactSelect={setSelectedContact}
        onAddContact={() => setIsAddingContact(true)}
      />

      <ChatWindow
        selectedContact={selectedContact}
        currentUserEmail={user.email}
      />

      {isAddingContact && (
        <AddContactModal 
          onClose={() => setIsAddingContact(false)}
          onContactAdded={handleContactAdded}
        />
      )}
    </div>
  );
};

export default Chat;