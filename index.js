// This file runs before anything else — including before App.js mounts.
// The FCM background handler and gesture-handler import MUST be here,
// not inside App.js, or background/quit-state notifications won't work.

import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import App from './App';
import { saveNotificationLocally } from './src/services/notificationStorageService';

const messaging = getMessaging(getApp());

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  await saveNotificationLocally(remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title ?? 'Planter Hub',
    body: remoteMessage.notification?.body ?? '',
    data: remoteMessage.data,
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' },
    },
  });
});

registerRootComponent(App);