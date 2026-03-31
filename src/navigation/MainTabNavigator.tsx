import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { ChatScreen } from '../screens/ChatScreen';
import { TriageScreen } from '../screens/TriageScreen';
import { PractitionersScreen } from '../screens/PractitionersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<string, string> = {
  Chat: '💬',
  Triage: '🎯',
  Practitioners: '👨‍⚕️',
  Profile: '👤',
};

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#0596DE',
        tabBarInactiveTintColor: '#374151',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 56,
        },
        headerStyle: {
          backgroundColor: '#0596DE',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 22 }}>{tabIcons[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Conversation',
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Triage"
        component={TriageScreen}
        options={{
          title: 'Orientation',
          tabBarLabel: 'Orientation',
        }}
      />
      <Tab.Screen
        name="Practitioners"
        component={PractitionersScreen}
        options={{
          title: 'Praticiens',
          tabBarLabel: 'Praticiens',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};
