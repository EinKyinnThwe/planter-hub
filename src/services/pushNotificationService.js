import {
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import { getApp } from '@react-native-firebase/app';

import {
  getMessaging,
  requestPermission,
  AuthorizationStatus,
  deleteToken,
  onTokenRefresh,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  registerDeviceForRemoteMessages,
  isDeviceRegisteredForRemoteMessages,
  subscribeToTopic as firebaseSubscribeToTopic,
  unsubscribeFromTopic as firebaseUnsubscribeFromTopic,
} from '@react-native-firebase/messaging';

import {
  getFirestore,
  doc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from '@react-native-firebase/firestore';

const messaging = getMessaging(getApp());

export const setupNotificationChannel = async () => {
  return true;
};

export const requestNotificationPermission = async () => {
  try {
    if (
      Platform.OS === 'android' &&
      Platform.Version >= 33
    ) {
      const result =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS
            .POST_NOTIFICATIONS
        );

      if (
        result !==
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        return false;
      }
    }

    const status =
      await requestPermission(messaging);

    return (
      status ===
        AuthorizationStatus.AUTHORIZED ||
      status ===
        AuthorizationStatus.PROVISIONAL
    );
  } catch (error) {
    console.warn(
      'Notification permission failed:',
      error?.message || error
    );

    return false;
  }
};

export const getFcmDeviceToken = async () => {
  try {
    const registered =
      isDeviceRegisteredForRemoteMessages(
        messaging
      );

    if (!registered) {
      await registerDeviceForRemoteMessages(
        messaging
      );
    }

    const token =
      await messaging.getToken();

    if (!token) {
      console.warn(
        'Firebase did not return an FCM token'
      );

      return null;
    }

    console.log(
      'Your Firebase Device Token:',
      token
    );

    return token;
  } catch (error) {
    console.warn(
      'getFcmDeviceToken failed:',
      error?.message || error
    );

    return null;
  }
};

export const deleteFcmToken = async () => {
  try {
    await deleteToken(messaging);

    console.log(
      'FCM token deleted successfully'
    );

    return true;
  } catch (error) {
    console.warn(
      'Delete FCM token failed:',
      error?.message || error
    );

    return false;
  }
};

export const saveTokenToProfile = async (
    uid,
    token
) => {
    if (!uid || !token) {
        return false;
  }

  try {
    const db = getFirestore();

    const userRef = doc(
      db,
      'users',
      String(uid)
    );

    await setDoc(
      userRef,
      {
        fcmTokens: arrayUnion(token),
      },
      {
        merge: true,
      }
    );

    console.log(
      'FCM token saved to user profile'
    );

    return true;
  } catch (error) {
    console.warn(
      'saveTokenToProfile failed:',
      error?.message || error
    );

    return false;
  }
};

export const removeTokenFromProfile = async (
  uid,
  token
) => {
  if (!uid || !token) {
    return false;
  }

  try {
    const db = getFirestore();
    const userRef = doc(
      db,
      'users',
      String(uid)
    );

    await setDoc(
      userRef,
      {
        fcmTokens: arrayRemove(token),
      },
      {
        merge: true,
      }
    );

    console.log(
      'FCM token removed from user profile'
    );

    return true;
  } catch (error) {
    console.warn(
      'Remove FCM token failed:',
      error?.message || error
    );

    return false;
  }
};

export const subscribeToTokenRefresh = (
  callback
) => {
  if (typeof callback !== 'function') {
    return () => {};
  }

  return onTokenRefresh(
    messaging,
    callback
  );
};

export const displayForegroundNotification =
  async (remoteMessage) => {
    try {
      const title =
        remoteMessage?.notification?.title ||
        'Planter Hub';

      const body =
        remoteMessage?.notification?.body ||
        '';

      Alert.alert(
        title,
        body
      );
    } catch (error) {
      console.warn(
        'Foreground notification failed:',
        error?.message || error
      );
    }
  };

export const subscribeToForegroundMessages =
  (callback) => {
    if (typeof callback !== 'function') {
      return () => {};
    }

    return onMessage(
      messaging,
      callback
    );
  };

export const subscribeToNotificationOpenedApp =
  (callback) => {
    if (typeof callback !== 'function') {
      return () => {};
    }

    return onNotificationOpenedApp(
      messaging,
      callback
    );
  };

export const getInitialPushNotification =
  async () => {
    try {
      return await getInitialNotification(
        messaging
      );
    } catch (error) {
      console.warn(
        'Initial notification failed:',
        error?.message || error
      );

      return null;
    }
  };

export const subscribeToTopic = async (
  topicName
) => {
  if (!topicName) {
    return false;
  }

  try {
    await firebaseSubscribeToTopic(
      messaging,
      String(topicName)
    );

    console.log(
      `Subscribe to topic: ${topicName}`
    );

    return true;
  } catch (error) {
    console.warn(
      'Topic subscribe failed:',
       error?.message || error
    );

    return false;
  }
};

export const unsubscribeFromTopic =
  async (topicName) => {
    if (!topicName) {
      return false;
    }

    try {
      await firebaseUnsubscribeFromTopic(
        messaging,
        String(topicName)
      );

      console.log(
        `Unsubscribe from topic: ${topicName}`
      );

      return true;
    } catch (error) {
      console.warn(
        'Topic unsubscribe failed:',
        error?.message || error
      );

      return false;
    }
  };

export const subscribeToNotifeeEvents = () => {
  return () => {};
};

export const setAppBadgeCount = async () => {
  return true;
};
