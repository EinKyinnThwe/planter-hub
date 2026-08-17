import {
    getFirestore,
    doc,
    onSnapshot,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from '@react-native-firebase/firestore';

const existsSnap = (snapshot) =>
    typeof snapshot.exists === 'function' ? snapshot.exists() : snapshot.exists;

export const subscribeToFavorites = (uid, onData, onError) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', uid);

    return onSnapshot(
        userRef,
        (snapshot) => {
            const favoriteIds = existsSnap(snapshot) ? snapshot.data().favoriteIds || [] : [];
            onData(favoriteIds);
        },
        (error) => onError && onError(error)
    );
};

export const addFavorite = async (uid, plantId) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'users', uid), { favoriteIds: arrayUnion(plantId) });
};

export const removeFavorite = async (uid, plantId) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'users', uid), { favoriteIds: arrayRemove(plantId) });
};