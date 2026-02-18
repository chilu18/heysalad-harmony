import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

import { WarehouseStaffDashboardScreen } from '../../screens/warehouse-staff/DashboardScreen';
import TimeClockScreen from '../../screens/warehouse-staff/TimeClockScreen';
import ScheduleScreen from '../../screens/warehouse-staff/ScheduleScreen';
import NotificationsScreen from '../../screens/shared/NotificationsScreen';
import DocumentsScreen from '../../screens/shared/DocumentsScreen';
import BridgetCallScreen from '../../screens/shared/BridgetCallScreen';
import ProfileScreen from '../../screens/shared/ProfileScreen';
import TrainingCatalogScreen from '../../screens/shared/TrainingCatalogScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack - includes all screens accessible from Dashboard
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
        component={WarehouseStaffDashboardScreen}
        options={{ 
          title: 'Dashboard',
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
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: 'My Schedule',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          title: 'Documents',
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

const WarehouseStaffTabs: React.FC = () => {
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
            <Ionicons name="home-outline" size={size} color={color} />
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

export default WarehouseStaffTabs;
