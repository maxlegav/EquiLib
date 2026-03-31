import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator - Main navigation container
 * Manages stack navigation between onboarding, main tabs, and modal screens
 */
export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        {/* Additional screens will be added in future tasks:
         * - Onboarding
         * - TriageResult
         * - PractitionerDetail
         * - BookingConfirmation
         * - CrisisEmergency
         */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
