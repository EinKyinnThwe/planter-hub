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
unsubscribeForeground = subscribeToForegroundMessages(
async (remoteMessage) => {
await displayForegroundNotification(remoteMessage);
const updated = await saveNotificationLocally(remoteMessage);
setNotifications(updated);
}
);
unsubscribeNotifeePress = subscribeToNotifeeEvents(() => {});
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




// import React, { createContext, useEffect, useState, useCallback } from 'react';
// import useAuthUser from '../hooks/useAuthUser';
// import {
//   getStoredNotifications,
//   saveNotificationLocally,
//   markNotificationRead,
//   markAllNotificationsRead,
//   deleteNotification,
//   clearAllNotifications,
// } from '../services/notificationStorageService';
// import {
//   setupNotificationChannel,
//   requestNotificationPermission,
//   getFcmDeviceToken,
//   saveTokenToProfile,
//   subscribeToTokenRefresh,
//   subscribeToForegroundMessages,
//   displayForegroundNotification,
//   subscribeToNotifeeEvents,
//   setAppBadgeCount,
//   removeTokenFromProfile, // 👈 Required to slice old tokens on account drop
//   deleteFcmToken,         // 👈 Required to destroy native session keys
// } from '../services/pushNotificationService';

// export const NotificationContext = createContext(null);

// export const NotificationProvider = ({ children }) => {
//   const { user } = useAuthUser();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [permissionGranted, setPermissionGranted] = useState(false);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   useEffect(() => {
//     setAppBadgeCount(unreadCount).catch(() => {});
//   }, [unreadCount]);

//   // 🔴 FIX 1: Isolate and clear layout storage data when user profile unmounts
//   useEffect(() => {
//     let mounted = true;
    
//     const handleStorageSync = async () => {
//       if (user) {
//         // Fetch current user data logs
//         const stored = await getStoredNotifications();
//         if (mounted) setNotifications(stored);
//       } else {
//         // Purge old user data from state array immediately on logout
//         await clearAllNotifications();
//         if (mounted) setNotifications([]);
//       }
//       if (mounted) setLoading(false);
//     };

//     handleStorageSync();

//     return () => {
//       mounted = false;
//     };
//   }, [user]); // 👈 Triggers structural adjustments instantly when user reference swaps

//   // FCM setup after login
//   useEffect(() => {
//     if (!user) return;

//     let unsubscribeForeground;
//     let unsubscribeTokenRefresh;
//     let unsubscribeNotifeePress;
//     let activeToken = null; // Track current runtime session token reference

//     (async () => {
//       try {
//         await setupNotificationChannel();
//         const granted = await requestNotificationPermission();
//         setPermissionGranted(granted);

//         if (!granted) return;

//         const token = await getFcmDeviceToken(); 
//         if (token) {
//           activeToken = token;
//           await saveTokenToProfile(user.uid, token);
//           console.log('Save Successfully to database.');
//         }

//         unsubscribeTokenRefresh = subscribeToTokenRefresh((newToken) => {
//           activeToken = newToken;
//           saveTokenToProfile(user.uid, newToken);
//         });

//         unsubscribeForeground = subscribeToForegroundMessages(
//           async (remoteMessage) => {
//             await displayForegroundNotification(remoteMessage);
//             const updated = await saveNotificationLocally(remoteMessage);
//             setNotifications(updated);
//           }
//         );

//         unsubscribeNotifeePress = subscribeToNotifeeEvents(() => {});
//       } catch (e) {
//         console.warn('Notification setup failed', e?.message || e);
//       }
//     })();

//     return () => {
//       const currentUid = user?.uid;
//       const tokenToDestroy = activeToken;

//       unsubscribeForeground && unsubscribeForeground();
//       unsubscribeTokenRefresh && unsubscribeTokenRefresh();
//       unsubscribeNotifeePress && unsubscribeNotifeePress();

//       // Silent cleanup in background thread context
//     //   if (currentUid && tokenToDestroy) {
//     //     (async () => {
//     //       try {
//     //         await removeTokenFromProfile(currentUid, tokenToDestroy);
//     //         await deleteFcmToken();
//     //         console.log('Successfully detached and cleared old FCM instance mapping.');
//     //       } catch (err) {
//     //         console.warn('Background cleanup unbinding failed', err);
//     //       }
//     //     })();
//     //   }
//      };
//   }, [user]);

//   const markAsRead = useCallback(async (id) => {
//     const updated = await markNotificationRead(id);
//     setNotifications(updated);
//   }, []);

//   const markAllAsRead = useCallback(async () => {
//     const updated = await markAllNotificationsRead();
//     setNotifications(updated);
//   }, []);

//   const removeNotification = useCallback(async (id) => {
//     const updated = await deleteNotification(id);
//     setNotifications(updated);
//   }, []);

//   const clearAll = useCallback(async () => {
//     const updated = await clearAllNotifications();
//     setNotifications(updated);
//   }, []);

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         loading,
//         unreadCount,
//         permissionGranted,
//         markAsRead,
//         markAllAsRead,
//         removeNotification,
//         clearAll,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };
