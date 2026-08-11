// Single source of truth for notification history + unread count.
// Wraps FCM setup so it only ever runs once, tied to the current user.

import React, { createContext, useEffect, useState, useCallback } from 'react';
import useAuthUser from '../hooks/useAuthUser';
import {
  getStoredNotifications,
  saveNotificationLocally,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from '../services/notificationStorageService';
import {
  setupNotificationChannel,
  requestNotificationPermission,
  getFcmDeviceToken,
  saveTokenToProfile,
  subscribeToTokenRefresh,
  subscribeToForegroundMessages,
  displayForegroundNotification,
  subscribeToNotifeeEvents,
  setAppBadgeCount,
} from '../services/pushNotificationService';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuthUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    setAppBadgeCount(unreadCount).catch(() => {});
  }, [unreadCount]);

  useEffect(() => {
    (async () => {
      const stored = await getStoredNotifications();
      setNotifications(stored);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!user) return;

    let unsubscribeForeground;
    let unsubscribeTokenRefresh;
    let unsubscribeNotifeePress;

    (async () => {
      await setupNotificationChannel();

      const granted = await requestNotificationPermission();
      setPermissionGranted(granted);
      if (!granted) return;

      const token = await getFcmDeviceToken();
      await saveTokenToProfile(user.uid, token);

      unsubscribeTokenRefresh = subscribeToTokenRefresh((newToken) => {
        saveTokenToProfile(user.uid, newToken);
      });

      unsubscribeForeground = subscribeToForegroundMessages(async (remoteMessage) => {
        await displayForegroundNotification(remoteMessage);
        const updated = await saveNotificationLocally(remoteMessage);
        setNotifications(updated);
      });

      unsubscribeNotifeePress = subscribeToNotifeeEvents(() => {
        // Hook navigation up here if you want tapping to jump to a screen —
        // see the note in NotificationsScreen.js.
      });
    })();

    return () => {
      unsubscribeForeground && unsubscribeForeground();
      unsubscribeTokenRefresh && unsubscribeTokenRefresh();
      unsubscribeNotifeePress && unsubscribeNotifeePress();
    };
  }, [user]);

  const markAsRead = useCallback(async (id) => {
    const updated = await markNotificationRead(id);
    setNotifications(updated);
  }, []);

  const markAllAsRead = useCallback(async () => {
    const updated = await markAllNotificationsRead();
    setNotifications(updated);
  }, []);

  const removeNotification = useCallback(async (id) => {
    const updated = await deleteNotification(id);
    setNotifications(updated);
  }, []);

  const clearAll = useCallback(async () => {
    const updated = await clearAllNotifications();
    setNotifications(updated);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        unreadCount,
        permissionGranted,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};