import { GoogleSignin } from '@react-native-google-signin/google-signin';

const GOOGLE_WEB_CLIENT_ID = '292160762036-a9h6unlq2nvivng7q5q7fuphsqpj96tc.apps.googleusercontent.com';

export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: false,
    });
};
