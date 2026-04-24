import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDYB580igT9-A5Dc8HF2IO-d4HsyRgTaH0",
  authDomain: "fanghumts-testing.firebaseapp.com",
  databaseURL: "https://fanghumts-testing-default-rtdb.firebaseio.com",
  projectId: "fanghumts-testing",
  storageBucket: "fanghumts-testing.firebasestorage.app",
  messagingSenderId: "939309476083",
  appId: "1:939309476083:web:80f3b0c1c84fdc8f492f86",
  measurementId: "G-50VDP73DHF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const ROOT = 'kv';

const enc = k => k.replace(/\./g, '__dot__').replace(/#/g, '__hash__').replace(/\$/g, '__dlr__').replace(/\[/g, '__lb__').replace(/\]/g, '__rb__');
const dec = k => k.replace(/__dot__/g, '.').replace(/__hash__/g, '#').replace(/__dlr__/g, '$').replace(/__lb__/g, '[').replace(/__rb__/g, ']');

window.storage = {
  async get(key) {
    try {
      const snap = await get(ref(db, `${ROOT}/${enc(key)}`));
      return snap.exists() ? { value: snap.val() } : null;
    } catch { return null; }
  },
  async set(key, value) {
    await set(ref(db, `${ROOT}/${enc(key)}`), value);
  },
  async delete(key) {
    await remove(ref(db, `${ROOT}/${enc(key)}`));
  },
  async list(prefix) {
    try {
      const snap = await get(ref(db, ROOT));
      if (!snap.exists()) return { keys: [] };
      const keys = Object.keys(snap.val()).map(dec).filter(k => k.startsWith(prefix));
      return { keys };
    } catch { return { keys: [] }; }
  }
};
