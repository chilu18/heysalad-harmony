import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { db } from '../../services/firebase/config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import LoadingScreen from '../shared/LoadingScreen';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
}

const AddEmployeeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Warehouse Staff' as 'Warehouse Staff' | 'HR Manager' | 'Operations Manager',
    department: 'Warehouse',
    locationId: '',
    locationName: '',
  });

  const loadLocations = useCallback(async () => {
    setLoadingLocations(true);
    try {
      const locationsRef = collection(db, 'locations');
      const snapshot = await getDocs(locationsRef);
      const loadedLocations: Location[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        loadedLocations.push({
          id: doc.id,
          name: data.name,
          address: data.address,
          city: data.city,
        });
      });
      
      setLocations(loadedLocations);
    } catch (error) {
      console.error('Error loading locations:', error);
      Alert.alert('Error', 'Failed to load locations');
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLocations();
    }, [loadLocations])
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(\+44|0)[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Validation Error', 'Please enter first and last name');
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (!validatePhone(formData.phone)) {
      Alert.alert('Validation Error', 'Please enter a valid UK phone number');
      return;
    }

    if (!formData.locationId) {
      Alert.alert('Validation Error', 'Please select a location');
      return;
    }

    try {
      setLoading(true);

      // Check if email already exists
      const usersRef = collection(db, 'users');
      const emailQuery = query(usersRef, where('email', '==', formData.email.toLowerCase()));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        Alert.alert('Error', 'An employee with this email already exists');
        setLoading(false);
        return;
      }

      // Create employee
      const tempPassword = 'Bereit2024!';
      const employeeData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\s/g, ''),
        role: formData.role,
        department: formData.department,
        locationId: formData.locationId,
        locationName: formData.locationName,
        status: 'active',
        tempPassword: tempPassword, // In production, send via email
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'users'), employeeData);

      Alert.alert(
        'Success',
        `Employee added successfully!\n\nTemporary Password: ${tempPassword}\n\nPlease share this with the employee securely.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding employee:', error);
      Alert.alert('Error', 'Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingLocations) {
    return <LoadingScreen message="Loading locations..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add New Employee</Text>
        <Text style={styles.subtitle}>Fill in employee details</Text>
      </View>

      {/* Info Box */}
      {locations.length === 0 && (
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={20} color={COLORS.warning} />
          <View style={styles.warningContent}>
            <Text style={styles.warningText}>
              No locations found! Please add a location first.
            </Text>
            <TouchableOpacity
              style={styles.warningButton}
              onPress={() => navigation.navigate('LocationManager' as never)}
            >
              <Text style={styles.warningButtonText}>Add Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              placeholderTextColor={COLORS.gray[400]}
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Smith"
              placeholderTextColor={COLORS.gray[400]}
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="john.smith@example.com"
              placeholderTextColor={COLORS.gray[400]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="+44 7700 900000"
              placeholderTextColor={COLORS.gray[400]}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Role & Department */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Role & Department</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role *</Text>
            <View style={styles.roleGrid}>
              {['Warehouse Staff', 'HR Manager', 'Operations Manager'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    formData.role === role && styles.roleOptionSelected,
                  ]}
                  onPress={() =>
                    setFormData({
                      ...formData,
                      role: role as 'Warehouse Staff' | 'HR Manager' | 'Operations Manager',
                    })
                  }
                >
                  <Ionicons
                    name={
                      role === 'Warehouse Staff'
                        ? 'cube'
                        : role === 'HR Manager'
                        ? 'people'
                        : 'bar-chart'
                    }
                    size={24}
                    color={formData.role === role ? COLORS.white : COLORS.primary}
                  />
                  <Text
                    style={[
                      styles.roleOptionText,
                      formData.role === role && styles.roleOptionTextSelected,
                    ]}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department *</Text>
            <View style={styles.departmentGrid}>
              {['Warehouse', 'Logistics', 'Administration', 'Operations'].map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={[
                    styles.departmentOption,
                    formData.department === dept && styles.departmentOptionSelected,
                  ]}
                  onPress={() => setFormData({ ...formData, department: dept })}
                >
                  <Text
                    style={[
                      styles.departmentText,
                      formData.department === dept && styles.departmentTextSelected,
                    ]}
                  >
                    {dept}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, styles.sectionTitleNoMargin]}>Work Location</Text>
            <TouchableOpacity
              style={styles.addLocationButton}
              onPress={() => navigation.navigate('LocationManager' as never)}
            >
              <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
              <Text style={styles.addLocationButtonText}>New Location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Primary Location *</Text>
            {locations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[
                  styles.locationOption,
                  formData.locationId === location.id && styles.locationOptionSelected,
                ]}
                onPress={() =>
                  setFormData({
                    ...formData,
                    locationId: location.id,
                    locationName: location.name,
                  })
                }
              >
                <View style={styles.locationInfo}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={
                      formData.locationId === location.id ? COLORS.primary : COLORS.gray[400]
                    }
                  />
                  <View style={styles.locationDetails}>
                    <Text
                      style={[
                        styles.locationName,
                        formData.locationId === location.id && styles.locationNameSelected,
                      ]}
                    >
                      {location.name}
                    </Text>
                    <Text style={styles.locationAddress}>
                      {location.address}, {location.city}
                    </Text>
                  </View>
                </View>
                {formData.locationId === location.id && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading || locations.length === 0}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="person-add" size={20} color={COLORS.white} />
              <Text style={styles.submitButtonText}>Add Employee</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '15',
    padding: SPACING.md,
    margin: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  warningContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  warningText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.warning,
    marginBottom: SPACING.xs,
  },
  warningButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  warningButtonText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  sectionTitleNoMargin: {
    marginBottom: 0,
  },
  addLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addLocationButtonText: {
    marginLeft: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  roleOption: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  roleOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleOptionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  roleOptionTextSelected: {
    color: COLORS.white,
  },
  departmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  departmentOption: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  departmentOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  departmentText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  departmentTextSelected: {
    color: COLORS.white,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  locationOptionSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primary + '10',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationDetails: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  locationName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  locationNameSelected: {
    color: COLORS.primary,
  },
  locationAddress: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  footer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.white,
    marginLeft: SPACING.xs,
  },
});

export default AddEmployeeScreen;
