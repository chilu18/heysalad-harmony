import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/colors';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../shared/LoadingScreen';

interface DashboardStats {
  activeEmployees: number;
  clockedInNow: number;
  pendingApprovals: number;
  todayShifts: number;
}

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState<DashboardStats>({
    activeEmployees: 0,
    clockedInNow: 0,
    pendingApprovals: 0,
    todayShifts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('status', '==', 'active')
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      const clockedInQuery = query(
        collection(db, 'timeEntries'),
        where('status', '==', 'active')
      );
      const clockedInSnapshot = await getDocs(clockedInQuery);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const shiftsQuery = query(
        collection(db, 'shifts'),
        where('date', '>=', today)
      );
      const shiftsSnapshot = await getDocs(shiftsQuery);

      setStats({
        activeEmployees: usersSnapshot.size,
        clockedInNow: clockedInSnapshot.size,
        pendingApprovals: 0,
        todayShifts: shiftsSnapshot.size,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleNavigateToDocuments = () => {
    navigation.navigate('Documents' as never);
  };

  const handleNavigateToNotifications = () => {
    navigation.navigate('Notifications' as never);
  };

  const handleNavigateToTraining = () => {
    navigation.navigate('TrainingCatalog' as never);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.welcomeHeader}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.firstName || user?.displayName || 'HR Manager'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNavigateToNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.text.primary} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Grid - 2x2 */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.statValue}>{stats.activeEmployees}</Text>
            <Text style={styles.statLabel}>Active Employees</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSuccess]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.statValue}>{stats.clockedInNow}</Text>
            <Text style={styles.statLabel}>Clocked In Now</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardWarning]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="document-text" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.statValue}>{stats.pendingApprovals}</Text>
            <Text style={styles.statLabel}>Pending Approvals</Text>
          </View>

          <View style={[styles.statCard, styles.statCardInfo]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.statValue}>{stats.todayShifts}</Text>
            <Text style={styles.statLabel}>Today's Shifts</Text>
          </View>
        </View>
      </View>

      {/* Section Divider with Brand Accent */}
      <View style={styles.sectionDivider} />

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('AddEmployee' as never)}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
            <Ionicons name="person-add-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Add New Employee</Text>
            <Text style={styles.actionSubtitle}>Create employee profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('ScheduleOverview' as never)}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.info}15` }]}>
            <Ionicons name="calendar-number-outline" size={24} color={COLORS.info} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Schedule Overview</Text>
            <Text style={styles.actionSubtitle}>Weekly coverage snapshot</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('ScheduleManagement' as never)}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.secondary}15` }]}>
            <Ionicons name="calendar-outline" size={24} color={COLORS.secondary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Schedule Management</Text>
            <Text style={styles.actionSubtitle}>Manage team schedules</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('TimesheetApproval' as never)}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.success}15` }]}>
            <Ionicons name="checkmark-done-outline" size={24} color={COLORS.success} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Approvals</Text>
            <Text style={styles.actionSubtitle}>Leave, timesheets, expenses</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard} 
          onPress={handleNavigateToDocuments}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.info}15` }]}>
            <Ionicons name="document-attach-outline" size={24} color={COLORS.info} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Generate Documents</Text>
            <Text style={styles.actionSubtitle}>Create contracts & reports</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={handleNavigateToTraining}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.success}15` }]}>
            <Ionicons name="school-outline" size={24} color={COLORS.success} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Training Studio</Text>
            <Text style={styles.actionSubtitle}>Create & voice equipment modules</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>
      </View>

      {/* Section Divider */}
      <View style={styles.sectionDivider} />

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={48} color={COLORS.gray[300]} />
          <Text style={styles.emptyText}>No recent activity</Text>
          <Text style={styles.emptySubtext}>Activity will appear here</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greeting: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  name: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: SPACING.sm,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  statsSection: {
    padding: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  statCardPrimary: {
    backgroundColor: COLORS.primary,
  },
  statCardSuccess: {
    backgroundColor: COLORS.success,
  },
  statCardWarning: {
    backgroundColor: COLORS.warning,
  },
  statCardInfo: {
    backgroundColor: COLORS.info,
  },
  statIconContainer: {
    marginBottom: SPACING.md,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.95,
  },
  sectionDivider: {
    height: 3,
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
    borderRadius: 2,
    opacity: 0.2,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  viewAllLink: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  actionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  actionSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
});

export default DashboardScreen;
