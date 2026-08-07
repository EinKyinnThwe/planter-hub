// src/config/googleSignIn.js
// One-time native configuration for @react-native-google-signin/google-signin.
// Call configureGoogleSignIn() once, e.g. in App.js's top-level useEffect.

import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Get this from Firebase Console → Authentication → Sign-in method → Google
// → Web SDK configuration ("Web client ID"). It is NOT the same as the
// Android/iOS client ID in google-services.json / GoogleService-Info.plist.
const GOOGLE_WEB_CLIENT_ID = '292160762036-a9h6unlq2nvivng7q5q7fuphsqpj96tc.apps.googleusercontent.com';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: false,
  });
};
