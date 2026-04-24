import { db } from './firebase';
import { ref, get, set, remove, child } from 'firebase/database';

// 所有資料存在 /fhmt-feedback/ 路徑下
const ROOT = 'fhmt-feedback';

export async function dbGet(key) {
  try {
    const snap = await get(child(ref(db), `${ROOT}/${key}`));
    return snap.exists() ? snap.val() : null;
  } catch (e) {
    console.error('dbGet error:', e);
    return null;
  }
}

export async function dbSet(key, value) {
  try {
    await set(ref(db, `${ROOT}/${key}`), value);
    return true;
  } catch (e) {
    console.error('dbSet error:', e);
    return false;
  }
}

export async function dbDelete(key) {
  try {
    await remove(ref(db, `${ROOT}/${key}`));
    return true;
  } catch (e) {
    console.error('dbDelete error:', e);
    return false;
  }
}

export async function dbList(prefix) {
  try {
    const snap = await get(child(ref(db), ROOT));
    if (!snap.exists()) return [];
    const all = snap.val();
    if (!prefix) return Object.keys(all);
    return Object.keys(all).filter(k => k.startsWith(prefix));
  } catch (e) {
    console.error('dbList error:', e);
    return [];
  }
}

// ── 業務層 API（給 App 和 Admin 使用）─────────────────────

export async function loadQuestions() {
  return await dbGet('questions');
}

export async function saveQuestions(data) {
  return await dbSet('questions', data);
}

export async function loadPasscode() {
  return await dbGet('passcode');
}

export async function savePasscode(code) {
  if (!code) return await dbDelete('passcode');
  return await dbSet('passcode', code);
}

export async function saveFeedback(userId, data) {
  return await dbSet(`feedbacks/${userId}`, data);
}

export async function loadFeedback(userId) {
  return await dbGet(`feedbacks/${userId}`);
}

export async function loadAllFeedbacks() {
  const data = await dbGet('feedbacks');
  if (!data) return [];
  return Object.values(data);
}
