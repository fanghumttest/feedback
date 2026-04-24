import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

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
export const db = getDatabase(app);
