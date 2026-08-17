import { useState } from 'react';
import { signInWithGoogle } from '../services/authService';
import { ensureUserProfile } from '../services/userService';
import { seedProductsIfEmpty } from '../services/productService';
import { startTrace, stopTrace } from '../services/performanceService';

export default function useGoogleSignIn(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        const performanceTrace = await startTrace('google_sign_in');

        const { user, error: signInError } = await signInWithGoogle();

        if (signInError) {
            setLoading(false);
            setError(signInError);
            await stopTrace(performanceTrace, { outcome: 'google_sign_in_error' });
            return;
        }

        if (!user) {
            // User cancelled the Google sheet.
            setLoading(false);
            await stopTrace(performanceTrace, { outcome: 'google_sign_in_cancelled!' });
            return;
        }

        try {
            const { isNewUser } = await ensureUserProfile(user);
            if (isNewUser) {
                await seedProductsIfEmpty();
            }
            await stopTrace(performanceTrace, { outcome: 'googel_sign_in_success!', isNewUser: String(isNewUser) });
            onSuccess && onSuccess(user);
        } catch (err) {
            setError('Signed in, but setup failed. Please try again.');
            await stopTrace(performanceTrace, { outcome: 'profile_set_up_error!' });
        } finally {
            setLoading(false);
        }
    };

    return { handleGoogleSignIn, loading, error };
}
