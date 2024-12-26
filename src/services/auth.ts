import { init } from '@instantdb/react';

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;
export const db = init({ appId: APP_ID });

export const sendMagicCode = async (email: string) => {
  return db.auth.sendMagicCode({ email });
};

export const verifyMagicCode = async (email: string, code: string) => {
  return db.auth.signInWithMagicCode({ email, code });
};