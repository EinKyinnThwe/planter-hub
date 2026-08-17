import {
    getAnalytics,
    logEvent,
    logScreenView as firebaseLogScreenView,
    setUserId as firebaseSetAnalyticsUserId,
    setAnalyticsCollectionEnabled,
} from '@react-native-firebase/analytics';

import {
    getCrashlytics,
    setCrashlyticsCollectionEnabled,
    setUserId as firebaseSetCrashlyticsUserId,
    log as firebaseCrashlyticsLog,
    recordError as firebaseCrashlyticsRecordError,
} from '@react-native-firebase/crashlytics';

let analyticsInstance = null;
let crashlyticsInstance = null;

const getAnalyticsInstance = () => {
    if (analyticsInstance) {
        return analyticsInstance;
    }

    try {
        analyticsInstance = getAnalytics();
        return analyticsInstance;
    } catch (error) {
        console.warn(
            'Firebase Analytics unavailable:',
            error?.message || String(error)
        );

        return null;
    }
};

const getCrashlyticsInstance = () => {
    if (crashlyticsInstance) {
        return crashlyticsInstance;
    }

    try {
        crashlyticsInstance = getCrashlytics();
        return crashlyticsInstance;
    } catch (error) {
        console.warn(
            'Firebase Crashlytics unavailable:',
            error?.message || String(error)
        );

        return null;
    }
};

export const initializeAnalytics = async () => {
    const analytics = getAnalyticsInstance();

    if (!analytics) {
        return false;
    }

    try {
        await setAnalyticsCollectionEnabled(
            analytics,
            true
        );

        return true;
    } catch (error) {
        console.warn(
            'Analytics initialization failed:',
            error?.message || String(error)
        );

        return false;
    }
};

export const initializeCrashlytics = async () => {
    const crashlytics =
        getCrashlyticsInstance();

    if (!crashlytics) {
        return false;
    }

    try {
        await setCrashlyticsCollectionEnabled(
            crashlytics,
            true
        );

        return true;
    } catch (error) {
        console.warn(
            'Crashlytics initialization failed:',
            error?.message || String(error)
        );

        return false;
    }
};

export const initializeAnalyticsServices =
    async () => {
        await initializeAnalytics();
        await initializeCrashlytics();
    };

export const setAnalyticsUserId =
    async (userId) => {
        if (
            userId === undefined ||
            userId === null ||
            userId === ''
        ) {
            return;
        }

        const analytics =
            getAnalyticsInstance();

        if (!analytics) {
            return;
        }

        try {
            await firebaseSetAnalyticsUserId(
                analytics,
                String(userId)
            );
        } catch (error) {
            console.warn(
                'Analytics user ID failed:',
                error?.message || String(error)
            );
        }
    };

export const setCrashlyticsUserId =
    async (userId) => {
        if (
            userId === undefined ||
            userId === null ||
            userId === ''
        ) {
            return;
        }

        const crashlytics =
            getCrashlyticsInstance();

        if (!crashlytics) {
            return;
        }

        try {
            await firebaseSetCrashlyticsUserId(
                crashlytics,
                String(userId)
            );

            console.log(
                'Crashlytics user ID set:',
                String(userId)
            );
        } catch (error) {
            console.warn(
                'Crashlytics user ID failed:',
                error?.message || String(error)
            );
        }
    };

export const setAnalyticsUser =
    async (userId) => {
        if (
            userId === undefined ||
            userId === null ||
            userId === ''
        ) {
            return;
        }

        await Promise.allSettled([
            setAnalyticsUserId(userId),
            setCrashlyticsUserId(userId),
        ]);
    };

const cleanParams = (params = {}) => {
    const result = {};

    if (
        !params ||
        typeof params !== 'object'
    ) {
        return result;
    }

    Object.keys(params).forEach((key) => {
        const value = params[key];

        if (
            value === undefined ||
            value === null
        ) {
            return;
        }

        if (
            typeof value === 'string' ||
            typeof value === 'number'
        ) {
            result[key] = value;
            return;
        }

        if (typeof value === 'boolean') {
            result[key] = value
                ? 'true'
                : 'false';

            return;
        }

        try {
            result[key] =
                JSON.stringify(value);
        } catch {
            result[key] = String(value);
        }
    });

    return result;
};

export const logScreenView =
    async (screenName) => {
        if (!screenName) {
            return;
        }

        const analytics =
            getAnalyticsInstance();

        if (!analytics) {
            return;
        }

        try {
            await firebaseLogScreenView(
                analytics,
                {
                    screen_name:
                        String(screenName),

                    screen_class:
                        String(screenName),
                }
            );

            console.log(
                `Analytics screen view: ${screenName}`
            );
        } catch (error) {
            console.warn(
                `Analytics screen view failed: ${screenName}`,
                error?.message || String(error)
            );
        }
    };

export const logButtonClick =
    async (
        buttonName,
        screenName,
        params = {}
    ) => {
        if (!buttonName) {
            return;
        }

        const analytics =
            getAnalyticsInstance();

        if (!analytics) {
            return;
        }

        try {
            const eventParams = {
                button_name:
                    String(buttonName),

                ...(screenName
                    ? {
                        screen_name:
                            String(screenName),
                    }
                    : {}),

                ...cleanParams(params),
            };

            await logEvent(
                analytics,
                'button_click',
                eventParams
            );
        } catch (error) {
            console.warn(
                `Analytics button click failed: ${buttonName}`,
                error?.message || String(error)
            );
        }
    };

export const logAnalyticsEvent =
    async (
        eventName,
        params = {}
    ) => {
        if (!eventName) {
            return;
        }

        const analytics =
            getAnalyticsInstance();

        if (!analytics) {
            return;
        }

        try {
            await logEvent(
                analytics,
                String(eventName),
                cleanParams(params)
            );
        } catch (error) {
            console.warn(
                `Analytics event failed: ${eventName}`,
                error?.message || String(error)
            );
        }
    };

export const logEventToAnalytics =
    logAnalyticsEvent;

export const logErrorToCrashlytics =
    (
        error,
        context = ''
    ) => {
        const crashlytics =
            getCrashlyticsInstance();

        if (!crashlytics) {
            return;
        }

        try {
            if (context) {
                firebaseCrashlyticsLog(
                    crashlytics,
                    String(context)
                );
            }

            let normalizedError;

            if (error instanceof Error) {
                normalizedError = error;
            } else if (
                typeof error === 'string'
            ) {
                normalizedError =
                    new Error(error);
            } else {
                try {
                    normalizedError =
                        new Error(
                            JSON.stringify(error)
                        );
                } catch {
                    normalizedError =
                        new Error(
                            String(error)
                        );
                }
            }

            firebaseCrashlyticsRecordError(
                crashlytics,
                normalizedError
            );
        } catch (error) {
            console.warn(
                'Crashlytics error execution failed:',
                error?.message || String(error)
            );
        }
    };

export const logCrashlytics =
    (message) => {
        if (!message) {
            return;
        }

        const crashlytics =
            getCrashlyticsInstance();

        if (!crashlytics) {
            return;
        }

        try {
            firebaseCrashlyticsLog(
                crashlytics,
                String(message)
            );
        } catch (error) {
            console.warn(
                'Crashlytics log failed:',
                error?.message || String(error)
            );
        }
    };

export const recordCrashlyticsError =
    (
        error,
        context = ''
    ) => {
        logErrorToCrashlytics(
            error,
            context
        );
    };

const analyticsService = {
    initializeAnalytics,
    initializeCrashlytics,
    initializeAnalyticsServices,

    setAnalyticsUserId,
    setCrashlyticsUserId,
    setAnalyticsUser,

    logScreenView,
    logButtonClick,

    logAnalyticsEvent,
    logEventToAnalytics,

    logErrorToCrashlytics,
    logCrashlytics,
    recordCrashlyticsError,
};

export default analyticsService;
