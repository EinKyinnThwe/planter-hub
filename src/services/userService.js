import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const existsSnap = (snapshot) =>
  typeof snapshot.exists === 'function' ? snapshot.exists() : snapshot.exists;

export const ensureUserProfile = async (user, extra = {}) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (existsSnap(snapshot)) {
    return { isNewUser: false };
  }

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || extra.displayName || null,
    photoURL: user.photoURL || null,
    favoriteIds: [],
    createdAt: serverTimestamp(),
    ...extra,
  });

  return { isNewUser: true };
};

export const fetchUserProfile = async (uid) => {
  const db = getFirestore();
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!existsSnap(snapshot)) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

export const updateUserProfile = async (uid, updates) => {
  const db = getFirestore();
  await updateDoc(doc(db, 'users', uid), updates);
};