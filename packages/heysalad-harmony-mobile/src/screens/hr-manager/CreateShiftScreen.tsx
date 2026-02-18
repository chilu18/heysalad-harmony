import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase/config';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateShiftScreen: React.FC = () => {
  const navigation = useNavigation();
  const [employees, setEmployees] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '17:00',
    position: '',
    warehouseId: 'Berlin Warehouse',
    notes: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('status', '==', 'active')
      );
      const snapshot = await getDocs(usersQuery);
      const employeeList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeList);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleCreateShift = async () => {
    if (!formData.userId || !formData.position) {
      Alert.alert('Error', 'Please select an employee and enter a position');
      return;
    }

    try {
      await addDoc(collection(db, 'shifts'), {
        userId: formData.userId,
        date: Timestamp.fromDate(formData.date),
        startTime: formData.startTime,
        endTime: formData.endTime,
        position: formData.position,
        warehouseId: formData.warehouseId,
        status: 'scheduled',
        notes: formData.notes,
        createdAt: Timestamp.now(),
      });

      Alert.alert('Success', 'Shift created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error creating shift:', error);
      Alert.alert('Error', 'Failed to create shift');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Shift Details</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Employee *</Text>
          <View style={styles.pickerContainer}>
            {employees.map((employee) => (
              <TouchableOpacity
                key={employee.id}
                style={[
                  styles.employeeChip,
                  formData.userId === employee.id && styles.employeeChipActive,
                ]}
                onPress={() => setFormData({ ...formData, userId: employee.id })}
              >
                <Text
                  style={[
                    styles.employeeChipText,
                    formData.userId === employee.id && styles.employeeChipTextActive,
                  ]}
                >
                  {employee.firstName} {employee.lastName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.text.secondary} />
            <Text style={styles.dateButtonText}>
              {formData.date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <View style={styles.timeRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.sm }]}>
            <Text style={styles.label}>Start Time *</Text>
            <TextInput
              style={styles.input}
              value={formData.startTime}
              onChangeText={(text) => setFormData({ ...formData, startTime: text })}
              placeholder="09:00"
              placeholderTextColor={COLORS.gray[400]}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}>
            <Text style={styles.label}>End Time *</Text>
            <TextInput
              style={styles.input}
              value={formData.endTime}
              onChangeText={(text) => setFormData({ ...formData, endTime: text })}
              placeholder="17:00"
              placeholderTextColor={COLORS.gray[400]}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Position *</Text>
          <TextInput
            style={styles.input}
            value={formData.position}
            onChangeText={(text) => setFormData({ ...formData, position: text })}
            placeholder="e.g., Warehouse Associate, Forklift Operator"
            placeholderTextColor={COLORS.gray[400]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            value={formData.warehouseId}
            onChangeText={(text) => setFormData({ ...formData, warehouseId: text })}
            placeholder="Berlin Warehouse"
            placeholderTextColor={COLORS.gray[400]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Additional notes or instructions"
            placeholderTextColor={COLORS.gray[400]}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleCreateShift}>
          <Text style={styles.submitButtonText}>Create Shift</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.text.secondary,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    gap: SPACING.sm,
  },
  employeeChip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  employeeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  employeeChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  employeeChipTextActive: {
    color: COLORS.white,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  dateButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  timeRow: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});

export default CreateShiftScreen;