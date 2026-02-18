import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';

interface ShiftFilterBarProps {
  statuses: string[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  warehouses: string[];
  selectedWarehouse: string;
  onWarehouseChange: (warehouse: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ShiftFilterBar: React.FC<ShiftFilterBarProps> = ({
  statuses,
  selectedStatus,
  onStatusChange,
  warehouses,
  selectedWarehouse,
  onWarehouseChange,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search-outline" size={18} color={COLORS.gray[500]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search roles, notes, or team members"
          placeholderTextColor={COLORS.gray[400]}
          value={searchTerm}
          onChangeText={onSearchChange}
          autoCapitalize="none"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {statuses.map((status) => {
          const isActive = selectedStatus === status;
          return (
            <TouchableOpacity
              key={status}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onStatusChange(status)}
            >
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {status.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {warehouses.map((warehouse) => {
          const isActive = selectedWarehouse === warehouse;
          return (
            <TouchableOpacity
              key={warehouse}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onWarehouseChange(warehouse)}
            >
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {warehouse === 'all' ? 'All Locations' : warehouse}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
  },
  chipRow: {
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
  },
  chipActive: {
    backgroundColor: COLORS.primary,
  },
  chipLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.secondary,
    textTransform: 'capitalize',
  },
  chipLabelActive: {
    color: COLORS.white,
  },
});

export default ShiftFilterBar;
