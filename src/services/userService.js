import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

export const ensureUserProfile = async (user, extra = {}) => {
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  // RN Firebase: exists can be a property or a method depending on version
  const exists =
    typeof snapshot.exists === 'function' ? snapshot.exists() : snapshot.exists;

  if (exists) {
    return { isNewUser: false };
  }

  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || extra.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    ...extra,
  });

  return { isNewUser: true };
};