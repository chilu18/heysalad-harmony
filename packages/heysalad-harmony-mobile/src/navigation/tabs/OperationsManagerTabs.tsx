// src/navigation/tabs/OperationsManagerTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

import DashboardScreen from '../../screens/operations-manager/DashboardScreen';
import AnalyticsScreen from '../../screens/operations-manager/AnalyticsScreen';
import TeamOverviewScreen from '../../screens/operations-manager/TeamOverviewScreen';
import ScheduleOverviewScreen from '../../screens/operations-manager/ScheduleOverviewScreen';
import SafetyReportsScreen from '../../screens/operations-manager/SafetyReportsScreen';
import NotificationsScreen from '../../screens/shared/NotificationsScreen';
import TimeClockScreen from '../../screens/shared/TimeClockScreen';
import BridgetCallScreen from '../../screens/shared/BridgetCallScreen';
import ProfileScreen from '../../screens/shared/ProfileScreen';
import TrainingCatalogScreen from '../../screens/shared/TrainingCatalogScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack - includes all the screens accessible from Dashboard
const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="DashboardHome" 
        component={DashboardScreen}
        options={{ 
          title: 'Operations Dashboard',
        }}
      />
      <Stack.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ 
          title: 'Analytics',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Team" 
        component={TeamOverviewScreen}
        options={{ 
          title: 'Team Overview',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Schedule" 
        component={ScheduleOverviewScreen}
        options={{ 
          title: 'Schedule Overview',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Safety" 
        component={SafetyReportsScreen}
        options={{ 
          title: 'Safety Reports',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ 
          title: 'Notifications',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="TrainingCatalog"
        component={TrainingCatalogScreen}
        options={{
          title: 'Training Catalog',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const OperationsManagerTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[500],
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Clock"
        component={TimeClockScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Voice"
        component={BridgetCallScreen}
        options={{
          title: 'Voice',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mic-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default OperationsManagerTabs;
