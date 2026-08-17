// src/services/chatService.js
// One support thread per user, at chats/{uid}/messages. The user's own
// messages use senderId = uid; support/admin replies use senderId = 'admin'
// (sent from the Firebase Console, an admin dashboard, or a Cloud Function —
// not from this app).

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

/**
 * Writes a canned support reply into the same thread. senderId is always
 * literally 'admin' — that's what ChatScreen checks to render it on the
 * left, distinct from the user's own messages.
 */
export const sendAutoReply = async (uid, text) => {
  const db = getFirestore();
  await addDoc(threadRef(db, uid), {
    text,
    senderId: 'admin',
    createdAt: serverTimestamp(),
  });
};

/**
 * Edits the text of a message the user already sent. Marks it `edited: true`
 * so the UI can show an "(edited)" label.
 */
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

/**
 * Real-time listener for one user's support thread, oldest first.
 * Call the returned function to unsubscribe.
 */
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