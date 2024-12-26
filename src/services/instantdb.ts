import { Contact, Message } from '../types';

const INSTANTDB_URL = import.meta.env.VITE_INSTANTDB_URL; // Using Vite env variable

interface APIResponse<T> {
  data: T;
  status: number;
  message: string;
}

export const fetchContacts = async (): Promise<Contact[]> => {
  const response = await fetch(`${INSTANTDB_URL}/users`);
  if (!response.ok) throw new Error('Failed to fetch contacts');
  const data: APIResponse<Contact[]> = await response.json();
  return data.data;
};

export const sendMessage = async (message: Message): Promise<Message> => {
  const response = await fetch(`${INSTANTDB_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  if (!response.ok) throw new Error('Failed to send message');
  const data: APIResponse<Message> = await response.json();
  return data.data;
};