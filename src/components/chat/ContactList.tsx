import React from 'react';
import { PlusCircle, Search, User, Circle, Moon, Sun } from 'lucide-react';
import { Contact, Profile } from '../../types';
import { useNavigate } from 'react-router-dom';
import { init } from '@instantdb/react';
import { useDarkMode } from '../../context/DarkModeContext';

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

interface ContactListProps {
  profile: Profile | null;
  searchQuery: string;
  selectedContact: Contact | null;
  onSearchChange: (query: string) => void;
  onContactSelect: (contact: Contact) => void;
  onAddContact: () => void;
  isMobileView: boolean;
}

export const ContactList: React.FC<ContactListProps> = ({
  profile,
  searchQuery,
  selectedContact,
  onSearchChange,
  onContactSelect,
  onAddContact,
  isMobileView,
}) => {
  const navigate = useNavigate();
  const { user } = db.useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

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
    <div className={`${
      isMobileView ? 'w-full' : 'w-full md:w-1/3'
    } border-r ${
      isDarkMode 
        ? 'border-zinc-800 bg-zinc-900' 
        : 'border-gray-200 bg-white'
    } flex flex-col h-screen`}>
      {/* Header Section */}
      <div className={`p-6 border-b ${
        isDarkMode 
          ? 'border-zinc-800 bg-zinc-900/80' 
          : 'border-gray-100 bg-white/80'
        } backdrop-blur-sm sticky top-0 z-10`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Chats</h1>
            {profile && (
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              } mt-1 block`}>
                Welcome back, {profile.username}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-all ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-zinc-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              onClick={() => navigate('/profile')}
              className={`p-2.5 rounded-xl transition-all ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-zinc-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Profile"
            >
              <User size={20} />
            </button>
            <button 
              onClick={onAddContact}
              className={`p-2.5 rounded-xl transition-all ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-zinc-800' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Add Contact"
            >
              <PlusCircle size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full py-2.5 px-10 rounded-xl transition-all text-sm ${
              isDarkMode 
                ? 'bg-zinc-800 text-gray-200 placeholder:text-gray-500 focus:ring-violet-500 border-0' 
                : 'bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 border-0'
            }`}
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
              isDarkMode ? 'border-violet-500' : 'border-blue-500'
            }`}></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 p-4">
            <p className="text-red-500 font-medium">Unable to load contacts</p>
            <button 
              onClick={() => window.location.reload()}
              className={`mt-2 ${
                isDarkMode ? 'text-violet-400' : 'text-blue-500'
              } hover:text-opacity-80 text-sm font-medium`}
            >
              Try again
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] p-4">
            <div className={`rounded-full p-4 ${
              isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'
            }`}>
              <User size={32} className={
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              } />
            </div>
            <p className={`font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {searchQuery ? 'No matching contacts' : 'Your contact list is empty'}
            </p>
            {!searchQuery && (
              <button
                onClick={onAddContact}
                className={`${
                  isDarkMode ? 'text-violet-400' : 'text-blue-500'
                } hover:text-opacity-80 flex items-center gap-2 mt-2 font-medium`}
              >
                <PlusCircle size={18} />
                Add new contact
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
                className={`p-4 cursor-pointer transition-all ${
                  isDarkMode
                    ? `${selectedContact?.id === contact.id ? 'bg-zinc-800' : ''} hover:bg-zinc-800`
                    : `${selectedContact?.id === contact.id ? 'bg-blue-50/80' : ''} hover:bg-gray-50`
                }`}
              >
                <div className="flex items-center px-2">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDarkMode 
                        ? 'ring-2 ring-zinc-800' 
                        : 'ring-2 ring-white'
                    }`}>
                      <img
                        src={`https://robohash.org/${encodeURIComponent(contact.name)}?set=set3`}
                        alt={contact.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <Circle
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                        isDarkMode ? 'ring-zinc-900' : 'ring-white'
                      } ring-2 ${
                        contact.status === 'active' 
                          ? 'text-green-500 fill-green-500' 
                          : 'text-gray-300 fill-gray-300'
                      }`}
                      size={12}
                    />
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-900'
                      }`}>{contact.name}</h3>
                      <span className={`text-xs font-medium ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {formatTimestamp(lastMessage?.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-sm truncate max-w-[200px] ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {lastMessage?.content || 'Start a conversation'}
                      </p>
                      {contact.unreadCount ? (
                        <span className={`text-white text-xs font-medium rounded-full px-2 py-1 min-w-[20px] text-center ${
                          isDarkMode ? 'bg-violet-500' : 'bg-blue-500'
                        }`}>
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
