import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { db } from '../../services/firebase/config';
import { Shift } from '../../types/user';
import ScheduleSummary, { SummaryStat } from '../../components/schedule/ScheduleSummary';
import ShiftFilterBar from '../../components/schedule/ShiftFilterBar';
import ShiftCard from '../../components/schedule/ShiftCard';
import { getShiftStatusColor } from '../../utils/shifts';

const STATUS_OPTIONS = ['all', 'scheduled', 'in_progress', 'completed', 'cancelled'];

const ScheduleOverviewScreen: React.FC = () => {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekShifts, setWeekShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadWeekShifts = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true);
      }
      const weekEnd = addDays(weekStart, 7);

      const shiftsQuery = query(
        collection(db, 'shifts'),
        where('date', '>=', Timestamp.fromDate(weekStart)),
        where('date', '<', Timestamp.fromDate(weekEnd)),
        orderBy('date', 'asc')
      );

      const snapshot = await getDocs(shiftsQuery);
      const shiftsData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
          startTime: data.startTime,
          endTime: data.endTime,
          position: data.position,
          warehouseId: data.warehouseId,
          status: data.status,
          notes: data.notes,
        } as Shift;
      });

      setWeekShifts(shiftsData);
    } catch (error) {
      console.error('Error loading weekly shifts:', error);
    } finally {
      if (showSpinner) {
        setLoading(false);
      }
      setRefreshing(false);
    }
  }, [weekStart]);

  useEffect(() => {
    setSelectedDate(weekStart);
  }, [weekStart]);

  useEffect(() => {
    loadWeekShifts();
  }, [loadWeekShifts]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }, [weekStart]);

  const handleChangeWeek = (direction: 'previous' | 'next') => {
    setWeekStart((prev) => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const filteredShifts = useMemo(() => {
    const dayShifts = weekShifts.filter((shift) => isSameDay(shift.date, selectedDate));

    let next = [...dayShifts];

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

    return next;
  }, [weekShifts, selectedDate, selectedStatus, selectedWarehouse, searchTerm]);

  const warehouseOptions = useMemo(() => {
    const unique = new Set<string>();
    weekShifts.forEach((shift) => {
      if (shift.warehouseId) {
        unique.add(shift.warehouseId);
      } else {
        unique.add('unassigned');
      }
    });
    return ['all', ...Array.from(unique)];
  }, [weekShifts]);

  const summaryStats: SummaryStat[] = useMemo(() => {
    const totalShifts = weekShifts.length;
    const filledShifts = weekShifts.filter((shift) => !!shift.userId).length;
    const unassigned = totalShifts - filledShifts;
    const scheduled = weekShifts.filter((shift) => shift.status === 'scheduled').length;
    const inProgress = weekShifts.filter((shift) => shift.status === 'in_progress').length;

    const requiredShifts = 5 * 7; // default capacity target
    const coverage =
      requiredShifts > 0 ? Math.min(100, Math.round((filledShifts / requiredShifts) * 100)) : 0;

    return [
      {
        icon: 'calendar-outline',
        label: 'Total Shifts',
        value: totalShifts,
        color: COLORS.primary,
        helper: `${filledShifts} filled • ${unassigned} open`,
      },
      {
        icon: 'people-outline',
        label: 'Coverage',
        value: coverage,
        color: COLORS.success,
        helper: 'Target: 35 shifts',
      },
      {
        icon: 'time-outline',
        label: 'Scheduled',
        value: scheduled,
        color: COLORS.info,
      },
      {
        icon: 'flash-outline',
        label: 'In Progress',
        value: inProgress,
        color: COLORS.warning,
      },
    ];
  }, [weekShifts]);

  const onRefresh = () => {
    setRefreshing(true);
    loadWeekShifts(false);
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.weekButton} onPress={() => handleChangeWeek('previous')}>
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Week of</Text>
          <Text style={styles.headerSubtitle}>
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
          </Text>
        </View>

        <TouchableOpacity style={styles.weekButton} onPress={() => handleChangeWeek('next')}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScheduleSummary stats={summaryStats} />

      <View style={styles.weekRow}>
        {weekDays.map((day) => {
          const dayShifts = weekShifts.filter((shift) => isSameDay(shift.date, day));
          const unassigned = dayShifts.filter((shift) => !shift.userId).length;

          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayCard,
                isSelected && styles.dayCardSelected,
                isToday && styles.dayCardToday,
              ]}
              onPress={() => setSelectedDate(day)}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelected && styles.dayNameSelected,
                  isToday && styles.dayNameToday,
                ]}
              >
                {format(day, 'EEE')}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberSelected,
                  isToday && styles.dayNumberToday,
                ]}
              >
                {format(day, 'd')}
              </Text>
              <View style={styles.dayMeta}>
                <View style={styles.dayMetaRow}>
                  <Ionicons name="people-outline" size={12} color={COLORS.text.secondary} />
                  <Text style={styles.dayMetaText}>{dayShifts.length}</Text>
                </View>
                <View style={styles.dayMetaRow}>
                  <Ionicons name="alert-circle-outline" size={12} color={COLORS.warning} />
                  <Text style={styles.dayMetaText}>{unassigned}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

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
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color={COLORS.gray[300]} />
          <Text style={styles.emptyText}>No shifts match your filters</Text>
          <Text style={styles.emptySubtext}>
            Adjust filters or change the day to see more shifts
          </Text>
        </View>
      ) : (
        filteredShifts.map((shift) => (
          <ShiftCard
            key={shift.id}
            shift={shift}
            onPress={() => {}}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  weekButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  dayCard: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dayCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  dayCardToday: {
    borderColor: COLORS.secondary,
  },
  dayName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
  },
  dayNameSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  dayNameToday: {
    color: COLORS.secondary,
  },
  dayNumber: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  dayNumberSelected: {
    color: COLORS.primary,
  },
  dayNumberToday: {
    color: COLORS.secondary,
  },
  dayMeta: {
    width: '100%',
    gap: 4,
  },
  dayMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dayMetaText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
  },
  emptyState: {
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

export default ScheduleOverviewScreen;
