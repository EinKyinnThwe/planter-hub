// src/services/pushNotificationService.js
// All direct FCM + Notifee calls live here — nothing else in the app
// touches these SDKs directly.

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission as requestFcmPermission,
  AuthorizationStatus,
  getToken,
  onTokenRefresh as onFcmTokenRefresh,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { getFirestore, doc, updateDoc, arrayUnion } from '@react-native-firebase/firestore';

const messaging = getMessaging(getApp());
const ANDROID_CHANNEL_ID = 'default';

export const setupNotificationChannel = async () => {
  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: 'Planter Hub Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};

export const requestNotificationPermission = async () => {
  const settings = await notifee.requestPermission();
  const granted =
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;

  if (granted) {
    await requestFcmPermission(messaging);
  }

  return granted;
};

export const getFcmDeviceToken = async () => {
  try {
    console.log("FCM Token:", token);
    return await getToken(messaging);
  } catch {
    return null;
  }
};

export const saveTokenToProfile = async (uid, token) => {
  if (!uid || !token) return;
  const db = getFirestore();
  await updateDoc(doc(db, 'users', uid), {
    fcmTokens: arrayUnion(token),
  });
};

export const subscribeToTokenRefresh = (onNewToken) => {
  return onFcmTokenRefresh(messaging, onNewToken);
};

export const displayForegroundNotification = async (remoteMessage) => {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? 'Planter Hub',
    body: remoteMessage.notification?.body ?? '',
    data: remoteMessage.data,
    android: {
      channelId: ANDROID_CHANNEL_ID,
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' },
      smallIcon: 'ic_launcher',
    },
    ios: {
      sound: 'default',
    },
  });
};

export const subscribeToForegroundMessages = (onMessageReceived) => {
  return onMessage(messaging, onMessageReceived);
};

export const subscribeToNotificationOpenedApp = (onOpened) => {
  return onNotificationOpenedApp(messaging, onOpened);
};

export const getInitialPushNotification = () => getInitialNotification(messaging);

export const subscribeToNotifeeEvents = (onPress) => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      onPress(detail.notification);
    }
  });
};

export const setAppBadgeCount = async (count) => {
  await notifee.setBadgeCount(count);
};