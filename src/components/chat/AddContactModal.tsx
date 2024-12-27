import React, { useState } from 'react';
import { X, Mail, Loader, UserPlus } from 'lucide-react';
import { id, init } from '@instantdb/react';
import { Contact } from '../../types';
import toast from 'react-hot-toast';
import { useDarkMode } from '../../context/DarkModeContext';

interface AddContactModalProps {
  onClose: () => void;
  onContactAdded: (contact: Contact) => void;
}

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

export const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onContactAdded }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = db.useAuth();
  const { isDarkMode } = useDarkMode();

  // Query existing contacts for the current user
  const { data: contactsData } = db.useQuery({
    contacts: {
      $: {
        where: {
          userId: user?.email || ''
        }
      }
    }
  });

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !user?.email) return;

    setLoading(true);
    const lowerEmail = email.toLowerCase();
    
    try {
      // Check if contact already exists
      const existingContact = contactsData?.contacts?.find(
        contact => contact.email.toLowerCase() === lowerEmail
      );

      if (existingContact) {
        throw new Error('This contact is already in your list');
      }

      // Check if email exists in profiles
      const { data: profileData } = await db.queryOnce({
        profiles: {
          $: {
            where: {
              email: lowerEmail
            }
          }
        }
      });

      if (!profileData?.profiles?.[0]) {
        throw new Error('No user found with this email address');
      }

      if (user.email === lowerEmail) {
        throw new Error('You cannot add yourself as a contact');
      }

      const contactProfile = profileData.profiles[0];
      const newContactId = id();
      const timestamp = Date.now();

      await db.transact([
        db.tx.contacts[newContactId].update({
          email: lowerEmail,
          userId: user.email,
          name: contactProfile.username || lowerEmail,
          timestamp: timestamp
        })
      ]);

      const newContact: Contact = {
        id: newContactId,
        name: contactProfile.username || lowerEmail,
        email: lowerEmail,
        status: 'active',
        lastSeen: new Date(timestamp)
      };

      toast.success('Contact added successfully!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        },
        icon: '👋',
      });
      
      onContactAdded(newContact);
      onClose();

    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add contact', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: isDarkMode ? '#1f2937' : '#ffffff',
          color: isDarkMode ? '#e5e7eb' : '#1f2937',
          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Real-time contact validation
  const validateEmail = (email: string) => {
    if (!email.trim() || !contactsData?.contacts) return null;
    
    const lowerEmail = email.toLowerCase();
    const existingContact = contactsData.contacts.find(
      contact => contact.email.toLowerCase() === lowerEmail
    );

    if (existingContact) {
      return 'This contact is already in your list';
    }

    if (user?.email === lowerEmail) {
      return 'You cannot add yourself as a contact';
    }

    return null;
  };

  const emailError = validateEmail(email);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm z-50">
      <div className={`w-full max-w-md rounded-2xl shadow-xl ${
        isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          isDarkMode ? 'border-zinc-800' : 'border-gray-100'
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
              }`}>
                <UserPlus size={22} className={
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                } />
              </div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                Add New Contact
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-zinc-800' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAddContact} className="p-6 space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email Address
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter contact's email"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl transition-colors ${
                  emailError 
                    ? isDarkMode
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-red-300 bg-red-50'
                    : isDarkMode
                      ? 'bg-zinc-800 border-zinc-700 text-gray-200'
                      : 'bg-white border-gray-200 text-gray-900'
                } border focus:ring-2 ${
                  emailError
                    ? 'focus:ring-red-500/20'
                    : isDarkMode
                      ? 'focus:ring-violet-500/20 focus:border-violet-500'
                      : 'focus:ring-blue-500/20 focus:border-blue-500'
                }`}
                disabled={loading}
                required
              />
            </div>
            {emailError && (
              <p className={`mt-2 text-sm ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                {emailError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !!emailError}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
              font-medium transition-colors ${
              loading || !email.trim() || !!emailError
                ? isDarkMode
                  ? 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                <span>Adding Contact...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Add Contact</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};