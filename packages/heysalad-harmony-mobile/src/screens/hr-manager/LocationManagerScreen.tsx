import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { db } from '../../services/firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import LoadingScreen from '../shared/LoadingScreen';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: Date;
}

const LocationManagerScreen: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    coordinates: {
      latitude: 51.5074,
      longitude: -0.1278,
    },
  });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const locationsRef = collection(db, 'locations');
      const snapshot = await getDocs(locationsRef);
      const loadedLocations: Location[] = [];
      
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        loadedLocations.push({
          id: docSnap.id,
          name: data.name,
          address: data.address,
          city: data.city,
          postcode: data.postcode,
          country: data.country,
          latitude: data.latitude || 51.5074,
          longitude: data.longitude || -0.1278,
          isActive: data.isActive ?? true,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      
      setLocations(loadedLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      Alert.alert('Error', 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    if (!newLocation.name || !newLocation.address || !newLocation.city || !newLocation.postcode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const locationData = {
        name: newLocation.name.trim(),
        address: newLocation.address.trim(),
        city: newLocation.city.trim(),
        postcode: newLocation.postcode.trim().toUpperCase(),
        country: newLocation.country,
        latitude: newLocation.coordinates.latitude,
        longitude: newLocation.coordinates.longitude,
        isActive: true,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'locations'), locationData);
      
      Alert.alert('Success', 'Location added successfully!');
      setShowAddModal(false);
      setNewLocation({
        name: '',
        address: '',
        city: '',
        postcode: '',
        country: 'United Kingdom',
        coordinates: {
          latitude: 51.5074,
          longitude: -0.1278,
        },
      });
      loadLocations();
    } catch (error) {
      console.error('Error adding location:', error);
      Alert.alert('Error', 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId: string, locationName: string) => {
    Alert.alert(
      'Delete Location',
      `Are you sure you want to delete ${locationName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'locations', locationId));
              Alert.alert('Success', 'Location deleted');
              loadLocations();
            } catch (error) {
              console.error('Error deleting location:', error);
              Alert.alert('Error', 'Failed to delete location');
            }
          },
        },
      ]
    );
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    
    setNewLocation({
      ...newLocation,
      coordinates: { latitude, longitude },
    });

    // Reverse geocode to get address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      
      if (data.address) {
        setNewLocation({
          ...newLocation,
          coordinates: { latitude, longitude },
          address: data.address.road || data.address.suburb || '',
          city: data.address.city || data.address.town || data.address.village || '',
          postcode: data.address.postcode || '',
          country: data.address.country || 'United Kingdom',
        });
      }
    } catch (error) {
      console.log('Geocoding error:', error);
      // Just update coordinates if geocoding fails
    }
  };

  if (loading && !showAddModal) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Manage Locations</Text>
        <Text style={styles.subtitle}>Company warehouses and offices</Text>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={20} color={COLORS.info} />
        <Text style={styles.infoText}>
          Locations are used for employee assignments and GPS verification
        </Text>
      </View>

      {/* Add Location Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add-circle" size={24} color={COLORS.white} />
        <Text style={styles.addButtonText}>Add New Location</Text>
      </TouchableOpacity>

      {/* Locations List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {locations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color={COLORS.gray[300]} />
            <Text style={styles.emptyStateText}>No locations yet</Text>
            <Text style={styles.emptyStateSubtext}>Add your first warehouse or office</Text>
          </View>
        ) : (
          locations.map((location) => (
            <View key={location.id} style={styles.locationCard}>
              {/* Map Preview */}
              <MapView
                style={styles.mapPreview}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                />
              </MapView>

              {/* Location Details */}
              <View style={styles.locationDetails}>
                <View style={styles.locationHeader}>
                  <View style={styles.locationIcon}>
                    <Ionicons name="location" size={24} color={COLORS.primary} />
                  </View>
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{location.name}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="navigate" size={14} color={COLORS.text.secondary} />
                      <Text style={styles.locationAddress}>{location.address}</Text>
                    </View>
                    <View style={styles.locationRow}>
                      <Ionicons name="business" size={14} color={COLORS.text.secondary} />
                      <Text style={styles.locationCity}>
                        {location.city}, {location.postcode}
                      </Text>
                    </View>
                    <View style={styles.locationRow}>
                      <Ionicons name="flag" size={14} color={COLORS.text.secondary} />
                      <Text style={styles.locationCountry}>{location.country}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.locationActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Edit', 'Edit functionality coming soon')}
                  >
                    <Ionicons name="pencil" size={18} color={COLORS.primary} />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteLocation(location.id, location.name)}
                  >
                    <Ionicons name="trash" size={18} color={COLORS.error} />
                    <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.coordinatesDisplay}>
                  <Ionicons name="pin" size={14} color={COLORS.text.secondary} />
                  <Text style={styles.coordinatesText}>
                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Location Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Location</Text>
            <TouchableOpacity onPress={handleAddLocation}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Interactive Map */}
            <Text style={styles.label}>Tap map to set location</Text>
            {loading ? (
              <View style={styles.mapLoadingContainer}>
                <Text style={styles.mapLoadingText}>Saving location...</Text>
              </View>
            ) : (
              <MapView
                style={styles.mapFull}
                initialRegion={{
                  latitude: newLocation.coordinates.latitude,
                  longitude: newLocation.coordinates.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                onPress={handleMapPress}
              >
                <Marker
                  coordinate={newLocation.coordinates}
                  draggable
                  onDragEnd={handleMapPress}
                />
              </MapView>
            )}

            <View style={styles.coordsDisplay}>
              <Text style={styles.coordsLabel}>Selected Coordinates:</Text>
              <Text style={styles.coordsValue}>
                {newLocation.coordinates.latitude.toFixed(6)}, {newLocation.coordinates.longitude.toFixed(6)}
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., London Distribution Center"
                placeholderTextColor={COLORS.gray[400]}
                value={newLocation.name}
                onChangeText={(text) => setNewLocation({ ...newLocation, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Street Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 123 High Street"
                placeholderTextColor={COLORS.gray[400]}
                value={newLocation.address}
                onChangeText={(text) => setNewLocation({ ...newLocation, address: text })}
                multiline
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., London"
                placeholderTextColor={COLORS.gray[400]}
                value={newLocation.city}
                onChangeText={(text) => setNewLocation({ ...newLocation, city: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Postcode *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., SW1A 1AA"
                placeholderTextColor={COLORS.gray[400]}
                value={newLocation.postcode}
                onChangeText={(text) => setNewLocation({ ...newLocation, postcode: text })}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Country *</Text>
              <TextInput
                style={styles.input}
                placeholder="United Kingdom"
                placeholderTextColor={COLORS.gray[400]}
                value={newLocation.country}
                onChangeText={(text) => setNewLocation({ ...newLocation, country: text })}
              />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info + '15',
    padding: SPACING.md,
    margin: SPACING.md,
    borderRadius: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.info,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    marginLeft: SPACING.xs,
  },
  scrollView: {
    flex: 1,
    padding: SPACING.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
  },
  emptyStateSubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  locationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPreview: {
    height: 150,
    width: '100%',
  },
  locationDetails: {
    padding: SPACING.md,
  },
  locationHeader: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationAddress: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    flex: 1,
    marginLeft: 4,
  },
  locationCity: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  locationCountry: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    marginLeft: 4,
  },
  locationActions: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SPACING.xs,
  },
  actionButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
    marginLeft: 4,
  },
  deleteButton: {
    borderColor: COLORS.error,
    marginRight: 0,
    marginLeft: SPACING.xs,
  },
  deleteButtonText: {
    color: COLORS.error,
  },
  coordinatesDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  coordinatesText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    fontFamily: 'monospace',
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  cancelButton: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.secondary,
  },
  saveButton: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  mapFull: {
    height: 250,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  mapLoadingContainer: {
    height: 250,
    borderRadius: 12,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  mapLoadingText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  coordsDisplay: {
    backgroundColor: COLORS.primary + '15',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  coordsLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  coordsValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontFamily: 'monospace',
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    backgroundColor: COLORS.white,
  },
});

export default LocationManagerScreen;