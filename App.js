import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/context/CartContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { configureGoogleSignIn } from './src/config/googleSignIn';

export default function App() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CartProvider>
        <FavoritesProvider>
          <NotificationProvider>
            <AppNavigator />
          </NotificationProvider>
        </FavoritesProvider>
      </CartProvider>
    </GestureHandlerRootView>
  );
}