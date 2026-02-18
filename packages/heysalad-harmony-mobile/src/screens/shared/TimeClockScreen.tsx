// src/screens/shared/TimeClockScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import LoadingScreen from './LoadingScreen';

interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  clockIn: Date;
  clockOut?: Date;
  clockInLocation: {
    latitude: number;
    longitude: number;
  };
  clockOutLocation?: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'completed';
}

const TimeClockScreen: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processingClock, setProcessingClock] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([]);
  const [locationPermission, setLocationPermission] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  useEffect(() => {
    initializeScreen();
  }, []);

  // Real-time clock update every second when clocked in
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second for smooth timer

    return () => clearInterval(interval);
  }, []);

  const initializeScreen = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');

      if (status === 'granted') {
        await getCurrentLocation();
      }

      await loadActiveTimeEntry();
      await loadRecentEntries();
    } catch (error) {
      console.error('Error in initialization:', error);
      Alert.alert('Error', 'Failed to initialize time clock');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addresses.length > 0) {
          const addr = addresses[0];
          const addressString = [addr.street, addr.city, addr.region]
            .filter(Boolean)
            .join(', ');

          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            address: addressString || 'Location detected',
          });
        } else {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            address: 'Location detected',
          });
        }
      } catch (geocodeError) {
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setCurrentLocation(null);
    }
  };

  const loadActiveTimeEntry = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'timeEntries'),
        where('userId', '==', user.uid),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const entryDoc = snapshot.docs[0];
        const data = entryDoc.data();
        setCurrentEntry({
          id: entryDoc.id,
          userId: data.userId,
          userName: data.userName,
          userRole: data.userRole,
          clockIn: data.clockIn.toDate(),
          clockInLocation: data.clockInLocation,
          clockOutLocation: data.clockOutLocation,
          status: data.status,
        });
      }
    } catch (error) {
      console.error('Error loading active entry:', error);
    }
  };

  const loadRecentEntries = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'timeEntries'),
        where('userId', '==', user.uid),
        where('status', '==', 'completed'),
        orderBy('clockOut', 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(q);

      const entries = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          userRole: data.userRole,
          clockIn: data.clockIn.toDate(),
          clockOut: data.clockOut?.toDate(),
          clockInLocation: data.clockInLocation,
          clockOutLocation: data.clockOutLocation,
          status: data.status,
        } as TimeEntry;
      });

      setRecentEntries(entries);
    } catch (error) {
      console.error('Error loading recent entries:', error);
    }
  };

  const handleClockIn = async () => {
    if (!locationPermission) {
      Alert.alert(
        'Location Required',
        'Please enable location services to track your work location',
        [
          {
            text: 'Enable',
            onPress: async () => {
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status === 'granted') {
                setLocationPermission(true);
                await getCurrentLocation();
              }
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    setProcessingClock(true);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const timeEntry = {
        userId: user!.uid,
        userName: user!.displayName || user!.email || 'Unknown User',
        userRole: user!.activeRole || 'Unknown Role',
        clockIn: Timestamp.now(),
        clockInLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        status: 'active',
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'timeEntries'), timeEntry);

      setCurrentEntry({
        id: docRef.id,
        userId: user!.uid,
        userName: user!.displayName || user!.email || 'Unknown User',
        userRole: user!.activeRole || 'Unknown Role',
        clockIn: new Date(),
        clockInLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        status: 'active',
      });

      Alert.alert('Clocked In! 🎉', 'Your shift has started. Have a great day!');
    } catch (error) {
      console.error('Error clocking in:', error);
      Alert.alert('Error', 'Failed to clock in. Please try again.');
    } finally {
      setProcessingClock(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentEntry) return;

    const duration = formatDuration(currentEntry.clockIn);

    Alert.alert(
      'End Shift?',
      `You've worked for ${duration}. Ready to clock out?`,
      [
        { text: 'Not Yet', style: 'cancel' },
        {
          text: 'Clock Out',
          style: 'destructive',
          onPress: async () => {
            setProcessingClock(true);

            try {
              const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
              });

              const entryRef = doc(db, 'timeEntries', currentEntry.id);
              await updateDoc(entryRef, {
                clockOut: Timestamp.now(),
                status: 'completed',
                clockOutLocation: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
              });

              setCurrentEntry(null);
              await loadRecentEntries(); // Refresh history
              
              Alert.alert('Shift Ended! 👏', `Great work! You completed ${duration} today.`);
            } catch (error) {
              console.error('Error clocking out:', error);
              Alert.alert('Error', 'Failed to clock out. Please try again.');
            } finally {
              setProcessingClock(false);
            }
          },
        },
      ]
    );
  };

  const formatDuration = (startTime: Date): string => {
    const diff = currentTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDurationSimple = (startTime: Date, endTime: Date): string => {
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const isClockedIn = currentEntry !== null;

  return (
    <ScrollView style={styles.container}>
      {/* Header Status */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isClockedIn ? styles.statusActive : styles.statusInactive]} />
          <Text style={styles.statusText}>
            {isClockedIn ? 'On the Clock' : 'Off the Clock'}
          </Text>
        </View>
        {user?.activeRole && (
          <Text style={styles.roleText}>{user.activeRole}</Text>
        )}
      </View>

      {/* Main Clock Display */}
      <View style={styles.clockContainer}>
        {isClockedIn ? (
          <>
            <Ionicons name="timer" size={80} color={COLORS.success} />
            <Text style={styles.clockedInLabel}>Started at {formatTime(currentEntry.clockIn)}</Text>
            
            {/* Live Timer */}
            <View style={styles.timerDisplay}>
              <Text style={styles.timerText}>{formatDuration(currentEntry.clockIn)}</Text>
            </View>
            
            <Text style={styles.timerSubtext}>Time worked today</Text>
          </>
        ) : (
          <>
            <Ionicons name="time-outline" size={80} color={COLORS.gray[400]} />
            <Text style={styles.notClockedText}>Ready to start your shift?</Text>
            <Text style={styles.notClockedSubtext}>Tap the button below to clock in</Text>
          </>
        )}
      </View>

      {/* Location Info */}
      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Ionicons name="location" size={24} color={COLORS.primary} />
          <Text style={styles.locationTitle}>
            {isClockedIn ? 'Clock In Location' : 'Current Location'}
          </Text>
        </View>

        {locationPermission ? (
          <>
            {isClockedIn && currentEntry.clockInLocation ? (
              <Text style={styles.locationText}>
                📍 {currentEntry.clockInLocation.latitude.toFixed(4)}, {currentEntry.clockInLocation.longitude.toFixed(4)}
              </Text>
            ) : currentLocation ? (
              <>
                <Text style={styles.locationText}>
                  {currentLocation.address || 'Location detected'}
                </Text>
                <Text style={styles.coordsText}>
                  {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </Text>
              </>
            ) : (
              <TouchableOpacity onPress={getCurrentLocation} style={styles.refreshButton}>
                <Ionicons name="refresh" size={16} color={COLORS.primary} />
                <Text style={styles.refreshText}>Get Location</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View>
            <Text style={styles.permissionText}>
              Location permission is required to track your work location
            </Text>
            <TouchableOpacity 
              style={styles.enableButton}
              onPress={async () => {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                  setLocationPermission(true);
                  await getCurrentLocation();
                }
              }}
            >
              <Text style={styles.enableButtonText}>Enable Location</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isClockedIn ? styles.clockOutButton : styles.clockInButton,
            processingClock && styles.buttonDisabled,
          ]}
          onPress={isClockedIn ? handleClockOut : handleClockIn}
          disabled={processingClock}
        >
          {processingClock ? (
            <ActivityIndicator color={COLORS.white} size="large" />
          ) : (
            <>
              <Ionicons
                name={isClockedIn ? 'stop-circle' : 'play-circle'}
                size={32}
                color={COLORS.white}
              />
              <Text style={styles.actionButtonText}>
                {isClockedIn ? 'End Shift' : 'Start Shift'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent Shifts History */}
      {recentEntries.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Shifts</Text>
          {recentEntries.map((entry) => (
            <View key={entry.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{formatDate(entry.clockIn)}</Text>
                <View style={styles.durationBadge}>
                  <Ionicons name="time" size={14} color={COLORS.primary} />
                  <Text style={styles.durationBadgeText}>
                    {entry.clockOut ? formatDurationSimple(entry.clockIn, entry.clockOut) : 'In progress'}
                  </Text>
                </View>
              </View>
              <View style={styles.historyTimes}>
                <View style={styles.historyTimeItem}>
                  <Ionicons name="enter" size={16} color={COLORS.success} />
                  <Text style={styles.historyTimeText}>{formatTime(entry.clockIn)}</Text>
                </View>
                {entry.clockOut && (
                  <>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.gray[400]} />
                    <View style={styles.historyTimeItem}>
                      <Ionicons name="exit" size={16} color={COLORS.error} />
                      <Text style={styles.historyTimeText}>{formatTime(entry.clockOut)}</Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Info Footer */}
      <View style={styles.footer}>
        <Ionicons name="information-circle-outline" size={20} color={COLORS.text.secondary} />
        <Text style={styles.footerText}>
          {isClockedIn 
            ? 'Tap "End Shift" when you\'re done working to complete your timesheet' 
            : 'Your location and time will be recorded automatically'}
        </Text>
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
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  statusActive: {
    backgroundColor: COLORS.success,
  },
  statusInactive: {
    backgroundColor: COLORS.gray[400],
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  roleText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  clockedInLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },
  timerDisplay: {
    backgroundColor: `${COLORS.success}10`,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: 20,
    marginTop: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  timerText: {
    fontSize: 40,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.success,
    fontVariant: ['tabular-nums'],
  },
  timerSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },
  notClockedText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
  },
  notClockedSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  locationCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  locationTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  locationText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  coordsText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  permissionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  enableButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  enableButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  refreshText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  actionContainer: {
    padding: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    borderRadius: 16,
    gap: SPACING.md,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  clockInButton: {
    backgroundColor: COLORS.success,
  },
  clockOutButton: {
    backgroundColor: COLORS.error,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
  },
  historySection: {
    padding: SPACING.lg,
  },
  historyTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  historyCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  historyDate: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationBadgeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  historyTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  historyTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyTimeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  footerText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default TimeClockScreen;