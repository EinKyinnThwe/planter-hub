import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MainTabNavigator from './MainTabNavigator';
import PlantDetailScreen from '../screens/PlantDetailScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Plant shop (5-tab bottom nav) */}
        <Stack.Screen name="Main" component={MainTabNavigator} />

        {/* Pushed over the tabs */}
        <Stack.Screen name="PlantDetail" component={PlantDetailScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
