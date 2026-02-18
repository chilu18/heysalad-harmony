import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Shift } from '../../types/user';
import ScheduleSummary, { SummaryStat } from '../../components/schedule/ScheduleSummary';
import ShiftFilterBar from '../../components/schedule/ShiftFilterBar';
import ShiftCard from '../../components/schedule/ShiftCard';
import { getShiftStatusColor } from '../../utils/shifts';

const STATUS_OPTIONS: string[] = ['all', 'scheduled', 'in_progress', 'completed', 'cancelled'];

const ScheduleScreen: React.FC = () => {
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadShifts = useCallback(async () => {
    if (!user) {
      setShifts([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setLoading(true);
      const shiftsQuery = query(
        collection(db, 'shifts'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(shiftsQuery);
      const shiftsData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
          startTime: data.startTime,
          endTime: data.endTime,
          position: data.position,
          warehouseId: data.warehouseId,
          status: data.status,
          notes: data.notes,
        } as Shift;
      });

      setShifts(shiftsData);
    } catch (error) {
      console.error('Error loading shifts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  const applyFilters = useCallback(() => {
    let next = [...shifts];

    if (selectedStatus !== 'all') {
      next = next.filter((shift) => shift.status === selectedStatus);
    }

    if (selectedWarehouse !== 'all') {
      if (selectedWarehouse === 'unassigned') {
        next = next.filter((shift) => !shift.warehouseId);
      } else {
        next = next.filter(
          (shift) => (shift.warehouseId || '').toLowerCase() === selectedWarehouse.toLowerCase()
        );
      }
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      next = next.filter((shift) => {
        const haystack = [shift.position, shift.notes, shift.warehouseId]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    setFilteredShifts(next);
  }, [shifts, selectedStatus, selectedWarehouse, searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const warehouseOptions = useMemo(() => {
    const unique = new Set<string>();
    shifts.forEach((shift) => {
      if (shift.warehouseId) {
        unique.add(shift.warehouseId);
      } else {
        unique.add('unassigned');
      }
    });
    return ['all', ...Array.from(unique)];
  }, [shifts]);

  const summaryStats: SummaryStat[] = useMemo(() => {
    const now = new Date();
    const upcoming = shifts.filter(
      (shift) =>
        (shift.status === 'scheduled' || shift.status === 'in_progress') &&
        shift.date >= now
    );
    const completed = shifts.filter((shift) => shift.status === 'completed');
    const inProgress = shifts.filter((shift) => shift.status === 'in_progress');
    const cancelled = shifts.filter((shift) => shift.status === 'cancelled');

    const nextShift = upcoming.sort((a, b) => a.date.getTime() - b.date.getTime())[0];
    const nextShiftHelper = nextShift
      ? `Next: ${format(nextShift.date, 'EEE • HH:mm')}`
      : 'No upcoming shifts';

    return [
      {
        icon: 'calendar-outline',
        label: 'Upcoming',
        value: upcoming.length,
        color: COLORS.primary,
        helper: nextShiftHelper,
      },
      {
        icon: 'flash-outline',
        label: 'On Shift',
        value: inProgress.length,
        color: COLORS.success,
      },
      {
        icon: 'checkmark-done-outline',
        label: 'Completed',
        value: completed.length,
        color: COLORS.secondary,
      },
      {
        icon: 'close-circle-outline',
        label: 'Cancelled',
        value: cancelled.length,
        color: COLORS.error,
      },
    ];
  }, [shifts]);

  const onRefresh = () => {
    setRefreshing(true);
    loadShifts();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <ScheduleSummary stats={summaryStats} />

      <ShiftFilterBar
        statuses={STATUS_OPTIONS}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        warehouses={warehouseOptions}
        selectedWarehouse={selectedWarehouse}
        onWarehouseChange={setSelectedWarehouse}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filteredShifts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color={COLORS.gray[300]} />
          <Text style={styles.emptyText}>No shifts match your filters</Text>
          <Text style={styles.emptySubtext}>Adjust filters to view more shifts</Text>
        </View>
      ) : (
        filteredShifts.map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            variant="staff"
            getStatusColor={getShiftStatusColor}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default ScheduleScreen;
