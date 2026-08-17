import React from 'react';

import {
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

import {
    NavigationContainer,
} from '@react-navigation/native';

import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

import MainTabNavigator from './MainTabNavigator';

import PlantDetailScreen from '../screens/PlantDetailScreen';
import CartScreen from '../screens/CartScreen';
import ChatScreen from '../screens/ChatScreen';
import AllProductsScreen from '../screens/AllProductsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import NotificationDetailsScreen from '../screens/NotificationDetailsScreen';

import { useAuth } from '../context/AuthContext';

import {
    COLORS,
} from '../constants/theme';

const Stack =
    createNativeStackNavigator();

const AppNavigator = () => {
    const {
      user,
      loading,
    } = useAuth();

    if (loading) {
      return (
        <View
          style={styles.boot}
        >
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
        </View>
      );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Main"
              component={
                MainTabNavigator
              }
            />

            <Stack.Screen
              name="PlantDetail"
              component={
                PlantDetailScreen
              }
            />

            <Stack.Screen
              name="Cart"
              component={
                CartScreen
              }
            />

            <Stack.Screen
              name="Chat"
              component={
                ChatScreen
              }
            />

            <Stack.Screen
              name="AllProducts"
              component={
                AllProductsScreen
              }
            />

            <Stack.Screen
              name="Notifications"
              component={
                NotificationsScreen
              }
            />

            <Stack.Screen
              name="NotificationDetails"
              component={
                NotificationDetailsScreen
              }
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={
                LoginScreen
              }
            />

            <Stack.Screen
              name="Signup"
              component={
                SignupScreen
              }
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    boot: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:
        COLORS.background,
    },
});

export default AppNavigator;
