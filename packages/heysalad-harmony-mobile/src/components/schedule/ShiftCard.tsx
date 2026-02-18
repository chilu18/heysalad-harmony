import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { Shift } from '../../types/user';
import { format } from 'date-fns';

interface ShiftCardProps {
  shift: Shift;
  onPress?: (shift: Shift) => void;
  getStatusColor: (status: Shift['status']) => string;
  assignedTo?: string;
  variant?: 'manager' | 'staff';
}

const formatShiftDate = (date?: Date) => {
  if (!date) {
    return { day: '--', month: '' };
  }

  return {
    day: format(date, 'dd'),
    month: format(date, 'MMM'),
  };
};

const ShiftCard: React.FC<ShiftCardProps> = ({
  shift,
  onPress,
  getStatusColor,
  assignedTo,
  variant = 'manager',
}) => {
  const handlePress = () => {
    onPress?.(shift);
  };

  if (variant === 'staff') {
    const { day, month } = formatShiftDate(shift.date);
    return (
      <TouchableOpacity
        style={styles.staffCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.staffHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateDay}>{day}</Text>
            <Text style={styles.dateMonth}>{month}</Text>
          </View>

          <View style={styles.staffInfo}>
            <Text style={styles.positionText}>{shift.position}</Text>
            <Text style={styles.timeText}>
              {shift.startTime} - {shift.endTime}
            </Text>
            {shift.notes ? <Text style={styles.notesText}>{shift.notes}</Text> : null}
          </View>

          <View
            style={[
              styles.statusBadgeCircular,
              { backgroundColor: getStatusColor(shift.status) },
            ]}
          >
            <Ionicons name="calendar-outline" size={18} color={COLORS.white} />
          </View>
        </View>

        <View style={styles.staffFooter}>
          <View style={styles.locationInfo}>
            <Ionicons name="location-outline" size={14} color={COLORS.text.secondary} />
            <Text style={styles.locationText}>{shift.warehouseId || 'Assigned Site'}</Text>
          </View>

          <View style={styles.assignmentInfo}>
            <Ionicons name="person-outline" size={14} color={COLORS.text.secondary} />
            <Text style={styles.assignmentText}>
              {assignedTo || 'Managed by Operations'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.shiftCard} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.shiftHeader}>
        <View style={styles.shiftTime}>
          <Ionicons name="time-outline" size={16} color={COLORS.text.secondary} />
          <Text style={styles.timeText}>
            {shift.startTime} - {shift.endTime}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(shift.status)}20` },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(shift.status) }]}>
            {shift.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <Text style={styles.positionText}>{shift.position}</Text>

      {shift.notes ? <Text style={styles.notesText}>{shift.notes}</Text> : null}

      <View style={styles.shiftFooter}>
        <View style={styles.locationInfo}>
          <Ionicons name="location-outline" size={14} color={COLORS.text.secondary} />
          <Text style={styles.locationText}>{shift.warehouseId || 'Unassigned Site'}</Text>
        </View>

        <View style={styles.assignmentInfo}>
          <Ionicons name="people-outline" size={14} color={COLORS.text.secondary} />
          <Text style={styles.assignmentText}>
            {assignedTo || (shift.userId ? 'Assigned' : 'Unassigned')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.gray[400]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shiftCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  shiftTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  timeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textTransform: 'capitalize',
  },
  positionText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  notesText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  shiftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  assignmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  assignmentText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  staffCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  dateContainer: {
    width: 56,
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  dateDay: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  dateMonth: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textTransform: 'uppercase',
  },
  staffInfo: {
    flex: 1,
  },
  statusBadgeCircular: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  staffFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.lg,
  },
});

export default ShiftCard;
