import { getPerformance, trace } from '@react-native-firebase/perf';

// Start Trace
export const startTrace = async (name) => {
    const perf = getPerformance();
    const t = trace(perf, name);
    await t.start();
    return t;
};

// Stop Trace
export const stopTrace = async (traceHandle, attributes = {}) => {
    Object.entries(attributes).forEach(([key, value]) => {
        traceHandle.putAttribute(key, String(value));
    });
    await traceHandle.stop();
};

export const measureAsync = async (name, fn, attributes = {}) => {
    const t = await startTrace(name);
    try {
        const result = await fn();
        await stopTrace(t, { ...attributes, outcome: 'success!' });
        return result;
    } catch (error) {
        await stopTrace(t, { ...attributes, outcome: 'fail!' });
        throw error;
    }
};