import {
    getFirestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from '@react-native-firebase/firestore';

const threadRef = (db, uid) => collection(db, 'chats', uid, 'messages');

export const sendMessage = async (uid, text) => {
    const db = getFirestore();
    await addDoc(threadRef(db, uid), {
        text,
        senderId: uid,
        createdAt: serverTimestamp(),
    });
};

export const sendAutoReply = async (uid, text) => {
    const db = getFirestore();
    await addDoc(threadRef(db, uid), {
        text,
        senderId: 'admin',
        createdAt: serverTimestamp(),
    });
};

export const editMessage = async (uid, messageId, newText) => {
    const db = getFirestore();
    await updateDoc(doc(db, 'chats', uid, 'messages', messageId), {
        text: newText,
        edited: true,
        editedAt: serverTimestamp(),
    });
};

export const deleteMessage = async (uid, messageId) => {
    const db = getFirestore();
    await deleteDoc(doc(db, 'chats', uid, 'messages', messageId));
};


export const subscribeToMessages = (uid, onData, onError) => {
    const db = getFirestore();
    const messagesQuery = query(threadRef(db, uid), orderBy('createdAt', 'asc'));

    return onSnapshot(
        messagesQuery,
        (snapshot) => {
            const messages = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            onData(messages);
        },
        (error) => onError && onError(error)
    );
};