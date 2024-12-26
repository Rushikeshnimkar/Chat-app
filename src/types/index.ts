export interface User {
  id: string;
  email: string;
  lastActive?: Date;
}

export interface Profile {
  id?: string;
  username: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  lastUpdated?: number;
}
export interface UserCreateDTO {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface ChatState {
  user: User | null;
  contacts: Contact[];
  selectedContact: Contact | null;
  messages: Record<string, Message[]>;
  isOnline: boolean;
}


export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastSeen?: Date;
  status: 'active' | 'offline';
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  chatId: string;
}
export interface UpdateMessage {
  type: 'success' | 'error' | '';
  message: string;
}

export type ContactStatus = 'online' | 'offline' | 'typing';

export type MessageType = 'text' | 'image' | 'file';

export enum ChatEvents {
  MESSAGE_SENT = 'MESSAGE_SENT',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  CONTACT_ONLINE = 'CONTACT_ONLINE',
  CONTACT_OFFLINE = 'CONTACT_OFFLINE'
}

export type ChatAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'SELECT_CONTACT'; payload: Contact }
  | { type: 'SET_MESSAGES'; payload: { contactId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: { contactId: string; message: Message } }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean };

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: number;
  };
  createdAt: number;
}