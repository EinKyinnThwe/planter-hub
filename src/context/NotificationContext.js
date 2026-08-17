import React, {
    createContext,
    useEffect,
    useState,
    useCallback,
} from 'react';

import useAuthUser from '../hooks/useAuthUser';

import {
    setCrashlyticsUserId,
    recordCrashlyticsError,
} from '../services/analyticsService';

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
    subscribeToTopic,
} from '../services/pushNotificationService';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuthUser();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [permissionGranted, setPermissionGranted] = useState(false);

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    useEffect(() => {
        setAppBadgeCount(unreadCount).catch(() => {});
    }, [unreadCount]);
    
    useEffect(() => {
        if (!user?.uid) {
        return;
        }
        setCrashlyticsUserId(user.uid);
    }, [user?.uid]);
    //Store local notification
    useEffect(() => {
        let mounted = true;
        const loadNotifications = async () => {
            try {
                const stored = await getStoredNotifications();
                if (mounted) {
                setNotifications(stored);
                }
            } catch (error) {
                recordCrashlyticsError(error, 'Failed to load stored notifications');
                console.warn('Failed to load stored notifications:', error?.message || String(error));
            } finally {
                if (mounted) {
                setLoading(false);
                }
            }
        };
        loadNotifications();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!user?.uid) {
            return;
        }

        let unsubscribeForeground = null;
        let unsubscribeTokenRefresh = null;
        let unsubscribeNotifeePress = null;
        let mounted = true;

        const setupNotifications = async () => {
            try {
                await setupNotificationChannel();

                const granted =
                await requestNotificationPermission();

                if (!mounted) {
                return;
                }

                setPermissionGranted(granted);

                if (!granted) {
                return;
                }

                const token = await getFcmDeviceToken();

                if (token && mounted) {
                await saveTokenToProfile(
                    user.uid,
                    token
                );
                }
                await subscribeToTopic('all-users');

                //Handle FCM Token change
                unsubscribeTokenRefresh =
                subscribeToTokenRefresh(
                    async (newToken) => {
                    try {
                        if (!newToken || !user?.uid) {
                        return;
                        }

                        await saveTokenToProfile(
                        user.uid,
                        newToken
                        );
                    } catch (error) {
                        recordCrashlyticsError(
                        error,
                        'Failed to save refreshed FCM token'
                        );
                    }
                    }
                );
                //Handle foreground notifications
                unsubscribeForeground =
                subscribeToForegroundMessages(
                    async (remoteMessage) => {
                    try {
                        await displayForegroundNotification(
                        remoteMessage
                        );

                        const updated =
                        await saveNotificationLocally(
                            remoteMessage
                        );

                        if (mounted) {
                        setNotifications(updated);
                        }
                    } catch (error) {
                        recordCrashlyticsError(
                        error,
                        'Failed to handle foreground notification'
                        );

                        console.warn(
                        'Foreground notification error:',
                        error?.message || String(error)
                        );
                    }
                    }
                );
                unsubscribeNotifeePress =
                subscribeToNotifeeEvents(() => {});
            } catch (error) {
                recordCrashlyticsError(
                error,
                'Notification setup error'
                );

                console.warn(
                'Notification setup error:',
                error?.message || String(error)
                );
            }
        };

        setupNotifications();

        return () => {
            mounted = false;

            if (unsubscribeForeground) {
                unsubscribeForeground();
            }

            if (unsubscribeTokenRefresh) {
                unsubscribeTokenRefresh();
            }

            if (unsubscribeNotifeePress) {
                unsubscribeNotifeePress();
            }
        };
    }, [user?.uid]);

    //Read one notification
    const markAsRead = useCallback(
        async (id) => {
            try {
                const updated =
                await markNotificationRead(id);

                setNotifications(updated);
            } catch (error) {
                recordCrashlyticsError(error,'Failed to mark notification as read');
                }
            },
        []
    );

    //Read all notification
    const markAllAsRead = useCallback(
        async () => {
            try {
                const updated =
                await markAllNotificationsRead();

                setNotifications(updated);
            } catch (error) {
                recordCrashlyticsError(
                error,
                'Failed to mark all notifications as read'
                );
            }
    }, []);

    //Delete one notification
    const removeNotification = useCallback(
        async (id) => {
            try {
                const updated =
                await deleteNotification(id);
                setNotifications(updated);
            } catch (error) {
                recordCrashlyticsError(error, 'Failed to delete notification');
            }
    }, []);

    //Delete all notification
    const clearAll = useCallback(
        async () => {
            try {
                const updated =
                await clearAllNotifications();

                setNotifications(updated);
            } catch (error) {
                recordCrashlyticsError(
                error,
                'Failed to clear notifications'
                );
            }
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
