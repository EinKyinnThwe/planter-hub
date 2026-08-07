import '@react-native-firebase/app';
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { configureGoogleSignIn } from './src/config/googleSignIn';

import { NativeModules } from 'react-native';
console.log('RNFBAppModule:', !!NativeModules.RNFBAppModule);
console.log('RNFBAuthModule:', !!NativeModules.RNFBAuthModule);
console.log('NativeModules keys sample:', Object.keys(NativeModules).filter(k => k.includes('RNFB') || k.includes('Auth')));

export default function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <CartProvider>
      <FavoritesProvider>
        <AppNavigator />
      </FavoritesProvider>
    </CartProvider>
  );
}