import React, { useReducer, useRef, useEffect } from 'react';
import { Send,  ArrowLeft, MessageCircle, Languages } from 'lucide-react';
import { Contact } from '../../types';
import { id, init } from '@instantdb/react';
import toast from 'react-hot-toast';
import { translationService } from '../../services/translationService';
import { LanguageSelector } from '../common/LanguageSelector';
import { useDarkMode } from '../../context/DarkModeContext';


const db = init({ appId: import.meta.env.VITE_INSTANT_APP_ID });

interface ChatWindowProps {
  selectedContact: Contact | null;
  currentUserEmail: string;
  onBack: () => void;
  isMobileView: boolean;
}

// Define Action Types
type ChatAction =
  | { type: 'SET_MESSAGE'; payload: string }
  | { type: 'SET_TARGET_LANGUAGE'; payload: string }
  | { type: 'SET_TRANSLATED_MESSAGES'; payload: { [key: string]: string } }
  | { type: 'ADD_TRANSLATED_MESSAGE'; payload: { messageId: string; translation: string } }
  | { type: 'TOGGLE_EMOJI_PICKER' }
  | { type: 'SET_IS_TRANSLATING'; payload: boolean };

// Define State Type
interface ChatState {
  message: string;
  targetLanguage: string;
  translatedMessages: { [key: string]: string };
  showEmojiPicker: boolean;
  isTranslating: boolean;
}

// Initial State
const initialState: ChatState = {
  message: '',
  targetLanguage: 'es',
  translatedMessages: {},
  showEmojiPicker: false,
  isTranslating: false,
};

// Reducer Function
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'SET_TARGET_LANGUAGE':
      return { ...state, targetLanguage: action.payload, translatedMessages: {} };
    case 'SET_TRANSLATED_MESSAGES':
      return { ...state, translatedMessages: action.payload };
    case 'ADD_TRANSLATED_MESSAGE':
      return {
        ...state,
        translatedMessages: {
          ...state.translatedMessages,
          [action.payload.messageId]: action.payload.translation,
        },
      };
    case 'TOGGLE_EMOJI_PICKER':
      return { ...state, showEmojiPicker: !state.showEmojiPicker };
    case 'SET_IS_TRANSLATING':
      return { ...state, isTranslating: action.payload };
    default:
      return state;
  }
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedContact,
  currentUserEmail,
  onBack,
  isMobileView
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isDarkMode } = useDarkMode();

  // Modified query to use createdAt field instead of timestamp
  const { data, error } = db.useQuery({
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
    if (!selectedContact || !state.message.trim()) return;

    try {
      const messageId = id();
      const createdAt = Date.now();

      await db.transact([
        db.tx.messages[messageId].update({
          content: state.message.trim(),
          senderId: currentUserEmail,
          receiverId: selectedContact.email,
          createdAt,
        }),
      ]);

      dispatch({ type: 'SET_MESSAGE', payload: '' });
      if (state.showEmojiPicker) {
        dispatch({ type: 'TOGGLE_EMOJI_PICKER' });
      }
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTranslateMessage = async (messageId: string, content: string) => {
    try {
      dispatch({ type: 'SET_IS_TRANSLATING', payload: true });

      if (!translationService.isInitialized()) {
        await translationService.init('en', state.targetLanguage);
      }

      const translatedText = await translationService.translate(content);
      dispatch({
        type: 'ADD_TRANSLATED_MESSAGE',
        payload: { messageId, translation: translatedText },
      });
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Failed to translate message');
    } finally {
      dispatch({ type: 'SET_IS_TRANSLATING', payload: false });
    }
  };

  const handleLanguageChange = async (language: string) => {
    dispatch({ type: 'SET_TARGET_LANGUAGE', payload: language });
    await translationService.init('en', language);
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
    <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
      {selectedContact ? (
        <>
          {/* Chat Header */}
          <div className={`sticky top-0 z-10 border-b backdrop-blur-sm ${
            isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isMobileView && (
                  <button
                    onClick={onBack}
                    className={`p-2 rounded-xl transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-zinc-800' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div className="flex items-center gap-3">
                  <img
                    src={`https://robohash.org/${encodeURIComponent(selectedContact.name)}?set=set3`}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className={`font-medium ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {selectedContact.name}
                    </div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      
                    </div>
                  </div>
                </div>
              </div>
              <LanguageSelector
                onLanguageChange={handleLanguageChange}
                currentLanguage={state.targetLanguage}
              />
            </div>
          </div>

          {/* Messages Section */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
            isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'
          }`}>
            {sortedMessages.length > 0 ? (
              sortedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === currentUserEmail ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`flex ${
                    msg.senderId === currentUserEmail ? 'flex-row-reverse' : 'flex-row'
                  } items-end gap-2 max-w-[85%]`}>
                    {/* Avatar */}
                    <img
                      src={`https://robohash.org/${encodeURIComponent(
                        msg.senderId === currentUserEmail 
                          ? currentUserEmail 
                          : selectedContact.name
                      )}?set=set3`}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    
                    {/* Message Content */}
                    <div className={`group relative flex flex-col ${
                      msg.senderId === currentUserEmail ? 'items-end' : 'items-start'
                    }`}>
                      <div className={`px-4 py-2 rounded-2xl ${
                        msg.senderId === currentUserEmail
                          ? isDarkMode
                            ? 'bg-violet-600 text-white'
                            : 'bg-blue-500 text-white'
                          : isDarkMode
                            ? 'bg-zinc-800 text-gray-200'
                            : 'bg-white text-gray-900'
                      }`}>
                        <p className="whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      </div>

                      {/* Message Actions */}
                      <div className={`flex items-center gap-1 mt-1 ${
                        msg.senderId === currentUserEmail ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        <span className={`text-xs ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        <button
                          onClick={() => handleTranslateMessage(msg.id, msg.content)}
                          className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                            msg.senderId === currentUserEmail
                              ? isDarkMode 
                                ? 'hover:bg-violet-700 text-violet-200' 
                                : 'hover:bg-blue-600 text-blue-100'
                              : isDarkMode
                                ? 'hover:bg-zinc-700 text-gray-400'
                                : 'hover:bg-gray-100 text-gray-500'
                          }`}
                        >
                          <Languages size={14} />
                        </button>
                      </div>

                      {/* Translated Message */}
                      {state.translatedMessages[msg.id] && (
                        <div className={`mt-2 px-3 py-2 rounded-xl text-sm ${
                          isDarkMode 
                            ? 'bg-zinc-800/50 text-gray-300' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <p>{state.translatedMessages[msg.id]}</p>
                          <span className={`text-xs ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            Translated to {state.targetLanguage.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`flex-1 flex flex-col items-center justify-center gap-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className={`p-4 rounded-full ${
                  isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
                }`}>
                  <Send size={24} />
                </div>
                <p>Send your first message to {selectedContact.name}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className={`p-4 border-t ${
            isDarkMode ? 'border-zinc-800' : 'border-gray-200'
          }`}>
            <form onSubmit={handleSendMessage} className="flex gap-2 items-center relative">
            
              <textarea
                ref={textareaRef}
                value={state.message}
                onChange={(e) => dispatch({ type: 'SET_MESSAGE', payload: e.target.value })}
                placeholder="Type a message..."
                rows={1}
                className={`flex-1 p-3 rounded-xl resize-none transition-all ${
                  isDarkMode 
                    ? 'bg-zinc-800 text-gray-200 placeholder-gray-500 border-zinc-700' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200'
                } border focus:outline-none focus:ring-2 ${
                  isDarkMode ? 'focus:ring-violet-500' : 'focus:ring-blue-500'
                }`}
                maxLength={500}
              />
              
              <button 
                type="submit"
                disabled={!state.message.trim()}
                className={`p-3 rounded-xl transition-colors ${
                  isDarkMode
                    ? 'bg-violet-600 hover:bg-violet-700 disabled:bg-violet-500/50'
                    : 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'
                } text-white flex items-center justify-center`}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className={`flex-1 flex flex-col items-center justify-center gap-4 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className={`p-6 rounded-full ${
            isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'
          }`}>
            <MessageCircle size={32} />
          </div>
          <p className="text-lg font-medium">Select a contact to start chatting</p>
        </div>
      )}
    </div>
  );
};