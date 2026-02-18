import React, { useState, useEffect } from 'react';
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
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import { TimeEntry } from '../../types/user';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type ApprovalFilter = ApprovalStatus | 'all';

interface TimeEntryWithUser extends TimeEntry {
  userName: string;
  userEmail: string;
  approvalStatus: ApprovalStatus;
  handledAt?: Date;
}

const TimesheetApprovalScreen: React.FC = () => {
  const navigation = useNavigation();
  const [entries, setEntries] = useState<TimeEntryWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApprovalFilter>('pending');

  const filterOptions: { label: string; value: ApprovalFilter }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'All', value: 'all' },
  ];

  useEffect(() => {
    loadTimeEntries();
  }, []);

  const loadTimeEntries = async () => {
    setLoading(true);
    try {
      // Get completed time entries
      const entriesQuery = query(
        collection(db, 'timeEntries'),
        where('status', '==', 'completed')
      );

      const snapshot = await getDocs(entriesQuery);
      const entriesData: TimeEntryWithUser[] = [];

      for (const entryDoc of snapshot.docs) {
        const entryData = entryDoc.data();
        
        // Get user info
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('uid', '==', entryData.userId)
        ));

        const userData = userDoc.docs[0]?.data();

        const approvalStatus =
          (entryData.approvalStatus as ApprovalStatus | undefined) || 'pending';
        const handledAt = entryData.handledAt?.toDate
          ? entryData.handledAt.toDate()
          : undefined;

        entriesData.push({
          id: entryDoc.id,
          userId: entryData.userId,
          clockIn: entryData.clockIn?.toDate() || new Date(),
          clockOut: entryData.clockOut?.toDate(),
          duration: entryData.duration,
          location: entryData.location,
          warehouseId: entryData.warehouseId,
          status: entryData.status,
          userName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || userData?.displayName || 'Unknown',
          userEmail: userData?.email || '',
          approvalStatus,
          handledAt,
        });
      }

      const statusPriority: Record<ApprovalStatus, number> = {
        pending: 0,
        approved: 1,
        rejected: 2,
      };

      entriesData.sort((a, b) => {
        const statusDiff =
          statusPriority[a.approvalStatus] - statusPriority[b.approvalStatus];
        if (statusDiff !== 0) {
          return statusDiff;
        }
        return (b.clockIn?.getTime?.() || 0) - (a.clockIn?.getTime?.() || 0);
      });

      setEntries(entriesData);
    } catch (error) {
      console.error('Error loading time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (entry: TimeEntryWithUser) => {
    if (entry.approvalStatus === 'approved') {
      Alert.alert('Already approved', 'This request has already been approved.');
      return;
    }
    if (entry.approvalStatus === 'rejected') {
      Alert.alert('Request rejected', 'Reopen the request before approving.');
      return;
    }

    Alert.alert(
      'Approve request',
      `Approve ${formatDuration(entry.duration || 0)} for ${entry.userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'timeEntries', entry.id), {
                approvalStatus: 'approved',
                handledAt: Timestamp.now(),
              });

              await loadTimeEntries();
              Alert.alert('Success', 'Approval recorded');
            } catch (error) {
              console.error('Error approving entry:', error);
              Alert.alert('Error', 'Failed to record approval');
            }
          },
        },
      ]
    );
  };

  const handleReject = (entry: TimeEntryWithUser) => {
    if (entry.approvalStatus === 'rejected') {
      Alert.alert('Already rejected', 'This request has already been rejected.');
      return;
    }
    if (entry.approvalStatus === 'approved') {
      Alert.alert('Already approved', 'Approved requests cannot be rejected.');
      return;
    }

    Alert.alert(
      'Reject request',
      `Reject the entry for ${entry.userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateDoc(doc(db, 'timeEntries', entry.id), {
                approvalStatus: 'rejected',
                handledAt: Timestamp.now(),
              });

              await loadTimeEntries();
              Alert.alert('Success', 'Request rejected');
            } catch (error) {
              console.error('Error rejecting entry:', error);
              Alert.alert('Error', 'Failed to reject request');
            }
          },
        },
      ]
    );
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredEntries = entries.filter((entry) =>
    filter === 'all' ? true : entry.approvalStatus === filter
  );

  const emptyStateCopy = (() => {
    switch (filter) {
      case 'approved':
        return {
          title: 'No approved records',
          subtitle: 'Approvals will appear here once processed',
        };
      case 'rejected':
        return {
          title: 'No rejected records',
          subtitle: 'Declined requests will appear here if any',
        };
      case 'all':
        return {
          title: 'No approval records',
          subtitle: 'Start by reviewing pending requests',
        };
      default:
        return {
          title: 'No pending approvals',
          subtitle: 'Everything is up to date',
        };
    }
  })();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approvals</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {filterOptions.map((option) => {
          const isActive = filter === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => setFilter(option.value)}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {filteredEntries.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-done-outline" size={64} color={COLORS.gray[300]} />
              <Text style={styles.emptyText}>{emptyStateCopy.title}</Text>
              <Text style={styles.emptySubtext}>{emptyStateCopy.subtitle}</Text>
            </View>
          ) : (
            filteredEntries.map((entry) => {
              const statusLabel =
                entry.approvalStatus === 'approved'
                  ? 'Approved'
                  : entry.approvalStatus === 'rejected'
                  ? 'Rejected'
                  : 'Pending';

              const badgeContainerStyle =
                entry.approvalStatus === 'approved'
                  ? styles.statusBadgeApproved
                  : entry.approvalStatus === 'rejected'
                  ? styles.statusBadgeRejected
                  : styles.statusBadgePending;

              const badgeTextStyle =
                entry.approvalStatus === 'approved'
                  ? styles.statusBadgeTextApproved
                  : entry.approvalStatus === 'rejected'
                  ? styles.statusBadgeTextRejected
                  : styles.statusBadgeTextPending;

              const processedIcon =
                entry.approvalStatus === 'approved'
                  ? 'checkmark-circle-outline'
                  : 'close-circle-outline';
              const processedColor =
                entry.approvalStatus === 'approved' ? COLORS.success : COLORS.error;
              const processedText =
                entry.approvalStatus === 'approved'
                  ? `Approved ${entry.handledAt ? `on ${formatDateTime(entry.handledAt)}` : ''}`
                  : `Rejected ${entry.handledAt ? `on ${formatDateTime(entry.handledAt)}` : ''}`;

              return (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <View style={styles.userInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {entry.userName[0]?.toUpperCase() || 'U'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.userName}>{entry.userName}</Text>
                        <Text style={styles.userEmail}>{entry.userEmail}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, badgeContainerStyle]}>
                      <Text style={[styles.statusBadgeText, badgeTextStyle]}>
                        {statusLabel}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.entryDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color={COLORS.text.secondary} />
                      <Text style={styles.detailText}>{formatDate(entry.clockIn)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color={COLORS.text.secondary} />
                      <Text style={styles.detailText}>
                        {formatTime(entry.clockIn)} -{' '}
                        {entry.clockOut ? formatTime(entry.clockOut) : 'In Progress'}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="hourglass-outline" size={16} color={COLORS.text.secondary} />
                      <Text style={styles.detailText}>
                        {entry.duration ? formatDuration(entry.duration) : 'Pending entry'}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={16} color={COLORS.text.secondary} />
                      <Text style={styles.detailText}>{entry.warehouseId}</Text>
                    </View>
                  </View>

                  {entry.approvalStatus === 'pending' ? (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleReject(entry)}
                      >
                        <Ionicons name="close-circle-outline" size={20} color={COLORS.error} />
                        <Text style={styles.rejectButtonText}>Reject</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleApprove(entry)}
                      >
                        <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
                        <Text style={styles.approveButtonText}>Approve</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.processedRow}>
                      <Ionicons name={processedIcon} size={18} color={processedColor} />
                      <Text style={[styles.processedText, { color: processedColor }]}>
                        {processedText.trim() || statusLabel}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {
    borderBottomColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.secondary,
  },
  filterTabTextActive: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
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
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  entryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  entryDetails: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textTransform: 'uppercase',
  },
  statusBadgePending: {
    backgroundColor: `${COLORS.warning}10`,
  },
  statusBadgeApproved: {
    backgroundColor: `${COLORS.success}15`,
  },
  statusBadgeRejected: {
    backgroundColor: `${COLORS.error}10`,
  },
  statusBadgeTextPending: {
    color: COLORS.warning,
  },
  statusBadgeTextApproved: {
    color: COLORS.success,
  },
  statusBadgeTextRejected: {
    color: COLORS.error,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  approveButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  rejectButtonText: {
    color: COLORS.error,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  processedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  processedText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});

export default TimesheetApprovalScreen;
