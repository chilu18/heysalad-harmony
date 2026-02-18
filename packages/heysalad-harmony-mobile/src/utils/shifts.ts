import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Shift } from '../types/user';

type ShiftStatus = Shift['status'];
type IoniconName = keyof typeof Ionicons.glyphMap;

export const getShiftStatusColor = (status: ShiftStatus): string => {
  switch (status) {
    case 'scheduled':
      return COLORS.info;
    case 'in_progress':
      return COLORS.success;
    case 'completed':
      return COLORS.gray[600];
    case 'cancelled':
      return COLORS.error;
    default:
      return COLORS.gray[500];
  }
};

export const getShiftStatusIcon = (status: ShiftStatus): IoniconName => {
  switch (status) {
    case 'scheduled':
      return 'calendar-outline';
    case 'in_progress':
      return 'flash-outline';
    case 'completed':
      return 'checkmark-done-outline';
    case 'cancelled':
      return 'close-circle-outline';
    default:
      return 'calendar-outline';
  }
};
