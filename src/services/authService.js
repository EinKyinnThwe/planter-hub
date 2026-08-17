import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithCredential,
    signOut,
    updateProfile,
    GoogleAuthProvider,
} from '@react-native-firebase/auth';
import {
    GoogleSignin,
    isSuccessResponse,
} from '@react-native-google-signin/google-signin';

const friendlyAuthError = (error) => {
    switch (error?.code) {
        case 'auth/email-already-in-use':
            return 'That email is already registered. Try signing in instead.';
        case 'auth/invalid-email':
            return 'Enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Incorrect email or password.';
        case 'auth/network-request-failed':
            return 'Network error — check your connection and try again.';
        default:
            return error?.message || 'Something went wrong. Please try again.';
    }
};

export const signUpWithEmail = async (email, password) => {
    try {
        const cred = await createUserWithEmailAndPassword(getAuth(), email, password);
        return { user: cred.user, error: null };
    } catch (error) {
        return { user: null, error: friendlyAuthError(error) };
    }
};

export const signInWithEmail = async (email, password) => {
    try {
        const cred = await signInWithEmailAndPassword(getAuth(), email, password);
        return { user: cred.user, error: null };
    } catch (error) {
        return { user: null, error: friendlyAuthError(error) };
    }
};

export const signInWithGoogle = async () => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const response = await GoogleSignin.signIn();
        if (!isSuccessResponse(response)) {
            return { user: null, error: null };
        }
        const { idToken } = response.data;
        const googleCredential = GoogleAuthProvider.credential(idToken);
        const cred = await signInWithCredential(getAuth(), googleCredential);
        return { user: cred.user, error: null };
    } catch (error) {
        return { user: null, error: friendlyAuthError(error) };
    }
};

export const updateDisplayName = async (name) => {
    try {
        const auth = getAuth();
        await updateProfile(auth.currentUser, { displayName: name });
        return { error: null };
    } catch (error) {
        return { error: friendlyAuthError(error) };
    }
};

export const signOutUser = async () => {
    try {
        await GoogleSignin.signOut().catch(() => { });
        await signOut(getAuth());
        return { error: null };
    } catch (error) {
        return { error: friendlyAuthError(error) };
    }
};