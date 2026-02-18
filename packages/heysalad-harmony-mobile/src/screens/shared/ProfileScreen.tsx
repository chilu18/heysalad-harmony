import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/colors';
import { UserRole } from '../../types/user';

const ProfileScreen: React.FC = () => {
  const { user, signOut, activeRole, availableRoles, switchRole } = useAuth();
  const [biometricEnabled, setBiometricEnabled] = useState(user?.biometricEnabled || false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const handleRoleSwitch = async (role: UserRole) => {
    try {
      await switchRole(role);
      setShowRoleSwitcher(false);
      Alert.alert('Success', `Switched to ${role} role`);
    } catch (error) {
      Alert.alert('Error', 'Failed to switch role');
    }
  };

  const getRoleIcon = (role: UserRole): string => {
    switch (role) {
      case 'HR Manager':
        return 'people';
      case 'Operations Manager':
        return 'analytics';
      case 'Warehouse Staff':
        return 'cube';
      default:
        return 'person';
    }
  };

  const getRoleColor = (role: UserRole): string => {
    switch (role) {
      case 'HR Manager':
        return COLORS.primary;
      case 'Operations Manager':
        return COLORS.secondary;
      case 'Warehouse Staff':
        return COLORS.success;
      default:
        return COLORS.gray[500];
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0] || user?.displayName?.[0] || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.name}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.displayName || 'User'}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Active Role Card */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Role</Text>
        <View style={styles.roleCard}>
          <View style={[styles.roleIcon, { backgroundColor: `${getRoleColor(activeRole || 'Warehouse Staff')}20` }]}>
            <Ionicons
              name={getRoleIcon(activeRole || 'Warehouse Staff') as any}
              size={32}
              color={getRoleColor(activeRole || 'Warehouse Staff')}
            />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleName}>{activeRole}</Text>
            {availableRoles.length > 1 && (
              <Text style={styles.roleSubtext}>
                {availableRoles.length} roles available
              </Text>
            )}
          </View>
          {availableRoles.length > 1 && (
            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setShowRoleSwitcher(!showRoleSwitcher)}
            >
              <Text style={styles.switchButtonText}>Switch</Text>
              <Ionicons
                name={showRoleSwitcher ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Role Switcher */}
        {showRoleSwitcher && availableRoles.length > 1 && (
          <View style={styles.roleSwitcher}>
            {availableRoles
              .filter(role => role !== activeRole)
              .map((role) => (
                <TouchableOpacity
                  key={role}
                  style={styles.roleOption}
                  onPress={() => handleRoleSwitch(role)}
                >
                  <View style={[styles.roleOptionIcon, { backgroundColor: `${getRoleColor(role)}20` }]}>
                    <Ionicons
                      name={getRoleIcon(role) as any}
                      size={24}
                      color={getRoleColor(role)}
                    />
                  </View>
                  <Text style={styles.roleOptionText}>{role}</Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="finger-print" size={24} color={COLORS.text.primary} />
            <Text style={styles.settingText}>Biometric Login</Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: COLORS.gray[300], true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        </View>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.settingText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.text.primary} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* Sign Out Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* App Version */}
      <View style={styles.footer}>
        <Text style={styles.version}>Bereit App v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingTop: SPACING.xxl,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  roleName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  roleSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  switchButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  roleSwitcher: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roleOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  roleOptionText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 12,
    ...SHADOWS.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  signOutText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  version: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
});

export default ProfileScreen;