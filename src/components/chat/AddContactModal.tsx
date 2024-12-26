import React, { useState } from 'react';
import { X } from 'lucide-react';
import { id, init } from '@instantdb/react';
import { Contact } from '../../types';
import toast from 'react-hot-toast';

interface AddContactModalProps {
  onClose: () => void;
  onContactAdded: (contact: Contact) => void;
}

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

export const AddContactModal: React.FC<AddContactModalProps> = ({ onClose, onContactAdded }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = db.useAuth();

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
      // Check if contact already exists in the user's contact list
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

      // Create contact with minimal required fields
      await db.transact([
        db.tx.contacts[newContactId].update({
          email: lowerEmail,
          userId: user.email,
          name: contactProfile.username || lowerEmail,
          timestamp: timestamp
        })
      ]);

      // Create new contact object for the UI
      const newContact: Contact = {
        id: newContactId,
        name: contactProfile.username || lowerEmail,
        email: lowerEmail,
        status: 'active',
        lastSeen: new Date(timestamp)
      };

      toast.success('Contact added successfully!');
      onContactAdded(newContact);
      onClose();

    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  // Real-time contact validation as user types
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add New Contact</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleAddContact} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter contact's email"
                className={`w-full p-2 border rounded-lg focus:ring-2 transition-shadow ${
                  emailError 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'focus:ring-blue-500 focus:border-blue-500'
                }`}
                disabled={loading}
                required
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-500">{emailError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !email.trim() || !!emailError}
              className={`w-full py-2 px-4 rounded-lg text-white transition-colors
                ${loading || !email.trim() || !!emailError
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {loading ? 'Adding Contact...' : 'Add Contact'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};