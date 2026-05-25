import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove } from 'firebase/database';

const app = initializeApp({
  apiKey: "AIzaSyB6ZeSz4x5vAuZPgLnHQUqEwYt_k7zUpmk",
  authDomain: "fanghumts-testing2.firebaseapp.com",
  databaseURL: "https://fanghumts-testing2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fanghumts-testing2",
  storageBucket: "fanghumts-testing2.firebasestorage.app",
  messagingSenderId: "376104891391",
  appId: "1:376104891391:web:793f5d65ad29aca4db2dca"
});

const db = getDatabase(app);

export const dbGet = async (path) => {
  try {
    const snap = await get(ref(db, path));
    return snap.exists() ? snap.val() : null;
  } catch { return null; }
};

export const dbSet = async (path, value) => {
  try {
    await set(ref(db, path), value);
    return true;
  } catch (e) {
    console.error('dbSet error:', e);
    return false;
  }
};

export const dbDel = async (path) => {
  try {
    await remove(ref(db, path));
    return true;
  } catch { return false; }
};

