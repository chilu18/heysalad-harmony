// src/screens/operations-manager/DashboardScreen.tsx
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
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from '../shared/LoadingScreen';

interface DashboardStats {
  teamMembers: number;
  floorReady: number;
  safetyCompliance: number;
  activeLocations: number;
}

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState<DashboardStats>({
    teamMembers: 0,
    floorReady: 0,
    safetyCompliance: 0,
    activeLocations: 0,
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

      const totalMembers = usersSnapshot.size;
      const clockedIn = clockedInSnapshot.size;
      const floorReadyPercent = totalMembers > 0 ? Math.round((clockedIn / totalMembers) * 100) : 0;

      setStats({
        teamMembers: totalMembers,
        floorReady: floorReadyPercent,
        safetyCompliance: 95,
        activeLocations: 3,
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

  const handleNavigateToNotifications = () => {
    navigation.navigate('Notifications' as never);
  };

  const handleNavigateToAnalytics = () => {
    navigation.navigate('Analytics' as never);
  };

  const handleNavigateToTeam = () => {
    navigation.navigate('Team' as never);
  };

  const handleNavigateToSchedule = () => {
    navigation.navigate('Schedule' as never);
  };

  const handleNavigateToSafety = () => {
    navigation.navigate('Safety' as never);
  };

  const handleNavigateToTraining = () => {
    navigation.navigate('TrainingCatalog' as never);
  };

  const locations = [
    {
      id: 'berlin',
      name: 'Berlin Warehouse',
      headcount: 12,
      status: 'Active',
      pinColor: COLORS.success,
      coordinate: { latitude: 52.520008, longitude: 13.404954 },
    },
    {
      id: 'munich',
      name: 'Munich Distribution',
      headcount: 8,
      status: 'Active',
      pinColor: COLORS.info,
      coordinate: { latitude: 48.135124, longitude: 11.581981 },
    },
    {
      id: 'frankfurt',
      name: 'Frankfurt Hub',
      headcount: 15,
      status: 'Active',
      pinColor: COLORS.primary,
      coordinate: { latitude: 50.110924, longitude: 8.682127 },
    },
  ] as const;

  const mapRegion = {
    latitude: 50.5,
    longitude: 9.5,
    latitudeDelta: 5,
    longitudeDelta: 5,
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.firstName || user?.displayName || 'Operations Manager'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNavigateToNotifications}
        >
          <Ionicons name="notifications-outline" size={24} color={COLORS.text.primary} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Location Status */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Location Status</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapCard}>
          <MapView style={styles.map} initialRegion={mapRegion}>
            {locations.map((location) => (
              <Marker
                key={location.id}
                coordinate={location.coordinate}
                title={location.name}
                description={`${location.headcount} staff on-site • ${location.status}`}
                pinColor={location.pinColor}
              />
            ))}
          </MapView>
          <View style={styles.mapLegend}>
            {locations.map((location) => (
              <View key={`${location.id}-legend`} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: location.pinColor },
                  ]}
                />
                <View style={styles.legendText}>
                  <Text style={styles.legendTitle}>{location.name}</Text>
                  <Text style={styles.legendSubtitle}>
                    {location.headcount} on-site • {location.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Section Divider */}
      <View style={styles.sectionDivider} />

      {/* Stats Grid - 2x2 */}
      <View style={styles.statsSection}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.statValue}>{stats.teamMembers}</Text>
            <Text style={styles.statLabel}>Team Members</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSuccess]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.statValue}>{stats.floorReady}%</Text>
            <Text style={styles.statLabel}>Floor Ready</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardWarning]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="shield-checkmark" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.statValue}>{stats.safetyCompliance}%</Text>
            <Text style={styles.statLabel}>Safety Compliance</Text>
          </View>

          <View style={[styles.statCard, styles.statCardInfo]}>
            <View style={styles.statIconContainer}>
              <Ionicons name="location" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.statValue}>{stats.activeLocations}</Text>
            <Text style={styles.statLabel}>Active Locations</Text>
          </View>
        </View>
      </View>

      {/* Section Divider */}
      <View style={styles.sectionDivider} />

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={handleNavigateToAnalytics}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.primary}15` }]}>
            <Ionicons name="analytics-outline" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>View Analytics</Text>
            <Text style={styles.actionSubtitle}>Performance & metrics</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={handleNavigateToTeam}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.secondary}15` }]}>
            <Ionicons name="people-outline" size={24} color={COLORS.secondary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Team Overview</Text>
            <Text style={styles.actionSubtitle}>View all team members</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={handleNavigateToSchedule}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.success}15` }]}>
            <Ionicons name="calendar-outline" size={24} color={COLORS.success} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Schedule Overview</Text>
            <Text style={styles.actionSubtitle}>Manage shifts & coverage</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={handleNavigateToSafety}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.warning}15` }]}>
            <Ionicons name="shield-outline" size={24} color={COLORS.warning} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Safety Reports</Text>
            <Text style={styles.actionSubtitle}>View compliance status</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={handleNavigateToTraining}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${COLORS.info}15` }]}>
            <Ionicons name="school-outline" size={24} color={COLORS.info} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Training Catalog</Text>
            <Text style={styles.actionSubtitle}>Generate assets & assign modules</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>
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
  mapCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 220,
  },
  mapLegend: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    flex: 1,
  },
  legendTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  legendSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
  },
});

export default DashboardScreen;
