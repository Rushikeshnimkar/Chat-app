import React from 'react';
import { PlusCircle, Search, User, Circle } from 'lucide-react';
import { Contact, Profile } from '../../types';
import { useNavigate } from 'react-router-dom';
import { init } from '@instantdb/react';


const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

interface ContactListProps {
  profile: Profile | null;
  searchQuery: string;
  selectedContact: Contact | null;
  onSearchChange: (query: string) => void;
  onContactSelect: (contact: Contact) => void;
  onAddContact: () => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  profile,
  searchQuery,
  selectedContact,
  onSearchChange,
  onContactSelect,
  onAddContact,
}) => {
  const navigate = useNavigate();
  const { user } = db.useAuth();

  // Query contacts and messages for the current user
  const { data, isLoading, error } = db.useQuery({
    contacts: user ? {
      $: {
        where: {
          userId: user.email
        }
      }
    } : {},
    messages: user ? {
      $: {
        where: {
          or: [
            { senderId: user.email },
            { receiverId: user.email }
          ]
        }
      }
    } : {}
  });

  const formatTimestamp = (date: number | undefined): string => {
    if (!date) return '';
    
    const now = new Date();
    const timestamp = new Date(date);
    
    if (timestamp.toDateString() === now.toDateString()) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (timestamp > weekAgo) {
      return timestamp.toLocaleDateString([], { weekday: 'short' });
    }
    
    return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getLastMessage = (contactEmail: string) => {
    if (!data?.messages || !user?.email) return null;
    
    const contactMessages = data.messages.filter(msg => 
      (msg.senderId === contactEmail && msg.receiverId === user.email) ||
      (msg.senderId === user.email && msg.receiverId === contactEmail)
    );

    return contactMessages.length > 0 ? contactMessages[0] : null;
  };

  const filteredContacts = React.useMemo(() => {
    if (!data?.contacts) return [];
    
    return data.contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.contacts, searchQuery]);

  if (error) {
    console.error('Contact loading error:', error);
  }

  return (
    <div className="w-full md:w-1/3 border-r border-gray-300 bg-white flex flex-col">
      {/* Header Section - Always show this */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Chats</h1>
            {profile && (
              <span className="text-sm text-gray-500">
                Welcome, {profile.username}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/profile')}
              className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Profile"
            >
              <User size={22} />
            </button>
            <button 
              onClick={onAddContact}
              className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              aria-label="Add Contact"
            >
              <PlusCircle size={22} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          />
          <Search className="absolute left-2 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Loading contacts...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-red-500">Failed to load contacts</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-blue-500 hover:text-blue-600"
            >
              Retry
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
            <p className="mb-2">
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={onAddContact}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
              >
                <PlusCircle size={20} />
                Add your first contact
              </button>
            )}
          </div>
        ) : (
          filteredContacts.map(contact => {
            const lastMessage = getLastMessage(contact.email);
            return (
              <div
                key={contact.id}
                onClick={() => onContactSelect(contact as Contact)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  {/* Avatar */}
                  <div className="relative">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-500 font-semibold text-lg">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    {/* Online Status Indicator */}
                    <Circle
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                        contact.status === 'active' ? 'text-green-500 fill-green-500' : 'text-gray-400 fill-gray-400'
                      }`}
                      size={12}
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 ml-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{contact.name}</h3>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(lastMessage?.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {lastMessage?.content || 'No messages yet'}
                      </p>
                      {contact.unreadCount ? (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {contact.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
