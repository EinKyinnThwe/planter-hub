import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import App from './App';
import crashlytics from '@react-native-firebase/crashlytics';
import { saveNotificationLocally } from './src/services/notificationStorageService';
import { useEffect } from 'react';


const messaging = getMessaging(getApp());

setBackgroundMessageHandler(messaging, async (remoteMessage) => {
  await saveNotificationLocally(remoteMessage);
});

registerRootComponent(App);