import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/colors';

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'onboarding' | 'contracts' | 'hr' | 'payroll';
}

const DocumentGenerationScreen: React.FC = () => {
  const templates: DocumentTemplate[] = [
    {
      id: 'employment_contract',
      title: 'Employment Contract',
      description: 'Standard employment agreement',
      icon: 'document-text',
      category: 'contracts',
    },
    {
      id: 'offer_letter',
      title: 'Offer Letter',
      description: 'Job offer letter template',
      icon: 'mail',
      category: 'onboarding',
    },
    {
      id: 'onboarding_packet',
      title: 'Onboarding Packet',
      description: 'Complete onboarding documents',
      icon: 'folder',
      category: 'onboarding',
    },
    {
      id: 'performance_review',
      title: 'Performance Review',
      description: 'Employee evaluation form',
      icon: 'star',
      category: 'hr',
    },
    {
      id: 'termination_letter',
      title: 'Termination Letter',
      description: 'Employment termination notice',
      icon: 'close-circle',
      category: 'hr',
    },
    {
      id: 'payslip_batch',
      title: 'Payslip Batch',
      description: 'Generate monthly payslips',
      icon: 'card',
      category: 'payroll',
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'contracts', label: 'Contracts' },
    { id: 'hr', label: 'HR Documents' },
    { id: 'payroll', label: 'Payroll' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleGenerateDocument = (template: DocumentTemplate) => {
    Alert.alert(
      'Generate Document',
      `Create ${template.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            // TODO: Implement document generation
            Alert.alert('Success', `${template.title} will be generated`);
          },
        },
      ]
    );
  };

  const getIconColor = (category: string): string => {
    switch (category) {
      case 'onboarding':
        return COLORS.primary;
      case 'contracts':
        return COLORS.secondary;
      case 'hr':
        return COLORS.success;
      case 'payroll':
        return COLORS.warning;
      default:
        return COLORS.gray[500];
    }
  };

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterChip,
                  selectedCategory === category.id && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === category.id && styles.filterChipTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Document Templates */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'All Templates' : categories.find(c => c.id === selectedCategory)?.label}
        </Text>

        <View style={styles.templatesGrid}>
          {filteredTemplates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={styles.templateCard}
              onPress={() => handleGenerateDocument(template)}
            >
              <View
                style={[
                  styles.templateIcon,
                  { backgroundColor: `${getIconColor(template.category)}15` },
                ]}
              >
                <Ionicons
                  name={template.icon as any}
                  size={32}
                  color={getIconColor(template.category)}
                />
              </View>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
              
              <TouchableOpacity
                style={styles.generateButton}
                onPress={() => handleGenerateDocument(template)}
              >
                <Text style={styles.generateButtonText}>Generate</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterSection: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  templatesGrid: {
    gap: SPACING.md,
  },
  templateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  templateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  templateTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  templateDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  generateButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
});

export default DocumentGenerationScreen;