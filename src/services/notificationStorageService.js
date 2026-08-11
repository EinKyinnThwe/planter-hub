// src/services/notificationStorageService.js
// Local notification history — survives app restarts. This is what the
// Notifications screen actually reads from; Firestore/FCM only deliver
// the push, this is the persistent record of it.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'planter-hub:notifications';
const MAX_STORED = 200; // keep the list from growing unbounded forever

const toStoredNotification = (remoteMessage) => ({
  id: remoteMessage.messageId || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: remoteMessage.notification?.title ?? remoteMessage.title ?? 'Notification',
  body: remoteMessage.notification?.body ?? remoteMessage.body ?? '',
  data: remoteMessage.data || {},
  read: false,
  receivedAt: Date.now(),
});

export const getStoredNotifications = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = async (notifications) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_STORED)));
};

export const saveNotificationLocally = async (remoteMessage) => {
  const existing = await getStoredNotifications();
  const updated = [toStoredNotification(remoteMessage), ...existing];
  await writeAll(updated);
  return updated;
};

export const markNotificationRead = async (id) => {
  const existing = await getStoredNotifications();
  const updated = existing.map((n) => (n.id === id ? { ...n, read: true } : n));
  await writeAll(updated);
  return updated;
};

export const markAllNotificationsRead = async () => {
  const existing = await getStoredNotifications();
  const updated = existing.map((n) => ({ ...n, read: true }));
  await writeAll(updated);
  return updated;
};

export const deleteNotification = async (id) => {
  const existing = await getStoredNotifications();
  const updated = existing.filter((n) => n.id !== id);
  await writeAll(updated);
  return updated;
};

export const clearAllNotifications = async () => {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return [];
};