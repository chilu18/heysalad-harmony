import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import LoadingScreen from '../screens/shared/LoadingScreen';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, loading, activeRole } = useAuth();

  console.log('🔍 RootNavigator - loading:', loading, 'user:', user?.email || 'null', 'activeRole:', activeRole);

  if (loading) {
    console.log('⏳ Showing loading screen');
    return <LoadingScreen />;
  }

  console.log('✅ Rendering navigator for:', user ? `authenticated user (${activeRole})` : 'guest');

  // Get the right tabs based on active role
  const getTabNavigator = () => {
    switch (activeRole) {
      case 'Warehouse Staff':
        return require('./tabs/WarehouseStaffTabs').default;
      case 'HR Manager':
        return require('./tabs/HRManagerTabs').default;
      case 'Operations Manager':
        return require('./tabs/OperationsManagerTabs').default;
      default:
        return require('./tabs/WarehouseStaffTabs').default;
    }
  };

  const TabNavigator = user ? getTabNavigator() : null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user && TabNavigator ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;