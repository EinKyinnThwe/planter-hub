// src/hooks/useGoogleSignIn.js
// Wraps Google sign-in + the same first-time Firestore setup used by
// email/password sign-up, so "Continue with Google" works for both new
// and returning users.

import { useState } from 'react';
import { signInWithGoogle } from '../services/authService';
import { ensureUserProfile } from '../services/userService';
import { seedProductsIfEmpty } from '../services/productService';

export default function useGoogleSignIn(onSuccess) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    const { user, error: signInError } = await signInWithGoogle();

    if (signInError) {
      setLoading(false);
      setError(signInError);
      return;
    }

    if (!user) {
      // User cancelled the Google sheet.
      setLoading(false);
      return;
    }

    try {
      const { isNewUser } = await ensureUserProfile(user);
      if (isNewUser) {
        await seedProductsIfEmpty();
      }
      onSuccess && onSuccess(user);
    } catch (err) {
      setError('Signed in, but setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { handleGoogleSignIn, loading, error };
}
