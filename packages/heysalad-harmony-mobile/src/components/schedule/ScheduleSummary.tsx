import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/colors';

interface SummaryStat {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
  helper?: string;
}

interface ScheduleSummaryProps {
  stats: SummaryStat[];
}

const ScheduleSummary: React.FC<ScheduleSummaryProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View key={stat.label} style={[styles.card, { borderBottomColor: stat.color }]}>
          <View style={[styles.iconWrapper, { backgroundColor: `${stat.color}15` }]}>
            <Ionicons name={stat.icon} size={20} color={stat.color} />
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.label}>{stat.label}</Text>
            <Text style={[styles.value, { color: stat.color }]}>{stat.value}</Text>
            {stat.helper ? <Text style={styles.helper}>{stat.helper}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    borderBottomWidth: 3,
    ...SHADOWS.xs,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  textWrapper: {
    gap: SPACING.xs / 2,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  helper: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
  },
});

export type { SummaryStat };
export default ScheduleSummary;
