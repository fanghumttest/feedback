import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove } from 'firebase/database';

const app = initializeApp({
  apiKey: "AIzaSyDYB580igT9-A5Dc8HF2IO-d4HsyRgTaH0",
  authDomain: "fanghumts-testing.firebaseapp.com",
  databaseURL: "https://fanghumts-testing-default-rtdb.firebaseio.com",
  projectId: "fanghumts-testing",
  storageBucket: "fanghumts-testing.firebasestorage.app",
  messagingSenderId: "939309476083",
  appId: "1:939309476083:web:80f3b0c1c84fdc8f492f86"
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
