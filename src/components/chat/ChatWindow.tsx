import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Contact } from '../../types';
import { id, init } from '@instantdb/react';
import toast from 'react-hot-toast';

const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

interface ChatWindowProps {
  selectedContact: Contact | null;
  currentUserEmail: string;
}


export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedContact,
  currentUserEmail
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Modified query to use createdAt field instead of timestamp
  const { data, isLoading, error } = db.useQuery({
    messages: selectedContact ? {
      $: {
        where: {
          or: [
            { senderId: currentUserEmail, receiverId: selectedContact.email },
            { senderId: selectedContact.email, receiverId: currentUserEmail }
          ]
        }
      }
    } : {}
  });

  // Sort messages client-side instead of in the query
  const sortedMessages = React.useMemo(() => {
    if (!data?.messages) return [];
    return [...data.messages].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }, [data?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sortedMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;

    const form = e.currentTarget as HTMLFormElement;
    const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement;
    const content = messageInput?.value.trim();

    if (!content) return;

    const messageId = id();
    const createdAt = Date.now();

    try {
      // Updated to use createdAt instead of timestamp
      await db.transact([
        db.tx.messages[messageId].update({
          content,
          senderId: currentUserEmail,
          receiverId: selectedContact.email,
          createdAt
        })
      ]);

      form.reset();
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  if (error) {
    console.error('Message loading error:', error);
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-red-500">
        <p>Failed to load messages</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-blue-500 hover:text-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen max-h-screen">
      {selectedContact ? (
        <>
          <div className="p-4 bg-white border-b flex items-center">
            <h2 className="font-semibold text-lg flex-1">{selectedContact.name}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <p className="text-center text-gray-500">Loading messages...</p>
            ) : sortedMessages.length ? (
              sortedMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUserEmail ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[100%] sm:max-w-[70%] md:max-w-[80%] break-words whitespace-pre-wrap rounded-lg p-3
                      ${msg.senderId === currentUserEmail 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-200 rounded-bl-none'
                      }
                    `}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className={`text-xs mt-1 ${msg.senderId === currentUserEmail ? 'text-blue-100' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No messages yet</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex gap-2 flex-col sm:flex-row">
              <textarea
                name="message"
                placeholder="Type a message"
                className="flex-1 p-2 border rounded-lg resize-none min-h-[50px]"
                maxLength={500}
              />
              <button 
                type="submit"
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
};