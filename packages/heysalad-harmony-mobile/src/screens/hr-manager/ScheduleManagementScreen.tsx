import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { collection, query, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { Shift } from '../../types/user';
import ShiftCard from '../../components/schedule/ShiftCard';
import ShiftFilterBar from '../../components/schedule/ShiftFilterBar';
import ScheduleSummary, { SummaryStat } from '../../components/schedule/ScheduleSummary';
import { getShiftStatusColor } from '../../utils/shifts';

const ScheduleManagementScreen: React.FC = () => {
  const navigation = useNavigation();
  const [dailyShifts, setDailyShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const applyFilters = useCallback(() => {
    let next = [...dailyShifts];

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
        const haystack = [
          shift.position,
          shift.notes,
          shift.warehouseId,
          shift.userId,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    setFilteredShifts(next);
  }, [dailyShifts, selectedStatus, selectedWarehouse, searchTerm]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadShifts = useCallback(async () => {
    try {
      setLoading(true);
      const shiftsQuery = query(collection(db, 'shifts'));
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

      const sameDayShifts = shiftsData.filter((shift) => {
        const shiftDate = new Date(shift.date);
        return shiftDate.toDateString() === selectedDate.toDateString();
      });

      setDailyShifts(sameDayShifts);
    } catch (error) {
      console.error('Error loading shifts:', error);
      Alert.alert('Error', 'Failed to load shifts');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadShifts();
  }, [loadShifts]);

  const handleCreateShift = () => {
    navigation.navigate('CreateShift' as never);
  };

  const handleEditShift = (shift: Shift) => {
    Alert.alert('Shift Details', `Edit shift for ${shift.position}`);
  };

  const statuses = useMemo(
    () => ['all', 'scheduled', 'in_progress', 'completed', 'cancelled'],
    []
  );

  const warehouseOptions = useMemo(() => {
    const unique = new Set<string>();
    dailyShifts.forEach((shift) => {
      if (shift.warehouseId) {
        unique.add(shift.warehouseId);
      } else {
        unique.add('unassigned');
      }
    });
    return ['all', ...Array.from(unique)];
  }, [dailyShifts]);

  const summaryStats: SummaryStat[] = useMemo(() => {
    const total = dailyShifts.length;
    const unassigned = dailyShifts.filter((shift) => !shift.userId).length;
    const scheduled = dailyShifts.filter((shift) => shift.status === 'scheduled').length;
    const active = dailyShifts.filter((shift) => shift.status === 'in_progress').length;

    return [
      {
        icon: 'calendar-outline',
        label: 'Shifts Today',
        value: total,
        color: COLORS.primary,
        helper: 'Total scheduled headcount',
      },
      {
        icon: 'alert-circle-outline',
        label: 'Unassigned',
        value: unassigned,
        color: COLORS.warning,
        helper: unassigned ? 'Needs coverage' : 'All covered',
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
        value: active,
        color: COLORS.success,
      },
    ];
  }, [dailyShifts]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleCreateShift} style={{ marginRight: 16 }}>
          <Ionicons name="add-circle" size={28} color={COLORS.white} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() - 1);
            setSelectedDate(newDate);
          }}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            const newDate = new Date(selectedDate);
            newDate.setDate(newDate.getDate() + 1);
            setSelectedDate(newDate);
          }}
        >
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <ScheduleSummary stats={summaryStats} />

          <ShiftFilterBar
            statuses={statuses}
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
              <Text style={styles.emptySubtext}>Adjust filters or tap + to create a shift</Text>
            </View>
          ) : (
            filteredShifts.map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                onPress={handleEditShift}
                getStatusColor={getShiftStatusColor}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateButton: {
    padding: SPACING.sm,
  },
  dateDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
});

export default ScheduleManagementScreen;
