import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { signOutUser } from '../services/authService';
import { fetchUserProfile } from '../services/userService';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setProfile(null);
      return;
    }
    try {
      const data = await fetchUserProfile(firebaseUser.uid);
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          data?.displayName ||
          firebaseUser.displayName ||
          firebaseUser.email?.split('@')[0] ||
          'User',
        photoURL: data?.photoURL || firebaseUser.photoURL || null,
        createdAt: data?.createdAt || null,
        ...data,
      });
    } catch {
      setProfile({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName ||
          firebaseUser.email?.split('@')[0] ||
          'User',
        photoURL: firebaseUser.photoURL || null,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (firebaseUser) => {
      setUser(firebaseUser);
      await loadProfile(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (user) await loadProfile(user);
  };

  const logout = async () => {
    const { error } = await signOutUser();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  const value = useMemo(
    () => ({ user, profile, loading, refreshProfile, logout }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}