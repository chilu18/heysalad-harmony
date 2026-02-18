import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

import DashboardScreen from '../../screens/hr-manager/DashboardScreen';
import DocumentGenerationScreen from '../../screens/hr-manager/DocumentGenerationScreen';
import AddEmployeeScreen from '../../screens/hr-manager/AddEmployeeScreen';
import ScheduleManagementScreen from '../../screens/hr-manager/ScheduleManagementScreen';
import ScheduleOverviewScreen from '../../screens/hr-manager/ScheduleOverviewScreen';
import CreateShiftScreen from '../../screens/hr-manager/CreateShiftScreen';
import TimesheetApprovalScreen from '../../screens/hr-manager/TimesheetApprovalScreen';
import LocationManagerScreen from '../../screens/hr-manager/LocationManagerScreen';
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
          title: 'Dashboard',
        }}
      />
      <Stack.Screen 
        name="AddEmployee" 
        component={AddEmployeeScreen}
        options={{ 
          title: 'Add New Employee',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="LocationManager" 
        component={LocationManagerScreen}
        options={{ 
          title: 'Manage Locations',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ScheduleManagement" 
        component={ScheduleManagementScreen}
        options={{ 
          title: 'Schedule Management',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ScheduleOverview"
        component={ScheduleOverviewScreen}
        options={{
          title: 'Schedule Overview',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="CreateShift" 
        component={CreateShiftScreen}
        options={{ 
          title: 'Create Shift',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="TimesheetApproval" 
        component={TimesheetApprovalScreen}
        options={{ 
          title: 'Approvals',
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
        name="DocumentGeneration"
        component={DocumentGenerationScreen}
        options={{
          title: 'Document Generation',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="TrainingCatalog"
        component={TrainingCatalogScreen}
        options={{
          title: 'Training Studio',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const HRManagerTabs: React.FC = () => {
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

export default HRManagerTabs;
