// src/screens/operations-manager/AnalyticsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { seedFirebaseData } from '../../utils/seedData';
import LoadingScreen from '../shared/LoadingScreen';

interface AnalyticsData {
  totalHours: number;
  avgHoursPerDay: number;
  productivity: number;
  attendance: number;
  onTimeClockIns: number;
  lateClockIns: number;
  totalShifts: number;
  completedShifts: number;
  activeEmployees: number;
}

const AnalyticsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalHours: 0,
    avgHoursPerDay: 0,
    productivity: 0,
    attendance: 0,
    onTimeClockIns: 0,
    lateClockIns: 0,
    totalShifts: 0,
    completedShifts: 0,
    activeEmployees: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      console.log('📊 Loading analytics...');
      
      // Get time entries from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const timeEntriesRef = collection(db, 'timeEntries');
      const timeEntriesQuery = query(
        timeEntriesRef,
        where('clockIn', '>=', Timestamp.fromDate(thirtyDaysAgo))
      );
      
      const timeEntriesSnapshot = await getDocs(timeEntriesQuery);
      console.log(`📝 Found ${timeEntriesSnapshot.size} time entries`);
      
      let totalHours = 0;
      let onTime = 0;
      let late = 0;
      
      timeEntriesSnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Calculate hours worked
        if (data.clockOut && data.clockIn) {
          const clockInTime = data.clockIn.toDate();
          const clockOutTime = data.clockOut.toDate();
          const hours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
          totalHours += hours;
        }
        
        // Check if on time (before 8:15 AM)
        const clockIn = data.clockIn?.toDate();
        if (clockIn) {
          const clockInHour = clockIn.getHours();
          const clockInMinute = clockIn.getMinutes();
          if (clockInHour < 8 || (clockInHour === 8 && clockInMinute <= 15)) {
            onTime++;
          } else {
            late++;
          }
        }
      });
      
      // Get shifts data
      const shiftsRef = collection(db, 'shifts');
      const shiftsSnapshot = await getDocs(shiftsRef);
      console.log(`📅 Found ${shiftsSnapshot.size} shifts`);
      
      let totalShifts = 0;
      let completedShifts = 0;
      
      shiftsSnapshot.forEach((doc) => {
        const data = doc.data();
        totalShifts++;
        
        // Check if shift is in the past and marked as completed
        if (data.endTime) {
          const shiftEnd = typeof data.endTime.toDate === 'function' 
            ? data.endTime.toDate() 
            : new Date(data.endTime);
          
          if (shiftEnd < new Date()) {
            completedShifts++;
          }
        }
      });
      
      // Get active employees
      const usersRef = collection(db, 'users');
      const usersQuery = query(usersRef, where('status', '==', 'active'));
      const usersSnapshot = await getDocs(usersQuery);
      console.log(`👥 Found ${usersSnapshot.size} active employees`);
      
      // Calculate metrics
      const avgHours = totalHours / 30;
      const attendanceRate = totalShifts > 0 ? (completedShifts / totalShifts) * 100 : 0;
      const productivityRate = totalShifts > 0 ? Math.min((totalHours / (totalShifts * 8)) * 100, 100) : 0;
      
      setAnalytics({
        totalHours: Math.round(totalHours),
        avgHoursPerDay: Math.round(avgHours * 10) / 10,
        productivity: Math.round(productivityRate),
        attendance: Math.round(attendanceRate),
        onTimeClockIns: onTime,
        lateClockIns: late,
        totalShifts,
        completedShifts,
        activeEmployees: usersSnapshot.size,
      });
      
      console.log('✅ Analytics loaded successfully');
      
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
      Alert.alert('Error', 'Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  const handleSeedData = async () => {
    Alert.alert(
      'Seed Test Data',
      'This will add test users, shifts, and time entries to Firebase. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed Data',
          onPress: async () => {
            setSeeding(true);
            try {
              console.log('🌱 Starting seed process...');
              const result = await seedFirebaseData();
              
              if (result.success) {
                Alert.alert(
                  '✅ Success!',
                  'Test data has been added to Firebase. Pull down to refresh and see updated analytics.',
                  [{ 
                    text: 'Refresh Now', 
                    onPress: () => {
                      setRefreshing(true);
                      loadAnalytics();
                    }
                  }]
                );
              } else {
                Alert.alert('Error', result.error || 'Failed to seed data');
              }
            } catch (error: any) {
              console.error('❌ Seed error:', error);
              Alert.alert('Error', error.message || 'Failed to seed data');
            } finally {
              setSeeding(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics Overview</Text>
        <Text style={styles.subtitle}>Last 30 days performance</Text>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Ionicons name="time-outline" size={32} color={COLORS.primary} />
          <Text style={styles.metricValue}>{analytics.totalHours}h</Text>
          <Text style={styles.metricLabel}>Total Hours</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="trending-up" size={32} color={COLORS.success} />
          <Text style={styles.metricValue}>{analytics.productivity}%</Text>
          <Text style={styles.metricLabel}>Productivity</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="people-outline" size={32} color={COLORS.secondary} />
          <Text style={styles.metricValue}>{analytics.attendance}%</Text>
          <Text style={styles.metricLabel}>Attendance</Text>
        </View>

        <View style={styles.metricCard}>
          <Ionicons name="calendar-outline" size={32} color={COLORS.info} />
          <Text style={styles.metricValue}>{analytics.avgHoursPerDay}h</Text>
          <Text style={styles.metricLabel}>Avg/Day</Text>
        </View>
      </View>

      {/* Attendance Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance Details</Text>
        
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>On Time</Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {analytics.onTimeClockIns}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Late</Text>
            <Text style={[styles.statValue, { color: COLORS.error }]}>
              {analytics.lateClockIns}
            </Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Shifts</Text>
            <Text style={styles.statValue}>{analytics.totalShifts}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{analytics.completedShifts}</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Active Employees</Text>
            <Text style={[styles.statValue, { color: COLORS.primary }]}>
              {analytics.activeEmployees}
            </Text>
          </View>
        </View>
      </View>

      {/* Performance Indicators */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Indicators</Text>
        
        <View style={styles.indicatorRow}>
          <Text style={styles.indicatorLabel}>Productivity Rate</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${analytics.productivity}%`,
                  backgroundColor: analytics.productivity >= 80 ? COLORS.success : analytics.productivity >= 60 ? COLORS.warning : COLORS.error
                }
              ]} 
            />
          </View>
          <Text style={styles.indicatorValue}>{analytics.productivity}%</Text>
        </View>

        <View style={styles.indicatorRow}>
          <Text style={styles.indicatorLabel}>Attendance Rate</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${analytics.attendance}%`,
                  backgroundColor: analytics.attendance >= 90 ? COLORS.success : analytics.attendance >= 70 ? COLORS.warning : COLORS.error
                }
              ]} 
            />
          </View>
          <Text style={styles.indicatorValue}>{analytics.attendance}%</Text>
        </View>
      </View>

      {/* Info - Data is now seeded */}
      <View style={styles.infoBox}>
        <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
        <Text style={[styles.infoText, { color: COLORS.success }]}>
           Pull down to refresh.
        </Text>
      </View>

      <View style={{ height: SPACING.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricValue: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.sm,
  },
  metricLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  indicatorRow: {
    marginVertical: SPACING.sm,
  },
  indicatorLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    marginBottom: 4,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.gray[200],
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  indicatorValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textAlign: 'right',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  seedButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  seedButtonDisabled: {
    opacity: 0.6,
  },
  seedButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.info}15`,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.info,
  },
});

export default AnalyticsScreen;