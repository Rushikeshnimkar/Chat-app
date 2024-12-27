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

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: {
    content: string;
    timestamp: number;
  };
  createdAt: number;
}