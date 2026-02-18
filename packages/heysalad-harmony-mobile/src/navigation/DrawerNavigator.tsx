import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

// Import tab navigators
import WarehouseStaffTabs from './tabs/WarehouseStaffTabs';
import HRManagerTabs from './tabs/HRManagerTabs';
import OperationsManagerTabs from './tabs/OperationsManagerTabs';

// Import drawer screens
import DocumentsScreen from '../screens/shared/DocumentsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  const { user } = useAuth();

  // Get the appropriate tab navigator based on role
  const getTabNavigator = () => {
    switch (user?.role) {
      case 'Warehouse Staff':
        return WarehouseStaffTabs;
      case 'HR Manager':
        return HRManagerTabs;
      case 'Operations Manager':
        return OperationsManagerTabs;
      default:
        return WarehouseStaffTabs;
    }
  };

  const TabNavigator = getTabNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.text.secondary,
        drawerLabelStyle: {
          fontSize: TYPOGRAPHY.fontSize.md,
          fontWeight: TYPOGRAPHY.fontWeight.medium,
        },
      }}
      drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Drawer.Screen
        name="Documents"
        component={DocumentsScreen}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Custom drawer content with user info and sign out
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.[0] || user?.displayName?.[0] || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>
          {user?.firstName || user?.displayName || 'User'}
        </Text>
        <Text style={styles.userRole}>{user?.role}</Text>
      </View>

      <View style={styles.drawerItems}>
        {props.state.routes.map((route, index) => {
          const isFocused = props.state.index === index;
          const { drawerLabel, drawerIcon } = props.descriptors[route.key].options;

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.drawerItem, isFocused && styles.drawerItemActive]}
              onPress={() => props.navigation.navigate(route.name)}
            >
              {drawerIcon &&
                drawerIcon({
                  color: isFocused ? COLORS.primary : COLORS.text.secondary,
                  size: 24,
                  focused: isFocused,
                })}
              <Text
                style={[
                  styles.drawerItemText,
                  isFocused && styles.drawerItemTextActive,
                ]}
              >
                {typeof drawerLabel === 'string' ? drawerLabel : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  drawerHeader: {
    backgroundColor: COLORS.primary,
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  userRole: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.white,
    opacity: 0.9,
  },
  drawerItems: {
    flex: 1,
    paddingVertical: SPACING.md,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  drawerItemActive: {
    backgroundColor: `${COLORS.primary}10`,
    borderRightWidth: 3,
    borderRightColor: COLORS.primary,
  },
  drawerItemText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  drawerItemTextActive: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.lg,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  signOutText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
});

export default DrawerNavigator;