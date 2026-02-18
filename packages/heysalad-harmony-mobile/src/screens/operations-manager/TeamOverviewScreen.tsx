// src/screens/operations-manager/TeamOverviewScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import LoadingScreen from '../shared/LoadingScreen';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: string;
  shiftsToday: number;
  hoursThisWeek: number;
  clockedIn: boolean;
}

const TeamOverviewScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeToday: 0,
    clockedIn: 0,
    onLeave: 0,
  });

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      console.log('👥 Loading team data...');
      
      // Get all users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      console.log(`📝 Found ${usersSnapshot.size} users`);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = Timestamp.fromDate(today);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoTimestamp = Timestamp.fromDate(weekAgo);
      
      const members: TeamMember[] = [];
      
      // Process each user
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        
        // Get today's shifts for this user
        const shiftsRef = collection(db, 'shifts');
        const todayShiftsQuery = query(
          shiftsRef,
          where('userId', '==', userData.id || userDoc.id),
          where('startTime', '>=', todayTimestamp)
        );
        const shiftsSnapshot = await getDocs(todayShiftsQuery);
        
        // Get this week's time entries
        const timeEntriesRef = collection(db, 'timeEntries');
        const weekEntriesQuery = query(
          timeEntriesRef,
          where('userId', '==', userData.id || userDoc.id),
          where('clockIn', '>=', weekAgoTimestamp)
        );
        const entriesSnapshot = await getDocs(weekEntriesQuery);
        
        let weekHours = 0;
        let isClockedIn = false;
        
        entriesSnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Calculate hours if both clockIn and clockOut exist
          if (data.clockIn && data.clockOut) {
            const clockInTime = data.clockIn.toDate();
            const clockOutTime = data.clockOut.toDate();
            const hours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
            weekHours += hours;
          }
          
          // Check if currently clocked in (no clockOut)
          if (data.clockIn && !data.clockOut && data.status === 'active') {
            isClockedIn = true;
          }
        });
        
        members.push({
          id: userDoc.id,
          name: userData.name || userData.displayName || 'Unknown',
          email: userData.email || '',
          roles: Array.isArray(userData.roles) ? userData.roles : ['Unknown'],
          status: userData.status || 'active',
          shiftsToday: shiftsSnapshot.size,
          hoursThisWeek: Math.round(weekHours * 10) / 10,
          clockedIn: isClockedIn,
        });
      }
      
      // Calculate stats
      const activeToday = members.filter(m => m.shiftsToday > 0).length;
      const clockedIn = members.filter(m => m.clockedIn).length;
      const onLeave = members.filter(m => m.status !== 'active').length;
      
      setTeamMembers(members);
      setStats({
        totalMembers: members.length,
        activeToday,
        clockedIn,
        onLeave,
      });
      
      console.log('✅ Team data loaded successfully');
      console.log(`📊 Stats: ${members.length} total, ${clockedIn} clocked in, ${activeToday} active today`);
      
    } catch (error) {
      console.error('❌ Error loading team data:', error);
      Alert.alert('Error', 'Failed to load team data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTeamData();
  };

  const getStatusColor = (member: TeamMember) => {
    if (member.clockedIn) return COLORS.success;
    if (member.shiftsToday > 0) return COLORS.warning;
    return COLORS.text.secondary;
  };

  const getStatusText = (member: TeamMember) => {
    if (member.clockedIn) return 'Clocked In';
    if (member.shiftsToday > 0) return 'Scheduled';
    return 'Off Duty';
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
        <Text style={styles.title}>Team Overview</Text>
        <Text style={styles.subtitle}>{stats.totalMembers} team members</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: COLORS.success + '15' }]}>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
          <Text style={styles.statValue}>{stats.clockedIn}</Text>
          <Text style={styles.statLabel}>Clocked In</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: COLORS.warning + '15' }]}>
          <Ionicons name="calendar" size={24} color={COLORS.warning} />
          <Text style={styles.statValue}>{stats.activeToday}</Text>
          <Text style={styles.statLabel}>Active Today</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: COLORS.error + '15' }]}>
          <Ionicons name="airplane" size={24} color={COLORS.error} />
          <Text style={styles.statValue}>{stats.onLeave}</Text>
          <Text style={styles.statLabel}>On Leave</Text>
        </View>
      </View>

      {/* Team Members List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Members</Text>
        
        {teamMembers.map((member) => (
          <TouchableOpacity key={member.id} style={styles.memberCard}>
            <View style={[styles.memberAvatar, { backgroundColor: member.clockedIn ? COLORS.success : COLORS.primary }]}>
              <Text style={styles.avatarText}>
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>
                {member.roles.join(', ')}
              </Text>
              <View style={styles.memberStats}>
                <View style={styles.memberStat}>
                  <Ionicons name="time-outline" size={14} color={COLORS.text.secondary} />
                  <Text style={styles.memberStatText}>
                    {member.hoursThisWeek}h this week
                  </Text>
                </View>
                {member.shiftsToday > 0 && (
                  <View style={[styles.memberStat, { marginLeft: SPACING.sm }]}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.text.secondary} />
                    <Text style={styles.memberStatText}>
                      {member.shiftsToday} shift{member.shiftsToday > 1 ? 's' : ''} today
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.memberStatus}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: getStatusColor(member) }
                ]} 
              />
              <Text style={[styles.statusText, { color: getStatusColor(member) }]}>
                {getStatusText(member)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {teamMembers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={COLORS.text.secondary} />
            <Text style={styles.emptyText}>No team members found</Text>
            <Text style={styles.emptySubtext}>Team members will appear here once added</Text>
          </View>
        )}
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
  statsRow: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  memberCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    alignItems: 'center',
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  memberInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  memberName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  memberRole: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  memberStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  memberStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberStatText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
  },
  memberStatus: {
    alignItems: 'flex-end',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    padding: SPACING.xl,
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
    marginTop: 4,
  },
});

export default TeamOverviewScreen;