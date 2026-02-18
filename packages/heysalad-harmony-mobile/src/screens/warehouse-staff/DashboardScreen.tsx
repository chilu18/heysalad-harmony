import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import LoadingScreen from '../shared/LoadingScreen';
import { useNavigation } from '@react-navigation/native';

export const WarehouseStaffDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onboardingTasks = [
    { id: 1, title: 'Safety Training', completed: true },
    { id: 2, title: 'ID Verified', completed: true },
    { id: 3, title: 'Equipment Request', completed: false },
    { id: 4, title: 'System Access', completed: false },
    { id: 5, title: 'Team Introduction', completed: false },
    { id: 6, title: 'First Shift Completion', completed: false },
  ];

  const upcomingShifts = [
    { date: 'Today', time: '14:00 - 22:00', location: 'Warehouse A' },
    { date: 'Tomorrow', time: '06:00 - 14:00', location: 'Warehouse B' },
    { date: 'Oct 7', time: '14:00 - 22:00', location: 'Warehouse A' },
  ];

  const completedCount = onboardingTasks.filter(task => task.completed).length;
  const progress = (completedCount / onboardingTasks.length) * 100;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate loading data
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
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
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.firstName || user?.displayName || 'Team Member'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Onboarding Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>Onboarding Progress</Text>
            <Text style={styles.progressSubtitle}>
              {completedCount} of {onboardingTasks.length} tasks completed
            </Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue Onboarding</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: `${COLORS.primary}20` }]}>
              <Ionicons name="time-outline" size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.actionText}>Clock In/Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: `${COLORS.secondary}20` }]}>
              <Ionicons name="calendar-outline" size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.actionText}>My Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: `${COLORS.info}20` }]}>
              <Ionicons name="document-text-outline" size={28} color={COLORS.info} />
            </View>
            <Text style={styles.actionText}>Documents</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('TrainingCatalog' as never)}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${COLORS.success}20` }]}>
              <Ionicons name="school-outline" size={28} color={COLORS.success} />
            </View>
            <Text style={styles.actionText}>Training Catalog</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: `${COLORS.success}20` }]}>
              <Ionicons name="help-circle-outline" size={28} color={COLORS.success} />
            </View>
            <Text style={styles.actionText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Shifts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
        <View style={styles.shiftsList}>
          {upcomingShifts.map((shift, index) => (
            <View key={index} style={styles.shiftCard}>
              <View style={styles.shiftIcon}>
                <Ionicons name="time" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.shiftInfo}>
                <Text style={styles.shiftDate}>{shift.date}</Text>
                <Text style={styles.shiftTime}>{shift.time}</Text>
                <Text style={styles.shiftLocation}>{shift.location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
            </View>
          ))}
        </View>
      </View>

      {/* Onboarding Checklist */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Checklist</Text>
        <View style={styles.checklistContainer}>
          {onboardingTasks.map((task) => (
            <View key={task.id} style={styles.checklistItem}>
              <View style={[
                styles.checkbox,
                task.completed && styles.checkboxCompleted
              ]}>
                {task.completed && (
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                )}
              </View>
              <Text style={[
                styles.checklistText,
                task.completed && styles.checklistTextCompleted
              ]}>
                {task.title}
              </Text>
            </View>
          ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
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
    padding: SPACING.sm,
  },
  progressCard: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: `${COLORS.primary}30`,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  progressTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  progressSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  progressBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  progressPercentage: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    gap: SPACING.sm,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  shiftsList: {
    gap: SPACING.sm,
  },
  shiftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shiftIcon: {
    width: 48,
    height: 48,
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shiftInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  shiftDate: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  shiftTime: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  shiftLocation: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  checklistContainer: {
    gap: SPACING.sm,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checklistText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    flex: 1,
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.text.secondary,
  },
});
