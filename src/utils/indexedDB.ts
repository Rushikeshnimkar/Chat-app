import { openDB } from 'idb';

const DB_NAME = 'chatApp';
const STORE_NAME = 'sessionData';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
};

export const setSessionData = async (key: string, value: any) => {
  const db = await initDB();
  return db.put(STORE_NAME, value, key);
};

export const getSessionData = async (key: string) => {
  const db = await initDB();
  return db.get(STORE_NAME, key);
};

export const deleteSessionData = async (key: string) => {
  const db = await initDB();
  return db.delete(STORE_NAME, key);
}; 