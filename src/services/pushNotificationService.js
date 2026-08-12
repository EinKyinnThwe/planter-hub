// src/services/pushNotificationService.js
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  AuthorizationStatus,
  getToken,
  deleteToken,
  onTokenRefresh,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  registerDeviceForRemoteMessages,
  isDeviceRegisteredForRemoteMessages,
} from '@react-native-firebase/messaging';
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Firestore,
} from '@react-native-firebase/firestore';

const messaging = getMessaging(getApp());

export const setupNotificationChannel = async () => {
  // No-op without Notifee
};

export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        return false;
      }
    }

    const status = await requestPermission(messaging);
    return (
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL
    );
  } catch (e) {
    console.warn('requestNotificationPermission failed', e?.message || e);
    return false;
  }
};

export const getFcmDeviceToken = async () => {
  try {
    // iOS: must register for remote messages before getToken
    const registered = isDeviceRegisteredForRemoteMessages(messaging);
    if (!registered) {
      await registerDeviceForRemoteMessages(messaging);
    }

    const token = await messaging.getToken();
    // console.log('FCM Token:', token);
    // return token;
    if (token) {
          console.log('Your Firebase Device Token:', token);
          return token;
        } else {
          console.log('No token received');
        }
  } catch (e) {
    // Simulator / missing aps-environment - expected; never throw
    console.warn('getFcmDeviceToken failed', e?.message || e);
    return null;
  }
};

export const deleteFcmToken = async () => {
    try {
        await deleteToken(messaging);
        console.log('Delete Fcm Token Successfully.');
    } catch (error) {
        console.warn('Delete Token Fail.', e?.message || e);
    }
};

export const saveTokenToProfile = async (uid, token) => {
  if (!uid || !token) return;
  try {
    const db = getFirestore();
    await updateDoc(doc(db, 'users', uid), {
      fcmTokens: arrayUnion(token),
    });
  } catch (e) {
    console.warn('saveTokenToProfile failed', e?.message || e);
  }
};


export const removeTokenFromProfile = async (uid, token) => {
    if(!uid || !token) return;
    try {
        const db = getFirestore();
        await updateDoc(doc(db, 'users', uid), {
            fcmTokens: arrayRemove(token),
        });
    } catch (error) {
        console.warn('Fail to delete token from profile.', error?.message || error);
    }
};

export const subscribeToTokenRefresh = (onNewToken) => {
  return onTokenRefresh(messaging, onNewToken);
};

export const displayForegroundNotification = async (remoteMessage) => {
  const title = remoteMessage.notification?.title ?? 'Planter Hub';
  const body = remoteMessage.notification?.body ?? '';
  Alert.alert(title, body);
};

export const subscribeToForegroundMessages = (onMessageReceived) => {
  return onMessage(messaging, onMessageReceived);
};

export const subscribeToNotificationOpenedApp = (onOpened) => {
  return onNotificationOpenedApp(messaging, onOpened);
};

export const getInitialPushNotification = () =>
  getInitialNotification(messaging);

export const subscribeToNotifeeEvents = () => {
  return () => {};
};

export const setAppBadgeCount = async () => {};