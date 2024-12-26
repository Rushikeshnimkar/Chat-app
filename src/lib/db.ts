import { init } from '@instantdb/react';


export const db = init({
  appId: import.meta.env.VITE_INSTANTDB_URL || '',

}); 