import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    getAuth,
    onAuthStateChanged,
} from '@react-native-firebase/auth';

import { signOutUser } from '../services/authService';
import { fetchUserProfile } from '../services/userService';

import {
    initializeAnalyticsServices,
    setAnalyticsUser,
} from '../services/analyticsService';

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
            photoURL:
            data?.photoURL ||
            firebaseUser.photoURL ||
            null,
            createdAt: data?.createdAt || null,
            ...data,
        });
        } catch (error) {
            setProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName:
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'User',
                photoURL:
                firebaseUser.photoURL || null,
                createdAt: null,
            });
        }
    };

    useEffect(() => {
        let mounted = true;

        const initializeServices = async () => {
        try {
            await initializeAnalyticsServices();
        } catch (error) {
                console.warn(
                'Firebase services initialization failed:',
                error?.message || String(error)
                );
            }
        };

        initializeServices();

        const unsubscribe = onAuthStateChanged(
            getAuth(),
            async (firebaseUser) => {
                if (!mounted) {
                    return;
                }

                setUser(firebaseUser);

                if (!firebaseUser) {
                    setProfile(null);

                    if (mounted) {
                        setLoading(false);
                    }
                    return;
                }

                try {
                    await loadProfile(firebaseUser);
                } catch (error) {
                    console.warn(
                        'Profile loading failed:',
                        error?.message || String(error)
                    );
                }

                if (!mounted) {
                    return;
                }

                try {
                    await setAnalyticsUser(firebaseUser.uid);
                } catch (error) {
                    console.warn(
                        'Firebase user analytics setup failed:',
                        error?.message || String(error)
                    );
                }

                if (mounted) {
                    setLoading(false);
                }
            }
        );
        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    const refreshProfile = async () => {
        if (!user) {
            return;
        }
        await loadProfile(user);
    };

    const logout = async () => {
        try {
            const { error } = await signOutUser();
        if (error) {
            return { error };
        }
        setUser(null);
        setProfile(null);

        return { error: null };
        } catch (error) {
            return {
                error: error?.message || 'Failed to sign out!',
            };
        }
    };

    const value = useMemo(
        () => ({
            user,
            profile,
            loading,
            refreshProfile,
            logout,
        }),
        [
            user,
            profile,
            loading,
        ]
    );

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
