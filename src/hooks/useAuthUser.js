import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

export default function useAuthUser() {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  return { user, initializing };
}